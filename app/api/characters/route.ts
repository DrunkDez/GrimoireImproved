import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { prisma } from '@/lib/db'

// GET /api/characters - Get all characters for logged-in user
export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const characters = await prisma.character.findMany({
      where: { userId: session.user.id },
      include: {
        rotes: {
          include: {
            rote: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
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
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { name, faction, concept, arete, avatar, essence } = body

    // Validate required fields
    if (!name || !faction) {
      return NextResponse.json(
        { error: 'Name and faction are required' },
        { status: 400 }
      )
    }

    const character = await prisma.character.create({
      data: {
        name,
        faction,
        concept: concept || null,
        arete: arete || null,
        avatar: avatar || null,
        essence: essence || null,
        userId: session.user.id,
      },
      include: {
        rotes: {
          include: {
            rote: true
          }
        }
      }
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
