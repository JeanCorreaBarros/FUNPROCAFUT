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

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ArrowLeft, Save, Upload } from "lucide-react"
import Link from "next/link"
import { Textarea } from "@/components/ui/textarea"

import {
    PersonIcon, // UserIcon
    GroupIcon, // UsersIcon
    BellIcon, // BellIcon (mismo nombre)
    CardStackIcon, // CreditCardIcon
    Link2Icon, // LinkIcon
    ColorWheelIcon, // PaletteIcon
    PlusIcon,
    TrashIcon,
    Pencil1Icon,
    CheckIcon,
    Cross2Icon,
    ReloadIcon,
    LockClosedIcon,
    GlobeIcon,
    ImageIcon,
    EnvelopeClosedIcon,
    ChatBubbleIcon,
    MobileIcon,
    CalendarIcon,
} from "@radix-ui/react-icons"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// Tipos para los usuarios
type Usuario = {
    id: string
    nombre: string
    email: string
    rol: string
    estado: "activo" | "inactivo"
    ultimoAcceso: string
}

// Tipos para las sedes
type Sede = {
    id: string
    nombre: string
    direccion: string
    telefono: string
    ciudad: string
    principal: boolean
}

// Tipos para las integraciones
type Integracion = {
    id: string
    nombre: string
    tipo: string
    estado: "activo" | "inactivo"
    configurado: boolean
}

// Tipos para los diseños web
type DisenoWeb = {
    id: string
    nombre: string
    preview: string
    descripcion: string
}

