"use client"

import { cn } from "@/lib/utils"

export type TabId = "home" | "browse" | "add" | "merits" | "resources" | "character"

interface GrimoireNavProps {
  activeTab: TabId
  onTabChange: (tab: TabId) => void
}

const tabs: { id: TabId; label: string; symbol: string }[] = [
  { id: "home",      label: "Sanctum",          symbol: "⌂"  },
  { id: "browse",    label: "Browse Rotes",     symbol: "✧"  },
  { id: "add",       label: "Inscribe",         symbol: "✎"  },
  { id: "merits",    label: "Merits & Flaws",   symbol: "✦"  },
  { id: "resources", label: "Resources",        symbol: "📚" },
  { id: "character", label: "Character",        symbol: "◈"  },
]

export function GrimoireNav({ activeTab, onTabChange }: GrimoireNavProps) {
  return (
    <nav
      role="tablist"
      aria-label="Grimoire navigation"
      className="flex overflow-x-auto"
      style={{
        background:      "hsl(var(--background))",
        borderBottom:    "1px solid hsl(var(--border) / 0.5)",
        height:          "46px",
        alignItems:      "stretch",
        padding:         "0 6px",
        gap:             "1px",
        scrollbarWidth:  "none",
        msOverflowStyle: "none",
      } as React.CSSProperties}
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
              "relative inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4",
              "font-serif text-[10px] sm:text-[11px] uppercase tracking-[0.12em] font-semibold",
              "whitespace-nowrap shrink-0 cursor-pointer select-none",
              "transition-all duration-200 ease-out",
              "border-none rounded-none bg-transparent",
              "outline-none focus-visible:ring-1 focus-visible:ring-inset focus-visible:ring-ring",
              !isActive && "hover:bg-primary/[0.05]",
            )}
            style={{
              /* Readable at rest — not muted-foreground/50 which was invisible */
              color: isActive
                ? "hsl(var(--primary))"
                : "hsl(var(--foreground) / 0.55)",
            }}
          >
            <span
              className="text-sm leading-none transition-colors duration-200"
              style={{
                color: isActive
                  ? "hsl(var(--primary))"
                  : "hsl(var(--foreground) / 0.4)",
              }}
              aria-hidden="true"
            >
              {tab.symbol}
            </span>

            <span className="hidden sm:inline">{tab.label}</span>

            {/* Active underline */}
            {isActive && (
              <span
                className="absolute bottom-0 left-1 right-1"
                aria-hidden="true"
                style={{
                  height:     "2px",
                  borderRadius: "2px 2px 0 0",
                  background: "linear-gradient(90deg, hsl(var(--primary) / 0.5), hsl(var(--primary)), hsl(var(--primary) / 0.5))",
                  boxShadow:  "0 0 8px hsl(var(--primary) / 0.55), 0 0 2px hsl(var(--accent) / 0.3)",
                }}
              />
            )}
          </button>
        )
      })}
    </nav>
  )
}
