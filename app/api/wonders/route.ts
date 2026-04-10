import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

// GET /api/wonders - Get all wonders
export async function GET() {
  try {
    const wonders = await prisma.wonder.findMany({
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
    return NextResponse.json(wonders)
  } catch (error) {
    console.error('Error fetching wonders:', error)
    return NextResponse.json(
      { error: 'Failed to fetch wonders' },
      { status: 500 }
    )
  }
}

// POST /api/wonders - Create a new wonder
export async function POST(request: NextRequest) {
  try {
    // 🔒 SECURITY: Require authentication
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized: You must be logged in to create wonders' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { 
      name, 
      category, 
      description, 
      backgroundCost,
      arete,
      quintessence,
      spheres, 
      pageRef 
    } = body

    // Validate required fields
    if (!name || !category || !description) {
      return NextResponse.json(
        { error: 'Name, category, and description are required' },
        { status: 400 }
      )
    }

    // Validate category
    const validCategories = [
      'Artifact/Invention',
      'Charm/Gadget',
      'Talisman/Device',
      'Fetish',
      'Grimoire/Principia',
      'Primer',
      'Periapt/Matrix'
    ]
    
    if (!validCategories.includes(category)) {
      return NextResponse.json(
        { error: `Invalid category. Must be one of: ${validCategories.join(', ')}` },
        { status: 400 }
      )
    }

    // Validate arete (if provided)
    if (arete !== null && arete !== undefined) {
      if (typeof arete !== 'number' || arete < 1 || arete > 10) {
        return NextResponse.json(
          { error: 'Arete must be a number between 1 and 10' },
          { status: 400 }
        )
      }
    }

    // Validate quintessence (if provided)
    if (quintessence !== null && quintessence !== undefined) {
      if (typeof quintessence !== 'number' || quintessence < 0) {
        return NextResponse.json(
          { error: 'Quintessence must be a non-negative number' },
          { status: 400 }
        )
      }
    }

    // Validate spheres object structure (if provided)
    if (spheres !== null && spheres !== undefined) {
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
    }

    const wonder = await prisma.wonder.create({
      data: {
        name,
        category,
        description,
        backgroundCost: backgroundCost || null,
        arete: arete || null,
        quintessence: quintessence || null,
        spheres,
        pageRef: pageRef || null,
        userId: session.user.id,
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

    return NextResponse.json(wonder, { status: 201 })
  } catch (error) {
    console.error('Error creating wonder:', error)
    return NextResponse.json(
      { error: 'Failed to create wonder' },
      { status: 500 }
    )
  }
}