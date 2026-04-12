"use client"

import { useReaderMode } from '@/contexts/reader-mode-context'
import { Button } from '@/components/ui/button'
import { BookOpen, Sparkles } from 'lucide-react'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

export function ReaderModeToggle() {
  const { mode, toggleMode } = useReaderMode()

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleMode}
            className="relative"
          >
            {mode === 'reader' ? (
              <Sparkles className="h-[1.2rem] w-[1.2rem]" />
            ) : (
              <BookOpen className="h-[1.2rem] w-[1.2rem]" />
            )}
            <span className="sr-only">
              {mode === 'reader' ? 'Exit Reader Mode' : 'Enter Reader Mode'}
            </span>
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>{mode === 'reader' ? 'Standard Mode' : 'Reader Mode'}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
