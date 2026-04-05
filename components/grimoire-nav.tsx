"use client"

import { cn } from "@/lib/utils"

export type TabId = "home" | "browse" | "add" | "merits" | "resources"

interface GrimoireNavProps {
  activeTab: TabId
  onTabChange: (tab: TabId) => void
}

const tabs: { id: TabId; label: string; symbol: string }[] = [
  { id: "home",      label: "Sanctum",       symbol: "⌂" },
  { id: "browse",    label: "Browse Rotes",  symbol: "✧" },
  { id: "add",       label: "Inscribe",      symbol: "✎" },
  { id: "merits",    label: "Merits & Flaws",symbol: "✦" },
  { id: "resources", label: "Resources",     symbol: "📚" },
]

export function GrimoireNav({ activeTab, onTabChange }: GrimoireNavProps) {
  return (
    <nav
      className="relative flex overflow-x-auto bg-card/60 backdrop-blur-sm"
      role="tablist"
      aria-label="Grimoire navigation"
      style={{
        borderBottom: '1px solid hsl(var(--border))',
      }}
    >
      {/* Subtle top separator line */}
      <div
        className="absolute top-0 left-0 right-0 h-px pointer-events-none"
        aria-hidden="true"
        style={{
          background: 'linear-gradient(90deg, transparent, hsl(var(--accent) / 0.3) 30%, hsl(var(--accent) / 0.3) 70%, transparent)',
        }}
      />

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
              "relative flex items-center gap-2 px-5 py-4 md:px-7",
              "font-serif text-xs md:text-sm uppercase tracking-[0.12em] font-semibold",
              "whitespace-nowrap cursor-pointer select-none",
              "transition-all duration-300 ease-out",
              "outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset",

              // Inactive
              !isActive && "text-muted-foreground hover:text-primary hover:bg-primary/[0.04]",

              // Active
              isActive && "text-accent",
            )}
            style={isActive ? {
              // Subtle warm wash behind active tab
              background: 'linear-gradient(180deg, transparent 0%, hsl(var(--accent) / 0.06) 100%)',
            } : undefined}
          >
            {/* Symbol */}
            <span
              className={cn(
                "text-base transition-all duration-300",
                isActive
                  ? "text-accent drop-shadow-[0_0_6px_hsl(var(--accent)/0.6)]"
                  : "text-muted-foreground/60 group-hover:text-primary"
              )}
              aria-hidden="true"
            >
              {tab.symbol}
            </span>

            {/* Label — hidden on very small screens */}
            <span className="hidden sm:inline">{tab.label}</span>

            {/* Active underline indicator — the modern replacement for raised tabs */}
            {isActive && (
              <span
                className="absolute bottom-0 left-0 right-0 h-[2px] rounded-t-full"
                aria-hidden="true"
                style={{
                  background: 'linear-gradient(90deg, transparent 0%, hsl(var(--accent)) 30%, hsl(var(--accent)) 70%, transparent 100%)',
                  boxShadow: '0 0 8px hsl(var(--accent) / 0.5)',
                }}
              />
            )}

            {/* Hover underline — ghost state */}
            {!isActive && (
              <span
                className="absolute bottom-0 left-3 right-3 h-px opacity-0 hover:opacity-100 transition-opacity duration-300 rounded-t-full"
                aria-hidden="true"
                style={{
                  background: 'hsl(var(--primary) / 0.3)',
                }}
              />
            )}
          </button>
        )
      })}
    </nav>
  )
}