// Tipos para los miembros del equipo
type MiembroEquipo = {
    id: string
    nombre: string
    cargo: string
    foto: string
    descripcion: string
}
export default function PerfilPage() {


    // const guardarCambios = () => {
    //     alert("Cambios guardados correctamente")
    // }

    // Estado para controlar la opción seleccionada en el sidebar
    const [opcionSeleccionada, setOpcionSeleccionada] = useState<string>("notificaciones")

    // Estados para los formularios
    const [perfilUsuario, setPerfilUsuario] = useState({
        nombre: "Usuario Ejemplo",
        apellido: "Apellido Ejemplo",
        email: "usuario@ejemplo.com",
        telefono: "+1 234 567 890",
        cargo: "Administrador",
        foto: "/placeholder.svg?height=96&width=96",
    })

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

    const [usuarios, setUsuarios] = useState<Usuario[]>([
        {
            id: "1",
            nombre: "Carlos Pérez",
            email: "carlos@ejemplo.com",
            rol: "Administrador",
            estado: "activo",
            ultimoAcceso: "15/05/2023 10:25",
        },
        {
            id: "2",
            nombre: "María López",
            email: "maria@ejemplo.com",
            rol: "Gerente",
            estado: "activo",
            ultimoAcceso: "14/05/2023 15:40",
        },
        {
            id: "3",
            nombre: "Ana Martínez",
            email: "ana@ejemplo.com",
            rol: "Recepcionista",
            estado: "activo",
            ultimoAcceso: "15/05/2023 08:15",
        },
        {
            id: "4",
            nombre: "Juan Rodríguez",
            email: "juan@ejemplo.com",
            rol: "Estilista",
            estado: "inactivo",
            ultimoAcceso: "10/05/2023 09:45",
        },
    ])

    const [notificaciones, setNotificaciones] = useState({
        email: true,
        sms: true,
        push: false,
        recordatorioCitas: true,
        confirmacionCitas: true,
        cancelacionCitas: true,
        promociones: false,
        cumpleanos: true,
    })

    const [seguridadConfig, setSeguridadConfig] = useState({
        longitudMinima: 8,
        requiereNumeros: true,
        requiereSimbolos: true,
        requiereMayusculas: true,
        expiracion: 90,
        intentosMaximos: 5,
        autenticacionDosFactores: false,
    })

    const [facturacionConfig, setFacturacionConfig] = useState({
        proveedorFacturacion: "Facture",
        apiKey: "sk_test_123456789",
        urlServicio: "https://api.facture.co",
        resolucionFacturacion: "DIAN-12345-2023",
        prefijoFactura: "FE",
        inicioNumeracion: "1000",
        finNumeracion: "9999",
        fechaResolucion: "01/01/2023",
        fechaVencimiento: "31/12/2023",
    })

    const [integraciones, setIntegraciones] = useState<Integracion[]>([
        {
            id: "1",
            nombre: "WhatsApp Business",
            tipo: "Mensajería",
            estado: "activo",
            configurado: true,
        },
        {
            id: "2",
            nombre: "ChatGPT",
            tipo: "IA",
            estado: "inactivo",
            configurado: false,
        },
        {
            id: "3",
            nombre: "Instagram",
            tipo: "Redes Sociales",
            estado: "activo",
            configurado: true,
        },
        {
            id: "4",
            nombre: "Google Calendar",
            tipo: "Calendario",
            estado: "activo",
            configurado: true,
        },
    ])

    const [aparienciaWeb, setAparienciaWeb] = useState({
        colorPrimario: "#000000",
        colorSecundario: "#ffffff",
        colorAcento: "#4299e1",
        fuente: "Inter",
        nombreWeb: "B360 Barbería & Estética",
        disenoSeleccionado: "1",
        mostrarGaleria: true,
        mostrarEquipo: true,
        mostrarTestimonios: true,
        mostrarPrecios: true,
        mostrarContacto: true,
    })

    const [disenosWeb, setDisenosWeb] = useState<DisenoWeb[]>([
        {
            id: "1",
            nombre: "Moderno Minimalista",
            preview: "/placeholder.svg?height=120&width=200",
            descripcion: "Diseño limpio y moderno con enfoque en la experiencia del usuario.",
        },
        {
            id: "2",
            nombre: "Clásico Elegante",
            preview: "/placeholder.svg?height=120&width=200",
            descripcion: "Diseño tradicional con toques elegantes para una barbería clásica.",
        },
        {
            id: "3",
            nombre: "Urbano Contemporáneo",
            preview: "/placeholder.svg?height=120&width=200",
            descripcion: "Estilo urbano con elementos gráficos modernos y dinámicos.",
        },
    ])

    const [miembrosEquipo, setMiembrosEquipo] = useState<MiembroEquipo[]>([
        {
            id: "1",
            nombre: "Carlos Pérez",
            cargo: "Estilista Senior",
            foto: "/placeholder.svg?height=80&width=80",
            descripcion: "Especialista en cortes modernos y coloración.",
        },
        {
            id: "2",
            nombre: "María López",
            cargo: "Barbera",
            foto: "/placeholder.svg?height=80&width=80",
            descripcion: "Experta en barbas y cortes clásicos.",
        },
        {
            id: "3",
            nombre: "Juan Rodríguez",
            cargo: "Estilista",
            foto: "/placeholder.svg?height=80&width=80",
            descripcion: "Especialista en peinados y tratamientos capilares.",
        },
    ])

    // Estado para nuevos elementos
    const [nuevaSede, setNuevaSede] = useState<Partial<Sede>>({})
    const [nuevoUsuario, setNuevoUsuario] = useState<Partial<Usuario>>({})
    const [nuevoMiembro, setNuevoMiembro] = useState<Partial<MiembroEquipo>>({})

    // Estados para modales
    const [mostrarModalSede, setMostrarModalSede] = useState(false)
    const [mostrarModalUsuario, setMostrarModalUsuario] = useState(false)
    const [mostrarModalMiembro, setMostrarModalMiembro] = useState(false)
    const [editandoId, setEditandoId] = useState<string | null>(null)

    // Función para guardar cambios
    const guardarCambios = () => {
        alert("Cambios guardados correctamente")
    }

    // Función para agregar una nueva sede
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

    // Función para editar una sede
    const editarSede = (id: string) => {
        const sede = sedes.find((s) => s.id === id)
        if (sede) {
            setNuevaSede(sede)
            setEditandoId(id)
            setMostrarModalSede(true)
        }
    }

    // Función para actualizar una sede
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

    // Función para eliminar una sede
    const eliminarSede = (id: string) => {
        const sedesActualizadas = sedes.filter((sede) => sede.id !== id)
        setSedes(sedesActualizadas)
    }

    // Función para agregar un nuevo usuario
    const agregarUsuario = () => {
        if (!nuevoUsuario.nombre || !nuevoUsuario.email || !nuevoUsuario.rol) {
            alert("Por favor complete los campos obligatorios")
            return
        }

        const id = (usuarios.length + 1).toString()
        const fecha = new Date().toLocaleDateString() + " " + new Date().toLocaleTimeString().slice(0, 5)

        setUsuarios([
            ...usuarios,
            {
                ...nuevoUsuario,
                id,
                estado: "activo",
                ultimoAcceso: fecha,
            } as Usuario,
        ])

        setNuevoUsuario({})
        setMostrarModalUsuario(false)
    }

    // Función para editar un usuario
    const editarUsuario = (id: string) => {
        const usuario = usuarios.find((u) => u.id === id)
        if (usuario) {
            setNuevoUsuario(usuario)
            setEditandoId(id)
            setMostrarModalUsuario(true)
        }
    }

    // Función para actualizar un usuario
    const actualizarUsuario = () => {
        if (!editandoId) return

        const usuariosActualizados = usuarios.map((usuario) =>
            usuario.id === editandoId
                ? ({ ...nuevoUsuario, id: editandoId, ultimoAcceso: usuario.ultimoAcceso } as Usuario)
                : usuario,
        )

        setUsuarios(usuariosActualizados)
        setNuevoUsuario({})
        setEditandoId(null)
        setMostrarModalUsuario(false)
    }

    // Función para cambiar el estado de un usuario
    const cambiarEstadoUsuario = (id: string) => {
        const usuariosActualizados = usuarios.map((usuario) =>
            usuario.id === id
                ? { ...usuario, estado: (usuario.estado === "activo" ? "inactivo" : "activo") as "activo" | "inactivo" }
                : usuario,
        )

        setUsuarios(usuariosActualizados)
    }

    // Función para restablecer contraseña
    const restablecerContrasena = (id: string) => {
        alert(`Se ha enviado un correo para restablecer la contraseña del usuario con ID ${id}`)
    }

    // Función para agregar un nuevo miembro del equipo
    const agregarMiembro = () => {
        if (!nuevoMiembro.nombre || !nuevoMiembro.cargo) {
            alert("Por favor complete los campos obligatorios")
            return
        }

        const id = (miembrosEquipo.length + 1).toString()
        setMiembrosEquipo([
            ...miembrosEquipo,
            {
                ...nuevoMiembro,
                id,
                foto: nuevoMiembro.foto || "/placeholder.svg?height=80&width=80",
            } as MiembroEquipo,
        ])

        setNuevoMiembro({})
        setMostrarModalMiembro(false)
    }

    // Función para editar un miembro del equipo
    const editarMiembro = (id: string) => {
        const miembro = miembrosEquipo.find((m) => m.id === id)
        if (miembro) {
            setNuevoMiembro(miembro)
            setEditandoId(id)
            setMostrarModalMiembro(true)
        }
    }

    // Función para actualizar un miembro del equipo
    const actualizarMiembro = () => {
        if (!editandoId) return

        const miembrosActualizados = miembrosEquipo.map((miembro) =>
            miembro.id === editandoId ? ({ ...nuevoMiembro, id: editandoId } as MiembroEquipo) : miembro,
        )

        setMiembrosEquipo(miembrosActualizados)
        setNuevoMiembro({})
        setEditandoId(null)
        setMostrarModalMiembro(false)
    }

    // Función para eliminar un miembro del equipo
    const eliminarMiembro = (id: string) => {
        const miembrosActualizados = miembrosEquipo.filter((miembro) => miembro.id !== id)
        setMiembrosEquipo(miembrosActualizados)
    }

    // Función para cambiar el estado de una integración
    const cambiarEstadoIntegracion = (id: string) => {
        const integracionesActualizadas = integraciones.map((integracion) =>
            integracion.id === id
                ? { ...integracion, estado: (integracion.estado === "activo" ? "inactivo" : "activo") as "activo" | "inactivo" }
                : integracion,
        )

        setIntegraciones(integracionesActualizadas)
    }

    // Función para configurar una integración
    const configurarIntegracion = (id: string) => {
        const integracionesActualizadas = integraciones.map((integracion) =>
            integracion.id === id ? { ...integracion, configurado: true } : integracion,
        )

        setIntegraciones(integracionesActualizadas)
        alert(`Integración configurada correctamente`)
    }



    return (


        <AuthGuard>
            <ModuleLayout moduleType="configuracion">

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="container mx-auto py-6"
                >
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center">
                            <h1 className="text-2xl font-bold">Integraciones Globales</h1>
                        </div>
                        <Button onClick={guardarCambios}>
                            <Save className="mr-2 h-4 w-4" />
                            Guardar Cambios
                        </Button>
                    </div>

                    <Card>
            <CardHeader>
              <CardTitle>Apariencia Web</CardTitle>
              <CardDescription>Configure la apariencia de su página web</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium mb-4">Información General</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="nombre-web">Nombre de la Web</Label>
                      <Input
                        id="nombre-web"
                        value={aparienciaWeb.nombreWeb}
                        onChange={(e) => setAparienciaWeb({ ...aparienciaWeb, nombreWeb: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="fuente">Fuente Principal</Label>
                      <Select
                        value={aparienciaWeb.fuente}
                        onValueChange={(value) => setAparienciaWeb({ ...aparienciaWeb, fuente: value })}
                      >
                        <SelectTrigger id="fuente">
                          <SelectValue placeholder="Seleccionar fuente" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Inter">Inter</SelectItem>
                          <SelectItem value="Roboto">Roboto</SelectItem>
                          <SelectItem value="Montserrat">Montserrat</SelectItem>
                          <SelectItem value="Poppins">Poppins</SelectItem>
                          <SelectItem value="Open Sans">Open Sans</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-4">Colores</h3>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="color-primario">Color Primario</Label>
                      <div className="flex gap-2">
                        <Input
                          id="color-primario"
                          type="color"
                          value={aparienciaWeb.colorPrimario}
                          onChange={(e) => setAparienciaWeb({ ...aparienciaWeb, colorPrimario: e.target.value })}
                          className="w-12 h-10 p-1"
                        />
                        <Input
                          value={aparienciaWeb.colorPrimario}
                          onChange={(e) => setAparienciaWeb({ ...aparienciaWeb, colorPrimario: e.target.value })}
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="color-secundario">Color Secundario</Label>
                      <div className="flex gap-2">
                        <Input
                          id="color-secundario"
                          type="color"
                          value={aparienciaWeb.colorSecundario}
                          onChange={(e) => setAparienciaWeb({ ...aparienciaWeb, colorSecundario: e.target.value })}
                          className="w-12 h-10 p-1"
                        />
                        <Input
                          value={aparienciaWeb.colorSecundario}
                          onChange={(e) => setAparienciaWeb({ ...aparienciaWeb, colorSecundario: e.target.value })}
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="color-acento">Color Acento</Label>
                      <div className="flex gap-2">
                        <Input
                          id="color-acento"
                          type="color"
                          value={aparienciaWeb.colorAcento}
                          onChange={(e) => setAparienciaWeb({ ...aparienciaWeb, colorAcento: e.target.value })}
                          className="w-12 h-10 p-1"
                        />
                        <Input
                          value={aparienciaWeb.colorAcento}
                          onChange={(e) => setAparienciaWeb({ ...aparienciaWeb, colorAcento: e.target.value })}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-4">Diseño de la Web</h3>
                  <div className="grid grid-cols-3 gap-6">
                    {disenosWeb.map((diseno) => (
                      <div
                        key={diseno.id}
                        className={`border rounded-lg p-4 cursor-pointer ${aparienciaWeb.disenoSeleccionado === diseno.id ? "border-blue-500 bg-blue-50" : ""
                          }`}
                        onClick={() => setAparienciaWeb({ ...aparienciaWeb, disenoSeleccionado: diseno.id })}
                      >
                        <div className="aspect-video bg-gray-100 rounded-md mb-3 overflow-hidden">
                          <img
                            src={diseno.preview || "/placeholder.svg"}
                            alt={diseno.nombre}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <h4 className="font-medium">{diseno.nombre}</h4>
                        <p className="text-sm text-gray-500 mt-1">{diseno.descripcion}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-4">Secciones</h3>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="mostrar-galeria">Mostrar Galería de Imágenes</Label>
                      <Switch
                        id="mostrar-galeria"
                        checked={aparienciaWeb.mostrarGaleria}
                        onCheckedChange={(checked) => setAparienciaWeb({ ...aparienciaWeb, mostrarGaleria: checked })}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="mostrar-equipo">Mostrar Equipo</Label>
                      <Switch
                        id="mostrar-equipo"
                        checked={aparienciaWeb.mostrarEquipo}
                        onCheckedChange={(checked) => setAparienciaWeb({ ...aparienciaWeb, mostrarEquipo: checked })}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="mostrar-testimonios">Mostrar Testimonios</Label>
                      <Switch
                        id="mostrar-testimonios"
                        checked={aparienciaWeb.mostrarTestimonios}
                        onCheckedChange={(checked) =>
                          setAparienciaWeb({ ...aparienciaWeb, mostrarTestimonios: checked })
                        }
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="mostrar-precios">Mostrar Lista de Precios</Label>
                      <Switch
                        id="mostrar-precios"
                        checked={aparienciaWeb.mostrarPrecios}
                        onCheckedChange={(checked) => setAparienciaWeb({ ...aparienciaWeb, mostrarPrecios: checked })}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="mostrar-contacto">Mostrar Información de Contacto</Label>
                      <Switch
                        id="mostrar-contacto"
                        checked={aparienciaWeb.mostrarContacto}
                        onCheckedChange={(checked) => setAparienciaWeb({ ...aparienciaWeb, mostrarContacto: checked })}
                      />
                    </div>
                  </div>
                </div>

                {aparienciaWeb.mostrarGaleria && (
                  <div>
                    <h3 className="text-lg font-medium mb-4">Galería de Imágenes</h3>
                    <div className="grid grid-cols-4 gap-4">
                      {[1, 2, 3, 4, 5, 6, 7, 8].map((item) => (
                        <div key={item} className="relative aspect-square bg-gray-100 rounded-md overflow-hidden">
                          <img
                            src={`/placeholder.svg?height=120&width=120&text=Imagen ${item}`}
                            alt={`Imagen ${item}`}
                            className="w-full h-full object-cover"
                          />
                          <Button
                            variant="destructive"
                            size="icon"
                            className="absolute top-2 right-2 h-6 w-6 rounded-full"
                          >
                            <TrashIcon className="h-3 w-3" />
                          </Button>
                        </div>
                      ))}
                      <div className="aspect-square border border-dashed rounded-md flex items-center justify-center cursor-pointer hover:bg-gray-50">
                        <div className="flex flex-col items-center">
                          <ImageIcon className="h-8 w-8 text-gray-400" />
                          <span className="text-sm text-gray-500 mt-2">Agregar Imagen</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {aparienciaWeb.mostrarEquipo && (
                  <div>
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-medium">Equipo</h3>
                      <Button
                        onClick={() => {
                          setNuevoMiembro({})
                          setEditandoId(null)
                          setMostrarModalMiembro(true)
                        }}
                      >
                        <PlusIcon className="h-4 w-4 mr-2" />
                        Agregar Miembro
                      </Button>
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                      {miembrosEquipo.map((miembro) => (
                        <div key={miembro.id} className="border rounded-lg p-4">
                          <div className="flex items-center gap-3 mb-3">
                            <div className="w-16 h-16 rounded-full overflow-hidden">
                              <img
                                src={miembro.foto || "/placeholder.svg"}
                                alt={miembro.nombre}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div>
                              <h4 className="font-medium">{miembro.nombre}</h4>
                              <p className="text-sm text-gray-500">{miembro.cargo}</p>
                            </div>
                          </div>
                          <p className="text-sm text-gray-600 mb-3">{miembro.descripcion}</p>
                          <div className="flex justify-end gap-2">
                            <Button variant="outline" size="sm" onClick={() => editarMiembro(miembro.id)}>
                              Editar
                            </Button>
                            <Button variant="destructive" size="sm" onClick={() => eliminarMiembro(miembro.id)}>
                              Eliminar
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Modal para agregar/editar miembro del equipo */}
                    {mostrarModalMiembro && (
                      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
                        <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
                          <h3 className="text-lg font-medium mb-4">
                            {editandoId ? "Editar Miembro del Equipo" : "Agregar Miembro del Equipo"}
                          </h3>
                          <div className="space-y-4">
                            <div>
                              <Label htmlFor="nombre-miembro">Nombre</Label>
                              <Input
                                id="nombre-miembro"
                                value={nuevoMiembro.nombre || ""}
                                onChange={(e) => setNuevoMiembro({ ...nuevoMiembro, nombre: e.target.value })}
                              />
                            </div>
                            <div>
                              <Label htmlFor="cargo-miembro">Cargo</Label>
                              <Input
                                id="cargo-miembro"
                                value={nuevoMiembro.cargo || ""}
                                onChange={(e) => setNuevoMiembro({ ...nuevoMiembro, cargo: e.target.value })}
                              />
                            </div>
                            <div>
                              <Label htmlFor="descripcion-miembro">Descripción</Label>
                              <Textarea
                                id="descripcion-miembro"
                                value={nuevoMiembro.descripcion || ""}
                                onChange={(e) => setNuevoMiembro({ ...nuevoMiembro, descripcion: e.target.value })}
                              />
                            </div>
                            <div>
                              <Label htmlFor="foto-miembro">Foto</Label>
                              <div className="flex items-center gap-4">
                                <div className="w-16 h-16 rounded-full bg-gray-100 overflow-hidden">
                                  <img
                                    src={nuevoMiembro.foto || "/placeholder.svg?height=64&width=64"}
                                    alt="Preview"
                                    className="w-full h-full object-cover"
                                  />
                                </div>
                                <Button variant="outline">Seleccionar Imagen</Button>
                              </div>
                            </div>
                          </div>
                          <div className="flex justify-end gap-2 mt-6">
                            <Button variant="outline" onClick={() => setMostrarModalMiembro(false)}>
                              Cancelar
                            </Button>
                            <Button onClick={editandoId ? actualizarMiembro : agregarMiembro}>
                              {editandoId ? "Actualizar" : "Agregar"}
                            </Button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {aparienciaWeb.mostrarContacto && (
                  <div>
                    <h3 className="text-lg font-medium mb-4">Información de Contacto</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="contacto-telefono">Teléfono</Label>
                        <div className="flex items-center">
                          <MobileIcon className="h-4 w-4 mr-2 text-gray-500" />
                          <Input id="contacto-telefono" defaultValue="+57 300 123 4567" />
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="contacto-email">Email</Label>
                        <div className="flex items-center">
                          <EnvelopeClosedIcon className="h-4 w-4 mr-2 text-gray-500" />
                          <Input id="contacto-email" defaultValue="contacto@b360salon.com" />
                        </div>
                      </div>
                      <div className="col-span-2">
                        <Label htmlFor="contacto-direccion">Dirección</Label>
                        <div className="flex items-center">
                          <GlobeIcon className="h-4 w-4 mr-2 text-gray-500" />
                          <Input id="contacto-direccion" defaultValue="Calle Principal #123, Bogotá" />
                        </div>
                      </div>
                      <div className="col-span-2">
                        <Label htmlFor="contacto-horario">Horario de Atención</Label>
                        <Textarea
                          id="contacto-horario"
                          defaultValue="Lunes a Viernes: 8:00 AM - 8:00 PM&#10;Sábados: 9:00 AM - 6:00 PM&#10;Domingos: Cerrado"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {aparienciaWeb.mostrarTestimonios && (
                  <div>
                    <h3 className="text-lg font-medium mb-4">Testimonios</h3>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center mb-4">
                        <h4 className="font-medium">Testimonios de Clientes</h4>
                        <Button>
                          <PlusIcon className="h-4 w-4 mr-2" />
                          Agregar Testimonio
                        </Button>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        {[1, 2, 3, 4].map((item) => (
                          <div key={item} className="border rounded-lg p-4">
                            <div className="flex items-start gap-3 mb-3">
                              <div className="w-12 h-12 rounded-full bg-gray-100 overflow-hidden">
                                <img
                                  src={`/placeholder.svg?height=48&width=48&text=Cliente ${item}`}
                                  alt={`Cliente ${item}`}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                              <div>
                                <h5 className="font-medium">Cliente Ejemplo {item}</h5>
                                <div className="flex text-yellow-500 mt-1">
                                  {[1, 2, 3, 4, 5].map((star) => (
                                    <svg
                                      key={star}
                                      xmlns="http://www.w3.org/2000/svg"
                                      viewBox="0 0 24 24"
                                      fill="currentColor"
                                      className="w-4 h-4"
                                    >
                                      <path
                                        fillRule="evenodd"
                                        d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z"
                                        clipRule="evenodd"
                                      />
                                    </svg>
                                  ))}
                                </div>
                              </div>
                            </div>
                            <p className="text-sm text-gray-600 mb-3">
                              "Excelente servicio, muy profesionales y atentos. Quedé muy satisfecho con mi corte de
                              cabello."
                            </p>
                            <div className="flex justify-end gap-2">
                              <Button variant="outline" size="sm">
                                Editar
                              </Button>
                              <Button variant="destructive" size="sm">
                                Eliminar
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {aparienciaWeb.mostrarPrecios && (
                  <div>
                    <h3 className="text-lg font-medium mb-4">Lista de Precios</h3>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center mb-4">
                        <h4 className="font-medium">Servicios y Precios</h4>
                        <Button>
                          <PlusIcon className="h-4 w-4 mr-2" />
                          Agregar Servicio
                        </Button>
                      </div>

                      <div className="border rounded-md">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Servicio</TableHead>
                              <TableHead>Descripción</TableHead>
                              <TableHead>Precio</TableHead>
                              <TableHead>Duración</TableHead>
                              <TableHead>Categoría</TableHead>
                              <TableHead>Acciones</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {[
                              {
                                id: "1",
                                nombre: "Corte de Cabello",
                                descripcion: "Corte clásico o moderno",
                                precio: "$25.000",
                                duracion: "30 min",
                                categoria: "Cabello",
                              },
                              {
                                id: "2",
                                nombre: "Afeitado",
                                descripcion: "Afeitado tradicional con toalla caliente",
                                precio: "$20.000",
                                duracion: "25 min",
                                categoria: "Barba",
                              },
                              {
                                id: "3",
                                nombre: "Corte + Barba",
                                descripcion: "Combo de corte y arreglo de barba",
                                precio: "$40.000",
                                duracion: "50 min",
                                categoria: "Combo",
                              },
                              {
                                id: "4",
                                nombre: "Coloración",
                                descripcion: "Aplicación de color para cabello",
                                precio: "$60.000",
                                duracion: "90 min",
                                categoria: "Color",
                              },
                            ].map((servicio) => (
                              <TableRow key={servicio.id}>
                                <TableCell className="font-medium">{servicio.nombre}</TableCell>
                                <TableCell>{servicio.descripcion}</TableCell>
                                <TableCell>{servicio.precio}</TableCell>
                                <TableCell>{servicio.duracion}</TableCell>
                                <TableCell>{servicio.categoria}</TableCell>
                                <TableCell>
                                  <div className="flex gap-2">
                                    <Button variant="outline" size="sm">
                                      Editar
                                    </Button>
                                    <Button variant="destructive" size="sm">
                                      Eliminar
                                    </Button>
                                  </div>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    </div>
                  </div>
                )}

                <div className="mt-6 flex justify-end">
                  <Button onClick={guardarCambios}>Guardar Cambios</Button>
                </div>
              </div>
            </CardContent>
          </Card>
                </motion.div>

            </ModuleLayout>
        </AuthGuard>
    )
}


// Componentes adicionales para los iconos
function BrainIcon({ className }: { className?: string }) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            className={className}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96.44 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 4.44-1.04Z" />
            <path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96.44 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24A2.5 2.5 0 0 0 14.5 2Z" />
        </svg>
    )
}

function InstagramIcon({ className }: { className?: string }) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            className={className}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
            <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
            <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
        </svg>
    )
}

function AlertIcon({ className }: { className?: string }) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            className={className}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
    )
}