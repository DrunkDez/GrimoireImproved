import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db"

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
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
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const { name, category, type, cost, description, pageRef } = body

    const merit = await prisma.merit.update({
      where: { id: params.id },
      data: {
        name,
        category,
        type,
        cost: parseInt(cost),
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
  { params }: { params: { id: string } }
) {
  try {
    await prisma.merit.delete({
      where: { id: params.id },
    })

    return NextResponse.json({ message: "Merit deleted successfully" })
  } catch (error) {
    console.error("Error deleting merit:", error)
    return NextResponse.json(
      { error: "Failed to delete merit" },
      { status: 500 }
    )
  }
}
