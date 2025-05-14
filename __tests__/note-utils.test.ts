import {
  generateId,
  formatDate,
  formatTime,
  saveNote,
  getNotes,
  deleteNote,
  searchNotes,
} from '@/lib/note-utils'
import { Note } from '@/lib/types'

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {}
  return {
    getItem: jest.fn((key: string) => store[key] || null),
    setItem: jest.fn((key: string, value: string) => {
      store[key] = value
    }),
    removeItem: jest.fn((key: string) => {
      delete store[key]
    }),
    clear: jest.fn(() => {
      store = {}
    }),
    length: 0,
    key: jest.fn((index: number) => ''),
  }
})()

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
})

describe('Note Utilities', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    localStorageMock.clear()
  })

  describe('generateId', () => {
    it('should generate a unique ID', () => {
      const id1 = generateId()
      const id2 = generateId()
      expect(id1).not.toBe(id2)
      expect(id1).toMatch(/^\d+-[a-z0-9]+$/)
    })
  })

  describe('formatDate', () => {
    it('should format a date correctly', () => {
      const date = new Date('2023-01-15T12:00:00Z')
      const formatted = formatDate(date)
      expect(formatted).toMatch(/Jan 15, 2023/)
    })
  })

  describe('formatTime', () => {
    it('should format a time correctly', () => {
      const date = new Date('2023-01-15T12:00:00Z')
      const formatted = formatTime(date)
      // This test might be timezone dependent
      expect(formatted).toContain(':00:00')
    })
  })

  describe('saveNote and getNotes', () => {
    it('should save and retrieve notes', () => {
      const note: Note = {
        id: 'test-id',
        title: 'Test Note',
        content: 'Test content',
        createdAt: '2023-01-15T12:00:00Z',
        updatedAt: '2023-01-15T12:00:00Z',
      }

      saveNote(note)
      expect(localStorageMock.setItem).toHaveBeenCalled()

      // Mock the localStorage.getItem to return our test note
      localStorageMock.getItem.mockReturnValueOnce(JSON.stringify([note]))

      const notes = getNotes()
      expect(notes).toHaveLength(1)
      expect(notes[0].id).toBe('test-id')
      expect(notes[0].title).toBe('Test Note')
    })
  })

  describe('deleteNote', () => {
    it('should delete a note', () => {
      const note1: Note = {
        id: 'test-id-1',
        title: 'Test Note 1',
        content: 'Test content 1',
        createdAt: '2023-01-15T12:00:00Z',
        updatedAt: '2023-01-15T12:00:00Z',
      }
      const note2: Note = {
        id: 'test-id-2',
        title: 'Test Note 2',
        content: 'Test content 2',
        createdAt: '2023-01-15T12:00:00Z',
        updatedAt: '2023-01-15T12:00:00Z',
      }

      // Mock localStorage to return our test notes
      localStorageMock.getItem.mockReturnValueOnce(JSON.stringify([note1, note2]))

      deleteNote('test-id-1')
      expect(localStorageMock.setItem).toHaveBeenCalled()

      // Check that the correct note was deleted
      const setItemCall = localStorageMock.setItem.mock.calls[0]
      const savedNotes = JSON.parse(setItemCall[1])
      expect(savedNotes).toHaveLength(1)
      expect(savedNotes[0].id).toBe('test-id-2')
    })
  })

  describe('searchNotes', () => {
    it('should search notes by query', () => {
      const notes: Note[] = [
        {
          id: 'test-id-1',
          title: 'Apple Pie Recipe',
          content: 'How to make an apple pie',
          createdAt: '2023-01-15T12:00:00Z',
          updatedAt: '2023-01-15T12:00:00Z',
        },
        {
          id: 'test-id-2',
          title: 'Banana Bread',
          content: 'Delicious banana bread recipe',
          createdAt: '2023-01-15T12:00:00Z',
          updatedAt: '2023-01-15T12:00:00Z',
        },
      ]

      // Mock localStorage to return our test notes
      localStorageMock.getItem.mockReturnValueOnce(JSON.stringify(notes))

      const results = searchNotes('apple')
      expect(results).toHaveLength(1)
      expect(results[0].id).toBe('test-id-1')
    })

    it('should return all notes if query is empty', () => {
      const notes: Note[] = [
        {
          id: 'test-id-1',
          title: 'Apple Pie Recipe',
          content: 'How to make an apple pie',
          createdAt: '2023-01-15T12:00:00Z',
          updatedAt: '2023-01-15T12:00:00Z',
        },
        {
          id: 'test-id-2',
          title: 'Banana Bread',
          content: 'Delicious banana bread recipe',
          createdAt: '2023-01-15T12:00:00Z',
          updatedAt: '2023-01-15T12:00:00Z',
        },
      ]

      // Mock localStorage to return our test notes
      localStorageMock.getItem.mockReturnValueOnce(JSON.stringify(notes))

      const results = searchNotes('')
      expect(results).toHaveLength(2)
    })
  })
})
