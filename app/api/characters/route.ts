import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

// 🔒 SECURITY: JSON validation schemas
const validateAttributes = (attrs: any): boolean => {
  if (!attrs || typeof attrs !== 'object') return true // Optional field
  const required = ['strength', 'dexterity', 'stamina', 'charisma', 'manipulation', 'appearance', 'perception', 'intelligence', 'wits']
  for (const attr of required) {
    const val = attrs[attr]
    if (val !== undefined && (typeof val !== 'number' || val < 1 || val > 5)) {
      return false
    }
  }
  return true
}

const validateSpheres = (spheres: any): boolean => {
  if (!spheres || typeof spheres !== 'object') return true
  const valid = ['correspondence', 'entropy', 'forces', 'life', 'matter', 'mind', 'prime', 'spirit', 'time']
  for (const sphere of Object.keys(spheres)) {
    if (!valid.includes(sphere.toLowerCase())) return false
    const val = spheres[sphere]
    if (typeof val !== 'number' || val < 0 || val > 5) return false
  }
  return true
}

const validateAbilities = (abilities: any): boolean => {
  if (!abilities || typeof abilities !== 'object') return true
  for (const [key, val] of Object.entries(abilities)) {
    if (val !== undefined && (typeof val !== 'number' || val < 0 || val > 5)) {
      return false
    }
  }
  return true
}

// GET /api/characters - Get user's characters
export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const characters = await prisma.character.findMany({
      where: {
        userId: session.user.id
      },
      include: {
        _count: {
          select: {
            rotes: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json(characters)
  } catch (error) {
    console.error('Error fetching characters:', error)
    return NextResponse.json(
      { error: 'Failed to fetch characters' },
      { status: 500 }
    )
  }
}

// POST /api/characters - Create a new character
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    
    // Extract all fields from the request
    const {
      name,
      player,
      chronicle,
      nature,
      demeanor,
      essence,
      faction,
      sect,
      concept,
      attributes,
      abilities,
      spheres,
      backgrounds,
      specialties,
      arete,
      willpower,
      freebieDots,
      merits,
      flaws,
      avatar
    } = body

    // Validate required fields
    if (!name || !faction) {
      return NextResponse.json(
        { error: 'Name and faction are required' },
        { status: 400 }
      )
    }

    // 🔒 SECURITY FIX: Validate JSON data structures
    if (!validateAttributes(attributes)) {
      return NextResponse.json(
        { error: 'Invalid attributes: must be numbers 1-5' },
        { status: 400 }
      )
    }

    if (!validateSpheres(spheres)) {
      return NextResponse.json(
        { error: 'Invalid spheres: must be valid sphere names with levels 0-5' },
        { status: 400 }
      )
    }

    if (!validateAbilities(abilities)) {
      return NextResponse.json(
        { error: 'Invalid abilities: must be numbers 0-5' },
        { status: 400 }
      )
    }

    // Validate numeric fields
    if (arete !== undefined && (typeof arete !== 'number' || arete < 1 || arete > 10)) {
      return NextResponse.json(
        { error: 'Invalid arete: must be 1-10' },
        { status: 400 }
      )
    }

    if (willpower !== undefined && (typeof willpower !== 'number' || willpower < 1 || willpower > 10)) {
      return NextResponse.json(
        { error: 'Invalid willpower: must be 1-10' },
        { status: 400 }
      )
    }

    // 🔒 SECURITY FIX: Sanitize string inputs (prevent XSS)
    const sanitizeString = (str: any): string | null => {
      if (!str) return null
      return String(str).trim().substring(0, 500) // Max 500 chars
    }

    // Create character with all fields
    const character = await prisma.character.create({
      data: {
        name: sanitizeString(name)!,
        faction: sanitizeString(faction)!,
        concept: sanitizeString(concept),
        arete: arete || null,
        willpower: willpower || null,
        avatar: sanitizeString(avatar),
        essence: sanitizeString(essence),
        player: sanitizeString(player),
        chronicle: sanitizeString(chronicle),
        nature: sanitizeString(nature),
        demeanor: sanitizeString(demeanor),
        sect: sanitizeString(sect),
        attributes: attributes || null,
        abilities: abilities || null,
        spheres: spheres || null,
        backgrounds: backgrounds || null,
        specialties: specialties || null,
        freebieDots: freebieDots || null,
        merits: merits || null,
        flaws: flaws || null,
        userId: session.user.id,
      },
    })

    return NextResponse.json(character, { status: 201 })
  } catch (error) {
    console.error('Error creating character:', error)
    return NextResponse.json(
      { error: 'Failed to create character' },
      { status: 500 }
    )
  }
}
