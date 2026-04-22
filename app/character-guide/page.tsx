"use client"

import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"
import { Lock, ChevronRight, Check, Plus, Minus, Sparkles } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"
import { Toaster } from "@/components/ui/toaster"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

// ── Types ─────────────────────────────────────────────────────────────────────
type Priority = "primary" | "secondary" | "tertiary" | null

interface CharacterState {
  name: string; player: string; chronicle: string; nature: string; demeanor: string
  essence: string; affiliation: string; sect: string; concept: string
  phase: "basics"|"attributes-priority"|"attributes-assign"|"abilities-priority"|"abilities-assign"|"spheres"|"backgrounds"|"freebies"|"complete"
  freebieDots: {
    attributes: {[key:string]:number}; abilities: {[key:string]:number}
    spheres: {[key:string]:number}; backgrounds: {[key:string]:number}
    arete: number; willpower: number
  }
  specialties: {[key:string]:string}
  merits: Array<{id:string; name:string; cost:number}>
  flaws:  Array<{id:string; name:string; cost:number}>
  attributePriorities: {physical:Priority; social:Priority; mental:Priority}
  attributes: {
    strength:number; dexterity:number; stamina:number
    charisma:number; manipulation:number; appearance:number
    perception:number; intelligence:number; wits:number
  }
  abilityPriorities: {talents:Priority; skills:Priority; knowledges:Priority}
  abilities: {
    alertness:number; art:number; athletics:number; awareness:number; brawl:number
    empathy:number; expression:number; intimidation:number; leadership:number
    streetwise:number; subterfuge:number; crafts:number; drive:number
    etiquette:number; firearms:number; martialArts:number; meditation:number
    melee:number; research:number; stealth:number; survival:number; technology:number
    academics:number; computer:number; cosmology:number; enigmas:number; esoterica:number
    investigation:number; law:number; medicine:number; occult:number; politics:number; science:number
  }
  spheres: {
    correspondence:number; entropy:number; forces:number; life:number; matter:number
    mind:number; prime:number; spirit:number; time:number
  }
  affinitySphere: string
  backgrounds: {[key:string]:number}
  arete: number; willpower: number
}

const INITIAL_STATE: CharacterState = {
  name:"", player:"", chronicle:"", nature:"", demeanor:"", essence:"",
  affiliation:"", sect:"", concept:"", phase:"basics",
  attributePriorities:{physical:null,social:null,mental:null},
  attributes:{strength:1,dexterity:1,stamina:1,charisma:1,manipulation:1,appearance:1,perception:1,intelligence:1,wits:1},
  abilityPriorities:{talents:null,skills:null,knowledges:null},
  abilities:{
    alertness:0,art:0,athletics:0,awareness:0,brawl:0,empathy:0,expression:0,intimidation:0,
    leadership:0,streetwise:0,subterfuge:0,crafts:0,drive:0,etiquette:0,firearms:0,
    martialArts:0,meditation:0,melee:0,research:0,stealth:0,survival:0,technology:0,
    academics:0,computer:0,cosmology:0,enigmas:0,esoterica:0,investigation:0,law:0,
    medicine:0,occult:0,politics:0,science:0
  },
  spheres:{correspondence:0,entropy:0,forces:0,life:0,matter:0,mind:0,prime:0,spirit:0,time:0},
  affinitySphere:"", backgrounds:{}, arete:1, willpower:5,
  freebieDots:{attributes:{},abilities:{},spheres:{},backgrounds:{},arete:0,willpower:0},
  specialties:{}, merits:[], flaws:[]
}

// ── Static lore data ──────────────────────────────────────────────────────────
const traditionBlurbs: Record<string,string> = {
  "Akashic Brotherhood":"Warrior-monks who believe that reality is an illusion and seek enlightenment through martial arts and meditation.",
  "Celestial Chorus":"Faith‑based mages who hear the One Song and work miracles through prayer and devotion.",
  "Cult of Ecstasy":"Hedonists and artists who use trance, drugs, and passion to transcend time and perception.",
  "Dreamspeakers":"Shamans who commune with spirits and the dead, drawing power from the Umbra.",
  "Euthanatos":"Agents of death and reincarnation who believe in merciful endings and karmic balance.",
  "Order of Hermes":"Ritualistic wizards who use hermetic magic, sigils, and complex formulae.",
  "Sons of Ether":"Mad scientists who reject consensus reality, using gadgets and weird science.",
  "Verbena":"Nature witches who draw power from blood, earth, and the cycle of life and death.",
  "Virtual Adepts":"Cybermages who manipulate data streams and digital reality.",
  "Hollow Ones":"Gothic romanticists who practice eclectic, postmodern magic.",
  "Orphan":"Self‑taught mages without a tradition, often distrustful of established groups.",
  "Technocracy":"Enforcers of the consensus, using hyper‑technology to suppress 'reality deviants'."
}

const natureDemeanorOptions = [
  "Architect","Autocrat","Bon Vivant","Bravo","Caregiver","Celebrant","Competitor",
  "Conformist","Conniver","Critic","Curmudgeon","Deviant","Director","Fanatic","Gallant",
  "Judge","Loner","Martyr","Masochist","Monster","Pedagogue","Penitent","Perfectionist",
  "Rebel","Rogue","Sage","Scientist","Sociopath","Survivor","Thrill-Seeker",
  "Traditionalist","Trickster","Visionary"
]

const essenceOptions = [
  {value:"Dynamic",    description:"Creative, chaotic, and revolutionary. Dynamic mages change reality through innovation."},
  {value:"Pattern",    description:"Structured, ordered, and preservative. Pattern mages maintain the status quo."},
  {value:"Primordial", description:"Instinctive, raw, and natural. Primordial mages tap into primal forces."},
  {value:"Questing",   description:"Seeking, evolving, and transcendent. Questing mages are on a journey of self‑improvement."}
]

// ── Step categories — used for the progress indicator (Stage 2) ───────────────
const STEP_CATEGORIES = [
  {label:"Identity",   steps:[0,1,2,3]},
  {label:"Attributes", steps:[4,5]},
  {label:"Abilities",  steps:[6,7]},
  {label:"Magic",      steps:[8,9]},
  {label:"Finishing",  steps:[10,11,12]},
]

// =============================================================================
// GUIDED STEP COMPONENTS — all logic 100% unchanged from source file
// =============================================================================

function NameConceptTraditionStep({state,setState,onNext}:{state:CharacterState;setState:(s:CharacterState)=>void;onNext:()=>void}) {
  const [traditionInfo,setTraditionInfo]=useState(traditionBlurbs[state.affiliation]||"")
  useEffect(()=>{setTraditionInfo(traditionBlurbs[state.affiliation]||"")},[state.affiliation])
  return(
    <div className="space-y-5">
      <div className="bg-amber-50 p-3 rounded-md text-sm">
        <p><strong>Name:</strong> Choose a name that fits your character's background and the World of Darkness (modern gothic, often evocative).</p>
        <p className="mt-1"><strong>Concept:</strong> A short phrase that sums up who your character is (e.g., "Occult Librarian", "Cyberpunk Hacker", "Homeless Prophet").</p>
        <p className="mt-1"><strong>Tradition:</strong> Your magical paradigm – the belief system that shapes how you work magic. Read the blurb below.</p>
      </div>
      <SheetInput label="Character Name" value={state.name} onChange={v=>setState({...state,name:v})} placeholder="e.g., Lilith Blackwood"/>
      <SheetInput label="Concept" value={state.concept} onChange={v=>setState({...state,concept:v})} placeholder="e.g., Occult Librarian"/>
      <div>
        <Label className="text-xs uppercase tracking-wide" style={{color:'#4a2c2a'}}>Tradition</Label>
        <select value={state.affiliation} onChange={e=>setState({...state,affiliation:e.target.value})}
          className="w-full border-b-2 border-t-0 border-x-0 bg-transparent focus:outline-none focus:ring-0 p-2 mt-1"
          style={{borderColor:'#8b4513',color:'#4a2c2a'}}>
          <option value="">Select a tradition</option>
          {Object.keys(traditionBlurbs).map(opt=><option key={opt} value={opt}>{opt}</option>)}
        </select>
        {traditionInfo&&<div className="mt-2 text-xs italic p-2 bg-amber-50 rounded" style={{color:'#6b4423'}}>{traditionInfo}</div>}
      </div>
      <SheetButton onClick={onNext} disabled={!state.name||!state.concept||!state.affiliation}>Next: Nature & Demeanor →</SheetButton>
    </div>
  )
}

function NatureDemeanorStep({state,setState,onNext,onBack}:{state:CharacterState;setState:(s:CharacterState)=>void;onNext:()=>void;onBack:()=>void}) {
  return(
    <div className="space-y-5">
      <div className="bg-amber-50 p-3 rounded-md text-sm">
        <p><strong>Nature</strong> is your character's true inner self – what drives them when no one is watching.</p>
        <p><strong>Demeanor</strong> is the mask they wear in public – how others perceive them.</p>
        <p>They can be the same or different. Choose from the list of archetypes.</p>
      </div>
      <SheetSelect label="Nature" value={state.nature} onChange={v=>setState({...state,nature:v})} options={natureDemeanorOptions} placeholder="Select nature..."/>
      <SheetSelect label="Demeanor" value={state.demeanor} onChange={v=>setState({...state,demeanor:v})} options={natureDemeanorOptions} placeholder="Select demeanor..."/>
      <div className="flex justify-between gap-3">
        <SheetButton onClick={onBack} variant="secondary">← Back</SheetButton>
        <SheetButton onClick={onNext} disabled={!state.nature||!state.demeanor}>Next: Essence & Chronicle →</SheetButton>
      </div>
    </div>
  )
}

