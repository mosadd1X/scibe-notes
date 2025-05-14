'use client'

import { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import {
  Sparkles,
  Lightbulb,
  Search,
  X,
  Wand2,
  FileText,
  ListChecks,
  Heading1,
  Heading2,
  Bold,
  Italic,
  List,
  ListOrdered,
  Link,
  Image,
  Code,
  Quote,
  Loader2,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

interface AiActionsProps {
  noteContent: string
}

interface GeminiResponse {
  text?: string
  error?: string
}

export function AiActions({ noteContent }: AiActionsProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<GeminiResponse | null>(null)
  const [action, setAction] = useState<string | null>(null)
  const [question, setQuestion] = useState('')
  const questionInputRef = useRef<HTMLInputElement>(null)

  // Add keyboard shortcuts for AI features
  useEffect(() => {
    // Only run in browser environment
    if (typeof window === 'undefined') return

    const handleKeyDown = (e: KeyboardEvent) => {
      // Only trigger if Alt key is pressed and not in a form field
      if (
        e.altKey &&
        !(e.target instanceof HTMLTextAreaElement) &&
        !(e.target instanceof HTMLInputElement)
      ) {
        // Alt + S for summarize
        if (e.key === 's') {
          e.preventDefault()
          handleSummarize()
        }

        // Alt + I for improve writing
        if (e.key === 'i') {
          e.preventDefault()
          handleImproveWriting()
        }

        // Alt + O for outline
        if (e.key === 'o') {
          e.preventDefault()
          handleGenerateOutline()
        }

        // Alt + F for format markdown
        if (e.key === 'f') {
          e.preventDefault()
          handleFormatMarkdown()
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  const callGeminiAPI = async (
    prompt: string,
    action: string,
    context: string
  ) => {
    try {
      // Show a console message for debugging
      console.log(`Calling Gemini API for action: ${action}`)

      // Validate inputs
      if (!context || context.trim().length < 5) {
        throw new Error(
          'Please provide more content in your note before using AI features'
        )
      }

      // Make the API request
      const response = await fetch('/api/gemini', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt,
          action,
          context,
        }),
      })

      // Handle HTTP errors
      if (!response.ok) {
        const errorData = await response.json()
        console.error(`API error for ${action}:`, errorData)
        throw new Error(
          errorData.error || `Failed to ${action}. Please try again.`
        )
      }

      // Parse the response
      const data = await response.json()

      // Validate response data
      if (!data.text || data.text.trim().length === 0) {
        console.error(`Empty response for ${action}:`, data)
        throw new Error(
          `No content generated for ${action}. Please try again with different input.`
        )
      }

      return { text: data.text }
    } catch (error) {
      console.error(`Error in ${action}:`, error)
      return {
        error:
          error instanceof Error
            ? error.message
            : `An unknown error occurred while trying to ${action}. Please try again.`,
      }
    }
  }

  const handleSummarize = async () => {
    if (!noteContent.trim()) return

    setIsLoading(true)
    setAction('summarize')
    setResult(null)

    try {
      const summary = await callGeminiAPI('', 'summarize', noteContent)
      setResult(summary)
    } catch (error) {
      console.error('Error summarizing text:', error)
      setResult({
        error:
          error instanceof Error ? error.message : 'Failed to summarize text',
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleSuggestions = async () => {
    if (!noteContent.trim()) return

    setIsLoading(true)
    setAction('suggestions')
    setResult(null)

    try {
      const suggestions = await callGeminiAPI('', 'suggestions', noteContent)
      setResult(suggestions)
    } catch (error) {
      console.error('Error generating suggestions:', error)
      setResult({
        error:
          error instanceof Error
            ? error.message
            : 'Failed to generate suggestions',
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleAskQuestion = async () => {
    if (!question.trim() || !noteContent.trim()) return

    setIsLoading(true)
    setAction('question')
    setResult(null)

    try {
      const answer = await callGeminiAPI(question, 'question', noteContent)
      setResult(answer)
    } catch (error) {
      console.error('Error answering question:', error)
      setResult({
        error:
          error instanceof Error ? error.message : 'Failed to answer question',
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleImproveWriting = async () => {
    if (!noteContent.trim()) return

    setIsLoading(true)
    setAction('improve')
    setResult(null)

    try {
      const prompt =
        'Improve the writing style and clarity of this text while preserving its meaning:'
      const improved = await callGeminiAPI(prompt, '', noteContent)
      setResult(improved)
    } catch (error) {
      console.error('Error improving writing:', error)
      setResult({
        error:
          error instanceof Error ? error.message : 'Failed to improve writing',
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleGenerateOutline = async () => {
    if (!noteContent.trim()) return

    setIsLoading(true)
    setAction('outline')
    setResult(null)

    try {
      const prompt =
        'Generate a detailed outline for this content with headings and subheadings:'
      const outline = await callGeminiAPI(prompt, 'outline', noteContent)
      setResult(outline)
    } catch (error) {
      console.error('Error generating outline:', error)
      setResult({
        error:
          error instanceof Error ? error.message : 'Failed to generate outline',
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleFormatMarkdown = async () => {
    if (!noteContent.trim()) return

    setIsLoading(true)
    setAction('format')
    setResult(null)

    try {
      const prompt =
        'Format this text as clean, well-structured markdown with proper headings, lists, and emphasis. Preserve all the original content but improve the formatting:'
      const formatted = await callGeminiAPI(prompt, 'format', noteContent)
      setResult(formatted)
    } catch (error) {
      console.error('Error formatting markdown:', error)
      setResult({
        error:
          error instanceof Error ? error.message : 'Failed to format markdown',
      })
    } finally {
      setIsLoading(false)
    }
  }

  const closeResult = () => {
    setResult(null)
    setAction(null)
    setQuestion('')
  }

  return (
    <div className="space-y-4 h-full flex flex-col overflow-hidden">
      <div className="flex border-b shrink-0">
        <div className="flex-1 py-2 text-sm font-medium border-b-2 border-primary text-primary">
          <Wand2 className="h-4 w-4 inline mr-2" />
          AI Assist
        </div>
      </div>

      <div className="space-y-4 flex-1 flex flex-col overflow-hidden">
        <div className="grid grid-cols-2 gap-2 shrink-0">
          <Button
            onClick={handleSummarize}
            variant="outline"
            size="sm"
            disabled={isLoading}
            className="justify-start"
          >
            <Sparkles className="h-4 w-4 mr-2" />
            Summarize
          </Button>
          <Button
            onClick={handleSuggestions}
            variant="outline"
            size="sm"
            disabled={isLoading}
            className="justify-start"
          >
            <Lightbulb className="h-4 w-4 mr-2" />
            Suggestions
          </Button>
          <Button
            onClick={handleImproveWriting}
            variant="outline"
            size="sm"
            disabled={isLoading}
            className="justify-start"
          >
            <Wand2 className="h-4 w-4 mr-2" />
            Improve Writing
          </Button>
          <Button
            onClick={handleGenerateOutline}
            variant="outline"
            size="sm"
            disabled={isLoading}
            className="justify-start"
          >
            <ListChecks className="h-4 w-4 mr-2" />
            Generate Outline
          </Button>
          <Button
            onClick={handleFormatMarkdown}
            variant="outline"
            size="sm"
            disabled={isLoading}
            className="justify-start col-span-2"
          >
            <Code className="h-4 w-4 mr-2" />
            Format as Markdown
          </Button>
        </div>

        <div className="relative shrink-0">
          <input
            ref={questionInputRef}
            type="text"
            value={question}
            onChange={e => setQuestion(e.target.value)}
            onKeyDown={e => {
              if (e.key === 'Enter' && question.trim()) {
                handleAskQuestion()
              }
            }}
            placeholder="Ask a question about your note"
            className="w-full border rounded-md px-3 py-2 text-sm pr-10"
            disabled={isLoading}
          />
          <Button
            onClick={handleAskQuestion}
            variant="ghost"
            size="icon"
            className="absolute right-1 top-1/2 -translate-y-1/2 h-6 w-6"
            disabled={isLoading || !question.trim()}
          >
            <Search className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex-1 overflow-y-auto scrollbar-hide min-h-0">
          {(isLoading || result) && (
            <div className="bg-accent/50 rounded-md p-4 relative backdrop-blur-sm border border-border/50 max-h-[calc(100vh-300px)] overflow-y-auto scrollbar-hide">
              <Button
                onClick={closeResult}
                variant="ghost"
                size="icon"
                className="absolute top-2 right-2 h-6 w-6 opacity-70 hover:opacity-100 z-10"
              >
                <X className="h-4 w-4" />
              </Button>

              <h3 className="font-medium mb-3 flex items-center">
                {action === 'summarize' && (
                  <>
                    <Sparkles className="h-4 w-4 mr-2 text-primary" />
                    Summary
                  </>
                )}
                {action === 'suggestions' && (
                  <>
                    <Lightbulb className="h-4 w-4 mr-2 text-primary" />
                    Suggestions
                  </>
                )}
                {action === 'question' && (
                  <>
                    <Search className="h-4 w-4 mr-2 text-primary" />
                    Answer
                  </>
                )}
                {action === 'improve' && (
                  <>
                    <Wand2 className="h-4 w-4 mr-2 text-primary" />
                    Improved Writing
                  </>
                )}
                {action === 'outline' && (
                  <>
                    <ListChecks className="h-4 w-4 mr-2 text-primary" />
                    Content Outline
                  </>
                )}
                {action === 'format' && (
                  <>
                    <Code className="h-4 w-4 mr-2 text-primary" />
                    Formatted Markdown
                  </>
                )}
              </h3>

              {isLoading ? (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
                  <p className="text-sm font-medium text-primary mb-1">
                    Gemini is thinking...
                  </p>
                  <p className="text-xs text-muted-foreground max-w-xs mx-auto">
                    {action === 'summarize' &&
                      'Creating a concise summary of your note...'}
                    {action === 'suggestions' &&
                      'Generating thoughtful suggestions to expand your note...'}
                    {action === 'question' &&
                      'Finding the answer to your question...'}
                    {action === 'improve' &&
                      'Enhancing your writing while preserving meaning...'}
                    {action === 'outline' &&
                      'Creating a structured outline of your content...'}
                    {action === 'format' &&
                      'Converting your text to well-formatted markdown...'}
                  </p>
                </div>
              ) : result?.error ? (
                <div className="text-destructive bg-destructive/10 p-4 rounded-md border border-destructive/20">
                  <h4 className="font-medium mb-2 flex items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-5 w-5 mr-2"
                    >
                      <circle cx="12" cy="12" r="10"></circle>
                      <line x1="12" y1="8" x2="12" y2="12"></line>
                      <line x1="12" y1="16" x2="12.01" y2="16"></line>
                    </svg>
                    Error Occurred
                  </h4>
                  <p className="text-sm mb-3">{result.error}</p>
                  <div className="text-xs text-destructive/80 mt-2">
                    Try again or modify your note content.
                  </div>
                </div>
              ) : (
                <div className="space-y-4 overflow-y-auto scrollbar-hide max-h-[calc(100vh-400px)]">
                  <div className="prose prose-sm dark:prose-invert max-w-none overflow-visible scrollbar-hide">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                      {result?.text || ''}
                    </ReactMarkdown>
                  </div>

                  {/* Action buttons for AI results */}
                  <div className="flex justify-end gap-2 pt-2 border-t">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        // Copy to clipboard
                        navigator.clipboard.writeText(result?.text || '')
                        // Show toast or feedback
                        const toast = document.createElement('div')
                        toast.className =
                          'fixed bottom-4 right-4 bg-primary text-primary-foreground px-4 py-2 rounded-md shadow-lg animate-fade-in z-50'
                        toast.textContent = 'Copied to clipboard'
                        document.body.appendChild(toast)
                        setTimeout(() => {
                          toast.classList.add(
                            'opacity-0',
                            'transition-opacity',
                            'duration-300'
                          )
                          setTimeout(() => {
                            if (document.body.contains(toast)) {
                              document.body.removeChild(toast)
                            }
                          }, 300)
                        }, 2000)
                      }}
                    >
                      Copy
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
