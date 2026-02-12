"use client"

import { SPHERES, TRADITIONS, TECHNOCRACY_CONVENTIONS, TECHNOCRACY_SPHERES } from "@/lib/mage-data"
import { SphereDotsInteractive } from "./sphere-dots"

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
  onReset,
}: SphereFilterProps) {
  return (
    <div
      className="bg-card border-[3px] border-primary border-l-[6px] border-l-accent rounded-md p-6
        shadow-[inset_0_0_40px_rgba(139,71,38,0.05),5px_5px_15px_rgba(0,0,0,0.2)]
        relative"
    >
      {/* Corner decoration */}
      <div className="absolute top-3 right-3 text-2xl text-primary opacity-30 font-serif" aria-hidden="true">
        {'\u2726'}
      </div>

      {/* Section title */}
      <h3 className="font-serif text-xl font-bold text-primary uppercase tracking-[0.15em] mb-6 pb-3 border-b-[3px] border-double border-primary flex items-center gap-3">
        <span className="text-ring text-lg drop-shadow-[0_0_8px_rgba(107,45,107,0.5)]" aria-hidden="true">
          {'\u2726'}
        </span>
        Filter Rotes
        <span className="ml-auto text-accent text-lg" aria-hidden="true">{'\u25C8'}</span>
      </h3>

      <div className="flex flex-col gap-6">
        {/* Tradition filter */}
        <div className="flex flex-col gap-2">
          <label
            htmlFor="tradition-filter"
            className="font-serif text-sm font-semibold text-primary uppercase tracking-widest flex items-center gap-2"
          >
            <span className="text-ring" aria-hidden="true">{'\u2726'}</span>
            Tradition / Convention
          </label>
          <select
            id="tradition-filter"
            value={traditionFilter}
            onChange={(e) => onTraditionChange(e.target.value)}
            className="w-full px-4 py-3 bg-background/60 border-2 border-primary rounded-sm
              text-foreground font-mono text-base
              transition-all duration-300
              shadow-[inset_2px_2px_5px_rgba(0,0,0,0.1)]
              focus:outline-none focus:border-ring focus:bg-background/80
              focus:shadow-[inset_2px_2px_5px_rgba(0,0,0,0.1),0_0_10px_rgba(107,45,107,0.3)]
              appearance-none cursor-pointer pr-10"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath fill='%234a1a4a' d='M6 8L0 0h12z'/%3E%3C/svg%3E")`,
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'right 1rem center',
            }}
          >
            <option value="">All Factions</option>
            <optgroup label="Traditions">
              {TRADITIONS.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </optgroup>
            <optgroup label="Technocracy">
              {TECHNOCRACY_CONVENTIONS.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </optgroup>
          </select>
        </div>

        {/* Spheres - ONE SECTION, MIXED COLORS */}
        <div className="flex flex-col gap-3">
          <span className="font-serif text-sm font-semibold text-primary uppercase tracking-widest flex items-center gap-2">
            <span className="text-ring" aria-hidden="true">{'\u2726'}</span>
            Spheres
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {/* Tradition Spheres - Purple theme */}
            {SPHERES.map((sphere) => (
              <div
                key={sphere}
                className="flex items-center justify-between gap-3 bg-background border-2 border-primary rounded-sm px-4 py-3
                  transition-all duration-300 hover:border-accent"
              >
                <span className="font-serif text-[0.7rem] font-bold text-primary uppercase tracking-widest flex-1 break-words leading-tight">
                  {sphere}
                </span>
                <SphereDotsInteractive
                  value={sphereFilters[sphere] || 0}
                  onChange={(level) => onSphereChange(sphere, level)}
                  label={sphere}
                />
              </div>
            ))}
            
            {/* Technocracy Spheres - Gray theme */}
            {TECHNOCRACY_SPHERES.map((sphere) => (
              <div
                key={sphere}
                className="flex items-center justify-between gap-3 bg-foreground/5 border-2 border-foreground/40 rounded-sm px-4 py-3
                  transition-all duration-300 hover:border-foreground/70"
              >
                <span className="font-serif text-[0.7rem] font-bold text-foreground uppercase tracking-widest flex-1 break-words leading-tight">
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
        <button
          type="button"
          onClick={onReset}
          className="font-serif px-6 py-3 bg-secondary text-secondary-foreground border-2 border-primary rounded-sm
            font-semibold text-sm uppercase tracking-[0.15em] cursor-pointer
            transition-all duration-300
            shadow-[0_4px_8px_rgba(0,0,0,0.15)]
            hover:bg-background hover:border-ring hover:-translate-y-0.5
            active:translate-y-0 flex items-center justify-center gap-3 w-full"
        >
          <span aria-hidden="true">{'\u27D0'}</span>
          Reset Filters
          <span aria-hidden="true">{'\u27D0'}</span>
        </button>
      </div>
    </div>
  )
}
