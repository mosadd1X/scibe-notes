'use client'

import { useState, useEffect } from 'react'
import { Hero } from '@/components/landing/hero'
import { Features } from '@/components/landing/features'
import { Footer } from '@/components/landing/footer'
import { Button } from '@/components/ui/button'
import { Moon, Sun, StickyNote } from 'lucide-react'
import { useTheme } from 'next-themes'

interface LandingPageProps {
  onGetStarted: () => void
}

export function LandingPage({ onGetStarted }: LandingPageProps) {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  // After mounting, we can access the theme
  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="border-b sticky top-0 z-50 bg-background/80 backdrop-blur-sm">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center">
              <StickyNote className="h-6 w-6 mr-2 text-primary" />
              <span className="text-xl font-bold">Scribe</span>
            </div>
            
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                aria-label="Toggle theme"
              >
                {mounted && theme === 'dark' ? (
                  <Sun className="h-5 w-5" />
                ) : (
                  <Moon className="h-5 w-5" />
                )}
              </Button>
              
              <Button onClick={onGetStarted} variant="default">
                Get Started
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1">
        <Hero onGetStarted={onGetStarted} />
        <Features />
      </main>

      <Footer />
    </div>
  )
}
