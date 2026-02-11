"use client"

import React from "react"

import { useState } from "react"
import type { Rote } from "@/lib/mage-data"
import { SPHERES, TECHNOCRACY_SPHERES, TRADITIONS, TECHNOCRACY_CONVENTIONS } from "@/lib/mage-data"
import { SphereDotsInteractive, SphereDots } from "./sphere-dots"

const ROTE_LEVELS = ["Initiate", "Apprentice", "Disciple", "Adept", "Master"]

interface AddRotePanelProps {
  onAdd: (rote: Rote) => void
}

export function AddRotePanel({ onAdd }: AddRotePanelProps) {
  const [name, setName] = useState("")
  const [tradition, setTradition] = useState("")
  const [description, setDescription] = useState("")
  const [spheres, setSpheres] = useState<Record<string, number>>({})
  const [level, setLevel] = useState("")
  const [pageRef, setPageRef] = useState("")
  const [submitted, setSubmitted] = useState(false)

  const handleSphereChange = (sphere: string, value: number) => {
    setSpheres((prev) => {
      const next = { ...prev }
      if (value === 0) {
        delete next[sphere]
      } else {
        next[sphere] = value
      }
      return next
    })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim() || !tradition || !description.trim() || !level || Object.keys(spheres).length === 0) {
      return
    }

    const rote: Rote = {
      id: Date.now().toString(),
      name: name.trim(),
      tradition,
      description: description.trim(),
      spheres,
      level,
      pageRef: pageRef.trim() || undefined,
    }

    onAdd(rote)
    setName("")
    setTradition("")
    setDescription("")
    setSpheres({})
    setLevel("")
    setPageRef("")
    setSubmitted(true)
    setTimeout(() => setSubmitted(false), 3000)
  }

  const selectedSpheres = Object.entries(spheres).filter(([_, v]) => v > 0)

  return (
    <div className="animate-fade-in-up flex flex-col gap-8 p-6 md:p-10">
      {/* Instructions */}
      <div
        className="relative bg-card border-[3px] border-primary border-l-[6px] border-l-ring rounded-md p-6 md:p-8
          shadow-[inset_0_0_40px_rgba(139,71,38,0.05)]"
      >
        <div className="absolute top-4 right-4 text-4xl text-accent opacity-20" aria-hidden="true">
          {'\u2724'}
        </div>
        <h3 className="font-serif text-lg font-bold text-primary uppercase tracking-widest mb-4 flex items-center gap-3">
          <span className="text-ring" aria-hidden="true">{'\u2726'}</span>
          Instructions for Inscription
        </h3>
        <ul className="flex flex-col gap-3">
          {[
            "Provide the <strong>name</strong> of your Rote as it is known among the Awakened.",
            "Select the <strong>Tradition</strong> from which this Rote originates.",
            "Describe the <strong>focus and effect</strong> of the Rote in detail.",
            "Indicate all <strong>Spheres</strong> required and their minimum levels.",
            "Optionally include a <strong>page reference</strong> for verification.",
          ].map((item, i) => (
            <li key={i} className="font-sans text-foreground text-base leading-relaxed pl-8 relative">
              <span className="absolute left-0 text-ring font-bold text-lg" aria-hidden="true">{'\u27E1'}</span>
              <span dangerouslySetInnerHTML={{ __html: item }} />
            </li>
          ))}
        </ul>
      </div>

      {/* Success message */}
      {submitted && (
        <div className="bg-primary/10 border-2 border-accent rounded-md p-4 text-center font-serif text-primary font-semibold uppercase tracking-widest animate-fade-in-up">
          {'\u2726'} Rote Successfully Inscribed {'\u2726'}
        </div>
      )}

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="bg-card border-[3px] border-primary rounded-md p-6 md:p-8
          shadow-[inset_0_0_40px_rgba(139,71,38,0.05)] max-w-5xl mx-auto w-full"
      >
        <h3 className="font-serif text-xl font-bold text-primary uppercase tracking-[0.15em] mb-8 pb-3 border-b-[3px] border-double border-primary flex items-center gap-3">
          <span className="text-ring text-lg" aria-hidden="true">{'\u270E'}</span>
          Inscribe New Rote
          <span className="ml-auto text-accent text-lg" aria-hidden="true">{'\u25C8'}</span>
        </h3>

        <div className="flex flex-col gap-6">
          {/* Name */}
          <div className="flex flex-col gap-2">
            <label htmlFor="rote-name" className="font-serif text-sm font-semibold text-primary uppercase tracking-widest flex items-center gap-2">
              <span className="text-ring" aria-hidden="true">{'\u2726'}</span>
              Rote Name
            </label>
            <input
              id="rote-name"
              type="text"
              required
              placeholder="e.g., The Flickering Ward"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 bg-background/60 border-2 border-primary rounded-sm
                text-foreground font-mono text-base placeholder:text-foreground/40 placeholder:italic
                transition-all duration-300 shadow-[inset_2px_2px_5px_rgba(0,0,0,0.1)]
                focus:outline-none focus:border-ring focus:bg-background/80
                focus:shadow-[inset_2px_2px_5px_rgba(0,0,0,0.1),0_0_10px_rgba(107,45,107,0.3)]"
            />
          </div>

          {/* Tradition */}
          <div className="flex flex-col gap-2">
            <label htmlFor="rote-tradition" className="font-serif text-sm font-semibold text-primary uppercase tracking-widest flex items-center gap-2">
              <span className="text-ring" aria-hidden="true">{'\u2726'}</span>
              Tradition
            </label>
            <select
              id="rote-tradition"
              required
              value={tradition}
              onChange={(e) => setTradition(e.target.value)}
              className="w-full px-4 py-3 bg-background/60 border-2 border-primary rounded-sm
                text-foreground font-mono text-base
                transition-all duration-300 shadow-[inset_2px_2px_5px_rgba(0,0,0,0.1)]
                focus:outline-none focus:border-ring focus:bg-background/80
                focus:shadow-[inset_2px_2px_5px_rgba(0,0,0,0.1),0_0_10px_rgba(107,45,107,0.3)]
                appearance-none cursor-pointer pr-10"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath fill='%234a1a4a' d='M6 8L0 0h12z'/%3E%3C/svg%3E")`,
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'right 1rem center',
              }}
            >
              <option value="">Select a Tradition or Convention...</option>
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

          {/* Description */}
          <div className="flex flex-col gap-2">
            <label htmlFor="rote-desc" className="font-serif text-sm font-semibold text-primary uppercase tracking-widest flex items-center gap-2">
              <span className="text-ring" aria-hidden="true">{'\u2726'}</span>
              Description
            </label>
            <textarea
              id="rote-desc"
              required
              rows={5}
              placeholder="Describe the focus, effect, and practice of this Rote..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-3 bg-background/60 border-2 border-primary rounded-sm
                text-foreground font-mono text-base placeholder:text-foreground/40 placeholder:italic
                transition-all duration-300 shadow-[inset_2px_2px_5px_rgba(0,0,0,0.1)]
                focus:outline-none focus:border-ring focus:bg-background/80
                focus:shadow-[inset_2px_2px_5px_rgba(0,0,0,0.1),0_0_10px_rgba(107,45,107,0.3)]
                resize-y min-h-[140px] leading-relaxed"
            />
          </div>

          {/* Spheres */}
          <div className="flex flex-col gap-3">
            <span className="font-serif text-sm font-semibold text-primary uppercase tracking-widest flex items-center gap-2">
              <span className="text-ring" aria-hidden="true">{'\u2726'}</span>
              Required Spheres
            </span>
            
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3">
              {/* Tradition Spheres */}
              {SPHERES.map((sphere) => (
                <div
                  key={sphere}
                  className="flex items-center justify-between gap-2 bg-background border-2 border-primary rounded-sm px-3 py-3 min-h-[60px]
                    transition-all duration-300 hover:border-accent"
                >
                  <span className="font-serif text-[0.65rem] font-bold text-primary uppercase tracking-wide leading-snug flex-1 break-words">
                    {sphere}
                  </span>
                  <div className="shrink-0">
                    <SphereDotsInteractive
                      value={spheres[sphere] || 0}
                      onChange={(level) => handleSphereChange(sphere, level)}
                      label={sphere}
                    />
                  </div>
                </div>
              ))}
              
              {/* Technocracy Spheres - same grid, different styling */}
              {TECHNOCRACY_SPHERES.map((sphere) => (
                <div
                  key={sphere}
                  className="flex items-center justify-between gap-2 bg-foreground/5 border-2 border-foreground/40 rounded-sm px-3 py-3 min-h-[60px]
                    transition-all duration-300 hover:border-foreground/70"
                >
                  <span className="font-serif text-[0.65rem] font-bold text-foreground uppercase tracking-wide leading-snug flex-1 break-words">
                    {sphere}
                  </span>
                  <div className="shrink-0">
                    <SphereDotsInteractive
                      value={spheres[sphere] || 0}
                      onChange={(level) => handleSphereChange(sphere, level)}
                      label={sphere}
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Selected spheres display */}
            {selectedSpheres.length > 0 && (
              <div className="bg-primary/5 border-2 border-primary rounded-sm p-4 mt-2">
                <h4 className="font-serif text-xs font-bold text-primary uppercase tracking-widest mb-2">
                  Selected Spheres
                </h4>
                <div className="flex flex-wrap gap-2">
                  {selectedSpheres.map(([sphere, lvl]) => (
                    <div
                      key={sphere}
                      className="flex items-center gap-2 px-2.5 py-1.5 bg-primary/10 border border-primary rounded-sm text-primary text-xs font-semibold uppercase font-serif"
                    >
                      <span>{sphere}</span>
                      <SphereDots level={lvl} size="sm" />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Level */}
          <div className="flex flex-col gap-2">
            <label htmlFor="rote-level" className="font-serif text-sm font-semibold text-primary uppercase tracking-widest flex items-center gap-2">
              <span className="text-ring" aria-hidden="true">{'\u2726'}</span>
              Rote Level
            </label>
            <select
              id="rote-level"
              required
              value={level}
              onChange={(e) => setLevel(e.target.value)}
              className="w-full px-4 py-3 bg-background/60 border-2 border-primary rounded-sm
                text-foreground font-mono text-base
                transition-all duration-300 shadow-[inset_2px_2px_5px_rgba(0,0,0,0.1)]
                focus:outline-none focus:border-ring focus:bg-background/80
                focus:shadow-[inset_2px_2px_5px_rgba(0,0,0,0.1),0_0_10px_rgba(107,45,107,0.3)]
                appearance-none cursor-pointer pr-10"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath fill='%234a1a4a' d='M6 8L0 0h12z'/%3E%3C/svg%3E")`,
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'right 1rem center',
              }}
            >
              <option value="">Select a level...</option>
              {ROTE_LEVELS.map((l) => (
                <option key={l} value={l}>{l}</option>
              ))}
            </select>
          </div>

          {/* Page reference */}
          <div className="flex flex-col gap-2">
            <label htmlFor="rote-ref" className="font-serif text-sm font-semibold text-primary uppercase tracking-widest flex items-center gap-2">
              <span className="text-ring" aria-hidden="true">{'\u2726'}</span>
              Page Reference
              <span className="font-mono text-xs italic text-muted-foreground normal-case tracking-normal">(optional)</span>
            </label>
            <input
              id="rote-ref"
              type="text"
              placeholder="e.g., Book of Shadows, p.142"
              value={pageRef}
              onChange={(e) => setPageRef(e.target.value)}
              className="w-full px-4 py-3 bg-background/60 border-2 border-primary rounded-sm
                text-foreground font-mono text-base placeholder:text-foreground/40 placeholder:italic
                transition-all duration-300 shadow-[inset_2px_2px_5px_rgba(0,0,0,0.1)]
                focus:outline-none focus:border-ring focus:bg-background/80
                focus:shadow-[inset_2px_2px_5px_rgba(0,0,0,0.1),0_0_10px_rgba(107,45,107,0.3)]"
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="font-serif px-6 py-4 bg-primary text-primary-foreground border-2 border-accent rounded-sm
              font-semibold text-sm uppercase tracking-[0.15em] cursor-pointer
              transition-all duration-300 mt-4
              shadow-[0_4px_8px_rgba(0,0,0,0.3),inset_0_1px_0_rgba(255,255,255,0.1)]
              hover:bg-muted-foreground hover:-translate-y-0.5
              hover:shadow-[0_6px_12px_rgba(0,0,0,0.4),inset_0_1px_0_rgba(255,255,255,0.2),0_0_20px_rgba(201,169,97,0.3)]
              active:translate-y-0 flex items-center justify-center gap-3 w-full"
          >
            <span aria-hidden="true">{'\u27D0'}</span>
            Inscribe This Rote
            <span aria-hidden="true">{'\u27D0'}</span>
          </button>
        </div>
      </form>
    </div>
  )
}
  )
}
