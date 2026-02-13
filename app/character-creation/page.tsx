"use client"

import { GrimoireHeader } from "@/components/grimoire-header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BookOpen } from "lucide-react"

export default function CharacterCreationPage() {
  return (
    <div className="min-h-screen relative z-[1]">
      <div className="max-w-[1400px] mx-auto bg-background border-[3px] border-primary rounded-lg overflow-hidden relative my-6 mx-3 md:my-8 md:mx-4
        shadow-[0_0_0_1px_hsl(42_42%_59%),0_0_0_8px_hsl(36_42%_88%),0_0_0_11px_hsl(300_45%_20%),inset_0_0_80px_rgba(139,71,38,0.08),0_14px_40px_rgba(26,21,16,0.25)]">
        
        <GrimoireHeader />
        
        <div className="p-6 md:p-10 space-y-6">
          {/* Header */}
          <div className="text-center space-y-4">
            <h1 className="text-4xl md:text-5xl font-cinzel font-bold text-primary">
              Character Creation Guide
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Learn how to create a character for Mage: The Ascension
            </p>
          </div>

          {/* Placeholder Content */}
          <Card className="border-2 border-primary">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-primary">
                <BookOpen className="w-6 h-6" />
                Coming Soon
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-foreground">
                This section will contain comprehensive information about creating a character for Mage: The Ascension, including:
              </p>
              <ul className="list-disc list-inside space-y-2 text-foreground ml-4">
                <li>Step-by-step character creation process</li>
                <li>Attribute and Ability selection</li>
                <li>Choosing your Tradition or Convention</li>
                <li>Sphere allocation and specializations</li>
                <li>Backgrounds, Merits, and Flaws</li>
                <li>Arete and Willpower</li>
                <li>Freebie points and final touches</li>
              </ul>
              <p className="text-muted-foreground italic mt-4">
                Content for this page is currently being prepared. Check back soon!
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
