"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import type { Rote } from "@/lib/mage-data"
import { getTraditionSymbol, isTechnocracySphere } from "@/lib/mage-data"
import { SphereDots } from "@/components/sphere-dots"
import { MarkdownRenderer } from "@/components/ui/markdown-renderer"
import { GrimoireHeader } from "@/components/grimoire-header"
import { GrimoireFooter } from "@/components/grimoire-footer"
import { Button } from "@/components/ui/button"
import { ShareButton } from "@/components/share-button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { Toaster } from "@/components/ui/toaster"
import { ArrowLeft, UserPlus, Home } from "lucide-react"
import Link from "next/link"
import Head from "next/head"

interface RotePageClientProps {
  id: string
}

interface Character {
  id: string
  name: string
  faction: string
}

function formatSpheres(spheres: any): { [key: string]: number } {
  if (Array.isArray(spheres) && spheres.length === 1) {
    return spheres[0];
  }
  
  if (Array.isArray(spheres) && spheres.length > 1) {
    return spheres[0];
  }
  
  if (typeof spheres === 'object' && !Array.isArray(spheres)) {
    return spheres;
  }
  
  return {};
}

function getAllCombinations(spheres: any): Array<{ [key: string]: number }> {
  if (Array.isArray(spheres)) {
    return spheres;
  }
  
  if (typeof spheres === 'object' && !Array.isArray(spheres)) {
    return [spheres];
  }
  
  return [];
}

