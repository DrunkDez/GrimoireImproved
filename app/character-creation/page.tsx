"use client"

import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"
import { Lock, ChevronRight, Check, Plus, Minus, ChevronDown, ChevronUp } from "lucide-react"
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

// Guide Step Interface (for expandable sections)
interface GuideStep {
  id: string
  number: number
  title: string
  subtitle: string
  content: string
  expanded: boolean
}

// Default guide content (can be replaced with DB content)
const DEFAULT_GUIDE_STEPS: GuideStep[] = [
  {
    id: "concept",
    number: 1,
    title: "Concept & Tradition",
    subtitle: "Choose your character concept, Tradition, and basic identity",
    content: "Your character concept is the core idea of who your mage is. Are they a street-smart hacker? A scholarly occultist? A martial artist seeking enlightenment? Your Tradition determines your magical philosophy and affinity Sphere.",
    expanded: false
  },
  {
    id: "attributes",
    number: 2,
    title: "Attributes",
    subtitle: "Prioritize Physical, Social, and Mental (7/5/3 dots + 1 free each)",
    content: "Each attribute starts at 1 dot. Choose which category gets 7 additional dots (Primary), 5 additional dots (Secondary), and 3 additional dots (Tertiary). Physical attributes are Strength, Dexterity, and Stamina. Social attributes are Charisma, Manipulation, and Appearance. Mental attributes are Perception, Intelligence, and Wits.",
    expanded: false
  },
  {
    id: "abilities",
    number: 3,
    title: "Abilities",
    subtitle: "Prioritize Talents, Skills, Knowledges (13/9/5 dots, max 3 each)",
    content: "Abilities represent your learned skills and knowledge. Talents are intuitive abilities like Alertness and Brawl. Skills are practical abilities like Drive and Technology. Knowledges are scholarly pursuits like Occult and Science. During character creation, no ability can exceed 3 dots.",
    expanded: false
  },
  {
    id: "spheres",
    number: 4,
    title: "Spheres",
    subtitle: "Choose your magical Spheres (6 dots, affinity at 1, max 3 each)",
    content: "The Nine Spheres represent different aspects of reality you can manipulate: Correspondence (space), Entropy (fate), Forces (energy), Life (biology), Matter (substances), Mind (thought), Prime (quintessence), Spirit (ephemera), and Time. Your Tradition grants one affinity Sphere at 1 dot, using 1 of your 6 dots.",
    expanded: false
  },
  {
    id: "backgrounds",
    number: 5,
    title: "Backgrounds",
    subtitle: "Select Backgrounds like Avatar, Resources, Allies (7 dots total)",
    content: "Backgrounds represent your character's resources, connections, and advantages. Avatar is essential for mages as it represents your inner guide. Other useful backgrounds include Resources (wealth), Allies (helpful contacts), Node (Quintessence source), and Library (research materials).",
    expanded: false
  },
  {
    id: "freebies",
    number: 6,
    title: "Freebie Points",
    subtitle: "Spend 15 freebie points to customize your character",
    content: "Use 15 freebie points to further customize your character. Costs: Attributes (5 pts/dot), Abilities (2 pts/dot), Spheres (7 pts/dot), Backgrounds (1 pt/dot), Arete (4 pts/dot), Willpower (1 pt/dot). You can also take Merits (cost points) and Flaws (give points, max +7). Abilities at 4+ dots require a specialty.",
    expanded: false
  }
]

