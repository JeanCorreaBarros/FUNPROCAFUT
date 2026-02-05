"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Shield, Users, Settings, Eye } from "lucide-react"

export function SeguridadPermisos() {
  const permisos = [
    { rol: "Administrador", usuarios: 2, permisos: "Todos", icon: Shield },
    { rol: "Colaborador", usuarios: 3, permisos: "Limitados", icon: Users },
    { rol: "Recepcionista", usuarios: 1, permisos: "Básicos", icon: Settings },
    { rol: "Auditor", usuarios: 1, permisos: "Solo lectura", icon: Eye },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-gray-900">Roles y Permisos</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {permisos.map((permiso, index) => (
          <div key={index} className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg">
            <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
              <permiso.icon size={20} className="text-blue-600" />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <h3 className="font-medium text-gray-900">{permiso.rol}</h3>
                <span className="text-sm text-bivoo-gray">{permiso.usuarios} usuarios</span>
              </div>
              <p className="text-sm text-bivoo-gray">Permisos: {permiso.permisos}</p>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
