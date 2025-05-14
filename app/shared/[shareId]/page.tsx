'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { fetchSharedNote } from '@/lib/db-utils'
import { Note } from '@/lib/types'
import { MarkdownEditor } from '@/components/notes/markdown-editor'
import { Button } from '@/components/ui/button'
import { Loader2, Copy, Check, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { formatDate } from '@/lib/note-utils'

export default function SharedNotePage() {
  const params = useParams()
  const shareId = params.shareId as string

  const [note, setNote] = useState<Note | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    async function loadSharedNote() {
      setIsLoading(true)
      try {
        const sharedNote = await fetchSharedNote(shareId)
        if (sharedNote) {
          setNote(sharedNote)
        } else {
          setError('Note not found or no longer shared')
        }
      } catch (err) {
        setError('Failed to load shared note')
        console.error(err)
      } finally {
        setIsLoading(false)
      }
    }

    if (shareId) {
      loadSharedNote()
    }
  }, [shareId])

  const handleCopyContent = () => {
    if (note) {
      navigator.clipboard.writeText(note.content)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
        <p>Loading shared note...</p>
      </div>
    )
  }

  if (error || !note) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <div className="max-w-md text-center">
          <h1 className="text-2xl font-bold mb-4">Shared Note Not Found</h1>
          <p className="mb-6">
            {error || 'This note may have been deleted or is no longer shared.'}
          </p>
          <Link href="/">
            <Button>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <header className="border-b p-4 bg-background/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div>
            <Link href="/" className="text-primary font-bold text-xl">
              AI Note
            </Link>
          </div>
          <Button variant="outline" size="sm" onClick={handleCopyContent}>
            {copied ? (
              <>
                <Check className="mr-2 h-4 w-4" />
                Copied!
              </>
            ) : (
              <>
                <Copy className="mr-2 h-4 w-4" />
                Copy Content
              </>
            )}
          </Button>
        </div>
      </header>

      <main className="flex-1 p-4 max-w-5xl mx-auto w-full">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">{note.title}</h1>
          <p className="text-sm text-muted-foreground">
            Last updated: {formatDate(new Date(note.updatedAt))}
          </p>
        </div>

        <div className="border rounded-md overflow-hidden">
          <MarkdownEditor
            value={note.content}
            onChange={() => {}}
            readOnly={true}
            className="min-h-[60vh]"
          />
        </div>
      </main>

      <footer className="border-t p-4 text-center text-sm text-muted-foreground">
        <p>
          This is a shared note from AI Note.{' '}
          <Link href="/" className="text-primary hover:underline">
            Create your own notes
          </Link>
        </p>
      </footer>
    </div>
  )
}
