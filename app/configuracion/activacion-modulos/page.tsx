"use client"

import { useState, useEffect } from "react"
import { AuthGuard } from "@/components/auth-guard"
import { ModuleLayout } from "@/components/module-layout"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Check, Loader, X } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import hotToast from "react-hot-toast"
import { getTenantIdFromToken } from "@/lib/jwt"

interface Module {
  id: string
  name: string
  displayName: string
  description: string
  createdAt?: string
  enabled: boolean
}

const API_BASE = "http://localhost:3000/api/master"

// Función para obtener el token
const getToken = (): string | null => {
  return sessionStorage.getItem("TKV");
};

// Módulos disponibles para crear
const AVAILABLE_MODULES = [
  {
    name: "agenda",
    displayName: "Agenda",
    description: "Módulo de gestión de Agenda",
  },
  {
    name: "invoices",
    displayName: "Facturación estándar",
    description: "Módulo de Facturación",
  },
  {
    name: "inventarios",
    displayName: "Inventarios",
    description: "Módulo de gestión de Inventarios",
  },
  {
    name: "reportes",
    displayName: "Reportes",
    description: "Módulo de Reportes y análisis",
  },
  {
    name: "contabilidad",
    displayName: "Contabilidad",
    description: "Módulo de Contabilidad",
  },
  {
    name: "nomina",
    displayName: "Nómina",
    description: "Módulo de gestión de Nómina",
  },
  {
    name: "marketing",
    displayName: "Marketing",
    description: "Módulo de Marketing",
  },
  {
    name: "seguridad",
    displayName: "Seguridad",
    description: "Módulo de Seguridad",
  },
]

