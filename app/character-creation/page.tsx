"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"
import { Check, Lock, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

type Priority = "primary" | "secondary" | "tertiary" | null

interface CharacterCreationState {
  // Current phase
  phase: "attributes-priority" | "attributes-assign" | "abilities-priority" | "abilities-assign" | "spheres" | "complete"
  
  // Attribute priorities
  attributePriorities: {
    physical: Priority
    social: Priority
    mental: Priority
  }
  
  // Attribute values (each starts at 1, locked)
  attributes: {
    // Physical
    strength: number
    dexterity: number
    stamina: number
    // Social
    charisma: number
    manipulation: number
    appearance: number
    // Mental
    perception: number
    intelligence: number
    wits: number
  }
  
  // Ability priorities
  abilityPriorities: {
    talents: Priority
    skills: Priority
    knowledges: Priority
  }
  
  // Ability values
  abilities: {
    // Talents
    alertness: number
    art: number
    athletics: number
    awareness: number
    brawl: number
    empathy: number
    expression: number
    intimidation: number
    leadership: number
    streetwise: number
    subterfuge: number
    // Skills
    craft: number
    drive: number
    etiquette: number
    firearms: number
    martialArts: number
    meditation: number
    melee: number
    research: number
    stealth: number
    survival: number
    technology: number
    // Knowledges
    academics: number
    computer: number
    cosmology: number
    enigmas: number
    esoterica: number
    investigation: number
    law: number
    medicine: number
    occult: number
    politics: number
    science: number
  }
}

const INITIAL_STATE: CharacterCreationState = {
  phase: "attributes-priority",
  attributePriorities: {
    physical: null,
    social: null,
    mental: null
  },
  attributes: {
    strength: 1,
    dexterity: 1,
    stamina: 1,
    charisma: 1,
    manipulation: 1,
    appearance: 1,
    perception: 1,
    intelligence: 1,
    wits: 1
  },
  abilityPriorities: {
    talents: null,
    skills: null,
    knowledges: null
  },
  abilities: {
    alertness: 0, art: 0, athletics: 0, awareness: 0, brawl: 0,
    empathy: 0, expression: 0, intimidation: 0, leadership: 0,
    streetwise: 0, subterfuge: 0,
    craft: 0, drive: 0, etiquette: 0, firearms: 0, martialArts: 0,
    meditation: 0, melee: 0, research: 0, stealth: 0, survival: 0,
    technology: 0,
    academics: 0, computer: 0, cosmology: 0, enigmas: 0, esoterica: 0,
    investigation: 0, law: 0, medicine: 0, occult: 0, politics: 0,
    science: 0
  }
}

export default function ProperCharacterCreation() {
  const [state, setState] = useState<CharacterCreationState>(INITIAL_STATE)

  // Calculate points for attributes
  const getAttributePoints = (category: keyof typeof state.attributePriorities): number => {
    const priority = state.attributePriorities[category]
    if (priority === "primary") return 7
    if (priority === "secondary") return 5
    if (priority === "tertiary") return 3
    return 0
  }

  const getAttributesInCategory = (category: "physical" | "social" | "mental"): (keyof typeof state.attributes)[] => {
    if (category === "physical") return ["strength", "dexterity", "stamina"]
    if (category === "social") return ["charisma", "manipulation", "appearance"]
    return ["perception", "intelligence", "wits"]
  }

  const getAttributePointsSpent = (category: keyof typeof state.attributePriorities): number => {
    const attrs = getAttributesInCategory(category)
    // Each starts at 1, so we count points above 1
    return attrs.reduce((sum, attr) => sum + (state.attributes[attr] - 1), 0)
  }

  const getAttributePointsRemaining = (category: keyof typeof state.attributePriorities): number => {
    return getAttributePoints(category) - getAttributePointsSpent(category)
  }

  // Calculate points for abilities
  const getAbilityPoints = (category: keyof typeof state.abilityPriorities): number => {
    const priority = state.abilityPriorities[category]
    if (priority === "primary") return 13
    if (priority === "secondary") return 9
    if (priority === "tertiary") return 5
    return 0
  }

  const getAbilitiesInCategory = (category: "talents" | "skills" | "knowledges"): (keyof typeof state.abilities)[] => {
    if (category === "talents") {
      return ["alertness", "art", "athletics", "awareness", "brawl", "empathy", 
              "expression", "intimidation", "leadership", "streetwise", "subterfuge"]
    }
    if (category === "skills") {
      return ["craft", "drive", "etiquette", "firearms", "martialArts", "meditation",
              "melee", "research", "stealth", "survival", "technology"]
    }
    return ["academics", "computer", "cosmology", "enigmas", "esoterica", "investigation",
            "law", "medicine", "occult", "politics", "science"]
  }

  const getAbilityPointsSpent = (category: keyof typeof state.abilityPriorities): number => {
    const abilities = getAbilitiesInCategory(category)
    return abilities.reduce((sum, ability) => sum + state.abilities[ability], 0)
  }

  const getAbilityPointsRemaining = (category: keyof typeof state.abilityPriorities): number => {
    return getAbilityPoints(category) - getAbilityPointsSpent(category)
  }

  // Set priority
  const setAttributePriority = (category: keyof typeof state.attributePriorities, priority: Priority) => {
    // Clear any existing assignment of this priority
    const newPriorities = { ...state.attributePriorities }
    Object.keys(newPriorities).forEach(key => {
      if (newPriorities[key as keyof typeof newPriorities] === priority) {
        newPriorities[key as keyof typeof newPriorities] = null
      }
    })
    newPriorities[category] = priority
    
    setState({ ...state, attributePriorities: newPriorities })
  }

  const setAbilityPriority = (category: keyof typeof state.abilityPriorities, priority: Priority) => {
    const newPriorities = { ...state.abilityPriorities }
    Object.keys(newPriorities).forEach(key => {
      if (newPriorities[key as keyof typeof newPriorities] === priority) {
        newPriorities[key as keyof typeof newPriorities] = null
      }
    })
    newPriorities[category] = priority
    
    setState({ ...state, abilityPriorities: newPriorities })
  }

  // Check if can proceed
  const canProceedFromAttributePriority = () => {
    return Object.values(state.attributePriorities).filter(p => p !== null).length === 3
  }

  const canProceedFromAttributeAssign = () => {
    return getAttributePointsRemaining("physical") === 0 &&
           getAttributePointsRemaining("social") === 0 &&
           getAttributePointsRemaining("mental") === 0
  }

  const canProceedFromAbilityPriority = () => {
    return Object.values(state.abilityPriorities).filter(p => p !== null).length === 3
  }

  const canProceedFromAbilityAssign = () => {
    return getAbilityPointsRemaining("talents") === 0 &&
           getAbilityPointsRemaining("skills") === 0 &&
           getAbilityPointsRemaining("knowledges") === 0
  }

  // Set attribute value
  const setAttributeValue = (attr: keyof typeof state.attributes, value: number) => {
    // Can't go below 1
    if (value < 1) return
    
    // Find which category this attribute belongs to
    let category: "physical" | "social" | "mental" = "physical"
    if (["charisma", "manipulation", "appearance"].includes(attr)) category = "social"
    if (["perception", "intelligence", "wits"].includes(attr)) category = "mental"
    
    // Check if we have enough points
    const currentValue = state.attributes[attr]
    const pointDiff = value - currentValue
    const remaining = getAttributePointsRemaining(category)
    
    if (pointDiff > remaining) return // Not enough points
    
    setState({
      ...state,
      attributes: {
        ...state.attributes,
        [attr]: value
      }
    })
  }

  // Set ability value
  const setAbilityValue = (ability: keyof typeof state.abilities, value: number) => {
    // Can't go below 0
    if (value < 0) return
    
    // Can't go above 3 during character creation
    if (value > 3) return
    
    // Find which category
    let category: "talents" | "skills" | "knowledges" = "talents"
    if (getAbilitiesInCategory("skills").includes(ability)) category = "skills"
    if (getAbilitiesInCategory("knowledges").includes(ability)) category = "knowledges"
    
    // Check points
    const currentValue = state.abilities[ability]
    const pointDiff = value - currentValue
    const remaining = getAbilityPointsRemaining(category)
    
    if (pointDiff > remaining) return
    
    setState({
      ...state,
      abilities: {
        ...state.abilities,
        [ability]: value
      }
    })
  }

  return (
    <div className="min-h-screen p-6 md:p-10 space-y-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl md:text-5xl font-cinzel font-bold text-primary">
            Character Creation
          </h1>
          <div className="flex items-center justify-center gap-2">
            {["Attributes Priority", "Attributes", "Abilities Priority", "Abilities", "Complete"].map((step, i) => (
              <div key={i} className="flex items-center gap-2">
                {i > 0 && <div className="w-8 h-0.5 bg-primary/30" />}
                <div className={cn(
                  "w-8 h-8 rounded-full border-2 flex items-center justify-center text-xs font-bold",
                  i < ["attributes-priority", "attributes-assign", "abilities-priority", "abilities-assign", "complete"].indexOf(state.phase)
                    ? "bg-primary border-primary text-primary-foreground"
                    : i === ["attributes-priority", "attributes-assign", "abilities-priority", "abilities-assign", "complete"].indexOf(state.phase)
                    ? "border-accent text-accent animate-pulse"
                    : "border-primary/30 text-muted-foreground"
                )}>
                  {i < ["attributes-priority", "attributes-assign", "abilities-priority", "abilities-assign", "complete"].indexOf(state.phase) ? <Check className="w-4 h-4" /> : i + 1}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* PHASE 1: Attribute Priority Selection */}
        {state.phase === "attributes-priority" && (
          <Card className="border-2 border-accent">
            <CardHeader>
              <CardTitle className="font-cinzel text-2xl">Step 1: Prioritize Attributes</CardTitle>
              <CardDescription>
                Choose which attribute category gets 7 dots (Primary), 5 dots (Secondary), and 3 dots (Tertiary).
                <br />Each attribute starts at 1 dot automatically.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {(["physical", "social", "mental"] as const).map(category => (
                <div key={category} className="flex items-center justify-between p-4 border-2 border-primary/30 rounded-md">
                  <div>
                    <h3 className="font-serif font-bold text-lg capitalize">{category} Attributes</h3>
                    <p className="text-sm text-muted-foreground">
                      {category === "physical" && "Strength, Dexterity, Stamina"}
                      {category === "social" && "Charisma, Manipulation, Appearance"}
                      {category === "mental" && "Perception, Intelligence, Wits"}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    {(["primary", "secondary", "tertiary"] as const).map(priority => (
                      <Button
                        key={priority}
                        size="sm"
                        variant={state.attributePriorities[category] === priority ? "default" : "outline"}
                        onClick={() => setAttributePriority(category, priority)}
                      >
                        {priority === "primary" && "Primary (7)"}
                        {priority === "secondary" && "Secondary (5)"}
                        {priority === "tertiary" && "Tertiary (3)"}
                      </Button>
                    ))}
                  </div>
                </div>
              ))}
              
              <Button 
                className="w-full" 
                size="lg"
                disabled={!canProceedFromAttributePriority()}
                onClick={() => setState({ ...state, phase: "attributes-assign" })}
              >
                Continue to Attribute Assignment →
              </Button>
            </CardContent>
          </Card>
        )}

        {/* PHASE 2: Attribute Assignment */}
        {state.phase === "attributes-assign" && (
          <div className="space-y-6">
            {(["physical", "social", "mental"] as const).map(category => {
              const priority = state.attributePriorities[category]
              if (!priority) return null
              
              const remaining = getAttributePointsRemaining(category)
              const total = getAttributePoints(category)
              
              return (
                <Card key={category} className="border-2 border-primary">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="font-cinzel text-2xl capitalize">{category} Attributes</CardTitle>
                        <CardDescription>
                          {priority.charAt(0).toUpperCase() + priority.slice(1)} - {total} dots to spend
                        </CardDescription>
                      </div>
                      <Badge variant={remaining === 0 ? "default" : "secondary"} className="text-lg px-4 py-2">
                        {remaining} / {total} remaining
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {getAttributesInCategory(category).map(attr => (
                      <AttributeDotRating
                        key={attr}
                        label={attr.charAt(0).toUpperCase() + attr.slice(1)}
                        value={state.attributes[attr]}
                        onChange={(v) => setAttributeValue(attr, v)}
                        locked={true}
                      />
                    ))}
                  </CardContent>
                </Card>
              )
            })}
            
            <Button
              className="w-full"
              size="lg"
              disabled={!canProceedFromAttributeAssign()}
              onClick={() => setState({ ...state, phase: "abilities-priority" })}
            >
              Continue to Abilities →
            </Button>
          </div>
        )}

        {/* PHASE 3: Ability Priority Selection */}
        {state.phase === "abilities-priority" && (
          <Card className="border-2 border-accent">
            <CardHeader>
              <CardTitle className="font-cinzel text-2xl">Step 2: Prioritize Abilities</CardTitle>
              <CardDescription>
                Choose which ability category gets 13 dots (Primary), 9 dots (Secondary), and 5 dots (Tertiary).
                <br />No ability can exceed 3 dots during character creation.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {(["talents", "skills", "knowledges"] as const).map(category => (
                <div key={category} className="flex items-center justify-between p-4 border-2 border-accent/30 rounded-md">
                  <div>
                    <h3 className="font-serif font-bold text-lg capitalize">{category}</h3>
                    <p className="text-sm text-muted-foreground">
                      {category === "talents" && "Alertness, Art, Athletics, Awareness, Brawl, Empathy, Expression, Intimidation, Leadership, Streetwise, Subterfuge"}
                      {category === "skills" && "Craft, Drive, Etiquette, Firearms, Martial Arts, Meditation, Melee, Research, Stealth, Survival, Technology"}
                      {category === "knowledges" && "Academics, Computer, Cosmology, Enigmas, Esoterica, Investigation, Law, Medicine, Occult, Politics, Science"}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    {(["primary", "secondary", "tertiary"] as const).map(priority => (
                      <Button
                        key={priority}
                        size="sm"
                        variant={state.abilityPriorities[category] === priority ? "default" : "outline"}
                        onClick={() => setAbilityPriority(category, priority)}
                      >
                        {priority === "primary" && "Primary (13)"}
                        {priority === "secondary" && "Secondary (9)"}
                        {priority === "tertiary" && "Tertiary (5)"}
                      </Button>
                    ))}
                  </div>
                </div>
              ))}
              
              <Button 
                className="w-full" 
                size="lg"
                disabled={!canProceedFromAbilityPriority()}
                onClick={() => setState({ ...state, phase: "abilities-assign" })}
              >
                Continue to Ability Assignment →
              </Button>
            </CardContent>
          </Card>
        )}

        {/* PHASE 4: Ability Assignment */}
        {state.phase === "abilities-assign" && (
          <div className="space-y-6">
            {(["talents", "skills", "knowledges"] as const).map(category => {
              const priority = state.abilityPriorities[category]
              if (!priority) return null
              
              const remaining = getAbilityPointsRemaining(category)
              const total = getAbilityPoints(category)
              
              return (
                <Card key={category} className="border-2 border-accent">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="font-cinzel text-2xl capitalize">{category}</CardTitle>
                        <CardDescription>
                          {priority.charAt(0).toUpperCase() + priority.slice(1)} - {total} dots (Max 3 per ability)
                        </CardDescription>
                      </div>
                      <Badge variant={remaining === 0 ? "default" : "secondary"} className="text-lg px-4 py-2">
                        {remaining} / {total} remaining
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {getAbilitiesInCategory(category).map(ability => (
                      <AbilityDotRating
                        key={ability}
                        label={ability.charAt(0).toUpperCase() + ability.replace(/([A-Z])/g, ' $1').trim()}
                        value={state.abilities[ability]}
                        onChange={(v) => setAbilityValue(ability, v)}
                        maxDots={3}
                      />
                    ))}
                  </CardContent>
                </Card>
              )
            })}
            
            <Button
              className="w-full"
              size="lg"
              disabled={!canProceedFromAbilityAssign()}
              onClick={() => setState({ ...state, phase: "complete" })}
            >
              Continue to Spheres →
            </Button>
          </div>
        )}

        {/* PHASE 5: Complete */}
        {state.phase === "complete" && (
          <Card className="border-2 border-accent">
            <CardHeader>
              <CardTitle className="font-cinzel text-2xl text-accent">✨ Character Creation Complete!</CardTitle>
              <CardDescription>
                Your character's basic traits are set. Next you'll choose Spheres, Backgrounds, and spend Freebie Points!
              </CardDescription>
            </CardHeader>
          </Card>
        )}
      </div>
    </div>
  )
}

// Attribute Dot Component (locked at 1)
function AttributeDotRating({ label, value, onChange, locked }: { 
  label: string
  value: number
  onChange: (value: number) => void
  locked?: boolean
}) {
  const [hoveredValue, setHoveredValue] = useState<number | null>(null)
  const displayValue = hoveredValue !== null ? hoveredValue : value

  return (
    <div className="flex items-center justify-between gap-4 py-3 px-4 rounded-md hover:bg-accent/5 transition-colors">
      <label className="font-serif text-sm font-semibold text-foreground min-w-[120px]">
        {label}
      </label>
      
      <div 
        className="flex gap-1.5"
        onMouseLeave={() => setHoveredValue(null)}
      >
        {Array.from({ length: 5 }, (_, i) => {
          const dotValue = i + 1
          const isFilled = dotValue <= displayValue
          const isLocked = locked && dotValue === 1
          const isHovered = hoveredValue !== null && dotValue <= hoveredValue

          return (
            <button
              key={i}
              type="button"
              onClick={() => !isLocked && onChange(dotValue === value ? (locked ? 1 : 0) : dotValue)}
              onMouseEnter={() => !isLocked && setHoveredValue(dotValue)}
              disabled={isLocked}
              className={cn(
                "relative w-6 h-6 rounded-full border-2 transition-all duration-300 ease-out",
                !isLocked && "hover:scale-110 active:scale-95 cursor-pointer",
                "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
                isLocked && "cursor-not-allowed",
                isFilled 
                  ? "bg-primary border-primary shadow-[0_0_8px_rgba(139,71,38,0.6)] animate-dot-fill" 
                  : "border-primary/40 bg-background",
                !isFilled && isHovered && "border-primary shadow-[0_0_4px_rgba(139,71,38,0.4)]"
              )}
              style={{
                animationDelay: isFilled ? `${i * 50}ms` : '0ms'
              }}
            >
              {isLocked && (
                <Lock className="w-3 h-3 absolute inset-0 m-auto text-primary" />
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}

// Ability Dot Component (max 3)
function AbilityDotRating({ label, value, onChange, maxDots = 3 }: { 
  label: string
  value: number
  onChange: (value: number) => void
  maxDots?: number
}) {
  const [hoveredValue, setHoveredValue] = useState<number | null>(null)
  const displayValue = hoveredValue !== null ? hoveredValue : value

  return (
    <div className="flex items-center justify-between gap-4 py-3 px-4 rounded-md hover:bg-accent/5 transition-colors">
      <label className="font-serif text-sm font-semibold text-foreground min-w-[140px]">
        {label}
      </label>
      
      <div 
        className="flex gap-1.5"
        onMouseLeave={() => setHoveredValue(null)}
      >
        {Array.from({ length: maxDots }, (_, i) => {
          const dotValue = i + 1
          const isFilled = dotValue <= displayValue
          const isHovered = hoveredValue !== null && dotValue <= hoveredValue

          return (
            <button
              key={i}
              type="button"
              onClick={() => onChange(dotValue === value ? 0 : dotValue)}
              onMouseEnter={() => setHoveredValue(dotValue)}
              className={cn(
                "relative w-6 h-6 rounded-full border-2 transition-all duration-300 ease-out",
                "hover:scale-110 active:scale-95 cursor-pointer",
                "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
                isFilled 
                  ? "bg-accent border-accent shadow-[0_0_8px_rgba(218,165,32,0.6)] animate-dot-fill" 
                  : "border-accent/40 bg-background",
                !isFilled && isHovered && "border-accent shadow-[0_0_4px_rgba(218,165,32,0.4)]"
              )}
              style={{
                animationDelay: isFilled ? `${i * 50}ms` : '0ms'
              }}
            />
          )
        })}
      </div>
    </div>
  )
}
