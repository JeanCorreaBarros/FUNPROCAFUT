"use client"

import type React from "react"
import { useState } from "react"
import dynamic from "next/dynamic"
import { AuthGuard } from "@/components/auth-guard"
import { ModuleLayout } from "@/components/module-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"
import { UserPlus, Search, Filter, Pencil, Key, Trash, Download, Upload } from "lucide-react"

// Tipos para los datos
interface Usuario {
  id: number
  nombre: string
  email: string
  rol: string
  acceso: string
  estado: string
  creado: string
}

export default function UsuariosPage() {
  // Estados para los datos
  const [usuarios, setUsuarios] = useState<Usuario[]>([
    {
      id: 1,
      nombre: "Carlos Pérez",
      email: "carlos@ejemplo.com",
      rol: "Administrador",
      acceso: "15/05/2023 10:25",
      estado: "Activo",
      creado: "01/01/2023",
    },
    {
      id: 2,
      nombre: "María López",
      email: "maria@ejemplo.com",
      rol: "Gerente",
      acceso: "14/05/2023 15:40",
      estado: "Activo",
      creado: "05/01/2023",
    },
    {
      id: 3,
      nombre: "Ana Martínez",
      email: "ana@ejemplo.com",
      rol: "Recepcionista",
      acceso: "15/05/2023 08:15",
      estado: "Activo",
      creado: "10/01/2023",
    },
    {
      id: 4,
      nombre: "Juan Rodríguez",
      email: "juan@ejemplo.com",
      rol: "Estilista",
      acceso: "13/05/2023 12:30",
      estado: "Activo",
      creado: "15/01/2023",
    },
    {
      id: 5,
      nombre: "Laura Sánchez",
      email: "laura@ejemplo.com",
      rol: "Recepcionista",
      acceso: "10/05/2023 09:45",
      estado: "Inactivo",
      creado: "20/01/2023",
    },
    {
      id: 6,
      nombre: "Roberto Gómez",
      email: "roberto@ejemplo.com",
      rol: "Contador",
      acceso: "12/05/2023 14:20",
      estado: "Activo",
      creado: "25/01/2023",
    },
    {
      id: 7,
      nombre: "Sofía Ramírez",
      email: "sofia@ejemplo.com",
      rol: "Estilista",
      acceso: "11/05/2023 11:10",
      estado: "Activo",
      creado: "30/01/2023",
    },
    {
      id: 8,
      nombre: "Pedro Álvarez",
      email: "pedro@ejemplo.com",
      rol: "Gerente",
      acceso: "09/05/2023 16:35",
      estado: "Activo",
      creado: "05/02/2023",
    },
    {
      id: 9,
      nombre: "Lucía Fernández",
      email: "lucia@ejemplo.com",
      rol: "Recepcionista",
      acceso: "08/05/2023 13:50",
      estado: "Inactivo",
      creado: "10/02/2023",
    },
    {
      id: 10,
      nombre: "Miguel Torres",
      email: "miguel@ejemplo.com",
      rol: "Administrador",
      acceso: "07/05/2023 09:15",
      estado: "Activo",
      creado: "15/02/2023",
    },
  ])

  // Estados para los modales
  const [newUserModal, setNewUserModal] = useState(false)
  const [editUserModal, setEditUserModal] = useState(false)
  const [deleteUserModal, setDeleteUserModal] = useState(false)
  const [permissionsModal, setPermissionsModal] = useState(false)
  const [importModal, setImportModal] = useState(false)

  // Estado para el usuario seleccionado
  const [selectedUser, setSelectedUser] = useState<Usuario | null>(null)

  // Estado para la búsqueda
  const [searchTerm, setSearchTerm] = useState("")

  // Toast para notificaciones
  const { toast } = useToast()

  // Función para filtrar usuarios
  const filteredUsers = usuarios.filter(
    (user) =>
      user.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.rol.toLowerCase().includes(searchTerm.toLowerCase()),
  )

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
    toast({
      title: "Permisos actualizados",
      description: `Los permisos de ${selectedUser?.nombre} han sido actualizados correctamente.`,
    })
    setPermissionsModal(false)
  }

  // Función para crear nuevo usuario
  const createNewUser = (e: React.FormEvent) => {
    e.preventDefault()
    const newUser: Usuario = {
      id: usuarios.length + 1,
      nombre: "Nuevo Usuario",
      email: "nuevo@ejemplo.com",
      rol: "Recepcionista",
      acceso: "Nunca",
      estado: "Activo",
      creado: new Date().toLocaleDateString(),
    }
    setUsuarios([...usuarios, newUser])
    toast({
      title: "Usuario creado",
      description: "El nuevo usuario ha sido creado correctamente.",
    })
    setNewUserModal(false)
  }

  // Función para exportar usuarios
  const exportUsers = () => {
    toast({
      title: "Exportando usuarios",
      description: "Los usuarios han sido exportados correctamente.",
    })
  }

  // Función para importar usuarios
  const importUsers = (e: React.FormEvent) => {
    e.preventDefault()
    toast({
      title: "Importando usuarios",
      description: "Los usuarios han sido importados correctamente.",
    })
    setImportModal(false)
  }

  return (


    <AuthGuard>
      <ModuleLayout moduleType="configuracion">

        <div className="flex h-screen bg-gray-50 dark:bg-gray-900">

          <div className="flex flex-col flex-1 overflow-hidden">

            <main className="flex-1 overflow-y-auto p-9">
              <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold dark:text-white">Usuarios del Sistema</h1>
                <div className="flex gap-2">
                  <Button variant="outline" onClick={exportUsers} className="flex items-center gap-2">
                    <Download className="w-4 h-4" />
                    Exportar
                  </Button>
                  <Button variant="outline" onClick={() => setImportModal(true)} className="flex items-center gap-2">
                    <Upload className="w-4 h-4" />
                    Importar
                  </Button>
                  <Button
                    onClick={() => setNewUserModal(true)}
                    className="bg-black text-white hover:bg-gray-800 flex items-center gap-2 dark:bg-gray-800 dark:hover:bg-gray-700"
                  >
                    <UserPlus className="w-4 h-4" />
                    Nuevo Usuario
                  </Button>
                </div>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm dark:bg-gray-800">
                <div className="flex flex-col md:flex-row justify-between mb-6 gap-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                    <Input
                      placeholder="Buscar usuarios..."
                      className="pl-10"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" className="flex items-center gap-2">
                      <Filter className="w-4 h-4" />
                      Filtrar
                    </Button>
                  </div>
                </div>

                <Tabs defaultValue="todos">
                  <TabsList className="mb-4">
                    <TabsTrigger value="todos">Todos</TabsTrigger>
                    <TabsTrigger value="activos">Activos</TabsTrigger>
                    <TabsTrigger value="inactivos">Inactivos</TabsTrigger>
                    <TabsTrigger value="administradores">Administradores</TabsTrigger>
                  </TabsList>

                  <TabsContent value="todos" className="space-y-4">
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="text-left text-sm text-gray-500 dark:text-gray-400 border-b dark:border-gray-700">
                            <th className="pb-3 font-medium">Usuario</th>
                            <th className="pb-3 font-medium">Email</th>
                            <th className="pb-3 font-medium">Rol</th>
                            <th className="pb-3 font-medium">Último Acceso</th>
                            <th className="pb-3 font-medium">Estado</th>
                            <th className="pb-3 font-medium">Creado</th>
                            <th className="pb-3 font-medium">Acciones</th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredUsers.map((usuario) => (
                            <tr
                              key={usuario.id}
                              className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
                            >
                              <td className="py-3 dark:text-gray-200">
                                <div className="flex items-center">
                                  <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-600 mr-3 flex items-center justify-center">
                                    {usuario.nombre.charAt(0)}
                                  </div>
                                  {usuario.nombre}
                                </div>
                              </td>
                              <td className="py-3 dark:text-gray-200">{usuario.email}</td>
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
                              <td className="py-3 dark:text-gray-200">{usuario.creado}</td>
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

                    <div className="flex items-center justify-between">
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        Mostrando {filteredUsers.length} de {usuarios.length} usuarios
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

                  <TabsContent value="activos">
                    <div className="p-4 text-center text-gray-500 dark:text-gray-400">Mostrando usuarios activos</div>
                  </TabsContent>

                  <TabsContent value="inactivos">
                    <div className="p-4 text-center text-gray-500 dark:text-gray-400">Mostrando usuarios inactivos</div>
                  </TabsContent>

                  <TabsContent value="administradores">
                    <div className="p-4 text-center text-gray-500 dark:text-gray-400">Mostrando administradores</div>
                  </TabsContent>
                </Tabs>
              </div>
            </main>
          </div>



          {/* Modal para nuevo usuario */}
          <Dialog open={newUserModal} onOpenChange={setNewUserModal}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Nuevo Usuario</DialogTitle>
              </DialogHeader>
              <form onSubmit={createNewUser}>
                <div className="space-y-4 py-2">
                  <div className="space-y-2">
                    <label htmlFor="newUserName" className="text-sm font-medium">
                      Nombre completo
                    </label>
                    <Input id="newUserName" placeholder="Ej: Juan Pérez" />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="newUserEmail" className="text-sm font-medium">
                      Correo electrónico
                    </label>
                    <Input id="newUserEmail" type="email" placeholder="ejemplo@correo.com" />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="newUserRole" className="text-sm font-medium">
                      Rol
                    </label>
                    <Select defaultValue="Recepcionista">
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar rol" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Administrador">Administrador</SelectItem>
                        <SelectItem value="Gerente">Gerente</SelectItem>
                        <SelectItem value="Recepcionista">Recepcionista</SelectItem>
                        <SelectItem value="Estilista">Estilista</SelectItem>
                        <SelectItem value="Contador">Contador</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="newUserPassword" className="text-sm font-medium">
                      Contraseña
                    </label>
                    <Input id="newUserPassword" type="password" />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="newUserPasswordConfirm" className="text-sm font-medium">
                      Confirmar contraseña
                    </label>
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

          {/* Modal para editar usuario */}
          <Dialog open={editUserModal} onOpenChange={setEditUserModal}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Editar Usuario</DialogTitle>
              </DialogHeader>
              <form onSubmit={saveUserChanges}>
                <div className="space-y-4 py-2">
                  <div className="space-y-2">
                    <label htmlFor="nombre" className="text-sm font-medium">
                      Nombre
                    </label>
                    <Input
                      id="nombre"
                      value={selectedUser?.nombre || ""}
                      onChange={(e) => selectedUser && setSelectedUser({ ...selectedUser, nombre: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="email" className="text-sm font-medium">
                      Email
                    </label>
                    <Input
                      id="email"
                      value={selectedUser?.email || ""}
                      onChange={(e) => selectedUser && setSelectedUser({ ...selectedUser, email: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="rol" className="text-sm font-medium">
                      Rol
                    </label>
                    <Select
                      value={selectedUser?.rol}
                      onValueChange={(value) => selectedUser && setSelectedUser({ ...selectedUser, rol: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar rol" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Administrador">Administrador</SelectItem>
                        <SelectItem value="Gerente">Gerente</SelectItem>
                        <SelectItem value="Recepcionista">Recepcionista</SelectItem>
                        <SelectItem value="Estilista">Estilista</SelectItem>
                        <SelectItem value="Contador">Contador</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="estado" className="text-sm font-medium">
                      Estado
                    </label>
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
                    <h3 className="text-sm font-medium">Módulos</h3>

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
                            id={`modulo-${modulo}`}
                            defaultChecked={["Dashboard", "Clientes", "Agenda"].includes(modulo)}
                            className="rounded border-gray-300 text-black focus:ring-black dark:border-gray-600 dark:bg-gray-800 dark:focus:ring-gray-600"
                          />
                          <label htmlFor={`modulo-${modulo}`} className="text-sm">
                            {modulo}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-sm font-medium">Permisos</h3>
                    <div className="space-y-2">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b dark:border-gray-700">
                            <th className="text-left py-2">Acción</th>
                            <th className="text-center py-2">Ver</th>
                            <th className="text-center py-2">Crear</th>
                            <th className="text-center py-2">Editar</th>
                            <th className="text-center py-2">Eliminar</th>
                          </tr>
                        </thead>
                        <tbody>
                          {["Usuarios", "Roles", "Backups", "Configuración"].map((item) => (
                            <tr key={item} className="border-b dark:border-gray-700">
                              <td className="py-2">{item}</td>
                              <td className="text-center py-2">
                                <input
                                  type="checkbox"
                                  defaultChecked
                                  className="rounded border-gray-300 text-black focus:ring-black dark:border-gray-600 dark:bg-gray-800 dark:focus:ring-gray-600"
                                />
                              </td>
                              <td className="text-center py-2">
                                <input
                                  type="checkbox"
                                  defaultChecked={item !== "Backups"}
                                  className="rounded border-gray-300 text-black focus:ring-black dark:border-gray-600 dark:bg-gray-800 dark:focus:ring-gray-600"
                                />
                              </td>
                              <td className="text-center py-2">
                                <input
                                  type="checkbox"
                                  defaultChecked={item !== "Backups"}
                                  className="rounded border-gray-300 text-black focus:ring-black dark:border-gray-600 dark:bg-gray-800 dark:focus:ring-gray-600"
                                />
                              </td>
                              <td className="text-center py-2">
                                <input
                                  type="checkbox"
                                  defaultChecked={item === "Usuarios"}
                                  className="rounded border-gray-300 text-black focus:ring-black dark:border-gray-600 dark:bg-gray-800 dark:focus:ring-gray-600"
                                />
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
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

          {/* Modal para importar usuarios */}
          <Dialog open={importModal} onOpenChange={setImportModal}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Importar Usuarios</DialogTitle>
              </DialogHeader>
              <form onSubmit={importUsers}>
                <div className="space-y-4 py-2">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Archivo CSV o Excel</label>
                    <div className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg p-6 text-center">
                      <Upload className="mx-auto h-10 w-10 text-gray-400" />
                      <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                        Arrastra y suelta un archivo o haz clic para seleccionar
                      </p>
                      <input type="file" className="hidden" />
                      <Button type="button" variant="outline" size="sm" className="mt-2">
                        Seleccionar archivo
                      </Button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Opciones de importación</label>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id="overwrite"
                          className="rounded border-gray-300 text-black focus:ring-black dark:border-gray-600 dark:bg-gray-800 dark:focus:ring-gray-600"
                        />
                        <label htmlFor="overwrite" className="text-sm">
                          Sobrescribir usuarios existentes
                        </label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id="sendEmail"
                          className="rounded border-gray-300 text-black focus:ring-black dark:border-gray-600 dark:bg-gray-800 dark:focus:ring-gray-600"
                        />
                        <label htmlFor="sendEmail" className="text-sm">
                          Enviar email de bienvenida
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
                <DialogFooter className="mt-4">
                  <Button type="button" variant="outline" onClick={() => setImportModal(false)}>
                    Cancelar
                  </Button>
                  <Button type="submit">Importar</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </ModuleLayout>
    </AuthGuard>

  )
}


