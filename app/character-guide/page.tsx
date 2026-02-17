"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"
import { Lock, ChevronRight, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

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
  phase: "basics" | "attributes-priority" | "attributes-assign" | "abilities-priority" | "abilities-assign" | "spheres" | "backgrounds" | "willpower" | "complete"
  
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
  willpower: 5
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
    return Object.values(state.spheres).reduce((sum, val) => sum + val, 0) - 
           (state.affinitySphere ? 1 : 0) // Subtract affinity (free)
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

                <SheetButton
                  onClick={() => setState({ ...state, phase: "attributes-assign" })}
                  disabled={!canProceedFromAttributePriority()}
                >
                  Continue to Assign Attributes <ChevronRight className="w-4 h-4 ml-2" />
                </SheetButton>
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

                <SheetButton
                  onClick={() => setState({ ...state, phase: "abilities-priority" })}
                  disabled={!canProceedFromAttributeAssign()}
                >
                  Continue to Abilities <ChevronRight className="w-4 h-4 ml-2" />
                </SheetButton>
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

                <SheetButton
                  onClick={() => setState({ ...state, phase: "abilities-assign" })}
                  disabled={!canProceedFromAbilityPriority()}
                >
                  Continue to Assign Abilities <ChevronRight className="w-4 h-4 ml-2" />
                </SheetButton>
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

                <SheetButton
                  onClick={() => setState({ ...state, phase: "spheres" })}
                  disabled={!canProceedFromAbilityAssign()}
                >
                  Continue to Spheres <ChevronRight className="w-4 h-4 ml-2" />
                </SheetButton>
              </div>
            )}

            {/* PHASE: SPHERES */}
            {state.phase === "spheres" && (
              <div className="space-y-6">
                <SectionHeader title="Spheres" subtitle="Choose affinity Sphere (free at 1 dot) • 6 additional dots to spend • Max 3 per Sphere" />

                {!state.affinitySphere && (
                  <div className="p-4 border-2 rounded" style={{ borderColor: '#8b4513', background: 'rgba(107, 45, 107, 0.05)' }}>
                    <h3 className="font-semibold mb-3" style={{ color: '#6b2d6b' }}>Choose Your Affinity Sphere (granted by Tradition)</h3>
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
                      <span className="text-sm font-semibold" style={{ color: '#6b2d6b' }}>
                        Affinity: {state.affinitySphere.charAt(0).toUpperCase() + state.affinitySphere.slice(1)}
                      </span>
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

                <SheetButton
                  onClick={() => setState({ ...state, phase: "willpower" })}
                  disabled={!canProceedFromSpheres()}
                >
                  Continue to Finishing Touches <ChevronRight className="w-4 h-4 ml-2" />
                </SheetButton>
              </div>
            )}

            {/* PHASE: WILLPOWER & ARETE */}
            {state.phase === "willpower" && (
              <div className="space-y-6">
                <SectionHeader title="Arete & Willpower" subtitle="Your starting mystical power and mental fortitude" />

                <div className="grid grid-cols-2 gap-6">
                  <div className="p-6 border-2 rounded" style={{ borderColor: '#8b4513', background: 'rgba(212, 175, 55, 0.05)' }}>
                    <h3 className="font-semibold mb-4" style={{ color: '#4a2c2a' }}>Arete</h3>
                    <p className="text-sm mb-4" style={{ color: '#6b4423' }}>
                      Your enlightenment rating. Starts at 1. Use Freebie Points to increase (4 points per dot).
                    </p>
                    <SheetDotRating
                      label="Arete"
                      value={state.arete}
                      onChange={(v) => setState({ ...state, arete: v })}
                      maxDots={10}
                      variant="arete"
                    />
                  </div>

                  <div className="p-6 border-2 rounded" style={{ borderColor: '#8b4513', background: 'rgba(212, 175, 55, 0.05)' }}>
                    <h3 className="font-semibold mb-4" style={{ color: '#4a2c2a' }}>Willpower</h3>
                    <p className="text-sm mb-4" style={{ color: '#6b4423' }}>
                      Your mental fortitude. Starts at 5. Can be increased with Freebie Points (1 point per dot).
                    </p>
                    <SheetDotRating
                      label="Willpower"
                      value={state.willpower}
                      onChange={(v) => setState({ ...state, willpower: v })}
                      maxDots={10}
                    />
                  </div>
                </div>

                <SheetButton onClick={() => setState({ ...state, phase: "complete" })}>
                  Complete Character Creation <Check className="w-4 h-4 ml-2" />
                </SheetButton>
              </div>
            )}

            {/* PHASE: COMPLETE */}
            {state.phase === "complete" && (
              <div className="space-y-6 text-center py-8">
                <div className="w-20 h-20 mx-auto rounded-full flex items-center justify-center" style={{
                  background: 'linear-gradient(135deg, #d4af37, #8b6914)'
                }}>
                  <Check className="w-10 h-10" style={{ color: '#2d1b4e' }} />
                </div>
                <h2 className="text-3xl font-bold" style={{ fontFamily: 'Georgia, serif', color: '#4a2c2a' }}>
                  Character Creation Complete!
                </h2>
                <p style={{ color: '#6b4423' }}>
                  Your character {state.name || "sheet"} is ready. Next, you can add Backgrounds and spend Freebie Points to customize further!
                </p>
                
                <div className="grid grid-cols-2 gap-4 mt-8 text-left max-w-2xl mx-auto">
                  <div className="p-4 border-2 rounded" style={{ borderColor: '#8b4513' }}>
                    <h3 className="font-semibold mb-2" style={{ color: '#4a2c2a' }}>Next: Backgrounds</h3>
                    <p className="text-sm" style={{ color: '#6b4423' }}>
                      You have 7 dots to spend on Backgrounds like Avatar, Resources, Allies, Node, etc.
                    </p>
                  </div>
                  <div className="p-4 border-2 rounded" style={{ borderColor: '#8b4513' }}>
                    <h3 className="font-semibold mb-2" style={{ color: '#4a2c2a' }}>Next: Freebie Points</h3>
                    <p className="text-sm" style={{ color: '#6b4423' }}>
                      You have 15 freebie points to further customize your character (raise Arete, Spheres, etc.)
                    </p>
                  </div>
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

function SheetButton({ onClick, disabled, children }: {
  onClick: () => void
  disabled?: boolean
  children: React.ReactNode
}) {
  return (
    <Button
      onClick={onClick}
      disabled={disabled}
      className="w-full mt-4 flex items-center justify-center"
      style={{
        background: disabled ? 'rgba(139, 69, 19, 0.3)' : 'linear-gradient(135deg, #d4af37, #8b6914)',
        color: disabled ? 'rgba(74, 44, 42, 0.5)' : '#2d1b4e',
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
            {priority === "primary" && "13 dots"}
            {priority === "secondary" && "9 dots"}
            {priority === "tertiary" && "5 dots"}
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
          const isLocked = locked && dotValue === 1

          return (
            <button
              key={i}
              type="button"
              onClick={() => !isLocked && onChange(dotValue === value ? (locked ? 1 : 0) : dotValue)}
              onMouseEnter={() => !isLocked && setHoveredValue(dotValue)}
              disabled={isLocked}
              className={cn(
                "w-4 h-4 rounded-full border transition-all duration-200",
                !isLocked && "hover:scale-110 cursor-pointer"
              )}
              style={{
                borderColor: getColor(),
                borderWidth: '2px',
                backgroundColor: isFilled ? getColor() : 'transparent',
                opacity: isLocked ? 0.5 : 1
              }}
            >
              {isLocked && <Lock className="w-2 h-2 m-auto" style={{ color: '#d4af37' }} />}
            </button>
          )
        })}
      </div>
    </div>
  )
}
