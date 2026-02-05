"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export function UserStats() {
  return (
    <div className="space-y-6">
      {/* Activaciones / Verificaciones */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-900">Activaciones / Verificaciones</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-bivoo-gray">Empresa:</span>
            <Badge className="bg-green-100 text-green-800">Verificada</Badge>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-bivoo-gray">Activa hace:</span>
            <span className="text-sm font-medium">48 Días</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-bivoo-gray">Página Web:</span>
            <Badge variant="destructive">No Activa</Badge>
          </div>
        </CardContent>
      </Card>

      {/* Usuarios Registrados */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-900">Usuarios Registrados</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-bivoo-gray">Administradores:</span>
             <Badge className="bg-blue-100 text-purple-600">1</Badge>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-bivoo-gray">Colaboradores:</span>
             <Badge className="bg-blue-100 text-blue-600">5</Badge>
          </div>
          {/*<div className="flex items-center justify-between">
            <span className="text-sm text-bivoo-gray">Clientes:</span>
             <Badge className="bg-blue-100 text-green-600">12</Badge>
          </div>*/}
        </CardContent>
      </Card>
    </div>
  )
}
