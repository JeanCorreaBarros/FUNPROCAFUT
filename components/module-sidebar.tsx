"use client"

import { useRouter, usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { usePermissions } from "@/hooks/use-permissions"
import { PermissionGuard } from "@/components/permission-guard"
import {
  Home,
  Calendar,
  Clock,
  CheckCircle,
  Users,
  DollarSign,
  ShoppingBag,
  Hourglass,
  Calculator,
  Settings,
  FileText,
  Package,
  BarChart3,
  TrendingUp,
  Shield,
  UserCheck,
  User,
  MapPin,
} from "lucide-react"

interface ModuleSidebarProps {
  moduleType: string
}

const moduleConfigs = {
  vote: {
    title: "Vote",
    items: [
      { icon: Home, label: "Inicio", path: "/vote", active: true, permission: "vote.view" },
      { icon: Users, label: "Registro de Votantes", path: "/vote/registro", permission: "vote.view" },
      { icon: BarChart3, label: "Verificación de Identidad", path: "/vote/verificacion", permission: "vote.view" },
      { icon: Settings, label: "Auditoría y Registros", path: "/vote/auditoria", permission: "vote.edit" },
      { icon: Settings, label: "Administración", path: "/vote/administracion", permission: "vote.edit" },
    ],
  },
    educative: {
    title: "Educative",
    items: [
      { icon: Home, label: "Inicio", path: "/educative", active: true, permission: "educative.view" },
      { icon: Users, label: "opcion 1", path: "/educative/1", permission: "educative.view" },
      { icon: BarChart3, label: "opcion 2", path: "/educative/2", permission: "educative.view" },
      { icon: Settings, label: "opcion 3", path: "/educative/3", permission: "educative.edit" },
      { icon: Settings, label: "opcion 4", path: "/educative/4", permission: "educative.edit" },
    ],
  },
  agenda: {
    title: "Agenda y Citas",
    items: [
      { icon: Home, label: "Inicio", path: "/agenda", active: true, permission: "agenda.view" },
      { icon: Calendar, label: "Calendario", path: "/agenda/calendario", permission: "agenda.view" },
      { icon: Users, label: "Clientes", path: "/agenda/clientes", permission: "agenda.view" },
      { icon: Clock, label: "Pendientes", path: "/agenda/pendientes", permission: "agenda.view" },
      { icon: CheckCircle, label: "Completadas", path: "/agenda/completadas", permission: "agenda.view" },
      { icon: Users, label: "Gestión del equipo", path: "/agenda/equipo", permission: "agenda.edit" },
      { icon: DollarSign, label: "Proceso de pago", path: "/agenda/pagos", permission: "agenda.edit" },
      { icon: ShoppingBag, label: "Vender", path: "/agenda/vender", permission: "agenda.create" },
      { icon: Hourglass, label: "Ordenes de Espera", path: "/agenda/espera", permission: "agenda.view" },
      { icon: Calculator, label: "Caja Diaria", path: "/agenda/caja", permission: "agenda.edit" },
      { icon: Settings, label: "Configuración", path: "/agenda/configuracion", permission: "agenda.edit" },
    ],
  },
  configuracion: {
    title: "Configuración General",
    items: [
      { icon: Home, label: "Inicio", path: "/configuracion", active: true, permission: "configuracion.view" },
      { icon: FileText, label: "Auditoría", path: "/configuracion/auditoria", permission: "configuracion.edit" },
      { icon: Users, label: "Empresa", path: "/configuracion/empresa", permission: "configuracion.edit" },
      { icon: MapPin, label: "Registro Sede", path: "/configuracion/registro-sede", permission: "configuracion.edit" },
     // { icon: User, label: "Perfil", path: "/configuracion/perfil", permission: "configuracion.edit" },
      { icon: Shield, label: "Permisos", path: "/configuracion/permisos", permission: "seguridad.view" },
      { icon: Settings, label: "Seguridad", path: "/configuracion/seguridad", permission: "configuracion.edit" },
      { icon: Users, label: "Usuarios", path: "/configuracion/usuarios", permission: "configuracion.edit" },
      { icon: Package, label: "Activacion de Modulos", path: "/configuracion/activacion-modulos", permission: "configuracion.edit" },
      //{ icon: Package, label: "Facturacion Electronica", path: "/configuracion/facturacion", permission: "configuracion.edit" },
      //{ icon: FileText, label: "Integraciones", path: "/configuracion/integraciones", permission: "configuracion.edit" },
      { icon: FileText, label: "Apariecia Web", path: "/configuracion/webdesign", permission: "configuracion.edit" },

    ],
  },
  facturacion: {
    title: "Facturación",
    items: [
      { icon: Home, label: "Inicio", path: "/facturacion", active: true, permission: "facturacion.view" },
      { icon: FileText, label: "Facturas", path: "/facturacion/facturas", permission: "facturacion.view" },
      { icon: Users, label: "Clientes", path: "/facturacion/clientes", permission: "facturacion.view" },
      { icon: FileText, label: "Nueva Factura", path: "/facturacion/nueva-factura", permission: "facturacion.edit" },
      { icon: FileText, label: "Cotizacion", path: "/facturacion/cotizacion", permission: "facturacion.view" },
      { icon: FileText, label: "Nota Credito", path: "/facturacion/nota-credito", permission: "facturacion.view" },
      { icon: DollarSign, label: "Pagos", path: "/facturacion/pagos", permission: "facturacion.view" },
      { icon: BarChart3, label: "Reportes", path: "/facturacion/reportes", permission: "reportes.view" },
      { icon: Settings, label: "Configuracion", path: "/facturacion/configuracion", permission: "facturacion.view" },

    ],
  },
  inventarios: {
    title: "Inventarios",
    items: [
      { icon: Home, label: "Inicio", path: "/inventarios", active: true, permission: "inventarios.view" },
      { icon: Package, label: "Productos", path: "/inventarios/productos", permission: "inventarios.view" },
      { icon: ShoppingBag, label: "Compras", path: "/inventarios/compras", permission: "inventarios.create" },
      { icon: TrendingUp, label: "Movimientos", path: "/inventarios/movimientos", permission: "inventarios.view" },
      { icon: BarChart3, label: "Reportes", path: "/inventarios/reportes", permission: "reportes.view" },
    ],
  },
  reportes: {
    title: "Reportes",
    items: [
      { icon: Home, label: "Inicio", path: "/reportes", active: true, permission: "reportes.view" },
      { icon: BarChart3, label: "Ventas", path: "/reportes/ventas", permission: "reportes.view" },
      { icon: Users, label: "Clientes", path: "/reportes/clientes", permission: "reportes.view" },
      { icon: DollarSign, label: "Financieros", path: "/reportes/financieros", permission: "reportes.view" },
      { icon: TrendingUp, label: "Análisis", path: "/reportes/analisis", permission: "reportes.export" },
    ],
  },
  contabilidad: {
    title: "Contabilidad",
    items: [
      { icon: Home, label: "Inicio", path: "/contabilidad", active: true, permission: "contabilidad.view" },
      { icon: Calculator, label: "Libro Diario", path: "/contabilidad/diario", permission: "contabilidad.view" },
      { icon: FileText, label: "Balance", path: "/contabilidad/balance", permission: "contabilidad.view" },
      { icon: DollarSign, label: "Flujo de Caja", path: "/contabilidad/flujo", permission: "contabilidad.view" },
      { icon: BarChart3, label: "Reportes", path: "/contabilidad/reportes", permission: "reportes.view" },
    ],
  },
  nomina: {
    title: "Nómina",
    items: [
      { icon: Home, label: "Inicio", path: "/nomina", active: true, permission: "nomina.view" },
      { icon: Users, label: "Empleados", path: "/nomina/empleados", permission: "nomina.view" },
      { icon: DollarSign, label: "Pagos", path: "/nomina/pagos", permission: "nomina.edit" },
      { icon: FileText, label: "Recibos", path: "/nomina/recibos", permission: "nomina.view" },
      { icon: BarChart3, label: "Reportes", path: "/nomina/reportes", permission: "reportes.view" },
    ],
  },
  marketing: {
    title: "Marketing",
    items: [
      { icon: Home, label: "Inicio", path: "/marketing", active: true, permission: "marketing.view" },
      { icon: TrendingUp, label: "Campañas", path: "/marketing/campanas", permission: "marketing.create" },
      { icon: Users, label: "Audiencias", path: "/marketing/audiencias", permission: "marketing.view" },
      { icon: BarChart3, label: "Métricas", path: "/marketing/metricas", permission: "marketing.view" },
      { icon: FileText, label: "Contenido", path: "/marketing/contenido", permission: "marketing.edit" },
    ],
  },
  seguridad: {
    title: "Seguridad",
    items: [
      { icon: Home, label: "Inicio", path: "/seguridad", active: true, permission: "seguridad.view" },
      { icon: Shield, label: "Permisos", path: "/seguridad/permisos", permission: "seguridad.edit" },
      { icon: UserCheck, label: "Autenticación", path: "/seguridad/auth", permission: "seguridad.edit" },
      { icon: FileText, label: "Logs", path: "/seguridad/logs", permission: "seguridad.view" },
      { icon: Settings, label: "Configuración", path: "/seguridad/config", permission: "seguridad.edit" },
    ],
  },
}

export function ModuleSidebar({ moduleType }: ModuleSidebarProps) {
  const router = useRouter()
  const pathname = usePathname()
  const { hasPermission, user } = usePermissions()
  const config = moduleConfigs[moduleType as keyof typeof moduleConfigs]

  if (!config || !user) return null

  const filteredItems = config.items.filter((item) => hasPermission(item.permission))

  return (
    <div className="w-64 bg-white border-r border-gray-200 flex flex-col sticky top-0 h-screen">
      {/* Sidebar Header */}
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-sm font-medium text-bivoo-purple">{config.title}</h2>
        <p className="text-xs text-gray-500 mt-1 font-bold capitalize">{user.role}</p>
      </div>

      {/* Sidebar Navigation */}
      <nav className="flex-1 p-4 space-y-1">
        {filteredItems.map((item, index) => {
          const isActive = pathname === item.path
          return (
            <PermissionGuard key={index} permission={item.permission}>
              <Button
                onClick={() => router.push(item.path)}
                variant="ghost"
                className={`w-full justify-start cursor-pointer space-x-3 h-10 ${isActive
                  ? "bg-bivoo-purple text-white hover:bg-bivoo-purple-dark hover:text-white"
                  : "text-bivoo-gray hover:bg-purple-200 hover:text-bivoo-gray-dark"
                  } transition-colors`}
              >
                <item.icon size={18} />
                <span className="text-sm">{item.label}</span>
              </Button>
            </PermissionGuard>
          )
        })}

        {filteredItems.length === 0 && (
          <div className="text-center py-8">
            <Shield className="mx-auto h-12 w-12 text-gray-300 mb-3" />
            <p className="text-sm text-gray-500">No tienes permisos para acceder a las opciones de este módulo.</p>
          </div>
        )}
      </nav>
    </div>
  )
}
