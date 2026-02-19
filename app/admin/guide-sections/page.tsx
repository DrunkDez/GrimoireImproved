"use client"

import { useState, useEffect } from "react"
import { GrimoireHeader } from "@/components/grimoire-header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
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
import { Plus, Edit2, Trash2, Save, X } from "lucide-react"

interface GuideSection {
  id: string
  title: string
  content: string
  category: string
  order: number
}

export default function GuideAdminPanel() {
  const [sections, setSections] = useState<GuideSection[]>([])
  const [editingId, setEditingId] = useState<string | null>(null)
  const [isCreating, setIsCreating] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: 'overview',
    order: 0
  })

  useEffect(() => {
    fetchSections()
  }, [])

  const fetchSections = async () => {
    try {
      const response = await fetch('/api/guide-sections')
      if (response.ok) {
        const data = await response.json()
        setSections(data)
      }
    } catch (error) {
      console.error('Error fetching sections:', error)
    }
  }

  const handleCreate = async () => {
    try {
      const response = await fetch('/api/guide-sections', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      if (response.ok) {
        await fetchSections()
        setIsCreating(false)
        resetForm()
      }
    } catch (error) {
      console.error('Error creating section:', error)
    }
  }

  const handleUpdate = async (id: string) => {
    try {
      const response = await fetch('/api/guide-sections', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, ...formData })
      })

      if (response.ok) {
        await fetchSections()
        setEditingId(null)
        resetForm()
      }
    } catch (error) {
      console.error('Error updating section:', error)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this section?')) return

    try {
      const response = await fetch(`/api/guide-sections?id=${id}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        await fetchSections()
      }
    } catch (error) {
      console.error('Error deleting section:', error)
    }
  }

  const startEdit = (section: GuideSection) => {
    setEditingId(section.id)
    setFormData({
      title: section.title,
      content: section.content,
      category: section.category,
      order: section.order
    })
  }

  const cancelEdit = () => {
    setEditingId(null)
    setIsCreating(false)
    resetForm()
  }

  const resetForm = () => {
    setFormData({
      title: '',
      content: '',
      category: 'overview',
      order: 0
    })
  }

  const groupedSections = sections.reduce((acc, section) => {
    if (!acc[section.category]) {
      acc[section.category] = []
    }
    acc[section.category].push(section)
    return acc
  }, {} as Record<string, GuideSection[]>)

  return (
    <div className="min-h-screen relative z-[1]">
      <div className="max-w-[1400px] mx-auto bg-background border-[3px] border-primary rounded-lg overflow-hidden relative my-6 mx-3 md:my-8 md:mx-4">
        <GrimoireHeader />

        <div className="p-6 md:p-10 space-y-8">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-cinzel font-bold text-primary">
                Character Guide Admin
              </h1>
              <p className="text-muted-foreground mt-2">
                Manage guide sections for character creation
              </p>
            </div>
            <Button 
              onClick={() => setIsCreating(true)}
              className="gap-2"
              disabled={isCreating}
            >
              <Plus className="w-4 h-4" />
              New Section
            </Button>
          </div>

          {/* Create Form */}
          {isCreating && (
            <Card className="border-2 border-accent">
              <CardHeader>
                <CardTitle className="font-cinzel">Create New Section</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Title</Label>
                  <Input
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="e.g., Concept & Tradition"
                  />
                </div>

                <div>
                  <Label>Category</Label>
                  <Select 
                    value={formData.category} 
                    onValueChange={(value) => setFormData({ ...formData, category: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="overview">Overview</SelectItem>
                      <SelectItem value="attributes">Attributes</SelectItem>
                      <SelectItem value="abilities">Abilities</SelectItem>
                      <SelectItem value="spheres">Spheres</SelectItem>
                      <SelectItem value="finishing">Finishing</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Order</Label>
                  <Input
                    type="number"
                    value={formData.order}
                    onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) })}
                  />
                </div>

                <div>
                  <Label>Content</Label>
                  <Textarea
                    value={formData.content}
                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                    placeholder="Enter the guide content..."
                    rows={6}
                  />
                </div>

                <div className="flex gap-2">
                  <Button onClick={handleCreate} className="gap-2">
                    <Save className="w-4 h-4" />
                    Create
                  </Button>
                  <Button onClick={cancelEdit} variant="outline" className="gap-2">
                    <X className="w-4 h-4" />
                    Cancel
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Sections List */}
          <div className="space-y-6">
            {Object.entries(groupedSections).map(([category, categorySections]) => (
              <Card key={category} className="border-2 border-primary">
                <CardHeader>
                  <CardTitle className="font-cinzel capitalize">{category}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {categorySections
                    .sort((a, b) => a.order - b.order)
                    .map((section) => (
                      <div key={section.id}>
                        {editingId === section.id ? (
                          // Edit Form
                          <div className="space-y-4 p-4 border-2 border-accent rounded-md">
                            <div>
                              <Label>Title</Label>
                              <Input
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                              />
                            </div>

                            <div>
                              <Label>Category</Label>
                              <Select 
                                value={formData.category} 
                                onValueChange={(value) => setFormData({ ...formData, category: value })}
                              >
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="overview">Overview</SelectItem>
                                  <SelectItem value="attributes">Attributes</SelectItem>
                                  <SelectItem value="abilities">Abilities</SelectItem>
                                  <SelectItem value="spheres">Spheres</SelectItem>
                                  <SelectItem value="finishing">Finishing</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>

                            <div>
                              <Label>Order</Label>
                              <Input
                                type="number"
                                value={formData.order}
                                onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) })}
                              />
                            </div>

                            <div>
                              <Label>Content</Label>
                              <Textarea
                                value={formData.content}
                                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                                rows={6}
                              />
                            </div>

                            <div className="flex gap-2">
                              <Button onClick={() => handleUpdate(section.id)} className="gap-2">
                                <Save className="w-4 h-4" />
                                Save
                              </Button>
                              <Button onClick={cancelEdit} variant="outline" className="gap-2">
                                <X className="w-4 h-4" />
                                Cancel
                              </Button>
                            </div>
                          </div>
                        ) : (
                          // View Mode
                          <div className="p-4 border rounded-md hover:border-primary/50 transition-colors">
                            <div className="flex items-start justify-between mb-2">
                              <div className="flex-1">
                                <div className="flex items-center gap-2">
                                  <h3 className="font-semibold text-lg">{section.title}</h3>
                                  <span className="text-xs text-muted-foreground">
                                    (Order: {section.order})
                                  </span>
                                </div>
                                <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                                  {section.content}
                                </p>
                              </div>
                              <div className="flex gap-2 ml-4">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => startEdit(section)}
                                  className="gap-1"
                                >
                                  <Edit2 className="w-3 h-3" />
                                  Edit
                                </Button>
                                <Button
                                  size="sm"
                                  variant="destructive"
                                  onClick={() => handleDelete(section.id)}
                                  className="gap-1"
                                >
                                  <Trash2 className="w-3 h-3" />
                                  Delete
                                </Button>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
