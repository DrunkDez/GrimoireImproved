"use client"

import { useState, useEffect } from 'react'
import { format } from 'date-fns'
import { Calendar, Newspaper, ChevronDown, ChevronUp } from 'lucide-react'
import { MarkdownRenderer } from '@/components/ui/markdown-renderer'
import { GrimoireHeader } from '@/components/grimoire-header'
import { GrimoireFooter } from '@/components/grimoire-footer'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

interface SiteUpdate {
  id: string
  title: string
  description: string
  category: string
  date: string
}

export default function NewsPageClient() {
  const [updates, setUpdates] = useState<SiteUpdate[]>([])
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Fetch all published updates (no limit param = default 10, but we can request a large limit)
    fetch('/api/site-updates?limit=100')
      .then(res => res.json())
      .then(data => {
        const updatesArray = Array.isArray(data) ? data : []
        setUpdates(updatesArray)
        setIsLoading(false)
      })
      .catch(() => setIsLoading(false))
  }, [])

  return (
    <>
      <div className="min-h-screen relative z-[1] py-6 px-3 md:py-8 md:px-4">
        <div className="max-w-[1400px] mx-auto bg-background border-[3px] border-primary rounded-lg overflow-hidden relative">
          <div className="absolute -top-2 -left-2 text-4xl text-ring z-10 font-serif">◈</div>
          <div className="absolute -top-2 -right-2 text-4xl text-ring z-10 font-serif">◈</div>
          <div className="h-1 w-full bg-gradient-to-r from-transparent via-primary to-transparent" />
          <GrimoireHeader />
          <main className="p-6 md:p-10">
            <div className="flex items-center gap-3 mb-6">
              <Newspaper className="w-8 h-8 text-primary" />
              <h1 className="font-serif text-3xl font-bold text-primary uppercase tracking-wider">News & Announcements</h1>
            </div>
            {isLoading && updates.length === 0 ? (
              <div className="text-center py-12">Loading...</div>
            ) : updates.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">No news posts yet.</div>
            ) : (
              <div className="space-y-4">
                {updates.map((update) => (
                  <div key={update.id} className="bg-card border border-primary/30 rounded-lg overflow-hidden">
                    <button
                      onClick={() => setExpandedId(expandedId === update.id ? null : update.id)}
                      className="w-full text-left p-5 hover:bg-accent/5 transition-colors"
                    >
                      <div className="flex justify-between items-start gap-3">
                        <div>
                          <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground mb-2">
                            <span className="uppercase font-semibold text-primary/80">{update.category}</span>
                            <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{format(new Date(update.date), 'MMMM dd, yyyy')}</span>
                          </div>
                          <h2 className="font-serif text-xl font-bold text-foreground">{update.title}</h2>
                        </div>
                        {expandedId === update.id ? <ChevronUp className="w-5 h-5 shrink-0" /> : <ChevronDown className="w-5 h-5 shrink-0" />}
                      </div>
                    </button>
                    {expandedId === update.id && (
                      <div className="px-5 pb-5 pt-2 border-t border-primary/20 prose prose-sm dark:prose-invert max-w-none">
                        <MarkdownRenderer content={update.description} />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
            <div className="mt-8 text-center">
              <Link href="/">
                <Button variant="ghost">← Back to Home</Button>
              </Link>
            </div>
          </main>
          <GrimoireFooter />
        </div>
      </div>
    </>
  )
}
