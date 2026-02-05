"use client"

import { Card, CardContent } from "@/components/ui/card"
import { User, Bell, Shield, HelpCircle, LogOut } from "lucide-react"
import { useAuth } from "@/hooks/use-auth"

export function MobileConfiguracion() {
  const { user, logout } = useAuth()

  const settingsItems = [
    {
      icon: User,
      title: "Perfil",
      description: "Editar información personal",
      action: () => {},
    },
    {
      icon: Bell,
      title: "Notificaciones",
      description: "Configurar alertas y recordatorios",
      action: () => {},
    },
    {
      icon: Shield,
      title: "Privacidad",
      description: "Configuración de seguridad",
      action: () => {},
    },
    {
      icon: HelpCircle,
      title: "Ayuda",
      description: "Soporte y preguntas frecuentes",
      action: () => {},
    },
  ]

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Configuración</h1>

      {/* User Profile */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center space-x-3">
            <div className="w-16 h-16 bg-bivoo-purple text-white rounded-full flex items-center justify-center text-xl font-bold">
              {user?.avatar || user?.name?.charAt(0) || "U"}
            </div>
            <div>
              <h2 className="font-semibold text-gray-900">{user?.name}</h2>
              <p className="text-sm text-gray-600">{user?.email}</p>
              <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Settings Options */}
      <div className="space-y-3">
        {settingsItems.map((item, index) => (
          <Card key={index}>
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                  <item.icon size={20} className="text-gray-600" />
                </div>
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900">{item.title}</h3>
                  <p className="text-sm text-gray-600">{item.description}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Logout */}
      <Card>
        <CardContent className="p-4">
          <button onClick={logout} className="flex items-center space-x-3 w-full text-left">
            <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
              <LogOut size={20} className="text-red-600" />
            </div>
            <div>
              <h3 className="font-medium text-red-600">Cerrar Sesión</h3>
              <p className="text-sm text-gray-600">Salir de la aplicación</p>
            </div>
          </button>
        </CardContent>
      </Card>
    </div>
  )
}
