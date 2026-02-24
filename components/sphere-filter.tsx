"use client"

import { SphereDotsInteractive } from "./sphere-dots"
import { TraditionComboboxSimple } from "./tradition-combobox"

interface SphereFilterProps {
  sphereFilters: Record<string, number>
  traditionFilter: string
  onSphereChange: (sphere: string, level: number) => void
  onTraditionChange: (tradition: string) => void
  onReset: () => void
}

export function SphereFilter({
  sphereFilters,
  traditionFilter,
  onSphereChange,
  onTraditionChange,
  onReset
}: SphereFilterProps) {
  const activeSphereFilters = Object.values(sphereFilters).filter(v => v > 0).length

  return (
    <div className="bg-card border-[3px] border-primary border-l-[6px] border-l-accent rounded-md p-6
      shadow-[inset_0_0_40px_rgba(139,71,38,0.05),5px_5px_15px_rgba(0,0,0,0.2)]">
      
      <h3 className="font-serif text-xl font-bold text-primary uppercase tracking-[0.15em] mb-6 flex items-center gap-3">
        <span className="text-ring" aria-hidden="true">{'\u2726'}</span>
        Filter Rotes
        <span className="ml-auto text-accent" aria-hidden="true">{'\u25C8'}</span>
      </h3>

      {/* Tradition Filter */}
      <div className="mb-8">
        <h4 className="font-serif text-sm font-bold text-primary uppercase tracking-[0.15em] mb-3 flex items-center gap-2">
          <span className="text-ring" aria-hidden="true">{'\u2726'}</span>
          Tradition / Convention
        </h4>
        <TraditionComboboxSimple
          value={traditionFilter}
          onValueChange={onTraditionChange}
          placeholder="All Factions"
        />
      </div>

      {/* Tradition Spheres */}
      <div className="mb-6">
        <h4 className="font-serif text-sm font-bold text-primary uppercase tracking-[0.15em] mb-4 flex items-center gap-2">
          <span className="text-ring" aria-hidden="true">{'\u2726'}</span>
          Spheres
        </h4>
        <p className="font-mono text-xs text-muted-foreground italic mb-4">
          Click dots to set minimum sphere level. Linked spheres (e.g. Data/Correspondence) match automatically.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {(['Correspondence', 'Entropy', 'Forces', 'Life', 'Matter', 'Mind', 'Prime', 'Spirit', 'Time'] as const).map((sphere) => (
            <div
              key={sphere}
              className="flex items-center justify-between gap-3 bg-background border-2 border-primary rounded-sm px-4 py-3
                transition-all duration-300 hover:border-accent"
            >
              <span className="font-serif text-xs font-bold text-primary uppercase tracking-widest shrink-0">
                {sphere}
              </span>
              <SphereDotsInteractive
                value={sphereFilters[sphere] || 0}
                onChange={(level) => onSphereChange(sphere, level)}
                label={sphere}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Technocracy Spheres */}
      <div className="mb-6">
        <h4 className="font-serif text-sm font-bold text-foreground uppercase tracking-[0.15em] mb-4 flex items-center gap-2">
          <span className="text-foreground/60" aria-hidden="true">{'\u2699'}</span>
          Technocracy Spheres
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {(['Data', 'Dimensional Science', 'Primal Utility'] as const).map((sphere) => (
            <div
              key={sphere}
              className="flex items-center justify-between gap-3 bg-foreground/5 border-2 border-foreground/40 rounded-sm px-4 py-3
                transition-all duration-300 hover:border-foreground/70"
            >
              <span className="font-serif text-xs font-bold text-foreground uppercase tracking-widest shrink-0">
                {sphere}
              </span>
              <SphereDotsInteractive
                value={sphereFilters[sphere] || 0}
                onChange={(level) => onSphereChange(sphere, level)}
                label={sphere}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Reset button */}
      <div className="pt-4 border-t-2 border-primary flex justify-center">
        <button
          type="button"
          onClick={onReset}
          className="font-serif px-8 py-3 bg-secondary text-secondary-foreground border-2 border-primary rounded-sm
            font-semibold text-sm uppercase tracking-widest cursor-pointer
            transition-all duration-300
            shadow-[0_4px_8px_rgba(0,0,0,0.15)]
            hover:bg-background hover:border-ring hover:-translate-y-0.5
            active:translate-y-0 flex items-center gap-3"
        >
          <span aria-hidden="true">{'\u2666'}</span>
          Reset Filters
          <span aria-hidden="true">{'\u2666'}</span>
        </button>
      </div>

      {/* Active filter count */}
      {(activeSphereFilters > 0 || traditionFilter) && (
        <div className="mt-4 pt-4 border-t-2 border-primary text-center">
          <span className="font-mono text-xs text-muted-foreground italic">
            {activeSphereFilters + (traditionFilter ? 1 : 0)} filter{(activeSphereFilters + (traditionFilter ? 1 : 0)) > 1 ? 's' : ''} active
          </span>
        </div>
      )}
    </div>
  )
}
