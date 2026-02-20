import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// GET - Fetch all expanded content as key-value pairs
export async function GET() {
  try {
    const settings = await prisma.siteSettings.findMany({
      where: {
        key: {
          startsWith: 'guide_expanded_'
        }
      }
    })

    // Convert to simple object
    const content: { [key: string]: string } = {}
    settings.forEach(setting => {
      const key = setting.key.replace('guide_expanded_', '')
      content[key] = setting.value
    })

    return NextResponse.json(content)
  } catch (error) {
    console.error('Error fetching expanded content:', error)
    return NextResponse.json({}, { status: 200 }) // Return empty object on error
  }
}

// PUT - Update expanded content
export async function PUT(request: Request) {
  try {
    const body = await request.json()
    const { step, content } = body

    if (!step || content === undefined) {
      return NextResponse.json(
        { error: 'Step and content required' },
        { status: 400 }
      )
    }

    const key = `guide_expanded_${step}`

    // Upsert the setting
    const setting = await prisma.siteSettings.upsert({
      where: { key },
      update: { value: content },
      create: { key, value: content }
    })

    return NextResponse.json(setting)
  } catch (error) {
    console.error('Error updating expanded content:', error)
    return NextResponse.json(
      { error: 'Failed to update content' },
      { status: 500 }
    )
  }
}
