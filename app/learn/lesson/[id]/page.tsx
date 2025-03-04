import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, ArrowRight, CheckCircle } from "lucide-react"
import { VideoPlayer } from "@/components/video-player"
import { VideoRecorder } from "@/components/video-recorder"

export default function LessonPage({ params }: { params: { id: string } }) {
  const lessonId = Number.parseInt(params.id)

  // Mock lesson data
  const lesson = {
    id: lessonId,
    title:
      lessonId === 1
        ? "Alphabet Basics"
        : lessonId === 2
          ? "Common Greetings"
          : lessonId === 3
            ? "Numbers & Counting"
            : lessonId === 4
              ? "Everyday Phrases"
              : lessonId === 5
                ? "Emotions & Feelings"
                : "Complex Conversations",
    description: "Learn the fundamental hand signs for effective communication",
    videoUrl: "/placeholder.mp4",
    steps: [
      { id: 1, title: "Introduction", completed: false },
      { id: 2, title: "Demonstration", completed: false },
      { id: 3, title: "Practice", completed: false },
      { id: 4, title: "Quiz", completed: false },
    ],
    currentStep: 1,
  }

  return (
    <main className="flex-1 py-8">
      <div className="container px-4 md:px-6">
        <div className="mb-6">
          <Link href="/learn" className="flex items-center text-muted-foreground hover:text-foreground">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Lessons
          </Link>
        </div>

        <div className="flex flex-col space-y-8">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tighter">{lesson.title}</h1>
            <p className="text-muted-foreground">{lesson.description}</p>
          </div>

          <div className="flex flex-col space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                {lesson.steps.map((step, index) => (
                  <div key={step.id} className="flex items-center">
                    {index > 0 && <div className="h-px w-4 bg-border" />}
                    <div
                      className={`flex h-8 w-8 items-center justify-center rounded-full ${
                        lesson.currentStep > step.id
                          ? "bg-primary text-primary-foreground"
                          : lesson.currentStep === step.id
                            ? "border-2 border-primary text-primary"
                            : "border border-border text-muted-foreground"
                      }`}
                    >
                      {lesson.currentStep > step.id ? <CheckCircle className="h-4 w-4" /> : step.id}
                    </div>
                  </div>
                ))}
              </div>
              <div className="text-sm text-muted-foreground">
                Step {lesson.currentStep} of {lesson.steps.length}
              </div>
            </div>

            <Progress value={((lesson.currentStep - 1) / lesson.steps.length) * 100} className="h-2" />
          </div>

          <Tabs defaultValue="learn" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="learn">Learn</TabsTrigger>
              <TabsTrigger value="practice">Practice</TabsTrigger>
            </TabsList>
            <TabsContent value="learn" className="mt-6">
              <div className="grid gap-6 lg:grid-cols-2">
                <Card>
                  <CardContent className="p-0">
                    <VideoPlayer />
                  </CardContent>
                </Card>
                <div className="space-y-4">
                  <h2 className="text-2xl font-bold">Instructions</h2>
                  <div className="space-y-2">
                    <p>
                      Watch the video demonstration carefully. The instructor will show you the proper hand positions
                      and movements for each sign.
                    </p>
                    <p>Pay attention to:</p>
                    <ul className="list-disc pl-6 space-y-1">
                      <li>Hand shape and orientation</li>
                      <li>Movement direction and speed</li>
                      <li>Facial expressions that accompany signs</li>
                    </ul>
                    <p className="mt-4">
                      You can pause, rewind, and replay the video as needed to fully understand each sign.
                    </p>
                  </div>
                  <div className="flex justify-between pt-4">
                    <Button variant="outline" disabled={lesson.currentStep === 1}>
                      <ArrowLeft className="mr-2 h-4 w-4" /> Previous
                    </Button>
                    <Button>
                      Next <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </TabsContent>
            <TabsContent value="practice" className="mt-6">
              <div className="grid gap-6 lg:grid-cols-2">
                <Card>
                  <CardContent className="p-0">
                    <VideoPlayer />
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-0">
                    <VideoRecorder />
                  </CardContent>
                </Card>
                <div className="lg:col-span-2 space-y-4">
                  <h2 className="text-2xl font-bold">Practice Instructions</h2>
                  <p>
                    Now it's your turn to practice! Record yourself performing the signs you just learned. The reference
                    video is available on the left for guidance.
                  </p>
                  <div className="flex justify-between pt-4">
                    <Button variant="outline">
                      <ArrowLeft className="mr-2 h-4 w-4" /> Back to Learning
                    </Button>
                    <Button>
                      Submit Practice <CheckCircle className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </main>
  )
}

