'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { ArrowRight, FileText, Sparkles, Lightbulb, Search } from 'lucide-react'
import Image from 'next/image'

interface HeroProps {
  onGetStarted: () => void
}

export function Hero({ onGetStarted }: HeroProps) {
  return (
    <div className="flex flex-col items-center justify-center px-4 py-20 text-center">
      <div className="mb-6 flex items-center justify-center">
        <Image
          src="/logo.svg"
          alt="Scribe Logo"
          width={80}
          height={80}
          className="h-20 w-20"
        />
      </div>
      <h1 className="mb-4 text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl">
        <span className="text-primary">Scribe</span>
      </h1>
      <p className="mb-2 text-xl font-medium text-muted-foreground">
        AI-Powered Markdown Notes
      </p>
      <p className="mb-8 max-w-md text-muted-foreground">
        Elevate your note-taking with the power of AI. Write, organize, and
        enhance your notes with Gemini AI assistance.
      </p>
      <Button
        onClick={onGetStarted}
        size="lg"
        className="mb-12 gap-2 bg-primary px-8 text-lg font-medium"
      >
        Get Started
        <ArrowRight className="h-5 w-5" />
      </Button>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
        <div className="flex flex-col items-center p-4">
          <div className="mb-4 rounded-full bg-primary/10 p-3">
            <FileText className="h-6 w-6 text-primary" />
          </div>
          <h3 className="mb-2 text-xl font-bold">Markdown Editor</h3>
          <p className="text-center text-muted-foreground">
            Write in markdown with real-time preview and syntax highlighting.
          </p>
        </div>

        <div className="flex flex-col items-center p-4">
          <div className="mb-4 rounded-full bg-primary/10 p-3">
            <Sparkles className="h-6 w-6 text-primary" />
          </div>
          <h3 className="mb-2 text-xl font-bold">AI Assistance</h3>
          <p className="text-center text-muted-foreground">
            Summarize, improve, and expand your notes with Gemini AI.
          </p>
        </div>

        <div className="flex flex-col items-center p-4">
          <div className="mb-4 rounded-full bg-primary/10 p-3">
            <Search className="h-6 w-6 text-primary" />
          </div>
          <h3 className="mb-2 text-xl font-bold">Instant Search</h3>
          <p className="text-center text-muted-foreground">
            Quickly find your notes with powerful search capabilities.
          </p>
        </div>
      </div>
    </div>
  )
}