function EssenceChronicleStep({state,setState,onNext,onBack}:{state:CharacterState;setState:(s:CharacterState)=>void;onNext:()=>void;onBack:()=>void}) {
  const [essenceDesc,setEssenceDesc]=useState("")
  useEffect(()=>{const f=essenceOptions.find(e=>e.value===state.essence);setEssenceDesc(f?.description||"")},[state.essence])
  return(
    <div className="space-y-5">
      <div className="bg-amber-50 p-3 rounded-md text-sm">
        <p><strong>Essence</strong> defines your magical nature and how you relate to the cosmos.</p>
        <p><strong>Chronicle</strong> is the name of the campaign/story you're playing in.</p>
        <p><strong>Sect</strong> (optional) is a sub‑faction within your Tradition (e.g., "Artificers", "Mysterium").</p>
      </div>
      <div>
        <Label className="text-xs uppercase tracking-wide" style={{color:'#4a2c2a'}}>Essence</Label>
        <select value={state.essence} onChange={e=>setState({...state,essence:e.target.value})}
          className="w-full border-b-2 border-t-0 border-x-0 bg-transparent focus:outline-none focus:ring-0 p-2 mt-1"
          style={{borderColor:'#8b4513',color:'#4a2c2a'}}>
          <option value="">Select essence</option>
          {essenceOptions.map(opt=><option key={opt.value} value={opt.value}>{opt.value}</option>)}
        </select>
        {essenceDesc&&<div className="mt-1 text-xs italic text-amber-700">{essenceDesc}</div>}
      </div>
      <SheetInput label="Chronicle" value={state.chronicle} onChange={v=>setState({...state,chronicle:v})} placeholder="e.g., The Awakening"/>
      <SheetInput label="Sect (optional)" value={state.sect} onChange={v=>setState({...state,sect:v})} placeholder="e.g., Artificers"/>
      <div className="flex justify-between gap-3">
        <SheetButton onClick={onBack} variant="secondary">← Back</SheetButton>
        <SheetButton onClick={onNext} disabled={!state.essence||!state.chronicle}>Next: Refine Concept →</SheetButton>
      </div>
    </div>
  )
}

function ConceptRefinementStep({state,setState,onNext,onBack}:{state:CharacterState;setState:(s:CharacterState)=>void;onNext:()=>void;onBack:()=>void}) {
  return(
    <div className="space-y-5">
      <div className="bg-amber-50 p-3 rounded-md text-sm">
        <p>Now that you have a Tradition, Nature, and Essence, you might want to refine your character concept.</p>
        <p>For example: <em>"A Virtual Adept hacker who uses her skills to fight the Technocracy, but her Caregiver nature makes her protect the innocent."</em></p>
      </div>
      <SheetInput label="Refined Concept (optional)" value={state.concept} onChange={v=>setState({...state,concept:v})} placeholder="You can update your concept here"/>
      <div className="flex justify-between gap-3">
        <SheetButton onClick={onBack} variant="secondary">← Back</SheetButton>
        <SheetButton onClick={onNext}>Next: Attribute Priority →</SheetButton>
      </div>
    </div>
  )
}

function AttributePriorityStep({state,setState,onNext,onBack}:{state:CharacterState;setState:(s:CharacterState)=>void;onNext:()=>void;onBack:()=>void}) {
  const setPriority=(category:keyof CharacterState["attributePriorities"],priority:Priority)=>{
    const n={...state.attributePriorities}
    Object.keys(n).forEach(k=>{if(n[k as keyof typeof n]===priority)n[k as keyof typeof n]=null})
    n[category]=priority;setState({...state,attributePriorities:n})
  }
  const allSelected=Object.values(state.attributePriorities).every(p=>p!==null)
  return(
    <div className="space-y-5">
      <div className="bg-amber-50 p-3 rounded-md text-sm">
        <p><strong>Attributes</strong> are your character's innate capabilities. You have three categories: Physical, Social, Mental.</p>
        <p>Assign <strong>Primary (7 dots)</strong>, <strong>Secondary (5 dots)</strong>, and <strong>Tertiary (3 dots)</strong> to the three categories.</p>
        <p className="mt-1 text-xs">Each attribute starts at 1 dot. You'll spend the additional dots in the next step.</p>
      </div>
      <div className="space-y-3">
        <PrioritySelector label="Physical" subtitle="Strength, Dexterity, Stamina" selected={state.attributePriorities.physical} onSelect={p=>setPriority("physical",p)}/>
        <PrioritySelector label="Social" subtitle="Charisma, Manipulation, Appearance" selected={state.attributePriorities.social} onSelect={p=>setPriority("social",p)}/>
        <PrioritySelector label="Mental" subtitle="Perception, Intelligence, Wits" selected={state.attributePriorities.mental} onSelect={p=>setPriority("mental",p)}/>
      </div>
      <div className="flex justify-between gap-3">
        <SheetButton onClick={onBack} variant="secondary">← Back</SheetButton>
        <SheetButton onClick={onNext} disabled={!allSelected}>Next: Assign Attributes →</SheetButton>
      </div>
    </div>
  )
}

function AttributeAssignStep({state,setState,onNext,onBack}:{state:CharacterState;setState:(s:CharacterState)=>void;onNext:()=>void;onBack:()=>void}) {
  const getPoints=(cat:keyof typeof state.attributePriorities)=>{const p=state.attributePriorities[cat];return p==="primary"?7:p==="secondary"?5:p==="tertiary"?3:0}
  const getAttrs=(cat:"physical"|"social"|"mental"):(keyof typeof state.attributes)[]=>{if(cat==="physical")return["strength","dexterity","stamina"];if(cat==="social")return["charisma","manipulation","appearance"];return["perception","intelligence","wits"]}
  const getSpent=(cat:keyof typeof state.attributePriorities)=>{return getAttrs(cat as any).reduce((s,a)=>s+(state.attributes[a]-1),0)}
  const getRemaining=(cat:keyof typeof state.attributePriorities)=>getPoints(cat)-getSpent(cat)
  const setVal=(attr:keyof typeof state.attributes,value:number)=>{
    if(value<1)return
    let cat:"physical"|"social"|"mental"="physical"
    if(["charisma","manipulation","appearance"].includes(attr))cat="social"
    if(["perception","intelligence","wits"].includes(attr))cat="mental"
    const diff=value-state.attributes[attr]
    if(diff>getRemaining(cat))return
    setState({...state,attributes:{...state.attributes,[attr]:value}})
  }
  const allDone=getRemaining("physical")===0&&getRemaining("social")===0&&getRemaining("mental")===0
  return(
    <div className="space-y-4">
      <div className="bg-amber-50 p-3 rounded-md text-sm">
        <p>Click dots to assign attribute points. Each attribute already starts at 1.</p>
      </div>
      <AttributeSection title="Physical" priority={state.attributePriorities.physical!} remaining={getRemaining("physical")} total={getPoints("physical")}>
        <SheetDotRating label="Strength" value={state.attributes.strength} onChange={v=>setVal("strength",v)} locked/>
        <SheetDotRating label="Dexterity" value={state.attributes.dexterity} onChange={v=>setVal("dexterity",v)} locked/>
        <SheetDotRating label="Stamina" value={state.attributes.stamina} onChange={v=>setVal("stamina",v)} locked/>
      </AttributeSection>
      <AttributeSection title="Social" priority={state.attributePriorities.social!} remaining={getRemaining("social")} total={getPoints("social")}>
        <SheetDotRating label="Charisma" value={state.attributes.charisma} onChange={v=>setVal("charisma",v)} locked/>
        <SheetDotRating label="Manipulation" value={state.attributes.manipulation} onChange={v=>setVal("manipulation",v)} locked/>
        <SheetDotRating label="Appearance" value={state.attributes.appearance} onChange={v=>setVal("appearance",v)} locked/>
      </AttributeSection>
      <AttributeSection title="Mental" priority={state.attributePriorities.mental!} remaining={getRemaining("mental")} total={getPoints("mental")}>
        <SheetDotRating label="Perception" value={state.attributes.perception} onChange={v=>setVal("perception",v)} locked/>
        <SheetDotRating label="Intelligence" value={state.attributes.intelligence} onChange={v=>setVal("intelligence",v)} locked/>
        <SheetDotRating label="Wits" value={state.attributes.wits} onChange={v=>setVal("wits",v)} locked/>
      </AttributeSection>
      <div className="flex justify-between gap-3">
        <SheetButton onClick={onBack} variant="secondary">← Back</SheetButton>
        <SheetButton onClick={onNext} disabled={!allDone}>Next: Ability Priority →</SheetButton>
      </div>
    </div>
  )
}

function AbilityPriorityStep({state,setState,onNext,onBack}:{state:CharacterState;setState:(s:CharacterState)=>void;onNext:()=>void;onBack:()=>void}) {
  const setPriority=(cat:keyof CharacterState["abilityPriorities"],priority:Priority)=>{
    const n={...state.abilityPriorities}
    Object.keys(n).forEach(k=>{if(n[k as keyof typeof n]===priority)n[k as keyof typeof n]=null})
    n[cat]=priority;setState({...state,abilityPriorities:n})
  }
  const allSelected=Object.values(state.abilityPriorities).every(p=>p!==null)
  return(
    <div className="space-y-5">
      <div className="bg-amber-50 p-3 rounded-md text-sm">
        <p><strong>Abilities</strong> represent learned skills and knowledge. They are divided into Talents (innate), Skills (trained), and Knowledges (academic).</p>
        <p>Assign <strong>Primary (13 dots)</strong>, <strong>Secondary (9 dots)</strong>, and <strong>Tertiary (5 dots)</strong>.</p>
        <p className="text-xs mt-1">No ability may exceed 3 dots during character creation.</p>
      </div>
      <div className="space-y-3">
        <PrioritySelector label="Talents" subtitle="Alertness, Art, Athletics, Awareness, Brawl, Empathy, Expression, Intimidation, Leadership, Streetwise, Subterfuge" selected={state.abilityPriorities.talents} onSelect={p=>setPriority("talents",p)}/>
        <PrioritySelector label="Skills" subtitle="Crafts, Drive, Etiquette, Firearms, Martial Arts, Meditation, Melee, Research, Stealth, Survival, Technology" selected={state.abilityPriorities.skills} onSelect={p=>setPriority("skills",p)}/>
        <PrioritySelector label="Knowledges" subtitle="Academics, Computer, Cosmology, Enigmas, Esoterica, Investigation, Law, Medicine, Occult, Politics, Science" selected={state.abilityPriorities.knowledges} onSelect={p=>setPriority("knowledges",p)}/>
      </div>
      <div className="flex justify-between gap-3">
        <SheetButton onClick={onBack} variant="secondary">← Back</SheetButton>
        <SheetButton onClick={onNext} disabled={!allSelected}>Next: Assign Abilities →</SheetButton>
      </div>
    </div>
  )
}

