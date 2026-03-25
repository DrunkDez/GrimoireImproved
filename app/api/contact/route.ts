import { NextRequest, NextResponse } from 'next/server'
import { sendContactEmail } from '@/lib/email'

// ⚙️ EDIT THIS EMAIL ADDRESS ⚙️
// This is where contact form submissions will be sent
const CONTACT_EMAIL = 'your-email@gmail.com'  // ← CHANGE THIS!

// POST /api/contact - Send contact form email
export async function POST(request: NextRequest) {
  try {
    const { name, email, subject, message } = await request.json()

    // Validate required fields
    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      )
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email address' },
        { status: 400 }
      )
    }

    // Send email
    const emailResult = await sendContactEmail({
      to: CONTACT_EMAIL,
      name,
      email,
      subject,
      message,
    })

    if (!emailResult.success) {
      console.error('Failed to send contact email:', emailResult.error)
      return NextResponse.json(
        { error: 'Failed to send message. Please try again.' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      message: 'Message sent successfully'
    })
  } catch (error) {
    console.error('Error in contact form:', error)
    return NextResponse.json(
      { error: 'Failed to process request' },
      { status: 500 }
    )
  }
}
