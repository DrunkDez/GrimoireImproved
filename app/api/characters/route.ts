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
    
    // Log the incoming data for debugging
    console.log('Creating character with data:', {
      name: body.name,
      faction: body.faction,
      hasAttributes: !!body.attributes,
      hasAbilities: !!body.abilities,
      hasSpheres: !!body.spheres,
      hasBackgrounds: !!body.backgrounds,
      hasSpecialties: !!body.specialties,
      hasMerits: !!body.merits,
      hasFlaws: !!body.flaws,
      hasFreebieDots: !!body.freebieDots,
    })

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

    console.log('Character created successfully:', character.id)
    return NextResponse.json(character, { status: 201 })
  } catch (error) {
    console.error('Error creating character:', error)
    return NextResponse.json(
      { error: 'Failed to create character' },
      { status: 500 }
    )
  }
}

// GET /api/characters/[id] - Get a specific character
export async function GET_BY_ID(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const character = await prisma.character.findFirst({
      where: {
        id: params.id,
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
      return NextResponse.json({ error: 'Character not found' }, { status: 404 })
    }

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
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
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
        name: name || existingCharacter.name,
        faction: faction || existingCharacter.faction,
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

    console.log('Character updated successfully:', updatedCharacter.id)
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
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
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
}import { NextRequest, NextResponse } from 'next/server'
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

    console.log(`Fetched ${characters.length} characters for user ${session.user.id}`)
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
    
    console.log('=== CREATING CHARACTER ===')
    console.log('User ID:', session.user.id)
    console.log('Character name:', body.name)
    console.log('Has attributes:', !!body.attributes)
    console.log('Has abilities:', !!body.abilities)
    console.log('Has spheres:', !!body.spheres)
    console.log('Has backgrounds:', !!body.backgrounds)
    console.log('Has specialties:', !!body.specialties)
    console.log('Has merits:', !!body.merits?.length)
    console.log('Has flaws:', !!body.flaws?.length)
    console.log('Has freebieDots:', !!body.freebieDots)
    
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

    console.log('Character created successfully:', character.id)
    console.log('Saved attributes:', character.attributes)
    console.log('========================')
    
    return NextResponse.json(character, { status: 201 })
  } catch (error) {
    console.error('Error creating character:', error)
    return NextResponse.json(
      { error: 'Failed to create character' },
      { status: 500 }
    )
  }
}

// GET /api/characters/[id] - Get a specific character
export async function GET_BY_ID(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const character = await prisma.character.findFirst({
      where: {
        id: params.id,
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
      return NextResponse.json({ error: 'Character not found' }, { status: 404 })
    }

    console.log(`Fetched character ${character.id}:`, {
      name: character.name,
      hasAttributes: !!character.attributes,
      hasAbilities: !!character.abilities,
      hasSpheres: !!character.spheres
    })

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
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const characterId = params.id

    console.log('=== UPDATING CHARACTER ===')
    console.log('Character ID:', characterId)
    console.log('User ID:', session.user.id)
    console.log('Update data keys:', Object.keys(body))

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

    console.log('Character updated successfully:', updatedCharacter.id)
    console.log('Updated attributes:', updatedCharacter.attributes ? 'present' : 'null')
    console.log('Updated abilities:', updatedCharacter.abilities ? 'present' : 'null')
    console.log('========================')
    
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
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
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
