"use client"
 
import { useState, useMemo, useEffect } from 'react'
import { Rote } from '@/lib/mage-data'
import { RoteCard } from './rote-card'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Search } from 'lucide-react'
 
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
 
export function BrowsePanel({ rotes, onSelectRote, shouldRestoreState, onStateRestored }: BrowsePanelProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedTradition, setSelectedTradition] = useState<string>('All')
  const [selectedLevel, setSelectedLevel] = useState<string>('All')
  const [selectedSphere, setSelectedSphere] = useState<string>('All')
  const [sortBy, setSortBy] = useState<string>('random')
  const [randomSeed, setRandomSeed] = useState(Math.random())
 
  // Get unique traditions
  const traditions = useMemo(() => {
    const uniqueTraditions = new Set(rotes.map(r => r.tradition))
    return ['All', ...Array.from(uniqueTraditions).sort()]
  }, [rotes])
 
  // Get unique levels
  const levels = useMemo(() => {
    const uniqueLevels = new Set(rotes.map(r => r.level))
    return ['All', ...Array.from(uniqueLevels).sort()]
  }, [rotes])
 
  // Get unique spheres
  const spheres = useMemo(() => {
    const uniqueSpheres = new Set<string>()
    rotes.forEach(rote => {
      const sphereObj = Array.isArray(rote.spheres) ? rote.spheres[0] : rote.spheres
      if (sphereObj && typeof sphereObj === 'object') {
        Object.keys(sphereObj).forEach(sphere => uniqueSpheres.add(sphere))
      }
    })
    return ['All', ...Array.from(uniqueSpheres).sort()]
  }, [rotes])
 
  // Filter and sort rotes
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
    if (selectedTradition !== 'All') {
      result = result.filter(rote => rote.tradition === selectedTradition)
    }
 
    // Apply level filter
    if (selectedLevel !== 'All') {
      result = result.filter(rote => rote.level === selectedLevel)
    }
 
    // Apply sphere filter
    if (selectedSphere !== 'All') {
      result = result.filter(rote => {
        const sphereObj = Array.isArray(rote.spheres) ? rote.spheres[0] : rote.spheres
        return sphereObj && typeof sphereObj === 'object' && selectedSphere in sphereObj
      })
    }
 
    // Apply sorting
    switch (sortBy) {
      case 'name':
        return [...result].sort((a, b) => a.name.localeCompare(b.name))
      case 'tradition':
        return [...result].sort((a, b) => a.tradition.localeCompare(b.tradition))
      case 'level':
        return [...result].sort((a, b) => a.level.localeCompare(b.level))
      case 'random':
      default:
        // Use randomSeed to ensure same random order until filters change
        return shuffleArray(result)
    }
  }, [rotes, searchQuery, selectedTradition, selectedLevel, selectedSphere, sortBy, randomSeed])
 
  // Reset random seed when filters change (to get new random order)
  useEffect(() => {
    if (sortBy === 'random' && (searchQuery || selectedTradition !== 'All' || selectedLevel !== 'All' || selectedSphere !== 'All')) {
      setRandomSeed(Math.random())
    }
  }, [searchQuery, selectedTradition, selectedLevel, selectedSphere, sortBy])
 
  // Restore state if needed
  useEffect(() => {
    if (shouldRestoreState) {
      const savedQuery = sessionStorage.getItem('browseSearchQuery')
      const savedTradition = sessionStorage.getItem('browseTradition')
      const savedLevel = sessionStorage.getItem('browseLevel')
      const savedSphere = sessionStorage.getItem('browseSphere')
      const savedSort = sessionStorage.getItem('browseSort')
 
      if (savedQuery) setSearchQuery(savedQuery)
      if (savedTradition) setSelectedTradition(savedTradition)
      if (savedLevel) setSelectedLevel(savedLevel)
      if (savedSphere) setSelectedSphere(savedSphere)
      if (savedSort) setSortBy(savedSort)
 
      onStateRestored?.()
    }
  }, [shouldRestoreState, onStateRestored])
 
  // Save state when it changes
  useEffect(() => {
    sessionStorage.setItem('browseSearchQuery', searchQuery)
    sessionStorage.setItem('browseTradition', selectedTradition)
    sessionStorage.setItem('browseLevel', selectedLevel)
    sessionStorage.setItem('browseSphere', selectedSphere)
    sessionStorage.setItem('browseSort', sortBy)
  }, [searchQuery, selectedTradition, selectedLevel, selectedSphere, sortBy])
 
  // Calculate if filters are active
  const hasActiveFilters = searchQuery || selectedTradition !== 'All' || selectedLevel !== 'All' || selectedSphere !== 'All'
 
  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <h2 className="font-serif text-2xl font-bold text-foreground mb-2">
          Browse Rotes
        </h2>
        <p className="text-muted-foreground">
          {hasActiveFilters 
            ? `Showing ${filteredRotes.length} of ${rotes.length} rotes`
            : `Exploring ${rotes.length} rotes in random order`
          }
        </p>
      </div>
 
      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search rotes by name, description, or tradition..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>
 
      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        {/* Tradition Filter */}
        <Select value={selectedTradition} onValueChange={setSelectedTradition}>
          <SelectTrigger>
            <SelectValue placeholder="All Traditions" />
          </SelectTrigger>
          <SelectContent>
            {traditions.map((tradition) => (
              <SelectItem key={tradition} value={tradition}>
                {tradition}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
 
        {/* Level Filter */}
        <Select value={selectedLevel} onValueChange={setSelectedLevel}>
          <SelectTrigger>
            <SelectValue placeholder="All Levels" />
          </SelectTrigger>
          <SelectContent>
            {levels.map((level) => (
              <SelectItem key={level} value={level}>
                {level}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
 
        {/* Sphere Filter */}
        <Select value={selectedSphere} onValueChange={setSelectedSphere}>
          <SelectTrigger>
            <SelectValue placeholder="All Spheres" />
          </SelectTrigger>
          <SelectContent>
            {spheres.map((sphere) => (
              <SelectItem key={sphere} value={sphere}>
                {sphere}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
 
        {/* Sort Filter */}
        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger>
            <SelectValue placeholder="Sort by..." />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="random">Random Order</SelectItem>
            <SelectItem value="name">Name (A-Z)</SelectItem>
            <SelectItem value="tradition">Tradition</SelectItem>
            <SelectItem value="level">Level</SelectItem>
          </SelectContent>
        </Select>
      </div>
 
      {/* Clear Filters Button */}
      {hasActiveFilters && (
        <div className="mb-6">
          <button
            onClick={() => {
              setSearchQuery('')
              setSelectedTradition('All')
              setSelectedLevel('All')
              setSelectedSphere('All')
              setSortBy('random')
              setRandomSeed(Math.random()) // New random order
            }}
            className="text-sm text-muted-foreground hover:text-foreground underline"
          >
            Clear all filters
          </button>
        </div>
      )}
 
      {/* Results */}
      {filteredRotes.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground mb-2">No rotes found</p>
          <p className="text-sm text-muted-foreground">
            Try adjusting your search or filters
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredRotes.map((rote) => (
            <RoteCard
              key={rote.id}
              rote={rote}
              onSelect={onSelectRote}
            />
          ))}
        </div>
      )}
    </div>
  )
}
