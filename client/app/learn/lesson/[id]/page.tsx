'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { VideoRecorder } from '@/components/video-recorder';
import { LearnAPI } from '@/lib/api';
import { Award, ChevronLeft, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';

interface LessonStep {
  id: number;
  title: string;
  completed: boolean;
}

interface Lesson {
  id: string;
  title: string;
  description: string;
  courseId: string;
  content: LessonContent[];
  videoUrl?: string;
}

interface LessonContent {
  type: 'text' | 'video' | 'practice' | 'quiz' | 'exercise';
  title?: string;
  content?: string;
  videoUrl?: string;
  url?: string;
  duration?: string;
  instructions?: string;
  items?: string[];
}

export default function LessonPage({ params }: { params: { id: string } }) {
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeContentIndex, setActiveContentIndex] = useState(0);
  const [recordedVideoUrl, setRecordedVideoUrl] = useState<string | null>(null);
  const [completed, setCompleted] = useState(false);

  // Function to check if a URL is a YouTube URL
  const isYouTubeUrl = (url?: string): boolean => {
    if (!url) return false;
    return url.includes('youtube.com') || url.includes('youtu.be');
  };

  useEffect(() => {
    async function fetchLesson() {
      try {
        setLoading(true);
        setError(null);

        // Fetch lesson data from the API
        const lessonId = parseInt(params.id, 10);
        const lessonData = await LearnAPI.getLessonDetail(lessonId);

        // Transform API response to match our component's expected structure
        const formattedLesson: Lesson = {
          id: params.id,
          title: lessonData.lesson.title,
          description: lessonData.lesson.description,
          courseId: '1', // This would need to come from the API
          content: lessonData.lesson.content,
          videoUrl: lessonData.lesson.videoUrl,
        };

        setLesson(formattedLesson);
      } catch (err) {
        console.error('Failed to fetch lesson:', err);
        setError('Failed to load lesson data. Using mock data as fallback.');
      } finally {
        setLoading(false);
      }
    }

    fetchLesson();
  }, [params.id]);

  const handleComplete = async () => {
    if (!lesson) return;

    try {
      // Update the lesson progress to 100%
      const lessonId = parseInt(params.id, 10);
      await LearnAPI.updateProgress(lessonId, 100);
      setCompleted(true);
    } catch (err) {
      console.error('Failed to mark lesson as complete:', err);
    }
  };

  const handleVideoRecordingComplete = (videoUrl: string) => {
    setRecordedVideoUrl(videoUrl);
  };

  const handleNextContent = () => {
    if (!lesson) return;

    if (activeContentIndex < lesson.content.length - 1) {
      setActiveContentIndex(activeContentIndex + 1);
    } else {
      handleComplete();
    }
  };

  const handlePreviousContent = () => {
    if (activeContentIndex > 0) {
      setActiveContentIndex(activeContentIndex - 1);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
          <p>Loading lesson...</p>
        </div>
      </div>
    );
  }

  const lessonData = lesson;
  const currentContent = lessonData?.content[activeContentIndex];
  console.log(currentContent);
  return (
    <div className="container py-8 space-y-8">
      <div className="flex items-center justify-between">
        <Link href={`/learn/course/${lessonData?.courseId}`}>
          <Button variant="ghost">
            <ChevronLeft className="h-4 w-4 mr-2" />
            Back to Course
          </Button>
        </Link>

        {completed && (
          <div className="flex items-center text-green-600">
            <Award className="h-5 w-5 mr-1" />
            <span>Lesson Completed!</span>
          </div>
        )}
      </div>

      <div className="space-y-2">
        <h1 className="text-3xl font-bold">{lessonData?.title}</h1>
        <p className="text-muted-foreground">{lessonData?.description}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="md:col-span-1">
          <Card>
            <CardContent className="p-4">
              <div className="font-medium mb-4">Lesson Content</div>
              <div className="space-y-2">
                {lessonData?.content.map((content, index) => (
                  <Button
                    key={index}
                    variant={index === activeContentIndex ? 'default' : 'ghost'}
                    className="w-full justify-start"
                    onClick={() => setActiveContentIndex(index)}
                  >
                    <div className="flex items-center">
                      <div className="w-6 h-6 rounded-full bg-muted flex items-center justify-center mr-2">
                        {index + 1}
                      </div>
                      <span className="truncate">
                        {content.title || `Step ${index + 1}`}
                      </span>
                    </div>
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="md:col-span-3 space-y-6">
          <Card>
            <CardContent className="p-6">
              <h2 className="text-xl font-medium mb-4">
                {currentContent?.title}
              </h2>

              {currentContent?.type === 'text' && (
                <div className="prose max-w-none">
                  <p>{currentContent?.content}</p>
                </div>
              )}

              {currentContent?.type === 'video' && (
                <div className="space-y-4">
                  <div className="prose max-w-none">
                    <p>{currentContent?.content}</p>
                  </div>
                  <div className="aspect-video bg-black rounded-md overflow-hidden relative">
                    {(currentContent?.videoUrl || currentContent?.url) &&
                    isYouTubeUrl(
                      currentContent?.videoUrl || currentContent?.url,
                    ) ? (
                      <iframe
                        src={currentContent?.videoUrl || currentContent?.url}
                        className="w-full h-full"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      ></iframe>
                    ) : (
                      <video
                        src={currentContent?.videoUrl || currentContent?.url}
                        className="w-full h-full object-cover"
                        controls
                        poster="/placeholder.jpg"
                      />
                    )}
                  </div>
                </div>
              )}

              {currentContent?.type === 'practice' ||
                (currentContent?.type === 'exercise' && (
                  <div className="space-y-4">
                    <div className="prose max-w-none">
                      <p>
                        {currentContent?.content ||
                          currentContent?.instructions}
                      </p>

                      {/* Display practice items if they exist */}
                      {currentContent?.items &&
                        currentContent.items.length > 0 && (
                          <div className="mt-4">
                            <h3 className="text-lg font-medium">
                              Practice these:
                            </h3>
                            <ul className="list-disc pl-5 mt-2">
                              {currentContent.items.map((item, index) => (
                                <li key={index}>{item}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                    </div>

                      <div className="border rounded-md p-4">
                    
                      </div>
                  </div>
                ))}

              {currentContent?.type === 'quiz' && (
                <div className="prose max-w-none">
                  <p>{currentContent?.content}</p>
                </div>
              )}
            </CardContent>
          </Card>

          <div className="flex justify-between">
            <Button
              variant="outline"
              onClick={handlePreviousContent}
              disabled={activeContentIndex === 0}
            >
              <ChevronLeft className="h-4 w-4 mr-2" />
              Previous
            </Button>

            <Button onClick={handleNextContent}>
              {activeContentIndex < (lessonData?.content?.length || 0) - 1 ? (
                <>
                  Next
                  <ChevronRight className="h-4 w-4 ml-2" />
                </>
              ) : (
                <>
                  Complete Lesson
                  <Award className="h-4 w-4 ml-2" />
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
