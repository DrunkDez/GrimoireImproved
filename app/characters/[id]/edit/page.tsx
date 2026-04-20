"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter, useParams } from "next/navigation"
import { ArrowLeft, Save, Loader2, Plus, X } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { Toaster } from "@/components/ui/toaster"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Dialog, DialogContent, DialogDescription,
  DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog"

// ── Types ─────────────────────────────────────────────────────────────────────
interface CharacterData {
  id: string; name: string; player?: string; chronicle?: string
  nature?: string; demeanor?: string; essence?: string; faction: string
  sect?: string; concept?: string; attributes?: any; abilities?: any
  spheres?: any; backgrounds?: any; specialties?: any
  arete?: number; willpower?: number; freebieDots?: any
  merits?: any[]; flaws?: any[]; avatar?: string
}

// ── Label formatters ──────────────────────────────────────────────────────────
const ABILITY_LABELS: Record<string, string> = {
  alertness:"Alertness", art:"Art", athletics:"Athletics", awareness:"Awareness",
  brawl:"Brawl", empathy:"Empathy", expression:"Expression", intimidation:"Intimidation",
  leadership:"Leadership", streetwise:"Streetwise", subterfuge:"Subterfuge",
  crafts:"Crafts", drive:"Drive", etiquette:"Etiquette", firearms:"Firearms",
  martialArts:"Martial Arts", meditation:"Meditation", melee:"Melee",
  research:"Research", stealth:"Stealth", survival:"Survival", technology:"Technology",
  academics:"Academics", computer:"Computer", cosmology:"Cosmology", enigmas:"Enigmas",
  esoterica:"Esoterica", investigation:"Investigation", law:"Law", medicine:"Medicine",
  occult:"Occult", politics:"Politics", science:"Science",
}
const SPHERE_LABELS: Record<string, string> = {
  correspondence:"Correspondence", entropy:"Entropy", forces:"Forces",
  life:"Life", matter:"Matter", mind:"Mind", prime:"Prime", spirit:"Spirit", time:"Time",
  data:"Data", dimensionalScience:"Dimensional Science", primalUtility:"Primal Utility",
  Correspondence:"Correspondence", Entropy:"Entropy", Forces:"Forces",
  Life:"Life", Matter:"Matter", Mind:"Mind", Prime:"Prime", Spirit:"Spirit", Time:"Time",
}
const BACKGROUND_LABELS: Record<string, string> = {
  allies:"Allies", alternate_identity:"Alternate Identity", arcane:"Arcane",
  avatar:"Avatar", certification:"Certification", chantry:"Chantry", contacts:"Contacts",
  destiny:"Destiny", dream:"Dream", enhancement:"Enhancement", familiar:"Familiar",
  influence:"Influence", library:"Library", mentor:"Mentor", node:"Node",
  patron:"Patron", rank:"Rank", resources:"Resources", requisitions:"Requisitions",
  retainers:"Retainers", sanctum:"Sanctum", totem:"Totem", wonder:"Wonder",
}
function formatLabel(key: string, map: Record<string, string>): string {
  if (map[key]) return map[key]
  return key.replace(/([A-Z])/g,' $1').replace(/_/g,' ').trim().replace(/\b\w/g, c => c.toUpperCase())
}

// ── Tabs ──────────────────────────────────────────────────────────────────────
type TabId = "basic"|"attributes"|"abilities"|"spheres"|"backgrounds"|"merits"
const TABS: {id:TabId; label:string; symbol:string}[] = [
  {id:"basic",       label:"Basic",          symbol:"✦"},
  {id:"attributes",  label:"Attributes",     symbol:"◈"},
  {id:"abilities",   label:"Abilities",      symbol:"✧"},
  {id:"spheres",     label:"Spheres",        symbol:"⚙"},
  {id:"backgrounds", label:"Backgrounds",    symbol:"✦"},
  {id:"merits",      label:"Merits & Flaws", symbol:"✎"},
]

// ── GrimoireTabBar ────────────────────────────────────────────────────────────
function GrimoireTabBar({activeTab, onTabChange}: {activeTab:TabId; onTabChange:(t:TabId)=>void}) {
  return (
    <nav role="tablist" aria-label="Character sections" className="flex overflow-x-auto mb-6"
      style={{borderBottom:"1px solid hsl(var(--border)/0.5)",background:"hsl(var(--card)/0.5)",borderRadius:"8px 8px 0 0",padding:"0 4px",gap:"2px",scrollbarWidth:"none",msOverflowStyle:"none"} as React.CSSProperties}>
      {TABS.map(tab => {
        const on = activeTab===tab.id
        return (
          <button key={tab.id} role="tab" aria-selected={on} onClick={()=>onTabChange(tab.id)}
            className="relative inline-flex items-center gap-1.5 px-4 py-3 font-serif text-[10px] sm:text-[11px] uppercase tracking-[0.12em] font-semibold whitespace-nowrap shrink-0 cursor-pointer select-none transition-all duration-200 border-none rounded-none bg-transparent outline-none"
            style={{color: on?"hsl(var(--primary))":"hsl(var(--foreground)/0.5)"}}
            onMouseEnter={e=>{if(!on){(e.currentTarget as HTMLElement).style.color="hsl(var(--primary)/0.8)";(e.currentTarget as HTMLElement).style.background="hsl(var(--primary)/0.05)"}}}
            onMouseLeave={e=>{if(!on){(e.currentTarget as HTMLElement).style.color="hsl(var(--foreground)/0.5)";(e.currentTarget as HTMLElement).style.background="transparent"}}}>
            <span aria-hidden="true" style={{fontSize:"11px",lineHeight:1,width:"11px",height:"11px",display:"inline-block",flexShrink:0,color:on?"hsl(var(--primary))":"hsl(var(--foreground)/0.35)",fontVariantEmoji:"text"} as React.CSSProperties}>{tab.symbol}&#xFE0E;</span>
            <span className="hidden sm:inline">{tab.label}</span>
            <span className="sm:hidden text-[9px]">{tab.label.split(" ")[0]}</span>
            {on&&<span className="absolute bottom-0 left-1 right-1" aria-hidden="true" style={{height:"2px",borderRadius:"2px 2px 0 0",background:"linear-gradient(90deg,hsl(var(--primary)/0.5),hsl(var(--primary)),hsl(var(--primary)/0.5))",boxShadow:"0 0 8px hsl(var(--primary)/0.55), 0 0 2px hsl(var(--accent)/0.4)"}}/>}
          </button>
        )
      })}
    </nav>
  )
}

