"use client"

import { useState, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowLeft, Upload as UploadIcon, Check, Copy, FileIcon, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { cn } from "@/lib/utils"

// Steps: 0 = Name, 1 = Upload, 2 = Success
type Step = 0 | 1 | 2

export default function UploadPage() {
  const [step, setStep] = useState<Step>(0)
  const [senderName, setSenderName] = useState("")
  const [files, setFiles] = useState<File[]>([])
  const [uploading, setUploading] = useState(false)
  const [shareCode, setShareCode] = useState("")
  const [error, setError] = useState("")

  // Ref for file input
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleNameSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (senderName.trim()) setStep(1)
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFiles(prev => [...prev, ...Array.from(e.target.files!)])
      setError("")
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      setFiles(prev => [...prev, ...Array.from(e.dataTransfer.files)])
      setError("")
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index))
  }

  const handleUpload = async () => {
    if (!senderName.trim() || files.length === 0) {
      setError("Please select at least one file.")
      return
    }

    setUploading(true)
    setError("")

    const formData = new FormData()
    formData.append('senderName', senderName)
    files.forEach(file => {
      formData.append('files', file)
    })

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      if (response.ok) {
        const data = await response.json()
        setShareCode(data.shareCode)
        setStep(2)
      } else {
        setError('Upload failed. Please try again.')
      }
    } catch (error) {
      console.error('Upload error:', error)
      setError('Upload failed. Please try again.')
    } finally {
      setUploading(false)
    }
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shareCode)
    // Ideally show a toast here
  }

  const resetFlow = () => {
    setFiles([])
    setShareCode("")
    setStep(1)
    setError("")
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="p-6">
        <Link href="/" className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Home
        </Link>
      </header>

      <main className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <AnimatePresence mode="wait">
            {step === 0 && (
              <motion.div
                key="step-name"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="space-y-2 text-center">
                  <h1 className="text-3xl font-bold tracking-tight">Welcome</h1>
                  <p className="text-muted-foreground">Enter your name to start sharing.</p>
                </div>
                <form onSubmit={handleNameSubmit} className="space-y-4">
                  <input
                    type="text"
                    placeholder="Your Name"
                    value={senderName}
                    onChange={(e) => setSenderName(e.target.value)}
                    className="flex h-12 w-full rounded-md border border-input bg-background px-3 py-2 text-lg ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 text-center"
                    autoFocus
                  />
                  <Button type="submit" className="w-full h-12 text-lg" disabled={!senderName.trim()}>
                    Continue
                  </Button>
                </form>
              </motion.div>
            )}

            {step === 1 && (
              <motion.div
                key="step-upload"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="space-y-2 text-center">
                  <h1 className="text-2xl font-bold">Upload Files</h1>
                  <p className="text-muted-foreground">Hi {senderName}, select files to share.</p>
                </div>

                <div
                  className={cn(
                    "relative border-2 border-dashed rounded-xl p-8 text-center transition-colors cursor-pointer",
                    uploading ? "opacity-50 pointer-events-none" : "hover:border-primary hover:bg-secondary/50",
                    "border-muted-foreground/25"
                  )}
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                  onClick={() => fileInputRef.current?.click()}
                >
                  <input
                    type="file"
                    multiple
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    className="hidden"
                    disabled={uploading}
                  />

                  <div className="space-y-4">
                    <div className="h-16 w-16 mx-auto rounded-full bg-secondary flex items-center justify-center">
                      <UploadIcon className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="font-medium">Click or drag files here</p>
                      <p className="text-sm text-muted-foreground">Up to 100MB per file</p>
                    </div>
                  </div>
                </div>

                {files.length > 0 && (
                  <div className="space-y-2 max-h-48 overflow-y-auto pr-2">
                    {files.map((file, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-secondary/30 rounded-lg text-sm">
                        <div className="flex items-center gap-2 overflow-hidden">
                          <FileIcon className="h-4 w-4 flex-shrink-0 text-primary" />
                          <span className="truncate">{file.name}</span>
                        </div>
                        <button
                          onClick={() => removeFile(index)}
                          className="text-muted-foreground hover:text-destructive transition-colors"
                          disabled={uploading}
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {error && (
                  <p className="text-sm text-destructive text-center">{error}</p>
                )}

                <Button
                  onClick={handleUpload}
                  className="w-full h-12 text-lg"
                  disabled={uploading || files.length === 0}
                >
                  {uploading ? (
                    <span className="flex items-center gap-2">
                      <span className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                      Uploading...
                    </span>
                  ) : (
                    "Get Share Code"
                  )}
                </Button>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                key="step-success"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="space-y-6 text-center"
              >
                <div className="h-20 w-20 mx-auto rounded-full bg-green-100 dark:bg-green-900/20 flex items-center justify-center mb-6">
                  <Check className="h-10 w-10 text-green-600 dark:text-green-400" />
                </div>

                <div className="space-y-2">
                  <h1 className="text-3xl font-bold">Files Ready!</h1>
                  <p className="text-muted-foreground">Your files have been securely uploaded.</p>
                </div>

                <div className="bg-secondary/50 p-6 rounded-xl space-y-4 border">
                  <div className="flex items-center justify-between bg-background p-3 rounded-lg border">
                    <code className="text-lg font-mono font-bold tracking-wider">{shareCode}</code>
                    <Button size="icon" variant="ghost" onClick={copyToClipboard}>
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    This code is valid for 24 hours.
                  </p>
                </div>

                <div className="flex gap-4 justify-center">
                  <Button variant="outline" onClick={resetFlow}>
                    Upload More
                  </Button>
                  <Link href="/">
                    <Button>Done</Button>
                  </Link>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  )
}