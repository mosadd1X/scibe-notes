import { Note } from './types'

// Generate a unique ID with timestamp for better uniqueness
export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 15)}`
}

// Format date to a readable string
export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(date)
}

// Format time to a readable string
export function formatTime(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
    hour12: true,
  }).format(date)
}

// Format relative time (e.g., "2 minutes ago")
export function formatRelativeTime(dateString: string): string {
  const date = new Date(dateString)
  const now = new Date()
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)

  if (diffInSeconds < 60) {
    return 'just now'
  } else if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60)
    return `${minutes} ${minutes === 1 ? 'minute' : 'minutes'} ago`
  } else if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600)
    return `${hours} ${hours === 1 ? 'hour' : 'hours'} ago`
  } else if (diffInSeconds < 604800) {
    const days = Math.floor(diffInSeconds / 86400)
    return `${days} ${days === 1 ? 'day' : 'days'} ago`
  } else {
    return formatDate(date)
  }
}

// Local storage key for notes
const NOTES_STORAGE_KEY = 'ainote_notes'

// Local storage helpers for notes with error handling
export function saveNotes(notes: Note[]): boolean {
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(NOTES_STORAGE_KEY, JSON.stringify(notes))
      return true
    } catch (error) {
      console.error('Error saving notes to local storage:', error)

      // Check if it's a quota exceeded error
      if (
        error instanceof DOMException &&
        error.name === 'QuotaExceededError'
      ) {
        // Try to clear some space by removing old data
        try {
          // Remove any old backup data
          localStorage.removeItem(`${NOTES_STORAGE_KEY}_backup`)
          // Try again
          localStorage.setItem(NOTES_STORAGE_KEY, JSON.stringify(notes))
          return true
        } catch (retryError) {
          console.error('Failed to save notes even after cleanup:', retryError)
          return false
        }
      }
      return false
    }
  }
  return false
}

export function getNotes(): Note[] {
  if (typeof window !== 'undefined') {
    try {
      const notes = localStorage.getItem(NOTES_STORAGE_KEY)
      return notes ? JSON.parse(notes) : []
    } catch (error) {
      console.error('Error reading notes from local storage:', error)

      // Try to recover from backup if available
      try {
        const backupNotes = localStorage.getItem(`${NOTES_STORAGE_KEY}_backup`)
        if (backupNotes) {
          console.log('Recovered notes from backup')
          return JSON.parse(backupNotes)
        }
      } catch (backupError) {
        console.error('Error reading backup notes:', backupError)
      }

      return []
    }
  }
  return []
}

// Create a backup of notes
export function backupNotes(): void {
  if (typeof window !== 'undefined') {
    try {
      const notes = localStorage.getItem(NOTES_STORAGE_KEY)
      if (notes) {
        localStorage.setItem(`${NOTES_STORAGE_KEY}_backup`, notes)
      }
    } catch (error) {
      console.error('Error creating backup of notes:', error)
    }
  }
}

// Real-time save with optimistic updates
export function saveNote(note: Note): boolean {
  try {
    const notes = getNotes()
    const existingNoteIndex = notes.findIndex(n => n.id === note.id)
    const isNewNote = existingNoteIndex === -1

    // Create a backup before making changes
    backupNotes()

    if (existingNoteIndex !== -1) {
      notes[existingNoteIndex] = note
    } else {
      notes.push(note)
    }

    const saveSuccess = saveNotes(notes)

    // Dispatch a custom event to notify components about the save
    if (typeof window !== 'undefined' && saveSuccess) {
      const eventName = isNewNote ? 'note-created' : 'note-updated'
      const noteChangeEvent = new CustomEvent(eventName, {
        detail: { note, timestamp: new Date().getTime() },
      })
      window.dispatchEvent(noteChangeEvent)

      // Also dispatch a storage event to ensure all tabs/windows are updated
      window.dispatchEvent(new Event('storage'))
    }

    return saveSuccess
  } catch (error) {
    console.error('Error in saveNote:', error)
    return false
  }
}

// Real-time delete with optimistic updates
export function deleteNote(id: string): boolean {
  try {
    const notes = getNotes()

    // Create a backup before making changes
    backupNotes()

    const filteredNotes = notes.filter(note => note.id !== id)
    const saveSuccess = saveNotes(filteredNotes)

    // Dispatch a custom event to notify components about the deletion
    if (typeof window !== 'undefined' && saveSuccess) {
      const noteChangeEvent = new CustomEvent('note-deleted', {
        detail: { id, timestamp: new Date().getTime() },
      })
      window.dispatchEvent(noteChangeEvent)

      // Also dispatch a storage event to ensure all tabs/windows are updated
      window.dispatchEvent(new Event('storage'))
    }

    return saveSuccess
  } catch (error) {
    console.error('Error in deleteNote:', error)
    return false
  }
}

// Clear all notes from local storage with backup
export function clearAllNotes(): boolean {
  if (typeof window !== 'undefined') {
    try {
      // Create a backup before clearing
      backupNotes()

      localStorage.removeItem(NOTES_STORAGE_KEY)

      // Dispatch a custom event to notify components about the clear
      const noteChangeEvent = new CustomEvent('notes-cleared', {
        detail: { timestamp: new Date().getTime() },
      })
      window.dispatchEvent(noteChangeEvent)

      // Also dispatch a storage event to ensure all tabs/windows are updated
      window.dispatchEvent(new Event('storage'))

      return true
    } catch (error) {
      console.error('Error clearing notes:', error)
      return false
    }
  }
  return false
}

// Restore notes from backup
export function restoreFromBackup(): boolean {
  if (typeof window !== 'undefined') {
    try {
      const backupNotes = localStorage.getItem(`${NOTES_STORAGE_KEY}_backup`)
      if (backupNotes) {
        localStorage.setItem(NOTES_STORAGE_KEY, backupNotes)

        // Dispatch events to notify components
        window.dispatchEvent(new Event('storage'))
        window.dispatchEvent(
          new CustomEvent('notes-restored', {
            detail: { timestamp: new Date().getTime() },
          })
        )

        return true
      }
      return false
    } catch (error) {
      console.error('Error restoring from backup:', error)
      return false
    }
  }
  return false
}

// Get storage usage statistics
export function getStorageStats(): {
  used: number
  total: number
  percentage: number
} {
  if (
    typeof window !== 'undefined' &&
    navigator.storage &&
    navigator.storage.estimate
  ) {
    try {
      // Default values
      let stats = { used: 0, total: 5 * 1024 * 1024, percentage: 0 }

      // Try to get actual storage usage
      navigator.storage.estimate().then(estimate => {
        if (estimate.usage && estimate.quota) {
          stats.used = estimate.usage
          stats.total = estimate.quota
          stats.percentage = Math.round((estimate.usage / estimate.quota) * 100)
        }
      })

      return stats
    } catch (error) {
      console.error('Error getting storage stats:', error)
    }
  }

  // Fallback: estimate based on notes size
  try {
    const notes = getNotes()
    const notesSize = new Blob([JSON.stringify(notes)]).size
    return {
      used: notesSize,
      total: 5 * 1024 * 1024, // Assume 5MB limit
      percentage: Math.round((notesSize / (5 * 1024 * 1024)) * 100),
    }
  } catch (error) {
    console.error('Error estimating storage usage:', error)
    return { used: 0, total: 5 * 1024 * 1024, percentage: 0 }
  }
}

// Export notes to a JSON file with error handling
export function exportNotes(): boolean {
  try {
    const notes = getNotes()
    if (notes.length === 0) {
      alert('No notes to export')
      return false
    }

    const dataStr = JSON.stringify(notes, null, 2)
    const blob = new Blob([dataStr], { type: 'application/json' })
    const url = URL.createObjectURL(blob)

    const exportFileDefaultName = `ainote-export-${new Date()
      .toISOString()
      .slice(0, 10)}.json`

    const linkElement = document.createElement('a')
    linkElement.setAttribute('href', url)
    linkElement.setAttribute('download', exportFileDefaultName)
    linkElement.style.display = 'none'
    document.body.appendChild(linkElement)
    linkElement.click()

    // Clean up
    setTimeout(() => {
      document.body.removeChild(linkElement)
      URL.revokeObjectURL(url)
    }, 100)

    return true
  } catch (error) {
    console.error('Error exporting notes:', error)
    return false
  }
}

// Export a single note as Markdown
export function exportNoteAsMarkdown(note: Note): boolean {
  try {
    if (!note) {
      alert('No note to export')
      return false
    }

    const fileName = `${note.title
      .replace(/[^a-z0-9]/gi, '-')
      .toLowerCase()}-${new Date().toISOString().slice(0, 10)}.md`
    const content = `# ${note.title}\n\n${note.content}`

    const blob = new Blob([content], { type: 'text/markdown' })
    const url = URL.createObjectURL(blob)

    const linkElement = document.createElement('a')
    linkElement.setAttribute('href', url)
    linkElement.setAttribute('download', fileName)
    linkElement.style.display = 'none'
    document.body.appendChild(linkElement)
    linkElement.click()

    // Clean up
    setTimeout(() => {
      document.body.removeChild(linkElement)
      URL.revokeObjectURL(url)
    }, 100)

    return true
  } catch (error) {
    console.error('Error exporting note as Markdown:', error)
    return false
  }
}

