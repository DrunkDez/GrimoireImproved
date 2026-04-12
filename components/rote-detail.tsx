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
import { ArrowLeft, UserPlus } from "lucide-react"
import Link from "next/link"

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
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ roteId: rote.id }),
      })

      if (response.ok) {
        toast({
          title: "Rote added!",
          description: `${rote.name} has been added to your character's grimoire.`,
        })
        setSelectedCharacterId("")
      } else {
        const error = await response.json()
        toast({
          title: "Error",
          description: error.error || "Failed to add rote to character",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add rote to character",
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
      <div className="min-h-screen relative z-[1] py-3 px-2 sm:py-4 sm:px-3 md:py-6 md:px-4">
        <div className="max-w-[1400px] mx-auto bg-background border-2 md:border-[3px] border-primary rounded-lg overflow-hidden relative
          shadow-[0_0_0_1px_hsl(42_42%_59%),0_0_0_4px_hsl(36_42%_88%),0_0_0_6px_hsl(300_45%_20%),inset_0_0_40px_rgba(139,71,38,0.08),0_8px_20px_rgba(26,21,16,0.25)]
          md:shadow-[0_0_0_1px_hsl(42_42%_59%),0_0_0_8px_hsl(36_42%_88%),0_0_0_11px_hsl(300_45%_20%),inset_0_0_80px_rgba(139,71,38,0.08),0_14px_40px_rgba(26,21,16,0.25)]">
          
          {/* Corner decorations - smaller on mobile */}
          <div className="absolute -top-1 -left-1 md:-top-2 md:-left-2 text-2xl md:text-4xl text-ring drop-shadow-[0_0_8px_rgba(107,45,107,0.8)] md:drop-shadow-[0_0_10px_rgba(107,45,107,0.8)] z-10 font-serif" aria-hidden="true">
            {'\u25C8'}
          </div>
          <div className="absolute -top-1 -right-1 md:-top-2 md:-right-2 text-2xl md:text-4xl text-ring drop-shadow-[0_0_8px_rgba(107,45,107,0.8)] md:drop-shadow-[0_0_10px_rgba(107,45,107,0.8)] z-10 font-serif" aria-hidden="true">
            {'\u25C8'}
          </div>

          {/* Top ornamental border */}
          <div
            className="h-[2px] md:h-1 w-full"
            style={{
              background: 'linear-gradient(90deg, transparent 0%, hsl(42 42% 59%) 10%, hsl(300 45% 30%) 30%, hsl(42 42% 59%) 50%, hsl(300 45% 30%) 70%, hsl(42 42% 59%) 90%, transparent 100%)',
              boxShadow: '0 1px 3px rgba(107,45,107,0.5)',
            }}
            aria-hidden="true"
          />

          <GrimoireHeader />

          {/* Navigation - responsive */}
          <div className="px-3 sm:px-4 md:px-6 py-3 md:py-4 border-b-2 border-primary/20 flex justify-between items-center flex-wrap gap-2 sm:gap-3">
            <Link href="/browse">
              <Button variant="outline" className="gap-2 text-sm md:text-base min-h-[44px]">
                <ArrowLeft className="w-3 h-3 sm:w-4 sm:h-4" />
                <span className="hidden sm:inline">Back to Browse</span>
                <span className="sm:hidden">Back</span>
              </Button>
            </Link>
            
            <ShareButton 
              url={`/rotes/${rote.id}`}
              title={rote.name}
            />
          </div>

          {/* Main content */}
          <main
            className="min-h-[300px] sm:min-h-[400px] md:min-h-[500px]"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 0 L 30 60 M 0 30 L 60 30' stroke='%234a1a4a' strokeWidth='0.3' opacity='0.06'/%3E%3C/svg%3E")`,
            }}
          >
            <div className="animate-fade-in-up flex flex-col gap-4 sm:gap-5 md:gap-6 p-3 sm:p-4 md:p-6 lg:p-10">
              {/* Add to Character - Only show if logged in */}
              {session?.user && characters.length > 0 && (
                <div className="bg-accent/10 border-2 border-accent rounded-md p-3 sm:p-4 flex flex-col gap-3">
                  <div className="flex items-start gap-2 sm:gap-3">
                    <UserPlus className="w-4 h-4 sm:w-5 sm:h-5 text-accent flex-shrink-0 mt-1" />
                    <span className="font-serif font-semibold text-primary text-sm sm:text-base">Add to Character:</span>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                    <Select value={selectedCharacterId} onValueChange={setSelectedCharacterId}>
                      <SelectTrigger className="w-full sm:flex-1 min-h-[44px] text-sm md:text-base">
                        <SelectValue placeholder="Select a character..." />
                      </SelectTrigger>
                      <SelectContent>
                        {characters.map((character) => (
                          <SelectItem key={character.id} value={character.id} className="text-sm md:text-base">
                            {character.name} ({character.faction})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Button
                      onClick={handleAddToCharacter}
                      disabled={!selectedCharacterId || isAddingToCharacter}
                      className="w-full sm:w-auto min-h-[44px] text-sm md:text-base"
                    >
                      {isAddingToCharacter ? "Adding..." : "Add Rote"}
                    </Button>
                  </div>
                </div>
              )}

              {/* Show message if logged in but no characters */}
              {session?.user && characters.length === 0 && (
                <div className="bg-muted border-2 border-primary/30 rounded-md p-3 sm:p-4 text-center">
                  <p className="text-xs sm:text-sm text-muted-foreground">
                    Create a character to add rotes to your grimoire.{" "}
                    <Link href="/character-guide" className="text-primary underline hover:text-accent">
                      Create Character
                    </Link>
                  </p>
                </div>
              )}

              {/* Detail card - responsive */}
              <div
                className="bg-background border-2 sm:border-3 md:border-4 border-double border-primary rounded-lg p-4 sm:p-6 md:p-8 lg:p-12
                  shadow-[inset_0_0_30px_rgba(139,71,38,0.08)]
                  md:shadow-[inset_0_0_60px_rgba(139,71,38,0.08)]"
              >
                {/* Header - responsive */}
                <div className="flex flex-col gap-3 sm:gap-4 md:gap-6 mb-4 sm:mb-6 md:mb-8 pb-4 sm:pb-6 md:pb-8 border-b-2 md:border-b-[3px] border-double border-primary">
                  <h2 className="font-serif text-xl sm:text-2xl md:text-3xl lg:text-4xl font-black text-primary uppercase tracking-wide leading-tight
                    drop-shadow-[2px_2px_0_rgba(201,169,97,0.3)]">
                    {rote.name}
                  </h2>
                  <div className="inline-flex items-center gap-2 sm:gap-3 px-3 sm:px-4 md:px-5 py-2 sm:py-3 bg-primary/15 border-2 md:border-[3px] border-primary rounded-md text-primary font-mono text-sm sm:text-base md:text-lg font-bold italic self-start">
                    <span className="text-accent text-base sm:text-lg md:text-xl">{getTraditionSymbol(rote.tradition)}</span>
                    <span className="break-words">{rote.tradition}</span>
                  </div>
                </div>

                {/* Description - responsive */}
                <div
                  className="bg-background/30 border-2 border-primary border-l-[3px] sm:border-l-[4px] md:border-l-[5px] border-l-ring rounded-md p-4 sm:p-5 md:p-6 lg:p-8 mb-4 sm:mb-6 md:mb-8
                    shadow-[inset_2px_2px_10px_rgba(0,0,0,0.05)]"
                >
                  <div className="font-mono text-foreground text-sm sm:text-base md:text-lg leading-relaxed sm:leading-loose">
                    <MarkdownRenderer content={rote.description} />
                  </div>
                </div>

                {/* Spheres - responsive */}
                <div className="bg-accent/10 border-2 md:border-[3px] border-double border-primary rounded-md p-4 sm:p-5 md:p-6 lg:p-8 mb-4 sm:mb-6 md:mb-8
                  shadow-[inset_0_0_30px_rgba(139,71,38,0.05)]">
                  <h3 className="font-serif text-base sm:text-lg md:text-xl font-bold text-primary uppercase tracking-[0.1em] sm:tracking-[0.15em] mb-4 sm:mb-5 md:mb-6">
                    {hasMultipleCombinations ? "Sphere Combinations" : "Required Spheres"}
                  </h3>
                  
                  {hasMultipleCombinations ? (
                    <div className="space-y-4 sm:space-y-6">
                      {allCombinations.map((combo, index) => (
                        <div key={index}>
                          <p className="font-serif font-semibold text-primary mb-3 text-sm sm:text-base">
                            Combination {index + 1}:
                          </p>
                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                            {Object.entries(combo).map(([sphere, level]) => (
                              <div
                                key={sphere}
                                className={`bg-background/50 border-2 rounded-md p-3 sm:p-4
                                  ${isTechnocracySphere(sphere) ? 'border-ring' : 'border-accent'}`}
                              >
                                <div className="font-mono font-semibold text-foreground uppercase tracking-wide mb-2 text-xs sm:text-sm">
                                  {sphere}
                                </div>
                                <SphereDots level={level as number} />
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                      {Object.entries(sphereData).map(([sphere, level]) => (
                        <div
                          key={sphere}
                          className={`bg-background/50 border-2 rounded-md p-3 sm:p-4
                            ${isTechnocracySphere(sphere) ? 'border-ring' : 'border-accent'}`}
                        >
                          <div className="font-mono font-semibold text-foreground uppercase tracking-wide mb-2 text-xs sm:text-sm">
                            {sphere}
                          </div>
                          <SphereDots level={level} />
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Level - responsive */}
                <div className="bg-primary/10 border-2 border-primary border-l-[3px] sm:border-l-[4px] md:border-l-[5px] border-l-accent rounded-md p-4 sm:p-5 md:p-6">
                  <h3 className="font-serif text-base sm:text-lg md:text-xl font-bold text-primary uppercase tracking-[0.1em] sm:tracking-[0.15em] mb-3 sm:mb-4">
                    Difficulty Level
                  </h3>
                  <div className="font-mono text-lg sm:text-xl md:text-2xl text-primary font-bold">
                    {rote.level}
                  </div>
                </div>
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
