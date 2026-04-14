"use client"

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { useToast } from '@/hooks/use-toast'
import { Plus, Minus, History } from 'lucide-react'
import { XpCostsReference } from './xp-costs-reference'

interface ExperienceTrackerProps {
  characterId: string
}

interface ExperienceData {
  totalExperience: number
  spentExperience: number
  availableXp: number
  useCustomXpCosts: boolean
  customXpCosts: any
  log: ExperienceLogEntry[]
}

interface ExperienceLogEntry {
  id: string
  type: string
  amount: number
  category: string | null
  itemName: string | null
  fromRating: number | null
  toRating: number | null
  description: string
  officialCost: number | null
  actualCost: number | null
  usedCustom: boolean
  sessionDate: string | null
  createdAt: string
}

export function ExperienceTracker({ characterId }: ExperienceTrackerProps) {
  const { toast } = useToast()
  const [data, setData] = useState<ExperienceData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  
  // Add XP dialog state
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [addAmount, setAddAmount] = useState<number>(0)
  const [addDescription, setAddDescription] = useState('')
  const [addSessionDate, setAddSessionDate] = useState('')
  
  // Spend XP dialog state
  const [isSpendDialogOpen, setIsSpendDialogOpen] = useState(false)
  const [spendAmount, setSpendAmount] = useState<number>(0)
  const [spendCategory, setSpendCategory] = useState('')
  const [spendItemName, setSpendItemName] = useState('')
  const [spendFromRating, setSpendFromRating] = useState<number | ''>('')
  const [spendToRating, setSpendToRating] = useState<number | ''>('')
  const [spendDescription, setSpendDescription] = useState('')
  const [useCustomCost, setUseCustomCost] = useState(false)
  
  // Log dialog state
  const [isLogDialogOpen, setIsLogDialogOpen] = useState(false)

  useEffect(() => {
    fetchExperienceData()
  }, [characterId])

  const fetchExperienceData = async () => {
    try {
      setIsLoading(true)
      const response = await fetch(`/api/characters/${characterId}/experience`)
      if (response.ok) {
        const expData = await response.json()
        setData(expData)
      } else {
        toast({
          title: "Error",
          description: "Failed to load experience data",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error('Error fetching experience:', error)
      toast({
        title: "Error",
        description: "Failed to load experience data",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleAddXp = async () => {
    if (addAmount <= 0) {
      toast({
        title: "Invalid Amount",
        description: "XP amount must be positive",
        variant: "destructive",
      })
      return
    }

    if (!addDescription.trim()) {
      toast({
        title: "Missing Description",
        description: "Please provide a description",
        variant: "destructive",
      })
      return
    }

    try {
      const response = await fetch(`/api/characters/${characterId}/experience`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'gain',
          amount: addAmount,
          description: addDescription,
          sessionDate: addSessionDate || null,
        }),
      })

      if (response.ok) {
        const result = await response.json()
        toast({
          title: "XP Added",
          description: result.message,
        })
        setIsAddDialogOpen(false)
        setAddAmount(0)
        setAddDescription('')
        setAddSessionDate('')
        fetchExperienceData()
      } else {
        const error = await response.json()
        toast({
          title: "Error",
          description: error.error || "Failed to add XP",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error('Error adding XP:', error)
      toast({
        title: "Error",
        description: "Failed to add XP",
        variant: "destructive",
      })
    }
  }

  const handleSpendXp = async () => {
    if (spendAmount <= 0) {
      toast({
        title: "Invalid Amount",
        description: "XP amount must be positive",
        variant: "destructive",
      })
      return
    }

    if (!spendDescription.trim()) {
      toast({
        title: "Missing Description",
        description: "Please provide a description",
        variant: "destructive",
      })
      return
    }

    try {
      const response = await fetch(`/api/characters/${characterId}/experience`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'spend',
          amount: spendAmount,
          category: spendCategory || null,
          itemName: spendItemName || null,
          fromRating: spendFromRating || null,
          toRating: spendToRating || null,
          description: spendDescription,
          usedCustom: useCustomCost,
        }),
      })

      if (response.ok) {
        const result = await response.json()
        toast({
          title: "XP Spent",
          description: result.message,
        })
        setIsSpendDialogOpen(false)
        resetSpendForm()
        fetchExperienceData()
      } else {
        const error = await response.json()
        toast({
          title: "Error",
          description: error.error || "Failed to spend XP",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error('Error spending XP:', error)
      toast({
        title: "Error",
        description: "Failed to spend XP",
        variant: "destructive",
      })
    }
  }

  const resetSpendForm = () => {
    setSpendAmount(0)
    setSpendCategory('')
    setSpendItemName('')
    setSpendFromRating('')
    setSpendToRating('')
    setSpendDescription('')
    setUseCustomCost(false)
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="flex items-center gap-3">
          <span className="text-xl text-accent animate-spin">⚙</span>
          <p className="text-muted-foreground">Loading experience data...</p>
        </div>
      </div>
    )
  }

  if (!data) {
    return null
  }

  return (
    <div className="bg-card border-2 border-primary rounded-lg p-6 space-y-6">
      {/* XP Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-primary/10 border-2 border-primary rounded-md p-4 text-center">
          <div className="text-3xl font-bold text-primary mb-1">{data.totalExperience}</div>
          <div className="text-sm text-muted-foreground uppercase">Total XP</div>
        </div>
        
        <div className="bg-accent/10 border-2 border-accent rounded-md p-4 text-center">
          <div className="text-3xl font-bold text-accent mb-1">{data.spentExperience}</div>
          <div className="text-sm text-muted-foreground uppercase">Spent XP</div>
        </div>
        
        <div className="bg-ring/10 border-2 border-ring rounded-md p-4 text-center">
          <div className="text-3xl font-bold text-ring mb-1">{data.availableXp}</div>
          <div className="text-sm text-muted-foreground uppercase">Available XP</div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-wrap gap-3">
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="w-4 h-4" />
              Add XP
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Experience Points</DialogTitle>
              <DialogDescription>
                Award XP for completing a game session or achieving goals
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="add-amount">Amount</Label>
                <Input
                  id="add-amount"
                  type="number"
                  min="0"
                  value={addAmount || ''}
                  onChange={(e) => setAddAmount(parseInt(e.target.value) || 0)}
                  placeholder="How much XP?"
                />
              </div>
              <div>
                <Label htmlFor="add-description">Description</Label>
                <Textarea
                  id="add-description"
                  value={addDescription}
                  onChange={(e) => setAddDescription(e.target.value)}
                  placeholder="What was this XP for?"
                  rows={3}
                />
              </div>
              <div>
                <Label htmlFor="add-session-date">Session Date (Optional)</Label>
                <Input
                  id="add-session-date"
                  type="date"
                  value={addSessionDate}
                  onChange={(e) => setAddSessionDate(e.target.value)}
                />
              </div>
              <Button onClick={handleAddXp} className="w-full">
                Add {addAmount} XP
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        <Dialog open={isSpendDialogOpen} onOpenChange={setIsSpendDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" className="gap-2">
              <Minus className="w-4 h-4" />
              Spend XP
            </Button>
          </DialogTrigger>
          <DialogContent className="max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Spend Experience Points</DialogTitle>
              <DialogDescription>
                Improve your character's traits (Available: {data.availableXp} XP)
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="spend-category">Category</Label>
                <Select value={spendCategory} onValueChange={setSpendCategory}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Attribute">Attribute</SelectItem>
                    <SelectItem value="Ability">Ability</SelectItem>
                    <SelectItem value="Arete">Arete</SelectItem>
                    <SelectItem value="Sphere">Sphere</SelectItem>
                    <SelectItem value="Willpower">Willpower</SelectItem>
                    <SelectItem value="Background">Background</SelectItem>
                    <SelectItem value="Merit">Merit</SelectItem>
                    <SelectItem value="Flaw Removal">Remove Flaw</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="spend-item-name">Item Name</Label>
                <Input
                  id="spend-item-name"
                  value={spendItemName}
                  onChange={(e) => setSpendItemName(e.target.value)}
                  placeholder="e.g., 'Strength', 'Occult', 'Life Sphere'"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="from-rating">From Rating</Label>
                  <Input
                    id="from-rating"
                    type="number"
                    min="0"
                    max="5"
                    value={spendFromRating || ''}
                    onChange={(e) => setSpendFromRating(parseInt(e.target.value) || '')}
                    placeholder="Current"
                  />
                </div>
                <div>
                  <Label htmlFor="to-rating">To Rating</Label>
                  <Input
                    id="to-rating"
                    type="number"
                    min="0"
                    max="5"
                    value={spendToRating || ''}
                    onChange={(e) => setSpendToRating(parseInt(e.target.value) || '')}
                    placeholder="New"
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="spend-amount">XP Cost</Label>
                <Input
                  id="spend-amount"
                  type="number"
                  min="0"
                  value={spendAmount || ''}
                  onChange={(e) => setSpendAmount(parseInt(e.target.value) || 0)}
                  placeholder="How much XP?"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Official costs: Attribute (new×4), Ability (new×2), Arete (new×8), Sphere (new×7)
                </p>
              </div>
              
              <div>
                <Label htmlFor="spend-description">Description</Label>
                <Textarea
                  id="spend-description"
                  value={spendDescription}
                  onChange={(e) => setSpendDescription(e.target.value)}
                  placeholder="What improvement was made?"
                  rows={2}
                />
              </div>
              
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="use-custom"
                  checked={useCustomCost}
                  onChange={(e) => setUseCustomCost(e.target.checked)}
                  className="w-4 h-4"
                />
                <Label htmlFor="use-custom" className="text-sm cursor-pointer">
                  Using custom XP cost (not official rules)
                </Label>
              </div>
              
              <Button onClick={handleSpendXp} className="w-full">
                Spend {spendAmount} XP
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        <Dialog open={isLogDialogOpen} onOpenChange={setIsLogDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" className="gap-2">
              <History className="w-4 h-4" />
              View Log
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Experience Log</DialogTitle>
              <DialogDescription>
                History of XP gains and expenditures
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-2">
              {data.log.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">
                  No experience transactions yet
                </p>
              ) : (
                data.log.map((entry) => (
                  <div
                    key={entry.id}
                    className={`border-2 rounded-md p-3 ${
                      entry.type === 'gain'
                        ? 'border-ring bg-ring/5'
                        : 'border-primary bg-primary/5'
                    }`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center gap-2">
                        {entry.type === 'gain' ? (
                          <Plus className="w-4 h-4 text-ring" />
                        ) : (
                          <Minus className="w-4 h-4 text-primary" />
                        )}
                        <span className="font-semibold">
                          {entry.type === 'gain' ? '+' : ''}{entry.amount} XP
                        </span>
                        {entry.category && (
                          <span className="text-sm text-muted-foreground">
                            ({entry.category})
                          </span>
                        )}
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {new Date(entry.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-sm">{entry.description}</p>
                    {entry.itemName && entry.fromRating !== null && entry.toRating !== null && (
                      <p className="text-xs text-muted-foreground mt-1">
                        {entry.itemName}: {entry.fromRating} → {entry.toRating}
                      </p>
                    )}
                    {entry.usedCustom && (
                      <p className="text-xs text-accent mt-1">
                        ⚠ Custom cost used
                      </p>
                    )}
                  </div>
                ))
              )}
            </div>
          </DialogContent>
        </Dialog>

        {/* XP Costs Reference Component */}
        <XpCostsReference />
      </div>
    </div>
  )
}