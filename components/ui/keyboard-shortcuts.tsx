'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Keyboard, X } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ShortcutItem {
  key: string
  description: string
  category: string
}

const shortcuts: ShortcutItem[] = [
  // Navigation Shortcuts
  { key: 'Ctrl+/', description: 'Toggle sidebar', category: 'Navigation' },
  { key: 'Ctrl+N', description: 'Create new note', category: 'Navigation' },
  {
    key: 'Ctrl+K',
    description: 'Open search/command palette',
    category: 'Navigation',
  },
  { key: 'Ctrl+,', description: 'Open settings', category: 'Navigation' },
  {
    key: 'Ctrl+Tab',
    description: 'Switch to next note',
    category: 'Navigation',
  },
  {
    key: 'Ctrl+Shift+Tab',
    description: 'Switch to previous note',
    category: 'Navigation',
  },
  { key: 'Alt+1', description: 'Go to first note', category: 'Navigation' },
  { key: 'Alt+2-9', description: 'Go to nth note', category: 'Navigation' },
  {
    key: 'Ctrl+Home',
    description: 'Go to top of document',
    category: 'Navigation',
  },
  {
    key: 'Ctrl+End',
    description: 'Go to end of document',
    category: 'Navigation',
  },

  // Editor Shortcuts
  { key: 'Ctrl+S', description: 'Save current note', category: 'Editor' },
  {
    key: 'Ctrl+E',
    description: 'Toggle edit/preview mode',
    category: 'Editor',
  },
  { key: 'Ctrl+Z', description: 'Undo', category: 'Editor' },
  { key: 'Ctrl+Shift+Z', description: 'Redo', category: 'Editor' },
  { key: 'Ctrl+Y', description: 'Redo (alternative)', category: 'Editor' },
  { key: 'Tab', description: 'Indent text', category: 'Editor' },
  { key: 'Shift+Tab', description: 'Unindent text', category: 'Editor' },
  { key: 'Ctrl+F', description: 'Find in note', category: 'Editor' },
  { key: 'Ctrl+G', description: 'Find next', category: 'Editor' },
  { key: 'Ctrl+Shift+G', description: 'Find previous', category: 'Editor' },
  { key: 'Ctrl+H', description: 'Find and replace', category: 'Editor' },
  { key: 'Ctrl+A', description: 'Select all', category: 'Editor' },
  { key: 'Ctrl+X', description: 'Cut', category: 'Editor' },
  { key: 'Ctrl+C', description: 'Copy', category: 'Editor' },
  { key: 'Ctrl+V', description: 'Paste', category: 'Editor' },
  { key: 'Ctrl+D', description: 'Duplicate line', category: 'Editor' },
  { key: 'Ctrl+Backspace', description: 'Delete word', category: 'Editor' },
  {
    key: 'Ctrl+Delete',
    description: 'Delete word forward',
    category: 'Editor',
  },

  // Formatting Shortcuts
  { key: 'Ctrl+B', description: 'Bold text', category: 'Formatting' },
  { key: 'Ctrl+I', description: 'Italic text', category: 'Formatting' },
  { key: 'Ctrl+U', description: 'Underline text', category: 'Formatting' },
  { key: 'Ctrl+K', description: 'Insert link', category: 'Formatting' },
  { key: 'Ctrl+Shift+1', description: 'Heading 1', category: 'Formatting' },
  { key: 'Ctrl+Shift+2', description: 'Heading 2', category: 'Formatting' },
  { key: 'Ctrl+Shift+3', description: 'Heading 3', category: 'Formatting' },
  { key: 'Ctrl+Shift+.', description: 'Bullet list', category: 'Formatting' },
  { key: 'Ctrl+Shift+/', description: 'Numbered list', category: 'Formatting' },
  { key: 'Ctrl+`', description: 'Code block', category: 'Formatting' },
  { key: 'Ctrl+Shift+C', description: 'Inline code', category: 'Formatting' },
  { key: 'Ctrl+Shift+Q', description: 'Quote', category: 'Formatting' },
  {
    key: 'Ctrl+Shift+H',
    description: 'Horizontal rule',
    category: 'Formatting',
  },
  { key: 'Ctrl+Shift+I', description: 'Insert image', category: 'Formatting' },
  { key: 'Ctrl+Shift+T', description: 'Insert table', category: 'Formatting' },
  { key: 'Ctrl+Shift+X', description: 'Strikethrough', category: 'Formatting' },
  {
    key: 'Ctrl+Shift+B',
    description: 'Checkbox/task list',
    category: 'Formatting',
  },

  // AI Features
  { key: 'Alt+S', description: 'Summarize content', category: 'AI Features' },
  { key: 'Alt+I', description: 'Improve writing', category: 'AI Features' },
  { key: 'Alt+O', description: 'Generate outline', category: 'AI Features' },
  { key: 'Alt+F', description: 'Format as markdown', category: 'AI Features' },
  { key: 'Alt+T', description: 'Translate content', category: 'AI Features' },
  { key: 'Alt+G', description: 'Generate content', category: 'AI Features' },
  {
    key: 'Alt+C',
    description: 'Check grammar and spelling',
    category: 'AI Features',
  },
  {
    key: 'Alt+E',
    description: 'Explain selected text',
    category: 'AI Features',
  },
  {
    key: 'Alt+R',
    description: 'Rewrite selected text',
    category: 'AI Features',
  },
  {
    key: 'Alt+P',
    description: 'Paraphrase selected text',
    category: 'AI Features',
  },

  // View Shortcuts
  { key: 'F11', description: 'Toggle fullscreen', category: 'View' },
  { key: 'Ctrl+Shift+F', description: 'Toggle focus mode', category: 'View' },
  { key: 'Ctrl++', description: 'Zoom in', category: 'View' },
  { key: 'Ctrl+-', description: 'Zoom out', category: 'View' },
  { key: 'Ctrl+0', description: 'Reset zoom', category: 'View' },
  {
    key: 'Ctrl+Shift+D',
    description: 'Toggle dark/light mode',
    category: 'View',
  },
  { key: 'Ctrl+Shift+M', description: 'Toggle sidebar', category: 'View' },
  {
    key: 'Ctrl+Shift+P',
    description: 'Toggle preview panel',
    category: 'View',
  },
  { key: 'Ctrl+Shift+A', description: 'Toggle AI panel', category: 'View' },

  // File Management
  { key: 'Ctrl+Shift+S', description: 'Save as', category: 'File Management' },
  { key: 'Ctrl+O', description: 'Open note', category: 'File Management' },
  { key: 'Ctrl+W', description: 'Close note', category: 'File Management' },
  { key: 'Ctrl+P', description: 'Print note', category: 'File Management' },
  {
    key: 'Ctrl+Shift+E',
    description: 'Export note',
    category: 'File Management',
  },
  {
    key: 'Ctrl+Shift+I',
    description: 'Import note',
    category: 'File Management',
  },
  { key: 'Ctrl+Alt+S', description: 'Share note', category: 'File Management' },
  {
    key: 'Ctrl+Alt+D',
    description: 'Delete note',
    category: 'File Management',
  },
  {
    key: 'Ctrl+Alt+R',
    description: 'Rename note',
    category: 'File Management',
  },

  // Help Shortcuts
  { key: 'F1', description: 'Open help', category: 'Help' },
  {
    key: 'Ctrl+Shift+H',
    description: 'Open help (alternative)',
    category: 'Help',
  },
  {
    key: 'Ctrl+Shift+K',
    description: 'Show keyboard shortcuts',
    category: 'Help',
  },
  { key: 'Esc', description: 'Close dialogs/panels', category: 'Help' },
]

