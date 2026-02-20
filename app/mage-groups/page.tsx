"use client"

import { useState, useEffect } from "react"
import { GrimoireHeader } from "@/components/grimoire-header"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Image from "next/image"
import { Loader2 } from "lucide-react"

interface MageGroup {
  id: string
  name: string
  slug: string
  category: string // "Tradition", "Technocracy", "Disparate"
  description: string
  philosophy?: string
  practices?: string
  organization?: string
  headerImage?: string
  sidebarImage?: string
  published: boolean
}

export default function MageGroupsPage() {
  const [groups, setGroups] = useState<MageGroup[]>([])
  const [selectedGroup, setSelectedGroup] = useState<MageGroup | null>(null)
  const [loading, setLoading] = useState(true)
  const [category, setCategory] = useState<string>("Tradition")

  useEffect(() => {
    fetchGroups()
  }, [])

  const fetchGroups = async () => {
    try {
      const response = await fetch('/api/mage-groups?published=true')
      if (response.ok) {
        const data = await response.json()
        setGroups(data)
        // Auto-select first group in default category
        const firstInCategory = data.find((g: MageGroup) => g.category === "Tradition")
        if (firstInCategory) setSelectedGroup(firstInCategory)
      }
    } catch (error) {
      console.error('Error fetching groups:', error)
    } finally {
      setLoading(false)
    }
  }

  const groupsByCategory = (cat: string) => {
    return groups.filter(g => g.category === cat)
  }

  const handleGroupSelect = (group: MageGroup) => {
    setSelectedGroup(group)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="min-h-screen relative z-[1]">
      <div className="max-w-[1400px] mx-auto bg-background border-[3px] border-primary rounded-lg overflow-hidden relative my-6 mx-3 md:my-8 md:mx-4">
        <GrimoireHeader />

        <div className="p-6 md:p-10 space-y-8">
          {/* Page Header */}
          <div className="text-center space-y-4">
            <h1 className="text-4xl md:text-5xl font-cinzel font-bold text-primary">
              Mage Groups Encyclopedia
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Explore the Traditions, Technocracy, and Disparate Alliance
            </p>
          </div>

          {/* Category Tabs */}
          <Tabs value={category} onValueChange={setCategory} className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="Tradition">Traditions</TabsTrigger>
              <TabsTrigger value="Technocracy">Technocracy</TabsTrigger>
              <TabsTrigger value="Disparate">Disparate Alliance</TabsTrigger>
            </TabsList>

            <TabsContent value={category}>
              {/* Group Selection */}
              <div className="grid gap-3 mb-6">
                {groupsByCategory(category).map(group => (
                  <Button
                    key={group.id}
                    onClick={() => handleGroupSelect(group)}
                    variant={selectedGroup?.id === group.id ? "default" : "outline"}
                    className="w-full justify-start text-lg h-auto py-3"
                  >
                    {group.name}
                  </Button>
                ))}
                {groupsByCategory(category).length === 0 && (
                  <p className="text-center text-muted-foreground py-8">
                    No groups available in this category yet.
                  </p>
                )}
              </div>

              {/* Selected Group Display */}
              {selectedGroup && (
                <div className="space-y-6">
                  {/* Header Image */}
                  {selectedGroup.headerImage && (
                    <div className="relative w-full h-48 md:h-64 rounded-lg overflow-hidden border-2 border-primary">
                      <Image
                        src={selectedGroup.headerImage}
                        alt={selectedGroup.name}
                        fill
                        className="object-contain"
                        style={{ background: 'black' }}
                      />
                    </div>
                  )}

                  {/* Content Section */}
                  <div className="grid md:grid-cols-3 gap-6">
                    {/* Sidebar Image */}
                    {selectedGroup.sidebarImage && (
                      <div className="md:col-span-1">
                        <div className="relative w-full aspect-square rounded-lg overflow-hidden border-2 border-primary sticky top-6">
                          <Image
                            src={selectedGroup.sidebarImage}
                            alt={`${selectedGroup.name} symbol`}
                            fill
                            className="object-cover"
                          />
                        </div>
                      </div>
                    )}

                    {/* Text Content */}
                    <div className={selectedGroup.sidebarImage ? "md:col-span-2" : "md:col-span-3"}>
                      <Card className="border-2 border-primary">
                        <CardContent className="p-6 space-y-6">
                          <div>
                            <h2 className="text-3xl font-cinzel font-bold text-primary mb-4">
                              {selectedGroup.name}
                            </h2>
                            <div className="prose prose-sm max-w-none dark:prose-invert">
                              <p className="text-base leading-relaxed whitespace-pre-wrap">
                                {selectedGroup.description}
                              </p>
                            </div>
                          </div>

                          {selectedGroup.philosophy && (
                            <div>
                              <h3 className="text-xl font-cinzel font-bold text-primary mb-3">
                                Philosophy
                              </h3>
                              <div className="prose prose-sm max-w-none dark:prose-invert">
                                <p className="text-base leading-relaxed whitespace-pre-wrap">
                                  {selectedGroup.philosophy}
                                </p>
                              </div>
                            </div>
                          )}

                          {selectedGroup.practices && (
                            <div>
                              <h3 className="text-xl font-cinzel font-bold text-primary mb-3">
                                Practices
                              </h3>
                              <div className="prose prose-sm max-w-none dark:prose-invert">
                                <p className="text-base leading-relaxed whitespace-pre-wrap">
                                  {selectedGroup.practices}
                                </p>
                              </div>
                            </div>
                          )}

                          {selectedGroup.organization && (
                            <div>
                              <h3 className="text-xl font-cinzel font-bold text-primary mb-3">
                                Organization
                              </h3>
                              <div className="prose prose-sm max-w-none dark:prose-invert">
                                <p className="text-base leading-relaxed whitespace-pre-wrap">
                                  {selectedGroup.organization}
                                </p>
                              </div>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