// Import notes from a JSON file with validation and error handling
export function importNotes(jsonData: string): {
  success: boolean
  count: number
  message?: string
} {
  try {
    const importedNotes = JSON.parse(jsonData) as Note[]

    // Validate the imported data
    if (!Array.isArray(importedNotes)) {
      return {
        success: false,
        count: 0,
        message: 'Invalid format: Expected an array of notes',
      }
    }

    // Check if each item has the required fields
    const validNotes: Note[] = []
    const invalidNotes: any[] = []

    for (const note of importedNotes) {
      if (
        !note.id ||
        !note.title ||
        !note.content ||
        !note.createdAt ||
        !note.updatedAt
      ) {
        invalidNotes.push(note)
      } else {
        validNotes.push(note)
      }
    }

    if (validNotes.length === 0) {
      return {
        success: false,
        count: 0,
        message: 'No valid notes found in the import file',
      }
    }

    // Create a backup before importing
    backupNotes()

    // Get existing notes
    const existingNotes = getNotes()

    // Merge notes, replacing existing ones with the same ID
    const mergedNotes = [...existingNotes]

    for (const importedNote of validNotes) {
      const existingIndex = mergedNotes.findIndex(n => n.id === importedNote.id)
      if (existingIndex !== -1) {
        mergedNotes[existingIndex] = importedNote
      } else {
        mergedNotes.push(importedNote)
      }
    }

    // Save the merged notes
    const saveSuccess = saveNotes(mergedNotes)

    if (!saveSuccess) {
      return {
        success: false,
        count: 0,
        message: 'Failed to save imported notes to storage',
      }
    }

    // Dispatch a custom event to notify components about the import
    if (typeof window !== 'undefined') {
      const noteChangeEvent = new CustomEvent('notes-imported', {
        detail: {
          count: validNotes.length,
          timestamp: new Date().getTime(),
        },
      })
      window.dispatchEvent(noteChangeEvent)

      // Also dispatch a storage event to ensure all tabs/windows are updated
      window.dispatchEvent(new Event('storage'))
    }

    let message = `Successfully imported ${validNotes.length} notes`
    if (invalidNotes.length > 0) {
      message += `. Skipped ${invalidNotes.length} invalid notes.`
    }

    return {
      success: true,
      count: validNotes.length,
      message,
    }
  } catch (error) {
    console.error('Error importing notes:', error)
    return {
      success: false,
      count: 0,
      message: `Error importing notes: ${
        error instanceof Error ? error.message : 'Unknown error'
      }`,
    }
  }
}

// Search notes by query
export function searchNotes(query: string): Note[] {
  if (!query.trim()) {
    return getNotes()
  }

  const notes = getNotes()
  const searchTerms = query
    .toLowerCase()
    .split(' ')
    .filter(term => term.length > 0)

  return notes.filter(note => {
    const titleLower = note.title.toLowerCase()
    const contentLower = note.content.toLowerCase()

    // Check if all search terms are found in either title or content
    return searchTerms.every(
      term => titleLower.includes(term) || contentLower.includes(term)
    )
  })
}

// Copy note content to clipboard
export function copyNoteToClipboard(note: Note): boolean {
  try {
    if (!note) return false

    const content = `# ${note.title}\n\n${note.content}`
    navigator.clipboard.writeText(content)
    return true
  } catch (error) {
    console.error('Error copying to clipboard:', error)
    return false
  }
}