export default function CharacterGuideCreation() {
  const [state, setState] = useState<CharacterState>(INITIAL_STATE)
  const [guideSteps, setGuideSteps] = useState<GuideStep[]>(DEFAULT_GUIDE_STEPS)
  const [showGuide, setShowGuide] = useState(true)

  // Toggle guide step expansion
  const toggleStep = (stepId: string) => {
    setGuideSteps(guideSteps.map(step => 
      step.id === stepId ? { ...step, expanded: !step.expanded } : step
    ))
  }

  // In the future, you can fetch guide content from admin panel:
  // useEffect(() => {
  //   fetch('/api/character-guide-steps')
  //     .then(res => res.json())
  //     .then(data => setGuideSteps(data))
  // }, [])

  return (
    <div className="min-h-screen relative z-[1]">
      <div className="max-w-[1400px] mx-auto bg-background border-[3px] border-primary rounded-lg overflow-hidden relative my-6 mx-3 md:my-8 md:mx-4">
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
          {/* Toggle Guide/Creation */}
          <div className="flex justify-center mb-6">
            <div className="inline-flex rounded-lg border-2" style={{ borderColor: '#8b4513' }}>
              <button
                onClick={() => setShowGuide(true)}
                className={cn(
                  "px-6 py-2 font-semibold transition-all",
                  showGuide && "text-primary-foreground"
                )}
                style={{
                  background: showGuide ? 'linear-gradient(135deg, #d4af37, #8b6914)' : 'transparent',
                  color: showGuide ? '#2d1b4e' : '#4a2c2a'
                }}
              >
                📖 Guide
              </button>
              <button
                onClick={() => setShowGuide(false)}
                className={cn(
                  "px-6 py-2 font-semibold transition-all",
                  !showGuide && "text-primary-foreground"
                )}
                style={{
                  background: !showGuide ? 'linear-gradient(135deg, #d4af37, #8b6914)' : 'transparent',
                  color: !showGuide ? '#2d1b4e' : '#4a2c2a'
                }}
              >
                ⚡ Create Character
              </button>
            </div>
          </div>

          {/* GUIDE VIEW */}
          {showGuide && (
            <div className="space-y-4">
              <div className="text-center mb-6">
                <h2 className="text-3xl font-bold mb-2" style={{ fontFamily: 'Georgia, serif', color: '#4a2c2a' }}>
                  Character Creation Guide
                </h2>
                <p className="text-sm" style={{ color: '#6b4423' }}>
                  Click each step to expand and see details
                </p>
              </div>

              {guideSteps.map((step) => (
                <GuideStepCard
                  key={step.id}
                  step={step}
                  onToggle={() => toggleStep(step.id)}
                />
              ))}

              <div className="mt-8 p-6 rounded-lg text-center" style={{
                background: 'linear-gradient(135deg, rgba(212, 175, 55, 0.1), rgba(139, 105, 20, 0.1))',
                border: '2px solid #d4af37'
              }}>
                <p className="text-lg font-semibold mb-4" style={{ color: '#4a2c2a' }}>
                  Ready to create your character?
                </p>
                <button
                  onClick={() => setShowGuide(false)}
                  className="px-8 py-3 rounded-lg font-bold text-lg transition-all hover:scale-105"
                  style={{
                    background: 'linear-gradient(135deg, #d4af37, #8b6914)',
                    color: '#2d1b4e'
                  }}
                >
                  Start Character Creation →
                </button>
              </div>
            </div>
          )}

          {/* CHARACTER CREATION VIEW */}
          {!showGuide && (
            <CharacterCreationWizard state={state} setState={setState} />
          )}
        </div>
      </div>
    </div>
  )
}

// Guide Step Card Component
function GuideStepCard({ step, onToggle }: {
  step: GuideStep
  onToggle: () => void
}) {
  return (
    <div 
      className="border-2 rounded-lg overflow-hidden transition-all cursor-pointer hover:shadow-lg"
      style={{ borderColor: '#8b4513' }}
      onClick={onToggle}
    >
      <div 
        className="p-4 flex items-center justify-between"
        style={{ background: step.expanded ? 'rgba(139, 69, 19, 0.05)' : 'transparent' }}
      >
        <div className="flex items-center gap-4 flex-1">
          <div 
            className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg"
            style={{ background: 'linear-gradient(135deg, #d4af37, #8b6914)', color: '#2d1b4e' }}
          >
            {step.number}
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-lg" style={{ color: '#4a2c2a' }}>
              {step.title}
            </h3>
            <p className="text-sm" style={{ color: '#6b4423' }}>
              {step.subtitle}
            </p>
          </div>
        </div>
        <div className="text-xl" style={{ color: '#8b4513' }}>
          {step.expanded ? <ChevronUp /> : <ChevronDown />}
        </div>
      </div>

      {step.expanded && (
        <div 
          className="p-6 border-t-2"
          style={{ borderColor: '#8b4513', background: 'rgba(245, 240, 232, 0.3)' }}
        >
          <p className="leading-relaxed" style={{ color: '#4a2c2a' }}>
            {step.content}
          </p>
        </div>
      )}
    </div>
  )
}

