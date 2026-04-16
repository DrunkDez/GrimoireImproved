import { Metadata } from 'next'
import NewsPageClient from './client'

export const metadata: Metadata = {
  title: 'News & Announcements | The Paradox Wheel',
  description: 'Latest news, updates, and announcements from the TTRPG world and The Paradox Wheel.',
}

export default function NewsPage() {
  return <NewsPageClient />
}
