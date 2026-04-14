// app/api/experience-costs/route.ts

import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/experience-costs - Get all official XP costs
export async function GET() {
  try {
    const costs = await prisma.experienceCost.findMany({
      where: { isOfficial: true },
      orderBy: { category: 'asc' },
    })

    return NextResponse.json(costs)
  } catch (error) {
    console.error('Error fetching experience costs:', error)
    return NextResponse.json(
      { error: 'Failed to fetch experience costs' },
      { status: 500 }
    )
  }
}