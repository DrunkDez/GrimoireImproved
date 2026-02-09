import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

// GET /api/rotes - Get all rotes
export async function GET() {
  try {
    const rotes = await prisma.rote.findMany({
      orderBy: { createdAt: 'desc' },
    })
    return NextResponse.json(rotes)
  } catch (error) {
    console.error('Error fetching rotes:', error)
    return NextResponse.json(
      { error: 'Failed to fetch rotes' },
      { status: 500 }
    )
  }
}

// POST /api/rotes - Create a new rote
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, tradition, description, spheres, level, pageRef } = body

    // Validate required fields
    if (!name || !tradition || !description || !spheres || !level) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const rote = await prisma.rote.create({
      data: {
        name,
        tradition,
        description,
        spheres,
        level,
        pageRef: pageRef || null,
      },
    })

    return NextResponse.json(rote, { status: 201 })
  } catch (error) {
    console.error('Error creating rote:', error)
    return NextResponse.json(
      { error: 'Failed to create rote' },
      { status: 500 }
    )
  }
}
