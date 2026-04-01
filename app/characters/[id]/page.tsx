"use client"
 
import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { getTraditionSymbol, getSphereDots } from "@/lib/mage-data"
import { BookOpen, Plus, ArrowLeft, X, Edit } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { Toaster } from "@/components/ui/toaster"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { GrimoireHeader } from "@/components/grimoire-header"
 
export default function CharacterSheetPage({
  params,
}: {
  params: { id: string }
}) {
  const { status } = useSession()
  const router = useRouter()
  const { toast } = useToast()
  const [character, setCharacter] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [allRotes, setAllRotes] = useState<any[]>([])
  const [rotesDialogOpen, setRotesDialogOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
 
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin")
    }
  }, [status, router])
 
  useEffect(() => {
    if (status === "authenticated") {
      fetchCharacter()
      fetchAllRotes()
    }
  }, [status, params.id])
 
  const fetchCharacter = async () => {
    try {
      const response = await fetch(`/api/characters/${params.id}`)
      if (response.ok) {
        const data = await response.json()
        console.log("Character data:", data) // Debug log
        setCharacter(data)
      } else {
        router.push("/dashboard")
      }
    } catch (error) {
      console.error("Error fetching character:", error)
    } finally {
      setIsLoading(false)
    }
  }
 
  const fetchAllRotes = async () => {
    try {
      const response = await fetch("/api/rotes")
      if (response.ok) {
        const data = await response.json()
        setAllRotes(data)
      }
    } catch (error) {
      console.error("Error fetching rotes:", error)
    }
  }
 
  const handleAssignRote = async (roteId: string) => {
    try {
      const response = await fetch(`/api/characters/${params.id}/rotes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ roteId }),
      })
 
      if (response.ok) {
        toast({
          title: "Rote Assigned",
          description: "The rote has been added to your character",
        })
        fetchCharacter()
      } else {
        const data = await response.json()
        toast({
          title: "Error",
          description: data.error || "Failed to assign rote",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to assign rote",
        variant: "destructive",
      })
    }
  }
 
  const handleRemoveRote = async (roteId: string) => {
    try {
      const response = await fetch(
        `/api/characters/${params.id}/rotes?roteId=${roteId}`,
        {
          method: "DELETE",
        }
      )
 
      if (response.ok) {
        toast({
          title: "Rote Removed",
          description: "The rote has been removed from your character",
        })
        fetchCharacter()
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to remove rote",
        variant: "destructive",
      })
    }
  }
 
  // Helper to render dots
  const renderDots = (value: number, max: number = 5) => {
    // Ensure value is a number
    const numValue = typeof value === 'number' ? value : 0
    return (
      <div className="flex gap-1">
        {[...Array(max)].map((_, i) => (
          <div
            key={i}
            className="w-4 h-4 rounded-full border-2"
            style={{
              borderColor: '#8b4513',
              backgroundColor: i < numValue ? '#8b4513' : 'transparent'
            }}
          />
        ))}
      </div>
    )
  }
 
  if (status === "loading" || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Loading character...</p>
      </div>
    )
  }
 
  if (!character) {
    return null
  }
 
  const assignedRoteIds = new Set(
    character.rotes?.map((cr: any) => cr.rote.id) || []
  )
  const availableRotes = allRotes.filter((rote) => {
    const isNotAssigned = !assignedRoteIds.has(rote.id)
    const matchesSearch =
      searchTerm === "" ||
      rote.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rote.tradition.toLowerCase().includes(searchTerm.toLowerCase())
    return isNotAssigned && matchesSearch
  })
 
  return (
    <>
      <div className="min-h-screen relative z-[1]">
        <div className="max-w-[1400px] mx-auto bg-background border-[3px] border-primary rounded-lg overflow-hidden relative my-6 mx-3 md:my-8 md:mx-4
          shadow-[0_0_0_1px_hsl(42_42%_59%),0_0_0_8px_hsl(36_42%_88%),0_0_0_11px_hsl(300_45%_20%),inset_0_0_80px_rgba(139,71,38,0.08),0_14px_40px_rgba(26,21,16,0.25)]">
          
          <GrimoireHeader />
          
          <div className="p-6 md:p-10 space-y-6">
            {/* Navigation */}
            <div className="flex items-center justify-between">
              <Button
                variant="ghost"
                onClick={() => router.push("/dashboard")}
                className="gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Dashboard
              </Button>
              <Button
                variant="outline"
                className="gap-2"
                onClick={() => router.push(`/characters/${params.id}/edit`)}
              >
                <Edit className="w-4 h-4" />
                Edit Character
              </Button>
            </div>
 
            {/* Character Header */}
            <Card className="border-2 border-primary">
              <CardHeader>
                <div className="flex items-center gap-4">
                  <div className="text-6xl" aria-hidden="true">
                    {getTraditionSymbol(character.faction)}
                  </div>
                  <div>
                    <CardTitle className="text-3xl font-cinzel text-primary">
                      {character.name}
                    </CardTitle>
                    <div className="flex gap-2 mt-2 flex-wrap">
                      <Badge variant="outline">{character.faction}</Badge>
                      {character.essence && <Badge variant="secondary">{character.essence}</Badge>}
                      {character.arete && <Badge variant="default">Arete {character.arete}</Badge>}
                      {character.concept && <Badge variant="outline">{character.concept}</Badge>}
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="grid md:grid-cols-3 gap-4">
                {character.player && (
                  <div><span className="font-semibold">Player:</span> {character.player}</div>
                )}
                {character.chronicle && (
                  <div><span className="font-semibold">Chronicle:</span> {character.chronicle}</div>
                )}
                {character.nature && (
                  <div><span className="font-semibold">Nature:</span> {character.nature}</div>
                )}
                {character.demeanor && (
                  <div><span className="font-semibold">Demeanor:</span> {character.demeanor}</div>
                )}
                {character.sect && (
                  <div><span className="font-semibold">Sect:</span> {character.sect}</div>
                )}
                {character.avatar && (
                  <div><span className="font-semibold">Avatar:</span> {character.avatar}</div>
                )}
              </CardContent>
            </Card>
 
            {/* Character Sheet Tabs */}
            <Tabs defaultValue="stats" className="space-y-6">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="stats">Stats</TabsTrigger>
                <TabsTrigger value="abilities">Abilities</TabsTrigger>
                <TabsTrigger value="spheres">Spheres</TabsTrigger>
                <TabsTrigger value="rotes">Rotes ({character.rotes?.length || 0})</TabsTrigger>
              </TabsList>
 
              {/* Stats Tab */}
              <TabsContent value="stats" className="space-y-4">
                {/* Attributes */}
                {character.attributes && (
                  <Card className="border-2 border-primary">
                    <CardHeader>
                      <CardTitle className="font-cinzel">Attributes</CardTitle>
                    </CardHeader>
                    <CardContent className="grid md:grid-cols-3 gap-6">
                      <div>
                        <h4 className="font-semibold mb-3">Physical</h4>
                        <div className="space-y-2">
                          <div className="flex justify-between items-center">
                            <span>Strength</span>
                            {renderDots(character.attributes.strength, 5)}
                          </div>
                          <div className="flex justify-between items-center">
                            <span>Dexterity</span>
                            {renderDots(character.attributes.dexterity, 5)}
                          </div>
                          <div className="flex justify-between items-center">
                            <span>Stamina</span>
                            {renderDots(character.attributes.stamina, 5)}
                          </div>
                        </div>
                      </div>
                      <div>
                        <h4 className="font-semibold mb-3">Social</h4>
                        <div className="space-y-2">
                          <div className="flex justify-between items-center">
                            <span>Charisma</span>
                            {renderDots(character.attributes.charisma, 5)}
                          </div>
                          <div className="flex justify-between items-center">
                            <span>Manipulation</span>
                            {renderDots(character.attributes.manipulation, 5)}
                          </div>
                          <div className="flex justify-between items-center">
                            <span>Appearance</span>
                            {renderDots(character.attributes.appearance, 5)}
                          </div>
                        </div>
                      </div>
                      <div>
                        <h4 className="font-semibold mb-3">Mental</h4>
                        <div className="space-y-2">
                          <div className="flex justify-between items-center">
                            <span>Perception</span>
                            {renderDots(character.attributes.perception, 5)}
                          </div>
                          <div className="flex justify-between items-center">
                            <span>Intelligence</span>
                            {renderDots(character.attributes.intelligence, 5)}
                          </div>
                          <div className="flex justify-between items-center">
                            <span>Wits</span>
                            {renderDots(character.attributes.wits, 5)}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}
 
                {/* Arete & Willpower */}
                <div className="grid md:grid-cols-2 gap-4">
                  <Card className="border-2 border-accent">
                    <CardHeader>
                      <CardTitle className="font-cinzel">Arete</CardTitle>
                    </CardHeader>
                    <CardContent>
                      {renderDots(character.arete || 1, 10)}
                    </CardContent>
                  </Card>
                  <Card className="border-2 border-primary">
                    <CardHeader>
                      <CardTitle className="font-cinzel">Willpower</CardTitle>
                    </CardHeader>
                    <CardContent>
                      {renderDots(character.willpower || 5, 10)}
                    </CardContent>
                  </Card>
                </div>
 
                {/* Backgrounds */}
                {character.backgrounds && Object.keys(character.backgrounds).length > 0 && (
                  <Card className="border-2 border-primary">
                    <CardHeader>
                      <CardTitle className="font-cinzel">Backgrounds</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      {Object.entries(character.backgrounds).map(([name, value]: [string, any]) => (
                        <div key={name} className="flex justify-between items-center">
                          <span className="capitalize">{name.replace(/([A-Z])/g, ' $1').trim()}</span>
                          {renderDots(value, 5)}
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                )}
 
                {/* Merits & Flaws */}
                {(character.merits?.length > 0 || character.flaws?.length > 0) && (
                  <div className="grid md:grid-cols-2 gap-4">
                    {character.merits && character.merits.length > 0 && (
                      <Card className="border-2 border-primary">
                        <CardHeader>
                          <CardTitle className="font-cinzel">Merits</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <ul className="space-y-1">
                            {character.merits.map((merit: any, idx: number) => (
                              <li key={idx} className="text-sm">
                                {merit.name} <Badge variant="outline">{merit.cost} pts</Badge>
                              </li>
                            ))}
                          </ul>
                        </CardContent>
                      </Card>
                    )}
                    {character.flaws && character.flaws.length > 0 && (
                      <Card className="border-2 border-primary">
                        <CardHeader>
                          <CardTitle className="font-cinzel">Flaws</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <ul className="space-y-1">
                            {character.flaws.map((flaw: any, idx: number) => (
                              <li key={idx} className="text-sm">
                                {flaw.name} <Badge variant="outline" className="bg-green-100">+{flaw.cost} pts</Badge>
                              </li>
                            ))}
                          </ul>
                        </CardContent>
                      </Card>
                    )}
                  </div>
                )}
              </TabsContent>
 
              {/* Abilities Tab */}
              <TabsContent value="abilities" className="space-y-4">
                {character.abilities && (
                  <Card className="border-2 border-primary">
                    <CardHeader>
                      <CardTitle className="font-cinzel">Abilities</CardTitle>
                    </CardHeader>
                    <CardContent className="grid md:grid-cols-3 gap-6 max-h-[600px] overflow-y-auto">
                      <div>
                        <h4 className="font-semibold mb-3">Talents</h4>
                        <div className="space-y-2">
                          {['alertness', 'art', 'athletics', 'awareness', 'brawl', 'empathy', 'expression', 'intimidation', 'leadership', 'streetwise', 'subterfuge'].map(ability => {
                            const value = character.abilities[ability] || 0
                            if (value === 0) return null
                            return (
                              <div key={ability} className="flex justify-between items-center">
                                <span className="capitalize">{ability}</span>
                                {renderDots(value, 5)}
                              </div>
                            )
                          })}
                        </div>
                      </div>
                      <div>
                        <h4 className="font-semibold mb-3">Skills</h4>
                        <div className="space-y-2">
                          {['crafts', 'drive', 'etiquette', 'firearms', 'martialArts', 'meditation', 'melee', 'research', 'stealth', 'survival', 'technology'].map(ability => {
                            const value = character.abilities[ability] || 0
                            if (value === 0) return null
                            const label = ability === 'martialArts' ? 'Martial Arts' : ability
                            return (
                              <div key={ability} className="flex justify-between items-center">
                                <span className="capitalize">{label}</span>
                                {renderDots(value, 5)}
                              </div>
                            )
                          })}
                        </div>
                      </div>
                      <div>
                        <h4 className="font-semibold mb-3">Knowledges</h4>
                        <div className="space-y-2">
                          {['academics', 'computer', 'cosmology', 'enigmas', 'esoterica', 'investigation', 'law', 'medicine', 'occult', 'politics', 'science'].map(ability => {
                            const value = character.abilities[ability] || 0
                            if (value === 0) return null
                            return (
                              <div key={ability} className="flex justify-between items-center">
                                <span className="capitalize">{ability}</span>
                                {renderDots(value, 5)}
                              </div>
                            )
                          })}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}
 
                {/* Specialties */}
                {character.specialties && Object.keys(character.specialties).length > 0 && (
                  <Card className="border-2 border-accent">
                    <CardHeader>
                      <CardTitle className="font-cinzel">Specialties</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-1">
                        {Object.entries(character.specialties).map(([ability, specialty]: [string, any]) => (
                          <li key={ability} className="text-sm">
                            <span className="capitalize font-semibold">{ability}:</span> {specialty}
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>
 
              {/* Spheres Tab */}
              <TabsContent value="spheres">
                {character.spheres && (
                  <Card className="border-2 border-ring">
                    <CardHeader>
                      <CardTitle className="font-cinzel">Spheres</CardTitle>
                    </CardHeader>
                    <CardContent className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {Object.entries(character.spheres).map(([sphere, value]: [string, any]) => (
                        <div key={sphere} className="flex justify-between items-center">
                          <span className="capitalize">{sphere}</span>
                          {renderDots(value, 5)}
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                )}
              </TabsContent>
 
              {/* Rotes Tab */}
              <TabsContent value="rotes" className="space-y-4">
                <Card className="border-2 border-primary">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-2xl font-cinzel text-primary">
                          Known Rotes
                        </CardTitle>
                        <p className="text-sm text-muted-foreground">
                          {character.rotes?.length || 0} rotes learned
                        </p>
                      </div>
                      <Dialog open={rotesDialogOpen} onOpenChange={setRotesDialogOpen}>
                        <DialogTrigger asChild>
                          <Button className="gap-2">
                            <Plus className="w-4 h-4" />
                            Assign Rote
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-3xl max-h-[80vh]">
                          <DialogHeader>
                            <DialogTitle>Assign Rote to {character.name}</DialogTitle>
                            <DialogDescription>
                              Browse the grimoire and assign rotes to your character
                            </DialogDescription>
                          </DialogHeader>
                          <div className="space-y-4">
                            <Input
                              placeholder="Search rotes..."
                              value={searchTerm}
                              onChange={(e) => setSearchTerm(e.target.value)}
                            />
                            <ScrollArea className="h-[400px]">
                              <div className="space-y-2">
                                {availableRotes.map((rote) => (
                                  <Card
                                    key={rote.id}
                                    className="p-4 hover:bg-accent cursor-pointer"
                                    onClick={() => {
                                      handleAssignRote(rote.id)
                                      setRotesDialogOpen(false)
                                      setSearchTerm("")
                                    }}
                                  >
                                    <div className="flex justify-between items-start">
                                      <div>
                                        <h4 className="font-semibold">{rote.name}</h4>
                                        <p className="text-sm text-muted-foreground">
                                          {rote.tradition} • {rote.level}
                                        </p>
                                        <div className="flex gap-2 mt-2">
                                          {Object.entries(rote.spheres).map(
                                            ([sphere, level]: [string, any]) => (
                                              <Badge key={sphere} variant="secondary">
                                                {sphere} {getSphereDots(level)}
                                              </Badge>
                                            )
                                          )}
                                        </div>
                                      </div>
                                    </div>
                                  </Card>
                                ))}
                                {availableRotes.length === 0 && (
                                  <p className="text-center text-muted-foreground py-8">
                                    {searchTerm
                                      ? "No rotes found"
                                      : "All available rotes have been assigned"}
                                  </p>
                                )}
                              </div>
                            </ScrollArea>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {character.rotes && character.rotes.length > 0 ? (
                      <div className="space-y-4">
                        {character.rotes.map((characterRote: any) => (
                          <Card key={characterRote.id} className="p-4">
                            <div className="flex justify-between items-start">
                              <div className="flex-1">
                                <div className="flex items-center gap-2">
                                  <h4 className="font-semibold text-lg">
                                    {characterRote.rote.name}
                                  </h4>
                                </div>
                                <p className="text-sm text-muted-foreground">
                                  {characterRote.rote.tradition} • {characterRote.rote.level}
                                </p>
                                <p className="text-sm mt-2">
                                  {characterRote.rote.description}
                                </p>
                                <div className="flex flex-wrap gap-2 mt-3">
                                  {Object.entries(characterRote.rote.spheres).map(
                                    ([sphere, level]: [string, any]) => (
                                      <Badge key={sphere} variant="secondary">
                                        {sphere} {getSphereDots(level)}
                                      </Badge>
                                    )
                                  )}
                                </div>
                                {characterRote.rote.pageRef && (
                                  <p className="text-xs text-muted-foreground mt-2">
                                    {characterRote.rote.pageRef}
                                  </p>
                                )}
                              </div>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleRemoveRote(characterRote.rote.id)}
                              >
                                <X className="w-4 h-4" />
                              </Button>
                            </div>
                          </Card>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <BookOpen className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                        <p className="text-muted-foreground">
                          No rotes assigned yet. Start building your grimoire!
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
      <Toaster />
    </>
  )
}
