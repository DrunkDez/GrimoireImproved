import React from "react"
import type { Metadata } from 'next'
import { Cinzel, Crimson_Text, IM_Fell_DW_Pica } from 'next/font/google'
import { AuthProvider } from '@/components/auth/auth-provider'
import { ThemeProvider } from '@/components/theme-provider'

import './globals.css'

const cinzel = Cinzel({
  subsets: ['latin'],
  variable: '--font-cinzel',
  weight: ['400', '500', '600', '700', '900'],
})

const crimsonText = Crimson_Text({
  subsets: ['latin'],
  variable: '--font-crimson',
  weight: ['400', '600', '700'],
  style: ['normal', 'italic'],
})

const imFell = IM_Fell_DW_Pica({
  subsets: ['latin'],
  variable: '--font-im-fell',
  weight: ['400'],
  style: ['normal', 'italic'],
})

export const metadata: Metadata = {
  title: 'The Enlightened Grimoire | Mage: The Ascension Rote Library',
  description:
    'A curated compendium of mystical Rotes from the Nine Traditions and beyond. Browse, search, and contribute to the collective arcane knowledge.',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${cinzel.variable} ${crimsonText.variable} ${imFell.variable} font-sans antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange={false}
        >
          <AuthProvider>{children}</AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
