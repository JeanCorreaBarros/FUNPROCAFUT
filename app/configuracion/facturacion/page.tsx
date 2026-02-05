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
import { ArrowLeft, Save, Upload } from "lucide-react"
import Link from "next/link"
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
                            <Link href="/configuracion">
                                <Button variant="ghost" size="icon" className="mr-2">
                                    <ArrowLeft className="h-5 w-5" />
                                </Button>
                            </Link>
                            <h1 className="text-2xl font-bold">Perfil de Usuario</h1>
                        </div>
                        <Button onClick={guardarCambios}>
                            <Save className="mr-2 h-4 w-4" />
                            Guardar Cambios
                        </Button>
                    </div>

                    <Card>
                        <CardHeader>
                            <CardTitle>Configuración de Facturación Electrónica</CardTitle>
                            <CardDescription>Configure la integración con su proveedor de facturación electrónica</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-6">
                                <div>
                                    <h3 className="text-lg font-medium mb-4">Proveedor de Facturación Electrónica</h3>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <Label htmlFor="proveedor-facturacion">Proveedor</Label>
                                            <Select
                                                value={facturacionConfig.proveedorFacturacion}
                                                onValueChange={(value) =>
                                                    setFacturacionConfig({ ...facturacionConfig, proveedorFacturacion: value })
                                                }
                                            >
                                                <SelectTrigger id="proveedor-facturacion">
                                                    <SelectValue placeholder="Seleccionar proveedor" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="Facture">Facture</SelectItem>
                                                    <SelectItem value="Siigo">Siigo</SelectItem>
                                                    <SelectItem value="Alegra">Alegra</SelectItem>
                                                    <SelectItem value="FacturaElectronica">FacturaElectronica.com</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div>
                                            <Label htmlFor="api-key">API Key / Token</Label>
                                            <Input
                                                id="api-key"
                                                type="password"
                                                value={facturacionConfig.apiKey}
                                                onChange={(e) => setFacturacionConfig({ ...facturacionConfig, apiKey: e.target.value })}
                                            />
                                        </div>
                                        <div className="col-span-2">
                                            <Label htmlFor="url-servicio">URL del Servicio</Label>
                                            <Input
                                                id="url-servicio"
                                                value={facturacionConfig.urlServicio}
                                                onChange={(e) => setFacturacionConfig({ ...facturacionConfig, urlServicio: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <h3 className="text-lg font-medium mb-4">Resolución de Facturación DIAN</h3>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <Label htmlFor="resolucion-facturacion">Número de Resolución</Label>
                                            <Input
                                                id="resolucion-facturacion"
                                                value={facturacionConfig.resolucionFacturacion}
                                                onChange={(e) =>
                                                    setFacturacionConfig({ ...facturacionConfig, resolucionFacturacion: e.target.value })
                                                }
                                            />
                                        </div>
                                        <div>
                                            <Label htmlFor="prefijo-factura">Prefijo de Factura</Label>
                                            <Input
                                                id="prefijo-factura"
                                                value={facturacionConfig.prefijoFactura}
                                                onChange={(e) => setFacturacionConfig({ ...facturacionConfig, prefijoFactura: e.target.value })}
                                            />
                                        </div>
                                        <div>
                                            <Label htmlFor="inicio-numeracion">Inicio de Numeración</Label>
                                            <Input
                                                id="inicio-numeracion"
                                                value={facturacionConfig.inicioNumeracion}
                                                onChange={(e) =>
                                                    setFacturacionConfig({ ...facturacionConfig, inicioNumeracion: e.target.value })
                                                }
                                            />
                                        </div>
                                        <div>
                                            <Label htmlFor="fin-numeracion">Fin de Numeración</Label>
                                            <Input
                                                id="fin-numeracion"
                                                value={facturacionConfig.finNumeracion}
                                                onChange={(e) => setFacturacionConfig({ ...facturacionConfig, finNumeracion: e.target.value })}
                                            />
                                        </div>
                                        <div>
                                            <Label htmlFor="fecha-resolucion">Fecha de Resolución</Label>
                                            <Input
                                                id="fecha-resolucion"
                                                value={facturacionConfig.fechaResolucion}
                                                onChange={(e) =>
                                                    setFacturacionConfig({ ...facturacionConfig, fechaResolucion: e.target.value })
                                                }
                                            />
                                        </div>
                                        <div>
                                            <Label htmlFor="fecha-vencimiento">Fecha de Vencimiento</Label>
                                            <Input
                                                id="fecha-vencimiento"
                                                value={facturacionConfig.fechaVencimiento}
                                                onChange={(e) =>
                                                    setFacturacionConfig({ ...facturacionConfig, fechaVencimiento: e.target.value })
                                                }
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <h3 className="text-lg font-medium mb-4">Configuración de Factura</h3>
                                    <div className="space-y-4">
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <Label htmlFor="dias-vencimiento">Días para Vencimiento</Label>
                                                <Select defaultValue="30">
                                                    <SelectTrigger id="dias-vencimiento">
                                                        <SelectValue placeholder="Seleccionar" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="0">0 días (Contado)</SelectItem>
                                                        <SelectItem value="15">15 días</SelectItem>
                                                        <SelectItem value="30">30 días</SelectItem>
                                                        <SelectItem value="45">45 días</SelectItem>
                                                        <SelectItem value="60">60 días</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                            <div>
                                                <Label htmlFor="impuesto-defecto">Impuesto por Defecto</Label>
                                                <Select defaultValue="19">
                                                    <SelectTrigger id="impuesto-defecto">
                                                        <SelectValue placeholder="Seleccionar" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="0">0% (Exento)</SelectItem>
                                                        <SelectItem value="5">5%</SelectItem>
                                                        <SelectItem value="19">19% (IVA)</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-between">
                                            <div>
                                                <Label className="text-base">Incluir Logo en Factura</Label>
                                                <p className="text-sm text-gray-500">Mostrar el logo de la empresa en las facturas</p>
                                            </div>
                                            <Switch defaultChecked={true} />
                                        </div>

                                        <div className="flex items-center justify-between">
                                            <div>
                                                <Label className="text-base">Enviar Factura por Email</Label>
                                                <p className="text-sm text-gray-500">Enviar automáticamente la factura al cliente</p>
                                            </div>
                                            <Switch defaultChecked={true} />
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <h3 className="text-lg font-medium mb-4">Probar Conexión</h3>
                                    <div className="flex gap-4">
                                        <Button variant="outline">Probar Conexión</Button>
                                        <div className="flex items-center text-green-600">
                                            <CheckIcon className="h-4 w-4 mr-2" />
                                            Conexión exitosa
                                        </div>
                                    </div>
                                </div>

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
