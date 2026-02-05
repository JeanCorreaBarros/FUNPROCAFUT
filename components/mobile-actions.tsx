"use client"

import { ArrowUp, Plus, ArrowDown, MoreHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"

export function MobileActions() {
  const actions = [
    { icon: ArrowUp, label: "Send", color: "bg-gray-100" },
    { icon: Plus, label: "Add funds", color: "bg-gray-100" },
    { icon: ArrowDown, label: "Request", color: "bg-gray-100" },
    { icon: MoreHorizontal, label: "More", color: "bg-gray-100" },
  ]

  return (
    <div className="grid grid-cols-4 gap-4">
      {actions.map((action, index) => (
        <Button
          key={index}
          variant="ghost"
          className="flex flex-col items-center p-4 h-auto bg-white hover:bg-gray-50 border-0 shadow-sm"
        >
          <div className={`w-12 h-12 ${action.color} rounded-full flex items-center justify-center mb-2`}>
            <action.icon size={20} className="text-gray-600" />
          </div>
          <span className="text-sm text-gray-600">{action.label}</span>
        </Button>
      ))}
    </div>
  )
}
