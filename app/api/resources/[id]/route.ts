import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db"

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
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
  { params }: { params: { id: string } }
) {
  try {
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
  { params }: { params: { id: string } }
) {
  try {
    await prisma.resource.delete({
      where: { id: params.id },
    })

    return NextResponse.json({ message: "Resource deleted successfully" })
  } catch (error) {
    console.error("Error deleting resource:", error)
    return NextResponse.json(
      { error: "Failed to delete resource" },
      { status: 500 }
    )
  }
}
