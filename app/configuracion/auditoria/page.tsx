"use client"

import { useState } from "react"
import dynamic from "next/dynamic"
import { AuthGuard } from "@/components/auth-guard"
import { ModuleLayout } from "@/components/module-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import DatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css"
import {
  Search,
  Filter,
  Download,
  AlertTriangle,
  Info,
  CheckCircle,
  XCircle,
  User,
  Shield,
  Activity,
} from "lucide-react"

// Tipos para los datos
interface LogEntry {
  id: number
  fecha: string
  usuario: string
  accion: string
  modulo: string
  ip: string
  detalles: string
  tipo: "info" | "warning" | "error" | "success"
}

export default function AuditoriaPage() {
  // Estados para los datos
  const [logs, setLogs] = useState<LogEntry[]>([
    {
      id: 1,
      fecha: "15/05/2023 10:25:36",
      usuario: "Carlos Pérez",
      accion: "Inicio de sesión",
      modulo: "Seguridad",
      ip: "192.168.1.45",
      detalles: "Inicio de sesión exitoso desde navegador Chrome en Windows 10",
      tipo: "success",
    },
    {
      id: 2,
      fecha: "14/05/2023 15:40:12",
      usuario: "María López",
      accion: "Modificó configuración",
      modulo: "Configuración",
      ip: "192.168.1.32",
      detalles: "Cambió configuración de notificaciones por email",
      tipo: "info",
    },
    {
      id: 3,
      fecha: "15/05/2023 08:15:45",
      usuario: "Ana Martínez",
      accion: "Creó nueva cita",
      modulo: "Agenda",
      ip: "192.168.1.28",
      detalles: "Creó cita para el cliente Juan Pérez el 20/05/2023 a las 15:00",
      tipo: "info",
    },
    {
      id: 4,
      fecha: "12/05/2023 00:00:01",
      usuario: "Sistema",
      accion: "Backup automático",
      modulo: "Sistema",
      ip: "localhost",
      detalles: "Backup automático diario completado correctamente",
      tipo: "success",
    },
    {
      id: 5,
      fecha: "13/05/2023 12:30:18",
      usuario: "Juan Rodríguez",
      accion: "Actualizó inventario",
      modulo: "Inventarios",
      ip: "192.168.1.56",
      detalles: "Actualizó stock del producto #1234 de 10 a 5 unidades",
      tipo: "info",
    },
    {
      id: 6,
      fecha: "12/05/2023 14:20:33",
      usuario: "Roberto Gómez",
      accion: "Generó reporte",
      modulo: "Reportes",
      ip: "192.168.1.38",
      detalles: "Generó reporte de ventas del mes de abril",
      tipo: "info",
    },
    {
      id: 7,
      fecha: "10/05/2023 03:15:00",
      usuario: "Sistema",
      accion: "Actualización de software",
      modulo: "Sistema",
      ip: "localhost",
      detalles: "Actualización automática a la versión 2.5.1",
      tipo: "success",
    },
    {
      id: 8,
      fecha: "09/05/2023 11:45:22",
      usuario: "María López",
      accion: "Cambió contraseña",
      modulo: "Seguridad",
      ip: "192.168.1.32",
      detalles: "Cambió su contraseña de acceso al sistema",
      tipo: "info",
    },
    {
      id: 9,
      fecha: "08/05/2023 16:20:05",
      usuario: "Carlos Pérez",
      accion: "Creó nuevo usuario",
      modulo: "Seguridad",
      ip: "192.168.1.45",
      detalles: "Creó el usuario 'laura.sanchez' con rol 'Recepcionista'",
      tipo: "info",
    },
    {
      id: 10,
      fecha: "07/05/2023 22:10:15",
      usuario: "Sistema",
      accion: "Intento fallido de acceso",
      modulo: "Seguridad",
      ip: "45.67.89.123",
      detalles: "Intento fallido de acceso para el usuario 'admin'",
      tipo: "error",
    },
    {
      id: 11,
      fecha: "06/05/2023 09:30:42",
      usuario: "Laura Sánchez",
      accion: "Eliminó cliente",
      modulo: "Clientes",
      ip: "192.168.1.30",
      detalles: "Eliminó el cliente #5678 'Pedro Gómez'",
      tipo: "warning",
    },
    {
      id: 12,
      fecha: "05/05/2023 14:15:33",
      usuario: "Sistema",
      accion: "Error en backup",
      modulo: "Sistema",
      ip: "localhost",
      detalles: "Error al realizar backup automático: espacio insuficiente",
      tipo: "error",
    },
  ])

  // Estado para la búsqueda
  const [searchTerm, setSearchTerm] = useState("")
  const [filterModule, setFilterModule] = useState<string>("todos")
  const [filterType, setFilterType] = useState<string>("todos")
  const [startDate, setStartDate] = useState<Date | undefined>(undefined)
  const [endDate, setEndDate] = useState<Date | undefined>(undefined)

  // Función para filtrar logs
  const filteredLogs = logs.filter((log) => {
    // Filtro de búsqueda
    const matchesSearch =
      log.usuario.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.accion.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.detalles.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.ip.toLowerCase().includes(searchTerm.toLowerCase())

    // Filtro de módulo
    const matchesModule = filterModule === "todos" || log.modulo === filterModule

    // Filtro de tipo
    const matchesType = filterType === "todos" || log.tipo === filterType

    // Filtro de fecha
    let matchesDate = true
    if (startDate) {
      const logDate = new Date(log.fecha.split(" ")[0].split("/").reverse().join("-"))
      matchesDate = logDate >= startDate
    }
    if (endDate && matchesDate) {
      const logDate = new Date(log.fecha.split(" ")[0].split("/").reverse().join("-"))
      matchesDate = logDate <= endDate
    }

    return matchesSearch && matchesModule && matchesType && matchesDate
  })

  // Función para exportar logs
  const exportLogs = () => {
    alert("Exportando logs a CSV...")
  }

  // Función para obtener icono según tipo de log
  const getLogIcon = (type: string) => {
    switch (type) {
      case "info":
        return <Info className="w-5 h-5 text-blue-500" />
      case "warning":
        return <AlertTriangle className="w-5 h-5 text-yellow-500" />
      case "error":
        return <XCircle className="w-5 h-5 text-red-500" />
      case "success":
        return <CheckCircle className="w-5 h-5 text-green-500" />
      default:
        return <Info className="w-5 h-5 text-blue-500" />
    }
  }

  return (

    <AuthGuard>
      <ModuleLayout moduleType="configuracion">

        <main className="flex-1 overflow-y-auto p-9 ">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold dark:text-white">Registro de Auditoría</h1>
            <Button variant="outline" onClick={exportLogs} className="flex items-center gap-2">
              <Download className="w-4 h-4" />
              Exportar Logs
            </Button>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm dark:bg-gray-800">
            <div className="flex flex-col md:flex-row justify-between mb-6 gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <Input
                  placeholder="Buscar en logs..."
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="flex flex-wrap gap-2">
                <div className="w-40">
                  <Select value={filterModule} onValueChange={setFilterModule}>
                    <SelectTrigger>
                      <SelectValue placeholder="Módulo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="todos">Todos los módulos</SelectItem>
                      <SelectItem value="Seguridad">Seguridad</SelectItem>
                      <SelectItem value="Configuración">Configuración</SelectItem>
                      <SelectItem value="Agenda">Agenda</SelectItem>
                      <SelectItem value="Sistema">Sistema</SelectItem>
                      <SelectItem value="Inventarios">Inventarios</SelectItem>
                      <SelectItem value="Reportes">Reportes</SelectItem>
                      <SelectItem value="Clientes">Clientes</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="w-40">
                  <Select value={filterType} onValueChange={setFilterType}>
                    <SelectTrigger>
                      <SelectValue placeholder="Tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="todos">Todos los tipos</SelectItem>
                      <SelectItem value="info">Información</SelectItem>
                      <SelectItem value="warning">Advertencia</SelectItem>
                      <SelectItem value="error">Error</SelectItem>
                      <SelectItem value="success">Éxito</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="w-40">
                  <DatePicker
                    selected={startDate}
                    onChange={(date) => setStartDate(date ?? undefined)}
                    placeholderText="Fecha inicio"
                  />
                </div>
                <div className="w-40">
                  <DatePicker
                    selected={endDate}
                    onChange={(date) => setEndDate(date ?? undefined)}
                    placeholderText="Fecha fin"
                  />
                </div>
                <Button variant="outline" className="flex items-center gap-2">
                  <Filter className="w-4 h-4" />
                  Filtrar
                </Button>
              </div>
            </div>

            <Tabs defaultValue="todos">
              <TabsList className="mb-4">
                <TabsTrigger value="todos">Todos los logs</TabsTrigger>
                <TabsTrigger value="seguridad">Seguridad</TabsTrigger>
                <TabsTrigger value="sistema">Sistema</TabsTrigger>
                <TabsTrigger value="usuarios">Usuarios</TabsTrigger>
              </TabsList>

              <TabsContent value="todos" className="space-y-4">
                <div className="space-y-4">
                  {filteredLogs.map((log) => (
                    <div key={log.id} className="border rounded-lg p-4 dark:border-gray-700">
                      <div className="flex items-start gap-3">
                        <div className="mt-1">{getLogIcon(log.tipo)}</div>
                        <div className="flex-1">
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="font-medium dark:text-white">{log.accion}</h3>
                              <p className="text-sm text-gray-500 dark:text-gray-400">{log.detalles}</p>
                            </div>
                            <span className="text-xs text-gray-500 dark:text-gray-400">{log.fecha}</span>
                          </div>
                          <div className="flex flex-wrap gap-3 mt-2 text-xs text-gray-500 dark:text-gray-400">
                            <div className="flex items-center">
                              <User className="w-3 h-3 mr-1" />
                              <span>{log.usuario}</span>
                            </div>
                            <div className="flex items-center">
                              <Shield className="w-3 h-3 mr-1" />
                              <span>{log.modulo}</span>
                            </div>
                            <div className="flex items-center">
                              <Activity className="w-3 h-3 mr-1" />
                              <span>IP: {log.ip}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    Mostrando {filteredLogs.length} de {logs.length} registros
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" disabled>
                      Anterior
                    </Button>
                    <Button variant="outline" size="sm">
                      1
                    </Button>
                    <Button variant="outline" size="sm">
                      2
                    </Button>
                    <Button variant="outline" size="sm">
                      Siguiente
                    </Button>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="seguridad">
                <div className="p-4 text-center text-gray-500 dark:text-gray-400">Mostrando logs de seguridad</div>
              </TabsContent>

              <TabsContent value="sistema">
                <div className="p-4 text-center text-gray-500 dark:text-gray-400">Mostrando logs del sistema</div>
              </TabsContent>

              <TabsContent value="usuarios">
                <div className="p-4 text-center text-gray-500 dark:text-gray-400">Mostrando logs de usuarios</div>
              </TabsContent>
            </Tabs>
          </div>
        </main>

      </ModuleLayout>
    </AuthGuard>


  )
}

