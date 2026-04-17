"use client"

import { useState, useCallback, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import type { Rote } from "@/lib/mage-data"
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
  const [activeTab, setActiveTab]       = useState<TabId>("home")
  const [rotes, setRotes]               = useState<Rote[]>([])
  const [selectedRote, setSelectedRote] = useState<Rote | null>(null)
  const [showAdminPanel, setShowAdminPanel] = useState(false)
  const [isLoading, setIsLoading]       = useState(true)
  const [returningFromDetail, setReturningFromDetail] = useState(false)

  const browsePanelStateRef = useRef<{ scrollPosition: number; timestamp: number } | null>(null)

  const fetchRotes = useCallback(async () => {
    try {
      const res = await fetch('/api/rotes')
      if (res.ok) setRotes(await res.json())
    } catch (e) { console.error(e) }
    finally { setIsLoading(false) }
  }, [])

  useEffect(() => { fetchRotes() }, [fetchRotes])

  const handleSelectRote = useCallback((rote: Rote) => {
    browsePanelStateRef.current = { scrollPosition: window.scrollY, timestamp: Date.now() }
    setSelectedRote(rote)
  }, [])

  const handleBackFromDetail = useCallback(() => {
    setSelectedRote(null)
    setReturningFromDetail(true)
    if (browsePanelStateRef.current) {
      setTimeout(() => {
        window.scrollTo({ top: browsePanelStateRef.current?.scrollPosition || 0, behavior: 'instant' })
      }, 0)
    }
  }, [])

  const handleAddRote = useCallback(async (rote: Rote) => {
    try {
      const res = await fetch('/api/rotes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(rote),
      })
      if (res.ok) fetchRotes()
    } catch (e) { console.error(e) }
  }, [fetchRotes])

  const handleNavigate = useCallback((tab: TabId) => {
    setSelectedRote(null)
    if (tab === "browse")    { router.push("/browse");       return }
    if (tab === "merits")    { router.push("/merits-flaws"); return }
    if (tab === "resources") { router.push("/recommended");  return }
    setActiveTab(tab)
  }, [router])

  const uniqueTraditions = new Set(rotes.map(r => r.tradition)).size

  const pageContent = (
    <div className="max-w-[1400px] mx-auto bg-background rounded-xl overflow-hidden relative"
      style={{
        /* Single refined border — no 3-ring shadow stack */
        border:    "1px solid hsl(var(--primary) / 0.3)",
        boxShadow: `
          inset 0 1px 0 hsl(var(--primary) / 0.12),
          0 20px 60px hsl(var(--background) / 0.8),
          0 4px 24px rgba(0, 0, 0, 0.45)
        `,
      }}
    >
      {/* Purple diamond corner accents */}
      {["-top-[6px] -left-[6px]", "-top-[6px] -right-[6px]"].map((pos, i) => (
        <div
          key={i}
          className={`absolute ${pos} text-primary z-10 text-xl pointer-events-none`}
          style={{ filter: "drop-shadow(0 0 6px hsl(var(--primary) / 0.6))" }}
          aria-hidden="true"
        >
          ◈
        </div>
      ))}

      {/* Admin button — nearly invisible until hover */}
      <Button
        variant="ghost"
        size="sm"
        className="absolute top-3 right-[72px] z-30 opacity-0 hover:opacity-40
          focus:opacity-40 transition-opacity"
        onClick={() => setShowAdminPanel(true)}
        title="Admin Panel"
      >
        <ShieldAlert className="w-3.5 h-3.5" />
      </Button>

      {/* Top hairline — gold spark left, purple fade right */}
      <div
        className="h-px w-full pointer-events-none"
        aria-hidden="true"
        style={{
          background: "linear-gradient(90deg, hsl(var(--accent) / 0.55) 0%, hsl(var(--primary) / 0.5) 15%, hsl(var(--primary) / 0.15) 55%, transparent 100%)",
        }}
      />

      <GrimoireHeader />
      <GrimoireNav activeTab={activeTab} onTabChange={handleNavigate} />

      {/* Main content — purple crosshatch */}
      <main
        className="min-h-[500px]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M40 0L0 0 0 40' fill='none' stroke='%237b5ea7' stroke-width='0.35' opacity='0.06'/%3E%3C/svg%3E")`,
        }}
      >
        {showAdminPanel ? (
          <AdminPanel rotes={rotes} onRotesChange={fetchRotes} onClose={() => setShowAdminPanel(false)} />
        ) : isLoading ? (
          <div className="flex flex-col items-center justify-center min-h-[500px] gap-4">
            <span
              className="text-accent text-4xl"
              style={{ animation: "spin 3s linear infinite", display: "inline-block" }}
              aria-hidden="true"
            >
              ⚙
            </span>
            <p className="font-serif text-[11px] uppercase tracking-[0.28em] text-muted-foreground/40">
              Turning the Wheel…
            </p>
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
  )

  return (
    <>
      <div className="min-h-screen relative z-[1] py-5 px-3 md:py-7 md:px-4">
        {pageContent}
      </div>
      <Toaster />
    </>
  )
}
