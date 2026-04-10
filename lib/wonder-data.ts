// Wonder types and categories

export const WONDER_CATEGORIES = [
  'Artifact/Invention',
  'Charm/Gadget',
  'Talisman/Device',
  'Fetish',
  'Grimoire/Principia',
  'Primer',
  'Periapt/Matrix'
] as const

export type WonderCategory = typeof WONDER_CATEGORIES[number]

export interface Wonder {
  id: string
  name: string
  category: WonderCategory
  description: string
  backgroundCost: string | null
  arete: number | null
  quintessence: number | null
  spheres: { [key: string]: number } | null
  pageRef: string | null
  userId: string | null
  user?: {
    id: string
    name: string | null
    email: string
  } | null
  createdAt: string
  updatedAt: string
}

export interface CharacterWonder {
  id: string
  characterId: string
  wonderId: string
  wonder: Wonder
  notes: string | null
  createdAt: string
}

// Get category icon
export function getCategoryIcon(category: WonderCategory): string {
  const icons: Record<WonderCategory, string> = {
    'Artifact/Invention': '⚙️',
    'Charm/Gadget': '🔮',
    'Talisman/Device': '✨',
    'Fetish': '🗿',
    'Grimoire/Principia': '📖',
    'Primer': '📜',
    'Periapt/Matrix': '💎'
  }
  return icons[category] || '✨'
}

// Get category description
export function getCategoryDescription(category: WonderCategory): string {
  const descriptions: Record<WonderCategory, string> = {
    'Artifact/Invention': 'Sons of Ether creations and technological wonders',
    'Charm/Gadget': 'Portable magickal devices and trinkets',
    'Talisman/Device': 'Traditional magickal tools and implements',
    'Fetish': 'Spirit-bound objects with supernatural properties',
    'Grimoire/Principia': 'Books of magickal knowledge and lore',
    'Primer': 'Reality-altering texts that teach fundamental truths',
    'Periapt/Matrix': 'Personal foci that channel and amplify power'
  }
  return descriptions[category] || ''
}

// Format spheres for display
export function formatWonderSpheres(spheres: { [key: string]: number } | null): string {
  if (!spheres) return 'None'
  
  return Object.entries(spheres)
    .map(([sphere, level]) => `${sphere} ${level}`)
    .join(' • ')
}

// Format background cost
export function formatBackgroundCost(cost: string | null): string {
  if (!cost) return 'N/A'
  return `${cost} ${cost === '1' ? 'dot' : 'dots'}`
}

// Filter wonders by category
export function filterByCategory(wonders: Wonder[], category: WonderCategory | 'All'): Wonder[] {
  if (category === 'All') return wonders
  return wonders.filter(wonder => wonder.category === category)
}

// Filter wonders by arete
export function filterByArete(wonders: Wonder[], minArete: number, maxArete: number): Wonder[] {
  return wonders.filter(wonder => {
    if (wonder.arete === null) return true
    return wonder.arete >= minArete && wonder.arete <= maxArete
  })
}

// Filter wonders by spheres
export function filterBySphere(wonders: Wonder[], sphere: string): Wonder[] {
  return wonders.filter(wonder => {
    if (!wonder.spheres) return false
    return sphere in wonder.spheres
  })
}

// Search wonders
export function searchWonders(wonders: Wonder[], query: string): Wonder[] {
  const lowercaseQuery = query.toLowerCase()
  return wonders.filter(wonder => 
    wonder.name.toLowerCase().includes(lowercaseQuery) ||
    wonder.description.toLowerCase().includes(lowercaseQuery) ||
    wonder.category.toLowerCase().includes(lowercaseQuery)
  )
}

// Sort wonders
export type WonderSortOption = 'name' | 'category' | 'arete' | 'date' | 'random'

export function sortWonders(wonders: Wonder[], sortBy: WonderSortOption): Wonder[] {
  const sorted = [...wonders]
  
  switch (sortBy) {
    case 'name':
      return sorted.sort((a, b) => a.name.localeCompare(b.name))
    case 'category':
      return sorted.sort((a, b) => a.category.localeCompare(b.category))
    case 'arete':
      return sorted.sort((a, b) => {
        if (a.arete === null) return 1
        if (b.arete === null) return -1
        return a.arete - b.arete
      })
    case 'date':
      return sorted.sort((a, b) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      )
    default:
      return sorted
  }
}