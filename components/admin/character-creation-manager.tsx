"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Save, Eye } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export function CharacterCreationManager() {
  const { toast } = useToast()
  const [overview, setOverview] = useState("")
  const [attributes, setAttributes] = useState("")
  const [abilities, setAbilities] = useState("")
  const [spheres, setSpheres] = useState("")
  const [finishing, setFinishing] = useState("")
  const [isSaving, setIsSaving] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchContent()
  }, [])

  const fetchContent = async () => {
    try {
      const response = await fetch('/api/character-creation-content')
      if (response.ok) {
        const content = await response.json()
        setOverview(content.overview || "")
        setAttributes(content.attributes || "")
        setAbilities(content.abilities || "")
        setSpheres(content.spheres || "")
        setFinishing(content.finishing || "")
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
      const response = await fetch('/api/character-creation-content', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ [field]: value })
      })

      if (response.ok) {
        toast({
          title: "Saved!",
          description: "Character creation content updated successfully.",
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
        <h2 className="text-2xl font-bold mb-2">Character Creation Guide</h2>
        <p className="text-muted-foreground">
          Edit the content for each step of the character creation process.
        </p>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="attributes">Attributes</TabsTrigger>
          <TabsTrigger value="abilities">Abilities</TabsTrigger>
          <TabsTrigger value="spheres">Spheres</TabsTrigger>
          <TabsTrigger value="finishing">Finishing</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Overview Content</span>
                <a href="/character-creation" target="_blank" rel="noopener noreferrer">
                  <Button variant="outline" size="sm">
                    <Eye className="w-4 h-4 mr-2" />
                    Preview
                  </Button>
                </a>
              </CardTitle>
              <CardDescription>
                Introduction to character creation. Explain the overall process.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="overview-content">Content</Label>
                <Textarea
                  id="overview-content"
                  value={overview}
                  onChange={(e) => setOverview(e.target.value)}
                  rows={15}
                  placeholder="Welcome to character creation! This guide will walk you through creating your Mage step by step.

Use double line breaks to create paragraphs..."
                  className="font-mono text-sm"
                />
                <p className="text-xs text-muted-foreground">
                  Use double line breaks (Enter twice) for paragraphs. Supports markdown-style formatting.
                </p>
              </div>
              <Button onClick={() => handleSave('overview', overview)} disabled={isSaving}>
                <Save className="w-4 h-4 mr-2" />
                Save Overview
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Attributes Tab */}
        <TabsContent value="attributes">
          <Card>
            <CardHeader>
              <CardTitle>Attributes Content</CardTitle>
              <CardDescription>
                Explain how to assign attribute points (Physical, Social, Mental).
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="attributes-content">Content</Label>
                <Textarea
                  id="attributes-content"
                  value={attributes}
                  onChange={(e) => setAttributes(e.target.value)}
                  rows={15}
                  placeholder="Attributes represent your character's raw capabilities.

Physical Attributes:
- Strength: Raw physical power
- Dexterity: Agility and coordination
- Stamina: Endurance and resilience

Social Attributes:
- Charisma: Force of personality
- Manipulation: Ability to influence
- Appearance: Physical attractiveness

Mental Attributes:
- Perception: Awareness and insight
- Intelligence: Reasoning and memory
- Wits: Quick thinking and reaction

You have three categories: Primary (7 points), Secondary (5 points), and Tertiary (3 points)."
                  className="font-mono text-sm"
                />
              </div>
              <Button onClick={() => handleSave('attributes', attributes)} disabled={isSaving}>
                <Save className="w-4 h-4 mr-2" />
                Save Attributes
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Abilities Tab */}
        <TabsContent value="abilities">
          <Card>
            <CardHeader>
              <CardTitle>Abilities Content</CardTitle>
              <CardDescription>
                Explain how to assign ability points (Talents, Skills, Knowledges).
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="abilities-content">Content</Label>
                <Textarea
                  id="abilities-content"
                  value={abilities}
                  onChange={(e) => setAbilities(e.target.value)}
                  rows={15}
                  placeholder="Abilities represent your character's learned capabilities and training.

Talents (Intuitive abilities):
- Alertness, Athletics, Awareness, Brawl, etc.

Skills (Practiced abilities):
- Crafts, Drive, Etiquette, Firearms, etc.

Knowledges (Studied abilities):
- Academics, Computer, Cosmology, Enigmas, etc.

You have three categories: Primary (13 points), Secondary (9 points), and Tertiary (5 points).
No ability can start above 3 dots."
                  className="font-mono text-sm"
                />
              </div>
              <Button onClick={() => handleSave('abilities', abilities)} disabled={isSaving}>
                <Save className="w-4 h-4 mr-2" />
                Save Abilities
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Spheres Tab */}
        <TabsContent value="spheres">
          <Card>
            <CardHeader>
              <CardTitle>Spheres Content</CardTitle>
              <CardDescription>
                Explain how to assign sphere points based on tradition.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="spheres-content">Content</Label>
                <Textarea
                  id="spheres-content"
                  value={spheres}
                  onChange={(e) => setSpheres(e.target.value)}
                  rows={15}
                  placeholder="Spheres represent your understanding of the fundamental forces of reality.

