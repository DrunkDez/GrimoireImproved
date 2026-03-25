"use client"

import { useState, useEffect } from "react"
import { GrimoireHeader } from "@/components/grimoire-header"
import { GrimoireFooter } from "@/components/grimoire-footer"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { 
  ChevronDown,
  ChevronUp,
  BookOpen,
  ArrowRight
} from "lucide-react"
import Link from "next/link"

interface ExpandedContent {
  [key: string]: string
}

export default function CharacterCreationQuickGuide() {
  const [expandedSteps, setExpandedSteps] = useState<string[]>([])
  const [expandedContent, setExpandedContent] = useState<ExpandedContent>({})
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchExpandedContent()
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
    } finally {
      setIsLoading(false)
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
          <div className="text-center space-y-4">
            <h1 className="text-4xl md:text-5xl font-cinzel font-bold text-primary">
              Quick Character Creation Guide
            </h1>
            <p className="text-lg text-foreground/80 max-w-2xl mx-auto">
              Follow these steps to create your Mage: The Ascension character
            </p>
            
            {/* Link to detailed guide */}
            <div className="pt-4">
              <Link href="/character-creation/guide">
                <Button variant="outline" className="gap-2">
                  <BookOpen className="w-4 h-4" />
                  View Detailed Guide
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </div>
          </div>

          {/* Quick Steps Card */}
          <Card className="border-2 border-primary">
            <CardHeader>
              <CardTitle className="font-cinzel text-2xl">Character Creation Steps</CardTitle>
              <CardDescription>Click each step to see more details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
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
                  borderColor="border-primary/30"
                  bgColor="bg-primary"
                />
              </div>

              {/* Freebie costs reference */}
              <div className="mt-8 p-6 bg-accent/10 border-2 border-accent/30 rounded-lg">
                <h3 className="font-cinzel text-lg font-bold text-primary mb-4">
                  Freebie Point Costs
                </h3>
                <div className="grid md:grid-cols-2 gap-4 text-sm">
                  <ul className="space-y-2">
                    <li>• <strong>Attributes:</strong> 5 Freebie points per dot</li>
                    <li>• <strong>Abilities:</strong> 2 Freebie points per dot</li>
                    <li>• <strong>Backgrounds:</strong> 1 Freebie point per dot</li>
                    <li>• <strong>Spheres:</strong> 7 Freebie points per dot</li>
                  </ul>
                  <ul className="space-y-2">
                    <li>• <strong>Arete:</strong> 4 Freebie points per dot</li>
                    <li>• <strong>Willpower:</strong> 1 Freebie point per dot</li>
                    <li>• <strong>Quintessence:</strong> 1 Freebie point for 4 points</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* CTA to detailed guide */}
          <div className="text-center">
            <p className="text-muted-foreground mb-4">
              Want more detailed explanations for each category?
            </p>
            <Link href="/character-creation/guide">
              <Button size="lg" className="gap-2">
                <BookOpen className="w-5 h-5" />
                View Detailed Character Creation Guide
              </Button>
            </Link>
          </div>
        </div>

        <GrimoireFooter />
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
      className={`border-2 ${borderColor} rounded-lg cursor-pointer transition-all hover:shadow-lg hover:border-primary/50 bg-card`}
      onClick={onToggle}
    >
      <div className="flex gap-4 p-4">
        <div className={`flex-shrink-0 w-10 h-10 rounded-full ${bgColor} text-primary-foreground flex items-center justify-center font-bold text-lg`}>
          {number}
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <div className="flex-1 pr-2">
              <h3 className="font-semibold text-lg text-foreground">{title}</h3>
              <p className="text-sm text-foreground/80 mt-1">
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
          <div className="pt-3 border-t border-primary/20">
            <p className="text-sm leading-relaxed whitespace-pre-wrap text-foreground/90">
              {expandedText}
            </p>
          </div>
        </div>
      )}
    </div>
  )
}