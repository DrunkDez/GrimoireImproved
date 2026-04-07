"use client"

import { cn } from "@/lib/utils"

export type TabId = "home" | "browse" | "add" | "merits" | "resources"

interface GrimoireNavProps {
  activeTab: TabId
  onTabChange: (tab: TabId) => void
}

const tabs: { id: TabId; label: string; symbol: string }[] = [
  { id: "home",      label: "Sanctum",        symbol: "⌂"  },
  { id: "browse",    label: "Browse Rotes",   symbol: "✧"  },
  { id: "add",       label: "Inscribe",       symbol: "✎"  },
  { id: "merits",    label: "Merits & Flaws", symbol: "✦"  },
  { id: "resources", label: "Resources",      symbol: "📚" },
]

export function GrimoireNav({ activeTab, onTabChange }: GrimoireNavProps) {
  return (
    <nav
      role="tablist"
      aria-label="Grimoire navigation"
      className="flex overflow-x-auto"
      style={{
        background: "hsl(var(--background))",
        borderBottom: "1px solid hsl(var(--border) / 0.4)",
        height: "46px",
        alignItems: "stretch",
        padding: "0 8px",
        gap: "2px",
      }}
    >
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id
        return (
          <button
            key={tab.id}
            role="tab"
            aria-selected={isActive}
            onClick={() => onTabChange(tab.id)}
            className={cn(
              // Base
              "relative inline-flex items-center gap-2 px-4",
              "font-serif text-[11px] uppercase tracking-[0.12em] font-semibold",
              "whitespace-nowrap shrink-0 cursor-pointer select-none",
              "transition-all duration-200 ease-out border-none",
              "outline-none focus-visible:ring-1 focus-visible:ring-inset focus-visible:ring-ring",
              "rounded-none",

              // Inactive
              !isActive && "text-muted-foreground/50 hover:text-primary/80 hover:bg-primary/[0.04] bg-transparent",

              // Active
              isActive && "text-accent bg-transparent",
            )}
          >
            {/* Symbol */}
            <span
              className={cn(
                "text-sm leading-none transition-all duration-200",
                isActive
                  ? "text-accent"
                  : "text-muted-foreground/35",
              )}
              aria-hidden="true"
            >
              {tab.symbol}
            </span>

            {/* Label */}
            <span className="hidden sm:inline">{tab.label}</span>

            {/* Active indicator — bottom hairline with glow */}
            {isActive && (
              <span
                className="absolute bottom-0 left-2 right-2 rounded-t-sm"
                aria-hidden="true"
                style={{
                  height: "2px",
                  background: "hsl(var(--accent))",
                  boxShadow: "0 0 8px hsl(var(--accent) / 0.55), 0 0 16px hsl(var(--accent) / 0.2)",
                }}
              />
            )}
          </button>
        )
      })}
    </nav>
  )
}
