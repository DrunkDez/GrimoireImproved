"use client"

import { useEffect, useState } from "react"
import { GrimoireHeader } from "@/components/grimoire-header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Search, Star, Zap, BookOpen } from "lucide-react"

interface Merit {
  id: string
  name: string
  category: string
  type: "merit" | "flaw" | "background"
  subtype?: string
  cost: string
  description: string
  pageRef?: string
}

interface Background {
  id: string
  name: string
  category: string | null
  subtype: string
  cost: string
  description: string
  pageRef?: string
}

const CATEGORIES = [
  "Physical",
  "Mental",
  "Social",
  "Supernatural",
  "Companion",
  "Special Advantage",
  "Genetic Flaw"
]

export default function MeritsFlawsPage() {
  const [merits, setMerits] = useState<Merit[]>([])
  const [backgrounds, setBackgrounds] = useState<Background[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [typeFilter, setTypeFilter] = useState("all")
  const [categoryFilter, setCategoryFilter] = useState("all")

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      // Fetch merits & flaws
      const meritsResponse = await fetch("/api/merits")
      if (meritsResponse.ok) {
        const meritsData = await meritsResponse.json()
        setMerits(meritsData)
      }

      // Fetch backgrounds separately
      const backgroundsResponse = await fetch("/api/backgrounds")
      if (backgroundsResponse.ok) {
        const backgroundsData = await backgroundsResponse.json()
        setBackgrounds(backgroundsData)
      }
    } catch (error) {
      console.error("Error fetching data:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const filterMerits = (items: Merit[], type?: "merit" | "flaw") => {
    return items.filter(item => {
      const matchesType = !type || item.type === type
      const matchesTypeFilter = typeFilter === "all" || item.type === typeFilter
      const matchesCategoryFilter = categoryFilter === "all" || item.category === categoryFilter
      const matchesSearch = searchTerm === "" || 
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description.toLowerCase().includes(searchTerm.toLowerCase())
      return matchesType && matchesTypeFilter && matchesCategoryFilter && matchesSearch
    })
  }

  const filterBackgrounds = (items: Background[]) => {
    return items.filter(item => {
      const matchesSearch = searchTerm === "" || 
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description.toLowerCase().includes(searchTerm.toLowerCase())
      return matchesSearch
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

  const groupBackgroundsBySubtype = (items: Background[]) => {
    const general = items.filter(bg => bg.subtype === "general")
    const mage = items.filter(bg => bg.subtype === "mage")
    return { general, mage }
  }

  const meritsList = filterMerits(merits, "merit")
  const flawsList = filterMerits(merits, "flaw")
  const backgroundsList = filterBackgrounds(backgrounds)
  
  const meritsGrouped = groupByCategory(meritsList)
  const flawsGrouped = groupByCategory(flawsList)
  const { general: generalBgs, mage: mageBgs } = groupBackgroundsBySubtype(backgroundsList)

  return (
    <div className="min-h-screen relative z-[1]">
      <div className="max-w-[1400px] mx-auto bg-background border-[3px] border-primary rounded-lg overflow-hidden relative my-6 mx-3 md:my-8 md:mx-4
        shadow-[0_0_0_1px_hsl(42_42%_59%),0_0_0_8px_hsl(36_42%_88%),0_0_0_11px_hsl(300_45%_20%),inset_0_0_80px_rgba(139,71,38,0.08),0_14px_40px_rgba(26,21,16,0.25)]">
        
        <GrimoireHeader />
        
        <div className="p-6 md:p-10 space-y-6">
          {/* Header */}
          <div className="text-center space-y-4">
            <h1 className="text-4xl md:text-5xl font-cinzel font-bold text-primary">
              Merits, Flaws & Backgrounds
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Enhance your character with advantages, disadvantages, and backgrounds
            </p>
          </div>

          {/* Search & Filters */}
          <div className="bg-card border-2 border-primary rounded-md p-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Search */}
              <div className="space-y-2">
                <Label htmlFor="search">Search</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="search"
                    placeholder="Search by name or description..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              {/* Category Filter - Only for Merits/Flaws */}
              <div className="space-y-2">
                <Label htmlFor="category-filter">Category</Label>
                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                  <SelectTrigger id="category-filter">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {CATEGORIES.map(cat => (
                      <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {isLoading ? (
            <Card className="border-2 border-primary">
              <CardContent className="p-8 text-center">
                <p className="text-muted-foreground">Loading...</p>
              </CardContent>
            </Card>
          ) : (
            <Tabs defaultValue="merits" className="space-y-6">
              <TabsList className="grid w-full grid-cols-3 bg-card border-2 border-primary">
                <TabsTrigger value="merits" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                  <Star className="w-4 h-4 mr-2" />
                  Merits ({meritsList.length})
                </TabsTrigger>
                <TabsTrigger value="flaws" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                  <Zap className="w-4 h-4 mr-2" />
                  Flaws ({flawsList.length})
                </TabsTrigger>
                <TabsTrigger value="backgrounds" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                  <BookOpen className="w-4 h-4 mr-2" />
                  Backgrounds ({backgroundsList.length})
                </TabsTrigger>
              </TabsList>

              {/* Merits Tab */}
              <TabsContent value="merits" className="space-y-8">
                {Object.keys(meritsGrouped).length === 0 ? (
                  <Card className="border-2 border-primary">
                    <CardContent className="p-8 text-center">
                      <p className="text-muted-foreground">
                        {searchTerm || categoryFilter !== "all"
                          ? "No merits match your filters" 
                          : "No merits available yet"}
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
                                  {merit.cost}
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
                        {searchTerm || categoryFilter !== "all"
                          ? "No flaws match your filters" 
                          : "No flaws available yet"}
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
                                  {flaw.cost}
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

              {/* Backgrounds Tab */}
              <TabsContent value="backgrounds" className="space-y-8">
                {backgroundsList.length === 0 ? (
                  <Card className="border-2 border-primary">
                    <CardContent className="p-8 text-center">
                      <p className="text-muted-foreground">
                        {searchTerm ? "No backgrounds match your search" : "No backgrounds available yet"}
                      </p>
                    </CardContent>
                  </Card>
                ) : (
                  <>
                    {/* General Backgrounds */}
                    {generalBgs.length > 0 && (
                      <div className="space-y-4">
                        <h2 className="text-2xl font-cinzel font-bold text-primary flex items-center gap-2">
                          <span className="text-accent">{'\u2726'}</span>
                          General Backgrounds
                          <Badge variant="outline" className="ml-2">{generalBgs.length}</Badge>
                        </h2>
                        <div className="grid gap-4 md:grid-cols-2">
                          {generalBgs.map(bg => (
                            <Card key={bg.id} className="border-2 border-primary hover:border-accent transition-colors">
                              <CardHeader>
                                <div className="flex items-start justify-between gap-4">
                                  <CardTitle className="text-xl font-cinzel">
                                    {bg.name}
                                  </CardTitle>
                                  <Badge variant="secondary" className="shrink-0">
                                    {bg.cost}
                                  </Badge>
                                </div>
                                {bg.pageRef && (
                                  <CardDescription className="text-xs italic">
                                    Reference: {bg.pageRef}
                                  </CardDescription>
                                )}
                              </CardHeader>
                              <CardContent>
                                <p className="text-sm text-foreground leading-relaxed">
                                  {bg.description}
                                </p>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Mage Backgrounds */}
                    {mageBgs.length > 0 && (
                      <div className="space-y-4">
                        <h2 className="text-2xl font-cinzel font-bold text-primary flex items-center gap-2">
                          <span className="text-accent">{'\u2726'}</span>
                          Mage Backgrounds
                          <Badge variant="outline" className="ml-2">{mageBgs.length}</Badge>
                        </h2>
                        <div className="grid gap-4 md:grid-cols-2">
                          {mageBgs.map(bg => (
                            <Card key={bg.id} className="border-2 border-primary hover:border-accent transition-colors">
                              <CardHeader>
                                <div className="flex items-start justify-between gap-4">
                                  <CardTitle className="text-xl font-cinzel">
                                    {bg.name}
                                  </CardTitle>
                                  <Badge variant="secondary" className="shrink-0">
                                    {bg.cost}
                                  </Badge>
                                </div>
                                {bg.pageRef && (
                                  <CardDescription className="text-xs italic">
                                    Reference: {bg.pageRef}
                                  </CardDescription>
                                )}
                              </CardHeader>
                              <CardContent>
                                <p className="text-sm text-foreground leading-relaxed">
                                  {bg.description}
                                </p>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      </div>
                    )}
                  </>
                )}
              </TabsContent>
            </Tabs>
          )}
        </div>
      </div>
    </div>
  )
}
