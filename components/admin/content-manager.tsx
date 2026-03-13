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
  
  // NEW: About sections
  const [aboutOwnerTitle, setAboutOwnerTitle] = useState("About the Owner")
  const [aboutOwnerText, setAboutOwnerText] = useState("")
  const [aboutOwnerImage, setAboutOwnerImage] = useState("")
  const [aboutSiteTitle, setAboutSiteTitle] = useState("About the Site")
  const [aboutSiteText, setAboutSiteText] = useState("")
  const [aboutSectionOrder, setAboutSectionOrder] = useState("owner,site")
  
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
        
        // NEW: Load About sections
        setAboutOwnerTitle(settings.aboutOwnerTitle || "About the Owner")
        setAboutOwnerText(settings.aboutOwnerText || "")
        setAboutOwnerImage(settings.aboutOwnerImage || "")
        setAboutSiteTitle(settings.aboutSiteTitle || "About the Site")
        setAboutSiteText(settings.aboutSiteText || "")
        setAboutSectionOrder(settings.aboutSectionOrder || "owner,site")
        
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
              Text displayed in the site footer. Use formatting buttons for bold, italic, etc.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <RichTextEditor
              id="footer-text"
              label="Content"
              value={footerText}
              onChange={setFooterText}
              rows={4}
              placeholder="The Paradox Wheel © 2026
An unofficial fan site for Mage: The Ascension"
            />
            <p className="text-xs text-muted-foreground">
              Use **bold** for emphasis, *italic* for titles, or create lists with dashes.
            </p>
            <Button
              onClick={() => handleSave('footerText', footerText)}
              disabled={isSaving}
            >
              <Save className="w-4 h-4 mr-2" />
              Save Footer
            </Button>
          </CardContent>
        </Card>

        {/* About Page - TWO SECTIONS */}
        <Card className="border-accent">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>About Page (Two Sections)</span>
              <a href="/about" target="_blank" rel="noopener noreferrer">
                <Button variant="outline" size="sm">
                  <Eye className="w-4 h-4 mr-2" />
                  Preview
                </Button>
              </a>
            </CardTitle>
            <CardDescription>
              The About page is split into two sections: About the Owner and About the Site. You can reorder them.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            
            {/* Section Order */}
            <div className="space-y-2">
              <Label>Section Display Order</Label>
              <div className="flex gap-2">
                <Button
                  variant={aboutSectionOrder === "owner,site" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setAboutSectionOrder("owner,site")}
                >
                  Owner First
                </Button>
                <Button
                  variant={aboutSectionOrder === "site,owner" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setAboutSectionOrder("site,owner")}
                >
                  Site First
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                Choose which section appears first on the About page.
              </p>
            </div>

            <div className="h-px bg-border" />

            {/* About the Owner Section */}
            <div className="space-y-4 border-2 border-primary/20 rounded-lg p-4">
              <h3 className="font-semibold text-lg text-primary">Section 1: About the Owner</h3>
              
              <div className="space-y-2">
                <Label htmlFor="about-owner-title">Section Title</Label>
                <Input
                  id="about-owner-title"
                  value={aboutOwnerTitle}
                  onChange={(e) => setAboutOwnerTitle(e.target.value)}
                  placeholder="About the Owner"
                  className="font-serif"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="about-owner-image">Owner Image URL</Label>
                <Input
                  id="about-owner-image"
                  value={aboutOwnerImage}
                  onChange={(e) => setAboutOwnerImage(e.target.value)}
                  placeholder="https://example.com/profile.jpg"
                  type="url"
                />
                <p className="text-xs text-muted-foreground">
                  Small image shown next to the owner text. Leave empty for no image.
                </p>
              </div>

              <RichTextEditor
                id="about-owner-text"
                label="Owner Bio/Description"
                value={aboutOwnerText}
                onChange={setAboutOwnerText}
                rows={8}
                placeholder="Tell visitors about yourself - who you are, why you created this site, your connection to Mage: The Ascension..."
              />
            </div>

            <div className="h-px bg-border" />

            {/* About the Site Section */}
            <div className="space-y-4 border-2 border-primary/20 rounded-lg p-4">
              <h3 className="font-semibold text-lg text-primary">Section 2: About the Site</h3>
              
              <div className="space-y-2">
                <Label htmlFor="about-site-title">Section Title</Label>
                <Input
                  id="about-site-title"
                  value={aboutSiteTitle}
                  onChange={(e) => setAboutSiteTitle(e.target.value)}
                  placeholder="About the Site"
                  className="font-serif"
                />
              </div>

              <RichTextEditor
                id="about-site-text"
                label="Site Description"
                value={aboutSiteText}
                onChange={setAboutSiteText}
                rows={8}
                placeholder="Describe the site's purpose, features, what makes it unique, how it helps players and Storytellers..."
              />
            </div>

            <div className="flex gap-3 flex-wrap">
              <Button
                onClick={() => handleSave('aboutOwnerTitle', aboutOwnerTitle)}
                disabled={isSaving}
                variant="outline"
                size="sm"
              >
                <Save className="w-4 h-4 mr-2" />
                Save Owner Title
              </Button>
              <Button
                onClick={() => handleSave('aboutOwnerImage', aboutOwnerImage)}
                disabled={isSaving}
                variant="outline"
                size="sm"
              >
                <Save className="w-4 h-4 mr-2" />
                Save Owner Image
              </Button>
              <Button
                onClick={() => handleSave('aboutOwnerText', aboutOwnerText)}
                disabled={isSaving}
                variant="outline"
                size="sm"
              >
                <Save className="w-4 h-4 mr-2" />
                Save Owner Text
              </Button>
              <Button
                onClick={() => handleSave('aboutSiteTitle', aboutSiteTitle)}
                disabled={isSaving}
                variant="outline"
                size="sm"
              >
                <Save className="w-4 h-4 mr-2" />
                Save Site Title
              </Button>
              <Button
                onClick={() => handleSave('aboutSiteText', aboutSiteText)}
                disabled={isSaving}
                variant="outline"
                size="sm"
              >
                <Save className="w-4 h-4 mr-2" />
                Save Site Text
              </Button>
              <Button
                onClick={() => handleSave('aboutSectionOrder', aboutSectionOrder)}
                disabled={isSaving}
                size="sm"
              >
                <Save className="w-4 h-4 mr-2" />
                Save Order
              </Button>
            </div>
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
