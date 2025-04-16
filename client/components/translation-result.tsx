'use client';

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { AlertTriangle, Copy, Loader2, Volume2 } from 'lucide-react';
import { useState } from 'react';

interface TranslationResultProps {
  translatedText?: string | null;
  confidence?: number;
  error?: string | null;
  isProcessing?: boolean;
}

export function TranslationResult({
  translatedText,
  confidence = 0,
  error = null,
  isProcessing = false,
}: TranslationResultProps) {
  const [isCopied, setIsCopied] = useState(false);

  const handleCopyText = () => {
    if (translatedText) {
      navigator.clipboard.writeText(translatedText).then(
        () => {
          setIsCopied(true);
          setTimeout(() => setIsCopied(false), 2000);
        },
        (err) => {
          console.error('Could not copy text: ', err);
        },
      );
    }
  };

  const handleTextToSpeech = () => {
    // Check if translatedText exists and if the speechSynthesis API is supported by the browser
    if (translatedText && 'speechSynthesis' in window) {
      // Create a new SpeechSynthesisUtterance instance with the translated text
      const utterance = new SpeechSynthesisUtterance(translatedText);

      // Set the language to Vietnamese (vi-VN)
      utterance.lang = 'vi-VN'; // Language for Vietnamese

      // Get all available voices and try to find a Vietnamese voice
      const voices = window.speechSynthesis.getVoices();
      const vietnameseVoice = voices.find((voice) => voice.lang === 'vi-VN');

      // If a Vietnamese voice is found, assign it to the utterance
      if (vietnameseVoice) {
        utterance.voice = vietnameseVoice;
      }

      // Start speaking the text
      window.speechSynthesis.speak(utterance);
    }
  };
  return (
    <Card>
      <CardHeader>
        <CardTitle>Translation Result</CardTitle>
        <CardDescription>
          The translated text based on the video input.
        </CardDescription>
      </CardHeader>
      <CardContent className="min-h-[150px]">
        {isProcessing ? (
          <div className="flex items-center justify-center h-full">
            <div className="flex items-center text-muted-foreground">
              <Loader2 className="animate-spin h-5 w-5 mr-3" />
              <span>Processing...</span>
            </div>
          </div>
        ) : error ? (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        ) : translatedText ? (
          <div className="space-y-3">
            <Textarea
              value={translatedText}
              readOnly
              className="min-h-[100px] resize-none text-base"
            />
            {confidence !== undefined && confidence > 0 && (
              <div className="text-sm text-muted-foreground">
                Confidence: {Math.round(confidence * 100)}%
              </div>
            )}
          </div>
        ) : (
          <div className="flex items-center justify-center h-full text-center border rounded-md border-dashed p-4">
            <p className="text-muted-foreground">
              Translation will appear here.
            </p>
          </div>
        )}
      </CardContent>
      {translatedText && !isProcessing && !error && (
        <CardFooter className="flex flex-wrap gap-2 pt-4 border-t">
          <Button variant="outline" size="sm" onClick={handleCopyText}>
            <Copy className="mr-2 h-4 w-4" />
            {isCopied ? 'Copied!' : 'Copy'}
          </Button>
          <Button variant="outline" size="sm" onClick={handleTextToSpeech}>
            <Volume2 className="mr-2 h-4 w-4" />
            Speak
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}
