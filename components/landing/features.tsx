'use client'

import {
  Wand2,
  Sparkles,
  Lightbulb,
  Search,
  ListChecks,
  Code,
  Moon,
  Sun,
  Keyboard,
  Download,
  Upload,
  Wifi,
  WifiOff,
} from 'lucide-react'

export function Features() {
  return (
    <div className="py-20 bg-accent/50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-4">Powerful Features</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Scribe combines the simplicity of markdown with the power of AI to help you write better, 
            think clearer, and organize your thoughts more effectively.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <FeatureCard
            icon={<Sparkles className="h-6 w-6 text-primary" />}
            title="Summarize"
            description="Condense long notes into concise summaries with AI assistance."
          />
          <FeatureCard
            icon={<Wand2 className="h-6 w-6 text-primary" />}
            title="Improve Writing"
            description="Enhance clarity, grammar, and style with AI suggestions."
          />
          <FeatureCard
            icon={<ListChecks className="h-6 w-6 text-primary" />}
            title="Generate Outline"
            description="Create structured outlines from your content automatically."
          />
          <FeatureCard
            icon={<Code className="h-6 w-6 text-primary" />}
            title="Format Markdown"
            description="Convert plain text to well-structured markdown with one click."
          />
          <FeatureCard
            icon={<Search className="h-6 w-6 text-primary" />}
            title="Answer Questions"
            description="Ask questions about your note content and get intelligent answers."
          />
          <FeatureCard
            icon={<Lightbulb className="h-6 w-6 text-primary" />}
            title="Get Suggestions"
            description="Receive ideas on how to expand and improve your notes."
          />
          <FeatureCard
            icon={<Moon className="h-6 w-6 text-primary" />}
            title="Dark Mode"
            description="Choose between light and dark themes for comfortable writing."
          />
          <FeatureCard
            icon={<Keyboard className="h-6 w-6 text-primary" />}
            title="Keyboard Shortcuts"
            description="Boost your productivity with intuitive keyboard shortcuts."
          />
          <FeatureCard
            icon={<WifiOff className="h-6 w-6 text-primary" />}
            title="Offline Support"
            description="Continue working even without an internet connection."
          />
        </div>
      </div>
    </div>
  )
}

interface FeatureCardProps {
  icon: React.ReactNode
  title: string
  description: string
}

function FeatureCard({ icon, title, description }: FeatureCardProps) {
  return (
    <div className="bg-background rounded-lg p-6 shadow-sm border">
      <div className="mb-4 rounded-full bg-primary/10 p-3 inline-block">
        {icon}
      </div>
      <h3 className="text-xl font-bold mb-2">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </div>
  )
}
