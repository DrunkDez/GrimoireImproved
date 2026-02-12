"use client"

import { useState, useEffect } from "react"
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
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Badge } from "@/components/ui/badge"
import { Plus, Trash2, Edit, Save, X } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface Merit {
  id?: string
  name: string
  category: string
  type: "merit" | "flaw"
  cost: number
  description: string
  pageRef?: string
}

const CATEGORIES = [
  "Physical",
  "Mental",
  "Social",
  "Supernatural",
  "Background",
  "General"
]

export function AdminMeritsPanel() {
  const { toast } = useToast()
  const [merits, setMerits] = useState<Merit[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState<Merit>({
    name: "",
    category: "",
    type: "merit",
    cost: 1,
    description: "",
    pageRef: "",
  })

  useEffect(() => {
    fetchMerits()
  }, [])

  const fetchMerits = async () => {
    try {
      const response = await fetch("/api/merits")
      if (response.ok) {
        const data = await response.json()
        setMerits(data)
      }
    } catch (error) {
      console.error("Error fetching merits:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      const url = editingId ? `/api/merits/${editingId}` : "/api/merits"
      const method = editingId ? "PUT" : "POST"

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        toast({
          title: editingId ? "Merit Updated" : "Merit Created",
          description: `${formData.name} has been ${editingId ? "updated" : "added"} successfully`,
        })
        resetForm()
        fetchMerits()
      } else {
        throw new Error("Failed to save merit")
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save merit",
        variant: "destructive",
      })
    }
  }

  const handleEdit = (merit: Merit) => {
    setFormData({
      name: merit.name,
      category: merit.category,
      type: merit.type,
      cost: merit.cost,
      description: merit.description,
      pageRef: merit.pageRef || "",
    })
    setEditingId(merit.id!)
    setShowForm(true)
  }

  const handleDelete = async () => {
    if (!deleteId) return

    try {
      const response = await fetch(`/api/merits/${deleteId}`, {
        method: "DELETE",
      })

      if (response.ok) {
        toast({
          title: "Merit Deleted",
          description: "The merit has been deleted successfully",
        })
        fetchMerits()
      } else {
        throw new Error("Failed to delete merit")
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete merit",
        variant: "destructive",
      })
    } finally {
      setDeleteId(null)
    }
  }

  const resetForm = () => {
    setFormData({
      name: "",
      category: "",
      type: "merit",
      cost: 1,
      description: "",
      pageRef: "",
    })
    setEditingId(null)
    setShowForm(false)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-cinzel font-bold text-primary">
            Merits & Flaws Management
          </h2>
          <p className="text-muted-foreground">
            Add and manage character advantages and disadvantages
          </p>
        </div>
        <Button onClick={() => setShowForm(!showForm)} className="gap-2">
          {showForm ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
          {showForm ? "Cancel" : "Add New"}
        </Button>
      </div>

      {/* Add/Edit Form */}
      {showForm && (
        <Card className="border-2 border-primary">
          <CardHeader>
            <CardTitle>
              {editingId ? "Edit Merit/Flaw" : "Add New Merit/Flaw"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Name *</Label>
                  <Input
                    id="name"
                    required
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    placeholder="e.g., Natural Linguist"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category">Category *</Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) =>
                      setFormData({ ...formData, category: value })
                    }
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {CATEGORIES.map((cat) => (
                        <SelectItem key={cat} value={cat}>
                          {cat}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="type">Type *</Label>
                  <Select
                    value={formData.type}
                    onValueChange={(value: "merit" | "flaw") =>
                      setFormData({ ...formData, type: value })
                    }
                    required
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="merit">Merit</SelectItem>
                      <SelectItem value="flaw">Flaw</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="cost">
                    Point Cost * {formData.type === "flaw" && "(use negative)"}
                  </Label>
                  <Input
                    id="cost"
                    type="number"
                    required
                    value={formData.cost}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        cost: parseInt(e.target.value),
                      })
                    }
                    placeholder={formData.type === "merit" ? "1" : "-1"}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  required
                  rows={4}
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  placeholder="Describe the effects and requirements..."
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="pageRef">Page Reference (Optional)</Label>
                <Input
                  id="pageRef"
                  value={formData.pageRef}
                  onChange={(e) =>
                    setFormData({ ...formData, pageRef: e.target.value })
                  }
                  placeholder="e.g., M20 Core, p.123"
                />
              </div>

              <div className="flex gap-2">
                <Button type="submit" className="gap-2">
                  <Save className="w-4 h-4" />
                  {editingId ? "Update" : "Create"}
                </Button>
                <Button type="button" variant="outline" onClick={resetForm}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Merits List */}
      <div className="space-y-4">
        <h3 className="text-xl font-cinzel font-bold text-primary">
          Existing Merits & Flaws ({merits.length})
        </h3>
        
        {isLoading ? (
          <p className="text-muted-foreground">Loading...</p>
        ) : merits.length === 0 ? (
          <Card className="border-2 border-primary">
            <CardContent className="p-8 text-center">
              <p className="text-muted-foreground">
                No merits or flaws yet. Add your first one above!
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {merits.map((merit) => (
              <Card key={merit.id} className="border-2 border-primary">
                <CardHeader>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <CardTitle className="text-lg font-cinzel flex items-center gap-2">
                        {merit.name}
                        <Badge variant={merit.type === "merit" ? "default" : "destructive"}>
                          {merit.type}
                        </Badge>
                        <Badge variant="outline">{merit.category}</Badge>
                      </CardTitle>
                      <CardDescription>
                        Cost: {merit.cost} points
                        {merit.pageRef && ` • ${merit.pageRef}`}
                      </CardDescription>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(merit)}
                        className="gap-2"
                      >
                        <Edit className="w-4 h-4" />
                        Edit
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => setDeleteId(merit.id!)}
                        className="gap-2"
                      >
                        <Trash2 className="w-4 h-4" />
                        Delete
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-foreground">{merit.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete this merit/flaw. This action cannot
              be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
