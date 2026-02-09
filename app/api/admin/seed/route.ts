import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { SAMPLE_ROTES } from '@/lib/mage-data'

const ADMIN_PASSWORD = 'TruthUntilParadox'

// POST /api/admin/seed - Seed database with sample rotes (requires password)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { password } = body

    // Verify admin password
    if (password !== ADMIN_PASSWORD) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Create sample rotes
    const createdRotes = await Promise.all(
      SAMPLE_ROTES.map((rote) =>
        prisma.rote.create({
          data: {
            name: rote.name,
            tradition: rote.tradition,
            description: rote.description,
            spheres: rote.spheres,
            level: rote.level,
            pageRef: rote.pageRef || null,
          },
        })
      )
    )

    return NextResponse.json({ 
      success: true, 
      count: createdRotes.length 
    })
  } catch (error) {
    console.error('Error seeding database:', error)
    return NextResponse.json(
      { error: 'Failed to seed database' },
      { status: 500 }
    )
  }
}
