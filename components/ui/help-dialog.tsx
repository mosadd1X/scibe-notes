'use client'

import { useState } from 'react'
import { HelpCircle, X, Sparkles, Lightbulb, Search, Wand2, ListChecks, Code } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs'
import { Separator } from '@/components/ui/separator'

interface HelpDialogProps {
  children?: React.ReactNode
}

export function HelpDialog({ children }: HelpDialogProps) {
  const [open, setOpen] = useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children || (
          <Button
            id="help-dialog-trigger"
            variant="ghost"
            size="icon"
            className="h-9 w-9"
          >
            <HelpCircle className="h-5 w-5" />
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Help & Documentation</DialogTitle>
          <DialogDescription>
            Learn how to use Scribe effectively
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="basics" className="mt-4">
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="basics">Basics</TabsTrigger>
            <TabsTrigger value="markdown">Markdown</TabsTrigger>
            <TabsTrigger value="ai">AI Features</TabsTrigger>
          </TabsList>

          <TabsContent value="basics" className="space-y-4">
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Getting Started</h3>
              <p className="text-sm text-muted-foreground">
                Scribe is a markdown note-taking app with AI capabilities. Here's how to get started:
              </p>

              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <span className="bg-primary/10 text-primary p-1 rounded mt-0.5">1</span>
                  <span>Create a new note using the + button in the sidebar</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="bg-primary/10 text-primary p-1 rounded mt-0.5">2</span>
                  <span>Write your note using markdown syntax</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="bg-primary/10 text-primary p-1 rounded mt-0.5">3</span>
                  <span>Use the toolbar to format your text or toggle preview mode</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="bg-primary/10 text-primary p-1 rounded mt-0.5">4</span>
                  <span>Access AI features by clicking the AI button in the toolbar</span>
                </li>
              </ul>

              <Separator />

              <h3 className="text-lg font-medium">Interface Overview</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="space-y-2">
                  <h4 className="font-medium">Sidebar</h4>
                  <p className="text-muted-foreground">Browse and manage your notes</p>
                </div>
                <div className="space-y-2">
                  <h4 className="font-medium">Editor</h4>
                  <p className="text-muted-foreground">Write and edit your notes</p>
                </div>
                <div className="space-y-2">
                  <h4 className="font-medium">Preview</h4>
                  <p className="text-muted-foreground">See how your note will look when rendered</p>
                </div>
                <div className="space-y-2">
                  <h4 className="font-medium">AI Panel</h4>
                  <p className="text-muted-foreground">Access AI-powered features</p>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="markdown" className="space-y-4">
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Markdown Basics</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="space-y-1">
                  <code className="bg-muted px-1 py-0.5 rounded"># Heading 1</code>
                  <p className="text-muted-foreground">Creates a large heading</p>
                </div>
                <div className="space-y-1">
                  <code className="bg-muted px-1 py-0.5 rounded">## Heading 2</code>
                  <p className="text-muted-foreground">Creates a medium heading</p>
                </div>
                <div className="space-y-1">
                  <code className="bg-muted px-1 py-0.5 rounded">**bold text**</code>
                  <p className="text-muted-foreground">Makes text bold</p>
                </div>
                <div className="space-y-1">
                  <code className="bg-muted px-1 py-0.5 rounded">*italic text*</code>
                  <p className="text-muted-foreground">Makes text italic</p>
                </div>
                <div className="space-y-1">
                  <code className="bg-muted px-1 py-0.5 rounded">[link](url)</code>
                  <p className="text-muted-foreground">Creates a hyperlink</p>
                </div>
                <div className="space-y-1">
                  <code className="bg-muted px-1 py-0.5 rounded">![alt](image-url)</code>
                  <p className="text-muted-foreground">Inserts an image</p>
                </div>
                <div className="space-y-1">
                  <code className="bg-muted px-1 py-0.5 rounded">- List item</code>
                  <p className="text-muted-foreground">Creates a bullet list</p>
                </div>
                <div className="space-y-1">
                  <code className="bg-muted px-1 py-0.5 rounded">1. List item</code>
                  <p className="text-muted-foreground">Creates a numbered list</p>
                </div>
              </div>

              <Separator />

              <h3 className="text-lg font-medium">Advanced Markdown</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="space-y-1">
                  <code className="bg-muted px-1 py-0.5 rounded">```code```</code>
                  <p className="text-muted-foreground">Creates a code block</p>
                </div>
                <div className="space-y-1">
                  <code className="bg-muted px-1 py-0.5 rounded">> Quote</code>
                  <p className="text-muted-foreground">Creates a blockquote</p>
                </div>
                <div className="space-y-1">
                  <code className="bg-muted px-1 py-0.5 rounded">- [ ] Task</code>
                  <p className="text-muted-foreground">Creates a task list</p>
                </div>
                <div className="space-y-1">
                  <code className="bg-muted px-1 py-0.5 rounded">---</code>
                  <p className="text-muted-foreground">Creates a horizontal rule</p>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="ai" className="space-y-4">
            <div className="space-y-4">
              <h3 className="text-lg font-medium">AI Features</h3>
              <p className="text-sm text-muted-foreground">
                Scribe integrates with Google's Gemini AI to provide intelligent assistance:
              </p>

              <div className="grid grid-cols-1 gap-4 text-sm">
                <div className="flex items-start gap-3 p-2 rounded bg-accent/50">
                  <Sparkles className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <h4 className="font-medium">Summarize</h4>
                    <p className="text-muted-foreground">Condense long notes into concise summaries</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-2 rounded bg-accent/50">
                  <Wand2 className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <h4 className="font-medium">Improve Writing</h4>
                    <p className="text-muted-foreground">Enhance clarity, grammar, and style</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-2 rounded bg-accent/50">
                  <ListChecks className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <h4 className="font-medium">Generate Outline</h4>
                    <p className="text-muted-foreground">Create structured outlines from your content</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-2 rounded bg-accent/50">
                  <Code className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <h4 className="font-medium">Format Markdown</h4>
                    <p className="text-muted-foreground">Convert plain text to well-structured markdown</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-2 rounded bg-accent/50">
                  <Search className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <h4 className="font-medium">Answer Questions</h4>
                    <p className="text-muted-foreground">Ask questions about your note content</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-2 rounded bg-accent/50">
                  <Lightbulb className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <h4 className="font-medium">Get Suggestions</h4>
                    <p className="text-muted-foreground">Receive ideas on how to expand your notes</p>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <DialogFooter>
          <Button onClick={() => setOpen(false)}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
