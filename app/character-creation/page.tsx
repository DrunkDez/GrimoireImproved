"use client"

import { useState, useEffect } from "react"
import { GrimoireHeader } from "@/components/grimoire-header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  Sparkles, 
  Dumbbell, 
  BookOpen,
  Star,
  Target,
  ChevronDown,
  ChevronUp,
  Info
} from "lucide-react"

interface ExpandedContent {
  [key: string]: string
}

export default function CharacterCreationGuide() {
  const [expandedSteps, setExpandedSteps] = useState<string[]>([])
  const [expandedContent, setExpandedContent] = useState<ExpandedContent>({})
  const [overviewContent, setOverviewContent] = useState("")
  const [attributesContent, setAttributesContent] = useState("")
  const [abilitiesContent, setAbilitiesContent] = useState("")
  const [spheresContent, setSpheresContent] = useState("")
  const [finishingContent, setFinishingContent] = useState("")
  const [isLoadingContent, setIsLoadingContent] = useState(true)

  useEffect(() => {
    fetchExpandedContent()
    fetchCharacterCreationContent()
  }, [])

  const fetchExpandedContent = async () => {
    try {
      const response = await fetch('/api/guide-expanded-content')
      if (response.ok) {
        const data = await response.json()
        setExpandedContent(data)
      }
    } catch (error) {
      console.error('Error fetching expanded content:', error)
    }
  }

  const fetchCharacterCreationContent = async () => {
    try {
      const response = await fetch('/api/character-creation-content')
      if (response.ok) {
        const data = await response.json()
        setOverviewContent(data.overview || "")
        setAttributesContent(data.attributes || "")
        setAbilitiesContent(data.abilities || "")
        setSpheresContent(data.spheres || "")
        setFinishingContent(data.finishing || "")
      }
    } catch (error) {
      console.error('Error fetching character creation content:', error)
    } finally {
      setIsLoadingContent(false)
    }
  }

  const toggleStep = (stepId: string) => {
    setExpandedSteps(prev => 
      prev.includes(stepId) 
        ? prev.filter(id => id !== stepId)
        : [...prev, stepId]
    )
  }

  return (
    <div className="min-h-screen relative z-[1]">
      <div className="max-w-[1400px] mx-auto bg-background border-[3px] border-primary rounded-lg overflow-hidden relative my-6 mx-3 md:my-8 md:mx-4">
        <GrimoireHeader />

        <div className="p-6 md:p-10 space-y-8">
          {/* Header */}
          <div className="text-center space-y-4">
            <h1 className="text-4xl md:text-5xl font-cinzel font-bold text-primary">
              Character Creation Guide
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Learn how to create your Mage: The Ascension character step by step
            </p>
          </div>

          {/* Main Guide */}
          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="attributes">Attributes</TabsTrigger>
              <TabsTrigger value="abilities">Abilities</TabsTrigger>
              <TabsTrigger value="spheres">Spheres</TabsTrigger>
              <TabsTrigger value="finishing">Finishing</TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-6">
              {/* Editable Overview Content */}
              {overviewContent && (
                <Card className="border-2 border-accent">
                  <CardHeader>
                    <CardTitle className="font-cinzel text-2xl flex items-center gap-2">
                      <Info className="w-6 h-6" />
                      Getting Started
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="prose prose-sm max-w-none">
                      {overviewContent.split('\n\n').filter(p => p.trim()).map((paragraph, index) => (
                        <p key={index} className="mb-4 text-foreground leading-relaxed">
                          {paragraph}
                        </p>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              <Card className="border-2 border-primary">
                <CardHeader>
                  <CardTitle className="font-cinzel text-2xl">Character Creation Steps</CardTitle>
                  <CardDescription>Click each step to see more details</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    {/* All your existing expandable steps */}
                    <ExpandableStep
                      id="concept"
                      number={1}
                      title="Concept & Tradition"
                      subtitle="Choose your character concept, Tradition, and basic identity"
                      expandedText={expandedContent.concept}
                      isExpanded={expandedSteps.includes('concept')}
                      onToggle={() => toggleStep('concept')}
                      borderColor="border-primary/30"
                      bgColor="bg-primary"
                    />

                    <ExpandableStep
                      id="attributes"
                      number={2}
                      title="Attributes"
                      subtitle="Prioritize Physical, Social, and Mental (7/5/3 dots + 1 free each)"
                      expandedText={expandedContent.attributes}
                      isExpanded={expandedSteps.includes('attributes')}
                      onToggle={() => toggleStep('attributes')}
                      borderColor="border-primary/30"
                      bgColor="bg-primary"
                    />

                    <ExpandableStep
                      id="abilities"
                      number={3}
                      title="Abilities"
                      subtitle="Prioritize Talents, Skills, Knowledges (13/9/5 dots, max 3 each)"
                      expandedText={expandedContent.abilities}
                      isExpanded={expandedSteps.includes('abilities')}
                      onToggle={() => toggleStep('abilities')}
                      borderColor="border-accent/30"
                      bgColor="bg-accent"
                    />

                    <ExpandableStep
                      id="spheres"
                      number={4}
                      title="Spheres"
                      subtitle="Choose your magical Spheres (6 dots, affinity at 1, max 3 each)"
                      expandedText={expandedContent.spheres}
                      isExpanded={expandedSteps.includes('spheres')}
                      onToggle={() => toggleStep('spheres')}
                      borderColor="border-ring/30"
                      bgColor="bg-ring"
                    />

                    <ExpandableStep
                      id="backgrounds"
                      number={5}
                      title="Backgrounds"
                      subtitle="Select Backgrounds like Avatar, Resources, Allies (7 dots total)"
                      expandedText={expandedContent.backgrounds}
                      isExpanded={expandedSteps.includes('backgrounds')}
                      onToggle={() => toggleStep('backgrounds')}
                      borderColor="border-primary/30"
                      bgColor="bg-primary"
                    />

                    <ExpandableStep
                      id="freebies"
                      number={6}
                      title="Freebie Points"
                      subtitle="Spend 15 freebie points to customize your character"
                      expandedText={expandedContent.freebies}
                      isExpanded={expandedSteps.includes('freebies')}
                      onToggle={() => toggleStep('freebies')}
                      borderColor="border-accent/30"
                      bgColor="bg-accent"
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Quick Reference Card */}
              <Card className="border-2 border-ring">
                <CardHeader>
                  <CardTitle className="font-cinzel text-2xl">Quick Reference</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <h3 className="font-semibold text-primary">Starting Points</h3>
                      <ul className="space-y-1 text-sm">
                        <li>• <strong>Attributes:</strong> 1 free in each (9 total), then 7/5/3</li>
                        <li>• <strong>Abilities:</strong> 13/9/5 dots (max 3 per ability)</li>
                        <li>• <strong>Spheres:</strong> 6 dots (affinity at 1, max 3)</li>
                        <li>• <strong>Backgrounds:</strong> 7 dots</li>
                        <li>• <strong>Arete:</strong> Starts at 1</li>
                        <li>• <strong>Willpower:</strong> Starts at 5</li>
                        <li>• <strong>Quintessence:</strong> Equal to Avatar rating</li>
                      </ul>
                    </div>

                    <div className="space-y-2">
                      <h3 className="font-semibold text-accent">Freebie Point Costs</h3>
                      <ul className="space-y-1 text-sm">
                        <li>• <strong>Attribute:</strong> 5 Freebie points per dot</li>
                        <li>• <strong>Ability:</strong> 2 Freebie points per dot</li>
                        <li>• <strong>Sphere:</strong> 7 Freebie points per dot</li>
                        <li>• <strong>Background:</strong> 1 Freebie point per dot</li>
                        <li>• <strong>Arete:</strong> 4 Freebie points per dot</li>
                        <li>• <strong>Willpower:</strong> 1 Freebie point per dot</li>
                        <li>• <strong>Quintessence:</strong> 1 Freebie point for 4 points</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Attributes Tab */}
            <TabsContent value="attributes" className="space-y-6">
              {/* Editable Attributes Content */}
              {attributesContent && (
                <Card className="border-2 border-accent">
                  <CardHeader>
                    <CardTitle className="font-cinzel text-2xl flex items-center gap-2">
                      <BookOpen className="w-6 h-6" />
                      Understanding Attributes
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="prose prose-sm max-w-none">
                      {attributesContent.split('\n\n').filter(p => p.trim()).map((paragraph, index) => (
                        <p key={index} className="mb-4 text-foreground leading-relaxed whitespace-pre-line">
                          {paragraph}
                        </p>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              <Card className="border-2 border-primary">
                <CardHeader>
                  <CardTitle className="font-cinzel text-2xl flex items-center gap-2">
                    <Dumbbell className="w-6 h-6" />
                    Attributes
                  </CardTitle>
                  <CardDescription>
                    Your character's innate capabilities - each starts at 1 dot
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="bg-primary/10 border border-primary/30 rounded-md p-4 mb-4">
                    <p className="text-sm">
                      <strong>How it works:</strong> Each of the 9 attributes starts at 1 dot. 
                      Prioritize Physical, Social, and Mental - choosing which gets 7 dots (Primary), 
                      5 dots (Secondary), and 3 dots (Tertiary).
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Abilities Tab */}
            <TabsContent value="abilities" className="space-y-6">
              {/* Editable Abilities Content */}
              {abilitiesContent && (
                <Card className="border-2 border-accent">
                  <CardHeader>
                    <CardTitle className="font-cinzel text-2xl flex items-center gap-2">
                      <BookOpen className="w-6 h-6" />
                      Understanding Abilities
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="prose prose-sm max-w-none">
                      {abilitiesContent.split('\n\n').filter(p => p.trim()).map((paragraph, index) => (
                        <p key={index} className="mb-4 text-foreground leading-relaxed whitespace-pre-line">
                          {paragraph}
                        </p>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            {/* Spheres Tab */}
            <TabsContent value="spheres" className="space-y-6">
              {/* Editable Spheres Content */}
              {spheresContent && (
                <Card className="border-2 border-accent">
                  <CardHeader>
                    <CardTitle className="font-cinzel text-2xl flex items-center gap-2">
                      <Sparkles className="w-6 h-6" />
                      Understanding Spheres
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="prose prose-sm max-w-none">
                      {spheresContent.split('\n\n').filter(p => p.trim()).map((paragraph, index) => (
                        <p key={index} className="mb-4 text-foreground leading-relaxed whitespace-pre-line">
                          {paragraph}
                        </p>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            {/* Finishing Tab */}
            <TabsContent value="finishing" className="space-y-6">
              {/* Editable Finishing Content */}
              {finishingContent && (
                <Card className="border-2 border-accent">
                  <CardHeader>
                    <CardTitle className="font-cinzel text-2xl flex items-center gap-2">
                      <Target className="w-6 h-6" />
                      Finishing Touches
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="prose prose-sm max-w-none">
                      {finishingContent.split('\n\n').filter(p => p.trim()).map((paragraph, index) => (
                        <p key={index} className="mb-4 text-foreground leading-relaxed whitespace-pre-line">
                          {paragraph}
                        </p>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

          </Tabs>
        </div>
      </div>
    </div>
  )
}

// Expandable Step Component
function ExpandableStep({ 
  id,
  number, 
  title, 
  subtitle, 
  expandedText,
  isExpanded, 
  onToggle,
  borderColor,
  bgColor
}: {
  id: string
  number: number
  title: string
  subtitle: string
  expandedText?: string
  isExpanded: boolean
  onToggle: () => void
  borderColor: string
  bgColor: string
}) {
  return (
    <div 
      className={`border-2 ${borderColor} rounded-md cursor-pointer transition-all hover:shadow-md`}
      onClick={onToggle}
    >
      <div className="flex gap-4 p-4">
        <div className={`flex-shrink-0 w-8 h-8 rounded-full ${bgColor} text-primary-foreground flex items-center justify-center font-bold`}>
          {number}
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <div className="flex-1 pr-2">
              <h3 className="font-semibold text-primary">{title}</h3>
              <p className="text-sm text-muted-foreground">
                {subtitle}
              </p>
            </div>
            <div className="flex-shrink-0">
              {isExpanded ? (
                <ChevronUp className="w-5 h-5 text-muted-foreground" />
              ) : (
                <ChevronDown className="w-5 h-5 text-muted-foreground" />
              )}
            </div>
          </div>
        </div>
      </div>
      
      {isExpanded && expandedText && (
        <div className="px-4 pb-4 pl-16 animate-in slide-in-from-top-2 duration-200">
          <div className="p-4 bg-muted/30 rounded-md border border-primary/20">
            <p className="text-sm leading-relaxed whitespace-pre-wrap">
              {expandedText}
            </p>
          </div>
        </div>
      )}
    </div>
  )

}
