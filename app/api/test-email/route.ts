import { NextResponse } from 'next/server'
import { Resend } from 'resend'

// Simple test route to verify Resend is working
export async function GET() {
  try {
    const resend = new Resend(process.env.RESEND_API_KEY)
    
    const { data, error } = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL || 'The Paradox Wheel <noreply@the-paradox-wheel.com>',
      to: 'paradoxwheel@gmail.com', // Your email
      subject: 'Test Email',
      html: '<p>If you see this, Resend is working!</p>',
    })

    if (error) {
      console.error('Resend error:', error)
      return NextResponse.json({ 
        success: false, 
        error: error,
        apiKey: process.env.RESEND_API_KEY ? 'Set' : 'Missing',
        fromEmail: process.env.RESEND_FROM_EMAIL || 'Missing'
      })
    }

    return NextResponse.json({ 
      success: true, 
      data,
      apiKey: 'Set',
      fromEmail: process.env.RESEND_FROM_EMAIL
    })
  } catch (error: any) {
    return NextResponse.json({ 
      success: false, 
      error: error.message,
      stack: error.stack
    })
  }
}
