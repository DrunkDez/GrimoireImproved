"use client"

import { useState, useEffect } from 'react'
import { MarkdownRenderer } from '@/components/ui/markdown-renderer'
import { Megaphone, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

interface SiteUpdate {
  id: string
  title: string
  description: string
  category: string
  date: string
}

// Only show these categories in the banner
const BANNER_CATEGORIES = ['Announcement', 'Feature', 'Improvement']

export function LatestUpdateBanner() {
  const [update, setUpdate] = useState<SiteUpdate | null>(null)
  const [isDismissed, setIsDismissed] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchLatestUpdate()
  }, [])

  const fetchLatestUpdate = async () => {
    try {
      // Fetch the latest banner-worthy update (limit to 1, filter by category)
      const response = await fetch('/api/site-updates?limit=5')
      if (response.ok) {
        const updates = await response.json()
        // Find the first published update that belongs to allowed banner categories
        const bannerUpdate = (Array.isArray(updates) ? updates : []).find(
          (u: SiteUpdate) => BANNER_CATEGORIES.includes(u.category)
        )
        setUpdate(bannerUpdate || null)
        
        // Check if user has dismissed this update
        if (bannerUpdate) {
          const dismissedId = localStorage.getItem('dismissedUpdate')
          if (dismissedId === bannerUpdate.id) {
            setIsDismissed(true)
          }
        }
      }
    } catch (error) {
      console.error('Error fetching latest update:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDismiss = () => {
    if (update) {
      localStorage.setItem('dismissedUpdate', update.id)
      setIsDismissed(true)
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const day = date.getDate().toString().padStart(2, '0')
    const month = (date.getMonth() + 1).toString().padStart(2, '0')
    const year = date.getFullYear().toString().slice(-2)
    return `${day}/${month}/${year}`
  }

  // Strip HTML/markdown and get plain text preview
  const getPlainTextPreview = (markdown: string, maxLength = 150) => {
    // Very simple stripping – remove markdown links and images
    let text = markdown
      .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // links become text
      .replace(/!\[[^\]]*\]\([^)]+\)/g, '') // images removed
      .replace(/[#*_`~>]/g, '') // basic markdown chars
      .replace(/\s+/g, ' ') // normalize whitespace
      .trim()
    if (text.length > maxLength) {
      text = text.slice(0, maxLength) + '...'
    }
    return text
  }

  if (isLoading || !update || isDismissed) {
    return null
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Feature': return 'bg-green-100 text-green-800 border-green-300'
      case 'Bug Fix': return 'bg-red-100 text-red-800 border-red-300'
      case 'Content': return 'bg-blue-100 text-blue-800 border-blue-300'
      case 'Improvement': return 'bg-purple-100 text-purple-800 border-purple-300'
      case 'Announcement': return 'bg-yellow-100 text-yellow-800 border-yellow-300'
      default: return 'bg-gray-100 text-gray-800 border-gray-300'
    }
  }

  const previewText = getPlainTextPreview(update.description)

  return (
    <div className="bg-accent/10 border-2 border-accent rounded-lg p-4 sm:p-6 mb-6 relative">
      <Button
        variant="ghost"
        size="sm"
        onClick={handleDismiss}
        className="absolute top-2 right-2"
        title="Dismiss"
      >
        <X className="w-4 h-4" />
      </Button>

      <div className="pr-8">
        <div className="flex items-center gap-2 mb-3 flex-wrap">
          <Megaphone className="w-5 h-5 text-accent" />
          <h3 className="font-serif font-bold text-primary uppercase tracking-wider">
            Latest Update
          </h3>
          <span className={`text-xs px-2 py-0.5 rounded-full border ${getCategoryColor(update.category)}`}>
            {update.category}
          </span>
          <span className="text-xs text-muted-foreground ml-auto">
            {formatDate(update.date)}
          </span>
        </div>

        <h4 className="font-semibold text-foreground mb-2">{update.title}</h4>
        
        <p className="text-sm text-muted-foreground">{previewText}</p>
        
        <Link 
          href="/news" 
          className="inline-block mt-3 text-sm text-accent hover:text-accent/80 transition-colors"
        >
          Read full announcement →
        </Link>
      </div>
    </div>
  )
}
