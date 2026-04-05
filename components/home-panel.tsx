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
    { value: totalRotes, label: "Rotes Inscribed",              symbol: "✎" },
    { value: traditions,  label: "Traditions & Practices",      symbol: "✦" },
    { value: 12,          label: "Spheres",                     symbol: "⚙" },
  ]

  return (
    <div className="animate-fade-in-up flex flex-col gap-6 p-5 md:p-8">

      {/* ── Hero card — glass morphism ── */}
      <div
        className="relative rounded-xl overflow-hidden text-center px-6 py-14"
        style={{
          background: 'linear-gradient(135deg, hsl(var(--card) / 0.7) 0%, hsl(var(--card) / 0.4) 100%)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          border: '1px solid hsl(var(--accent) / 0.2)',
          boxShadow: `
            inset 0 1px 0 hsl(var(--accent) / 0.15),
            inset 0 -1px 0 hsl(var(--primary) / 0.1),
            0 8px 40px hsl(var(--background) / 0.6),
            0 0 0 1px hsl(var(--border) / 0.5)
          `,
        }}
      >
        {/* Corner accent glows */}
        <div
          className="absolute top-0 left-0 w-48 h-48 rounded-br-full pointer-events-none"
          aria-hidden="true"
          style={{ background: 'radial-gradient(circle, hsl(var(--accent) / 0.06) 0%, transparent 70%)' }}
        />
        <div
          className="absolute bottom-0 right-0 w-64 h-32 pointer-events-none"
          aria-hidden="true"
          style={{ background: 'radial-gradient(ellipse, hsl(var(--primary) / 0.08) 0%, transparent 70%)' }}
        />

        {/* Sphere symbols */}
        <div className="relative z-10">
          <RandomSphereSymbols />

          <h2 className="font-serif text-2xl md:text-3xl font-bold text-primary uppercase tracking-[0.14em] mb-5 mt-2">
            {welcomeTitle}
          </h2>

          <div className="max-w-xl mx-auto">
            <MarkdownRenderer
              content={welcomeText}
              className="text-base md:text-lg text-foreground/80 leading-relaxed"
            />
          </div>
        </div>
      </div>

      {/* ── Stats row ── */}
      <div className="grid grid-cols-3 gap-3 md:gap-4">
        {stats.map((stat, i) => (
          <div
            key={stat.label}
            className="relative rounded-lg px-4 py-5 text-center group overflow-hidden
              transition-all duration-300 hover:-translate-y-0.5"
            style={{
              background: 'linear-gradient(135deg, hsl(var(--card) / 0.8), hsl(var(--card) / 0.5))',
              border: '1px solid hsl(var(--border) / 0.6)',
              boxShadow: 'inset 0 1px 0 hsl(var(--accent) / 0.08), 0 2px 12px hsl(var(--background) / 0.5)',
            }}
          >
            {/* Hover glow */}
            <div
              className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none rounded-lg"
              aria-hidden="true"
              style={{
                background: 'radial-gradient(ellipse at 50% 0%, hsl(var(--accent) / 0.08) 0%, transparent 70%)',
              }}
            />

            <div className="relative z-10">
              <div className="text-xs text-accent/60 mb-1 font-serif" aria-hidden="true">
                {stat.symbol}
              </div>
              <div className="text-4xl md:text-5xl font-serif font-black text-primary leading-none mb-2
                drop-shadow-[0_2px_8px_hsl(var(--primary)/0.3)]">
                {stat.value}
              </div>
              <div className="font-serif text-[10px] md:text-xs text-muted-foreground uppercase tracking-[0.14em] leading-tight">
                {stat.label}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ── How to use — slim glass card ── */}
      <div
        className="rounded-lg px-5 py-5 md:px-7"
        style={{
          background: 'linear-gradient(135deg, hsl(var(--card) / 0.6), hsl(var(--card) / 0.3))',
          backdropFilter: 'blur(8px)',
          WebkitBackdropFilter: 'blur(8px)',
          borderLeft: '3px solid hsl(var(--accent) / 0.6)',
          border: '1px solid hsl(var(--border) / 0.4)',
          borderLeftWidth: '3px',
          borderLeftColor: 'hsl(var(--accent) / 0.6)',
        }}
      >
        <h3 className="font-serif text-sm font-bold text-primary uppercase tracking-[0.16em] mb-3 flex items-center gap-2">
          <span className="text-accent text-base" aria-hidden="true">✦</span>
          How to Use The Wheel
        </h3>

        {isLoading ? (
          <div className="flex items-center gap-2 py-2">
            <span className="text-accent animate-spin text-lg">⚙</span>
            <p className="text-xs text-muted-foreground font-serif tracking-widest uppercase">Loading…</p>
          </div>
        ) : (
          <MarkdownRenderer content={howToUse} />
        )}
      </div>

      {/* ── CTA buttons — sleek pills with glow ── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">

        {/* Primary CTA */}
        <button
          type="button"
          onClick={() => onNavigate("browse")}
          className="group relative overflow-hidden rounded-full px-6 py-3.5
            font-serif text-xs uppercase tracking-[0.16em] font-bold
            transition-all duration-300 cursor-pointer
            hover:-translate-y-0.5 active:translate-y-0"
          style={{
            background: 'linear-gradient(135deg, hsl(var(--accent)) 0%, hsl(var(--accent) / 0.8) 100%)',
            color: 'hsl(var(--accent-foreground))',
            boxShadow: '0 0 0 1px hsl(var(--accent) / 0.4), 0 4px 16px hsl(var(--accent) / 0.25)',
          }}
          onMouseEnter={e => {
            (e.currentTarget as HTMLButtonElement).style.boxShadow =
              '0 0 0 1px hsl(var(--accent) / 0.6), 0 6px 24px hsl(var(--accent) / 0.4), 0 0 40px hsl(var(--accent) / 0.15)'
          }}
          onMouseLeave={e => {
            (e.currentTarget as HTMLButtonElement).style.boxShadow =
              '0 0 0 1px hsl(var(--accent) / 0.4), 0 4px 16px hsl(var(--accent) / 0.25)'
          }}
        >
          {/* Shimmer sweep on hover */}
          <span
            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
            aria-hidden="true"
            style={{
              background: 'linear-gradient(105deg, transparent 20%, rgba(255,255,255,0.18) 50%, transparent 80%)',
            }}
          />
          <span className="relative flex items-center justify-center gap-2">
            <span aria-hidden="true">✧</span>
            Browse the Library
          </span>
        </button>

        {/* Secondary CTA */}
        <button
          type="button"
          onClick={() => onNavigate("add")}
          className="group relative overflow-hidden rounded-full px-6 py-3.5
            font-serif text-xs uppercase tracking-[0.16em] font-semibold
            transition-all duration-300 cursor-pointer
            hover:-translate-y-0.5 active:translate-y-0"
          style={{
            background: 'hsl(var(--card) / 0.6)',
            backdropFilter: 'blur(8px)',
            color: 'hsl(var(--primary))',
            border: '1px solid hsl(var(--primary) / 0.35)',
            boxShadow: 'inset 0 1px 0 hsl(var(--primary) / 0.1)',
          }}
          onMouseEnter={e => {
            (e.currentTarget as HTMLButtonElement).style.borderColor = 'hsl(var(--accent) / 0.5)'
            ;(e.currentTarget as HTMLButtonElement).style.color = 'hsl(var(--accent))'
          }}
          onMouseLeave={e => {
            (e.currentTarget as HTMLButtonElement).style.borderColor = 'hsl(var(--primary) / 0.35)'
            ;(e.currentTarget as HTMLButtonElement).style.color = 'hsl(var(--primary))'
          }}
        >
          <span className="relative flex items-center justify-center gap-2">
            <span aria-hidden="true">✎</span>
            Inscribe a Rote
          </span>
        </button>

        {/* Tertiary CTA */}
        <Link
          href="/character-creation"
          className="group relative overflow-hidden rounded-full px-6 py-3.5
            font-serif text-xs uppercase tracking-[0.16em] font-semibold text-center
            transition-all duration-300
            hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center"
          style={{
            background: 'hsl(var(--card) / 0.6)',
            backdropFilter: 'blur(8px)',
            color: 'hsl(var(--primary))',
            border: '1px solid hsl(var(--primary) / 0.35)',
            boxShadow: 'inset 0 1px 0 hsl(var(--primary) / 0.1)',
          }}
        >
          <span className="relative flex items-center justify-center gap-2">
            <span aria-hidden="true">◈</span>
            Character Creation
          </span>
        </Link>
      </div>

    </div>
  )
}
