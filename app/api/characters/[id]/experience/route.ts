// app/api/characters/[id]/experience/route.ts

import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'

// GET /api/characters/[id]/experience - Get character XP info
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params

    const character = await prisma.character.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        totalExperience: true,
        spentExperience: true,
        useCustomXpCosts: true,
        customXpCosts: true,
        userId: true,
      },
    })

    if (!character) {
      return NextResponse.json({ error: 'Character not found' }, { status: 404 })
    }

    if (character.userId !== session.user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const experienceLog = await prisma.experienceLog.findMany({
      where: { characterId: id },
      orderBy: { createdAt: 'desc' },
      take: 50,
    })

    const availableXp = character.totalExperience - character.spentExperience

    return NextResponse.json({
      totalExperience: character.totalExperience,
      spentExperience: character.spentExperience,
      availableXp,
      useCustomXpCosts: character.useCustomXpCosts,
      customXpCosts: character.customXpCosts,
      log: experienceLog,
    })
  } catch (error) {
    console.error('Error fetching character experience:', error)
    return NextResponse.json({ error: 'Failed to fetch experience' }, { status: 500 })
  }
}

// POST /api/characters/[id]/experience - Add XP (gain or spend)
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params
    const body = await request.json()
    
    const { 
      type, amount, category, itemName, fromRating, toRating,
      description, officialCost, usedCustom, sessionDate,
    } = body

    if (!type || !amount || !description) {
      return NextResponse.json(
        { error: 'Missing required fields: type, amount, description' },
        { status: 400 }
      )
    }

    if (type !== 'gain' && type !== 'spend') {
      return NextResponse.json(
        { error: 'Type must be "gain" or "spend"' },
        { status: 400 }
      )
    }

    const character = await prisma.character.findUnique({
      where: { id },
      select: { 
        userId: true, 
        totalExperience: true, 
        spentExperience: true,
        attributes: true,
        abilities: true,
        spheres: true,
        arete: true,
        willpower: true,
      },
    })

    if (!character) {
      return NextResponse.json({ error: 'Character not found' }, { status: 404 })
    }

    if (character.userId !== session.user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    // --- STAT UPDATE LOGIC (only for spend) ---
    if (type === 'spend') {
      const availableXp = character.totalExperience - character.spentExperience
      if (amount > availableXp) {
        return NextResponse.json(
          { error: `Not enough XP. Available: ${availableXp}, Needed: ${amount}` },
          { status: 400 }
        )
      }

      // Helper to update nested JSON fields (attributes, abilities, spheres)
      const updateStatField = (current: any, fieldName: string, newValue: number) => {
        const updated = { ...(current || {}) }
        // Convert itemName to a key (lowercase, no spaces)
        const key = fieldName?.toLowerCase().replace(/\s+/g, '')
        if (key) {
          updated[key] = newValue
        }
        return updated
      }

      let statUpdateData: any = {}

      if (category === 'Attribute' && itemName && toRating) {
        statUpdateData.attributes = updateStatField(character.attributes, itemName, toRating)
      } 
      else if (category === 'Ability' && itemName && toRating) {
        statUpdateData.abilities = updateStatField(character.abilities, itemName, toRating)
      }
      else if (category === 'Sphere' && itemName && toRating) {
        statUpdateData.spheres = updateStatField(character.spheres, itemName, toRating)
      }
      else if (category === 'Arete' && toRating) {
        statUpdateData.arete = toRating
      }
      else if (category === 'Willpower' && toRating) {
        statUpdateData.willpower = toRating
      }
      // For Backgrounds, Merits, Flaw Removal – you can extend later

      if (Object.keys(statUpdateData).length > 0) {
        await prisma.character.update({
          where: { id },
          data: statUpdateData,
        })
      }
    }

    // Create experience log entry
    const logEntry = await prisma.experienceLog.create({
      data: {
        characterId: id,
        type,
        amount: type === 'spend' ? -Math.abs(amount) : Math.abs(amount),
        category: category || null,
        itemName: itemName || null,
        fromRating: fromRating || null,
        toRating: toRating || null,
        description,
        officialCost: officialCost || null,
        actualCost: amount,
        usedCustom: usedCustom || false,
        sessionDate: sessionDate ? new Date(sessionDate) : null,
        createdBy: session.user.id,
      },
    })

    // Update XP totals
    const xpUpdateData: any = {}
    if (type === 'gain') {
      xpUpdateData.totalExperience = { increment: amount }
    } else {
      xpUpdateData.spentExperience = { increment: amount }
    }

    await prisma.character.update({
      where: { id },
      data: xpUpdateData,
    })

    return NextResponse.json({
      success: true,
      logEntry,
      message: type === 'gain' 
        ? `Added ${amount} XP`
        : `Spent ${amount} XP on ${category || 'improvement'}`,
    })
  } catch (error) {
    console.error('Error managing experience:', error)
    return NextResponse.json({ error: 'Failed to manage experience' }, { status: 500 })
  }
}

// PATCH /api/characters/[id]/experience - Toggle custom XP costs
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params
    const body = await request.json()
    const { useCustomXpCosts, customXpCosts } = body

    const character = await prisma.character.findUnique({
      where: { id },
      select: { userId: true },
    })

    if (!character) {
      return NextResponse.json({ error: 'Character not found' }, { status: 404 })
    }

    if (character.userId !== session.user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const updated = await prisma.character.update({
      where: { id },
      data: {
        useCustomXpCosts: useCustomXpCosts ?? undefined,
        customXpCosts: customXpCosts ?? undefined,
      },
      select: {
        useCustomXpCosts: true,
        customXpCosts: true,
      },
    })

    return NextResponse.json(updated)
  } catch (error) {
    console.error('Error updating XP settings:', error)
    return NextResponse.json({ error: 'Failed to update settings' }, { status: 500 })
  }
}
