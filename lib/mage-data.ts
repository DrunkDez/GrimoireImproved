export interface Rote {
  id: string
  name: string
  tradition: string
  description: string
  spheres: Record<string, number>
  level: string
  pageRef?: string
}

export const TRADITIONS = [
  'Akashic Brotherhood',
  'Celestial Chorus',
  'Cult of Ecstasy',
  'Dreamspeakers',
  'Euthanatos',
  'Order of Hermes',
  'Sons of Ether',
  'Verbena',
  'Virtual Adepts',
  'Hollow Ones',
  'Orphans',
] as const

export const TECHNOCRACY_CONVENTIONS = [
  'Iteration X',
  'New World Order',
  'Progenitors',
  'Syndicate',
  'Void Engineers',
] as const

export const ALL_FACTIONS = [...TRADITIONS, ...TECHNOCRACY_CONVENTIONS] as const

export const SPHERES = [
  'Correspondence',
  'Entropy',
  'Forces',
  'Life',
  'Matter',
  'Mind',
  'Prime',
  'Spirit',
  'Time',
] as const

export const TECHNOCRACY_SPHERES = [
  'Data',
  'Dimensional Science',
  'Primal Utility',
] as const

export const ALL_SPHERES = [...SPHERES, ...TECHNOCRACY_SPHERES] as const

// Mapping Technocracy sphere names to their Tradition equivalents and vice versa
// Data <-> Correspondence, Primal Utility <-> Prime, Dimensional Science <-> Spirit
export const SPHERE_ALIASES: Record<string, string> = {
  'Data': 'Correspondence',
  'Correspondence': 'Data',
  'Primal Utility': 'Prime',
  'Prime': 'Primal Utility',
  'Dimensional Science': 'Spirit',
  'Spirit': 'Dimensional Science',
}

export function getLinkedSpheres(sphereName: string): string[] {
  const alias = SPHERE_ALIASES[sphereName]
  return alias ? [sphereName, alias] : [sphereName]
}

export const SPHERE_LEVELS = [0, 1, 2, 3, 4, 5] as const

