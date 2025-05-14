'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import ReactMarkdown from 'react-markdown'
import rehypeRaw from 'rehype-raw'
import rehypeHighlight from 'rehype-highlight'
import remarkGfm from 'remark-gfm'
import { cn } from '@/lib/utils'

// Import our new EditorToolbar component
import { EditorToolbar } from '@/components/notes/editor-toolbar'

interface MarkdownEditorProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  className?: string
  readOnly?: boolean
}

export function MarkdownEditor({
  value,
  onChange,
  placeholder = 'Start writing with Markdown...',
  className,
  readOnly = false,
}: MarkdownEditorProps) {
  const [isPreview, setIsPreview] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const previewRef = useRef<HTMLDivElement>(null)
  const [scrollPosition, setScrollPosition] = useState(0)
  const [history, setHistory] = useState<string[]>([value])
  const [historyIndex, setHistoryIndex] = useState(0)
  const [showHelp, setShowHelp] = useState(false)

  // Add to history when value changes
  useEffect(() => {
    // Only add to history if the value is different from the current one
    if (value !== history[historyIndex]) {
      // Truncate history if we're not at the end
      const newHistory = history.slice(0, historyIndex + 1)
      // Add new value to history
      setHistory([...newHistory, value])
      setHistoryIndex(newHistory.length)
    }
  }, [value, history, historyIndex])

  // Undo/Redo functions
  const handleUndo = useCallback(() => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1)
      onChange(history[historyIndex - 1])
    }
  }, [historyIndex, history, onChange])

  const handleRedo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(historyIndex + 1)
      onChange(history[historyIndex + 1])
    }
  }, [historyIndex, history, onChange])

  // Keyboard shortcuts
  useEffect(() => {
    // Only run in browser environment
    if (typeof window === 'undefined') return

    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger shortcuts if user is typing in a form field
      if (
        e.target instanceof HTMLTextAreaElement ||
        e.target instanceof HTMLInputElement
      ) {
        // Allow only specific shortcuts in the editor
        if (e.ctrlKey || e.metaKey) {
          // Ctrl/Cmd + Z for undo
          if (e.key === 'z' && !e.shiftKey) {
            e.preventDefault()
            handleUndo()
          }

          // Ctrl/Cmd + Shift + Z or Ctrl/Cmd + Y for redo
          if ((e.key === 'z' && e.shiftKey) || e.key === 'y') {
            e.preventDefault()
            handleRedo()
          }

          // Ctrl/Cmd + E to toggle preview
          if (e.key === 'e') {
            e.preventDefault()
            setIsPreview(!isPreview)
          }

          // Focus mode removed

          // Formatting shortcuts
          if (e.key === 'b') {
            e.preventDefault()
            insertMarkdown('**', 'bold')
          }

          if (e.key === 'i') {
            e.preventDefault()
            insertMarkdown('*', 'italic')
          }

          if (e.key === 'u') {
            e.preventDefault()
            insertMarkdown('__', 'underlined')
          }

          if (e.key === 'k') {
            e.preventDefault()
            insertSpecialMarkdown('link')
          }

          if (e.key === '1' && e.shiftKey) {
            e.preventDefault()
            insertSpecialMarkdown('h1')
          }

          if (e.key === '2' && e.shiftKey) {
            e.preventDefault()
            insertSpecialMarkdown('h2')
          }

          if (e.key === '3' && e.shiftKey) {
            e.preventDefault()
            insertSpecialMarkdown('h3')
          }

          if (e.key === '.' && e.shiftKey) {
            e.preventDefault()
            insertSpecialMarkdown('ul')
          }

          if (e.key === '/' && e.shiftKey) {
            e.preventDefault()
            insertSpecialMarkdown('ol')
          }

          if (e.key === '`') {
            e.preventDefault()
            insertSpecialMarkdown('code')
          }

          if (e.key === 'c' && e.shiftKey) {
            e.preventDefault()
            insertSpecialMarkdown('inlinecode')
          }

          if (e.key === 'q' && e.shiftKey) {
            e.preventDefault()
            insertSpecialMarkdown('quote')
          }

          if (e.key === 'h' && e.shiftKey) {
            e.preventDefault()
            insertSpecialMarkdown('hr')
          }

          if (e.key === 'i' && e.shiftKey) {
            e.preventDefault()
            insertSpecialMarkdown('image')
          }

          if (e.key === 't' && e.shiftKey) {
            e.preventDefault()
            insertSpecialMarkdown('table')
          }

          if (e.key === 'x' && e.shiftKey) {
            e.preventDefault()
            insertSpecialMarkdown('strikethrough')
          }

          if (e.key === 'b' && e.shiftKey) {
            e.preventDefault()
            insertSpecialMarkdown('checkbox')
          }
        }

        return
      }

      // Global shortcuts (when not in a form field)
      // Ctrl/Cmd + Z for undo
      if ((e.ctrlKey || e.metaKey) && e.key === 'z' && !e.shiftKey) {
        e.preventDefault()
        handleUndo()
      }

      // Ctrl/Cmd + Shift + Z or Ctrl/Cmd + Y for redo
      if (
        (e.ctrlKey || e.metaKey) &&
        ((e.key === 'z' && e.shiftKey) || e.key === 'y')
      ) {
        e.preventDefault()
        handleRedo()
      }

      // Ctrl/Cmd + E to toggle preview
      if ((e.ctrlKey || e.metaKey) && e.key === 'e') {
        e.preventDefault()
        setIsPreview(!isPreview)
      }

      // Focus mode removed
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handleRedo, handleUndo, isPreview])

  // Sync scroll position between editor and preview
  useEffect(() => {
    // Only run in browser environment
    if (typeof window === 'undefined') return
    if (!isPreview || !textareaRef.current || !previewRef.current) return

    const textarea = textareaRef.current
    const preview = previewRef.current

    const handleScroll = () => {
      const scrollPercentage =
        textarea.scrollTop / (textarea.scrollHeight - textarea.clientHeight)
      const previewScrollPosition =
        scrollPercentage * (preview.scrollHeight - preview.clientHeight)

      setScrollPosition(previewScrollPosition)
    }

    textarea.addEventListener('scroll', handleScroll)
    return () => textarea.removeEventListener('scroll', handleScroll)
  }, [isPreview])

  useEffect(() => {
    // Only run in browser environment
    if (typeof window === 'undefined') return
    if (isPreview && previewRef.current) {
      previewRef.current.scrollTop = scrollPosition
    }
  }, [scrollPosition, isPreview])

  // Tab key handling for indentation
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Tab') {
      e.preventDefault()
      const start = e.currentTarget.selectionStart
      const end = e.currentTarget.selectionEnd
      const newValue = value.substring(0, start) + '  ' + value.substring(end)
      onChange(newValue)

      // Set cursor position after the inserted tab
      setTimeout(() => {
        if (textareaRef.current) {
          textareaRef.current.selectionStart =
            textareaRef.current.selectionEnd = start + 2
        }
      }, 0)
    }
  }

  // Insert markdown formatting
  const insertMarkdown = (markdownSymbol: string, placeholder: string = '') => {
    if (!textareaRef.current) return

    const textarea = textareaRef.current
    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const selectedText = value.substring(start, end)

    let newText = ''
    let newCursorPos = 0

    if (selectedText) {
      // If text is selected, wrap it with the markdown symbol
      newText =
        value.substring(0, start) +
        markdownSymbol +
        selectedText +
        markdownSymbol +
        value.substring(end)
      newCursorPos = end + markdownSymbol.length * 2
    } else {
      // If no text is selected, insert the markdown symbol with placeholder
      newText =
        value.substring(0, start) +
        markdownSymbol +
        placeholder +
        markdownSymbol +
        value.substring(end)
      newCursorPos = start + markdownSymbol.length + placeholder.length
    }

    onChange(newText)

    // Set cursor position
    setTimeout(() => {
      if (textareaRef.current) {
        textareaRef.current.focus()
        textareaRef.current.selectionStart = textareaRef.current.selectionEnd =
          newCursorPos
      }
    }, 0)
  }

  // Insert special markdown elements
  const insertSpecialMarkdown = (type: string) => {
    if (!textareaRef.current) return

    const textarea = textareaRef.current
    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const selectedText = value.substring(start, end)

    let newText = ''
    let newCursorPos = 0

    switch (type) {
      case 'h1':
        newText =
          value.substring(0, start) +
          '# ' +
          (selectedText || 'Heading') +
          value.substring(end)
        newCursorPos = end + 2 + (selectedText ? 0 : 7)
        break
      case 'h2':
        newText =
          value.substring(0, start) +
          '## ' +
          (selectedText || 'Heading') +
          value.substring(end)
        newCursorPos = end + 3 + (selectedText ? 0 : 7)
        break
      case 'h3':
        newText =
          value.substring(0, start) +
          '### ' +
          (selectedText || 'Heading') +
          value.substring(end)
        newCursorPos = end + 4 + (selectedText ? 0 : 7)
        break
      case 'ul':
        newText =
          value.substring(0, start) +
          '- ' +
          (selectedText || 'List item') +
          value.substring(end)
        newCursorPos = end + 2 + (selectedText ? 0 : 9)
        break
      case 'ol':
        newText =
          value.substring(0, start) +
          '1. ' +
          (selectedText || 'List item') +
          value.substring(end)
        newCursorPos = end + 3 + (selectedText ? 0 : 9)
        break
      case 'link':
        if (selectedText) {
          newText =
            value.substring(0, start) +
            '[' +
            selectedText +
            '](url)' +
            value.substring(end)
          newCursorPos = end + selectedText.length + 3
        } else {
          newText =
            value.substring(0, start) +
            '[Link text](url)' +
            value.substring(end)
          newCursorPos = start + 1
        }
        break
      case 'image':
        newText =
          value.substring(0, start) +
          '![' +
          (selectedText || 'Alt text') +
          '](image-url)' +
          value.substring(end)
        newCursorPos = end + 2 + (selectedText ? 0 : 8)
        break
      case 'code':
        newText =
          value.substring(0, start) +
          '```\n' +
          (selectedText || 'code') +
          '\n```' +
          value.substring(end)
        newCursorPos = end + 4 + (selectedText ? 0 : 4)
        break
      case 'inlinecode':
        newText =
          value.substring(0, start) +
          '`' +
          (selectedText || 'code') +
          '`' +
          value.substring(end)
        newCursorPos = end + 2 + (selectedText ? 0 : 4)
        break
      case 'quote':
        newText =
          value.substring(0, start) +
          '> ' +
          (selectedText || 'Quote') +
          value.substring(end)
        newCursorPos = end + 2 + (selectedText ? 0 : 5)
        break
      case 'hr':
        newText = value.substring(0, start) + '\n---\n' + value.substring(end)
        newCursorPos = end + 5
        break
      case 'table':
        newText =
          value.substring(0, start) +
          '\n| Header 1 | Header 2 |\n| -------- | -------- |\n| Cell 1   | Cell 2   |\n' +
          value.substring(end)
        newCursorPos = end + 65
        break
      case 'checkbox':
        newText =
          value.substring(0, start) +
          '- [ ] ' +
          (selectedText || 'Task') +
          value.substring(end)
        newCursorPos = end + 6 + (selectedText ? 0 : 4)
        break
      case 'strikethrough':
        newText =
          value.substring(0, start) +
          '~~' +
          (selectedText || 'text') +
          '~~' +
          value.substring(end)
        newCursorPos = end + 4 + (selectedText ? 0 : 4)
        break
    }

    onChange(newText)

    // Set cursor position
    setTimeout(() => {
      if (textareaRef.current) {
        textareaRef.current.focus()
        textareaRef.current.selectionStart = textareaRef.current.selectionEnd =
          newCursorPos
      }
    }, 0)
  }

  return (
    <div className={cn('flex flex-col h-full', className)}>
      {/* Use our new EditorToolbar component */}
      <EditorToolbar
        isPreview={isPreview}
        setIsPreview={setIsPreview}
        showHelp={showHelp}
        setShowHelp={setShowHelp}
        insertMarkdown={insertMarkdown}
        insertSpecialMarkdown={insertSpecialMarkdown}
        handleUndo={handleUndo}
        handleRedo={handleRedo}
        canUndo={historyIndex > 0}
        canRedo={historyIndex < history.length - 1}
      />

      <div className="relative flex-1 overflow-auto scrollbar-hide z-10">
        <textarea
          ref={textareaRef}
          value={value}
          onChange={e => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className={cn(
            'w-full h-full p-4 resize-none bg-transparent outline-none font-mono text-sm scrollbar-hide',
            'transition-opacity duration-200',
            isPreview
              ? 'absolute inset-0 opacity-0 pointer-events-none'
              : 'opacity-100'
          )}
          readOnly={readOnly}
          spellCheck="false"
        />

        <div
          ref={previewRef}
          className={cn(
            'absolute inset-0 p-4 overflow-auto scrollbar-hide prose prose-sm max-w-full w-full dark:prose-invert',
            'transition-opacity duration-200',
            isPreview ? 'opacity-100' : 'opacity-0 pointer-events-none'
          )}
          suppressHydrationWarning={true}
        >
          <div className="w-full" suppressHydrationWarning={true}>
            <ReactMarkdown
              rehypePlugins={[rehypeRaw, rehypeHighlight]}
              remarkPlugins={[remarkGfm]}
            >
              {value || '*No content*'}
            </ReactMarkdown>
          </div>
        </div>
      </div>
    </div>
  )
}
