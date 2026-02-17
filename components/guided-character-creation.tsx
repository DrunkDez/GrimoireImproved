"use client"

import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"
import { Check, ChevronRight, Info, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

interface TutorialStep {
  id: string
  title: string
  description: string
  target: string // CSS selector for highlight
  points?: number // Points to spend
  recommendation?: string
}

interface GuidedDotRatingProps {
  label: string
  maxDots?: number
  value: number
  onChange: (value: number) => void
  variant?: "attribute" | "ability" | "sphere" | "arete"
  isActive?: boolean // Tutorial is focused on this
  pointsRemaining?: number
  showGuide?: boolean
}

export function GuidedDotRating({
  label,
  maxDots = 5,
  value,
  onChange,
  variant = "attribute",
  isActive = false,
  pointsRemaining,
  showGuide = false
}: GuidedDotRatingProps) {
  const [hoveredValue, setHoveredValue] = useState<number | null>(null)
  const [justFilled, setJustFilled] = useState(false)

  const handleClick = (dotValue: number) => {
    if (value === dotValue) {
      onChange(0)
    } else {
      onChange(dotValue)
      setJustFilled(true)
      setTimeout(() => setJustFilled(false), 600)
    }
  }

  const displayValue = hoveredValue !== null ? hoveredValue : value

  const getVariantClasses = () => {
    switch (variant) {
      case "attribute":
        return {
          filled: "bg-primary border-primary shadow-[0_0_8px_rgba(139,71,38,0.6)]",
          empty: "border-primary/40 bg-background",
          hover: "border-primary shadow-[0_0_4px_rgba(139,71,38,0.4)]",
          glow: "shadow-[0_0_20px_rgba(139,71,38,0.8)]"
        }
      case "ability":
        return {
          filled: "bg-accent border-accent shadow-[0_0_8px_rgba(218,165,32,0.6)]",
          empty: "border-accent/40 bg-background",
          hover: "border-accent shadow-[0_0_4px_rgba(218,165,32,0.4)]",
          glow: "shadow-[0_0_20px_rgba(218,165,32,0.8)]"
        }
      case "sphere":
        return {
          filled: "bg-ring border-ring shadow-[0_0_8px_rgba(107,45,107,0.7)]",
          empty: "border-ring/40 bg-background",
          hover: "border-ring shadow-[0_0_4px_rgba(107,45,107,0.5)]",
          glow: "shadow-[0_0_20px_rgba(107,45,107,0.9)]"
        }
      case "arete":
        return {
          filled: "bg-gradient-to-br from-primary via-accent to-ring border-accent shadow-[0_0_12px_rgba(218,165,32,0.8)]",
          empty: "border-accent/40 bg-background",
          hover: "border-accent shadow-[0_0_6px_rgba(218,165,32,0.6)]",
          glow: "shadow-[0_0_24px_rgba(218,165,32,1)]"
        }
      default:
        return {
          filled: "bg-primary border-primary",
          empty: "border-primary/40 bg-background",
          hover: "border-primary",
          glow: ""
        }
    }
  }

  const colors = getVariantClasses()

  return (
    <div 
      className={cn(
        "relative flex items-center justify-between gap-4 py-3 px-4 rounded-md transition-all duration-300",
        isActive && "bg-accent/10 ring-2 ring-accent ring-offset-2 ring-offset-background",
        !isActive && "hover:bg-accent/5"
      )}
    >
      {/* Tutorial pointer/arrow */}
      {isActive && showGuide && (
        <div className="absolute -left-3 top-1/2 -translate-y-1/2 animate-bounce-horizontal">
          <ChevronRight className="w-6 h-6 text-accent drop-shadow-[0_0_8px_rgba(218,165,32,0.8)]" />
        </div>
      )}

      {/* Label */}
      <label className={cn(
        "font-serif text-sm font-semibold min-w-[120px] cursor-pointer transition-colors",
        isActive ? "text-accent" : "text-foreground"
      )}>
        {label}
      </label>

      {/* Dots container */}
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
              onClick={() => handleClick(dotValue)}
              onMouseEnter={() => setHoveredValue(dotValue)}
              className={cn(
                "relative w-6 h-6 rounded-full border-2 transition-all duration-300 ease-out",
                "hover:scale-110 active:scale-95",
                "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
                "cursor-pointer",
                isFilled ? colors.filled : colors.empty,
                !isFilled && isHovered && colors.hover,
                isFilled && "animate-dot-fill",
                justFilled && isFilled && "animate-dot-pulse-once",
                isActive && isFilled && colors.glow
              )}
              style={{
                animationDelay: isFilled ? `${i * 50}ms` : '0ms'
              }}
              aria-label={`Set ${label} to ${dotValue}`}
            >
              {/* Glow effect for active tutorial step */}
              {isActive && isFilled && (
                <span className="absolute inset-0 rounded-full bg-current opacity-30 blur-md animate-pulse" />
              )}
            </button>
          )
        })}
      </div>

      {/* Points remaining indicator */}
      {pointsRemaining !== undefined && isActive && (
        <div className="ml-2 text-xs font-semibold text-accent animate-fade-in">
          {pointsRemaining} pts left
        </div>
      )}
    </div>
  )
}

