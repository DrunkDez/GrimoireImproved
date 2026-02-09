"use client"

interface SphereDotsProps {
  level: number
  maxDots?: number
  size?: "sm" | "md" | "lg"
  className?: string
}

export function SphereDots({ level, maxDots = 5, size = "md", className = "" }: SphereDotsProps) {
  const sizeClasses = {
    sm: "w-3 h-3",
    md: "w-4 h-4",
    lg: "w-5 h-5",
  }

  const gapClasses = {
    sm: "gap-0.5",
    md: "gap-1",
    lg: "gap-1.5",
  }

  const dotSize = sizeClasses[size]
  const gap = gapClasses[size]

  return (
    <div className={`flex items-center ${gap} ${className}`} role="img" aria-label={`${level} of ${maxDots}`}>
      {Array.from({ length: maxDots }, (_, i) => {
        const filled = i < level
        return (
          <svg
            key={i}
            viewBox="0 0 20 20"
            className={`${dotSize} shrink-0`}
            aria-hidden="true"
          >
            <circle
              cx="10"
              cy="10"
              r="8.5"
              fill={filled ? "hsl(300 45% 20%)" : "transparent"}
              stroke="hsl(300 45% 20%)"
              strokeWidth="1.5"
            />
            {filled && (
              <circle
                cx="8"
                cy="7"
                r="2"
                fill="hsl(300 45% 30%)"
                opacity="0.4"
              />
            )}
          </svg>
        )
      })}
    </div>
  )
}

interface SphereDotsInteractiveProps {
  value: number
  maxDots?: number
  onChange: (value: number) => void
  label: string
}

export function SphereDotsInteractive({ value, maxDots = 5, onChange, label }: SphereDotsInteractiveProps) {
  return (
    <div className="flex items-center gap-1" role="group" aria-label={`${label} level selector`}>
      {Array.from({ length: maxDots }, (_, i) => {
        const dotLevel = i + 1
        const filled = dotLevel <= value
        return (
          <button
            key={i}
            type="button"
            onClick={() => onChange(dotLevel === value ? 0 : dotLevel)}
            className="group/dot p-0.5 cursor-pointer focus-visible:outline-2 focus-visible:outline-ring focus-visible:outline-offset-1 rounded-full transition-transform duration-150 hover:scale-125"
            aria-label={`Set ${label} to ${dotLevel === value ? 0 : dotLevel}`}
            title={dotLevel === value ? "Click to clear" : `Set to ${dotLevel}`}
          >
            <svg
              viewBox="0 0 20 20"
              className="w-5 h-5 shrink-0 transition-all duration-200"
              aria-hidden="true"
            >
              <circle
                cx="10"
                cy="10"
                r="8.5"
                fill={filled ? "hsl(300 45% 20%)" : "transparent"}
                stroke="hsl(300 45% 20%)"
                strokeWidth="1.5"
                className="transition-all duration-200 group-hover/dot:stroke-[hsl(42_42%_59%)]"
              />
              {filled && (
                <circle
                  cx="8"
                  cy="7"
                  r="2"
                  fill="hsl(300 45% 30%)"
                  opacity="0.4"
                />
              )}
            </svg>
          </button>
        )
      })}
    </div>
  )
}
