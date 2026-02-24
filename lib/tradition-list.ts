// 📚 COMPLETE TRADITION/GROUP LIST FOR MAGE

export const TRADITION_CATEGORIES = {
  // Core Traditions (M20)
  traditions: {
    label: "Nine Traditions",
    groups: [
      "Akashic Brotherhood",
      "Celestial Chorus",
      "Cult of Ecstasy",
      "Dreamspeakers",
      "Euthanatos",
      "Order of Hermes",
      "Sons of Ether",
      "Verbena",
      "Virtual Adepts",
      "Hollow Ones"
    ]
  },
  
  // Technocracy Conventions
  technocracy: {
    label: "Technocracy Conventions",
    groups: [
      "Iteration X",
      "New World Order",
      "Progenitors",
      "Syndicate",
      "Void Engineers",
      "Technocracy" // Generic Technocracy
    ]
  },
  
  // Crafts and Organizations
  crafts: {
    label: "Crafts & Organizations",
    groups: [
      "Ahl-i-Batin",
      "Bata'a",
      "Children of Knowledge",
      "Fencer",
      "Hem-Ka Sobk",
      "High Guild",
      "Knights Templar",
      "Kopa Loei",
      "Shamans",
      "Sisters of Hippolyta",
      "Solificati",
      "Taftani",
      "Wu-Keng",
      "Wu Lung"
    ]
  },
  
  // Cultural/Traditional
  cultural: {
    label: "Cultural/Traditional",
    groups: [
      "Aboriginal",
      "African",
      "Aztec",
      "Babylonian",
      "Celtic",
      "Egyptian",
      "Etruscan",
      "Finnish",
      "Greek",
      "Inuit",
      "Mayan",
      "Mesoamerican",
      "Norse",
      "Polynesian",
      "Roman",
      "Tantric"
    ]
  },
  
  // Other Factions
  other: {
    label: "Other Factions",
    groups: [
      "Artisan",
      "Infernalist",
      "Marauder",
      "Nephandi",
      "Order of Reason",
      "Reality Hackers"
    ]
  },
  
  // Universal
  universal: {
    label: "Universal",
    groups: [
      "Universal"
    ]
  }
}

// Flat list for validation
export const ALL_TRADITIONS = Object.values(TRADITION_CATEGORIES)
  .flatMap(cat => cat.groups)
  .sort()

// Get category for a tradition
export function getTraditionCategory(tradition: string): string {
  for (const [key, category] of Object.entries(TRADITION_CATEGORIES)) {
    if (category.groups.includes(tradition)) {
      return category.label
    }
  }
  return "Other"
}
