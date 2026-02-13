import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db"

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const params = await context.params
    const merit = await prisma.merit.findUnique({
      where: { id: params.id },
    })

    if (!merit) {
      return NextResponse.json(
        { error: "Merit not found" },
        { status: 404 }
      )
    }

    return NextResponse.json(merit)
  } catch (error) {
    console.error("Error fetching merit:", error)
    return NextResponse.json(
      { error: "Failed to fetch merit" },
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
    const { name, category, type, subtype, cost, description, pageRef } = body

    const merit = await prisma.merit.update({
      where: { id: params.id },
      data: {
        name,
        category,
        type,
        subtype: subtype || null,
        cost,
        description,
        pageRef: pageRef || null,
      },
    })

    return NextResponse.json(merit)
  } catch (error) {
    console.error("Error updating merit:", error)
    return NextResponse.json(
      { error: "Failed to update merit" },
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
    console.log('Attempting to delete merit with ID:', params.id)
    
    await prisma.merit.delete({
      where: { id: params.id },
    })

    console.log('Merit deleted successfully:', params.id)
    return NextResponse.json({ message: "Merit deleted successfully" })
  } catch (error) {
    console.error("Error deleting merit:", error)
    console.error("Error details:", JSON.stringify(error, null, 2))
    return NextResponse.json(
      { error: "Failed to delete merit", details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
