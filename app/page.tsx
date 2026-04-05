"use client"

import { useState, useCallback, useEffect, useRef } from "react"
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

  const [returningFromDetail, setReturningFromDetail] = useState(false)

  const browsePanelStateRef = useRef<{
    scrollPosition: number
    timestamp: number
  } | null>(null)

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
    browsePanelStateRef.current = {
      scrollPosition: window.scrollY,
      timestamp: Date.now()
    }
    setSelectedRote(rote)
  }, [])

  const handleBackFromDetail = useCallback(() => {
    setSelectedRote(null)
    setReturningFromDetail(true)
    if (browsePanelStateRef.current) {
      setTimeout(() => {
        window.scrollTo({
          top: browsePanelStateRef.current?.scrollPosition || 0,
          behavior: 'instant'
        })
      }, 0)
    }
  }, [])

  const handleAddRote = useCallback(async (rote: Rote) => {
    try {
      const response = await fetch('/api/rotes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(rote),
      })
      if (response.ok) {
        fetchRotes()
      }
    } catch (error) {
      console.error('Error adding rote:', error)
    }
  }, [fetchRotes])

  const handleNavigate = useCallback((tab: TabId) => {
    setSelectedRote(null)
    if (tab === "browse") { router.push("/browse"); return }
    if (tab === "merits") { router.push("/merits-flaws"); return }
    if (tab === "resources") { router.push("/recommended"); return }
    setActiveTab(tab)
  }, [router])

  const uniqueTraditions = new Set(rotes.map((r) => r.tradition)).size

  /* ── Shared outer frame ── */
  const frameClasses = `
    max-w-[1400px] mx-auto bg-background border-[3px] border-primary rounded-lg overflow-hidden relative
    shadow-[0_0_0_1px_hsl(42_68%_48%),0_0_0_8px_hsl(38_35%_88%),0_0_0_11px_hsl(8_55%_22%),inset_0_0_80px_rgba(139,45,30,0.06),0_14px_40px_rgba(20,14,8,0.35)]
    dark:shadow-[0_0_0_1px_hsl(42_68%_48%),0_0_0_8px_hsl(20_18%_10%),0_0_0_11px_hsl(8_55%_22%),inset_0_0_80px_rgba(139,45,30,0.08),0_14px_40px_rgba(0,0,0,0.5)]
  `

  /* ── Atmospheric page background — replaces flat solid ── */
  const pageWrapperClasses = `
    min-h-screen relative z-[1] py-6 px-3 md:py-8 md:px-4 grimoire-bg
  `

  if (showAdminPanel) {
    return (
      <>
        <div className={pageWrapperClasses}>
          <div className={frameClasses}>
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
      <div className={pageWrapperClasses}>
        <div className={frameClasses}>

          {/* Corner decorations */}
          <div className="absolute -top-2 -left-2 text-4xl text-ring drop-shadow-[0_0_10px_hsl(42_68%_48%/0.7)] z-10 font-serif" aria-hidden="true">
            ◈
          </div>
          <div className="absolute -top-2 -right-2 text-4xl text-ring drop-shadow-[0_0_10px_hsl(42_68%_48%/0.7)] z-10 font-serif" aria-hidden="true">
            ◈
          </div>

          {/* Admin button */}
          <Button
            variant="ghost"
            size="sm"
            className="absolute top-4 right-4 z-20 opacity-20 hover:opacity-100 transition-opacity"
            onClick={() => setShowAdminPanel(true)}
            title="Admin Panel"
          >
            <ShieldAlert className="w-4 h-4" />
          </Button>

          {/* Top ornamental border */}
          <div
            className="h-1 w-full"
            style={{
              background: 'linear-gradient(90deg, hsl(42 68% 48%) 0%, hsl(42 68% 48% / 0.6) 20%, hsl(290 35% 40% / 0.4) 50%, hsl(42 68% 48% / 0.6) 80%, transparent 100%)',
              boxShadow: '0 1px 4px hsl(42 68% 48% / 0.3)',
            }}
            aria-hidden="true"
          />

          <GrimoireHeader />
          <GrimoireNav activeTab={activeTab} onTabChange={handleNavigate} />

          {/* Main content area — visible cross-hatch pattern */}
          <main
            className="min-h-[500px]"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M40 0 L0 0 0 40' fill='none' stroke='%23a07830' stroke-width='0.4' opacity='0.08'/%3E%3C/svg%3E")`,
            }}
          >
            {isLoading ? (
              <div className="flex items-center justify-center min-h-[500px]">
                <div className="flex flex-col items-center gap-4">
                  <span className="text-4xl text-accent animate-spin" style={{ animationDuration: '3s' }}>⚙</span>
                  <p className="font-serif text-sm uppercase tracking-[0.2em] text-muted-foreground">
                    Turning the Wheel…
                  </p>
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
