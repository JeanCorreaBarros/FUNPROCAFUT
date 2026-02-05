"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, TrendingUp } from "lucide-react"

export function MarketingCampanas() {
  const campanas = [
    { nombre: "Promoción Verano", estado: "Activa", alcance: "1,250", conversion: "15.2%" },
    { nombre: "Descuento Nuevos Clientes", estado: "Activa", alcance: "850", conversion: "8.7%" },
    { nombre: "Servicios Premium", estado: "Pausada", alcance: "350", conversion: "22.1%" },
  ]

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold text-gray-900">Campañas de Marketing</CardTitle>
          <Button size="sm" className="bg-bivoo-purple hover:bg-bivoo-purple-dark text-white">
            <Plus size={16} className="mr-1" />
            Nueva Campaña
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {campanas.map((campana, index) => (
          <div key={index} className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-medium text-gray-900">{campana.nombre}</h3>
              <span
                className={`text-xs px-2 py-1 rounded-full ${
                  campana.estado === "Activa" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
                }`}
              >
                {campana.estado}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-bivoo-gray">Alcance</p>
                <p className="font-medium text-gray-900">{campana.alcance} personas</p>
              </div>
              <div>
                <p className="text-bivoo-gray">Conversión</p>
                <div className="flex items-center space-x-1">
                  <p className="font-medium text-gray-900">{campana.conversion}</p>
                  <TrendingUp size={14} className="text-green-600" />
                </div>
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
