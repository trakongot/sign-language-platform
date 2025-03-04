"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Video, StopCircle, Camera } from "lucide-react"

export function VideoRecorder() {
  const [isRecording, setIsRecording] = useState(false)
  const [stream, setStream] = useState<MediaStream | null>(null)
  const [recordedChunks, setRecordedChunks] = useState<Blob[]>([])
  const [recordedVideo, setRecordedVideo] = useState<string | null>(null)

  const videoRef = useRef<HTMLVideoElement>(null)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)

  useEffect(() => {
    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop())
      }
    }
  }, [stream])

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      })
      setStream(mediaStream)

      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream
      }
    } catch (error) {
      console.error("Error accessing camera:", error)
    }
  }

  const startRecording = () => {
    if (!stream) return

    setRecordedChunks([])
    setRecordedVideo(null)

    const mediaRecorder = new MediaRecorder(stream)
    mediaRecorderRef.current = mediaRecorder

    mediaRecorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        setRecordedChunks((prev) => [...prev, event.data])
      }
    }

    mediaRecorder.onstop = () => {
      const blob = new Blob(recordedChunks, { type: "video/webm" })
      const url = URL.createObjectURL(blob)
      setRecordedVideo(url)
    }

    mediaRecorder.start()
    setIsRecording(true)
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop()
      setIsRecording(false)
    }
  }

  return (
    <div className="space-y-4">
      <div className="relative overflow-hidden rounded-md bg-muted aspect-video">
        {stream ? (
          <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
        ) : recordedVideo ? (
          <video src={recordedVideo} controls className="w-full h-full object-cover" />
        ) : (
          <div className="flex items-center justify-center h-full">
            <Camera className="h-12 w-12 text-muted-foreground" />
          </div>
        )}

        {isRecording && (
          <div className="absolute top-4 right-4 flex items-center gap-2 bg-red-500 text-white px-3 py-1 rounded-full text-sm">
            <span className="animate-pulse h-2 w-2 rounded-full bg-white"></span>
            Recording
          </div>
        )}
      </div>

      <div className="flex flex-wrap gap-2">
        {!stream ? (
          <Button onClick={startCamera} className="flex-1">
            <Camera className="mr-2 h-4 w-4" /> Start Camera
          </Button>
        ) : !isRecording ? (
          <Button onClick={startRecording} className="flex-1">
            <Video className="mr-2 h-4 w-4" /> Start Recording
          </Button>
        ) : (
          <Button onClick={stopRecording} variant="destructive" className="flex-1">
            <StopCircle className="mr-2 h-4 w-4" /> Stop Recording
          </Button>
        )}

        {recordedVideo && (
          <Button variant="outline" onClick={() => setStream(null)} className="flex-1">
            Record New Video
          </Button>
        )}
      </div>
    </div>
  )
}

