'use client'

import { useState } from 'react'
import Image from 'next/image'
import { cn } from '@/lib/utils'
import {
  Menu as MenuIcon,
  X,
  Search,
  Settings,
  FileText,
  HelpCircle,
  MoreVertical,
} from 'lucide-react'

import { Button } from '@/components/ui/button'
import { ThemeToggle } from '@/components/ui/theme-toggle'
import { NoteActionsMenu } from '@/components/notes/note-actions-menu'
import { SettingsDialog } from '@/components/ui/settings-dialog'
import { HelpDialog } from '@/components/ui/help-dialog'

import { Separator } from '@/components/ui/separator'
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from '@/components/ui/command'

// App name: Scribe - AI-powered markdown notes
const APP_NAME = 'Scribe'

interface AppHeaderProps {
  isSidebarOpen: boolean
  toggleSidebar: () => void
  isMobile: boolean
}

export function AppHeader({
  isSidebarOpen,
  toggleSidebar,
  isMobile,
}: AppHeaderProps) {
  const [isCommandOpen, setIsCommandOpen] = useState(false)

  return (
    <header className="flex items-center h-14 px-4 border-b backdrop-blur-sm bg-background/80 sticky top-0 z-10">
      <div className="flex items-center gap-4 flex-1">
        {isMobile && (
          <Button
            onClick={toggleSidebar}
            variant="ghost"
            size="icon"
            className="mr-1"
            aria-label="Toggle sidebar"
          >
            {isSidebarOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <MenuIcon className="h-5 w-5" />
            )}
          </Button>
        )}

        <div className="flex items-center">
          <div className="relative w-8 h-8 mr-2">
            <Image
              src="/logo.svg"
              alt={APP_NAME}
              fill
              className="object-contain"
              priority
            />
          </div>
          <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-primary/70 text-transparent bg-clip-text">
            {APP_NAME}
          </h1>
          <span className="ml-2 text-xs px-1.5 py-0.5 rounded-md bg-primary/10 text-primary font-medium">
            AI
          </span>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          className="hidden md:flex gap-1.5"
          onClick={() => setIsCommandOpen(true)}
        >
          <Search className="h-3.5 w-3.5" />
          <span>Search</span>
          <kbd className="pointer-events-none ml-1 inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
            <span className="text-xs">⌘</span>K
          </kbd>
        </Button>

        <CommandDialog open={isCommandOpen} onOpenChange={setIsCommandOpen}>
          <CommandInput placeholder="Search notes, commands..." />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup heading="Suggestions">
              <CommandItem>
                <FileText className="mr-2 h-4 w-4" />
                <span>New Note</span>
              </CommandItem>
              <CommandItem>
                <Search className="mr-2 h-4 w-4" />
                <span>Search Notes</span>
              </CommandItem>
            </CommandGroup>
            <CommandSeparator />
            <CommandGroup heading="Settings">
              <CommandItem
                onClick={() => {
                  setIsCommandOpen(false)
                  // Open settings dialog
                  document.getElementById('settings-dialog-trigger')?.click()
                }}
              >
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </CommandItem>
              <CommandItem
                onClick={() => {
                  setIsCommandOpen(false)
                  // Open help dialog
                  document.getElementById('help-dialog-trigger')?.click()
                }}
              >
                <HelpCircle className="mr-2 h-4 w-4" />
                <span>Help</span>
              </CommandItem>
            </CommandGroup>
          </CommandList>
        </CommandDialog>

        <Separator
          orientation="vertical"
          className="h-6 mx-1 hidden md:block"
        />

        <div className="flex items-center gap-2">
          <div className="hidden md:flex items-center">
            <SettingsDialog />
            <HelpDialog />
            <Separator orientation="vertical" className="h-6 mx-2" />
          </div>
          <NoteActionsMenu>
            <Button variant="ghost" size="icon" className="h-9 w-9">
              <MoreVertical className="h-5 w-5" />
            </Button>
          </NoteActionsMenu>
          <ThemeToggle />
        </div>
      </div>
    </header>
  )
}
