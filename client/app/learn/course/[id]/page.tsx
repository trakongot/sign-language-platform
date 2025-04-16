import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { LearnAPI } from '@/lib/api';
import { BookOpen, Check, ChevronLeft, Clock } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';

interface CourseLesson {
  id: string;
  title: string;
  description: string;
  duration: number;
  isCompleted: boolean;
}

interface Course {
  id: string;
  title: string;
  description: string;
  imageSrc?: string;
  progress: number;
  lessons: CourseLesson[];
}
export default function CoursePage({ params }: { params: { id: string } }) {
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchCourse() {
      try {
        setLoading(true);
        setError(null);

        // Fetch course data from the API
        const courseData = await LearnAPI.getLessonsByLevel(params.id);

        // Transform API response to match our component's expected structure
        const formattedCourse: Course = {
          id: courseData.id,
          title: courseData.title,
          description: courseData.description,
          imageSrc: courseData.image_url,
          progress: courseData.progress || 0,
          lessons: courseData.lessons.map((lesson: any) => ({
            id: lesson.id,
            title: lesson.title,
            description: lesson.description,
            duration: lesson.duration || 0,
            isCompleted: lesson.completed || false,
          })),
        };

        setCourse(formattedCourse);
      } catch (err) {
        console.error('Failed to fetch course:', err);
        setError('Failed to load course data. Using mock data as fallback.');
      } finally {
        setLoading(false);
      }
    }

    fetchCourse();
  }, [params.id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
          <p>Loading course...</p>
        </div>
      </div>
    );
  }

  const courseData = course ;

  return (
    <div className="container py-8 space-y-8">
      <div className="flex items-center gap-2">
        <Link href="/learn">
          <Button variant="ghost">
            <ChevronLeft className="h-4 w-4 mr-2" />
            Back to Courses
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-6">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold">{courseData?.title}</h1>
            <p className="text-muted-foreground">{courseData?.description}</p>
          </div>

          <div>
            <div className="flex justify-between mb-2">
              <span className="text-sm">Course Progress</span>
              <span className="text-sm font-medium">
                {courseData?.progress}%
              </span>
            </div>
            <Progress value={courseData?.progress} className="h-2" />
          </div>

          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Lessons</h2>
            <div className="space-y-3">
              {courseData?.lessons.map((lesson, index) => (
                <Link key={lesson.id} href={`/learn/lesson/${lesson.id}`}>
                  <Card
                    className={`hover:bg-accent/50 transition-colors ${
                      lesson.isCompleted ? 'border-green-200' : ''
                    }`}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start gap-4">
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center ${
                            lesson.isCompleted
                              ? 'bg-green-100 text-green-700'
                              : 'bg-muted'
                          }`}
                        >
                          {lesson.isCompleted ? (
                            <Check className="h-4 w-4" />
                          ) : (
                            <span>{index + 1}</span>
                          )}
                        </div>
                        <div className="flex-1">
                          <h3 className="font-medium">{lesson.title}</h3>
                          <p className="text-sm text-muted-foreground mt-1">
                            {lesson.description}
                          </p>
                          <div className="flex items-center mt-2 text-xs text-muted-foreground">
                            <Clock className="h-3 w-3 mr-1" />
                            {lesson.duration} minutes
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>Course Resources</CardTitle>
              <CardDescription>
                Additional materials to help you master the course
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <BookOpen className="h-4 w-4 text-muted-foreground" />
                  <span>ASL Dictionary</span>
                </div>
                <div className="flex items-center gap-2">
                  <BookOpen className="h-4 w-4 text-muted-foreground" />
                  <span>Printable Cheat Sheet</span>
                </div>
                <div className="flex items-center gap-2">
                  <BookOpen className="h-4 w-4 text-muted-foreground" />
                  <span>Practice Videos</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
