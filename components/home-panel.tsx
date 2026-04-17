"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { MarkdownRenderer } from "@/components/ui/markdown-renderer"
import { RandomSphereSymbols } from "@/components/random-sphere-symbols"
import { LatestUpdateBanner } from "@/components/latest-update-banner"
import { UpcomingBookReleases } from "@/components/upcoming-book-releases"
import { LatestSiteUpdates } from "@/components/latest-site-updates"

interface HomePanelProps {
  totalRotes: number
  traditions: number
  onNavigate: (tab: "browse" | "add") => void
}

export function HomePanel({ totalRotes, traditions, onNavigate }: HomePanelProps) {
  const [welcomeTitle, setWelcomeTitle] = useState("Welcome, Newly Awakened")
  const [welcomeText,  setWelcomeText]  = useState("")
  const [howToUse,     setHowToUse]     = useState("")
  const [isLoading,    setIsLoading]    = useState(true)

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const res = await fetch('/api/site-settings')
        if (res.ok) {
          const s = await res.json()
          setWelcomeTitle(s.welcomeTitle || "Welcome, Newly Awakened")
          setWelcomeText(s.welcomeText   || "Within these pages lies a curated compendium of mystical Rotes drawn from the Nine Traditions and beyond.\n\nEach Rote represents a proven path through the Tapestry, a well-worn groove in reality that an Awakened will may follow.\n\nBrowse the collection, search by Sphere or Tradition, or inscribe your own discoveries for others to study.")
          setHowToUse(s.howToUse        || "Browse rotes, search by tradition or sphere, and add your own discoveries.")
        }
      } catch (e) { console.error(e) }
      finally { setIsLoading(false) }
    }
    fetchContent()
  }, [])

  const stats = [
    { value: totalRotes, label: "Rotes Inscribed"         },
    { value: traditions,  label: "Traditions & Practices" },
    { value: 12,          label: "Spheres"                 },
  ]

  return (
    <div className="animate-fade-in-up flex flex-col gap-4 sm:gap-5 p-3 sm:p-5 md:p-7">

      {/* Latest update banner — unchanged */}
      <LatestUpdateBanner />

      {/* ══ Hero card — purple glass ══ */}
      <div
        className="relative rounded-xl overflow-hidden px-4 sm:px-6 py-10 sm:py-14 text-center"
        style={{
          background: `linear-gradient(135deg, hsl(var(--card) / 0.8) 0%, hsl(var(--card) / 0.6) 100%)`,
          backdropFilter: "blur(18px)",
          WebkitBackdropFilter: "blur(18px)",
          border: "1px solid hsl(var(--primary) / 0.25)",
          boxShadow: `
            inset 0 1px 0 hsl(var(--primary) / 0.15),
            inset 0 -1px 0 hsl(var(--background) / 0.3),
            0 4px 32px hsl(var(--background) / 0.5)
          `,
        }}
      >
        {/* Ambient purple corner glows */}
        <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
          <div style={{
            position: "absolute", inset: 0,
            background: `
              radial-gradient(ellipse 55% 45% at 8%  0%,  hsl(280 55% 30% / 0.12) 0%, transparent 60%),
              radial-gradient(ellipse 40% 35% at 92% 100%, hsl(300 40% 25% / 0.1) 0%, transparent 55%)
            `,
          }} />
          {/* Hex texture */}
          <svg
            className="absolute inset-0 w-full h-full reader-hide"
            xmlns="http://www.w3.org/2000/svg"
            style={{ opacity: 0.02 }}
          >
            <defs>
              <pattern id="hexhero" x="0" y="0" width="22" height="25" patternUnits="userSpaceOnUse">
                <polygon points="11,1 21,6.5 21,18.5 11,24 1,18.5 1,6.5"
                  fill="none" stroke="hsl(280 60% 70%)" strokeWidth="0.5" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#hexhero)" />
          </svg>
        </div>

        <div className="relative z-10">
          <div className="opacity-50 mb-2 reader-hide">
            <RandomSphereSymbols />
          </div>

          <h2
            className="font-serif font-bold uppercase text-primary mb-4 sm:mb-5 px-2"
            style={{
              fontSize: "clamp(1rem, 3vw, 1.45rem)",
              letterSpacing: "0.14em",
            }}
          >
            {welcomeTitle}
          </h2>

          {/* Body text — full foreground, no opacity reduction */}
          <div className="max-w-xl mx-auto px-2">
            <MarkdownRenderer
              content={welcomeText}
              className="text-sm sm:text-base text-foreground leading-[1.85]"
            />
          </div>
        </div>
      </div>

      {/* Latest news — unchanged */}
      <LatestSiteUpdates />

      {/* Upcoming books — unchanged */}
      <UpcomingBookReleases />

      {/* ══ How to Use — purple left-border callout ══ */}
      <div
        className="rounded-lg px-4 sm:px-6 py-4 sm:py-5"
        style={{
          background:  "hsl(var(--card) / 0.6)",
          border:      "1px solid hsl(var(--border) / 0.5)",
          borderLeft:  "3px solid hsl(var(--primary) / 0.65)",
        }}
      >
        <h3
          className="font-serif font-bold text-primary uppercase flex items-center gap-2 mb-3"
          style={{ fontSize: "clamp(0.7rem, 1.5vw, 0.82rem)", letterSpacing: "0.18em" }}
        >
          <span className="text-accent/80 text-sm" aria-hidden="true">✦</span>
          How to Use The Wheel
          <span className="ml-auto text-primary/25 text-sm reader-hide" aria-hidden="true">◈</span>
        </h3>

        {isLoading ? (
          <div className="flex items-center gap-2 py-2">
            <span className="text-accent text-lg animate-spin" aria-hidden="true">⚙</span>
            <p className="text-xs text-muted-foreground font-serif tracking-widest uppercase">Loading…</p>
          </div>
        ) : (
          /* Full foreground on how-to text */
          <MarkdownRenderer content={howToUse} className="text-sm text-foreground" />
        )}
      </div>

      {/* ══ Stats — purple gradient top-border ══ */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="relative group rounded-lg px-4 py-5 sm:py-6 text-center overflow-hidden
              transition-all duration-300 hover:-translate-y-0.5"
            style={{
              background: "hsl(var(--card))",
              border:     "1px solid hsl(var(--border) / 0.6)",
              boxShadow:  "inset 0 1px 0 hsl(var(--primary) / 0.08)",
            }}
          >
            {/* Purple gradient top-border */}
            <div
              className="absolute top-0 left-0 right-0 rounded-t-lg"
              aria-hidden="true"
              style={{
                height: "2px",
                background: "linear-gradient(90deg, transparent, hsl(var(--primary) / 0.7), transparent)",
              }}
            />
            {/* Hover glow */}
            <div
              className="absolute inset-0 opacity-0 group-hover:opacity-100 pointer-events-none
                transition-opacity duration-300 rounded-lg"
              aria-hidden="true"
              style={{
                background: "radial-gradient(ellipse at 50% 0%, hsl(var(--primary) / 0.1) 0%, transparent 70%)",
              }}
            />

            <div className="relative z-10">
              <div
                className="font-serif font-black text-primary leading-none mb-1.5"
                style={{ fontSize: "clamp(2rem, 5vw, 2.8rem)" }}
              >
                {stat.value}
              </div>
              {/* Stat label — muted-foreground is now readable in pass 3 palette */}
              <div
                className="font-serif uppercase text-muted-foreground leading-tight"
                style={{ fontSize: "clamp(9px, 1.2vw, 11px)", letterSpacing: "0.14em" }}
              >
                {stat.label}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ══ CTA buttons — pill style ══ */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">

        {/* Primary — solid gold */}
        <button
          type="button"
          onClick={() => onNavigate("browse")}
          className="group relative overflow-hidden rounded-full px-5 py-3 sm:py-3.5
            font-serif uppercase font-bold cursor-pointer
            transition-all duration-200 hover:-translate-y-px active:translate-y-0
            flex items-center justify-center gap-2"
          style={{
            fontSize:      "clamp(9px, 1.3vw, 11px)",
            letterSpacing: "0.18em",
            background:    "linear-gradient(135deg, hsl(var(--accent)) 0%, hsl(var(--accent) / 0.82) 100%)",
            color:         "hsl(var(--accent-foreground))",
            border:        "none",
            boxShadow:     "0 0 0 1px hsl(var(--accent) / 0.38), 0 4px 18px hsl(var(--accent) / 0.25)",
          }}
          onMouseEnter={e => {
            (e.currentTarget as HTMLElement).style.boxShadow =
              "0 0 0 1px hsl(var(--accent)/0.58), 0 6px 28px hsl(var(--accent)/0.38), 0 0 48px hsl(var(--accent)/0.12)"
          }}
          onMouseLeave={e => {
            (e.currentTarget as HTMLElement).style.boxShadow =
              "0 0 0 1px hsl(var(--accent)/0.38), 0 4px 18px hsl(var(--accent)/0.25)"
          }}
        >
          <span
            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
            aria-hidden="true"
            style={{ background: "linear-gradient(105deg, transparent 25%, rgba(255,255,255,0.16) 50%, transparent 75%)" }}
          />
          <span aria-hidden="true" className="relative text-base leading-none">✧</span>
          <span className="relative hidden xs:inline">Browse the Library</span>
          <span className="relative xs:hidden">Browse</span>
        </button>

        {/* Secondary — purple ghost */}
        <button
          type="button"
          onClick={() => onNavigate("add")}
          className="rounded-full px-5 py-3 sm:py-3.5
            font-serif uppercase font-semibold cursor-pointer
            transition-all duration-200 hover:-translate-y-px active:translate-y-0
            flex items-center justify-center gap-2"
          style={{
            fontSize:       "clamp(9px, 1.3vw, 11px)",
            letterSpacing:  "0.18em",
            color:          "hsl(var(--primary))",
            background:     "hsl(var(--card) / 0.6)",
            backdropFilter: "blur(8px)",
            border:         "1px solid hsl(var(--primary) / 0.35)",
            boxShadow:      "inset 0 1px 0 hsl(var(--primary) / 0.08)",
          }}
          onMouseEnter={e => {
            (e.currentTarget as HTMLElement).style.borderColor = "hsl(var(--primary) / 0.6)"
            ;(e.currentTarget as HTMLElement).style.background  = "hsl(var(--primary) / 0.08)"
          }}
          onMouseLeave={e => {
            (e.currentTarget as HTMLElement).style.borderColor = "hsl(var(--primary) / 0.35)"
            ;(e.currentTarget as HTMLElement).style.background  = "hsl(var(--card) / 0.6)"
          }}
        >
          <span aria-hidden="true" className="text-base leading-none">✎</span>
          <span className="hidden xs:inline">Inscribe a Rote</span>
          <span className="xs:hidden">Inscribe</span>
        </button>

        {/* Tertiary — purple ghost */}
        <Link
          href="/character-creation"
          className="rounded-full px-5 py-3 sm:py-3.5
            font-serif uppercase font-semibold
            transition-all duration-200 hover:-translate-y-px active:translate-y-0
            flex items-center justify-center gap-2"
          style={{
            fontSize:       "clamp(9px, 1.3vw, 11px)",
            letterSpacing:  "0.18em",
            color:          "hsl(var(--primary))",
            background:     "hsl(var(--card) / 0.6)",
            backdropFilter: "blur(8px)",
            border:         "1px solid hsl(var(--primary) / 0.35)",
            boxShadow:      "inset 0 1px 0 hsl(var(--primary) / 0.08)",
          }}
        >
          <span aria-hidden="true" className="text-base leading-none">◈</span>
          <span className="hidden sm:inline">Character Creation</span>
          <span className="sm:hidden">Character</span>
        </Link>
      </div>

    </div>
  )
}
