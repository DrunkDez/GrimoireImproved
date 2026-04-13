"use client"

import { useState, useMemo, useEffect } from 'react'
import { Rote } from '@/lib/mage-data'
import { getLinkedSpheres } from '@/lib/mage-data'
import { RoteCard } from './rote-card'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { Search, X, ChevronDown } from 'lucide-react'

interface BrowsePanelProps {
  rotes: Rote[]
  onSelectRote: (rote: Rote) => void
  shouldRestoreState?: boolean
  onStateRestored?: () => void
}

// Fisher-Yates shuffle algorithm
function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

// Sphere names
const SPHERE_NAMES = ['Correspondence', 'Entropy', 'Forces', 'Life', 'Matter', 'Mind', 'Prime', 'Spirit', 'Time']
const TECHNOCRACY_SPHERES = ['Data', 'Dimensional Science', 'Primal Utility']
const ITEMS_PER_PAGE = 20

export function BrowsePanel({ rotes, onSelectRote, shouldRestoreState, onStateRestored }: BrowsePanelProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedTradition, setSelectedTradition] = useState<string>('All Factions')
  const [selectedSpheres, setSelectedSpheres] = useState<{ [key: string]: number }>({})
  const [mixAndMatch, setMixAndMatch] = useState(false)
  const [randomSeed, setRandomSeed] = useState(Math.random())
  const [displayCount, setDisplayCount] = useState(ITEMS_PER_PAGE)

  // Get unique traditions
  const traditions = useMemo(() => {
    const uniqueTraditions = new Set(rotes.map(r => r.tradition))
    return ['All Factions', ...Array.from(uniqueTraditions).sort()]
  }, [rotes])

  // Toggle sphere level
  const toggleSphereLevel = (sphere: string, level: number) => {
    setSelectedSpheres(prev => {
      const current = prev[sphere] || 0
      if (current === level) {
        // Clicking same level turns it off
        const newSpheres = { ...prev }
        delete newSpheres[sphere]
        return newSpheres
      } else {
        // Set to new level
        return { ...prev, [sphere]: level }
      }
    })
  }

  // Helper: get rote sphere object (handles both array and direct object formats)
  const getRoteSpheres = (rote: Rote): Record<string, number> => {
    const spheresData = Array.isArray(rote.spheres) ? rote.spheres[0] : rote.spheres
    return spheresData && typeof spheresData === 'object' ? spheresData : {}
  }

  // Check if rote matches sphere filters (standard OR mix&match)
  const matchesSphereFilter = (rote: Rote): boolean => {
    const activeSphereFilters = Object.entries(selectedSpheres).filter(([_, level]) => level > 0)
    if (activeSphereFilters.length === 0) return true

    const roteSpheres = getRoteSpheres(rote)

    if (mixAndMatch) {
      // Mix & Match mode: Rote must have at least ONE selected sphere (at or below chosen level)
      // AND must NOT contain any sphere outside the selected ones (including linked equivalents)

      // 1. Collect all selected sphere names (including linked ones)
      const selectedSphereNames = new Set<string>()
      for (const [sphere] of activeSphereFilters) {
        const linked = getLinkedSpheres(sphere)
        linked.forEach(s => selectedSphereNames.add(s.toLowerCase()))
      }

      // 2. Check if rote has at least one selected sphere at ≤ required level
      let hasAtLeastOne = false
      for (const [sphere, maxLevel] of activeSphereFilters) {
        const linked = getLinkedSpheres(sphere)
        for (const linkedSphere of linked) {
          const roteLevel = roteSpheres[linkedSphere] || 0
          if (roteLevel > 0 && roteLevel <= maxLevel) {
            hasAtLeastOne = true
            break
          }
        }
        if (hasAtLeastOne) break
      }
      if (!hasAtLeastOne) return false

      // 3. Ensure rote has no spheres outside the selected set
      for (const [roteSphere, roteLevel] of Object.entries(roteSpheres)) {
        if (roteLevel > 0 && !selectedSphereNames.has(roteSphere.toLowerCase())) {
          return false
        }
      }
      return true
    } else {
      // STANDARD MODE: EXACT level match for all selected spheres,
      // AND no other spheres at all.
      
      // 1. Collect all selected sphere names (including linked equivalents)
      const selectedSphereNames = new Set<string>()
      for (const [sphere] of activeSphereFilters) {
        const linked = getLinkedSpheres(sphere)
        linked.forEach(s => selectedSphereNames.add(s.toLowerCase()))
      }

      // 2. For each selected sphere, rote must have EXACTLY that level (no more, no less)
      for (const [sphere, exactLevel] of activeSphereFilters) {
        const linkedSpheres = getLinkedSpheres(sphere)
        let foundExact = false
        for (const linked of linkedSpheres) {
          const roteLevel = roteSpheres[linked] || 0
          if (roteLevel === exactLevel) {
            foundExact = true
            break
          }
        }
        if (!foundExact) return false
      }

      // 3. Ensure rote has NO spheres outside the selected set
      for (const [roteSphere, roteLevel] of Object.entries(roteSpheres)) {
        if (roteLevel > 0 && !selectedSphereNames.has(roteSphere.toLowerCase())) {
          return false
        }
      }
      return true
    }
  }

  // Filter and randomize rotes
  const filteredRotes = useMemo(() => {
    let result = rotes

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      result = result.filter(rote =>
        rote.name.toLowerCase().includes(query) ||
        rote.description.toLowerCase().includes(query) ||
        rote.tradition.toLowerCase().includes(query)
      )
    }

    // Apply tradition filter
    if (selectedTradition !== 'All Factions') {
      result = result.filter(rote => rote.tradition === selectedTradition)
    }

    // Apply sphere filter (standard or mix&match)
    result = result.filter(matchesSphereFilter)

    // Always randomize
    return shuffleArray(result)
  }, [rotes, searchQuery, selectedTradition, selectedSpheres, mixAndMatch, randomSeed])

  // Get rotes to display (with pagination)
  const displayedRotes = useMemo(() => {
    return filteredRotes.slice(0, displayCount)
  }, [filteredRotes, displayCount])

  // Check if there are more rotes to load
  const hasMore = displayCount < filteredRotes.length
  const remainingCount = filteredRotes.length - displayCount

  // Load more rotes
  const loadMore = () => {
    setDisplayCount(prev => prev + ITEMS_PER_PAGE)
  }

  // Reset display count when filters change (including mix&Match toggle)
  useEffect(() => {
    setDisplayCount(ITEMS_PER_PAGE)
  }, [searchQuery, selectedTradition, selectedSpheres, mixAndMatch])

  // Reset random seed when filters change
  useEffect(() => {
    if (searchQuery || selectedTradition !== 'All Factions' || Object.keys(selectedSpheres).length > 0 || mixAndMatch) {
      setRandomSeed(Math.random())
    }
  }, [searchQuery, selectedTradition, selectedSpheres, mixAndMatch])

  // Restore state if needed
  useEffect(() => {
    if (shouldRestoreState) {
      const savedQuery = sessionStorage.getItem('browseSearchQuery')
      const savedTradition = sessionStorage.getItem('browseTradition')
      const savedSpheres = sessionStorage.getItem('browseSpheres')
      const savedDisplayCount = sessionStorage.getItem('browseDisplayCount')
      const savedMixAndMatch = sessionStorage.getItem('browseMixAndMatch')

      if (savedQuery) setSearchQuery(savedQuery)
      if (savedTradition) setSelectedTradition(savedTradition)
      if (savedSpheres) setSelectedSpheres(JSON.parse(savedSpheres))
      if (savedDisplayCount) setDisplayCount(parseInt(savedDisplayCount, 10))
      if (savedMixAndMatch) setMixAndMatch(savedMixAndMatch === 'true')

      onStateRestored?.()
    }
  }, [shouldRestoreState, onStateRestored])

  // Save state when it changes
  useEffect(() => {
    sessionStorage.setItem('browseSearchQuery', searchQuery)
    sessionStorage.setItem('browseTradition', selectedTradition)
    sessionStorage.setItem('browseSpheres', JSON.stringify(selectedSpheres))
    sessionStorage.setItem('browseDisplayCount', displayCount.toString())
    sessionStorage.setItem('browseMixAndMatch', mixAndMatch.toString())
  }, [searchQuery, selectedTradition, selectedSpheres, displayCount, mixAndMatch])

  // Calculate if filters are active
  const hasActiveFilters = searchQuery || selectedTradition !== 'All Factions' || Object.keys(selectedSpheres).length > 0

  // Clear all filters
  const clearFilters = () => {
    setSearchQuery('')
    setSelectedTradition('All Factions')
    setSelectedSpheres({})
    setMixAndMatch(false)
    setDisplayCount(ITEMS_PER_PAGE)
    setRandomSeed(Math.random()) // New random order
  }

  // Count active sphere filters (for showing mix&match toggle)
  const activeSphereCount = Object.values(selectedSpheres).filter(v => v > 0).length

  // --- NEW: Exact filter combination for RoteCard matching (only in standard mode) ---
  const exactFilterCombination = useMemo(() => {
    if (mixAndMatch) return undefined
    const active = Object.entries(selectedSpheres).filter(([_, lvl]) => lvl > 0)
    if (active.length === 0) return undefined
    return Object.fromEntries(active)
  }, [selectedSpheres, mixAndMatch])

  // Generate dynamic example text for the Mix & Match info box
  const getExampleText = () => {
    const entries = Object.entries(selectedSpheres).filter(([_, level]) => level > 0)
    if (entries.length === 0) return null

    const formatSphere = (sphere: string, level: number) => `${sphere} ${level}`
    const selectedList = entries.map(([s, l]) => formatSphere(s, l)).join(', ')

    // Build combinations list
    const lines: string[] = []
    if (entries.length === 1) {
      const [sphere, maxLevel] = entries[0]
      lines.push(`• Just ${sphere} 1–${maxLevel} alone`)
    } else {
      // All combinations of each sphere with each other at various levels
      for (let i = 0; i < entries.length; i++) {
        const [sphereA, levelA] = entries[i]
        for (let lvlA = 1; lvlA <= levelA; lvlA++) {
          if (entries.length === 2) {
            const [sphereB, levelB] = entries[1 - i]
            for (let lvlB = 1; lvlB <= levelB; lvlB++) {
              lines.push(`• ${sphereA} ${lvlA} + ${sphereB} ${lvlB}`)
            }
          } else {
            // More than 2 spheres – simpler generic message
            lines.push(`• ${sphereA} ${lvlA} + any combination of the others (at or below their levels)`)
            break
          }
        }
      }
      // Add solo options
      for (const [sphere, maxLevel] of entries) {
        lines.push(`• Just ${sphere} 1–${maxLevel} alone`)
      }
    }

    // Remove duplicates (simple dedupe)
    const uniqueLines = [...new Set(lines)]

    return (
      <div className="mt-3 p-3 bg-accent/10 border border-accent/30 rounded text-xs font-mono text-foreground">
        <span className="font-semibold">Example:</span> With {selectedList} selected, you'll see rotes with:
        <ul className="mt-1 ml-4 space-y-0.5">
          {uniqueLines.slice(0, 8).map((line, idx) => (
            <li key={idx}>{line}</li>
          ))}
          {uniqueLines.length > 8 && <li>• ...and more combinations</li>}
        </ul>
        <p className="mt-2 text-muted-foreground italic">
          Will NOT show rotes with other spheres (like Entropy, Forces, etc.)
        </p>
      </div>
    )
  }

  // Render sphere dots
  const renderSphereDots = (sphere: string) => {
    const selectedLevel = selectedSpheres[sphere] || 0
    
    return (
      <div className="flex items-center justify-between gap-2">
        <span className="text-xs sm:text-sm font-medium uppercase tracking-wider">{sphere}</span>
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map(level => (
            <button
              key={level}
              onClick={() => toggleSphereLevel(sphere, level)}
              className={`w-5 h-5 sm:w-6 sm:h-6 rounded-full border-2 transition-all ${
                level <= selectedLevel
                  ? 'bg-primary border-primary'
                  : 'border-primary/40 hover:border-primary/60'
              }`}
              aria-label={`${sphere} level ${level}`}
            />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="p-3 sm:p-4 md:p-6">
      {/* Search Section */}
      <div className="mb-4 md:mb-6 border-2 border-primary/30 rounded-lg p-3 sm:p-4 md:p-6 bg-card/50">
        <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
          <Search className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
          <h2 className="font-serif text-base sm:text-lg md:text-xl font-bold text-foreground uppercase tracking-wider">
            Search The Wheel
          </h2>
          <div className="ml-auto text-primary">◆</div>
        </div>
        <Input
          type="text"
          placeholder="Search by name, tradition, or description..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="bg-background/50 border-2 border-primary/30 focus:border-primary text-sm md:text-base italic"
        />
      </div>

      {/* Filter Section */}
      <div className="mb-4 md:mb-6 border-2 border-primary/30 rounded-lg p-3 sm:p-4 md:p-6 bg-card/50">
        <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
          <span className="text-primary">✦</span>
          <h2 className="font-serif text-base sm:text-lg md:text-xl font-bold text-foreground uppercase tracking-wider">
            Filter Rotes
          </h2>
          <div className="ml-auto text-primary">◆</div>
        </div>

        {/* Tradition Filter */}
        <div className="mb-4 sm:mb-6">
          <div className="flex items-center gap-2 mb-2 sm:mb-3">
            <span className="text-primary text-xs sm:text-base">✦</span>
            <h3 className="font-serif font-semibold text-foreground uppercase tracking-wider text-xs sm:text-sm md:text-base">
              Tradition / Convention
            </h3>
          </div>
          <Select value={selectedTradition} onValueChange={setSelectedTradition}>
            <SelectTrigger className="bg-background/50 border-2 border-primary/30 focus:border-primary h-11 md:h-12 text-sm md:text-base">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="max-h-[60vh]">
              {traditions.map((tradition) => (
                <SelectItem 
                  key={tradition} 
                  value={tradition}
                  className="text-sm md:text-base min-h-[44px] flex items-center"
                >
                  {tradition}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Spheres Filter */}
        <div className="mb-4 sm:mb-6">
          <div className="flex items-center gap-2 mb-2 sm:mb-3">
            <span className="text-primary text-xs sm:text-base">✦</span>
            <h3 className="font-serif font-semibold text-foreground uppercase tracking-wider text-xs sm:text-sm md:text-base">
              Spheres
            </h3>
          </div>
          <p className="text-xs md:text-sm text-muted-foreground italic mb-3 sm:mb-4">
            Click dots to set exact sphere level. Linked spheres (e.g. Data/Correspondence) match automatically.
          </p>

          {/* Traditional Spheres */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-3 mb-4 sm:mb-6">
            {SPHERE_NAMES.map(sphere => (
              <div
                key={sphere}
                className="bg-background/50 border-2 border-primary/30 rounded-lg p-2 sm:p-3"
              >
                {renderSphereDots(sphere)}
              </div>
            ))}
          </div>

          {/* Technocracy Spheres */}
          <div className="border-t-2 border-primary/20 pt-3 sm:pt-4">
            <div className="flex items-center gap-2 mb-2 sm:mb-3">
              <span className="text-muted-foreground text-xs sm:text-base">⚙</span>
              <h4 className="font-serif font-semibold text-muted-foreground uppercase tracking-wider text-xs md:text-sm">
                Technocracy Spheres
              </h4>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-3">
              {TECHNOCRACY_SPHERES.map(sphere => (
                <div
                  key={sphere}
                  className="bg-background/50 border-2 border-primary/30 rounded-lg p-2 sm:p-3"
                >
                  {renderSphereDots(sphere)}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Mix & Match Toggle (appears when at least one sphere is selected) */}
        {activeSphereCount >= 1 && (
          <div className="mb-4 sm:mb-6 border-2 border-accent/50 rounded-lg p-3 sm:p-4 bg-accent/5">
            <div className="flex items-center space-x-3">
              <Checkbox
                id="mix-and-match"
                checked={mixAndMatch}
                onCheckedChange={(checked) => {
                  setMixAndMatch(checked as boolean)
                  setDisplayCount(ITEMS_PER_PAGE) // Reset pagination
                }}
              />
              <div className="flex-1">
                <Label 
                  htmlFor="mix-and-match"
                  className="font-serif text-base font-semibold text-primary cursor-pointer flex items-center gap-2"
                >
                  <span className="text-accent" aria-hidden="true">✦</span>
                  Show me what I can do
                </Label>
                <p className="text-xs text-muted-foreground font-mono mt-1">
                  {mixAndMatch 
                    ? "Showing rotes with ONLY the selected spheres (at or below specified levels)" 
                    : "Showing rotes with EXACTLY the selected spheres (at the specified levels)"}
                </p>
              </div>
            </div>
            
            {mixAndMatch && getExampleText()}
          </div>
        )}

        {/* Reset Filters Button */}
        <div className="border-t-2 border-primary/20 pt-3 sm:pt-4">
          <Button
            onClick={clearFilters}
            variant="outline"
            className="w-full gap-2 min-h-[44px] border-2 border-primary/30 hover:border-primary hover:bg-primary/10 text-sm md:text-base"
          >
            <span className="text-primary">◆</span>
            Reset Filters
            <span className="text-primary">◆</span>
          </Button>
        </div>
      </div>

      {/* Results Info */}
      <div className="mb-3 sm:mb-4 text-center">
        <p className="text-xs sm:text-sm md:text-base text-muted-foreground">
          {hasActiveFilters 
            ? `Showing ${displayedRotes.length} of ${filteredRotes.length} rotes`
            : `Exploring ${displayedRotes.length} of ${rotes.length} rotes (random order)`
          }
        </p>
      </div>

      {/* Results */}
      {filteredRotes.length === 0 ? (
        <div className="text-center py-12 border-2 border-primary/30 rounded-lg bg-card/50">
          <p className="text-muted-foreground mb-2">No rotes found</p>
          <p className="text-sm text-muted-foreground mb-4">
            Try adjusting your search or filters
          </p>
          {hasActiveFilters && (
            <Button
              onClick={clearFilters}
              variant="outline"
              className="gap-2"
            >
              <X className="w-4 h-4" />
              Clear all filters
            </Button>
          )}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
            {displayedRotes.map((rote) => (
              <RoteCard
                key={rote.id}
                rote={rote}
                onSelect={onSelectRote}
                matchingSpheres={exactFilterCombination}  // <-- PASS HERE
              />
            ))}
          </div>

          {/* Load More Button */}
          {hasMore && (
            <div className="mt-6 sm:mt-8 text-center">
              <Button
                onClick={loadMore}
                variant="outline"
                size="lg"
                className="gap-2 min-h-[48px] px-6 sm:px-8 border-2 border-primary/30 hover:border-primary hover:bg-primary/10"
              >
                <ChevronDown className="w-5 h-5" />
                Load {remainingCount < ITEMS_PER_PAGE ? remainingCount : ITEMS_PER_PAGE} More Rotes
                <ChevronDown className="w-5 h-5" />
              </Button>
              <p className="text-xs sm:text-sm text-muted-foreground mt-2">
                {remainingCount} more rotes available
              </p>
            </div>
          )}

          {/* End Message */}
          {!hasMore && displayedRotes.length > ITEMS_PER_PAGE && (
            <div className="mt-6 sm:mt-8 text-center">
              <p className="text-sm text-muted-foreground italic">
                You've reached the end • {filteredRotes.length} rotes shown
              </p>
            </div>
          )}
        </>
      )}
    </div>
  )
}
