'use client';

import { TranslationResult } from '@/components/translation-result';
import { Button } from '@/components/ui/button';
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

interface AnalysisMode {
  id: string;
  name: string;
  description: string;
}

export default function TranslatePage() {
  const [activeTab, setActiveTab] = useState('camera');
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
  const [analysisModes, setAnalysisModes] = useState<AnalysisMode[]>([]);
  const [selectedMode, setSelectedMode] = useState<string>('word');
  const [selectedRecordingTime, setSelectedRecordingTime] =
    useState<number>(1500); // Default to 1500ms (1.5s)

  useEffect(() => {
    const fetchAndSetModes = async () => {
      let modesToSet: AnalysisMode[] = [];
      try {
        const apiModes = await TranslateAPI.getTranslationModes();
        const charMode = apiModes.find(
          (m: AnalysisMode) => m.id === 'character',
        );
        const wordMode = apiModes.find((m: AnalysisMode) => m.id === 'word');

        if (charMode) modesToSet.push(charMode);
        if (wordMode) modesToSet.push(wordMode);
      } catch (e) {
        console.error('Error fetching translation modes, using fallback:', e);
        // Fallback will be handled below if modesToSet remains empty
      }

      // If after trying API, modesToSet is still empty (API failed or didn't have character/word)
      if (modesToSet.length === 0) {
        console.log('Using fallback analysis modes.');
        modesToSet = [
          {
            id: 'character',
            name: 'Character Analysis',
            description: 'Detect individual characters',
          },
          {
            id: 'word',
            name: 'Word Analysis',
            description: 'Detect complete words',
          },
        ];
      }

      setAnalysisModes(modesToSet);

      // Adjust selectedMode if the current one (e.g. initial 'word') isn't in modesToSet,
      // or if modesToSet is not empty and selectedMode was somehow invalid.
      const currentSelectedModeIsValid = modesToSet.some(
        (m: AnalysisMode) => m.id === selectedMode,
      );
      if (modesToSet.length > 0 && !currentSelectedModeIsValid) {
        setSelectedMode(modesToSet[0].id); // Default to the first mode in the filtered list
      } else if (modesToSet.length === 0) {
        // Should not happen if fallback is used
        setSelectedMode(''); // Clear selection if no modes are available
      }
      // If selectedMode is already 'word' and 'word' is in modesToSet, it remains 'word'.
      // If modesToSet is empty, and selectedMode was 'word', it will be cleared if we enable the line above.
      // Given the fallback, modesToSet should not be empty.
    };

    fetchAndSetModes();
  }, []); // Run once on mount. selectedMode dependency removed to prevent re-fetch on user selection.

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
      const result = await TranslateAPI.uploadAndTranslate(file, selectedMode);

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
        selectedMode,
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

            {/* Analysis Mode Selector - Visible for both tabs */}
            {analysisModes.length > 0 && (
              <div className="mb-4">
                <label
                  htmlFor="analysis-mode-select"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Analysis Mode
                </label>
                <Select value={selectedMode} onValueChange={setSelectedMode}>
                  <SelectTrigger
                    id="analysis-mode-select"
                    className="w-full md:w-[200px]"
                  >
                    {' '}
                    {/* Default width or adjust as needed */}
                    <SelectValue placeholder="Select mode" />
                  </SelectTrigger>
                  <SelectContent>
                    {analysisModes.map((mode) => (
                      <SelectItem key={mode.id} value={mode.id}>
                        {mode.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Recording Time Input - Only for Camera Tab */}
            {activeTab === 'camera' && selectedMode === 'word' && (
              <div className="mb-4 space-y-2">
                <label
                  htmlFor="recording-time-input"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Recording Duration (s)
                </label>
                <div className="flex items-center space-x-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setSelectedRecordingTime(3000)}
                    className={`${
                      selectedRecordingTime === 3000
                        ? 'bg-blue-500 text-white'
                        : 'bg-blue-100 text-blue-500'
                    } hover:bg-blue-600 focus:ring-2 focus:ring-blue-300 rounded-md`}
                  >
                    3s
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setSelectedRecordingTime(1500)}
                    className={`${
                      selectedRecordingTime === 1500
                        ? 'bg-blue-500 text-white'
                        : 'bg-blue-100 text-blue-500'
                    } hover:bg-blue-600 focus:ring-2 focus:ring-blue-300 rounded-md`}
                  >
                    1.5s
                  </Button>
                </div>
              </div>
            )}
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
                  analysisMode={selectedMode}
                  recordingTime={selectedRecordingTime}
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