export function KeyboardShortcuts() {
  const [isOpen, setIsOpen] = useState(false)

  // Listen for keyboard shortcut to open the modal
  useEffect(() => {
    // Only run in browser environment
    if (typeof window === 'undefined') return

    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl/Cmd + Shift + K to show keyboard shortcuts
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'k') {
        e.preventDefault()
        setIsOpen(true)
      }

      // Escape to close
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen])

  // Group shortcuts by category
  const groupedShortcuts = shortcuts.reduce((acc, shortcut) => {
    if (!acc[shortcut.category]) {
      acc[shortcut.category] = []
    }
    acc[shortcut.category].push(shortcut)
    return acc
  }, {} as Record<string, ShortcutItem[]>)

  return (
    <>
      <Button
        variant="ghost"
        size="sm"
        className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground h-8 px-2"
        onClick={() => setIsOpen(true)}
      >
        <Keyboard className="h-3.5 w-3.5" />
        <span>Shortcuts</span>
      </Button>

      {/* Modal overlay */}
      {isOpen && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-[9999] flex items-center justify-center p-4">
          <div
            className={cn(
              'bg-background border rounded-lg shadow-lg w-full max-w-3xl max-h-[85vh]',
              'animate-fade-in'
            )}
            style={{ position: 'relative' }}
          >
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="text-lg font-semibold">Keyboard Shortcuts</h2>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsOpen(false)}
                className="hover:bg-accent/50 transition-colors"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            <div
              className="p-4 space-y-4 overflow-y-auto"
              style={{
                maxHeight: 'calc(85vh - 120px)',
                scrollbarWidth: 'none',
                msOverflowStyle: 'none',
              }}
            >
              {Object.entries(groupedShortcuts).map(([category, items]) => (
                <div key={category} className="mb-4 last:mb-0">
                  <h3 className="text-sm font-medium text-muted-foreground mb-2">
                    {category}
                  </h3>
                  <div className="space-y-1">
                    {items.map(shortcut => (
                      <div
                        key={shortcut.key}
                        className="flex justify-between text-sm items-center py-1"
                      >
                        <span className="flex-grow text-foreground">
                          {shortcut.description}
                        </span>
                        <kbd className="px-2 py-0.5 bg-muted rounded text-xs font-mono whitespace-nowrap flex-shrink-0 min-w-[80px] text-right">
                          {shortcut.key}
                        </kbd>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="p-2 border-t text-center text-xs text-muted-foreground">
              Press{' '}
              <kbd className="px-1 py-0.5 bg-muted rounded text-xs font-mono">
                Esc
              </kbd>{' '}
              to close or{' '}
              <kbd className="px-1 py-0.5 bg-muted rounded text-xs font-mono">
                Ctrl+Shift+K
              </kbd>{' '}
              to toggle
            </div>
          </div>
        </div>
      )}
    </>
  )
}
