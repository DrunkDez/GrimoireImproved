"use client"

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { getTraditionSymbol } from "@/lib/mage-data"
import { BookOpen, Edit, Trash2 } from "lucide-react"
import Link from "next/link"

interface Character {
  id: string
  name: string
  faction: string
  concept?: string
  arete?: number
  rotes?: any[]
}

interface CharacterCardProps {
  character: Character
  onDelete?: (id: string) => void
}

export function CharacterCard({ character, onDelete }: CharacterCardProps) {
  const roteCount = character.rotes?.length || 0

  return (
    <Card className="border-2 border-primary hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="text-4xl" aria-hidden="true">
              {getTraditionSymbol(character.faction)}
            </div>
            <div>
              <CardTitle className="text-xl font-cinzel text-primary">
                {character.name}
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                {character.faction}
              </p>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-2">
        {character.concept && (
          <div>
            <span className="text-sm font-semibold text-muted-foreground">
              Concept:
            </span>{" "}
            <span className="text-sm">{character.concept}</span>
          </div>
        )}

        {character.arete && (
          <div>
            <span className="text-sm font-semibold text-muted-foreground">
              Arete:
            </span>{" "}
            <span className="text-sm">{character.arete}</span>
          </div>
        )}

        <div>
          <span className="text-sm font-semibold text-muted-foreground">
            Known Rotes:
          </span>{" "}
          <span className="text-sm">{roteCount}</span>
        </div>
      </CardContent>

      <CardFooter className="flex gap-2">
        <Link href={`/characters/${character.id}`} className="flex-1">
          <Button variant="default" className="w-full gap-2">
            <BookOpen className="w-4 h-4" />
            View Sheet
          </Button>
        </Link>
        <Link href={`/characters/${character.id}/edit`}>
          <Button variant="outline" size="icon">
            <Edit className="w-4 h-4" />
          </Button>
        </Link>
        {onDelete && (
          <Button
            variant="outline"
            size="icon"
            onClick={() => onDelete(character.id)}
          >
            <Trash2 className="w-4 h-4 text-destructive" />
          </Button>
        )}
      </CardFooter>
    </Card>
  )
}
