"use client"

import type React from "react"
import dynamic from "next/dynamic"
import { AuthGuard } from "@/components/auth-guard"
import { ModuleLayout } from "@/components/module-layout"
import { useState } from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import {
  Plus,
  Search,
  Pencil,
  Trash,
  Copy,
  Shield,
  Users,
  Settings,
  FileText,
  Calendar,
  ShoppingBag,
  BarChart,
  DollarSign,
  UserPlus,
} from "lucide-react"

// Tipos para los datos
interface Rol {
  id: number
  nombre: string
  descripcion: string
  usuarios: number
  creado: string
  modulos: string[]
}

export default function PermisosPage() {
  // Estados para los datos
  const [roles, setRoles] = useState<Rol[]>([
    {
      id: 1,
      nombre: "Administrador",
      descripcion: "Acceso completo a todas las funcionalidades del sistema",
      usuarios: 2,
      creado: "01/01/2023",
      modulos: [
        "Dashboard",
        "Agenda",
        "Clientes",
        "Facturación",
        "Inventarios",
        "Reportes",
        "Contabilidad",
        "Nómina",
        "Marketing",
        "Seguridad",
      ],
    },
    {
      id: 2,
      nombre: "Gerente",
      descripcion: "Acceso a reportes y configuración",
      usuarios: 3,
      creado: "05/01/2023",
      modulos: ["Dashboard", "Agenda", "Clientes", "Facturación", "Inventarios", "Reportes", "Contabilidad"],
    },
    {
      id: 3,
      nombre: "Recepcionista",
      descripcion: "Gestión de citas y clientes",
      usuarios: 4,
      creado: "10/01/2023",
      modulos: ["Dashboard", "Agenda", "Clientes"],
    },
    {
      id: 4,
      nombre: "Estilista",
      descripcion: "Gestión de servicios",
      usuarios: 5,
      creado: "15/01/2023",
      modulos: ["Dashboard", "Agenda"],
    },
    {
      id: 5,
      nombre: "Contador",
      descripcion: "Acceso a finanzas",
      usuarios: 1,
      creado: "20/01/2023",
      modulos: ["Dashboard", "Facturación", "Contabilidad", "Reportes"],
    },
  ])

  // Estados para los modales
  const [newRoleModal, setNewRoleModal] = useState(false)
  const [editRoleModal, setEditRoleModal] = useState(false)
  const [deleteRoleModal, setDeleteRoleModal] = useState(false)
  const [permissionsModal, setPermissionsModal] = useState(false)

  // Estado para el rol seleccionado
  const [selectedRole, setSelectedRole] = useState<Rol | null>(null)

  // Estado para la búsqueda
  const [searchTerm, setSearchTerm] = useState("")

  // Toast para notificaciones
  const { toast } = useToast()

  // Función para filtrar roles
  const filteredRoles = roles.filter(
    (role) =>
      role.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      role.descripcion.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  // Función para editar rol
  const handleEditRole = (role: Rol) => {
    setSelectedRole(role)
    setEditRoleModal(true)
  }

  // Función para gestionar permisos
  const handleManagePermissions = (role: Rol) => {
    setSelectedRole(role)
    setPermissionsModal(true)
  }

  // Función para eliminar rol
  const handleDeleteRole = (role: Rol) => {
    setSelectedRole(role)
    setDeleteRoleModal(true)
  }

  // Función para duplicar rol
  const handleDuplicateRole = (role: Rol) => {
    const newRole: Rol = {
      ...role,
      id: roles.length + 1,
      nombre: `${role.nombre} (Copia)`,
      usuarios: 0,
      creado: new Date().toLocaleDateString(),
    }
    setRoles([...roles, newRole])
    toast({
      title: "Rol duplicado",
      description: `El rol ${role.nombre} ha sido duplicado correctamente.`,
    })
  }

  // Función para confirmar eliminación de rol
  const confirmDeleteRole = () => {
    if (selectedRole) {
      setRoles(roles.filter((r) => r.id !== selectedRole.id))
      toast({
        title: "Rol eliminado",
        description: `El rol ${selectedRole.nombre} ha sido eliminado correctamente.`,
      })
      setDeleteRoleModal(false)
    }
  }

  // Función para guardar cambios de rol
  const saveRoleChanges = (e: React.FormEvent) => {
    e.preventDefault()
    if (selectedRole) {
      setRoles(roles.map((r) => (r.id === selectedRole.id ? selectedRole : r)))
      toast({
        title: "Rol actualizado",
        description: "Los datos del rol han sido actualizados correctamente.",
      })
      setEditRoleModal(false)
    }
  }

  // Función para guardar permisos
  const savePermissions = (e: React.FormEvent) => {
    e.preventDefault()
    toast({
      title: "Permisos actualizados",
      description: `Los permisos del rol ${selectedRole?.nombre} han sido actualizados correctamente.`,
    })
    setPermissionsModal(false)
  }

  // Función para crear nuevo rol
  const createNewRole = (e: React.FormEvent) => {
    e.preventDefault()
    const newRole: Rol = {
      id: roles.length + 1,
      nombre: "Nuevo Rol",
      descripcion: "Descripción del nuevo rol",
      usuarios: 0,
      creado: new Date().toLocaleDateString(),
      modulos: ["Dashboard"],
    }
    setRoles([...roles, newRole])
    toast({
      title: "Rol creado",
      description: "El nuevo rol ha sido creado correctamente.",
    })
    setNewRoleModal(false)
  }

  // Función para obtener icono de módulo
  const getModuleIcon = (module: string) => {
    switch (module) {
      case "Dashboard":
        return <Shield className="w-4 h-4" />
      case "Agenda":
        return <Calendar className="w-4 h-4" />
      case "Clientes":
        return <Users className="w-4 h-4" />
      case "Facturación":
        return <FileText className="w-4 h-4" />
      case "Inventarios":
        return <ShoppingBag className="w-4 h-4" />
      case "Reportes":
        return <BarChart className="w-4 h-4" />
      case "Contabilidad":
        return <DollarSign className="w-4 h-4" />
      case "Nómina":
        return <Users className="w-4 h-4" />
      case "Marketing":
        return <BarChart className="w-4 h-4" />
      case "Seguridad":
        return <Shield className="w-4 h-4" />
      default:
        return <Settings className="w-4 h-4" />
    }
  }

  return (

    <AuthGuard>
      <ModuleLayout moduleType="configuracion">

        <div className="flex h-screen bg-gray-50 dark:bg-gray-900">

          <div className="flex flex-col flex-1 overflow-hidden">
            <main className="flex-1 overflow-y-auto p-9 ">
              <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold dark:text-white">Roles y Permisos</h1>
                <Button
                  onClick={() => setNewRoleModal(true)}
                  className="bg-black text-white hover:bg-gray-800 flex items-center gap-2 dark:bg-gray-800 dark:hover:bg-gray-700"
                >
                  <Plus className="w-4 h-4" />
                  Nuevo Rol
                </Button>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm dark:bg-gray-800">
                <div className="flex justify-between mb-6">
                  <div className="relative w-64">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                    <Input
                      placeholder="Buscar roles..."
                      className="pl-10"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                </div>

                <Tabs defaultValue="todos">
                  <TabsList className="mb-4">
                    <TabsTrigger value="todos">Todos los roles</TabsTrigger>
                    <TabsTrigger value="sistema">Roles del sistema</TabsTrigger>
                    <TabsTrigger value="personalizados">Roles personalizados</TabsTrigger>
                  </TabsList>

                  <TabsContent value="todos" className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {filteredRoles.map((role) => (
                        <div key={role.id} className="border rounded-lg p-4 dark:border-gray-700">
                          <div className="flex justify-between items-start mb-2">
                            <h3 className="font-medium dark:text-white">{role.nombre}</h3>
                            <div className="flex gap-1">
                              <button
                                className="p-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                                onClick={() => handleEditRole(role)}
                              >
                                <Pencil className="w-4 h-4" />
                              </button>
                              <button
                                className="p-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                                onClick={() => handleDuplicateRole(role)}
                              >
                                <Copy className="w-4 h-4" />
                              </button>
                              <button
                                className="p-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                                onClick={() => handleDeleteRole(role)}
                                disabled={role.usuarios > 0}
                              >
                                <Trash className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                          <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">{role.descripcion}</p>
                          <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-3">
                            <UserPlus className="w-4 h-4 mr-1" />
                            <span>{role.usuarios} usuarios</span>
                          </div>
                          <div className="mb-3">
                            <h4 className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                              Módulos con acceso:
                            </h4>
                            <div className="flex flex-wrap gap-1">
                              {role.modulos.map((modulo) => (
                                <span
                                  key={modulo}
                                  className="inline-flex items-center px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded text-xs"
                                >
                                  {getModuleIcon(modulo)}
                                  <span className="ml-1 dark:text-gray-200">{modulo}</span>
                                </span>
                              ))}
                            </div>
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            className="w-full"
                            onClick={() => handleManagePermissions(role)}
                          >
                            Gestionar permisos
                          </Button>
                        </div>
                      ))}
                    </div>
                  </TabsContent>

                  <TabsContent value="sistema">
                    <div className="p-4 text-center text-gray-500 dark:text-gray-400">Mostrando roles del sistema</div>
                  </TabsContent>

                  <TabsContent value="personalizados">
                    <div className="p-4 text-center text-gray-500 dark:text-gray-400">Mostrando roles personalizados</div>
                  </TabsContent>
                </Tabs>
              </div>
            </main>
          </div>


          {/* Modal para nuevo rol */}
          <Dialog open={newRoleModal} onOpenChange={setNewRoleModal}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Nuevo Rol</DialogTitle>
              </DialogHeader>
              <form onSubmit={createNewRole}>
                <div className="space-y-4 py-2">
                  <div className="space-y-2">
                    <label htmlFor="rolName" className="text-sm font-medium">
                      Nombre del rol
                    </label>
                    <Input id="rolName" placeholder="Ej: Supervisor" />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="rolDescription" className="text-sm font-medium">
                      Descripción
                    </label>
                    <Textarea id="rolDescription" placeholder="Describe las funciones de este rol" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Módulos con acceso</label>
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        "Dashboard",
                        "Agenda",
                        "Clientes",
                        "Facturación",
                        "Inventarios",
                        "Reportes",
                        "Contabilidad",
                        "Nómina",
                        "Marketing",
                        "Seguridad",
                      ].map((modulo) => (
                        <div key={modulo} className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            id={`new-modulo-${modulo}`}
                            defaultChecked={modulo === "Dashboard"}
                            className="rounded border-gray-300 text-black focus:ring-black dark:border-gray-600 dark:bg-gray-800 dark:focus:ring-gray-600"
                          />
                          <label htmlFor={`new-modulo-${modulo}`} className="text-sm">
                            {modulo}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                <DialogFooter className="mt-4">
                  <Button type="button" variant="outline" onClick={() => setNewRoleModal(false)}>
                    Cancelar
                  </Button>
                  <Button type="submit">Crear Rol</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>

          {/* Modal para editar rol */}
          <Dialog open={editRoleModal} onOpenChange={setEditRoleModal}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Editar Rol</DialogTitle>
              </DialogHeader>
              <form onSubmit={saveRoleChanges}>
                <div className="space-y-4 py-2">
                  <div className="space-y-2">
                    <label htmlFor="nombre" className="text-sm font-medium">
                      Nombre del rol
                    </label>
                    <Input
                      id="nombre"
                      value={selectedRole?.nombre || ""}
                      onChange={(e) => selectedRole && setSelectedRole({ ...selectedRole, nombre: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="descripcion" className="text-sm font-medium">
                      Descripción
                    </label>
                    <Textarea
                      id="descripcion"
                      value={selectedRole?.descripcion || ""}
                      onChange={(e) => selectedRole && setSelectedRole({ ...selectedRole, descripcion: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Módulos con acceso</label>
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        "Dashboard",
                        "Agenda",
                        "Clientes",
                        "Facturación",
                        "Inventarios",
                        "Reportes",
                        "Contabilidad",
                        "Nómina",
                        "Marketing",
                        "Seguridad",
                      ].map((modulo) => (
                        <div key={modulo} className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            id={`edit-modulo-${modulo}`}
                            defaultChecked={selectedRole?.modulos.includes(modulo)}
                            className="rounded border-gray-300 text-black focus:ring-black dark:border-gray-600 dark:bg-gray-800 dark:focus:ring-gray-600"
                          />
                          <label htmlFor={`edit-modulo-${modulo}`} className="text-sm">
                            {modulo}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                <DialogFooter className="mt-4">
                  <Button type="button" variant="outline" onClick={() => setEditRoleModal(false)}>
                    Cancelar
                  </Button>
                  <Button type="submit">Guardar cambios</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>

          {/* Modal para gestionar permisos */}
          <Dialog open={permissionsModal} onOpenChange={setPermissionsModal}>
            <DialogContent className="max-w-3xl">
              <DialogHeader>
                <DialogTitle>Gestionar Permisos - {selectedRole?.nombre}</DialogTitle>
              </DialogHeader>
              <form onSubmit={savePermissions}>
                <div className="space-y-4 py-2">
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b dark:border-gray-700">
                          <th className="text-left py-2">Módulo</th>
                          <th className="text-center py-2">Ver</th>
                          <th className="text-center py-2">Crear</th>
                          <th className="text-center py-2">Editar</th>
                          <th className="text-center py-2">Eliminar</th>
                          <th className="text-center py-2">Exportar</th>
                        </tr>
                      </thead>
                      <tbody>
                        {[
                          "Dashboard",
                          "Agenda",
                          "Clientes",
                          "Facturación",
                          "Inventarios",
                          "Reportes",
                          "Contabilidad",
                          "Nómina",
                          "Marketing",
                          "Seguridad",
                        ].map((modulo) => (
                          <tr key={modulo} className="border-b dark:border-gray-700">
                            <td className="py-2 flex items-center">
                              {getModuleIcon(modulo)}
                              <span className="ml-2">{modulo}</span>
                            </td>
                            <td className="text-center py-2">
                              <input
                                type="checkbox"
                                defaultChecked={selectedRole?.modulos.includes(modulo)}
                                className="rounded border-gray-300 text-black focus:ring-black dark:border-gray-600 dark:bg-gray-800 dark:focus:ring-gray-600"
                              />
                            </td>
                            <td className="text-center py-2">
                              <input
                                type="checkbox"
                                defaultChecked={selectedRole?.modulos.includes(modulo) && modulo !== "Dashboard"}
                                className="rounded border-gray-300 text-black focus:ring-black dark:border-gray-600 dark:bg-gray-800 dark:focus:ring-gray-600"
                              />
                            </td>
                            <td className="text-center py-2">
                              <input
                                type="checkbox"
                                defaultChecked={
                                  selectedRole?.modulos.includes(modulo) && modulo !== "Dashboard" && modulo !== "Reportes"
                                }
                                className="rounded border-gray-300 text-black focus:ring-black dark:border-gray-600 dark:bg-gray-800 dark:focus:ring-gray-600"
                              />
                            </td>
                            <td className="text-center py-2">
                              <input
                                type="checkbox"
                                defaultChecked={
                                  selectedRole?.modulos.includes(modulo) &&
                                  ["Clientes", "Facturación", "Inventarios"].includes(modulo)
                                }
                                className="rounded border-gray-300 text-black focus:ring-black dark:border-gray-600 dark:bg-gray-800 dark:focus:ring-gray-600"
                              />
                            </td>
                            <td className="text-center py-2">
                              <input
                                type="checkbox"
                                defaultChecked={
                                  selectedRole?.modulos.includes(modulo) &&
                                  ["Reportes", "Facturación", "Clientes"].includes(modulo)
                                }
                                className="rounded border-gray-300 text-black focus:ring-black dark:border-gray-600 dark:bg-gray-800 dark:focus:ring-gray-600"
                              />
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-sm font-medium">Permisos adicionales</h3>
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        "Acceso a configuración avanzada",
                        "Gestión de backups",
                        "Gestión de usuarios",
                        "Gestión de roles",
                        "Ver estadísticas sensibles",
                        "Acceso a datos financieros",
                      ].map((permiso) => (
                        <div key={permiso} className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            id={`permiso-${permiso}`}
                            defaultChecked={
                              selectedRole?.nombre === "Administrador" ||
                              (selectedRole?.nombre === "Gerente" &&
                                ["Ver estadísticas sensibles", "Acceso a datos financieros"].includes(permiso))
                            }
                            className="rounded border-gray-300 text-black focus:ring-black dark:border-gray-600 dark:bg-gray-800 dark:focus:ring-gray-600"
                          />
                          <label htmlFor={`permiso-${permiso}`} className="text-sm">
                            {permiso}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                <DialogFooter className="mt-4">
                  <Button type="button" variant="outline" onClick={() => setPermissionsModal(false)}>
                    Cancelar
                  </Button>
                  <Button type="submit">Guardar permisos</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>

          {/* Modal para eliminar rol */}
          <Dialog open={deleteRoleModal} onOpenChange={setDeleteRoleModal}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Eliminar Rol</DialogTitle>
              </DialogHeader>
              <div className="py-4">
                <p>
                  ¿Está seguro que desea eliminar el rol <strong>{selectedRole?.nombre}</strong>?
                </p>
                {(selectedRole && selectedRole.usuarios !== undefined && selectedRole.usuarios > 0) ? (
                  <p className="text-sm text-red-500 mt-2">
                    Este rol tiene {selectedRole.usuarios} usuarios asignados. Debe reasignar estos usuarios antes de
                    eliminar el rol.
                  </p>
                ) : (
                  <p className="text-sm text-gray-500 mt-2">Esta acción no se puede deshacer.</p>
                )}
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setDeleteRoleModal(false)}>
                  Cancelar
                </Button>
                <Button
                  type="button"
                  variant="destructive"
                  onClick={confirmDeleteRole}
                  disabled={(selectedRole?.usuarios ?? 0) > 0}
                >
                  Eliminar
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

      </ModuleLayout>
    </AuthGuard>

  )
}

