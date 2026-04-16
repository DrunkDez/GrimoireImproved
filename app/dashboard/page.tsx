"use client"

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { 
  Home, BookOpen, Users, Plus, Trash2, 
  Calendar, User as UserIcon, Edit, Eye
} from "lucide-react"
import Link from "next/link"
import { GrimoireHeader } from "@/components/grimoire-header"

interface Rote {
  id: string
  name: string
  tradition: string
  description: string
  level: string
  createdAt: string
}

interface Character {
  id: string
  name: string
  faction: string
  concept: string | null
  arete: number | null
  essence: string | null
  createdAt: string
  _count: {
    rotes: number
  }
}

export default function DashboardPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [myRotes, setMyRotes] = useState<Rote[]>([])
  const [myCharacters, setMyCharacters] = useState<Character[]>([])
  const [isLoadingRotes, setIsLoadingRotes] = useState(true)
  const [isLoadingCharacters, setIsLoadingCharacters] = useState(true)

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin")
    }
  }, [status, router])

  useEffect(() => {
    if (session?.user?.id) {
      fetchMyRotes()
      fetchMyCharacters()
    }
  }, [session])

  const fetchMyRotes = async () => {
    try {
      const response = await fetch('/api/rotes')
      if (response.ok) {
        const allRotes = await response.json()
        const userRotes = allRotes.filter((r: any) => r.userId === session?.user?.id)
        setMyRotes(userRotes)
      }
    } catch (error) {
      console.error('Error fetching rotes:', error)
    } finally {
      setIsLoadingRotes(false)
    }
  }

  const fetchMyCharacters = async () => {
    try {
      const response = await fetch('/api/characters')
      if (response.ok) {
        const data = await response.json()
        console.log("📋 Dashboard - Fetched characters:", data.map(c => ({ id: c.id, name: c.name, hasAttributes: !!c.attributes })))
        setMyCharacters(data)
      }
    } catch (error) {
      console.error('Error fetching characters:', error)
    } finally {
      setIsLoadingCharacters(false)
    }
  }

  const deleteRote = async (id: string) => {
    if (!confirm('Are you sure you want to delete this rote?')) return

    try {
      const response = await fetch(`/api/rotes/${id}`, { method: 'DELETE' })
      if (response.ok) fetchMyRotes()
    } catch (error) {
      console.error('Error deleting rote:', error)
    }
  }

  const deleteCharacter = async (id: string) => {
    if (!confirm('Are you sure you want to delete this character? This cannot be undone.')) return

    try {
      const response = await fetch(`/api/characters/${id}`, { method: 'DELETE' })
      if (response.ok) {
        fetchMyCharacters()
      } else {
        const error = await response.json()
        console.error('Error deleting character:', error)
      }
    } catch (error) {
      console.error('Error deleting character:', error)
    }
  }

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    )
  }

  if (!session) return null

  return (
    <div className="min-h-screen relative z-[1] py-6 px-3 md:py-8 md:px-4">
      <div className="max-w-[1400px] mx-auto bg-background border-[3px] border-primary rounded-lg overflow-hidden relative
        shadow-[0_0_0_1px_hsl(42_42%_59%),0_0_0_8px_hsl(36_42%_88%),0_0_0_11px_hsl(300_45%_20%),inset_0_0_80px_rgba(139,71,38,0.08),0_14px_40px_rgba(26,21,16,0.25)]">
        
        <GrimoireHeader />

        <div className="p-6 md:p-10 space-y-6">
          {/* Welcome Section */}
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-cinzel font-bold text-primary mb-2">
                Welcome, {session.user?.name || 'Awakened One'}
              </h1>
              <p className="text-muted-foreground flex items-center gap-2">
                <UserIcon className="w-4 h-4" />
                {session.user?.email}
              </p>
            </div>
            <Link href="/">
              <Button variant="outline" className="gap-2">
                <Home className="w-4 h-4" />
                Return to Wheel
              </Button>
            </Link>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="border-2 border-primary">
              <CardHeader>
                <CardTitle className="text-lg font-cinzel flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-primary" />
                  My Rotes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-primary">{myRotes.length}</p>
                <p className="text-sm text-muted-foreground">Rotes Created</p>
              </CardContent>
            </Card>

            <Card className="border-2 border-primary">
              <CardHeader>
                <CardTitle className="text-lg font-cinzel flex items-center gap-2">
                  <Users className="w-5 h-5 text-primary" />
                  My Characters
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-primary">{myCharacters.length}</p>
                <p className="text-sm text-muted-foreground">Characters Created</p>
              </CardContent>
            </Card>
          </div>

          {/* Main Tabs */}
          <Tabs defaultValue="characters" className="space-y-6">
            <TabsList className="grid w-full grid-cols-2 max-w-md">
              <TabsTrigger value="characters" className="gap-2">
                <Users className="w-4 h-4" />
                My Characters
              </TabsTrigger>
              <TabsTrigger value="rotes" className="gap-2">
                <BookOpen className="w-4 h-4" />
                My Rotes
              </TabsTrigger>
            </TabsList>

            {/* My Characters Tab */}
            <TabsContent value="characters" className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-cinzel font-bold text-primary">
                  Your Characters
                </h2>
                <Link href="/character-guide">
                  <Button className="gap-2">
                    <Plus className="w-4 h-4" />
                    Create New Character
                  </Button>
                </Link>
              </div>

              {isLoadingCharacters ? (
                <p className="text-muted-foreground">Loading your characters...</p>
              ) : myCharacters.length === 0 ? (
                <Card className="border-2 border-primary">
                  <CardContent className="p-12 text-center">
                    <Users className="w-12 h-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                    <h3 className="font-cinzel text-xl font-bold text-primary mb-2">
                      No Characters Yet
                    </h3>
                    <p className="text-muted-foreground mb-4">
                      Create your first mage character and begin your journey!
                    </p>
                    <Link href="/character-guide">
                      <Button>Create Your First Character</Button>
                    </Link>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {myCharacters.map((character) => (
                    <Card key={character.id} className="border-2 border-primary hover:border-accent transition-colors">
                      <CardHeader>
                        <CardTitle className="text-lg font-cinzel">
                          {character.name}
                        </CardTitle>
                        <CardDescription className="space-y-2">
                          <Badge className="mr-2">{character.faction}</Badge>
                          {character.arete && (
                            <Badge variant="outline">Arete {character.arete}</Badge>
                          )}
                          {character.essence && (
                            <Badge variant="secondary">{character.essence}</Badge>
                          )}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        {character.concept && (
                          <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                            {character.concept}
                          </p>
                        )}
                        <div className="flex items-center justify-between">
                          <div className="text-sm text-muted-foreground">
                            <BookOpen className="w-4 h-4 inline mr-1" />
                            {character._count.rotes} rote{character._count.rotes !== 1 ? 's' : ''}
                          </div>
                          <div className="flex gap-2">
                            <Link href={`/characters/${character.id}/edit`}>
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="gap-1"
                                onClick={() => console.log("📝 EDIT clicked - ID:", character.id, "Name:", character.name)}
                              >
                                <Edit className="w-3 h-3" />
                                Edit
                              </Button>
                            </Link>
                            <Link href={`/characters/${character.id}`}>
                              <Button 
                                size="sm" 
                                className="gap-1"
                                onClick={() => console.log("👁️ VIEW clicked - ID:", character.id, "Name:", character.name)}
                              >
                                <Eye className="w-3 h-3" />
                                View
                              </Button>
                            </Link>
                          </div>
                        </div>
                        <div className="mt-3 pt-3 border-t text-xs text-muted-foreground flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          Created {new Date(character.createdAt).toLocaleDateString()}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>

            {/* My Rotes Tab */}
            <TabsContent value="rotes" className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-cinzel font-bold text-primary">
                  Your Created Rotes
                </h2>
                <Link href="/?tab=add">
                  <Button className="gap-2">
                    <Plus className="w-4 h-4" />
                    Create New Rote
                  </Button>
                </Link>
              </div>

              {isLoadingRotes ? (
                <p className="text-muted-foreground">Loading your rotes...</p>
              ) : myRotes.length === 0 ? (
                <Card className="border-2 border-primary">
                  <CardContent className="p-12 text-center">
                    <BookOpen className="w-12 h-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                    <h3 className="font-cinzel text-xl font-bold text-primary mb-2">
                      No Rotes Yet
                    </h3>
                    <p className="text-muted-foreground mb-4">
                      You haven't created any rotes yet. Start building your grimoire!
                    </p>
                    <Link href="/?tab=add">
                      <Button>Create Your First Rote</Button>
                    </Link>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid gap-4">
                  {myRotes.map((rote) => (
                    <Card key={rote.id} className="border-2 border-primary hover:border-accent transition-colors">
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <CardTitle className="text-lg font-cinzel">{rote.name}</CardTitle>
                            <CardDescription className="flex items-center gap-2 mt-1">
                              <Badge variant="outline">{rote.tradition}</Badge>
                              <Badge variant="secondary">{rote.level}</Badge>
                            </CardDescription>
                          </div>
                          <div className="flex gap-2">
                            <Link href={`/rotes/${rote.id}`}>
                              <Button variant="outline" size="sm" className="gap-2">
                                <BookOpen className="w-4 h-4" />
                                View
                              </Button>
                            </Link>
                            <Button 
                              variant="destructive" 
                              size="sm" 
                              onClick={() => deleteRote(rote.id)}
                              className="gap-2"
                            >
                              <Trash2 className="w-4 h-4" />
                              Delete
                            </Button>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-foreground line-clamp-2">{rote.description}</p>
                        <p className="text-xs text-muted-foreground mt-2">
                          Created {new Date(rote.createdAt).toLocaleDateString()}
                        </p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
