import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

// GET /api/characters/[id] - Get a specific character
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const characterId = params.id
    console.log("📡 API GET - Requesting character ID:", characterId)
    console.log("📡 API GET - User ID:", session.user.id)

    const character = await prisma.character.findFirst({
      where: {
        id: characterId,
        userId: session.user.id
      },
      include: {
        rotes: {
          include: {
            rote: true
          }
        }
      }
    })

    if (!character) {
      console.log("❌ Character not found:", characterId)
      return NextResponse.json({ error: 'Character not found' }, { status: 404 })
    }

    console.log("✅ API GET - Returning character:", character.id, character.name)
    console.log("📊 Has attributes:", !!character.attributes)
    
    return NextResponse.json(character)
  } catch (error) {
    console.error('Error fetching character:', error)
    return NextResponse.json(
      { error: 'Failed to fetch character' },
      { status: 500 }
    )
  }
}

// PUT /api/characters/[id] - Update a character
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const characterId = params.id

    console.log("📡 API PUT - Updating character ID:", characterId)
    console.log("📡 API PUT - User ID:", session.user.id)

    // Check if character exists and belongs to user
    const existingCharacter = await prisma.character.findFirst({
      where: {
        id: characterId,
        userId: session.user.id
      }
    })

    if (!existingCharacter) {
      console.log("❌ Character not found for update:", characterId)
      return NextResponse.json({ error: 'Character not found' }, { status: 404 })
    }

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

    // Update character with all fields
    const updatedCharacter = await prisma.character.update({
      where: { id: characterId },
      data: {
        name: name !== undefined ? name : existingCharacter.name,
        faction: faction !== undefined ? faction : existingCharacter.faction,
        concept: concept !== undefined ? concept : existingCharacter.concept,
        arete: arete !== undefined ? arete : existingCharacter.arete,
        willpower: willpower !== undefined ? willpower : existingCharacter.willpower,
        avatar: avatar !== undefined ? avatar : existingCharacter.avatar,
        essence: essence !== undefined ? essence : existingCharacter.essence,
        player: player !== undefined ? player : existingCharacter.player,
        chronicle: chronicle !== undefined ? chronicle : existingCharacter.chronicle,
        nature: nature !== undefined ? nature : existingCharacter.nature,
        demeanor: demeanor !== undefined ? demeanor : existingCharacter.demeanor,
        sect: sect !== undefined ? sect : existingCharacter.sect,
        attributes: attributes !== undefined ? attributes : existingCharacter.attributes,
        abilities: abilities !== undefined ? abilities : existingCharacter.abilities,
        spheres: spheres !== undefined ? spheres : existingCharacter.spheres,
        backgrounds: backgrounds !== undefined ? backgrounds : existingCharacter.backgrounds,
        specialties: specialties !== undefined ? specialties : existingCharacter.specialties,
        freebieDots: freebieDots !== undefined ? freebieDots : existingCharacter.freebieDots,
        merits: merits !== undefined ? merits : existingCharacter.merits,
        flaws: flaws !== undefined ? flaws : existingCharacter.flaws,
      },
    })

    console.log("✅ API PUT - Character updated:", updatedCharacter.id, updatedCharacter.name)
    
    return NextResponse.json(updatedCharacter)
  } catch (error) {
    console.error('Error updating character:', error)
    return NextResponse.json(
      { error: 'Failed to update character' },
      { status: 500 }
    )
  }
}

// DELETE /api/characters/[id] - Delete a character
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const characterId = params.id

    // Check if character exists and belongs to user
    const existingCharacter = await prisma.character.findFirst({
      where: {
        id: characterId,
        userId: session.user.id
      }
    })

    if (!existingCharacter) {
      return NextResponse.json({ error: 'Character not found' }, { status: 404 })
    }

    await prisma.character.delete({
      where: { id: characterId }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting character:', error)
    return NextResponse.json(
      { error: 'Failed to delete character' },
      { status: 500 }
    )
  }
}
