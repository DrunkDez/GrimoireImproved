"use client"

import { useState } from "react"
import { useSession } from "next-auth/react"
import { SPHERES } from "@/lib/mage-data"
import { SphereDotsInteractive } from "./sphere-dots"
import { RichTextEditor } from "@/components/ui/rich-text-editor"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"

const WONDER_CATEGORIES = [
  'Artifact/Invention',
  'Charm/Gadget',
  'Talisman/Device',
  'Fetish',
  'Grimoire/Principia',
  'Primer',
  'Periapt/Matrix'
]

interface AddWonderPanelProps {
  onClose: () => void
  onWonderAdded: () => void  // to refresh the list
}

export function AddWonderPanel({ onClose, onWonderAdded }: AddWonderPanelProps) {
  const { data: session } = useSession()
  const [name, setName] = useState("")
  const [category, setCategory] = useState<typeof WONDER_CATEGORIES[number] | "">("")
  const [description, setDescription] = useState("")
  const [backgroundCost, setBackgroundCost] = useState("")
  const [arete, setArete] = useState<number | "">("")
  const [quintessence, setQuintessence] = useState<number | "">("")
  const [spheres, setSpheres] = useState<Record<string, number>>({})
  const [pageRef, setPageRef] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")

  const handleSphereChange = (sphere: string, value: number) => {
    setSpheres((prev) => {
      const next = { ...prev }
      if (value === 0) delete next[sphere]
      else next[sphere] = value
      return next
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!session) {
      setError("You must be logged in to add a wonder.")
      return
    }

    if (!name.trim() || !category || !description.trim()) {
      setError("Name, category, and description are required.")
      return
    }

    // Validate arete if provided
    const areteNum = arete === "" ? null : Number(arete)
    if (areteNum !== null && (isNaN(areteNum) || areteNum < 1 || areteNum > 10)) {
      setError("Arete must be a number between 1 and 10.")
      return
    }

    // Validate quintessence if provided
    const quintNum = quintessence === "" ? null : Number(quintessence)
    if (quintNum !== null && (isNaN(quintNum) || quintNum < 0)) {
      setError("Quintessence must be a non‑negative number.")
      return
    }

    // Validate sphere levels (already handled by interactive, but double-check)
    for (const [sphere, level] of Object.entries(spheres)) {
      if (level < 1 || level > 5) {
        setError(`${sphere} level must be between 1 and 5.`)
        return
      }
    }

    setIsSubmitting(true)

    try {
      const response = await fetch("/api/wonders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          category,
          description: description.trim(),
          backgroundCost: backgroundCost.trim() || null,
          arete: areteNum,
          quintessence: quintNum,
          spheres: Object.keys(spheres).length ? spheres : null,
          pageRef: pageRef.trim() || null,
        }),
      })

      if (!response.ok) {
        const err = await response.json()
        throw new Error(err.error || "Failed to create wonder")
      }

      // Success
      onWonderAdded()
      onClose()
    } catch (err: any) {
      setError(err.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-card border-4 border-primary rounded-lg shadow-2xl">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors"
          aria-label="Close"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="p-6 md:p-8">
          <h2 className="font-serif text-2xl font-bold text-primary mb-6 border-b-2 border-primary/30 pb-2">
            ✨ Inscribe a New Wonder
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name */}
            <div>
              <label className="block font-serif font-semibold text-sm text-primary mb-1">
                Wonder Name *
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2 bg-background border-2 border-primary/40 rounded focus:border-ring focus:outline-none"
                required
              />
            </div>

            {/* Category */}
            <div>
              <label className="block font-serif font-semibold text-sm text-primary mb-1">
                Category *
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="w-full px-4 py-2 bg-background border-2 border-primary/40 rounded focus:border-ring focus:outline-none"
                required
              >
                <option value="">Select a category</option>
                {WONDER_CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            {/* Description */}
            <div>
              <label className="block font-serif font-semibold text-sm text-primary mb-1">
                Description *
              </label>
              <RichTextEditor
                id="wonder-description"
                value={description}
                onChange={setDescription}
                rows={6}
                placeholder="Describe the wonder's appearance, function, and effects..."
                required
              />
            </div>

            {/* Background Cost */}
            <div>
              <label className="block font-serif font-semibold text-sm text-primary mb-1">
                Background Cost (e.g., "3 dots")
              </label>
              <input
                type="text"
                value={backgroundCost}
                onChange={(e) => setBackgroundCost(e.target.value)}
                placeholder="e.g., 3 dots"
                className="w-full px-4 py-2 bg-background border-2 border-primary/40 rounded focus:border-ring focus:outline-none"
              />
            </div>

            {/* Arete & Quintessence side by side */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block font-serif font-semibold text-sm text-primary mb-1">
                  Arete (1-10)
                </label>
                <input
                  type="number"
                  min="1"
                  max="10"
                  step="1"
                  value={arete}
                  onChange={(e) => setArete(e.target.value === "" ? "" : Number(e.target.value))}
                  className="w-full px-4 py-2 bg-background border-2 border-primary/40 rounded focus:border-ring focus:outline-none"
                />
              </div>
              <div>
                <label className="block font-serif font-semibold text-sm text-primary mb-1">
                  Quintessence (non‑negative)
                </label>
                <input
                  type="number"
                  min="0"
                  step="1"
                  value={quintessence}
                  onChange={(e) => setQuintessence(e.target.value === "" ? "" : Number(e.target.value))}
                  className="w-full px-4 py-2 bg-background border-2 border-primary/40 rounded focus:border-ring focus:outline-none"
                />
              </div>
            </div>

            {/* Spheres */}
            <div>
              <label className="block font-serif font-semibold text-sm text-primary mb-3">
                Required Spheres (minimum levels)
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {SPHERES.map((sphere) => (
                  <div key={sphere} className="flex items-center justify-between bg-background/80 border border-primary/30 rounded p-2">
                    <span className="font-mono text-sm">{sphere}</span>
                    <SphereDotsInteractive
                      value={spheres[sphere] || 0}
                      onChange={(val) => handleSphereChange(sphere, val)}
                      label={sphere}
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Page Reference */}
            <div>
              <label className="block font-serif font-semibold text-sm text-primary mb-1">
                Page Reference (optional)
              </label>
              <input
                type="text"
                value={pageRef}
                onChange={(e) => setPageRef(e.target.value)}
                placeholder="e.g., M20 Core, p. 515"
                className="w-full px-4 py-2 bg-background border-2 border-primary/40 rounded focus:border-ring focus:outline-none"
              />
            </div>

            {error && (
              <div className="bg-destructive/20 border border-destructive text-destructive p-3 rounded">
                {error}
              </div>
            )}

            <div className="flex justify-end gap-4 pt-4">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Creating..." : "Create Wonder"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