function AbilityAssignStep({state,setState,onNext,onBack}:{state:CharacterState;setState:(s:CharacterState)=>void;onNext:()=>void;onBack:()=>void}) {
  const getPoints=(cat:keyof typeof state.abilityPriorities)=>{const p=state.abilityPriorities[cat];return p==="primary"?13:p==="secondary"?9:p==="tertiary"?5:0}
  const getAbils=(cat:"talents"|"skills"|"knowledges"):(keyof typeof state.abilities)[]=>{
    if(cat==="talents")return["alertness","art","athletics","awareness","brawl","empathy","expression","intimidation","leadership","streetwise","subterfuge"]
    if(cat==="skills")return["crafts","drive","etiquette","firearms","martialArts","meditation","melee","research","stealth","survival","technology"]
    return["academics","computer","cosmology","enigmas","esoterica","investigation","law","medicine","occult","politics","science"]
  }
  const getSpent=(cat:keyof typeof state.abilityPriorities)=>getAbils(cat as any).reduce((s,a)=>s+state.abilities[a],0)
  const getRemaining=(cat:keyof typeof state.abilityPriorities)=>getPoints(cat)-getSpent(cat)
  const setVal=(ability:keyof typeof state.abilities,value:number)=>{
    if(value<0||value>3)return
    let cat:"talents"|"skills"|"knowledges"="talents"
    if(getAbils("skills").includes(ability))cat="skills"
    if(getAbils("knowledges").includes(ability))cat="knowledges"
    const diff=value-state.abilities[ability]
    if(diff>getRemaining(cat))return
    setState({...state,abilities:{...state.abilities,[ability]:value}})
  }
  const fmt=(a:string)=>a.replace(/([A-Z])/g,' $1').replace(/^./,s=>s.toUpperCase()).trim()
  const allDone=getRemaining("talents")===0&&getRemaining("skills")===0&&getRemaining("knowledges")===0
  return(
    <div className="space-y-5">
      <div className="bg-amber-50 p-3 rounded-md text-sm">
        <p>Assign your ability dots. Each ability can have at most <strong>3 dots</strong> during creation.</p>
        <p>Click on the dots to increase. Click a filled dot to clear back to 0.</p>
      </div>
      <div className="grid grid-cols-3 gap-4">
        <AbilityColumn title="Talents" priority={state.abilityPriorities.talents!} remaining={getRemaining("talents")} total={getPoints("talents")}>
          {getAbils("talents").map(a=><SheetDotRating key={a} label={fmt(a)} value={state.abilities[a]} onChange={v=>setVal(a,v)} maxDots={3} variant="ability"/>)}
        </AbilityColumn>
        <AbilityColumn title="Skills" priority={state.abilityPriorities.skills!} remaining={getRemaining("skills")} total={getPoints("skills")}>
          {getAbils("skills").map(a=><SheetDotRating key={a} label={fmt(a)} value={state.abilities[a]} onChange={v=>setVal(a,v)} maxDots={3} variant="ability"/>)}
        </AbilityColumn>
        <AbilityColumn title="Knowledges" priority={state.abilityPriorities.knowledges!} remaining={getRemaining("knowledges")} total={getPoints("knowledges")}>
          {getAbils("knowledges").map(a=><SheetDotRating key={a} label={fmt(a)} value={state.abilities[a]} onChange={v=>setVal(a,v)} maxDots={3} variant="ability"/>)}
        </AbilityColumn>
      </div>
      <div className="flex justify-between gap-3 pt-4">
        <SheetButton onClick={onBack} variant="secondary">← Back</SheetButton>
        <SheetButton onClick={onNext} disabled={!allDone}>Next: Starting Arete →</SheetButton>
      </div>
    </div>
  )
}

function AreteStartStep({state,setState,onNext,onBack,setFreebiePoolAdjustment}:{state:CharacterState;setState:(s:CharacterState)=>void;onNext:()=>void;onBack:()=>void;setFreebiePoolAdjustment:(n:number)=>void}) {
  const [selectedArete,setSelectedArete]=useState<1|2|3>(1)
  const [confirmed,setConfirmed]=useState(false)
  const handleConfirm=()=>{
    let adj=0,dots=0
    if(selectedArete===2){dots=1;adj=-4}
    else if(selectedArete===3){dots=2;adj=-8}
    setFreebiePoolAdjustment(adj)
    setState({...state,freebieDots:{...state.freebieDots,arete:dots}})
    setConfirmed(true)
  }
  useEffect(()=>{if(confirmed)onNext()},[confirmed,onNext])
  return(
    <div className="space-y-5">
      <div className="bg-amber-50 p-3 rounded-md text-sm">
        <p><strong>Arete</strong> is your character's mastery of magic. Most starting characters have <strong>Arete 1</strong>.</p>
        <p>Your Storyteller may allow you to start higher — but this costs freebie points.</p>
        <ul className="list-disc pl-5 mt-2 text-xs">
          <li>Arete 2: costs <strong>4 freebie points</strong></li>
          <li>Arete 3: costs <strong>8 freebie points</strong></li>
        </ul>
      </div>
      <div className="flex gap-4 justify-center">
        {[1,2,3].map(level=>(
          <button key={level} onClick={()=>setSelectedArete(level as 1|2|3)}
            className={cn("px-6 py-3 rounded-lg text-lg font-bold transition-all",
              selectedArete===level?"bg-gradient-to-r from-amber-600 to-amber-800 text-white shadow-lg":"bg-white border-2 border-amber-700 text-amber-800 hover:bg-amber-50")}>
            Arete {level}
          </button>
        ))}
      </div>
      <div className="flex justify-between gap-3">
        <SheetButton onClick={onBack} variant="secondary">← Back</SheetButton>
        <SheetButton onClick={handleConfirm}>Confirm & Continue →</SheetButton>
      </div>
    </div>
  )
}

function SpheresStep({state,setState,onNext,onBack}:{state:CharacterState;setState:(s:CharacterState)=>void;onNext:()=>void;onBack:()=>void}) {
  const spent=()=>Object.values(state.spheres).reduce((s,v)=>s+v,0)
  const remaining=()=>6-spent()
  const setVal=(sphere:keyof typeof state.spheres,value:number)=>{
    if(value<0||value>3)return
    if(state.affinitySphere===sphere&&value<1)return
    const diff=value-state.spheres[sphere]
    if(diff>remaining())return
    setState({...state,spheres:{...state.spheres,[sphere]:value}})
  }
  const getDesc=(s:string)=>({correspondence:"Space, distance, portals, teleportation.",entropy:"Chaos, decay, probability, fate.",forces:"Energy, fire, gravity, light, sound.",life:"Living things, healing, shapeshifting, disease.",matter:"Inanimate objects, transmutation, alchemy.",mind:"Thoughts, emotions, telepathy, illusions.",prime:"Raw magic, quintessence, enchanting.",spirit:"The Umbra, ghosts, spirits, the dead.",time:"Past, future, speed, precognition."}[s]||"Mystical control over this aspect of reality.")
  const canProceed=remaining()===0&&state.affinitySphere!==""
  return(
    <div className="space-y-5">
      <div className="bg-amber-50 p-3 rounded-md text-sm">
        <p><strong>Spheres</strong> are the nine types of magic. Your Tradition grants you an <strong>Affinity Sphere</strong> — you must take at least 1 dot in it.</p>
        <p>You have <strong>6 total dots</strong> to spend (max 3 per Sphere). The Affinity Sphere uses 1 dot.</p>
      </div>
      {!state.affinitySphere?(
        <div>
          <h3 className="font-semibold mb-2" style={{color:'#6b2d6b'}}>Choose Your Affinity Sphere</h3>
          <div className="grid grid-cols-3 gap-2">
            {Object.keys(state.spheres).map(sphere=>(
              <button key={sphere} onClick={()=>setState({...state,affinitySphere:sphere,spheres:{...state.spheres,[sphere]:1}})}
                className="p-2 text-sm rounded border-2 hover:bg-opacity-20 transition-all text-left"
                style={{borderColor:'#6b2d6b',color:'#4a2c2a'}}>
                <div className="font-semibold">{sphere.charAt(0).toUpperCase()+sphere.slice(1)}</div>
                <div className="text-xs text-amber-700">{getDesc(sphere)}</div>
              </button>
            ))}
          </div>
        </div>
      ):(
        <>
          <div className="flex items-center justify-between p-3 rounded" style={{background:'rgba(107,45,107,0.1)'}}>
            <div>
              <span className="text-sm font-semibold" style={{color:'#6b2d6b'}}>Affinity: {state.affinitySphere.charAt(0).toUpperCase()+state.affinitySphere.slice(1)}</span>
              <span className="text-xs ml-2 px-2 py-0.5 rounded" style={{background:'#6b2d6b',color:'#f5f0e8'}}>● 1 dot (locked)</span>
            </div>
            <span className="text-sm font-semibold px-3 py-1 rounded" style={{background:remaining()===0?'#6b2d6b':'rgba(107,45,107,0.2)',color:remaining()===0?'#f5f0e8':'#4a2c2a'}}>{remaining()} / 6 remaining</span>
          </div>
          <div className="grid grid-cols-3 gap-4">
            {Object.keys(state.spheres).map(sphere=>(
              <SheetDotRating key={sphere} label={sphere.charAt(0).toUpperCase()+sphere.slice(1)} value={state.spheres[sphere as keyof typeof state.spheres]} onChange={v=>setVal(sphere as keyof typeof state.spheres,v)} maxDots={3} variant="sphere" locked={state.affinitySphere===sphere}/>
            ))}
          </div>
        </>
      )}
      <div className="flex justify-between gap-3">
        <SheetButton onClick={onBack} variant="secondary">← Back</SheetButton>
        <SheetButton onClick={onNext} disabled={!canProceed}>Next: Backgrounds →</SheetButton>
      </div>
    </div>
  )
}

