import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

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

    // Create character with all fields
    const character = await prisma.character.create({
      data: {
        name,
        faction,
        concept: concept || null,
        arete: arete || null,
        willpower: willpower || null,
        avatar: avatar || null,
        essence: essence || null,
        player: player || null,
        chronicle: chronicle || null,
        nature: nature || null,
        demeanor: demeanor || null,
        sect: sect || null,
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
