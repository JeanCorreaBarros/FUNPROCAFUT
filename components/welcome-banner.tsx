"use client"

import { useAuth } from "@/hooks/use-auth"

export function WelcomeBanner() {
  const { user } = useAuth()

  // Calculate active modules based on permissions
  const activeModules = user?.permissions
    ? new Set(user.permissions.map(perm => perm.split('.')[0])).size
    : 0

  return (
    <div className="relative overflow-hidden rounded-2xl bg-blue-500 p-6 md:p-8 text-white">
      <div className="relative z-10">
        <h1 className="text-2xl md:text-3xl font-bold mb-2 text-balance">¡Bienvenido, {user?.name || "Usuario"}!</h1>
        <p className="text-white/90 mb-6 max-w-2xl text-pretty">
          Tu dashboard está funcionando perfectamente. Aquí tienes un resumen de hoy.
        </p>

        <div className="flex flex-wrap gap-6 text-sm">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span>Plan Activo: Basic</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span>Módulos Activos: {activeModules}</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span>Última actualización: 01 Enero 2026</span>
          </div>
        </div>
      </div>

      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-32 h-32 md:w-48 md:h-48 opacity-20 animate-pulse">
        <div className="w-full h-full bg-white rounded-full flex items-center justify-center">
          <span className="text-4xl md:text-6xl font-bold text-bivoo-purple">F</span>
        </div>
      </div>
    </div>
  )
}