// ── TabPanel ──────────────────────────────────────────────────────────────────
function TabPanel({children}: {children: React.ReactNode}) {
  return <div style={{animation:"grimoire-emerge 0.5s cubic-bezier(0.16,1,0.3,1) forwards"}}>{children}</div>
}

// ── SectionHeader ─────────────────────────────────────────────────────────────
function SectionHeader({children}: {children: React.ReactNode}) {
  return (
    <div className="mb-4 pb-2" style={{borderBottom:"1px solid hsl(var(--border)/0.4)"}}>
      <h3 className="font-serif font-bold uppercase text-primary" style={{fontSize:"0.7rem",letterSpacing:"0.2em"}}>{children}</h3>
    </div>
  )
}

// ── GrimoireCard ──────────────────────────────────────────────────────────────
function GrimoireCard({children, className=""}: {children:React.ReactNode; className?:string}) {
  return (
    <div className={`relative rounded-lg overflow-hidden ${className}`}
      style={{background:"hsl(var(--card))",border:"1px solid hsl(var(--border)/0.55)",boxShadow:"inset 0 1px 0 hsl(var(--primary)/0.06), 0 2px 12px rgba(0,0,0,0.15)"}}>
      <div className="absolute top-0 left-0 right-0" aria-hidden="true" style={{height:"2px",background:"linear-gradient(90deg,transparent,hsl(var(--primary)/0.55),transparent)"}}/>
      {children}
    </div>
  )
}

// ── AttributePanel — a single attribute column as its own glass panel ─────────
function AttributePanel({title, children}: {title: string; children: React.ReactNode}) {
  return (
    <div className="rounded-lg p-4" style={{
      background:"linear-gradient(135deg, hsl(var(--card)) 0%, hsl(var(--card)/0.7) 100%)",
      border:"1px solid hsl(var(--border)/0.5)",
      boxShadow:"inset 0 1px 0 hsl(var(--primary)/0.08)",
    }}>
      {/* Gradient top-border */}
      <div className="h-[2px] -mx-4 -mt-4 mb-4 rounded-t-lg" aria-hidden="true"
        style={{background:"linear-gradient(90deg,transparent,hsl(var(--primary)/0.5),transparent)"}}/>
      <SectionHeader>{title}</SectionHeader>
      {children}
    </div>
  )
}

function GrimoireCardHeader({children, className=""}: {children:React.ReactNode; className?:string}) {
  return <div className={`px-5 py-4 ${className}`} style={{borderBottom:"1px solid hsl(var(--border)/0.4)"}}>{children}</div>
}
function GrimoireCardTitle({children}: {children:React.ReactNode}) {
  return <h2 className="font-serif font-bold uppercase text-primary" style={{fontSize:"clamp(0.75rem,1.5vw,0.9rem)",letterSpacing:"0.14em"}}>{children}</h2>
}
function GrimoireCardContent({children, className=""}: {children:React.ReactNode; className?:string}) {
  return <div className={`px-5 py-4 ${className}`}>{children}</div>
}

