"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Save, Eye } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export function ContentManager() {
  const { toast } = useToast()
  const [aboutPage, setAboutPage] = useState("")
  const [howToUse, setHowToUse] = useState("")
  const [creditsPage, setCreditsPage] = useState("")
  const [isSaving, setIsSaving] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchContent()
  }, [])

  const fetchContent = async () => {
    try {
      const response = await fetch('/api/site-settings')
      if (response.ok) {
        const settings = await response.json()
        setAboutPage(settings.aboutPage || "")
        setHowToUse(settings.howToUse || "")
        setCreditsPage(settings.creditsPage || "")
      }
    } catch (error) {
      console.error('Error fetching content:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSave = async (field: 'aboutPage' | 'howToUse' | 'creditsPage', value: string) => {
    setIsSaving(true)
    try {
      const response = await fetch('/api/site-settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ [field]: value })
      })

      if (response.ok) {
        toast({
          title: "Saved!",
          description: "Content has been updated successfully.",
        })
      } else {
        throw new Error('Failed to save')
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save content. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-12">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Content Management</h2>
        <p className="text-muted-foreground">
          Manage the About page, How to Use section, and Credits page content.
        </p>
      </div>

      <div className="grid gap-6">
        {/* About Page */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>About Page</span>
              <a href="/about" target="_blank" rel="noopener noreferrer">
                <Button variant="outline" size="sm">
                  <Eye className="w-4 h-4 mr-2" />
                  Preview
                </Button>
              </a>
            </CardTitle>
            <CardDescription>
              The main About page content. Use double line breaks for paragraphs.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="about-page">Content</Label>
              <Textarea
                id="about-page"
                value={aboutPage}
                onChange={(e) => setAboutPage(e.target.value)}
                rows={12}
                placeholder="The Paradox Wheel is a comprehensive digital grimoire for Mage: The Ascension...

Created by passionate fans of the World of Darkness, this tool helps Storytellers and players..."
                className="font-mono text-sm"
              />
              <p className="text-xs text-muted-foreground">
                Tip: Use double line breaks (press Enter twice) to create new paragraphs.
              </p>
            </div>
            <Button
              onClick={() => handleSave('aboutPage', aboutPage)}
              disabled={isSaving}
            >
              <Save className="w-4 h-4 mr-2" />
              Save About Page
            </Button>
          </CardContent>
        </Card>

        {/* How to Use */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>How to Use</span>
              <span className="text-sm font-normal text-muted-foreground">
                Shown on home page
              </span>
            </CardTitle>
            <CardDescription>
              Instructions shown below "Welcome, Newly Awakened" on the home page.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="how-to-use">Content</Label>
              <Textarea
                id="how-to-use"
                value={howToUse}
                onChange={(e) => setHowToUse(e.target.value)}
                rows={8}
                placeholder="1. Browse rotes by tradition or sphere
2. Search for specific magical effects
3. Create your own character using our guide
4. Add your own rotes to share with the community"
                className="font-mono text-sm"
              />
              <p className="text-xs text-muted-foreground">
                Each line will be displayed as a separate paragraph. Keep it concise!
              </p>
            </div>
            <Button
              onClick={() => handleSave('howToUse', howToUse)}
              disabled={isSaving}
            >
              <Save className="w-4 h-4 mr-2" />
              Save How to Use
            </Button>
          </CardContent>
        </Card>

        {/* Credits Page */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Credits Page</span>
              <a href="/credits" target="_blank" rel="noopener noreferrer">
                <Button variant="outline" size="sm">
                  <Eye className="w-4 h-4 mr-2" />
                  Preview
                </Button>
              </a>
            </CardTitle>
            <CardDescription>
              Acknowledge contributors, sources, and give credit where due.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="credits-page">Content</Label>
              <Textarea
                id="credits-page"
                value={creditsPage}
                onChange={(e) => setCreditsPage(e.target.value)}
                rows={12}
                placeholder="Created by [Your Name]

Special thanks to the Mage: The Ascension community for their contributions and feedback.

Mage: The Ascension is a trademark of Paradox Interactive AB. This is an unofficial fan site.

Resources used:
- Mage 20th Anniversary Edition
- Various sourcebooks and supplements"
                className="font-mono text-sm"
              />
              <p className="text-xs text-muted-foreground">
                Include acknowledgments, disclaimers, and attribution for resources used.
              </p>
            </div>
            <Button
              onClick={() => handleSave('creditsPage', creditsPage)}
              disabled={isSaving}
            >
              <Save className="w-4 h-4 mr-2" />
              Save Credits
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Default Content Templates */}
      <Card className="border-accent">
        <CardHeader>
          <CardTitle className="text-sm">💡 Need Help?</CardTitle>
        </CardHeader>
        <CardContent className="text-xs space-y-2">
          <p className="text-muted-foreground">
            <strong>About Page:</strong> Explain what The Paradox Wheel is, who it's for, and what makes it unique.
          </p>
          <p className="text-muted-foreground">
            <strong>How to Use:</strong> Give new users a quick guide to get started (3-5 bullet points work best).
          </p>
          <p className="text-muted-foreground">
            <strong>Credits:</strong> Thank contributors, acknowledge White Wolf/Paradox, list your sources.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
