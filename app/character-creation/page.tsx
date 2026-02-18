"use client"

import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"
import { Lock, ChevronRight, Check, Plus, Minus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

type Priority = "primary" | "secondary" | "tertiary" | null

interface CharacterState {
  // Basic Info
  name: string
  player: string
  chronicle: string
  nature: string
  demeanor: string
  essence: string
  affiliation: string
  sect: string
  concept: string
  
  // Current phase
  phase: "basics" | "attributes-priority" | "attributes-assign" | "abilities-priority" | "abilities-assign" | "spheres" | "backgrounds" | "freebies" | "complete"
  
  // Freebie Points tracking
  freebieDots: {
    attributes: { [key: string]: number }
    abilities: { [key: string]: number }
    spheres: { [key: string]: number }
    backgrounds: { [key: string]: number }
    arete: number
    willpower: number
  }
  specialties: { [key: string]: string }
  merits: Array<{ id: string, name: string, cost: number }>
  flaws: Array<{ id: string, name: string, cost: number }>
  
  // Priorities
  attributePriorities: {
    physical: Priority
    social: Priority
    mental: Priority
  }
  
  // Attributes (each starts at 1)
  attributes: {
    strength: number
    dexterity: number
    stamina: number
    charisma: number
    manipulation: number
    appearance: number
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
  
  // Abilities (all start at 0)
  abilities: {
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
    crafts: number
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
  
  // Spheres
  spheres: {
    correspondence: number
    entropy: number
    forces: number
    life: number
    matter: number
    mind: number
    prime: number
    spirit: number
    time: number
  }
  affinitySphere: string
  
  // Backgrounds
  backgrounds: { [key: string]: number }
  
  // Other
  arete: number
  willpower: number
}

const INITIAL_STATE: CharacterState = {
  name: "",
  player: "",
  chronicle: "",
  nature: "",
  demeanor: "",
  essence: "",
  affiliation: "",
  sect: "",
  concept: "",
  phase: "basics",
  attributePriorities: { physical: null, social: null, mental: null },
  attributes: {
    strength: 1, dexterity: 1, stamina: 1,
    charisma: 1, manipulation: 1, appearance: 1,
    perception: 1, intelligence: 1, wits: 1
  },
  abilityPriorities: { talents: null, skills: null, knowledges: null },
  abilities: {
    alertness: 0, art: 0, athletics: 0, awareness: 0, brawl: 0,
    empathy: 0, expression: 0, intimidation: 0, leadership: 0,
    streetwise: 0, subterfuge: 0,
    crafts: 0, drive: 0, etiquette: 0, firearms: 0, martialArts: 0,
    meditation: 0, melee: 0, research: 0, stealth: 0, survival: 0,
    technology: 0,
    academics: 0, computer: 0, cosmology: 0, enigmas: 0, esoterica: 0,
    investigation: 0, law: 0, medicine: 0, occult: 0, politics: 0,
    science: 0
  },
  spheres: {
    correspondence: 0, entropy: 0, forces: 0,
    life: 0, matter: 0, mind: 0,
    prime: 0, spirit: 0, time: 0
  },
  affinitySphere: "",
  backgrounds: {},
  arete: 1,
  willpower: 5,
  freebieDots: {
    attributes: {},
    abilities: {},
    spheres: {},
    backgrounds: {},
    arete: 0,
    willpower: 0
  },
  specialties: {},
  merits: [],
  flaws: []
}

// Backgrounds Phase Component
function BackgroundsPhase({ state, setState, onBack, onContinue }: {
  state: CharacterState
  setState: (state: CharacterState) => void
  onBack: () => void
  onContinue: () => void
}) {
  const [backgrounds, setBackgrounds] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchBackgrounds()
  }, [])

  const fetchBackgrounds = async () => {
    try {
      const response = await fetch('/api/backgrounds')
      if (response.ok) {
        const data = await response.json()
        setBackgrounds(data)
      }
    } catch (error) {
      console.error('Error fetching backgrounds:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const getBackgroundPointsSpent = (): number => {
    return Object.values(state.backgrounds).reduce((sum, val) => sum + val, 0)
  }

  const getBackgroundPointsRemaining = (): number => {
    return 7 - getBackgroundPointsSpent()
  }

  const setBackgroundValue = (backgroundName: string, value: number) => {
    if (value < 0 || value > 5) return
    
    const currentValue = state.backgrounds[backgroundName] || 0
    const pointDiff = value - currentValue
    const remaining = getBackgroundPointsRemaining()
    
    if (pointDiff > remaining) return
    
    const newBackgrounds = { ...state.backgrounds }
    if (value === 0) {
      delete newBackgrounds[backgroundName]
    } else {
      newBackgrounds[backgroundName] = value
    }
    
    setState({
      ...state,
      backgrounds: newBackgrounds
    })
  }

  const canProceed = () => getBackgroundPointsRemaining() === 0

  const generalBackgrounds = backgrounds.filter(bg => bg.subtype === 'general')
  const mageBackgrounds = backgrounds.filter(bg => bg.subtype === 'mage')

  return (
    <div className="space-y-6">
      <SectionHeader 
        title="Backgrounds" 
        subtitle="7 dots to spend • Represents resources, connections, and advantages"
      />

      {isLoading ? (
        <div className="text-center py-8" style={{ color: '#6b4423' }}>
          Loading backgrounds...
        </div>
      ) : (
        <>
          <div className="flex items-center justify-between p-3 rounded" style={{ background: 'rgba(139, 69, 19, 0.1)' }}>
            <span className="text-sm font-semibold" style={{ color: '#4a2c2a' }}>
              Select backgrounds to enhance your character
            </span>
            <span className="text-sm font-semibold px-3 py-1 rounded" style={{
              background: getBackgroundPointsRemaining() === 0 ? '#d4af37' : 'rgba(212, 175, 55, 0.2)',
              color: '#4a2c2a'
            }}>
              {getBackgroundPointsRemaining()} / 7 remaining
            </span>
          </div>

          {/* General Backgrounds */}
          {generalBackgrounds.length > 0 && (
            <div className="space-y-4">
              <h3 className="font-bold text-lg border-b-2 pb-2" style={{ 
                color: '#4a2c2a',
                borderColor: '#8b4513'
              }}>
                General Backgrounds
              </h3>
              <div className="space-y-1">
                {generalBackgrounds.map(bg => (
                  <BackgroundRating
                    key={bg.id}
                    background={bg}
                    value={state.backgrounds[bg.name] || 0}
                    onChange={(v) => setBackgroundValue(bg.name, v)}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Mage Backgrounds */}
          {mageBackgrounds.length > 0 && (
            <div className="space-y-4">
              <h3 className="font-bold text-lg border-b-2 pb-2" style={{ 
                color: '#6b2d6b',
                borderColor: '#8b4513'
              }}>
                Mage Backgrounds
              </h3>
              <div className="space-y-1">
                {mageBackgrounds.map(bg => (
                  <BackgroundRating
                    key={bg.id}
                    background={bg}
                    value={state.backgrounds[bg.name] || 0}
                    onChange={(v) => setBackgroundValue(bg.name, v)}
                  />
                ))}
              </div>
            </div>
          )}
        </>
      )}

      <div className="flex gap-3">
        <SheetButton
          onClick={onBack}
          disabled={false}
          variant="secondary"
        >
          ← Back
        </SheetButton>
        <SheetButton
          onClick={onContinue}
          disabled={!canProceed()}
        >
          Continue to Freebie Points <ChevronRight className="w-4 h-4 ml-2" />
        </SheetButton>
      </div>
    </div>
  )
}

// Background Rating Component
function BackgroundRating({ background, value, onChange }: {
  background: any
  value: number
  onChange: (value: number) => void
}) {
  const [showDescription, setShowDescription] = useState(false)
  const maxDots = 5 // Most backgrounds go to 5

  return (
    <div className="border rounded p-2 transition-all" style={{ 
      borderColor: value > 0 ? '#8b4513' : 'rgba(139, 69, 19, 0.2)',
      background: value > 0 ? 'rgba(139, 69, 19, 0.05)' : 'transparent'
    }}>
      <div className="flex items-center justify-between">
        <button
          onClick={() => setShowDescription(!showDescription)}
          className="text-sm font-serif text-left flex-1 hover:text-primary transition-colors"
          style={{ color: '#4a2c2a' }}
        >
          {background.name}
          {background.cost !== 'Variable' && (
            <span className="ml-2 text-xs" style={{ color: '#6b4423' }}>
              ({background.cost})
            </span>
          )}
        </button>
        
        <div className="flex gap-0.5 ml-4">
          {Array.from({ length: maxDots }, (_, i) => {
            const dotValue = i + 1
            const isFilled = dotValue <= value

            return (
              <button
                key={i}
                type="button"
                onClick={() => onChange(dotValue === value ? 0 : dotValue)}
                className="w-4 h-4 rounded-full border-2 transition-all duration-200 hover:scale-110 cursor-pointer"
                style={{
                  borderColor: '#4a2c2a',
                  backgroundColor: isFilled ? '#4a2c2a' : 'transparent'
                }}
              />
            )
          })}
        </div>
      </div>

      {showDescription && (
        <div className="mt-2 pt-2 border-t text-xs" style={{ 
          borderColor: 'rgba(139, 69, 19, 0.2)',
          color: '#6b4423'
        }}>
          {background.description}
          {background.pageRef && (
            <div className="mt-1 italic" style={{ color: '#8b6914' }}>
              Reference: {background.pageRef}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default function FullMageSheetCreation() {
  const [state, setState] = useState<CharacterState>(INITIAL_STATE)

  // Attribute helpers
  const getAttributePoints = (category: keyof typeof state.attributePriorities): number => {
    const priority = state.attributePriorities[category]
    return priority === "primary" ? 7 : priority === "secondary" ? 5 : priority === "tertiary" ? 3 : 0
  }

  const getAttributesInCategory = (category: "physical" | "social" | "mental"): (keyof typeof state.attributes)[] => {
    if (category === "physical") return ["strength", "dexterity", "stamina"]
    if (category === "social") return ["charisma", "manipulation", "appearance"]
    return ["perception", "intelligence", "wits"]
  }

  const getAttributePointsSpent = (category: keyof typeof state.attributePriorities): number => {
    const attrs = getAttributesInCategory(category)
    return attrs.reduce((sum, attr) => sum + (state.attributes[attr] - 1), 0)
  }

  const getAttributePointsRemaining = (category: keyof typeof state.attributePriorities): number => {
    return getAttributePoints(category) - getAttributePointsSpent(category)
  }

  const setAttributeValue = (attr: keyof typeof state.attributes, value: number) => {
    if (value < 1) return
    let category: "physical" | "social" | "mental" = "physical"
    if (["charisma", "manipulation", "appearance"].includes(attr)) category = "social"
    if (["perception", "intelligence", "wits"].includes(attr)) category = "mental"
    
    const currentValue = state.attributes[attr]
    const pointDiff = value - currentValue
    const remaining = getAttributePointsRemaining(category)
    
    if (pointDiff > remaining) return
    
    setState({
      ...state,
      attributes: { ...state.attributes, [attr]: value }
    })
  }

  const setAttributePriority = (category: keyof typeof state.attributePriorities, priority: Priority) => {
    const newPriorities = { ...state.attributePriorities }
    Object.keys(newPriorities).forEach(key => {
      if (newPriorities[key as keyof typeof newPriorities] === priority) {
        newPriorities[key as keyof typeof newPriorities] = null
      }
    })
    newPriorities[category] = priority
    setState({ ...state, attributePriorities: newPriorities })
  }

  // Ability helpers
  const getAbilityPoints = (category: keyof typeof state.abilityPriorities): number => {
    const priority = state.abilityPriorities[category]
    return priority === "primary" ? 13 : priority === "secondary" ? 9 : priority === "tertiary" ? 5 : 0
  }

  const getAbilitiesInCategory = (category: "talents" | "skills" | "knowledges"): (keyof typeof state.abilities)[] => {
    if (category === "talents") {
      return ["alertness", "art", "athletics", "awareness", "brawl", "empathy", 
              "expression", "intimidation", "leadership", "streetwise", "subterfuge"]
    }
    if (category === "skills") {
      return ["crafts", "drive", "etiquette", "firearms", "martialArts", "meditation",
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

  const setAbilityValue = (ability: keyof typeof state.abilities, value: number) => {
    if (value < 0 || value > 3) return
    
    let category: "talents" | "skills" | "knowledges" = "talents"
    if (getAbilitiesInCategory("skills").includes(ability)) category = "skills"
    if (getAbilitiesInCategory("knowledges").includes(ability)) category = "knowledges"
    
    const currentValue = state.abilities[ability]
    const pointDiff = value - currentValue
    const remaining = getAbilityPointsRemaining(category)
    
    if (pointDiff > remaining) return
    
    setState({
      ...state,
      abilities: { ...state.abilities, [ability]: value }
    })
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

  // Sphere helpers
  const getSpherePointsSpent = (): number => {
    return Object.values(state.spheres).reduce((sum, val) => sum + val, 0)
  }

  const getSpherePointsRemaining = (): number => {
    return 6 - getSpherePointsSpent()
  }

  const setSphereValue = (sphere: keyof typeof state.spheres, value: number) => {
    if (value < 0 || value > 3) return
    
    // If this is the affinity sphere, minimum is 1
    const isAffinity = state.affinitySphere === sphere
    if (isAffinity && value < 1) return
    
    const currentValue = state.spheres[sphere]
    const pointDiff = value - currentValue
    const remaining = getSpherePointsRemaining()
    
    if (pointDiff > remaining) return
    
    setState({
      ...state,
      spheres: { ...state.spheres, [sphere]: value }
    })
  }

  // Validation
  const canProceedFromBasics = () => state.name.length > 0
  const canProceedFromAttributePriority = () => Object.values(state.attributePriorities).filter(p => p !== null).length === 3
  const canProceedFromAttributeAssign = () => {
    return getAttributePointsRemaining("physical") === 0 &&
           getAttributePointsRemaining("social") === 0 &&
           getAttributePointsRemaining("mental") === 0
  }
  const canProceedFromAbilityPriority = () => Object.values(state.abilityPriorities).filter(p => p !== null).length === 3
  const canProceedFromAbilityAssign = () => {
    return getAbilityPointsRemaining("talents") === 0 &&
           getAbilityPointsRemaining("skills") === 0 &&
           getAbilityPointsRemaining("knowledges") === 0
  }
  const canProceedFromSpheres = () => getSpherePointsRemaining() === 0 && state.affinitySphere !== ""

  const formatAbilityName = (ability: string): string => {
    return ability
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, str => str.toUpperCase())
      .trim()
  }

  return (
    <div className="min-h-screen p-4 md:p-8" style={{
      background: 'linear-gradient(135deg, #2d1b4e 0%, #1a0f2e 100%)'
    }}>
      <div className="max-w-5xl mx-auto">
        {/* Character Sheet Container */}
        <div className="relative" style={{
          background: 'linear-gradient(to bottom, #f5f0e8 0%, #ede5d8 100%)',
          border: '8px solid transparent',
          borderImage: 'linear-gradient(135deg, #d4af37 0%, #8b6914 50%, #d4af37 100%) 1',
          boxShadow: '0 0 40px rgba(212, 175, 55, 0.4), inset 0 0 60px rgba(0, 0, 0, 0.1)'
        }}>
          {/* Decorative Corners */}
          <div className="absolute top-0 left-0 w-24 h-24 pointer-events-none" style={{
            background: 'linear-gradient(135deg, transparent 40%, #d4af37 40%, #d4af37 42%, transparent 42%)'
          }} />
          <div className="absolute top-0 right-0 w-24 h-24 pointer-events-none" style={{
            background: 'linear-gradient(225deg, transparent 40%, #d4af37 40%, #d4af37 42%, transparent 42%)'
          }} />
          <div className="absolute bottom-0 left-0 w-24 h-24 pointer-events-none" style={{
            background: 'linear-gradient(45deg, transparent 40%, #d4af37 40%, #d4af37 42%, transparent 42%)'
          }} />
          <div className="absolute bottom-0 right-0 w-24 h-24 pointer-events-none" style={{
            background: 'linear-gradient(315deg, transparent 40%, #d4af37 40%, #d4af37 42%, transparent 42%)'
          }} />

          {/* Header */}
          <div className="relative text-center py-6 border-b-4" style={{
            borderColor: '#8b4513',
            background: 'linear-gradient(to bottom, rgba(139, 69, 19, 0.1), transparent)'
          }}>
            <h1 className="text-5xl font-black tracking-wider" style={{
              fontFamily: 'Georgia, serif',
              color: '#4a2c2a',
              textShadow: '2px 2px 4px rgba(212, 175, 55, 0.3)',
              letterSpacing: '0.15em'
            }}>
              MAGE
            </h1>
            <p className="text-xl tracking-widest mt-1" style={{
              fontFamily: 'Georgia, serif',
              color: '#6b2d6b',
              fontStyle: 'italic'
            }}>
              The Ascension
            </p>
          </div>

          <div className="p-8">
            {/* PHASE: BASICS */}
            {state.phase === "basics" && (
              <div className="space-y-6">
                <div className="grid grid-cols-3 gap-4">
                  <SheetInput label="Name:" value={state.name} onChange={(v) => setState({ ...state, name: v })} />
                  <SheetInput label="Player:" value={state.player} onChange={(v) => setState({ ...state, player: v })} />
                  <SheetInput label="Chronicle:" value={state.chronicle} onChange={(v) => setState({ ...state, chronicle: v })} />
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <SheetInput label="Nature:" value={state.nature} onChange={(v) => setState({ ...state, nature: v })} />
                  <SheetInput label="Demeanor:" value={state.demeanor} onChange={(v) => setState({ ...state, demeanor: v })} />
                  <SheetInput label="Essence:" value={state.essence} onChange={(v) => setState({ ...state, essence: v })} placeholder="Dynamic/Pattern/Primordial/Questing" />
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <SheetInput label="Affiliation:" value={state.affiliation} onChange={(v) => setState({ ...state, affiliation: v })} placeholder="Tradition" />
                  <SheetInput label="Sect:" value={state.sect} onChange={(v) => setState({ ...state, sect: v })} />
                  <SheetInput label="Concept:" value={state.concept} onChange={(v) => setState({ ...state, concept: v })} />
                </div>

                <SheetButton
                  onClick={() => setState({ ...state, phase: "attributes-priority" })}
                  disabled={!canProceedFromBasics()}
                >
                  Continue to Attributes <ChevronRight className="w-4 h-4 ml-2" />
                </SheetButton>
              </div>
            )}

            {/* PHASE: ATTRIBUTE PRIORITY */}
            {state.phase === "attributes-priority" && (
              <div className="space-y-6">
                <SectionHeader title="Attributes" subtitle="Prioritize: Primary (7 dots) • Secondary (5 dots) • Tertiary (3 dots)" />
                
                <div className="space-y-4">
                  <PrioritySelector
                    label="Physical"
                    subtitle="Strength, Dexterity, Stamina"
                    selected={state.attributePriorities.physical}
                    onSelect={(p) => setAttributePriority("physical", p)}
                  />
                  <PrioritySelector
                    label="Social"
                    subtitle="Charisma, Manipulation, Appearance"
                    selected={state.attributePriorities.social}
                    onSelect={(p) => setAttributePriority("social", p)}
                  />
                  <PrioritySelector
                    label="Mental"
                    subtitle="Perception, Intelligence, Wits"
                    selected={state.attributePriorities.mental}
                    onSelect={(p) => setAttributePriority("mental", p)}
                  />
                </div>

                <div className="flex gap-3">
                  <SheetButton
                    onClick={() => setState({ ...state, phase: "basics" })}
                    disabled={false}
                    variant="secondary"
                  >
                    ← Back
                  </SheetButton>
                  <SheetButton
                    onClick={() => setState({ ...state, phase: "attributes-assign" })}
                    disabled={!canProceedFromAttributePriority()}
                  >
                    Continue to Assign Attributes <ChevronRight className="w-4 h-4 ml-2" />
                  </SheetButton>
                </div>
              </div>
            )}

            {/* PHASE: ATTRIBUTE ASSIGNMENT */}
            {state.phase === "attributes-assign" && (
              <div className="space-y-6">
                <SectionHeader title="Attributes" subtitle="Each attribute starts at 1 dot (●)" />

                <AttributeSection
                  title="Physical"
                  priority={state.attributePriorities.physical!}
                  remaining={getAttributePointsRemaining("physical")}
                  total={getAttributePoints("physical")}
                >
                  <SheetDotRating label="Strength" value={state.attributes.strength} onChange={(v) => setAttributeValue("strength", v)} locked />
                  <SheetDotRating label="Dexterity" value={state.attributes.dexterity} onChange={(v) => setAttributeValue("dexterity", v)} locked />
                  <SheetDotRating label="Stamina" value={state.attributes.stamina} onChange={(v) => setAttributeValue("stamina", v)} locked />
                </AttributeSection>

                <AttributeSection
                  title="Social"
                  priority={state.attributePriorities.social!}
                  remaining={getAttributePointsRemaining("social")}
                  total={getAttributePoints("social")}
                >
                  <SheetDotRating label="Charisma" value={state.attributes.charisma} onChange={(v) => setAttributeValue("charisma", v)} locked />
                  <SheetDotRating label="Manipulation" value={state.attributes.manipulation} onChange={(v) => setAttributeValue("manipulation", v)} locked />
                  <SheetDotRating label="Appearance" value={state.attributes.appearance} onChange={(v) => setAttributeValue("appearance", v)} locked />
                </AttributeSection>

                <AttributeSection
                  title="Mental"
                  priority={state.attributePriorities.mental!}
                  remaining={getAttributePointsRemaining("mental")}
                  total={getAttributePoints("mental")}
                >
                  <SheetDotRating label="Perception" value={state.attributes.perception} onChange={(v) => setAttributeValue("perception", v)} locked />
                  <SheetDotRating label="Intelligence" value={state.attributes.intelligence} onChange={(v) => setAttributeValue("intelligence", v)} locked />
                  <SheetDotRating label="Wits" value={state.attributes.wits} onChange={(v) => setAttributeValue("wits", v)} locked />
                </AttributeSection>

                <div className="flex gap-3">
                  <SheetButton
                    onClick={() => setState({ ...state, phase: "attributes-priority" })}
                    disabled={false}
                    variant="secondary"
                  >
                    ← Back
                  </SheetButton>
                  <SheetButton
                    onClick={() => setState({ ...state, phase: "abilities-priority" })}
                    disabled={!canProceedFromAttributeAssign()}
                  >
                    Continue to Abilities <ChevronRight className="w-4 h-4 ml-2" />
                  </SheetButton>
                </div>
              </div>
            )}

            {/* PHASE: ABILITY PRIORITY */}
            {state.phase === "abilities-priority" && (
              <div className="space-y-6">
                <SectionHeader title="Abilities" subtitle="Prioritize: Primary (13 dots) • Secondary (9 dots) • Tertiary (5 dots) • Max 3 per ability" />
                
                <div className="space-y-4">
                  <PrioritySelector
                    label="Talents"
                    subtitle="Alertness, Art, Athletics, Awareness, Brawl, Empathy, Expression, Intimidation, Leadership, Streetwise, Subterfuge"
                    selected={state.abilityPriorities.talents}
                    onSelect={(p) => setAbilityPriority("talents", p)}
                  />
                  <PrioritySelector
                    label="Skills"
                    subtitle="Crafts, Drive, Etiquette, Firearms, Martial Arts, Meditation, Melee, Research, Stealth, Survival, Technology"
                    selected={state.abilityPriorities.skills}
                    onSelect={(p) => setAbilityPriority("skills", p)}
                  />
                  <PrioritySelector
                    label="Knowledges"
                    subtitle="Academics, Computer, Cosmology, Enigmas, Esoterica, Investigation, Law, Medicine, Occult, Politics, Science"
                    selected={state.abilityPriorities.knowledges}
                    onSelect={(p) => setAbilityPriority("knowledges", p)}
                  />
                </div>

                <div className="flex gap-3">
                  <SheetButton
                    onClick={() => setState({ ...state, phase: "attributes-assign" })}
                    disabled={false}
                    variant="secondary"
                  >
                    ← Back
                  </SheetButton>
                  <SheetButton
                    onClick={() => setState({ ...state, phase: "abilities-assign" })}
                    disabled={!canProceedFromAbilityPriority()}
                  >
                    Continue to Assign Abilities <ChevronRight className="w-4 h-4 ml-2" />
                  </SheetButton>
                </div>
              </div>
            )}

            {/* PHASE: ABILITY ASSIGNMENT */}
            {state.phase === "abilities-assign" && (
              <div className="space-y-6">
                <SectionHeader title="Abilities" subtitle="Maximum 3 dots per ability during character creation" />

                <div className="grid grid-cols-3 gap-6">
                  {/* Talents */}
                  <AbilityColumn
                    title="Talents"
                    priority={state.abilityPriorities.talents!}
                    remaining={getAbilityPointsRemaining("talents")}
                    total={getAbilityPoints("talents")}
                  >
                    {getAbilitiesInCategory("talents").map(ability => (
                      <SheetDotRating
                        key={ability}
                        label={formatAbilityName(ability)}
                        value={state.abilities[ability]}
                        onChange={(v) => setAbilityValue(ability, v)}
                        maxDots={3}
                        variant="ability"
                      />
                    ))}
                  </AbilityColumn>

                  {/* Skills */}
                  <AbilityColumn
                    title="Skills"
                    priority={state.abilityPriorities.skills!}
                    remaining={getAbilityPointsRemaining("skills")}
                    total={getAbilityPoints("skills")}
                  >
                    {getAbilitiesInCategory("skills").map(ability => (
                      <SheetDotRating
                        key={ability}
                        label={formatAbilityName(ability)}
                        value={state.abilities[ability]}
                        onChange={(v) => setAbilityValue(ability, v)}
                        maxDots={3}
                        variant="ability"
                      />
                    ))}
                  </AbilityColumn>

                  {/* Knowledges */}
                  <AbilityColumn
                    title="Knowledges"
                    priority={state.abilityPriorities.knowledges!}
                    remaining={getAbilityPointsRemaining("knowledges")}
                    total={getAbilityPoints("knowledges")}
                  >
                    {getAbilitiesInCategory("knowledges").map(ability => (
                      <SheetDotRating
                        key={ability}
                        label={formatAbilityName(ability)}
                        value={state.abilities[ability]}
                        onChange={(v) => setAbilityValue(ability, v)}
                        maxDots={3}
                        variant="ability"
                      />
                    ))}
                  </AbilityColumn>
                </div>

                <div className="flex gap-3">
                  <SheetButton
                    onClick={() => setState({ ...state, phase: "abilities-priority" })}
                    disabled={false}
                    variant="secondary"
                  >
                    ← Back
                  </SheetButton>
                  <SheetButton
                    onClick={() => setState({ ...state, phase: "spheres" })}
                    disabled={!canProceedFromAbilityAssign()}
                  >
                    Continue to Spheres <ChevronRight className="w-4 h-4 ml-2" />
                  </SheetButton>
                </div>
              </div>
            )}

            {/* PHASE: SPHERES */}
            {state.phase === "spheres" && (
              <div className="space-y-6">
                <SectionHeader title="Spheres" subtitle="6 dots total • Affinity Sphere uses 1 dot (locked) • 5 additional dots to spend • Max 3 per Sphere" />

                {!state.affinitySphere && (
                  <div className="p-4 border-2 rounded" style={{ borderColor: '#8b4513', background: 'rgba(107, 45, 107, 0.05)' }}>
                    <h3 className="font-semibold mb-3" style={{ color: '#6b2d6b' }}>Choose Your Affinity Sphere (granted by Tradition)</h3>
                    <p className="text-xs mb-3 italic" style={{ color: '#6b4423' }}>
                      Your affinity Sphere uses 1 of your 6 dots, leaving 5 dots to spend on other Spheres. It starts at 1 and cannot be reduced.
                    </p>
                    <div className="grid grid-cols-3 gap-2">
                      {Object.keys(state.spheres).map(sphere => (
                        <button
                          key={sphere}
                          onClick={() => {
                            setState({
                              ...state,
                              affinitySphere: sphere,
                              spheres: { ...state.spheres, [sphere]: 1 }
                            })
                          }}
                          className="p-2 text-sm rounded border-2 hover:bg-opacity-20 transition-all"
                          style={{
                            borderColor: '#6b2d6b',
                            color: '#4a2c2a'
                          }}
                        >
                          {sphere.charAt(0).toUpperCase() + sphere.slice(1)}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {state.affinitySphere && (
                  <>
                    <div className="flex items-center justify-between p-3 rounded" style={{ background: 'rgba(107, 45, 107, 0.1)' }}>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold" style={{ color: '#6b2d6b' }}>
                          Affinity: {state.affinitySphere.charAt(0).toUpperCase() + state.affinitySphere.slice(1)}
                        </span>
                        <span className="text-xs px-2 py-0.5 rounded" style={{ background: '#6b2d6b', color: '#f5f0e8' }}>
                          ● 1 dot (locked)
                        </span>
                      </div>
                      <span className="text-sm font-semibold px-3 py-1 rounded" style={{
                        background: getSpherePointsRemaining() === 0 ? '#6b2d6b' : 'rgba(107, 45, 107, 0.2)',
                        color: getSpherePointsRemaining() === 0 ? '#f5f0e8' : '#4a2c2a'
                      }}>
                        {getSpherePointsRemaining()} / 6 remaining
                      </span>
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                      {Object.keys(state.spheres).map(sphere => (
                        <SheetDotRating
                          key={sphere}
                          label={sphere.charAt(0).toUpperCase() + sphere.slice(1)}
                          value={state.spheres[sphere as keyof typeof state.spheres]}
                          onChange={(v) => setSphereValue(sphere as keyof typeof state.spheres, v)}
                          maxDots={3}
                          variant="sphere"
                          locked={state.affinitySphere === sphere}
                        />
                      ))}
                    </div>
                  </>
                )}

                <div className="flex gap-3">
                  <SheetButton
                    onClick={() => setState({ ...state, phase: "abilities-assign" })}
                    disabled={false}
                    variant="secondary"
                  >
                    ← Back
                  </SheetButton>
                  <SheetButton
                    onClick={() => setState({ ...state, phase: "backgrounds" })}
                    disabled={!canProceedFromSpheres()}
                  >
                    Continue to Backgrounds <ChevronRight className="w-4 h-4 ml-2" />
                  </SheetButton>
                </div>
              </div>
            )}

            {/* PHASE: BACKGROUNDS */}
            {state.phase === "backgrounds" && (
              <BackgroundsPhase
                state={state}
                setState={setState}
                onBack={() => setState({ ...state, phase: "spheres" })}
                onContinue={() => setState({ ...state, phase: "freebies" })}
              />
            )}

            {/* PHASE: FREEBIE POINTS */}
            {state.phase === "freebies" && (
              <FreebiePointsPhase
                state={state}
                setState={setState}
                onBack={() => setState({ ...state, phase: "backgrounds" })}
                onContinue={() => setState({ ...state, phase: "complete" })}
              />
            )}

            {/* PHASE: COMPLETE */}
            {state.phase === "complete" && (
              <div className="space-y-6 py-8">
                <div className="text-center space-y-4">
                  <div className="w-20 h-20 mx-auto rounded-full flex items-center justify-center" style={{
                    background: 'linear-gradient(135deg, #d4af37, #8b6914)'
                  }}>
                    <Check className="w-10 h-10" style={{ color: '#2d1b4e' }} />
                  </div>
                  <h2 className="text-3xl font-bold" style={{ fontFamily: 'Georgia, serif', color: '#4a2c2a' }}>
                    Character Creation Complete!
                  </h2>
                  <p style={{ color: '#6b4423' }}>
                    {state.name || "Your character"} is ready for the next phase.
                  </p>
                </div>

                {/* Summary */}
                <div className="grid grid-cols-2 gap-6 max-w-3xl mx-auto">
                  <div className="p-4 border-2 rounded" style={{ borderColor: '#8b4513', background: 'rgba(139, 69, 19, 0.03)' }}>
                    <h3 className="font-semibold mb-3 text-center" style={{ color: '#4a2c2a' }}>✅ Completed</h3>
                    <ul className="text-sm space-y-2" style={{ color: '#6b4423' }}>
                      <li>✓ Basic Information</li>
                      <li>✓ Attributes (15 dots)</li>
                      <li>✓ Abilities (27 dots)</li>
                      <li>✓ Spheres (6 dots)</li>
                      <li>✓ Backgrounds (7 dots)</li>
                      <li>✓ Arete: 1 (locked)</li>
                      <li>✓ Willpower: 5 (locked)</li>
                    </ul>
                  </div>

                  <div className="p-4 border-2 rounded" style={{ borderColor: '#8b4513', background: 'rgba(212, 175, 55, 0.05)' }}>
                    <h3 className="font-semibold mb-3 text-center" style={{ color: '#d4af37' }}>⏳ Coming Next</h3>
                    <ul className="text-sm space-y-2" style={{ color: '#6b4423' }}>
                      <li>→ Merits & Flaws</li>
                      <li>→ Freebie Points (15)</li>
                      <li>→ Raise Arete</li>
                      <li>→ Raise Willpower</li>
                      <li>→ Add more dots</li>
                      <li>→ Final touches</li>
                    </ul>
                  </div>
                </div>

                <div className="text-center pt-4">
                  <p className="text-sm italic mb-4" style={{ color: '#8b6914' }}>
                    Your character sheet is saved and ready for Merits, Flaws, and Freebie Points!
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

// COMPONENTS

function SectionHeader({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="border-b-4 pb-2 mb-4" style={{ borderColor: '#8b4513' }}>
      <h2 className="text-2xl font-bold tracking-wider" style={{
        fontFamily: 'Georgia, serif',
        color: '#4a2c2a'
      }}>
        {title}
      </h2>
      {subtitle && (
        <p className="text-sm italic mt-1" style={{ color: '#6b4423' }}>
          {subtitle}
        </p>
      )}
    </div>
  )
}

function SheetInput({ label, value, onChange, placeholder }: {
  label: string
  value: string
  onChange: (value: string) => void
  placeholder?: string
}) {
  return (
    <div>
      <Label className="text-xs uppercase tracking-wide" style={{ color: '#4a2c2a' }}>{label}</Label>
      <Input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="border-b-2 border-t-0 border-x-0 rounded-none bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0"
        style={{ borderColor: '#8b4513', color: '#4a2c2a' }}
      />
    </div>
  )
}

function SheetButton({ onClick, disabled, children, variant = "primary" }: {
  onClick: () => void
  disabled?: boolean
  children: React.ReactNode
  variant?: "primary" | "secondary"
}) {
  return (
    <Button
      onClick={onClick}
      disabled={disabled}
      className="w-full mt-4 flex items-center justify-center"
      style={{
        background: disabled 
          ? 'rgba(139, 69, 19, 0.3)' 
          : variant === "secondary"
          ? 'transparent'
          : 'linear-gradient(135deg, #d4af37, #8b6914)',
        color: disabled 
          ? 'rgba(74, 44, 42, 0.5)' 
          : variant === "secondary"
          ? '#4a2c2a'
          : '#2d1b4e',
        border: variant === "secondary" ? '2px solid #8b4513' : 'none',
        fontFamily: 'Georgia, serif',
        fontWeight: 'bold'
      }}
    >
      {children}
    </Button>
  )
}

function PrioritySelector({ label, subtitle, selected, onSelect }: {
  label: string
  subtitle: string
  selected: Priority
  onSelect: (priority: Priority) => void
}) {
  return (
    <div className="flex items-center justify-between p-4 border-2 rounded" style={{ borderColor: '#8b4513' }}>
      <div className="flex-1">
        <h3 className="font-bold" style={{ color: '#4a2c2a' }}>{label}</h3>
        <p className="text-xs mt-1" style={{ color: '#6b4423' }}>{subtitle}</p>
      </div>
      <div className="flex gap-2">
        {(["primary", "secondary", "tertiary"] as const).map((priority) => (
          <button
            key={priority}
            onClick={() => onSelect(priority)}
            className={cn(
              "px-4 py-2 rounded text-sm font-semibold transition-all",
              selected === priority && "shadow-lg"
            )}
            style={{
              background: selected === priority ? 'linear-gradient(135deg, #d4af37, #8b6914)' : 'transparent',
              border: selected === priority ? 'none' : '2px solid #8b4513',
              color: selected === priority ? '#2d1b4e' : '#4a2c2a',
              opacity: selected === priority ? 1 : 0.6
            }}
          >
            {/* Check if this is for attributes or abilities based on subtitle */}
            {subtitle.includes("Strength") || subtitle.includes("Charisma") || subtitle.includes("Perception") ? (
              // Attributes: 7/5/3
              <>
                {priority === "primary" && "7 dots"}
                {priority === "secondary" && "5 dots"}
                {priority === "tertiary" && "3 dots"}
              </>
            ) : (
              // Abilities: 13/9/5
              <>
                {priority === "primary" && "13 dots"}
                {priority === "secondary" && "9 dots"}
                {priority === "tertiary" && "5 dots"}
              </>
            )}
          </button>
        ))}
      </div>
    </div>
  )
}

function AttributeSection({ title, priority, remaining, total, children }: {
  title: string
  priority: Priority
  remaining: number
  total: number
  children: React.ReactNode
}) {
  return (
    <div className="border-2 p-4 rounded" style={{ borderColor: '#8b4513', background: 'rgba(139, 69, 19, 0.03)' }}>
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-bold text-lg" style={{ color: '#4a2c2a' }}>{title}</h3>
        <div className="text-sm font-semibold px-3 py-1 rounded" style={{
          background: remaining === 0 ? '#d4af37' : 'rgba(212, 175, 55, 0.2)',
          color: '#4a2c2a'
        }}>
          {remaining} / {total} remaining
        </div>
      </div>
      <div className="space-y-1">
        {children}
      </div>
    </div>
  )
}

function AbilityColumn({ title, priority, remaining, total, children }: {
  title: string
  priority: Priority
  remaining: number
  total: number
  children: React.ReactNode
}) {
  return (
    <div>
      <div className="flex items-center justify-between mb-3 pb-2 border-b-2" style={{ borderColor: '#8b4513' }}>
        <h3 className="font-bold" style={{ color: '#4a2c2a' }}>{title}</h3>
        <div className="text-xs font-semibold px-2 py-1 rounded" style={{
          background: remaining === 0 ? '#d4af37' : 'rgba(212, 175, 55, 0.2)',
          color: '#4a2c2a'
        }}>
          {remaining}/{total}
        </div>
      </div>
      <div className="space-y-0.5">
        {children}
      </div>
    </div>
  )
}

function SheetDotRating({ label, value, onChange, locked, maxDots = 5, variant = "attribute" }: {
  label: string
  value: number
  onChange: (value: number) => void
  locked?: boolean
  maxDots?: number
  variant?: "attribute" | "ability" | "sphere" | "arete"
}) {
  const [hoveredValue, setHoveredValue] = useState<number | null>(null)
  const displayValue = hoveredValue !== null ? hoveredValue : value

  const getColor = () => {
    if (variant === "ability") return "#daa520"
    if (variant === "sphere") return "#6b2d6b"
    if (variant === "arete") return "#d4af37"
    return "#4a2c2a"
  }

  return (
    <div className="flex items-center justify-between py-1">
      <span className="text-sm font-serif flex-1" style={{ color: '#4a2c2a' }}>{label}</span>
      <div 
        className="flex gap-0.5"
        onMouseLeave={() => setHoveredValue(null)}
      >
        {Array.from({ length: maxDots }, (_, i) => {
          const dotValue = i + 1
          const isFilled = dotValue <= displayValue
          const isLockedDot = locked && dotValue === 1

          return (
            <button
              key={i}
              type="button"
              onClick={() => {
                // If this is a locked dot (first dot of affinity or first dot of attribute), don't allow changes
                if (isLockedDot) return
                
                // For other dots, allow toggle but respect minimum
                if (locked && dotValue === value) {
                  // Trying to click the current value - toggle it, but respect minimum of 1
                  onChange(1) // For locked (affinity/attribute), minimum is 1
                } else {
                  onChange(dotValue === value ? (locked ? 1 : 0) : dotValue)
                }
              }}
              onMouseEnter={() => !isLockedDot && setHoveredValue(dotValue)}
              disabled={isLockedDot}
              className={cn(
                "w-4 h-4 rounded-full border transition-all duration-200",
                !isLockedDot && "hover:scale-110 cursor-pointer"
              )}
              style={{
                borderColor: getColor(),
                borderWidth: '2px',
                backgroundColor: isFilled ? getColor() : 'transparent',
                opacity: isLockedDot ? 0.7 : 1
              }}
            >
              {isLockedDot && <Lock className="w-2 h-2 m-auto" style={{ color: variant === "sphere" ? '#f5f0e8' : '#d4af37' }} />}
            </button>
          )
        })}
      </div>
    </div>
  )
}

// FREEBIE DOT RATING COMPONENT
function FreebieDotRating({ label, baseDots, freebieDots, onAdd, onRemove, maxDots = 5, cost }: {
  label: string
  baseDots: number
  freebieDots: number
  onAdd: () => void
  onRemove: () => void
  maxDots?: number
  cost: number
}) {
  const totalDots = baseDots + freebieDots

  return (
    <div className="flex items-center justify-between py-2 px-3 rounded hover:bg-accent/5 transition-colors">
      <span className="text-sm font-serif flex-1" style={{ color: '#4a2c2a' }}>
        {label}
      </span>
      
      <div className="flex items-center gap-3">
        {/* Dots display */}
        <div className="flex gap-1">
          {Array.from({ length: maxDots }, (_, i) => {
            const dotValue = i + 1
            const isBaseDot = dotValue <= baseDots
            const isFreebieDot = dotValue > baseDots && dotValue <= totalDots

            return (
              <div
                key={i}
                className="w-5 h-5 rounded-full border-2 relative"
                style={{
                  borderColor: '#4a2c2a',
                  backgroundColor: isBaseDot ? '#4a2c2a' : 'transparent'
                }}
              >
                {isFreebieDot && (
                  <>
                    <div className="absolute inset-0 rounded-full" style={{ backgroundColor: '#4a2c2a' }} />
                    <div 
                      className="absolute inset-0 rounded-full"
                      style={{
                        background: 'linear-gradient(90deg, transparent 50%, #d4af37 50%)',
                      }}
                    />
                  </>
                )}
              </div>
            )
          })}
        </div>

        {/* Buttons */}
        <div className="flex items-center gap-1">
          <button
            onClick={onRemove}
            disabled={freebieDots <= 0}
            className="w-6 h-6 rounded flex items-center justify-center text-xs font-bold disabled:opacity-30 transition-all hover:scale-110"
            style={{ background: '#8b4513', color: '#fff' }}
          >
            <Minus className="w-3 h-3" />
          </button>
          <span className="text-xs font-mono w-8 text-center" style={{ color: '#6b4423' }}>
            {cost}pt
          </span>
          <button
            onClick={onAdd}
            disabled={totalDots >= maxDots}
            className="w-6 h-6 rounded flex items-center justify-center text-xs font-bold disabled:opacity-30 transition-all hover:scale-110"
            style={{ background: '#d4af37', color: '#2d1b4e' }}
          >
            <Plus className="w-3 h-3" />
          </button>
        </div>
      </div>
    </div>
  )
}

// FREEBIE POINTS PHASE COMPONENT
function FreebiePointsPhase({ state, setState, onBack, onContinue }: {
  state: CharacterState
  setState: (state: CharacterState) => void
  onBack: () => void
  onContinue: () => void
}) {
  const [merits, setMerits] = useState<any[]>([])
  const [flaws, setFlaws] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetch("/api/merits")
      .then(res => res.json())
      .then(data => {
        setMerits(data.filter((m: any) => m.type === "merit"))
        setFlaws(data.filter((m: any) => m.type === "flaw"))
      })
      .catch(err => console.error(err))
      .finally(() => setIsLoading(false))
  }, [])

  // Calculate points
  const calculatePoints = () => {
    let spent = 0
    Object.values(state.freebieDots.attributes).forEach(d => spent += d * 5)
    Object.values(state.freebieDots.abilities).forEach(d => spent += d * 2)
    Object.values(state.freebieDots.spheres).forEach(d => spent += d * 7)
    Object.values(state.freebieDots.backgrounds).forEach(d => spent += d * 1)
    spent += state.freebieDots.arete * 4
    spent += state.freebieDots.willpower * 1
    state.merits.forEach(m => spent += m.cost)
    state.flaws.forEach(f => spent -= f.cost)
    return 15 - spent
  }

  const remaining = calculatePoints()

  const addDot = (category: string, name: string, cost: number) => {
    if (remaining < cost) return
    const newState = { ...state }
    if (category === "arete" || category === "willpower") {
      newState.freebieDots[category] += 1
    } else {
      const cat = newState.freebieDots[category as keyof typeof newState.freebieDots] as any
      cat[name] = (cat[name] || 0) + 1
    }
    setState(newState)
  }

  const removeDot = (category: string, name: string) => {
    const newState = { ...state }
    if (category === "arete" || category === "willpower") {
      if (newState.freebieDots[category] <= 0) return
      newState.freebieDots[category] -= 1
    } else {
      const cat = newState.freebieDots[category as keyof typeof newState.freebieDots] as any
      if (!cat[name] || cat[name] <= 0) return
      cat[name] -= 1
      if (cat[name] === 0) delete cat[name]
    }
    setState(newState)
  }

  const addMerit = (merit: any) => {
    if (remaining < merit.cost) return
    setState({
      ...state,
      merits: [...state.merits, { id: merit.id, name: merit.name, cost: merit.cost }]
    })
  }

  const removeMerit = (index: number) => {
    const newMerits = [...state.merits]
    newMerits.splice(index, 1)
    setState({ ...state, merits: newMerits })
  }

  const addFlaw = (flaw: any) => {
    const flawPoints = state.flaws.reduce((sum, f) => sum + f.cost, 0)
    if (flawPoints + Math.abs(flaw.cost) > 7) {
      alert("Maximum 7 points from flaws!")
      return
    }
    setState({
      ...state,
      flaws: [...state.flaws, { id: flaw.id, name: flaw.name, cost: Math.abs(flaw.cost) }]
    })
  }

  const removeFlaw = (index: number) => {
    const newFlaws = [...state.flaws]
    newFlaws.splice(index, 1)
    setState({ ...state, flaws: newFlaws })
  }

  const getTotalAbilityDots = (abilityName: string) => {
    const baseDots = state.abilities[abilityName as keyof typeof state.abilities] || 0
    const freebieDots = state.freebieDots.abilities[abilityName] || 0
    return baseDots + freebieDots
  }

  const setSpecialty = (abilityName: string, specialty: string) => {
    setState({
      ...state,
      specialties: { ...state.specialties, [abilityName]: specialty }
    })
  }

  return (
    <div className="space-y-6">
      <SectionHeader title="Freebie Points" subtitle="15 points to customize your character • Freebie dots shown as half-circles" />

      {/* Points Display */}
      <div className="flex items-center justify-between p-4 rounded-lg" style={{
        background: 'linear-gradient(135deg, rgba(212, 175, 55, 0.1), rgba(139, 105, 20, 0.1))',
        border: '2px solid #d4af37'
      }}>
        <div>
          <div className="text-sm" style={{ color: '#6b4423' }}>Points Spent</div>
          <div className="text-2xl font-bold" style={{ color: '#4a2c2a' }}>{15 - remaining} / 15</div>
        </div>
        <div className="text-right">
          <div className="text-sm" style={{ color: '#6b4423' }}>Remaining</div>
          <div className="text-4xl font-bold" style={{ color: remaining >= 0 ? '#d4af37' : '#dc2626' }}>
            {remaining}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="attributes" className="space-y-4">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="attributes">Attributes</TabsTrigger>
          <TabsTrigger value="abilities">Abilities</TabsTrigger>
          <TabsTrigger value="other">Other</TabsTrigger>
          <TabsTrigger value="merits">Merits</TabsTrigger>
          <TabsTrigger value="flaws">Flaws</TabsTrigger>
        </TabsList>

        {/* Attributes Tab */}
        <TabsContent value="attributes">
          <Card className="border-2 border-primary">
            <CardHeader>
              <CardTitle className="font-cinzel">Attributes (5 points per dot)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-6">
                <div>
                  <h4 className="font-semibold mb-2 text-sm" style={{ color: '#4a2c2a' }}>Physical</h4>
                  <FreebieDotRating label="Strength" baseDots={state.attributes.strength} 
                    freebieDots={state.freebieDots.attributes.strength || 0}
                    onAdd={() => addDot("attributes", "strength", 5)}
                    onRemove={() => removeDot("attributes", "strength")} cost={5} />
                  <FreebieDotRating label="Dexterity" baseDots={state.attributes.dexterity} 
                    freebieDots={state.freebieDots.attributes.dexterity || 0}
                    onAdd={() => addDot("attributes", "dexterity", 5)}
                    onRemove={() => removeDot("attributes", "dexterity")} cost={5} />
                  <FreebieDotRating label="Stamina" baseDots={state.attributes.stamina} 
                    freebieDots={state.freebieDots.attributes.stamina || 0}
                    onAdd={() => addDot("attributes", "stamina", 5)}
                    onRemove={() => removeDot("attributes", "stamina")} cost={5} />
                </div>
                <div>
                  <h4 className="font-semibold mb-2 text-sm" style={{ color: '#4a2c2a' }}>Social</h4>
                  <FreebieDotRating label="Charisma" baseDots={state.attributes.charisma} 
                    freebieDots={state.freebieDots.attributes.charisma || 0}
                    onAdd={() => addDot("attributes", "charisma", 5)}
                    onRemove={() => removeDot("attributes", "charisma")} cost={5} />
                  <FreebieDotRating label="Manipulation" baseDots={state.attributes.manipulation} 
                    freebieDots={state.freebieDots.attributes.manipulation || 0}
                    onAdd={() => addDot("attributes", "manipulation", 5)}
                    onRemove={() => removeDot("attributes", "manipulation")} cost={5} />
                  <FreebieDotRating label="Appearance" baseDots={state.attributes.appearance} 
                    freebieDots={state.freebieDots.attributes.appearance || 0}
                    onAdd={() => addDot("attributes", "appearance", 5)}
                    onRemove={() => removeDot("attributes", "appearance")} cost={5} />
                </div>
                <div>
                  <h4 className="font-semibold mb-2 text-sm" style={{ color: '#4a2c2a' }}>Mental</h4>
                  <FreebieDotRating label="Perception" baseDots={state.attributes.perception} 
                    freebieDots={state.freebieDots.attributes.perception || 0}
                    onAdd={() => addDot("attributes", "perception", 5)}
                    onRemove={() => removeDot("attributes", "perception")} cost={5} />
                  <FreebieDotRating label="Intelligence" baseDots={state.attributes.intelligence} 
                    freebieDots={state.freebieDots.attributes.intelligence || 0}
                    onAdd={() => addDot("attributes", "intelligence", 5)}
                    onRemove={() => removeDot("attributes", "intelligence")} cost={5} />
                  <FreebieDotRating label="Wits" baseDots={state.attributes.wits} 
                    freebieDots={state.freebieDots.attributes.wits || 0}
                    onAdd={() => addDot("attributes", "wits", 5)}
                    onRemove={() => removeDot("attributes", "wits")} cost={5} />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Abilities Tab */}
        <TabsContent value="abilities">
          <Card className="border-2 border-accent">
            <CardHeader>
              <CardTitle className="font-cinzel">Abilities (2 points per dot)</CardTitle>
              <p className="text-xs mt-2" style={{ color: '#6b4423' }}>Specialty required at 4+ dots</p>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-6">
                <div>
                  <h4 className="font-semibold mb-2 text-sm" style={{ color: '#4a2c2a' }}>Talents</h4>
                  {["alertness", "art", "athletics", "awareness", "brawl", "empathy", "expression", "intimidation", "leadership", "streetwise", "subterfuge"].map(ability => {
                    const total = getTotalAbilityDots(ability)
                    const label = ability.charAt(0).toUpperCase() + ability.slice(1)
                    return (
                      <div key={ability}>
                        <FreebieDotRating 
                          label={label}
                          baseDots={state.abilities[ability as keyof typeof state.abilities]} 
                          freebieDots={state.freebieDots.abilities[ability] || 0}
                          onAdd={() => addDot("abilities", ability, 2)}
                          onRemove={() => removeDot("abilities", ability)} 
                          cost={2} 
                        />
                        {total >= 4 && (
                          <Input
                            placeholder="Specialty..."
                            value={state.specialties[ability] || ""}
                            onChange={(e) => setSpecialty(ability, e.target.value)}
                            className="mt-1 text-xs ml-4"
                          />
                        )}
                      </div>
                    )
                  })}
                </div>
                <div>
                  <h4 className="font-semibold mb-2 text-sm" style={{ color: '#4a2c2a' }}>Skills</h4>
                  {["crafts", "drive", "etiquette", "firearms", "martialArts", "meditation", "melee", "research", "stealth", "survival", "technology"].map(ability => {
                    const total = getTotalAbilityDots(ability)
                    const label = ability === "martialArts" ? "Martial Arts" : ability.charAt(0).toUpperCase() + ability.slice(1)
                    return (
                      <div key={ability}>
                        <FreebieDotRating 
                          label={label}
                          baseDots={state.abilities[ability as keyof typeof state.abilities]} 
                          freebieDots={state.freebieDots.abilities[ability] || 0}
                          onAdd={() => addDot("abilities", ability, 2)}
                          onRemove={() => removeDot("abilities", ability)} 
                          cost={2} 
                        />
                        {total >= 4 && (
                          <Input
                            placeholder="Specialty..."
                            value={state.specialties[ability] || ""}
                            onChange={(e) => setSpecialty(ability, e.target.value)}
                            className="mt-1 text-xs ml-4"
                          />
                        )}
                      </div>
                    )
                  })}
                </div>
                <div>
                  <h4 className="font-semibold mb-2 text-sm" style={{ color: '#4a2c2a' }}>Knowledges</h4>
                  {["academics", "computer", "cosmology", "enigmas", "esoterica", "investigation", "law", "medicine", "occult", "politics", "science"].map(ability => {
                    const total = getTotalAbilityDots(ability)
                    const label = ability.charAt(0).toUpperCase() + ability.slice(1)
                    return (
                      <div key={ability}>
                        <FreebieDotRating 
                          label={label}
                          baseDots={state.abilities[ability as keyof typeof state.abilities]} 
                          freebieDots={state.freebieDots.abilities[ability] || 0}
                          onAdd={() => addDot("abilities", ability, 2)}
                          onRemove={() => removeDot("abilities", ability)} 
                          cost={2} 
                        />
                        {total >= 4 && (
                          <Input
                            placeholder="Specialty..."
                            value={state.specialties[ability] || ""}
                            onChange={(e) => setSpecialty(ability, e.target.value)}
                            className="mt-1 text-xs ml-4"
                          />
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Other Tab */}
        <TabsContent value="other">
          <div className="space-y-4">
            <Card className="border-2 border-accent">
              <CardHeader>
                <CardTitle className="font-cinzel">Arete (4 points per dot)</CardTitle>
              </CardHeader>
              <CardContent>
                <FreebieDotRating label="Arete" baseDots={1} 
                  freebieDots={state.freebieDots.arete}
                  onAdd={() => addDot("arete", "arete", 4)}
                  onRemove={() => removeDot("arete", "arete")} 
                  maxDots={10} cost={4} />
              </CardContent>
            </Card>
            <Card className="border-2 border-primary">
              <CardHeader>
                <CardTitle className="font-cinzel">Willpower (1 point per dot)</CardTitle>
              </CardHeader>
              <CardContent>
                <FreebieDotRating label="Willpower" baseDots={5} 
                  freebieDots={state.freebieDots.willpower}
                  onAdd={() => addDot("willpower", "willpower", 1)}
                  onRemove={() => removeDot("willpower", "willpower")} 
                  maxDots={10} cost={1} />
              </CardContent>
            </Card>
            <Card className="border-2 border-ring">
              <CardHeader>
                <CardTitle className="font-cinzel">Spheres (7 points per dot)</CardTitle>
              </CardHeader>
              <CardContent>
                {Object.keys(state.spheres).map(sphere => {
                  const sphereName = sphere.charAt(0).toUpperCase() + sphere.slice(1)
                  return (
                    <FreebieDotRating 
                      key={sphere}
                      label={sphereName}
                      baseDots={state.spheres[sphere as keyof typeof state.spheres]} 
                      freebieDots={state.freebieDots.spheres[sphere] || 0}
                      onAdd={() => addDot("spheres", sphere, 7)}
                      onRemove={() => removeDot("spheres", sphere)} 
                      cost={7} 
                    />
                  )
                })}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Merits Tab */}
        <TabsContent value="merits">
          <Card className="border-2 border-primary">
            <CardHeader>
              <CardTitle className="font-cinzel">Merits (Cost Points)</CardTitle>
            </CardHeader>
            <CardContent>
              {state.merits.length > 0 && (
                <div className="mb-4 space-y-2">
                  <h4 className="font-semibold text-sm">Selected ({state.merits.reduce((s, m) => s + m.cost, 0)} pts)</h4>
                  {state.merits.map((merit, idx) => (
                    <div key={idx} className="flex justify-between items-center p-2 bg-accent/10 rounded">
                      <span className="text-sm">{merit.name} ({merit.cost} pts)</span>
                      <button onClick={() => removeMerit(idx)} className="text-xs px-2 py-1 bg-red-600 text-white rounded">Remove</button>
                    </div>
                  ))}
                </div>
              )}
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {merits.map(merit => (
                  <div key={merit.id} className="p-3 border rounded">
                    <div className="flex justify-between items-start mb-2">
                      <span className="font-semibold text-sm">{merit.name}</span>
                      <div className="flex items-center gap-2">
                        <Badge>{merit.cost} pts</Badge>
                        <button 
                          onClick={() => addMerit(merit)}
                          disabled={remaining < merit.cost}
                          className="text-xs px-3 py-1 rounded disabled:opacity-30"
                          style={{ background: '#d4af37', color: '#2d1b4e' }}
                        >Add</button>
                      </div>
                    </div>
                    <p className="text-xs" style={{ color: '#6b4423' }}>{merit.description}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Flaws Tab */}
        <TabsContent value="flaws">
          <Card className="border-2 border-primary">
            <CardHeader>
              <CardTitle className="font-cinzel">Flaws (Give Points • Max +7)</CardTitle>
            </CardHeader>
            <CardContent>
              {state.flaws.length > 0 && (
                <div className="mb-4 space-y-2">
                  <h4 className="font-semibold text-sm text-green-600">Selected (+{state.flaws.reduce((s, f) => s + f.cost, 0)} pts)</h4>
                  {state.flaws.map((flaw, idx) => (
                    <div key={idx} className="flex justify-between items-center p-2 bg-green-50 rounded">
                      <span className="text-sm">{flaw.name} (+{flaw.cost} pts)</span>
                      <button onClick={() => removeFlaw(idx)} className="text-xs px-2 py-1 bg-red-600 text-white rounded">Remove</button>
                    </div>
                  ))}
                </div>
              )}
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {flaws.map(flaw => (
                  <div key={flaw.id} className="p-3 border rounded">
                    <div className="flex justify-between items-start mb-2">
                      <span className="font-semibold text-sm">{flaw.name}</span>
                      <div className="flex items-center gap-2">
                        <Badge className="bg-green-600">+{Math.abs(flaw.cost)} pts</Badge>
                        <button 
                          onClick={() => addFlaw(flaw)}
                          className="text-xs px-3 py-1 rounded bg-green-600 text-white"
                        >Add</button>
                      </div>
                    </div>
                    <p className="text-xs" style={{ color: '#6b4423' }}>{flaw.description}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Navigation */}
      <div className="flex gap-3">
        <SheetButton onClick={onBack} variant="secondary">
          ← Back to Backgrounds
        </SheetButton>
        <SheetButton onClick={onContinue} disabled={remaining !== 0}>
          {remaining === 0 ? "Complete Character →" : `Spend ${remaining} more points`}
        </SheetButton>
      </div>
    </div>
  )
}
