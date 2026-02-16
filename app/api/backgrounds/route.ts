import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

// GET /api/backgrounds - Get all backgrounds
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const subtype = searchParams.get('subtype')

    const where: any = {}
    if (subtype) {
      where.subtype = subtype
    }

    const backgrounds = await prisma.background.findMany({
      where,
      orderBy: {
        name: 'asc',
      },
    })

    return NextResponse.json(backgrounds)
  } catch (error) {
    console.error('Error fetching backgrounds:', error)
    return NextResponse.json(
      { error: 'Failed to fetch backgrounds' },
      { status: 500 }
    )
  }
}

// POST /api/backgrounds - Create a new background
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, category, subtype, cost, description, pageRef } = body

    const background = await prisma.background.create({
      data: {
        name,
        category,
        subtype,
        cost,
        description,
        pageRef: pageRef || null,
      },
    })

    return NextResponse.json(background)
  } catch (error: any) {
    console.error('Error creating background:', error)
    
    // Check for unique constraint error (duplicate)
    if (error.code === 'P2002') {
      return NextResponse.json(
        { error: 'Background already exists' },
        { status: 409 }
      )
    }
    
    return NextResponse.json(
      { error: 'Failed to create background' },
      { status: 500 }
    )
  }
}
