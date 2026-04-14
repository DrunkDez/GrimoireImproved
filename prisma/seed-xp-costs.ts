import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const officialCosts = [
  {
    category: "attribute",
    costType: "multiplier",
    multiplier: 4,
    flatCost: null,
    name: "Attribute",
    formula: "new rating × 4",
    description: "Increasing an Attribute (Physical, Social, Mental) costs new rating × 4 XP.",
    bookRef: "M20 p.406",
  },
  {
    category: "ability",
    costType: "multiplier",
    multiplier: 2,
    flatCost: null,
    name: "Ability",
    formula: "new rating × 2",
    description: "Increasing an Ability (Talents, Skills, Knowledges) costs new rating × 2 XP.",
    bookRef: "M20 p.406",
  },
  {
    category: "new_ability",
    costType: "flat",
    multiplier: null,
    flatCost: 3,
    name: "New Ability",
    formula: "3",
    description: "Learning a new Ability at rating 1 costs 3 XP.",
    bookRef: "M20 p.406",
  },
  {
    category: "arete",
    costType: "multiplier",
    multiplier: 8,
    flatCost: null,
    name: "Arete",
    formula: "new rating × 8",
    description: "Increasing Arete costs new rating × 8 XP.",
    bookRef: "M20 p.406",
  },
  {
    category: "sphere",
    costType: "multiplier",
    multiplier: 7,
    flatCost: null,
    name: "Sphere",
    formula: "new rating × 7",
    description: "Increasing a Sphere costs new rating × 7 XP.",
    bookRef: "M20 p.406",
  },
  {
    category: "willpower",
    costType: "multiplier",
    multiplier: 1,
    flatCost: null,
    name: "Willpower",
    formula: "current rating × 1",
    description: "Increasing Willpower costs current rating × 1 XP (i.e., the new rating costs the old rating).",
    bookRef: "M20 p.406",
  },
  {
    category: "new_sphere",
    costType: "flat",
    multiplier: null,
    flatCost: 10,
    name: "New Sphere",
    formula: "10",
    description: "Gaining a new Sphere at rating 1 costs 10 XP.",
    bookRef: "M20 p.406",
  },
  {
    category: "background",
    costType: "multiplier",
    multiplier: 3,
    flatCost: null,
    name: "Background",
    formula: "new rating × 3",
    description: "Increasing a Background costs new rating × 3 XP.",
    bookRef: "M20 p.406",
  },
  {
    category: "merit",
    costType: "multiplier",
    multiplier: 2,
    flatCost: null,
    name: "Merit",
    formula: "merit cost × 2",
    description: "Purchasing a Merit costs its point value × 2 XP.",
    bookRef: "M20 p.406",
  },
  {
    category: "remove_flaw",
    costType: "multiplier",
    multiplier: 2,
    flatCost: null,
    name: "Remove Flaw",
    formula: "flaw value × 2",
    description: "Removing a Flaw costs its point value × 2 XP.",
    bookRef: "M20 p.406",
  },
]

async function main() {
  console.log('🌱 Seeding official XP costs...')
  
  for (const cost of officialCosts) {
    await prisma.experienceCost.upsert({
      where: { category: cost.category },
      update: cost,
      create: cost,
    })
    console.log(`  ✓ ${cost.name}`)
  }
  
  console.log('✅ Seeding finished. Added', officialCosts.length, 'XP cost entries.')
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })