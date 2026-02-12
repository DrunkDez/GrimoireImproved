"use client"

import { useEffect, useState } from "react"
import { GrimoireHeader } from "@/components/grimoire-header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Search, Star, Zap } from "lucide-react"

interface Merit {
  id: string
  name: string
  category: string
  type: "merit" | "flaw"
  cost: number
  description: string
  pageRef?: string
}

export default function MeritsFlawsPage() {
  const [merits, setMerits] = useState<Merit[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    fetchMerits()
  }, [])

  const fetchMerits = async () => {
    try {
      const response = await fetch("/api/merits")
      if (response.ok) {
        const data = await response.json()
        setMerits(data)
      }
    } catch (error) {
      console.error("Error fetching merits:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const filterMerits = (items: Merit[], type: "merit" | "flaw") => {
    return items.filter(item => {
      const matchesType = item.type === type
      const matchesSearch = searchTerm === "" || 
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description.toLowerCase().includes(searchTerm.toLowerCase())
      return matchesType && matchesSearch
    })
  }

  const groupByCategory = (items: Merit[]) => {
    const grouped: Record<string, Merit[]> = {}
    items.forEach(item => {
      if (!grouped[item.category]) {
        grouped[item.category] = []
      }
      grouped[item.category].push(item)
    })
    return grouped
  }

  const meritsList = filterMerits(merits, "merit")
  const flawsList = filterMerits(merits, "flaw")
  const meritsGrouped = groupByCategory(meritsList)
  const flawsGrouped = groupByCategory(flawsList)

  return (
    <div className="min-h-screen relative z-[1]">
      <div className="max-w-[1400px] mx-auto bg-background border-[3px] border-primary rounded-lg overflow-hidden relative my-6 mx-3 md:my-8 md:mx-4
        shadow-[0_0_0_1px_hsl(42_42%_59%),0_0_0_8px_hsl(36_42%_88%),0_0_0_11px_hsl(300_45%_20%),inset_0_0_80px_rgba(139,71,38,0.08),0_14px_40px_rgba(26,21,16,0.25)]">
        
        <GrimoireHeader />
        
        <div className="p-6 md:p-10 space-y-6">
          {/* Header */}
          <div className="text-center space-y-4">
            <h1 className="text-4xl md:text-5xl font-cinzel font-bold text-primary">
              Merits & Flaws
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Enhance your character with advantages and disadvantages that shape their story
            </p>
          </div>

          {/* Search */}
          <div className="max-w-md mx-auto">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search merits and flaws..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {isLoading ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Loading...</p>
            </div>
          ) : merits.length === 0 ? (
            <Card className="border-2 border-primary">
              <CardContent className="p-12 text-center">
                <p className="text-muted-foreground">
                  No merits or flaws have been added yet. Check back soon!
                </p>
              </CardContent>
            </Card>
          ) : (
            <Tabs defaultValue="merits" className="space-y-6">
              <TabsList className="grid w-full max-w-md mx-auto grid-cols-2">
                <TabsTrigger value="merits" className="gap-2">
                  <Star className="w-4 h-4" />
                  Merits ({meritsList.length})
                </TabsTrigger>
                <TabsTrigger value="flaws" className="gap-2">
                  <Zap className="w-4 h-4" />
                  Flaws ({flawsList.length})
                </TabsTrigger>
              </TabsList>

              {/* Merits Tab */}
              <TabsContent value="merits" className="space-y-8">
                {Object.keys(meritsGrouped).length === 0 ? (
                  <Card className="border-2 border-primary">
                    <CardContent className="p-8 text-center">
                      <p className="text-muted-foreground">
                        {searchTerm ? "No merits match your search" : "No merits available yet"}
                      </p>
                    </CardContent>
                  </Card>
                ) : (
                  Object.keys(meritsGrouped).sort().map(category => (
                    <div key={category} className="space-y-4">
                      <h2 className="text-2xl font-cinzel font-bold text-primary flex items-center gap-2">
                        <span className="text-accent">{'\u2726'}</span>
                        {category}
                      </h2>
                      <div className="grid gap-4 md:grid-cols-2">
                        {meritsGrouped[category].map(merit => (
                          <Card key={merit.id} className="border-2 border-primary hover:border-accent transition-colors">
                            <CardHeader>
                              <div className="flex items-start justify-between gap-4">
                                <CardTitle className="text-xl font-cinzel">
                                  {merit.name}
                                </CardTitle>
                                <Badge variant="default" className="shrink-0">
                                  {merit.cost} {merit.cost === 1 ? 'point' : 'points'}
                                </Badge>
                              </div>
                              {merit.pageRef && (
                                <CardDescription className="text-xs italic">
                                  Reference: {merit.pageRef}
                                </CardDescription>
                              )}
                            </CardHeader>
                            <CardContent>
                              <p className="text-sm text-foreground leading-relaxed">
                                {merit.description}
                              </p>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </div>
                  ))
                )}
              </TabsContent>

              {/* Flaws Tab */}
              <TabsContent value="flaws" className="space-y-8">
                {Object.keys(flawsGrouped).length === 0 ? (
                  <Card className="border-2 border-primary">
                    <CardContent className="p-8 text-center">
                      <p className="text-muted-foreground">
                        {searchTerm ? "No flaws match your search" : "No flaws available yet"}
                      </p>
                    </CardContent>
                  </Card>
                ) : (
                  Object.keys(flawsGrouped).sort().map(category => (
                    <div key={category} className="space-y-4">
                      <h2 className="text-2xl font-cinzel font-bold text-primary flex items-center gap-2">
                        <span className="text-accent">{'\u2726'}</span>
                        {category}
                      </h2>
                      <div className="grid gap-4 md:grid-cols-2">
                        {flawsGrouped[category].map(flaw => (
                          <Card key={flaw.id} className="border-2 border-primary hover:border-accent transition-colors">
                            <CardHeader>
                              <div className="flex items-start justify-between gap-4">
                                <CardTitle className="text-xl font-cinzel">
                                  {flaw.name}
                                </CardTitle>
                                <Badge variant="destructive" className="shrink-0">
                                  {Math.abs(flaw.cost)} {Math.abs(flaw.cost) === 1 ? 'point' : 'points'}
                                </Badge>
                              </div>
                              {flaw.pageRef && (
                                <CardDescription className="text-xs italic">
                                  Reference: {flaw.pageRef}
                                </CardDescription>
                              )}
                            </CardHeader>
                            <CardContent>
                              <p className="text-sm text-foreground leading-relaxed">
                                {flaw.description}
                              </p>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </div>
                  ))
                )}
              </TabsContent>
            </Tabs>
          )}
        </div>
      </div>
    </div>
  )
}
