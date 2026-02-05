"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp, TrendingDown } from "lucide-react"

export function ContabilidadBalance() {
  const balanceItems = [
    { concepto: "Ingresos", monto: "$52,450", tipo: "ingreso" },
    { concepto: "Gastos Operativos", monto: "$18,200", tipo: "gasto" },
    { concepto: "Impuestos", monto: "$3,450", tipo: "gasto" },
    { concepto: "Utilidad Neta", monto: "$30,800", tipo: "ingreso" },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-gray-900">Balance General</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {balanceItems.map((item, index) => (
          <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-3">
              {item.tipo === "ingreso" ? (
                <TrendingUp size={20} className="text-green-600" />
              ) : (
                <TrendingDown size={20} className="text-red-600" />
              )}
              <span className="font-medium text-gray-900">{item.concepto}</span>
            </div>
            <span className={`font-bold ${item.tipo === "ingreso" ? "text-green-600" : "text-red-600"}`}>
              {item.monto}
            </span>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