The Nine Spheres:
- Correspondence: Space and distance
- Entropy: Fate, fortune, and decay
- Forces: Energy and elemental powers
- Life: Living beings and biology
- Matter: Non-living physical substances
- Mind: Consciousness and thought
- Prime: Quintessence and raw magic
- Spirit: The spirit world and ephemera
- Time: The flow of temporal events

Beginning mages receive 6 dots to distribute among spheres, with one sphere at 2 dots (your specialty) and the rest distributed as you choose. Your tradition determines which spheres you can learn."
                  className="font-mono text-sm"
                />
              </div>
              <Button onClick={() => handleSave('spheres', spheres)} disabled={isSaving}>
                <Save className="w-4 h-4 mr-2" />
                Save Spheres
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Finishing Tab */}
        <TabsContent value="finishing">
          <Card>
            <CardHeader>
              <CardTitle>Finishing Touches Content</CardTitle>
              <CardDescription>
                Explain backgrounds, willpower, quintessence, paradox, and final details.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="finishing-content">Content</Label>
                <Textarea
                  id="finishing-content"
                  value={finishing}
                  onChange={(e) => setFinishing(e.target.value)}
                  rows={15}
                  placeholder="Final touches to complete your character.

Backgrounds (5 points):
Choose from: Allies, Avatar, Contacts, Destiny, Dream, Mentor, Resources, etc.

Willpower:
Starting Willpower equals your Avatar background rating (minimum 1).

Quintessence:
Starting Quintessence equals your Avatar background rating.

Arete:
All beginning mages start with Arete 1.

Experience Points:
New characters typically start with 15 freebie points to customize further.

Don't forget:
- Choose your character's name, concept, and tradition
- Write a detailed background
- Define your Avatar's nature and essence
- Choose a focus and paradigm"
                  className="font-mono text-sm"
                />
              </div>
              <Button onClick={() => handleSave('finishing', finishing)} disabled={isSaving}>
                <Save className="w-4 h-4 mr-2" />
                Save Finishing Touches
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Help Card */}
      <Card className="border-accent/50 bg-accent/5">
        <CardHeader>
          <CardTitle className="text-sm">💡 Writing Tips</CardTitle>
        </CardHeader>
        <CardContent className="text-xs space-y-2">
          <p className="text-muted-foreground">
            <strong>Be clear:</strong> Explain game mechanics in simple terms for new players.
          </p>
          <p className="text-muted-foreground">
            <strong>Use examples:</strong> Show concrete examples of how things work.
          </p>
          <p className="text-muted-foreground">
            <strong>Format well:</strong> Use line breaks and structure to make content scannable.
          </p>
          <p className="text-muted-foreground">
            <strong>Link concepts:</strong> Reference earlier steps when building on previous information.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
