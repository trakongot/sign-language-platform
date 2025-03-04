import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Play, Volume2 } from "lucide-react"

export default function TextToSignPage() {
  return (
    <main className="flex-1 py-12">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col space-y-8">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Text to Sign Language</h1>
            <p className="text-muted-foreground md:text-xl">
              Convert text to sign language with visual demonstrations and audio
            </p>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <Card className="lg:col-span-1">
              <CardHeader>
                <CardTitle>Enter Text</CardTitle>
                <CardDescription>Type the text you want to convert to sign language</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Textarea placeholder="Enter text here..." className="min-h-[150px]" />
                <div className="flex justify-between">
                  <div className="flex items-center space-x-2">
                    <Button variant="outline" size="icon">
                      <Volume2 className="h-4 w-4" />
                    </Button>
                    <span className="text-sm text-muted-foreground">Enable audio</span>
                  </div>
                  <Button>
                    <Play className="mr-2 h-4 w-4" /> Convert to Sign
                  </Button>
                </div>
              </CardContent>
            </Card>
            <Card className="lg:col-span-1">
              <CardHeader>
                <CardTitle>Sign Language Output</CardTitle>
                <CardDescription>Visual demonstration of the sign language</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="aspect-video bg-muted rounded-md flex items-center justify-center">
                  <p className="text-muted-foreground">Sign language animation will appear here</p>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Common Phrases</CardTitle>
              <CardDescription>Click on any phrase to see it in sign language</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                {[
                  "Hello, how are you?",
                  "Thank you",
                  "My name is...",
                  "Nice to meet you",
                  "I don't understand",
                  "Can you help me?",
                ].map((phrase, index) => (
                  <Button key={index} variant="outline" className="justify-start h-auto py-2">
                    {phrase}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  )
}

