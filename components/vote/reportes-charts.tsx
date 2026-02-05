"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart3, Users, CheckCircle } from "lucide-react"

export function ReportesCharts() {
  // Ejemplo de datos de votaciones
  const totalVotos = 120;
  const participacionUsuarios = 75; // %
  const usuariosActivos = 90;
  const opcionMasVotada = "Opción A";
  const porcentajeOpcionMasVotada = 45;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-gray-900">Análisis de Votaciones</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <BarChart3 size={32} className="mx-auto mb-2 text-blue-600" />
              <p className="text-2xl font-bold text-gray-900">{totalVotos}</p>
              <p className="text-sm text-bivoo-gray">Total de Votos</p>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <Users size={32} className="mx-auto mb-2 text-green-600" />
              <p className="text-2xl font-bold text-gray-900">{participacionUsuarios}%</p>
              <p className="text-sm text-bivoo-gray">Participación de Usuarios</p>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <CheckCircle size={32} className="mx-auto mb-2 text-purple-600" />
              <p className="text-2xl font-bold text-gray-900">{usuariosActivos}</p>
              <p className="text-sm text-bivoo-gray">Usuarios Activos</p>
            </div>
          </div>

          <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
            <div className="text-center text-bivoo-gray">
              <BarChart3 size={48} className="mx-auto mb-2 opacity-50" />
              <p className="font-bold text-gray-900">Opción más votada: {opcionMasVotada}</p>
              <p className="text-sm">{porcentajeOpcionMasVotada}% del total de votos</p>
              <p className="text-sm mt-2">Próximamente: gráfico de distribución de votos</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}