"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { TRADITIONS, TECHNOCRACY_CONVENTIONS } from "@/lib/mage-data"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"

const ESSENCES = ["Dynamic", "Pattern", "Primordial", "Questing"]

interface Character {
  id?: string
  name: string
  faction: string
  concept: string
  arete: number
  avatar: string
  essence: string
}

interface CharacterFormProps {
  character?: Character
  onSuccess?: () => void
}

export function CharacterForm({ character, onSuccess }: CharacterFormProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState<Character>({
    name: character?.name || "",
    faction: character?.faction || "",
    concept: character?.concept || "",
    arete: character?.arete || 1,
    avatar: character?.avatar || "",
    essence: character?.essence || "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const url = character?.id
        ? `/api/characters/${character.id}`
        : "/api/characters"
      const method = character?.id ? "PUT" : "POST"

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        throw new Error("Failed to save character")
      }

      const data = await response.json()

      toast({
        title: character?.id ? "Character Updated" : "Character Created",
        description: `${formData.name} has been ${character?.id ? "updated" : "created"} successfully`,
      })

      if (onSuccess) {
        onSuccess()
      } else {
        router.push(`/characters/${data.id}`)
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save character",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="border-2 border-primary">
      <CardHeader>
        <CardTitle className="text-2xl font-cinzel text-primary">
          {character?.id ? "Edit Character" : "Create New Character"}
        </CardTitle>
        <CardDescription>
          {character?.id
            ? "Update your character's information"
            : "Begin your journey as a mage of the Ascension"}
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name">Character Name *</Label>
            <Input
              id="name"
              placeholder="Enter character name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              required
              disabled={isLoading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="faction">Tradition or Convention *</Label>
            <Select
              value={formData.faction}
              onValueChange={(value) =>
                setFormData({ ...formData, faction: value })
              }
              disabled={isLoading}
              required
            >
              <SelectTrigger>
                <SelectValue placeholder="Select your affiliation" />
              </SelectTrigger>
              <SelectContent>
                <div className="px-2 py-1 text-xs font-semibold text-primary">
                  Nine Traditions
                </div>
                {TRADITIONS.map((tradition) => (
                  <SelectItem key={tradition} value={tradition}>
                    {tradition}
                  </SelectItem>
                ))}
                <div className="px-2 py-1 text-xs font-semibold text-primary mt-2">
                  Technocracy Conventions
                </div>
                {TECHNOCRACY_CONVENTIONS.map((convention) => (
                  <SelectItem key={convention} value={convention}>
                    {convention}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="concept">Concept</Label>
            <Input
              id="concept"
              placeholder="e.g., Street Magician, Hermetic Scholar, Mad Scientist"
              value={formData.concept}
              onChange={(e) =>
                setFormData({ ...formData, concept: e.target.value })
              }
              disabled={isLoading}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="arete">Arete</Label>
              <Input
                id="arete"
                type="number"
                min="1"
                max="10"
                value={formData.arete}
                onChange={(e) =>
                  setFormData({ ...formData, arete: parseInt(e.target.value) })
                }
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="essence">Essence</Label>
              <Select
                value={formData.essence}
                onValueChange={(value) =>
                  setFormData({ ...formData, essence: value })
                }
                disabled={isLoading}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select essence" />
                </SelectTrigger>
                <SelectContent>
                  {ESSENCES.map((essence) => (
                    <SelectItem key={essence} value={essence}>
                      {essence}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="avatar">Avatar Description</Label>
            <Textarea
              id="avatar"
              placeholder="Describe your Avatar..."
              value={formData.avatar}
              onChange={(e) =>
                setFormData({ ...formData, avatar: e.target.value })
              }
              rows={3}
              disabled={isLoading}
            />
          </div>

          <div className="flex gap-4">
            <Button type="submit" className="flex-1" disabled={isLoading}>
              {isLoading
                ? "Saving..."
                : character?.id
                ? "Update Character"
                : "Create Character"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
              disabled={isLoading}
            >
              Cancel
            </Button>
          </div>
        </CardContent>
      </form>
    </Card>
  )
}
