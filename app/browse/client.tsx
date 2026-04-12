"use client"

import { useState, useCallback, useEffect } from "react"
import { useRouter } from "next/navigation"
import type { Rote } from "@/lib/mage-data"
import { GrimoireHeader } from "@/components/grimoire-header"
import { GrimoireFooter } from "@/components/grimoire-footer"
import { BrowsePanel } from "@/components/browse-panel"
import { Button } from "@/components/ui/button"
import { Home, ShieldAlert } from "lucide-react"
import { Toaster } from "@/components/ui/toaster"
import Link from "next/link"

export default function BrowsePage() {
  const router = useRouter()
  const [rotes, setRotes] = useState<Rote[]>([])
  const [selectedRote, setSelectedRote] = useState<Rote | null>(null)
  const [showAdminPanel, setShowAdminPanel] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [returningFromDetail, setReturningFromDetail] = useState(false)

  // Fetch rotes from API
  const fetchRotes = useCallback(async () => {
    try {
      const response = await fetch('/api/rotes')
      if (response.ok) {
        const data = await response.json()
        setRotes(data)
      }
    } catch (error) {
      console.error('Error fetching rotes:', error)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchRotes()
  }, [fetchRotes])

  const handleSelectRote = useCallback((rote: Rote) => {
    // Save scroll position
    sessionStorage.setItem('browseScrollPosition', window.scrollY.toString())
    setSelectedRote(rote)
  }, [])

  const handleBackFromDetail = useCallback(() => {
    setSelectedRote(null)
    setReturningFromDetail(true)
    
    // Restore scroll position
    setTimeout(() => {
      const savedPosition = sessionStorage.getItem('browseScrollPosition')
      if (savedPosition) {
        window.scrollTo({
          top: parseInt(savedPosition, 10),
          behavior: 'instant'
        })
      }
    }, 0)
  }, [])

  return (
    <>
      <div className="min-h-screen relative z-[1] py-6 px-3 md:py-8 md:px-4">
        <div className="max-w-[1400px] mx-auto bg-background border-[3px] border-primary rounded-lg overflow-hidden relative
          shadow-[0_0_0_1px_hsl(42_42%_59%),0_0_0_8px_hsl(36_42%_88%),0_0_0_11px_hsl(300_45%_20%),inset_0_0_80px_rgba(139,71,38,0.08),0_14px_40px_rgba(26,21,16,0.25)]">
          
          {/* Corner decorations */}
          <div className="absolute -top-2 -left-2 text-4xl text-ring drop-shadow-[0_0_10px_rgba(107,45,107,0.8)] z-10 font-serif" aria-hidden="true">
            {'\u25C8'}
          </div>
          <div className="absolute -top-2 -right-2 text-4xl text-ring drop-shadow-[0_0_10px_rgba(107,45,107,0.8)] z-10 font-serif" aria-hidden="true">
            {'\u25C8'}
          </div>

          {/* Admin button - top right corner */}
          <Button
            variant="ghost"
            size="sm"
            className="absolute top-4 right-4 z-20 opacity-30 hover:opacity-100 transition-opacity"
            onClick={() => router.push('/?admin=true')}
            title="Admin Panel"
          >
            <ShieldAlert className="w-4 h-4" />
          </Button>

          {/* Top ornamental border */}
          <div
            className="h-1 w-full"
            style={{
              background: 'linear-gradient(90deg, transparent 0%, hsl(42 42% 59%) 10%, hsl(300 45% 30%) 30%, hsl(42 42% 59%) 50%, hsl(300 45% 30%) 70%, hsl(42 42% 59%) 90%, transparent 100%)',
              boxShadow: '0 1px 3px rgba(107,45,107,0.5)',
            }}
            aria-hidden="true"
          />

          <GrimoireHeader />

          {/* Back to Home button */}
          <div className="px-6 py-4 border-b-2 border-primary/20">
            <Link href="/">
              <Button variant="outline" className="gap-2">
                <Home className="w-4 h-4" />
                Back to Home
              </Button>
            </Link>
          </div>

          {/* Main content */}
          <main
            className="min-h-[500px]"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 0 L 30 60 M 0 30 L 60 30' stroke='%234a1a4a' strokeWidth='0.3' opacity='0.06'/%3E%3C/svg%3E")`,
            }}
          >
            {isLoading ? (
              <div className="flex items-center justify-center min-h-[500px]">
                <div className="flex items-center gap-3">
                  <span className="text-2xl text-accent animate-spin">⚙</span>
                  <p className="text-muted-foreground">Turning the Wheel...</p>
                </div>
              </div>
            ) : selectedRote ? (
              <RoteDetail rote={selectedRote} onBack={handleBackFromDetail} />
            ) : (
              <BrowsePanel 
                rotes={rotes} 
                onSelectRote={handleSelectRote}
                shouldRestoreState={returningFromDetail}
                onStateRestored={() => setReturningFromDetail(false)}
              />
            )}
          </main>

          <GrimoireFooter />
        </div>
      </div>
      <Toaster />
    </>
  )
}
