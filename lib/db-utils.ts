import { Note } from './types'
import {
  getNotes,
  saveNote as saveNoteToStorage,
  deleteNote as deleteNoteFromStorage,
  generateId,
} from './note-utils'

// Function to fetch notes from local storage
export async function fetchNotes(): Promise<Note[]> {
  try {
    // Get notes from local storage
    return getNotes()
  } catch (error) {
    console.error('Error fetching notes:', error)
    return []
  }
}

// Function to fetch a single note from local storage
export async function fetchNote(id: string): Promise<Note | null> {
  try {
    const notes = getNotes()
    const note = notes.find(note => note.id === id)
    return note || null
  } catch (error) {
    console.error(`Error fetching note ${id}:`, error)
    return null
  }
}

// Function to save a note to local storage
export async function saveNoteToDb(note: Note): Promise<Note | null> {
  try {
    // Make sure we have a valid note ID
    if (!note.id) {
      console.error('Cannot save note without ID')
      return null
    }

    // Save to local storage
    saveNoteToStorage(note)
    return note
  } catch (error) {
    console.error('Error saving note:', error)
    throw error // Re-throw to allow proper error handling
  }
}

// Function to delete a note from local storage
export async function deleteNoteFromDb(id: string): Promise<boolean> {
  try {
    deleteNoteFromStorage(id)
    return true
  } catch (error) {
    console.error(`Error deleting note ${id}:`, error)
    return false
  }
}

// Function to share a note (simplified version that just returns a shareId)
export async function shareNote(
  id: string
): Promise<{ shareId: string; shareUrl: string } | null> {
  try {
    console.log(`Sharing note with ID: ${id}`)

    // Generate a share ID
    const shareId = generateId()

    // Get the note
    const notes = getNotes()
    const note = notes.find(note => note.id === id)

    if (!note) {
      throw new Error('Note not found')
    }

    // Mark the note as shared
    note.isShared = true
    saveNoteToStorage(note)

    // In a real app, we would save the share info to a database
    // For now, we'll just return the shareId
    const shareUrl = `${window.location.origin}/shared/${shareId}`

    return {
      shareId,
      shareUrl,
    }
  } catch (error) {
    console.error(`Error sharing note ${id}:`, error)
    throw error
  }
}

// Function to fetch a shared note (simplified version)
export async function fetchSharedNote(shareId: string): Promise<Note | null> {
  try {
    // In a real app, we would look up the note by shareId in a database
    // For now, we'll just return null
    console.log(`Fetching shared note with shareId: ${shareId}`)
    return null
  } catch (error) {
    console.error(`Error fetching shared note ${shareId}:`, error)
    return null
  }
}
