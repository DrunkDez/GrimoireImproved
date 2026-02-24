"use client"

import * as React from "react"
import { Check, ChevronsUpDown, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { TRADITION_CATEGORIES } from "@/lib/tradition-list"

interface TraditionComboboxProps {
  value: string
  onValueChange: (value: string) => void
  placeholder?: string
}

export function TraditionCombobox({
  value,
  onValueChange,
  placeholder = "Select tradition..."
}: TraditionComboboxProps) {
  const [open, setOpen] = React.useState(false)
  const [search, setSearch] = React.useState("")

  // Flatten and filter traditions based on search
  const filteredCategories = React.useMemo(() => {
    if (!search) return TRADITION_CATEGORIES

    const searchLower = search.toLowerCase()
    const filtered: typeof TRADITION_CATEGORIES = {}

    Object.entries(TRADITION_CATEGORIES).forEach(([key, category]) => {
      const matchingGroups = category.groups.filter(group =>
        group.toLowerCase().includes(searchLower)
      )
      if (matchingGroups.length > 0) {
        filtered[key] = {
          label: category.label,
          groups: matchingGroups
        }
      }
    })

    return filtered
  }, [search])

  const handleSelect = (tradition: string) => {
    onValueChange(tradition === value ? "" : tradition)
    setOpen(false)
    setSearch("")
  }

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation()
    onValueChange("")
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between h-11 font-normal"
        >
          <span className={cn(!value && "text-muted-foreground")}>
            {value || placeholder}
          </span>
          <div className="flex items-center gap-1">
            {value && (
              <X
                className="h-4 w-4 shrink-0 opacity-50 hover:opacity-100"
                onClick={handleClear}
              />
            )}
            <ChevronsUpDown className="h-4 w-4 shrink-0 opacity-50" />
          </div>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0" align="start">
        <div className="p-2 border-b">
          <Input
            placeholder="Search traditions..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-9"
          />
        </div>
        <ScrollArea className="h-[300px]">
          <div className="p-2">
            {Object.keys(filteredCategories).length === 0 ? (
              <div className="py-6 text-center text-sm text-muted-foreground">
                No tradition found.
              </div>
            ) : (
              Object.entries(filteredCategories).map(([key, category]) => (
                <div key={key} className="mb-4 last:mb-0">
                  <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground">
                    {category.label}
                  </div>
                  <div className="space-y-1">
                    {category.groups.map((tradition) => (
                      <button
                        key={tradition}
                        onClick={() => handleSelect(tradition)}
                        className={cn(
                          "w-full flex items-center gap-2 px-2 py-1.5 text-sm rounded-sm",
                          "hover:bg-accent hover:text-accent-foreground",
                          "transition-colors cursor-pointer text-left",
                          value === tradition && "bg-accent"
                        )}
                      >
                        <Check
                          className={cn(
                            "h-4 w-4 shrink-0",
                            value === tradition ? "opacity-100" : "opacity-0"
                          )}
                        />
                        {tradition}
                      </button>
                    ))}
                  </div>
                </div>
              ))
            )}
          </div>
        </ScrollArea>
      </PopoverContent>
    </Popover>
  )
}

// Simpler version without categories (for filters)
export function TraditionComboboxSimple({
  value,
  onValueChange,
  placeholder = "All traditions"
}: TraditionComboboxProps) {
  const [open, setOpen] = React.useState(false)
  const [search, setSearch] = React.useState("")
  
  // Flatten all traditions
  const allTraditions = React.useMemo(() => 
    Object.values(TRADITION_CATEGORIES)
      .flatMap(cat => cat.groups)
      .sort()
  , [])

  const filteredTraditions = React.useMemo(() => {
    if (!search) return allTraditions
    const searchLower = search.toLowerCase()
    return allTraditions.filter(t => t.toLowerCase().includes(searchLower))
  }, [search, allTraditions])

  const handleSelect = (tradition: string) => {
    onValueChange(tradition === value ? "" : tradition)
    setOpen(false)
    setSearch("")
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
        >
          {value || placeholder}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0" align="start">
        <div className="p-2 border-b">
          <Input
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-9"
          />
        </div>
        <ScrollArea className="h-[300px]">
          <div className="p-2">
            {filteredTraditions.length === 0 ? (
              <div className="py-6 text-center text-sm text-muted-foreground">
                No tradition found.
              </div>
            ) : (
              <div className="space-y-1">
                {filteredTraditions.map((tradition) => (
                  <button
                    key={tradition}
                    onClick={() => handleSelect(tradition)}
                    className={cn(
                      "w-full flex items-center gap-2 px-2 py-1.5 text-sm rounded-sm",
                      "hover:bg-accent hover:text-accent-foreground",
                      "transition-colors cursor-pointer text-left",
                      value === tradition && "bg-accent"
                    )}
                  >
                    <Check
                      className={cn(
                        "h-4 w-4 shrink-0",
                        value === tradition ? "opacity-100" : "opacity-0"
                      )}
                    />
                    {tradition}
                  </button>
                ))}
              </div>
            )}
          </div>
        </ScrollArea>
      </PopoverContent>
    </Popover>
  )
}