interface CharacterCreationGuideProps {
  currentStep: number
  onStepComplete: () => void
  onSkip: () => void
}

export function CharacterCreationGuide({
  currentStep,
  onStepComplete,
  onSkip
}: CharacterCreationGuideProps) {
  const steps: TutorialStep[] = [
    {
      id: "welcome",
      title: "Welcome to Character Creation",
      description: "Let's create your Mage character! We'll guide you through each step. Click Next to begin.",
      target: "",
    },
    {
      id: "attributes",
      title: "Prioritize Your Attributes",
      description: "Choose your primary attribute category (7 dots), secondary (5 dots), and tertiary (3 dots). Physical covers Strength, Dexterity, Stamina. Social is Charisma, Manipulation, Appearance. Mental is Perception, Intelligence, Wits.",
      target: ".attributes-section",
      points: 15,
      recommendation: "Most mages prioritize Mental or Social first!"
    },
    {
      id: "abilities",
      title: "Distribute Your Abilities",
      description: "Similar to attributes: primary (13 dots), secondary (9 dots), tertiary (5 dots). Talents, Skills, and Knowledges. No ability can start above 3.",
      target: ".abilities-section",
      points: 27,
      recommendation: "Occult and your mage's specialty are crucial!"
    },
    {
      id: "spheres",
      title: "Select Your Spheres",
      description: "You have 6 dots to spend on Spheres of magic. Your Tradition grants an affinity Sphere at 1 dot automatically. No Sphere can start above 3.",
      target: ".spheres-section",
      points: 6,
      recommendation: "Diversify or specialize? Your choice shapes your magic!"
    },
    {
      id: "backgrounds",
      title: "Choose Your Backgrounds",
      description: "You have 7 dots to spend on Backgrounds like Allies, Resources, Avatar, etc. These represent your connections and assets.",
      target: ".backgrounds-section",
      points: 7,
      recommendation: "Avatar is essential! Consider Allies and Resources too."
    },
    {
      id: "arete",
      title: "Set Your Arete",
      description: "Your Arete rating starts at 1. This measures your enlightenment and magical power. It's the most important trait for casting magic!",
      target: ".arete-section",
      points: 1,
      recommendation: "Arete is your power level - it caps your Sphere effects!"
    },
    {
      id: "willpower",
      title: "Determine Willpower",
      description: "Your Willpower starts at 5 by default. You can spend Freebie Points to increase it later. It's your mental fortitude and resistance.",
      target: ".willpower-section",
      recommendation: "High Willpower helps resist magic and push through challenges!"
    },
    {
      id: "finishing",
      title: "Finishing Touches",
      description: "Add your character's name, concept, Nature, Demeanor, and Essence. Then spend your Freebie Points (15) to fine-tune your character!",
      target: ".details-section",
      recommendation: "Spend freebies on Arete, Spheres, or Abilities!"
    }
  ]

  const currentStepData = steps[currentStep]

  if (!currentStepData) return null

  return (
    <Card className={cn(
      "fixed top-20 right-6 z-50 w-80 border-2 border-accent shadow-2xl",
      "animate-slide-in-right"
    )}>
      <CardContent className="p-6 space-y-4">
        {/* Step indicator */}
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>Step {currentStep + 1} of {steps.length}</span>
          <div className="flex gap-1">
            {steps.map((_, i) => (
              <div
                key={i}
                className={cn(
                  "w-2 h-2 rounded-full transition-colors",
                  i < currentStep ? "bg-primary" : i === currentStep ? "bg-accent animate-pulse" : "bg-muted"
                )}
              />
            ))}
          </div>
        </div>

        {/* Title */}
        <div className="flex items-start gap-2">
          <Sparkles className="w-5 h-5 text-accent shrink-0 mt-0.5" />
          <h3 className="font-serif text-lg font-bold text-accent">
            {currentStepData.title}
          </h3>
        </div>

        {/* Description */}
        <p className="text-sm text-foreground leading-relaxed">
          {currentStepData.description}
        </p>

        {/* Points indicator */}
        {currentStepData.points && (
          <div className="bg-accent/10 border border-accent/30 rounded-md p-3 flex items-center gap-2">
            <Info className="w-4 h-4 text-accent shrink-0" />
            <p className="text-xs font-semibold text-accent">
              {currentStepData.points} points to spend
            </p>
          </div>
        )}

        {/* Recommendation */}
        {currentStepData.recommendation && (
          <div className="bg-primary/10 border border-primary/30 rounded-md p-3">
            <p className="text-xs text-primary font-medium">
              💡 Tip: {currentStepData.recommendation}
            </p>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={onSkip}
            className="text-muted-foreground"
          >
            Skip Tutorial
          </Button>
          <Button
            onClick={onStepComplete}
            size="sm"
            className="ml-auto gap-2"
          >
            {currentStep === steps.length - 1 ? (
              <>
                <Check className="w-4 h-4" />
                Finish
              </>
            ) : (
              <>
                Next
                <ChevronRight className="w-4 h-4" />
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

// Example usage component
export function GuidedCharacterCreationExample() {
  const [currentStep, setCurrentStep] = useState(0)
  const [showGuide, setShowGuide] = useState(true)
  
  // Character state
  const [strength, setStrength] = useState(1)
  const [dexterity, setDexterity] = useState(1)
  const [stamina, setStamina] = useState(1)

  const handleStepComplete = () => {
    if (currentStep < 7) {
      setCurrentStep(currentStep + 1)
    } else {
      setShowGuide(false)
    }
  }

  const handleSkip = () => {
    setShowGuide(false)
  }

  return (
    <div className="relative p-6 space-y-8">
      {showGuide && (
        <CharacterCreationGuide
          currentStep={currentStep}
          onStepComplete={handleStepComplete}
          onSkip={handleSkip}
        />
      )}

      {!showGuide && (
        <Button
          onClick={() => setShowGuide(true)}
          variant="outline"
          size="sm"
          className="fixed top-20 right-6"
        >
          Show Guide
        </Button>
      )}

      {/* Attributes section */}
      <div className="attributes-section space-y-2">
        <h2 className="text-2xl font-cinzel font-bold text-primary mb-4">
          Physical Attributes
        </h2>
        <GuidedDotRating
          label="Strength"
          value={strength}
          onChange={setStrength}
          variant="attribute"
          isActive={currentStep === 1}
          showGuide={showGuide}
          pointsRemaining={currentStep === 1 ? 15 - (strength + dexterity + stamina) : undefined}
        />
        <GuidedDotRating
          label="Dexterity"
          value={dexterity}
          onChange={setDexterity}
          variant="attribute"
          isActive={currentStep === 1}
          showGuide={showGuide}
        />
        <GuidedDotRating
          label="Stamina"
          value={stamina}
          onChange={setStamina}
          variant="attribute"
          isActive={currentStep === 1}
          showGuide={showGuide}
        />
      </div>
    </div>
  )
}
