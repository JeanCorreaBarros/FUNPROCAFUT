"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"

export function ContabilidadMovimientos() {
  const movimientos = [
    { fecha: "15 Jun", concepto: "Venta de servicios", monto: "+$450", tipo: "ingreso" },
    { fecha: "15 Jun", concepto: "Compra de productos", monto: "-$120", tipo: "gasto" },
    { fecha: "14 Jun", concepto: "Pago de servicios", monto: "-$85", tipo: "gasto" },
    { fecha: "14 Jun", concepto: "Venta de servicios", monto: "+$320", tipo: "ingreso" },
  ]

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold text-gray-900">Movimientos Recientes</CardTitle>
          <Button size="sm" className="bg-bivoo-purple hover:bg-bivoo-purple-dark text-white">
            <Plus size={16} className="mr-1" />
            Nuevo
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {movimientos.map((movimiento, index) => (
          <div key={index} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
            <div>
              <p className="font-medium text-gray-900">{movimiento.concepto}</p>
              <p className="text-sm text-bivoo-gray">{movimiento.fecha}</p>
            </div>
            <span className={`font-bold ${movimiento.tipo === "ingreso" ? "text-green-600" : "text-red-600"}`}>
              {movimiento.monto}
            </span>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
