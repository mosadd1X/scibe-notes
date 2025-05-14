'use client'

import { useState } from 'react'
import {
  Settings,
  X,
  Moon,
  Sun,
  Keyboard,
  HelpCircle,
  Save,
} from 'lucide-react'
import { useTheme } from 'next-themes'
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Separator } from '@/components/ui/separator'
import { KeyboardShortcuts } from '@/components/ui/keyboard-shortcuts'

interface SettingsDialogProps {
  children?: React.ReactNode
}

export function SettingsDialog({ children }: SettingsDialogProps) {
  const { theme, setTheme } = useTheme()
  const [open, setOpen] = useState(false)
  const [autoSave, setAutoSave] = useState(true)
  const [spellCheck, setSpellCheck] = useState(false)
  const [fontSize, setFontSize] = useState('medium')
  const [defaultView, setDefaultView] = useState('edit')

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children || (
          <Button
            id="settings-dialog-trigger"
            variant="ghost"
            size="icon"
            className="h-9 w-9"
          >
            <Settings className="h-5 w-5" />
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Settings</DialogTitle>
          <DialogDescription>
            Customize your Scribe experience
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="general" className="mt-4">
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="editor">Editor</TabsTrigger>
            <TabsTrigger value="shortcuts">Shortcuts</TabsTrigger>
          </TabsList>

          <TabsContent value="general" className="space-y-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="theme" className="text-base">
                    Theme
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Choose between light and dark mode
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant={theme === 'light' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setTheme('light')}
                    className="gap-1"
                  >
                    <Sun className="h-4 w-4" />
                    Light
                  </Button>
                  <Button
                    variant={theme === 'dark' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setTheme('dark')}
                    className="gap-1"
                  >
                    <Moon className="h-4 w-4" />
                    Dark
                  </Button>
                </div>
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="autosave" className="text-base">
                    Auto Save
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Automatically save notes while typing
                  </p>
                </div>
                <Switch
                  id="autosave"
                  checked={autoSave}
                  onCheckedChange={setAutoSave}
                />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="editor" className="space-y-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="font-size" className="text-base">
                    Font Size
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Adjust the editor font size
                  </p>
                </div>
                <Select value={fontSize} onValueChange={setFontSize}>
                  <SelectTrigger className="w-32">
                    <SelectValue placeholder="Font Size" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="small">Small</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="large">Large</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="default-view" className="text-base">
                    Default View
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Choose the default editor view
                  </p>
                </div>
                <Select value={defaultView} onValueChange={setDefaultView}>
                  <SelectTrigger className="w-32">
                    <SelectValue placeholder="Default View" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="edit">Edit</SelectItem>
                    <SelectItem value="preview">Preview</SelectItem>
                    <SelectItem value="split">Split</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="spellcheck" className="text-base">
                    Spell Check
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Enable spell checking in the editor
                  </p>
                </div>
                <Switch
                  id="spellcheck"
                  checked={spellCheck}
                  onCheckedChange={setSpellCheck}
                />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="shortcuts" className="space-y-4">
            <KeyboardShortcuts />
          </TabsContent>
        </Tabs>

        <DialogFooter>
          <Button onClick={() => setOpen(false)}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
