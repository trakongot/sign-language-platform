"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Copy, Volume2, Download } from "lucide-react"

export function TranslationResult() {
  const [translatedText, setTranslatedText] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  // This would be replaced with actual translation logic
  const simulateTranslation = () => {
    setIsLoading(true)

    // Simulate API call delay
    setTimeout(() => {
      setTranslatedText("Hello! My name is John. Nice to meet you. I am learning sign language. How are you today?")
      setIsLoading(false)
    }, 2000)
  }

  const copyToClipboard = () => {
    if (translatedText) {
      navigator.clipboard.writeText(translatedText)
    }
  }

  return (
    <div className="space-y-4">
      {isLoading ? (
        <div className="flex flex-col items-center justify-center p-8 space-y-4">
          <div className="h-8 w-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          <p className="text-muted-foreground">Translating sign language...</p>
        </div>
      ) : translatedText ? (
        <div className="space-y-4">
          <Tabs defaultValue="text">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="text">Text</TabsTrigger>
              <TabsTrigger value="audio">Audio</TabsTrigger>
            </TabsList>
            <TabsContent value="text" className="p-4 bg-muted rounded-md min-h-[150px]">
              <p>{translatedText}</p>
            </TabsContent>
            <TabsContent
              value="audio"
              className="p-4 bg-muted rounded-md min-h-[150px] flex items-center justify-center"
            >
              <Button>
                <Volume2 className="mr-2 h-4 w-4" /> Play Audio
              </Button>
            </TabsContent>
          </Tabs>

          <div className="flex gap-2">
            <Button variant="outline" onClick={copyToClipboard} className="flex-1">
              <Copy className="mr-2 h-4 w-4" /> Copy Text
            </Button>
            <Button variant="outline" className="flex-1">
              <Download className="mr-2 h-4 w-4" /> Download
            </Button>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center p-8 space-y-4">
          <p className="text-muted-foreground text-center">
            Record or upload a video to see the translation result here
          </p>
          <Button onClick={simulateTranslation}>Simulate Translation</Button>
        </div>
      )}
    </div>
  )
}

