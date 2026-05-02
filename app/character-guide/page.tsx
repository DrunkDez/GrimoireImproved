"use client"

import { useState, useEffect, useCallback, useMemo } from "react"
import { cn } from "@/lib/utils"
import { Lock, Check, Plus, Minus, Sparkles, Share2 } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
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
import DanteCodec from "@/app/codec-calls/dante-codec"
import TechnocracyCodec from "@/app/codec-calls/courage-code"
import CharacterTypeSelector from "@/app/codec-calls/Codec_Select"

// ── Types ─────────────────────────────────────────────────────────────────────
type Priority = "primary" | "secondary" | "tertiary" | null
type Faction  = "traditions" | "technocracy" | null

interface CharacterState {
  name: string; player: string; chronicle: string; nature: string; demeanor: string
  essence: string; affiliation: string; sect: string; concept: string
  faction: Faction
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
  affiliation:"", sect:"", concept:"", phase:"basics", faction: null,
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

// ── Static lore data — full Stage 3 content, CMS-overridable in Stage 7 ──────

const traditionBlurbs: Record<string, { short: string; long: string; affinitySphere: string }> = {
  "Akashic Brotherhood": {
    short: "Warrior-monks who channel enlightenment through martial discipline and meditative focus.",
    long: "The Akashic Brotherhood believe that Do — the martial art of existence — is the path to Awakening. Every movement, breath, and stillness is magic. They study ancient texts, practice meditation, and master combat not to destroy, but to perceive reality as it truly is: fluid, illusory, and mutable. They work closely with the Dreamspeakers and distrust technology.",
    affinitySphere: "Mind",
  },
  "Celestial Chorus": {
    short: "Faith-driven mages who hear the divine One Song and shape reality through prayer and devotion.",
    long: "The Celestial Chorus draw magic from a shared divine source — the One, God, Allah, the Tao — and weave it through ritual, prayer, and sacred music. They believe all religions point to the same truth and work to unite the faithful. Their magic is warm, communal, and morally anchored. They conflict with the Order of Hermes over formalism, and with the Euthanatos over their acceptance of suffering.",
    affinitySphere: "Prime",
  },
  "Cult of Ecstasy": {
    short: "Hedonists, artists, and time-seers who transcend the mundane through passion, sensation, and altered states.",
    long: "Where others seek control, the Cult of Ecstasy seeks to dissolve it. Through music, dance, drugs, sex, fasting, pain, or art, they push past the boundaries of the consensus and see what lies beyond. They perceive time as non-linear and can sense the strands of fate. Their magic is visceral, personal, and unpredictable — which makes them dangerous allies and fascinating enemies.",
    affinitySphere: "Time",
  },
  "Dreamspeakers": {
    short: "Spirit-walkers and shamans who bridge the worlds of the living, the dead, and the Umbra.",
    long: "The Dreamspeakers are the inheritors of shamanic and indigenous magical traditions from across the world. They communicate with spirits of land, ancestor, and beast. They walk the Umbra — the spirit world that mirrors physical reality — and negotiate with beings older than human memory. Often marginalised by the Council, they carry a deep distrust of European magical traditions and Technocratic 'progress'.",
    affinitySphere: "Spirit",
  },
  "Euthanatos": {
    short: "Mages of death and karma who believe in merciful endings and the purification of the cycle of rebirth.",
    long: "The Euthanatos believe death is not an ending but a transition — and sometimes, that a life must end so that the soul can continue its journey unimpeded. They are assassins, healers of the dying, and keepers of karmic balance. They track the corrupt and the malignant — those whose existence poisons the Wheel of reincarnation — and they are not afraid to act. Feared by many Traditions, respected by none who haven't needed them.",
    affinitySphere: "Entropy",
  },
  "Order of Hermes": {
    short: "Hermetic wizards who command reality through rigorous scholarship, ritual, and ancient formulae.",
    long: "The Order of Hermes trace their lineage back to the mages of ancient Alexandria and the mythic figure Hermes Trismegistus. They study the hidden correspondences of the universe — numbers, sigils, True Names, astrological alignments — and express magic through meticulous ritual. Proud, hierarchical, and prone to internal politics, they are nonetheless among the most knowledgeable mages alive. Their libraries are legendary; their egos are too.",
    affinitySphere: "Forces",
  },
  "Sons of Ether": {
    short: "Renegade scientists who reject consensus physics and work miracles through weird technology and mad inspiration.",
    long: "Expelled from the Technocracy for their belief in the luminiferous Ether, the Sons of Ether build raygun-toting robots, design impossible engines, and chart the geography of hollow earths. Their science doesn't follow the laws of the Consensus — it follows inspiration. Each Son (or Daughter) has their own theory of everything. They are brilliant, eccentric, and wonderfully unpredictable.",
    affinitySphere: "Matter",
  },
  "Verbena": {
    short: "Nature witches who draw power from blood, earth, moon, and the primal cycle of life and death.",
    long: "The Verbena are among the oldest Traditions, tracing their roots to the wise-women and witches of pre-Christian Europe. Their magic is blood-deep and earth-bound. They work through herbs, sacrifice, moon cycles, and the raw power of living things. They are fierce defenders of nature and equally fierce in personal relationships. They do not sanitise their practice — magic requires cost, and life requires death.",
    affinitySphere: "Life",
  },
  "Virtual Adepts": {
    short: "Cybermages who hack reality itself through data, code, and digital transcendence.",
    long: "The Virtual Adepts defected from the Technocracy when they realised information was more powerful than any weapon. They believe reality is fundamentally a system of data — and that with enough skill, any code can be rewritten. They work through computers, neural interfaces, cryptographic ritual, and internet-as-Umbra. Young, irreverent, and fiercely individualistic, they are the most tech-savvy Tradition and the most politically anarchic.",
    affinitySphere: "Correspondence",
  },
  "Hollow Ones": {
    short: "Gothic autodidacts who practice eclectic, death-tinged magic outside the formal Traditions.",
    long: "The Hollow Ones are not a true Tradition — they are a loose subculture of Orphan mages who share an aesthetic of melancholy, romanticism, and death. They scavenge practices from any source that works: ceremonial magic, folk witchcraft, voodoo, chaos theory. They are welcomed at the Council table but never fully trusted. Their power comes not from heritage but from personal truth — and that makes them both fragile and surprisingly dangerous.",
    affinitySphere: "Entropy",
  },
  "Orphan": {
    short: "Self-taught mages who Awakened without a mentor and walk their path alone.",
    long: "Orphans have no Tradition to guide them, no chantry to shelter them, and no lineage to validate them. They discovered their magic by accident or crisis and have pieced together their practice from whatever they could find. Some are raw and powerful; others are dangerously undisciplined. They are often recruited by Traditions who recognise their potential — or exploited by those who see their isolation as vulnerability.",
    affinitySphere: "Varies",
  },
  "Technocracy": {
    short: "The dominant order of reality — scientists, agents, and engineers who enforce the consensus and suppress the Traditions.",
    long: "The Technocracy believe they are saving humanity from chaos. They have spent centuries replacing superstition with science, and magic with predictable, controllable technology. To them, the Traditions are dangerous anarchists who would drag the world back into the Dark Ages. They are organised into Conventions (Progenitors, Iteration X, the NWO, Syndicate, Void Engineers) and have vast resources. Playing a Technocrat is playing the antagonist — but they have their own internal heroism.",
    affinitySphere: "Varies",
  },
  "Iteration X": {
    short: "Cyborg engineers who push human flesh toward mechanical perfection through augmentation and force.",
    long: "Iteration X believe that biology is a flawed prototype and technology is the correction. They build HIT Marks, design combat cyborgs, and pursue the ideal of a humanity upgraded beyond its own fragility. Cold, precise, and terrifyingly effective, they are the Technocracy's iron fist. Their internal debates about how much flesh is acceptable are more philosophical than they appear — and more dangerous.",
    affinitySphere: "Forces",
  },
  "New World Order": {
    short: "Agents, propagandists, and information controllers who shape what humanity believes is real.",
    long: "The New World Order understand that the most powerful weapon is not a gun or a drug — it is consensus. They control media, governments, educational systems, and the flow of information. Men in Black are their most visible face, but their reach extends into every institution that shapes what people accept as normal. They are the reason most humans never question reality. They consider this a kindness.",
    affinitySphere: "Mind",
  },
  "Progenitors": {
    short: "Bioscientists who reshape living matter, develop pharmaceuticals, and police the boundaries of life itself.",
    long: "The Progenitors are the Technocracy's doctors, geneticists, and biological engineers. They develop the drugs that keep the population calm, the treatments that cure disease, and the protocols that define what counts as a healthy human. They also breed Deviant-hunting organisms and develop biological countermeasures against Tradition magic. They see themselves as healers. Their critics see them as something else.",
    affinitySphere: "Life",
  },
  "Syndicate": {
    short: "Financial architects who control reality through capital, markets, and the quiet power of economic leverage.",
    long: "Money is a form of consensus magic, and the Syndicate have mastered it. They control banks, corporations, and the flow of resources that make the modern world function. They fund the other Conventions, manage the Technocracy's political relationships, and ensure that economic incentives always push humanity toward the consensus. They are the least dramatic Convention and arguably the most powerful.",
    affinitySphere: "Entropy",
  },
  "Void Engineers": {
    short: "Explorers and wardens of deep space, the Digital Web, and the boundaries of known reality.",
    long: "The Void Engineers were once the Technocracy's boldest dreamers — the ones who mapped the Umbra, charted deep space, and built the infrastructure of the Digital Web. What they found out there changed them. They have seen things beyond the Gauntlet that the other Conventions don't know about, and the knowledge has made them strange. Of all the Conventions, they are the most likely to question the Union's methods.",
    affinitySphere: "Correspondence",
  },
}

// ── Faction filter constants ───────────────────────────────────────────────────
const TRADITION_NAMES = [
  "Akashic Brotherhood","Celestial Chorus","Cult of Ecstasy","Dreamspeakers",
  "Euthanatos","Order of Hermes","Sons of Ether","Verbena","Virtual Adepts",
  "Hollow Ones","Orphan",
]
const CONVENTION_NAMES = [
  "Iteration X","New World Order","Progenitors","Syndicate","Void Engineers",
]

const archetypeDescriptions: Record<string, string> = {
  Architect:      "You build things meant to last — institutions, relationships, works of art — and draw meaning from seeing your creations endure. You are driven by legacy.",
  Autocrat:       "You need to be in control. Not for cruelty, but because you genuinely believe things work better when you are in charge. Leadership isn't a choice for you — it's a compulsion.",
  "Bon Vivant":   "Life is short; pleasure is real. You live for enjoyment and see no virtue in suffering. Others may call you hedonistic, but you call them jealous.",
  Bravo:          "Strength impresses you, and you use your own to get what you want. You're not necessarily cruel — just direct, physical, and easily bored by those who won't fight back.",
  Caregiver:      "You find meaning in nurturing others. Their wellbeing is your priority, sometimes to the point of neglecting yourself. You carry the weight of people who rarely thank you.",
  Celebrant:      "You have found something to believe in — a cause, an art form, a person — and your devotion to it gives your life meaning. Others may not share your passion, but they can't deny its intensity.",
  Competitor:     "Everything is a game, and games are meant to be won. You are driven by the need to be best — not to defeat others, but to measure yourself against a standard that keeps rising.",
  Conformist:     "You follow strong leaders and find comfort in belonging to a group. This isn't weakness — it's a survival strategy that has kept communities together since the beginning of human memory.",
  Conniver:       "You work angles. Why do something the hard way when the right word in the right ear gets it done faster? You are not dishonest — you are efficient.",
  Critic:         "You have high standards and the courage to say when they aren't being met. You are honest to the point of harshness and see it as a kindness. Most people disagree.",
  Curmudgeon:     "The world irritates you. It has earned this. You are sharp, cynical, and almost always right — which only makes it worse.",
  Deviant:        "Society's rules were never made for you, and you stopped pretending otherwise. You live outside the lines and find freedom there, even when it costs you.",
  Director:       "You see the shape of things as they should be and spend your energy moving people into the right positions. You are a strategist, not a tyrant — but the line is thinner than you'd admit.",
  Fanatic:        "You have a cause, and it consumes you. Everything else is secondary. Others may call this dangerous; you call it clarity.",
  Gallant:        "Life is performance, and you are the star. You love to be seen, admired, and remembered. The audience doesn't know it's an audience — but you always do.",
  Judge:          "You weigh evidence, consider all sides, and reach a verdict. You are fair to a fault and rarely wrong, which means you rarely doubt yourself either.",
  Loner:          "People drain you. Solitude restores you. You work better alone, think better alone, and honestly prefer it. Relationships are obligations you accept reluctantly.",
  Martyr:         "You sacrifice yourself — your comfort, your safety, your future — for what you believe in. Others may benefit; you rarely do. You have made peace with this.",
  Masochist:      "You push against your own limits, physical or emotional, and find out who you are in the breaking. This is not self-destruction — it is self-knowledge at its most brutal.",
  Monster:        "You have accepted what you are. Others may see a predator; you see clarity. You act on what you want without the pretence of morality. This makes you honest, in your way.",
  Pedagogue:      "Teaching is your calling. You have knowledge and you cannot rest until you've passed it on. The quality of your students reflects on you — which means you expect a lot.",
  Penitent:       "You have done something you cannot forgive, and everything since is an attempt to balance that ledger. You may never succeed. You try anyway.",
  Perfectionist:  "You have a vision of how things should be done, and anything less is a failure. Your standards exhaust the people around you. They also produce extraordinary results.",
  Rebel:          "Authority is a problem to be solved. You question everything and accept nothing on faith alone. This makes you difficult to lead — and very useful when the leader is wrong.",
  Rogue:          "You look out for yourself, and you are honest about it. This isn't selfishness — it's a clear-eyed recognition that nobody else will do it for you.",
  Sage:           "Wisdom is your currency. You accumulate knowledge, perspective, and patience, and you spend them carefully. You watch more than you speak, and when you speak, people listen.",
  Scientist:      "Everything can be understood if you ask the right questions and apply the right method. You trust evidence over authority and process over intuition.",
  Sociopath:      "You do not feel what others feel, and you have learned to simulate it well enough to move through the world undetected. You use people as tools. You are very good at it.",
  Survivor:       "You have outlasted things that should have killed you, and you intend to keep doing so. Adaptability, pragmatism, and a very high pain threshold are your defining traits.",
  "Thrill-Seeker": "The rush is the thing. Fear, speed, danger — these are where you feel most alive. Safety is a kind of slow death, and you want no part of it.",
  Traditionalist: "The old ways are old because they worked. You distrust change for its own sake and find continuity meaningful. Others may call you conservative; you call them rootless.",
  Trickster:      "Reality is too serious to be taken seriously. You puncture pretension, expose hypocrisy, and find truth in absurdity. The joke is the point — sometimes.",
  Visionary:      "You can see what could be, and you find the gap between that and what is almost unbearable. You work toward futures others can't yet imagine. Some of them will even thank you.",
}

const natureDemeanorOptions = Object.keys(archetypeDescriptions)

const essenceOptions = [
  {
    value:       "Dynamic",
    description: "You are a force of change. Dynamic mages are creative, restless, and revolutionary — they see what could be and bend reality toward it. They are often at odds with those who would preserve the status quo, and they burn brightly, sometimes too brightly.",
    keyword:     "Change",
  },
  {
    value:       "Pattern",
    description: "You are a force of structure. Pattern mages preserve, organise, and maintain — they see the beauty in systems and the danger in entropy. They are steady, reliable, and sometimes inflexible. They build the institutions that outlast their founders.",
    keyword:     "Order",
  },
  {
    value:       "Primordial",
    description: "You are a force of nature. Primordial mages work on instinct, tapping into drives older than civilisation. They are visceral, authentic, and difficult to manipulate because they act from the gut rather than the head. They are rare and often unnerving to other mages.",
    keyword:     "Instinct",
  },
  {
    value:       "Questing",
    description: "You are a force of seeking. Questing mages are on a journey — spiritual, intellectual, or literal — and find meaning in the pursuit rather than the destination. They evolve constantly and rarely stay in one place, one belief, or one relationship for long.",
    keyword:     "Growth",
  },
]

const sphereData: Record<string, { short: string; long: string }> = {
  correspondence: {
    short: "Space, distance, and location",
    long:  "Correspondence is the Sphere of space and connectivity. At low levels it lets you sense across distance; at higher levels you can teleport, create portals, and exist in multiple places simultaneously. Virtual Adepts favour it — for them, it is the architecture of the network made real.",
  },
  entropy: {
    short: "Chaos, probability, and decay",
    long:  "Entropy governs the tendency of all things to fall apart — and the patterns hidden within that falling. At low levels you sense flaws and weaknesses, read the strands of fate; at higher levels you can accelerate decay, manipulate probability, and unravel structures. The Euthanatos consider it sacred.",
  },
  forces: {
    short: "Energy, fire, and the physical world",
    long:  "Forces controls the energies of the physical world: fire, electricity, gravity, light, sound, and kinetic force. It is one of the most immediately dramatic Spheres and one of the most dangerous. The Order of Hermes and Sons of Ether both favour it, for opposite aesthetic reasons.",
  },
  life: {
    short: "Living things, healing, and transformation",
    long:  "Life governs all living matter — from bacteria to human beings. At low levels you can read biological states; at higher levels you can heal, reshape, or corrupt living flesh. The Verbena treat it as the most sacred of the Spheres. It is also the most viscerally unsettling in the wrong hands.",
  },
  matter: {
    short: "Inanimate substances and transmutation",
    long:  "Matter controls non-living physical substances — stone, metal, water, air, plastic. It allows transmutation, the creation of new materials, and the destruction of existing ones. The Sons of Ether are drawn to it for its alchemical possibilities. Combined with Life, almost anything becomes possible.",
  },
  mind: {
    short: "Thought, consciousness, and perception",
    long:  "Mind is the Sphere of consciousness, thought, and perception. At low levels you can read surface emotions or project your consciousness; at higher levels you can rewrite memories, create telepathic links, and enter the dreams of others. The Akashic Brotherhood consider it the deepest Sphere — the place where self and reality finally meet.",
  },
  prime: {
    short: "Raw magic and Quintessence",
    long:  "Prime is the study of Quintessence — the raw material of magic itself, the fifth essence that underlies all reality. Every magical effect requires Prime to manifest on some level. It is the Sphere that lets you empower objects, create magical constructs, and understand the fundamental nature of the Awakened. The Celestial Chorus see it as the closest thing to the divine.",
  },
  spirit: {
    short: "The Umbra, spirits, and the dead",
    long:  "Spirit governs the relationship between the physical world and the Umbra — the spirit realm that mirrors it. At low levels you can sense nearby spirits; at higher levels you can step sideways into the Umbra, communicate with and command spirits, and pierce the Gauntlet at will. The Dreamspeakers built their entire practice around this Sphere.",
  },
  time: {
    short: "Temporal perception and manipulation",
    long:  "Time governs perception of and travel through the fourth dimension. At low levels you sense the past and future as impressions; at higher levels you can slow time, replay events, and eventually step into the timestream itself — with all the paradoxes that entails. The Cult of Ecstasy experience time as fluid and favour this Sphere above all.",
  },
}

const STEP_CATEGORIES = [
  {label:"Identity",   steps:[0,1,2,3]},
  {label:"Attributes", steps:[4,5]},
  {label:"Abilities",  steps:[6,7]},
  {label:"Magic",      steps:[8,9]},
  {label:"Finishing",  steps:[10,11,12]},
]

// =============================================================================
// CMS HOOKS - Fetch content from API with fallback
// =============================================================================

interface CMSContent {
  concept?: string
  attributes?: string
  abilities?: string
  spheres?: string
  backgrounds?: string
  freebies?: string
}

const defaultGuidanceTexts: Record<string, string> = {
  'name-concept-tradition': "<p><strong>Name:</strong> Choose something evocative — gothic, mythic, or grounded in your character's cultural background. The World of Darkness rewards names that carry weight.</p><p><strong>Concept:</strong> A two-to-four-word phrase that captures your character's essence — their role in the world before magic enters the picture (e.g., \"Grieving Forensic Pathologist\", \"Hacker on the Run\", \"Country Priest with Doubts\").</p><p><strong>Tradition:</strong> The magical order or paradigm your character belongs to. It shapes <em>how</em> you work magic — your style, your community, and your enemies.</p>",
  'nature-demeanor': "<p><strong>Nature</strong> is your character's true inner self — the core of who they are when no one is watching. It reflects what genuinely motivates them at the deepest level.</p><p><strong>Demeanor</strong> is the mask they show the world. It may be completely different from their Nature, or nearly identical. The tension between the two is often where the most interesting roleplaying lives.</p><p><em>Read the description under each selection before choosing — these are more than labels.</em></p>",
  'essence-chronicle': "<p><strong>Essence</strong> is your character's fundamental magical nature — the cosmic principle they most embody. It's less about what you believe and more about what you <em>are</em> at the soul-level.</p><p><strong>Chronicle</strong> is the name of your campaign or story. Your Storyteller will usually provide this.</p><p><strong>Sect</strong> (optional) is a sub-group within your Tradition — a specific chantry, a philosophical school, or a regional chapter.</p>",
  'attribute-priority': "<p><strong>Attributes</strong> are your character's innate capabilities. You have three categories: Physical, Social, Mental.</p><p>Assign <strong>Primary (7 dots)</strong>, <strong>Secondary (5 dots)</strong>, and <strong>Tertiary (3 dots)</strong> to the three categories.</p><p>Each attribute starts at 1 dot. You'll spend the additional dots in the next step.</p>",
  'attribute-assign': "<p>Click dots to assign attribute points. Each attribute already starts at 1 — dots above the first cost from your priority budget.</p>",
  'ability-priority': "<p><strong>Abilities</strong> represent learned skills and knowledge — Talents (innate), Skills (trained), and Knowledges (academic).</p><p>Assign <strong>Primary (13 dots)</strong>, <strong>Secondary (9 dots)</strong>, and <strong>Tertiary (5 dots)</strong>.</p><p>No ability may exceed 3 dots during character creation.</p>",
  'ability-assign': "<p>Assign your ability dots. Each ability can have at most <strong>3 dots</strong> during creation. Click a filled dot to clear it back to 0.</p>",
  'arete-start': "<p><strong>Arete</strong> is your character's magical enlightenment — it determines how many dice you roll for magic and what level of effects you can attempt. Most starting characters begin at Arete 1.</p><p>Your Storyteller may allow you to start higher, but it costs freebie points. Discuss this before making your choice.</p>",
  'spheres': "<p><strong>Spheres</strong> are the nine domains of magical reality. Your Tradition grants you an <strong>Affinity Sphere</strong> — you must take at least 1 dot in it.</p><p>You have <strong>6 total dots</strong> across all Spheres (max 3 per Sphere). The Affinity Sphere uses 1 of those dots, leaving 5 to distribute freely.</p><p>Click a sphere name in the dot grid to read its description.</p>",
  'backgrounds': "<p><strong>Backgrounds</strong> represent your character's resources, allies, and supernatural advantages outside raw power.</p><p>You have <strong>7 dots</strong> to spend across any backgrounds (max 5 per background).</p>",
  'freebies': "<p><strong>Freebie Points</strong> let you further customize your character. You start with 15, plus up to 7 from Flaws.</p>",
}

// =============================================================================
// GUIDED STEP COMPONENTS
// =============================================================================

function NameConceptTraditionStep({ state, setState, onNext, cmsContent, isLoadingCMS }: {
  state: CharacterState; setState: (s: CharacterState) => void; onNext: () => void
  cmsContent?: string | null; isLoadingCMS?: boolean
}) {
  const tradition = traditionBlurbs[state.affiliation] || null
  const guidanceHtml = cmsContent || defaultGuidanceTexts['name-concept-tradition']

  // Filter the tradition list based on faction chosen at the selector screen
  const availableTraditions = Object.keys(traditionBlurbs).filter(t =>
    state.faction === "technocracy"
      ? CONVENTION_NAMES.includes(t)
      : TRADITION_NAMES.includes(t)
  )

  const selectorLabel = state.faction === "technocracy" ? "Convention" : "Tradition"

  return (
    <div className="space-y-5">
      <GuidanceBox>
        {isLoadingCMS
          ? <div className="animate-pulse h-20 bg-primary/10 rounded" />
          : <div dangerouslySetInnerHTML={{ __html: guidanceHtml }} />}
      </GuidanceBox>
      <SheetInput label="Character Name" value={state.name} onChange={v=>setState({...state,name:v})} placeholder="e.g., Lilith Vance, Tomás de la Cruz, Sister Miriam"/>
      <SheetInput label="Concept" value={state.concept} onChange={v=>setState({...state,concept:v})} placeholder="e.g., Grieving Forensic Pathologist"/>
      <div className="space-y-2">
        <SheetLabel>{selectorLabel} / Affiliation</SheetLabel>
        <select value={state.affiliation} onChange={e=>setState({...state,affiliation:e.target.value})}
          className="w-full rounded-md px-3 py-2 text-sm font-serif"
          style={{background:"hsl(var(--background)/0.6)",border:"1px solid hsl(var(--border)/0.7)"}}
          onFocus={e=>{e.currentTarget.style.borderColor="hsl(var(--primary)/0.55)";e.currentTarget.style.boxShadow="0 0 0 2px hsl(var(--primary)/0.12)"}}
          onBlur={e=>{e.currentTarget.style.borderColor="hsl(var(--border)/0.7)";e.currentTarget.style.boxShadow="none"}}>
          <option value="">— Select a {selectorLabel.toLowerCase()} —</option>
          {availableTraditions.map(t=><option key={t} value={t}>{t}</option>)}
        </select>
        {tradition && (
          <div className="rounded-md overflow-hidden" style={{border:"1px solid hsl(var(--border)/0.5)"}}>
            <div className="px-3 py-2 text-xs italic font-serif" style={{background:"hsl(var(--primary)/0.06)",color:"hsl(var(--foreground)/0.7)"}}>{tradition.short}</div>
            <div className="px-3 py-3 text-xs leading-relaxed font-serif" style={{color:"hsl(var(--foreground)/0.85)"}}>{tradition.long}</div>
            {tradition.affinitySphere !== "Varies" && (
              <div className="px-3 py-2 text-xs font-serif font-semibold" style={{background:"hsl(var(--primary)/0.08)",color:"hsl(var(--primary))",borderTop:"1px solid hsl(var(--primary)/0.15)"}}>
                ✦ Affinity Sphere: {tradition.affinitySphere}
              </div>
            )}
          </div>
        )}
      </div>
      <SheetButton onClick={onNext} disabled={!state.name||!state.concept||!state.affiliation}>Next: Nature & Demeanor →</SheetButton>
    </div>
  )
}

function NatureDemeanorStep({ state, setState, onNext, onBack, cmsContent, isLoadingCMS }: {
  state: CharacterState; setState: (s: CharacterState) => void; onNext: () => void; onBack: () => void
  cmsContent?: string | null; isLoadingCMS?: boolean
}) {
  const guidanceHtml = cmsContent || defaultGuidanceTexts['nature-demeanor']
  return (
    <div className="space-y-5">
      <GuidanceBox>
        {isLoadingCMS
          ? <div className="animate-pulse h-16 bg-primary/10 rounded" />
          : <div dangerouslySetInnerHTML={{ __html: guidanceHtml }} />}
      </GuidanceBox>
      <div className="space-y-1.5">
        <SheetLabel>Nature — your true self</SheetLabel>
        <select value={state.nature} onChange={e=>setState({...state,nature:e.target.value})}
          className="w-full rounded-md px-3 py-2 text-sm font-serif"
          style={{background:"hsl(var(--background)/0.6)",border:"1px solid hsl(var(--border)/0.7)"}}
          onFocus={e=>{e.currentTarget.style.borderColor="hsl(var(--primary)/0.55)";e.currentTarget.style.boxShadow="0 0 0 2px hsl(var(--primary)/0.12)"}}
          onBlur={e=>{e.currentTarget.style.borderColor="hsl(var(--border)/0.7)";e.currentTarget.style.boxShadow="none"}}>
          <option value="">— Select a nature —</option>
          {natureDemeanorOptions.map(o=><option key={o} value={o}>{o}</option>)}
        </select>
        {state.nature && archetypeDescriptions[state.nature] && <LoreBox>{archetypeDescriptions[state.nature]}</LoreBox>}
      </div>
      <div className="space-y-1.5">
        <SheetLabel>Demeanor — the face you show</SheetLabel>
        <select value={state.demeanor} onChange={e=>setState({...state,demeanor:e.target.value})}
          className="w-full rounded-md px-3 py-2 text-sm font-serif"
          style={{background:"hsl(var(--background)/0.6)",border:"1px solid hsl(var(--border)/0.7)"}}
          onFocus={e=>{e.currentTarget.style.borderColor="hsl(var(--primary)/0.55)";e.currentTarget.style.boxShadow="0 0 0 2px hsl(var(--primary)/0.12)"}}
          onBlur={e=>{e.currentTarget.style.borderColor="hsl(var(--border)/0.7)";e.currentTarget.style.boxShadow="none"}}>
          <option value="">— Select a demeanor —</option>
          {natureDemeanorOptions.map(o=><option key={o} value={o}>{o}</option>)}
        </select>
        {state.demeanor && archetypeDescriptions[state.demeanor] && <LoreBox>{archetypeDescriptions[state.demeanor]}</LoreBox>}
      </div>
      {state.nature && state.demeanor && state.nature !== state.demeanor && (
        <div className="text-xs px-3 py-2.5 rounded-md font-serif"
          style={{background:"hsl(var(--primary)/0.07)",color:"hsl(var(--primary))",border:"1px solid hsl(var(--primary)/0.18)"}}>
          <strong>Note:</strong> Your Nature ({state.nature}) and Demeanor ({state.demeanor}) differ — which means your character shows one face to the world while carrying another inside. This gap is where roleplaying gold lives.
        </div>
      )}
      <div className="flex justify-between gap-3">
        <SheetButton onClick={onBack} variant="secondary">← Back</SheetButton>
        <SheetButton onClick={onNext} disabled={!state.nature||!state.demeanor}>Next: Essence & Chronicle →</SheetButton>
      </div>
    </div>
  )
}

function EssenceChronicleStep({ state, setState, onNext, onBack, cmsContent, isLoadingCMS }: {
  state: CharacterState; setState: (s: CharacterState) => void; onNext: () => void; onBack: () => void
  cmsContent?: string | null; isLoadingCMS?: boolean
}) {
  const guidanceHtml = cmsContent || defaultGuidanceTexts['essence-chronicle']
  return (
    <div className="space-y-5">
      <GuidanceBox>
        {isLoadingCMS
          ? <div className="animate-pulse h-20 bg-primary/10 rounded" />
          : <div dangerouslySetInnerHTML={{ __html: guidanceHtml }} />}
      </GuidanceBox>
      <div className="space-y-2">
        <SheetLabel>Essence</SheetLabel>
        <div className="grid grid-cols-2 gap-2">
          {essenceOptions.map(opt=>{
            const on = state.essence === opt.value
            return (
              <button key={opt.value} type="button" onClick={()=>setState({...state,essence:opt.value})}
                className="text-left p-3 rounded-lg transition-all duration-200"
                style={{background:on?"hsl(var(--primary)/0.1)":"hsl(var(--card))",border:on?"1px solid hsl(var(--primary)/0.5)":"1px solid hsl(var(--border)/0.5)"}}>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-serif font-bold text-sm text-primary">{opt.value}</span>
                  <span className="text-[9px] uppercase tracking-widest px-1.5 py-0.5 rounded-full font-bold font-serif"
                    style={{background:on?"hsl(var(--primary))":"hsl(var(--border)/0.5)",color:on?"hsl(var(--card))":"hsl(var(--muted-foreground))"}}>
                    {opt.keyword}
                  </span>
                </div>
                <p className="text-xs leading-relaxed font-serif" style={{color:"hsl(var(--foreground)/0.7)"}}>{opt.description}</p>
              </button>
            )
          })}
        </div>
      </div>
      <SheetInput label="Chronicle" value={state.chronicle} onChange={v=>setState({...state,chronicle:v})} placeholder="e.g., The Ascension War, Shattered Mirror"/>
      <SheetInput label="Sect (optional)" value={state.sect} onChange={v=>setState({...state,sect:v})} placeholder="e.g., House Bonisagus, The Akashayana"/>
      <div className="flex justify-between gap-3">
        <SheetButton onClick={onBack} variant="secondary">← Back</SheetButton>
        <SheetButton onClick={onNext} disabled={!state.essence||!state.chronicle}>Next: Refine Concept →</SheetButton>
      </div>
    </div>
  )
}

function ConceptRefinementStep({ state, setState, onNext, onBack }: { state: CharacterState; setState: (s: CharacterState) => void; onNext: () => void; onBack: () => void }) {
  return (
    <div className="space-y-5">
      <GuidanceBox>
        <p>Now that you have a Tradition, Nature, and Essence, you might want to refine your character concept.</p>
        <p>For example: <em>"A Virtual Adept hacker who uses her skills to fight the Technocracy, but her Caregiver nature makes her protect the innocent."</em></p>
      </GuidanceBox>
      <SheetInput label="Refined Concept (optional)" value={state.concept} onChange={v=>setState({...state,concept:v})} placeholder="You can update your concept here"/>
      <div className="flex justify-between gap-3">
        <SheetButton onClick={onBack} variant="secondary">← Back</SheetButton>
        <SheetButton onClick={onNext}>Next: Attribute Priority →</SheetButton>
      </div>
    </div>
  )
}

function AttributePriorityStep({ state, setState, onNext, onBack, cmsContent, isLoadingCMS }: {
  state: CharacterState; setState: (s: CharacterState) => void; onNext: () => void; onBack: () => void
  cmsContent?: string | null; isLoadingCMS?: boolean
}) {
  const setPriority=(category:keyof CharacterState["attributePriorities"],priority:Priority)=>{const n={...state.attributePriorities};Object.keys(n).forEach(k=>{if(n[k as keyof typeof n]===priority)n[k as keyof typeof n]=null});n[category]=priority;setState({...state,attributePriorities:n})}
  const allSelected=Object.values(state.attributePriorities).every(p=>p!==null)
  const guidanceHtml = cmsContent || defaultGuidanceTexts['attribute-priority']
  return (
    <div className="space-y-5">
      <GuidanceBox>{isLoadingCMS?<div className="animate-pulse h-16 bg-primary/10 rounded"/>:<div dangerouslySetInnerHTML={{__html:guidanceHtml}}/>}</GuidanceBox>
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

function AttributeAssignStep({ state, setState, onNext, onBack, cmsContent, isLoadingCMS }: {
  state: CharacterState; setState: (s: CharacterState) => void; onNext: () => void; onBack: () => void
  cmsContent?: string | null; isLoadingCMS?: boolean
}) {
  const getPoints=(cat:keyof typeof state.attributePriorities)=>{const p=state.attributePriorities[cat];return p==="primary"?7:p==="secondary"?5:p==="tertiary"?3:0}
  const getAttrs=(cat:"physical"|"social"|"mental"):(keyof typeof state.attributes)[]=>{if(cat==="physical")return["strength","dexterity","stamina"];if(cat==="social")return["charisma","manipulation","appearance"];return["perception","intelligence","wits"]}
  const getSpent=(cat:keyof typeof state.attributePriorities)=>getAttrs(cat as any).reduce((s,a)=>s+(state.attributes[a]-1),0)
  const getRemaining=(cat:keyof typeof state.attributePriorities)=>getPoints(cat)-getSpent(cat)
  const setVal=(attr:keyof typeof state.attributes,value:number)=>{if(value<1)return;let cat:"physical"|"social"|"mental"="physical";if(["charisma","manipulation","appearance"].includes(attr))cat="social";if(["perception","intelligence","wits"].includes(attr))cat="mental";const diff=value-state.attributes[attr];if(diff>getRemaining(cat))return;setState({...state,attributes:{...state.attributes,[attr]:value}})}
  const allDone=getRemaining("physical")===0&&getRemaining("social")===0&&getRemaining("mental")===0
  const guidanceHtml = cmsContent || defaultGuidanceTexts['attribute-assign']
  return (
    <div className="space-y-4">
      <GuidanceBox>{isLoadingCMS?<div className="animate-pulse h-12 bg-primary/10 rounded"/>:<div dangerouslySetInnerHTML={{__html:guidanceHtml}}/>}</GuidanceBox>
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

function AbilityPriorityStep({ state, setState, onNext, onBack, cmsContent, isLoadingCMS }: {
  state: CharacterState; setState: (s: CharacterState) => void; onNext: () => void; onBack: () => void
  cmsContent?: string | null; isLoadingCMS?: boolean
}) {
  const setPriority=(cat:keyof CharacterState["abilityPriorities"],priority:Priority)=>{const n={...state.abilityPriorities};Object.keys(n).forEach(k=>{if(n[k as keyof typeof n]===priority)n[k as keyof typeof n]=null});n[cat]=priority;setState({...state,abilityPriorities:n})}
  const allSelected=Object.values(state.abilityPriorities).every(p=>p!==null)
  const guidanceHtml = cmsContent || defaultGuidanceTexts['ability-priority']
  return (
    <div className="space-y-5">
      <GuidanceBox>{isLoadingCMS?<div className="animate-pulse h-20 bg-primary/10 rounded"/>:<div dangerouslySetInnerHTML={{__html:guidanceHtml}}/>}</GuidanceBox>
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

function AbilityAssignStep({ state, setState, onNext, onBack, cmsContent, isLoadingCMS }: {
  state: CharacterState; setState: (s: CharacterState) => void; onNext: () => void; onBack: () => void
  cmsContent?: string | null; isLoadingCMS?: boolean
}) {
  const getPoints=(cat:keyof typeof state.abilityPriorities)=>{const p=state.abilityPriorities[cat];return p==="primary"?13:p==="secondary"?9:p==="tertiary"?5:0}
  const getAbils=(cat:"talents"|"skills"|"knowledges"):(keyof typeof state.abilities)[]=>{if(cat==="talents")return["alertness","art","athletics","awareness","brawl","empathy","expression","intimidation","leadership","streetwise","subterfuge"];if(cat==="skills")return["crafts","drive","etiquette","firearms","martialArts","meditation","melee","research","stealth","survival","technology"];return["academics","computer","cosmology","enigmas","esoterica","investigation","law","medicine","occult","politics","science"]}
  const getSpent=(cat:keyof typeof state.abilityPriorities)=>getAbils(cat as any).reduce((s,a)=>s+state.abilities[a],0)
  const getRemaining=(cat:keyof typeof state.abilityPriorities)=>getPoints(cat)-getSpent(cat)
  const setVal=(ability:keyof typeof state.abilities,value:number)=>{if(value<0||value>3)return;let cat:"talents"|"skills"|"knowledges"="talents";if(getAbils("skills").includes(ability))cat="skills";if(getAbils("knowledges").includes(ability))cat="knowledges";const diff=value-state.abilities[ability];if(diff>getRemaining(cat))return;setState({...state,abilities:{...state.abilities,[ability]:value}})}
  const fmt=(a:string)=>a.replace(/([A-Z])/g,' $1').replace(/^./,s=>s.toUpperCase()).trim()
  const allDone=getRemaining("talents")===0&&getRemaining("skills")===0&&getRemaining("knowledges")===0
  const guidanceHtml = cmsContent || defaultGuidanceTexts['ability-assign']
  return (
    <div className="space-y-5">
      <GuidanceBox>{isLoadingCMS?<div className="animate-pulse h-12 bg-primary/10 rounded"/>:<div dangerouslySetInnerHTML={{__html:guidanceHtml}}/>}</GuidanceBox>
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

function AreteStartStep({ state, setState, onNext, onBack, setFreebiePoolAdjustment, cmsContent, isLoadingCMS }: {
  state: CharacterState; setState: (s: CharacterState) => void; onNext: () => void; onBack: () => void
  setFreebiePoolAdjustment: (n: number) => void; cmsContent?: string | null; isLoadingCMS?: boolean
}) {
  const [selectedArete, setSelectedArete] = useState<1|2|3>(1)
  const [confirmed, setConfirmed] = useState(false)
  const handleConfirm = () => {
    let adjustment=0, areteDots=0
    if(selectedArete===2){areteDots=1;adjustment=-4}
    else if(selectedArete===3){areteDots=2;adjustment=-8}
    setFreebiePoolAdjustment(adjustment)
    setState({...state,freebieDots:{...state.freebieDots,arete:areteDots}})
    setConfirmed(true)
  }
  useEffect(()=>{if(confirmed)onNext()},[confirmed,onNext])
  const areteCosts: Record<1|2|3, string> = {
    1: "No freebie cost — standard starting Arete",
    2: "Costs 4 freebie points from your pool of 15",
    3: "Costs 8 freebie points from your pool of 15",
  }
  const guidanceHtml = cmsContent || defaultGuidanceTexts['arete-start']
  return (
    <div className="space-y-6">
      <GuidanceBox>{isLoadingCMS?<div className="animate-pulse h-20 bg-primary/10 rounded"/>:<div dangerouslySetInnerHTML={{__html:guidanceHtml}}/>}</GuidanceBox>
      <div className="grid grid-cols-3 gap-4">
        {([1,2,3] as const).map(level=>{
          const on = selectedArete === level
          return (
            <button key={level} type="button" onClick={()=>setSelectedArete(level)}
              className="group relative flex flex-col items-center gap-3 p-5 rounded-2xl transition-all duration-300 hover:-translate-y-1"
              style={{
                background: on ? "linear-gradient(135deg, hsl(var(--accent)/0.15), hsl(var(--card)))" : "hsl(var(--card))",
                border:     on ? "2px solid hsl(var(--accent)/0.7)" : "1px solid hsl(var(--border)/0.55)",
                boxShadow:  on ? "0 0 20px hsl(var(--accent)/0.3)" : "0 1px 2px rgba(0,0,0,0.1)",
              }}>
              <div className="flex gap-1.5">
                {[1,2,3].map(d=>(
                  <div key={d} className="rounded-full transition-all duration-200 group-hover:scale-110"
                    style={{
                      width:"18px", height:"18px",
                      border:`2px solid ${d<=level?"hsl(var(--accent)/0.9)":"hsl(var(--accent)/0.25)"}`,
                      background: d<=level ? "hsl(var(--accent))" : "transparent",
                      boxShadow:  d<=level ? "0 0 8px hsl(var(--accent)/0.6)" : "none",
                    }}/>
                ))}
              </div>
              <span className="font-serif font-black text-xl tracking-wide"
                style={{color:on?"hsl(var(--accent))":"hsl(var(--foreground)/0.7)"}}>
                Arete {level}
              </span>
              <span className="text-[10px] font-serif text-center leading-relaxed px-2"
                style={{color:on?"hsl(var(--foreground)/0.8)":"hsl(var(--muted-foreground))"}}>
                {areteCosts[level]}
              </span>
              {level===1&&(
                <span className="absolute -top-2 -right-2 text-[9px] font-serif font-bold px-2 py-0.5 rounded-full bg-primary/20 text-primary border border-primary/30">
                  Recommended
                </span>
              )}
            </button>
          )
        })}
      </div>
      <div className="flex justify-between gap-3">
        <SheetButton onClick={onBack} variant="secondary">← Back</SheetButton>
        <SheetButton onClick={handleConfirm}>Confirm & Continue →</SheetButton>
      </div>
    </div>
  )
}

function SpheresStep({ state, setState, onNext, onBack, cmsContent, isLoadingCMS }: {
  state: CharacterState; setState: (s: CharacterState) => void; onNext: () => void; onBack: () => void
  cmsContent?: string | null; isLoadingCMS?: boolean
}) {
  const [expandedSphere, setExpandedSphere] = useState<string|null>(null)
  const spent=()=>Object.values(state.spheres).reduce((s,v)=>s+v,0)
  const remaining=()=>6-spent()
  const setVal=(sphere:keyof typeof state.spheres,value:number)=>{if(value<0||value>3)return;if(state.affinitySphere===sphere&&value<1)return;const diff=value-state.spheres[sphere];if(diff>remaining())return;setState({...state,spheres:{...state.spheres,[sphere]:value}})}
  const canProceed=remaining()===0&&state.affinitySphere!==""
  const guidanceHtml = cmsContent || defaultGuidanceTexts['spheres']
  return (
    <div className="space-y-5">
      <GuidanceBox>{isLoadingCMS?<div className="animate-pulse h-20 bg-primary/10 rounded"/>:<div dangerouslySetInnerHTML={{__html:guidanceHtml}}/>}</GuidanceBox>
      {!state.affinitySphere ? (
        <div className="space-y-3">
          <h3 className="font-serif font-bold uppercase text-primary" style={{fontSize:"0.75rem",letterSpacing:"0.18em"}}>Choose Your Affinity Sphere</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {Object.keys(state.spheres).map(sphere=>{
              const data = sphereData[sphere]
              return (
                <button key={sphere} type="button"
                  onClick={()=>setState({...state,affinitySphere:sphere,spheres:{...state.spheres,[sphere]:1}})}
                  className="p-3 text-sm rounded-lg text-left transition-all duration-200 hover:border-primary/50"
                  style={{background:"hsl(var(--card))",border:"1px solid hsl(var(--border)/0.55)"}}>
                  <div className="font-serif font-bold text-primary mb-1">{sphere.charAt(0).toUpperCase()+sphere.slice(1)}</div>
                  <div className="text-xs font-serif leading-snug" style={{color:"hsl(var(--foreground)/0.65)"}}>{data?.short||""}</div>
                </button>
              )
            })}
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center justify-between p-3 rounded-md"
            style={{background:"hsl(var(--primary)/0.08)",border:"1px solid hsl(var(--primary)/0.2)"}}>
            <div className="flex items-center gap-2">
              <span className="text-sm font-serif font-bold text-primary">Affinity: {state.affinitySphere.charAt(0).toUpperCase()+state.affinitySphere.slice(1)}</span>
              <span className="text-xs font-serif px-2 py-0.5 rounded-full" style={{background:"hsl(var(--primary))",color:"hsl(var(--card))"}}>● 1 dot (locked)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold font-mono px-3 py-1 rounded-full"
                style={{background:remaining()===0?"hsl(var(--accent)/0.15)":"hsl(var(--border)/0.4)",color:remaining()===0?"hsl(var(--accent))":"hsl(var(--muted-foreground))"}}>
                {remaining()} / 6
              </span>
              <button type="button"
                onClick={()=>setState({...state,affinitySphere:"",spheres:{...state.spheres,[state.affinitySphere]:0}})}
                className="text-xs font-serif px-2 py-1 rounded transition-all hover:bg-primary/[0.08]"
                style={{color:"hsl(var(--primary)/0.6)",border:"1px solid hsl(var(--primary)/0.2)"}}>
                Change
              </button>
            </div>
          </div>
          <div className="space-y-1">
            {Object.keys(state.spheres).map(sphere=>{
              const data = sphereData[sphere]
              const isExpanded = expandedSphere === sphere
              const isAffinity = state.affinitySphere === sphere
              const label = sphere.charAt(0).toUpperCase()+sphere.slice(1)
              return (
                <div key={sphere} className="rounded-md overflow-hidden transition-all" style={{border:"1px solid hsl(var(--border)/0.4)"}}>
                  <div className="flex items-center justify-between px-3 py-2">
                    <button type="button" onClick={()=>setExpandedSphere(isExpanded?null:sphere)}
                      className="text-sm font-serif text-left flex items-center gap-1.5 flex-1"
                      style={{color:"hsl(var(--foreground)/0.85)"}}>
                      {label}
                      {isAffinity&&<span className="text-[9px] px-1.5 py-0.5 rounded-full font-serif" style={{background:"hsl(var(--primary)/0.12)",color:"hsl(var(--primary))"}}>Affinity</span>}
                      {data&&<span className="text-[9px]" style={{color:"hsl(var(--foreground)/0.3)"}}>{isExpanded?"▲":"▼"}</span>}
                    </button>
                    <SheetDotRating label="" value={state.spheres[sphere as keyof typeof state.spheres]} onChange={v=>setVal(sphere as keyof typeof state.spheres,v)} maxDots={3} variant="sphere" locked={isAffinity}/>
                  </div>
                  {isExpanded&&data&&(
                    <div className="px-3 pb-3 pt-2 text-xs font-serif leading-relaxed italic"
                      style={{color:"hsl(var(--foreground)/0.7)",borderTop:"1px solid hsl(var(--border)/0.3)",background:"hsl(var(--card)/0.5)"}}>
                      {data.long}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      )}
      <div className="flex justify-between gap-3">
        <SheetButton onClick={onBack} variant="secondary">← Back</SheetButton>
        <SheetButton onClick={onNext} disabled={!canProceed}>Next: Backgrounds →</SheetButton>
      </div>
    </div>
  )
}

function BackgroundsGuidedStep({ state, setState, onNext, onBack, cmsContent, isLoadingCMS }: {
  state: CharacterState; setState: (s: CharacterState) => void; onNext: () => void; onBack: () => void
  cmsContent?: string | null; isLoadingCMS?: boolean
}) {
  const [backgrounds,setBackgrounds]=useState<any[]>([])
  const [isLoading,setIsLoading]=useState(true)
  useEffect(()=>{fetch('/api/backgrounds').then(r=>r.ok?r.json():Promise.reject()).then(setBackgrounds).catch(console.error).finally(()=>setIsLoading(false))},[])
  const spent=()=>Object.values(state.backgrounds).reduce((s,v)=>s+v,0)
  const remaining=()=>7-spent()
  const setVal=(name:string,value:number)=>{if(value<0||value>5)return;const diff=value-(state.backgrounds[name]||0);if(diff>remaining())return;const b={...state.backgrounds};if(value===0)delete b[name];else b[name]=value;setState({...state,backgrounds:b})}
  const canProceed=remaining()===0
  const general=backgrounds.filter(bg=>bg.subtype==='general')
  const mage=backgrounds.filter(bg=>bg.subtype==='mage')
  const guidanceHtml = cmsContent || defaultGuidanceTexts['backgrounds']
  return (
    <div className="space-y-5">
      <GuidanceBox>{isLoadingCMS?<div className="animate-pulse h-12 bg-primary/10 rounded"/>:<div dangerouslySetInnerHTML={{__html:guidanceHtml}}/>}</GuidanceBox>
      {isLoading ? (
        <div className="text-center py-4 text-muted-foreground font-serif text-sm">Loading backgrounds…</div>
      ) : (
        <>
          <div className="flex justify-between items-center p-2.5 rounded-md" style={{background:"hsl(var(--card))",border:"1px solid hsl(var(--border)/0.5)"}}>
            <span className="text-sm font-serif text-foreground">Points remaining:</span>
            <span className="text-sm font-bold font-mono px-3 py-1 rounded-full"
              style={{background:remaining()===0?"hsl(var(--accent)/0.15)":"hsl(var(--border)/0.4)",color:remaining()===0?"hsl(var(--accent))":"hsl(var(--muted-foreground))"}}>
              {remaining()} / 7
            </span>
          </div>
          {general.length>0&&(
            <div>
              <h3 className="font-serif font-bold uppercase text-primary mb-2 pb-1" style={{fontSize:"0.7rem",letterSpacing:"0.2em",borderBottom:"1px solid hsl(var(--border)/0.4)"}}>General Backgrounds</h3>
              <div className="space-y-1">{general.map(bg=><BackgroundRating key={bg.id} background={bg} value={state.backgrounds[bg.name]||0} onChange={v=>setVal(bg.name,v)}/>)}</div>
            </div>
          )}
          {mage.length>0&&(
            <div>
              <h3 className="font-serif font-bold uppercase text-primary mb-2 pb-1" style={{fontSize:"0.7rem",letterSpacing:"0.2em",borderBottom:"1px solid hsl(var(--border)/0.4)"}}>Mage Backgrounds</h3>
              <div className="space-y-1">{mage.map(bg=><BackgroundRating key={bg.id} background={bg} value={state.backgrounds[bg.name]||0} onChange={v=>setVal(bg.name,v)}/>)}</div>
            </div>
          )}
        </>
      )}
      <div className="flex justify-between gap-3">
        <SheetButton onClick={onBack} variant="secondary">← Back</SheetButton>
        <SheetButton onClick={onNext} disabled={!canProceed}>Next: Freebie Points →</SheetButton>
      </div>
    </div>
  )
}

function FreebiesGuidedStep({ state, setState, onNext, onBack, freebiePoolAdjustment, cmsContent, isLoadingCMS }: {
  state: CharacterState; setState: (s: CharacterState) => void; onNext: () => void; onBack: () => void; freebiePoolAdjustment: number
  cmsContent?: string | null; isLoadingCMS?: boolean
}) {
  const { toast } = useToast()
  const [merits,setMerits]=useState<any[]>([])
  const [flaws,setFlaws]=useState<any[]>([])
  const [isLoading,setIsLoading]=useState(true)
  useEffect(()=>{fetch("/api/merits").then(r=>r.json()).then(d=>{setMerits(d.filter((m:any)=>m.type==="merit"));setFlaws(d.filter((m:any)=>m.type==="flaw"))}).catch(console.error).finally(()=>setIsLoading(false))},[])
  const calcPts=()=>{let s=0;Object.values(state.freebieDots.attributes).forEach(d=>s+=d*5);Object.values(state.freebieDots.abilities).forEach(d=>s+=d*2);Object.values(state.freebieDots.spheres).forEach(d=>s+=d*7);Object.values(state.freebieDots.backgrounds).forEach(d=>s+=d*1);s+=state.freebieDots.willpower*1;state.merits.forEach(m=>s+=Math.abs(m.cost));const fp=state.flaws.reduce((t,f)=>t+Math.abs(f.cost),0);return(15+fp+freebiePoolAdjustment)-s}
  const remaining=calcPts()
  const getHighest=()=>Math.max(...Object.keys(state.spheres).map(sp=>state.spheres[sp as keyof typeof state.spheres]+(state.freebieDots.spheres[sp]||0)))
  const getTotalArete=()=>1+state.freebieDots.arete
  const addDot=(cat:string,name:string,cost:number)=>{if(remaining<cost){toast({title:"Not enough points",description:`You need ${cost} freebie points.`,variant:"destructive"});return}const ns={...state};if(cat==="arete"||cat==="willpower"){(ns.freebieDots as any)[cat]+=1}else{const c=(ns.freebieDots as any)[cat];c[name]=(c[name]||0)+1}setState(ns)}
  const removeDot=(cat:string,name:string)=>{const ns={...state};if(cat==="arete"||cat==="willpower"){if((ns.freebieDots as any)[cat]<=0)return;(ns.freebieDots as any)[cat]-=1}else{const c=(ns.freebieDots as any)[cat];if(!c[name]||c[name]<=0)return;c[name]-=1;if(c[name]===0)delete c[name]}setState(ns)}
  const addMerit=(merit:any)=>{const cost=Math.abs(parseInt(merit.cost)||1);if(remaining<cost){toast({title:"Not enough points",description:`You need ${cost} more freebie points.`,variant:"destructive"});return}if(state.merits.some(m=>m.id===merit.id)){toast({title:"Already selected",description:`${merit.name} is already added.`,variant:"destructive"});return}setState({...state,merits:[...state.merits,{id:merit.id,name:merit.name,cost}]});toast({title:"Merit added",description:`${merit.name} (${cost} pts)`,variant:"default"})}
  const removeMerit=(i:number)=>{const cost=state.merits[i].cost;const n=[...state.merits];n.splice(i,1);setState({...state,merits:n});toast({title:"Merit removed",description:`Refunded ${cost} points.`,variant:"default"})}
  const addFlaw=(flaw:any)=>{const fp=state.flaws.reduce((s,f)=>s+Math.abs(f.cost),0);const cost=Math.abs(parseInt(flaw.cost)||1);if(fp+cost>7){toast({title:"Flaw limit reached",description:"Maximum 7 points from flaws.",variant:"destructive"});return}if(state.flaws.some(f=>f.id===flaw.id)){toast({title:"Already selected",description:`${flaw.name} is already taken.`,variant:"destructive"});return}setState({...state,flaws:[...state.flaws,{id:flaw.id,name:flaw.name,cost}]});toast({title:"Flaw added",description:`+${cost} points`,variant:"default"})}
  const removeFlaw=(i:number)=>{const cost=state.flaws[i].cost;const n=[...state.flaws];n.splice(i,1);setState({...state,flaws:n});toast({title:"Flaw removed",description:`You lose ${cost} points.`,variant:"default"})}
  const getTotalAbil=(name:string)=>(state.abilities[name as keyof typeof state.abilities]||0)+(state.freebieDots.abilities[name]||0)
  const setSpecialty=(name:string,spec:string)=>setState({...state,specialties:{...state.specialties,[name]:spec}})
  const isAreteValid=getTotalArete()>=getHighest()
  const canComplete=remaining===0&&isAreteValid
  const isMeritSelected=(id:string)=>state.merits.some(m=>m.id===id)
  const isFlawSelected=(id:string)=>state.flaws.some(f=>f.id===id)
  const currentFlawPoints=state.flaws.reduce((s,f)=>s+f.cost,0)
  const totalAvailable=15+state.flaws.reduce((s,f)=>s+Math.abs(f.cost),0)+freebiePoolAdjustment
  const spentPoints=totalAvailable-remaining
  const percentSpent=totalAvailable>0?(spentPoints/totalAvailable)*100:0
  const guidanceHtml = cmsContent || defaultGuidanceTexts['freebies']
  return (
    <div className="space-y-5">
      <GuidanceBox>{isLoadingCMS?<div className="animate-pulse h-12 bg-primary/10 rounded"/>:<div dangerouslySetInnerHTML={{__html:guidanceHtml}}/>}</GuidanceBox>
      {/* Points counter with progress bar */}
      <div className="space-y-2 p-3 rounded-lg" style={{background:"hsl(var(--card))",border:"1px solid hsl(var(--accent)/0.3)"}}>
        <div className="flex items-center justify-between">
          <div className="text-xs font-serif uppercase tracking-wider text-muted-foreground">Points Remaining</div>
          <div className="text-2xl font-black font-serif" style={{color:remaining>=0?"hsl(var(--accent))":"hsl(var(--destructive))"}}>{remaining}</div>
        </div>
        <div className="flex items-center justify-between text-[10px] font-mono text-muted-foreground">
          <span>Spent: {spentPoints}</span><span>Total: {totalAvailable}</span>
        </div>
        <div className="w-full h-1.5 rounded-full overflow-hidden" style={{background:"hsl(var(--border)/0.5)"}}>
          <div className="h-full rounded-full transition-all duration-300"
            style={{width:`${percentSpent}%`,background:"linear-gradient(90deg, hsl(var(--accent)), hsl(var(--primary)))"}}/>
        </div>
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
            <div><h4 className="font-serif font-bold uppercase text-primary mb-2" style={{fontSize:"0.7rem"}}>Physical</h4>
              <FreebieDotRating label="Strength" baseDots={state.attributes.strength} freebieDots={state.freebieDots.attributes.strength||0} onAdd={()=>addDot("attributes","strength",5)} onRemove={()=>removeDot("attributes","strength")} cost={5}/>
              <FreebieDotRating label="Dexterity" baseDots={state.attributes.dexterity} freebieDots={state.freebieDots.attributes.dexterity||0} onAdd={()=>addDot("attributes","dexterity",5)} onRemove={()=>removeDot("attributes","dexterity")} cost={5}/>
              <FreebieDotRating label="Stamina" baseDots={state.attributes.stamina} freebieDots={state.freebieDots.attributes.stamina||0} onAdd={()=>addDot("attributes","stamina",5)} onRemove={()=>removeDot("attributes","stamina")} cost={5}/>
            </div>
            <div><h4 className="font-serif font-bold uppercase text-primary mb-2" style={{fontSize:"0.7rem"}}>Social</h4>
              <FreebieDotRating label="Charisma" baseDots={state.attributes.charisma} freebieDots={state.freebieDots.attributes.charisma||0} onAdd={()=>addDot("attributes","charisma",5)} onRemove={()=>removeDot("attributes","charisma")} cost={5}/>
              <FreebieDotRating label="Manipulation" baseDots={state.attributes.manipulation} freebieDots={state.freebieDots.attributes.manipulation||0} onAdd={()=>addDot("attributes","manipulation",5)} onRemove={()=>removeDot("attributes","manipulation")} cost={5}/>
              <FreebieDotRating label="Appearance" baseDots={state.attributes.appearance} freebieDots={state.freebieDots.attributes.appearance||0} onAdd={()=>addDot("attributes","appearance",5)} onRemove={()=>removeDot("attributes","appearance")} cost={5}/>
            </div>
            <div><h4 className="font-serif font-bold uppercase text-primary mb-2" style={{fontSize:"0.7rem"}}>Mental</h4>
              <FreebieDotRating label="Perception" baseDots={state.attributes.perception} freebieDots={state.freebieDots.attributes.perception||0} onAdd={()=>addDot("attributes","perception",5)} onRemove={()=>removeDot("attributes","perception")} cost={5}/>
              <FreebieDotRating label="Intelligence" baseDots={state.attributes.intelligence} freebieDots={state.freebieDots.attributes.intelligence||0} onAdd={()=>addDot("attributes","intelligence",5)} onRemove={()=>removeDot("attributes","intelligence")} cost={5}/>
              <FreebieDotRating label="Wits" baseDots={state.attributes.wits} freebieDots={state.freebieDots.attributes.wits||0} onAdd={()=>addDot("attributes","wits",5)} onRemove={()=>removeDot("attributes","wits")} cost={5}/>
            </div>
          </div>
        </TabsContent>
        <TabsContent value="abilities">
          <div className="grid grid-cols-3 gap-4">
            <div><h4 className="font-serif font-bold uppercase text-primary mb-2" style={{fontSize:"0.7rem"}}>Talents</h4>{["alertness","art","athletics","awareness","brawl","empathy","expression","intimidation","leadership","streetwise","subterfuge"].map(a=>{const total=getTotalAbil(a);const lbl=a.charAt(0).toUpperCase()+a.slice(1);return(<div key={a}><FreebieDotRating label={lbl} baseDots={state.abilities[a as keyof typeof state.abilities]} freebieDots={state.freebieDots.abilities[a]||0} onAdd={()=>addDot("abilities",a,2)} onRemove={()=>removeDot("abilities",a)} cost={2}/>{total>=4&&<Input placeholder="Specialty…" value={state.specialties[a]||""} onChange={e=>setSpecialty(a,e.target.value)} className="mt-1 text-xs ml-4"/>}</div>)})}</div>
            <div><h4 className="font-serif font-bold uppercase text-primary mb-2" style={{fontSize:"0.7rem"}}>Skills</h4>{["crafts","drive","etiquette","firearms","martialArts","meditation","melee","research","stealth","survival","technology"].map(a=>{const total=getTotalAbil(a);const lbl=a==="martialArts"?"Martial Arts":a.charAt(0).toUpperCase()+a.slice(1);return(<div key={a}><FreebieDotRating label={lbl} baseDots={state.abilities[a as keyof typeof state.abilities]} freebieDots={state.freebieDots.abilities[a]||0} onAdd={()=>addDot("abilities",a,2)} onRemove={()=>removeDot("abilities",a)} cost={2}/>{total>=4&&<Input placeholder="Specialty…" value={state.specialties[a]||""} onChange={e=>setSpecialty(a,e.target.value)} className="mt-1 text-xs ml-4"/>}</div>)})}</div>
            <div><h4 className="font-serif font-bold uppercase text-primary mb-2" style={{fontSize:"0.7rem"}}>Knowledges</h4>{["academics","computer","cosmology","enigmas","esoterica","investigation","law","medicine","occult","politics","science"].map(a=>{const total=getTotalAbil(a);const lbl=a.charAt(0).toUpperCase()+a.slice(1);return(<div key={a}><FreebieDotRating label={lbl} baseDots={state.abilities[a as keyof typeof state.abilities]} freebieDots={state.freebieDots.abilities[a]||0} onAdd={()=>addDot("abilities",a,2)} onRemove={()=>removeDot("abilities",a)} cost={2}/>{total>=4&&<Input placeholder="Specialty…" value={state.specialties[a]||""} onChange={e=>setSpecialty(a,e.target.value)} className="mt-1 text-xs ml-4"/>}</div>)})}</div>
          </div>
        </TabsContent>
        <TabsContent value="other">
          <div className="space-y-4">
            <div>
              <h4 className="font-serif font-bold uppercase text-primary mb-2" style={{fontSize:"0.7rem"}}>Arete (4 pts/dot)</h4>
              <div className="flex items-center justify-between px-2">
                <span className="text-sm font-serif" style={{color:"hsl(var(--foreground)/0.85)"}}>Arete</span>
                <div className="flex items-center gap-2">
                  <div className="flex gap-1">{[1,2,3].map(i=>{const f=i<=getTotalArete();return<div key={i} className="rounded-full" style={{width:"18px",height:"18px",border:`2px solid hsl(var(--accent)/${f?"0.9":"0.3"})`,backgroundColor:f?"hsl(var(--accent))":"transparent",boxShadow:f?"0 0 6px hsl(var(--accent)/0.4)":"none"}}/>})}</div>
                  <button onClick={()=>removeDot("arete","arete")} disabled={state.freebieDots.arete<=0||getTotalArete()<=getHighest()} className="w-6 h-6 rounded flex items-center justify-center disabled:opacity-30" style={{background:"hsl(var(--border)/0.8)",color:"hsl(var(--foreground))"}}>-</button>
                  <span className="text-[10px] font-mono w-8 text-center text-muted-foreground">4pt</span>
                  <button onClick={()=>addDot("arete","arete",4)} disabled={remaining<4||getTotalArete()>=3} className="w-6 h-6 rounded flex items-center justify-center disabled:opacity-30" style={{background:"hsl(var(--accent))",color:"hsl(var(--accent-foreground))"}}>+</button>
                </div>
              </div>
              {getTotalArete()<getHighest()&&<p className="text-xs text-destructive mt-1">Arete must be at least {getHighest()} (highest sphere)</p>}
            </div>
            <div><h4 className="font-serif font-bold uppercase text-primary mb-2" style={{fontSize:"0.7rem"}}>Willpower (1 pt/dot)</h4><FreebieDotRating label="Willpower" baseDots={5} freebieDots={state.freebieDots.willpower} onAdd={()=>addDot("willpower","willpower",1)} onRemove={()=>removeDot("willpower","willpower")} maxDots={10} cost={1}/></div>
            <div><h4 className="font-serif font-bold uppercase text-primary mb-2" style={{fontSize:"0.7rem"}}>Spheres (7 pts/dot)</h4>{Object.keys(state.spheres).map(s=><FreebieDotRating key={s} label={s.charAt(0).toUpperCase()+s.slice(1)} baseDots={state.spheres[s as keyof typeof state.spheres]} freebieDots={state.freebieDots.spheres[s]||0} onAdd={()=>addDot("spheres",s,7)} onRemove={()=>removeDot("spheres",s)} cost={7}/>)}</div>
          </div>
        </TabsContent>
        <TabsContent value="merits">
          {isLoading?<div className="text-muted-foreground text-sm py-4">Loading merits…</div>:(
            <div>
              {state.merits.length>0&&<div className="mb-4">
                <h4 className="font-serif text-xs uppercase tracking-widest text-primary mb-2">Selected ({state.merits.reduce((s,m)=>s+m.cost,0)} pts)</h4>
                {state.merits.map((m,i)=>(<div key={i} className="flex justify-between items-center p-2 rounded-md mb-1" style={{background:"hsl(var(--primary)/0.07)",border:"1px solid hsl(var(--primary)/0.15)"}}><span className="text-sm font-serif">{m.name} ({m.cost} pts)</span><button onClick={()=>removeMerit(i)} className="text-xs px-2 py-1 rounded text-muted-foreground hover:text-destructive">Remove</button></div>))}
              </div>}
              <div className="space-y-2 max-h-80 overflow-y-auto">
                {merits.map(m=>{const cost=Math.abs(parseInt(m.cost)||1);const alreadySelected=isMeritSelected(m.id);const notEnoughPoints=remaining<cost;const disabled=alreadySelected||notEnoughPoints;return(<div key={m.id} className="p-2.5 rounded-md" style={{border:"1px solid hsl(var(--border)/0.4)"}}><div className="flex justify-between items-start"><span className="font-serif font-semibold text-sm text-foreground">{m.name}</span><button onClick={()=>addMerit(m)} disabled={disabled} className="text-xs px-3 py-1 rounded-full font-serif ml-2 shrink-0 disabled:opacity-30 transition-all" style={{background:alreadySelected?"hsl(var(--muted))":"hsl(var(--primary)/0.1)",color:alreadySelected?"hsl(var(--muted-foreground))":"hsl(var(--primary))",border:"1px solid hsl(var(--primary)/0.2)",cursor:disabled?"not-allowed":"pointer"}}>{alreadySelected?"✓ Selected":`+${cost} pts`}</button></div><p className="text-xs text-muted-foreground mt-0.5 font-serif">{m.description}</p>{notEnoughPoints&&!alreadySelected&&<p className="text-[10px] text-destructive mt-1">Requires {cost} points</p>}</div>)})}
              </div>
            </div>
          )}
        </TabsContent>
        <TabsContent value="flaws">
          {isLoading?<div className="text-muted-foreground text-sm py-4">Loading flaws…</div>:(
            <div>
              {state.flaws.length>0&&<div className="mb-4">
                <h4 className="font-serif text-xs uppercase tracking-widest text-primary mb-2">Selected (+{state.flaws.reduce((s,f)=>s+f.cost,0)} pts)</h4>
                {state.flaws.map((f,i)=>(<div key={i} className="flex justify-between items-center p-2 rounded-md mb-1" style={{background:"hsl(var(--destructive)/0.08)",border:"1px solid hsl(var(--destructive)/0.2)",boxShadow:"inset 3px 0 0 hsl(var(--destructive)/0.4)"}}><span className="text-sm font-serif">{f.name} (+{f.cost} pts)</span><button onClick={()=>removeFlaw(i)} className="text-xs px-2 py-1 rounded text-muted-foreground hover:text-destructive">Remove</button></div>))}
              </div>}
              <div className="space-y-2 max-h-80 overflow-y-auto">
                {flaws.map(f=>{const cost=Math.abs(parseInt(f.cost)||1);const alreadySelected=isFlawSelected(f.id);const wouldExceedLimit=currentFlawPoints+cost>7;const disabled=alreadySelected||wouldExceedLimit;return(<div key={f.id} className="p-2.5 rounded-md" style={{border:"1px solid hsl(var(--border)/0.4)"}}><div className="flex justify-between items-start"><span className="font-serif font-semibold text-sm text-foreground">{f.name}</span><button onClick={()=>addFlaw(f)} disabled={disabled} className="text-xs px-3 py-1 rounded-full font-serif ml-2 shrink-0 disabled:opacity-30 transition-all" style={{background:alreadySelected?"hsl(var(--muted))":"hsl(var(--destructive)/0.1)",color:alreadySelected?"hsl(var(--muted-foreground))":"hsl(var(--destructive))",border:"1px solid hsl(var(--destructive)/0.2)",cursor:disabled?"not-allowed":"pointer"}}>{alreadySelected?"✓ Selected":`+${cost} pts`}</button></div><p className="text-xs text-muted-foreground mt-0.5 font-serif">{f.description}</p>{wouldExceedLimit&&!alreadySelected&&<p className="text-[10px] text-destructive mt-1">Would exceed 7 point limit</p>}</div>)})}
              </div>
            </div>
          )}
        </TabsContent>
      </Tabs>
      <div className="flex justify-between gap-3 pt-2">
        <SheetButton onClick={onBack} variant="secondary">← Back</SheetButton>
        <SheetButton onClick={onNext} disabled={!canComplete}>
          {!isAreteValid?`Arete must be ${getHighest()}`:remaining===0?"Complete Character →":`Spend ${remaining} more points`}
        </SheetButton>
      </div>
    </div>
  )
}

function CompleteGuidedStep({ state, onBack, onClose }: { state: CharacterState; onBack: () => void; onClose: () => void }) {
  const router=useRouter()
  const {toast}=useToast()
  const [isSaving,setIsSaving]=useState(false)
  const [characterId,setCharacterId]=useState<string|null>(null)
  const calc=(cat:string,name:string)=>{if(cat==="attributes")return(state.attributes[name as keyof typeof state.attributes])+(state.freebieDots.attributes[name]||0);if(cat==="abilities")return(state.abilities[name as keyof typeof state.abilities])+(state.freebieDots.abilities[name]||0);if(cat==="spheres")return(state.spheres[name as keyof typeof state.spheres])+(state.freebieDots.spheres[name]||0);if(cat==="backgrounds")return(state.backgrounds[name]||0)+(state.freebieDots.backgrounds[name]||0);return 0}
  const handleShare=async()=>{if(characterId){const url=`${window.location.origin}/characters/${characterId}`;try{await navigator.clipboard.writeText(url);toast({title:"Link copied!",description:"Share this link to show your character sheet.",variant:"default"})}catch{toast({title:"Could not copy",description:"Please copy the URL manually.",variant:"destructive"})}}else{toast({title:"Save first",description:"Please save your character before sharing.",variant:"destructive"})}}
  const save=async()=>{setIsSaving(true);try{const fa:any={};Object.keys(state.attributes).forEach(a=>{fa[a]=calc("attributes",a)});const fb:any={};Object.keys(state.abilities).forEach(a=>{fb[a]=calc("abilities",a)});const fs:any={};Object.keys(state.spheres).forEach(s=>{fs[s]=calc("spheres",s)});const fg:any={};Object.keys(state.backgrounds).forEach(b=>{fg[b]=calc("backgrounds",b)});const r=await fetch('/api/characters',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({name:state.name,player:state.player||"",chronicle:state.chronicle||"",nature:state.nature||"",demeanor:state.demeanor||"",essence:state.essence||"",faction:state.affiliation,sect:state.sect||"",concept:state.concept||"",attributes:fa,abilities:fb,spheres:fs,backgrounds:fg,specialties:state.specialties,arete:1+state.freebieDots.arete,willpower:5+state.freebieDots.willpower,freebieDots:state.freebieDots,merits:state.merits,flaws:state.flaws,avatar:""})});const d=await r.json();if(r.ok){setCharacterId(d.id);toast({title:"Character Saved!",description:`${state.name} has been added to your characters.`})}else toast({title:"Error",description:d.error||"Failed to save character",variant:"destructive"})}catch{toast({title:"Error",description:"Failed to save character. Please try again.",variant:"destructive"})}finally{setIsSaving(false)}}
  return (
    <div className="space-y-6 text-center">
      <div className="w-20 h-20 mx-auto rounded-full flex items-center justify-center animate-pulse"
        style={{background:"linear-gradient(135deg,hsl(var(--accent)),hsl(var(--accent)/0.7))",boxShadow:"0 0 30px hsl(var(--accent)/0.5)"}}>
        <Check className="w-10 h-10" style={{color:"hsl(var(--accent-foreground))"}}/>
      </div>
      <h2 className="font-serif font-black uppercase text-primary tracking-wider" style={{fontSize:"1.6rem"}}>Awakening Complete</h2>
      <p className="font-serif text-muted-foreground">{state.name||"Your character"} is ready to be inscribed in the Tapestry.</p>
      {!characterId?(
        <div className="space-y-4">
          <SheetButton onClick={save} disabled={isSaving}>{isSaving?"Inscribing…":"✦ Save Character"}</SheetButton>
        </div>
      ):(
        <div className="space-y-4">
          <div className="flex gap-3">
            <Link href={`/characters/${characterId}`} className="flex-1">
              <button className="w-full py-2.5 rounded-md font-serif text-xs uppercase tracking-widest font-bold transition-all hover:scale-[1.02]" style={{background:"hsl(var(--primary))",color:"hsl(var(--card))"}}>View Character Sheet</button>
            </Link>
            <button onClick={handleShare} className="flex-1 py-2.5 rounded-md font-serif text-xs uppercase tracking-widest font-semibold transition-all hover:bg-primary/[0.08] flex items-center justify-center gap-2" style={{border:"1px solid hsl(var(--border)/0.6)",color:"hsl(var(--foreground)/0.7)"}}><Share2 className="w-3.5 h-3.5"/> Share</button>
          </div>
          <div className="flex gap-3">
            <button onClick={onClose} className="flex-1 py-2 rounded-md font-serif text-xs uppercase tracking-widest font-semibold transition-all hover:bg-primary/[0.05]" style={{border:"1px solid hsl(var(--border)/0.5)",color:"hsl(var(--foreground)/0.6)"}}>Close</button>
          </div>
        </div>
      )}
      <div className="grid grid-cols-2 gap-4 text-left mt-2">
        <div className="p-4 rounded-xl transition-all hover:shadow-md" style={{background:"hsl(var(--card))",border:"1px solid hsl(var(--primary)/0.3)"}}>
          <strong className="font-serif text-primary block mb-2 uppercase tracking-wider text-xs">Character Summary</strong>
          <ul className="font-serif space-y-1.5 text-sm text-muted-foreground">
            <li className="flex justify-between"><span>Attributes:</span><span className="text-foreground">15 dots</span></li>
            <li className="flex justify-between"><span>Abilities:</span><span className="text-foreground">27 dots</span></li>
            <li className="flex justify-between"><span>Spheres:</span><span className="text-foreground">{Object.values(state.spheres).reduce((a,b)=>a+b,0)} dots</span></li>
            <li className="flex justify-between"><span>Backgrounds:</span><span className="text-foreground">{Object.values(state.backgrounds).reduce((a,b)=>a+b,0)} dots</span></li>
            <li className="flex justify-between"><span>Arete:</span><span className="text-foreground">{1+state.freebieDots.arete}</span></li>
          </ul>
        </div>
        <div className="p-4 rounded-xl transition-all hover:shadow-md" style={{background:"hsl(var(--card))",border:"1px solid hsl(var(--accent)/0.3)"}}>
          <strong className="font-serif text-primary block mb-2 uppercase tracking-wider text-xs">Freebie Points</strong>
          <ul className="font-serif space-y-1.5 text-sm text-muted-foreground">
            <li className="flex justify-between"><span>Merits:</span><span className="text-foreground">{state.merits.reduce((s,m)=>s+m.cost,0)} pts</span></li>
            <li className="flex justify-between"><span>Flaws:</span><span className="text-foreground">+{state.flaws.reduce((s,f)=>s+f.cost,0)} pts</span></li>
            <li className="flex justify-between"><span>Arete extra:</span><span className="text-foreground">{state.freebieDots.arete} dots</span></li>
            <li className="flex justify-between"><span>Willpower:</span><span className="text-foreground">{5+state.freebieDots.willpower}</span></li>
          </ul>
        </div>
      </div>
      {!characterId&&<div className="flex justify-between gap-3"><SheetButton onClick={onBack} variant="secondary">← Back</SheetButton></div>}
    </div>
  )
}

// ── Background sub-component ──────────────────────────────────────────────────
function BackgroundRating({background,value,onChange}:{background:any;value:number;onChange:(v:number)=>void}) {
  const [show,setShow]=useState(false)
  return (
    <div className="rounded-md p-2 transition-all" style={{border:`1px solid hsl(var(--${value>0?"primary":"border"})/${value>0?"0.35":"0.4"})`,background:value>0?"hsl(var(--primary)/0.05)":"transparent"}}>
      <div className="flex items-center justify-between">
        <button type="button" onClick={()=>setShow(!show)} className="text-sm font-serif text-left flex-1 transition-colors hover:text-primary" style={{color:"hsl(var(--foreground)/0.85)"}}>{background.name}</button>
        <div className="flex gap-0.5 ml-4">
          {Array.from({length:5},(_,i)=>{const dv=i+1;const f=dv<=value;return(<button key={i} type="button" onClick={()=>onChange(dv===value?0:dv)} className="rounded-full transition-all hover:scale-110" style={{width:"14px",height:"14px",border:`2px solid hsl(var(--primary)/${f?"0.9":"0.3"})`,backgroundColor:f?"hsl(var(--primary))":"transparent",boxShadow:f?"0 0 5px hsl(var(--primary)/0.4)":"none"}}/>)})}
        </div>
      </div>
      {show&&(<div className="mt-2 pt-2 text-xs font-serif leading-relaxed italic" style={{borderTop:"1px solid hsl(var(--border)/0.3)",color:"hsl(var(--foreground)/0.65)"}}>{background.description}</div>)}
    </div>
  )
}

// =============================================================================
// GUIDED WIZARD
// =============================================================================
interface GuidedStep {
  id: string; title: string; description: string
  component: (props: any) => React.ReactNode
  canProceed: (state: CharacterState) => boolean
  selfNavigates?: boolean
}

function SegmentNav({stepIndex, total}:{stepIndex:number; total:number}) {
  const segments = STEP_CATEGORIES.map(cat => ({ label: cat.label, first: cat.steps[0], last: cat.steps[cat.steps.length-1] }))
  return (
    <div className="flex items-center gap-1.5 w-full" role="progressbar">
      {segments.map(seg=>{
        const isComplete=stepIndex>seg.last; const isActive=stepIndex>=seg.first&&stepIndex<=seg.last
        return (
          <div key={seg.label} className="flex-1 flex flex-col gap-1 items-center">
            <div className="w-full rounded-full transition-all duration-500" style={{height:"3px",background:isComplete?"hsl(var(--primary))":isActive?`linear-gradient(90deg, hsl(var(--primary)), hsl(var(--primary)/0.5))`:"hsl(var(--border)/0.4)",boxShadow:isActive?"0 0 6px hsl(var(--primary)/0.5)":isComplete?"0 0 4px hsl(var(--primary)/0.25)":"none"}}/>
            <span className="hidden sm:block font-serif text-[8px] uppercase tracking-[0.18em] transition-all duration-300" style={{color:isComplete?"hsl(var(--primary)/0.8)":isActive?"hsl(var(--primary))":"hsl(var(--foreground)/0.25)"}}>{seg.label}</span>
          </div>
        )
      })}
    </div>
  )
}

function StepPanel({children, stepKey}:{children:React.ReactNode; stepKey:number}) {
  return <div key={stepKey} style={{animation:"grimoire-emerge 0.4s cubic-bezier(0.16,1,0.3,1) forwards"}}>{children}</div>
}

// ── Pre-wizard codec dialogue — fires once after faction selection ────────────
const PRE_WIZARD_CODEC: Record<"traditions"|"technocracy", CodecTrigger & { component: "dante"|"courage" }> = {
  traditions: {
    stepName:  "UPLINK ESTABLISHED",
    dialogue:  "Listen closely, initiate. The Digital Web is shifting. Your Paradox signature is spiking, and we need to stabilize your avatar before the Technocracy locks onto your coordinates. Ready to begin the Awakening?",
    component: "dante",
  },
  technocracy: {
    stepName:  "SECURE CHANNEL OPEN",
    dialogue:  "Citizen, remain calm. Your recent behavior suggests a deviation from the consensus reality. We are initiating a temporary adjustment to your profile. Please provide the requested data for the Tech-Union records.",
    component: "courage",
  },
}

// ── In-wizard codec triggers — faction-aware ──────────────────────────────────
interface CodecTrigger {
  dialogue: string
  stepName: string
}

interface FactionedCodecTrigger {
  traditions:  CodecTrigger
  technocracy: CodecTrigger
}

const CODEC_TRIGGERS: Record<number, FactionedCodecTrigger> = {
  // After Name / Concept / Tradition (step 0) → before Nature & Demeanor
  0: {
    traditions: {
      stepName: "IDENTITY ESTABLISHED",
      dialogue: "Good. A name, a concept, a Tradition — that's the skeleton of a person. Now we go deeper. Nature is who you actually are when nobody's watching. Demeanor is the story you tell. They can match. They often don't. Pick both carefully — they define how you recover Willpower, which means they define how you survive.",
    },
    technocracy: {
      stepName: "PROFILE INITIALIZED",
      dialogue: "Designation logged. Convention affiliation on record. Now we calibrate your psychological profile. The Union requires a precise understanding of an operative's core behavioral patterns. Nature defines your true motivational architecture. Demeanor defines your operational persona. Both are required for Union assignment clearance.",
    },
  },
  // After Concept Refinement (step 3) → before Attribute Priority
  3: {
    traditions: {
      stepName: "IDENTITY LOCKED",
      dialogue: "Identity confirmed. Now we get to the part that actually keeps you alive. Attributes are what you ARE — the raw material the universe gave you before you learned to bend it. Physical, Social, Mental. One will always be your strongest. Figure out which one your character leans on. That choice echoes through everything that comes next.",
    },
    technocracy: {
      stepName: "PSYCHOLOGICAL PROFILE COMPLETE",
      dialogue: "Profile parameters confirmed. Proceeding to baseline capability assessment. The Union measures operatives across three vectors: Physical, Social, and Mental. Allocate your primary resources where your function demands. A field agent prioritises differently than an analyst. Choose your role. Then build toward it.",
    },
  },
  // After Ability Assignment (step 7) → before Arete
  7: {
    traditions: {
      stepName: "CAPABILITY MATRIX LOADED",
      dialogue: "Skills registered. You know what you can do. Now comes the dangerous question — how deep does your Awakening go? Arete is the measure of your enlightenment. Most mages start at one. A few start higher — but that cost comes out of your freebie pool. Talk to your Storyteller before you commit.",
    },
    technocracy: {
      stepName: "SKILL ASSESSMENT COMPLETE",
      dialogue: "Capability index recorded. Now we assess your Enlightenment rating — what the deviants call Arete. The Union prefers to call it Genius Quotient. Most field operatives begin at baseline. Enhanced ratings are available at significant resource cost. Coordinate with your Control before selecting above standard parameters.",
    },
  },
  // After Arete (step 8) → before Spheres
  8: {
    traditions: {
      stepName: "PARADIGM INTERFACE",
      dialogue: "Arete locked. Now we map your connection to the nine Spheres — the fundamental forces of reality that mages learn to manipulate. Your Tradition gives you one for free, your Affinity Sphere. The rest you earn. Remember: your Sphere rating can never exceed your Arete. Choose what feels true to your paradigm.",
    },
    technocracy: {
      stepName: "METHODOLOGY CLASSIFICATION",
      dialogue: "Genius Quotient confirmed. Now we define your operational methodology — what the Union formally classifies as your Enlightened Sciences. Your Convention determines your primary discipline. Secondary disciplines require additional resource allocation. All methodology ratings are bounded by your Genius Quotient. Select your focus areas.",
    },
  },
  // After Backgrounds (step 10) → before Freebies
  10: {
    traditions: {
      stepName: "FINAL ALLOCATION",
      dialogue: "Resources logged. You're almost done. Freebie points are the last layer of customisation — the place where your character stops being a template and starts being a person. Spend them on what matters to the story you want to tell, not just what looks powerful on paper. Fifteen points. Make them count.",
    },
    technocracy: {
      stepName: "RESOURCE ALLOCATION PHASE",
      dialogue: "Asset inventory confirmed. Final discretionary resource allocation commencing. The Union provides all operatives a standard supplemental budget for profile optimisation. Allocate according to operational priorities. Reminder: post-assignment resource redistribution requires supervisor approval. Use your allocation wisely.",
    },
  },
}

// ── Static step definitions — component references must live outside any
// component function to prevent React from seeing new references each render,
// which would violate the Rules of Hooks for steps that use useState internally.
const GUIDED_STEP_DEFS = [
  {id:"name-concept-tradition", title:"Name, Concept & Tradition",    description:"The foundation of your character.",                                         component:NameConceptTraditionStep, selfNavigates:true},
  {id:"nature-demeanor",        title:"Nature & Demeanor",             description:"Who you really are vs. how you appear.",                                    component:NatureDemeanorStep,       selfNavigates:true},
  {id:"essence-chronicle",      title:"Essence, Chronicle & Sect",     description:"Your magical essence and campaign details.",                                 component:EssenceChronicleStep,     selfNavigates:true},
  {id:"concept-refinement",     title:"Refine Your Concept",           description:"Tie everything together.",                                                   component:ConceptRefinementStep,    selfNavigates:true},
  {id:"attribute-priority",     title:"Attribute Priority",            description:"Assign Primary, Secondary, Tertiary to Physical, Social, Mental.",           component:AttributePriorityStep,    selfNavigates:true},
  {id:"attribute-assign",       title:"Assign Attributes",             description:"Spend your attribute dots (each starts at 1).",                              component:AttributeAssignStep,      selfNavigates:true},
  {id:"ability-priority",       title:"Ability Priority",              description:"Assign Primary, Secondary, Tertiary to Talents, Skills, Knowledges.",        component:AbilityPriorityStep,      selfNavigates:true},
  {id:"ability-assign",         title:"Assign Abilities",              description:"Spend your ability dots — max 3 per ability.",                               component:AbilityAssignStep,        selfNavigates:true},
  {id:"arete-start",            title:"Starting Arete",                description:"Your Storyteller determines if you begin above Arete 1.",                   component:AreteStartStep,           selfNavigates:true},
  {id:"spheres",                title:"Spheres of Magic",              description:"Choose your Affinity Sphere and spend 6 dots across the nine Spheres.",      component:SpheresStep,              selfNavigates:true},
  {id:"backgrounds",            title:"Backgrounds",                   description:"Spend 7 dots on resources, allies, and supernatural advantages.",             component:BackgroundsGuidedStep,    selfNavigates:true},
  {id:"freebies",               title:"Freebie Points",                description:"15 points to spend — plus bonus points from Flaws.",                         component:FreebiesGuidedStep,       selfNavigates:true},
  {id:"complete",               title:"Awakening Complete",            description:"Your character is ready to be inscribed in the Tapestry.",                   component:CompleteGuidedStep,       selfNavigates:true},
] as const

function GuidedWizard({state,setState,open,onClose,setFreebiePoolAdjustment,freebiePoolAdjustment}:{state:CharacterState;setState:(s:CharacterState)=>void;open:boolean;onClose:()=>void;setFreebiePoolAdjustment:(n:number)=>void;freebiePoolAdjustment:number}) {
  const [stepIndex,setStepIndex]=useState(0)
  const [stepContent, setStepContent] = useState<Record<string, string>>({})
  const [loadingContent, setLoadingContent] = useState<Record<string, boolean>>({})

  // ── Codec state ─────────────────────────────────────────────────────────────
  const [codecActive, setCodecActive] = useState(false)
  const [codecData, setCodecData] = useState<CodecTrigger|null>(null)
  const [pendingStep, setPendingStep] = useState<number>(0)
  const [codecTypingDone, setCodecTypingDone] = useState(false)

  // ── canProceed functions need runtime values so they stay inside ───────────
  // but are memoized so they don't cause identity changes on every render.
  const canProceedFns = useMemo<Record<string,(s:CharacterState)=>boolean>>(()=>({
    "name-concept-tradition": s=>!!s.name&&!!s.concept&&!!s.affiliation,
    "nature-demeanor":        s=>!!s.nature&&!!s.demeanor,
    "essence-chronicle":      s=>!!s.essence&&!!s.chronicle,
    "concept-refinement":     ()=>true,
    "attribute-priority":     s=>Object.values(s.attributePriorities).every(p=>p!==null),
    "attribute-assign":       s=>{
      const gp=(cat:keyof typeof s.attributePriorities)=>{const p=s.attributePriorities[cat];return p==="primary"?7:p==="secondary"?5:p==="tertiary"?3:0}
      const gs=(cat:"physical"|"social"|"mental")=>{const a=cat==="physical"?["strength","dexterity","stamina"]:cat==="social"?["charisma","manipulation","appearance"]:["perception","intelligence","wits"];return a.reduce((sum,x)=>sum+(s.attributes[x as keyof typeof s.attributes]-1),0)}
      return gp("physical")-gs("physical")===0&&gp("social")-gs("social")===0&&gp("mental")-gs("mental")===0
    },
    "ability-priority":       s=>Object.values(s.abilityPriorities).every(p=>p!==null),
    "ability-assign":         s=>{
      const gp=(cat:keyof typeof s.abilityPriorities)=>{const p=s.abilityPriorities[cat];return p==="primary"?13:p==="secondary"?9:p==="tertiary"?5:0}
      const ga=(cat:"talents"|"skills"|"knowledges")=>{const m={talents:["alertness","art","athletics","awareness","brawl","empathy","expression","intimidation","leadership","streetwise","subterfuge"],skills:["crafts","drive","etiquette","firearms","martialArts","meditation","melee","research","stealth","survival","technology"],knowledges:["academics","computer","cosmology","enigmas","esoterica","investigation","law","medicine","occult","politics","science"]};return(m as any)[cat].reduce((sum:number,ab:string)=>sum+s.abilities[ab as keyof typeof s.abilities],0)}
      return gp("talents")-ga("talents")===0&&gp("skills")-ga("skills")===0&&gp("knowledges")-ga("knowledges")===0
    },
    "arete-start":            ()=>true,
    "spheres":                s=>Object.values(s.spheres).reduce((a,b)=>a+b,0)===6&&s.affinitySphere!=="",
    "backgrounds":            s=>Object.values(s.backgrounds).reduce((a,b)=>a+b,0)===7,
    "freebies":               s=>{
      let sp=0
      Object.values(s.freebieDots.attributes).forEach(d=>sp+=d*5)
      Object.values(s.freebieDots.abilities).forEach(d=>sp+=d*2)
      Object.values(s.freebieDots.spheres).forEach(d=>sp+=d*7)
      Object.values(s.freebieDots.backgrounds).forEach(d=>sp+=d)
      sp+=s.freebieDots.willpower
      s.merits.forEach(m=>sp+=Math.abs(m.cost))
      const fp=s.flaws.reduce((t,f)=>t+Math.abs(f.cost),0)
      const total=15+fp+freebiePoolAdjustment
      const rem=total-sp
      const high=Math.max(...Object.values(s.spheres))
      const areteT=1+s.freebieDots.arete
      return rem===0&&areteT>=high
    },
    "complete": ()=>true,
  }),[freebiePoolAdjustment])

  // Merge static defs with runtime canProceed
  const guidedSteps: GuidedStep[] = GUIDED_STEP_DEFS.map(def=>({
    ...def,
    canProceed: canProceedFns[def.id] ?? (()=>true),
  }))

  const currentStep = guidedSteps[stepIndex]
  const totalSteps = guidedSteps.length

  // ── CMS fetch per step ─────────────────────────────────────────────────────
  useEffect(()=>{
    if(!open||!currentStep||codecActive)return
    const fetchContent=async()=>{
      const stepId=currentStep.id
      if(stepContent[stepId])return
      setLoadingContent(prev=>({...prev,[stepId]:true}))
      try{
        const response=await fetch(`/api/guide-content?step=${stepId}`)
        if(response.ok){const data=await response.json();if(data.guidanceText){setStepContent(prev=>({...prev,[stepId]:data.guidanceText}))}}
      }catch(error){console.error('Failed to fetch guide content:',error)}
      finally{setLoadingContent(prev=>({...prev,[stepId]:false}))}
    }
    fetchContent()
  },[open,currentStep?.id,codecActive])

  // ── Navigation with faction-aware codec interstitial ─────────────────────
  const advanceTo = (nextIndex: number) => {
    const triggerMap = CODEC_TRIGGERS[stepIndex]
    const faction = state.faction ?? "traditions"
    const trigger = triggerMap ? triggerMap[faction] : null
    if (trigger && nextIndex > stepIndex) {
      setCodecData(trigger)
      setPendingStep(nextIndex)
      setCodecTypingDone(false)
      setCodecActive(true)
    } else {
      setStepIndex(nextIndex)
    }
  }

  const dismissCodec = () => {
    setCodecActive(false)
    setCodecData(null)
    setStepIndex(pendingStep)
  }

  const handleNext=()=>{ if(stepIndex+1<totalSteps) advanceTo(stepIndex+1); else handleClose() }
  const handleBack=()=>{ if(stepIndex>0)setStepIndex(stepIndex-1) }
  const handleClose=()=>{ setStepIndex(0); setCodecActive(false); setCodecData(null); onClose() }

  const showFooter=!currentStep.selfNavigates

  const stepGuidance=stepContent[currentStep?.id]||null
  const isLoadingCMS=loadingContent[currentStep?.id]||false

  return (
    <Dialog open={open} onOpenChange={isOpen=>{ if(!isOpen)handleClose() }}>
      <DialogContent className="sm:max-w-4xl max-h-[95vh] overflow-hidden flex flex-col p-0"
        style={{background:"hsl(var(--card))",border:"1px solid hsl(var(--primary)/0.35)",boxShadow:"0 0 0 1px hsl(var(--primary)/0.12), 0 32px 64px rgba(0,0,0,0.65), inset 0 1px 0 hsl(var(--primary)/0.1)",borderRadius:"14px"}}>
        <div className="absolute top-0 left-0 right-0 h-[2px] rounded-t-[14px] pointer-events-none z-10" aria-hidden="true" style={{background:"linear-gradient(90deg,hsl(var(--accent)/0.7),hsl(var(--primary)/0.6) 30%,transparent 75%)"}}/>

        {/* ── CODEC INTERSTITIAL — replaces step content when active ── */}
        {codecActive && codecData ? (
          <div className="flex flex-col flex-1 overflow-hidden">
            {/* Minimal header so the dialog doesn't look broken */}
            <div className="px-6 pt-5 pb-3 shrink-0 flex items-center justify-between"
              style={{borderBottom:"1px solid hsl(var(--border)/0.3)"}}>
              <span className="font-serif text-[9px] uppercase tracking-[0.3em]"
                style={{color:"hsl(var(--primary)/0.4)"}}>Incoming Transmission</span>
              <button
                onClick={dismissCodec}
                className="font-mono text-[9px] uppercase tracking-[0.2em] px-3 py-1 rounded transition-all hover:bg-primary/[0.08]"
                style={{color:"hsl(var(--foreground)/0.35)",border:"1px solid hsl(var(--border)/0.4)"}}>
                Skip ▶
              </button>
            </div>

            {/* Codec component — faction determines which NPC appears */}
            <div className="flex-1 overflow-y-auto">
              {state.faction === "technocracy" ? (
                <TechnocracyCodec
                  dialogue={codecData.dialogue}
                  stepName={codecData.stepName}
                  onTypingComplete={()=>setCodecTypingDone(true)}
                />
              ) : (
                <DanteCodec
                  dialogue={codecData.dialogue}
                  stepName={codecData.stepName}
                  onTypingComplete={()=>setCodecTypingDone(true)}
                />
              )}
            </div>

            {/* Codec footer — Continue only enabled after typing finishes */}
            <div className="shrink-0 px-6 py-4 flex items-center justify-between gap-3"
              style={{borderTop:"1px solid hsl(var(--border)/0.4)"}}>
              <span className="font-mono text-[9px] uppercase tracking-[0.2em]"
                style={{color:"hsl(var(--foreground)/0.25)"}}>
                {codecTypingDone ? "Transmission complete" : "Receiving…"}
              </span>
              <button
                onClick={dismissCodec}
                disabled={!codecTypingDone}
                className="group relative overflow-hidden inline-flex items-center gap-2 rounded-full px-5 py-2 font-serif text-[10px] uppercase tracking-[0.16em] font-bold transition-all duration-200 hover:-translate-y-px disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:translate-y-0"
                style={{
                  background: "linear-gradient(135deg,hsl(var(--accent)),hsl(var(--accent)/0.82))",
                  color:      "hsl(var(--accent-foreground))",
                  border:     "none",
                  boxShadow:  codecTypingDone
                    ? "0 0 0 1px hsl(var(--accent)/0.38),0 4px 14px hsl(var(--accent)/0.25)"
                    : "none",
                }}>
                <span className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" aria-hidden="true"
                  style={{background:"linear-gradient(105deg,transparent 25%,rgba(255,255,255,0.16) 50%,transparent 75%)"}}/>
                <span className="relative">Continue →</span>
              </button>
            </div>
          </div>
        ) : (
          /* ── NORMAL STEP CONTENT ── */
          <>
            <DialogHeader className="px-6 pt-6 pb-0 shrink-0">
              <SegmentNav stepIndex={stepIndex} total={totalSteps}/>
              <div className="flex items-center justify-between mt-3 mb-1">
                <span className="font-serif text-[9px] uppercase tracking-[0.22em]" style={{color:"hsl(var(--primary)/0.5)"}}>{STEP_CATEGORIES.find(c=>c.steps.includes(stepIndex))?.label}</span>
                <span className="font-mono text-[9px]" style={{color:"hsl(var(--primary)/0.35)"}}>{stepIndex+1}&thinsp;/&thinsp;{totalSteps}</span>
              </div>
              <div className="h-px" aria-hidden="true" style={{background:"linear-gradient(90deg,hsl(var(--primary)/0.25),transparent)"}}/>
              <div className="pt-4 pb-1">
                <DialogTitle className="font-serif font-black uppercase text-primary leading-tight" style={{fontSize:"clamp(1rem,3vw,1.2rem)",letterSpacing:"0.1em"}}>{currentStep.title}</DialogTitle>
                <DialogDescription className="font-serif italic text-xs mt-1.5" style={{color:"hsl(var(--muted-foreground))"}}>{currentStep.description}</DialogDescription>
              </div>
              <div className="h-px" aria-hidden="true" style={{background:"linear-gradient(90deg,hsl(var(--border)/0.5),transparent)"}}/>
            </DialogHeader>
            <div className="flex-1 overflow-y-auto px-6 py-5" style={{scrollbarWidth:"thin",scrollbarColor:"hsl(var(--border)) transparent"}}>
             <StepPanel stepKey={stepIndex}>
              <currentStep.component
                state={state}
                setState={setState}
                onNext={handleNext}
                onBack={handleBack}
                setFreebiePoolAdjustment={setFreebiePoolAdjustment}
                freebiePoolAdjustment={freebiePoolAdjustment}
                onClose={handleClose}
                cmsContent={stepGuidance}
                isLoadingCMS={isLoadingCMS}
              />
             </StepPanel>
            </div>
            {showFooter&&(
              <div className="shrink-0 px-6 py-4 flex items-center justify-between gap-3" style={{borderTop:"1px solid hsl(var(--border)/0.4)"}}>
                <button onClick={handleBack} disabled={stepIndex===0} className="inline-flex items-center gap-1.5 px-4 py-2 rounded-md font-serif text-[10px] uppercase tracking-[0.12em] font-semibold transition-all duration-200 hover:bg-primary/[0.08] border border-transparent hover:border-primary/[0.18] disabled:opacity-30 disabled:cursor-not-allowed" style={{color:"hsl(var(--foreground)/0.6)"}}>← Back</button>
                {!currentStep.selfNavigates&&stepIndex<totalSteps-1&&(
                  <button onClick={handleNext} disabled={!currentStep.canProceed(state)} className="group relative overflow-hidden inline-flex items-center gap-2 rounded-full px-5 py-2 font-serif text-[10px] uppercase tracking-[0.16em] font-bold transition-all duration-200 hover:-translate-y-px disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:translate-y-0" style={{background:"linear-gradient(135deg,hsl(var(--accent)),hsl(var(--accent)/0.82))",color:"hsl(var(--accent-foreground))",border:"none",boxShadow:currentStep.canProceed(state)?"0 0 0 1px hsl(var(--accent)/0.38),0 4px 14px hsl(var(--accent)/0.25)":"none"}}><span className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" aria-hidden="true" style={{background:"linear-gradient(105deg,transparent 25%,rgba(255,255,255,0.16) 50%,transparent 75%)"}}/><span className="relative">Next →</span></button>
                )}
              </div>
            )}
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}

// =============================================================================
// MAIN PAGE — faction selector → pre-wizard codec → guided wizard
// =============================================================================
export default function CharacterGuidePage() {
  const [state,setState]                 = useState<CharacterState>(INITIAL_STATE)
  const [wizardOpen,setWizardOpen]       = useState(false)
  const [freebiePoolAdjustment,setFreebiePoolAdjustment] = useState(0)

  // ── Faction selector ───────────────────────────────────────────────────────
  const [showFactionSelect,setShowFactionSelect] = useState(false)

  // ── Pre-wizard codec ───────────────────────────────────────────────────────
  const [showPreCodec,setShowPreCodec]   = useState(false)
  const [preCodecDone,setPreCodecDone]   = useState(false)
  const [selectedFaction,setSelectedFaction] = useState<"traditions"|"technocracy"|null>(null)

  const hasStarted = state.name.length > 0

  // Landing "Begin Awakening" → open faction selector
  const openFactionSelect = () => {
    if (!hasStarted) setFreebiePoolAdjustment(0)
    setShowFactionSelect(true)
  }

  // Faction confirmed → store it, fire pre-wizard codec
  const handleFactionConfirmed = (faction: "traditions"|"technocracy") => {
    setSelectedFaction(faction)
    setState(prev => ({ ...prev, faction }))
    setShowFactionSelect(false)
    setPreCodecDone(false)
    setShowPreCodec(true)
  }

  // Pre-wizard codec dismissed → open wizard
  const handlePreCodecDismiss = () => {
    setShowPreCodec(false)
    setWizardOpen(true)
  }

  // In-progress "Continue" skips faction select + codec
  const continueWizard = () => { setWizardOpen(true) }

  const resetAndStart = () => {
    setState(INITIAL_STATE)
    setFreebiePoolAdjustment(0)
    setSelectedFaction(null)
    setShowFactionSelect(true)
  }

  const preCodecData = selectedFaction ? PRE_WIZARD_CODEC[selectedFaction] : null

  return (
    <>
      {/* ── Faction selector — full-screen overlay ── */}
      {showFactionSelect && (
        <div className="fixed inset-0 z-50">
          <CharacterTypeSelector
            onConfirm={handleFactionConfirmed}
            onBack={() => setShowFactionSelect(false)}
          />
        </div>
      )}

      {/* ── Pre-wizard codec — full-screen overlay ── */}
      {showPreCodec && preCodecData && (
        <div className="fixed inset-0 z-50 flex flex-col bg-black">
          {/* Header */}
          <div className="px-6 pt-5 pb-3 shrink-0 flex items-center justify-between"
            style={{borderBottom:"1px solid rgba(255,255,255,0.06)"}}>
            <span className="font-mono text-[9px] uppercase tracking-[0.3em] text-slate-600">
              Incoming Transmission
            </span>
            <button
              onClick={handlePreCodecDismiss}
              className="font-mono text-[9px] uppercase tracking-[0.2em] px-3 py-1 rounded border border-slate-800 text-slate-600 hover:text-slate-400 transition-colors">
              Skip ▶
            </button>
          </div>

          {/* Codec */}
          <div className="flex-1 overflow-y-auto">
            {preCodecData.component === "courage" ? (
              <TechnocracyCodec
                dialogue={preCodecData.dialogue}
                stepName={preCodecData.stepName}
                onTypingComplete={() => setPreCodecDone(true)}
              />
            ) : (
              <DanteCodec
                dialogue={preCodecData.dialogue}
                stepName={preCodecData.stepName}
                onTypingComplete={() => setPreCodecDone(true)}
              />
            )}
          </div>

          {/* Footer */}
          <div className="shrink-0 px-6 py-4 flex items-center justify-between"
            style={{borderTop:"1px solid rgba(255,255,255,0.06)"}}>
            <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-slate-700">
              {preCodecDone ? "Transmission complete" : "Receiving…"}
            </span>
            <button
              onClick={handlePreCodecDismiss}
              disabled={!preCodecDone}
              className="group relative overflow-hidden inline-flex items-center gap-2 rounded-full px-6 py-2.5 font-serif text-[10px] uppercase tracking-[0.16em] font-bold transition-all duration-200 hover:-translate-y-px disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:translate-y-0"
              style={{
                background: "linear-gradient(135deg,hsl(var(--accent)),hsl(var(--accent)/0.82))",
                color:      "hsl(var(--accent-foreground))",
                border:     "none",
                boxShadow:  preCodecDone ? "0 0 0 1px hsl(var(--accent)/0.38),0 4px 14px hsl(var(--accent)/0.25)" : "none",
              }}>
              <span className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                style={{background:"linear-gradient(105deg,transparent 25%,rgba(255,255,255,0.16) 50%,transparent 75%)"}}/>
              <span className="relative">Begin Creation →</span>
            </button>
          </div>
        </div>
      )}

      {/* ── Landing page ── */}
      <div className="min-h-screen relative z-[1] py-5 px-3 md:py-7 md:px-4 grimoire-bg">
        <div className="max-w-[900px] mx-auto bg-background rounded-xl overflow-hidden relative"
          style={{border:"1px solid hsl(var(--primary)/0.32)",boxShadow:"inset 0 1px 0 hsl(var(--primary)/0.12), 0 20px 60px hsl(var(--background)/0.8), 0 4px 24px rgba(0,0,0,0.45)"}}>
          {["-top-[6px] -left-[6px]","-top-[6px] -right-[6px]"].map((pos,i)=>(
            <div key={i} className={`absolute ${pos} text-primary z-10 text-xl pointer-events-none`}
              style={{filter:"drop-shadow(0 0 6px hsl(var(--primary)/0.6))"}} aria-hidden="true">◈</div>
          ))}
          <div className="h-px w-full pointer-events-none" aria-hidden="true"
            style={{background:"linear-gradient(90deg,hsl(var(--accent)/0.55) 0%,hsl(var(--primary)/0.5) 15%,hsl(var(--primary)/0.15) 55%,transparent 100%)"}}/>

          {/* Header */}
          <div className="text-center px-8 pt-10 pb-8" style={{borderBottom:"1px solid hsl(var(--border)/0.5)"}}>
            <div className="mb-3">
              <span className="font-serif text-[10px] uppercase tracking-[0.3em]" style={{color:"hsl(var(--primary)/0.5)"}}>The Paradox Wheel</span>
            </div>
            <h1 className="font-serif font-black uppercase text-primary"
              style={{fontSize:"clamp(1.6rem,5vw,2.8rem)",letterSpacing:"0.12em",textShadow:"0 0 40px hsl(var(--primary)/0.2)"}}>
              Character Creation
            </h1>
            <p className="font-serif italic mt-2 text-muted-foreground" style={{fontSize:"0.95rem"}}>
              Mage: The Ascension — Guided Awakening
            </p>
            <div className="flex items-center gap-3 mt-5 justify-center">
              <div className="h-px flex-1 max-w-[120px]" style={{background:"linear-gradient(90deg,transparent,hsl(var(--primary)/0.4))"}}/>
              <span className="text-primary text-lg" aria-hidden="true" style={{fontVariantEmoji:"text" as any}}>⚙&#xFE0E;</span>
              <div className="h-px flex-1 max-w-[120px]" style={{background:"linear-gradient(270deg,transparent,hsl(var(--primary)/0.4))"}}/>
            </div>
          </div>

          {/* Content */}
          <div className="px-8 py-10"
            style={{backgroundImage:`url("data:image/svg+xml,%3Csvg width='40' height='40' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M40 0L0 0 0 40' fill='none' stroke='%237b5ea7' stroke-width='0.35' opacity='0.06'/%3E%3C/svg%3E")`}}>
            {!hasStarted ? (
              <div className="space-y-8 text-center">
                <div className="max-w-lg mx-auto space-y-3">
                  <p className="font-serif text-foreground" style={{fontSize:"0.95rem",lineHeight:1.7}}>
                    This wizard will guide you through creating a Mage: The Ascension character step by step — with lore guidance, mechanical explanations, and NPC guidance at every stage.
                  </p>
                  <p className="font-serif text-muted-foreground" style={{fontSize:"0.85rem"}}>
                    13 steps · approximately 15–20 minutes
                  </p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-xl mx-auto">
                  {[
                    {icon:"✦", label:"Lore Guidance",  desc:"Blurbs for Traditions, Conventions, Spheres"},
                    {icon:"◈", label:"Step by Step",   desc:"One decision at a time, never overwhelming"},
                    {icon:"✧", label:"NPC Guidance",   desc:"Dante or John Courage walk you through it"},
                  ].map(f=>(
                    <div key={f.label} className="rounded-lg p-4 text-center"
                      style={{background:"hsl(var(--card))",border:"1px solid hsl(var(--border)/0.5)"}}>
                      <div className="text-xl text-primary mb-2" aria-hidden="true" style={{fontVariantEmoji:"text" as any}}>{f.icon}&#xFE0E;</div>
                      <div className="font-serif text-[10px] uppercase tracking-[0.16em] text-primary mb-1">{f.label}</div>
                      <div className="text-xs text-muted-foreground font-serif">{f.desc}</div>
                    </div>
                  ))}
                </div>
                <button onClick={openFactionSelect}
                  className="group relative overflow-hidden inline-flex items-center gap-2.5 rounded-full px-8 py-3.5 font-serif text-[11px] uppercase tracking-[0.2em] font-bold transition-all duration-200 hover:-translate-y-px active:translate-y-0"
                  style={{
                    background: "linear-gradient(135deg,hsl(var(--accent)) 0%,hsl(var(--accent)/0.82) 100%)",
                    color:      "hsl(var(--accent-foreground))",
                    border:     "none",
                    boxShadow:  "0 0 0 1px hsl(var(--accent)/0.38), 0 6px 24px hsl(var(--accent)/0.3)",
                  }}>
                  <span className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" aria-hidden="true"
                    style={{background:"linear-gradient(105deg,transparent 25%,rgba(255,255,255,0.16) 50%,transparent 75%)"}}/>
                  <Sparkles className="relative w-4 h-4"/>
                  <span className="relative">Begin Awakening</span>
                </button>
              </div>
            ) : (
              <div className="space-y-6 text-center">
                <div>
                  <p className="font-serif text-xs uppercase tracking-[0.2em] text-muted-foreground mb-1">In Progress</p>
                  <h2 className="font-serif font-black uppercase text-primary" style={{fontSize:"1.4rem",letterSpacing:"0.1em"}}>
                    {state.name}
                  </h2>
                  <div className="flex items-center justify-center gap-2 mt-2 flex-wrap">
                    {state.faction && (
                      <span className="font-serif text-[9px] uppercase tracking-[0.2em] px-2 py-0.5 rounded-full inline-block"
                        style={{
                          color:      state.faction==="technocracy" ? "hsl(210 80% 70%)" : "hsl(var(--primary)/0.7)",
                          background: state.faction==="technocracy" ? "hsl(210 80% 60%/0.1)" : "hsl(var(--primary)/0.08)",
                          border:     `1px solid ${state.faction==="technocracy" ? "hsl(210 80% 60%/0.25)" : "hsl(var(--primary)/0.18)"}`,
                        }}>
                        {state.faction === "technocracy" ? "The Union" : "The Traditions"}
                      </span>
                    )}
                    {state.affiliation && (
                      <span className="font-serif text-[9px] uppercase tracking-[0.2em] px-2 py-0.5 rounded-full inline-block"
                        style={{color:"hsl(var(--primary)/0.7)",background:"hsl(var(--primary)/0.08)",border:"1px solid hsl(var(--primary)/0.18)"}}>
                        {state.affiliation}
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <button onClick={continueWizard}
                    className="group relative overflow-hidden inline-flex items-center gap-2 rounded-full px-6 py-2.5 font-serif text-[10px] uppercase tracking-[0.18em] font-bold transition-all duration-200 hover:-translate-y-px"
                    style={{background:"linear-gradient(135deg,hsl(var(--accent)),hsl(var(--accent)/0.82))",color:"hsl(var(--accent-foreground))",border:"none",boxShadow:"0 0 0 1px hsl(var(--accent)/0.38),0 4px 18px hsl(var(--accent)/0.25)"}}>
                    <Sparkles className="w-3.5 h-3.5"/>Continue Creation
                  </button>
                  <button onClick={resetAndStart}
                    className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full font-serif text-[10px] uppercase tracking-[0.18em] font-semibold transition-all duration-200 hover:bg-primary/[0.08] border border-transparent hover:border-primary/[0.18]"
                    style={{color:"hsl(var(--foreground)/0.55)"}}>
                    Start Over
                  </button>
                </div>
              </div>
            )}
          </div>

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
// SHARED UI PRIMITIVES
// =============================================================================

function GuidanceBox({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-md px-4 py-3 text-sm space-y-1.5 font-serif leading-relaxed"
      style={{background:"hsl(var(--card))",border:"1px solid hsl(var(--border)/0.5)",borderLeft:"3px solid hsl(var(--primary)/0.5)",color:"hsl(var(--foreground)/0.85)"}}>
      {children}
    </div>
  )
}

function LoreBox({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-md px-3 py-2.5 text-xs font-serif italic leading-relaxed"
      style={{background:"hsl(var(--card)/0.8)",border:"1px solid hsl(var(--border)/0.3)",color:"hsl(var(--foreground)/0.75)"}}>
      {children}
    </div>
  )
}

function SheetLabel({ children }: { children: React.ReactNode }) {
  return (
    <label className="block font-serif text-[10px] uppercase tracking-[0.15em] mb-1.5" style={{color:"hsl(var(--primary)/0.7)"}}>
      {children}
    </label>
  )
}

function SheetInput({ label, value, onChange, placeholder }: { label: string; value: string; onChange: (v: string) => void; placeholder?: string }) {
  return (
    <div>
      <SheetLabel>{label}</SheetLabel>
      <input value={value} onChange={e=>onChange(e.target.value)} placeholder={placeholder}
        className="w-full rounded-md px-3 py-2 text-sm font-sans text-foreground transition-all duration-200 outline-none"
        style={{background:"hsl(var(--background)/0.6)",border:"1px solid hsl(var(--border)/0.7)",backdropFilter:"blur(4px)"}}
        onFocus={e=>{e.currentTarget.style.borderColor="hsl(var(--primary)/0.55)";e.currentTarget.style.boxShadow="0 0 0 2px hsl(var(--primary)/0.12)"}}
        onBlur={e=>{e.currentTarget.style.borderColor="hsl(var(--border)/0.7)";e.currentTarget.style.boxShadow="none"}}/>
    </div>
  )
}

function SheetSelect({ label, value, onChange, options, placeholder }: { label: string; value: string; onChange: (v: string) => void; options: string[]; placeholder?: string }) {
  return (
    <div>
      <SheetLabel>{label}</SheetLabel>
      <select value={value} onChange={e=>onChange(e.target.value)}
        className="w-full rounded-md px-3 py-2 text-sm font-serif text-foreground transition-all duration-200 outline-none"
        style={{background:"hsl(var(--background)/0.6)",border:"1px solid hsl(var(--border)/0.7)",backdropFilter:"blur(4px)"}}
        onFocus={e=>{e.currentTarget.style.borderColor="hsl(var(--primary)/0.55)";e.currentTarget.style.boxShadow="0 0 0 2px hsl(var(--primary)/0.12)"}}
        onBlur={e=>{e.currentTarget.style.borderColor="hsl(var(--border)/0.7)";e.currentTarget.style.boxShadow="none"}}>
        <option value="">{placeholder||"Select…"}</option>
        {options.map(o=><option key={o} value={o}>{o}</option>)}
      </select>
    </div>
  )
}

function SheetButton({ onClick, disabled, children, variant="primary" }: { onClick: () => void; disabled?: boolean; children: React.ReactNode; variant?: "primary"|"secondary" }) {
  if(variant==="secondary") {
    return (
      <button onClick={onClick} disabled={disabled}
        className="inline-flex items-center justify-center gap-1 px-4 py-2 rounded-md font-serif text-[10px] uppercase tracking-[0.12em] font-semibold transition-all duration-200 hover:bg-primary/[0.08] border border-transparent hover:border-primary/[0.18] disabled:opacity-30 disabled:cursor-not-allowed"
        style={{color:"hsl(var(--foreground)/0.6)"}}>
        {children}
      </button>
    )
  }
  return (
    <button onClick={onClick} disabled={disabled}
      className="group relative overflow-hidden w-full mt-4 inline-flex items-center justify-center gap-2 rounded-full py-2.5 px-5 font-serif text-[11px] uppercase tracking-[0.16em] font-bold transition-all duration-200 hover:-translate-y-px active:translate-y-0 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:translate-y-0"
      style={{background:"linear-gradient(135deg, hsl(var(--accent)), hsl(var(--accent)/0.82))",color:"hsl(var(--accent-foreground))",border:"none",boxShadow:disabled?"none":"0 0 0 1px hsl(var(--accent)/0.38), 0 4px 18px hsl(var(--accent)/0.25)"}}>
      <span className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" aria-hidden="true" style={{background:"linear-gradient(105deg,transparent 25%,rgba(255,255,255,0.16) 50%,transparent 75%)"}}/>
      <span className="relative">{children}</span>
    </button>
  )
}

function PrioritySelector({ label, subtitle, selected, onSelect }: { label: string; subtitle: string; selected: Priority; onSelect: (p: Priority) => void }) {
  const isAttr = subtitle.includes("Strength")||subtitle.includes("Charisma")||subtitle.includes("Perception")
  const dots = isAttr ? {primary:"7 dots",secondary:"5 dots",tertiary:"3 dots"} : {primary:"13 dots",secondary:"9 dots",tertiary:"5 dots"}
  return (
    <div className="flex items-center justify-between p-4 rounded-lg" style={{background:"hsl(var(--card))",border:"1px solid hsl(var(--border)/0.55)"}}>
      <div className="flex-1 min-w-0 pr-3">
        <h3 className="font-serif font-bold text-sm text-primary">{label}</h3>
        <p className="text-[10px] mt-0.5 text-muted-foreground font-serif">{subtitle}</p>
      </div>
      <div className="flex gap-2 shrink-0">
        {(["primary","secondary","tertiary"] as const).map(p=>{
          const on=selected===p
          return (
            <button key={p} onClick={()=>onSelect(p)}
              className="px-3 py-1.5 rounded-full text-[10px] font-serif font-bold uppercase tracking-[0.1em] transition-all duration-200"
              style={{background:on?"linear-gradient(135deg, hsl(var(--accent)), hsl(var(--accent)/0.82))":"transparent",color:on?"hsl(var(--accent-foreground))":"hsl(var(--foreground)/0.5)",border:on?"none":"1px solid hsl(var(--border)/0.6)",boxShadow:on?"0 0 0 1px hsl(var(--accent)/0.3),0 2px 8px hsl(var(--accent)/0.2)":"none"}}>
              {dots[p]}
            </button>
          )
        })}
      </div>
    </div>
  )
}

function AttributeSection({ title, priority, remaining, total, children }: { title: string; priority: Priority; remaining: number; total: number; children: React.ReactNode }) {
  const done=remaining===0
  return (
    <div className="relative rounded-lg p-4 overflow-hidden" style={{background:"hsl(var(--card))",border:"1px solid hsl(var(--border)/0.55)"}}>
      <div className="absolute top-0 left-0 right-0 h-[2px]" style={{background:"linear-gradient(90deg,transparent,hsl(var(--primary)/0.5),transparent)"}}/>
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-serif font-bold uppercase text-primary" style={{fontSize:"0.75rem",letterSpacing:"0.18em"}}>{title}</h3>
        <span className="font-mono text-[10px] px-2.5 py-1 rounded-full font-semibold"
          style={{background:done?"hsl(var(--accent)/0.15)":"hsl(var(--border)/0.4)",color:done?"hsl(var(--accent))":"hsl(var(--muted-foreground))",border:done?"1px solid hsl(var(--accent)/0.3)":"1px solid transparent"}}>
          {remaining}/{total}
        </span>
      </div>
      <div className="space-y-1">{children}</div>
    </div>
  )
}

function AbilityColumn({ title, priority, remaining, total, children }: { title: string; priority: Priority; remaining: number; total: number; children: React.ReactNode }) {
  const done=remaining===0
  return (
    <div>
      <div className="flex items-center justify-between mb-3 pb-2" style={{borderBottom:"1px solid hsl(var(--border)/0.4)"}}>
        <h3 className="font-serif font-bold uppercase text-primary" style={{fontSize:"0.7rem",letterSpacing:"0.2em"}}>{title}</h3>
        <span className="font-mono text-[9px] px-2 py-0.5 rounded-full font-semibold"
          style={{background:done?"hsl(var(--accent)/0.15)":"hsl(var(--border)/0.4)",color:done?"hsl(var(--accent))":"hsl(var(--muted-foreground))"}}>
          {remaining}/{total}
        </span>
      </div>
      <div className="space-y-0.5">{children}</div>
    </div>
  )
}

function SheetDotRating({ label, value, onChange, locked, maxDots=5, variant="attribute" }: { label: string; value: number; onChange: (v: number) => void; locked?: boolean; maxDots?: number; variant?: "attribute"|"ability"|"sphere"|"arete" }) {
  const [hovered,setHovered]=useState<number|null>(null)
  const display=hovered!==null?hovered:value
  const isGold=variant==="arete"
  const fillColor=isGold?"hsl(var(--accent))":"hsl(var(--primary))"
  const borderFill=isGold?"hsl(var(--accent)/0.9)":"hsl(var(--primary)/0.9)"
  const borderEmpty=isGold?"hsl(var(--accent)/0.3)":"hsl(var(--primary)/0.3)"
  const glowColor=isGold?"0 0 6px hsl(var(--accent)/0.5),inset 0 0 3px rgba(255,255,255,0.2)":"0 0 6px hsl(var(--primary)/0.45),inset 0 0 3px rgba(255,255,255,0.15)"
  return (
    <div className="flex items-center justify-between py-1.5">
      <span className="text-sm font-serif text-foreground flex-1" style={{opacity:0.85}}>{label}</span>
      <div className="flex gap-0.5" onMouseLeave={()=>setHovered(null)}>
        {Array.from({length:maxDots},(_,i)=>{
          const dv=i+1; const filled=dv<=display; const isLocked=locked&&dv===1
          return (
            <button key={i}
              onClick={()=>{if(isLocked)return;if(locked&&dv===value)onChange(1);else onChange(dv===value?(locked?1:0):dv)}}
              onMouseEnter={()=>!isLocked&&setHovered(dv)}
              disabled={isLocked}
              className={cn("rounded-full transition-all duration-150",!isLocked&&"hover:scale-110 cursor-pointer")}
              style={{width:"16px",height:"16px",border:`2px solid ${filled?borderFill:borderEmpty}`,backgroundColor:filled?fillColor:"transparent",opacity:isLocked?0.6:1,boxShadow:filled?glowColor:"none"}}>
              {isLocked&&<Lock className="w-2 h-2 m-auto" style={{color:"hsl(var(--accent-foreground))"}}/>}
            </button>
          )
        })}
      </div>
    </div>
  )
}

function FreebieDotRating({ label, baseDots, freebieDots, onAdd, onRemove, maxDots=5, cost }: { label: string; baseDots: number; freebieDots: number; onAdd: () => void; onRemove: () => void; maxDots?: number; cost: number }) {
  const total=baseDots+freebieDots
  return (
    <div className="flex items-center justify-between py-2 px-2 rounded hover:bg-primary/[0.04] transition-colors">
      <span className="text-sm font-serif flex-1 min-w-0 truncate" style={{color:"hsl(var(--foreground)/0.85)"}}>{label}</span>
      <div className="flex items-center gap-3 shrink-0">
        <div className="flex gap-1">
          {Array.from({length:maxDots},(_,i)=>{
            const dv=i+1; const isBase=dv<=baseDots; const isFree=dv>baseDots&&dv<=total
            return (
              <div key={i} className="rounded-full relative" style={{width:"18px",height:"18px",border:`2px solid hsl(var(--primary)/${isBase||isFree?"0.9":"0.3"})`,backgroundColor:isBase?"hsl(var(--primary))":"transparent",boxShadow:isBase?"0 0 5px hsl(var(--primary)/0.4)":"none"}}>
                {isFree&&<><div className="absolute inset-0 rounded-full" style={{backgroundColor:"hsl(var(--primary))"}}/><div className="absolute inset-0 rounded-full" style={{background:"linear-gradient(90deg,transparent 50%,hsl(var(--accent)) 50%)"}}/></>}
              </div>
            )
          })}
        </div>
        <div className="flex items-center gap-1">
          <button onClick={onRemove} disabled={freebieDots<=0} className="w-6 h-6 rounded flex items-center justify-center transition-all hover:scale-110 disabled:opacity-30" style={{background:"hsl(var(--border)/0.8)",color:"hsl(var(--foreground))"}}>
            <Minus className="w-3 h-3"/>
          </button>
          <span className="text-[10px] font-mono w-8 text-center text-muted-foreground">{cost}pt</span>
          <button onClick={onAdd} disabled={total>=maxDots} className="w-6 h-6 rounded flex items-center justify-center transition-all hover:scale-110 disabled:opacity-30" style={{background:"hsl(var(--accent))",color:"hsl(var(--accent-foreground))"}}>
            <Plus className="w-3 h-3"/>
          </button>
        </div>
      </div>
    </div>
  )
}
