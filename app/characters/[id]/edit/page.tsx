"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter, useParams } from "next/navigation"  // Add useParams
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, Save, Loader2, Plus, Minus, X } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { Toaster } from "@/components/ui/toaster"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

// Types for the character data
interface CharacterData {
  id: string
  name: string
  player?: string
  chronicle?: string
  nature?: string
  demeanor?: string
  essence?: string
  faction: string
  sect?: string
  concept?: string
  attributes?: any
  abilities?: any
  spheres?: any
  backgrounds?: any
  specialties?: any
  arete?: number
  willpower?: number
  freebieDots?: any
  merits?: any[]
  flaws?: any[]
  avatar?: string
}

// Helper to render dots for editing
function DotSelector({ label, value, max = 5, onChange, disabled = false }: {
  label: string
  value: number
  max?: number
  onChange: (value: number) => void
  disabled?: boolean
}) {
  return (
    <div className="flex items-center justify-between py-1">
      <span className="text-sm capitalize">{label}</span>
      <div className="flex gap-1">
        {[...Array(max)].map((_, i) => (
          <button
            key={i}
            type="button"
            onClick={() => !disabled && onChange(i + 1)}
            className={`w-5 h-5 rounded-full border-2 transition-all ${
              !disabled && "hover:scale-110 cursor-pointer"
            }`}
            style={{
              borderColor: '#8b4513',
              backgroundColor: i < value ? '#8b4513' : 'transparent',
              opacity: disabled ? 0.5 : 1
            }}
            disabled={disabled}
          />
        ))}
      </div>
    </div>
  )
}

