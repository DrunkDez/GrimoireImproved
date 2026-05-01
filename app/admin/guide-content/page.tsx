"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import { Toaster } from "@/components/ui/toaster"
import { cn } from "@/lib/utils"
import { Save, RotateCcw, Check, AlertCircle, ChevronDown, ChevronUp, Eye, EyeOff } from "lucide-react"

// ── Step definitions — mirrors the wizard exactly ─────────────────────────────
interface StepDef {
  id:       string
  label:    string
  category: string
  hint:     string
  default:  string
}

const STEP_DEFS: StepDef[] = [
  {
    id:       "name-concept-tradition",
    label:    "Name, Concept & Tradition",
    category: "Identity",
    hint:     "Explains what a Name, Concept, and Tradition are. Shown at the top of step 1.",
    default:  "<p><strong>Name:</strong> Choose something evocative — gothic, mythic, or grounded in your character's cultural background.</p><p><strong>Concept:</strong> A two-to-four-word phrase that captures your character's essence.</p><p><strong>Tradition:</strong> The magical order or paradigm your character belongs to.</p>",
  },
  {
    id:       "nature-demeanor",
    label:    "Nature & Demeanor",
    category: "Identity",
    hint:     "Explains the difference between Nature (inner self) and Demeanor (public face).",
    default:  "<p><strong>Nature</strong> is your character's true inner self — what drives them when no one is watching.</p><p><strong>Demeanor</strong> is the mask they show the world. The tension between the two is where roleplaying lives.</p>",
  },
  {
    id:       "essence-chronicle",
    label:    "Essence, Chronicle & Sect",
    category: "Identity",
    hint:     "Explains Essence (magical soul), Chronicle (campaign name), and Sect (sub-faction).",
    default:  "<p><strong>Essence</strong> is your character's fundamental magical nature — the cosmic principle they most embody.</p><p><strong>Chronicle</strong> is the name of your campaign or story.</p><p><strong>Sect</strong> (optional) is a sub-group within your Tradition.</p>",
  },
  {
    id:       "concept-refinement",
    label:    "Refine Your Concept",
    category: "Identity",
    hint:     "Optional step — encourages the player to tie their identity choices together into a richer concept.",
    default:  "<p>Now that you have a Tradition, Nature, and Essence, you might want to refine your character concept into a fuller sentence.</p>",
  },
  {
    id:       "attribute-priority",
    label:    "Attribute Priority",
    category: "Attributes",
    hint:     "Explains Physical / Social / Mental priority assignment and what the dot counts mean.",
    default:  "<p><strong>Attributes</strong> are your character's innate capabilities.</p><p>Assign <strong>Primary (7 dots)</strong>, <strong>Secondary (5 dots)</strong>, and <strong>Tertiary (3 dots)</strong> to the three categories.</p>",
  },
  {
    id:       "attribute-assign",
    label:    "Assign Attributes",
    category: "Attributes",
    hint:     "Brief reminder that each attribute starts at 1 and to click dots to spend the budget.",
    default:  "<p>Click dots to assign attribute points. Each attribute already starts at 1 — dots above the first cost from your priority budget.</p>",
  },
  {
    id:       "ability-priority",
    label:    "Ability Priority",
    category: "Abilities",
    hint:     "Explains Talents / Skills / Knowledges and the 13 / 9 / 5 dot counts.",
    default:  "<p><strong>Abilities</strong> represent learned skills and knowledge — Talents (innate), Skills (trained), and Knowledges (academic).</p><p>Assign <strong>Primary (13 dots)</strong>, <strong>Secondary (9 dots)</strong>, and <strong>Tertiary (5 dots)</strong>.</p>",
  },
  {
    id:       "ability-assign",
    label:    "Assign Abilities",
    category: "Abilities",
    hint:     "Reminder about the 3-dot cap and how clicking works.",
    default:  "<p>Assign your ability dots. Each ability can have at most <strong>3 dots</strong> during creation. Click a filled dot to clear it back to 0.</p>",
  },
  {
    id:       "arete-start",
    label:    "Starting Arete",
    category: "Magic",
    hint:     "Explains Arete, the freebie point costs for starting above 1, and encourages Storyteller consultation.",
    default:  "<p><strong>Arete</strong> is your character's magical enlightenment — it determines how many dice you roll for magic.</p><p>Most starting characters begin at Arete 1. Higher Arete costs freebie points — discuss with your Storyteller first.</p>",
  },
  {
    id:       "spheres",
    label:    "Spheres of Magic",
    category: "Magic",
    hint:     "Explains Affinity Sphere, the 6-dot budget, and the 3-dot cap per sphere.",
    default:  "<p><strong>Spheres</strong> are the nine domains of magical reality. Your Tradition grants you an <strong>Affinity Sphere</strong> — you must take at least 1 dot in it.</p><p>You have <strong>6 total dots</strong> across all Spheres (max 3 per Sphere).</p>",
  },
  {
    id:       "backgrounds",
    label:    "Backgrounds",
    category: "Finishing",
    hint:     "Explains Backgrounds as resources/allies and the 7-dot budget.",
    default:  "<p><strong>Backgrounds</strong> represent your character's resources, allies, and supernatural advantages outside raw power.</p><p>You have <strong>7 dots</strong> to spend across any backgrounds (max 5 per background).</p>",
  },
  {
    id:       "freebies",
    label:    "Freebie Points",
    category: "Finishing",
    hint:     "Explains the 15-point pool, the flaw bonus, and the Arete adjustment note.",
    default:  "<p><strong>Freebie Points</strong> let you further customize your character. You start with 15, plus up to 7 from Flaws.</p>",
  },
]

