import { Metadata } from 'next'
import BrowsePageClient from './client'

export const metadata: Metadata = {
  title: 'Browse Rotes | The Paradox Wheel',
  description: 'Explore the complete grimoire of Mage: The Ascension rotes. Search by tradition, sphere, or level. Discover magickal effects from all Nine Traditions, Technocracy, and beyond.',
  
  // Open Graph
  openGraph: {
    title: 'Browse Rotes | The Paradox Wheel',
    description: 'Explore the complete grimoire of Mage: The Ascension rotes from all Nine Traditions, Technocracy, and beyond.',
    url: 'https://the-paradox-wheel.com/browse',
    siteName: 'The Paradox Wheel',
    type: 'website',
    locale: 'en_US',
    images: [
      {
        url: 'https://the-paradox-wheel.com/og-image.png',
        width: 1200,
        height: 630,
        alt: 'The Paradox Wheel - Mage: The Ascension Grimoire',
      },
    ],
  },

  // Twitter Card
  twitter: {
    card: 'summary_large_image',
    title: 'Browse Rotes | The Paradox Wheel',
    description: 'Explore the complete grimoire of Mage: The Ascension rotes from all Nine Traditions.',
    images: ['https://the-paradox-wheel.com/og-image.png'],
  },

  // Keywords
  keywords: [
    'Mage the Ascension',
    'rotes',
    'grimoire',
    'Nine Traditions',
    'Technocracy',
    'World of Darkness',
    'spheres',
    'magick',
    'character creation',
  ],

  // Canonical URL
  alternates: {
    canonical: 'https://the-paradox-wheel.com/browse',
  },

  // Robot instructions
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
}

export default function BrowsePage() {
  return <BrowsePageClient />
}
