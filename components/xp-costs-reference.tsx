"use client"

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { BookOpen, Calculator } from 'lucide-react'

interface ExperienceCost {
  id: string
  category: string
  costType: string
  multiplier: number | null
  flatCost: number | null
  name: string
  formula: string
  description: string
  bookRef: string | null
}

export function XpCostsReference() {
  const [costs, setCosts] = useState<ExperienceCost[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    if (isOpen && costs.length === 0) {
      fetchCosts()
    }
  }, [isOpen])

  const fetchCosts = async () => {
    try {
      setIsLoading(true)
      const response = await fetch('/api/experience-costs')
      if (response.ok) {
        const data = await response.json()
        setCosts(data)
      }
    } catch (error) {
      console.error('Error fetching XP costs:', error)
    } finally {
      setIsLoading(false)
    }
  }

  // Calculate example costs
  const calculateExample = (cost: ExperienceCost) => {
    if (cost.costType === 'flat') {
      return `${cost.flatCost} XP`
    }

    if (cost.costType === 'multiplier' && cost.multiplier) {
      // Show a few examples
      const examples = []
      
      if (cost.category === 'willpower') {
        // Special case: current rating × 1
        examples.push(`5 → 6 = 5 XP`)
        examples.push(`6 → 7 = 6 XP`)
      } else {
        // Normal case: new rating × multiplier
        for (let i = 1; i <= 3; i++) {
          const xp = i * cost.multiplier
          examples.push(`${i - 1} → ${i} = ${xp} XP`)
        }
      }
      
      return examples.join(', ')
    }

    return ''
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2">
          <BookOpen className="w-4 h-4" />
          XP Costs Reference
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Calculator className="w-5 h-5" />
            Official Experience Costs
          </DialogTitle>
          <DialogDescription>
            Based on Mage: The Ascension 20th Anniversary Edition (p.406)
          </DialogDescription>
        </DialogHeader>

        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <div className="flex items-center gap-3">
              <span className="text-xl text-accent animate-spin">⚙</span>
              <p className="text-muted-foreground">Loading costs...</p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Summary Table */}
            <div className="bg-muted/50 border-2 border-primary rounded-lg overflow-hidden">
              <table className="w-full">
                <thead className="bg-primary/10">
                  <tr>
                    <th className="text-left p-3 font-serif text-primary">Improvement</th>
                    <th className="text-left p-3 font-serif text-primary">Formula</th>
                    <th className="text-left p-3 font-serif text-primary hidden sm:table-cell">Examples</th>
                  </tr>
                </thead>
                <tbody>
                  {costs.map((cost, index) => (
                    <tr
                      key={cost.id}
                      className={`border-t border-primary/20 ${
                        index % 2 === 0 ? 'bg-background/50' : 'bg-background/20'
                      }`}
                    >
                      <td className="p-3 font-semibold">{cost.name}</td>
                      <td className="p-3 font-mono text-sm">{cost.formula}</td>
                      <td className="p-3 text-sm text-muted-foreground hidden sm:table-cell">
                        {calculateExample(cost)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Detailed Explanations */}
            <div className="space-y-3">
              <h3 className="font-serif text-lg font-bold text-primary border-b-2 border-primary pb-2">
                Detailed Descriptions
              </h3>
              
              {costs.map((cost) => (
                <div
                  key={cost.id}
                  className="bg-card border-2 border-primary/30 rounded-md p-4 space-y-2"
                >
                  <div className="flex justify-between items-start gap-4">
                    <h4 className="font-serif font-bold text-primary">{cost.name}</h4>
                    <span className="font-mono text-sm bg-primary/10 px-2 py-1 rounded">
                      {cost.formula}
                    </span>
                  </div>
                  
                  <p className="text-sm text-foreground leading-relaxed">
                    {cost.description}
                  </p>
                  
                  {cost.bookRef && (
                    <p className="text-xs text-muted-foreground italic">
                      Reference: {cost.bookRef}
                    </p>
                  )}

                  {/* Show calculation examples */}
                  <div className="bg-muted/30 rounded p-2 mt-2">
                    <p className="text-xs font-semibold text-muted-foreground mb-1">Examples:</p>
                    <p className="text-sm font-mono">{calculateExample(cost)}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Quick Reference Card */}
            <div className="bg-accent/10 border-2 border-accent rounded-lg p-4 space-y-2">
              <h3 className="font-serif font-bold text-accent flex items-center gap-2">
                <Calculator className="w-4 h-4" />
                Quick Reference
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                <div>
                  <strong>Most Common:</strong>
                  <ul className="list-disc list-inside text-muted-foreground">
                    <li>Ability: new × 2</li>
                    <li>Attribute: new × 4</li>
                    <li>Sphere: new × 7</li>
                  </ul>
                </div>
                <div>
                  <strong>High Cost:</strong>
                  <ul className="list-disc list-inside text-muted-foreground">
                    <li>Arete: new × 8</li>
                    <li>New Sphere: 10 XP</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Custom Costs Note */}
            <div className="bg-ring/10 border-2 border-ring rounded-lg p-4">
              <h3 className="font-serif font-bold text-ring mb-2">Custom Costs</h3>
              <p className="text-sm text-muted-foreground">
                These are the official costs from Mage: The Ascension 20th Anniversary Edition. 
                If your storyteller uses house rules or custom costs, you can mark transactions 
                as "custom" when spending XP to track the difference.
              </p>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}