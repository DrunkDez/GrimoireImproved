"use client"

import { useState, useMemo } from "react"
import type { Rote } from "@/lib/mage-data"
import { getLinkedSpheres } from "@/lib/mage-data"
import { RoteCard } from "./rote-card"
import { SphereFilter } from "./sphere-filter"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"

interface BrowsePanelProps {
  rotes: Rote[]
  onSelectRote: (rote: Rote) => void
}

export function BrowsePanel({ rotes, onSelectRote }: BrowsePanelProps) {
  const [sphereFilters, setSphereFilters] = useState<Record<string, number>>({})
  const [traditionFilter, setTraditionFilter] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const [mixAndMatch, setMixAndMatch] = useState(false)
  const [displayLimit, setDisplayLimit] = useState(20)

  const filteredRotes = useMemo(() => {
    return rotes.filter((rote) => {
      // Text search
      if (searchTerm) {
        const q = searchTerm.toLowerCase()
        const textMatch =
          rote.name.toLowerCase().includes(q) ||
          rote.tradition.toLowerCase().includes(q) ||
          rote.description.toLowerCase().includes(q)
        if (!textMatch) return false
      }

      // Tradition filter
      if (traditionFilter && rote.tradition !== traditionFilter) return false

      // Sphere filters - EXACT MATCHING
      const activeSphereFilters = Object.entries(sphereFilters).filter(([_, level]) => level > 0)
      
      if (activeSphereFilters.length > 0) {
        // Normalize rote.spheres to always be an array of combinations
        const roteCombinations = Array.isArray(rote.spheres) ? rote.spheres : [rote.spheres]
        
        if (mixAndMatch) {
          // Mix & Match: Must have at least ONE selected sphere (at or below level)
          // AND must NOT have any unselected spheres
          
          const selectedSphereNames = activeSphereFilters.map(([sphere, _]) => {
            return getLinkedSpheres(sphere)
          }).flat().map(s => s.toLowerCase())

          let hasMatchingCombo = false

          for (const combo of roteCombinations) {
            // Check if this combo has at least one selected sphere
            const hasAtLeastOne = activeSphereFilters.some(([sphere, maxLevel]) => {
              const linkedSpheres = getLinkedSpheres(sphere)
              return linkedSpheres.some((s) => {
                const roteLevel = combo[s] || 0
                return roteLevel > 0 && roteLevel <= maxLevel
              })
            })

            if (!hasAtLeastOne) continue

            // Check that combo ONLY has selected spheres
            const onlySelectedSpheres = Object.keys(combo).every((roteSphere) => {
              const level = combo[roteSphere]
              if (!level || level === 0) return true
              return selectedSphereNames.includes(roteSphere.toLowerCase())
            })

            if (onlySelectedSpheres) {
              hasMatchingCombo = true
              break
            }
          }

          if (!hasMatchingCombo) return false
          
        } else {
          // Standard mode: Must match ALL selected spheres EXACTLY
          // AND must have ONLY those spheres (no extras, no higher levels)
          
          let hasMatchingCombo = false

          for (const combo of roteCombinations) {
            // Check that ALL selected spheres are present at EXACT level
            const allPresentExactly = activeSphereFilters.every(([sphere, exactLevel]) => {
              const linkedSpheres = getLinkedSpheres(sphere)
              return linkedSpheres.some((s) => (combo[s] || 0) === exactLevel)
            })

            if (!allPresentExactly) continue

            // Check that combo has ONLY the selected spheres (no extras)
            const onlySelectedSpheres = Object.keys(combo).every((roteSphere) => {
              const level = combo[roteSphere]
              if (!level || level === 0) return true
              
              // This sphere must be one we selected
              return activeSphereFilters.some(([sphere, _]) => {
                const linkedSpheres = getLinkedSpheres(sphere)
                return linkedSpheres.some(s => 
                  s.toLowerCase() === roteSphere.toLowerCase()
                )
              })
            })

            if (onlySelectedSpheres) {
              hasMatchingCombo = true
              break
            }
          }

          if (!hasMatchingCombo) return false
        }
      }

      return true
    })
  }, [rotes, sphereFilters, traditionFilter, searchTerm, mixAndMatch])

  const displayedRotes = useMemo(() => {
    return filteredRotes.slice(0, displayLimit)
  }, [filteredRotes, displayLimit])

  const handleSphereChange = (sphere: string, level: number) => {
    setSphereFilters((prev) => ({ ...prev, [sphere]: level }))
  }

  const handleReset = () => {
    setSphereFilters({})
    setTraditionFilter("")
    setSearchTerm("")
    setMixAndMatch(false)
    setDisplayLimit(20)
  }

  const handleLoadMore = () => {
    setDisplayLimit(prev => prev + 20)
  }

  const activeFilterCount =
    Object.values(sphereFilters).filter((v) => v > 0).length +
    (traditionFilter ? 1 : 0) +
    (searchTerm ? 1 : 0)

  const hasMore = displayedRotes.length < filteredRotes.length
  const remainingCount = filteredRotes.length - displayedRotes.length

  return (
    <div className="animate-fade-in-up flex flex-col gap-8 p-6 md:p-10">
      {/* Search Input */}
      <div className="bg-card border-2 border-primary rounded-md p-5 shadow-[inset_0_0_20px_rgba(139,71,38,0.05)]">
        <h2 className="font-serif text-xl font-bold text-primary uppercase tracking-[0.15em] mb-4 flex items-center gap-3">
          <span className="text-ring text-lg drop-shadow-[0_0_8px_rgba(107,45,107,0.5)]" aria-hidden="true">
            ⌕
          </span>
          Search The Wheel
          <span className="ml-auto text-accent text-lg" aria-hidden="true">◈</span>
        </h2>
        <input
          type="text"
          placeholder="Search by name, tradition, or description..."
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

      {/* What Can I Do? Toggle */}
      {Object.values(sphereFilters).filter((v) => v > 0).length > 0 && (
        <div className="bg-card border-2 border-accent rounded-md p-4 shadow-[inset_0_0_20px_rgba(201,169,97,0.05)]">
          <div className="flex items-center space-x-3">
            <Checkbox
              id="what-can-i-do"
              checked={mixAndMatch}
              onCheckedChange={(checked) => {
                setMixAndMatch(checked as boolean)
                setDisplayLimit(20)
              }}
            />
            <div className="flex-1">
              <Label 
                htmlFor="what-can-i-do"
                className="font-serif text-base font-semibold text-primary cursor-pointer flex items-center gap-2"
              >
                <span className="text-accent" aria-hidden="true">✦</span>
                What Can I Do? Mode
              </Label>
              <p className="text-xs text-muted-foreground font-mono mt-1">
                {mixAndMatch 
                  ? "Showing what you can do with ONLY these spheres (at or below your levels)" 
                  : "Showing rotes with selected spheres at EXACT levels"}
              </p>
            </div>
          </div>
          
          {mixAndMatch && Object.values(sphereFilters).filter((v) => v > 0).length === 1 && (
            <div className="mt-3 p-3 bg-accent/10 border border-accent/30 rounded text-xs font-mono text-foreground">
              <span className="font-semibold">Example:</span> With Correspondence 3 selected:
              <ul className="mt-1 ml-4 space-y-0.5">
                <li>✓ Correspondence 3 alone</li>
                <li>✓ Correspondence 2 alone</li>
                <li>✓ Correspondence 1 alone</li>
                <li>✗ Correspondence 4 (too high)</li>
                <li>✗ Correspondence 3 + Life 2 (has other sphere)</li>
              </ul>
              <p className="mt-2 text-muted-foreground italic">
                Perfect for discovering what you can cast with just this sphere!
              </p>
            </div>
          )}
          
          {mixAndMatch && Object.values(sphereFilters).filter((v) => v > 0).length > 1 && (
            <div className="mt-3 p-3 bg-accent/10 border border-accent/30 rounded text-xs font-mono text-foreground">
              <span className="font-semibold">Example:</span> With Life 2, Correspondence 3 selected:
              <ul className="mt-1 ml-4 space-y-0.5">
                <li>✓ Life 2 alone</li>
                <li>✓ Life 1 alone</li>
                <li>✓ Correspondence 3 alone</li>
                <li>✓ Life 2 + Correspondence 3</li>
                <li>✓ Life 1 + Correspondence 2</li>
                <li>✗ Life 2 + Entropy 3 (has unselected sphere)</li>
                <li>✗ Life 3 alone (too high)</li>
              </ul>
              <p className="mt-2 text-muted-foreground italic">
                Shows all combinations possible with ONLY your selected spheres!
              </p>
            </div>
          )}
          
          {!mixAndMatch && (
            <div className="mt-3 p-3 bg-primary/10 border border-primary/30 rounded text-xs font-mono text-foreground">
              <span className="font-semibold">Exact Match Mode:</span> {Object.values(sphereFilters).filter((v) => v > 0).length === 1 ? (
                <>With Correspondence 3 selected:</>
              ) : (
                <>With Life 2, Correspondence 3 selected:</>
              )}
              <ul className="mt-1 ml-4 space-y-0.5">
                {Object.values(sphereFilters).filter((v) => v > 0).length === 1 ? (
                  <>
                    <li>✓ Correspondence 3 alone (exact match)</li>
                    <li>✗ Correspondence 2 (too low)</li>
                    <li>✗ Correspondence 4 (too high)</li>
                    <li>✗ Correspondence 3 + Life 2 (has extra sphere)</li>
                  </>
                ) : (
                  <>
                    <li>✓ Life 2 + Correspondence 3 (exact match)</li>
                    <li>✗ Life 3 + Correspondence 3 (Life too high)</li>
                    <li>✗ Life 2 + Correspondence 2 (Correspondence too low)</li>
                    <li>✗ Life 2 + Correspondence 3 + Prime 1 (has extra sphere)</li>
                    <li>✗ Life 2 alone (missing Correspondence)</li>
                  </>
                )}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* Results header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <h2 className="font-serif text-xl font-bold text-primary uppercase tracking-[0.15em] flex items-center gap-3">
          <span className="text-ring text-lg drop-shadow-[0_0_8px_rgba(107,45,107,0.5)]" aria-hidden="true">
            ✧
          </span>
          The Wheel's Archives
          <span className="ml-2 text-accent text-lg" aria-hidden="true">◈</span>
        </h2>
        <span className="font-mono text-sm text-muted-foreground italic">
          Showing {displayedRotes.length} of {filteredRotes.length} rotes
          {filteredRotes.length !== rotes.length && ` (filtered from ${rotes.length} total)`}
          {activeFilterCount > 0 && ` • ${activeFilterCount} filter${activeFilterCount > 1 ? 's' : ''} active`}
        </span>
      </div>

      {/* Rote grid */}
      {displayedRotes.length > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {displayedRotes.map((rote) => (
              <RoteCard key={rote.id} rote={rote} onClick={onSelectRote} />
            ))}
          </div>

          {/* Load More Button */}
          {hasMore && (
            <div className="flex flex-col items-center gap-4 py-8">
              <div className="text-center">
                <p className="font-mono text-sm text-muted-foreground mb-2">
                  {remainingCount} more rote{remainingCount !== 1 ? 's' : ''} available
                </p>
                <Button
                  onClick={handleLoadMore}
                  size="lg"
                  className="font-serif px-8 py-6 bg-secondary text-secondary-foreground border-2 border-primary rounded-sm
                    font-semibold text-base uppercase tracking-[0.15em]
                    transition-all duration-300
                    shadow-[0_4px_8px_rgba(0,0,0,0.15)]
                    hover:bg-background hover:border-ring hover:-translate-y-1
                    hover:shadow-[0_6px_12px_rgba(0,0,0,0.2),0_0_20px_rgba(107,45,107,0.2)]
                    active:translate-y-0"
                >
                  <span className="text-accent mr-2" aria-hidden="true">📖</span>
                  Turn 20 More Pages
                  <span className="text-accent ml-2" aria-hidden="true">📖</span>
                </Button>
              </div>
              
              {/* Progress indicator */}
              <div className="w-full max-w-md">
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-primary to-accent transition-all duration-500"
                    style={{ width: `${(displayedRotes.length / filteredRotes.length) * 100}%` }}
                  />
                </div>
                <p className="text-center text-xs text-muted-foreground mt-2 font-mono">
                  {Math.round((displayedRotes.length / filteredRotes.length) * 100)}% of archives explored
                </p>
              </div>
            </div>
          )}
        </>
      ) : (
        <div
          className="bg-card border-4 border-double border-primary rounded-lg px-6 py-16 text-center
            shadow-[inset_0_0_60px_rgba(139,71,38,0.08)]"
        >
          <div className="text-5xl text-primary opacity-40 mb-4" aria-hidden="true">✧</div>
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
