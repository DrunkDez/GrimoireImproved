# 🔧 Integrating Admin Panels (Optional Enhancement)

If you want to add the Merits and Resources management to your existing admin panel, here's how:

---

## Current Admin Panel Structure

Your admin panel likely has a tabbed interface for managing rotes. We can add two more tabs for Merits and Resources.

---

## Quick Integration Example

If your admin panel uses tabs, add these:

```typescript
import { AdminMeritsPanel } from "@/components/admin/admin-merits-panel"
import { AdminResourcesPanel } from "@/components/admin/admin-resources-panel"

// In your admin panel component, add new tab options:
const tabs = [
  { id: "rotes", label: "Rotes" },
  { id: "merits", label: "Merits & Flaws" },      // NEW
  { id: "resources", label: "Resources" },        // NEW
]

// In your render:
{activeTab === "merits" && <AdminMeritsPanel />}
{activeTab === "resources" && <AdminResourcesPanel />}
```

---

## Full Example Admin Panel

```typescript
"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AdminRotesPanel } from "@/components/admin/admin-rotes-panel" // Your existing rotes panel
import { AdminMeritsPanel } from "@/components/admin/admin-merits-panel"
import { AdminResourcesPanel } from "@/components/admin/admin-resources-panel"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"

interface AdminPanelProps {
  rotes: any[]
  onRotesChange: () => void
  onClose: () => void
}

export function AdminPanel({ rotes, onRotesChange, onClose }: AdminPanelProps) {
  return (
    <div className="p-6 md:p-10">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-cinzel font-bold text-primary">
          Admin Panel
        </h1>
        <Button variant="outline" onClick={onClose} className="gap-2">
          <X className="w-4 h-4" />
          Close Admin
        </Button>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="rotes" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="rotes">Rotes</TabsTrigger>
          <TabsTrigger value="merits">Merits & Flaws</TabsTrigger>
          <TabsTrigger value="resources">Resources</TabsTrigger>
        </TabsList>

        <TabsContent value="rotes">
          <AdminRotesPanel 
            rotes={rotes} 
            onRotesChange={onRotesChange} 
          />
        </TabsContent>

        <TabsContent value="merits">
          <AdminMeritsPanel />
        </TabsContent>

        <TabsContent value="resources">
          <AdminResourcesPanel />
        </TabsContent>
      </Tabs>
    </div>
  )
}
```

---

## Alternative: Separate Admin Pages

If you prefer, you can create separate admin pages:

```
app/admin/merits/page.tsx
app/admin/resources/page.tsx
```

Then link to them from your main admin panel:

```typescript
<Link href="/admin/merits">
  <Button>Manage Merits & Flaws</Button>
</Link>
<Link href="/admin/resources">
  <Button>Manage Resources</Button>
</Link>
```

---

## The Components Are Ready!

The `AdminMeritsPanel` and `AdminResourcesPanel` components are complete and ready to drop in. They handle:

✅ Listing all items
✅ Adding new items
✅ Editing existing items
✅ Deleting items
✅ Form validation
✅ Toast notifications
✅ Grimoire styling

Just import and use them wherever you want!

---

**Choose whichever integration method works best for your current setup!**
