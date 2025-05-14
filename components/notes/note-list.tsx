'use client'

import { useState, useEffect, useMemo } from 'react'
import { Note } from '@/lib/types'
import { getNotes, formatDate } from '@/lib/note-utils'
import { fetchNotes } from '@/lib/db-utils'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  PlusCircle,
  Search,
  FileText,
  Clock,
  CalendarDays,
  X,
  StickyNote,
  Loader2,
} from 'lucide-react'

interface NoteListProps {
  onSelectNote: (note: Note) => void
  onCreateNote: () => void
  selectedNoteId?: string
}

export function NoteList({
  onSelectNote,
  onCreateNote,
  selectedNoteId,
}: NoteListProps) {
  const [notes, setNotes] = useState<Note[]>([])
  const [isClient, setIsClient] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState<'updated' | 'created' | 'title'>(
    'updated'
  )
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    setIsClient(true)
    setIsLoading(true)

    // Function to load notes
    const loadNotes = async () => {
      try {
        // Load notes from local storage
        console.log('Loading notes from local storage')
        const localNotes = getNotes()
        setNotes(localNotes)
      } catch (error) {
        console.error('Error loading notes:', error)
        setNotes([])
      } finally {
        setIsLoading(false)
      }
    }

    loadNotes()

    // Function to refresh notes
    const refreshNotes = async () => {
      console.log('Refreshing notes')
      try {
        // Try to use the fetchNotes function which now uses local storage
        const notes = await fetchNotes()
        setNotes(notes)
      } catch (error) {
        console.error('Error refreshing notes:', error)
        // Fallback to direct local storage access
        setNotes(getNotes())
      }
    }

    // Set up event listeners for note changes
    const handleNoteDeleted = (event: CustomEvent) => {
      console.log('Note deleted event received:', event.detail.id)
      refreshNotes()
    }

    const handleNoteCreated = (event: CustomEvent) => {
      console.log('Note created event received:', event.detail.note.id)
      refreshNotes()
    }

    const handleNoteUpdated = (event: CustomEvent) => {
      console.log('Note updated event received:', event.detail.note.id)
      refreshNotes()
    }

    // Set up event listener for storage changes (for cross-tab sync)
    window.addEventListener('storage', refreshNotes)

    // Set up custom event listeners
    window.addEventListener('note-deleted', handleNoteDeleted as EventListener)
    window.addEventListener('note-created', handleNoteCreated as EventListener)
    window.addEventListener('note-updated', handleNoteUpdated as EventListener)

    return () => {
      // Clean up all event listeners
      window.removeEventListener('storage', refreshNotes)
      window.removeEventListener(
        'note-deleted',
        handleNoteDeleted as EventListener
      )
      window.removeEventListener(
        'note-created',
        handleNoteCreated as EventListener
      )
      window.removeEventListener(
        'note-updated',
        handleNoteUpdated as EventListener
      )
    }
  }, [])

  const filteredAndSortedNotes = useMemo(() => {
    // First filter by search query
    let result = notes
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      result = notes.filter(
        note =>
          note.title.toLowerCase().includes(query) ||
          note.content.toLowerCase().includes(query)
      )
    }

    // Then sort
    return [...result].sort((a, b) => {
      if (sortBy === 'updated') {
        return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
      } else if (sortBy === 'created') {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      } else {
        return a.title.localeCompare(b.title)
      }
    })
  }, [notes, searchQuery, sortBy])

  const handleCreateNewNote = () => {
    setSearchQuery('')
    onCreateNote()
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center">
          <StickyNote className="h-5 w-5 mr-2 text-primary" />
          <h2 className="text-xl font-bold">Notes</h2>
        </div>
        <Button
          onClick={handleCreateNewNote}
          variant="ghost"
          size="icon"
          className="hover:bg-primary/10 hover:text-primary transition-colors"
        >
          <PlusCircle className="h-5 w-5" />
        </Button>
      </div>

      <div className="p-3 border-b">
        <div className="relative">
          <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search notes..."
            className="w-full pl-8 pr-8 py-2 text-sm bg-accent/50 border-0 rounded-md focus:ring-1 focus:ring-primary focus:outline-none"
          />
          {searchQuery && (
            <Button
              onClick={() => setSearchQuery('')}
              variant="ghost"
              size="icon"
              className="absolute right-1 top-1/2 transform -translate-y-1/2 h-6 w-6 hover:bg-transparent"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

      <div className="flex border-b px-2">
        <button
          onClick={() => setSortBy('updated')}
          className={cn(
            'flex items-center justify-center flex-1 py-2 text-xs font-medium border-b-2 transition-colors',
            sortBy === 'updated'
              ? 'border-primary text-primary'
              : 'border-transparent text-muted-foreground hover:text-foreground'
          )}
        >
          <Clock className="h-3 w-3 mr-1" />
          Recent
        </button>
        <button
          onClick={() => setSortBy('created')}
          className={cn(
            'flex items-center justify-center flex-1 py-2 text-xs font-medium border-b-2 transition-colors',
            sortBy === 'created'
              ? 'border-primary text-primary'
              : 'border-transparent text-muted-foreground hover:text-foreground'
          )}
        >
          <CalendarDays className="h-3 w-3 mr-1" />
          Created
        </button>
        <button
          onClick={() => setSortBy('title')}
          className={cn(
            'flex items-center justify-center flex-1 py-2 text-xs font-medium border-b-2 transition-colors',
            sortBy === 'title'
              ? 'border-primary text-primary'
              : 'border-transparent text-muted-foreground hover:text-foreground'
          )}
        >
          <FileText className="h-3 w-3 mr-1" />
          Title
        </button>
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-hide">
        {!isClient || isLoading ? (
          <div className="flex flex-col items-center justify-center h-full p-4 text-center text-muted-foreground">
            <Loader2 className="h-6 w-6 animate-spin mb-2 text-primary" />
            <p>Loading notes...</p>
          </div>
        ) : filteredAndSortedNotes.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full p-4 text-center text-muted-foreground">
            {searchQuery ? (
              <>
                <Search className="h-10 w-10 mb-3 opacity-20" />
                <p className="font-medium">No matching notes</p>
                <p className="text-sm mt-1">Try a different search term</p>
              </>
            ) : (
              <>
                <FileText className="h-10 w-10 mb-3 opacity-20" />
                <p className="font-medium">No notes yet</p>
                <p className="text-sm mt-1">Create one to get started</p>
                <Button
                  onClick={handleCreateNewNote}
                  variant="outline"
                  size="sm"
                  className="mt-4"
                >
                  <PlusCircle className="h-4 w-4 mr-2" />
                  New Note
                </Button>
              </>
            )}
          </div>
        ) : (
          <ul className="divide-y overflow-y-auto">
            {filteredAndSortedNotes.map(note => {
              // Extract first line for title display
              const firstLine = note.content.split('\n')[0] || ''
              const firstLineContent = firstLine.replace(/^#+ /, '').trim()

              return (
                <li key={note.id}>
                  <button
                    onClick={() => onSelectNote(note)}
                    className={cn(
                      'w-full text-left p-4 hover:bg-accent transition-colors',
                      selectedNoteId === note.id &&
                        'bg-accent/70 border-l-2 border-primary'
                    )}
                  >
                    <h3 className="font-medium truncate">
                      {note.title || firstLineContent || 'Untitled'}
                    </h3>
                    <p className="text-sm text-muted-foreground truncate mt-1">
                      {note.content.substring(0, 100).replace(/^#+ .*\n/, '')}
                      {note.content.length > 100 ? '...' : ''}
                    </p>
                    <div className="flex items-center mt-2 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3 mr-1" />
                      <span>{formatDate(new Date(note.updatedAt))}</span>

                      {/* Show word count */}
                      <span className="mx-2">•</span>
                      <span>
                        {note.content.split(/\s+/).filter(Boolean).length} words
                      </span>
                    </div>
                  </button>
                </li>
              )
            })}
          </ul>
        )}
      </div>
    </div>
  )
}
