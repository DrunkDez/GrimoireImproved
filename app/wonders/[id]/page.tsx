import { Metadata } from 'next'
import WonderPageClient from './client'

interface PageProps {
  params: { id: string }
}

// Helper to format spheres for display
function formatSpheresForMeta(spheres: any): string {
  if (!spheres || typeof spheres !== 'object') return ''
  
  return Object.entries(spheres)
    .map(([sphere, level]) => `${sphere} ${level}`)
    .join(' • ')
}

// Generate metadata for SEO and social sharing
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  try {
    // Use different URLs for server-side fetching vs. public URLs
    const publicUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://the-paradox-wheel.com'
    
    // For server-side API calls, use internal URL
    const apiBaseUrl = process.env.VERCEL_URL 
      ? `https://${process.env.VERCEL_URL}`
      : process.env.NEXTAUTH_URL || 'http://localhost:3000'
    
    const response = await fetch(`${apiBaseUrl}/api/wonders/${params.id}`, {
      cache: 'no-store',
    })

    if (!response.ok) {
      return {
        title: 'Wonder Not Found | The Paradox Wheel',
        description: 'This wonder could not be found in the grimoire.',
      }
    }

    const wonder = await response.json()

    // Format details for description
    const spheresText = formatSpheresForMeta(wonder.spheres)
    const areteText = wonder.arete ? `Arete ${wonder.arete}` : ''
    const bgCostText = wonder.backgroundCost ? `Background ${wonder.backgroundCost}` : ''
    
    // Create description (limit to 160 chars for SEO)
    const description = wonder.description.length > 157
      ? wonder.description.substring(0, 157) + '...'
      : wonder.description

    // Create full description for Open Graph (can be longer)
    const details = [wonder.category, areteText, bgCostText, spheresText].filter(Boolean).join(' • ')
    const ogDescription = `${details}\n\n${description}`

    const url = `${publicUrl}/wonders/${params.id}`

    return {
      title: `${wonder.name} | The Paradox Wheel`,
      description: description,
      
      // Open Graph (Facebook, LinkedIn, Discord)
      openGraph: {
        title: wonder.name,
        description: ogDescription,
        url: url,
        siteName: 'The Paradox Wheel',
        type: 'article',
        locale: 'en_US',
        images: [
          {
            url: `${publicUrl}/og-image.png`,
            width: 1200,
            height: 630,
            alt: `${wonder.name} - ${wonder.category}`,
          },
        ],
      },

      // Twitter Card
      twitter: {
        card: 'summary_large_image',
        title: wonder.name,
        description: ogDescription,
        images: [`${publicUrl}/og-image.png`],
      },

      // Additional SEO
      keywords: [
        'Mage the Ascension',
        wonder.category,
        'wonder',
        'magickal item',
        'World of Darkness',
        ...(wonder.spheres ? Object.keys(wonder.spheres) : []),
      ],

      // Canonical URL
      alternates: {
        canonical: url,
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
  } catch (error) {
    console.error('Error generating metadata:', error)
    return {
      title: 'Wonder | The Paradox Wheel',
      description: 'Explore magickal wonders from Mage: The Ascension',
    }
  }
}

// Server component that passes data to client component
export default async function WonderPage({ params }: PageProps) {
  return <WonderPageClient id={params.id} />
}