"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import type { Wonder } from "@/lib/wonder-data"
import { getCategoryIcon, formatWonderSpheres } from "@/lib/wonder-data"
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

interface WonderPageClientProps {
  id: string
}

interface Character {
  id: string
  name: string
  faction: string
}

export default function WonderPageClient({ id }: WonderPageClientProps) {
  const router = useRouter()
  const { data: session } = useSession()
  const { toast } = useToast()
  
  const [wonder, setWonder] = useState<Wonder | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [characters, setCharacters] = useState<Character[]>([])
  const [selectedCharacterId, setSelectedCharacterId] = useState<string>("")
  const [isAddingToCharacter, setIsAddingToCharacter] = useState(false)

  // Fetch the wonder with a guaranteed timeout using Promise.race
  useEffect(() => {
    if (!id) return;

    let isMounted = true;

    const fetchWithTimeout = async () => {
      // Create a timeout promise that rejects after 10 seconds
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error("Request timeout")), 10000);
      });

      try {
        const fetchPromise = fetch(`/api/wonders/${id}`);
        const response = await Promise.race([fetchPromise, timeoutPromise]) as Response;
        
        if (!isMounted) return;

        if (response.ok) {
          const data = await response.json();
          setWonder(data);
        } else if (response.status === 404) {
          router.push('/wonders');
        } else {
          throw new Error(`API error: ${response.status}`);
        }
      } catch (error) {
        console.error('Fetch error:', error);
        if (isMounted) {
          // Show a toast to inform user
          toast({
            title: "Loading failed",
            description: "Could not load wonder. Redirecting...",
            variant: "destructive",
          });
          router.push('/wonders');
        }
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    fetchWithTimeout();

    return () => {
      isMounted = false;
    };
  }, [id, router, toast]);

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
    if (!selectedCharacterId || !wonder) return

    setIsAddingToCharacter(true)
    try {
      const response = await fetch(`/api/characters/${selectedCharacterId}/wonders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ wonderId: wonder.id }),
      })

      if (response.ok) {
        toast({
          title: "Wonder added!",
          description: `${wonder.name} has been added to your character.`,
        })
        setSelectedCharacterId("")
      } else {
        const error = await response.json()
        toast({
          title: "Error",
          description: error.error || "Failed to add wonder to character",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add wonder to character",
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
          <span className="text-2xl text-accent animate-spin">✨</span>
          <p className="text-muted-foreground">Loading wonder...</p>
        </div>
      </div>
    )
  }

  if (!wonder) {
    return null
  }

  const categoryIcon = getCategoryIcon(wonder.category)
  const spheresText = formatWonderSpheres(wonder.spheres)
  const shareUrl = typeof window !== 'undefined' 
    ? `${window.location.origin}/wonders/${wonder.id}`
    : ''

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
          <div className="px-6 py-4 border-b-2 border-primary/20 flex items-center justify-between">
            <Link href="/wonders">
              <Button variant="outline" className="gap-2">
                <ArrowLeft className="w-4 h-4" />
                Back to Wonders
              </Button>
            </Link>
            <ShareButton
              url={shareUrl}
              title={`Check out this wonder: ${wonder.name}`}
            />
          </div>

          {/* Main content */}
          <main
            className="p-6"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 0 L 30 60 M 0 30 L 60 30' stroke='%234a1a4a' strokeWidth='0.3' opacity='0.06'/%3E%3C/svg%3E")`,
            }}
          >
            <div className="max-w-4xl mx-auto">
              {/* Header */}
              <div className="mb-6">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-4xl" aria-hidden="true">{categoryIcon}</span>
                  <h1 className="font-serif text-3xl font-bold text-foreground">
                    {wonder.name}
                  </h1>
                </div>
                <p className="text-lg text-muted-foreground">{wonder.category}</p>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                {wonder.backgroundCost && (
                  <div className="bg-card border-2 border-primary/30 rounded-lg p-4">
                    <div className="text-sm text-muted-foreground mb-1">Background Cost</div>
                    <div className="text-2xl font-bold text-foreground">{wonder.backgroundCost}</div>
                  </div>
                )}
                
                {wonder.arete !== null && (
                  <div className="bg-card border-2 border-primary/30 rounded-lg p-4">
                    <div className="text-sm text-muted-foreground mb-1">Arete</div>
                    <div className="text-2xl font-bold text-foreground">{wonder.arete}</div>
                  </div>
                )}
                
                {wonder.quintessence !== null && (
                  <div className="bg-card border-2 border-primary/30 rounded-lg p-4">
                    <div className="text-sm text-muted-foreground mb-1">Quintessence</div>
                    <div className="text-2xl font-bold text-foreground">{wonder.quintessence}</div>
                  </div>
                )}
              </div>

              {/* Spheres */}
              {wonder.spheres && Object.keys(wonder.spheres).length > 0 && (
                <div className="bg-card border-2 border-primary/30 rounded-lg p-4 mb-6">
                  <h2 className="font-serif text-xl font-semibold mb-3">Required Spheres</h2>
                  <div className="space-y-2">
                    {Object.entries(wonder.spheres).map(([sphere, level]) => (
                      <div key={sphere} className="flex items-center justify-between">
                        <span className="font-medium">{sphere}</span>
                        <SphereDots level={level as number} />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Description */}
              <div className="bg-card border-2 border-primary/30 rounded-lg p-6 mb-6">
                <h2 className="font-serif text-xl font-semibold mb-3">Description</h2>
                <div className="prose prose-invert max-w-none">
                  <MarkdownRenderer content={wonder.description} />
                </div>
              </div>

              {/* Page Reference */}
              {wonder.pageRef && (
                <div className="text-sm text-muted-foreground mb-6">
                  <span className="font-medium">Reference:</span> {wonder.pageRef}
                </div>
              )}

              {/* Add to Character */}
              {session && characters.length > 0 && (
                <div className="bg-card border-2 border-primary/30 rounded-lg p-4">
                  <div className="flex items-center gap-4">
                    <UserPlus className="w-5 h-5 text-muted-foreground" />
                    <Select
                      value={selectedCharacterId}
                      onValueChange={setSelectedCharacterId}
                    >
                      <SelectTrigger className="flex-1">
                        <SelectValue placeholder="Add to character..." />
                      </SelectTrigger>
                      <SelectContent>
                        {characters.map((char) => (
                          <SelectItem key={char.id} value={char.id}>
                            {char.name} ({char.faction})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Button
                      onClick={handleAddToCharacter}
                      disabled={!selectedCharacterId || isAddingToCharacter}
                    >
                      {isAddingToCharacter ? 'Adding...' : 'Add'}
                    </Button>
                  </div>
                </div>
              )}

              {/* Creator Info */}
              {wonder.user && (
                <div className="mt-6 pt-6 border-t border-primary/20 text-sm text-muted-foreground">
                  Created by {wonder.user.name || wonder.user.email}
                </div>
              )}
            </div>
          </main>

          <GrimoireFooter />
        </div>
      </div>
      <Toaster />
    </>
  )
}
