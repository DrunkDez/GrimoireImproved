"use client"

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { format } from 'date-fns'
import { ChevronDown, ChevronUp, Calendar, Newspaper } from 'lucide-react'
import { MarkdownRenderer } from '@/components/ui/markdown-renderer'

interface SiteUpdate {
  id: string
  title: string
  description: string
  category: string
  date: string
}

export function LatestSiteUpdates() {
  const [updates, setUpdates] = useState<SiteUpdate[]>([])
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetch('/api/site-updates?limit=5')
      .then(res => res.json())
      .then(data => {
        // API returns array for multiple updates
        const updatesArray = Array.isArray(data) ? data : []
        setUpdates(updatesArray)
        setIsLoading(false)
      })
      .catch(() => setIsLoading(false))
  }, [])

  if (isLoading) {
    return (
      <div className="bg-card border-2 border-primary/30 rounded-lg p-6 text-center">
        <div className="flex items-center justify-center gap-2">
          <span className="text-accent animate-spin">⚙</span>
          <p className="text-muted-foreground">Loading news...</p>
        </div>
      </div>
    )
  }

  if (updates.length === 0) return null

  return (
    <div className="bg-card border-2 border-primary/30 rounded-lg overflow-hidden shadow-md">
      <div className="bg-primary/10 border-b border-primary/30 px-5 py-3 flex items-center gap-2">
        <Newspaper className="w-5 h-5 text-primary" />
        <h3 className="font-serif font-bold text-primary uppercase tracking-wider">News & Announcements</h3>
      </div>
      <div className="divide-y divide-primary/20">
        {updates.map((update) => (
          <div key={update.id} className="p-4 hover:bg-accent/5 transition-colors">
            <button
              onClick={() => setExpandedId(expandedId === update.id ? null : update.id)}
              className="w-full text-left flex justify-between items-start gap-3"
            >
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground mb-1">
                  <span className="uppercase font-semibold text-primary/80">{update.category}</span>
                  <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{format(new Date(update.date), 'MMM dd, yyyy')}</span>
                </div>
                <h4 className="font-serif font-bold text-foreground">{update.title}</h4>
              </div>
              {expandedId === update.id ? <ChevronUp className="w-5 h-5 shrink-0" /> : <ChevronDown className="w-5 h-5 shrink-0" />}
            </button>
            {expandedId === update.id && (
              <div className="mt-3 pt-3 border-t border-primary/20 prose prose-sm dark:prose-invert max-w-none">
                <MarkdownRenderer content={update.description} />
              </div>
            )}
          </div>
        ))}
      </div>
      <div className="bg-muted/30 px-5 py-3 text-right border-t border-primary/20">
        <Link href="/news" className="text-sm text-primary hover:text-accent transition-colors inline-flex items-center gap-1">
          See all news →
        </Link>
      </div>
    </div>
  )
}
