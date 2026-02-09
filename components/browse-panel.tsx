"use client"

import { useState, useMemo } from "react"
import type { Rote } from "@/lib/mage-data"
import { getLinkedSpheres } from "@/lib/mage-data"
import { RoteCard } from "./rote-card"
import { SphereFilter } from "./sphere-filter"

interface BrowsePanelProps {
  rotes: Rote[]
  onSelectRote: (rote: Rote) => void
}

export function BrowsePanel({ rotes, onSelectRote }: BrowsePanelProps) {
  const [sphereFilters, setSphereFilters] = useState<Record<string, number>>({})
  const [traditionFilter, setTraditionFilter] = useState("")

  const filteredRotes = useMemo(() => {
    return rotes.filter((rote) => {
      // Tradition filter
      if (traditionFilter && rote.tradition !== traditionFilter) return false

      // Sphere filters with alias linking
      for (const [sphere, minLevel] of Object.entries(sphereFilters)) {
        if (minLevel > 0) {
          const linkedSpheres = getLinkedSpheres(sphere)
          const hasLevel = linkedSpheres.some((s) => (rote.spheres[s] || 0) >= minLevel)
          if (!hasLevel) return false
        }
      }

      return true
    })
  }, [rotes, sphereFilters, traditionFilter])

  const handleSphereChange = (sphere: string, level: number) => {
    setSphereFilters((prev) => ({ ...prev, [sphere]: level }))
  }

  const handleReset = () => {
    setSphereFilters({})
    setTraditionFilter("")
  }

  const activeFilterCount =
    Object.values(sphereFilters).filter((v) => v > 0).length +
    (traditionFilter ? 1 : 0)

  return (
    <div className="animate-fade-in-up flex flex-col gap-8 p-6 md:p-10">
      {/* Filter section */}
      <SphereFilter
        sphereFilters={sphereFilters}
        traditionFilter={traditionFilter}
        onSphereChange={handleSphereChange}
        onTraditionChange={setTraditionFilter}
        onReset={handleReset}
      />

      {/* Results header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <h2 className="font-serif text-xl font-bold text-primary uppercase tracking-[0.15em] flex items-center gap-3">
          <span className="text-ring text-lg drop-shadow-[0_0_8px_rgba(107,45,107,0.5)]" aria-hidden="true">
            {'\u2727'}
          </span>
          Your Rote Library
          <span className="ml-2 text-accent text-lg" aria-hidden="true">{'\u25C8'}</span>
        </h2>
        <span className="font-mono text-sm text-muted-foreground italic">
          {filteredRotes.length} of {rotes.length} rotes
          {activeFilterCount > 0 && ` (${activeFilterCount} filter${activeFilterCount > 1 ? 's' : ''} active)`}
        </span>
      </div>

      {/* Rote grid */}
      {filteredRotes.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredRotes.map((rote) => (
            <RoteCard key={rote.id} rote={rote} onClick={onSelectRote} />
          ))}
        </div>
      ) : (
        <div
          className="bg-card border-4 border-double border-primary rounded-lg px-6 py-16 text-center
            shadow-[inset_0_0_60px_rgba(139,71,38,0.08)]"
        >
          <div className="text-5xl text-primary opacity-40 mb-4" aria-hidden="true">{'\u2727'}</div>
          <h3 className="font-serif text-xl font-bold text-primary uppercase tracking-widest mb-3">
            No Rotes Found
          </h3>
          <p className="font-mono text-muted-foreground italic text-base">
            No rotes match your current filters. Try adjusting your search criteria.
          </p>
        </div>
      )}
    </div>
  )
}
