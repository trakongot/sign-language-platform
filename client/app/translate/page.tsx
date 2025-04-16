'use client';

import { TranslationResult } from '@/components/translation-result';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { VideoRecorder } from '@/components/video-recorder';
import { VideoUploader } from '@/components/video-uploader';
import { TranslateAPI, TranslateSocketAPI } from '@/lib/api';
import { useEffect, useState } from 'react';

type AnalysisMode = 'character' | 'word' | 'sentence';

interface TranslationModeOption {
  id: AnalysisMode;
  name: string;
  description: string;
}

export default function TranslatePage() {
  const [activeTab, setActiveTab] = useState('camera');
  const [availableModes, setAvailableModes] = useState<TranslationModeOption[]>(
    [],
  );
  const [analysisMode, setAnalysisMode] = useState<AnalysisMode>('word');
  const [translationResult, setTranslationResult] = useState<string | null>(
    null,
  );
  const [translationConfidence, setTranslationConfidence] = useState<
    number | undefined
  >(undefined);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [uploadedVideoUrl, setUploadedVideoUrl] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isStreaming, setIsStreaming] = useState(false);
  const [cameraRequested, setCameraRequested] = useState(false);

  useEffect(() => {
    const fetchTranslationModes = async () => {
      try {
        const modes: TranslationModeOption[] =
          await TranslateAPI.getTranslationModes();
        setAvailableModes(modes);
        if (modes.length > 0 && !modes.find((m) => m.id === analysisMode)) {
          setAnalysisMode(modes[0].id);
        }
      } catch (err) {
        console.error('Failed to fetch translation modes:', err);
        setError('Could not load analysis modes from the server.');
      }
    };

    fetchTranslationModes();
  }, []);

  useEffect(() => {
    if (activeTab === 'camera' && isStreaming) {
      TranslateSocketAPI.connect();

      const handleResult = (result: any) => {
        if (result && result.text) {
          setTranslationResult(result.text);
          setTranslationConfidence(result.confidence);
          setError(null);
          setIsProcessing(false);
        } else if (result && result.results && result.results.length > 0) {
          setTranslationResult(result.results[0].text);
          setTranslationConfidence(result.results[0].confidence);
          setError(null);
          setIsProcessing(false);
        } else {
          // Optional: Handle cases where result is received but has no text
          // setError("Received invalid translation result format.");
          // setIsProcessing(false);
        }
      };

      const handleError = (err: any) => {
        setError(err?.message || 'An error occurred during translation');
        setIsProcessing(false);
      };

      TranslateSocketAPI.onTranslationResult(handleResult);
      TranslateSocketAPI.onError(handleError);

      setIsProcessing(true);

      return () => {
        TranslateSocketAPI.offTranslationResult(handleResult);
        TranslateSocketAPI.offError(handleError);
        TranslateSocketAPI.disconnect();
      };
    } else if (!isStreaming && activeTab === 'camera') {
      setIsProcessing(false);
    }
  }, [activeTab, isStreaming]);

  // Handler for file upload via VideoUploader
  const handleFileUpload = async (file: File | null) => {
    if (!file) {
      setError('No file selected for upload.');
      return;
    }

    setUploadedFile(file);
    setUploadedVideoUrl(URL.createObjectURL(file));

    setTranslationResult(null);
    setTranslationConfidence(undefined);
    setError(null);
    setIsProcessing(true);

    try {
      // Use the correct API method for file uploads
      const result = await TranslateAPI.uploadAndTranslate(file, analysisMode);

      // Process the response (same structure as /video endpoint)
      if (result && result.results && result.results.length > 0) {
        setTranslationResult(result.results[0].text);
        setTranslationConfidence(result.results[0].confidence);
        setError(null);
      } else {
        setTranslationResult(null);
        setTranslationConfidence(undefined);
        setError('No translation result received from upload.');
      }
    } catch (err: any) {
      console.error('Error uploading and translating video:', err);
      setError(
        err.response?.data?.detail ||
          'Failed to translate the uploaded video. Please try again.',
      );
    } finally {
      setIsProcessing(false);
    }
  };

  // Modified to handle recorded Blob URL correctly
  const processRecordedVideo = async (videoUrl: string) => {
    setTranslationResult(null);
    setTranslationConfidence(undefined);
    setError(null);
    setIsProcessing(true);

    try {
      // 1. Fetch the Blob data from the local URL
      const response = await fetch(videoUrl);
      if (!response.ok) {
        throw new Error(
          `Failed to fetch recorded video blob: ${response.statusText}`,
        );
      }
      const videoBlob = await response.blob();

      // 2. Create a File object from the Blob
      //    Use a generic name and attempt to get the correct MIME type.
      const fileName = `recorded_video.${
        videoBlob.type.split('/')[1] || 'webm'
      }`;
      const videoFile = new File([videoBlob], fileName, {
        type: videoBlob.type || 'video/webm', // Ensure MIME type is set
      });

      // 3. Call uploadAndTranslate with the File object
      const result = await TranslateAPI.uploadAndTranslate(
        videoFile,
        analysisMode,
      );

      // Process the response (same structure as upload)
      if (result && result.results && result.results.length > 0) {
        setTranslationResult(result.results[0].text);
        setTranslationConfidence(result.results[0].confidence);
        setError(null);
      } else {
        setTranslationResult(null);
        setTranslationConfidence(undefined);
        setError('No translation result received for recorded video.');
      }
    } catch (err: any) {
      console.error('Error translating recorded video:', err);
      setError(
        err.response?.data?.detail ||
          'Failed to translate the recorded video. Please try again.',
      );
      // Clean up the blob URL if it exists and an error occurred
      if (videoUrl) {
        URL.revokeObjectURL(videoUrl);
      }
    } finally {
      setIsProcessing(false);
      // Optional: Revoke the object URL after processing to free memory,
      //           but this means you can't replay the recorded video easily.
      // if (videoUrl) { URL.revokeObjectURL(videoUrl); }
    }
  };

  const handleStreamStateChange = (streaming: boolean) => {
    setIsStreaming(streaming);

    if (streaming) {
      setCameraRequested(true);
    }

    if (!streaming) {
      setTranslationResult(null);
      setTranslationConfidence(undefined);
    }
  };

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    setTranslationResult(null);
    setTranslationConfidence(undefined);
    setError(null);

    if (value !== 'camera' && isStreaming) {
      setIsStreaming(false);
    }
    if (value !== 'camera') {
      setCameraRequested(false);
    }
    setIsProcessing(false);
    setError(null);
    setTranslationResult(null);

    if (value !== 'upload') {
      setUploadedFile(null);
      setUploadedVideoUrl(null);
    }
  };

  const handleAnalysisModeChange = (value: string) => {
    const newMode = value as AnalysisMode;
    setAnalysisMode(newMode);
    setTranslationResult(null);
    setTranslationConfidence(undefined);

    if (activeTab === 'upload' && uploadedFile) {
      handleFileUpload(uploadedFile);
    }

    if (isStreaming) {
      TranslateSocketAPI.setAnalysisMode(value);
    }
  };

  return (
    <div className="container mx-auto py-8 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Translate Sign Language</CardTitle>
          <CardDescription>
            Upload a video or use your camera to translate sign language in
            real-time or from a file.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="space-y-4">
            <Tabs defaultValue={activeTab} onValueChange={handleTabChange}>
              <TabsList className="grid w-full grid-cols-2 mb-4">
                <TabsTrigger value="camera">Live Camera</TabsTrigger>
                <TabsTrigger value="upload">Upload Video</TabsTrigger>
              </TabsList>
            </Tabs>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-medium">
                  Analysis Mode
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Select
                  value={analysisMode}
                  onValueChange={handleAnalysisModeChange}
                  disabled={availableModes.length === 0}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select analysis mode" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableModes.length > 0 ? (
                      availableModes.map((mode) => (
                        <SelectItem key={mode.id} value={mode.id}>
                          {mode.name}
                        </SelectItem>
                      ))
                    ) : (
                      <SelectItem value="loading" disabled>
                        Loading modes...
                      </SelectItem>
                    )}
                  </SelectContent>
                </Select>
                {/* {availableModes.find((m) => m.id === analysisMode) && (
                  <p className="text-sm text-muted-foreground mt-2">
                    {
                      availableModes.find((m) => m.id === analysisMode)
                        ?.description
                    }
                  </p>
                )} */}
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t">
            <div className="space-y-6">
              {activeTab === 'camera' && (
                <VideoRecorder
                  activateCamera={activeTab === 'camera' && cameraRequested}
                  onVideoRecorded={(url) => {
                    if (url) {
                      processRecordedVideo(url);
                    }
                  }}
                  onStreamStateChange={handleStreamStateChange}
                  analysisMode={analysisMode}
                />
              )}
              {activeTab === 'upload' && (
                <VideoUploader onFileSelected={handleFileUpload} />
              )}
            </div>

            <div className="space-y-6">
              <TranslationResult
                translatedText={translationResult ?? undefined}
                confidence={translationConfidence}
                error={error}
                isProcessing={isProcessing}
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
