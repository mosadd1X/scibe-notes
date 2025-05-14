'use client'

import { useState, useEffect } from 'react'
import { Note } from '@/lib/types'
import { generateId, saveNote, getNotes } from '@/lib/note-utils'
import { Menu } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

// Components
import { AppHeader } from '@/components/ui/app-header'
import { Sidebar } from '@/components/notes/sidebar'
import { NoteEditor } from '@/components/notes/note-editor'
import { LandingPage } from '@/components/landing/landing-page'

// App name: Scribe - AI-powered markdown notes
const APP_NAME = 'Scribe'

// Local storage key for first visit
const FIRST_VISIT_KEY = 'scribe-first-visit'

export default function Home() {
  const [selectedNote, setSelectedNote] = useState<Note | undefined>(undefined)
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const [isMobile, setIsMobile] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)
  const [showLandingPage, setShowLandingPage] = useState(true)
  const [isFirstVisit, setIsFirstVisit] = useState(true)

  // Check if we're on mobile, handle initial animations, and check first visit
  useEffect(() => {
    // Check if it's the first visit
    if (typeof window !== 'undefined') {
      const hasVisitedBefore = localStorage.getItem(FIRST_VISIT_KEY)
      const hasNotes = getNotes().length > 0

      // If user has visited before or has notes, don't show landing page
      if (hasVisitedBefore || hasNotes) {
        setShowLandingPage(false)
        setIsFirstVisit(false)
      }
    }

    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768)
      if (window.innerWidth < 768) {
        setIsSidebarOpen(false)
      } else {
        setIsSidebarOpen(true)
      }
    }

    checkIfMobile()
    window.addEventListener('resize', checkIfMobile)

    // Set loaded state for animations
    setTimeout(() => {
      setIsLoaded(true)
    }, 100)

    return () => {
      window.removeEventListener('resize', checkIfMobile)
    }
  }, [])

  const handleSelectNote = (note: Note) => {
    setSelectedNote(note)
    if (isMobile) {
      setIsSidebarOpen(false)
    }
  }

  const handleCreateNote = () => {
    const now = new Date().toISOString()

    // Create welcome note for first-time users
    let content = ''
    let title = 'Untitled'

    if (isFirstVisit && getNotes().length === 0) {
      title = 'Welcome to Scribe!'
      content = `# Welcome to Scribe! 👋

Thank you for trying out Scribe, your new AI-powered markdown note-taking app.

## Getting Started

- **Create a new note** using the + button in the sidebar
- **Format your text** with markdown syntax
- **Use AI features** by clicking the AI button in the toolbar
- **Toggle dark/light mode** using the theme button in the header
- **Search your notes** using the search bar in the sidebar

## Keyboard Shortcuts

- **Ctrl/Cmd + S**: Save note
- **Ctrl/Cmd + N**: Create new note
- **Ctrl/Cmd + /**: Toggle sidebar
- **Alt + S**: Summarize with AI
- **Alt + I**: Improve writing with AI
- **Alt + O**: Generate outline with AI
- **Alt + F**: Format markdown with AI

## AI Features

Scribe integrates with Google's Gemini AI to provide intelligent assistance:

1. **Summarize** - Condense long notes into concise summaries
2. **Improve Writing** - Enhance clarity, grammar, and style
3. **Generate Outline** - Create structured outlines from your content
4. **Format Markdown** - Convert plain text to well-structured markdown
5. **Answer Questions** - Ask questions about your note content
6. **Get Suggestions** - Receive ideas on how to expand your notes

Happy note-taking! 📝`

      // Mark that the user has visited before
      if (typeof window !== 'undefined') {
        localStorage.setItem(FIRST_VISIT_KEY, 'true')
        setIsFirstVisit(false)
      }
    }

    const newNote: Note = {
      id: generateId(),
      title,
      content,
      createdAt: now,
      updatedAt: now,
      isShared: false,
    }

    // Save the note to local storage immediately to ensure it appears in the list
    saveNote(newNote)

    // Dispatch a custom event to notify components about the new note
    if (typeof window !== 'undefined') {
      const noteChangeEvent = new CustomEvent('note-created', {
        detail: { note: newNote, timestamp: new Date().getTime() },
      })
      window.dispatchEvent(noteChangeEvent)
    }

    setSelectedNote(newNote)
    if (isMobile) {
      setIsSidebarOpen(false)
    }
  }

  const handleSaveNote = (note: Note) => {
    // Save the note to local storage
    saveNote(note)
    setSelectedNote(note)
  }

  const handleDeleteNote = () => {
    setSelectedNote(undefined)
  }

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen)
  }

  // Handle get started button click
  const handleGetStarted = () => {
    // Mark that the user has visited before
    if (typeof window !== 'undefined') {
      localStorage.setItem(FIRST_VISIT_KEY, 'true')
    }

    // Hide the landing page
    setShowLandingPage(false)
    setIsFirstVisit(false)

    // Create a welcome note if there are no notes
    if (getNotes().length === 0) {
      handleCreateNote()
    }
  }

  // Keyboard shortcut handler
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl/Cmd + / to toggle sidebar
      if ((e.ctrlKey || e.metaKey) && e.key === '/') {
        e.preventDefault()
        toggleSidebar()
      }

      // Ctrl/Cmd + N to create new note
      if ((e.ctrlKey || e.metaKey) && e.key === 'n') {
        e.preventDefault()
        handleCreateNote()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isSidebarOpen])

  // Render landing page or app based on state
  if (showLandingPage) {
    return <LandingPage onGetStarted={handleGetStarted} />
  }

  // Render the main app
  return (
    <div
      className={cn(
        'flex flex-col h-screen bg-background text-foreground',
        isLoaded ? 'animate-fade-in' : 'opacity-0'
      )}
    >
      {/* Improved header component */}
      <AppHeader
        isSidebarOpen={isSidebarOpen}
        toggleSidebar={toggleSidebar}
        isMobile={isMobile}
      />

      <div className="flex flex-1 overflow-hidden relative">
        {/* Improved sidebar component */}
        <aside
          className={cn(
            'border-r overflow-y-auto flex flex-col bg-background',
            'transition-all duration-300 ease-in-out',
            isMobile
              ? isSidebarOpen
                ? 'absolute inset-y-0 left-0 w-full z-20'
                : 'absolute inset-y-0 -left-full w-full z-20'
              : isSidebarOpen
              ? 'w-80'
              : 'w-0'
          )}
        >
          <Sidebar
            onSelectNote={handleSelectNote}
            onCreateNote={handleCreateNote}
            selectedNoteId={selectedNote?.id}
          />
        </aside>

        {/* Main content */}
        <main
          className={cn(
            'flex-1 overflow-hidden flex flex-col',
            isLoaded && 'animate-slide-in'
          )}
        >
          {selectedNote ? (
            <NoteEditor
              note={selectedNote}
              onSave={handleSaveNote}
              onDelete={handleDeleteNote}
              onCreateNote={handleCreateNote}
            />
          ) : (
            <div className="flex flex-col items-center justify-center h-full p-4 text-center">
              <div className="max-w-md mx-auto">
                <h2 className="text-2xl font-bold mb-4">Welcome to Scribe!</h2>
                <p className="text-muted-foreground mb-6">
                  Select a note from the sidebar or create a new one to get
                  started.
                </p>
                <Button onClick={handleCreateNote} className="gap-2">
                  <Menu className="h-4 w-4" />
                  Create New Note
                </Button>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Mobile sidebar toggle button (fixed at bottom) */}
      {isMobile && !isSidebarOpen && (
        <Button
          onClick={toggleSidebar}
          className="fixed bottom-4 left-4 z-30 rounded-full shadow-lg"
          size="icon"
          aria-label="Open sidebar"
        >
          <Menu className="h-5 w-5" />
        </Button>
      )}
    </div>
  )
}
