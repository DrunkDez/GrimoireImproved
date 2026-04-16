"use client"

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Card, CardContent } from '@/components/ui/card'
import { Pencil, Trash2, Plus, Calendar, Eye } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { MarkdownRenderer } from '@/components/ui/markdown-renderer'
import { format } from 'date-fns'

interface SiteUpdate {
  id: string
  title: string
  description: string
  category: string
  published: boolean
  priority: number
  date: string
}

export function AdminSiteUpdatesPanel() {
  const [updates, setUpdates] = useState<SiteUpdate[]>([])
  const [isEditing, setIsEditing] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [showPreview, setShowPreview] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Announcement',
    published: false,
    priority: 0,
    date: new Date().toISOString().slice(0, 10),
  })
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const fetchUpdates = async () => {
    const res = await fetch('/api/admin/site-updates')
    if (res.ok) {
      const data = await res.json()
      setUpdates(data)
    }
  }

  useEffect(() => {
    fetchUpdates()
  }, [])

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      category: 'Announcement',
      published: false,
      priority: 0,
      date: new Date().toISOString().slice(0, 10),
    })
    setIsEditing(false)
    setEditingId(null)
    setShowPreview(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    const method = editingId ? 'PUT' : 'POST'
    const url = editingId ? `/api/admin/site-updates/${editingId}` : '/api/admin/site-updates'

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (res.ok) {
        toast({
          title: editingId ? 'Update saved' : 'Update created',
          description: editingId ? 'Changes applied.' : 'New news post added.',
        })
        resetForm()
        fetchUpdates()
      } else {
        const error = await res.json()
        toast({
          title: 'Error',
          description: error.error || 'Something went wrong',
          variant: 'destructive',
        })
      }
    } catch {
      toast({
        title: 'Error',
        description: 'Failed to save update',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this news post?')) return
    const res = await fetch(`/api/admin/site-updates/${id}`, { method: 'DELETE' })
    if (res.ok) {
      toast({ title: 'Deleted', description: 'News post removed.' })
      fetchUpdates()
    } else {
      toast({ title: 'Error', description: 'Delete failed', variant: 'destructive' })
    }
  }

  const handleEdit = (update: SiteUpdate) => {
    setFormData({
      title: update.title,
      description: update.description,
      category: update.category,
      published: update.published,
      priority: update.priority,
      date: new Date(update.date).toISOString().slice(0, 10),
    })
    setEditingId(update.id)
    setIsEditing(true)
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Site News & Announcements</h2>
        {!isEditing && (
          <Button onClick={() => setIsEditing(true)} className="gap-2">
            <Plus className="w-4 h-4" /> New Post
          </Button>
        )}
      </div>

      {isEditing && (
        <Card>
          <CardContent className="pt-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label>Title</Label>
                <Input
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                />
              </div>
              <div>
                <div className="flex justify-between items-center mb-2">
                  <Label>Content (Markdown)</Label>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowPreview(!showPreview)}
                    className="gap-1"
                  >
                    <Eye className="w-4 h-4" />
                    {showPreview ? 'Edit' : 'Preview'}
                  </Button>
                </div>
                {showPreview ? (
                  <div className="border rounded-md p-4 min-h-[200px] prose prose-sm dark:prose-invert max-w-none">
                    <MarkdownRenderer content={formData.description} />
                  </div>
                ) : (
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full min-h-[200px] p-3 border rounded-md font-mono text-sm bg-background"
                    placeholder="Use **bold**, *italic*, [links](url), ![alt](image.jpg), lists, etc."
                  />
                )}
                <p className="text-xs text-muted-foreground mt-1">
                  Supports Markdown: **bold**, *italic*, [links](url), ![image](url), headings, lists, etc.
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Category</Label>
                  <Select
                    value={formData.category}
                    onValueChange={(v) => setFormData({ ...formData, category: v })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {['Feature', 'Bug Fix', 'Content', 'Improvement', 'Announcement'].map(c => (
                        <SelectItem key={c} value={c}>{c}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Date</Label>
                  <Input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  />
                </div>
                <div>
                  <Label>Priority (higher = first)</Label>
                  <Input
                    type="number"
                    value={formData.priority}
                    onChange={(e) => setFormData({ ...formData, priority: parseInt(e.target.value) || 0 })}
                  />
                </div>
                <div className="flex items-center gap-2 pt-6">
                  <Switch
                    checked={formData.published}
                    onCheckedChange={(c) => setFormData({ ...formData, published: c })}
                  />
                  <Label>Published (visible to public)</Label>
                </div>
              </div>
              <div className="flex gap-2">
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? 'Saving...' : editingId ? 'Update' : 'Create'}
                </Button>
                <Button type="button" variant="outline" onClick={resetForm}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="space-y-3">
        {updates.map((update) => (
          <Card key={update.id} className="relative">
            <CardContent className="pt-6">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-bold">{update.title}</h3>
                  <div className="flex gap-3 text-sm text-muted-foreground mt-1">
                    <span className="capitalize">{update.category}</span>
                    <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{format(new Date(update.date), 'MMM dd, yyyy')}</span>
                    {update.published ? <span className="text-green-600">Published</span> : <span className="text-red-600">Draft</span>}
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="ghost" size="sm" onClick={() => handleEdit(update)}>
                    <Pencil className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => handleDelete(update.id)}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              <div className="mt-3 line-clamp-2 text-muted-foreground text-sm">
                <MarkdownRenderer content={update.description.substring(0, 200) + (update.description.length > 200 ? '...' : '')} />
              </div>
            </CardContent>
          </Card>
        ))}
        {updates.length === 0 && <p className="text-muted-foreground">No news posts yet. Click "New Post" to create one.</p>}
      </div>
    </div>
  )
}