// ── GrimoireLabel / Input / Textarea ──────────────────────────────────────────
function GrimoireLabel({children, className=""}: {children:React.ReactNode; className?:string}) {
  return <label className={`block font-serif text-[10px] uppercase tracking-[0.15em] mb-1.5 ${className}`} style={{color:"hsl(var(--primary)/0.7)"}}>{children}</label>
}
function GrimoireInput({value, onChange, placeholder=""}: {value:string; onChange:(e:React.ChangeEvent<HTMLInputElement>)=>void; placeholder?:string}) {
  return (
    <input value={value} onChange={onChange} placeholder={placeholder}
      className="w-full rounded-md px-3 py-2 text-sm font-sans text-foreground transition-all duration-200 outline-none"
      style={{background:"hsl(var(--background)/0.6)",border:"1px solid hsl(var(--border)/0.7)",backdropFilter:"blur(4px)"}}
      onFocus={e=>{e.currentTarget.style.borderColor="hsl(var(--primary)/0.55)";e.currentTarget.style.boxShadow="0 0 0 2px hsl(var(--primary)/0.12)"}}
      onBlur={e=>{e.currentTarget.style.borderColor="hsl(var(--border)/0.7)";e.currentTarget.style.boxShadow="none"}}/>
  )
}
function GrimoireTextarea({value, onChange, rows=3, placeholder=""}: {value:string; onChange:(e:React.ChangeEvent<HTMLTextAreaElement>)=>void; rows?:number; placeholder?:string}) {
  return (
    <textarea value={value} onChange={onChange} rows={rows} placeholder={placeholder}
      className="w-full rounded-md px-3 py-2 text-sm font-sans text-foreground transition-all duration-200 outline-none resize-none"
      style={{background:"hsl(var(--background)/0.6)",border:"1px solid hsl(var(--border)/0.7)",backdropFilter:"blur(4px)"}}
      onFocus={e=>{e.currentTarget.style.borderColor="hsl(var(--primary)/0.55)";e.currentTarget.style.boxShadow="0 0 0 2px hsl(var(--primary)/0.12)"}}
      onBlur={e=>{e.currentTarget.style.borderColor="hsl(var(--border)/0.7)";e.currentTarget.style.boxShadow="none"}}/>
  )
}

// ── DotSelector ───────────────────────────────────────────────────────────────
function DotSelector({label, value, max=5, onChange, disabled=false}: {label:string; value:number; max?:number; onChange:(v:number)=>void; disabled?:boolean}) {
  return (
    <div className="flex items-center justify-between py-1.5">
      <span className="text-sm font-serif" style={{color:"hsl(var(--foreground)/0.85)"}}>{label}</span>
      <div className="flex gap-1">
        {[...Array(max)].map((_,i)=>{
          const f=i<value
          return <button key={i} type="button" disabled={disabled}
            onClick={()=>!disabled&&onChange(i+1===value?0:i+1)}
            style={{width:"18px",height:"18px",borderRadius:"50%",border:`2px solid hsl(var(--primary)/${f?"0.9":"0.35"})`,backgroundColor:f?"hsl(var(--primary))":"transparent",opacity:disabled?0.45:1,cursor:disabled?"not-allowed":"pointer",boxShadow:f?"0 0 6px hsl(var(--primary)/0.45),inset 0 0 3px rgba(255,255,255,0.15)":"none",flexShrink:0,transition:"all 0.15s"}}
            onMouseEnter={e=>{if(!disabled)(e.currentTarget as HTMLElement).style.transform="scale(1.18)"}}
            onMouseLeave={e=>{(e.currentTarget as HTMLElement).style.transform="scale(1)"}}
            aria-label={`Set ${label} to ${i+1}`}/>
        })}
      </div>
    </div>
  )
}

// ── StatBlock ─────────────────────────────────────────────────────────────────
function StatBlock({label, value, max, onChange}: {label:string; value:number; max:number; onChange:(v:number)=>void}) {
  return (
    <div className="rounded-lg p-4" style={{background:"hsl(var(--card))",border:"1px solid hsl(var(--border)/0.55)",boxShadow:"inset 0 1px 0 hsl(var(--primary)/0.06)"}}>
      <div className="flex items-baseline justify-between mb-3">
        <GrimoireLabel>{label}</GrimoireLabel>
        <span className="font-serif font-black text-primary" style={{fontSize:"1.4rem",textShadow:"0 0 16px hsl(var(--primary)/0.3)"}}>{value}</span>
      </div>
      <div className="h-px mb-3" aria-hidden="true" style={{background:"linear-gradient(90deg,hsl(var(--primary)/0.5),transparent)"}}/>
      <div className="flex flex-wrap gap-1">
        {[...Array(max)].map((_,i)=>{
          const f=i<value
          return <button key={i} type="button" onClick={()=>onChange(i+1===value?0:i+1)}
            style={{width:"20px",height:"20px",borderRadius:"50%",border:`2px solid hsl(var(--primary)/${f?"0.9":"0.3"})`,backgroundColor:f?"hsl(var(--primary))":"transparent",cursor:"pointer",boxShadow:f?"0 0 8px hsl(var(--primary)/0.5),inset 0 0 3px rgba(255,255,255,0.2)":"none",transition:"all 0.15s",flexShrink:0}}
            onMouseEnter={e=>{(e.currentTarget as HTMLElement).style.transform="scale(1.18)"}}
            onMouseLeave={e=>{(e.currentTarget as HTMLElement).style.transform="scale(1)"}}
            aria-label={`Set ${label} to ${i+1}`}/>
        })}
      </div>
    </div>
  )
}

// ── EmptyState ────────────────────────────────────────────────────────────────
function EmptyState({message}: {message:string}) {
  return (
    <div className="flex flex-col items-center justify-center py-10 gap-3 opacity-50">
      <span className="text-2xl text-primary" aria-hidden="true">◈</span>
      <p className="font-serif text-xs uppercase tracking-[0.18em] text-muted-foreground">{message}</p>
    </div>
  )
}

