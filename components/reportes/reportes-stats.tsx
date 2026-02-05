"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function ReportesStats() {
  const reportes = [
    { nombre: "Ventas Mensuales", fecha: "15 Jun 2025", estado: "Generado" },
    { nombre: "Clientes Activos", fecha: "14 Jun 2025", estado: "Generado" },
    { nombre: "Inventario", fecha: "13 Jun 2025", estado: "Pendiente" },
    { nombre: "Financiero", fecha: "12 Jun 2025", estado: "Generado" },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-gray-900">Reportes Recientes</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {reportes.map((reporte, index) => (
          <div key={index} className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-medium text-gray-900">{reporte.nombre}</h3>
              <span
                className={`text-xs px-2 py-1 rounded-full ${
                  reporte.estado === "Generado" ? "bg-green-100 text-green-800" : "bg-orange-100 text-orange-800"
                }`}
              >
                {reporte.estado}
              </span>
            </div>
            <p className="text-sm text-bivoo-gray">{reporte.fecha}</p>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
