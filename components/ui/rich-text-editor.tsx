"use client"

import { useState } from "react"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { 
  Bold, 
  Italic, 
  List, 
  ListOrdered, 
  Heading2,
  Quote,
  Link as LinkIcon,
  Code
} from "lucide-react"
import { Label } from "@/components/ui/label"

interface RichTextEditorProps {
  value: string
  onChange: (value: string) => void
  label?: string
  placeholder?: string
  rows?: number
  id?: string
}

export function RichTextEditor({
  value,
  onChange,
  label,
  placeholder,
  rows = 8,
  id
}: RichTextEditorProps) {
  const [textareaRef, setTextareaRef] = useState<HTMLTextAreaElement | null>(null)

  const insertMarkdown = (before: string, after: string = '') => {
    if (!textareaRef) return

    const start = textareaRef.selectionStart
    const end = textareaRef.selectionEnd
    const selectedText = value.substring(start, end)
    const beforeText = value.substring(0, start)
    const afterText = value.substring(end)

    const newText = beforeText + before + selectedText + after + afterText
    onChange(newText)

    // Set cursor position after insertion
    setTimeout(() => {
      if (textareaRef) {
        const newCursorPos = start + before.length + selectedText.length + after.length
        textareaRef.focus()
        textareaRef.setSelectionRange(newCursorPos, newCursorPos)
      }
    }, 0)
  }

  const insertAtCursor = (text: string) => {
    if (!textareaRef) return

    const start = textareaRef.selectionStart
    const beforeText = value.substring(0, start)
    const afterText = value.substring(start)

    onChange(beforeText + text + afterText)

    setTimeout(() => {
      if (textareaRef) {
        const newPos = start + text.length
        textareaRef.focus()
        textareaRef.setSelectionRange(newPos, newPos)
      }
    }, 0)
  }

  return (
    <div className="space-y-2">
      {label && <Label htmlFor={id}>{label}</Label>}
      
      {/* Formatting Toolbar */}
      <div className="flex flex-wrap gap-1 p-2 border border-border rounded-md bg-muted/30">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => insertMarkdown('**', '**')}
          title="Bold"
          className="h-8 w-8 p-0"
        >
          <Bold className="h-4 w-4" />
        </Button>
        
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => insertMarkdown('*', '*')}
          title="Italic"
          className="h-8 w-8 p-0"
        >
          <Italic className="h-4 w-4" />
        </Button>

        <div className="w-px h-8 bg-border mx-1" />

        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => insertAtCursor('\n## ')}
          title="Heading"
          className="h-8 w-8 p-0"
        >
          <Heading2 className="h-4 w-4" />
        </Button>

        <div className="w-px h-8 bg-border mx-1" />

        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => insertAtCursor('\n- ')}
          title="Bullet List"
          className="h-8 w-8 p-0"
        >
          <List className="h-4 w-4" />
        </Button>

        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => insertAtCursor('\n1. ')}
          title="Numbered List"
          className="h-8 w-8 p-0"
        >
          <ListOrdered className="h-4 w-4" />
        </Button>

        <div className="w-px h-8 bg-border mx-1" />

        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => insertMarkdown('[', '](url)')}
          title="Link"
          className="h-8 w-8 p-0"
        >
          <LinkIcon className="h-4 w-4" />
        </Button>

        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => insertMarkdown('`', '`')}
          title="Code"
          className="h-8 w-8 p-0"
        >
          <Code className="h-4 w-4" />
        </Button>

        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => insertAtCursor('\n> ')}
          title="Quote"
          className="h-8 w-8 p-0"
        >
          <Quote className="h-4 w-4" />
        </Button>
      </div>

      {/* Textarea */}
      <Textarea
        ref={setTextareaRef}
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={rows}
        className="font-mono text-sm"
      />

      {/* Help Text */}
      <div className="text-xs text-muted-foreground space-y-1">
        <p className="font-semibold">Markdown Formatting Guide:</p>
        <div className="grid grid-cols-2 gap-x-4 gap-y-1">
          <span>**bold text** → <strong>bold text</strong></span>
          <span>*italic text* → <em>italic text</em></span>
          <span>## Heading → <strong>Heading</strong></span>
          <span>- List item → • List item</span>
          <span>1. Numbered → 1. Numbered</span>
          <span>[link](url) → <span className="text-primary underline">link</span></span>
        </div>
        <p className="mt-2">Double line break for new paragraph</p>
      </div>
    </div>
  )
}