function BackgroundsGuidedStep({state,setState,onNext,onBack}:{state:CharacterState;setState:(s:CharacterState)=>void;onNext:()=>void;onBack:()=>void}) {
  const [backgrounds,setBackgrounds]=useState<any[]>([])
  const [isLoading,setIsLoading]=useState(true)
  useEffect(()=>{fetch('/api/backgrounds').then(r=>r.ok?r.json():Promise.reject()).then(setBackgrounds).catch(console.error).finally(()=>setIsLoading(false))},[])
  const spent=()=>Object.values(state.backgrounds).reduce((s,v)=>s+v,0)
  const remaining=()=>7-spent()
  const setVal=(name:string,value:number)=>{
    if(value<0||value>5)return
    const diff=value-(state.backgrounds[name]||0)
    if(diff>remaining())return
    const b={...state.backgrounds}
    if(value===0)delete b[name];else b[name]=value
    setState({...state,backgrounds:b})
  }
  const canProceed=remaining()===0
  const general=backgrounds.filter(bg=>bg.subtype==='general')
  const mage=backgrounds.filter(bg=>bg.subtype==='mage')
  return(
    <div className="space-y-5 max-h-[60vh] overflow-y-auto pr-1">
      <div className="bg-amber-50 p-3 rounded-md text-sm">
        <p><strong>Backgrounds</strong> represent your character's resources, allies, and supernatural advantages.</p>
        <p>You have <strong>7 dots</strong> to spend (max 5 per background).</p>
      </div>
      {isLoading?<div className="text-center py-4 text-amber-700">Loading backgrounds…</div>:(
        <>
          <div className="flex justify-between items-center p-2 rounded" style={{background:'rgba(139,69,19,0.1)'}}>
            <span className="text-sm font-semibold">Points remaining:</span>
            <span className="text-sm font-bold px-3 py-1 rounded" style={{background:remaining()===0?'#d4af37':'rgba(212,175,55,0.2)',color:'#4a2c2a'}}>{remaining()} / 7</span>
          </div>
          {general.length>0&&<div><h3 className="font-bold text-md border-b pb-1 mb-2" style={{color:'#4a2c2a',borderColor:'#8b4513'}}>General Backgrounds</h3><div className="space-y-1">{general.map(bg=><BackgroundRating key={bg.id} background={bg} value={state.backgrounds[bg.name]||0} onChange={v=>setVal(bg.name,v)}/>)}</div></div>}
          {mage.length>0&&<div><h3 className="font-bold text-md border-b pb-1 mb-2" style={{color:'#6b2d6b',borderColor:'#8b4513'}}>Mage Backgrounds</h3><div className="space-y-1">{mage.map(bg=><BackgroundRating key={bg.id} background={bg} value={state.backgrounds[bg.name]||0} onChange={v=>setVal(bg.name,v)}/>)}</div></div>}
        </>
      )}
      <div className="flex justify-between gap-3">
        <SheetButton onClick={onBack} variant="secondary">← Back</SheetButton>
        <SheetButton onClick={onNext} disabled={!canProceed}>Next: Freebie Points →</SheetButton>
      </div>
    </div>
  )
}

