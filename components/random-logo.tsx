"use client"

import { useEffect, useState } from "react"
import Image from "next/image"

// All tradition/faction logos
const LOGOS = [
  "AhliBatin.png",
  "AkashicBrotherhood.png",
  "Bataa.png",
  "CelestialChorus.png",
  "ChildrenofKnowledge.png",
  "CultofEcstasy.png",
  "Dreamspeakers.png",
  "Euthanatos.png",
  "HollowOnes.png",
  "IterationX.png",
  "KnightsoftheTempleofSolomon.png",
  "KopaLoei.png",
  "NewWorldOrder.png",
  "Ngoma.png",
  "OrderofHermes.png",
  "Orphans.png",
  "Progenitors.png",
  "SistersofHippolyta.png",
  "SocietyofEther.png",
  "Syndicate.png",
  "Taftani.png",
  "Verbena.png",
  "VirtualAdepts.png",
  "VoidEngineers.png",
  "WuLung.png",
]

export function RandomLogo() {
  const [logo, setLogo] = useState<string>("")
  const [imageError, setImageError] = useState(false)

  useEffect(() => {
    // Pick a random logo on component mount
    const randomIndex = Math.floor(Math.random() * LOGOS.length)
    setLogo(LOGOS[randomIndex])
  }, [])

  // Don't render until we have a logo selected (avoid hydration issues)
  if (!logo) {
    return (
      <div className="w-20 h-20 md:w-24 md:h-24 bg-primary/10 rounded-full animate-pulse" />
    )
  }

  // If image failed to load, show fallback
  if (imageError) {
    return (
      <div className="w-20 h-20 md:w-24 md:h-24 bg-primary/20 rounded-full flex items-center justify-center">
        <span className="text-3xl font-magebats text-primary/50">a</span>
      </div>
    )
  }

  return (
    <div className="relative w-20 h-20 md:w-24 md:h-24 opacity-80 hover:opacity-100 transition-all duration-500">
      <Image
        src={`/logos/${logo}`}
        alt="Tradition Symbol"
        fill
        className="object-contain drop-shadow-lg"
        onError={() => setImageError(true)}
        unoptimized
        priority
      />
    </div>
  )
}
