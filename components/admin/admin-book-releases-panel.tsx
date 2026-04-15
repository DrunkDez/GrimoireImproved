// components/admin/admin-book-releases-panel.tsx

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
import { Plus, Edit, Trash2, Eye, EyeOff, BookOpen } from 'lucide-react'

interface BookRelease {
  id: string
  title: string
  publisher: string | null
  description: string
  releaseDate: string | null
  status: string
  coverImageUrl: string | null
  purchaseUrl: string | null
  announcementUrl: string | null
  published: boolean
  priority: number
  createdAt: string
  updatedAt: string
}

const STATUSES = ['Announced', 'Pre-order', 'Released', 'Delayed']

export function AdminBookReleasesPanel() {
  const { toast } = useToast()
  const [releases, setReleases] = useState<BookRelease[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingRelease, setEditingRelease] = useState<BookRelease | null>(null)
  
  // Form state
  const [title, setTitle] = useState('')
  const [publisher, setPublisher] = useState('')
  const [description, setDescription] = useState('')
  const [releaseDate, setReleaseDate] = useState('')
  const [status, setStatus] = useState('Announced')
  const [coverImageUrl, setCoverImageUrl] = useState('')
  const [purchaseUrl, setPurchaseUrl] = useState('')
  const [announcementUrl, setAnnouncementUrl] = useState('')
  const [published, setPublished] = useState(false)
  const [priority, setPriority] = useState(0)

  useEffect(() => {
    fetchReleases()
  }, [])

  const fetchReleases = async () => {
    try {
      setIsLoading(true)
      const response = await fetch('/api/admin/book-releases', {
        credentials: 'include', // ✅ Send session cookie
      })
      if (response.ok) {
        const data = await response.json()
        setReleases(data)
      } else if (response.status === 401) {
        // Redirect to login if session expired
        window.location.href = '/auth/signin'
      }
    } catch (error) {
      console.error('Error fetching releases:', error)
      toast({
        title: "Error",
        description: "Failed to fetch book releases",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleOpenDialog = (release?: BookRelease) => {
    if (release) {
      setEditingRelease(release)
      setTitle(release.title)
      setPublisher(release.publisher || '')
      setDescription(release.description)
      setReleaseDate(release.releaseDate ? new Date(release.releaseDate).toISOString().split('T')[0] : '')
      setStatus(release.status)
      setCoverImageUrl(release.coverImageUrl || '')
      setPurchaseUrl(release.purchaseUrl || '')
      setAnnouncementUrl(release.announcementUrl || '')
      setPublished(release.published)
      setPriority(release.priority)
    } else {
      setEditingRelease(null)
      setTitle('')
      setPublisher('')
      setDescription('')
      setReleaseDate('')
      setStatus('Announced')
      setCoverImageUrl('')
      setPurchaseUrl('')
      setAnnouncementUrl('')
      setPublished(false)
      setPriority(0)
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
      const url = editingRelease
        ? `/api/admin/book-releases/${editingRelease.id}`
        : '/api/admin/book-releases'
      
      const method = editingRelease ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include', // ✅ Send session cookie
        body: JSON.stringify({
          title,
          publisher: publisher || null,
          description,
          releaseDate: releaseDate || null,
          status,
          coverImageUrl: coverImageUrl || null,
          purchaseUrl: purchaseUrl || null,
          announcementUrl: announcementUrl || null,
          published,
          priority,
        }),
      })

      if (response.ok) {
        toast({
          title: editingRelease ? "Release Updated" : "Release Created",
          description: "Book release has been saved successfully",
        })
        setIsDialogOpen(false)
        fetchReleases()
      } else if (response.status === 401) {
        window.location.href = '/auth/signin'
      } else {
        throw new Error('Failed to save release')
      }
    } catch (error) {
      console.error('Error saving release:', error)
      toast({
        title: "Error",
        description: "Failed to save book release",
        variant: "destructive",
      })
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this book release?')) return

    try {
      const response = await fetch(`/api/admin/book-releases/${id}`, {
        method: 'DELETE',
        credentials: 'include', // ✅ Send session cookie
      })

      if (response.ok) {
        toast({
          title: "Release Deleted",
          description: "Book release has been deleted",
        })
        fetchReleases()
      } else if (response.status === 401) {
        window.location.href = '/auth/signin'
      }
    } catch (error) {
      console.error('Error deleting release:', error)
      toast({
        title: "Error",
        description: "Failed to delete book release",
        variant: "destructive",
      })
    }
  }

  const togglePublished = async (release: BookRelease) => {
    try {
      const response = await fetch(`/api/admin/book-releases/${release.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include', // ✅ Send session cookie
        body: JSON.stringify({
          published: !release.published,
        }),
      })

      if (response.ok) {
        toast({
          title: release.published ? "Release Unpublished" : "Release Published",
          description: release.published 
            ? "Release is now hidden from public view"
            : "Release is now visible to users",
        })
        fetchReleases()
      } else if (response.status === 401) {
        window.location.href = '/auth/signin'
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Announced': return 'bg-blue-100 text-blue-800 border-blue-300'
      case 'Pre-order': return 'bg-purple-100 text-purple-800 border-purple-300'
      case 'Released': return 'bg-green-100 text-green-800 border-green-300'
      case 'Delayed': return 'bg-red-100 text-red-800 border-red-300'
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
                <BookOpen className="w-5 h-5" />
                Upcoming Book Releases
              </CardTitle>
              <CardDescription>
                Manage upcoming Mage-related book releases
              </CardDescription>
            </div>
            <Button onClick={() => handleOpenDialog()} className="gap-2">
              <Plus className="w-4 h-4" />
              New Release
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8 text-muted-foreground">Loading...</div>
          ) : releases.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No book releases yet. Click "New Release" to create one.
            </div>
          ) : (
            <div className="space-y-3">
              {releases.map((release) => (
                <div
                  key={release.id}
                  className="border-2 border-primary/20 rounded-lg p-4 space-y-3"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2 flex-wrap">
                        <h3 className="font-semibold text-primary">{release.title}</h3>
                        <span className={`text-xs px-2 py-0.5 rounded-full border ${getStatusColor(release.status)}`}>
                          {release.status}
                        </span>
                        {!release.published && (
                          <span className="text-xs px-2 py-0.5 rounded-full border bg-gray-100 text-gray-600 border-gray-300">
                            Draft
                          </span>
                        )}
                        {release.priority > 0 && (
                          <span className="text-xs px-2 py-0.5 rounded-full border bg-orange-100 text-orange-600 border-orange-300">
                            Priority: {release.priority}
                          </span>
                        )}
                      </div>
                      {release.publisher && (
                        <p className="text-sm text-muted-foreground mb-1">
                          Publisher: {release.publisher}
                        </p>
                      )}
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {release.description}
                      </p>
                      {release.releaseDate && (
                        <p className="text-xs text-muted-foreground mt-2">
                          Release Date: {new Date(release.releaseDate).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => togglePublished(release)}
                        title={release.published ? "Unpublish" : "Publish"}
                      >
                        {release.published ? (
                          <Eye className="w-4 h-4" />
                        ) : (
                          <EyeOff className="w-4 h-4" />
                        )}
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleOpenDialog(release)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(release.id)}
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
              {editingRelease ? 'Edit Book Release' : 'New Book Release'}
            </DialogTitle>
            <DialogDescription>
              {editingRelease 
                ? 'Update the details of this book release'
                : 'Add a new upcoming book release'}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., Mage: The Ascension 5th Edition"
              />
            </div>

            <div>
              <Label htmlFor="publisher">Publisher</Label>
              <Input
                id="publisher"
                value={publisher}
                onChange={(e) => setPublisher(e.target.value)}
                placeholder="e.g., Onyx Path Publishing"
              />
            </div>

            <div>
              <Label htmlFor="description">Description * (Markdown supported)</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe the book..."
                rows={4}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="status">Status *</Label>
                <Select value={status} onValueChange={setStatus}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {STATUSES.map((s) => (
                      <SelectItem key={s} value={s}>{s}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="releaseDate">Release Date</Label>
                <Input
                  id="releaseDate"
                  type="date"
                  value={releaseDate}
                  onChange={(e) => setReleaseDate(e.target.value)}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="coverImageUrl">Cover Image URL</Label>
              <Input
                id="coverImageUrl"
                value={coverImageUrl}
                onChange={(e) => setCoverImageUrl(e.target.value)}
                placeholder="https://..."
              />
            </div>

            <div>
              <Label htmlFor="purchaseUrl">Purchase URL</Label>
              <Input
                id="purchaseUrl"
                value={purchaseUrl}
                onChange={(e) => setPurchaseUrl(e.target.value)}
                placeholder="https://..."
              />
            </div>

            <div>
              <Label htmlFor="announcementUrl">Announcement URL</Label>
              <Input
                id="announcementUrl"
                value={announcementUrl}
                onChange={(e) => setAnnouncementUrl(e.target.value)}
                placeholder="https://..."
              />
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
                  Higher priority releases appear first
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
                {editingRelease ? 'Save Changes' : 'Create Release'}
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
