'use client'

import { useState } from 'react'
import {
  Bold,
  Italic,
  List,
  ListOrdered,
  Heading1,
  Heading2,
  Link as LinkIcon,
  Image,
  Code,
  Quote,
  Eye,
  Edit3,
  Undo,
  Redo,
  HelpCircle,
  AlignLeft,
  Table,
  CheckSquare,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { cn } from '@/lib/utils'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

interface EditorToolbarProps {
  isPreview: boolean
  setIsPreview: (value: boolean) => void
  showHelp: boolean
  setShowHelp: (value: boolean) => void
  insertMarkdown: (markdownSymbol: string, placeholder?: string) => void
  insertSpecialMarkdown: (type: string) => void
  handleUndo: () => void
  handleRedo: () => void
  canUndo: boolean
  canRedo: boolean
}

export function EditorToolbar({
  isPreview,
  setIsPreview,
  showHelp,
  setShowHelp,
  insertMarkdown,
  insertSpecialMarkdown,
  handleUndo,
  handleRedo,
  canUndo,
  canRedo,
}: EditorToolbarProps) {
  const [activeTab, setActiveTab] = useState('common')

  return (
    <div className="flex items-center justify-between p-1.5 border-b bg-background/80 backdrop-blur-sm sticky top-0 z-30">
      <div className="flex items-center gap-0.5 overflow-x-auto scrollbar-hide">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-auto">
          <TabsList className="h-8 p-0.5">
            <TabsTrigger value="common" className="h-7 px-2 text-xs">
              Common
            </TabsTrigger>
            <TabsTrigger value="advanced" className="h-7 px-2 text-xs">
              Advanced
            </TabsTrigger>
          </TabsList>
        </Tabs>

        <Separator orientation="vertical" className="h-8 mx-1" />

        <TooltipProvider delayDuration={300}>
          {activeTab === 'common' ? (
            <div className="flex items-center gap-0.5">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    type="button"
                    onClick={() => insertSpecialMarkdown('h1')}
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                  >
                    <Heading1 className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent
                  side="bottom"
                  className="flex items-center gap-2"
                >
                  <p>Heading 1</p>
                  <kbd className="px-1 py-0.5 bg-muted rounded text-xs font-mono">
                    Ctrl+Shift+1
                  </kbd>
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    type="button"
                    onClick={() => insertSpecialMarkdown('h2')}
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                  >
                    <Heading2 className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent
                  side="bottom"
                  className="flex items-center gap-2"
                >
                  <p>Heading 2</p>
                  <kbd className="px-1 py-0.5 bg-muted rounded text-xs font-mono">
                    Ctrl+Shift+2
                  </kbd>
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    type="button"
                    onClick={() => insertMarkdown('**', 'bold')}
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                  >
                    <Bold className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent
                  side="bottom"
                  className="flex items-center gap-2"
                >
                  <p>Bold</p>
                  <kbd className="px-1 py-0.5 bg-muted rounded text-xs font-mono">
                    Ctrl+B
                  </kbd>
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    type="button"
                    onClick={() => insertMarkdown('*', 'italic')}
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                  >
                    <Italic className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent
                  side="bottom"
                  className="flex items-center gap-2"
                >
                  <p>Italic</p>
                  <kbd className="px-1 py-0.5 bg-muted rounded text-xs font-mono">
                    Ctrl+I
                  </kbd>
                </TooltipContent>
              </Tooltip>

              <Separator orientation="vertical" className="h-6 mx-1" />

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    type="button"
                    onClick={() => insertSpecialMarkdown('ul')}
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                  >
                    <List className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent
                  side="bottom"
                  className="flex items-center gap-2"
                >
                  <p>Bullet List</p>
                  <kbd className="px-1 py-0.5 bg-muted rounded text-xs font-mono">
                    Ctrl+Shift+.
                  </kbd>
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    type="button"
                    onClick={() => insertSpecialMarkdown('ol')}
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                  >
                    <ListOrdered className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent
                  side="bottom"
                  className="flex items-center gap-2"
                >
                  <p>Numbered List</p>
                  <kbd className="px-1 py-0.5 bg-muted rounded text-xs font-mono">
                    Ctrl+Shift+/
                  </kbd>
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    type="button"
                    onClick={() => insertSpecialMarkdown('link')}
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                  >
                    <LinkIcon className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent
                  side="bottom"
                  className="flex items-center gap-2"
                >
                  <p>Link</p>
                  <kbd className="px-1 py-0.5 bg-muted rounded text-xs font-mono">
                    Ctrl+K
                  </kbd>
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    type="button"
                    onClick={() => insertSpecialMarkdown('code')}
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                  >
                    <Code className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent
                  side="bottom"
                  className="flex items-center gap-2"
                >
                  <p>Code Block</p>
                  <kbd className="px-1 py-0.5 bg-muted rounded text-xs font-mono">
                    Ctrl+`
                  </kbd>
                </TooltipContent>
              </Tooltip>
            </div>
          ) : (
            <div className="flex items-center gap-0.5">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    type="button"
                    onClick={() => insertSpecialMarkdown('image')}
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                  >
                    <Image className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="bottom">
                  <p>Image</p>
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    type="button"
                    onClick={() => insertSpecialMarkdown('quote')}
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                  >
                    <Quote className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="bottom">
                  <p>Quote</p>
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    type="button"
                    onClick={() => insertSpecialMarkdown('table')}
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                  >
                    <Table className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="bottom">
                  <p>Table</p>
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    type="button"
                    onClick={() => insertSpecialMarkdown('checkbox')}
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                  >
                    <CheckSquare className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="bottom">
                  <p>Task List</p>
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    type="button"
                    onClick={() => insertSpecialMarkdown('hr')}
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                  >
                    <AlignLeft className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="bottom">
                  <p>Horizontal Rule</p>
                </TooltipContent>
              </Tooltip>
            </div>
          )}
        </TooltipProvider>

        <Separator orientation="vertical" className="h-6 mx-1" />

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                type="button"
                onClick={handleUndo}
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                disabled={!canUndo}
              >
                <Undo className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom" className="flex items-center gap-2">
              <p>Undo</p>
              <kbd className="px-1 py-0.5 bg-muted rounded text-xs font-mono">
                Ctrl+Z
              </kbd>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                type="button"
                onClick={handleRedo}
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                disabled={!canRedo}
              >
                <Redo className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom" className="flex items-center gap-2">
              <p>Redo</p>
              <kbd className="px-1 py-0.5 bg-muted rounded text-xs font-mono">
                Ctrl+Shift+Z
              </kbd>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <Separator orientation="vertical" className="h-6 mx-1" />

        <Popover>
          <PopoverTrigger asChild>
            <Button
              type="button"
              variant={showHelp ? 'secondary' : 'ghost'}
              size="icon"
              className="h-8 w-8"
            >
              <HelpCircle className="h-4 w-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80" align="start">
            <div className="space-y-2">
              <h4 className="font-medium">Markdown Cheat Sheet</h4>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <code className="bg-primary/10 px-1 py-0.5 rounded">
                    # Heading 1
                  </code>
                </div>
                <div>
                  <code className="bg-primary/10 px-1 py-0.5 rounded">
                    ## Heading 2
                  </code>
                </div>
                <div>
                  <code className="bg-primary/10 px-1 py-0.5 rounded">
                    **Bold**
                  </code>
                </div>
                <div>
                  <code className="bg-primary/10 px-1 py-0.5 rounded">
                    *Italic*
                  </code>
                </div>
                <div>
                  <code className="bg-primary/10 px-1 py-0.5 rounded">
                    [Link](url)
                  </code>
                </div>
                <div>
                  <code className="bg-primary/10 px-1 py-0.5 rounded">
                    ![Image](url)
                  </code>
                </div>
                <div>
                  <code className="bg-primary/10 px-1 py-0.5 rounded">
                    - List item
                  </code>
                </div>
                <div>
                  <code className="bg-primary/10 px-1 py-0.5 rounded">
                    1. Numbered item
                  </code>
                </div>
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </div>

      <div className="flex rounded-md overflow-hidden">
        <Button
          type="button"
          onClick={() => setIsPreview(false)}
          variant={!isPreview ? 'default' : 'outline'}
          size="sm"
          className="px-3 py-1 h-8"
        >
          <Edit3 className="h-3.5 w-3.5 mr-1" />
          Edit
        </Button>
        <Button
          type="button"
          onClick={() => setIsPreview(true)}
          variant={isPreview ? 'default' : 'outline'}
          size="sm"
          className="px-3 py-1 h-8"
        >
          <Eye className="h-3.5 w-3.5 mr-1" />
          Preview
        </Button>
      </div>
    </div>
  )
}
