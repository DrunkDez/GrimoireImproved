"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Save, Eye } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { RichTextEditor } from "@/components/ui/rich-text-editor"

export function ContentManager() {
  const { toast } = useToast()
  const [footerText, setFooterText] = useState("")
  const [welcomeTitle, setWelcomeTitle] = useState("")
  const [welcomeText, setWelcomeText] = useState("")
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
        setFooterText(settings.footerText || "")
        setWelcomeTitle(settings.welcomeTitle || "Welcome, Newly Awakened")
        setWelcomeText(settings.welcomeText || "")
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

  const handleSave = async (field: string, value: string) => {
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
          Manage all editable text content on the site.
        </p>
      </div>

      <div className="grid gap-6">
        {/* Welcome Section (Home Page Hero) */}
        <Card className="border-accent">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Welcome Section (Home Page)</span>
              <span className="text-sm font-normal text-muted-foreground">
                Main hero section
              </span>
            </CardTitle>
            <CardDescription>
              The main welcome message shown at the top of the home page.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="welcome-title">Title</Label>
              <Input
                id="welcome-title"
                value={welcomeTitle}
                onChange={(e) => setWelcomeTitle(e.target.value)}
                placeholder="Welcome, Newly Awakened"
                className="font-serif text-lg"
              />
              <p className="text-xs text-muted-foreground">
                The main heading shown at the top of the home page.
              </p>
            </div>
            
            <RichTextEditor
              id="welcome-text"
              label="Welcome Text"
              value={welcomeText}
              onChange={setWelcomeText}
              rows={8}
              placeholder="Within these pages lies a curated compendium of mystical Rotes drawn from the Nine Traditions and beyond.

Each Rote represents a proven path through the Tapestry, a well-worn groove in reality that an Awakened will may follow.

Browse the collection, search by Sphere or Tradition, or inscribe your own discoveries for others to study."
            />
            
            <div className="flex gap-3">
              <Button
                onClick={() => handleSave('welcomeTitle', welcomeTitle)}
                disabled={isSaving}
              >
                <Save className="w-4 h-4 mr-2" />
                Save Title
              </Button>
              <Button
                onClick={() => handleSave('welcomeText', welcomeText)}
                disabled={isSaving}
                variant="outline"
              >
                <Save className="w-4 h-4 mr-2" />
                Save Text
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* How to Use */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>How to Use</span>
              <span className="text-sm font-normal text-muted-foreground">
                Shown below welcome section
              </span>
            </CardTitle>
            <CardDescription>
              Instructions shown in a box below the welcome section on the home page.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <RichTextEditor
              id="how-to-use"
              label="Content"
              value={howToUse}
              onChange={setHowToUse}
              rows={8}
              placeholder="Browse the Wheel's Archives to explore rotes organized by Tradition and Sphere
Use the Search function to find specific magical effects or techniques
Create your character using our step-by-step Character Creation guide"
            />
            <Button
              onClick={() => handleSave('howToUse', howToUse)}
              disabled={isSaving}
            >
              <Save className="w-4 h-4 mr-2" />
              Save How to Use
            </Button>
          </CardContent>
        </Card>

        {/* Footer Text */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Footer Text</span>
              <span className="text-sm font-normal text-muted-foreground">
                Shown at bottom of every page
              </span>
            </CardTitle>
            <CardDescription>
              Text displayed in the site footer. Each line break creates a new line.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="footer-text">Content</Label>
              <Textarea
                id="footer-text"
                value={footerText}
                onChange={(e) => setFooterText(e.target.value)}
                rows={4}
                placeholder="The Paradox Wheel © 2026
An unofficial fan site for Mage: The Ascension"
                className="font-mono text-sm"
              />
              <p className="text-xs text-muted-foreground">
                Each new line will be displayed as a separate line in the footer.
              </p>
            </div>
            <Button
              onClick={() => handleSave('footerText', footerText)}
              disabled={isSaving}
            >
              <Save className="w-4 h-4 mr-2" />
              Save Footer
            </Button>
          </CardContent>
        </Card>

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
            <RichTextEditor
              id="about-page"
              label="Content"
              value={aboutPage}
              onChange={setAboutPage}
              rows={12}
              placeholder="The Paradox Wheel is a comprehensive digital grimoire for Mage: The Ascension...

Created by passionate fans of the World of Darkness, this tool helps Storytellers and players..."
            />
            <Button
              onClick={() => handleSave('aboutPage', aboutPage)}
              disabled={isSaving}
            >
              <Save className="w-4 h-4 mr-2" />
              Save About Page
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
            <RichTextEditor
              id="credits-page"
              label="Content"
              value={creditsPage}
              onChange={setCreditsPage}
              rows={12}
              placeholder="Created by [Your Name]

Special thanks to the Mage: The Ascension community for their contributions and feedback.

Mage: The Ascension is a trademark of Paradox Interactive AB. This is an unofficial fan site.

Resources used:
- Mage 20th Anniversary Edition
- Various sourcebooks and supplements"
            />
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
      <Card className="border-accent/50 bg-accent/5">
        <CardHeader>
          <CardTitle className="text-sm">💡 Content Tips</CardTitle>
        </CardHeader>
        <CardContent className="text-xs space-y-2">
          <p className="text-muted-foreground">
            <strong>Welcome Section:</strong> Your site's first impression. Make it inviting and explain what users will find here.
          </p>
          <p className="text-muted-foreground">
            <strong>How to Use:</strong> Quick instructions (3-5 points) to help new users get started.
          </p>
          <p className="text-muted-foreground">
            <strong>Footer:</strong> Copyright, disclaimer, and brief site description (2-3 lines).
          </p>
          <p className="text-muted-foreground">
            <strong>About Page:</strong> Detailed explanation of your site, its purpose, and what makes it unique.
          </p>
          <p className="text-muted-foreground">
            <strong>Credits:</strong> Thank contributors, acknowledge White Wolf/Paradox, list sources.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
