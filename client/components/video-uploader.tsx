'use client';

import type React from 'react';

import { Button } from '@/components/ui/button';
import { AlertTriangle, Upload, X } from 'lucide-react';
import { useRef, useState } from 'react';

interface VideoUploaderProps {
  onFileSelected?: (file: File | null) => void;
}

export function VideoUploader({ onFileSelected }: VideoUploaderProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const MAX_FILE_SIZE = 100 * 1024 * 1024; // 100MB

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setError(null);

    if (!file) {
      setSelectedFile(null);
      setPreviewUrl(null);
      return;
    }

    if (!file.type.startsWith('video/')) {
      setError('Please select a valid video file');
      setSelectedFile(null);
      setPreviewUrl(null);
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      setError(
        `File size exceeds 100MB limit (${(file.size / (1024 * 1024)).toFixed(
          2,
        )}MB)`,
      );
      setSelectedFile(null);
      setPreviewUrl(null);
      return;
    }

    setSelectedFile(file);
    try {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      if (onFileSelected) {
        onFileSelected(file);
      }
    } catch (error) {
      console.error('Error creating preview URL:', error);
      setError('Could not preview video');
      setPreviewUrl(null);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setError(null);

    const file = e.dataTransfer.files?.[0] || null;

    if (!file) {
      return;
    }

    if (!file.type.startsWith('video/')) {
      setError('Please drop a valid video file');
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      setError(
        `File size exceeds 100MB limit (${(file.size / (1024 * 1024)).toFixed(
          2,
        )}MB)`,
      );
      return;
    }

    setSelectedFile(file);
    try {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      if (onFileSelected) {
        onFileSelected(file);
      }
    } catch (error) {
      console.error('Error creating preview URL:', error);
      setError('Could not preview video');
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const clearSelection = () => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setSelectedFile(null);
    setPreviewUrl(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleVideoError = () => {
    setError(
      'Error loading video preview. The format may not be supported by your browser.',
    );
  };

  return (
    <div className="space-y-4">
      {error && (
        <div className="flex items-center gap-2 p-3 bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-800 rounded-md text-red-600 dark:text-red-400">
          <AlertTriangle className="h-4 w-4" />
          <p className="text-sm">{error}</p>
        </div>
      )}

      {!previewUrl ? (
        <div
          className="border-2 border-dashed rounded-md p-6 flex flex-col items-center justify-center gap-4 bg-muted/50 cursor-pointer"
          onClick={() => fileInputRef.current?.click()}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
        >
          <Upload className="h-10 w-10 text-muted-foreground" />
          <div className="text-center">
            <p className="font-medium">Click to upload or drag and drop</p>
            <p className="text-sm text-muted-foreground">
              MP4, WebM or MOV (max. 100MB)
            </p>
          </div>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="video/mp4,video/webm,video/quicktime"
            className="hidden"
          />
        </div>
      ) : (
        <div className="relative rounded-md overflow-hidden">
          <video
            src={previewUrl}
            controls
            className="w-full aspect-video object-cover"
            onError={handleVideoError}
          />
          <Button
            variant="destructive"
            size="icon"
            className="absolute top-2 right-2"
            onClick={clearSelection}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
}
