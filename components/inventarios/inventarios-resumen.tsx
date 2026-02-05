"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Package, AlertTriangle, TrendingUp, DollarSign } from "lucide-react"

export function InventariosResumen() {
  const stats = [
    {
      icon: Package,
      title: "Total Productos",
      value: "45",
      color: "blue",
    },
    {
      icon: AlertTriangle,
      title: "Bajo Stock",
      value: "3",
      color: "red",
    },
    {
      icon: TrendingUp,
      title: "Movimientos Hoy",
      value: "12",
      color: "green",
    },
    {
      icon: DollarSign,
      title: "Valor Inventario",
      value: "$8,450",
      color: "purple",
    },
  ]

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-900">Resumen de Inventario</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {stats.map((stat, index) => (
            <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
              <div
                className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                  stat.color === "blue"
                    ? "bg-blue-100 text-blue-600"
                    : stat.color === "red"
                      ? "bg-red-100 text-red-600"
                      : stat.color === "green"
                        ? "bg-green-100 text-green-600"
                        : "bg-purple-100 text-purple-600"
                }`}
              >
                <stat.icon size={20} />
              </div>
              <div className="flex-1">
                <p className="text-sm text-bivoo-gray">{stat.title}</p>
                <p className="text-xl font-bold text-gray-900">{stat.value}</p>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
