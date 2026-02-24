"use client"

import { useState } from "react"
import type { Rote } from "@/lib/mage-data"
import { ALL_FACTIONS, SPHERES } from "@/lib/mage-data"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { TraditionCombobox } from "@/components/tradition-combobox"
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
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
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
import { Trash2, RefreshCw, Edit, Plus, Minus } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface AdminRotesPanelProps {
  rotes: Rote[]
  onRotesChange: () => void
}

interface EditRote {
  id: string
  name: string
  tradition: string
  description: string
  spheres: Record<string, number>
  level: string
  pageRef: string
}

export function AdminRotesPanel({ rotes, onRotesChange }: AdminRotesPanelProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [showDeleteAllDialog, setShowDeleteAllDialog] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [roteToDelete, setRoteToDelete] = useState<string | null>(null)
  const [editingRote, setEditingRote] = useState<EditRote | null>(null)
  const { toast } = useToast()

  const handleDeleteAll = async () => {
    setIsLoading(true)

    try {
      const response = await fetch('/api/admin/delete-all', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: 'TruthUntilParadox' }),
      })

      const data = await response.json()

      if (response.ok) {
        toast({
          title: "All Rotes Deleted",
          description: `${data.deletedCount} rotes have been removed`,
        })
        onRotesChange()
      } else {
        throw new Error(data.error)
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete rotes",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
      setShowDeleteAllDialog(false)
    }
  }

  const handleDeleteRote = async (id: string) => {
    setIsLoading(true)

    try {
      const response = await fetch(`/api/rotes/${id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        toast({
          title: "Rote Deleted",
          description: "The rote has been removed",
        })
        onRotesChange()
      } else {
        const error = await response.json()
        throw new Error(error.error || 'Failed to delete')
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to delete rote",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
      setShowDeleteDialog(false)
      setRoteToDelete(null)
    }
  }

  const handleSeedDatabase = async () => {
    setIsLoading(true)

    try {
      const response = await fetch('/api/admin/seed', {
        method: 'POST',
      })

      const data = await response.json()

      if (response.ok) {
        toast({
          title: "Database Seeded",
          description: `${data.count} sample rotes have been added`,
        })
        onRotesChange()
      } else {
        throw new Error(data.error)
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to seed database",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleEditClick = (rote: Rote) => {
    setEditingRote({
      id: rote.id,
      name: rote.name,
      tradition: rote.tradition,
      description: rote.description,
      spheres: { ...rote.spheres },
      level: rote.level,
      pageRef: rote.pageRef || '',
    })
    setShowEditDialog(true)
  }

  const handleSaveEdit = async () => {
    if (!editingRote) return

    setIsLoading(true)

    try {
      const response = await fetch(`/api/rotes/${editingRote.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: editingRote.name,
          tradition: editingRote.tradition,
          description: editingRote.description,
          spheres: editingRote.spheres,
          level: editingRote.level,
          pageRef: editingRote.pageRef || null,
        }),
      })

      if (response.ok) {
        toast({
          title: "Rote Updated",
          description: "The rote has been saved successfully",
        })
        setShowEditDialog(false)
        setEditingRote(null)
        onRotesChange()
      } else {
        throw new Error('Failed to update')
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update rote",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleSphereChange = (sphere: string, value: number) => {
    if (!editingRote) return

    const newSpheres = { ...editingRote.spheres }
    if (value > 0) {
      newSpheres[sphere] = value
    } else {
      delete newSpheres[sphere]
    }

    setEditingRote({
      ...editingRote,
      spheres: newSpheres,
    })
  }

  const handleAddSphere = (sphere: string) => {
    if (!editingRote || editingRote.spheres[sphere]) return
    handleSphereChange(sphere, 1)
  }

  const formatSpheres = (spheres: Record<string, number>) => {
    return Object.entries(spheres)
      .map(([sphere, level]) => `${sphere} ${level}`)
      .join(', ')
  }

  return (
    <div className="space-y-6">
      {/* Stats and Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-2 border-primary/20">
          <CardHeader>
            <CardTitle className="text-lg">Total Rotes</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold text-primary">{rotes.length}</p>
          </CardContent>
        </Card>

        <Card className="border-2 border-primary/20">
          <CardHeader>
            <CardTitle className="text-lg">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button
              variant="outline"
              className="w-full gap-2"
              onClick={handleSeedDatabase}
              disabled={isLoading}
            >
              <RefreshCw className="w-4 h-4" />
              Seed Sample Rotes
            </Button>
          </CardContent>
        </Card>

        <Card className="border-2 border-destructive/50">
          <CardHeader>
            <CardTitle className="text-lg text-destructive">Danger Zone</CardTitle>
          </CardHeader>
          <CardContent>
            <Button
              variant="destructive"
              className="w-full gap-2"
              onClick={() => setShowDeleteAllDialog(true)}
              disabled={isLoading || rotes.length === 0}
            >
              <Trash2 className="w-4 h-4" />
              Delete All Rotes
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Rotes Table */}
      <Card className="border-2 border-primary/20">
        <CardHeader>
          <CardTitle>All Rotes</CardTitle>
          <CardDescription>Edit or delete individual rotes</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Tradition/Craft</TableHead>
                  <TableHead>Spheres</TableHead>
                  <TableHead>Level</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rotes.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center text-muted-foreground">
                      No rotes found. Add some rotes or seed the database.
                    </TableCell>
                  </TableRow>
                ) : (
                  rotes.map((rote) => (
                    <TableRow key={rote.id}>
                      <TableCell className="font-medium">{rote.name}</TableCell>
                      <TableCell>{rote.tradition}</TableCell>
                      <TableCell className="text-sm">{formatSpheres(rote.spheres)}</TableCell>
                      <TableCell>{rote.level}</TableCell>
                      <TableCell className="text-right space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEditClick(rote)}
                          disabled={isLoading}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => {
                            setRoteToDelete(rote.id)
                            setShowDeleteDialog(true)
                          }}
                          disabled={isLoading}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Rote</DialogTitle>
            <DialogDescription>
              Modify the rote details below
            </DialogDescription>
          </DialogHeader>

          {editingRote && (
            <div className="space-y-4">
              {/* Name */}
              <div className="space-y-2">
                <Label htmlFor="edit-name">Name</Label>
                <Input
                  id="edit-name"
                  value={editingRote.name}
                  onChange={(e) => setEditingRote({ ...editingRote, name: e.target.value })}
                />
              </div>

           {/* Tradition/Craft */}
<div className="space-y-2">
  <Label htmlFor="edit-tradition">Tradition/Craft/Convention</Label>
  <TraditionCombobox
    value={editingRote.tradition}
    onValueChange={(value) => setEditingRote({ ...editingRote, tradition: value })}
    placeholder="Select tradition..."
  />
</div>

              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="edit-description">Description</Label>
                <Textarea
                  id="edit-description"
                  value={editingRote.description}
                  onChange={(e) => setEditingRote({ ...editingRote, description: e.target.value })}
                  rows={4}
                />
              </div>

              {/* Spheres */}
              <div className="space-y-2">
                <Label>Spheres</Label>
                <div className="space-y-2">
                  {Object.entries(editingRote.spheres).map(([sphere, level]) => (
                    <div key={sphere} className="flex items-center gap-2">
                      <span className="w-40 text-sm font-medium">{sphere}</span>
                      <div className="flex items-center gap-2">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => handleSphereChange(sphere, Math.max(0, level - 1))}
                        >
                          <Minus className="w-3 h-3" />
                        </Button>
                        <span className="w-8 text-center">{level}</span>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => handleSphereChange(sphere, Math.min(5, level + 1))}
                        >
                          <Plus className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Add Sphere */}
                <div className="pt-2">
                  <Label htmlFor="add-sphere">Add Sphere</Label>
                  <Select onValueChange={handleAddSphere}>
                    <SelectTrigger id="add-sphere">
                      <SelectValue placeholder="Select sphere to add..." />
                    </SelectTrigger>
                    <SelectContent>
                      {SPHERES.filter(s => !editingRote.spheres[s]).map((sphere) => (
                        <SelectItem key={sphere} value={sphere}>
                          {sphere}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Level */}
              <div className="space-y-2">
                <Label htmlFor="edit-level">Level</Label>
                <Select
                  value={editingRote.level}
                  onValueChange={(value) => setEditingRote({ ...editingRote, level: value })}
                >
                  <SelectTrigger id="edit-level">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Apprentice">Apprentice</SelectItem>
                    <SelectItem value="Disciple">Disciple</SelectItem>
                    <SelectItem value="Adept">Adept</SelectItem>
                    <SelectItem value="Master">Master</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Page Reference */}
              <div className="space-y-2">
                <Label htmlFor="edit-pageRef">Page Reference (Optional)</Label>
                <Input
                  id="edit-pageRef"
                  value={editingRote.pageRef}
                  onChange={(e) => setEditingRote({ ...editingRote, pageRef: e.target.value })}
                  placeholder="e.g., M20 p.123"
                />
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEditDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveEdit} disabled={isLoading}>
              {isLoading ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Rote?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete this rote. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => roteToDelete && handleDeleteRote(roteToDelete)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Delete All Confirmation Dialog */}
      <AlertDialog open={showDeleteAllDialog} onOpenChange={setShowDeleteAllDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete All Rotes?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete all {rotes.length} rotes in the database.
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteAll}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete All
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
