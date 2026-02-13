import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db"

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const params = await context.params
    const resource = await prisma.resource.findUnique({
      where: { id: params.id },
    })

    if (!resource) {
      return NextResponse.json(
        { error: "Resource not found" },
        { status: 404 }
      )
    }

    return NextResponse.json(resource)
  } catch (error) {
    console.error("Error fetching resource:", error)
    return NextResponse.json(
      { error: "Failed to fetch resource" },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const params = await context.params
    const body = await request.json()
    const { name, type, category, description, url, author, imageUrl, featured } = body

    const resource = await prisma.resource.update({
      where: { id: params.id },
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

    return NextResponse.json(resource)
  } catch (error) {
    console.error("Error updating resource:", error)
    return NextResponse.json(
      { error: "Failed to update resource" },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const params = await context.params
    console.log('Attempting to delete resource with ID:', params.id)
    
    await prisma.resource.delete({
      where: { id: params.id },
    })

    console.log('Resource deleted successfully:', params.id)
    return NextResponse.json({ message: "Resource deleted successfully" })
  } catch (error) {
    console.error("Error deleting resource:", error)
    console.error("Error details:", JSON.stringify(error, null, 2))
    return NextResponse.json(
      { error: "Failed to delete resource", details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