export default function EditCharacterPage() {
  // Use useParams instead of params prop
  const params = useParams()
  const characterId = params?.id as string
  
  console.log("🔍 EditCharacterPage - Received ID from useParams:", characterId)
  
  const { status } = useSession()
  const router = useRouter()
  const { toast } = useToast()
  const [character, setCharacter] = useState<CharacterData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [meritsList, setMeritsList] = useState<any[]>([])
  const [flawsList, setFlawsList] = useState<any[]>([])
  const [meritsDialogOpen, setMeritsDialogOpen] = useState(false)
  const [flawsDialogOpen, setFlawsDialogOpen] = useState(false)

  // Fetch character data
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin")
    }
  }, [status, router])

  useEffect(() => {
    if (status === "authenticated" && characterId) {
      console.log("📡 Fetching character for edit with ID:", characterId)
      fetchCharacter()
      fetchMeritsAndFlaws()
    }
  }, [status, characterId])

  const fetchCharacter = async () => {
    if (!characterId) {
      console.error("No character ID available")
      return
    }
    
    try {
      console.log("📡 Making API call to /api/characters/" + characterId)
      const response = await fetch(`/api/characters/${characterId}`)
      if (response.ok) {
        const data = await response.json()
        console.log("✅ Loaded character for edit:", data.name, "ID:", data.id)
        console.log("📊 Has attributes:", !!data.attributes)
        console.log("📊 Has abilities:", !!data.abilities)
        setCharacter(data)
      } else {
        console.error("❌ Failed to fetch character, status:", response.status)
        router.push("/dashboard")
      }
    } catch (error) {
      console.error("Error fetching character:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const fetchMeritsAndFlaws = async () => {
    try {
      const response = await fetch("/api/merits")
      if (response.ok) {
        const data = await response.json()
        setMeritsList(data.filter((m: any) => m.type === "merit"))
        setFlawsList(data.filter((m: any) => m.type === "flaw"))
      }
    } catch (error) {
      console.error("Error fetching merits/flaws:", error)
    }
  }

  const updateCharacter = (field: string, value: any) => {
    if (!character) return
    setCharacter({ ...character, [field]: value })
  }

  const updateAttribute = (attr: string, value: number) => {
    if (!character) return
    setCharacter({
      ...character,
      attributes: { ...character.attributes, [attr]: value }
    })
  }

  const updateAbility = (ability: string, value: number) => {
    if (!character) return
    setCharacter({
      ...character,
      abilities: { ...character.abilities, [ability]: value }
    })
  }

  const updateSphere = (sphere: string, value: number) => {
    if (!character) return
    setCharacter({
      ...character,
      spheres: { ...character.spheres, [sphere]: value }
    })
  }

  const updateBackground = (bg: string, value: number) => {
    if (!character) return
    setCharacter({
      ...character,
      backgrounds: { ...character.backgrounds, [bg]: value }
    })
  }

  const addMerit = (merit: any) => {
    if (!character) return
    const meritCost = Math.abs(merit.cost)
    const currentMerits = character.merits || []
    
    if (currentMerits.some(m => m.id === merit.id)) {
      toast({
        title: "Already Added",
        description: "This merit is already selected",
        variant: "destructive"
      })
      return
    }
    
    setCharacter({
      ...character,
      merits: [...currentMerits, { id: merit.id, name: merit.name, cost: meritCost }]
    })
    setMeritsDialogOpen(false)
  }

  const removeMerit = (index: number) => {
    if (!character) return
    const newMerits = [...(character.merits || [])]
    newMerits.splice(index, 1)
    setCharacter({ ...character, merits: newMerits })
  }

  const addFlaw = (flaw: any) => {
    if (!character) return
    const flawCost = Math.abs(flaw.cost)
    const currentFlaws = character.flaws || []
    const currentTotal = currentFlaws.reduce((sum, f) => sum + f.cost, 0)
    
    if (currentFlaws.some(f => f.id === flaw.id)) {
      toast({
        title: "Already Added",
        description: "This flaw is already selected",
        variant: "destructive"
      })
      return
    }
    
    if (currentTotal + flawCost > 7) {
      toast({
        title: "Maximum Flaws",
        description: "You cannot take more than 7 points in flaws",
        variant: "destructive"
      })
      return
    }
    
    setCharacter({
      ...character,
      flaws: [...currentFlaws, { id: flaw.id, name: flaw.name, cost: flawCost }]
    })
    setFlawsDialogOpen(false)
  }

  const removeFlaw = (index: number) => {
    if (!character) return
    const newFlaws = [...(character.flaws || [])]
    newFlaws.splice(index, 1)
    setCharacter({ ...character, flaws: newFlaws })
  }

  const saveCharacter = async () => {
    if (!character || !characterId) return
    
    setIsSaving(true)
    try {
      console.log("📡 Saving character with ID:", characterId)
      console.log("📊 Data being saved:", {
        name: character.name,
        hasAttributes: !!character.attributes,
        hasAbilities: !!character.abilities,
        hasSpheres: !!character.spheres
      })
      
      const response = await fetch(`/api/characters/${characterId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(character)
      })
      
      if (response.ok) {
        toast({
          title: "Character Saved",
          description: "Your character has been updated"
        })
        router.push(`/characters/${characterId}`)
      } else {
        const error = await response.json()
        toast({
          title: "Error",
          description: error.error || "Failed to save character",
          variant: "destructive"
        })
      }
    } catch (error) {
      console.error("Error saving character:", error)
      toast({
        title: "Error",
        description: "Failed to save character",
        variant: "destructive"
      })
    } finally {
      setIsSaving(false)
    }
  }

  if (status === "loading" || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin" />
        <p className="ml-2">Loading character...</p>
      </div>
    )
  }

  if (!character) {
    return null
  }

  return (
    <>
      <div className="min-h-screen p-4 md:p-8 bg-gradient-to-b from-stone-50 to-stone-100">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <Button
              variant="ghost"
              onClick={() => router.push(`/characters/${characterId}`)}
              className="gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Character
            </Button>
            <Button
              onClick={saveCharacter}
              disabled={isSaving}
              className="gap-2 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800"
            >
              {isSaving ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Save className="w-4 h-4" />
              )}
              Save Changes
            </Button>
          </div>

          <h1 className="text-3xl font-bold mb-6 font-cinzel">Edit Character: {character.name}</h1>

          <Tabs defaultValue="basic" className="space-y-6">
            <TabsList className="grid w-full grid-cols-6">
              <TabsTrigger value="basic">Basic</TabsTrigger>
              <TabsTrigger value="attributes">Attributes</TabsTrigger>
              <TabsTrigger value="abilities">Abilities</TabsTrigger>
              <TabsTrigger value="spheres">Spheres</TabsTrigger>
              <TabsTrigger value="backgrounds">Backgrounds</TabsTrigger>
              <TabsTrigger value="merits">Merits & Flaws</TabsTrigger>
            </TabsList>

            {/* Basic Info Tab */}
            <TabsContent value="basic" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Basic Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Name</Label>
                      <Input
                        value={character.name}
                        onChange={(e) => updateCharacter("name", e.target.value)}
                      />
                    </div>
                    <div>
                      <Label>Player</Label>
                      <Input
                        value={character.player || ""}
                        onChange={(e) => updateCharacter("player", e.target.value)}
                      />
                    </div>
                    <div>
                      <Label>Chronicle</Label>
                      <Input
                        value={character.chronicle || ""}
                        onChange={(e) => updateCharacter("chronicle", e.target.value)}
                      />
                    </div>
                    <div>
                      <Label>Faction/Tradition</Label>
                      <Input
                        value={character.faction}
                        onChange={(e) => updateCharacter("faction", e.target.value)}
                      />
                    </div>
                    <div>
                      <Label>Nature</Label>
                      <Input
                        value={character.nature || ""}
                        onChange={(e) => updateCharacter("nature", e.target.value)}
                      />
                    </div>
                    <div>
                      <Label>Demeanor</Label>
                      <Input
                        value={character.demeanor || ""}
                        onChange={(e) => updateCharacter("demeanor", e.target.value)}
                      />
                    </div>
                    <div>
                      <Label>Essence</Label>
                      <Input
                        value={character.essence || ""}
                        onChange={(e) => updateCharacter("essence", e.target.value)}
                      />
                    </div>
                    <div>
                      <Label>Sect</Label>
                      <Input
                        value={character.sect || ""}
                        onChange={(e) => updateCharacter("sect", e.target.value)}
                      />
                    </div>
                    <div className="col-span-2">
                      <Label>Concept</Label>
                      <Textarea
                        value={character.concept || ""}
                        onChange={(e) => updateCharacter("concept", e.target.value)}
                      />
                    </div>
                    <div className="col-span-2">
                      <Label>Avatar Description</Label>
                      <Textarea
                        value={character.avatar || ""}
                        onChange={(e) => updateCharacter("avatar", e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 pt-4">
                    <div>
                      <Label>Arete ({character.arete || 1})</Label>
                      <div className="mt-2">
                        <DotSelector
                          label="Arete"
                          value={character.arete || 1}
                          max={10}
                          onChange={(v) => updateCharacter("arete", v)}
                        />
                      </div>
                    </div>
                    <div>
                      <Label>Willpower ({character.willpower || 5})</Label>
                      <div className="mt-2">
                        <DotSelector
                          label="Willpower"
                          value={character.willpower || 5}
                          max={10}
                          onChange={(v) => updateCharacter("willpower", v)}
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Attributes Tab */}
            <TabsContent value="attributes" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Attributes</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-3 gap-6">
                    <div>
                      <h3 className="font-semibold mb-3">Physical</h3>
                      {character.attributes && (
                        <>
                          <DotSelector
                            label="Strength"
                            value={character.attributes.strength || 1}
                            onChange={(v) => updateAttribute("strength", v)}
                          />
                          <DotSelector
                            label="Dexterity"
                            value={character.attributes.dexterity || 1}
                            onChange={(v) => updateAttribute("dexterity", v)}
                          />
                          <DotSelector
                            label="Stamina"
                            value={character.attributes.stamina || 1}
                            onChange={(v) => updateAttribute("stamina", v)}
                          />
                        </>
                      )}
                    </div>
                    <div>
                      <h3 className="font-semibold mb-3">Social</h3>
                      {character.attributes && (
                        <>
                          <DotSelector
                            label="Charisma"
                            value={character.attributes.charisma || 1}
                            onChange={(v) => updateAttribute("charisma", v)}
                          />
                          <DotSelector
                            label="Manipulation"
                            value={character.attributes.manipulation || 1}
                            onChange={(v) => updateAttribute("manipulation", v)}
                          />
                          <DotSelector
                            label="Appearance"
                            value={character.attributes.appearance || 1}
                            onChange={(v) => updateAttribute("appearance", v)}
                          />
                        </>
                      )}
                    </div>
                    <div>
                      <h3 className="font-semibold mb-3">Mental</h3>
                      {character.attributes && (
                        <>
                          <DotSelector
                            label="Perception"
                            value={character.attributes.perception || 1}
                            onChange={(v) => updateAttribute("perception", v)}
                          />
                          <DotSelector
                            label="Intelligence"
                            value={character.attributes.intelligence || 1}
                            onChange={(v) => updateAttribute("intelligence", v)}
                          />
                          <DotSelector
                            label="Wits"
                            value={character.attributes.wits || 1}
                            onChange={(v) => updateAttribute("wits", v)}
                          />
                        </>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Abilities Tab */}
            <TabsContent value="abilities" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Abilities</CardTitle>
                  <p className="text-sm text-muted-foreground">Click on dots to edit</p>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-3 gap-6 max-h-[600px] overflow-y-auto">
                    <div>
                      <h3 className="font-semibold mb-3">Talents</h3>
                      {character.abilities && [
                        'alertness', 'art', 'athletics', 'awareness', 'brawl', 'empathy',
                        'expression', 'intimidation', 'leadership', 'streetwise', 'subterfuge'
                      ].map(ability => (
                        <DotSelector
                          key={ability}
                          label={ability}
                          value={character.abilities[ability] || 0}
                          max={5}
                          onChange={(v) => updateAbility(ability, v)}
                        />
                      ))}
                    </div>
                    <div>
                      <h3 className="font-semibold mb-3">Skills</h3>
                      {character.abilities && [
                        'crafts', 'drive', 'etiquette', 'firearms', 'martialArts',
                        'meditation', 'melee', 'research', 'stealth', 'survival', 'technology'
                      ].map(ability => (
                        <DotSelector
                          key={ability}
                          label={ability === 'martialArts' ? 'martialArts' : ability}
                          value={character.abilities[ability] || 0}
                          max={5}
                          onChange={(v) => updateAbility(ability, v)}
                        />
                      ))}
                    </div>
                    <div>
                      <h3 className="font-semibold mb-3">Knowledges</h3>
                      {character.abilities && [
                        'academics', 'computer', 'cosmology', 'enigmas', 'esoterica',
                        'investigation', 'law', 'medicine', 'occult', 'politics', 'science'
                      ].map(ability => (
                        <DotSelector
                          key={ability}
                          label={ability}
                          value={character.abilities[ability] || 0}
                          max={5}
                          onChange={(v) => updateAbility(ability, v)}
                        />
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Spheres Tab */}
            <TabsContent value="spheres" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Spheres</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-3 gap-4">
                    {character.spheres && Object.keys(character.spheres).map(sphere => (
                      <DotSelector
                        key={sphere}
                        label={sphere}
                        value={character.spheres[sphere] || 0}
                        max={5}
                        onChange={(v) => updateSphere(sphere, v)}
                      />
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Backgrounds Tab */}
            <TabsContent value="backgrounds" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Backgrounds</CardTitle>
                </CardHeader>
                <CardContent>
                  {character.backgrounds && Object.keys(character.backgrounds).map(bg => (
                    <DotSelector
                      key={bg}
                      label={bg.replace(/([A-Z])/g, ' $1').trim()}
                      value={character.backgrounds[bg] || 0}
                      max={5}
                      onChange={(v) => updateBackground(bg, v)}
                    />
                  ))}
                  {(!character.backgrounds || Object.keys(character.backgrounds).length === 0) && (
                    <p className="text-muted-foreground">No backgrounds assigned</p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Merits & Flaws Tab */}
            <TabsContent value="merits" className="space-y-4">
              <div className="grid grid-cols-2 gap-6">
                {/* Merits */}
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>Merits</CardTitle>
                    <Dialog open={meritsDialogOpen} onOpenChange={setMeritsDialogOpen}>
                      <DialogTrigger asChild>
                        <Button size="sm" className="gap-1">
                          <Plus className="w-4 h-4" />
                          Add Merit
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl max-h-[80vh]">
                        <DialogHeader>
                          <DialogTitle>Add Merit</DialogTitle>
                          <DialogDescription>Select a merit to add to your character</DialogDescription>
                        </DialogHeader>
                        <ScrollArea className="h-[400px]">
                          <div className="space-y-2">
                            {meritsList.map(merit => (
                              <Card
                                key={merit.id}
                                className="p-3 cursor-pointer hover:bg-accent"
                                onClick={() => addMerit(merit)}
                              >
                                <div className="flex justify-between items-start">
                                  <div>
                                    <h4 className="font-semibold">{merit.name}</h4>
                                    <p className="text-xs text-muted-foreground">{merit.description}</p>
                                  </div>
                                  <Badge>{Math.abs(merit.cost)} pts</Badge>
                                </div>
                              </Card>
                            ))}
                          </div>
                        </ScrollArea>
                      </DialogContent>
                    </Dialog>
                  </CardHeader>
                  <CardContent>
                    {character.merits && character.merits.length > 0 ? (
                      <div className="space-y-2">
                        {character.merits.map((merit, idx) => (
                          <div key={idx} className="flex justify-between items-center p-2 bg-accent/10 rounded">
                            <span className="text-sm">{merit.name} ({merit.cost} pts)</span>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => removeMerit(idx)}
                            >
                              <X className="w-4 h-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-muted-foreground">No merits selected</p>
                    )}
                  </CardContent>
                </Card>

                {/* Flaws */}
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>Flaws</CardTitle>
                    <Dialog open={flawsDialogOpen} onOpenChange={setFlawsDialogOpen}>
                      <DialogTrigger asChild>
                        <Button size="sm" variant="secondary" className="gap-1">
                          <Plus className="w-4 h-4" />
                          Add Flaw
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl max-h-[80vh]">
                        <DialogHeader>
                          <DialogTitle>Add Flaw</DialogTitle>
                          <DialogDescription>Select a flaw to add to your character (max 7 points)</DialogDescription>
                        </DialogHeader>
                        <ScrollArea className="h-[400px]">
                          <div className="space-y-2">
                            {flawsList.map(flaw => (
                              <Card
                                key={flaw.id}
                                className="p-3 cursor-pointer hover:bg-accent"
                                onClick={() => addFlaw(flaw)}
                              >
                                <div className="flex justify-between items-start">
                                  <div>
                                    <h4 className="font-semibold">{flaw.name}</h4>
                                    <p className="text-xs text-muted-foreground">{flaw.description}</p>
                                  </div>
                                  <Badge className="bg-green-600">+{Math.abs(flaw.cost)} pts</Badge>
                                </div>
                              </Card>
                            ))}
                          </div>
                        </ScrollArea>
                      </DialogContent>
                    </Dialog>
                  </CardHeader>
                  <CardContent>
                    {character.flaws && character.flaws.length > 0 ? (
                      <div className="space-y-2">
                        {character.flaws.map((flaw, idx) => (
                          <div key={idx} className="flex justify-between items-center p-2 bg-green-50 rounded">
                            <span className="text-sm">{flaw.name} (+{flaw.cost} pts)</span>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => removeFlaw(idx)}
                            >
                              <X className="w-4 h-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-muted-foreground">No flaws selected</p>
                    )}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
      <Toaster />
    </>
  )
}
