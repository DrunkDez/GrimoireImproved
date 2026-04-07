"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { MarkdownRenderer } from "@/components/ui/markdown-renderer"
import { RandomSphereSymbols } from "@/components/random-sphere-symbols"

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
          setWelcomeText(s.welcomeText   || "Within these pages lies a curated compendium of mystical Rotes drawn from the Nine Traditions and beyond.\n\nEach Rote represents a proven path through the Tapestry — a well-worn groove in reality that an Awakened will may follow.\n\nBrowse the collection, search by Sphere or Tradition, or inscribe your own discoveries for others to study.")
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
    { value: 12,          label: "Spheres of Reality"     },
  ]

  return (
    <div className="animate-fade-in-up flex flex-col gap-5 p-5 md:p-7">

      {/* ══ Hero card — purple glass ══ */}
      <div
        className="relative rounded-xl overflow-hidden px-6 py-12 text-center"
        style={{
          background: `linear-gradient(135deg,
            hsl(var(--card) / 0.7) 0%,
            hsl(var(--card) / 0.4) 100%
          )`,
          backdropFilter:       "blur(18px)",
          WebkitBackdropFilter: "blur(18px)",
          border:     "1px solid hsl(var(--primary) / 0.2)",
          borderRadius: "12px",
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
              radial-gradient(ellipse 55% 45% at  8%  0%,  hsl(272 55% 35% / 0.1) 0%, transparent 60%),
              radial-gradient(ellipse 40% 35% at 92% 100%, hsl(290 45% 30% / 0.08) 0%, transparent 55%)
            `,
          }} />
          {/* Hex texture inside card */}
          <svg className="absolute inset-0 w-full h-full opacity-[0.02]" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="hexcard" x="0" y="0" width="22" height="25" patternUnits="userSpaceOnUse">
                <polygon points="11,1 21,6.5 21,18.5 11,24 1,18.5 1,6.5" fill="none" stroke="hsl(272 55% 70%)" strokeWidth="0.5" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#hexcard)" />
          </svg>
        </div>

        <div className="relative z-10">
          <div className="opacity-60 mb-2">
            <RandomSphereSymbols />
          </div>

          <h2
            className="font-serif font-bold uppercase text-primary mb-4"
            style={{
              fontSize:    "clamp(1.1rem, 3vw, 1.5rem)",
              letterSpacing: "0.14em",
              textShadow:  "0 0 30px hsl(var(--primary) / 0.25)",
            }}
          >
            {welcomeTitle}
          </h2>

          <div className="max-w-lg mx-auto">
            <MarkdownRenderer
              content={welcomeText}
              className="text-sm md:text-base text-foreground/75 leading-[1.85]"
            />
          </div>
        </div>
      </div>

      {/* ══ Stats — purple gradient top border ══ */}
      <div className="grid grid-cols-3 gap-3">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="relative group rounded-lg px-4 py-5 text-center overflow-hidden
              transition-all duration-300 hover:-translate-y-0.5"
            style={{
              background: "hsl(var(--card) / 0.7)",
              border:     "1px solid hsl(var(--border) / 0.5)",
              boxShadow:  "inset 0 1px 0 hsl(var(--primary) / 0.08)",
            }}
          >
            {/* Purple gradient top border */}
            <div
              className="absolute top-0 left-0 right-0 h-[2px] rounded-t-lg"
              aria-hidden="true"
              style={{
                background: "linear-gradient(90deg, transparent, hsl(var(--primary) / 0.6), transparent)",
              }}
            />
            {/* Hover glow */}
            <div
              className="absolute inset-0 opacity-0 group-hover:opacity-100 pointer-events-none
                transition-opacity duration-300 rounded-lg"
              aria-hidden="true"
              style={{
                background: "radial-gradient(ellipse at 50% 0%, hsl(var(--primary) / 0.08) 0%, transparent 70%)",
              }}
            />

            <div className="relative z-10">
              <div
                className="font-serif font-black text-primary leading-none mb-1.5"
                style={{
                  fontSize:   "clamp(2rem, 4vw, 2.8rem)",
                  textShadow: "0 0 20px hsl(var(--primary) / 0.25)",
                }}
              >
                {stat.value}
              </div>
              <div className="font-serif text-[10px] uppercase tracking-[0.14em] text-muted-foreground/60 leading-tight">
                {stat.label}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ══ How to use — purple left border callout ══ */}
      {!isLoading && howToUse && (
        <div
          className="rounded-lg px-5 py-4"
          style={{
            background:  "hsl(var(--card) / 0.45)",
            border:      "1px solid hsl(var(--border) / 0.35)",
            borderLeft:  "2px solid hsl(var(--primary) / 0.55)",
          }}
        >
          <h3 className="font-serif text-[10px] uppercase tracking-[0.2em] text-primary/60 mb-2 flex items-center gap-2">
            {/* Gold glyph — accent used sparingly */}
            <span className="text-accent/80" aria-hidden="true">✦</span>
            How to Use The Wheel
          </h3>
          <MarkdownRenderer
            content={howToUse}
            className="text-sm text-muted-foreground/70"
          />
        </div>
      )}

      {/* ══ CTA buttons ══ */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">

        {/* Primary — gold fill, this is the one place gold dominates */}
        <button
          type="button"
          onClick={() => onNavigate("browse")}
          className="group relative overflow-hidden rounded-full px-6 py-3
            font-serif text-[11px] uppercase tracking-[0.18em] font-bold
            transition-all duration-200 cursor-pointer hover:-translate-y-px active:translate-y-0"
          style={{
            background: "linear-gradient(135deg, hsl(var(--accent)) 0%, hsl(var(--accent) / 0.8) 100%)",
            color:      "hsl(var(--accent-foreground))",
            boxShadow:  "0 0 0 1px hsl(var(--accent) / 0.35), 0 4px 18px hsl(var(--accent) / 0.22)",
            border:     "none",
          }}
          onMouseEnter={e => {
            (e.currentTarget as HTMLElement).style.boxShadow =
              "0 0 0 1px hsl(var(--accent) / 0.55), 0 6px 28px hsl(var(--accent) / 0.35), 0 0 48px hsl(var(--accent) / 0.1)"
          }}
          onMouseLeave={e => {
            (e.currentTarget as HTMLElement).style.boxShadow =
              "0 0 0 1px hsl(var(--accent) / 0.35), 0 4px 18px hsl(var(--accent) / 0.22)"
          }}
        >
          <span
            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
            aria-hidden="true"
            style={{ background: "linear-gradient(105deg, transparent 25%, rgba(255,255,255,0.16) 50%, transparent 75%)" }}
          />
          <span className="relative flex items-center justify-center gap-2">
            <span aria-hidden="true" className="text-base leading-none">✧</span>
            Browse the Library
          </span>
        </button>

        {/* Secondary — purple ghost */}
        <button
          type="button"
          onClick={() => onNavigate("add")}
          className="rounded-full px-6 py-3
            font-serif text-[11px] uppercase tracking-[0.18em] font-semibold
            transition-all duration-200 cursor-pointer hover:-translate-y-px active:translate-y-0
            text-primary/75 hover:text-primary"
          style={{
            background:     "hsl(var(--card) / 0.5)",
            backdropFilter: "blur(8px)",
            border:         "1px solid hsl(var(--primary) / 0.3)",
            boxShadow:      "inset 0 1px 0 hsl(var(--primary) / 0.08)",
          }}
          onMouseEnter={e => {
            (e.currentTarget as HTMLElement).style.borderColor = "hsl(var(--primary) / 0.55)"
            ;(e.currentTarget as HTMLElement).style.background  = "hsl(var(--primary) / 0.07)"
          }}
          onMouseLeave={e => {
            (e.currentTarget as HTMLElement).style.borderColor = "hsl(var(--primary) / 0.3)"
            ;(e.currentTarget as HTMLElement).style.background  = "hsl(var(--card) / 0.5)"
          }}
        >
          <span className="flex items-center justify-center gap-2">
            <span aria-hidden="true" className="text-base leading-none">✎</span>
            Inscribe a Rote
          </span>
        </button>

        {/* Tertiary — purple ghost */}
        <Link
          href="/character-creation"
          className="rounded-full px-6 py-3 flex items-center justify-center
            font-serif text-[11px] uppercase tracking-[0.18em] font-semibold
            transition-all duration-200 hover:-translate-y-px active:translate-y-0
            text-primary/75 hover:text-primary"
          style={{
            background:     "hsl(var(--card) / 0.5)",
            backdropFilter: "blur(8px)",
            border:         "1px solid hsl(var(--primary) / 0.3)",
            boxShadow:      "inset 0 1px 0 hsl(var(--primary) / 0.08)",
          }}
        >
          <span className="flex items-center justify-center gap-2">
            <span aria-hidden="true" className="text-base leading-none">◈</span>
            Character Creation
          </span>
        </Link>
      </div>

    </div>
  )
}
