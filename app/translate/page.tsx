import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { VideoRecorder } from "@/components/video-recorder"
import { VideoUploader } from "@/components/video-uploader"
import { TranslationResult } from "@/components/translation-result"

export default function TranslatePage() {
  return (
    <main className="flex-1 py-12">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col space-y-8">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Sign Language Translation</h1>
            <p className="text-muted-foreground md:text-xl">
              Translate sign language to text using our AI-powered tools
            </p>
          </div>

          <Tabs defaultValue="camera" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="camera">Live Camera</TabsTrigger>
              <TabsTrigger value="upload">Upload Video</TabsTrigger>
            </TabsList>
            <TabsContent value="camera" className="mt-6">
              <div className="grid gap-6 lg:grid-cols-2">
                <Card className="lg:col-span-1">
                  <CardHeader>
                    <CardTitle>Record Sign Language</CardTitle>
                    <CardDescription>Use your camera to record sign language for real-time translation</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <VideoRecorder />
                  </CardContent>
                </Card>
                <Card className="lg:col-span-1">
                  <CardHeader>
                    <CardTitle>Translation Result</CardTitle>
                    <CardDescription>The translated text will appear here</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <TranslationResult />
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            <TabsContent value="upload" className="mt-6">
              <div className="grid gap-6 lg:grid-cols-2">
                <Card className="lg:col-span-1">
                  <CardHeader>
                    <CardTitle>Upload Video</CardTitle>
                    <CardDescription>Upload a video file containing sign language for translation</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <VideoUploader />
                  </CardContent>
                </Card>
                <Card className="lg:col-span-1">
                  <CardHeader>
                    <CardTitle>Translation Result</CardTitle>
                    <CardDescription>The translated text will appear here</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <TranslationResult />
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </main>
  )
}

