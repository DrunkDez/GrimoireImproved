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

    // Get the ID from the URL path
    const url = new URL(request.url)
    const pathParts = url.pathname.split('/')
    const idFromUrl = pathParts[pathParts.length - 1]
    
    // Use params.id or extract from URL
    const characterId = params?.id || idFromUrl
    
    console.log("=== API GET CHARACTER ===")
    console.log("params.id:", params?.id)
    console.log("URL path:", url.pathname)
    console.log("Extracted ID:", characterId)
    console.log("User ID:", session.user.id)

    if (!characterId) {
      console.error("No character ID provided")
      return NextResponse.json({ error: 'Character ID required' }, { status: 400 })
    }

    const character = await prisma.character.findUnique({
      where: {
        id: characterId
      },
      include: {
        rotes: {
          include: {
            rote: true
          }
        }
      }
    })

    console.log("Found character:", character?.id, character?.name)
    console.log("Character belongs to user:", character?.userId)
    console.log("Session user:", session.user.id)

    // Verify the character belongs to the user
    if (!character || character.userId !== session.user.id) {
      console.log("❌ Character not found or unauthorized")
      return NextResponse.json({ error: 'Character not found' }, { status: 404 })
    }

    console.log("✅ Returning character:", character.id, character.name)
    
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

    // Get the ID from the URL path
    const url = new URL(request.url)
    const pathParts = url.pathname.split('/')
    const idFromUrl = pathParts[pathParts.length - 1]
    const characterId = params?.id || idFromUrl

    console.log("=== API PUT CHARACTER ===")
    console.log("Updating character ID:", characterId)

    if (!characterId) {
      return NextResponse.json({ error: 'Character ID required' }, { status: 400 })
    }

    const body = await request.json()

    // Check if character exists and belongs to user
    const existingCharacter = await prisma.character.findUnique({
      where: {
        id: characterId
      }
    })

    if (!existingCharacter || existingCharacter.userId !== session.user.id) {
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

    console.log("✅ Character updated:", updatedCharacter.id, updatedCharacter.name)
    
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

    // Get the ID from the URL path
    const url = new URL(request.url)
    const pathParts = url.pathname.split('/')
    const idFromUrl = pathParts[pathParts.length - 1]
    const characterId = params?.id || idFromUrl

    // Check if character exists and belongs to user
    const existingCharacter = await prisma.character.findUnique({
      where: {
        id: characterId
      }
    })

    if (!existingCharacter || existingCharacter.userId !== session.user.id) {
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
