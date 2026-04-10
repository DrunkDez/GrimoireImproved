"use client"

import { useState, useMemo, useEffect } from 'react'
import { Wonder, WONDER_CATEGORIES, WonderCategory, searchWonders, filterByCategory, sortWonders, WonderSortOption } from '@/lib/wonder-data'
import { WonderCard } from './wonder-card'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Search } from 'lucide-react'

interface BrowseWondersPanelProps {
  wonders: Wonder[]
  onSelectWonder?: (wonder: Wonder) => void
}

export function BrowseWondersPanel({ wonders, onSelectWonder }: BrowseWondersPanelProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<WonderCategory | 'All'>('All')
  const [sortBy, setSortBy] = useState<WonderSortOption>('random')
  const [randomSeed, setRandomSeed] = useState(Math.random())

  // Fisher-Yates shuffle algorithm
  const shuffleArray = <T,>(array: T[]): T[] => {
    const shuffled = [...array]
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
    }
    return shuffled
  }

  // Filter and sort wonders
  const filteredWonders = useMemo(() => {
    let result = wonders

    // Apply search
    if (searchQuery) {
      result = searchWonders(result, searchQuery)
    }

    // Apply category filter
    if (selectedCategory !== 'All') {
      result = filterByCategory(result, selectedCategory)
    }

    // Apply sort
    if (sortBy === 'random') {
      result = shuffleArray(result)
    } else {
      result = sortWonders(result, sortBy)
    }

    return result
  }, [wonders, searchQuery, selectedCategory, sortBy, randomSeed])

  // Reset random seed when filters change
  useEffect(() => {
    if (sortBy === 'random' && (searchQuery || selectedCategory !== 'All')) {
      setRandomSeed(Math.random())
    }
  }, [searchQuery, selectedCategory, sortBy])

  // Count by category
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { All: wonders.length }
    WONDER_CATEGORIES.forEach(category => {
      counts[category] = wonders.filter(w => w.category === category).length
    })
    return counts
  }, [wonders])

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <h2 className="font-serif text-2xl font-bold text-foreground mb-2">
          Wonders Database
        </h2>
        <p className="text-muted-foreground">
          {searchQuery || selectedCategory !== 'All'
            ? `Showing ${filteredWonders.length} of ${wonders.length} wonders`
            : `Exploring ${wonders.length} wonders in random order`
          }
        </p>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {/* Search */}
        <div className="relative md:col-span-2">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search wonders by name or description..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Sort */}
        <Select value={sortBy} onValueChange={(value) => setSortBy(value as WonderSortOption)}>
          <SelectTrigger>
            <SelectValue placeholder="Sort by..." />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="random">Random Order</SelectItem>
            <SelectItem value="name">Name (A-Z)</SelectItem>
            <SelectItem value="category">Category</SelectItem>
            <SelectItem value="arete">Arete</SelectItem>
            <SelectItem value="date">Date Added</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Category Filter */}
      <div className="mb-6">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setSelectedCategory('All')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              selectedCategory === 'All'
                ? 'bg-primary text-primary-foreground'
                : 'bg-card border border-primary/30 text-muted-foreground hover:border-primary/60'
            }`}
          >
            All ({categoryCounts.All})
          </button>
          {WONDER_CATEGORIES.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedCategory === category
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-card border border-primary/30 text-muted-foreground hover:border-primary/60'
              }`}
            >
              {category} ({categoryCounts[category] || 0})
            </button>
          ))}
        </div>
      </div>

      {/* Results Count */}
      <div className="mb-4 text-sm text-muted-foreground">
        Showing {filteredWonders.length} of {wonders.length} wonders
      </div>

      {/* Wonders Grid */}
      {filteredWonders.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground mb-2">No wonders found</p>
          <p className="text-sm text-muted-foreground">
            Try adjusting your search or filters
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredWonders.map((wonder) => (
            <WonderCard
              key={wonder.id}
              wonder={wonder}
              onSelect={onSelectWonder}
            />
          ))}
        </div>
      )}
    </div>
  )
}