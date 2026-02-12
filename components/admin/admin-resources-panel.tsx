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
import { Checkbox } from "@/components/ui/checkbox"
import { Plus, Trash2, Edit, Save, X, Star, ExternalLink } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface Resource {
  id?: string
  name: string
  type: string
  category?: string
  description: string
  url?: string
  author?: string
  imageUrl?: string
  featured: boolean
}

const RESOURCE_TYPES = [
  "Podcast",
  "Website",
  "Book",
  "Video",
  "Article",
  "Tool",
  "Blog",
  "Community"
]

const CATEGORIES = [
  "Lore",
  "Rules",
  "Storytelling",
  "Character Building",
  "History",
  "Setting",
  "General"
]

export function AdminResourcesPanel() {
  const { toast } = useToast()
  const [resources, setResources] = useState<Resource[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState<Resource>({
    name: "",
    type: "",
    category: "",
    description: "",
    url: "",
    author: "",
    imageUrl: "",
    featured: false,
  })

  useEffect(() => {
    fetchResources()
  }, [])

  const fetchResources = async () => {
    try {
      const response = await fetch("/api/resources")
      if (response.ok) {
        const data = await response.json()
        setResources(data)
      }
    } catch (error) {
      console.error("Error fetching resources:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      const url = editingId ? `/api/resources/${editingId}` : "/api/resources"
      const method = editingId ? "PUT" : "POST"

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        toast({
          title: editingId ? "Resource Updated" : "Resource Created",
          description: `${formData.name} has been ${editingId ? "updated" : "added"} successfully`,
        })
        resetForm()
        fetchResources()
      } else {
        throw new Error("Failed to save resource")
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save resource",
        variant: "destructive",
      })
    }
  }

  const handleEdit = (resource: Resource) => {
    setFormData({
      name: resource.name,
      type: resource.type,
      category: resource.category || "",
      description: resource.description,
      url: resource.url || "",
      author: resource.author || "",
      imageUrl: resource.imageUrl || "",
      featured: resource.featured,
    })
    setEditingId(resource.id!)
    setShowForm(true)
  }

  const handleDelete = async () => {
    if (!deleteId) return

    try {
      const response = await fetch(`/api/resources/${deleteId}`, {
        method: "DELETE",
      })

      if (response.ok) {
        toast({
          title: "Resource Deleted",
          description: "The resource has been deleted successfully",
        })
        fetchResources()
      } else {
        throw new Error("Failed to delete resource")
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete resource",
        variant: "destructive",
      })
    } finally {
      setDeleteId(null)
    }
  }

  const resetForm = () => {
    setFormData({
      name: "",
      type: "",
      category: "",
      description: "",
      url: "",
      author: "",
      imageUrl: "",
      featured: false,
    })
    setEditingId(null)
    setShowForm(false)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-cinzel font-bold text-primary">
            Recommended Resources Management
          </h2>
          <p className="text-muted-foreground">
            Add and manage podcasts, websites, books, and other resources
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
              {editingId ? "Edit Resource" : "Add New Resource"}
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
                    placeholder="e.g., Mage: The Podcast"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="type">Type *</Label>
                  <Select
                    value={formData.type}
                    onValueChange={(value) =>
                      setFormData({ ...formData, type: value })
                    }
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      {RESOURCE_TYPES.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category">Category (Optional)</Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) =>
                      setFormData({ ...formData, category: value })
                    }
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
                  <Label htmlFor="author">Author/Creator (Optional)</Label>
                  <Input
                    id="author"
                    value={formData.author}
                    onChange={(e) =>
                      setFormData({ ...formData, author: e.target.value })
                    }
                    placeholder="e.g., John Smith"
                  />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="url">URL (Optional)</Label>
                  <Input
                    id="url"
                    type="url"
                    value={formData.url}
                    onChange={(e) =>
                      setFormData({ ...formData, url: e.target.value })
                    }
                    placeholder="https://example.com"
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
                  placeholder="Describe what makes this resource valuable..."
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="imageUrl">Image URL (Optional)</Label>
                <Input
                  id="imageUrl"
                  type="url"
                  value={formData.imageUrl}
                  onChange={(e) =>
                    setFormData({ ...formData, imageUrl: e.target.value })
                  }
                  placeholder="https://example.com/logo.png"
                />
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="featured"
                  checked={formData.featured}
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, featured: checked as boolean })
                  }
                />
                <Label htmlFor="featured" className="flex items-center gap-2 cursor-pointer">
                  <Star className="w-4 h-4" />
                  Feature this resource (show at top)
                </Label>
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

      {/* Resources List */}
      <div className="space-y-4">
        <h3 className="text-xl font-cinzel font-bold text-primary">
          Existing Resources ({resources.length})
        </h3>
        
        {isLoading ? (
          <p className="text-muted-foreground">Loading...</p>
        ) : resources.length === 0 ? (
          <Card className="border-2 border-primary">
            <CardContent className="p-8 text-center">
              <p className="text-muted-foreground">
                No resources yet. Add your first one above!
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {resources.map((resource) => (
              <Card key={resource.id} className="border-2 border-primary">
                <CardHeader>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <CardTitle className="text-lg font-cinzel flex items-center gap-2">
                        {resource.featured && <Star className="w-4 h-4 text-accent fill-accent" />}
                        {resource.name}
                        <Badge variant="outline">{resource.type}</Badge>
                        {resource.category && <Badge variant="secondary">{resource.category}</Badge>}
                      </CardTitle>
                      <CardDescription>
                        {resource.author && `by ${resource.author}`}
                        {resource.url && (
                          <a
                            href={resource.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="ml-2 inline-flex items-center gap-1 text-primary hover:underline"
                          >
                            Visit <ExternalLink className="w-3 h-3" />
                          </a>
                        )}
                      </CardDescription>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(resource)}
                        className="gap-2"
                      >
                        <Edit className="w-4 h-4" />
                        Edit
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => setDeleteId(resource.id!)}
                        className="gap-2"
                      >
                        <Trash2 className="w-4 h-4" />
                        Delete
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-foreground">{resource.description}</p>
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
              This will permanently delete this resource. This action cannot be
              undone.
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
