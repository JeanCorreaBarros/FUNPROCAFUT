"use client"

import { useState, useRef, useEffect } from "react"
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

interface ExpandableSearchProps {
  isExpanded: boolean
  onToggle: () => void
}

export function ExpandableSearch({ isExpanded, onToggle }: ExpandableSearchProps) {
  const [searchValue, setSearchValue] = useState("")
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (isExpanded && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isExpanded])

  return (
    <div className="relative flex items-center">
      <div
        className={`transition-all duration-300 ease-in-out ${
          isExpanded ? "w-64 opacity-100" : "w-0 opacity-0"
        } overflow-hidden`}
      >
        <Input
          ref={inputRef}
          type="search"
          placeholder="Buscar en Bivoo..."
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          className="w-full  h-9 border-gray-200 focus:border-bivoo-purple focus:ring-bivoo-purple transition-colors rounded-l-md rounded-r-none"
        />
      </div>

      <Button
        onClick={onToggle}
        variant="ghost"
        size="sm"
        className={`p-2 transition-all duration-300 ${
          isExpanded
            ? "bg-bivoo-purple text-white hover:bg-bivoo-purple-dark rounded-l-none rounded-r-md"
            : "hover:bg-gray-100 rounded-md"
        }`}
      >
        <Search size={18} />
      </Button>
    </div>
  )
}
