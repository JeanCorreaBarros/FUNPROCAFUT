"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Settings, Users, Shield, FileText } from "lucide-react"

export function ConfiguracionGeneral() {
  const configItems = [
    {
      icon: Settings,
      title: "Configuración General",
      description: "Ajustes básicos del sistema",
      status: "Configurado",
    },
    {
      icon: Users,
      title: "Gestión de Usuarios",
      description: "Administrar usuarios y roles",
      status: "Activo",
    },
    {
      icon: Shield,
      title: "Permisos y Seguridad",
      description: "Control de acceso y permisos",
      status: "Configurado",
    },
    {
      icon: FileText,
      title: "Plantillas",
      description: "Plantillas de documentos",
      status: "Pendiente",
    },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-gray-900">Módulos de Configuración</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {configItems.map((item, index) => (
          <div
            key={index}
            className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
          >
            <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
              <item.icon size={20} className="text-blue-600" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <h3 className="font-medium text-gray-900 truncate">{item.title}</h3>
                <span
                  className={`text-xs px-2 py-1 rounded-full ${
                    item.status === "Configurado"
                      ? "bg-green-100 text-green-800"
                      : item.status === "Activo"
                        ? "bg-blue-100 text-blue-800"
                        : "bg-orange-100 text-orange-800"
                  }`}
                >
                  {item.status}
                </span>
              </div>
              <p className="text-sm text-bivoo-gray truncate">{item.description}</p>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
