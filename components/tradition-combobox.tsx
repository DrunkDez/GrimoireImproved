"use client"

import * as React from "react"
import { Check, ChevronsUpDown } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { TRADITION_CATEGORIES } from "./tradition-list"

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

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between h-11"
        >
          {value || placeholder}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0" align="start">
        <Command>
          <CommandInput placeholder="Search traditions..." />
          <CommandEmpty>No tradition found.</CommandEmpty>
          <div className="max-h-[400px] overflow-y-auto">
            {Object.entries(TRADITION_CATEGORIES).map(([key, category]) => (
              <CommandGroup key={key} heading={category.label}>
                {category.groups.map((tradition) => (
                  <CommandItem
                    key={tradition}
                    value={tradition}
                    onSelect={(currentValue) => {
                      onValueChange(currentValue === value ? "" : currentValue)
                      setOpen(false)
                    }}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        value === tradition ? "opacity-100" : "opacity-0"
                      )}
                    />
                    {tradition}
                  </CommandItem>
                ))}
              </CommandGroup>
            ))}
          </div>
        </Command>
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
  
  // Flatten all traditions
  const allTraditions = Object.values(TRADITION_CATEGORIES)
    .flatMap(cat => cat.groups)
    .sort()

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
      <PopoverContent className="w-full p-0" align="start">
        <Command>
          <CommandInput placeholder="Search..." />
          <CommandEmpty>No tradition found.</CommandEmpty>
          <div className="max-h-[300px] overflow-y-auto">
            <CommandGroup>
              {allTraditions.map((tradition) => (
                <CommandItem
                  key={tradition}
                  value={tradition}
                  onSelect={(currentValue) => {
                    onValueChange(currentValue === value ? "" : currentValue)
                    setOpen(false)
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === tradition ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {tradition}
                </CommandItem>
              ))}
            </CommandGroup>
          </div>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
