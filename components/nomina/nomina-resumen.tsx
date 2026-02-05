"use client"

import { Card, CardContent } from "@/components/ui/card"
import { DollarSign, Users, Calendar, TrendingUp } from "lucide-react"

export function NominaResumen() {
  const stats = [
    {
      icon: DollarSign,
      title: "Nómina Total",
      value: "$8,500",
      color: "green",
    },
    {
      icon: Users,
      title: "Empleados Activos",
      value: "5",
      color: "blue",
    },
    {
      icon: Calendar,
      title: "Días hasta Pago",
      value: "15",
      color: "orange",
    },
    {
      icon: TrendingUp,
      title: "Costo Promedio",
      value: "$1,700",
      color: "purple",
    },
  ]

  return (
    <div className="space-y-4">
      {stats.map((stat, index) => (
        <Card key={index}>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div
                className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                  stat.color === "green"
                    ? "bg-green-100 text-green-600"
                    : stat.color === "blue"
                      ? "bg-blue-100 text-blue-600"
                      : stat.color === "orange"
                        ? "bg-orange-100 text-orange-600"
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
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
