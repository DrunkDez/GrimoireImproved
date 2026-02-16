"use client"

import { useEffect, useState } from "react"
import Image from "next/image"

// Sphere symbol mappings - UPDATED for clean filenames
const SPHERES = [
  { name: "Correspondence", white: "/spheres/Correspondence15.png", gold: "/spheres/CorGold.png" },
  { name: "Entropy", white: "/spheres/Entropy15.png", gold: "/spheres/EntGold.png" },
  { name: "Forces", white: "/spheres/Forces15.png", gold: "/spheres/ForGold.png" },
  { name: "Life", white: "/spheres/Life15.png", gold: "/spheres/LifGold.png" },
  { name: "Matter", white: "/spheres/Matter15.png", gold: "/spheres/MatGold.png" },
  { name: "Mind", white: "/spheres/Mind15.png", gold: "/spheres/MinGold.png" },
  { name: "Prime", white: "/spheres/Prime15.png", gold: "/spheres/PriGold.png" },
  { name: "Spirit", white: "/spheres/Spirit15.png", gold: "/spheres/SpiGold.png" },
  { name: "Time", white: "/spheres/Time15.png", gold: "/spheres/TimGold.png" },
]

interface SelectedSphere {
  name: string
  image: string
}

export function RandomSphereSymbols() {
  const [spheres, setSpheres] = useState<SelectedSphere[]>([])

  useEffect(() => {
    // Select 2 random different spheres
    const shuffled = [...SPHERES].sort(() => Math.random() - 0.5)
    const selected = shuffled.slice(0, 2)

    // For each sphere, randomly choose white or gold version
    const withVariants = selected.map(sphere => ({
      name: sphere.name,
      image: Math.random() > 0.5 ? sphere.white : sphere.gold
    }))

    setSpheres(withVariants)
  }, [])

  if (spheres.length === 0) return null

  return (
    <div className="flex items-center justify-center gap-8 mb-8">
      {spheres.map((sphere, index) => (
        <div
          key={index}
          className="relative w-16 h-16 opacity-70 hover:opacity-100 transition-all duration-500 animate-mystical-pulse"
          style={{
            animationDelay: `${index * 0.5}s`,
            filter: 'drop-shadow(0 0 12px rgba(180, 120, 200, 0.5))'
          }}
        >
          <Image
            src={sphere.image}
            alt={`${sphere.name} Sphere`}
            fill
            className="object-contain"
            style={{
              filter: 'brightness(1.1) contrast(1.1)'
            }}
          />
        </div>
      ))}
    </div>
  )
}
