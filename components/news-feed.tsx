"use client"

import { useState, useEffect } from 'react'
import { MarkdownRenderer } from '@/components/ui/markdown-renderer'
import { Newspaper, Calendar } from 'lucide-react'

interface SiteUpdate {
  id: string
  title: string
  description: string
  category: string
  date: string
}

export function NewsFeed() {
  const [updates, setUpdates] = useState<SiteUpdate[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchUpdates()
  }, [])

  const fetchUpdates = async () => {
    try {
      const response = await fetch('/api/site-updates?limit=5')
      if (response.ok) {
        const data = await response.json()
        setUpdates(data)
      }
    } catch (error) {
      console.error('Error fetching updates:', error)
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading || updates.length === 0) {
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
    <div className="bg-card border-2 border-primary rounded-lg p-4 sm:p-6 space-y-4">
      <div className="flex items-center gap-2 border-b-2 border-primary/20 pb-3">
        <Newspaper className="w-5 h-5 text-primary" />
        <h3 className="font-serif font-bold text-primary uppercase tracking-wider text-lg">
          Recent Updates & News
        </h3>
      </div>

      <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
        {updates.map((update, index) => (
          <div
            key={update.id}
            className={`border-2 border-primary/20 rounded-md p-4 space-y-3 hover:border-primary/40 transition-colors ${
              index === 0 ? 'bg-accent/5' : 'bg-background'
            }`}
          >
            <div className="flex items-start justify-between gap-3 flex-wrap">
              <div className="flex items-center gap-2 flex-wrap flex-1">
                <span className={`text-xs px-2 py-0.5 rounded-full border font-semibold ${getCategoryColor(update.category)}`}>
                  {update.category}
                </span>
                {index === 0 && (
                  <span className="text-xs px-2 py-0.5 rounded-full border bg-accent/20 text-accent border-accent font-semibold">
                    Latest
                  </span>
                )}
              </div>
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Calendar className="w-3 h-3" />
                {new Date(update.date).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric'
                })}
              </div>
            </div>

            <h4 className="font-semibold text-foreground text-lg leading-tight">
              {update.title}
            </h4>

            <div className="prose prose-sm dark:prose-invert max-w-none">
              <MarkdownRenderer content={update.description} />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