// Character Creation Wizard Component (your existing creation code)
function CharacterCreationWizard({ state, setState }: {
  state: CharacterState
  setState: (state: CharacterState) => void
}) {
  // All your existing character creation phases go here
  // I'll include the key ones for demonstration
  
  return (
    <div className="space-y-6">
      {/* Progress indicator */}
      <div className="flex items-center justify-center gap-2 mb-8">
        {["Basics", "Attributes", "Abilities", "Spheres", "Backgrounds", "Freebies", "Complete"].map((label, i) => {
          const phaseNames = ["basics", "attributes-priority", "abilities-priority", "spheres", "backgrounds", "freebies", "complete"]
          const currentIndex = phaseNames.indexOf(state.phase)
          const isComplete = i < currentIndex || (i === currentIndex && state.phase === "complete")
          const isCurrent = i === currentIndex

          return (
            <div key={i} className="flex items-center gap-2">
              {i > 0 && <div className="w-8 h-0.5 bg-primary/30" />}
              <div className={cn(
                "w-8 h-8 rounded-full border-2 flex items-center justify-center text-xs font-bold",
                isComplete && "bg-primary border-primary text-primary-foreground",
                isCurrent && "border-accent text-accent animate-pulse",
                !isComplete && !isCurrent && "border-primary/30 text-muted-foreground"
              )}>
                {isComplete ? <Check className="w-4 h-4" /> : i + 1}
              </div>
            </div>
          )
        })}
      </div>

      {/* Your existing phase components */}
      {state.phase === "basics" && <BasicsPhase state={state} setState={setState} />}
      {/* ... rest of your phases ... */}
      {state.phase === "complete" && <CompletePhase state={state} />}
    </div>
  )
}

// Simplified phase components (add your full implementations)
function BasicsPhase({ state, setState }: { state: CharacterState, setState: (s: CharacterState) => void }) {
  return (
    <div className="space-y-6">
      <SectionHeader title="Basic Information" subtitle="Tell us about your character" />
      <div className="grid grid-cols-3 gap-4">
        <SheetInput label="Name:" value={state.name} onChange={(v) => setState({ ...state, name: v })} />
        <SheetInput label="Player:" value={state.player} onChange={(v) => setState({ ...state, player: v })} />
        <SheetInput label="Chronicle:" value={state.chronicle} onChange={(v) => setState({ ...state, chronicle: v })} />
      </div>
      <SheetButton
        onClick={() => setState({ ...state, phase: "attributes-priority" })}
        disabled={!state.name}
      >
        Continue to Attributes <ChevronRight className="w-4 h-4 ml-2" />
      </SheetButton>
    </div>
  )
}

function CompletePhase({ state }: { state: CharacterState }) {
  return (
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
        {state.name || "Your character"} is ready for the next phase. Arete ({state.arete + state.freebieDots.arete}) and Willpower ({state.willpower + state.freebieDots.willpower}) have been set.
      </p>
      <div className="grid grid-cols-2 gap-4 max-w-2xl mx-auto mt-8">
        <div className="p-4 border-2 rounded" style={{ borderColor: '#8b4513', background: 'rgba(139, 69, 19, 0.03)' }}>
          <h3 className="font-semibold mb-3 text-center" style={{ color: '#4a2c2a' }}>✅ Completed</h3>
          <ul className="text-sm space-y-2" style={{ color: '#6b4423' }}>
            <li>✓ Basic Information</li>
            <li>✓ Attributes (15 dots)</li>
            <li>✓ Abilities (27 dots)</li>
            <li>✓ Spheres (6 dots)</li>
            <li>✓ Backgrounds (7 dots)</li>
            <li>✓ Freebie Points (15)</li>
          </ul>
        </div>
        <div className="p-4 border-2 rounded" style={{ borderColor: '#8b4513', background: 'rgba(212, 175, 55, 0.05)' }}>
          <h3 className="font-semibold mb-3 text-center" style={{ color: '#d4af37' }}>🎭 Character Ready!</h3>
          <ul className="text-sm space-y-2" style={{ color: '#6b4423' }}>
            <li>→ {state.merits.length} Merits</li>
            <li>→ {state.flaws.length} Flaws</li>
            <li>→ {Object.keys(state.specialties).length} Specialties</li>
            <li>→ Arete: {state.arete + state.freebieDots.arete}</li>
            <li>→ Willpower: {state.willpower + state.freebieDots.willpower}</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

// Helper components
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
