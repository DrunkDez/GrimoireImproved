"use client"

import { cn } from "@/lib/utils"

export type TabId = "home" | "browse" | "add" | "merits" | "resources"

interface GrimoireNavProps {
  activeTab: TabId
  onTabChange: (tab: TabId) => void
}

const tabs: { id: TabId; label: string; symbol: string }[] = [
  { id: "home", label: "Sanctum", symbol: "\u2302" },
  { id: "browse", label: "Browse Rotes", symbol: "\u2727" },
  { id: "add", label: "Inscribe", symbol: "\u270E" },
  { id: "merits", label: "Merits & Flaws", symbol: "\u2726" },
  { id: "resources", label: "Resources", symbol: "\u{1F4DA}" },
]

export function GrimoireNav({ activeTab, onTabChange }: GrimoireNavProps) {
  return (
    <nav
      className="flex overflow-x-auto bg-secondary border-b-[3px] border-primary"
      role="tablist"
      aria-label="Grimoire navigation"
    >
      {tabs.map((tab) => (
        <button
          key={tab.id}
          role="tab"
          aria-selected={activeTab === tab.id}
          onClick={() => onTabChange(tab.id)}
          className={cn(
            "px-5 py-4 md:px-8 font-serif font-semibold text-sm md:text-base uppercase tracking-widest",
            "border-2 border-b-0 border-primary rounded-t-md",
            "whitespace-nowrap transition-all duration-300 ease-out",
            "mt-2 cursor-pointer relative",
            "text-primary hover:bg-background hover:-translate-y-0.5",
            activeTab === tab.id && [
              "bg-background border-accent mt-0 font-bold",
              "shadow-[inset_0_0_20px_rgba(201,169,97,0.2)]",
            ]
          )}
        >
          <span className="mr-2 text-lg" aria-hidden="true">
            {tab.symbol}
          </span>
          <span className="hidden sm:inline">{tab.label}</span>
        </button>
      ))}
    </nav>
  )
}
