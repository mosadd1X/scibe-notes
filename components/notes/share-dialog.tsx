'use client'

import { useState, forwardRef, useImperativeHandle } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { shareNote } from '@/lib/db-utils'
import { Note } from '@/lib/types'
import { Copy, Check, Share2, Loader2 } from 'lucide-react'

interface ShareDialogProps {
  note: Note
}

export type ShareDialogRef = {
  openDialog: () => void
}

export const ShareDialog = forwardRef<ShareDialogRef, ShareDialogProps>(
  ({ note }, ref) => {
    const [isOpen, setIsOpen] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [shareUrl, setShareUrl] = useState('')
    const [copied, setCopied] = useState(false)
    const [error, setError] = useState('')

    // Expose the openDialog method to parent components
    useImperativeHandle(ref, () => ({
      openDialog: () => setIsOpen(true),
    }))

    const handleShare = async () => {
      setIsLoading(true)
      setError('')

      try {
        console.log('Sharing note with ID:', note.id)
        const result = await shareNote(note.id)

        if (result) {
          console.log('Share result:', result)
          setShareUrl(result.shareUrl)
        } else {
          setError(
            'Failed to create share link. Please make sure you are logged in.'
          )
        }
      } catch (err) {
        console.error('Error in handleShare:', err)
        setError(
          'An error occurred while sharing the note. Please make sure you are logged in.'
        )
      } finally {
        setIsLoading(false)
      }
    }

    const handleCopy = () => {
      navigator.clipboard.writeText(shareUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }

    const handleOpenChange = (open: boolean) => {
      setIsOpen(open)
      if (!open) {
        // Reset state when dialog closes
        setShareUrl('')
        setCopied(false)
        setError('')
      }
    }

    return (
      <Dialog open={isOpen} onOpenChange={handleOpenChange}>
        {/* Remove the DialogTrigger since we'll open it programmatically */}
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Share Note</DialogTitle>
            <DialogDescription>
              Create a shareable link for your note that anyone can access
            </DialogDescription>
          </DialogHeader>

          {error && (
            <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-md">
              {error}
            </div>
          )}

          {!shareUrl ? (
            <div className="flex flex-col gap-4 py-4">
              <p className="text-sm">
                This will create a public link to your note that anyone with the
                link can view.
              </p>
              <Button onClick={handleShare} disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Creating link...
                  </>
                ) : (
                  <>
                    <Share2 className="h-4 w-4 mr-2" />
                    Create Share Link
                  </>
                )}
              </Button>
            </div>
          ) : (
            <div className="flex flex-col gap-4 py-4">
              <div className="flex flex-col gap-2">
                <Label htmlFor="share-link">Share Link</Label>
                <div className="flex items-center gap-2">
                  <Input
                    id="share-link"
                    value={shareUrl}
                    readOnly
                    className="flex-1"
                  />
                  <Button size="icon" onClick={handleCopy} variant="outline">
                    {copied ? (
                      <Check className="h-4 w-4" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Anyone with this link can view this note
                </p>
              </div>
            </div>
          )}

          <DialogFooter className="sm:justify-end">
            {/* Only one close button */}
            <Button variant="secondary" onClick={() => setIsOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    )
  }
)
