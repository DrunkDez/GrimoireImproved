// components/admin/admin-site-updates-panel.tsx

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
} from "@/components/ui/dialog"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useToast } from '@/hooks/use-toast'
import { Plus, Edit, Trash2, Eye, EyeOff, Megaphone } from 'lucide-react'

interface SiteUpdate {
  id: string
  title: string
  description: string
  category: string
  published: boolean
  priority: number
  date: string
  createdAt: string
  updatedAt: string
}

const CATEGORIES = ['Feature', 'Bug Fix', 'Content', 'Improvement', 'Announcement']

export function AdminSiteUpdatesPanel() {
  const { toast } = useToast()
  const [updates, setUpdates] = useState<SiteUpdate[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingUpdate, setEditingUpdate] = useState<SiteUpdate | null>(null)
  
  // Form state
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState('Feature')
  const [published, setPublished] = useState(false)
  const [priority, setPriority] = useState(0)
  const [date, setDate] = useState(new Date().toISOString().split('T')[0])

  useEffect(() => {
    fetchUpdates()
  }, [])

  const fetchUpdates = async () => {
    try {
      setIsLoading(true)
      const response = await fetch('/api/admin/site-updates')
      if (response.ok) {
        const data = await response.json()
        setUpdates(data)
      }
    } catch (error) {
      console.error('Error fetching updates:', error)
      toast({
        title: "Error",
        description: "Failed to fetch site updates",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleOpenDialog = (update?: SiteUpdate) => {
    if (update) {
      setEditingUpdate(update)
      setTitle(update.title)
      setDescription(update.description)
      setCategory(update.category)
      setPublished(update.published)
      setPriority(update.priority)
      setDate(new Date(update.date).toISOString().split('T')[0])
    } else {
      setEditingUpdate(null)
      setTitle('')
      setDescription('')
      setCategory('Feature')
      setPublished(false)
      setPriority(0)
      setDate(new Date().toISOString().split('T')[0])
    }
    setIsDialogOpen(true)
  }

  const handleSave = async () => {
    if (!title.trim() || !description.trim()) {
      toast({
        title: "Validation Error",
        description: "Title and description are required",
        variant: "destructive",
      })
      return
    }

    try {
      const url = editingUpdate
        ? `/api/admin/site-updates/${editingUpdate.id}`
        : '/api/admin/site-updates'
      
      const method = editingUpdate ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          description,
          category,
          published,
          priority,
          date,
        }),
      })

      if (response.ok) {
        toast({
          title: editingUpdate ? "Update Saved" : "Update Created",
          description: "Site update has been saved successfully",
        })
        setIsDialogOpen(false)
        fetchUpdates()
      } else {
        throw new Error('Failed to save update')
      }
    } catch (error) {
      console.error('Error saving update:', error)
      toast({
        title: "Error",
        description: "Failed to save site update",
        variant: "destructive",
      })
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this update?')) return

    try {
      const response = await fetch(`/api/admin/site-updates/${id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        toast({
          title: "Update Deleted",
          description: "Site update has been deleted",
        })
        fetchUpdates()
      }
    } catch (error) {
      console.error('Error deleting update:', error)
      toast({
        title: "Error",
        description: "Failed to delete site update",
        variant: "destructive",
      })
    }
  }

  const togglePublished = async (update: SiteUpdate) => {
    try {
      const response = await fetch(`/api/admin/site-updates/${update.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          published: !update.published,
        }),
      })

      if (response.ok) {
        toast({
          title: update.published ? "Update Unpublished" : "Update Published",
          description: update.published 
            ? "Update is now hidden from public view"
            : "Update is now visible to users",
        })
        fetchUpdates()
      }
    } catch (error) {
      console.error('Error toggling published:', error)
      toast({
        title: "Error",
        description: "Failed to update status",
        variant: "destructive",
      })
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Feature': return 'bg-green-100 text-green-800 border-green-300'
      case 'Bug Fix': return 'bg-red-100 text-red-800 border-red-300'
      case 'Content': return 'bg-blue-100 text-blue-800 border-blue-300'
      case 'Improvement': return 'bg-purple-100 text-purple-800 border-purple-300'
      case 'Announcement': return 'bg-yellow-100 text-yellow-800 border-yellow-300'
      default: return 'bg-gray-100 text-gray-800 border-gray-300'
    }
  }

  return (
    <div className="space-y-6">
      <Card className="border-2 border-primary/20">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2 text-primary">
                <Megaphone className="w-5 h-5" />
                Site Updates & Changelog
              </CardTitle>
              <CardDescription>
                Manage site updates that appear on the homepage and about page
              </CardDescription>
            </div>
            <Button onClick={() => handleOpenDialog()} className="gap-2">
              <Plus className="w-4 h-4" />
              New Update
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8 text-muted-foreground">Loading...</div>
          ) : updates.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No site updates yet. Click "New Update" to create one.
            </div>
          ) : (
            <div className="space-y-3">
              {updates.map((update) => (
                <div
                  key={update.id}
                  className="border-2 border-primary/20 rounded-lg p-4 space-y-3"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold text-primary">{update.title}</h3>
                        <span className={`text-xs px-2 py-0.5 rounded-full border ${getCategoryColor(update.category)}`}>
                          {update.category}
                        </span>
                        {!update.published && (
                          <span className="text-xs px-2 py-0.5 rounded-full border bg-gray-100 text-gray-600 border-gray-300">
                            Draft
                          </span>
                        )}
                        {update.priority > 0 && (
                          <span className="text-xs px-2 py-0.5 rounded-full border bg-orange-100 text-orange-600 border-orange-300">
                            Priority: {update.priority}
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {update.description}
                      </p>
                      <p className="text-xs text-muted-foreground mt-2">
                        {new Date(update.date).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => togglePublished(update)}
                        title={update.published ? "Unpublish" : "Publish"}
                      >
                        {update.published ? (
                          <Eye className="w-4 h-4" />
                        ) : (
                          <EyeOff className="w-4 h-4" />
                        )}
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleOpenDialog(update)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(update.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Edit/Create Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingUpdate ? 'Edit Site Update' : 'New Site Update'}
            </DialogTitle>
            <DialogDescription>
              {editingUpdate 
                ? 'Update the details of this site update'
                : 'Create a new site update to inform users about changes'}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., Added Experience Tracker"
              />
            </div>

            <div>
              <Label htmlFor="description">Description * (Markdown supported)</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe the update..."
                rows={6}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="category">Category *</Label>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {CATEGORIES.map((cat) => (
                      <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="date">Date</Label>
                <Input
                  id="date"
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="priority">Priority (0-10)</Label>
                <Input
                  id="priority"
                  type="number"
                  min="0"
                  max="10"
                  value={priority}
                  onChange={(e) => setPriority(parseInt(e.target.value) || 0)}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Higher priority updates appear first
                </p>
              </div>

              <div>
                <Label htmlFor="published" className="flex items-center gap-2 mb-2">
                  Published
                </Label>
                <div className="flex items-center gap-2 h-10">
                  <input
                    id="published"
                    type="checkbox"
                    checked={published}
                    onChange={(e) => setPublished(e.target.checked)}
                    className="w-4 h-4"
                  />
                  <span className="text-sm text-muted-foreground">
                    {published ? 'Visible to users' : 'Hidden (draft)'}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <Button onClick={handleSave} className="flex-1">
                {editingUpdate ? 'Save Changes' : 'Create Update'}
              </Button>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}