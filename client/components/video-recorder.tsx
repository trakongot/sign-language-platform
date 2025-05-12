'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { TranslateSocketAPI } from '@/lib/api';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Progress } from './ui/progress';

type ConnectionStatus = 'disconnected' | 'connecting' | 'connected' | 'error';

export interface VideoRecorderProps {
  onVideoRecorded: (videoUrl: string | null) => void;
  onStreamStateChange: (isStreaming: boolean) => void;
  analysisMode: string;
  activateCamera?: boolean;
  recordingTime: number;
}

export function VideoRecorder({
  onVideoRecorded,
  onStreamStateChange,
  analysisMode,
  activateCamera = false,
  recordingTime,
}: VideoRecorderProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  const [isCapturing, setIsCapturing] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [connectionStatus, setConnectionStatus] =
    useState<ConnectionStatus>('disconnected');
  const [recordingProgress, setRecordingProgress] = useState(0);
  const [hasCameraPermission, setHasCameraPermission] = useState<
    boolean | null
  >(null);
  const [error, setError] = useState<string | null>(null);

  // For tracking recording time
  const recordingStartTimeRef = useRef<number>(0);
  const recordingIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const frameIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Determine the actual recording time based on analysisMode
  const actualRecordingTime =
    analysisMode === 'character' ? 1500 : recordingTime;

  useEffect(() => {
    // Clean up on unmount
    return () => {
      handleReset();
    };
  }, []);

  useEffect(() => {
    // if (
    //   activateCamera &&
    //   !mediaStreamRef.current &&
    //   hasCameraPermission !== false
    // ) {
    //   startCamera();
    // }
    // Optional: Stop camera if the tab becomes inactive? Depends on desired UX.
    // if (!activateCamera && mediaStreamRef.current) {
    //   handleReset(); // Or just stop stream
    // }
  }, [activateCamera, hasCameraPermission]); // Rerun when activation or permission changes

  // Socket connection management
  useEffect(() => {
    if (isCapturing) {
      setConnectionStatus('connecting');

      // Connect to socket server
      const socket = TranslateSocketAPI.connect();

      // Use the socket's 'connect' event through the native socket instance
      if (socket) {
        socket.on('connect', () => {
          setConnectionStatus('connected');
        });
      }

      // Handle successful translation result as connection confirmation
      const handleTranslationResult = () => {
        setConnectionStatus('connected');
      };

      // Handle connection error
      const handleError = () => {
        setConnectionStatus('error');
        stopCapturing();
      };

      // Register socket event handlers
      TranslateSocketAPI.onTranslationResult(handleTranslationResult);
      TranslateSocketAPI.onError(handleError);

      // Cleanup function
      return () => {
        if (socket) {
          socket.off('connect');
          TranslateSocketAPI.disconnect();
          TranslateSocketAPI.offTranslationResult(handleTranslationResult);
          TranslateSocketAPI.offError(handleError);
        }
        stopCapturing();
      };
    } else {
      setConnectionStatus('disconnected');
      TranslateSocketAPI.disconnect();
    }
  }, [isCapturing, analysisMode]);

  // Start camera access
  const startCamera = useCallback(async () => {
    try {
      setError(null);

      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Your browser does not support camera access');
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 640 },
          height: { ideal: 480 },
          facingMode: 'user',
        },
        audio: false,
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        mediaStreamRef.current = stream;
        setHasCameraPermission(true);
      }
    } catch (err) {
      console.error('Error accessing camera:', err);
      setError('Could not access camera. Please check permissions.');
      setHasCameraPermission(false);
    }
  }, []);

  // Capture frame from video and send to server
  const captureFrame = useCallback(() => {
    if (!mediaStreamRef.current || !videoRef.current || !canvasRef.current) {
      return;
    }

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    if (!ctx) return;

    // Set canvas dimensions to match video
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    // Draw the current video frame on the canvas
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Convert canvas to data URL (base64)
    const frameData = canvas.toDataURL('image/jpeg', 0.8);
    // Extract base64 data without prefix
    const base64Data = frameData.replace(/^data:image\/jpeg;base64,/, '');

    // Send frame to socket if connected
    if (connectionStatus === 'connected') {
      TranslateSocketAPI.sendFrame(base64Data, Date.now(), analysisMode);
    }
  }, [connectionStatus, analysisMode]);

  // Start capturing frames and sending to server
  const startCapturing = useCallback(() => {
    if (!mediaStreamRef.current || !canvasRef.current) {
      setError('Camera not initialized. Please refresh and try again.');
      return;
    }

    setIsCapturing(true);
    onStreamStateChange(true);

    // Capture and send frames at regular intervals
    frameIntervalRef.current = setInterval(() => {
      captureFrame();
    }, 100); // 10 fps
  }, [captureFrame, onStreamStateChange]);

  // Stop capturing frames
  const stopCapturing = useCallback(() => {
    if (frameIntervalRef.current) {
      clearInterval(frameIntervalRef.current);
      frameIntervalRef.current = null;
    }

    setIsCapturing(false);
    onStreamStateChange(false);

    // Ensure socket is disconnected
    TranslateSocketAPI.disconnect();
  }, [onStreamStateChange]);

  // Start video recording
  const startRecording = useCallback(() => {
    // Stop live translation if active before recording
    if (isCapturing) {
      stopCapturing();
    }

    // Check for supported MIME type *here*
    const mimeTypes = ['video/webm;codecs=vp9', 'video/webm', 'video/mp4'];
    let supportedMimeType: string | null = null;
    for (const type of mimeTypes) {
      if (MediaRecorder.isTypeSupported(type)) {
        supportedMimeType = type;
        break;
      }
    }

    if (!supportedMimeType) {
      setError(
        'Your browser does not support any required video recording formats (webm/mp4).',
      );
      return; // Stop if no supported format
    }

    if (!mediaStreamRef.current) {
      setError('Camera not initialized or permission denied.');
      return;
    }

    try {
      // Initialize media recorder
      const mediaRecorder = new MediaRecorder(mediaStreamRef.current, {
        mimeType: supportedMimeType, // Use the found supported type
      });

      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      // Handle data available event
      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };

      // Handle recording stop event
      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: supportedMimeType });
        const videoUrl = URL.createObjectURL(blob);
        onVideoRecorded(videoUrl);
        setIsRecording(false);
        setRecordingProgress(0);
      };

      // Start the recorder
      mediaRecorder.start(1000); // 1-second chunks
      setIsRecording(true);

      // Start recording timer
      recordingStartTimeRef.current = Date.now();
      recordingIntervalRef.current = setInterval(() => {
        const elapsedTime = Date.now() - recordingStartTimeRef.current;
        const progress = Math.min(
          (elapsedTime / actualRecordingTime) * 100,
          100,
        );
        setRecordingProgress(progress);

        // Auto-stop recording after max time
        if (elapsedTime >= actualRecordingTime) {
          stopRecording();
        }
      }, 100);
    } catch (err) {
      console.error('Error starting recording:', err);
      setError('Failed to start recording. Please try again.');
    }
  }, [onVideoRecorded, isCapturing, stopCapturing, actualRecordingTime]);

  // Stop video recording
  const stopRecording = useCallback(() => {
    if (
      mediaRecorderRef.current &&
      mediaRecorderRef.current.state !== 'inactive'
    ) {
      mediaRecorderRef.current.stop();
    }

    if (recordingIntervalRef.current) {
      clearInterval(recordingIntervalRef.current);
      recordingIntervalRef.current = null;
    }
  }, []);

  // Reset all states and stop processes
  const handleReset = useCallback(() => {
    // Stop recording if active
    if (isRecording) {
      stopRecording();
    }

    // Stop capturing if active
    if (isCapturing) {
      stopCapturing();
    }

    // Stop and release media stream
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      mediaStreamRef.current = null;
    }

    // Reset video element
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }

    // Clear all intervals
    if (frameIntervalRef.current) {
      clearInterval(frameIntervalRef.current);
      frameIntervalRef.current = null;
    }

    if (recordingIntervalRef.current) {
      clearInterval(recordingIntervalRef.current);
      recordingIntervalRef.current = null;
    }

    // Reset states
    setIsCapturing(false);
    setIsRecording(false);
    setConnectionStatus('disconnected');
    setRecordingProgress(0);
    setError(null); // Also clear any existing errors
    setHasCameraPermission(null); // Reset camera permission when turning off
    onStreamStateChange(false);

    // Ensure socket is disconnected
    TranslateSocketAPI.disconnect();
  }, [
    isCapturing,
    isRecording,
    onStreamStateChange,
    stopCapturing,
    stopRecording,
  ]);

  // Get connection status badge
  const getConnectionBadge = () => {
    switch (connectionStatus) {
      case 'connected':
        return <Badge className="bg-green-500 text-white">Connected</Badge>;
      case 'connecting':
        return <Badge variant="outline">Connecting...</Badge>;
      case 'error':
        return <Badge variant="destructive">Connection Error</Badge>;
      default:
        return <Badge variant="outline">Not Connected</Badge>;
    }
  };

  return (
    <div className="space-y-4">
      {error && (
        <div className="p-4 bg-destructive/10 text-destructive rounded-md">
          {error}
        </div>
      )}

      <div className="relative overflow-hidden rounded-lg border">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="w-full aspect-video object-cover bg-black"
        />

        {isRecording && (
          <div className="absolute top-2 right-2">
            <Badge variant="destructive" className="animate-pulse">
              Recording
            </Badge>
          </div>
        )}

        <canvas ref={canvasRef} className="hidden" />
      </div>
      <Progress value={recordingProgress} className="w-full h-1 to-blue-200" />

      <div className="h-1">
        {isRecording && (
          <p className="text-xs text-muted-foreground text-right">
            Recording: {Math.round(recordingProgress)}%
          </p>
        )}
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          {getConnectionBadge()}
          <span className="text-sm">
            {isCapturing ? 'Live Translation Active' : 'Camera Ready'}
          </span>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {!hasCameraPermission && (
          <Button onClick={startCamera} variant="outline">
            Start Camera
          </Button>
        )}

        {/* {hasCameraPermission && !isCapturing && (
          <Button onClick={startCapturing} variant="default">
            Start Live Translation
          </Button>
        )} */}

        {isCapturing && (
          <Button onClick={stopCapturing} variant="secondary">
            Stop Translation
          </Button>
        )}

        {hasCameraPermission && !isRecording && (
          <Button
            onClick={startRecording}
            variant="outline"
            disabled={isRecording || !mediaStreamRef.current}
          >
            Record Video ({actualRecordingTime / 1000}s)
          </Button>
        )}

        {isRecording && (
          <Button onClick={stopRecording} variant="destructive">
            Stop Recording
          </Button>
        )}

        {hasCameraPermission && (
          <Button onClick={handleReset} variant="outline">
            Turn Off Camera
          </Button>
        )}
      </div>
    </div>
  );
}
