"use client"

import { useState, useEffect } from "react"
import { GrimoireHeader } from "@/components/grimoire-header"
import { GrimoireFooter } from "@/components/grimoire-footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { 
  Sparkles, 
  Dumbbell, 
  BookOpen,
  Star,
  Target,
  ArrowLeft
} from "lucide-react"
import Link from "next/link"

export default function CharacterCreationDetailedGuide() {
  const [conceptContent, setConceptContent] = useState("")
  const [attributesContent, setAttributesContent] = useState("")
  const [abilitiesContent, setAbilitiesContent] = useState("")
  const [spheresContent, setSpheresContent] = useState("")
  const [finishingContent, setFinishingContent] = useState("")
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchCharacterCreationContent()
  }, [])

  const fetchCharacterCreationContent = async () => {
    try {
      const response = await fetch('/api/character-creation-content')
      if (response.ok) {
        const data = await response.json()
        setConceptContent(data.concept || data.overview || "")
        setAttributesContent(data.attributes || "")
        setAbilitiesContent(data.abilities || "")
        setSpheresContent(data.spheres || "")
        setFinishingContent(data.finishing || "")
      }
    } catch (error) {
      console.error('Error fetching character creation content:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen relative z-[1]">
      <div className="max-w-[1400px] mx-auto bg-background border-[3px] border-primary rounded-lg overflow-hidden relative my-6 mx-3 md:my-8 md:mx-4 shadow-[0_0_0_1px_hsl(42_42%_59%),0_0_0_8px_hsl(36_42%_88%),0_0_0_11px_hsl(300_45%_20%),inset_0_0_80px_rgba(139,71,38,0.08),0_14px_40px_rgba(26,21,16,0.25)]">
        
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

        <div className="p-6 md:p-10 space-y-8">
          {/* Header */}
          <div className="space-y-4">
            <Link href="/character-creation">
              <Button variant="ghost" className="gap-2 mb-4">
                <ArrowLeft className="w-4 h-4" />
                Back to Quick Guide
              </Button>
            </Link>
            
            <div className="text-center">
              <h1 className="text-4xl md:text-5xl font-cinzel font-bold text-primary">
                Detailed Character Creation Guide
              </h1>
              <p className="text-lg text-foreground/80 max-w-2xl mx-auto mt-4">
                In-depth explanations for each aspect of character creation
              </p>
            </div>
          </div>

          {/* Tabbed Content */}
          <Tabs defaultValue="concept" className="space-y-6">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="concept">Concept & Tradition</TabsTrigger>
              <TabsTrigger value="attributes">Attributes</TabsTrigger>
              <TabsTrigger value="abilities">Abilities</TabsTrigger>
              <TabsTrigger value="spheres">Spheres</TabsTrigger>
              <TabsTrigger value="finishing">Finishing</TabsTrigger>
            </TabsList>

            {/* Concept & Tradition Tab */}
            <TabsContent value="concept" className="space-y-6">
              <Card className="border-2 border-accent">
                <CardHeader>
                  <CardTitle className="font-cinzel text-2xl flex items-center gap-2">
                    <Sparkles className="w-6 h-6" />
                    Concept & Tradition
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <div className="flex items-center justify-center py-12">
                      <div className="text-muted-foreground">Loading...</div>
                    </div>
                  ) : conceptContent ? (
                    <div className="prose prose-sm max-w-none">
                      {conceptContent.split('\n\n').filter(p => p.trim()).map((paragraph, index) => (
                        <p key={index} className="mb-4 text-foreground leading-relaxed whitespace-pre-line">
                          {paragraph}
                        </p>
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted-foreground italic">
                      No content available. Edit this section in the Admin Panel.
                    </p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Attributes Tab */}
            <TabsContent value="attributes" className="space-y-6">
              <Card className="border-2 border-accent">
                <CardHeader>
                  <CardTitle className="font-cinzel text-2xl flex items-center gap-2">
                    <Dumbbell className="w-6 h-6" />
                    Understanding Attributes
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <div className="flex items-center justify-center py-12">
                      <div className="text-muted-foreground">Loading...</div>
                    </div>
                  ) : attributesContent ? (
                    <div className="prose prose-sm max-w-none">
                      {attributesContent.split('\n\n').filter(p => p.trim()).map((paragraph, index) => (
                        <p key={index} className="mb-4 text-foreground leading-relaxed whitespace-pre-line">
                          {paragraph}
                        </p>
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted-foreground italic">
                      No content available. Edit this section in the Admin Panel.
                    </p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Abilities Tab */}
            <TabsContent value="abilities" className="space-y-6">
              <Card className="border-2 border-accent">
                <CardHeader>
                  <CardTitle className="font-cinzel text-2xl flex items-center gap-2">
                    <Star className="w-6 h-6" />
                    Understanding Abilities
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <div className="flex items-center justify-center py-12">
                      <div className="text-muted-foreground">Loading...</div>
                    </div>
                  ) : abilitiesContent ? (
                    <div className="prose prose-sm max-w-none">
                      {abilitiesContent.split('\n\n').filter(p => p.trim()).map((paragraph, index) => (
                        <p key={index} className="mb-4 text-foreground leading-relaxed whitespace-pre-line">
                          {paragraph}
                        </p>
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted-foreground italic">
                      No content available. Edit this section in the Admin Panel.
                    </p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Spheres Tab */}
            <TabsContent value="spheres" className="space-y-6">
              <Card className="border-2 border-accent">
                <CardHeader>
                  <CardTitle className="font-cinzel text-2xl flex items-center gap-2">
                    <Sparkles className="w-6 h-6" />
                    Understanding Spheres
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <div className="flex items-center justify-center py-12">
                      <div className="text-muted-foreground">Loading...</div>
                    </div>
                  ) : spheresContent ? (
                    <div className="prose prose-sm max-w-none">
                      {spheresContent.split('\n\n').filter(p => p.trim()).map((paragraph, index) => (
                        <p key={index} className="mb-4 text-foreground leading-relaxed whitespace-pre-line">
                          {paragraph}
                        </p>
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted-foreground italic">
                      No content available. Edit this section in the Admin Panel.
                    </p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Finishing Tab */}
            <TabsContent value="finishing" className="space-y-6">
              <Card className="border-2 border-accent">
                <CardHeader>
                  <CardTitle className="font-cinzel text-2xl flex items-center gap-2">
                    <Target className="w-6 h-6" />
                    Finishing Touches
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <div className="flex items-center justify-center py-12">
                      <div className="text-muted-foreground">Loading...</div>
                    </div>
                  ) : finishingContent ? (
                    <div className="prose prose-sm max-w-none">
                      {finishingContent.split('\n\n').filter(p => p.trim()).map((paragraph, index) => (
                        <p key={index} className="mb-4 text-foreground leading-relaxed whitespace-pre-line">
                          {paragraph}
                        </p>
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted-foreground italic">
                      No content available. Edit this section in the Admin Panel.
                    </p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Back to quick guide */}
          <div className="text-center pt-8">
            <Link href="/character-creation">
              <Button variant="outline" className="gap-2">
                <ArrowLeft className="w-4 h-4" />
                Back to Quick Guide
              </Button>
            </Link>
          </div>
        </div>

        <GrimoireFooter />
      </div>
    </div>
  )
}