// ── SphereRow ─────────────────────────────────────────────────────────────────
const SPHERE_DESCRIPTIONS: Record<string, string> = {
  Correspondence:"Space, distance, and location", Entropy:"Chaos, fate, and decay",
  Forces:"Energy, fire, electricity, gravity", Life:"Living creatures and biology",
  Matter:"Non-living physical substances", Mind:"Thought, consciousness, and psionics",
  Prime:"The Quintessence — raw magical energy", Spirit:"The Umbra and spirit world",
  Time:"Temporal perception and manipulation",
  Data:"Information and digital systems", "Dimensional Science":"Non-Euclidean space",
  "Primal Utility":"Quintessence for the Technocracy",
}
function SphereRow({sphereKey, value, onChange}: {sphereKey:string; value:number; onChange:(v:number)=>void}) {
  const name = formatLabel(sphereKey, SPHERE_LABELS)
  const desc = SPHERE_DESCRIPTIONS[name]||""
  return (
    <div className="rounded-lg px-4 py-3 transition-all duration-200 hover:bg-primary/[0.04]"
      style={{border:"1px solid hsl(var(--border)/0.35)"}}>
      <div className="flex items-center justify-between">
        <div>
          <p className="font-serif text-sm font-semibold text-foreground">{name}</p>
          {desc&&<p className="font-serif text-[10px] text-muted-foreground mt-0.5 italic">{desc}</p>}
        </div>
        <div className="flex gap-1 ml-4 shrink-0">
          {[...Array(5)].map((_,i)=>{
            const f=i<value
            return <button key={i} type="button" onClick={()=>onChange(i+1===value?0:i+1)}
              style={{width:"20px",height:"20px",borderRadius:"50%",border:`2px solid hsl(var(--primary)/${f?"0.9":"0.3"})`,backgroundColor:f?"hsl(var(--primary))":"transparent",cursor:"pointer",boxShadow:f?"0 0 8px hsl(var(--primary)/0.5)":"none",transition:"all 0.15s",flexShrink:0}}
              onMouseEnter={e=>{(e.currentTarget as HTMLElement).style.transform="scale(1.18)"}}
              onMouseLeave={e=>{(e.currentTarget as HTMLElement).style.transform="scale(1)"}}
              aria-label={`Set ${name} to ${i+1}`}/>
          })}
        </div>
      </div>
    </div>
  )
}

