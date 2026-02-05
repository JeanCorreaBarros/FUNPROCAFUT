"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart3, TrendingUp, DollarSign } from "lucide-react"

export function ReportesCharts() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-gray-900">Análisis de Ventas</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <BarChart3 size={32} className="mx-auto mb-2 text-blue-600" />
              <p className="text-2xl font-bold text-gray-900">$24,500</p>
              <p className="text-sm text-bivoo-gray">Ventas del Mes</p>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <TrendingUp size={32} className="mx-auto mb-2 text-green-600" />
              <p className="text-2xl font-bold text-gray-900">+18%</p>
              <p className="text-sm text-bivoo-gray">Crecimiento</p>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <DollarSign size={32} className="mx-auto mb-2 text-purple-600" />
              <p className="text-2xl font-bold text-gray-900">$1,850</p>
              <p className="text-sm text-bivoo-gray">Promedio Diario</p>
            </div>
          </div>

          <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
            <div className="text-center text-bivoo-gray">
              <BarChart3 size={48} className="mx-auto mb-2 opacity-50" />
              <p>Gráfico de ventas</p>
              <p className="text-sm">Los datos se cargarán aquí</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
