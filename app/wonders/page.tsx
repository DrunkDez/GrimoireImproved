// app/wonders/page.tsx
"use client"

import { useState, useCallback, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import type { Wonder } from "@/lib/wonder-data"
import { GrimoireHeader } from "@/components/grimoire-header"
import { GrimoireFooter } from "@/components/grimoire-footer"
import { BrowseWondersPanel } from "@/components/browse-wonders-panel"
import { Button } from "@/components/ui/button"
import { Home, Plus } from "lucide-react"
import { Toaster } from "@/components/ui/toaster"
import Link from "next/link"
import { AddWonderPanel } from "@/components/add-wonder-panel"

export default function WondersPage() {
  const router = useRouter()
  const { data: session } = useSession()
  const [wonders, setWonders] = useState<Wonder[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showAddPanel, setShowAddPanel] = useState(false)

  const fetchWonders = useCallback(async () => {
    try {
      const response = await fetch('/api/wonders')
      if (response.ok) {
        const data = await response.json()
        setWonders(data)
      }
    } catch (error) {
      console.error('Error fetching wonders:', error)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchWonders()
  }, [fetchWonders])

  const handleWonderAdded = () => {
    fetchWonders()  // refresh list
  }

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

          {/* Action Bar */}
          <div className="px-6 py-4 border-b-2 border-primary/20 flex items-center justify-between">
            <Link href="/">
              <Button variant="outline" className="gap-2">
                <Home className="w-4 h-4" />
                Back to Home
              </Button>
            </Link>
            {session && (
              <Button onClick={() => setShowAddPanel(true)} className="gap-2">
                <Plus className="w-4 h-4" />
                Add Wonder
              </Button>
            )}
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
                  <span className="text-2xl text-accent animate-spin">✨</span>
                  <p className="text-muted-foreground">Loading wonders...</p>
                </div>
              </div>
            ) : (
              <BrowseWondersPanel wonders={wonders} />
            )}
          </main>

          <GrimoireFooter />
        </div>
      </div>
      <Toaster />

      {/* Add Wonder Modal */}
      {showAddPanel && (
        <AddWonderPanel
          onClose={() => setShowAddPanel(false)}
          onWonderAdded={handleWonderAdded}
        />
      )}
    </>
  )
}
