"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Save, Eye } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export function ExpandableStepsManager() {
  const { toast } = useToast()
  const [concept, setConcept] = useState("")
  const [attributes, setAttributes] = useState("")
  const [abilities, setAbilities] = useState("")
  const [spheres, setSpheres] = useState("")
  const [backgrounds, setBackgrounds] = useState("")
  const [freebies, setFreebies] = useState("")
  const [isSaving, setIsSaving] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchContent()
  }, [])

  const fetchContent = async () => {
    try {
      const response = await fetch('/api/guide-expanded-content')
      if (response.ok) {
        const data = await response.json()
        setConcept(data.concept || "")
        setAttributes(data.attributes || "")
        setAbilities(data.abilities || "")
        setSpheres(data.spheres || "")
        setBackgrounds(data.backgrounds || "")
        setFreebies(data.freebies || "")
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
      const response = await fetch('/api/guide-expanded-content', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ [field]: value })
      })

      if (response.ok) {
        toast({
          title: "Saved!",
          description: "Expanded content updated successfully.",
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
        <h2 className="text-2xl font-bold mb-2">Expandable Step Details</h2>
        <p className="text-muted-foreground">
          Edit the expandable content for each step on the Overview tab. This text appears when users click to expand a step.
        </p>
      </div>

      <Tabs defaultValue="concept" className="space-y-4">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="concept">Concept</TabsTrigger>
          <TabsTrigger value="attributes">Attributes</TabsTrigger>
          <TabsTrigger value="abilities">Abilities</TabsTrigger>
          <TabsTrigger value="spheres">Spheres</TabsTrigger>
          <TabsTrigger value="backgrounds">Backgrounds</TabsTrigger>
          <TabsTrigger value="freebies">Freebies</TabsTrigger>
        </TabsList>

        {/* Step 1: Concept & Tradition */}
        <TabsContent value="concept">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Step 1: Concept & Tradition</span>
                <a href="/character-creation" target="_blank" rel="noopener noreferrer">
                  <Button variant="outline" size="sm">
                    <Eye className="w-4 h-4 mr-2" />
                    Preview
                  </Button>
                </a>
              </CardTitle>
              <CardDescription>
                Expanded details shown when user clicks "Concept & Tradition" on the Overview tab
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="concept-content">Expanded Content</Label>
                <Textarea
                  id="concept-content"
                  value={concept}
                  onChange={(e) => setConcept(e.target.value)}
                  rows={12}
                  placeholder="Choose your character's concept - their core identity and role. Examples: Street Hacker, Herbalist Healer, Quantum Physicist.

Then select your Tradition. Each Tradition has a different approach to magic:
- Akashic Brotherhood: Martial arts and inner enlightenment
- Celestial Chorus: Faith and divine will
- Cult of Ecstasy: Passion and altered states
(etc...)"
                  className="font-mono text-sm"
                />
                <p className="text-xs text-muted-foreground">
                  This appears when users expand Step 1. Explain the concept and tradition choice.
                </p>
              </div>
              <Button onClick={() => handleSave('concept', concept)} disabled={isSaving}>
                <Save className="w-4 h-4 mr-2" />
                Save Concept Step
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Step 2: Attributes */}
        <TabsContent value="attributes">
          <Card>
            <CardHeader>
              <CardTitle>Step 2: Attributes</CardTitle>
              <CardDescription>
                Expanded details for the Attributes step
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="attributes-content">Expanded Content</Label>
                <Textarea
                  id="attributes-content"
                  value={attributes}
                  onChange={(e) => setAttributes(e.target.value)}
                  rows={12}
                  placeholder="Attributes represent your character's raw, innate capabilities.

Each attribute starts at 1 dot (representing basic human competence). You then prioritize the three categories:

Primary (7 additional dots): Your character's strongest area
Secondary (5 additional dots): Moderately developed
Tertiary (3 additional dots): Least developed area

Example: A martial artist might prioritize Physical (Primary), Mental (Secondary), Social (Tertiary)."
                  className="font-mono text-sm"
                />
              </div>
              <Button onClick={() => handleSave('attributes', attributes)} disabled={isSaving}>
                <Save className="w-4 h-4 mr-2" />
                Save Attributes Step
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Step 3: Abilities */}
        <TabsContent value="abilities">
          <Card>
            <CardHeader>
              <CardTitle>Step 3: Abilities</CardTitle>
              <CardDescription>
                Expanded details for the Abilities step
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="abilities-content">Expanded Content</Label>
                <Textarea
                  id="abilities-content"
                  value={abilities}
                  onChange={(e) => setAbilities(e.target.value)}
                  rows={12}
                  placeholder="Abilities represent learned skills and knowledge.

Talents: Intuitive abilities you're born with or naturally develop
Skills: Practiced abilities requiring training
Knowledges: Studied subjects requiring education

You distribute points across three priorities:
- Primary: 13 dots
- Secondary: 9 dots  
- Tertiary: 5 dots

Important: No single ability can start above 3 dots."
                  className="font-mono text-sm"
                />
              </div>
              <Button onClick={() => handleSave('abilities', abilities)} disabled={isSaving}>
                <Save className="w-4 h-4 mr-2" />
                Save Abilities Step
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Step 4: Spheres */}
        <TabsContent value="spheres">
          <Card>
            <CardHeader>
              <CardTitle>Step 4: Spheres</CardTitle>
              <CardDescription>
                Expanded details for the Spheres step
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="spheres-content">Expanded Content</Label>
                <Textarea
                  id="spheres-content"
                  value={spheres}
                  onChange={(e) => setSpheres(e.target.value)}
                  rows={12}
                  placeholder="Spheres represent your understanding of reality's fundamental forces.

