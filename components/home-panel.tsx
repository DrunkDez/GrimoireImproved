"use client"

import Link from "next/link"
import type { Rote } from "@/lib/mage-data"

interface HomePanelProps {
  totalRotes: number
  traditions: number
  onNavigate: (tab: "browse" | "add") => void
}

export function HomePanel({ totalRotes, traditions, onNavigate }: HomePanelProps) {
  const stats = [
    { value: totalRotes, label: "Rotes Inscribed" },
    { value: traditions, label: "Traditions" },
    { value: 12, label: "Spheres" },
  ]

  return (
    <div className="animate-fade-in-up flex flex-col gap-8 p-6 md:p-10">
      {/* Hero area - Modernized with glass effect */}
      <div className="relative bg-card/60 backdrop-blur-sm border-2 border-primary/30 rounded-xl px-6 py-16 text-center shadow-xl hover:shadow-2xl transition-all duration-500 group">
        {/* Animated background glow */}
        <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-primary/5 via-transparent to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        
        {/* Background star */}
        <div className="absolute top-8 left-1/2 -translate-x-1/2 text-6xl text-primary/20 dark:text-primary/30 font-serif" aria-hidden="true">
          {'\u2726'}
        </div>

        {/* Mystical icon */}
        <div className="relative text-6xl text-primary/80 dark:text-accent mb-6 animate-mystical-pulse drop-shadow-[0_0_20px_rgba(180,120,200,0.4)] dark:drop-shadow-[0_0_30px_rgba(180,120,200,0.6)]" aria-hidden="true">
          {'\u2748'}
        </div>

        <h2 className="relative font-serif text-2xl md:text-3xl font-bold text-primary dark:text-primary uppercase tracking-widest mb-6">
          Welcome, Seeker of Knowledge
        </h2>

        <p className="relative font-mono text-foreground text-base md:text-lg leading-relaxed max-w-2xl mx-auto mb-3">
          Within these pages lies a curated compendium of mystical Rotes drawn from
          the Nine Traditions and beyond.
        </p>
        <p className="relative font-mono text-foreground text-base md:text-lg leading-relaxed max-w-2xl mx-auto mb-3">
          Each Rote represents a proven path through the Tapestry, a well-worn
          groove in reality that an Awakened will may follow.
        </p>
        <p className="relative font-mono text-muted-foreground italic text-sm max-w-lg mx-auto">
          Browse the collection, search by Sphere or Tradition, or inscribe your own
          discoveries for others to study.
        </p>
      </div>

      {/* Stats - Modernized cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="group relative bg-card/80 backdrop-blur-sm border-2 border-primary/20 rounded-lg p-6 text-center
              shadow-lg hover:shadow-2xl
              transition-all duration-300
              hover:border-primary hover:-translate-y-2
              hover:bg-card
              overflow-hidden"
          >
            {/* Animated gradient background */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-accent/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            
            {/* Decorative symbol */}
            <div className="absolute top-2 left-1/2 -translate-x-1/2 text-primary/30 dark:text-primary/40 text-lg group-hover:scale-110 transition-transform duration-300" aria-hidden="true">
              {'\u25C8'}
            </div>
            
            <div className="relative text-5xl font-serif text-primary dark:text-accent leading-none mb-2 drop-shadow-lg group-hover:scale-110 transition-transform duration-300">
              {stat.value}
            </div>
            <div className="relative font-serif text-xs text-primary/80 dark:text-accent/80 font-semibold uppercase tracking-[0.12em]">
              {stat.label}
            </div>
          </div>
        ))}
      </div>

      {/* Quick actions - Modernized buttons */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <button
          type="button"
          onClick={() => onNavigate("browse")}
          className="group relative font-serif px-6 py-4 bg-gradient-to-br from-primary to-primary/80 text-primary-foreground border-2 border-accent/50 rounded-lg
            font-semibold text-sm uppercase tracking-[0.15em] cursor-pointer
            transition-all duration-300
            shadow-lg hover:shadow-2xl
            hover:scale-105 hover:border-accent
            active:scale-100
            flex items-center justify-center gap-3
            overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
          <span className="relative" aria-hidden="true">{'\u27D0'}</span>
          <span className="relative">Browse the Library</span>
          <span className="relative" aria-hidden="true">{'\u27D0'}</span>
        </button>
        
        <button
          type="button"
          onClick={() => onNavigate("add")}
          className="group relative font-serif px-6 py-4 bg-secondary/80 backdrop-blur-sm text-secondary-foreground border-2 border-primary/30 rounded-lg
            font-semibold text-sm uppercase tracking-[0.15em] cursor-pointer
            transition-all duration-300
            shadow-lg hover:shadow-2xl
            hover:bg-secondary hover:border-primary hover:scale-105
            active:scale-100
            flex items-center justify-center gap-3
            overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
          <span className="relative" aria-hidden="true">{'\u27D0'}</span>
          <span className="relative">Inscribe a Rote</span>
          <span className="relative" aria-hidden="true">{'\u27D0'}</span>
        </button>
        
        <Link
          href="/character-creation"
          className="group relative font-serif px-6 py-4 bg-secondary/80 backdrop-blur-sm text-secondary-foreground border-2 border-primary/30 rounded-lg
            font-semibold text-sm uppercase tracking-[0.15em] cursor-pointer
            transition-all duration-300
            shadow-lg hover:shadow-2xl
            hover:bg-secondary hover:border-primary hover:scale-105
            active:scale-100
            flex items-center justify-center gap-3
            overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
          <span className="relative" aria-hidden="true">{'\u27D0'}</span>
          <span className="relative">Character Creation</span>
          <span className="relative" aria-hidden="true">{'\u27D0'}</span>
        </Link>
      </div>
    </div>
  )
}
