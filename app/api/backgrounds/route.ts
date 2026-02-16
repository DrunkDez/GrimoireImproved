import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

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
        pageRef,
      },
    })

    return NextResponse.json(background)
  } catch (error) {
    console.error('Error creating background:', error)
    return NextResponse.json(
      { error: 'Failed to create background' },
      { status: 500 }
    )
  }
}