function FreebiesGuidedStep({state,setState,onNext,onBack,freebiePoolAdjustment}:{state:CharacterState;setState:(s:CharacterState)=>void;onNext:()=>void;onBack:()=>void;freebiePoolAdjustment:number}) {
  const [merits,setMerits]=useState<any[]>([])
  const [flaws,setFlaws]=useState<any[]>([])
  const [isLoading,setIsLoading]=useState(true)
  useEffect(()=>{fetch("/api/merits").then(r=>r.json()).then(d=>{setMerits(d.filter((m:any)=>m.type==="merit"));setFlaws(d.filter((m:any)=>m.type==="flaw"))}).catch(console.error).finally(()=>setIsLoading(false))},[])
  const calcPts=()=>{
    let s=0
    Object.values(state.freebieDots.attributes).forEach(d=>s+=d*5)
    Object.values(state.freebieDots.abilities).forEach(d=>s+=d*2)
    Object.values(state.freebieDots.spheres).forEach(d=>s+=d*7)
    Object.values(state.freebieDots.backgrounds).forEach(d=>s+=d*1)
    s+=state.freebieDots.arete*4; s+=state.freebieDots.willpower*1
    state.merits.forEach(m=>s+=Math.abs(m.cost))
    const fp=state.flaws.reduce((t,f)=>t+Math.abs(f.cost),0)
    return(15+fp+freebiePoolAdjustment)-s
  }
  const remaining=calcPts()
  const getHighest=()=>Math.max(...Object.keys(state.spheres).map(sp=>state.spheres[sp as keyof typeof state.spheres]+(state.freebieDots.spheres[sp]||0)))
  const getTotalArete=()=>1+state.freebieDots.arete
  const addDot=(cat:string,name:string,cost:number)=>{
    if(remaining<cost)return
    const ns={...state}
    if(cat==="arete"||cat==="willpower"){(ns.freebieDots as any)[cat]+=1}
    else{const c=(ns.freebieDots as any)[cat];c[name]=(c[name]||0)+1}
    setState(ns)
  }
  const removeDot=(cat:string,name:string)=>{
    const ns={...state}
    if(cat==="arete"||cat==="willpower"){if((ns.freebieDots as any)[cat]<=0)return;(ns.freebieDots as any)[cat]-=1}
    else{const c=(ns.freebieDots as any)[cat];if(!c[name]||c[name]<=0)return;c[name]-=1;if(c[name]===0)delete c[name]}
    setState(ns)
  }
  const addMerit=(merit:any)=>{
    const cost=Math.abs(parseInt(merit.cost)||1)
    if(remaining<cost)return
    if(state.merits.some(m=>m.id===merit.id)){alert("You've already selected this merit!");return}
    setState({...state,merits:[...state.merits,{id:merit.id,name:merit.name,cost}]})
  }
  const removeMerit=(i:number)=>{const n=[...state.merits];n.splice(i,1);setState({...state,merits:n})}
  const addFlaw=(flaw:any)=>{
    const fp=state.flaws.reduce((s,f)=>s+Math.abs(f.cost),0)
    const cost=Math.abs(parseInt(flaw.cost)||1)
    if(fp+cost>7){alert("Maximum 7 points from flaws!");return}
    if(state.flaws.some(f=>f.id===flaw.id)){alert("You've already selected this flaw!");return}
    setState({...state,flaws:[...state.flaws,{id:flaw.id,name:flaw.name,cost}]})
  }
  const removeFlaw=(i:number)=>{const n=[...state.flaws];n.splice(i,1);setState({...state,flaws:n})}
  const getTotalAbil=(name:string)=>(state.abilities[name as keyof typeof state.abilities]||0)+(state.freebieDots.abilities[name]||0)
  const setSpecialty=(name:string,spec:string)=>setState({...state,specialties:{...state.specialties,[name]:spec}})
  const isAreteValid=getTotalArete()>=getHighest()
  const canComplete=remaining===0&&isAreteValid
  return(
    <div className="space-y-5 max-h-[60vh] overflow-y-auto pr-1">
      <div className="bg-amber-50 p-3 rounded-md text-sm">
        <p><strong>Freebie Points</strong> allow further customization. You start with 15, plus up to 7 from flaws.</p>
        {freebiePoolAdjustment!==0&&<p className="text-xs text-amber-700 mt-1">Note: Starting Arete adjusted your pool by {freebiePoolAdjustment} points.</p>}
      </div>
      <div className="flex items-center justify-between p-3 rounded" style={{background:'rgba(212,175,55,0.1)',border:'1px solid #d4af37'}}>
        <div><div className="text-sm">Points Remaining</div><div className="text-3xl font-bold" style={{color:remaining>=0?'#d4af37':'#dc2626'}}>{remaining}</div></div>
        <div className="text-right"><div className="text-sm">Total Available</div><div className="text-xl">{15+state.flaws.reduce((s,f)=>s+Math.abs(f.cost),0)+freebiePoolAdjustment}</div></div>
      </div>
      <Tabs defaultValue="attributes" className="space-y-4">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="attributes">Attributes</TabsTrigger>
          <TabsTrigger value="abilities">Abilities</TabsTrigger>
          <TabsTrigger value="other">Other</TabsTrigger>
          <TabsTrigger value="merits">Merits</TabsTrigger>
          <TabsTrigger value="flaws">Flaws</TabsTrigger>
        </TabsList>
        <TabsContent value="attributes">
          <div className="grid grid-cols-3 gap-4">
            <div><h4 className="font-semibold mb-2">Physical</h4>
              <FreebieDotRating label="Strength" baseDots={state.attributes.strength} freebieDots={state.freebieDots.attributes.strength||0} onAdd={()=>addDot("attributes","strength",5)} onRemove={()=>removeDot("attributes","strength")} cost={5}/>
              <FreebieDotRating label="Dexterity" baseDots={state.attributes.dexterity} freebieDots={state.freebieDots.attributes.dexterity||0} onAdd={()=>addDot("attributes","dexterity",5)} onRemove={()=>removeDot("attributes","dexterity")} cost={5}/>
              <FreebieDotRating label="Stamina" baseDots={state.attributes.stamina} freebieDots={state.freebieDots.attributes.stamina||0} onAdd={()=>addDot("attributes","stamina",5)} onRemove={()=>removeDot("attributes","stamina")} cost={5}/>
            </div>
            <div><h4 className="font-semibold mb-2">Social</h4>
              <FreebieDotRating label="Charisma" baseDots={state.attributes.charisma} freebieDots={state.freebieDots.attributes.charisma||0} onAdd={()=>addDot("attributes","charisma",5)} onRemove={()=>removeDot("attributes","charisma")} cost={5}/>
              <FreebieDotRating label="Manipulation" baseDots={state.attributes.manipulation} freebieDots={state.freebieDots.attributes.manipulation||0} onAdd={()=>addDot("attributes","manipulation",5)} onRemove={()=>removeDot("attributes","manipulation")} cost={5}/>
              <FreebieDotRating label="Appearance" baseDots={state.attributes.appearance} freebieDots={state.freebieDots.attributes.appearance||0} onAdd={()=>addDot("attributes","appearance",5)} onRemove={()=>removeDot("attributes","appearance")} cost={5}/>
            </div>
            <div><h4 className="font-semibold mb-2">Mental</h4>
              <FreebieDotRating label="Perception" baseDots={state.attributes.perception} freebieDots={state.freebieDots.attributes.perception||0} onAdd={()=>addDot("attributes","perception",5)} onRemove={()=>removeDot("attributes","perception")} cost={5}/>
              <FreebieDotRating label="Intelligence" baseDots={state.attributes.intelligence} freebieDots={state.freebieDots.attributes.intelligence||0} onAdd={()=>addDot("attributes","intelligence",5)} onRemove={()=>removeDot("attributes","intelligence")} cost={5}/>
              <FreebieDotRating label="Wits" baseDots={state.attributes.wits} freebieDots={state.freebieDots.attributes.wits||0} onAdd={()=>addDot("attributes","wits",5)} onRemove={()=>removeDot("attributes","wits")} cost={5}/>
            </div>
          </div>
        </TabsContent>
        <TabsContent value="abilities">
          <div className="grid grid-cols-3 gap-4">
            <div><h4 className="font-semibold mb-2">Talents</h4>{["alertness","art","athletics","awareness","brawl","empathy","expression","intimidation","leadership","streetwise","subterfuge"].map(a=>{const total=getTotalAbil(a);const lbl=a.charAt(0).toUpperCase()+a.slice(1);return(<div key={a}><FreebieDotRating label={lbl} baseDots={state.abilities[a as keyof typeof state.abilities]} freebieDots={state.freebieDots.abilities[a]||0} onAdd={()=>addDot("abilities",a,2)} onRemove={()=>removeDot("abilities",a)} cost={2}/>{total>=4&&<Input placeholder="Specialty…" value={state.specialties[a]||""} onChange={e=>setSpecialty(a,e.target.value)} className="mt-1 text-xs ml-4"/>}</div>)})}</div>
            <div><h4 className="font-semibold mb-2">Skills</h4>{["crafts","drive","etiquette","firearms","martialArts","meditation","melee","research","stealth","survival","technology"].map(a=>{const total=getTotalAbil(a);const lbl=a==="martialArts"?"Martial Arts":a.charAt(0).toUpperCase()+a.slice(1);return(<div key={a}><FreebieDotRating label={lbl} baseDots={state.abilities[a as keyof typeof state.abilities]} freebieDots={state.freebieDots.abilities[a]||0} onAdd={()=>addDot("abilities",a,2)} onRemove={()=>removeDot("abilities",a)} cost={2}/>{total>=4&&<Input placeholder="Specialty…" value={state.specialties[a]||""} onChange={e=>setSpecialty(a,e.target.value)} className="mt-1 text-xs ml-4"/>}</div>)})}</div>
            <div><h4 className="font-semibold mb-2">Knowledges</h4>{["academics","computer","cosmology","enigmas","esoterica","investigation","law","medicine","occult","politics","science"].map(a=>{const total=getTotalAbil(a);const lbl=a.charAt(0).toUpperCase()+a.slice(1);return(<div key={a}><FreebieDotRating label={lbl} baseDots={state.abilities[a as keyof typeof state.abilities]} freebieDots={state.freebieDots.abilities[a]||0} onAdd={()=>addDot("abilities",a,2)} onRemove={()=>removeDot("abilities",a)} cost={2}/>{total>=4&&<Input placeholder="Specialty…" value={state.specialties[a]||""} onChange={e=>setSpecialty(a,e.target.value)} className="mt-1 text-xs ml-4"/>}</div>)})}</div>
          </div>
        </TabsContent>
        <TabsContent value="other">
          <div className="space-y-4">
            <div><h4 className="font-semibold mb-2">Arete (4 pts/dot)</h4>
              <div className="flex items-center justify-between">
                <span>Arete</span>
                <div className="flex items-center gap-2">
                  <div className="flex gap-1">{[1,2,3].map(i=>{const isBase=i<=1;const isFree=i>1&&i<=getTotalArete();return<div key={i} className="w-5 h-5 rounded-full border-2" style={{borderColor:'#d4af37',backgroundColor:isBase||isFree?'#d4af37':'transparent'}}/>})}</div>
                  <button onClick={()=>removeDot("arete","arete")} disabled={state.freebieDots.arete<=0||getTotalArete()<=getHighest()} className="w-6 h-6 rounded bg-amber-800 text-white disabled:opacity-30">-</button>
                  <span className="w-8 text-center text-xs">4pt</span>
                  <button onClick={()=>addDot("arete","arete",4)} disabled={remaining<4||getTotalArete()>=3} className="w-6 h-6 rounded bg-amber-500 text-black disabled:opacity-30">+</button>
                </div>
              </div>
              {getTotalArete()<getHighest()&&<p className="text-xs text-red-600 mt-1">Arete must be at least {getHighest()} (highest sphere)</p>}
            </div>
            <div><h4 className="font-semibold mb-2">Willpower (1 pt/dot)</h4><FreebieDotRating label="Willpower" baseDots={5} freebieDots={state.freebieDots.willpower} onAdd={()=>addDot("willpower","willpower",1)} onRemove={()=>removeDot("willpower","willpower")} maxDots={10} cost={1}/></div>
            <div><h4 className="font-semibold mb-2">Spheres (7 pts/dot)</h4>{Object.keys(state.spheres).map(s=><FreebieDotRating key={s} label={s.charAt(0).toUpperCase()+s.slice(1)} baseDots={state.spheres[s as keyof typeof state.spheres]} freebieDots={state.freebieDots.spheres[s]||0} onAdd={()=>addDot("spheres",s,7)} onRemove={()=>removeDot("spheres",s)} cost={7}/>)}</div>
          </div>
        </TabsContent>
        <TabsContent value="merits">
          {isLoading?<div>Loading merits…</div>:(
            <div>
              {state.merits.length>0&&<div className="mb-4"><h4 className="font-semibold">Selected ({state.merits.reduce((s,m)=>s+m.cost,0)} pts)</h4>{state.merits.map((m,i)=><div key={i} className="flex justify-between items-center p-2 bg-amber-50 rounded mt-1"><span>{m.name} ({m.cost} pts)</span><button onClick={()=>removeMerit(i)} className="text-xs px-2 py-1 bg-red-600 text-white rounded">Remove</button></div>)}</div>}
              <div className="space-y-2 max-h-60 overflow-y-auto">{merits.map(m=><div key={m.id} className="p-2 border rounded"><div className="flex justify-between"><span className="font-semibold text-sm">{m.name}</span><button onClick={()=>addMerit(m)} disabled={remaining<Math.abs(parseInt(m.cost)||1)||state.merits.some(x=>x.id===m.id)} className="text-xs px-3 py-1 rounded bg-amber-500 text-black disabled:opacity-30">Add ({Math.abs(parseInt(m.cost)||1)} pts)</button></div><p className="text-xs text-amber-700">{m.description}</p></div>)}</div>
            </div>
          )}
        </TabsContent>
        <TabsContent value="flaws">
          {isLoading?<div>Loading flaws…</div>:(
            <div>
              {state.flaws.length>0&&<div className="mb-4"><h4 className="font-semibold text-green-600">Selected (+{state.flaws.reduce((s,f)=>s+f.cost,0)} pts)</h4>{state.flaws.map((f,i)=><div key={i} className="flex justify-between items-center p-2 bg-green-50 rounded mt-1"><span>{f.name} (+{f.cost} pts)</span><button onClick={()=>removeFlaw(i)} className="text-xs px-2 py-1 bg-red-600 text-white rounded">Remove</button></div>)}</div>}
              <div className="space-y-2 max-h-60 overflow-y-auto">{flaws.map(f=>{const cost=Math.abs(parseInt(f.cost)||1);const cur=state.flaws.reduce((s,x)=>s+x.cost,0);const sel=state.flaws.some(x=>x.id===f.id);return<div key={f.id} className="p-2 border rounded"><div className="flex justify-between"><span className="font-semibold text-sm">{f.name}</span><button onClick={()=>addFlaw(f)} disabled={sel||cur+cost>7} className="text-xs px-3 py-1 rounded bg-green-600 text-white disabled:opacity-30">Add (+{cost} pts)</button></div><p className="text-xs text-amber-700">{f.description}</p></div>})}</div>
            </div>
          )}
        </TabsContent>
      </Tabs>
      <div className="flex justify-between gap-3 pt-2">
        <SheetButton onClick={onBack} variant="secondary">← Back</SheetButton>
        <SheetButton onClick={onNext} disabled={!canComplete}>{!isAreteValid?`Arete must be ${getHighest()}`:remaining===0?"Complete Character →":`Spend ${remaining} more points`}</SheetButton>
      </div>
    </div>
  )
}

