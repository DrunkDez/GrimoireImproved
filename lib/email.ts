import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function sendPasswordResetEmail(email: string, resetToken: string) {
  const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL}/auth/reset-password?token=${resetToken}`

  try {
    const { data, error } = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL || 'The Paradox Wheel <noreply@paradox-wheel.com>',
      to: email,
      subject: 'Reset Your Password - The Paradox Wheel',
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <style>
              body {
                font-family: 'Georgia', serif;
                background-color: #f5f1e8;
                color: #4a1a1a;
                margin: 0;
                padding: 0;
              }
              .container {
                max-width: 600px;
                margin: 40px auto;
                background: #ffffff;
                border: 3px solid #8b6b2b;
                border-radius: 8px;
                overflow: hidden;
              }
              .header {
                background: linear-gradient(135deg, #6b2a6b 0%, #4a1a4a 100%);
                color: #c9a961;
                padding: 30px;
                text-align: center;
              }
              .header h1 {
                margin: 0;
                font-size: 28px;
                text-transform: uppercase;
                letter-spacing: 2px;
              }
              .gear {
                font-size: 40px;
                display: inline-block;
                margin: 10px 0;
              }
              .content {
                padding: 40px;
              }
              .content p {
                line-height: 1.6;
                margin: 0 0 20px 0;
              }
              .button {
                display: inline-block;
                padding: 15px 30px;
                background: #8b6b2b;
                color: #ffffff !important;
                text-decoration: none;
                border-radius: 4px;
                font-weight: bold;
                text-transform: uppercase;
                letter-spacing: 1px;
                margin: 20px 0;
              }
              .button:hover {
                background: #c9a961;
              }
              .footer {
                background: #f5f1e8;
                padding: 20px;
                text-align: center;
                font-size: 12px;
                color: #666;
                border-top: 2px solid #8b6b2b;
              }
              .warning {
                background: #fff5e6;
                border-left: 4px solid #c9a961;
                padding: 15px;
                margin: 20px 0;
              }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <div class="gear">⚙</div>
                <h1>The Paradox Wheel</h1>
              </div>
              
              <div class="content">
                <p><strong>Greetings, Awakened One,</strong></p>
                
                <p>We received a request to reset the password for your account. If you made this request, click the button below to set a new password:</p>
                
                <center>
                  <a href="${resetUrl}" class="button">Reset Password</a>
                </center>
                
                <div class="warning">
                  <p style="margin: 0;"><strong>⚠️ Important:</strong></p>
                  <p style="margin: 10px 0 0 0;">This link will expire in <strong>1 hour</strong>. If you didn't request a password reset, you can safely ignore this email.</p>
                </div>
                
                <p>If the button doesn't work, copy and paste this link into your browser:</p>
                <p style="word-break: break-all; color: #666; font-size: 12px;">${resetUrl}</p>
              </div>
              
              <div class="footer">
                <p>The Paradox Wheel - Where Reality Bends</p>
                <p>This is an automated email. Please do not reply.</p>
              </div>
            </div>
          </body>
        </html>
      `,
    })

    if (error) {
      console.error('Error sending password reset email:', error)
      return { success: false, error }
    }

    return { success: true, data }
  } catch (error) {
    console.error('Error sending password reset email:', error)
    return { success: false, error }
  }
}

export async function sendContactEmail({
  to,
  name,
  email,
  subject,
  message,
}: {
  to: string
  name: string
  email: string
  subject: string
  message: string
}) {
  try {
    const { data, error } = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL || 'The Paradox Wheel <noreply@paradox-wheel.com>',
      to: to,
      replyTo: email, // Allows you to reply directly to the sender
      subject: `Contact Form: ${subject}`,
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <style>
              body {
                font-family: 'Georgia', serif;
                background-color: #f5f1e8;
                color: #4a1a1a;
                margin: 0;
                padding: 0;
              }
              .container {
                max-width: 600px;
                margin: 40px auto;
                background: #ffffff;
                border: 3px solid #8b6b2b;
                border-radius: 8px;
                overflow: hidden;
              }
              .header {
                background: linear-gradient(135deg, #6b2a6b 0%, #4a1a4a 100%);
                color: #c9a961;
                padding: 30px;
                text-align: center;
              }
              .header h1 {
                margin: 0;
                font-size: 28px;
                text-transform: uppercase;
                letter-spacing: 2px;
              }
              .gear {
                font-size: 40px;
                display: inline-block;
                margin: 10px 0;
              }
              .content {
                padding: 40px;
              }
              .content p {
                line-height: 1.6;
                margin: 0 0 15px 0;
              }
              .info-box {
                background: #f5f1e8;
                border-left: 4px solid #8b6b2b;
                padding: 15px;
                margin: 20px 0;
              }
              .message-box {
                background: #fff5e6;
                border: 2px solid #c9a961;
                padding: 20px;
                margin: 20px 0;
                border-radius: 4px;
              }
              .footer {
                background: #f5f1e8;
                padding: 20px;
                text-align: center;
                font-size: 12px;
                color: #666;
                border-top: 2px solid #8b6b2b;
              }
              .label {
                font-weight: bold;
                color: #8b6b2b;
              }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <div class="gear">⚙</div>
                <h1>The Paradox Wheel</h1>
                <p style="margin: 10px 0 0 0; font-size: 14px;">New Contact Form Submission</p>
              </div>
              
              <div class="content">
                <p><strong>You've received a new message from your website contact form!</strong></p>
                
                <div class="info-box">
                  <p style="margin: 0 0 10px 0;"><span class="label">From:</span> ${name}</p>
                  <p style="margin: 0 0 10px 0;"><span class="label">Email:</span> ${email}</p>
                  <p style="margin: 0;"><span class="label">Subject:</span> ${subject}</p>
                </div>
                
                <p><span class="label">Message:</span></p>
                <div class="message-box">
                  <p style="white-space: pre-wrap; margin: 0;">${message}</p>
                </div>
                
                <p style="font-size: 14px; color: #666; margin-top: 30px;">
                  💡 <strong>Tip:</strong> Click "Reply" in your email client to respond directly to ${email}
                </p>
              </div>
              
              <div class="footer">
                <p>The Paradox Wheel - Contact Form Notification</p>
                <p>This email was sent from your website's contact form</p>
              </div>
            </div>
          </body>
        </html>
      `,
    })

    if (error) {
      console.error('Error sending contact email:', error)
      return { success: false, error }
    }

    return { success: true, data }
  } catch (error) {
    console.error('Error sending contact email:', error)
    return { success: false, error }
  }
}
