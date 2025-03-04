"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Upload, X } from "lucide-react"

export function VideoUploader() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null

    if (file && file.type.startsWith("video/")) {
      setSelectedFile(file)
      const url = URL.createObjectURL(file)
      setPreviewUrl(url)
    } else {
      setSelectedFile(null)
      setPreviewUrl(null)
    }
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()

    const file = e.dataTransfer.files?.[0] || null

    if (file && file.type.startsWith("video/")) {
      setSelectedFile(file)
      const url = URL.createObjectURL(file)
      setPreviewUrl(url)
    }
  }

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
  }

  const clearSelection = () => {
    setSelectedFile(null)
    setPreviewUrl(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  return (
    <div className="space-y-4">
      {!previewUrl ? (
        <div
          className="border-2 border-dashed rounded-md p-6 flex flex-col items-center justify-center gap-4 bg-muted/50 cursor-pointer"
          onClick={() => fileInputRef.current?.click()}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
        >
          <Upload className="h-10 w-10 text-muted-foreground" />
          <div className="text-center">
            <p className="font-medium">Click to upload or drag and drop</p>
            <p className="text-sm text-muted-foreground">MP4, WebM or MOV (max. 100MB)</p>
          </div>
          <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="video/*" className="hidden" />
        </div>
      ) : (
        <div className="relative rounded-md overflow-hidden">
          <video src={previewUrl} controls className="w-full aspect-video object-cover" />
          <Button variant="destructive" size="icon" className="absolute top-2 right-2" onClick={clearSelection}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      )}

      {selectedFile && (
        <div className="flex justify-between items-center p-2 bg-muted rounded-md">
          <div className="truncate">
            <p className="font-medium truncate">{selectedFile.name}</p>
            <p className="text-sm text-muted-foreground">{(selectedFile.size / (1024 * 1024)).toFixed(2)} MB</p>
          </div>
          <Button>Translate Video</Button>
        </div>
      )}
    </div>
  )
}