export default function ActivacionModulosPage() {
  const { addToast } = useToast()
  const [allModules, setAllModules] = useState<Module[]>([])
  const [activeModules, setActiveModules] = useState<Set<string>>(new Set()) // Módulos creados en el sistema
  const [enabledModules, setEnabledModules] = useState<Set<string>>(new Set()) // Módulos activados para el tenant
  const [loading, setLoading] = useState(true)
  const [loadingModules, setLoadingModules] = useState<Record<string, boolean>>({})
  const [tenantId, setTenantId] = useState<string | null>(null)

  // Obtener tenantId del token al montar el componente
  useEffect(() => {
    try {
      const tokenForTenant = getToken()
      const tId = getTenantIdFromToken(tokenForTenant)
      if (tId) setTenantId(tId)
      console.log("tenantId obtenido del token:", tId)
    } catch (e) {
      console.warn('No se pudo obtener tenantId del token', e)
    }
  }, [])

  // Load modules on mount
  useEffect(() => {
    if (tenantId) {
      loadModules()
    }
  }, [tenantId])
  const loadModules = async () => {
    try {
      setLoading(true)

      // Cargamos los módulos activados/instalados para este tenant
      const modulesData = await loadEnabledModules()

      // modulesData viene del endpoint tenant y puede contener objetos con la propiedad `module`
      const createdSet = new Set<string>()
      const modulesMap: Record<string, Module> = {}

      if (Array.isArray(modulesData)) {
        modulesData.forEach((item: any) => {
          const mod = item.module || item
          if (!mod || !mod.name) return

          // Si el módulo en el maestro está activo, lo consideramos "creado"
          if (mod.isActive === true) {
            createdSet.add(mod.name)
          }

          modulesMap[mod.name] = {
            id: mod.id,
            name: mod.name,
            displayName: mod.displayName,
            description: mod.description,
            createdAt: mod.createdAt,
            enabled: true,
          }
        })
      }

      setActiveModules(createdSet)

      // Combinar catálogo local con los módulos retornados por el tenant
      const combined = AVAILABLE_MODULES.map((avail) => {
        if (modulesMap[avail.name]) return modulesMap[avail.name]
        return {
          id: avail.name,
          name: avail.name,
          displayName: avail.displayName,
          description: avail.description,
          createdAt: undefined,
          enabled: enabledModules.has(avail.name),
        }
      })

      setAllModules(combined)
    } catch (error) {
      console.error("Error loading modules:", error)
      hotToast.error("No se pudieron cargar los módulos.")

      setAllModules(
        AVAILABLE_MODULES.map((m) => ({
          id: m.name,
          name: m.name,
          displayName: m.displayName,
          description: m.description,
          createdAt: undefined,
          enabled: false,
        }))
      )
    } finally {
      setLoading(false)
    }
  }

  const handleCreateModule = async (module: Module) => {
    try {
      setLoadingModules((prev) => ({ ...prev, [module.id]: true }))
      const token = getToken()

      const response = await fetch(`${API_BASE}/modules/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token && { "Authorization": `Bearer ${token}` }),
        },
        body: JSON.stringify({
          name: module.name,
          displayName: module.displayName,
          description: module.description,
        }),
      })

      if (!response.ok) {
        throw new Error("Error al crear el módulo")
      }

      const result = await response.json()

      // Al crear el módulo, activarlo inmediatamente para el tenant
      try {
        await handleEnableModule(module, true)
      } catch (e) {
        // manejar error de activación pero continuar
        console.error('Error al activar tras crear:', e)
      }

      // Forzar recarga de datos de las cards para sincronizar con servidor
      try {
        await loadModules()
      } catch (e) {
        console.warn('No se pudo recargar módulos tras crear:', e)
      }

      hotToast.success(`${module.displayName} ha sido creado y activado exitosamente.`)
    } catch (error) {
      console.error("Error creating module:", error)
      hotToast.error(`No se pudo crear el módulo ${module.displayName}.`)
    } finally {
      setLoadingModules((prev) => ({ ...prev, [module.id]: false }))
    }
  }

  // Cargar módulos activados para el tenant
  const loadEnabledModules = async () => {
    if (!tenantId) return
    
    try {
      const token = getToken()
      const response = await fetch(`${API_BASE}/tenants/${tenantId}/modules`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          ...(token && { "Authorization": `Bearer ${token}` }),
        },
      })

      if (!response.ok) {
        throw new Error("Error al cargar módulos activados")
      }

      const data = await response.json()
      const enabledSet = new Set<string>()
      const createdSet = new Set<string>()
      const modulesData = Array.isArray(data) ? data : (data.data || [])

      modulesData.forEach((item: any) => {
        const mod = item.module || item
        // item.isActive (fuera del `module`) indica si el módulo está activado para el tenant
        const tenantActive = item.isActive === true
        if (mod && mod.name) {
          if (tenantActive) {
            enabledSet.add(mod.name)
          }

          // mod.isActive indica si el módulo está creado/activo en el catálogo maestro
          if (mod.isActive === true) {
            createdSet.add(mod.name)
          }
        }
      })

      // Actualizar ambos sets para su uso en la UI
      setEnabledModules(enabledSet)
      setActiveModules(createdSet)

      // Retornar los datos para quien llame a esta función
      return modulesData
    } catch (error) {
      console.error("Error loading enabled modules:", error)
      return []
    }
  }

  const handleEnableModule = async (module: Module, enable: boolean) => {
    if (!tenantId) {
      hotToast.error("No se pudo obtener el identificador del inquilino")
      return
    }

    try {
      setLoadingModules((prev) => ({ ...prev, [module.id]: true }))
      const token = getToken()

      const action = enable ? 'enable' : 'disable'
      const response = await fetch(
        `${API_BASE}/tenants/${tenantId}/modules/${action}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...(token && { "Authorization": `Bearer ${token}` }),
          },
          body: JSON.stringify({
            moduleName: module.name,
          }),
        }
      )

      if (!response.ok) {
        throw new Error("Error al cambiar estado del módulo")
      }

      // Forzar recarga completa de las cards desde servidor para sincronizar estado
      try {
        await loadModules()
      } catch (e) {
        console.warn('No se pudo recargar módulos tras cambiar estado:', e)
      }

      const actionLabel = enable ? "habilitado" : "deshabilitado"
      hotToast.success(`${module.displayName} ha sido ${actionLabel} correctamente.`)
    } catch (error) {
      console.error("Error enabling/disabling module:", error)
      hotToast.error(`No se pudo cambiar el estado de ${module.displayName}.`)
    } finally {
      setLoadingModules((prev) => ({ ...prev, [module.id]: false }))
    }
  }

  const formatDate = (dateString?: string) => {
    if (!dateString) return ""
    const date = new Date(dateString)
    return date.toLocaleDateString("es-ES", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  if (loading) {
    return (
      <AuthGuard>
        <ModuleLayout moduleType="configuracion">
          <div className="flex items-center justify-center h-96">
            <div className="text-center">
              <Loader className="w-8 h-8 text-bivoo-purple animate-spin mx-auto mb-4" />
              <p className="text-gray-600">Cargando módulos...</p>
            </div>
          </div>
        </ModuleLayout>
      </AuthGuard>
    )
  }

  const enabledCount = enabledModules.size
  const totalCount = allModules.length

  return (
    <AuthGuard>
      <ModuleLayout moduleType="configuracion">
        <div className="space-y-6">
          {/* Header */}
          <div className="border-b border-gray-200 pb-6">
            <h1 className="text-3xl font-bold text-gray-900">Activación de Módulos</h1>
            <p className="text-gray-600 mt-2">
              Gestiona los módulos disponibles. Módulos activados: {enabledCount} de {totalCount}
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Módulos Activados</p>
                  <p className="text-2xl font-bold text-green-600 mt-1">{enabledCount}</p>
                </div>
                <Check className="w-8 h-8 text-green-500" />
              </div>
            </Card>
            <Card className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Módulos Creados</p>
                  <p className="text-2xl font-bold text-blue-600 mt-1">{activeModules.size}</p>
                </div>
                <Check className="w-8 h-8 text-blue-500" />
              </div>
            </Card>
            <Card className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Disponibles</p>
                  <p className="text-2xl font-bold text-bivoo-purple mt-1">{totalCount}</p>
                </div>
                <Loader className="w-8 h-8 text-bivoo-purple" />
              </div>
            </Card>
          </div>

          {/* Modules Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {allModules.map((module) => {
              const isCreated = activeModules.has(module.name)
              const isEnabled = enabledModules.has(module.name)

              return (
                <Card
                  key={module.id}
                  className={`p-4 transition-all border-2 ${
                    isEnabled
                      ? "border-green-300 bg-green-50"
                      : isCreated
                      ? "border-blue-300 bg-blue-50"
                      : "border-gray-200 bg-white"
                  }`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">
                        {module.displayName}
                      </h3>
                      <div className="flex items-center gap-2 mt-1">
                        {isEnabled ? (
                          <>
                            <Check className="w-4 h-4 text-green-600" />
                            <span className="text-xs font-medium text-green-600">
                              Activado
                            </span>
                          </>
                        ) : isCreated ? (
                          <>
                            <Check className="w-4 h-4 text-blue-600" />
                            <span className="text-xs font-medium text-blue-600">
                              Creado
                            </span>
                          </>
                        ) : (
                          <>
                            <X className="w-4 h-4 text-gray-600" />
                            <span className="text-xs font-medium text-gray-600">
                              No creado
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  <p className="text-sm text-gray-600 mb-4">{module.description}</p>

                  {module.createdAt && (
                    <div className="mb-4 pt-3 border-t border-gray-200">
                      <p className="text-xs text-gray-500">
                        <span className="font-medium">Creado:</span> {formatDate(module.createdAt)}
                      </p>
                    </div>
                  )}

                  <div className="flex gap-2">
                    {isEnabled ? (
                      <Button
                        onClick={() => handleEnableModule(module, false)}
                        disabled={loadingModules[module.id]}
                        variant="outline"
                        className="flex-1 text-red-600 border-red-300 hover:bg-red-50"
                      >
                        {loadingModules[module.id] ? (
                          <Loader className="w-4 h-4 animate-spin" />
                        ) : (
                          "Desactivar"
                        )}
                      </Button>
                    ) : isCreated ? (
                      <Button
                        onClick={() => handleEnableModule(module, true)}
                        disabled={loadingModules[module.id]}
                        className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                      >
                        {loadingModules[module.id] ? (
                          <Loader className="w-4 h-4 animate-spin" />
                        ) : (
                          "Activar"
                        )}
                      </Button>
                    ) : (
                      <Button
                        onClick={() => handleCreateModule(module)}
                        disabled={loadingModules[module.id]}
                        className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                      >
                        {loadingModules[module.id] ? (
                          <Loader className="w-4 h-4 animate-spin" />
                        ) : (
                          "Crear Módulo"
                        )}
                      </Button>
                    )}
                  </div>
                </Card>
              )
            })}
          </div>
        </div>
      </ModuleLayout>
    </AuthGuard>
  )
}
