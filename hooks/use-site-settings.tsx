"use client"

import { useEffect, useState } from "react"

interface SiteSettings {
  siteTitle: string
  siteSubtitle: string
  homeWelcomeTitle: string
  homeWelcomeText: string
  footerText: string
}

const DEFAULT_SETTINGS: SiteSettings = {
  siteTitle: "The Enlightened Grimoire",
  siteSubtitle: "A Compendium of Mystical Rotes for the Awakened",
  homeWelcomeTitle: "Welcome, Seeker of Knowledge",
  homeWelcomeText: "Within these pages lies a curated compendium of mystical Rotes drawn from the Nine Traditions and beyond.\n\nEach Rote represents a proven path through the Tapestry, a well-worn groove in reality that an Awakened will may follow.\n\nBrowse the collection, search by Sphere or Tradition, or inscribe your own discoveries for others to study.",
  footerText: "✦ The Enlightened Grimoire ✦\nA Compendium of Awakened Knowledge\nMage: The Ascension is a trademark of Paradox Interactive AB. This is an unofficial fan project.",
}

export function useSiteSettings() {
  const [settings, setSettings] = useState<SiteSettings>(DEFAULT_SETTINGS)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchSettings()
  }, [])

  const fetchSettings = async () => {
    try {
      const response = await fetch('/api/site-settings')
      if (response.ok) {
        const data = await response.json()
        setSettings({
          siteTitle: data.siteTitle || DEFAULT_SETTINGS.siteTitle,
          siteSubtitle: data.siteSubtitle || DEFAULT_SETTINGS.siteSubtitle,
          homeWelcomeTitle: data.homeWelcomeTitle || DEFAULT_SETTINGS.homeWelcomeTitle,
          homeWelcomeText: data.homeWelcomeText || DEFAULT_SETTINGS.homeWelcomeText,
          footerText: data.footerText || DEFAULT_SETTINGS.footerText,
        })
      }
    } catch (error) {
      console.error('Error fetching site settings:', error)
      // Keep using default settings on error
    } finally {
      setIsLoading(false)
    }
  }

  return { settings, isLoading, refreshSettings: fetchSettings }
}
