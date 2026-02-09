import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { prisma } from '@/lib/db'

// POST /api/characters/[id]/rotes - Assign a rote to a character
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
    const character = await prisma.character.findFirst({
      where: {
        id: params.id,
        userId: session.user.id
      }
    })

    if (!character) {
      return NextResponse.json(
        { error: 'Character not found' },
        { status: 404 }
      )
    }

    const body = await request.json()
    const { roteId, notes, specialty } = body

    if (!roteId) {
      return NextResponse.json(
        { error: 'Rote ID is required' },
        { status: 400 }
      )
    }

    // Check if rote exists
    const rote = await prisma.rote.findUnique({
      where: { id: roteId }
    })

    if (!rote) {
      return NextResponse.json(
        { error: 'Rote not found' },
        { status: 404 }
      )
    }

    // Create the assignment (will fail if already assigned due to unique constraint)
    const characterRote = await prisma.characterRote.create({
      data: {
        characterId: params.id,
        roteId,
        notes: notes || null,
        specialty: specialty || false,
      },
      include: {
        rote: true
      }
    })

    return NextResponse.json(characterRote, { status: 201 })
  } catch (error: any) {
    console.error('Error assigning rote:', error)
    
    // Handle unique constraint violation
    if (error.code === 'P2002') {
      return NextResponse.json(
        { error: 'Rote already assigned to this character' },
        { status: 400 }
      )
    }
    
    return NextResponse.json(
      { error: 'Failed to assign rote' },
      { status: 500 }
    )
  }
}

// DELETE /api/characters/[id]/rotes - Remove a rote from a character
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
    const character = await prisma.character.findFirst({
      where: {
        id: params.id,
        userId: session.user.id
      }
    })

    if (!character) {
      return NextResponse.json(
        { error: 'Character not found' },
        { status: 404 }
      )
    }

    const { searchParams } = new URL(request.url)
    const roteId = searchParams.get('roteId')

    if (!roteId) {
      return NextResponse.json(
        { error: 'Rote ID is required' },
        { status: 400 }
      )
    }

    await prisma.characterRote.deleteMany({
      where: {
        characterId: params.id,
        roteId: roteId
      }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error removing rote:', error)
    return NextResponse.json(
      { error: 'Failed to remove rote' },
      { status: 500 }
    )
  }
}
