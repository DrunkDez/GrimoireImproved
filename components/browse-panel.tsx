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
  const [searchTerm, setSearchTerm] = useState("")

  const filteredRotes = useMemo(() => {
    return rotes.filter((rote) => {
      // Text search
      if (searchTerm) {
        const q = searchTerm.toLowerCase()
        const textMatch =
          rote.name.toLowerCase().includes(q) ||
          rote.tradition.toLowerCase().includes(q) ||
          rote.description.toLowerCase().includes(q) ||
          Object.keys(rote.spheres).some((s) => s.toLowerCase().includes(q))
        if (!textMatch) return false
      }

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
  }, [rotes, sphereFilters, traditionFilter, searchTerm])

  const handleSphereChange = (sphere: string, level: number) => {
    setSphereFilters((prev) => ({ ...prev, [sphere]: level }))
  }

  const handleReset = () => {
    setSphereFilters({})
    setTraditionFilter("")
    setSearchTerm("")
  }

  const activeFilterCount =
    Object.values(sphereFilters).filter((v) => v > 0).length +
    (traditionFilter ? 1 : 0) +
    (searchTerm ? 1 : 0)

  return (
    <div className="animate-fade-in-up flex flex-col gap-8 p-6 md:p-10">
      {/* Search Input */}
      <div className="bg-card border-2 border-primary rounded-md p-5 shadow-[inset_0_0_20px_rgba(139,71,38,0.05)]">
        <h2 className="font-serif text-xl font-bold text-primary uppercase tracking-[0.15em] mb-4 flex items-center gap-3">
          <span className="text-ring text-lg drop-shadow-[0_0_8px_rgba(107,45,107,0.5)]" aria-hidden="true">
            {'\u2315'}
          </span>
          Search the Grimoire
          <span className="ml-auto text-accent text-lg" aria-hidden="true">{'\u25C8'}</span>
        </h2>
        <input
          type="text"
          placeholder="Search by name, tradition, sphere, or description..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-3 bg-background/60 border-2 border-primary rounded-sm
            text-foreground font-mono text-base placeholder:text-foreground/40 placeholder:italic
            transition-all duration-300
            shadow-[inset_2px_2px_5px_rgba(0,0,0,0.1)]
            focus:outline-none focus:border-ring focus:bg-background/80
            focus:shadow-[inset_2px_2px_5px_rgba(0,0,0,0.1),0_0_10px_rgba(107,45,107,0.3)]"
        />
      </div>

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
