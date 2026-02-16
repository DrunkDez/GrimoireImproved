import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const BACKGROUNDS = [
  {
    "name": "Allies",
    "category": null,
    "subtype": "general",
    "cost": "Variable",
    "description": "In times of need, you've got folks who've got your back. These allies might be badass friends, helpful animals, people with connections, errand-runners, or minor spirits. Generally refers to unAwakened humans or fairly intelligent animals. Each dot gives you one ally with moderately useful abilities, or two allies who run errands. At two dots and above, you can increase ability or buy larger numbers. Magick-using Allies count as major ones. If allies are killed or quit, you lose those dots until you recruit replacements. Chart shows up to 10 allies at highest levels.",
    "pageRef": "M20 p. 303"
  },
  {
    "name": "Alternate Identity",
    "category": null,
    "subtype": "general",
    "cost": "Variable",
    "description": "You can adopt a fake identity. The higher the rating, the more support you have for that identity's existence. Levels range from fake driver's license (1) to fully supported identity with complete history, documents, witnesses, fake family photos, alternate homes (5). For each dot, you may add one dot's worth of other Background Traits to your other self (Allies, Resources, Spies, etc.). To penetrate an alternate identity, a character would need to roll a Mental Trait + Investigation against a difficulty of your Alternate Identity + 3. You can purchase this Trait several times for multiple IDs.",
    "pageRef": "M20 p. 304"
  },
  {
    "name": "Backup",
    "category": null,
    "subtype": "general",
    "cost": "Variable",
    "description": "You can call in the cavalry from your organization. Backup characters are largely faceless, have limited skills, and are expendable. Typical Backup personnel have Traits in the 1-3 range, with one or two notable Skills. Elite agents (mercenaries, ninja, cyborgs, minor spirits, large predatory animals) cost twice as much but have Traits in the 3-5 range. Must be part of a larger organization. Chart shows up to 20 typical agents or 10 elite 'temps'. Sample teams: All (students, drivers, couriers, lab techs, activists, merchants, laborers, EMTs, cult members, thugs); Agents of Authority (cops, military, reporters, EMTs, cleanup crews); Celebrities (fans, roadies, assistants, photographers, journalists, makeup artists); Clergy (acolytes, lay clergy, healers, devotees).",
    "pageRef": "M20 p. 306"
  },
  {
    "name": "Certification",
    "category": null,
    "subtype": "general",
    "cost": "Variable",
    "description": "Your character has official papers that allow her to pursue regulated activity. You'll need at least one dot in a related Ability for each dot in this Background (medical license requires Medicine 4). Certifications can be checked by authorities. Levels: 1-Hunting license, business license, passport; 2-Teaching certificate, bodywork license, PADI, CPA, trucker/motorcycle license, basic firearms permit; 3-Concealed weapons permit, HAZMAT disposal, clergy, lifeguard, PI license, private pilot; 4-Class C weapons permit, board-certified medical/legal professional, professional aircraft pilot, government intelligence operative; 5-Diplomatic immunity, license to kill.",
    "pageRef": "M20 p. 308"
  },
  {
    "name": "Contacts",
    "category": null,
    "subtype": "general",
    "cost": "Variable",
    "description": "You know people who know things. They can help dig up information, spread messages, pull strings, and call in small favors. When calling on contacts, roll an appropriate Social Attribute + Contacts. Each dot reflects one major Contact, a fleshed out character like an Ally. You can establish casual contacts with Social/Mental + Contacts roll, but they're harder to work with. This Background can go above five dots (up to 10 contacts shown). For sensitive information networks, see Spies.",
    "pageRef": "M20 p. 309"
  },
  {
    "name": "Fame",
    "category": null,
    "subtype": "general",
    "cost": "Variable",
    "description": "You're famous within the Sleeper world. Levels: 1-Within a select subculture; 2-Local celebrity; 3-Recognized by large portions of population; 4-National/international figure; 5-Famous almost everywhere. Fame confers status at cost of visibility and lets you get away with coincidences few others could manage. Successful Charisma, Manipulation, or Appearance + Fame roll can open doors. Fame brings stalkers, haters, critics, and thieves. Cast a spell in public and there'll be videos online instantly.",
    "pageRef": "M20 p. 313"
  },
  {
    "name": "Influence",
    "category": null,
    "subtype": "general",
    "cost": "Variable",
    "description": "You command attention and respect within the Sleepers' world. When you speak, folks listen and frequently obey. This Background can go up to 10. Levels: 1-Folks within your profession recognize you; 2-Various associates and small clout; 3-People in your field respect you; 4-Quite a bit of clout; 5-Force to be reckoned with; 6-Command influence within nation's political affairs; 7-Actions influence allied nations; 8-Command vast respect across cultural regions; 9-Dominance across socio-political spheres (EU, UN, ANC); 10-Influence extends across mortal world, some respect in Otherworlds. Unwise activities can lower rating.",
    "pageRef": "M20 p. 316"
  },
  {
    "name": "Library",
    "category": null,
    "subtype": "general",
    "cost": "Variable",
    "description": "Access to a multimedia archive vital to your mage. Includes material that helps you research Abilities and Spheres. Research topics by making successful Mental Trait + Library rolls. This Background can go above 5. A group can pool this Background; combined Library equals highest member's rating plus one dot for each additional contributor. Levels: 1-New Age paperbacks; 2-Lots of fiction, little substance; 3-Some useful stuff; 4-Respectable arcane data; 5-Decent collection of diverse lore; 6-Huge personal archive; 7-Extensive written, recorded, virtual information; 8-Full access to national archive; 9-Unrestricted access to personal, national, classified databases; 10-With time and assistance, can access almost anything written/stored.",
    "pageRef": "M20 p. 318"
  },
  {
    "name": "Resources",
    "category": null,
    "subtype": "general",
    "cost": "Variable",
    "description": "You've got cash and goods on hand. This Background goes to 10. Levels: X-Working poor, paycheck-to-paycheck; 1-Slightly ahead, small apartment, working-class income; 2-Lower middle class, condo, vehicle, savings; 3-Middle class with property; 4-Well-off, large house, two vehicles, millionaire; 5-Welcome to the 1%, multimillionaire; 6-Hollywood money; 7-Billionaires' club, influence entire business; 8-Bruce Wayne level, own companies; 9-Tony Stark level, own industries; 10-Bill Gates level, own governments. High ratings take time and effort to control. Storyteller may forbid Resources 8-10 for player characters.",
    "pageRef": "M20 p. 322"
  },
  {
    "name": "Retainers",
    "category": null,
    "subtype": "general",
    "cost": "Variable",
    "description": "Devoted servants, employees, mind-controlled servitors, lab-built constructs, or very minor spirits who do your bidding with loyalty. Unlike Allies or Familiars, they aren't skilled in mystic Arts or combat. Each retainer is a Storyteller character. If trained up, a retainer becomes an Ally instead. Levels: 1-One retainer; 2-Two retainers; 3-Three retainers; 4-Four retainers; 5-Five retainers. Rich people have several, but you don't need wealth - a homeless mage might have a loyal kid.",
    "pageRef": "M20 p. 323"
  },
  {
    "name": "Spies",
    "category": null,
    "subtype": "general",
    "cost": "Variable",
    "description": "Contacts who specialize in gathering sensitive information. Unlike regular Contacts, Spies work in networks and gather intelligence specifically. Each dot represents either one major Spy or several minor informants. Spies are more reliable than Contacts for covert information but are also more expensive to maintain. May require payment, favors, or other compensation.",
    "pageRef": "M20 p. 324"
  },
  {
    "name": "Avatar",
    "category": null,
    "subtype": "mage",
    "cost": "Variable",
    "description": "The spiritual companion that guides your mage's enlightenment. Higher ratings mean clearer guidance and stronger connection to your Avatar. Levels: 1-Distant, occasional whispers; 2-Dreams and vague impressions; 3-Clear visions and guidance; 4-Frequent communication; 5-Constant companion. Avatar affects Seeking experiences and provides insight into your Path.",
    "pageRef": "M20 p. 304"
  },
  {
    "name": "Arcane",
    "category": null,
    "subtype": "mage",
    "cost": "Variable",
    "description": "Supernatural obscurity that makes you difficult to notice, remember, or track. Each dot increases difficulty for others to perceive, recall, or investigate you. Works even through photographs and recordings. Levels: 1-Slightly forgettable; 2-Hard to describe; 3-Difficult to track; 4-Extremely obscure; 5-Nearly invisible to scrutiny. Paradox may temporarily lower this.",
    "pageRef": "M20 p. 305"
  },
  {
    "name": "Chantry",
    "category": null,
    "subtype": "mage",
    "cost": "Variable",
    "description": "Shared Background representing your mage's connection to a group stronghold. Rating reflects your influence within the Chantry and resources available. Includes library, sanctum space, security, and fellow members. Higher ratings mean better facilities and more authority. Must be shared among group members.",
    "pageRef": "M20 p. 308"
  },
  {
    "name": "Cult",
    "category": null,
    "subtype": "mage",
    "cost": "Variable",
    "description": "Religious, philosophical, or ideological followers who believe in your cause. Unlike Allies, they're devoted believers rather than equals. Levels: 1-Small group; 2-Dedicated congregation; 3-Growing movement; 4-Widespread following; 5-Major organized religion. Cult members provide resources, information, and support but expect guidance and can become liability.",
    "pageRef": "M20 p. 310"
  },
  {
    "name": "Destiny",
    "category": null,
    "subtype": "mage",
    "cost": "Variable",
    "description": "Fate has plans for you. Once per story, add Destiny rating to a single roll. Higher ratings indicate clearer and more powerful destiny. Levels: 1-Minor role to play; 2-Notable purpose; 3-Significant destiny; 4-Major fate; 5-World-changing purpose. Destiny may protect you from death but can also doom you to specific ending.",
    "pageRef": "M20 p. 311"
  },
  {
    "name": "Dream",
    "category": null,
    "subtype": "mage",
    "cost": "Variable",
    "description": "Connection to the Dream Realms and oneiric powers. Allows lucid dreaming, dream walking, and accessing the Maya realms. Levels: 1-Vivid dreams, occasional lucidity; 2-Control own dreams; 3-Visit others' dreams; 4-Shape dream landscapes; 5-Master of Dream Realms. Requires Mind Sphere to use effectively.",
    "pageRef": "M20 p. 311"
  },
  {
    "name": "Familiar",
    "category": null,
    "subtype": "mage",
    "cost": "Variable",
    "description": "A supernatural companion bound to your mage. Can be spirit, magical animal, or awakened creature. Provides benefits like extra actions, unique abilities, or mystical aid. Levels: 1-Minor spirit or clever animal; 2-Useful companion; 3-Powerful assistant; 4-Formidable ally; 5-Extraordinary familiar. Death of familiar causes trauma.",
    "pageRef": "M20 p. 313"
  },
  {
    "name": "Legend",
    "category": null,
    "subtype": "mage",
    "cost": "Variable",
    "description": "Your deeds are the stuff of myth among the Awakened. Stories of your exploits spread through mage society. Levels: 1-Known in local circles; 2-Regional reputation; 3-Nationally recognized; 4-International legend; 5-Mythic figure known to all Traditions. Provides bonuses when dealing with those who've heard tales, but also attracts attention.",
    "pageRef": "M20 p. 317"
  },
  {
    "name": "Mentor",
    "category": null,
    "subtype": "mage",
    "cost": "Variable",
    "description": "An 'elder' mage provides training, guidance, and occasional assistance. Rating reflects helpfulness above personal power. Levels: 1-Unreliable or inexperienced mentor; 2-Helpful yet eccentric guide; 3-Good and noteworthy teacher; 4-Wise, helpful, respected elder; 5-Powerful elder with serious investments in your success. Mentors have their own agendas. Student's behavior reflects on mentor.",
    "pageRef": "M20 p. 318"
  },
  {
    "name": "Node",
    "category": null,
    "subtype": "mage",
    "cost": "Variable",
    "description": "Access to a place where you can meditate to restore Quintessence or gather Tass. Nodes have Resonance based on energy that formed them. Production per week determined by Storyteller; suggested 2 points per week per dot (half free Quintessence, half Tass). Werewolves think of Nodes as caerns. Levels (with caern equivalents): 1-Tiny site minor significance (Level 1 caern); 2-Small trickle (Level 1); 3-Steady flow (Level 2); 4-Pulse plus Tass (Level 2); 5-Powerful wellspring (Level 3); 6-Focused Node with refined energy (Level 3); 7-Considerable force (Level 4); 8-Rare wondrous place (Level 4); 9-Grandest sacred spots (Level 5); 10-Rarest, most precious sites (Level 5).",
    "pageRef": "M20 p. 319"
  },
  {
    "name": "Past Lives",
    "category": null,
    "subtype": "mage",
    "cost": "Variable",
    "description": "You can meditate on a past life to get help. Once per game session, every dot gives you one die to roll against difficulty 8; each success gives an extra die to use on an upcoming roll with another Ability (add to pool you have, or give temporary pool for Ability you don't). Botch lands you in past-life trauma. Levels: 1-Faint traces of previous incarnation; 2-Frequent déjà vu; 3-Definite memories of other lives; 4-Clear recall of previous experiences; 5-Which life is this one again?",
    "pageRef": "M20 p. 320"
  },
  {
    "name": "Patron",
    "category": null,
    "subtype": "mage",
    "cost": "Variable",
    "description": "A powerful, secretive benefactor watches out for your interests. Only Storyteller knows their plans. Orders get reversed, contracts issued, gifts delivered, strings pulled. Magick won't reveal the reason. Levels: 1-Shadowy someone pulling occasional strings; 2-Helpful benefactor who remains concealed; 3-Superior/elder helping for mysterious reasons; 4-Powerful party who appears to favor you; 5-High-ranking mage/Technocrat dedicated to your well-being (at least for now).",
    "pageRef": "M20 p. 320"
  },
  {
    "name": "Rank",
    "category": null,
    "subtype": "mage",
    "cost": "Variable",
    "description": "You hold a title among the masses - military rank, religious office, executive position. Commands Influence equal to Rank rating among people under your dominion (half among others). May access Resources equal to half Rank when acting officially. Might have Fame at half Rank among those you command. Levels: 1-Minor (sergeant, squire, deacon, school board, junior manager, instructor); 2-Low (junior officer, knight, prior, city councilor, staff reporter, senior manager, professor); 3-Medium (captain, baron, abbot, mayor, columnist, middle management, tenured faculty); 4-High (major, count, bishop, governor, syndicated columnist, junior VP, department head); 5-Command staff (general, prince, archbishop, senator, international correspondent, corporate VP, dean).",
    "pageRef": "M20 p. 321"
  },
  {
    "name": "Requisitions",
    "category": null,
    "subtype": "mage",
    "cost": "Variable",
    "description": "Technocrats only. Before a mission, roll Requisitions rating as a dice pool. Each success gives five Background points to buy Devices for that mission. More than three successes scores unlimited mundane Sleeper tech. Must return borrowed gear. Relationship with superiors affects difficulty: Doubtfully Loyal 9, Questionably Loyal 8, Assumed Loyalty 7, Assured Loyal 6, Total Loyalty 5. Levels from 1 die (they don't take you seriously) to 10 dice (maximum clearance, trust, favor from above).",
    "pageRef": "M20 p. 321"
  },
  {
    "name": "Sanctum / Laboratory",
    "category": null,
    "subtype": "mage",
    "cost": "Double Cost",
    "description": "A place of power and privacy. Provides private space, stock of materials, reduces ritual difficulties, has cloaking effect (Arcane rating based on Sanctum). All Effects cast within are coincidental if they follow definition of reality within. Rival mages' Effects are vulgar. Mystic Sanctums have Gauntlet one level lower; Technocratic Labs have Gauntlet 9. Maximum size 500 square feet. Costs TWO dots per dot. Levels: 1-Tiny stock, no ritual reduction, magick coincidental, Arcane 1; 2-Small stock, ritual difficulties -1, Arcane 2; 3-Decent stock, ritual difficulties -1, Arcane 3; 4-Good stock, ritual difficulties -2, Arcane 4; 5-Excellent stock, ritual difficulties -2, Arcane 5.",
    "pageRef": "M20 p. 323"
  },
  {
    "name": "Secret Weapons",
    "category": null,
    "subtype": "mage",
    "cost": "Variable",
    "description": "Technocrats only. Gadgets and devices that are yours to keep. Unlike Requisitions, these items are yours permanently. Items are useful but plagued with finicky bugs. Includes armor, weapons, advanced transportation gear. Levels based on item power: 1-One small power; 2-One or two powers; 3-Notable powers; 4-Impressive powers; 5-Mighty powers.",
    "pageRef": "M20 p. 324"
  },
  {
    "name": "Status",
    "category": null,
    "subtype": "mage",
    "cost": "Variable",
    "description": "Your reputation among Awakened peers. Add this Background to dice pool during Social rolls when dealing with peers. Bonus halved among allied sects. At levels 4-5, rep extends to affiliated groups. Levels: 1-Acknowledged, peers recognize name; 2-Credible, considered noteworthy; 3-Respected, word carries weight; 4-Admired, considerable influence; 5-Revered, widely known and respected. Must be earned; ideally granted by Storyteller as reward for actions.",
    "pageRef": "M20 p. 325"
  },
  {
    "name": "Totem",
    "category": null,
    "subtype": "mage",
    "cost": "Double Cost",
    "description": "Only shamanic or medicine-working characters may have this Background. Costs TWO points per dot. Benefits: Communication (omens, dreams); Appearance (spirit manifestations); Ability dice related to spirit's nature; Wisdom (dots in Cosmology or Lore); Totem Mark (visible signs). You must maintain bond. Levels: 1-Totem appears in dreams/visions, +1 die for related Ability; 2-Totem speaks cryptic advice/omens, +2 dice; 3-Spirit guide appears in waking life (only to you and spirit-seers), advice, omens, manifests animal for non-combat, +2 dice, +1 Cosmology/Lore; 4-Totem manifests in solid form, frequent advice/omens, +3 dice, +2 Cosmology/Lore, may help in combat for huge favor; 5-Totem loves you! Frequent company/aid, +3 dice, +2 each Cosmology and Spirit Lore, help in desperate situations, bond obvious to anyone.",
    "pageRef": "M20 p. 326"
  },
  {
    "name": "Wonder",
    "category": null,
    "subtype": "mage",
    "cost": "Variable",
    "description": "An item with Sphere Effects of its own. Can be mystic Talisman, Fetish with bound spirit, Technocratic Device. Usually works only for mages. Wonders can be temperamental and have elaborate backstories. Levels: 1-One small power (1-3 points); 2-One or two powers, some Quintessence and Arete (4-6 points); 3-Few notable powers or one respectable (7-9 points); 4-Impressive powers or powerful Effect (10-12 points); 5-Mighty powers or single devastating Effect (13-15 points).",
    "pageRef": "M20 p. 328"
  }
]

async function main() {
  console.log('🔮 Starting Backgrounds import...')
  
  let created = 0
  let skipped = 0
  let errors = 0

  for (const background of BACKGROUNDS) {
    try {
      // Check if already exists
      const existing = await prisma.background.findUnique({
        where: { name: background.name }
      })

      if (existing) {
        console.log(`⏭️  Skipping "${background.name}" - already exists`)
        skipped++
        continue
      }

      // Create new background
      await prisma.background.create({
        data: {
          name: background.name,
          category: background.category,
          subtype: background.subtype,
          cost: background.cost,
          description: background.description,
          pageRef: background.pageRef
        }
      })

      console.log(`✅ Created "${background.name}"`)
      created++
    } catch (error) {
      console.error(`❌ Error creating "${background.name}":`, error)
      errors++
    }
  }

  console.log('\n📊 Import Summary:')
  console.log(`✅ Created: ${created}`)
  console.log(`⏭️  Skipped: ${skipped}`)
  console.log(`❌ Errors: ${errors}`)
  console.log(`📦 Total: ${BACKGROUNDS.length}`)
}

main()
  .catch((e) => {
    console.error('Fatal error:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
