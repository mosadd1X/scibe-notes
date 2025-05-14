'use client'

import { StickyNote, Github, Twitter, Linkedin } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function Footer() {
  return (
    <footer className="border-t py-12">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center mb-6 md:mb-0">
            <StickyNote className="h-6 w-6 mr-2 text-primary" />
            <span className="text-xl font-bold">Scribe</span>
          </div>
          
          <div className="flex flex-col md:flex-row md:items-center gap-6">
            <nav className="flex gap-6">
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                Features
              </a>
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                Docs
              </a>
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                Blog
              </a>
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                About
              </a>
            </nav>
            
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon">
                <Github className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon">
                <Twitter className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon">
                <Linkedin className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
        
        <div className="mt-8 pt-8 border-t text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} Scribe. All rights reserved.</p>
          <p className="mt-2">
            <a href="#" className="hover:text-foreground transition-colors">Privacy Policy</a>
            {' • '}
            <a href="#" className="hover:text-foreground transition-colors">Terms of Service</a>
          </p>
        </div>
      </div>
    </footer>
  )
}
