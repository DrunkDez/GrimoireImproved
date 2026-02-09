"use client"

import type { Rote } from "@/lib/mage-data"

interface HomePanelProps {
  totalRotes: number
  traditions: number
  onNavigate: (tab: "browse" | "add" | "search") => void
}

export function HomePanel({ totalRotes, traditions, onNavigate }: HomePanelProps) {
  const stats = [
    { value: totalRotes, label: "Rotes Inscribed" },
    { value: traditions, label: "Traditions" },
    { value: 12, label: "Spheres" },
  ]

  return (
    <div className="animate-fade-in-up flex flex-col gap-8 p-6 md:p-10">
      {/* Hero area */}
      <div
        className="relative bg-card border-4 border-double border-primary rounded-lg px-6 py-16 text-center
          shadow-[inset_0_0_80px_rgba(139,71,38,0.1),0_10px_30px_rgba(0,0,0,0.2)]"
      >
        {/* Background star */}
        <div className="absolute top-8 left-1/2 -translate-x-1/2 text-6xl text-primary opacity-15 font-serif" aria-hidden="true">
          {'\u2726'}
        </div>

        {/* Mystical icon */}
        <div className="text-6xl text-primary opacity-70 mb-6 animate-mystical-pulse drop-shadow-[0_0_15px_rgba(107,45,107,0.5)]" aria-hidden="true">
          {'\u2748'}
        </div>

        <h2 className="font-serif text-2xl md:text-3xl font-bold text-primary uppercase tracking-widest mb-6">
          Welcome, Seeker of Knowledge
        </h2>

        <p className="font-mono text-foreground text-base md:text-lg leading-relaxed max-w-2xl mx-auto mb-3">
          Within these pages lies a curated compendium of mystical Rotes drawn from
          the Nine Traditions and beyond.
        </p>
        <p className="font-mono text-foreground text-base md:text-lg leading-relaxed max-w-2xl mx-auto mb-3">
          Each Rote represents a proven path through the Tapestry, a well-worn
          groove in reality that an Awakened will may follow.
        </p>
        <p className="font-mono text-muted-foreground italic text-sm max-w-lg mx-auto">
          Browse the collection, search by Sphere or Tradition, or inscribe your own
          discoveries for others to study.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="group relative bg-card border-[3px] border-double border-primary rounded-md p-6 text-center
              shadow-[inset_0_0_20px_rgba(139,71,38,0.05),3px_3px_10px_rgba(0,0,0,0.15)]
              transition-all duration-300
              hover:border-accent hover:-translate-y-1
              hover:shadow-[inset_0_0_20px_rgba(201,169,97,0.1),3px_3px_15px_rgba(0,0,0,0.2)]"
          >
            <div className="absolute top-2 left-1/2 -translate-x-1/2 text-primary opacity-30 text-lg" aria-hidden="true">
              {'\u25C8'}
            </div>
            <div className="text-5xl font-serif text-primary leading-none mb-2 drop-shadow-[2px_2px_4px_rgba(0,0,0,0.2)]">
              {stat.value}
            </div>
            <div className="font-serif text-xs text-primary font-semibold uppercase tracking-[0.12em]">
              {stat.label}
            </div>
          </div>
        ))}
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <button
          type="button"
          onClick={() => onNavigate("browse")}
          className="font-serif px-6 py-4 bg-primary text-primary-foreground border-2 border-accent rounded-sm
            font-semibold text-sm uppercase tracking-[0.15em] cursor-pointer
            transition-all duration-300
            shadow-[0_4px_8px_rgba(0,0,0,0.3),inset_0_1px_0_rgba(255,255,255,0.1)]
            hover:bg-muted-foreground hover:-translate-y-0.5
            hover:shadow-[0_6px_12px_rgba(0,0,0,0.4),inset_0_1px_0_rgba(255,255,255,0.2),0_0_20px_rgba(201,169,97,0.3)]
            active:translate-y-0 flex items-center justify-center gap-3"
        >
          <span aria-hidden="true">{'\u27D0'}</span>
          Browse the Library
          <span aria-hidden="true">{'\u27D0'}</span>
        </button>
        <button
          type="button"
          onClick={() => onNavigate("search")}
          className="font-serif px-6 py-4 bg-secondary text-secondary-foreground border-2 border-primary rounded-sm
            font-semibold text-sm uppercase tracking-[0.15em] cursor-pointer
            transition-all duration-300
            shadow-[0_4px_8px_rgba(0,0,0,0.15)]
            hover:bg-background hover:border-ring hover:-translate-y-0.5
            active:translate-y-0 flex items-center justify-center gap-3"
        >
          <span aria-hidden="true">{'\u27D0'}</span>
          Search Rotes
          <span aria-hidden="true">{'\u27D0'}</span>
        </button>
        <button
          type="button"
          onClick={() => onNavigate("add")}
          className="font-serif px-6 py-4 bg-secondary text-secondary-foreground border-2 border-primary rounded-sm
            font-semibold text-sm uppercase tracking-[0.15em] cursor-pointer
            transition-all duration-300
            shadow-[0_4px_8px_rgba(0,0,0,0.15)]
            hover:bg-background hover:border-ring hover:-translate-y-0.5
            active:translate-y-0 flex items-center justify-center gap-3"
        >
          <span aria-hidden="true">{'\u27D0'}</span>
          Inscribe a Rote
          <span aria-hidden="true">{'\u27D0'}</span>
        </button>
      </div>
    </div>
  )
}
