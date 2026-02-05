"use client"

import type React from "react"
import dynamic from "next/dynamic"
import { AuthGuard } from "@/components/auth-guard"
import { ModuleLayout } from "@/components/module-layout"
import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { useToast } from "@/hooks/use-toast"
import { UserPlus, TrendingUp, Check, Shield, Pencil, Key, Trash, Plus, Download, Save } from "lucide-react"

// Tipos para los datos
interface Usuario {
  id: number
  nombre: string
  rol: string
  acceso: string
  estado: string
}

interface Actividad {
  id: number
  usuario: string
  accion: string
  fecha: string
  ip: string
}

interface Rol {
  id: number
  rol: string
  usuarios: number
  permisos: string
}

interface Backup {
  id: number
  fecha: string
  tamaño: string
  estado: string
}

export default function SeguridadPage() {
  // Estados para los datos
  const [usuarios, setUsuarios] = useState<Usuario[]>([
    { id: 1, nombre: "Carlos Pérez", rol: "Administrador", acceso: "15/05/2023 10:25", estado: "Activo" },
    { id: 2, nombre: "María López", rol: "Gerente", acceso: "14/05/2023 15:40", estado: "Activo" },
    { id: 3, nombre: "Ana Martínez", rol: "Recepcionista", acceso: "15/05/2023 08:15", estado: "Activo" },
    { id: 4, nombre: "Juan Rodríguez", rol: "Estilista", acceso: "13/05/2023 12:30", estado: "Activo" },
    { id: 5, nombre: "Laura Sánchez", rol: "Recepcionista", acceso: "10/05/2023 09:45", estado: "Inactivo" },
    { id: 6, nombre: "Roberto Gómez", rol: "Contador", acceso: "12/05/2023 14:20", estado: "Activo" },
    { id: 7, nombre: "Sofía Ramírez", rol: "Estilista", acceso: "11/05/2023 11:10", estado: "Activo" },
  ])

  const [actividades] = useState<Actividad[]>([
    { id: 1, usuario: "Carlos Pérez", accion: "Inicio de sesión", fecha: "15/05/2023 10:25", ip: "192.168.1.45" },
    { id: 2, usuario: "María López", accion: "Modificó configuración", fecha: "14/05/2023 15:40", ip: "192.168.1.32" },
    { id: 3, usuario: "Ana Martínez", accion: "Creó nueva cita", fecha: "15/05/2023 08:15", ip: "192.168.1.28" },
    { id: 4, usuario: "Sistema", accion: "Backup automático", fecha: "12/05/2023 00:00", ip: "localhost" },
    { id: 5, usuario: "Juan Rodríguez", accion: "Actualizó inventario", fecha: "13/05/2023 12:30", ip: "192.168.1.56" },
    { id: 6, usuario: "Roberto Gómez", accion: "Generó reporte", fecha: "12/05/2023 14:20", ip: "192.168.1.38" },
    { id: 7, usuario: "Sistema", accion: "Actualización de software", fecha: "10/05/2023 03:15", ip: "localhost" },
    { id: 8, usuario: "María López", accion: "Cambió contraseña", fecha: "09/05/2023 11:45", ip: "192.168.1.32" },
    { id: 9, usuario: "Carlos Pérez", accion: "Creó nuevo usuario", fecha: "08/05/2023 16:20", ip: "192.168.1.45" },
    { id: 10, usuario: "Sistema", accion: "Intento fallido de acceso", fecha: "07/05/2023 22:10", ip: "45.67.89.123" },
  ])

  const [roles, setRoles] = useState<Rol[]>([
    { id: 1, rol: "Administrador", usuarios: 2, permisos: "Acceso completo" },
    { id: 2, rol: "Gerente", usuarios: 3, permisos: "Acceso a reportes y configuración" },
    { id: 3, rol: "Recepcionista", usuarios: 4, permisos: "Gestión de citas y clientes" },
    { id: 4, rol: "Estilista", usuarios: 5, permisos: "Gestión de servicios" },
    { id: 5, rol: "Contador", usuarios: 1, permisos: "Acceso a finanzas" },
  ])

  const [backups, setBackups] = useState<Backup[]>([
    { id: 1, fecha: "12/05/2023 00:00", tamaño: "1.2 GB", estado: "Completado" },
    { id: 2, fecha: "11/05/2023 00:00", tamaño: "1.1 GB", estado: "Completado" },
    { id: 3, fecha: "10/05/2023 00:00", tamaño: "1.1 GB", estado: "Completado" },
    { id: 4, fecha: "09/05/2023 00:00", tamaño: "1.0 GB", estado: "Completado" },
  ])

  // Estados para los modales
  const [editUserModal, setEditUserModal] = useState(false)
  const [permissionsModal, setPermissionsModal] = useState(false)
  const [deleteUserModal, setDeleteUserModal] = useState(false)
  const [newRoleModal, setNewRoleModal] = useState(false)
  const [backupModal, setBackupModal] = useState(false)
  const [newUserModal, setNewUserModal] = useState(false)

  // Estado para el usuario seleccionado
  const [selectedUser, setSelectedUser] = useState<Usuario | null>(null)
  const [selectedRol, setSelectedRol] = useState<Rol | null>(null)

  // Estado para el proceso de backup
  const [isBackingUp, setIsBackingUp] = useState(false)
  const [backupComplete, setBackupComplete] = useState(false)

  // Estado para la descarga de backup
  const [isDownloading, setIsDownloading] = useState<number | null>(null)

  // Toast para notificaciones
  const { toast } = useToast()

  // Función para editar usuario
  const handleEditUser = (user: Usuario) => {
    setSelectedUser(user)
    setEditUserModal(true)
  }

  // Función para gestionar permisos
  const handleManagePermissions = (user: Usuario) => {
    setSelectedUser(user)
    setPermissionsModal(true)
  }

  // Función para eliminar usuario
  const handleDeleteUser = (user: Usuario) => {
    setSelectedUser(user)
    setDeleteUserModal(true)
  }

  // Función para confirmar eliminación de usuario
  const confirmDeleteUser = () => {
    if (selectedUser) {
      setUsuarios(usuarios.filter((u) => u.id !== selectedUser.id))
      toast({
        title: "Usuario eliminado",
        description: `El usuario ${selectedUser.nombre} ha sido eliminado correctamente.`,
      })
      setDeleteUserModal(false)
    }
  }

  // Función para guardar cambios de usuario
  const saveUserChanges = (e: React.FormEvent) => {
    e.preventDefault()
    if (selectedUser) {
      setUsuarios(usuarios.map((u) => (u.id === selectedUser.id ? selectedUser : u)))
      toast({
        title: "Usuario actualizado",
        description: "Los datos del usuario han sido actualizados correctamente.",
      })
      setEditUserModal(false)
    }
  }

  // Función para guardar permisos
  const savePermissions = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("esto es una prueba")
    toast({
      title: "Permisos actualizados",
      description: `Los permisos de ${selectedUser?.nombre} han sido actualizados correctamente.`,
    })
    setPermissionsModal(false)
  }

  // Función para crear nuevo rol
  const createNewRole = (e: React.FormEvent) => {
    e.preventDefault()
    const newRole: Rol = {
      id: roles.length + 1,
      rol: "Nuevo Rol",
      usuarios: 0,
      permisos: "Sin permisos asignados",
    }
    setRoles([...roles, newRole])
    toast({
      title: "Rol creado",
      description: "El nuevo rol ha sido creado correctamente.",
    })
    setNewRoleModal(false)
  }

  // Función para crear backup manual
  const createManualBackup = () => {
    setBackupModal(true)
    setIsBackingUp(true)
    setBackupComplete(false)

    // Simular proceso de backup
    setTimeout(() => {
      setIsBackingUp(false)
      setBackupComplete(true)

      // Agregar nuevo backup a la lista
      const now = new Date()
      const formattedDate = `${now.getDate().toString().padStart(2, "0")}/${(now.getMonth() + 1).toString().padStart(2, "0")}/${now.getFullYear()} ${now.getHours().toString().padStart(2, "0")}:${now.getMinutes().toString().padStart(2, "0")}`

      const newBackup: Backup = {
        id: backups.length + 1,
        fecha: formattedDate,
        tamaño: "1.3 GB",
        estado: "Completado",
      }

      setBackups([newBackup, ...backups])
    }, 3000)
  }

  // Función para descargar backup
  const downloadBackup = (backupId: number) => {
    setIsDownloading(backupId)

    // Simular descarga
    setTimeout(() => {
      setIsDownloading(null)
      toast({
        title: "Backup descargado",
        description: "El archivo de backup ha sido descargado correctamente.",
      })
    }, 2000)
  }

  // Función para crear nuevo usuario
  const createNewUser = (e: React.FormEvent) => {
    e.preventDefault()
    const newUser: Usuario = {
      id: usuarios.length + 1,
      nombre: "Nuevo Usuario",
      rol: "Recepcionista",
      acceso: "Nunca",
      estado: "Activo",
    }
    setUsuarios([...usuarios, newUser])
    toast({
      title: "Usuario creado",
      description: "El nuevo usuario ha sido creado correctamente.",
    })
    setNewUserModal(false)
  }

  return (



    <AuthGuard>
      <ModuleLayout moduleType="configuracion">


        <div className="flex h-screen bg-gray-50 dark:bg-gray-900">

          <div className="flex flex-col flex-1 overflow-hidden">
            <main className="flex-1 overflow-y-auto p-9">
              <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold dark:text-white">Seguridad</h1>
                <Button
                  onClick={() => setNewUserModal(true)}
                  className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 flex items-center gap-2 dark:bg-gray-800 dark:hover:bg-gray-700"
                >
                  <UserPlus className="w-4 h-4" />
                  Nuevo Usuario
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
                <div className="bg-white rounded-xl p-6 shadow-sm dark:bg-gray-800 dark:text-gray-200">
                  <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">Usuarios Activos</div>
                  <div className="text-2xl font-bold">{usuarios.filter((u) => u.estado === "Activo").length}</div>
                  <div className="flex items-center mt-2 text-sm text-green-600 dark:text-green-400">
                    <TrendingUp className="w-4 h-4 mr-1" />
                    <span>+2 vs. mes anterior</span>
                  </div>
                </div>
                <div className="bg-white rounded-xl p-6 shadow-sm dark:bg-gray-800 dark:text-gray-200">
                  <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">Intentos Fallidos</div>
                  <div className="text-2xl font-bold">8</div>
                  <div className="flex items-center mt-2 text-sm text-red-600 dark:text-red-400">
                    <TrendingUp className="w-4 h-4 mr-1" />
                    <span>+3 vs. mes anterior</span>
                  </div>
                </div>
                <div className="bg-white rounded-xl p-6 shadow-sm dark:bg-gray-800 dark:text-gray-200">
                  <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">Último Backup</div>
                  <div className="text-2xl font-bold">{backups[0]?.fecha.split(" ")[0]}</div>
                  <div className="flex items-center mt-2 text-sm text-green-600 dark:text-green-400">
                    <Check className="w-4 h-4 mr-1" />
                    <span>Hace 3 días</span>
                  </div>
                </div>
                <div className="bg-white rounded-xl p-6 shadow-sm dark:bg-gray-800 dark:text-gray-200">
                  <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">Estado del Sistema</div>
                  <div className="text-2xl font-bold">Seguro</div>
                  <div className="flex items-center mt-2 text-sm text-green-600 dark:text-green-400">
                    <Shield className="w-4 h-4 mr-1" />
                    <span>Sin alertas activas</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="bg-white rounded-xl p-6 shadow-sm dark:bg-gray-800">
                  <h2 className="font-medium mb-4 dark:text-white">Usuarios del Sistema</h2>
                  <div className="overflow-y-auto max-h-96">
                    <table className="w-full">
                      <thead>
                        <tr className="text-left text-sm text-gray-500 dark:text-gray-400 border-b dark:border-gray-700">
                          <th className="pb-3 font-medium">Usuario</th>
                          <th className="pb-3 font-medium">Rol</th>
                          <th className="pb-3 font-medium">Último Acceso</th>
                          <th className="pb-3 font-medium">Estado</th>
                          <th className="pb-3 font-medium">Acciones</th>
                        </tr>
                      </thead>
                      <tbody>
                        {usuarios.map((usuario, index) => (
                          <tr key={index} className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700">
                            <td className="py-3 dark:text-gray-200">
                              <div className="flex items-center">
                                <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-600 mr-3 flex items-center justify-center">
                                  {usuario.nombre.charAt(0)}
                                </div>
                                {usuario.nombre}
                              </div>
                            </td>
                            <td className="py-3 dark:text-gray-200">{usuario.rol}</td>
                            <td className="py-3 dark:text-gray-200">{usuario.acceso}</td>
                            <td className="py-3">
                              <span
                                className={`px-2 py-1 rounded-full text-xs ${usuario.estado === "Activo"
                                  ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                                  : "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300"
                                  }`}
                              >
                                {usuario.estado}
                              </span>
                            </td>
                            <td className="py-3">
                              <div className="flex gap-2">
                                <button
                                  className="p-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                                  onClick={() => handleEditUser(usuario)}
                                >
                                  <Pencil className="w-4 h-4" />
                                </button>
                                <button
                                  className="p-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                                  onClick={() => handleManagePermissions(usuario)}
                                >
                                  <Key className="w-4 h-4" />
                                </button>
                                <button
                                  className="p-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                                  onClick={() => handleDeleteUser(usuario)}
                                >
                                  <Trash className="w-4 h-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
                <div className="bg-white rounded-xl p-6 shadow-sm dark:bg-gray-800">
                  <h2 className="font-medium mb-4 dark:text-white">Registro de Actividad</h2>
                  <div className="overflow-y-auto max-h-96">
                    <div className="space-y-3">
                      {actividades.map((actividad, index) => (
                        <div key={index} className="p-3 border rounded-lg dark:border-gray-700 dark:text-gray-200">
                          <div className="flex justify-between items-center">
                            <div className="font-medium">{actividad.accion}</div>
                            <div className="text-xs text-gray-500 dark:text-gray-400">{actividad.fecha}</div>
                          </div>
                          <div className="flex justify-between items-center mt-1">
                            <div className="text-sm text-gray-600 dark:text-gray-400">Usuario: {actividad.usuario}</div>
                            <div className="text-xs text-gray-500 dark:text-gray-400">IP: {actividad.ip}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white rounded-xl p-6 shadow-sm dark:bg-gray-800">
                  <h2 className="font-medium mb-4 dark:text-white">Roles y Permisos</h2>
                  <div className="space-y-4">
                    {roles.map((rol, index) => (
                      <div key={index} className="p-3 border rounded-lg dark:border-gray-700 dark:text-gray-200">
                        <div className="flex justify-between items-center">
                          <div className="font-medium">{rol.rol}</div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">{rol.usuarios} usuarios</div>
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">{rol.permisos}</div>
                        <div className="flex justify-end mt-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setSelectedRol(rol)
                              toast({
                                title: "Editar permisos",
                                description: `Editando permisos para el rol ${rol.rol}`,
                              })
                            }}
                          >
                            Editar permisos
                          </Button>
                        </div>
                      </div>
                    ))}
                    <Button
                      variant="outline"
                      className="w-full py-2 border border-dashed rounded-lg text-gray-500 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-gray-700 flex items-center justify-center gap-2"
                      onClick={() => setNewRoleModal(true)}
                    >
                      <Plus className="w-4 h-4" />
                      Crear nuevo rol
                    </Button>
                  </div>
                </div>
                <div className="bg-white rounded-xl p-6 shadow-sm dark:bg-gray-800">
                  <h2 className="font-medium mb-4 dark:text-white">Configuración de Seguridad</h2>
                  <div className="space-y-4">
                    <div className="p-4 border rounded-lg dark:border-gray-700 dark:text-gray-200">
                      <div className="flex justify-between items-center">
                        <div className="font-medium">Autenticación de dos factores</div>
                        <Switch id="toggle-2fa" />
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        Requiere un código adicional al iniciar sesión
                      </div>
                    </div>
                    <div className="p-4 border rounded-lg dark:border-gray-700 dark:text-gray-200">
                      <div className="flex justify-between items-center">
                        <div className="font-medium">Política de contraseñas</div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            toast({
                              title: "Configuración de contraseñas",
                              description: "Configurando política de contraseñas",
                            })
                          }}
                        >
                          Configurar
                        </Button>
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        Mínimo 8 caracteres, incluir números y símbolos
                      </div>
                    </div>
                    <div className="p-4 border rounded-lg dark:border-gray-700 dark:text-gray-200">
                      <div className="flex justify-between items-center">
                        <div className="font-medium">Bloqueo de cuenta</div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            toast({
                              title: "Configuración de bloqueo",
                              description: "Configurando política de bloqueo de cuentas",
                            })
                          }}
                        >
                          Configurar
                        </Button>
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        Bloquear después de 5 intentos fallidos
                      </div>
                    </div>
                    <div className="p-4 border rounded-lg dark:border-gray-700 dark:text-gray-200">
                      <div className="flex justify-between items-center">
                        <div className="font-medium">Tiempo de sesión</div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            toast({
                              title: "Configuración de sesión",
                              description: "Configurando tiempo de sesión",
                            })
                          }}
                        >
                          Configurar
                        </Button>
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        Cerrar sesión después de 30 minutos de inactividad
                      </div>
                    </div>
                  </div>
                </div>
                <div className="bg-white rounded-xl p-6 shadow-sm dark:bg-gray-800">
                  <h2 className="font-medium mb-4 dark:text-white">Copias de Seguridad</h2>
                  <div className="space-y-4">
                    <div className="p-4 border rounded-lg dark:border-gray-700 dark:text-gray-200">
                      <div className="flex justify-between items-center">
                        <div className="font-medium">Backup Automático</div>
                        <Switch id="toggle-backup" defaultChecked />
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        Se realiza diariamente a las 00:00
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="font-medium dark:text-white">Backups Recientes</div>
                      {backups.map((backup, index) => (
                        <div
                          key={index}
                          className="p-3 border rounded-lg dark:border-gray-700 flex justify-between items-center dark:text-gray-200"
                        >
                          <div>
                            <div className="text-sm font-medium">{backup.fecha}</div>
                            <div className="text-xs text-gray-500 dark:text-gray-400">{backup.tamaño}</div>
                          </div>
                          <div className="flex gap-2">
                            <span className="px-2 py-1 bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 rounded-full text-xs">
                              {backup.estado}
                            </span>
                            <button
                              className="p-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                              onClick={() => downloadBackup(backup.id)}
                              disabled={isDownloading === backup.id}
                            >
                              {isDownloading === backup.id ? (
                                <div className="w-4 h-4 border-2 border-t-2 border-gray-500 rounded-full animate-spin" />
                              ) : (
                                <Download className="w-4 h-4" />
                              )}
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                    <Button
                      className="w-full py-2 bg-black text-white rounded-lg hover:bg-gray-800 dark:bg-gray-700 dark:hover:bg-gray-600 flex items-center justify-center gap-2"
                      onClick={createManualBackup}
                    >
                      <Save className="w-4 h-4" />
                      Crear backup manual
                    </Button>
                  </div>
                </div>
              </div>
            </main>
          </div>


          {/* Modal para editar usuario */}
          <Dialog open={editUserModal} onOpenChange={setEditUserModal}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Editar Usuario</DialogTitle>
              </DialogHeader>
              <form onSubmit={saveUserChanges}>
                <div className="space-y-4 py-2">
                  <div className="space-y-2">
                    <Label htmlFor="nombre">Nombre</Label>
                    <Input
                      id="nombre"
                      value={selectedUser?.nombre || ""}
                      onChange={(e) => selectedUser && setSelectedUser({ ...selectedUser, nombre: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="rol">Rol</Label>
                    <Select
                      value={selectedUser?.rol}
                      onValueChange={(value) => selectedUser && setSelectedUser({ ...selectedUser, rol: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar rol" />
                      </SelectTrigger>
                      <SelectContent>
                        {roles.map((rol) => (
                          <SelectItem key={rol.id} value={rol.rol}>
                            {rol.rol}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="estado">Estado</Label>
                    <Select
                      value={selectedUser?.estado}
                      onValueChange={(value) => selectedUser && setSelectedUser({ ...selectedUser, estado: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar estado" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Activo">Activo</SelectItem>
                        <SelectItem value="Inactivo">Inactivo</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <DialogFooter className="mt-4">
                  <Button type="button" variant="outline" onClick={() => setEditUserModal(false)}>
                    Cancelar
                  </Button>
                  <Button type="submit">Guardar cambios</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>

          {/* Modal para gestionar permisos */}
          <Dialog open={permissionsModal} onOpenChange={setPermissionsModal}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Gestionar Permisos - {selectedUser?.nombre}</DialogTitle>
              </DialogHeader>
              <form onSubmit={savePermissions}>
                <div className="space-y-4 py-2">
                  <div className="space-y-2">
                    <Label>Módulos</Label>
                    <div className="space-y-2">
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
                          <Switch
                            id={`modulo-${modulo}`}
                            defaultChecked={["Dashboard", "Clientes", "Agenda"].includes(modulo)}
                          />
                          <Label htmlFor={`modulo-${modulo}`}>{modulo}</Label>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Permisos</Label>
                    <div className="space-y-2">
                      {["Ver", "Crear", "Editar", "Eliminar", "Exportar"].map((permiso) => (
                        <div key={permiso} className="flex items-center space-x-2">
                          <Switch id={`permiso-${permiso}`} defaultChecked={["Ver", "Crear"].includes(permiso)} />
                          <Label htmlFor={`permiso-${permiso}`}>{permiso}</Label>
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

          {/* Modal para eliminar usuario */}
          <Dialog open={deleteUserModal} onOpenChange={setDeleteUserModal}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Eliminar Usuario</DialogTitle>
              </DialogHeader>
              <div className="py-4">
                <p>
                  ¿Está seguro que desea eliminar al usuario <strong>{selectedUser?.nombre}</strong>?
                </p>
                <p className="text-sm text-gray-500 mt-2">Esta acción no se puede deshacer.</p>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setDeleteUserModal(false)}>
                  Cancelar
                </Button>
                <Button type="button" variant="destructive" onClick={confirmDeleteUser}>
                  Eliminar
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* Modal para crear nuevo rol */}
          <Dialog open={newRoleModal} onOpenChange={setNewRoleModal}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Crear Nuevo Rol</DialogTitle>
              </DialogHeader>
              <form onSubmit={createNewRole}>
                <div className="space-y-4 py-2">
                  <div className="space-y-2">
                    <Label htmlFor="rolName">Nombre del Rol</Label>
                    <Input id="rolName" placeholder="Ej: Supervisor" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="rolDescription">Descripción</Label>
                    <Textarea id="rolDescription" placeholder="Describe las funciones de este rol" />
                  </div>
                  <div className="space-y-2">
                    <Label>Permisos</Label>
                    <div className="space-y-2">
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
                          <Switch id={`new-modulo-${modulo}`} />
                          <Label htmlFor={`new-modulo-${modulo}`}>{modulo}</Label>
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

          {/* Modal para backup manual */}
          <Dialog open={backupModal} onOpenChange={setBackupModal}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Backup Manual</DialogTitle>
              </DialogHeader>
              <div className="py-4 flex flex-col items-center justify-center">
                {isBackingUp ? (
                  <>
                    <div className="w-12 h-12 border-4 border-t-4 border-gray-200 border-t-black rounded-full animate-spin mb-4"></div>
                    <p>Creando backup...</p>
                    <p className="text-sm text-gray-500 mt-2">Este proceso puede tardar unos minutos.</p>
                  </>
                ) : backupComplete ? (
                  <>
                    <div className="w-12 h-12 bg-green-100 text-green-800 rounded-full flex items-center justify-center mb-4">
                      <Check className="w-6 h-6" />
                    </div>
                    <p>¡Backup finalizado!</p>
                    <p className="text-sm text-gray-500 mt-2">El backup se ha creado correctamente.</p>
                  </>
                ) : null}
              </div>
              <DialogFooter>
                {backupComplete ? (
                  <Button type="button" onClick={() => setBackupModal(false)}>
                    Cerrar
                  </Button>
                ) : (
                  <Button type="button" variant="outline" onClick={() => setBackupModal(false)} disabled={isBackingUp}>
                    Cancelar
                  </Button>
                )}
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* Modal para nuevo usuario */}
          <Dialog open={newUserModal} onOpenChange={setNewUserModal}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Nuevo Usuario</DialogTitle>
              </DialogHeader>
              <form onSubmit={createNewUser}>
                <div className="space-y-4 py-2">
                  <div className="space-y-2">
                    <Label htmlFor="newUserName">Nombre completo</Label>
                    <Input id="newUserName" placeholder="Ej: Juan Pérez" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="newUserEmail">Correo electrónico</Label>
                    <Input id="newUserEmail" type="email" placeholder="ejemplo@correo.com" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="newUserRole">Rol</Label>
                    <Select defaultValue="Recepcionista">
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar rol" />
                      </SelectTrigger>
                      <SelectContent>
                        {roles.map((rol) => (
                          <SelectItem key={rol.id} value={rol.rol}>
                            {rol.rol}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="newUserPassword">Contraseña</Label>
                    <Input id="newUserPassword" type="password" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="newUserPasswordConfirm">Confirmar contraseña</Label>
                    <Input id="newUserPasswordConfirm" type="password" />
                  </div>
                </div>
                <DialogFooter className="mt-4">
                  <Button type="button" variant="outline" onClick={() => setNewUserModal(false)}>
                    Cancelar
                  </Button>
                  <Button type="submit">Crear Usuario</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>

        </div>
      </ModuleLayout>
    </AuthGuard>
  )
}

