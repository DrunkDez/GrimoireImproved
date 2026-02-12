import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db"

export async function GET() {
  try {
    const resources = await prisma.resource.findMany({
      orderBy: [
        { featured: 'desc' },
        { type: 'asc' },
        { name: 'asc' }
      ]
    })
    return NextResponse.json(resources)
  } catch (error) {
    console.error("Error fetching resources:", error)
    return NextResponse.json(
      { error: "Failed to fetch resources" },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, type, category, description, url, author, imageUrl, featured } = body

    if (!name || !type || !description) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      )
    }

    const resource = await prisma.resource.create({
      data: {
        name,
        type,
        category: category || null,
        description,
        url: url || null,
        author: author || null,
        imageUrl: imageUrl || null,
        featured: featured || false,
      },
    })

    return NextResponse.json(resource, { status: 201 })
  } catch (error) {
    console.error("Error creating resource:", error)
    return NextResponse.json(
      { error: "Failed to create resource" },
      { status: 500 }
    )
  }
}