You have 6 dots to distribute among the nine Spheres:
- One Sphere (your affinity) must start at 1 dot
- No Sphere can start above 3 dots
- Your Tradition influences which Spheres you can learn

The Nine Spheres:
Correspondence (space), Entropy (fate), Forces (energy), Life (biology), Matter (substances), Mind (thought), Prime (quintessence), Spirit (ephemera), Time (temporal)

Choose Spheres that fit your character concept and magical style."
                  className="font-mono text-sm"
                />
              </div>
              <Button onClick={() => handleSave('spheres', spheres)} disabled={isSaving}>
                <Save className="w-4 h-4 mr-2" />
                Save Spheres Step
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Step 5: Backgrounds */}
        <TabsContent value="backgrounds">
          <Card>
            <CardHeader>
              <CardTitle>Step 5: Backgrounds</CardTitle>
              <CardDescription>
                Expanded details for the Backgrounds step
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="backgrounds-content">Expanded Content</Label>
                <Textarea
                  id="backgrounds-content"
                  value={backgrounds}
                  onChange={(e) => setBackgrounds(e.target.value)}
                  rows={12}
                  placeholder="Backgrounds represent your character's resources and connections.

You have 7 dots to distribute among Backgrounds of your choice:

Common Backgrounds:
- Avatar: Strength of your magical essence
- Allies: Friends who will help you
- Contacts: Information sources
- Resources: Wealth and property
- Mentor: Someone who teaches and guides you
- Dream: Connection to the dreamscape
- Destiny: Sense of higher purpose

Choose Backgrounds that support your character concept and story."
                  className="font-mono text-sm"
                />
              </div>
              <Button onClick={() => handleSave('backgrounds', backgrounds)} disabled={isSaving}>
                <Save className="w-4 h-4 mr-2" />
                Save Backgrounds Step
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Step 6: Freebie Points */}
        <TabsContent value="freebies">
          <Card>
            <CardHeader>
              <CardTitle>Step 6: Freebie Points</CardTitle>
              <CardDescription>
                Expanded details for the Freebie Points step
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="freebies-content">Expanded Content</Label>
                <Textarea
                  id="freebies-content"
                  value={freebies}
                  onChange={(e) => setFreebies(e.target.value)}
                  rows={12}
                  placeholder="Freebie points let you customize your character beyond the basic template.

You have 15 freebie points to spend. Costs:
- Attribute: 5 points per dot
- Ability: 2 points per dot
- Sphere: 7 points per dot
- Background: 1 point per dot
- Arete: 4 points per dot
- Willpower: 1 point per dot

Strategy tips:
- Spheres are expensive but powerful
- Abilities are cheap and versatile
- Consider raising your Arete to 2 for more powerful magic
- Boost Willpower for staying power in conflicts"
                  className="font-mono text-sm"
                />
              </div>
              <Button onClick={() => handleSave('freebies', freebies)} disabled={isSaving}>
                <Save className="w-4 h-4 mr-2" />
                Save Freebie Points Step
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
            <strong>Keep it brief:</strong> Users see this in a small expandable area. 3-5 short paragraphs is ideal.
          </p>
          <p className="text-muted-foreground">
            <strong>Explain the "why":</strong> Help users understand why this step matters and how to approach it.
          </p>
          <p className="text-muted-foreground">
            <strong>Give examples:</strong> Concrete examples help new players understand abstract concepts.
          </p>
          <p className="text-muted-foreground">
            <strong>Be encouraging:</strong> Character creation can be overwhelming - make it friendly and approachable!
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
