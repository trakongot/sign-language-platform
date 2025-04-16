'use client';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LearnAPI } from '@/lib/api';
import { BookOpen, Clock } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';

interface Lesson {
  id: number;
  title: string;
  description: string;
  duration: string;
  progress: number;
  image: string;
}

interface LessonsData {
  beginner: Lesson[];
  intermediate: Lesson[];
  advanced: Lesson[];
}

export default function LearnPage() {
  const [lessons, setLessons] = useState<LessonsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeLevel, setActiveLevel] = useState<string>('beginner');

  useEffect(() => {
    const fetchLessons = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch lessons data from API
        const lessonsData = await LearnAPI.getLessons();
        setLessons(lessonsData);
      } catch (err) {
        console.error('Failed to fetch lessons:', err);
        setError('Failed to load lessons. Using sample data instead.');

        // Fallback to sample data if API fails
        setLessons({
          beginner: [
            {
              id: 1,
              title: 'Alphabet Basics',
              description: 'Learn the fundamental hand signs for the alphabet',
              duration: '30 min',
              progress: 0,
              image: '/placeholder.svg?height=200&width=350',
            },
            {
              id: 2,
              title: 'Common Greetings',
              description: 'Master everyday greetings and introductions',
              duration: '45 min',
              progress: 0,
              image: '/placeholder.svg?height=200&width=350',
            },
            {
              id: 3,
              title: 'Numbers & Counting',
              description: 'Learn to sign numbers from 1-20',
              duration: '35 min',
              progress: 0,
              image: '/placeholder.svg?height=200&width=350',
            },
          ],
          intermediate: [
            {
              id: 4,
              title: 'Everyday Phrases',
              description: 'Common phrases for daily conversations',
              duration: '50 min',
              progress: 0,
              image: '/placeholder.svg?height=200&width=350',
            },
            {
              id: 5,
              title: 'Emotions & Feelings',
              description: 'Express emotions through sign language',
              duration: '40 min',
              progress: 0,
              image: '/placeholder.svg?height=200&width=350',
            },
          ],
          advanced: [
            {
              id: 6,
              title: 'Complex Conversations',
              description: 'Advanced techniques for fluid conversations',
              duration: '60 min',
              progress: 0,
              image: '/placeholder.svg?height=200&width=350',
            },
          ],
        });
      } finally {
        setLoading(false);
      }
    };

    fetchLessons();
  }, []);

  const handleTabChange = (value: string) => {
    setActiveLevel(value);
  };

  if (loading) {
    return (
      <div className="flex-1 py-12 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
          <p>Loading lessons...</p>
        </div>
      </div>
    );
  }

  // If no lessons data, show error message
  if (!lessons) {
    return (
      <div className="flex-1 py-12 container px-4 md:px-6 flex items-center justify-center">
        <div className="text-center">
          <BookOpen className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          <h2 className="text-2xl font-bold mb-2">No Lessons Found</h2>
          <p className="text-muted-foreground mb-4">
            {error || "We couldn't find any lessons. Please try again later."}
          </p>
          <Button onClick={() => window.location.reload()}>Retry</Button>
        </div>
      </div>
    );
  }

  return (
    <main className="flex-1 py-12">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col space-y-8">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
              Sign Language Lessons
            </h1>
            <p className="text-muted-foreground md:text-xl">
              Learn sign language through interactive video lessons and practice
              exercises
            </p>
          </div>

          <Tabs
            defaultValue={activeLevel}
            className="w-full"
            onValueChange={handleTabChange}
          >
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="beginner">Beginner</TabsTrigger>
              <TabsTrigger value="intermediate">Intermediate</TabsTrigger>
              <TabsTrigger value="advanced">Advanced</TabsTrigger>
            </TabsList>
            <TabsContent value="beginner" className="mt-6">
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {lessons.beginner.map((lesson) => (
                  <LessonCard key={lesson.id} lesson={lesson} />
                ))}
              </div>
            </TabsContent>
            <TabsContent value="intermediate" className="mt-6">
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {lessons.intermediate.map((lesson) => (
                  <LessonCard key={lesson.id} lesson={lesson} />
                ))}
              </div>
            </TabsContent>
            <TabsContent value="advanced" className="mt-6">
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {lessons.advanced.map((lesson) => (
                  <LessonCard key={lesson.id} lesson={lesson} />
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </main>
  );
}

function LessonCard({ lesson }: { lesson: Lesson }) {
  return (
    <Card className="overflow-hidden">
      <div className="relative">
        <Image
          src={lesson.image || '/placeholder.svg'}
          alt={lesson.title}
          width={350}
          height={200}
          className="w-full object-cover h-[200px]"
        />
      </div>
      <CardHeader>
        <CardTitle>{lesson.title}</CardTitle>
        <CardDescription>{lesson.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center text-sm text-muted-foreground">
            <Clock className="mr-1 h-4 w-4" />
            {lesson.duration}
          </div>
          {lesson.progress > 0 && (
            <div className="text-sm text-muted-foreground">
              {lesson.progress}% complete
            </div>
          )}
        </div>
        <Progress value={lesson.progress} className="h-2" />
      </CardContent>
      <CardFooter>
        <Button asChild className="w-full">
          <Link href={`/learn/lesson/${lesson.id}`}>
            {lesson.progress > 0 ? 'Continue' : 'Start'} Lesson
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
