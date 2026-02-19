import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  await prisma.guideSection.createMany({
    data: [
      {
        id: 'concept',
        title: 'Concept & Tradition',
        content: 'Define your character\'s core concept, background, and their chosen magical Tradition. Your Tradition will determine your affinity Sphere and philosophical approach to magic.',
        category: 'overview',
        order: 1
      },
      {
        id: 'attributes',
        title: 'Attributes Overview',
        content: 'Each attribute starts at 1 dot. Choose which category (Physical, Social, or Mental) gets 7 additional dots (Primary), 5 additional dots (Secondary), and 3 additional dots (Tertiary).',
        category: 'overview',
        order: 2
      },
      {
        id: 'abilities',
        title: 'Abilities Overview',
        content: 'Distribute points among Talents (intuitive), Skills (practiced), and Knowledges (scholarly). Choose which category gets 13 dots (Primary), 9 dots (Secondary), and 5 dots (Tertiary). No ability can exceed 3 dots during character creation.',
        category: 'overview',
        order: 3
      },
      {
        id: 'spheres',
        title: 'Spheres Overview',
        content: 'Your Tradition grants one affinity Sphere at 1 dot (counts as 1 of your 6 dots). Distribute the remaining 5 dots among the Nine Spheres. Maximum 3 dots per Sphere during character creation.',
        category: 'overview',
        order: 4
      },
      {
        id: 'backgrounds',
        title: 'Backgrounds Overview',
        content: 'Backgrounds represent your character\'s resources, connections, and advantages. Avatar is essential for mages. Distribute 7 dots among backgrounds like Resources, Allies, Node, Library, and more.',
        category: 'overview',
        order: 5
      },
      {
        id: 'freebies',
        title: 'Freebie Points Overview',
        content: 'Use 15 freebie points to further customize your character. Costs: Attributes (5 pts), Abilities (2 pts), Spheres (7 pts), Backgrounds (1 pt), Arete (4 pts), Willpower (1 pt). You can also select Merits (cost points) and Flaws (give points, max +7).',
        category: 'overview',
        order: 6
      }
    ]
  })
  
  console.log('Seeded guide sections!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
