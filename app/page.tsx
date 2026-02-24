"use client"

import { useState, useCallback, useEffect } from "react"
import { useRouter } from "next/navigation"
import type { Rote } from "@/lib/mage-data"
import { SAMPLE_ROTES, TRADITIONS } from "@/lib/mage-data"
import { GrimoireHeader } from "@/components/grimoire-header"
import { GrimoireNav, type TabId } from "@/components/grimoire-nav"
import { GrimoireFooter } from "@/components/grimoire-footer"
import { HomePanel } from "@/components/home-panel"
import { BrowsePanel } from "@/components/browse-panel"
import { AddRotePanel } from "@/components/add-rote-panel"
import { RoteDetail } from "@/components/rote-detail"
import { AdminPanel } from "@/components/admin-panel"
import { Button } from "@/components/ui/button"
import { ShieldAlert } from "lucide-react"
import { Toaster } from "@/components/ui/toaster"

export default function Page() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<TabId>("home")
  const [rotes, setRotes] = useState<Rote[]>([])
  const [selectedRote, setSelectedRote] = useState<Rote | null>(null)
  const [showAdminPanel, setShowAdminPanel] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

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
    setSelectedRote(rote)
  }, [])

  const handleBackFromDetail = useCallback(() => {
    setSelectedRote(null)
  }, [])

  const handleAddRote = useCallback(async (rote: Rote) => {
    try {
      const response = await fetch('/api/rotes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(rote),
      })

      if (response.ok) {
        fetchRotes() // Refresh the list
      }
    } catch (error) {
      console.error('Error adding rote:', error)
    }
  }, [fetchRotes])

  const handleNavigate = useCallback((tab: TabId) => {
    setSelectedRote(null)
    
    // Navigate to separate pages for merits and resources
    if (tab === "merits") {
      router.push("/merits-flaws")
      return
    }
    if (tab === "resources") {
      router.push("/recommended")
      return
    }
    
    setActiveTab(tab)
  }, [router])

  const uniqueTraditions = new Set(rotes.map((r) => r.tradition)).size

  // Show admin panel if activated
  if (showAdminPanel) {
    return (
      <>
        <div className="min-h-screen relative z-[1] py-6 px-3 md:py-8 md:px-4">
          <div className="max-w-[1400px] mx-auto bg-background border-[3px] border-primary rounded-lg overflow-hidden relative shadow-[0_0_0_1px_hsl(42_42%_59%),0_0_0_8px_hsl(36_42%_88%),0_0_0_11px_hsl(300_45%_20%),inset_0_0_80px_rgba(139,71,38,0.08),0_14px_40px_rgba(26,21,16,0.25)]">
            <AdminPanel
              rotes={rotes}
              onRotesChange={fetchRotes}
              onClose={() => setShowAdminPanel(false)}
            />
          </div>
        </div>
        <Toaster />
      </>
    )
  }

  return (
    <>
      <div className="min-h-screen relative z-[1] py-6 px-3 md:py-8 md:px-4">
        <div
          className="max-w-[1400px] mx-auto bg-background border-[3px] border-primary rounded-lg overflow-hidden relative
            shadow-[0_0_0_1px_hsl(42_42%_59%),0_0_0_8px_hsl(36_42%_88%),0_0_0_11px_hsl(300_45%_20%),inset_0_0_80px_rgba(139,71,38,0.08),0_14px_40px_rgba(26,21,16,0.25)]"
        >
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
            onClick={() => setShowAdminPanel(true)}
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
          <GrimoireNav activeTab={activeTab} onTabChange={handleNavigate} />

          {/* Main content area with subtle background pattern */}
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
              <>
                {activeTab === "home" && (
                  <HomePanel
                    totalRotes={rotes.length}
                    traditions={uniqueTraditions}
                    onNavigate={handleNavigate}
                  />
                )}
                {activeTab === "browse" && (
                  <BrowsePanel rotes={rotes} onSelectRote={handleSelectRote} />
                )}
                {activeTab === "add" && (
                  <AddRotePanel onAdd={handleAddRote} />
                )}
              </>
            )}
          </main>

          <GrimoireFooter />
        </div>
      </div>
      <Toaster />
    </>
  )
}
