export interface Note {
  id: string
  title: string
  content: string
  createdAt: string
  updatedAt: string
  isShared?: boolean
}

export interface SharedNote {
  noteId: string
  shareId: string
  createdAt: string
  expiresAt?: string
  isPublic: boolean
}
