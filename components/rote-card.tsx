"use client"

import { useState } from "react"
import type { Rote } from "@/lib/mage-data"
import { getTraditionSymbol, isTechnocracySphere } from "@/lib/mage-data"
import { SphereDots } from "./sphere-dots"
import { ShareButton } from "./share-button"
import Link from "next/link"

interface RoteWithUser extends Rote {
  user?: {
    id: string
    name: string | null
    email: string
  } | null
}

interface RoteCardProps {
  rote: RoteWithUser
  onClick: (rote: Rote) => void
  compact?: boolean
  matchingSpheres?: Record<string, number> // The sphere combination that matched the search
}

function formatSpheres(spheres: any): { [key: string]: number } {
  // If it's an array with single combination, return first item
  if (Array.isArray(spheres) && spheres.length === 1) {
    return spheres[0];
  }
  
  // If it's an array with multiple combinations, return first one
  if (Array.isArray(spheres) && spheres.length > 1) {
    return spheres[0];
  }
  
  // If it's already an object, return as-is
  if (typeof spheres === 'object' && !Array.isArray(spheres)) {
    return spheres;
  }
  
  return {};
}

function getAllCombinations(spheres: any): Array<{ [key: string]: number }> {
  if (Array.isArray(spheres)) {
    return spheres;
  }
  
  if (typeof spheres === 'object' && !Array.isArray(spheres)) {
    return [spheres];
  }
  
  return [];
}

export function RoteCard({ rote, onClick, compact = false, matchingSpheres }: RoteCardProps) {
  const [showAllCombos, setShowAllCombos] = useState(false)
  
  const allCombinations = getAllCombinations(rote.spheres)
  const hasMultipleCombinations = allCombinations.length > 1
  
  // If we have matching spheres from a search, show that combo first
  const primaryCombo = matchingSpheres || formatSpheres(rote.spheres)
  
  // Filter to show only matching combo or all combos based on toggle
  const displayCombinations = hasMultipleCombinations && matchingSpheres && !showAllCombos
    ? [matchingSpheres]
    : allCombinations

  // Compact view - just name and spheres
  if (compact) {
    return (
      <button
        type="button"
        onClick={() => onClick(rote)}
        className="group text-left w-full bg-background border-2 border-primary rounded-sm p-4
          shadow-[3px_3px_8px_rgba(0,0,0,0.15)]
          transition-all duration-300 cursor-pointer
          hover:border-accent hover:-translate-y-1
          hover:shadow-[3px_6px_12px_rgba(0,0,0,0.2),0_0_15px_rgba(201,169,97,0.15)]
          focus-visible:outline-2 focus-visible:outline-ring focus-visible:outline-offset-2"
      >
        <div className="flex items-start justify-between gap-3">
          {/* Name */}
          <h3 className="font-serif text-base font-bold text-primary uppercase tracking-wide leading-tight flex-1">
            {rote.name}
          </h3>
          
          {/* Spheres - compact inline */}
          <div className="flex flex-wrap gap-1.5 items-center justify-end flex-shrink-0">
            {hasMultipleCombinations && (
              <span className="text-xs text-accent">✨</span>
            )}
            {Object.entries(primaryCombo).map(([sphere, level]) => (
              <div
                key={sphere}
                className={`flex items-center gap-1 px-1.5 py-0.5 border rounded-sm text-xs font-semibold uppercase font-serif
                  ${isTechnocracySphere(sphere)
                    ? "bg-foreground/5 border-foreground/40 text-foreground"
                    : "bg-primary/10 border-primary text-primary"
                  }`}
              >
                <span>{sphere}</span>
                <span className="text-[10px]">{level}</span>
              </div>
            ))}
          </div>
        </div>
        
        {/* Creator badge */}
        {rote.user && (
          <div className="text-xs text-muted-foreground font-mono mt-1">
            by {rote.user.name || rote.user.email}
          </div>
        )}
      </button>
    )
  }

  // Full card view
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

      {/* Sphere combinations */}
      {hasMultipleCombinations ? (
        <div className="space-y-2 mb-4">
          {/* Show matching combo first (or all if no match/toggle is on) */}
          {displayCombinations.map((combo, index) => {
            const isFirstCombo = index === 0 && matchingSpheres
            return (
              <div key={index} className={index === 0 ? "" : "pl-3"}>
                {index > 0 && (
                  <span className="text-xs text-muted-foreground font-mono">{index + 1}.</span>
                )}
                <div className="flex flex-wrap gap-1.5">
                  {Object.entries(combo).map(([sphere, level]) => (
                    <div
                      key={sphere}
                      className={`flex items-center gap-1.5 px-2 py-1 border rounded-sm text-xs font-semibold uppercase tracking-wide font-serif
                        ${isTechnocracySphere(sphere)
                          ? "bg-foreground/5 border-foreground/40 text-foreground"
                          : isFirstCombo
                          ? "bg-accent/10 border-accent text-accent"  // Highlight matching combo
                          : "bg-primary/10 border-primary text-primary"
                        }`}
                    >
                      <span>{sphere}</span>
                      <SphereDots level={level} size="sm" />
                    </div>
                  ))}
                </div>
              </div>
            )
          })}
          
          {/* Toggle button - always visible when multiple combos exist */}
          {hasMultipleCombinations && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                setShowAllCombos(!showAllCombos)
              }}
              className="text-xs text-accent hover:text-accent/80 font-semibold flex items-center gap-1 mt-2 transition-colors"
            >
              <span>{showAllCombos ? '▼' : '▶'}</span>
              {showAllCombos 
                ? 'Hide other combinations' 
                : `Show ${allCombinations.length - 1} other combination${allCombinations.length - 1 !== 1 ? 's' : ''}`
              }
            </button>
          )}
        </div>
      ) : (
        <div className="flex flex-wrap gap-2 mb-4">
          {Object.entries(primaryCombo).map(([sphere, level]) => (
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
      )}

      {/* Footer */}
      <div className="flex flex-col gap-2 pt-3 border-t-2 border-primary">
        <div className="flex justify-between items-center font-serif text-xs text-muted-foreground font-semibold uppercase tracking-widest">
          <span>{rote.level}</span>
          {rote.pageRef && <span className="font-mono italic normal-case text-xs">{rote.pageRef}</span>}
        </div>
        {rote.user && (
          <div className="text-xs text-muted-foreground font-mono italic">
            Created by {rote.user.name || rote.user.email}
          </div>
        )}
        {/* Share button */}
        <div className="mt-2 flex gap-2">
          <Link href={`/rotes/${rote.id}`} className="flex-1">
            <button
              type="button"
              className="w-full px-3 py-2 text-xs font-serif font-semibold uppercase tracking-wide
                bg-primary/10 hover:bg-primary/20 border border-primary/40 hover:border-primary
                rounded-sm transition-colors"
              onClick={(e) => e.stopPropagation()}
            >
              View Details
            </button>
          </Link>
          <div onClick={(e) => e.stopPropagation()}>
            <ShareButton 
              url={`/rotes/${rote.id}`}
              title={rote.name}
              size="sm"
              variant="outline"
            />
          </div>
        </div>
      </div>
    </button>
  )
}
