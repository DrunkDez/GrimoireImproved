import { Metadata } from 'next'
import RotePageClient from './client'

interface PageProps {
  params: { id: string }
}

// Helper to format spheres for display
function formatSpheresForMeta(spheres: any): string {
  const firstCombo = Array.isArray(spheres) ? spheres[0] : spheres
  
  if (!firstCombo || typeof firstCombo !== 'object') return ''
  
  return Object.entries(firstCombo)
    .map(([sphere, level]) => `${sphere} ${level}`)
    .join(' • ')
}

// Generate metadata for SEO and social sharing
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  try {
    // Use a consistent base URL
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 
                    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000')
    
    // Add a timeout to prevent hanging
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 5000) // 5 second timeout

    try {
      const response = await fetch(`${baseUrl}/api/rotes/${params.id}`, {
        signal: controller.signal,
        cache: 'no-store',
        // Add headers to identify server-side request
        headers: {
          'Content-Type': 'application/json',
        },
      })

      clearTimeout(timeoutId)

      if (!response.ok) {
        // Return default metadata instead of throwing
        return {
          title: 'Rote Not Found | The Paradox Wheel',
          description: 'This rote could not be found in the grimoire.',
        }
      }

      const rote = await response.json()

      // Format spheres for description
      const spheresText = formatSpheresForMeta(rote.spheres)
      
      // Create description (limit to 160 chars for SEO)
      const description = rote.description.length > 157
        ? rote.description.substring(0, 157) + '...'
        : rote.description

      // Create full description for Open Graph (can be longer)
      const ogDescription = `${rote.tradition} • ${rote.level}${spheresText ? ` • ${spheresText}` : ''}\n\n${description}`

      const url = `${baseUrl}/rotes/${params.id}`

      return {
        title: `${rote.name} | The Paradox Wheel`,
        description: description,
        
        // Open Graph (Facebook, LinkedIn, Discord)
        openGraph: {
          title: rote.name,
          description: ogDescription,
          url: url,
          siteName: 'The Paradox Wheel',
          type: 'article',
          locale: 'en_US',
          images: [
            {
              url: `${baseUrl}/og-image.png`,
              width: 1200,
              height: 630,
              alt: `${rote.name} - ${rote.tradition}`,
            },
          ],
        },

        // Twitter Card
        twitter: {
          card: 'summary_large_image',
          title: rote.name,
          description: ogDescription,
          images: [`${baseUrl}/og-image.png`],
        },

        // Additional SEO
        keywords: [
          'Mage the Ascension',
          rote.tradition,
          rote.level,
          'rote',
          'World of Darkness',
          ...Object.keys(Array.isArray(rote.spheres) ? rote.spheres[0] : rote.spheres),
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
    } catch (fetchError) {
      clearTimeout(timeoutId)
      console.error('Fetch error in generateMetadata:', fetchError)
      throw fetchError
    }
  } catch (error) {
    console.error('Error generating metadata:', error)
    // Return safe fallback metadata
    return {
      title: 'Rote | The Paradox Wheel',
      description: 'Explore rotes from Mage: The Ascension',
    }
  }
}

// Server component that passes data to client component
export default async function RotePage({ params }: PageProps) {
  return <RotePageClient id={params.id} />
}
