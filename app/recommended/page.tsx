"use client"

import { useEffect, useState } from "react"
import { GrimoireHeader } from "@/components/grimoire-header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search, ExternalLink, Star, BookOpen, Headphones, Video, Globe } from "lucide-react"

interface Resource {
  id: string
  name: string
  type: string
  category?: string
  description: string
  url?: string
  author?: string
  imageUrl?: string
  featured: boolean
}

export default function RecommendedPage() {
  const [resources, setResources] = useState<Resource[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedType, setSelectedType] = useState("all")

  useEffect(() => {
    fetchResources()
  }, [])

  const fetchResources = async () => {
    try {
      const response = await fetch("/api/resources")
      if (response.ok) {
        const data = await response.json()
        setResources(data)
      }
    } catch (error) {
      console.error("Error fetching resources:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case "podcast":
        return <Headphones className="w-4 h-4" />
      case "video":
        return <Video className="w-4 h-4" />
      case "book":
        return <BookOpen className="w-4 h-4" />
      case "website":
        return <Globe className="w-4 h-4" />
      default:
        return <BookOpen className="w-4 h-4" />
    }
  }

  const filteredResources = resources.filter(resource => {
    const matchesSearch = searchTerm === "" ||
      resource.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      resource.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (resource.author && resource.author.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchesType = selectedType === "all" || resource.type.toLowerCase() === selectedType.toLowerCase()
    return matchesSearch && matchesType
  })

  const featuredResources = filteredResources.filter(r => r.featured)
  const regularResources = filteredResources.filter(r => !r.featured)

  const allTypes = Array.from(new Set(resources.map(r => r.type)))

  return (
    <div className="min-h-screen relative z-[1]">
      <div className="max-w-[1400px] mx-auto bg-background border-[3px] border-primary rounded-lg overflow-hidden relative my-6 mx-3 md:my-8 md:mx-4
        shadow-[0_0_0_1px_hsl(42_42%_59%),0_0_0_8px_hsl(36_42%_88%),0_0_0_11px_hsl(300_45%_20%),inset_0_0_80px_rgba(139,71,38,0.08),0_14px_40px_rgba(26,21,16,0.25)]">
        
        <GrimoireHeader />
        
        <div className="p-6 md:p-10 space-y-6">
          {/* Header */}
          <div className="text-center space-y-4">
            <h1 className="text-4xl md:text-5xl font-cinzel font-bold text-primary">
              Recommended Resources
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Curated content to deepen your understanding of Mage: The Ascension
            </p>
          </div>

          {/* Search and Filter */}
          <div className="max-w-2xl mx-auto space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search resources..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            {allTypes.length > 0 && (
              <div className="flex flex-wrap gap-2 justify-center">
                <Button
                  variant={selectedType === "all" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedType("all")}
                >
                  All Types
                </Button>
                {allTypes.map(type => (
                  <Button
                    key={type}
                    variant={selectedType === type ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedType(type)}
                    className="gap-2"
                  >
                    {getTypeIcon(type)}
                    {type}
                  </Button>
                ))}
              </div>
            )}
          </div>

          {isLoading ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Loading resources...</p>
            </div>
          ) : filteredResources.length === 0 ? (
            <Card className="border-2 border-primary">
              <CardContent className="p-12 text-center">
                <p className="text-muted-foreground">
                  {searchTerm || selectedType !== "all" 
                    ? "No resources match your search or filter" 
                    : "No resources have been added yet. Check back soon!"}
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-8">
              {/* Featured Resources */}
              {featuredResources.length > 0 && (
                <div className="space-y-4">
                  <h2 className="text-2xl font-cinzel font-bold text-primary flex items-center gap-2">
                    <Star className="w-6 h-6 text-accent fill-accent" />
                    Featured
                  </h2>
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {featuredResources.map(resource => (
                      <Card key={resource.id} className="border-2 border-accent hover:shadow-lg transition-all">
                        <CardHeader>
                          <div className="flex items-start gap-3">
                            <div className="p-2 bg-accent/10 rounded-lg">
                              {getTypeIcon(resource.type)}
                            </div>
                            <div className="flex-1 min-w-0">
                              <CardTitle className="text-lg font-cinzel truncate">
                                {resource.name}
                              </CardTitle>
                              <div className="flex flex-wrap gap-2 mt-1">
                                <Badge variant="secondary" className="text-xs">
                                  {resource.type}
                                </Badge>
                                {resource.category && (
                                  <Badge variant="outline" className="text-xs">
                                    {resource.category}
                                  </Badge>
                                )}
                              </div>
                            </div>
                          </div>
                          {resource.author && (
                            <CardDescription className="text-xs">
                              by {resource.author}
                            </CardDescription>
                          )}
                        </CardHeader>
                        <CardContent className="space-y-3">
                          <p className="text-sm text-foreground leading-relaxed line-clamp-3">
                            {resource.description}
                          </p>
                          {resource.url && (
                            <Button asChild className="w-full gap-2">
                              <a href={resource.url} target="_blank" rel="noopener noreferrer">
                                Visit Resource
                                <ExternalLink className="w-4 h-4" />
                              </a>
                            </Button>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )}

              {/* Regular Resources */}
              {regularResources.length > 0 && (
                <div className="space-y-4">
                  {featuredResources.length > 0 && (
                    <h2 className="text-2xl font-cinzel font-bold text-primary flex items-center gap-2">
                      <span className="text-accent">{'\u2726'}</span>
                      All Resources
                    </h2>
                  )}
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {regularResources.map(resource => (
                      <Card key={resource.id} className="border-2 border-primary hover:border-accent transition-colors">
                        <CardHeader>
                          <div className="flex items-start gap-3">
                            <div className="p-2 bg-primary/10 rounded-lg">
                              {getTypeIcon(resource.type)}
                            </div>
                            <div className="flex-1 min-w-0">
                              <CardTitle className="text-lg font-cinzel truncate">
                                {resource.name}
                              </CardTitle>
                              <div className="flex flex-wrap gap-2 mt-1">
                                <Badge variant="secondary" className="text-xs">
                                  {resource.type}
                                </Badge>
                                {resource.category && (
                                  <Badge variant="outline" className="text-xs">
                                    {resource.category}
                                  </Badge>
                                )}
                              </div>
                            </div>
                          </div>
                          {resource.author && (
                            <CardDescription className="text-xs">
                              by {resource.author}
                            </CardDescription>
                          )}
                        </CardHeader>
                        <CardContent className="space-y-3">
                          <p className="text-sm text-foreground leading-relaxed line-clamp-3">
                            {resource.description}
                          </p>
                          {resource.url && (
                            <Button asChild variant="outline" className="w-full gap-2">
                              <a href={resource.url} target="_blank" rel="noopener noreferrer">
                                Visit Resource
                                <ExternalLink className="w-4 h-4" />
                              </a>
                            </Button>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
