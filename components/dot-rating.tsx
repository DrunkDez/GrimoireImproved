"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"

interface DotRatingProps {
  label: string
  maxDots?: number
  value: number
  onChange: (value: number) => void
  disabled?: boolean
  variant?: "attribute" | "ability" | "sphere" | "arete"
}

export function DotRating({ 
  label, 
  maxDots = 5, 
  value, 
  onChange, 
  disabled = false,
  variant = "attribute"
}: DotRatingProps) {
  const [hoveredValue, setHoveredValue] = useState<number | null>(null)

  const handleClick = (dotValue: number) => {
    if (disabled) return
    
    // If clicking the same value, clear it (set to 0)
    if (value === dotValue) {
      onChange(0)
    } else {
      onChange(dotValue)
    }
  }

  const displayValue = hoveredValue !== null ? hoveredValue : value

  // Different colors for different types
  const getVariantClasses = () => {
    switch (variant) {
      case "attribute":
        return {
          filled: "bg-primary border-primary shadow-[0_0_8px_rgba(139,71,38,0.6)]",
          empty: "border-primary/40 bg-background",
          hover: "border-primary shadow-[0_0_4px_rgba(139,71,38,0.4)]"
        }
      case "ability":
        return {
          filled: "bg-accent border-accent shadow-[0_0_8px_rgba(218,165,32,0.6)]",
          empty: "border-accent/40 bg-background",
          hover: "border-accent shadow-[0_0_4px_rgba(218,165,32,0.4)]"
        }
      case "sphere":
        return {
          filled: "bg-ring border-ring shadow-[0_0_8px_rgba(107,45,107,0.7)]",
          empty: "border-ring/40 bg-background",
          hover: "border-ring shadow-[0_0_4px_rgba(107,45,107,0.5)]"
        }
      case "arete":
        return {
          filled: "bg-gradient-to-br from-primary via-accent to-ring border-accent shadow-[0_0_12px_rgba(218,165,32,0.8)]",
          empty: "border-accent/40 bg-background",
          hover: "border-accent shadow-[0_0_6px_rgba(218,165,32,0.6)]"
        }
      default:
        return {
          filled: "bg-primary border-primary",
          empty: "border-primary/40 bg-background",
          hover: "border-primary"
        }
    }
  }

  const colors = getVariantClasses()

  return (
    <div className="flex items-center justify-between gap-4 py-2 px-3 rounded-md hover:bg-accent/5 transition-colors group">
      <label className="font-serif text-sm font-semibold text-foreground min-w-[120px] cursor-pointer">
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
              onClick={() => handleClick(dotValue)}
              onMouseEnter={() => !disabled && setHoveredValue(dotValue)}
              disabled={disabled}
              className={cn(
                "w-6 h-6 rounded-full border-2 transition-all duration-300 ease-out",
                "hover:scale-110 active:scale-95",
                "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
                disabled && "opacity-50 cursor-not-allowed",
                !disabled && "cursor-pointer",
                isFilled ? colors.filled : colors.empty,
                !isFilled && isHovered && colors.hover,
                // Animation classes
                isFilled && "animate-dot-fill",
                // Stagger the animation based on position
                isFilled && `animation-delay-${i * 50}`
              )}
              style={{
                animationDelay: isFilled ? `${i * 50}ms` : '0ms'
              }}
              aria-label={`Set ${label} to ${dotValue}`}
            >
              <span className="sr-only">{dotValue}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}

// Example usage component
export function DotRatingExample() {
  const [strength, setStrength] = useState(2)
  const [dexterity, setDexterity] = useState(3)
  const [occult, setOccult] = useState(4)
  const [forces, setForces] = useState(3)
  const [arete, setArete] = useState(2)

  return (
    <div className="space-y-6 p-6 bg-card border-2 border-primary rounded-lg max-w-md">
      <div className="space-y-2">
        <h3 className="font-serif text-lg font-bold text-primary uppercase tracking-wider mb-4">
          Attributes
        </h3>
        <DotRating 
          label="Strength" 
          value={strength} 
          onChange={setStrength}
          variant="attribute"
        />
        <DotRating 
          label="Dexterity" 
          value={dexterity} 
          onChange={setDexterity}
          variant="attribute"
        />
      </div>

      <div className="space-y-2">
        <h3 className="font-serif text-lg font-bold text-accent uppercase tracking-wider mb-4">
          Abilities
        </h3>
        <DotRating 
          label="Occult" 
          value={occult} 
          onChange={setOccult}
          variant="ability"
        />
      </div>

      <div className="space-y-2">
        <h3 className="font-serif text-lg font-bold text-ring uppercase tracking-wider mb-4">
          Spheres
        </h3>
        <DotRating 
          label="Forces" 
          value={forces} 
          onChange={setForces}
          variant="sphere"
        />
      </div>

      <div className="space-y-2">
        <h3 className="font-serif text-lg font-bold text-accent uppercase tracking-wider mb-4">
          Arete
        </h3>
        <DotRating 
          label="Arete" 
          maxDots={10}
          value={arete} 
          onChange={setArete}
          variant="arete"
        />
      </div>
    </div>
  )
}
