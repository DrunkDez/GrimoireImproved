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
  title: 'The Paradox Wheel | Mage: The Ascension',
  description:
    'Your comprehensive digital grimoire for Mage: The Ascension. Navigate the Spheres, browse rotes from the Nine Traditions, Technocracy, and beyond. Where Reality Bends.',
  keywords: ['Mage the Ascension', 'Paradox Wheel', 'World of Darkness', 'rotes', 'traditions', 'spheres', 'Technocracy', 'character creation'],
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
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider>{children}</AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
