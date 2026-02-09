"use client"

import type { Rote } from "@/lib/mage-data"
import { getTraditionSymbol, isTechnocracySphere } from "@/lib/mage-data"
import { SphereDots } from "./sphere-dots"

interface RoteCardProps {
  rote: Rote
  onClick: (rote: Rote) => void
}

export function RoteCard({ rote, onClick }: RoteCardProps) {
  return (
    <button
      type="button"
      onClick={() => onClick(rote)}
      className="group text-left w-full bg-background border-[3px] border-primary border-l-[5px] border-l-accent rounded-md p-5
        shadow-[inset_0_0_30px_rgba(139,71,38,0.08),5px_5px_15px_rgba(0,0,0,0.25)]
        transition-all duration-300 cursor-pointer relative
        hover:border-accent hover:-translate-y-1.5
        hover:shadow-[inset_0_0_30px_rgba(201,169,97,0.15),5px_10px_25px_rgba(0,0,0,0.3),0_0_20px_rgba(201,169,97,0.2)]
        focus-visible:outline-2 focus-visible:outline-ring focus-visible:outline-offset-2"
    >
      {/* Corner star decoration */}
      <div
        className="absolute top-2 right-2 w-8 h-8 opacity-15 group-hover:opacity-30 transition-opacity"
        aria-hidden="true"
      >
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <path
            d="M50 10 L60 40 L90 50 L60 60 L50 90 L40 60 L10 50 L40 40 Z"
            fill="hsl(300 45% 30%)"
          />
        </svg>
      </div>

      {/* Rote name */}
      <h3 className="font-serif text-lg font-bold text-primary uppercase tracking-wide leading-snug mb-3 pr-8">
        {rote.name}
      </h3>

      {/* Tradition badge */}
      <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-primary/15 border-2 border-primary rounded-sm text-primary font-mono text-sm font-semibold italic mb-3">
        <span className="text-accent">{getTraditionSymbol(rote.tradition)}</span>
        {rote.tradition}
      </span>

      {/* Description */}
      <p className="font-mono text-foreground text-sm leading-relaxed mb-4 line-clamp-3">
        {rote.description}
      </p>

      {/* Sphere tags */}
      <div className="flex flex-wrap gap-2 mb-4">
        {Object.entries(rote.spheres).map(([sphere, level]) => (
          <div
            key={sphere}
            className={`flex items-center gap-2 px-2.5 py-1.5 border rounded-sm text-xs font-semibold uppercase tracking-wide font-serif
              ${isTechnocracySphere(sphere)
                ? "bg-foreground/5 border-foreground/40 text-foreground"
                : "bg-primary/10 border-primary text-primary"
              }`}
          >
            <span>{sphere}</span>
            <SphereDots level={level} size="sm" />
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="flex justify-between items-center pt-3 border-t-2 border-primary font-serif text-xs text-muted-foreground font-semibold uppercase tracking-widest">
        <span>{rote.level}</span>
        {rote.pageRef && <span className="font-mono italic normal-case text-xs">{rote.pageRef}</span>}
      </div>
    </button>
  )
}
