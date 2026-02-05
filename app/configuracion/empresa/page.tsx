"use client"

import { useState } from "react"
import dynamic from "next/dynamic"
import { AuthGuard } from "@/components/auth-guard"
import { ModuleLayout } from "@/components/module-layout"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ArrowLeft, Check, Pencil, Plus, Save, Trash, Upload } from "lucide-react"
import Link from "next/link"
import RegistroSedeForm from "@/components/registro-sede-form"

// Tipos para las sedes
type Sede = {
  id: string
  nombre: string
  direccion: string
  telefono: string
  ciudad: string
  principal: boolean
}

export default function EmpresaPage() {
  const [datosEmpresa, setDatosEmpresa] = useState({
    nombre: "B360 Salon",
    nit: "900.123.456-7",
    direccion: "Calle Principal #123",
    ciudad: "Bogotá",
    telefono: "+57 300 123 4567",
    email: "contacto@b360salon.com",
    sitioWeb: "www.b360salon.com",
    logo: "/placeholder.svg?height=96&width=96",
    manejaSedes: true,
  })

  const [sedes, setSedes] = useState<Sede[]>([
    {
      id: "1",
      nombre: "Sede Principal",
      direccion: "Calle Principal #123",
      telefono: "+57 300 123 4567",
      ciudad: "Bogotá",
      principal: true,
    },
    {
      id: "2",
      nombre: "Sede Norte",
      direccion: "Avenida Norte #456",
      telefono: "+57 300 765 4321",
      ciudad: "Bogotá",
      principal: false,
    },
  ])

  const [nuevaSede, setNuevaSede] = useState<Partial<Sede>>({})
  const [mostrarModalSede, setMostrarModalSede] = useState(false)
  const [editandoId, setEditandoId] = useState<string | null>(null)

  const guardarCambios = () => {
    alert("Cambios guardados correctamente")
  }

  const agregarSede = () => {
    if (!nuevaSede.nombre || !nuevaSede.direccion) {
      alert("Por favor complete los campos obligatorios")
      return
    }

    const id = (sedes.length + 1).toString()
    setSedes([...sedes, { ...nuevaSede, id } as Sede])
    setNuevaSede({})
    setMostrarModalSede(false)
  }

  const editarSede = (id: string) => {
    const sede = sedes.find((s) => s.id === id)
    if (sede) {
      setNuevaSede(sede)
      setEditandoId(id)
      setMostrarModalSede(true)
    }
  }

  const actualizarSede = () => {
    if (!editandoId) return

    const sedesActualizadas = sedes.map((sede) =>
      sede.id === editandoId ? ({ ...nuevaSede, id: editandoId } as Sede) : sede,
    )

    setSedes(sedesActualizadas)
    setNuevaSede({})
    setEditandoId(null)
    setMostrarModalSede(false)
  }

  const eliminarSede = (id: string) => {
    const sedesActualizadas = sedes.filter((sede) => sede.id !== id)
    setSedes(sedesActualizadas)
  }

  return (

    <AuthGuard>
      <ModuleLayout moduleType="configuracion">

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="container mx-auto "
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold">Información de la Empresa</h1>
            </div>
            <Button onClick={guardarCambios}>
              <Save className="mr-2 h-4 w-4" />
              Guardar Cambios
            </Button>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Datos de la Empresa</CardTitle>
              <CardDescription>Gestione los datos de su empresa y sedes</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="flex items-start gap-6">
                  <div className="relative">
                    <div className="w-24 h-24 rounded-lg bg-gray-200 overflow-hidden border">
                      <img
                        src={datosEmpresa.logo || "/placeholder.svg"}
                        alt="Logo empresa"
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <Button variant="outline" size="sm" className="absolute bottom-0 right-0 rounded-full w-8 h-8 p-0">
                      <Upload className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="flex-1">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="nombre-empresa">Nombre de la Empresa</Label>
                        <Input
                          id="nombre-empresa"
                          value={datosEmpresa.nombre}
                          onChange={(e) => setDatosEmpresa({ ...datosEmpresa, nombre: e.target.value })}
                        />
                      </div>
                      <div>
                        <Label htmlFor="nit">NIT/RUT</Label>
                        <Input
                          id="nit"
                          value={datosEmpresa.nit}
                          onChange={(e) => setDatosEmpresa({ ...datosEmpresa, nit: e.target.value })}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="direccion">Dirección</Label>
                    <Input
                      id="direccion"
                      value={datosEmpresa.direccion}
                      onChange={(e) => setDatosEmpresa({ ...datosEmpresa, direccion: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="ciudad">Ciudad</Label>
                    <Input
                      id="ciudad"
                      value={datosEmpresa.ciudad}
                      onChange={(e) => setDatosEmpresa({ ...datosEmpresa, ciudad: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="telefono-empresa">Teléfono</Label>
                    <Input
                      id="telefono-empresa"
                      value={datosEmpresa.telefono}
                      onChange={(e) => setDatosEmpresa({ ...datosEmpresa, telefono: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="email-empresa">Email</Label>
                    <Input
                      id="email-empresa"
                      value={datosEmpresa.email}
                      onChange={(e) => setDatosEmpresa({ ...datosEmpresa, email: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="sitio-web">Sitio Web</Label>
                    <Input
                      id="sitio-web"
                      value={datosEmpresa.sitioWeb}
                      onChange={(e) => setDatosEmpresa({ ...datosEmpresa, sitioWeb: e.target.value })}
                    />
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="maneja-sedes"
                    checked={datosEmpresa.manejaSedes}
                    onCheckedChange={(checked) => setDatosEmpresa({ ...datosEmpresa, manejaSedes: checked })}
                  />
                  <Label htmlFor="maneja-sedes">La empresa maneja múltiples sedes</Label>
                </div>

                {datosEmpresa.manejaSedes && (
                  <div>
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-medium">Sedes</h3>
                      <Button
                        onClick={() => {
                          setNuevaSede({})
                          setEditandoId(null)
                          setMostrarModalSede(true)
                        }}
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Agregar Sede
                      </Button>
                    </div>

                    <div className="border rounded-md">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Nombre</TableHead>
                            <TableHead>Dirección</TableHead>
                            <TableHead>Ciudad</TableHead>
                            <TableHead>Teléfono</TableHead>
                            <TableHead>Principal</TableHead>
                            <TableHead>Acciones</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {sedes.map((sede) => (
                            <TableRow key={sede.id}>
                              <TableCell className="font-medium">{sede.nombre}</TableCell>
                              <TableCell>{sede.direccion}</TableCell>
                              <TableCell>{sede.ciudad}</TableCell>
                              <TableCell>{sede.telefono}</TableCell>
                              <TableCell>
                                {sede.principal ? (
                                  <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                                    <Check className="mr-1 h-3 w-3" />
                                    Principal
                                  </span>
                                ) : (
                                  <span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-800">
                                    Secundaria
                                  </span>
                                )}
                              </TableCell>
                              <TableCell>
                                <div className="flex gap-2">
                                  <Button variant="outline" size="sm" onClick={() => editarSede(sede.id)}>
                                    <Pencil className="h-3 w-3 mr-1" />
                                    Editar
                                  </Button>
                                  {!sede.principal && (
                                    <Button variant="destructive" size="sm" onClick={() => eliminarSede(sede.id)}>
                                      <Trash className="h-3 w-3 mr-1" />
                                      Eliminar
                                    </Button>
                                  )}
                                </div>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>

                    {/* Modal para agregar/editar sede (ahora usa RegistroSedeForm en lugar de inputs locales) */}
                    {mostrarModalSede && (
                      <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/10 dark:bg-black/20 backdrop-blur-md">
                        <motion.div
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="bg-white/70 dark:bg-gray-900/70 backdrop-blur-sm rounded-lg shadow-lg w-full max-w-3xl p-6 border border-white/20"
                        >
                          <RegistroSedeForm
                            onCancel={() => setMostrarModalSede(false)}
                            onSuccess={(newSede) => {
                              // Si el formulario devolvió un nombre de sede, agregarla a la lista
                              if (newSede?.nombre) {
                                const id = (sedes.length + 1).toString()
                                setSedes([...sedes, { id, nombre: newSede.nombre || '', direccion: newSede.direccion || '', ciudad: newSede.ciudad || '', telefono: newSede.telefono || '', principal: false }])
                              }
                              setMostrarModalSede(false)
                            }}
                          />
                        </motion.div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>

      </ModuleLayout>
    </AuthGuard>

  )
}

