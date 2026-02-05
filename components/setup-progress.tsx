"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useAuth } from "@/hooks/use-auth"
import { useRouter } from "next/navigation"

export function SetupProgress() {
  const { user } = useAuth()
  const router = useRouter()

  // Get active modules
  const allModules = [
    { key: 'agenda', title: "Agenda", path: "/agenda" },
    { key: 'configuracion', title: "Configuración", path: "/configuracion" },
    { key: 'facturacion', title: "Facturación", path: "/facturacion" },
    { key: 'inventarios', title: "Inventarios", path: "/inventarios" },
    { key: 'reportes', title: "Reportes", path: "/reportes" },
    { key: 'contabilidad', title: "Contabilidad", path: "/contabilidad" },
    { key: 'nomina', title: "Nómina", path: "/nomina" },
    { key: 'marketing', title: "Marketing", path: "/marketing" },
    { key: 'seguridad', title: "Seguridad", path: "/seguridad" },
    { key: 'vote', title: "Votaciones", path: "/vote" },
  ]

  const activeModules = allModules.filter(module =>
    user?.permissions?.some(perm => perm.startsWith(module.key + '.'))
  )

  const [loadedSteps, setLoadedSteps] = useState(0)

  const handleStepClick = (index: number) => {
    if (index === loadedSteps) {
      router.push(activeModules[index].path)
      setLoadedSteps(prev => prev + 1)
    }
  }

  // Obtener nombre de la compañía desde localStorage
  let companyName = "";
  if (typeof window !== "undefined") {
    try {
      const userData = localStorage.getItem("bivoo-user");
      if (userData) {
        const user = JSON.parse(userData);
        companyName = user.company || "";
      }
    } catch (e) {
      companyName = "";
    }
  }

  const progressPercentage = activeModules.length > 0 ? (loadedSteps / activeModules.length) * 100 : 0

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-gray-900">{companyName || "Nombre de la empresa"}</CardTitle>
        <p className="text-sm text-bivoo-gray">Pasos Pendientes</p>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between mb-4 overflow-x-auto scrollbar-hide space-x-4">
          {activeModules.map((module, index) => (
            <div 
              key={index} 
              className={`flex flex-col items-center transition-all duration-500 cursor-pointer ${index >= loadedSteps ? 'opacity-50 scale-75' : 'opacity-100 scale-100'}`}
              onClick={() => handleStepClick(index)}
            >
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-500 ${
                  index < loadedSteps
                    ? "bg-blue-500 text-white"
                    : index === loadedSteps
                      ? "bg-blue-100 text-blue-600 border-2 border-blue-500 hover:bg-blue-200"
                      : "bg-gray-100 text-gray-400"
                }`}
              >
                {index + 1}
              </div>
              <span className="text-xs text-bivoo-gray mt-2 text-center whitespace-nowrap">{module.title}</span>
            </div>
          ))}
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div className="bg-blue-500 h-2 rounded-full transition-all duration-1000" style={{ width: `${progressPercentage}%` }}></div>
        </div>
      </CardContent>
    </Card>
  )
}
