"use client"

import { Eye } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

export function MobileAccountBalance() {
  return (
    <Card className="bg-white border-0 shadow-sm">
      <CardContent className="p-6 text-center">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-gray-500">Account balance</span>
          <Eye size={16} className="text-gray-400" />
        </div>

        <div className="mb-4">
          <h2 className="text-3xl font-bold text-gray-900">
            $34,567<span className="text-gray-400">.90</span>
          </h2>
          <p className="text-sm text-gray-500 flex items-center justify-center mt-1">
            <span className="mr-1">🔄</span>
            1289440585
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
