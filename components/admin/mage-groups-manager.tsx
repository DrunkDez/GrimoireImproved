"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
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
import { Switch } from "@/components/ui/switch"
import { Plus, Edit2, Trash2, Save, X, RefreshCw } from "lucide-react"

interface MageGroup {
  id: string
  name: string
  slug: string
  category: string
  description: string
  philosophy?: string
  practices?: string
  organization?: string
  headerImage?: string
  sidebarImage?: string
  published: boolean
  sortOrder: number
}

export function MageGroupsManager() {
  const [groups, setGroups] = useState<MageGroup[]>([])
  const [editingId, setEditingId] = useState<string | null>(null)
  const [isCreating, setIsCreating] = useState(false)
  const [loading, setLoading] = useState(true)
  const [formData, setFormData] = useState<Partial<MageGroup>>({
    name: '',
    slug: '',
    category: 'Tradition',
    description: '',
    philosophy: '',
    practices: '',
    organization: '',
    headerImage: '',
    sidebarImage: '',
    published: false,
    sortOrder: 0
  })

  useEffect(() => {
    fetchGroups()
  }, [])

  const fetchGroups = async () => {
    try {
      const response = await fetch('/api/mage-groups')
      if (response.ok) {
        const data = await response.json()
        setGroups(data)
      }
    } catch (error) {
      console.error('Error fetching groups:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCreate = async () => {
    try {
      const response = await fetch('/api/mage-groups', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      if (response.ok) {
        await fetchGroups()
        setIsCreating(false)
        resetForm()
      } else {
        alert('Failed to create group')
      }
    } catch (error) {
      console.error('Error creating group:', error)
      alert('Error creating group')
    }
  }

  const handleUpdate = async (id: string) => {
    try {
      const response = await fetch('/api/mage-groups', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, ...formData })
      })

      if (response.ok) {
        await fetchGroups()
        setEditingId(null)
        resetForm()
      } else {
        alert('Failed to update group')
      }
    } catch (error) {
      console.error('Error updating group:', error)
      alert('Error updating group')
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this group?')) return

    try {
      const response = await fetch(`/api/mage-groups?id=${id}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        await fetchGroups()
      } else {
        alert('Failed to delete group')
      }
    } catch (error) {
      console.error('Error deleting group:', error)
      alert('Error deleting group')
    }
  }

  const startEdit = (group: MageGroup) => {
    setEditingId(group.id)
    setFormData(group)
  }

  const cancelEdit = () => {
    setEditingId(null)
    setIsCreating(false)
    resetForm()
  }

  const resetForm = () => {
    setFormData({
      name: '',
      slug: '',
      category: 'Tradition',
      description: '',
      philosophy: '',
      practices: '',
      organization: '',
      headerImage: '',
      sidebarImage: '',
      published: false,
      sortOrder: 0
    })
  }

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '')
  }

  const groupedByCategory = groups.reduce((acc, group) => {
    if (!acc[group.category]) acc[group.category] = []
    acc[group.category].push(group)
    return acc
  }, {} as Record<string, MageGroup[]>)

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <RefreshCw className="w-6 h-6 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-cinzel font-bold text-primary">
            Mage Groups Encyclopedia
          </h2>
          <p className="text-sm text-muted-foreground mt-2">
            Manage Traditions, Technocracy, and Disparate Alliance groups
          </p>
        </div>
        <Button onClick={() => setIsCreating(true)} disabled={isCreating} className="gap-2">
          <Plus className="w-4 h-4" />
          New Group
        </Button>
      </div>

      {/* Create Form */}
      {isCreating && (
        <GroupForm
          formData={formData}
          setFormData={setFormData}
          onSave={handleCreate}
          onCancel={cancelEdit}
          generateSlug={generateSlug}
        />
      )}

      {/* Groups by Category */}
      {Object.entries(groupedByCategory).map(([category, categoryGroups]) => (
        <Card key={category} className="border-2">
          <CardHeader>
            <CardTitle className="font-cinzel">{category}</CardTitle>
            <CardDescription>{categoryGroups.length} groups</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {categoryGroups.map(group => (
              <div key={group.id}>
                {editingId === group.id ? (
                  <GroupForm
                    formData={formData}
                    setFormData={setFormData}
                    onSave={() => handleUpdate(group.id)}
                    onCancel={cancelEdit}
                    generateSlug={generateSlug}
                  />
                ) : (
                  <div className="p-4 border rounded hover:border-primary/50 transition-colors">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-semibold text-lg">{group.name}</h3>
                          {group.published ? (
                            <span className="text-xs px-2 py-0.5 bg-green-500/20 text-green-700 dark:text-green-400 rounded">
                              Published
                            </span>
                          ) : (
                            <span className="text-xs px-2 py-0.5 bg-yellow-500/20 text-yellow-700 dark:text-yellow-400 rounded">
                              Draft
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {group.description}
                        </p>
                        <div className="flex gap-3 mt-2 text-xs text-muted-foreground">
                          <span>Slug: {group.slug}</span>
                          <span>Sort: {group.sortOrder}</span>
                        </div>
                      </div>
                      <div className="flex gap-2 ml-4">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => startEdit(group)}
                          className="gap-1"
                        >
                          <Edit2 className="w-3 h-3" />
                          Edit
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleDelete(group.id)}
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

      {groups.length === 0 && !isCreating && (
        <Card className="border-2 border-dashed">
          <CardContent className="p-12 text-center">
            <p className="text-muted-foreground mb-4">No groups created yet</p>
            <Button onClick={() => setIsCreating(true)} className="gap-2">
              <Plus className="w-4 h-4" />
              Create First Group
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

// Group Form Component
function GroupForm({ formData, setFormData, onSave, onCancel, generateSlug }: {
  formData: Partial<MageGroup>
  setFormData: (data: Partial<MageGroup>) => void
  onSave: () => void
  onCancel: () => void
  generateSlug: (name: string) => string
}) {
  return (
    <Card className="border-2 border-accent">
      <CardHeader>
        <CardTitle className="font-cinzel">
          {formData.id ? 'Edit Group' : 'Create New Group'}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>Name *</Label>
            <Input
              value={formData.name || ''}
              onChange={(e) => {
                const name = e.target.value
                setFormData({
                  ...formData,
                  name,
                  slug: generateSlug(name)
                })
              }}
              placeholder="e.g., Akashic Brotherhood"
            />
          </div>

          <div>
            <Label>Slug</Label>
            <Input
              value={formData.slug || ''}
              onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
              placeholder="akashic-brotherhood"
            />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <Label>Category *</Label>
            <Select
              value={formData.category || 'Tradition'}
              onValueChange={(value) => setFormData({ ...formData, category: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Tradition">Tradition</SelectItem>
                <SelectItem value="Technocracy">Technocracy</SelectItem>
                <SelectItem value="Disparate">Disparate Alliance</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Sort Order</Label>
            <Input
              type="number"
              value={formData.sortOrder || 0}
              onChange={(e) => setFormData({ ...formData, sortOrder: parseInt(e.target.value) })}
            />
          </div>

          <div className="flex items-center gap-2 pt-6">
            <Switch
              checked={formData.published || false}
              onCheckedChange={(checked) => setFormData({ ...formData, published: checked })}
            />
            <Label>Published</Label>
          </div>
        </div>

        <div>
          <Label>Description *</Label>
          <Textarea
            value={formData.description || ''}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            rows={4}
            placeholder="Main description of the group..."
          />
        </div>

        <div>
          <Label>Philosophy</Label>
          <Textarea
            value={formData.philosophy || ''}
            onChange={(e) => setFormData({ ...formData, philosophy: e.target.value })}
            rows={4}
            placeholder="Their beliefs and worldview..."
          />
        </div>

        <div>
          <Label>Practices</Label>
          <Textarea
            value={formData.practices || ''}
            onChange={(e) => setFormData({ ...formData, practices: e.target.value })}
            rows={4}
            placeholder="How they practice magic..."
          />
        </div>

        <div>
          <Label>Organization</Label>
          <Textarea
            value={formData.organization || ''}
            onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
            rows={4}
            placeholder="How they are structured..."
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>Header Image URL</Label>
            <Input
              value={formData.headerImage || ''}
              onChange={(e) => setFormData({ ...formData, headerImage: e.target.value })}
              placeholder="/images/traditions/akashic-header.png"
            />
            <p className="text-xs text-muted-foreground mt-1">
              Wide banner image (like the Ahl-i-Batin logo)
            </p>
          </div>

          <div>
            <Label>Sidebar Image URL</Label>
            <Input
              value={formData.sidebarImage || ''}
              onChange={(e) => setFormData({ ...formData, sidebarImage: e.target.value })}
              placeholder="/images/traditions/akashic-symbol.png"
            />
            <p className="text-xs text-muted-foreground mt-1">
              Square symbol/icon image
            </p>
          </div>
        </div>

        <div className="flex gap-2 pt-4">
          <Button onClick={onSave} className="gap-2">
            <Save className="w-4 h-4" />
            Save
          </Button>
          <Button onClick={onCancel} variant="outline" className="gap-2">
            <X className="w-4 h-4" />
            Cancel
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