function CompleteGuidedStep({state,onBack,onClose}:{state:CharacterState;onBack:()=>void;onClose:()=>void}) {
  const router=useRouter()
  const {toast}=useToast()
  const [isSaving,setIsSaving]=useState(false)
  const [characterId,setCharacterId]=useState<string|null>(null)
  const calc=(cat:string,name:string)=>{
    if(cat==="attributes")return(state.attributes[name as keyof typeof state.attributes])+(state.freebieDots.attributes[name]||0)
    if(cat==="abilities")return(state.abilities[name as keyof typeof state.abilities])+(state.freebieDots.abilities[name]||0)
    if(cat==="spheres")return(state.spheres[name as keyof typeof state.spheres])+(state.freebieDots.spheres[name]||0)
    if(cat==="backgrounds")return(state.backgrounds[name]||0)+(state.freebieDots.backgrounds[name]||0)
    return 0
  }
  const save=async()=>{
    setIsSaving(true)
    try{
      const fa:any={};Object.keys(state.attributes).forEach(a=>{fa[a]=calc("attributes",a)})
      const fb:any={};Object.keys(state.abilities).forEach(a=>{fb[a]=calc("abilities",a)})
      const fs:any={};Object.keys(state.spheres).forEach(s=>{fs[s]=calc("spheres",s)})
      const fg:any={};Object.keys(state.backgrounds).forEach(b=>{fg[b]=calc("backgrounds",b)})
      const r=await fetch('/api/characters',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({
        name:state.name,player:state.player||"",chronicle:state.chronicle||"",nature:state.nature||"",
        demeanor:state.demeanor||"",essence:state.essence||"",faction:state.affiliation,sect:state.sect||"",
        concept:state.concept||"",attributes:fa,abilities:fb,spheres:fs,backgrounds:fg,
        specialties:state.specialties,arete:1+state.freebieDots.arete,willpower:5+state.freebieDots.willpower,
        freebieDots:state.freebieDots,merits:state.merits,flaws:state.flaws,avatar:""
      })})
      const d=await r.json()
      if(r.ok){setCharacterId(d.id);toast({title:"Character Saved!",description:`${state.name} has been added to your characters.`})}
      else toast({title:"Error",description:d.error||"Failed to save character",variant:"destructive"})
    }catch{toast({title:"Error",description:"Failed to save character. Please try again.",variant:"destructive"})}
    finally{setIsSaving(false)}
  }
  return(
    <div className="space-y-5 text-center">
      <div className="w-16 h-16 mx-auto rounded-full flex items-center justify-center" style={{background:'linear-gradient(135deg,#d4af37,#8b6914)'}}>
        <Check className="w-8 h-8" style={{color:'#2d1b4e'}}/>
      </div>
      <h2 className="text-2xl font-bold" style={{fontFamily:'Georgia,serif',color:'#4a2c2a'}}>Character Creation Complete!</h2>
      <p style={{color:'#6b4423'}}>{state.name||"Your character"} is ready to be saved.</p>
      {!characterId?(
        <div className="space-y-4">
          <button onClick={save} disabled={isSaving} className="w-full py-3 rounded font-bold text-lg disabled:opacity-50" style={{background:'linear-gradient(135deg,#d4af37,#8b6914)',color:'#2d1b4e'}}>
            {isSaving?"Saving…":"💾 Save Character"}
          </button>
        </div>
      ):(
        <div className="space-y-4">
          <p className="text-green-600">✓ Character saved successfully!</p>
          <div className="flex gap-3">
            <Link href={`/characters/${characterId}`} className="flex-1"><button className="w-full py-2 rounded border-2 font-semibold" style={{borderColor:'#4a2c2a',color:'#4a2c2a'}}>View Sheet</button></Link>
            <button onClick={onClose} className="flex-1 py-2 rounded border-2 font-semibold" style={{borderColor:'#8b4513',color:'#8b4513'}}>Close</button>
          </div>
        </div>
      )}
      <div className="grid grid-cols-2 gap-3 text-left text-xs mt-4">
        <div className="p-2 border rounded"><strong>Summary</strong><ul className="mt-1 space-y-1"><li>✓ Attributes: 15 dots</li><li>✓ Abilities: 27 dots</li><li>✓ Spheres: {Object.values(state.spheres).reduce((a,b)=>a+b,0)} dots</li><li>✓ Backgrounds: {Object.values(state.backgrounds).reduce((a,b)=>a+b,0)} dots</li><li>✓ Arete: {1+state.freebieDots.arete}</li></ul></div>
        <div className="p-2 border rounded"><strong>Freebies</strong><ul className="mt-1 space-y-1"><li>Merits: {state.merits.reduce((s,m)=>s+m.cost,0)} pts</li><li>Flaws: +{state.flaws.reduce((s,f)=>s+f.cost,0)} pts</li><li>Arete: {state.freebieDots.arete} dots</li></ul></div>
      </div>
      {!characterId&&<div className="flex justify-between gap-3"><SheetButton onClick={onBack} variant="secondary">← Back</SheetButton></div>}
    </div>
  )
}

// ── Background sub-components ─────────────────────────────────────────────────
function BackgroundRating({background,value,onChange}:{background:any;value:number;onChange:(v:number)=>void}) {
  const [show,setShow]=useState(false)
  return(
    <div className="border rounded p-2 transition-all" style={{borderColor:value>0?'#8b4513':'rgba(139,69,19,0.2)',background:value>0?'rgba(139,69,19,0.05)':'transparent'}}>
      <div className="flex items-center justify-between">
        <button onClick={()=>setShow(!show)} className="text-sm font-serif text-left flex-1" style={{color:'#4a2c2a'}}>{background.name}</button>
        <div className="flex gap-0.5 ml-4">{Array.from({length:5},(_,i)=>{const dv=i+1;const f=dv<=value;return<button key={i} type="button" onClick={()=>onChange(dv===value?0:dv)} className="w-4 h-4 rounded-full border-2 transition-all hover:scale-110" style={{borderColor:'#4a2c2a',backgroundColor:f?'#4a2c2a':'transparent'}}/>})}</div>
      </div>
      {show&&<div className="mt-2 pt-2 border-t text-xs" style={{borderColor:'rgba(139,69,19,0.2)',color:'#6b4423'}}>{background.description}</div>}
    </div>
  )
}

// =============================================================================
// GUIDED WIZARD — themed dialog shell (Stage 1)
// =============================================================================

interface GuidedStep {
  id: string; title: string; description: string
  component: (props:any)=>React.ReactNode
  canProceed: (state:CharacterState)=>boolean
}

function GuidedWizard({state,setState,open,onClose,setFreebiePoolAdjustment,freebiePoolAdjustment}:{
  state:CharacterState; setState:(s:CharacterState)=>void
  open:boolean; onClose:()=>void
  setFreebiePoolAdjustment:(n:number)=>void; freebiePoolAdjustment:number
}) {
  const [stepIndex,setStepIndex]=useState(0)

  const guidedSteps: GuidedStep[] = [
    {id:"name-concept-tradition",title:"Name, Concept & Tradition",description:"The foundation of your character.",component:NameConceptTraditionStep,canProceed:s=>!!s.name&&!!s.concept&&!!s.affiliation},
    {id:"nature-demeanor",title:"Nature & Demeanor",description:"Who you really are vs. how you appear.",component:NatureDemeanorStep,canProceed:s=>!!s.nature&&!!s.demeanor},
    {id:"essence-chronicle",title:"Essence, Chronicle & Sect",description:"Your magical essence and campaign details.",component:EssenceChronicleStep,canProceed:s=>!!s.essence&&!!s.chronicle},
    {id:"concept-refinement",title:"Refine Your Concept",description:"Tie everything together.",component:ConceptRefinementStep,canProceed:()=>true},
    {id:"attribute-priority",title:"Attribute Priority",description:"Assign Primary, Secondary, Tertiary to Physical, Social, Mental.",component:AttributePriorityStep,canProceed:s=>Object.values(s.attributePriorities).every(p=>p!==null)},
    {id:"attribute-assign",title:"Assign Attributes",description:"Spend your attribute dots.",component:AttributeAssignStep,canProceed:s=>{
      const gp=(cat:keyof typeof s.attributePriorities)=>{const p=s.attributePriorities[cat];return p==="primary"?7:p==="secondary"?5:p==="tertiary"?3:0}
      const gs=(cat:"physical"|"social"|"mental")=>{const a=cat==="physical"?["strength","dexterity","stamina"]:cat==="social"?["charisma","manipulation","appearance"]:["perception","intelligence","wits"];return a.reduce((sum,x)=>sum+(s.attributes[x as keyof typeof s.attributes]-1),0)}
      return gp("physical")-gs("physical")===0&&gp("social")-gs("social")===0&&gp("mental")-gs("mental")===0
    }},
    {id:"ability-priority",title:"Ability Priority",description:"Assign Primary, Secondary, Tertiary to Talents, Skills, Knowledges.",component:AbilityPriorityStep,canProceed:s=>Object.values(s.abilityPriorities).every(p=>p!==null)},
    {id:"ability-assign",title:"Assign Abilities",description:"Spend your ability dots (max 3 per ability).",component:AbilityAssignStep,canProceed:s=>{
      const gp=(cat:keyof typeof s.abilityPriorities)=>{const p=s.abilityPriorities[cat];return p==="primary"?13:p==="secondary"?9:p==="tertiary"?5:0}
      const ga=(cat:"talents"|"skills"|"knowledges")=>{const m={talents:["alertness","art","athletics","awareness","brawl","empathy","expression","intimidation","leadership","streetwise","subterfuge"],skills:["crafts","drive","etiquette","firearms","martialArts","meditation","melee","research","stealth","survival","technology"],knowledges:["academics","computer","cosmology","enigmas","esoterica","investigation","law","medicine","occult","politics","science"]};return(m as any)[cat].reduce((sum:number,ab:string)=>sum+s.abilities[ab as keyof typeof s.abilities],0)}
      return gp("talents")-ga("talents")===0&&gp("skills")-ga("skills")===0&&gp("knowledges")-ga("knowledges")===0
    }},
    {id:"arete-start",title:"Starting Arete",description:"Choose your character's starting Arete (costs freebie points).",component:(props:any)=><AreteStartStep {...props} setFreebiePoolAdjustment={setFreebiePoolAdjustment}/>,canProceed:()=>true},
    {id:"spheres",title:"Spheres",description:"Choose Affinity Sphere and spend 6 dots.",component:SpheresStep,canProceed:s=>Object.values(s.spheres).reduce((a,b)=>a+b,0)===6&&s.affinitySphere!==""},
    {id:"backgrounds",title:"Backgrounds",description:"Spend 7 dots on resources, allies, and advantages.",component:BackgroundsGuidedStep,canProceed:s=>Object.values(s.backgrounds).reduce((a,b)=>a+b,0)===7},
    {id:"freebies",title:"Freebie Points",description:"Spend 15 points to customize your character.",component:(props:any)=><FreebiesGuidedStep {...props} freebiePoolAdjustment={freebiePoolAdjustment}/>,canProceed:s=>{
      let sp=0;Object.values(s.freebieDots.attributes).forEach(d=>sp+=d*5);Object.values(s.freebieDots.abilities).forEach(d=>sp+=d*2);Object.values(s.freebieDots.spheres).forEach(d=>sp+=d*7);Object.values(s.freebieDots.backgrounds).forEach(d=>sp+=d);sp+=s.freebieDots.arete*4;sp+=s.freebieDots.willpower;s.merits.forEach(m=>sp+=Math.abs(m.cost))
      const fp=s.flaws.reduce((t,f)=>t+Math.abs(f.cost),0);const total=15+fp+freebiePoolAdjustment;const rem=total-sp
      const high=Math.max(...Object.values(s.spheres));const areteT=1+s.freebieDots.arete
      return rem===0&&areteT>=high
    }},
    {id:"complete",title:"Complete!",description:"Save your character and start playing.",component:(props:any)=><CompleteGuidedStep {...props} onClose={onClose}/>,canProceed:()=>true},
  ]

  const current=guidedSteps[stepIndex]
  const total=guidedSteps.length
  const handleNext=()=>{if(stepIndex+1<total)setStepIndex(stepIndex+1);else onClose()}
  const handleBack=()=>{if(stepIndex>0)setStepIndex(stepIndex-1)}

  // Step progress percentage
  const pct=Math.round(((stepIndex+1)/total)*100)

  // Category label for current step
  const category=STEP_CATEGORIES.find(c=>c.steps.includes(stepIndex))?.label||""

  return(
    <Dialog open={open} onOpenChange={isOpen=>{if(!isOpen)onClose()}}>
      <DialogContent
        className="sm:max-w-3xl max-h-[92vh] overflow-hidden flex flex-col p-0"
        style={{
          background:   "hsl(var(--card))",
          border:       "1px solid hsl(var(--primary)/0.35)",
          boxShadow:    "0 0 0 1px hsl(var(--primary)/0.12), 0 32px 64px rgba(0,0,0,0.65), inset 0 1px 0 hsl(var(--primary)/0.1)",
          borderRadius: "14px",
        }}
      >
        {/* Gold-to-purple hairline */}
        <div className="absolute top-0 left-0 right-0 h-[2px] rounded-t-[14px] pointer-events-none z-10" aria-hidden="true"
          style={{background:"linear-gradient(90deg,hsl(var(--accent)/0.7),hsl(var(--primary)/0.6) 30%,transparent 75%)"}}/>

        {/* ── Dialog header ── */}
        <DialogHeader className="px-6 pt-6 pb-0 shrink-0">
          {/* Category + step counter row */}
          <div className="flex items-center justify-between mb-2">
            <span className="font-serif text-[9px] uppercase tracking-[0.22em]" style={{color:"hsl(var(--primary)/0.55)"}}>
              {category}
            </span>
            <span className="font-mono text-[10px]" style={{color:"hsl(var(--primary)/0.45)"}}>
              {stepIndex+1} / {total}
            </span>
          </div>

          {/* Progress bar */}
          <div className="h-[3px] rounded-full overflow-hidden mb-4" style={{background:"hsl(var(--border)/0.4)"}}>
            <div className="h-full rounded-full transition-all duration-500"
              style={{
                width:`${pct}%`,
                background:pct===100
                  ?"linear-gradient(90deg,hsl(var(--accent)/0.8),hsl(var(--accent)))"
                  :"linear-gradient(90deg,hsl(var(--primary)/0.6),hsl(var(--primary)))",
                boxShadow:pct===100?"0 0 6px hsl(var(--accent)/0.5)":"0 0 6px hsl(var(--primary)/0.4)",
              }}
            />
          </div>

          <DialogTitle
            className="font-serif font-black uppercase text-primary"
            style={{fontSize:"clamp(1rem,3vw,1.25rem)",letterSpacing:"0.1em"}}
          >
            {current.title}
          </DialogTitle>
          <DialogDescription
            className="font-serif italic text-xs mt-1"
            style={{color:"hsl(var(--muted-foreground))"}}
          >
            {current.description}
          </DialogDescription>

          {/* Divider */}
          <div className="h-px mt-4" aria-hidden="true"
            style={{background:"linear-gradient(90deg,hsl(var(--primary)/0.3),transparent)"}}/>
        </DialogHeader>

        {/* ── Scrollable step content ── */}
        <div className="flex-1 overflow-y-auto px-6 py-5" style={{scrollbarWidth:"thin"}}>
          {current.component({
            state, setState,
            onNext:  handleNext,
            onBack:  handleBack,
            setFreebiePoolAdjustment,
            freebiePoolAdjustment,
            onClose,
          })}
        </div>
      </DialogContent>
    </Dialog>
  )
}

