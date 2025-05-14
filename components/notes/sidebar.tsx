'use client'

import { useState, useEffect, useMemo } from 'react'
import { Note } from '@/lib/types'
import { getNotes, formatDate } from '@/lib/note-utils'
import { fetchNotes } from '@/lib/db-utils'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  PlusCircle,
  Search,
  FileText,
  Clock,
  CalendarDays,
  X,
  StickyNote,
  Loader2,
  Tag,
  Star,
  Filter,
  SortAsc,
  SortDesc,
  Trash2,
  MoreVertical,
} from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

interface SidebarProps {
  onSelectNote: (note: Note) => void
  onCreateNote: () => void
  selectedNoteId?: string
}

export function Sidebar({
  onSelectNote,
  onCreateNote,
  selectedNoteId,
}: SidebarProps) {
  const [notes, setNotes] = useState<Note[]>([])
  const [isClient, setIsClient] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState<'updated' | 'created' | 'title'>(
    'updated'
  )
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc')
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('all')

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
  }, [])

  const filteredAndSortedNotes = useMemo(() => {
    // First filter by search query
    let result = notes

    if (activeTab === 'recent') {
      // Show only notes from the last 7 days
      const sevenDaysAgo = new Date()
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)
      result = result.filter(note => new Date(note.updatedAt) >= sevenDaysAgo)
    } else if (activeTab === 'favorites') {
      // This would require adding a "favorite" field to the Note type
      // For now, just show a sample of notes (e.g., first 3)
      result = result.slice(0, 3)
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      result = result.filter(
        note =>
          note.title.toLowerCase().includes(query) ||
          note.content.toLowerCase().includes(query)
      )
    }

    // Then sort
    return [...result].sort((a, b) => {
      let comparison = 0

      if (sortBy === 'updated') {
        comparison =
          new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
      } else if (sortBy === 'created') {
        comparison =
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      } else {
        comparison = a.title.localeCompare(b.title)
      }

      return sortDirection === 'desc' ? comparison : -comparison
    })
  }, [notes, searchQuery, sortBy, sortDirection, activeTab])

  const handleCreateNewNote = () => {
    setSearchQuery('')
    onCreateNote()
  }

  const toggleSortDirection = () => {
    setSortDirection(sortDirection === 'desc' ? 'asc' : 'desc')
  }

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b">
        <div className="flex items-center justify-between mb-4">
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

        <div className="relative mb-4">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search notes..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="pl-9 h-9"
          />
          {searchQuery && (
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-1 top-1 h-7 w-7"
              onClick={() => setSearchQuery('')}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>

        <div className="flex items-center justify-between">
          <Tabs
            defaultValue="all"
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className="grid grid-cols-3 h-8">
              <TabsTrigger value="all" className="text-xs">
                All
              </TabsTrigger>
              <TabsTrigger value="recent" className="text-xs">
                Recent
              </TabsTrigger>
              <TabsTrigger value="favorites" className="text-xs">
                Favorites
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>

      <div className="flex items-center justify-between px-4 py-2 border-b bg-muted/30">
        <div className="text-xs text-muted-foreground">
          {filteredAndSortedNotes.length}{' '}
          {filteredAndSortedNotes.length === 1 ? 'note' : 'notes'}
        </div>
        <div className="flex items-center gap-1">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-7 w-7">
                <Filter className="h-3.5 w-3.5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-40">
              <DropdownMenuLabel>Sort by</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => setSortBy('updated')}
                className={sortBy === 'updated' ? 'bg-accent' : ''}
              >
                <Clock className="mr-2 h-4 w-4" />
                <span>Last updated</span>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => setSortBy('created')}
                className={sortBy === 'created' ? 'bg-accent' : ''}
              >
                <CalendarDays className="mr-2 h-4 w-4" />
                <span>Created date</span>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => setSortBy('title')}
                className={sortBy === 'title' ? 'bg-accent' : ''}
              >
                <Tag className="mr-2 h-4 w-4" />
                <span>Title</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7"
            onClick={toggleSortDirection}
          >
            {sortDirection === 'desc' ? (
              <SortDesc className="h-3.5 w-3.5" />
            ) : (
              <SortAsc className="h-3.5 w-3.5" />
            )}
          </Button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
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
          <div className="divide-y">
            {filteredAndSortedNotes.map(note => {
              // Extract first line for title display
              const firstLine = note.content.split('\n')[0] || ''
              const firstLineContent = firstLine.replace(/^#+ /, '').trim()
              const displayTitle = note.title || firstLineContent || 'Untitled'

              // Get a preview of the content (excluding the first line if it's a title)
              const contentPreview = note.content
                .replace(firstLine, '')
                .trim()
                .slice(0, 100)

              return (
                <div
                  key={note.id}
                  className={cn(
                    'p-3 hover:bg-accent/50 transition-colors cursor-pointer group',
                    selectedNoteId === note.id &&
                      'bg-accent border-l-2 border-primary'
                  )}
                  onClick={() => onSelectNote(note)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium truncate">{displayTitle}</h3>
                      {contentPreview && (
                        <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                          {contentPreview}
                        </p>
                      )}
                      <div className="flex items-center mt-2 text-xs text-muted-foreground">
                        <Clock className="h-3 w-3 mr-1" />
                        <span>{formatDate(new Date(note.updatedAt))}</span>
                      </div>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={e => e.stopPropagation()}
                        >
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-40">
                        <DropdownMenuItem>
                          <Star className="mr-2 h-4 w-4" />
                          <span>Favorite</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive focus:text-destructive">
                          <Trash2 className="mr-2 h-4 w-4" />
                          <span>Delete</span>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