export const SAMPLE_ROTES: Rote[] = [
  {
    id: '1',
    name: 'The Flickering Ward',
    tradition: 'Order of Hermes',
    description:
      'By tracing ancient Enochian sigils in the air and speaking words of binding, the mage weaves a protective barrier that deflects incoming Forces effects. The ward shimmers with faint golden light visible only to those with awakened perception.',
    spheres: { Forces: 3, Prime: 2 },
    level: 'Disciple',
    pageRef: 'Book of Shadows, p.142',
  },
  {
    id: '2',
    name: "Ancestor's Whisper",
    tradition: 'Dreamspeakers',
    description:
      'The shaman enters a trance state, beating a steady rhythm on their drum to thin the Gauntlet. Spirits of the dead are drawn to the sound, and the most knowledgeable among them are coaxed into sharing fragments of lost knowledge.',
    spheres: { Spirit: 3, Mind: 2, Entropy: 1 },
    level: 'Disciple',
    pageRef: 'Spirit Ways, p.87',
  },
  {
    id: '3',
    name: 'Temporal Echo',
    tradition: 'Cult of Ecstasy',
    description:
      'Through rhythmic movement and carefully controlled altered states, the Ecstatic perceives the temporal echoes left by significant events. The past bleeds through in shimmering after-images that replay key moments.',
    spheres: { Time: 3, Correspondence: 2 },
    level: 'Disciple',
    pageRef: 'The Book of Madness, p.201',
  },
  {
    id: '4',
    name: 'Living Cipher',
    tradition: 'Virtual Adepts',
    description:
      'The Adept encodes their consciousness as executable data, allowing them to project their awareness into the Digital Web. Their physical form enters a catatonic state while their digital avatar navigates the information streams.',
    spheres: { Correspondence: 4, Mind: 3 },
    level: 'Adept',
    pageRef: 'Digital Web 2.0, p.156',
  },
  {
    id: '5',
    name: 'Blood of the Earth',
    tradition: 'Verbena',
    description:
      'Drawing upon the primal life force that flows through all living things, the witch channels raw vitality into healing. The ritual requires blood freely given and words spoken in the Old Tongue.',
    spheres: { Life: 3, Prime: 2 },
    level: 'Disciple',
    pageRef: 'The Book of Crafts, p.63',
  },
  {
    id: '6',
    name: 'Resonance Cascade',
    tradition: 'Sons of Ether',
    description:
      'Using a modified Tesla apparatus, the Scientist generates a cascade of etheric resonance that disrupts the molecular bonds of inanimate matter. The effect is spectacular but imprecise, often leaving scorch marks in its wake.',
    spheres: { Matter: 4, Forces: 3, Prime: 2 },
    level: 'Adept',
    pageRef: 'Sons of Ether Tradition Book, p.98',
  },
  {
    id: '7',
    name: 'The Wheel of Fate',
    tradition: 'Euthanatos',
    description:
      'By reading the threads of destiny woven into the Tapestry, the Euthanatos can perceive the most likely path of entropy for a target. This manifests as a vision of the subject\'s eventual death or dissolution.',
    spheres: { Entropy: 4, Time: 2 },
    level: 'Adept',
    pageRef: 'Euthanatos Tradition Book, p.112',
  },
  {
    id: '8',
    name: 'Hymn of the Celestial Sphere',
    tradition: 'Celestial Chorus',
    description:
      'Raising their voice in sacred song, the Chorister channels the divine harmony of the One. The hymn resonates with Prime energy, cleansing an area of Resonance corruption and bolstering the faith of all who hear.',
    spheres: { Prime: 3, Mind: 2, Spirit: 1 },
    level: 'Disciple',
    pageRef: 'Celestial Chorus Tradition Book, p.77',
  },
  {
    id: '9',
    name: 'Iron Body Meditation',
    tradition: 'Akashic Brotherhood',
    description:
      'Through deep meditative practice and perfect control of chi flow, the Akashic strengthens their physical form beyond mortal limits. The skin takes on a faint metallic sheen as the body becomes resistant to harm.',
    spheres: { Life: 3, Mind: 2, Prime: 1 },
    level: 'Disciple',
    pageRef: 'Akashic Brotherhood Tradition Book, p.91',
  },
  {
    id: '10',
    name: 'The Gossamer Veil',
    tradition: 'Hollow Ones',
    description:
      'With a gesture born of equal parts melancholy and defiance, the Hollow One weaves an illusion of shadows and mist. The Veil obscures the mage from mundane perception, rendering them a half-seen ghost in the peripheral vision.',
    spheres: { Mind: 3, Forces: 2, Entropy: 1 },
    level: 'Disciple',
    pageRef: 'The Orphans Survival Guide, p.45',
  },
  {
    id: '11',
    name: 'Quintessential Forge',
    tradition: 'Order of Hermes',
    description:
      'The Hermetic mage inscribes a circle of power and channels raw Quintessence into a prepared vessel. Through precise application of Hermetic formulae, raw Prime energy is shaped and bound into permanent enchantment.',
    spheres: { Prime: 5, Matter: 3, Forces: 2 },
    level: 'Master',
    pageRef: 'Order of Hermes Tradition Book, p.188',
  },
  {
    id: '12',
    name: 'Dream Walk',
    tradition: 'Dreamspeakers',
    description:
      'The shaman projects their consciousness into the Dreaming, walking between the dreams of sleeping minds. In this twilight realm, they may gather information, deliver messages, or confront nightmares given terrible form.',
    spheres: { Mind: 4, Spirit: 3, Correspondence: 2 },
    level: 'Adept',
    pageRef: 'Spirit Ways, p.134',
  },
]

export function getSphereDots(level: number): string {
  return Array(level).fill('\u25CF').join(' ')
}

export function getTraditionSymbol(tradition: string): string {
  const symbols: Record<string, string> = {
    'Akashic Brotherhood': '\u2638',
    'Celestial Chorus': '\u2721',
    'Cult of Ecstasy': '\u2604',
    'Dreamspeakers': '\u263E',
    'Euthanatos': '\u2620',
    'Order of Hermes': '\u2641',
    'Sons of Ether': '\u269B',
    'Verbena': '\u2698',
    'Virtual Adepts': '\u2318',
    'Hollow Ones': '\u2606',
    'Orphans': '\u2734',
    'Iteration X': '\u2699',
    'New World Order': '\u2302',
    'Progenitors': '\u2695',
    'Syndicate': '\u2696',
    'Void Engineers': '\u2609',
  }
  return symbols[tradition] || '\u2726'
}

export function isTechnocracySphere(sphere: string): boolean {
  return (TECHNOCRACY_SPHERES as readonly string[]).includes(sphere)
}