// =============================================================================
// MAIN PAGE — branded landing screen, guided wizard only
// =============================================================================

export default function CharacterGuidePage() {
  const [state,setState]=useState<CharacterState>(INITIAL_STATE)
  const [wizardOpen,setWizardOpen]=useState(false)
  const [freebiePoolAdjustment,setFreebiePoolAdjustment]=useState(0)

  // Derive a rough progress label for the landing screen
  const hasStarted=state.name.length>0

  const openWizard=()=>{
    // Reset freebie adjustment if starting fresh
    if(!hasStarted)setFreebiePoolAdjustment(0)
    setWizardOpen(true)
  }
  const resetAndStart=()=>{
    setState(INITIAL_STATE)
    setFreebiePoolAdjustment(0)
    setWizardOpen(true)
  }

  return(
    <>
      {/* ── Outer page — matches site shell ── */}
      <div className="min-h-screen relative z-[1] py-5 px-3 md:py-7 md:px-4 grimoire-bg">
        <div
          className="max-w-[900px] mx-auto bg-background rounded-xl overflow-hidden relative"
          style={{
            border:"1px solid hsl(var(--primary)/0.32)",
            boxShadow:"inset 0 1px 0 hsl(var(--primary)/0.12), 0 20px 60px hsl(var(--background)/0.8), 0 4px 24px rgba(0,0,0,0.45)",
          }}
        >
          {/* Corner accents */}
          {["-top-[6px] -left-[6px]","-top-[6px] -right-[6px]"].map((pos,i)=>(
            <div key={i} className={`absolute ${pos} text-primary z-10 text-xl pointer-events-none`}
              style={{filter:"drop-shadow(0 0 6px hsl(var(--primary)/0.6))"}} aria-hidden="true">◈</div>
          ))}

          {/* Top hairline */}
          <div className="h-px w-full pointer-events-none" aria-hidden="true"
            style={{background:"linear-gradient(90deg,hsl(var(--accent)/0.55) 0%,hsl(var(--primary)/0.5) 15%,hsl(var(--primary)/0.15) 55%,transparent 100%)"}}/>

          {/* ── Page header ── */}
          <div className="text-center px-8 pt-10 pb-8"
            style={{borderBottom:"1px solid hsl(var(--border)/0.5)"}}>
            <div className="mb-3">
              <span className="font-serif text-[10px] uppercase tracking-[0.3em]" style={{color:"hsl(var(--primary)/0.5)"}}>
                The Paradox Wheel
              </span>
            </div>
            <h1
              className="font-serif font-black uppercase text-primary"
              style={{fontSize:"clamp(1.6rem,5vw,2.8rem)",letterSpacing:"0.12em",textShadow:"0 0 40px hsl(var(--primary)/0.2)"}}
            >
              Character Creation
            </h1>
            <p className="font-serif italic mt-2 text-muted-foreground" style={{fontSize:"0.95rem"}}>
              Mage: The Ascension — Guided Awakening
            </p>

            {/* Decorative line */}
            <div className="flex items-center gap-3 mt-5 justify-center">
              <div className="h-px flex-1 max-w-[120px]" style={{background:"linear-gradient(90deg,transparent,hsl(var(--primary)/0.4))"}}/>
              <span className="text-primary text-lg" aria-hidden="true" style={{fontVariantEmoji:"text" as any}}>⚙&#xFE0E;</span>
              <div className="h-px flex-1 max-w-[120px]" style={{background:"linear-gradient(270deg,transparent,hsl(var(--primary)/0.4))"}}/>
            </div>
          </div>

          {/* ── Content area ── */}
          <div className="px-8 py-10"
            style={{backgroundImage:`url("data:image/svg+xml,%3Csvg width='40' height='40' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M40 0L0 0 0 40' fill='none' stroke='%237b5ea7' stroke-width='0.35' opacity='0.06'/%3E%3C/svg%3E")`}}>
            {!hasStarted ? (
              /* ── Fresh start state ── */
              <div className="space-y-8 text-center">
                <div className="max-w-lg mx-auto space-y-3">
                  <p className="font-serif text-foreground" style={{fontSize:"0.95rem",lineHeight:1.7}}>
                    This wizard will guide you through creating a Mage: The Ascension character step by step — with lore guidance, mechanical explanations, and contextual pop-ups at every stage.
                  </p>
                  <p className="font-serif text-muted-foreground" style={{fontSize:"0.85rem"}}>
                    13 steps · approximately 15–20 minutes
                  </p>
                </div>

                {/* What to expect — three feature chips */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-xl mx-auto">
                  {[
                    {icon:"✦", label:"Lore Guidance",  desc:"Blurbs for Traditions, Natures, Spheres"},
                    {icon:"◈", label:"Step by Step",   desc:"One decision at a time, never overwhelming"},
                    {icon:"✧", label:"Rules Explained", desc:"Points, costs, and limits shown in context"},
                  ].map(f=>(
                    <div key={f.label} className="rounded-lg p-4 text-center"
                      style={{background:"hsl(var(--card))",border:"1px solid hsl(var(--border)/0.5)"}}>
                      <div className="text-xl text-primary mb-2" aria-hidden="true" style={{fontVariantEmoji:"text" as any}}>{f.icon}&#xFE0E;</div>
                      <div className="font-serif text-[10px] uppercase tracking-[0.16em] text-primary mb-1">{f.label}</div>
                      <div className="text-xs text-muted-foreground font-serif">{f.desc}</div>
                    </div>
                  ))}
                </div>

                {/* CTA */}
                <button
                  type="button"
                  onClick={openWizard}
                  className="group relative overflow-hidden inline-flex items-center gap-2.5 rounded-full px-8 py-3.5 font-serif text-[11px] uppercase tracking-[0.2em] font-bold transition-all duration-200 hover:-translate-y-px active:translate-y-0"
                  style={{
                    background:"linear-gradient(135deg,hsl(var(--accent)) 0%,hsl(var(--accent)/0.82) 100%)",
                    color:"hsl(var(--accent-foreground))",
                    border:"none",
                    boxShadow:"0 0 0 1px hsl(var(--accent)/0.38), 0 6px 24px hsl(var(--accent)/0.3)",
                  }}
                >
                  <span className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" aria-hidden="true"
                    style={{background:"linear-gradient(105deg,transparent 25%,rgba(255,255,255,0.16) 50%,transparent 75%)"}}/>
                  <Sparkles className="relative w-4 h-4"/>
                  <span className="relative">Begin Awakening</span>
                </button>
              </div>
            ) : (
              /* ── In-progress state ── */
              <div className="space-y-6 text-center">
                <div>
                  <p className="font-serif text-xs uppercase tracking-[0.2em] text-muted-foreground mb-1">In Progress</p>
                  <h2 className="font-serif font-black uppercase text-primary" style={{fontSize:"1.4rem",letterSpacing:"0.1em"}}>
                    {state.name}
                  </h2>
                  {state.affiliation&&(
                    <span className="font-serif text-[9px] uppercase tracking-[0.2em] px-2 py-0.5 rounded-full mt-2 inline-block"
                      style={{color:"hsl(var(--primary)/0.7)",background:"hsl(var(--primary)/0.08)",border:"1px solid hsl(var(--primary)/0.18)"}}>
                      {state.affiliation}
                    </span>
                  )}
                </div>

                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <button type="button" onClick={openWizard}
                    className="group relative overflow-hidden inline-flex items-center gap-2 rounded-full px-6 py-2.5 font-serif text-[10px] uppercase tracking-[0.18em] font-bold transition-all duration-200 hover:-translate-y-px"
                    style={{background:"linear-gradient(135deg,hsl(var(--accent)),hsl(var(--accent)/0.82))",color:"hsl(var(--accent-foreground))",border:"none",boxShadow:"0 0 0 1px hsl(var(--accent)/0.38),0 4px 18px hsl(var(--accent)/0.25)"}}>
                    <Sparkles className="w-3.5 h-3.5"/>Continue Creation
                  </button>
                  <button type="button" onClick={resetAndStart}
                    className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full font-serif text-[10px] uppercase tracking-[0.18em] font-semibold transition-all duration-200 hover:bg-primary/[0.08] border border-transparent hover:border-primary/[0.18]"
                    style={{color:"hsl(var(--foreground)/0.55)"}}>
                    Start Over
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Bottom accent */}
          <div className="h-[2px] w-full pointer-events-none" aria-hidden="true"
            style={{background:"linear-gradient(90deg,hsl(var(--accent)/0.65) 0%,hsl(var(--primary)/0.5) 12%,hsl(var(--primary)/0.2) 50%,transparent 100%)"}}/>
        </div>
      </div>

      {/* ── Guided wizard dialog ── */}
      <GuidedWizard
        state={state}
        setState={setState}
        open={wizardOpen}
        onClose={()=>setWizardOpen(false)}
        setFreebiePoolAdjustment={setFreebiePoolAdjustment}
        freebiePoolAdjustment={freebiePoolAdjustment}
      />

      <Toaster/>
    </>
  )
}

// =============================================================================
// SHARED UI PRIMITIVES — unchanged from source
// =============================================================================

function SheetInput({label,value,onChange,placeholder}:{label:string;value:string;onChange:(v:string)=>void;placeholder?:string}) {
  return(
    <div>
      <Label className="text-xs uppercase tracking-wide" style={{color:'#4a2c2a'}}>{label}</Label>
      <Input value={value} onChange={e=>onChange(e.target.value)} placeholder={placeholder}
        className="border-b-2 border-t-0 border-x-0 rounded-none bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0"
        style={{borderColor:'#8b4513',color:'#4a2c2a'}}/>
    </div>
  )
}

function SheetSelect({label,value,onChange,options,placeholder}:{label:string;value:string;onChange:(v:string)=>void;options:string[];placeholder?:string}) {
  return(
    <div>
      <Label className="text-xs uppercase tracking-wide" style={{color:'#4a2c2a'}}>{label}</Label>
      <select value={value} onChange={e=>onChange(e.target.value)}
        className="w-full border-b-2 border-t-0 border-x-0 bg-transparent focus:outline-none focus:ring-0 p-2"
        style={{borderColor:'#8b4513',color:'#4a2c2a'}}>
        <option value="">{placeholder||'Select…'}</option>
        {options.map(o=><option key={o} value={o}>{o}</option>)}
      </select>
    </div>
  )
}

function SheetButton({onClick,disabled,children,variant="primary"}:{onClick:()=>void;disabled?:boolean;children:React.ReactNode;variant?:"primary"|"secondary"}) {
  return(
    <button type="button" onClick={onClick} disabled={disabled}
      className="w-full mt-4 py-2.5 px-4 flex items-center justify-center rounded font-bold transition-all disabled:cursor-not-allowed"
      style={{
        background:disabled?'rgba(139,69,19,0.3)':variant==="secondary"?'transparent':'linear-gradient(135deg,#d4af37,#8b6914)',
        color:disabled?'rgba(74,44,42,0.5)':variant==="secondary"?'#4a2c2a':'#2d1b4e',
        border:variant==="secondary"?'2px solid #8b4513':'none',
        fontFamily:'Georgia,serif',opacity:disabled?0.6:1,
      }}>
      {children}
    </button>
  )
}

function PrioritySelector({label,subtitle,selected,onSelect}:{label:string;subtitle:string;selected:Priority;onSelect:(p:Priority)=>void}) {
  const isAttr=subtitle.includes("Strength")||subtitle.includes("Charisma")||subtitle.includes("Perception")
  return(
    <div className="flex items-center justify-between p-4 border-2 rounded" style={{borderColor:'#8b4513'}}>
      <div className="flex-1"><h3 className="font-bold" style={{color:'#4a2c2a'}}>{label}</h3><p className="text-xs mt-1" style={{color:'#6b4423'}}>{subtitle}</p></div>
      <div className="flex gap-2">
        {(["primary","secondary","tertiary"] as const).map(p=>(
          <button key={p} onClick={()=>onSelect(p)}
            className={cn("px-4 py-2 rounded text-sm font-semibold transition-all",selected===p&&"shadow-lg")}
            style={{background:selected===p?'linear-gradient(135deg,#d4af37,#8b6914)':'transparent',border:selected===p?'none':'2px solid #8b4513',color:selected===p?'#2d1b4e':'#4a2c2a',opacity:selected===p?1:0.6}}>
            {isAttr?(p==="primary"?"7 dots":p==="secondary"?"5 dots":"3 dots"):(p==="primary"?"13 dots":p==="secondary"?"9 dots":"5 dots")}
          </button>
        ))}
      </div>
    </div>
  )
}

function AttributeSection({title,priority,remaining,total,children}:{title:string;priority:Priority;remaining:number;total:number;children:React.ReactNode}) {
  return(
    <div className="border-2 p-4 rounded" style={{borderColor:'#8b4513',background:'rgba(139,69,19,0.03)'}}>
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-bold text-lg" style={{color:'#4a2c2a'}}>{title}</h3>
        <div className="text-sm font-semibold px-3 py-1 rounded" style={{background:remaining===0?'#d4af37':'rgba(212,175,55,0.2)',color:'#4a2c2a'}}>{remaining} / {total} remaining</div>
      </div>
      <div className="space-y-1">{children}</div>
    </div>
  )
}

function AbilityColumn({title,priority,remaining,total,children}:{title:string;priority:Priority;remaining:number;total:number;children:React.ReactNode}) {
  return(
    <div>
      <div className="flex items-center justify-between mb-3 pb-2 border-b-2" style={{borderColor:'#8b4513'}}>
        <h3 className="font-bold" style={{color:'#4a2c2a'}}>{title}</h3>
        <div className="text-xs font-semibold px-2 py-1 rounded" style={{background:remaining===0?'#d4af37':'rgba(212,175,55,0.2)',color:'#4a2c2a'}}>{remaining}/{total}</div>
      </div>
      <div className="space-y-0.5">{children}</div>
    </div>
  )
}

function SheetDotRating({label,value,onChange,locked,maxDots=5,variant="attribute"}:{label:string;value:number;onChange:(v:number)=>void;locked?:boolean;maxDots?:number;variant?:"attribute"|"ability"|"sphere"|"arete"}) {
  const [hovered,setHovered]=useState<number|null>(null)
  const display=hovered!==null?hovered:value
  const col=variant==="ability"?"#daa520":variant==="sphere"?"#6b2d6b":variant==="arete"?"#d4af37":"#4a2c2a"
  return(
    <div className="flex items-center justify-between py-1">
      <span className="text-sm font-serif flex-1" style={{color:'#4a2c2a'}}>{label}</span>
      <div className="flex gap-0.5" onMouseLeave={()=>setHovered(null)}>
        {Array.from({length:maxDots},(_,i)=>{
          const dv=i+1;const filled=dv<=display;const isLocked=locked&&dv===1
          return(
            <button key={i} type="button"
              onClick={()=>{if(isLocked)return;if(locked&&dv===value)onChange(1);else onChange(dv===value?(locked?1:0):dv)}}
              onMouseEnter={()=>!isLocked&&setHovered(dv)}
              disabled={isLocked}
              className={cn("w-4 h-4 rounded-full border transition-all duration-200",!isLocked&&"hover:scale-110 cursor-pointer")}
              style={{borderColor:col,borderWidth:'2px',backgroundColor:filled?col:'transparent',opacity:isLocked?0.7:1}}>
              {isLocked&&<Lock className="w-2 h-2 m-auto" style={{color:variant==="sphere"?'#f5f0e8':'#d4af37'}}/>}
            </button>
          )
        })}
      </div>
    </div>
  )
}

function FreebieDotRating({label,baseDots,freebieDots,onAdd,onRemove,maxDots=5,cost}:{label:string;baseDots:number;freebieDots:number;onAdd:()=>void;onRemove:()=>void;maxDots?:number;cost:number}) {
  const total=baseDots+freebieDots
  return(
    <div className="flex items-center justify-between py-2 px-3 rounded hover:bg-accent/5 transition-colors">
      <span className="text-sm font-serif flex-1" style={{color:'#4a2c2a'}}>{label}</span>
      <div className="flex items-center gap-3">
        <div className="flex gap-1">
          {Array.from({length:maxDots},(_,i)=>{
            const dv=i+1;const isBase=dv<=baseDots;const isFree=dv>baseDots&&dv<=total
            return(
              <div key={i} className="w-5 h-5 rounded-full border-2 relative" style={{borderColor:'#4a2c2a',backgroundColor:isBase?'#4a2c2a':'transparent'}}>
                {isFree&&<><div className="absolute inset-0 rounded-full" style={{backgroundColor:'#4a2c2a'}}/><div className="absolute inset-0 rounded-full" style={{background:'linear-gradient(90deg,transparent 50%,#d4af37 50%)'}}/></>}
              </div>
            )
          })}
        </div>
        <div className="flex items-center gap-1">
          <button onClick={onRemove} disabled={freebieDots<=0} className="w-6 h-6 rounded flex items-center justify-center disabled:opacity-30 hover:scale-110" style={{background:'#8b4513',color:'#fff'}}><Minus className="w-3 h-3"/></button>
          <span className="text-xs font-mono w-8 text-center" style={{color:'#6b4423'}}>{cost}pt</span>
          <button onClick={onAdd} disabled={total>=maxDots} className="w-6 h-6 rounded flex items-center justify-center disabled:opacity-30 hover:scale-110" style={{background:'#d4af37',color:'#2d1b4e'}}><Plus className="w-3 h-3"/></button>
        </div>
      </div>
    </div>
  )
}