export default function RotePageClient({ id }: RotePageClientProps) {
  const router = useRouter()
  const { data: session } = useSession()
  const { toast } = useToast()
  
  const [rote, setRote] = useState<Rote | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [characters, setCharacters] = useState<Character[]>([])
  const [selectedCharacterId, setSelectedCharacterId] = useState<string>("")
  const [isAddingToCharacter, setIsAddingToCharacter] = useState(false)

  // Fetch the rote
  useEffect(() => {
    const fetchRote = async () => {
      try {
        const response = await fetch(`/api/rotes/${id}`)
        if (response.ok) {
          const data = await response.json()
          setRote(data)
        } else {
          router.push('/browse')
        }
      } catch (error) {
        console.error('Error fetching rote:', error)
        router.push('/browse')
      } finally {
        setIsLoading(false)
      }
    }

    if (id) {
      fetchRote()
    }
  }, [id, router])

  // Fetch user's characters when logged in
  useEffect(() => {
    if (session?.user?.id) {
      fetchCharacters()
    }
  }, [session])

  const fetchCharacters = async () => {
    try {
      const response = await fetch('/api/characters')
      if (response.ok) {
        const data = await response.json()
        setCharacters(data)
      }
    } catch (error) {
      console.error('Error fetching characters:', error)
    }
  }

  const handleAddToCharacter = async () => {
    if (!selectedCharacterId || !rote) return

    setIsAddingToCharacter(true)
    try {
      const response = await fetch(`/api/characters/${selectedCharacterId}/rotes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ roteId: rote.id }),
      })

      if (response.ok) {
        toast({
          title: "Rote Added!",
          description: `${rote.name} has been added to your character's grimoire.`,
        })
        setSelectedCharacterId("")
      } else {
        const data = await response.json()
        toast({
          title: "Failed to Add Rote",
          description: data.error || "This rote may already be in your character's grimoire.",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add rote to character.",
        variant: "destructive",
      })
    } finally {
      setIsAddingToCharacter(false)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex items-center gap-3">
          <span className="text-2xl text-accent animate-spin">⚙</span>
          <p className="text-muted-foreground">Loading rote...</p>
        </div>
      </div>
    )
  }

  if (!rote) {
    return null
  }

  const sphereData = formatSpheres(rote.spheres)
  const allCombinations = getAllCombinations(rote.spheres)
  const hasMultipleCombinations = allCombinations.length > 1

  return (
    <>
      <div className="min-h-screen relative z-[1] py-6 px-3 md:py-8 md:px-4">
        <div className="max-w-[1400px] mx-auto bg-background border-[3px] border-primary rounded-lg overflow-hidden relative
          shadow-[0_0_0_1px_hsl(42_42%_59%),0_0_0_8px_hsl(36_42%_88%),0_0_0_11px_hsl(300_45%_20%),inset_0_0_80px_rgba(139,71,38,0.08),0_14px_40px_rgba(26,21,16,0.25)]">
          
          {/* Corner decorations */}
          <div className="absolute -top-2 -left-2 text-4xl text-ring drop-shadow-[0_0_10px_rgba(107,45,107,0.8)] z-10 font-serif" aria-hidden="true">
            {'\u25C8'}
          </div>
          <div className="absolute -top-2 -right-2 text-4xl text-ring drop-shadow-[0_0_10px_rgba(107,45,107,0.8)] z-10 font-serif" aria-hidden="true">
            {'\u25C8'}
          </div>

          {/* Top ornamental border */}
          <div
            className="h-1 w-full"
            style={{
              background: 'linear-gradient(90deg, transparent 0%, hsl(42 42% 59%) 10%, hsl(300 45% 30%) 30%, hsl(42 42% 59%) 50%, hsl(300 45% 30%) 70%, hsl(42 42% 59%) 90%, transparent 100%)',
              boxShadow: '0 1px 3px rgba(107,45,107,0.5)',
            }}
            aria-hidden="true"
          />

          <GrimoireHeader />

          {/* Navigation */}
          <div className="px-6 py-4 border-b-2 border-primary/20 flex justify-between items-center flex-wrap gap-3">
            <Link href="/browse">
              <Button variant="outline" className="gap-2">
                <ArrowLeft className="w-4 h-4" />
                Back to Browse
              </Button>
            </Link>
            
            <ShareButton 
              url={`/rotes/${rote.id}`}
              title={rote.name}
            />
          </div>

          {/* Main content */}
          <main
            className="min-h-[500px]"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 0 L 30 60 M 0 30 L 60 30' stroke='%234a1a4a' strokeWidth='0.3' opacity='0.06'/%3E%3C/svg%3E")`,
            }}
          >
            <div className="animate-fade-in-up flex flex-col gap-6 p-6 md:p-10">
              {/* Add to Character - Only show if logged in */}
              {session?.user && characters.length > 0 && (
                <div className="bg-accent/10 border-2 border-accent rounded-md p-4 flex flex-col sm:flex-row gap-3 items-start sm:items-center">
                  <UserPlus className="w-5 h-5 text-accent flex-shrink-0" />
                  <div className="flex-1 flex flex-col sm:flex-row gap-3 items-start sm:items-center w-full">
                    <span className="font-serif font-semibold text-primary">Add to Character:</span>
                    <Select value={selectedCharacterId} onValueChange={setSelectedCharacterId}>
                      <SelectTrigger className="w-full sm:w-64">
                        <SelectValue placeholder="Select a character..." />
                      </SelectTrigger>
                      <SelectContent>
                        {characters.map((character) => (
                          <SelectItem key={character.id} value={character.id}>
                            {character.name} ({character.faction})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Button
                      onClick={handleAddToCharacter}
                      disabled={!selectedCharacterId || isAddingToCharacter}
                      className="w-full sm:w-auto"
                    >
                      {isAddingToCharacter ? "Adding..." : "Add Rote"}
                    </Button>
                  </div>
                </div>
              )}

              {/* Show message if logged in but no characters */}
              {session?.user && characters.length === 0 && (
                <div className="bg-muted border-2 border-primary/30 rounded-md p-4 text-center">
                  <p className="text-sm text-muted-foreground">
                    Create a character to add rotes to your grimoire.{" "}
                    <Link href="/character-guide" className="text-primary underline hover:text-accent">
                      Create Character
                    </Link>
                  </p>
                </div>
              )}

              {/* Detail card */}
              <div
                className="bg-background border-4 border-double border-primary rounded-lg p-8 md:p-12
                  shadow-[inset_0_0_60px_rgba(139,71,38,0.08)]"
              >
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start gap-6 mb-8 pb-8 border-b-[3px] border-double border-primary">
                  <h2 className="font-serif text-3xl md:text-4xl font-black text-primary uppercase tracking-wide leading-tight
                    drop-shadow-[2px_2px_0_rgba(201,169,97,0.3)]">
                    {rote.name}
                  </h2>
                  <span className="inline-flex items-center gap-3 px-5 py-3 bg-primary/15 border-[3px] border-primary rounded-md text-primary font-mono text-lg font-bold italic shrink-0">
                    <span className="text-accent text-xl">{getTraditionSymbol(rote.tradition)}</span>
                    {rote.tradition}
                  </span>
                </div>

                {/* Description */}
                <div
                  className="bg-background/30 border-2 border-primary border-l-[5px] border-l-ring rounded-md p-6 md:p-8 mb-8
                    shadow-[inset_2px_2px_10px_rgba(0,0,0,0.05)]"
                >
                  <div className="font-mono text-foreground text-lg leading-loose">
                    <MarkdownRenderer content={rote.description} />
                  </div>
                </div>

                {/* Spheres */}
                <div className="bg-accent/10 border-[3px] border-double border-primary rounded-md p-6 md:p-8 mb-8
                  shadow-[inset_0_0_30px_rgba(139,71,38,0.05)]">
                  <h3 className="font-serif text-xl font-bold text-primary uppercase tracking-[0.15em] mb-6">
                    {hasMultipleCombinations ? "Sphere Combinations" : "Required Spheres"}
                  </h3>
                  
                  {hasMultipleCombinations ? (
                    <div className="space-y-6">
                      {allCombinations.map((combo, index) => (
                        <div key={index}>
                          <h4 className="font-serif text-sm font-semibold text-accent uppercase tracking-widest mb-3">
                            Option {index + 1}:
                          </h4>
                          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                            {Object.entries(combo).map(([sphere, level]) => {
                              const isTechno = isTechnocracySphere(sphere)
                              return (
                                <div
                                  key={sphere}
                                  className={`rounded-md px-5 py-4 flex flex-col gap-2
                                    ${isTechno
                                      ? "bg-foreground/5 border-2 border-foreground/40 border-l-[5px] border-l-foreground/60"
                                      : "bg-background border-2 border-primary border-l-[5px] border-l-accent"
                                    }`}
                                >
                                  <span className={`font-serif text-sm font-bold uppercase tracking-widest ${isTechno ? "text-foreground" : "text-primary"}`}>
                                    {sphere}
                                  </span>
                                  <SphereDots level={level} size="lg" />
                                  <span className="font-mono text-xs text-muted-foreground italic">
                                    Level {level}
                                  </span>
                                </div>
                              )
                            })}
                          </div>
                          {index < allCombinations.length - 1 && (
                            <div className="mt-4 text-center text-sm font-serif font-bold text-muted-foreground">
                              — OR —
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                      {Object.entries(sphereData).map(([sphere, level]) => {
                        const isTechno = isTechnocracySphere(sphere)
                        return (
                          <div
                            key={sphere}
                            className={`rounded-md px-5 py-4 flex flex-col gap-2
                              ${isTechno
                                ? "bg-foreground/5 border-2 border-foreground/40 border-l-[5px] border-l-foreground/60"
                                : "bg-background border-2 border-primary border-l-[5px] border-l-accent"
                              }`}
                          >
                            <span className={`font-serif text-sm font-bold uppercase tracking-widest ${isTechno ? "text-foreground" : "text-primary"}`}>
                              {sphere}
                            </span>
                            <SphereDots level={level} size="lg" />
                            <span className="font-mono text-xs text-muted-foreground italic">
                              Level {level}
                            </span>
                          </div>
                        )
                      })}
                    </div>
                  )}
                </div>

                {/* Level badge */}
                <div
                  className="font-serif bg-primary/20 border-2 border-primary border-l-[5px] border-l-accent rounded-md
                    px-6 py-4 mb-8 text-xl font-bold text-primary uppercase tracking-[0.15em]"
                >
                  Rank: {rote.level}
                </div>

                {/* Page reference */}
                {rote.pageRef && (
                  <div className="font-mono text-muted-foreground text-sm italic pt-6 border-t-2 border-primary">
                    Source: {rote.pageRef}
                  </div>
                )}

                {/* Creator info */}
                {rote.user && (
                  <div className="mt-6 pt-6 border-t-2 border-primary/30">
                    <p className="text-sm text-muted-foreground font-mono italic">
                      Created by {rote.user.name || rote.user.email}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </main>

          <GrimoireFooter />
        </div>
      </div>
      <Toaster />
    </>
  )
}
