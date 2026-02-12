"use client"

import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { getTraditionSymbol, getSphereDots } from "@/lib/mage-data"
import { BookOpen, Plus, ArrowLeft, X } from "lucide-react"
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
      } else {
        throw new Error("Failed to remove rote")
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to remove rote",
        variant: "destructive",
      })
    }
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
                Back to Characters
              </Button>
            </div>

          {/* Character Info Card */}
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
                  <p className="text-lg text-muted-foreground">
                    {character.faction}
                  </p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="grid md:grid-cols-2 gap-4">
              {character.concept && (
                <div>
                  <span className="font-semibold">Concept:</span> {character.concept}
                </div>
              )}
              {character.arete && (
                <div>
                  <span className="font-semibold">Arete:</span> {character.arete}
                </div>
              )}
              {character.essence && (
                <div>
                  <span className="font-semibold">Essence:</span> {character.essence}
                </div>
              )}
              {character.avatar && (
                <div className="md:col-span-2">
                  <span className="font-semibold">Avatar:</span> {character.avatar}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Rotes Section */}
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
          </div>
        </div>
      </div>
      <Toaster />
    </>
  )
}
