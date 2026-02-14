"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { FileText, Save } from "lucide-react"

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

export function AdminContentPanel() {
  const { toast } = useToast()
  const [settings, setSettings] = useState<SiteSettings>(DEFAULT_SETTINGS)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)

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
      console.error('Error fetching settings:', error)
      toast({
        title: "Error",
        description: "Failed to load site settings",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleSave = async () => {
    setIsSaving(true)
    try {
      const response = await fetch('/api/site-settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ settings }),
      })

      if (response.ok) {
        toast({
          title: "Settings Saved",
          description: "Site content has been updated successfully",
        })
      } else {
        throw new Error('Failed to save settings')
      }
    } catch (error) {
      console.error('Error saving settings:', error)
      toast({
        title: "Error",
        description: "Failed to save settings",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  const handleReset = () => {
    setSettings(DEFAULT_SETTINGS)
    toast({
      title: "Reset to Defaults",
      description: "Settings reset to default values (not saved yet)",
    })
  }

  if (isLoading) {
    return <div className="p-6 text-center">Loading settings...</div>
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="border-2 border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-primary">
            <FileText className="w-5 h-5" />
            Site Content Management
          </CardTitle>
          <CardDescription>
            Edit the text content displayed throughout the site. Changes will appear immediately after saving.
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Site Title */}
      <Card className="border-2 border-primary/20">
        <CardHeader>
          <CardTitle className="text-lg">Site Title</CardTitle>
          <CardDescription>Main heading in the site header</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="siteTitle">Title</Label>
            <Input
              id="siteTitle"
              value={settings.siteTitle}
              onChange={(e) => setSettings({ ...settings, siteTitle: e.target.value })}
              placeholder="The Enlightened Grimoire"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="siteSubtitle">Subtitle</Label>
            <Input
              id="siteSubtitle"
              value={settings.siteSubtitle}
              onChange={(e) => setSettings({ ...settings, siteSubtitle: e.target.value })}
              placeholder="A Compendium of Mystical Rotes for the Awakened"
            />
          </div>
        </CardContent>
      </Card>

      {/* Home Page Welcome */}
      <Card className="border-2 border-primary/20">
        <CardHeader>
          <CardTitle className="text-lg">Home Page Welcome</CardTitle>
          <CardDescription>Hero section text on the homepage</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="homeWelcomeTitle">Welcome Title</Label>
            <Input
              id="homeWelcomeTitle"
              value={settings.homeWelcomeTitle}
              onChange={(e) => setSettings({ ...settings, homeWelcomeTitle: e.target.value })}
              placeholder="Welcome, Seeker of Knowledge"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="homeWelcomeText">Welcome Text</Label>
            <Textarea
              id="homeWelcomeText"
              value={settings.homeWelcomeText}
              onChange={(e) => setSettings({ ...settings, homeWelcomeText: e.target.value })}
              placeholder="Within these pages lies..."
              rows={8}
              className="font-mono text-sm"
            />
            <p className="text-xs text-muted-foreground">
              Tip: Use line breaks to separate paragraphs
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Footer Text */}
      <Card className="border-2 border-primary/20">
        <CardHeader>
          <CardTitle className="text-lg">Footer Text</CardTitle>
          <CardDescription>Text displayed at the bottom of pages</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="footerText">Footer Content</Label>
            <Textarea
              id="footerText"
              value={settings.footerText}
              onChange={(e) => setSettings({ ...settings, footerText: e.target.value })}
              placeholder="✦ The Enlightened Grimoire ✦..."
              rows={4}
              className="font-mono text-sm"
            />
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <Card className="border-2 border-primary/20">
        <CardContent className="pt-6">
          <div className="flex gap-4">
            <Button
              onClick={handleSave}
              disabled={isSaving}
              className="gap-2 flex-1"
            >
              <Save className="w-4 h-4" />
              {isSaving ? "Saving..." : "Save Changes"}
            </Button>
            <Button
              onClick={handleReset}
              variant="outline"
              disabled={isSaving}
            >
              Reset to Defaults
            </Button>
          </div>
          <p className="text-xs text-muted-foreground mt-4 text-center">
            💡 Changes take effect immediately after saving
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
