import { Button } from '@/components/ui/button';
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { ArrowRight, BookOpen, MessageSquare, Mic, Video } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export default function Home() {
  return (
    <main className="flex-1">
      {/* Hero Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-b from-background to-muted">
        <div className="container px-4 md:px-6">
          <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
            <div className="flex flex-col justify-center space-y-4">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                  Breaking Barriers in Sign Language Communication
                </h1>
                <p className="max-w-[600px] text-muted-foreground md:text-xl">
                  Learn, translate, and communicate in sign language with our
                  AI-powered platform.
                </p>
              </div>
              <div className="flex flex-col gap-2 min-[400px]:flex-row">
                <Button asChild size="lg">
                  <Link href="/learn">
                    Start Learning <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button variant="outline" size="lg" asChild>
                  <Link href="/translate">Try Translation</Link>
                </Button>
              </div>
            </div>
            <div className="mx-auto lg:ml-auto">
              <Image
                src="/image.png?height=550&width=550"
                alt="Sign language illustration"
                width={550}
                height={550}
                className="rounded-lg object-cover"
                priority
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="w-full py-12 md:py-24 lg:py-32">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
                Key Features
              </h2>
              <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Our platform offers comprehensive tools for sign language
                learning and translation
              </p>
            </div>
          </div>
          <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 mt-8">
            <Card className="flex flex-col items-center text-center">
              <CardHeader>
                <BookOpen className="h-12 w-12 text-primary mb-2" />
                <CardTitle>Interactive Lessons</CardTitle>
                <CardDescription>
                  Learn sign language through structured, interactive lessons
                  with video guidance
                </CardDescription>
              </CardHeader>
              <CardFooter>
                <Button variant="outline" asChild>
                  <Link href="/learn">Explore Lessons</Link>
                </Button>
              </CardFooter>
            </Card>
            <Card className="flex flex-col items-center text-center">
              <CardHeader>
                <Video className="h-12 w-12 text-primary mb-2" />
                <CardTitle>Video Translation</CardTitle>
                <CardDescription>
                  Translate sign language from videos or real-time camera feed
                </CardDescription>
              </CardHeader>
              <CardFooter>
                <Button variant="outline" asChild>
                  <Link href="/translate">Try Translation</Link>
                </Button>
              </CardFooter>
            </Card>
            <Card className="flex flex-col items-center text-center">
              <CardHeader>
                <MessageSquare className="h-12 w-12 text-primary mb-2" />
                <CardTitle>Text to Sign</CardTitle>
                <CardDescription>
                  Convert text to sign language with visual demonstrations
                </CardDescription>
              </CardHeader>
              <CardFooter>
                <Button variant="outline" asChild>
                  <Link href="/text-to-sign">Convert Text</Link>
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-muted">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
                How It Works
              </h2>
              <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Our platform uses advanced AI to bridge the gap between sign
                language and text
              </p>
            </div>
          </div>
          <div className="mx-auto grid max-w-5xl grid-cols-1 gap-8 md:grid-cols-3 mt-8">
            <div className="flex flex-col items-center space-y-2 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary text-primary-foreground">
                <Video className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold">Record or Upload</h3>
              <p className="text-muted-foreground">
                Record sign language with your camera or upload a video
              </p>
            </div>
            <div className="flex flex-col items-center space-y-2 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary text-primary-foreground">
                <Mic className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold">AI Processing</h3>
              <p className="text-muted-foreground">
                Our AI analyzes the signs and converts them to text or speech
              </p>
            </div>
            <div className="flex flex-col items-center space-y-2 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary text-primary-foreground">
                <MessageSquare className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold">Communicate</h3>
              <p className="text-muted-foreground">
                Bridge communication gaps with real-time translation
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
