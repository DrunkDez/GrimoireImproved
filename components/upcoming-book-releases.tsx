"use client"

import { useState, useEffect } from 'react'
import { MarkdownRenderer } from '@/components/ui/markdown-renderer'
import { BookOpen, ExternalLink } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Image from 'next/image'

interface BookRelease {
  id: string
  title: string
  publisher: string | null
  description: string
  releaseDate: string | null
  status: string
  coverImageUrl: string | null
  purchaseUrl: string | null
  announcementUrl: string | null
}

export function UpcomingBookReleases() {
  const [releases, setReleases] = useState<BookRelease[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchReleases()
  }, [])

  const fetchReleases = async () => {
    try {
      const response = await fetch('/api/book-releases?limit=3')
      if (response.ok) {
        const data = await response.json()
        setReleases(data)
      }
    } catch (error) {
      console.error('Error fetching book releases:', error)
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading || releases.length === 0) {
    return null
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Announced': return 'bg-blue-100 text-blue-800 border-blue-300'
      case 'Pre-order': return 'bg-purple-100 text-purple-800 border-purple-300'
      case 'Released': return 'bg-green-100 text-green-800 border-green-300'
      case 'Delayed': return 'bg-red-100 text-red-800 border-red-300'
      default: return 'bg-gray-100 text-gray-800 border-gray-300'
    }
  }

  return (
    <div className="bg-card border-2 border-primary rounded-lg p-4 sm:p-6 space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <BookOpen className="w-5 h-5 text-primary" />
        <h3 className="font-serif font-bold text-primary uppercase tracking-wider">
          Upcoming Releases
        </h3>
      </div>

      <div className="space-y-4">
        {releases.map((release) => (
          <div
            key={release.id}
            className="border-2 border-primary/20 rounded-md p-4 hover:border-primary/40 transition-colors"
          >
            <div className="flex gap-4">
              {/* Cover Image */}
              {release.coverImageUrl && (
                <div className="flex-shrink-0">
                  <div className="relative w-16 h-24 sm:w-20 sm:h-28 rounded overflow-hidden border border-primary/20">
                    <Image
                      src={release.coverImageUrl}
                      alt={release.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                </div>
              )}

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start gap-2 mb-2 flex-wrap">
                  <h4 className="font-semibold text-foreground">{release.title}</h4>
                  <span className={`text-xs px-2 py-0.5 rounded-full border ${getStatusColor(release.status)}`}>
                    {release.status}
                  </span>
                </div>

                {release.publisher && (
                  <p className="text-sm text-muted-foreground mb-2">
                    {release.publisher}
                  </p>
                )}

                {release.releaseDate && (
                  <p className="text-xs text-muted-foreground mb-2">
                    Expected: {new Date(release.releaseDate).toLocaleDateString('en-GB', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric'
                    })}
                  </p>
                )}

                <div className="prose prose-sm dark:prose-invert max-w-none mb-3">
                  <MarkdownRenderer content={release.description.length > 150 
                    ? release.description.substring(0, 150) + '...' 
                    : release.description} 
                  />
                </div>

                {/* Links */}
                <div className="flex gap-2 flex-wrap">
                  {release.purchaseUrl && (
                    <Button
                      variant="outline"
                      size="sm"
                      asChild
                      className="gap-1"
                    >
                      <a href={release.purchaseUrl} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="w-3 h-3" />
                        {release.status === 'Pre-order' ? 'Pre-order' : 'Purchase'}
                      </a>
                    </Button>
                  )}
                  {release.announcementUrl && (
                    <Button
                      variant="ghost"
                      size="sm"
                      asChild
                      className="gap-1"
                    >
                      <a href={release.announcementUrl} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="w-3 h-3" />
                        Learn More
                      </a>
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
