"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"

export function ConfiguracionUsuarios() {
  const users = [
    { name: "Admin Principal", role: "Administrador", status: "Activo", avatar: "A" },
    { name: "Zenisuk Katori", role: "Administrador", status: "Activo", avatar: "Z" },
    { name: "María García", role: "Colaborador", status: "Activo", avatar: "M" },
    { name: "Juan Pérez", role: "Colaborador", status: "Inactivo", avatar: "J" },
  ]

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold text-gray-900">Usuarios del Sistema</CardTitle>
          <Button size="sm" className="bg-bivoo-purple hover:bg-bivoo-purple-dark text-white">
            <Plus size={16} className="mr-1" />
            Agregar
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {users.map((user, index) => (
          <div key={index} className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
            <div className="w-10 h-10 bg-bivoo-purple rounded-full flex items-center justify-center">
              <span className="text-white font-medium text-sm">{user.avatar}</span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <h3 className="font-medium text-gray-900 truncate">{user.name}</h3>
                <span
                  className={`text-xs px-2 py-1 rounded-full ${
                    user.status === "Activo" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {user.status}
                </span>
              </div>
              <p className="text-sm text-bivoo-gray truncate">{user.role}</p>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
