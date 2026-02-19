"use client"

import { useState } from "react"
import { GrimoireHeader } from "@/components/grimoire-header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { 
  Sparkles, 
  Users, 
  Brain, 
  Dumbbell, 
  Zap, 
  BookOpen,
  Star,
  Heart,
  Target,
  Gift,
  ChevronRight,
  Info
} from "lucide-react"
import Link from "next/link"

export default function CharacterCreationGuide() {
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

          {/* Quick Start CTA */}
          <Card className="border-2 border-accent bg-accent/5">
            <CardContent className="p-8 text-center space-y-4">
              <Sparkles className="w-12 h-12 text-accent mx-auto" />
              <h2 className="text-2xl font-cinzel font-bold text-accent">
                Ready to Create Your Character?
              </h2>
              <p className="text-muted-foreground max-w-xl mx-auto">
                Use our guided character creation tool to build your mage step-by-step with automatic point tracking and helpful tips!
              </p>
              <Link href="/character-creation">
                <Button size="lg" className="gap-2">
                  <Sparkles className="w-5 h-5" />
                  Start Guided Creation
                  <ChevronRight className="w-5 h-5" />
                </Button>
              </Link>
            </CardContent>
          </Card>

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
              <Card className="border-2 border-primary">
                <CardHeader>
                  <CardTitle className="font-cinzel text-2xl">Character Creation Steps</CardTitle>
                  <CardDescription>Follow these steps to create your mage</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="flex gap-4 p-4 border-2 border-primary/30 rounded-md">
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                        1
                      </div>
                      <div>
                        <h3 className="font-semibold text-primary">Concept & Tradition</h3>
                        <p className="text-sm text-muted-foreground">
                          Choose your character concept, Tradition, and basic identity
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-4 p-4 border-2 border-primary/30 rounded-md">
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                        2
                      </div>
                      <div>
                        <h3 className="font-semibold text-primary">Attributes</h3>
                        <p className="text-sm text-muted-foreground">
                          Prioritize Physical, Social, and Mental (7/5/3 dots + 1 free each)
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-4 p-4 border-2 border-accent/30 rounded-md">
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-accent text-accent-foreground flex items-center justify-center font-bold">
                        3
                      </div>
                      <div>
                        <h3 className="font-semibold text-accent">Abilities</h3>
                        <p className="text-sm text-muted-foreground">
                          Prioritize Talents, Skills, Knowledges (13/9/5 dots, max 3 each)
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-4 p-4 border-2 border-ring/30 rounded-md">
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-ring text-ring-foreground flex items-center justify-center font-bold">
                        4
                      </div>
                      <div>
                        <h3 className="font-semibold text-ring">Spheres</h3>
                        <p className="text-sm text-muted-foreground">
                          Choose your magical Spheres (6 dots, affinity at 1, max 3 each)
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-4 p-4 border-2 border-primary/30 rounded-md">
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                        5
                      </div>
                      <div>
                        <h3 className="font-semibold text-primary">Backgrounds</h3>
                        <p className="text-sm text-muted-foreground">
                          Select Backgrounds like Avatar, Resources, Allies (7 dots total)
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-4 p-4 border-2 border-accent/30 rounded-md">
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-accent text-accent-foreground flex items-center justify-center font-bold">
                        6
                      </div>
                      <div>
                        <h3 className="font-semibold text-accent">Freebie Points</h3>
                        <p className="text-sm text-muted-foreground">
                          Spend 15 freebie points to customize your character
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

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
                        <li>• <strong>Attribute:</strong> 5 points per dot</li>
                        <li>• <strong>Ability:</strong> 2 points per dot</li>
                        <li>• <strong>Sphere:</strong> 7 points per dot</li>
                        <li>• <strong>Background:</strong> 1 point per dot</li>
                        <li>• <strong>Arete:</strong> 4 points per dot</li>
                        <li>• <strong>Willpower:</strong> 1 point per dot</li>
                        <li>• <strong>Quintessence:</strong> 4 points for 4 points</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Attributes Tab */}
            <TabsContent value="attributes" className="space-y-6">
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
                <CardContent className="space-y-6">
                  <div className="bg-primary/10 border border-primary/30 rounded-md p-4">
                    <p className="text-sm">
                      <strong>How it works:</strong> Each of the 9 attributes automatically starts at 1 dot (representing basic human capability). 
                      You then prioritize the three categories - Physical, Social, and Mental - choosing which gets 7 additional dots (Primary), 
                      5 additional dots (Secondary), and 3 additional dots (Tertiary).
                    </p>
                  </div>

                  <div className="grid gap-6 md:grid-cols-3">
                    <div className="space-y-3">
                      <h3 className="font-cinzel font-bold text-lg text-primary flex items-center gap-2">
                        <Dumbbell className="w-5 h-5" />
                        Physical
                      </h3>
                      <div className="space-y-2">
                        <div className="p-3 border border-primary/30 rounded-md">
                          <h4 className="font-semibold">Strength</h4>
                          <p className="text-xs text-muted-foreground">Physical power and muscle</p>
                        </div>
                        <div className="p-3 border border-primary/30 rounded-md">
                          <h4 className="font-semibold">Dexterity</h4>
                          <p className="text-xs text-muted-foreground">Agility and coordination</p>
                        </div>
                        <div className="p-3 border border-primary/30 rounded-md">
                          <h4 className="font-semibold">Stamina</h4>
                          <p className="text-xs text-muted-foreground">Endurance and resilience</p>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <h3 className="font-cinzel font-bold text-lg text-primary flex items-center gap-2">
                        <Users className="w-5 h-5" />
                        Social
                      </h3>
                      <div className="space-y-2">
                        <div className="p-3 border border-primary/30 rounded-md">
                          <h4 className="font-semibold">Charisma</h4>
                          <p className="text-xs text-muted-foreground">Charm and magnetism</p>
                        </div>
                        <div className="p-3 border border-primary/30 rounded-md">
                          <h4 className="font-semibold">Manipulation</h4>
                          <p className="text-xs text-muted-foreground">Persuasion and influence</p>
                        </div>
                        <div className="p-3 border border-primary/30 rounded-md">
                          <h4 className="font-semibold">Appearance</h4>
                          <p className="text-xs text-muted-foreground">Physical attractiveness</p>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <h3 className="font-cinzel font-bold text-lg text-primary flex items-center gap-2">
                        <Brain className="w-5 h-5" />
                        Mental
                      </h3>
                      <div className="space-y-2">
                        <div className="p-3 border border-primary/30 rounded-md">
                          <h4 className="font-semibold">Perception</h4>
                          <p className="text-xs text-muted-foreground">Awareness and insight</p>
                        </div>
                        <div className="p-3 border border-primary/30 rounded-md">
                          <h4 className="font-semibold">Intelligence</h4>
                          <p className="text-xs text-muted-foreground">Reasoning and memory</p>
                        </div>
                        <div className="p-3 border border-primary/30 rounded-md">
                          <h4 className="font-semibold">Wits</h4>
                          <p className="text-xs text-muted-foreground">Quick thinking and cunning</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-accent/10 border border-accent/30 rounded-md p-4">
                    <p className="text-sm">
                      <strong>💡 Tip:</strong> Most mages prioritize Mental or Social attributes. Consider your character concept - 
                      a street-smart hacker might prioritize Mental, a charismatic cult leader would choose Social, 
                      while a martial artist mage could go Physical first.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Abilities Tab */}
            <TabsContent value="abilities" className="space-y-6">
              <Card className="border-2 border-accent">
                <CardHeader>
                  <CardTitle className="font-cinzel text-2xl flex items-center gap-2">
                    <BookOpen className="w-6 h-6" />
                    Abilities
                  </CardTitle>
                  <CardDescription>
                    Your character's learned skills and knowledge - maximum 3 dots each during creation
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="bg-accent/10 border border-accent/30 rounded-md p-4">
                    <p className="text-sm">
                      <strong>How it works:</strong> Prioritize Talents, Skills, and Knowledges choosing which gets 13 dots (Primary), 
                      9 dots (Secondary), and 5 dots (Tertiary). No ability can exceed 3 dots during character creation.
                    </p>
                  </div>

                  <div className="grid gap-6 md:grid-cols-3">
                    <div className="space-y-3">
                      <h3 className="font-cinzel font-bold text-lg text-accent">Talents</h3>
                      <p className="text-xs text-muted-foreground mb-2">Intuitive abilities, no formal training needed</p>
                      <div className="space-y-1 text-sm">
                        <div className="flex items-start gap-2">
                          <span className="text-accent">•</span>
                          <span>Alertness, Art, Athletics, Awareness, Brawl, Empathy, Expression, Intimidation, Leadership, Streetwise, Subterfuge</span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <h3 className="font-cinzel font-bold text-lg text-accent">Skills</h3>
                      <p className="text-xs text-muted-foreground mb-2">Practical abilities requiring practice</p>
                      <div className="space-y-1 text-sm">
                        <div className="flex items-start gap-2">
                          <span className="text-accent">•</span>
                          <span>Craft, Drive, Etiquette, Firearms, Martial Arts, Meditation, Melee, Research, Stealth, Survival, Technology</span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <h3 className="font-cinzel font-bold text-lg text-accent">Knowledges</h3>
                      <p className="text-xs text-muted-foreground mb-2">Academic and scholarly learning</p>
                      <div className="space-y-1 text-sm">
                        <div className="flex items-start gap-2">
                          <span className="text-accent">•</span>
                          <span>Academics, Computer, Cosmology, Enigmas, Esoterica, Investigation, Law, Medicine, Occult, Politics, Science</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-ring/10 border border-ring/30 rounded-md p-4">
                    <p className="text-sm">
                      <strong>💡 Tip:</strong> <strong>Occult</strong> is essential for most mages! Also consider your Tradition's focus - 
                      Hermetics need Academics and Occult, Virtual Adepts need Computer and Technology, Akashic Brotherhood might want Martial Arts and Meditation.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Spheres Tab */}
            <TabsContent value="spheres" className="space-y-6">
              <Card className="border-2 border-ring">
                <CardHeader>
                  <CardTitle className="font-cinzel text-2xl flex items-center gap-2">
                    <Zap className="w-6 h-6" />
                    Spheres of Magic
                  </CardTitle>
                  <CardDescription>
                    Your character's magical capabilities - 6 dots to spend, max 3 per Sphere
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="bg-ring/10 border border-ring/30 rounded-md p-4">
                    <p className="text-sm">
                      <strong>How it works:</strong> Your Tradition grants one affinity Sphere at 1 dot for free. 
                      You have 6 additional dots to distribute among the Nine Spheres, with a maximum of 3 dots in any single Sphere during character creation.
                    </p>
                  </div>

                  <div className="grid gap-3 md:grid-cols-3">
                    {[
                      { name: "Correspondence", desc: "Space, distance, and connection" },
                      { name: "Entropy", desc: "Fate, fortune, and decay" },
                      { name: "Forces", desc: "Energy, fire, and motion" },
                      { name: "Life", desc: "Biology and healing" },
                      { name: "Matter", desc: "Substances and materials" },
                      { name: "Mind", desc: "Thoughts and consciousness" },
                      { name: "Prime", desc: "Quintessence and raw magic" },
                      { name: "Spirit", desc: "The Umbra and ephemera" },
                      { name: "Time", desc: "Past, present, and future" }
                    ].map(sphere => (
                      <div key={sphere.name} className="p-3 border border-ring/30 rounded-md">
                        <h4 className="font-semibold text-ring">{sphere.name}</h4>
                        <p className="text-xs text-muted-foreground">{sphere.desc}</p>
                      </div>
                    ))}
                  </div>

                  <div className="bg-accent/10 border border-accent/30 rounded-md p-4">
                    <p className="text-sm">
                      <strong>💡 Tip:</strong> Your Arete limits what you can do with Spheres. Starting Arete is 1, 
                      so you can only use the first level of each Sphere initially. Spend freebie points to raise Arete!
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Finishing Tab */}
            <TabsContent value="finishing" className="space-y-6">
              <Card className="border-2 border-accent">
                <CardHeader>
                  <CardTitle className="font-cinzel text-2xl flex items-center gap-2">
                    <Gift className="w-6 h-6" />
                    Finishing Touches
                  </CardTitle>
                  <CardDescription>
                    Complete your character with Backgrounds, Freebie Points, and personal details
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-semibold text-lg text-primary mb-2">Backgrounds (7 dots)</h3>
                      <p className="text-sm text-muted-foreground mb-3">
                        Backgrounds represent your character's resources, connections, and advantages. 
                        <strong>Avatar</strong> is essential for mages!
                      </p>
                      <div className="grid gap-2 md:grid-cols-2 text-sm">
                        <div>• Avatar (your inner guide)</div>
                        <div>• Allies (helpful contacts)</div>
                        <div>• Resources (wealth)</div>
                        <div>• Node (Quintessence source)</div>
                        <div>• Library (research materials)</div>
                        <div>• Mentor (wise teacher)</div>
                        <div>• And many more!</div>
                      </div>
                    </div>

                    <div>
                      <h3 className="font-semibold text-lg text-accent mb-2">Freebie Points (15 points)</h3>
                      <p className="text-sm text-muted-foreground mb-3">
                        Customize your character by spending 15 freebie points on:
                      </p>
                      <div className="grid gap-2 text-sm">
                        <div className="flex justify-between">
                          <span>Attributes</span>
                          <span className="text-accent font-semibold">5 points per dot</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Abilities</span>
                          <span className="text-accent font-semibold">2 points per dot</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Spheres</span>
                          <span className="text-accent font-semibold">7 points per dot</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Backgrounds</span>
                          <span className="text-accent font-semibold">1 point per dot</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Arete</span>
                          <span className="text-accent font-semibold">4 points per dot</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Willpower</span>
                          <span className="text-accent font-semibold">1 point per dot</span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="font-semibold text-lg text-ring mb-2">Character Details</h3>
                      <p className="text-sm text-muted-foreground mb-3">
                        Finally, add the finishing touches:
                      </p>
                      <ul className="space-y-1 text-sm">
                        <li>• Name, age, and appearance</li>
                        <li>• Nature & Demeanor (personality archetypes)</li>
                        <li>• Essence (Dynamic, Pattern, Primordial, or Questing)</li>
                        <li>• Character concept and background story</li>
                        <li>• Equipment and possessions</li>
                      </ul>
                    </div>
                  </div>

                  <div className="bg-primary/10 border border-primary/30 rounded-md p-4">
                    <p className="text-sm">
                      <strong>💡 Recommendation:</strong> Spend freebie points on <strong>Arete</strong> first! 
                      It's expensive but crucial - your Arete limits what you can do with your Spheres. 
                      Many players raise it from 1 to 3 during character creation.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Bottom CTA */}
          <Card className="border-2 border-accent bg-accent/5">
            <CardContent className="p-8 text-center space-y-4">
              <h2 className="text-2xl font-cinzel font-bold text-accent">
                Ready to Begin?
              </h2>
              <p className="text-muted-foreground max-w-xl mx-auto">
                Our guided creation tool will walk you through every step with automatic point tracking, 
                helpful tips, and validation to ensure your character follows all the rules!
              </p>
              <Link href="/character-creation">
                <Button size="lg" className="gap-2">
                  <Sparkles className="w-5 h-5" />
                  Start Creating Your Mage
                  <ChevronRight className="w-5 h-5" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

