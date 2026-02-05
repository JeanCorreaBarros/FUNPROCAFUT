"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Clock } from "lucide-react"

export function SeguridadLogs() {
  const logs = [
    { usuario: "Admin Principal", accion: "Inicio de sesión", tiempo: "hace 5 min", tipo: "info" },
    { usuario: "María García", accion: "Modificó configuración", tiempo: "hace 15 min", tipo: "warning" },
    { usuario: "Juan Pérez", accion: "Acceso a reportes", tiempo: "hace 30 min", tipo: "info" },
    { usuario: "Sistema", accion: "Backup automático", tiempo: "hace 1 hora", tipo: "success" },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-gray-900">Registro de Actividad</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {logs.map((log, index) => (
          <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
            <div
              className={`w-2 h-2 rounded-full ${
                log.tipo === "info" ? "bg-blue-500" : log.tipo === "warning" ? "bg-orange-500" : "bg-green-500"
              }`}
            ></div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <p className="font-medium text-gray-900">{log.usuario}</p>
                <div className="flex items-center space-x-1 text-xs text-bivoo-gray">
                  <Clock size={12} />
                  <span>{log.tiempo}</span>
                </div>
              </div>
              <p className="text-sm text-bivoo-gray">{log.accion}</p>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
