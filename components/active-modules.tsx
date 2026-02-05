"use client"

import { Calendar, Settings, Shield, BarChart3, FileText, Package, Calculator, Users, Megaphone, CheckSquare } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/hooks/use-auth"
import { useRouter } from "next/navigation"

export function ActiveModules() {
  const { user } = useAuth()
  const router = useRouter()

  const allModules = [
    {
      key: 'agenda',
      icon: Calendar,
      title: "Agendas y Citas",
      description: "Calendario y gestión de citas",
    },
    {
      key: 'configuracion',
      icon: Settings,
      title: "Configuración",
      description: "Configuraciones Generales",
    },
    {
      key: 'facturacion',
      icon: FileText,
      title: "Facturación",
      description: "Gestión de facturas y pagos",
    },
    {
      key: 'inventarios',
      icon: Package,
      title: "Inventarios",
      description: "Control de stock y productos",
    },
    {
      key: 'reportes',
      icon: BarChart3,
      title: "Reportes",
      description: "Reportes e Información",
    },
    {
      key: 'contabilidad',
      icon: Calculator,
      title: "Contabilidad",
      description: "Gestión financiera",
    },
    {
      key: 'nomina',
      icon: Users,
      title: "Nómina",
      description: "Gestión de empleados y salarios",
    },
    {
      key: 'marketing',
      icon: Megaphone,
      title: "Marketing",
      description: "Campañas y promociones",
    },
    {
      key: 'seguridad',
      icon: Shield,
      title: "Seguridad",
      description: "Gestión de Procesos",
    },
    {
      key: 'vote',
      icon: CheckSquare,
      title: "Votaciones",
      description: "Sistema de votaciones",
    },
  ]

  const activeModules = allModules.filter(module =>
    user?.permissions?.some(perm => perm.startsWith(module.key + '.'))
  )

  const inactiveModules = allModules.filter(module =>
    !user?.permissions?.some(perm => perm.startsWith(module.key + '.'))
  )

  const handleActivateClick = () => {
    router.push("/planes")
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-gray-900 flex items-center">
          Módulos Disponibles
          <span className="ml-2 text-sm text-bivoo-gray">ⓘ</span>
        </CardTitle>
        <p className="text-sm text-bivoo-gray">Módulos Activos: {activeModules.length} | Total: {allModules.length}</p>
      </CardHeader>
      <CardContent className="space-y-4 max-h-80 overflow-y-auto">
        {/* Active Modules */}
        {activeModules.map((module, index) => (
          <div key={`active-${index}`} className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
            <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
              <module.icon size={20} className="text-blue-600" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <h3 className="font-medium text-gray-900 truncate">{module.title}</h3>
                <Badge variant="secondary" className="bg-blue-100 text-blue-800 text-xs">
                  Activo
                </Badge>
              </div>
              <p className="text-sm text-bivoo-gray truncate">{module.description}</p>
            </div>
          </div>
        ))}

        {/* Inactive Modules */}
        {inactiveModules.map((module, index) => (
          <div 
            key={`inactive-${index}`} 
            className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
            onClick={handleActivateClick}
          >
            <div className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center">
              <module.icon size={20} className="text-purple-600" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <h3 className="font-medium text-gray-900 truncate">{module.title}</h3>
                <Badge variant="secondary" className="bg-purple-100 text-purple-800 text-xs">
                  Activar Módulo
                </Badge>
              </div>
              <p className="text-sm text-bivoo-gray truncate">{module.description}</p>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
