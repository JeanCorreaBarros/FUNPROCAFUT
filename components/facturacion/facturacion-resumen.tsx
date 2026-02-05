"use client"

import { Card, CardContent } from "@/components/ui/card"
import { DollarSign, FileText, Users, TrendingUp } from "lucide-react"

export function FacturacionResumen() {
  const stats = [
    {
      icon: DollarSign,
      title: "Ingresos del Mes",
      value: "$12,450",
      change: "+15%",
      positive: true,
    },
    {
      icon: FileText,
      title: "Facturas Emitidas",
      value: "24",
      change: "+8%",
      positive: true,
    },
    {
      icon: Users,
      title: "Clientes Activos",
      value: "18",
      change: "+12%",
      positive: true,
    },
    {
      icon: TrendingUp,
      title: "Crecimiento",
      value: "23%",
      change: "+5%",
      positive: true,
    },
  ]

  return (
    <div className="space-y-4">
      {stats.map((stat, index) => (
        <Card key={index}>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                <stat.icon size={20} className="text-blue-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-bivoo-gray">{stat.title}</p>
                <div className="flex items-center space-x-2">
                  <span className="text-xl font-bold text-gray-900">{stat.value}</span>
                  <span
                    className={`text-xs px-2 py-1 rounded-full ${
                      stat.positive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                    }`}
                  >
                    {stat.change}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
