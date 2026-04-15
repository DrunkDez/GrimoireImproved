"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import type { Rote } from "@/lib/mage-data"
import { MarkdownRenderer } from "@/components/ui/markdown-renderer"
import { RandomSphereSymbols } from "@/components/random-sphere-symbols"
import { LatestUpdateBanner } from "@/components/latest-update-banner"  // NEW
import { UpcomingBookReleases } from "@/components/upcoming-book-releases"  // NEW

interface HomePanelProps {
  totalRotes: number
  traditions: number
  onNavigate: (tab: "browse" | "add") => void
}

export function HomePanel({ totalRotes, traditions, onNavigate }: HomePanelProps) {
  const [welcomeTitle, setWelcomeTitle] = useState("Welcome, Newly Awakened")
  const [welcomeText, setWelcomeText] = useState("")
  const [howToUse, setHowToUse] = useState("")
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const response = await fetch('/api/site-settings')
        if (response.ok) {
          const settings = await response.json()
          setWelcomeTitle(settings.welcomeTitle || "Welcome, Newly Awakened")
          setWelcomeText(settings.welcomeText || "Within these pages lies a curated compendium of mystical Rotes drawn from the Nine Traditions and beyond.\n\nEach Rote represents a proven path through the Tapestry, a well-worn groove in reality that an Awakened will may follow.\n\nBrowse the collection, search by Sphere or Tradition, or inscribe your own discoveries for others to study.")
          setHowToUse(settings.howToUse || "Browse rotes, search by tradition or sphere, and add your own discoveries.")
        }
      } catch (error) {
        console.error('Error fetching content:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchContent()
  }, [])

  const stats = [
    { value: totalRotes, label: "Rotes Inscribed" },
    { value: traditions, label: "Traditions, Groups and Practices" },
    { value: 12, label: "Spheres" },
  ]

  return (
    <div className="animate-fade-in-up flex flex-col gap-4 sm:gap-6 md:gap-8 p-3 sm:p-4 md:p-6 lg:p-10">
      {/* NEW: Latest Update Banner */}
      <LatestUpdateBanner />

      {/* Hero area */}
      <div
        className="relative bg-card border-2 sm:border-3 md:border-4 border-double border-primary rounded-lg px-3 sm:px-4 md:px-6 py-8 sm:py-12 md:py-16 text-center
          shadow-[inset_0_0_40px_rgba(139,71,38,0.1),0_8px_20px_rgba(0,0,0,0.2)]
          md:shadow-[inset_0_0_80px_rgba(139,71,38,0.1),0_10px_30px_rgba(0,0,0,0.2)]"
      >
        {/* Background star - smaller on mobile */}
        <div className="absolute top-4 sm:top-6 md:top-8 left-1/2 -translate-x-1/2 text-3xl sm:text-4xl md:text-6xl text-primary opacity-15 font-serif" aria-hidden="true">
          ✦
        </div>

        {/* Random Sphere Symbols */}
        <RandomSphereSymbols />

        <h2 className="font-serif text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-primary uppercase tracking-widest mb-4 sm:mb-5 md:mb-6 px-2">
          {welcomeTitle}
        </h2>

        <div className="max-w-2xl mx-auto px-2">
          <MarkdownRenderer content={welcomeText} className="text-sm sm:text-base md:text-lg" />
        </div>
      </div>

      {/* NEW: Upcoming Book Releases */}
      <UpcomingBookReleases />

      {/* How to Use section */}
      <div className="bg-card border-2 sm:border-[3px] border-primary border-l-[4px] sm:border-l-[6px] border-l-accent rounded-md p-4 sm:p-5 md:p-6 lg:p-8
        shadow-[inset_0_0_20px_rgba(139,71,38,0.05),3px_3px_10px_rgba(0,0,0,0.2)]
        md:shadow-[inset_0_0_40px_rgba(139,71,38,0.05),5px_5px_15px_rgba(0,0,0,0.2)]">
        <h3 className="font-serif text-base sm:text-lg md:text-xl font-bold text-primary uppercase tracking-[0.1em] sm:tracking-[0.15em] mb-3 sm:mb-4 flex items-center gap-2 sm:gap-3">
          <span className="text-ring text-sm sm:text-base" aria-hidden="true">✦</span>
          <span className="flex-1 min-w-0">How to Use The Wheel</span>
          <span className="ml-auto text-accent text-sm sm:text-base" aria-hidden="true">◈</span>
        </h3>
        
        {isLoading ? (
          <div className="flex items-center gap-2 sm:gap-3 justify-center py-3 sm:py-4">
            <span className="text-lg sm:text-xl text-accent animate-spin">⚙</span>
            <p className="text-xs sm:text-sm text-muted-foreground">Loading...</p>
          </div>
        ) : (
          <div className="prose prose-sm sm:prose-base dark:prose-invert max-w-none">
            <MarkdownRenderer content={howToUse} />
          </div>
        )}
      </div>

      {/* Stats - responsive grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="group relative bg-card border-2 sm:border-[3px] border-double border-primary rounded-md p-4 sm:p-5 md:p-6 text-center
              shadow-[inset_0_0_15px_rgba(139,71,38,0.05),2px_2px_8px_rgba(0,0,0,0.15)]
              md:shadow-[inset_0_0_20px_rgba(139,71,38,0.05),3px_3px_10px_rgba(0,0,0,0.15)]
              transition-all duration-300
              hover:border-accent hover:-translate-y-1
              hover:shadow-[inset_0_0_20px_rgba(201,169,97,0.1),3px_3px_15px_rgba(0,0,0,0.2)]"
          >
            <div className="absolute top-1 sm:top-2 left-1/2 -translate-x-1/2 text-primary opacity-30 text-sm sm:text-base md:text-lg" aria-hidden="true">
              ◈
            </div>
            <div className="text-3xl sm:text-4xl md:text-5xl font-serif text-primary leading-none mb-1 sm:mb-2 drop-shadow-[2px_2px_4px_rgba(0,0,0,0.2)]">
              {stat.value}
            </div>
            <div className="font-serif text-[10px] sm:text-xs text-primary font-semibold uppercase tracking-[0.1em] sm:tracking-[0.12em]">
              {stat.label}
            </div>
          </div>
        ))}
      </div>

      {/* Quick actions - responsive */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
        <button
          type="button"
          onClick={() => onNavigate("browse")}
          className="font-serif px-4 sm:px-5 md:px-6 py-3 sm:py-4 bg-primary text-primary-foreground border-2 border-accent rounded-sm
            font-semibold text-xs sm:text-sm uppercase tracking-[0.1em] sm:tracking-[0.15em] cursor-pointer
            transition-all duration-300
            shadow-[0_3px_6px_rgba(0,0,0,0.3),inset_0_1px_0_rgba(255,255,255,0.1)]
            md:shadow-[0_4px_8px_rgba(0,0,0,0.3),inset_0_1px_0_rgba(255,255,255,0.1)]
            hover:bg-muted-foreground hover:-translate-y-0.5
            hover:shadow-[0_6px_12px_rgba(0,0,0,0.4),inset_0_1px_0_rgba(255,255,255,0.2),0_0_20px_rgba(201,169,97,0.3)]
            active:translate-y-0 flex items-center justify-center gap-2 sm:gap-3 min-h-[44px]"
        >
          <span aria-hidden="true" className="text-sm sm:text-base">⟐</span>
          <span className="hidden xs:inline">Browse the Library</span>
          <span className="xs:hidden">Browse</span>
          <span aria-hidden="true" className="text-sm sm:text-base">⟐</span>
        </button>
        
        <button
          type="button"
          onClick={() => onNavigate("add")}
          className="font-serif px-4 sm:px-5 md:px-6 py-3 sm:py-4 bg-secondary text-secondary-foreground border-2 border-primary rounded-sm
            font-semibold text-xs sm:text-sm uppercase tracking-[0.1em] sm:tracking-[0.15em] cursor-pointer
            transition-all duration-300
            shadow-[0_3px_6px_rgba(0,0,0,0.15)]
            md:shadow-[0_4px_8px_rgba(0,0,0,0.15)]
            hover:bg-background hover:border-ring hover:-translate-y-0.5
            active:translate-y-0 flex items-center justify-center gap-2 sm:gap-3 min-h-[44px]"
        >
          <span aria-hidden="true" className="text-sm sm:text-base">⟐</span>
          <span className="hidden xs:inline">Inscribe a Rote</span>
          <span className="xs:hidden">Inscribe</span>
          <span aria-hidden="true" className="text-sm sm:text-base">⟐</span>
        </button>
        
        <Link
          href="/character-creation"
          className="font-serif px-4 sm:px-5 md:px-6 py-3 sm:py-4 bg-secondary text-secondary-foreground border-2 border-primary rounded-sm
            font-semibold text-xs sm:text-sm uppercase tracking-[0.1em] sm:tracking-[0.15em] cursor-pointer
            transition-all duration-300
            shadow-[0_3px_6px_rgba(0,0,0,0.15)]
            md:shadow-[0_4px_8px_rgba(0,0,0,0.15)]
            hover:bg-background hover:border-ring hover:-translate-y-0.5
            active:translate-y-0 flex items-center justify-center gap-2 sm:gap-3 min-h-[44px]"
        >
          <span aria-hidden="true" className="text-sm sm:text-base">⟐</span>
          <span className="hidden sm:inline">Character Creation</span>
          <span className="sm:hidden">Character</span>
          <span aria-hidden="true" className="text-sm sm:text-base">⟐</span>
        </Link>
      </div>
    </div>
  )
}
