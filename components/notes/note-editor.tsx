'use client'

import { useState, useEffect, useRef } from 'react'
import { Note } from '@/lib/types'
import { generateId, saveNote, deleteNote } from '@/lib/note-utils'
import { saveNoteToDb, deleteNoteFromDb } from '@/lib/db-utils'
import { FileText, PlusCircle, Wand2 } from 'lucide-react'
import { AiActions } from '@/components/ai/ai-actions'
import { MarkdownEditor } from '@/components/notes/markdown-editor'
import { ShareDialog } from '@/components/notes/share-dialog'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

// Import our new components
import { NoteActions } from '@/components/notes/note-actions'

interface NoteEditorProps {
  note?: Note
  onSave: (note: Note) => void
  onDelete: (id: string) => void
  onCreateNote: () => void
}

export function NoteEditor({
  note,
  onSave,
  onDelete,
  onCreateNote,
}: NoteEditorProps) {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [showAiPanel, setShowAiPanel] = useState(false)
  const [lastSaved, setLastSaved] = useState<Date | null>(null)
  const [autoSaveEnabled, setAutoSaveEnabled] = useState(true)
  const [autoSaveInterval] = useState(2000) // 2 seconds
  const [contentChanged, setContentChanged] = useState(false)
  const [titleChanged, setTitleChanged] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const shareDialogRef = useRef<{ openDialog: () => void } | null>(null)

  // Initialize state when note changes
  useEffect(() => {
    if (note) {
      setTitle(note.title)
      setContent(note.content)
      setIsEditing(true)
      setContentChanged(false)
      setTitleChanged(false)
      setLastSaved(new Date(note.updatedAt))
    } else {
      setTitle('')
      setContent('')
      setIsEditing(false)
      setContentChanged(false)
      setTitleChanged(false)
      setLastSaved(null)
    }
  }, [note])

  // Handle content changes
  const handleContentChange = (newContent: string) => {
    setContent(newContent)
    setContentChanged(true)
  }

  // Handle title changes
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value)
    setTitleChanged(true)
  }

  // Save the note with real-time updates
  const handleSave = async () => {
    // Don't save if nothing changed
    if (!contentChanged && !titleChanged && note) {
      return
    }

    setIsSaving(true)
    try {
      const now = new Date().toISOString()
      const updatedNote: Note = {
        id: note?.id || generateId(),
        title: title || 'Untitled',
        content,
        createdAt: note?.createdAt || now,
        updatedAt: now,
        isShared: note?.isShared || false,
      }

      // Save to local storage with improved error handling
      const saveSuccess = saveNote(updatedNote)

      if (saveSuccess) {
        console.log('Note saved successfully')
        onSave(updatedNote)
        setLastSaved(new Date())
        setContentChanged(false)
        setTitleChanged(false)
      } else {
        console.error('Failed to save note to local storage')
        // Show error message to user
        alert(
          'Failed to save note. Please try again or check your browser storage settings.'
        )
      }

      // Show a brief animation or feedback
      setTimeout(() => {
        setIsSaving(false)
      }, 500)
    } catch (error) {
      console.error('Error saving note:', error)
      setIsSaving(false)
      alert('An error occurred while saving your note. Please try again.')
    }
  }

  // Autosave functionality
  useEffect(() => {
    // Only autosave if enabled, editing, and there are changes
    if (!autoSaveEnabled || !isEditing || (!contentChanged && !titleChanged)) {
      return
    }

    // Create a debounced save function
    const timer = setTimeout(() => {
      // Only log if we're actually going to save
      if (contentChanged || titleChanged) {
        console.log('Autosaving note...')
        handleSave()
      }
    }, autoSaveInterval)

    return () => clearTimeout(timer) // Clean up the timer
  }, [content, title, contentChanged, titleChanged, autoSaveEnabled, isEditing])

  const handleDelete = async () => {
    if (note?.id) {
      setIsDeleting(true)
      try {
        // Delete from local storage with improved error handling
        const deleteSuccess = deleteNote(note.id)

        if (deleteSuccess) {
          console.log('Note deleted successfully')
          onDelete(note.id)
        } else {
          console.error('Failed to delete note from local storage')
          // Show error message to user
          alert('Failed to delete note. Please try again.')
        }
      } catch (error) {
        console.error('Error deleting note:', error)
        alert('An error occurred while deleting your note. Please try again.')
      } finally {
        setIsDeleting(false)
      }
    }
  }

  // Apply to Note functionality has been removed

  if (!isEditing && !note) {
    return (
      <div className="flex items-center justify-center h-full">
        <Card className="max-w-md w-full shadow-sm border-0">
          <CardHeader className="text-center pb-2">
            <div className="flex justify-center mb-4">
              <FileText className="h-12 w-12 text-primary opacity-70" />
            </div>
            <CardTitle className="text-2xl font-light tracking-tight">
              AI Note
            </CardTitle>
            <CardDescription className="text-sm mt-1">
              Minimalist note-taking with AI assistance
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-center">
              <Button
                onClick={() => onCreateNote()}
                variant="outline"
                className="border-dashed border-border/60 hover:border-primary/60 transition-colors"
              >
                <PlusCircle className="h-4 w-4 mr-2 text-primary" />
                New Note
              </Button>
            </div>

            <div className="text-xs text-center text-muted-foreground space-y-1">
              <p>Use markdown for formatting</p>
              <p className="font-mono text-[10px] text-muted-foreground/70">
                # Heading · **Bold** · *Italic* · - List · ```Code```
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full" suppressHydrationWarning={true}>
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex-1 flex flex-col">
          <input
            type="text"
            value={title}
            onChange={handleTitleChange}
            placeholder="Note title"
            className="text-xl font-bold bg-transparent border-none outline-none w-full"
          />
          {lastSaved && (
            <div className="text-xs text-muted-foreground mt-1">
              {isSaving ? (
                <span className="text-primary">Saving...</span>
              ) : (
                <span>
                  Last saved: {lastSaved.toLocaleTimeString()}
                  {(contentChanged || titleChanged) && (
                    <span className="ml-2 text-amber-500">
                      (Unsaved changes)
                    </span>
                  )}
                </span>
              )}
            </div>
          )}
        </div>

        {/* Use our new NoteActions component */}
        <div className="flex items-center gap-2">
          <NoteActions
            note={note}
            onSave={handleSave}
            onDelete={handleDelete}
            onShare={() => shareDialogRef.current?.openDialog()}
            onToggleAI={() => setShowAiPanel(!showAiPanel)}
            showAiPanel={showAiPanel}
            autoSaveEnabled={autoSaveEnabled}
            onToggleAutoSave={() => setAutoSaveEnabled(!autoSaveEnabled)}
            isSaving={isSaving}
            hasChanges={contentChanged || titleChanged}
            isDeleting={isDeleting}
          />

          {/* Add the ShareDialog component but make it invisible */}
          {note && <ShareDialog note={note} ref={shareDialogRef} />}
        </div>
      </div>

      <div className="flex-1 overflow-hidden flex">
        <div
          className={cn(
            'flex-1 transition-all duration-300',
            showAiPanel ? 'w-2/3' : 'w-full'
          )}
        >
          <MarkdownEditor
            value={content}
            onChange={handleContentChange}
            placeholder="Start writing your note here using Markdown..."
            className="h-full w-full"
          />
        </div>
        {showAiPanel && (
          <div className="w-1/3 border-l overflow-y-auto p-4 bg-accent/30 backdrop-blur-sm">
            <AiActions noteContent={content} />
          </div>
        )}
      </div>
    </div>
  )
}
