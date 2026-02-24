"use client"

import { useState, useMemo } from "react"
import type { Rote } from "@/lib/mage-data"
import { getLinkedSpheres } from "@/lib/mage-data"
import { RoteCard } from "./rote-card"
import { SphereDotsInteractive } from "./sphere-dots"
import { TraditionComboboxSimple } from "./tradition-combobox"

interface SearchPanelProps {
  rotes: Rote[]
  onSelectRote: (rote: Rote) => void
}

export function SearchPanel({ rotes, onSelectRote }: SearchPanelProps) {
  const [query, setQuery] = useState("")
  const [traditionFilter, setTraditionFilter] = useState("")
  const [sphereFilters, setSphereFilters] = useState<Record<string, number>>({})
  const [showSphereFilter, setShowSphereFilter] = useState(false)

  const handleSphereChange = (sphere: string, level: number) => {
    setSphereFilters((prev) => {
      const next = { ...prev }
      if (level === 0) {
        delete next[sphere]
      } else {
        next[sphere] = level
      }
      return next
    })
  }

  const activeSphereFilters = Object.entries(sphereFilters).filter(([, v]) => v > 0)
  const hasTextQuery = query.trim().length > 0
  const hasTraditionFilter = traditionFilter.length > 0
  const hasSphereFilters = activeSphereFilters.length > 0
  const hasAnySearch = hasTextQuery || hasTraditionFilter || hasSphereFilters

  const results = useMemo(() => {
    if (!hasAnySearch) return []

    return rotes.filter((rote) => {
      // Text query filter
      if (hasTextQuery) {
        const q = query.toLowerCase()
        const textMatch =
          rote.name.toLowerCase().includes(q) ||
          rote.tradition.toLowerCase().includes(q) ||
          rote.description.toLowerCase().includes(q) ||
          Object.keys(rote.spheres).some((s) => s.toLowerCase().includes(q))
        if (!textMatch) return false
      }

      // Tradition filter
      if (hasTraditionFilter) {
        if (rote.tradition !== traditionFilter) return false
      }

      // Sphere level filters with alias linking
      for (const [sphere, minLevel] of activeSphereFilters) {
        const linkedSpheres = getLinkedSpheres(sphere)
        const roteHasSphere = linkedSpheres.some((s) => (rote.spheres[s] || 0) >= minLevel)
        if (!roteHasSphere) return false
      }

      return true
    })
  }, [rotes, query, traditionFilter, sphereFilters, hasAnySearch, hasTextQuery, hasTraditionFilter, activeSphereFilters])

  const handleClear = () => {
    setQuery("")
    setTraditionFilter("")
    setSphereFilters({})
  }

  return (
    <div className="animate-fade-in-up flex flex-col gap-8 p-6 md:p-10">
      {/* Search header */}
      <div className="bg-card border-2 border-primary rounded-md p-5 shadow-[inset_0_0_20px_rgba(139,71,38,0.05)]">
        <h2 className="font-serif text-xl font-bold text-primary uppercase tracking-[0.15em] mb-4 flex items-center gap-3">
          <span className="text-ring text-lg drop-shadow-[0_0_8px_rgba(107,45,107,0.5)]" aria-hidden="true">
            {'\u2315'}
          </span>
          Search the Grimoire
          <span className="ml-auto text-accent text-lg" aria-hidden="true">{'\u25C8'}</span>
        </h2>
        
        {/* Search input and buttons */}
        <div className="flex gap-3 mb-4">
          <input
            type="text"
            placeholder="Search by name, tradition, sphere, or description..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 px-4 py-3 bg-background/60 border-2 border-primary rounded-sm
              text-foreground font-mono text-base placeholder:text-foreground/40 placeholder:italic
              transition-all duration-300
              shadow-[inset_2px_2px_5px_rgba(0,0,0,0.1)]
              focus:outline-none focus:border-ring focus:bg-background/80
              focus:shadow-[inset_2px_2px_5px_rgba(0,0,0,0.1),0_0_10px_rgba(107,45,107,0.3)]"
          />
          <button
            type="button"
            onClick={() => setShowSphereFilter(!showSphereFilter)}
            className={`font-serif px-4 py-3 border-2 rounded-sm font-semibold text-sm uppercase tracking-widest cursor-pointer
              transition-all duration-300 shrink-0
              ${showSphereFilter
                ? "bg-primary text-primary-foreground border-accent"
                : "bg-secondary text-secondary-foreground border-primary hover:bg-background hover:border-ring"
              }`}
          >
            Spheres{hasSphereFilters ? ` (${activeSphereFilters.length})` : ""}
          </button>
          {hasAnySearch && (
            <button
              type="button"
              onClick={handleClear}
              className="font-serif px-5 py-3 bg-secondary text-secondary-foreground border-2 border-primary rounded-sm
                font-semibold text-sm uppercase tracking-widest cursor-pointer
                transition-all duration-300
                hover:bg-background hover:border-ring shrink-0"
            >
              Clear
            </button>
          )}
        </div>

        {/* Tradition filter */}
        <div className="flex flex-col gap-2">
          <label className="font-serif text-xs font-semibold text-primary uppercase tracking-wider">
            Filter by Tradition
          </label>
          <TraditionComboboxSimple
            value={traditionFilter}
            onValueChange={setTraditionFilter}
            placeholder="All traditions"
          />
        </div>
      </div>

      {/* Sphere level filter panel */}
      {showSphereFilter && (
        <div className="animate-fade-in-up bg-card border-[3px] border-primary border-l-[6px] border-l-accent rounded-md p-6
          shadow-[inset_0_0_40px_rgba(139,71,38,0.05),5px_5px_15px_rgba(0,0,0,0.2)]">

          {/* Tradition Spheres */}
          <h3 className="font-serif text-sm font-bold text-primary uppercase tracking-[0.15em] mb-4 flex items-center gap-2">
            <span className="text-ring" aria-hidden="true">{'\u2726'}</span>
            Tradition Spheres
          </h3>
          <p className="font-mono text-xs text-muted-foreground italic mb-4">
            Click dots to set minimum sphere level. Linked spheres (e.g. Data/Correspondence) match automatically.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-6">
            {(['Correspondence', 'Entropy', 'Forces', 'Life', 'Matter', 'Mind', 'Prime', 'Spirit', 'Time'] as const).map((sphere) => (
              <div
                key={sphere}
                className="flex items-center justify-between gap-3 bg-background border-2 border-primary rounded-sm px-4 py-3
                  transition-all duration-300 hover:border-accent"
              >
                <span className="font-serif text-xs font-bold text-primary uppercase tracking-widest shrink-0">
                  {sphere}
                </span>
                <SphereDotsInteractive
                  value={sphereFilters[sphere] || 0}
                  onChange={(level) => handleSphereChange(sphere, level)}
                  label={sphere}
                />
              </div>
            ))}
          </div>

          {/* Technocracy Spheres */}
          <h3 className="font-serif text-sm font-bold text-foreground uppercase tracking-[0.15em] mb-4 flex items-center gap-2">
            <span className="text-foreground/60" aria-hidden="true">{'\u2699'}</span>
            Technocracy Spheres
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {(['Data', 'Dimensional Science', 'Primal Utility'] as const).map((sphere) => (
              <div
                key={sphere}
                className="flex items-center justify-between gap-3 bg-foreground/5 border-2 border-foreground/40 rounded-sm px-4 py-3
                  transition-all duration-300 hover:border-foreground/70"
              >
                <span className="font-serif text-xs font-bold text-foreground uppercase tracking-widest shrink-0">
                  {sphere}
                </span>
                <SphereDotsInteractive
                  value={sphereFilters[sphere] || 0}
                  onChange={(level) => handleSphereChange(sphere, level)}
                  label={sphere}
                />
              </div>
            ))}
          </div>

          {/* Active filters summary */}
          {hasSphereFilters && (
            <div className="mt-4 pt-4 border-t-2 border-primary flex flex-wrap items-center gap-2">
              <span className="font-serif text-xs font-semibold text-primary uppercase tracking-widest">Active:</span>
              {activeSphereFilters.map(([sphere, level]) => (
                <span
                  key={sphere}
                  className="font-serif px-2 py-1 bg-primary/10 border border-primary rounded-sm text-primary text-xs font-semibold uppercase flex items-center gap-1.5"
                >
                  {sphere} {level}+
                  <button
                    type="button"
                    onClick={() => handleSphereChange(sphere, 0)}
                    className="text-primary/60 hover:text-primary ml-1 cursor-pointer"
                    aria-label={`Remove ${sphere} filter`}
                  >
                    {'\u2715'}
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Results */}
      {hasAnySearch ? (
        <>
          <span className="font-mono text-sm text-muted-foreground italic">
            {results.length} result{results.length !== 1 ? "s" : ""}
            {hasTextQuery && ` for "${query}"`}
            {hasTraditionFilter && ` from ${traditionFilter}`}
            {hasSphereFilters && ` with sphere filter${activeSphereFilters.length > 1 ? "s" : ""}`}
          </span>
          {results.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {results.map((rote) => (
                <RoteCard key={rote.id} rote={rote} onClick={onSelectRote} />
              ))}
            </div>
          ) : (
            <div className="bg-card border-4 border-double border-primary rounded-lg px-6 py-16 text-center">
              <div className="text-5xl text-primary opacity-40 mb-4" aria-hidden="true">{'\u2727'}</div>
              <h3 className="font-serif text-xl font-bold text-primary uppercase tracking-widest mb-3">
                No Results
              </h3>
              <p className="font-mono text-muted-foreground italic">
                The Tapestry yields no matching patterns. Try different words of power.
              </p>
            </div>
          )}
        </>
      ) : (
        <div className="bg-card border-4 border-double border-primary rounded-lg px-6 py-16 text-center">
          <div className="text-5xl text-primary opacity-40 mb-4 animate-mystical-pulse" aria-hidden="true">{'\u2748'}</div>
          <h3 className="font-serif text-xl font-bold text-primary uppercase tracking-widest mb-3">
            Seek and You Shall Find
          </h3>
          <p className="font-mono text-muted-foreground italic text-base max-w-lg mx-auto">
            Enter a name, tradition, sphere, or keyword, or use the filters to search by tradition and minimum sphere level.
          </p>
        </div>
      )}
    </div>
  )
}
