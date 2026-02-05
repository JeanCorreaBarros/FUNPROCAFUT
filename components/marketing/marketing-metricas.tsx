"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Eye, Users, MousePointer, TrendingUp } from "lucide-react"

export function MarketingMetricas() {
  const metricas = [
    {
      icon: Eye,
      title: "Impresiones",
      value: "12,450",
      change: "+18%",
      positive: true,
    },
    {
      icon: Users,
      title: "Alcance",
      value: "2,450",
      change: "+12%",
      positive: true,
    },
    {
      icon: MousePointer,
      title: "Clics",
      value: "340",
      change: "+25%",
      positive: true,
    },
    {
      icon: TrendingUp,
      title: "Conversiones",
      value: "42",
      change: "+8%",
      positive: true,
    },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-gray-900">Métricas de Rendimiento</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {metricas.map((metrica, index) => (
          <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <metrica.icon size={20} className="text-blue-600" />
            </div>
            <div className="flex-1">
              <p className="text-sm text-bivoo-gray">{metrica.title}</p>
              <div className="flex items-center space-x-2">
                <span className="text-xl font-bold text-gray-900">{metrica.value}</span>
                <span
                  className={`text-xs px-2 py-1 rounded-full ${
                    metrica.positive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                  }`}
                >
                  {metrica.change}
                </span>
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
