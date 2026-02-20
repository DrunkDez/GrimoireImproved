import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// GET - Fetch mage groups
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const publishedOnly = searchParams.get('published') === 'true'
    const category = searchParams.get('category')

    const where: any = {}
    if (publishedOnly) where.published = true
    if (category) where.category = category

    const groups = await prisma.mageGroup.findMany({
      where,
      orderBy: [
        { category: 'asc' },
        { sortOrder: 'asc' },
        { name: 'asc' }
      ]
    })

    return NextResponse.json(groups)
  } catch (error) {
    console.error('Error fetching mage groups:', error)
    return NextResponse.json(
      { error: 'Failed to fetch mage groups' },
      { status: 500 }
    )
  }
}

// POST - Create new mage group
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const {
      name,
      slug,
      category,
      description,
      philosophy,
      practices,
      organization,
      headerImage,
      sidebarImage,
      published,
      sortOrder
    } = body

    const group = await prisma.mageGroup.create({
      data: {
        name,
        slug,
        category,
        description,
        philosophy,
        practices,
        organization,
        symbolImage: body.sidebarImage,
        logoImage: body.headerImage,
        representativeImage: body.headerImage,
        published: published || false,
        sortOrder: sortOrder || 0
      }
    })

    return NextResponse.json(group)
  } catch (error) {
    console.error('Error creating mage group:', error)
    return NextResponse.json(
      { error: 'Failed to create mage group' },
      { status: 500 }
    )
  }
}

// PUT - Update mage group
export async function PUT(request: Request) {
  try {
    const body = await request.json()
    const { id, ...data } = body

    if (!id) {
      return NextResponse.json(
        { error: 'ID required' },
        { status: 400 }
      )
    }

    const group = await prisma.mageGroup.update({
      where: { id },
      data
    })

    return NextResponse.json(group)
  } catch (error) {
    console.error('Error updating mage group:', error)
    return NextResponse.json(
      { error: 'Failed to update mage group' },
      { status: 500 }
    )
  }
}

// DELETE - Delete mage group
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json(
        { error: 'ID required' },
        { status: 400 }
      )
    }

    await prisma.mageGroup.delete({
      where: { id }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting mage group:', error)
    return NextResponse.json(
      { error: 'Failed to delete mage group' },
      { status: 500 }
    )
  }
}
