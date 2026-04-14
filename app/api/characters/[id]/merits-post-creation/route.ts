// app/api/characters/[id]/merits-post-creation/route.ts

import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'

// GET /api/characters/[id]/merits-post-creation - Get character's post-creation merits
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const characterMerits = await prisma.characterMerit.findMany({
      where: { characterId: params.id },
      include: {
        merit: true,
      },
      orderBy: { purchasedAt: 'desc' },
    })

    return NextResponse.json(characterMerits)
  } catch (error) {
    console.error('Error fetching character merits:', error)
    return NextResponse.json({ error: 'Failed to fetch merits' }, { status: 500 })
  }
}

// POST /api/characters/[id]/merits-post-creation - Add merit to character
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { meritId, xpCost, notes } = body

    if (!meritId) {
      return NextResponse.json({ error: 'Merit ID required' }, { status: 400 })
    }

    // Check character ownership
    const character = await prisma.character.findUnique({
      where: { id: params.id },
      select: { 
        userId: true, 
        totalExperience: true, 
        spentExperience: true,
      },
    })

    if (!character) {
      return NextResponse.json({ error: 'Character not found' }, { status: 404 })
    }

    if (character.userId !== session.user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    // Get merit details
    const merit = await prisma.merit.findUnique({
      where: { id: meritId },
    })

    if (!merit) {
      return NextResponse.json({ error: 'Merit not found' }, { status: 404 })
    }

    // Check if already has this merit
    const existing = await prisma.characterMerit.findUnique({
      where: {
        characterId_meritId: {
          characterId: params.id,
          meritId: meritId,
        },
      },
    })

    if (existing) {
      return NextResponse.json(
        { error: 'Character already has this merit' },
        { status: 400 }
      )
    }

    // Calculate XP cost (merit point cost × 2)
    const calculatedXpCost = merit.cost * 2
    const finalXpCost = xpCost ?? calculatedXpCost

    // Check if enough XP
    const availableXp = character.totalExperience - character.spentExperience
    if (finalXpCost > availableXp) {
      return NextResponse.json(
        { error: `Not enough XP. Available: ${availableXp}, Needed: ${finalXpCost}` },
        { status: 400 }
      )
    }

    // Create transaction
    const result = await prisma.$transaction(async (tx) => {
      // Add merit to character
      const characterMerit = await tx.characterMerit.create({
        data: {
          characterId: params.id,
          meritId: meritId,
          pointCost: merit.cost,
          xpCost: finalXpCost,
          notes: notes || null,
        },
        include: {
          merit: true,
        },
      })

      // Log XP expenditure
      await tx.experienceLog.create({
        data: {
          characterId: params.id,
          type: 'spend',
          amount: -finalXpCost,
          category: 'Merit',
          itemName: merit.name,
          description: `Purchased ${merit.name} (${merit.cost} pt merit) for ${finalXpCost} XP`,
          officialCost: calculatedXpCost,
          actualCost: finalXpCost,
          usedCustom: xpCost !== undefined && xpCost !== calculatedXpCost,
          createdBy: session.user.id,
        },
      })

      // Update character spent XP
      await tx.character.update({
        where: { id: params.id },
        data: {
          spentExperience: { increment: finalXpCost },
        },
      })

      return characterMerit
    })

    return NextResponse.json({
      success: true,
      characterMerit: result,
      message: `Added ${merit.name} for ${finalXpCost} XP`,
    })
  } catch (error) {
    console.error('Error adding merit:', error)
    return NextResponse.json({ error: 'Failed to add merit' }, { status: 500 })
  }
}

// DELETE /api/characters/[id]/merits-post-creation/[meritId] - Remove merit
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const url = new URL(request.url)
    const meritId = url.searchParams.get('meritId')

    if (!meritId) {
      return NextResponse.json({ error: 'Merit ID required' }, { status: 400 })
    }

    // Check character ownership
    const character = await prisma.character.findUnique({
      where: { id: params.id },
      select: { userId: true },
    })

    if (!character) {
      return NextResponse.json({ error: 'Character not found' }, { status: 404 })
    }

    if (character.userId !== session.user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    // Find and delete character merit
    const characterMerit = await prisma.characterMerit.findUnique({
      where: {
        characterId_meritId: {
          characterId: params.id,
          meritId: meritId,
        },
      },
      include: { merit: true },
    })

    if (!characterMerit) {
      return NextResponse.json({ error: 'Merit not found on character' }, { status: 404 })
    }

    // Transaction to remove merit and refund XP
    await prisma.$transaction(async (tx) => {
      // Delete character merit
      await tx.characterMerit.delete({
        where: {
          characterId_meritId: {
            characterId: params.id,
            meritId: meritId,
          },
        },
      })

      // Log XP refund
      if (characterMerit.xpCost) {
        await tx.experienceLog.create({
          data: {
            characterId: params.id,
            type: 'gain',
            amount: characterMerit.xpCost,
            category: 'Merit Removal',
            itemName: characterMerit.merit.name,
            description: `Removed ${characterMerit.merit.name} - XP refunded`,
            actualCost: characterMerit.xpCost,
            createdBy: session.user.id,
          },
        })

        // Refund XP
        await tx.character.update({
          where: { id: params.id },
          data: {
            spentExperience: { decrement: characterMerit.xpCost },
          },
        })
      }
    })

    return NextResponse.json({
      success: true,
      message: `Removed ${characterMerit.merit.name}`,
    })
  } catch (error) {
    console.error('Error removing merit:', error)
    return NextResponse.json({ error: 'Failed to remove merit' }, { status: 500 })
  }
}
