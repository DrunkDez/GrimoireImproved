"use client"

import { useState, useEffect } from 'react'
import { MarkdownRenderer } from '@/components/ui/markdown-renderer'
import { Megaphone } from 'lucide-react'

interface SiteUpdate {
  id: string
  title: string
  description: string
  category: string
  date: string
}

export function SiteUpdateHero() {
  const [update, setUpdate] = useState<SiteUpdate | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchLatestUpdate()
  }, [])

  const fetchLatestUpdate = async () => {
    try {
      const response = await fetch('/api/site-updates?latest=true')
      if (response.ok) {
        const data = await response.json()
        setUpdate(data)
      }
    } catch (error) {
      console.error('Error fetching latest update:', error)
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading || !update) {
    return null
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Feature': return 'bg-green-100 text-green-800 border-green-300 dark:bg-green-900/30 dark:text-green-300 dark:border-green-700'
      case 'Bug Fix': return 'bg-red-100 text-red-800 border-red-300 dark:bg-red-900/30 dark:text-red-300 dark:border-red-700'
      case 'Content': return 'bg-blue-100 text-blue-800 border-blue-300 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-700'
      case 'Improvement': return 'bg-purple-100 text-purple-800 border-purple-300 dark:bg-purple-900/30 dark:text-purple-300 dark:border-purple-700'
      case 'Announcement': return 'bg-yellow-100 text-yellow-800 border-yellow-300 dark:bg-yellow-900/30 dark:text-yellow-300 dark:border-yellow-700'
      default: return 'bg-gray-100 text-gray-800 border-gray-300 dark:bg-gray-900/30 dark:text-gray-300 dark:border-gray-700'
    }
  }

  return (
    <div className="relative bg-gradient-to-r from-accent/20 via-primary/10 to-accent/20 border-2 border-accent rounded-lg p-6 md:p-8 mb-6 overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-accent/5 rounded-full blur-3xl -z-10" aria-hidden="true" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -z-10" aria-hidden="true" />

      <div className="relative z-10">
        <div className="flex items-center gap-3 mb-4">
          <div className="flex items-center justify-center w-10 h-10 rounded-full bg-accent/20 border-2 border-accent">
            <Megaphone className="w-5 h-5 text-accent" />
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="font-serif text-xl md:text-2xl font-bold text-primary uppercase tracking-wider">
              Latest News
            </h3>
            <span className={`text-xs px-3 py-1 rounded-full border font-semibold ${getCategoryColor(update.category)}`}>
              {update.category}
            </span>
            <span className="text-sm text-muted-foreground ml-auto">
              {new Date(update.date).toLocaleDateString('en-US', {
                month: 'long',
                day: 'numeric',
                year: 'numeric'
              })}
            </span>
          </div>
        </div>

        <h4 className="font-serif text-2xl md:text-3xl font-black text-foreground mb-4 leading-tight">
          {update.title}
        </h4>
        
        <div className="prose prose-sm md:prose-base dark:prose-invert max-w-none">
          <MarkdownRenderer content={update.description} />
        </div>
      </div>
    </div>
  )
}
