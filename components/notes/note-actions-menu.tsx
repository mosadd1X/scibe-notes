'use client'

import { useState, useRef } from 'react'
import { 
  Download, 
  Upload, 
  Trash2, 
  AlertCircle,
  Check
} from 'lucide-react'
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from '@/components/ui/alert'
import { exportNotes, importNotes, clearAllNotes } from '@/lib/note-utils'

interface NoteActionsMenuProps {
  children: React.ReactNode
}

export function NoteActionsMenu({ children }: NoteActionsMenuProps) {
  const [showClearDialog, setShowClearDialog] = useState(false)
  const [showImportDialog, setShowImportDialog] = useState(false)
  const [importError, setImportError] = useState<string | null>(null)
  const [importSuccess, setImportSuccess] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleExport = () => {
    exportNotes()
  }

  const handleImportClick = () => {
    setImportError(null)
    setImportSuccess(false)
    setShowImportDialog(true)
  }

  const handleFileSelect = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (event) => {
      try {
        const jsonData = event.target?.result as string
        const success = importNotes(jsonData)
        
        if (success) {
          setImportSuccess(true)
          setImportError(null)
          // Reset the file input
          if (fileInputRef.current) {
            fileInputRef.current.value = ''
          }
          
          // Close the dialog after a short delay
          setTimeout(() => {
            setShowImportDialog(false)
            setImportSuccess(false)
          }, 1500)
        } else {
          setImportError('Failed to import notes. Please check the file format.')
        }
      } catch (error) {
        setImportError('Invalid JSON file. Please select a valid notes export file.')
        console.error('Error reading file:', error)
      }
    }
    reader.readAsText(file)
  }

  const handleClearNotes = () => {
    clearAllNotes()
    setShowClearDialog(false)
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          {children}
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel>Note Actions</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleExport}>
            <Download className="mr-2 h-4 w-4" />
            <span>Export Notes</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleImportClick}>
            <Upload className="mr-2 h-4 w-4" />
            <span>Import Notes</span>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem 
            onClick={() => setShowClearDialog(true)}
            className="text-destructive focus:text-destructive"
          >
            <Trash2 className="mr-2 h-4 w-4" />
            <span>Clear All Notes</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Clear Notes Confirmation Dialog */}
      <Dialog open={showClearDialog} onOpenChange={setShowClearDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Clear All Notes</DialogTitle>
            <DialogDescription>
              Are you sure you want to clear all notes? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Warning</AlertTitle>
            <AlertDescription>
              This will permanently delete all your notes from local storage.
            </AlertDescription>
          </Alert>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowClearDialog(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleClearNotes}>
              Clear All Notes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Import Notes Dialog */}
      <Dialog open={showImportDialog} onOpenChange={setShowImportDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Import Notes</DialogTitle>
            <DialogDescription>
              Select a JSON file containing notes to import.
            </DialogDescription>
          </DialogHeader>
          
          {importError && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{importError}</AlertDescription>
            </Alert>
          )}
          
          {importSuccess && (
            <Alert variant="success" className="bg-green-50 border-green-500 text-green-700">
              <Check className="h-4 w-4" />
              <AlertTitle>Success</AlertTitle>
              <AlertDescription>Notes imported successfully!</AlertDescription>
            </Alert>
          )}
          
          <input
            type="file"
            ref={fileInputRef}
            accept=".json"
            onChange={handleFileChange}
            className="hidden"
          />
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowImportDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleFileSelect}>
              Select File
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
