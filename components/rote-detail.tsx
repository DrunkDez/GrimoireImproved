"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import type { Rote } from "@/lib/mage-data"
import { getTraditionSymbol, isTechnocracySphere } from "@/lib/mage-data"
import { SphereDots } from "./sphere-dots"
import { MarkdownRenderer } from "@/components/ui/markdown-renderer"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { UserPlus } from "lucide-react"

interface RoteDetailProps {
  rote: Rote
  onBack: () => void
}

interface Character {
  id: string
  name: string
  faction: string
}

function formatSpheres(spheres: any): { [key: string]: number } {
  // If it's an array with single combination, return first item
  if (Array.isArray(spheres) && spheres.length === 1) {
    return spheres[0];
  }
  
  // If it's an array with multiple combinations, return first one for primary display
  if (Array.isArray(spheres) && spheres.length > 1) {
    return spheres[0];
  }
  
  // If it's already an object, return as-is
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

export function RoteDetail({ rote, onBack }: RoteDetailProps) {
  const { data: session } = useSession()
  const { toast } = useToast()
  const [characters, setCharacters] = useState<Character[]>([])
  const [selectedCharacterId, setSelectedCharacterId] = useState<string>("")
  const [isAddingToCharacter, setIsAddingToCharacter] = useState(false)
  const [isLoadingCharacters, setIsLoadingCharacters] = useState(false)

  const sphereData = formatSpheres(rote.spheres);
  const allCombinations = getAllCombinations(rote.spheres);
  const hasMultipleCombinations = allCombinations.length > 1;

  // Fetch user's characters when logged in
  useEffect(() => {
    if (session?.user?.id) {
      fetchCharacters()
    }
  }, [session])

  const fetchCharacters = async () => {
    setIsLoadingCharacters(true)
    try {
      const response = await fetch('/api/characters')
      if (response.ok) {
        const data = await response.json()
        setCharacters(data)
      }
    } catch (error) {
      console.error('Error fetching characters:', error)
    } finally {
      setIsLoadingCharacters(false)
    }
  }

  const handleAddToCharacter = async () => {
    if (!selectedCharacterId) {
      toast({
        title: "No Character Selected",
        description: "Please select a character first.",
        variant: "destructive",
      })
      return
    }

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
        setSelectedCharacterId("") // Reset selection
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

  return (
    <div className="animate-fade-in-up flex flex-col gap-6 p-6 md:p-10">
      {/* Back button */}
      <button
        type="button"
        onClick={onBack}
        className="self-start font-serif px-5 py-3 bg-secondary text-secondary-foreground border-2 border-primary rounded-sm
          font-semibold text-sm uppercase tracking-[0.15em] cursor-pointer
          transition-all duration-300
          shadow-[0_4px_8px_rgba(0,0,0,0.15)]
          hover:bg-background hover:border-ring hover:-translate-y-0.5
          active:translate-y-0 flex items-center gap-3"
      >
        <span aria-hidden="true">{'\u2190'}</span>
        Return to Library
      </button>

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
      {session?.user && characters.length === 0 && !isLoadingCharacters && (
        <div className="bg-muted border-2 border-primary/30 rounded-md p-4 text-center">
          <p className="text-sm text-muted-foreground">
            Create a character to add rotes to your grimoire.{" "}
            <a href="/characters/new" className="text-primary underline hover:text-accent">
              Create Character
            </a>
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

        {/* Spheres - Show all combinations */}
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
      </div>
    </div>
  )
}
