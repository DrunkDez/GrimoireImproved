import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

// GET /api/rotes - Get all rotes
export async function GET() {
  try {
    const rotes = await prisma.rote.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          }
        }
      }
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
    // 🔒 SECURITY FIX: Require authentication
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized: You must be logged in to create rotes' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { name, tradition, description, spheres, level, pageRef } = body

    // Validate required fields
    if (!name || !tradition || !description || !spheres || !level) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // 🔒 SECURITY FIX: Validate spheres object structure
    if (typeof spheres !== 'object' || Array.isArray(spheres)) {
      return NextResponse.json(
        { error: 'Spheres must be an object' },
        { status: 400 }
      )
    }

    // Validate sphere values
    const validSpheres = ['Correspondence', 'Entropy', 'Forces', 'Life', 'Matter', 'Mind', 'Prime', 'Spirit', 'Time']
    for (const [sphere, level] of Object.entries(spheres)) {
      if (!validSpheres.includes(sphere)) {
        return NextResponse.json(
          { error: `Invalid sphere: ${sphere}` },
          { status: 400 }
        )
      }
      if (typeof level !== 'number' || level < 1 || level > 5) {
        return NextResponse.json(
          { error: `Invalid level for ${sphere}: must be 1-5` },
          { status: 400 }
        )
      }
    }

    const rote = await prisma.rote.create({
      data: {
        name,
        tradition,
        description,
        spheres,
        level,
        pageRef: pageRef || null,
        userId: session.user.id, // 🔒 Always set userId
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          }
        }
      }
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
