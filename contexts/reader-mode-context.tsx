"use client"

import React, { createContext, useContext, useState, useEffect } from 'react'

type ReaderMode = 'standard' | 'reader'

interface ReaderModeContextType {
  mode: ReaderMode
  setMode: (mode: ReaderMode) => void
  toggleMode: () => void
  isReaderMode: boolean
}

const ReaderModeContext = createContext<ReaderModeContextType | undefined>(undefined)

export function ReaderModeProvider({ children }: { children: React.ReactNode }) {
  const [mode, setModeState] = useState<ReaderMode>('standard')
  const [mounted, setMounted] = useState(false)

  // Load saved mode from localStorage on mount
  useEffect(() => {
    setMounted(true)
    const savedMode = localStorage.getItem('reader-mode') as ReaderMode | null
    if (savedMode) {
      setModeState(savedMode)
      applyMode(savedMode)
    }
  }, [])

  // Apply mode to document
  const applyMode = (newMode: ReaderMode) => {
    const root = document.documentElement
    
    if (newMode === 'reader') {
      root.classList.add('reader-mode')
    } else {
      root.classList.remove('reader-mode')
    }
  }

  const setMode = (newMode: ReaderMode) => {
    setModeState(newMode)
    localStorage.setItem('reader-mode', newMode)
    applyMode(newMode)
  }

  const toggleMode = () => {
    setMode(mode === 'standard' ? 'reader' : 'standard')
  }

  const value: ReaderModeContextType = {
    mode,
    setMode,
    toggleMode,
    isReaderMode: mode === 'reader',
  }

  // Prevent flash on mount
  if (!mounted) {
    return null
  }

  return (
    <ReaderModeContext.Provider value={value}>
      {children}
    </ReaderModeContext.Provider>
  )
}

export function useReaderMode() {
  const context = useContext(ReaderModeContext)
  if (context === undefined) {
    throw new Error('useReaderMode must be used within a ReaderModeProvider')
  }
  return context
}
