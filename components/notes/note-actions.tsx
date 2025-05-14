'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Toggle } from '@/components/ui/toggle'
import { Separator } from '@/components/ui/separator'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import {
  Trash2,
  Save,
  Share2,
  Wand2,
  Loader2,
  Download,
  Copy,
  MoreHorizontal,
  Star,
  Archive,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Note } from '@/lib/types'
import { copyNoteToClipboard, exportNoteAsMarkdown } from '@/lib/note-utils'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

interface NoteActionsProps {
  note?: Note
  onSave: () => void
  onDelete: () => void
  onShare: () => void
  onToggleAI: () => void
  showAiPanel: boolean
  autoSaveEnabled: boolean
  onToggleAutoSave: () => void
  isSaving: boolean
  hasChanges: boolean
  isDeleting: boolean
}

export function NoteActions({
  note,
  onSave,
  onDelete,
  onShare,
  onToggleAI,
  showAiPanel,
  autoSaveEnabled,
  onToggleAutoSave,
  isSaving,
  hasChanges,
  isDeleting,
}: NoteActionsProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    if (!note) return

    const success = copyNoteToClipboard(note)
    if (success) {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } else {
      alert(
        'Failed to copy to clipboard. Your browser may not support this feature.'
      )
    }
  }

  const handleExport = () => {
    if (!note) return

    const success = exportNoteAsMarkdown(note)
    if (!success) {
      alert('Failed to export note. Please try again.')
    }
  }

  return (
    <div className="flex items-center gap-2">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Toggle
              pressed={showAiPanel}
              onPressedChange={onToggleAI}
              className={cn(
                'h-9 px-2.5',
                showAiPanel && 'bg-primary/10 text-primary hover:bg-primary/20'
              )}
            >
              <Wand2 className="h-4 w-4 mr-1.5" />
              <span className="text-sm">AI</span>
            </Toggle>
          </TooltipTrigger>
          <TooltipContent side="bottom">
            <p>Toggle AI Assistant</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Toggle
              pressed={autoSaveEnabled}
              onPressedChange={onToggleAutoSave}
              className={cn(
                'h-9 px-2.5',
                autoSaveEnabled &&
                  'bg-green-500/10 text-green-500 hover:bg-green-500/20'
              )}
            >
              <span className="text-sm">Autosave</span>
            </Toggle>
          </TooltipTrigger>
          <TooltipContent side="bottom">
            <p>{autoSaveEnabled ? 'Disable' : 'Enable'} autosave</p>
          </TooltipContent>
        </Tooltip>

        <Separator orientation="vertical" className="h-6 mx-1" />

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              onClick={onShare}
              variant="ghost"
              size="icon"
              className="h-9 w-9"
            >
              <Share2 className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="bottom">
            <p>Share note</p>
          </TooltipContent>
        </Tooltip>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-9 w-9">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuLabel>Note Actions</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleCopy}>
              <Copy className="mr-2 h-4 w-4" />
              <span>{copied ? 'Copied!' : 'Copy to clipboard'}</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleExport}>
              <Download className="mr-2 h-4 w-4" />
              <span>Export as Markdown</span>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Star className="mr-2 h-4 w-4" />
              <span>Add to favorites</span>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Archive className="mr-2 h-4 w-4" />
              <span>Archive note</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={onDelete}
              disabled={isDeleting}
              className="text-destructive focus:text-destructive"
            >
              {isDeleting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  <span>Deleting...</span>
                </>
              ) : (
                <>
                  <Trash2 className="mr-2 h-4 w-4" />
                  <span>Delete note</span>
                </>
              )}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <Separator orientation="vertical" className="h-6 mx-1" />

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              onClick={onSave}
              variant="default"
              size="sm"
              disabled={isSaving || !hasChanges}
              className="relative overflow-hidden"
            >
              {isSaving ? (
                <span className="flex items-center">
                  <Loader2 className="animate-spin mr-2 h-4 w-4" />
                  Saving
                </span>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Save
                </>
              )}
            </Button>
          </TooltipTrigger>
          <TooltipContent side="bottom">
            <p>Save note (Ctrl+S)</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  )
}