const CATEGORIES = ["Identity", "Attributes", "Abilities", "Magic", "Finishing"]

// ── Types ─────────────────────────────────────────────────────────────────────
interface StepState {
  current:    string   // text currently in the textarea
  saved:      string   // last value confirmed saved to DB
  fromCMS:    boolean  // true = loaded from DB, false = showing default
  isDirty:    boolean  // current !== saved
  isSaving:   boolean
}

// ── Admin page ────────────────────────────────────────────────────────────────
export default function GuideContentAdminPage() {
  const { toast } = useToast()
  const router = useRouter()

  const [steps, setSteps] = useState<Record<string, StepState>>(() => {
    const init: Record<string, StepState> = {}
    STEP_DEFS.forEach(s => {
      init[s.id] = { current: s.default, saved: s.default, fromCMS: false, isDirty: false, isSaving: false }
    })
    return init
  })

  const [expandedStep, setExpandedStep] = useState<string | null>("name-concept-tradition")
  const [previewStep,  setPreviewStep]  = useState<string | null>(null)
  const [isLoading,    setIsLoading]    = useState(true)
  const [isSavingAll,  setIsSavingAll]  = useState(false)

  // ── Load existing CMS values on mount ────────────────────────────────────
  useEffect(() => {
    const load = async () => {
      setIsLoading(true)
      try {
        const results = await Promise.all(
          STEP_DEFS.map(async s => {
            const res = await fetch(`/api/guide-content?step=${s.id}`)
            if (res.status === 204) return { id: s.id, text: null }
            if (!res.ok)            return { id: s.id, text: null }
            const data = await res.json()
            return { id: s.id, text: data.guidanceText as string | null }
          })
        )
        setSteps(prev => {
          const next = { ...prev }
          results.forEach(({ id, text }) => {
            if (text) {
              next[id] = { current: text, saved: text, fromCMS: true, isDirty: false, isSaving: false }
            }
          })
          return next
        })
      } catch (e) {
        toast({ title: "Load failed", description: "Could not fetch saved content.", variant: "destructive" })
      } finally {
        setIsLoading(false)
      }
    }
    load()
  }, [])

  // ── Per-step helpers ──────────────────────────────────────────────────────
  const updateText = (id: string, text: string) => {
    setSteps(prev => ({
      ...prev,
      [id]: { ...prev[id], current: text, isDirty: text !== prev[id].saved },
    }))
  }

  const resetToDefault = (id: string) => {
    const def = STEP_DEFS.find(s => s.id === id)!.default
    setSteps(prev => ({
      ...prev,
      [id]: { ...prev[id], current: def, isDirty: def !== prev[id].saved },
    }))
  }

  const clearOverride = async (id: string) => {
    try {
      await fetch(`/api/guide-content?step=${id}`, { method: "DELETE" })
      const def = STEP_DEFS.find(s => s.id === id)!.default
      setSteps(prev => ({
        ...prev,
        [id]: { current: def, saved: def, fromCMS: false, isDirty: false, isSaving: false },
      }))
      toast({ title: "Override cleared", description: `${id} now uses the hardcoded default.` })
    } catch {
      toast({ title: "Error", description: "Could not clear override.", variant: "destructive" })
    }
  }

  // ── Save one step ─────────────────────────────────────────────────────────
  const saveStep = async (id: string) => {
    setSteps(prev => ({ ...prev, [id]: { ...prev[id], isSaving: true } }))
    try {
      const res = await fetch("/api/guide-content", {
        method:  "PUT",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ updates: [{ stepId: id, guidanceText: steps[id].current }] }),
      })
      if (!res.ok) throw new Error()
      setSteps(prev => ({
        ...prev,
        [id]: { ...prev[id], saved: prev[id].current, fromCMS: true, isDirty: false, isSaving: false },
      }))
      const label = STEP_DEFS.find(s => s.id === id)!.label
      toast({ title: "Saved", description: `"${label}" updated successfully.` })
    } catch {
      setSteps(prev => ({ ...prev, [id]: { ...prev[id], isSaving: false } }))
      toast({ title: "Save failed", description: "Could not save this step.", variant: "destructive" })
    }
  }

  // ── Save all dirty steps at once ──────────────────────────────────────────
  const saveAll = async () => {
    const dirty = STEP_DEFS.filter(s => steps[s.id].isDirty)
    if (dirty.length === 0) {
      toast({ title: "Nothing to save", description: "No unsaved changes." })
      return
    }
    setIsSavingAll(true)
    try {
      const res = await fetch("/api/guide-content", {
        method:  "PUT",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({
          updates: dirty.map(s => ({ stepId: s.id, guidanceText: steps[s.id].current })),
        }),
      })
      if (!res.ok) throw new Error()
      setSteps(prev => {
        const next = { ...prev }
        dirty.forEach(s => {
          next[s.id] = { ...next[s.id], saved: next[s.id].current, fromCMS: true, isDirty: false }
        })
        return next
      })
      toast({ title: `${dirty.length} step${dirty.length > 1 ? "s" : ""} saved`, description: "All changes published to the wizard." })
    } catch {
      toast({ title: "Save failed", description: "Could not save changes.", variant: "destructive" })
    } finally {
      setIsSavingAll(false)
    }
  }

  const dirtyCount = STEP_DEFS.filter(s => steps[s.id]?.isDirty).length

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <>
      <div className="min-h-screen relative z-[1] py-5 px-3 md:py-7 md:px-4 grimoire-bg">
        <div
          className="max-w-[860px] mx-auto bg-background rounded-xl overflow-hidden relative"
          style={{
            border:     "1px solid hsl(var(--primary)/0.32)",
            boxShadow:  "inset 0 1px 0 hsl(var(--primary)/0.12), 0 20px 60px hsl(var(--background)/0.8), 0 4px 24px rgba(0,0,0,0.45)",
          }}
        >
          {/* Corner accents */}
          {["-top-[6px] -left-[6px]", "-top-[6px] -right-[6px]"].map((pos, i) => (
            <div key={i} className={`absolute ${pos} text-primary z-10 text-xl pointer-events-none`}
              style={{filter:"drop-shadow(0 0 6px hsl(var(--primary)/0.6))"}} aria-hidden="true">◈</div>
          ))}

          {/* Top hairline */}
          <div className="h-px w-full pointer-events-none" aria-hidden="true"
            style={{background:"linear-gradient(90deg,hsl(var(--accent)/0.55) 0%,hsl(var(--primary)/0.5) 15%,hsl(var(--primary)/0.15) 55%,transparent 100%)"}}/>

          {/* Header */}
          <div className="px-8 pt-8 pb-6" style={{borderBottom:"1px solid hsl(var(--border)/0.5)"}}>
            <div className="mb-1">
              <span className="font-serif text-[9px] uppercase tracking-[0.3em]" style={{color:"hsl(var(--primary)/0.5)"}}>
                Admin Panel
              </span>
            </div>
            <h1 className="font-serif font-black uppercase text-primary"
              style={{fontSize:"clamp(1.3rem,4vw,2rem)",letterSpacing:"0.1em"}}>
              Character Guide Content
            </h1>
            <p className="font-serif italic mt-1 text-muted-foreground text-sm">
              Override the guidance text shown in each step of the creation wizard.
              Leave a step empty to use the hardcoded default.
            </p>

            {/* Toolbar */}
            <div className="flex items-center gap-3 mt-5">
              {/* Save all */}
              <button
                onClick={saveAll}
                disabled={dirtyCount === 0 || isSavingAll}
                className="group relative overflow-hidden inline-flex items-center gap-2 rounded-full px-5 py-2 font-serif text-[10px] uppercase tracking-[0.16em] font-bold transition-all duration-200 hover:-translate-y-px disabled:opacity-40 disabled:cursor-not-allowed"
                style={{
                  background: "linear-gradient(135deg,hsl(var(--accent)),hsl(var(--accent)/0.82))",
                  color:      "hsl(var(--accent-foreground))",
                  border:     "none",
                  boxShadow:  dirtyCount > 0 ? "0 0 0 1px hsl(var(--accent)/0.38),0 4px 14px hsl(var(--accent)/0.25)" : "none",
                }}
              >
                <span className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                  style={{background:"linear-gradient(105deg,transparent 25%,rgba(255,255,255,0.16) 50%,transparent 75%)"}}/>
                <Save className="relative w-3.5 h-3.5"/>
                <span className="relative">
                  {isSavingAll ? "Saving…" : dirtyCount > 0 ? `Save ${dirtyCount} change${dirtyCount > 1 ? "s" : ""}` : "All saved"}
                </span>
              </button>

              {/* Dirty indicator */}
              {dirtyCount > 0 && (
                <span className="font-mono text-[10px]" style={{color:"hsl(var(--accent))"}}>
                  ● {dirtyCount} unsaved
                </span>
              )}

              {isLoading && (
                <span className="font-mono text-[10px] text-muted-foreground animate-pulse">
                  Loading saved content…
                </span>
              )}
            </div>
          </div>

          {/* Step list grouped by category */}
          <div className="px-8 py-6 space-y-8">
            {CATEGORIES.map(cat => {
              const catSteps = STEP_DEFS.filter(s => s.category === cat)
              return (
                <div key={cat}>
                  {/* Category header */}
                  <div className="flex items-center gap-3 mb-3">
                    <span className="font-serif font-bold uppercase text-primary"
                      style={{fontSize:"0.7rem",letterSpacing:"0.2em"}}>
                      {cat}
                    </span>
                    <div className="flex-1 h-px" style={{background:"linear-gradient(90deg,hsl(var(--primary)/0.3),transparent)"}}/>
                  </div>

                  <div className="space-y-2">
                    {catSteps.map(stepDef => {
                      const s         = steps[stepDef.id]
                      const isOpen    = expandedStep === stepDef.id
                      const isPrev    = previewStep  === stepDef.id
                      const hasOverride = s?.fromCMS
                      const dirty     = s?.isDirty

                      return (
                        <div
                          key={stepDef.id}
                          className="rounded-lg overflow-hidden transition-all"
                          style={{
                            border:     `1px solid hsl(var(--${dirty ? "accent" : hasOverride ? "primary" : "border"})/${dirty ? "0.5" : hasOverride ? "0.3" : "0.4"})`,
                            background: dirty
                              ? "hsl(var(--accent)/0.04)"
                              : hasOverride
                              ? "hsl(var(--primary)/0.03)"
                              : "hsl(var(--card))",
                          }}
                        >
                          {/* Step row header */}
                          <div
                            className="flex items-center gap-3 px-4 py-3 cursor-pointer select-none"
                            onClick={() => setExpandedStep(isOpen ? null : stepDef.id)}
                          >
                            {/* Status dot */}
                            <div
                              className="w-2 h-2 rounded-full shrink-0"
                              style={{
                                background: dirty
                                  ? "hsl(var(--accent))"
                                  : hasOverride
                                  ? "hsl(var(--primary))"
                                  : "hsl(var(--border)/0.6)",
                                boxShadow: dirty
                                  ? "0 0 6px hsl(var(--accent)/0.6)"
                                  : hasOverride
                                  ? "0 0 4px hsl(var(--primary)/0.4)"
                                  : "none",
                              }}
                            />

                            {/* Label */}
                            <div className="flex-1 min-w-0">
                              <span className="font-serif text-sm font-semibold text-foreground">{stepDef.label}</span>
                              <span className="ml-2 font-mono text-[9px] text-muted-foreground">{stepDef.id}</span>
                              {hasOverride && !dirty && (
                                <span className="ml-2 font-serif text-[9px] px-1.5 py-0.5 rounded-full"
                                  style={{background:"hsl(var(--primary)/0.1)",color:"hsl(var(--primary))"}}>
                                  CMS override active
                                </span>
                              )}
                              {dirty && (
                                <span className="ml-2 font-serif text-[9px] px-1.5 py-0.5 rounded-full"
                                  style={{background:"hsl(var(--accent)/0.15)",color:"hsl(var(--accent))"}}>
                                  Unsaved
                                </span>
                              )}
                            </div>

                            {/* Actions */}
                            <div className="flex items-center gap-1 shrink-0" onClick={e=>e.stopPropagation()}>
                              {/* Preview toggle */}
                              <button
                                title={isPrev ? "Hide preview" : "Preview HTML"}
                                onClick={() => setPreviewStep(isPrev ? null : stepDef.id)}
                                className="p-1.5 rounded transition-all hover:bg-primary/[0.08]"
                                style={{color:"hsl(var(--primary)/0.5)"}}>
                                {isPrev ? <EyeOff className="w-3.5 h-3.5"/> : <Eye className="w-3.5 h-3.5"/>}
                              </button>
                              {/* Save this step */}
                              {dirty && (
                                <button
                                  title="Save this step"
                                  onClick={() => saveStep(stepDef.id)}
                                  disabled={s?.isSaving}
                                  className="p-1.5 rounded transition-all hover:bg-accent/[0.1] disabled:opacity-40"
                                  style={{color:"hsl(var(--accent))"}}>
                                  {s?.isSaving ? <span className="text-[9px]">…</span> : <Check className="w-3.5 h-3.5"/>}
                                </button>
                              )}
                              {/* Clear override */}
                              {hasOverride && !dirty && (
                                <button
                                  title="Clear override — revert to default"
                                  onClick={() => clearOverride(stepDef.id)}
                                  className="p-1.5 rounded transition-all hover:bg-destructive/[0.08]"
                                  style={{color:"hsl(var(--foreground)/0.3)"}}>
                                  <RotateCcw className="w-3.5 h-3.5"/>
                                </button>
                              )}
                              {/* Expand chevron */}
                              <div className="text-muted-foreground ml-1">
                                {isOpen ? <ChevronUp className="w-4 h-4"/> : <ChevronDown className="w-4 h-4"/>}
                              </div>
                            </div>
                          </div>

                          {/* Expanded edit area */}
                          {isOpen && (
                            <div className="px-4 pb-4 space-y-3"
                              style={{borderTop:"1px solid hsl(var(--border)/0.3)"}}>

                              {/* Hint */}
                              <p className="font-serif text-xs italic text-muted-foreground pt-3">
                                {stepDef.hint}
                              </p>

                              {/* Textarea */}
                              <div className="relative">
                                <textarea
                                  value={s?.current ?? ""}
                                  onChange={e => updateText(stepDef.id, e.target.value)}
                                  rows={6}
                                  placeholder="Enter HTML guidance text, or leave empty to use the hardcoded default…"
                                  className="w-full rounded-md px-3 py-2.5 text-sm font-mono text-foreground resize-y outline-none transition-all duration-200"
                                  style={{
                                    background:     "hsl(var(--background)/0.6)",
                                    border:         "1px solid hsl(var(--border)/0.7)",
                                    lineHeight:     1.6,
                                    minHeight:      "120px",
                                  }}
                                  onFocus={e=>{e.currentTarget.style.borderColor="hsl(var(--primary)/0.55)";e.currentTarget.style.boxShadow="0 0 0 2px hsl(var(--primary)/0.12)"}}
                                  onBlur={e=>{e.currentTarget.style.borderColor="hsl(var(--border)/0.7)";e.currentTarget.style.boxShadow="none"}}
                                />
                              </div>

                              {/* HTML preview */}
                              {isPrev && s?.current && (
                                <div
                                  className="rounded-md px-4 py-3 text-sm font-serif leading-relaxed space-y-1.5"
                                  style={{
                                    background:  "hsl(var(--card))",
                                    border:      "1px solid hsl(var(--border)/0.5)",
                                    borderLeft:  "3px solid hsl(var(--primary)/0.5)",
                                    color:       "hsl(var(--foreground)/0.85)",
                                  }}
                                  dangerouslySetInnerHTML={{ __html: s.current }}
                                />
                              )}

                              {/* Footer row */}
                              <div className="flex items-center justify-between gap-3 pt-1">
                                <button
                                  onClick={() => resetToDefault(stepDef.id)}
                                  className="font-serif text-[10px] uppercase tracking-[0.12em] text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
                                >
                                  <RotateCcw className="w-3 h-3"/> Reset to default
                                </button>
                                <div className="flex items-center gap-2">
                                  {hasOverride && !dirty && (
                                    <button
                                      onClick={() => clearOverride(stepDef.id)}
                                      className="font-serif text-[10px] uppercase tracking-[0.12em] transition-colors flex items-center gap-1"
                                      style={{color:"hsl(var(--foreground)/0.4)"}}
                                    >
                                      <RotateCcw className="w-3 h-3"/> Clear DB override
                                    </button>
                                  )}
                                  <button
                                    onClick={() => saveStep(stepDef.id)}
                                    disabled={!dirty || s?.isSaving}
                                    className="inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 font-serif text-[10px] uppercase tracking-[0.12em] font-bold transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                                    style={{
                                      background: dirty
                                        ? "linear-gradient(135deg,hsl(var(--accent)),hsl(var(--accent)/0.82))"
                                        : "hsl(var(--border)/0.4)",
                                      color: dirty ? "hsl(var(--accent-foreground))" : "hsl(var(--muted-foreground))",
                                      border: "none",
                                      boxShadow: dirty ? "0 0 0 1px hsl(var(--accent)/0.3)" : "none",
                                    }}
                                  >
                                    <Save className="w-3 h-3"/>
                                    {s?.isSaving ? "Saving…" : "Save step"}
                                  </button>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      )
                    })}
                  </div>
                </div>
              )
            })}
          </div>

          {/* Bottom accent */}
          <div className="h-[2px] w-full pointer-events-none" aria-hidden="true"
            style={{background:"linear-gradient(90deg,hsl(var(--accent)/0.65) 0%,hsl(var(--primary)/0.5) 12%,hsl(var(--primary)/0.2) 50%,transparent 100%)"}}/>
        </div>
      </div>
      <Toaster/>
    </>
  )
}
