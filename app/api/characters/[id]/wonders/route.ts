import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

// POST /api/characters/[id]/wonders - Add wonder to character
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Verify character ownership
    const character = await prisma.character.findUnique({
      where: { id: params.id }
    })

    if (!character) {
      return NextResponse.json(
        { error: 'Character not found' },
        { status: 404 }
      )
    }

    if (character.userId !== session.user.id) {
      return NextResponse.json(
        { error: 'Forbidden: You can only modify your own characters' },
        { status: 403 }
      )
    }

    const body = await request.json()
    const { wonderId, notes } = body

    if (!wonderId) {
      return NextResponse.json(
        { error: 'wonderId is required' },
        { status: 400 }
      )
    }

    // Check if wonder exists
    const wonder = await prisma.wonder.findUnique({
      where: { id: wonderId }
    })

    if (!wonder) {
      return NextResponse.json(
        { error: 'Wonder not found' },
        { status: 404 }
      )
    }

    // Check if already assigned
    const existing = await prisma.characterWonder.findUnique({
      where: {
        characterId_wonderId: {
          characterId: params.id,
          wonderId: wonderId
        }
      }
    })

    if (existing) {
      return NextResponse.json(
        { error: 'Wonder already assigned to this character' },
        { status: 400 }
      )
    }

    // Create the assignment
    const characterWonder = await prisma.characterWonder.create({
      data: {
        characterId: params.id,
        wonderId: wonderId,
        notes: notes || null
      },
      include: {
        wonder: true
      }
    })

    return NextResponse.json(characterWonder, { status: 201 })
  } catch (error) {
    console.error('Error adding wonder to character:', error)
    return NextResponse.json(
      { error: 'Failed to add wonder to character' },
      { status: 500 }
    )
  }
}

// DELETE /api/characters/[id]/wonders - Remove wonder from character
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Verify character ownership
    const character = await prisma.character.findUnique({
      where: { id: params.id }
    })

    if (!character) {
      return NextResponse.json(
        { error: 'Character not found' },
        { status: 404 }
      )
    }

    if (character.userId !== session.user.id) {
      return NextResponse.json(
        { error: 'Forbidden: You can only modify your own characters' },
        { status: 403 }
      )
    }

    const { searchParams } = new URL(request.url)
    const wonderId = searchParams.get('wonderId')

    if (!wonderId) {
      return NextResponse.json(
        { error: 'wonderId query parameter is required' },
        { status: 400 }
      )
    }

    // Delete the assignment
    await prisma.characterWonder.delete({
      where: {
        characterId_wonderId: {
          characterId: params.id,
          wonderId: wonderId
        }
      }
    })

    return NextResponse.json({ message: 'Wonder removed from character' })
  } catch (error) {
    console.error('Error removing wonder from character:', error)
    return NextResponse.json(
      { error: 'Failed to remove wonder from character' },
      { status: 500 }
    )
  }
}

// GET /api/characters/[id]/wonders - Get all wonders for a character
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const characterWonders = await prisma.characterWonder.findMany({
      where: { characterId: params.id },
      include: {
        wonder: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
              }
            }
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json(characterWonders)
  } catch (error) {
    console.error('Error fetching character wonders:', error)
    return NextResponse.json(
      { error: 'Failed to fetch character wonders' },
      { status: 500 }
    )
  }
}