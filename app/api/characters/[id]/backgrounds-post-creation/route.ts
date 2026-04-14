// app/api/characters/[id]/backgrounds-post-creation/route.ts

import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'

// GET /api/characters/[id]/backgrounds-post-creation - Get character's post-creation backgrounds
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const characterBackgrounds = await prisma.characterBackground.findMany({
      where: { characterId: params.id },
      include: {
        background: true,
      },
      orderBy: { acquiredAt: 'desc' },
    })

    return NextResponse.json(characterBackgrounds)
  } catch (error) {
    console.error('Error fetching character backgrounds:', error)
    return NextResponse.json({ error: 'Failed to fetch backgrounds' }, { status: 500 })
  }
}

// POST /api/characters/[id]/backgrounds-post-creation - Add or increase background
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
    const { backgroundId, increaseBy = 1, xpCostPerDot, notes } = body

    if (!backgroundId) {
      return NextResponse.json({ error: 'Background ID required' }, { status: 400 })
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

    // Get background details
    const background = await prisma.background.findUnique({
      where: { id: backgroundId },
    })

    if (!background) {
      return NextResponse.json({ error: 'Background not found' }, { status: 404 })
    }

    // Check if character already has this background
    const existing = await prisma.characterBackground.findUnique({
      where: {
        characterId_backgroundId: {
          characterId: params.id,
          backgroundId: backgroundId,
        },
      },
    })

    let fromRating = 0
    let toRating = increaseBy

    if (existing) {
      fromRating = existing.currentRating
      toRating = fromRating + increaseBy
      
      if (toRating > 5) {
        return NextResponse.json(
          { error: 'Background cannot exceed 5 dots' },
          { status: 400 }
        )
      }
    }

    // Calculate XP cost
    // Official: new rating × 3 for EACH dot
    // Example: going from 2 to 4 costs (3×3) + (4×3) = 21 XP
    let totalXpCost = 0
    for (let i = fromRating + 1; i <= toRating; i++) {
      totalXpCost += i * 3
    }

    // Allow custom cost override
    const finalXpCost = xpCostPerDot 
      ? xpCostPerDot * increaseBy 
      : totalXpCost

    // Check if enough XP
    const availableXp = character.totalExperience - character.spentExperience
    if (finalXpCost > availableXp) {
      return NextResponse.json(
        { error: `Not enough XP. Available: ${availableXp}, Needed: ${finalXpCost}` },
        { status: 400 }
      )
    }

    // Create or update
    const result = await prisma.$transaction(async (tx) => {
      let characterBackground

      if (existing) {
        // Update existing background
        const currentLog = (existing.purchaseLog as any[]) || []
        currentLog.push({
          from: fromRating,
          to: toRating,
          xpCost: finalXpCost,
          date: new Date().toISOString(),
        })

        characterBackground = await tx.characterBackground.update({
          where: {
            characterId_backgroundId: {
              characterId: params.id,
              backgroundId: backgroundId,
            },
          },
          data: {
            currentRating: toRating,
            xpSpent: { increment: finalXpCost },
            purchaseLog: currentLog,
            notes: notes || existing.notes,
          },
          include: {
            background: true,
          },
        })
      } else {
        // Create new background
        characterBackground = await tx.characterBackground.create({
          data: {
            characterId: params.id,
            backgroundId: backgroundId,
            currentRating: toRating,
            startRating: 0,
            xpSpent: finalXpCost,
            purchaseLog: [{
              from: 0,
              to: toRating,
              xpCost: finalXpCost,
              date: new Date().toISOString(),
            }],
            notes: notes || null,
          },
          include: {
            background: true,
          },
        })
      }

      // Log XP expenditure
      await tx.experienceLog.create({
        data: {
          characterId: params.id,
          type: 'spend',
          amount: -finalXpCost,
          category: 'Background',
          itemName: background.name,
          fromRating,
          toRating,
          description: `${existing ? 'Increased' : 'Purchased'} ${background.name} from ${fromRating} to ${toRating} for ${finalXpCost} XP`,
          officialCost: totalXpCost,
          actualCost: finalXpCost,
          usedCustom: xpCostPerDot !== undefined,
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

      return characterBackground
    })

    return NextResponse.json({
      success: true,
      characterBackground: result,
      message: `${existing ? 'Increased' : 'Added'} ${background.name} to ${toRating} dots for ${finalXpCost} XP`,
    })
  } catch (error) {
    console.error('Error managing background:', error)
    return NextResponse.json({ error: 'Failed to manage background' }, { status: 500 })
  }
}

// DELETE /api/characters/[id]/backgrounds-post-creation - Remove background dot(s)
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
    const backgroundId = url.searchParams.get('backgroundId')
    const removeCompletely = url.searchParams.get('removeCompletely') === 'true'

    if (!backgroundId) {
      return NextResponse.json({ error: 'Background ID required' }, { status: 400 })
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

    // Find character background
    const characterBackground = await prisma.characterBackground.findUnique({
      where: {
        characterId_backgroundId: {
          characterId: params.id,
          backgroundId: backgroundId,
        },
      },
      include: { background: true },
    })

    if (!characterBackground) {
      return NextResponse.json(
        { error: 'Background not found on character' },
        { status: 404 }
      )
    }

    // Remove and refund XP
    await prisma.$transaction(async (tx) => {
      // Delete character background
      await tx.characterBackground.delete({
        where: {
          characterId_backgroundId: {
            characterId: params.id,
            backgroundId: backgroundId,
          },
        },
      })

      // Log XP refund
      if (characterBackground.xpSpent > 0) {
        await tx.experienceLog.create({
          data: {
            characterId: params.id,
            type: 'gain',
            amount: characterBackground.xpSpent,
            category: 'Background Removal',
            itemName: characterBackground.background.name,
            description: `Removed ${characterBackground.background.name} (${characterBackground.currentRating} dots) - XP refunded`,
            actualCost: characterBackground.xpSpent,
            createdBy: session.user.id,
          },
        })

        // Refund XP
        await tx.character.update({
          where: { id: params.id },
          data: {
            spentExperience: { decrement: characterBackground.xpSpent },
          },
        })
      }
    })

    return NextResponse.json({
      success: true,
      message: `Removed ${characterBackground.background.name}`,
    })
  } catch (error) {
    console.error('Error removing background:', error)
    return NextResponse.json({ error: 'Failed to remove background' }, { status: 500 })
  }
}
