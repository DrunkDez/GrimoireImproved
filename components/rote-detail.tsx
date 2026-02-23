"use client"

import type { Rote } from "@/lib/mage-data"
import { getTraditionSymbol, isTechnocracySphere } from "@/lib/mage-data"
import { SphereDots } from "./sphere-dots"
import { SphereDisplay } from '@/components/sphere-display'

interface RoteDetailProps {
  rote: Rote
  onBack: () => void
}
function formatSpheres(spheres: any): string {
  if (!spheres) return 'None';
  
  if (Array.isArray(spheres)) {
    return spheres.map((combo, i) => {
      const str = Object.entries(combo)
        .map(([s, l]) => `${s} ${l}`)
        .join(', ');
      return spheres.length > 1 ? `[${i + 1}] ${str}` : str;
    }).join(' OR ');
  }
  
  if (typeof spheres === 'object') {
    return Object.entries(spheres)
      .map(([s, l]) => `${s} ${l}`)
      .join(', ');
  }
  
  return String(spheres);
}
export function RoteDetail({ rote, onBack }: RoteDetailProps) {
  return (
    <div className="animate-fade-in-up flex flex-col gap-6 p-6 md:p-10">
      {/* Back button */}
      <button
        type="button"
        onClick={onBack}
        className="self-start font-serif px-5 py-3 bg-secondary text-secondary-foreground border-2 border-primary rounded-sm
          font-semibold text-sm uppercase tracking-[0.15em] cursor-pointer
          transition-all duration-300
          shadow-[0_4px_8px_rgba(0,0,0,0.15)]
          hover:bg-background hover:border-ring hover:-translate-y-0.5
          active:translate-y-0 flex items-center gap-3"
      >
        <span aria-hidden="true">{'\u2190'}</span>
        Return to Library
      </button>

      <div className="flex gap-2">
  <span className="font-semibold">Spheres:</span>
  <SphereDisplay spheres={formatSpheres(rote.spheres)} />
      </div>
      {/* Detail card */}
      <div
        className="bg-background border-4 border-double border-primary rounded-lg p-8 md:p-12
          shadow-[inset_0_0_60px_rgba(139,71,38,0.08)]"
      >
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start gap-6 mb-8 pb-8 border-b-[3px] border-double border-primary">
          <h2 className="font-serif text-3xl md:text-4xl font-black text-primary uppercase tracking-wide leading-tight
            drop-shadow-[2px_2px_0_rgba(201,169,97,0.3)]">
            {rote.name}
          </h2>
          <span className="inline-flex items-center gap-3 px-5 py-3 bg-primary/15 border-[3px] border-primary rounded-md text-primary font-mono text-lg font-bold italic shrink-0">
            <span className="text-accent text-xl">{getTraditionSymbol(rote.tradition)}</span>
            {rote.tradition}
          </span>
        </div>

        {/* Description */}
        <div
          className="bg-background/30 border-2 border-primary border-l-[5px] border-l-ring rounded-md p-6 md:p-8 mb-8
            shadow-[inset_2px_2px_10px_rgba(0,0,0,0.05)]"
        >
          <p className="font-mono text-foreground text-lg leading-loose text-justify">
            {rote.description}
          </p>
        </div>

        {/* Spheres */}
        <div className="bg-accent/10 border-[3px] border-double border-primary rounded-md p-6 md:p-8 mb-8
          shadow-[inset_0_0_30px_rgba(139,71,38,0.05)]">
          <h3 className="font-serif text-xl font-bold text-primary uppercase tracking-[0.15em] mb-6">
            Required Spheres
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {Object.entries(rote.spheres).map(([sphere, level]) => {
              const isTechno = isTechnocracySphere(sphere)
              return (
                <div
                  key={sphere}
                  className={`rounded-md px-5 py-4 flex flex-col gap-2
                    ${isTechno
                      ? "bg-foreground/5 border-2 border-foreground/40 border-l-[5px] border-l-foreground/60"
                      : "bg-background border-2 border-primary border-l-[5px] border-l-accent"
                    }`}
                >
                  <span className={`font-serif text-sm font-bold uppercase tracking-widest ${isTechno ? "text-foreground" : "text-primary"}`}>
                    {sphere}
                  </span>
                  <SphereDots level={level} size="lg" />
                  <span className="font-mono text-xs text-muted-foreground italic">
                    Level {level}
                  </span>
                </div>
              )
            })}
          </div>
        </div>

        {/* Level badge */}
        <div
          className="font-serif bg-primary/20 border-2 border-primary border-l-[5px] border-l-accent rounded-md
            px-6 py-4 mb-8 text-xl font-bold text-primary uppercase tracking-[0.15em]"
        >
          Rank: {rote.level}
        </div>

        {/* Page reference */}
        {rote.pageRef && (
          <div className="font-mono text-muted-foreground text-sm italic pt-6 border-t-2 border-primary">
            Source: {rote.pageRef}
          </div>
        )}
      </div>
    </div>
  )
}