// ── GrimoireDialog — themed modal replacing default shadcn white ──────────────
function GrimoireDialog({open, onOpenChange, title, description, children}: {
  open: boolean; onOpenChange: (o:boolean)=>void
  title: string; description: string; children: React.ReactNode
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="max-w-2xl max-h-[80vh]"
        style={{
          background:      "hsl(var(--card))",
          border:          "1px solid hsl(var(--primary)/0.35)",
          boxShadow:       "0 0 0 1px hsl(var(--primary)/0.12), 0 24px 48px rgba(0,0,0,0.6), inset 0 1px 0 hsl(var(--primary)/0.1)",
          borderRadius:    "12px",
        }}
      >
        {/* Gradient top accent */}
        <div className="absolute top-0 left-0 right-0 h-[2px] rounded-t-xl pointer-events-none" aria-hidden="true"
          style={{background:"linear-gradient(90deg, hsl(var(--accent)/0.55), hsl(var(--primary)/0.5) 30%, transparent 75%)"}}/>
        <DialogHeader className="pb-3" style={{borderBottom:"1px solid hsl(var(--border)/0.4)"}}>
          <DialogTitle className="font-serif uppercase text-primary" style={{fontSize:"0.9rem",letterSpacing:"0.14em"}}>{title}</DialogTitle>
          <DialogDescription className="font-serif italic text-xs text-muted-foreground mt-1">{description}</DialogDescription>
        </DialogHeader>
        {children}
      </DialogContent>
    </Dialog>
  )
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default function EditCharacterPage() {
  const params = useParams()
  const characterId = params?.id as string
  const {status} = useSession()
  const router = useRouter()
  const {toast} = useToast()
  const [character, setCharacter] = useState<CharacterData|null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [activeTab, setActiveTab] = useState<TabId>("basic")
  const [meritsList, setMeritsList] = useState<any[]>([])
  const [flawsList, setFlawsList] = useState<any[]>([])
  const [meritsOpen, setMeritsOpen] = useState(false)
  const [flawsOpen, setFlawsOpen] = useState(false)

  useEffect(()=>{if(status==="unauthenticated")router.push("/auth/signin")},[status,router])
  useEffect(()=>{if(status==="authenticated"&&characterId){fetchCharacter();fetchMeritsAndFlaws()}},[status,characterId])

  const fetchCharacter = async()=>{
    if(!characterId)return
    try{const r=await fetch(`/api/characters/${characterId}`);if(r.ok)setCharacter(await r.json());else router.push("/dashboard")}
    catch(e){console.error(e)}finally{setIsLoading(false)}
  }
  const fetchMeritsAndFlaws = async()=>{
    try{const r=await fetch("/api/merits");if(r.ok){const d=await r.json();setMeritsList(d.filter((m:any)=>m.type==="merit"));setFlawsList(d.filter((m:any)=>m.type==="flaw"))}}
    catch(e){console.error(e)}
  }

  const upChar  = (f:string,v:any)=>{if(!character)return;setCharacter({...character,[f]:v})}
  const upAttr  = (f:string,v:number)=>{if(!character)return;setCharacter({...character,attributes:{...character.attributes,[f]:v}})}
  const upAbil  = (f:string,v:number)=>{if(!character)return;setCharacter({...character,abilities:{...character.abilities,[f]:v}})}
  const upSph   = (f:string,v:number)=>{if(!character)return;setCharacter({...character,spheres:{...character.spheres,[f]:v}})}
  const upBg    = (f:string,v:number)=>{if(!character)return;setCharacter({...character,backgrounds:{...character.backgrounds,[f]:v}})}

  const addMerit=(merit:any)=>{
    if(!character)return
    const cur=character.merits||[]
    if(cur.some(m=>m.id===merit.id)){toast({title:"Already Added",description:"This merit is already selected",variant:"destructive"});return}
    setCharacter({...character,merits:[...cur,{id:merit.id,name:merit.name,cost:Math.abs(merit.cost)}]})
    setMeritsOpen(false)
  }
  const rmMerit=(i:number)=>{if(!character)return;const n=[...(character.merits||[])];n.splice(i,1);setCharacter({...character,merits:n})}
  const addFlaw=(flaw:any)=>{
    if(!character)return
    const cost=Math.abs(flaw.cost),cur=character.flaws||[],total=cur.reduce((s,f)=>s+f.cost,0)
    if(cur.some(f=>f.id===flaw.id)){toast({title:"Already Added",description:"This flaw is already selected",variant:"destructive"});return}
    if(total+cost>7){toast({title:"Maximum Flaws",description:"You cannot take more than 7 points in flaws",variant:"destructive"});return}
    setCharacter({...character,flaws:[...cur,{id:flaw.id,name:flaw.name,cost}]})
    setFlawsOpen(false)
  }
  const rmFlaw=(i:number)=>{if(!character)return;const n=[...(character.flaws||[])];n.splice(i,1);setCharacter({...character,flaws:n})}

  const save=async()=>{
    if(!character||!characterId)return;setIsSaving(true)
    try{
      const r=await fetch(`/api/characters/${characterId}`,{method:"PUT",headers:{"Content-Type":"application/json"},body:JSON.stringify(character)})
      if(r.ok){toast({title:"Character Saved",description:"Your character has been updated"});router.push(`/characters/${characterId}`)}
      else{const e=await r.json();toast({title:"Error",description:e.error||"Failed to save character",variant:"destructive"})}
    }catch(e){toast({title:"Error",description:"Failed to save character",variant:"destructive"})}
    finally{setIsSaving(false)}
  }

  if(status==="loading"||isLoading)return(
    <div className="min-h-screen grimoire-bg flex items-center justify-center gap-3">
      <span className="text-accent text-4xl" style={{animation:"spin 3s linear infinite",display:"inline-block"}} aria-hidden="true">⚙&#xFE0E;</span>
      <p className="font-serif text-[11px] uppercase tracking-[0.28em] text-muted-foreground">Consulting the Tapestry…</p>
    </div>
  )
  if(!character)return null

  const ghostChip="inline-flex items-center gap-1 px-3 py-1.5 rounded-md font-serif text-[10px] uppercase tracking-[0.12em] font-semibold transition-all duration-200 hover:bg-primary/[0.08] border border-transparent hover:border-primary/[0.18]"

  return(
    <>
      <div className="min-h-screen relative z-[1] py-5 px-3 md:py-7 md:px-4 grimoire-bg">
        <div className="max-w-[1400px] mx-auto bg-background rounded-xl overflow-hidden relative"
          style={{border:"1px solid hsl(var(--primary)/0.32)",boxShadow:"inset 0 1px 0 hsl(var(--primary)/0.12), 0 20px 60px hsl(var(--background)/0.8), 0 4px 24px rgba(0,0,0,0.45)"}}>

          {["-top-[6px] -left-[6px]","-top-[6px] -right-[6px]"].map((pos,i)=>(
            <div key={i} className={`absolute ${pos} text-primary z-10 text-xl pointer-events-none`} style={{filter:"drop-shadow(0 0 6px hsl(var(--primary)/0.6))"}} aria-hidden="true">◈</div>
          ))}
          <div className="h-px w-full pointer-events-none" aria-hidden="true" style={{background:"linear-gradient(90deg,hsl(var(--accent)/0.55) 0%,hsl(var(--primary)/0.5) 15%,hsl(var(--primary)/0.15) 55%,transparent 100%)"}}/>

          {/* ── Header strip — now includes faction badge ── */}
          <div className="flex items-center justify-between gap-3 px-5 sm:px-7 md:px-10 py-4 sm:py-5"
            style={{borderBottom:"1px solid hsl(var(--border)/0.5)"}}>

            <button type="button" onClick={()=>router.push(`/characters/${characterId}`)} className={ghostChip} style={{color:"hsl(var(--foreground)/0.65)"}}>
              <ArrowLeft className="w-3.5 h-3.5"/>Back
            </button>

            {/* Centre: title + tradition badge */}
            <div className="hidden sm:flex flex-col items-center gap-1 min-w-0">
              <h1 className="font-serif font-black uppercase text-primary" style={{fontSize:"clamp(0.85rem,2vw,1.1rem)",letterSpacing:"0.1em"}}>
                Edit:&nbsp;<span style={{color:"hsl(var(--accent))"}}>{character.name}</span>
              </h1>
              {character.faction && (
                <span className="font-serif text-[9px] uppercase tracking-[0.2em] px-2 py-0.5 rounded-full"
                  style={{color:"hsl(var(--primary)/0.7)",background:"hsl(var(--primary)/0.08)",border:"1px solid hsl(var(--primary)/0.18)"}}>
                  {character.faction}
                </span>
              )}
            </div>

            {/* Save */}
            <button type="button" onClick={save} disabled={isSaving}
              className="group relative overflow-hidden inline-flex items-center gap-2 rounded-full px-4 sm:px-5 py-2 sm:py-2.5 font-serif text-[10px] sm:text-[11px] uppercase tracking-[0.16em] font-bold transition-all duration-200 hover:-translate-y-px active:translate-y-0 disabled:opacity-60 disabled:cursor-not-allowed"
              style={{background:"linear-gradient(135deg,hsl(var(--accent)) 0%,hsl(var(--accent)/0.82) 100%)",color:"hsl(var(--accent-foreground))",border:"none",boxShadow:"0 0 0 1px hsl(var(--accent)/0.38), 0 4px 18px hsl(var(--accent)/0.25)"}}>
              <span className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" aria-hidden="true" style={{background:"linear-gradient(105deg,transparent 25%,rgba(255,255,255,0.16) 50%,transparent 75%)"}}/>
              {isSaving?<Loader2 className="relative w-3.5 h-3.5 animate-spin"/>:<Save className="relative w-3.5 h-3.5"/>}
              <span className="relative">{isSaving?"Saving…":"Save Changes"}</span>
            </button>
          </div>

          {/* Mobile title */}
          <div className="sm:hidden px-5 pt-3 pb-1 flex items-center gap-2 flex-wrap">
            <h1 className="font-serif font-black uppercase text-primary" style={{fontSize:"1rem",letterSpacing:"0.1em"}}>
              Edit: <span style={{color:"hsl(var(--accent))"}}>{character.name}</span>
            </h1>
            {character.faction&&<span className="font-serif text-[9px] uppercase tracking-[0.2em] px-2 py-0.5 rounded-full"
              style={{color:"hsl(var(--primary)/0.7)",background:"hsl(var(--primary)/0.08)",border:"1px solid hsl(var(--primary)/0.18)"}}>
              {character.faction}
            </span>}
          </div>

          {/* Content */}
          <div className="p-4 sm:p-6 md:p-8" style={{backgroundImage:`url("data:image/svg+xml,%3Csvg width='40' height='40' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M40 0L0 0 0 40' fill='none' stroke='%237b5ea7' stroke-width='0.35' opacity='0.06'/%3E%3C/svg%3E")`,minHeight:"600px"}}>
            <GrimoireTabBar activeTab={activeTab} onTabChange={setActiveTab}/>

            {/* Basic */}
            {activeTab==="basic"&&<TabPanel>
              <div className="space-y-5">
                <GrimoireCard>
                  <GrimoireCardHeader><GrimoireCardTitle>Basic Information</GrimoireCardTitle></GrimoireCardHeader>
                  <GrimoireCardContent>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div><GrimoireLabel>Name</GrimoireLabel><GrimoireInput value={character.name} onChange={e=>upChar("name",e.target.value)}/></div>
                      <div><GrimoireLabel>Player</GrimoireLabel><GrimoireInput value={character.player||""} onChange={e=>upChar("player",e.target.value)}/></div>
                      <div><GrimoireLabel>Chronicle</GrimoireLabel><GrimoireInput value={character.chronicle||""} onChange={e=>upChar("chronicle",e.target.value)}/></div>
                      <div><GrimoireLabel>Faction / Tradition</GrimoireLabel><GrimoireInput value={character.faction} onChange={e=>upChar("faction",e.target.value)}/></div>
                      <div><GrimoireLabel>Nature</GrimoireLabel><GrimoireInput value={character.nature||""} onChange={e=>upChar("nature",e.target.value)}/></div>
                      <div><GrimoireLabel>Demeanor</GrimoireLabel><GrimoireInput value={character.demeanor||""} onChange={e=>upChar("demeanor",e.target.value)}/></div>
                      <div><GrimoireLabel>Essence</GrimoireLabel><GrimoireInput value={character.essence||""} onChange={e=>upChar("essence",e.target.value)}/></div>
                      <div><GrimoireLabel>Sect</GrimoireLabel><GrimoireInput value={character.sect||""} onChange={e=>upChar("sect",e.target.value)}/></div>
                      <div className="col-span-full"><GrimoireLabel>Concept</GrimoireLabel><GrimoireTextarea value={character.concept||""} onChange={e=>upChar("concept",e.target.value)} rows={2}/></div>
                      <div className="col-span-full"><GrimoireLabel>Avatar Description</GrimoireLabel><GrimoireTextarea value={character.avatar||""} onChange={e=>upChar("avatar",e.target.value)} rows={3}/></div>
                    </div>
                  </GrimoireCardContent>
                </GrimoireCard>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <StatBlock label="Arete"     value={character.arete||1}     max={10} onChange={v=>upChar("arete",v)}/>
                  <StatBlock label="Willpower" value={character.willpower||5} max={10} onChange={v=>upChar("willpower",v)}/>
                </div>
              </div>
            </TabPanel>}

            {/* Attributes — each category as its own panel card */}
            {activeTab==="attributes"&&<TabPanel>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <AttributePanel title="Physical">
                  {character.attributes&&<>
                    <DotSelector label="Strength"  value={character.attributes.strength ||1} onChange={v=>upAttr("strength",v)}/>
                    <DotSelector label="Dexterity" value={character.attributes.dexterity||1} onChange={v=>upAttr("dexterity",v)}/>
                    <DotSelector label="Stamina"   value={character.attributes.stamina  ||1} onChange={v=>upAttr("stamina",v)}/>
                  </>}
                </AttributePanel>
                <AttributePanel title="Social">
                  {character.attributes&&<>
                    <DotSelector label="Charisma"     value={character.attributes.charisma    ||1} onChange={v=>upAttr("charisma",v)}/>
                    <DotSelector label="Manipulation" value={character.attributes.manipulation||1} onChange={v=>upAttr("manipulation",v)}/>
                    <DotSelector label="Appearance"   value={character.attributes.appearance  ||1} onChange={v=>upAttr("appearance",v)}/>
                  </>}
                </AttributePanel>
                <AttributePanel title="Mental">
                  {character.attributes&&<>
                    <DotSelector label="Perception"   value={character.attributes.perception  ||1} onChange={v=>upAttr("perception",v)}/>
                    <DotSelector label="Intelligence" value={character.attributes.intelligence||1} onChange={v=>upAttr("intelligence",v)}/>
                    <DotSelector label="Wits"         value={character.attributes.wits        ||1} onChange={v=>upAttr("wits",v)}/>
                  </>}
                </AttributePanel>
              </div>
            </TabPanel>}

            {/* Abilities */}
            {activeTab==="abilities"&&<TabPanel>
              <GrimoireCard>
                <GrimoireCardHeader>
                  <GrimoireCardTitle>Abilities</GrimoireCardTitle>
                  <p className="text-xs text-muted-foreground mt-1 font-serif italic">Click a filled dot to clear it</p>
                </GrimoireCardHeader>
                <GrimoireCardContent>
                  <div className="grid grid-cols-3 gap-6 max-h-[600px] overflow-y-auto">
                    <div><SectionHeader>Talents</SectionHeader>{character.abilities&&['alertness','art','athletics','awareness','brawl','empathy','expression','intimidation','leadership','streetwise','subterfuge'].map(a=><DotSelector key={a} label={formatLabel(a,ABILITY_LABELS)} value={character.abilities[a]||0} max={5} onChange={v=>upAbil(a,v)}/>)}</div>
                    <div><SectionHeader>Skills</SectionHeader>{character.abilities&&['crafts','drive','etiquette','firearms','martialArts','meditation','melee','research','stealth','survival','technology'].map(a=><DotSelector key={a} label={formatLabel(a,ABILITY_LABELS)} value={character.abilities[a]||0} max={5} onChange={v=>upAbil(a,v)}/>)}</div>
                    <div><SectionHeader>Knowledges</SectionHeader>{character.abilities&&['academics','computer','cosmology','enigmas','esoterica','investigation','law','medicine','occult','politics','science'].map(a=><DotSelector key={a} label={formatLabel(a,ABILITY_LABELS)} value={character.abilities[a]||0} max={5} onChange={v=>upAbil(a,v)}/>)}</div>
                  </div>
                </GrimoireCardContent>
              </GrimoireCard>
            </TabPanel>}

            {/* Spheres */}
            {activeTab==="spheres"&&<TabPanel>
              <GrimoireCard>
                <GrimoireCardHeader>
                  <GrimoireCardTitle>Spheres of Magic</GrimoireCardTitle>
                  <p className="text-xs text-muted-foreground mt-1 font-serif italic">The nine Spheres through which Awakened will shapes reality</p>
                </GrimoireCardHeader>
                <GrimoireCardContent>
                  {character.spheres&&Object.keys(character.spheres).length>0
                    ?<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">{Object.keys(character.spheres).map(s=><SphereRow key={s} sphereKey={s} value={character.spheres[s]||0} onChange={v=>upSph(s,v)}/>)}</div>
                    :<EmptyState message="No spheres assigned to this character"/>}
                </GrimoireCardContent>
              </GrimoireCard>
            </TabPanel>}

            {/* Backgrounds */}
            {activeTab==="backgrounds"&&<TabPanel>
              <GrimoireCard>
                <GrimoireCardHeader>
                  <GrimoireCardTitle>Backgrounds</GrimoireCardTitle>
                  <p className="text-xs text-muted-foreground mt-1 font-serif italic">Connections, resources, and advantages outside raw power</p>
                </GrimoireCardHeader>
                <GrimoireCardContent>
                  {character.backgrounds&&Object.keys(character.backgrounds).length>0
                    ?<div className="space-y-0.5">{Object.keys(character.backgrounds).map(bg=><DotSelector key={bg} label={formatLabel(bg,BACKGROUND_LABELS)} value={character.backgrounds[bg]||0} max={5} onChange={v=>upBg(bg,v)}/>)}</div>
                    :<EmptyState message="No backgrounds assigned"/>}
                </GrimoireCardContent>
              </GrimoireCard>
            </TabPanel>}

            {/* Merits & Flaws */}
            {activeTab==="merits"&&<TabPanel>
              <div className="grid grid-cols-2 gap-6">
                {/* Merits */}
                <GrimoireCard>
                  <GrimoireCardHeader className="flex flex-row items-center justify-between">
                    <GrimoireCardTitle>Merits</GrimoireCardTitle>
                    <button type="button" className={ghostChip} style={{color:"hsl(var(--foreground)/0.65)"}} onClick={()=>setMeritsOpen(true)}>
                      <Plus className="w-3 h-3"/>Add Merit
                    </button>
                  </GrimoireCardHeader>
                  <GrimoireCardContent>
                    {character.merits&&character.merits.length>0
                      ?<div className="space-y-2">{character.merits.map((m,i)=>(
                        <div key={i} className="flex justify-between items-center p-2.5 rounded-md" style={{background:"hsl(var(--primary)/0.07)",border:"1px solid hsl(var(--primary)/0.15)"}}>
                          <span className="text-sm font-serif">{m.name} <span className="text-muted-foreground">({m.cost} pts)</span></span>
                          <button type="button" onClick={()=>rmMerit(i)} className="text-muted-foreground hover:text-destructive transition-colors ml-2"><X className="w-3.5 h-3.5"/></button>
                        </div>
                      ))}</div>
                      :<EmptyState message="No merits selected"/>}
                  </GrimoireCardContent>
                </GrimoireCard>

                {/* Flaws */}
                <GrimoireCard>
                  <GrimoireCardHeader className="flex flex-row items-center justify-between">
                    <GrimoireCardTitle>Flaws</GrimoireCardTitle>
                    <button type="button" className={ghostChip} style={{color:"hsl(var(--foreground)/0.65)"}} onClick={()=>setFlawsOpen(true)}>
                      <Plus className="w-3 h-3"/>Add Flaw
                    </button>
                  </GrimoireCardHeader>
                  <GrimoireCardContent>
                    {character.flaws&&character.flaws.length>0
                      ?<div className="space-y-2">{character.flaws.map((f,i)=>(
                        <div key={i} className="flex justify-between items-center p-2.5 rounded-md"
                          style={{
                            background:"hsl(var(--destructive)/0.08)",
                            /* Fixed: use outline instead of conflicting border+borderLeft */
                            border:"1px solid hsl(var(--destructive)/0.2)",
                            outline:"none",
                            boxShadow:"inset 3px 0 0 hsl(var(--destructive)/0.5)",
                          }}>
                          <span className="text-sm font-serif">{f.name} <span className="text-muted-foreground">(+{f.cost} pts)</span></span>
                          <button type="button" onClick={()=>rmFlaw(i)} className="text-muted-foreground hover:text-destructive transition-colors ml-2"><X className="w-3.5 h-3.5"/></button>
                        </div>
                      ))}</div>
                      :<EmptyState message="No flaws selected"/>}
                  </GrimoireCardContent>
                </GrimoireCard>
              </div>
            </TabPanel>}
          </div>

          <div className="h-[2px] w-full pointer-events-none" aria-hidden="true"
            style={{background:"linear-gradient(90deg,hsl(var(--accent)/0.65) 0%,hsl(var(--primary)/0.5) 12%,hsl(var(--primary)/0.2) 50%,transparent 100%)"}}/>
        </div>
      </div>

      {/* ── Themed dialogs — rendered outside the container for correct z-index ── */}
      <GrimoireDialog open={meritsOpen} onOpenChange={setMeritsOpen} title="Add Merit" description="Select a merit to add to your character">
        <ScrollArea className="h-[400px] mt-4">
          <div className="space-y-2 pr-2">
            {meritsList.map(merit=>(
              <div key={merit.id} className="p-3 rounded-lg cursor-pointer transition-all duration-150 hover:bg-primary/[0.06]"
                style={{border:"1px solid hsl(var(--border)/0.4)"}} onClick={()=>addMerit(merit)}>
                <div className="flex justify-between items-start">
                  <div><h4 className="font-serif font-semibold text-sm text-foreground">{merit.name}</h4><p className="text-xs text-muted-foreground mt-0.5">{merit.description}</p></div>
                  <Badge className="shrink-0 ml-2">{Math.abs(merit.cost)} pts</Badge>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </GrimoireDialog>

      <GrimoireDialog open={flawsOpen} onOpenChange={setFlawsOpen} title="Add Flaw" description="Select a flaw to add to your character (max 7 points)">
        <ScrollArea className="h-[400px] mt-4">
          <div className="space-y-2 pr-2">
            {flawsList.map(flaw=>(
              <div key={flaw.id} className="p-3 rounded-lg cursor-pointer transition-all duration-150 hover:bg-destructive/[0.05]"
                style={{border:"1px solid hsl(var(--border)/0.4)"}} onClick={()=>addFlaw(flaw)}>
                <div className="flex justify-between items-start">
                  <div><h4 className="font-serif font-semibold text-sm text-foreground">{flaw.name}</h4><p className="text-xs text-muted-foreground mt-0.5">{flaw.description}</p></div>
                  <Badge className="shrink-0 ml-2 bg-destructive/80">+{Math.abs(flaw.cost)} pts</Badge>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </GrimoireDialog>

      <Toaster/>
    </>
  )
}
