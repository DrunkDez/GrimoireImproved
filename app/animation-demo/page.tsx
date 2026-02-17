"use client"

import { useState } from "react"
import { GuidedDotRating, CharacterCreationGuide } from "@/components/guided-character-creation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { GrimoireHeader } from "@/components/grimoire-header"

export default function AnimationDemoPage() {
  const [currentStep, setCurrentStep] = useState(0)
  const [showGuide, setShowGuide] = useState(false)

  // Physical Attributes
  const [strength, setStrength] = useState(0)
  const [dexterity, setDexterity] = useState(0)
  const [stamina, setStamina] = useState(0)
  const [charisma, setCharisma] = useState(0)
  const [manipulation, setManipulation] = useState(0)
  const [appearance, setAppearance] = useState(0)
  const [perception, setPerception] = useState(0)
  const [intelligence, setIntelligence] = useState(0)
  const [wits, setWits] = useState(0)

  // Abilities
  const [alertness, setAlertness] = useState(0)
  const [athletics, setAthletics] = useState(0)
  const [awareness, setAwareness] = useState(0)
  const [brawl, setBrawl] = useState(0)
  const [dodge, setDodge] = useState(0)
  const [occult, setOccult] = useState(0)
  const [investigation, setInvestigation] = useState(0)
  const [cosmology, setCosmology] = useState(0)

  // Spheres
  const [correspondence, setCorrespondence] = useState(0)
  const [entropy, setEntropy] = useState(0)
  const [forces, setForces] = useState(0)
  const [life, setLife] = useState(0)
  const [matter, setMatter] = useState(0)
  const [mind, setMind] = useState(0)
  const [prime, setPrime] = useState(0)
  const [spirit, setSpirit] = useState(0)
  const [time, setTime] = useState(0)

  // Other
  const [arete, setArete] = useState(0)
  const [willpower, setWillpower] = useState(5)

  const fillExample = () => {
    // Physical
    setStrength(3)
    setDexterity(2)
    setStamina(4)
    setCharisma(3)
    setManipulation(2)
    setAppearance(2)
    setPerception(3)
    setIntelligence(4)
    setWits(3)
    
    // Abilities
    setAlertness(2)
    setAthletics(1)
    setAwareness(3)
    setBrawl(1)
    setDodge(2)
    setOccult(4)
    setInvestigation(3)
    setCosmology(2)
    
    // Spheres
    setForces(3)
    setLife(2)
    setMind(2)
    setPrime(1)
    
    // Other
    setArete(3)
    setWillpower(7)
  }

  const clearAll = () => {
    // Physical
    setStrength(0)
    setDexterity(0)
    setStamina(0)
    setCharisma(0)
    setManipulation(0)
    setAppearance(0)
    setPerception(0)
    setIntelligence(0)
    setWits(0)
    
    // Abilities
    setAlertness(0)
    setAthletics(0)
    setAwareness(0)
    setBrawl(0)
    setDodge(0)
    setOccult(0)
    setInvestigation(0)
    setCosmology(0)
    
    // Spheres
    setCorrespondence(0)
    setEntropy(0)
    setForces(0)
    setLife(0)
    setMatter(0)
    setMind(0)
    setPrime(0)
    setSpirit(0)
    setTime(0)
    
    // Other
    setArete(0)
    setWillpower(5)
  }

  return (
    <div className="min-h-screen relative z-[1]">
      <div className="max-w-[1400px] mx-auto bg-background border-[3px] border-primary rounded-lg overflow-hidden relative my-6 mx-3 md:my-8 md:mx-4">
        <GrimoireHeader />

        {showGuide && (
          <CharacterCreationGuide
            currentStep={currentStep}
            onStepComplete={() => {
              if (currentStep < 7) {
                setCurrentStep(currentStep + 1)
              } else {
                setShowGuide(false)
              }
            }}
            onSkip={() => setShowGuide(false)}
          />
        )}

        <div className="p-6 md:p-10 space-y-8">
          {/* Header */}
          <div className="text-center space-y-4">
            <h1 className="text-4xl md:text-5xl font-cinzel font-bold text-primary">
              Character Creation Animations Demo
            </h1>
            <p className="text-lg text-muted-foreground">
              Test all the dot-filling animations and guided tutorial
            </p>
          </div>

          {/* Controls */}
          <Card className="border-2 border-accent">
            <CardHeader>
              <CardTitle className="font-cinzel">Demo Controls</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-3">
              <Button onClick={() => { setShowGuide(true); setCurrentStep(0); }}>
                ▶️ Start Tutorial
              </Button>
              <Button onClick={() => setCurrentStep(Math.max(0, currentStep - 1))} variant="outline">
                ⏮️ Previous Step
              </Button>
              <Button onClick={() => setCurrentStep(Math.min(7, currentStep + 1))} variant="outline">
                ⏭️ Next Step
              </Button>
              <Button onClick={fillExample} variant="secondary">
                ✨ Fill Example
              </Button>
              <Button onClick={clearAll} variant="destructive">
                🗑️ Clear All
              </Button>
            </CardContent>
          </Card>

          {/* Physical Attributes */}
          <div className="attributes-section">
            <Card className="border-2 border-primary">
              <CardHeader>
                <CardTitle className="font-cinzel text-2xl text-primary">
                  Physical Attributes
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <GuidedDotRating
                  label="Strength"
                  value={strength}
                  onChange={setStrength}
                  variant="attribute"
                  isActive={currentStep === 1}
                  showGuide={showGuide}
                />
                <GuidedDotRating
                  label="Dexterity"
                  value={dexterity}
                  onChange={setDexterity}
                  variant="attribute"
                  isActive={currentStep === 1}
                  showGuide={showGuide}
                />
                <GuidedDotRating
                  label="Stamina"
                  value={stamina}
                  onChange={setStamina}
                  variant="attribute"
                  isActive={currentStep === 1}
                  showGuide={showGuide}
                />
              </CardContent>
            </Card>

            <Card className="border-2 border-primary">
              <CardHeader>
                <CardTitle className="font-cinzel text-2xl text-primary">
                  Social Attributes
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <GuidedDotRating
                  label="Charisma"
                  value={charisma}
                  onChange={setCharisma}
                  variant="attribute"
                  isActive={currentStep === 1}
                  showGuide={showGuide}
                />
                <GuidedDotRating
                  label="Manipulation"
                  value={manipulation}
                  onChange={setManipulation}
                  variant="attribute"
                  isActive={currentStep === 1}
                  showGuide={showGuide}
                />
                <GuidedDotRating
                  label="Appearance"
                  value={appearance}
                  onChange={setAppearance}
                  variant="attribute"
                  isActive={currentStep === 1}
                  showGuide={showGuide}
                />
              </CardContent>
            </Card>

            <Card className="border-2 border-primary">
              <CardHeader>
                <CardTitle className="font-cinzel text-2xl text-primary">
                  Mental Attributes
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <GuidedDotRating
                  label="Perception"
                  value={perception}
                  onChange={setPerception}
                  variant="attribute"
                  isActive={currentStep === 1}
                  showGuide={showGuide}
                />
                <GuidedDotRating
                  label="Intelligence"
                  value={intelligence}
                  onChange={setIntelligence}
                  variant="attribute"
                  isActive={currentStep === 1}
                  showGuide={showGuide}
                />
                <GuidedDotRating
                  label="Wits"
                  value={wits}
                  onChange={setWits}
                  variant="attribute"
                  isActive={currentStep === 1}
                  showGuide={showGuide}
                />
              </CardContent>
            </Card>
          </div>

          {/* Abilities */}
          <div className="abilities-section space-y-6">
            <Card className="border-2 border-accent">
              <CardHeader>
                <CardTitle className="font-cinzel text-2xl text-accent">
                  Talents
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <GuidedDotRating
                  label="Alertness"
                  value={alertness}
                  onChange={setAlertness}
                  variant="ability"
                  isActive={currentStep === 2}
                  showGuide={showGuide}
                />
                <GuidedDotRating
                  label="Athletics"
                  value={athletics}
                  onChange={setAthletics}
                  variant="ability"
                  isActive={currentStep === 2}
                  showGuide={showGuide}
                />
                <GuidedDotRating
                  label="Awareness"
                  value={awareness}
                  onChange={setAwareness}
                  variant="ability"
                  isActive={currentStep === 2}
                  showGuide={showGuide}
                />
                <GuidedDotRating
                  label="Brawl"
                  value={brawl}
                  onChange={setBrawl}
                  variant="ability"
                  isActive={currentStep === 2}
                  showGuide={showGuide}
                />
                <GuidedDotRating
                  label="Dodge"
                  value={dodge}
                  onChange={setDodge}
                  variant="ability"
                  isActive={currentStep === 2}
                  showGuide={showGuide}
                />
              </CardContent>
            </Card>

            <Card className="border-2 border-accent">
              <CardHeader>
                <CardTitle className="font-cinzel text-2xl text-accent">
                  Knowledges
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <GuidedDotRating
                  label="Occult"
                  value={occult}
                  onChange={setOccult}
                  variant="ability"
                  isActive={currentStep === 2}
                  showGuide={showGuide}
                />
                <GuidedDotRating
                  label="Investigation"
                  value={investigation}
                  onChange={setInvestigation}
                  variant="ability"
                  isActive={currentStep === 2}
                  showGuide={showGuide}
                />
                <GuidedDotRating
                  label="Cosmology"
                  value={cosmology}
                  onChange={setCosmology}
                  variant="ability"
                  isActive={currentStep === 2}
                  showGuide={showGuide}
                />
              </CardContent>
            </Card>
          </div>

          {/* Spheres */}
          <div className="spheres-section">
            <Card className="border-2 border-ring">
              <CardHeader>
                <CardTitle className="font-cinzel text-2xl text-ring">
                  Spheres of Magic
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <GuidedDotRating
                  label="Correspondence"
                  value={correspondence}
                  onChange={setCorrespondence}
                  variant="sphere"
                  isActive={currentStep === 3}
                  showGuide={showGuide}
                />
                <GuidedDotRating
                  label="Entropy"
                  value={entropy}
                  onChange={setEntropy}
                  variant="sphere"
                  isActive={currentStep === 3}
                  showGuide={showGuide}
                />
                <GuidedDotRating
                  label="Forces"
                  value={forces}
                  onChange={setForces}
                  variant="sphere"
                  isActive={currentStep === 3}
                  showGuide={showGuide}
                />
                <GuidedDotRating
                  label="Life"
                  value={life}
                  onChange={setLife}
                  variant="sphere"
                  isActive={currentStep === 3}
                  showGuide={showGuide}
                />
                <GuidedDotRating
                  label="Matter"
                  value={matter}
                  onChange={setMatter}
                  variant="sphere"
                  isActive={currentStep === 3}
                  showGuide={showGuide}
                />
                <GuidedDotRating
                  label="Mind"
                  value={mind}
                  onChange={setMind}
                  variant="sphere"
                  isActive={currentStep === 3}
                  showGuide={showGuide}
                />
                <GuidedDotRating
                  label="Prime"
                  value={prime}
                  onChange={setPrime}
                  variant="sphere"
                  isActive={currentStep === 3}
                  showGuide={showGuide}
                />
                <GuidedDotRating
                  label="Spirit"
                  value={spirit}
                  onChange={setSpirit}
                  variant="sphere"
                  isActive={currentStep === 3}
                  showGuide={showGuide}
                />
                <GuidedDotRating
                  label="Time"
                  value={time}
                  onChange={setTime}
                  variant="sphere"
                  isActive={currentStep === 3}
                  showGuide={showGuide}
                />
              </CardContent>
            </Card>
          </div>

          {/* Arete & Willpower */}
          <div className="arete-section space-y-6">
            <Card className="border-2 border-accent">
              <CardHeader>
                <CardTitle className="font-cinzel text-2xl text-accent">
                  Arete
                </CardTitle>
              </CardHeader>
              <CardContent>
                <GuidedDotRating
                  label="Arete"
                  maxDots={10}
                  value={arete}
                  onChange={setArete}
                  variant="arete"
                  isActive={currentStep === 5}
                  showGuide={showGuide}
                />
              </CardContent>
            </Card>

            <Card className="border-2 border-primary">
              <CardHeader>
                <CardTitle className="font-cinzel text-2xl text-primary">
                  Willpower
                </CardTitle>
              </CardHeader>
              <CardContent>
                <GuidedDotRating
                  label="Willpower"
                  maxDots={10}
                  value={willpower}
                  onChange={setWillpower}
                  variant="attribute"
                  isActive={currentStep === 6}
                  showGuide={showGuide}
                />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
