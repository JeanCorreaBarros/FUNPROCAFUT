"use client"

import { useState, useEffect } from "react"
import dynamic from "next/dynamic"
import { AuthGuard } from "@/components/auth-guard"
import { ModuleLayout } from "@/components/module-layout"
import { motion } from "framer-motion"
import { useRouter } from "next/navigation"
import {
    PlusIcon,
    SearchIcon,
    EyeIcon,
    EditIcon,
    DownloadIcon,
    TrashIcon,
    ArrowRightIcon,
    ChevronLeftIcon,
    ChevronRightIcon,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"

// Datos de ejemplo para las cotizaciones
const cotizaciones = [
    {
        id: "COT-001",
        cliente: "María González",
        fecha: "15/05/2023",
        monto: "$120,000",
        estado: "Pendiente",
    },
    {
        id: "COT-002",
        cliente: "Carlos Pérez",
        fecha: "12/05/2023",
        monto: "$85,000",
        estado: "Aprobada",
    },
    {
        id: "COT-003",
        cliente: "Ana Martínez",
        fecha: "10/05/2023",
        monto: "$150,000",
        estado: "Rechazada",
    },
    {
        id: "COT-004",
        cliente: "Juan López",
        fecha: "05/05/2023",
        monto: "$95,000",
        estado: "Pendiente",
    },
    {
        id: "COT-005",
        cliente: "Laura Sánchez",
        fecha: "01/05/2023",
        monto: "$110,000",
        estado: "Aprobada",
    },
    {
        id: "COT-006",
        cliente: "Roberto Díaz",
        fecha: "28/04/2023",
        monto: "$130,000",
        estado: "Pendiente",
    },
    {
        id: "COT-007",
        cliente: "Carmen Rodríguez",
        fecha: "25/04/2023",
        monto: "$90,000",
        estado: "Aprobada",
    },
]

// Componente para visualizar una cotización
function VisualizarCotizacionModal({ cotizacion }) {
    const router = useRouter()

    return (
        <Dialog>
            <DialogTrigger asChild>
                <button className="p-1 text-gray-500 hover:text-gray-700">
                    <EyeIcon className="w-4 h-4" />
                </button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[700px]">
                <DialogHeader>
                    <DialogTitle>Cotización {cotizacion.id}</DialogTitle>
                </DialogHeader>
                <div className="p-4">
                    <div className="border-b pb-4 mb-4">
                        <div className="flex justify-between">
                            <div>
                                <h3 className="font-bold text-lg">Cliente</h3>
                                <p>{cotizacion.cliente}</p>
                                <p>cliente@ejemplo.com</p>
                                <p>+57 300 123 4567</p>
                            </div>
                            <div className="text-right">
                                <h3 className="font-bold text-lg">Cotización {cotizacion.id}</h3>
                                <p>Fecha: {cotizacion.fecha}</p>
                                <p>Válida hasta: 15/06/2023</p>
                                <p
                                    className={`inline-block px-2 py-1 rounded-full text-xs ${cotizacion.estado === "Aprobada"
                                        ? "bg-green-100 text-green-800"
                                        : cotizacion.estado === "Pendiente"
                                            ? "bg-yellow-100 text-yellow-800"
                                            : "bg-red-100 text-red-800"
                                        }`}
                                >
                                    {cotizacion.estado}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="mb-6">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b">
                                    <th className="text-left py-2">Descripción</th>
                                    <th className="text-right py-2">Cantidad</th>
                                    <th className="text-right py-2">Precio</th>
                                    <th className="text-right py-2">Total</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr className="border-b">
                                    <td className="py-2">Servicio de corte de cabello</td>
                                    <td className="py-2 text-right">1</td>
                                    <td className="py-2 text-right">$35,000</td>
                                    <td className="py-2 text-right">$35,000</td>
                                </tr>
                                <tr className="border-b">
                                    <td className="py-2">Servicio de barba</td>
                                    <td className="py-2 text-right">1</td>
                                    <td className="py-2 text-right">$25,000</td>
                                    <td className="py-2 text-right">$25,000</td>
                                </tr>
                                <tr className="border-b">
                                    <td className="py-2">Producto para el cabello</td>
                                    <td className="py-2 text-right">2</td>
                                    <td className="py-2 text-right">$30,000</td>
                                    <td className="py-2 text-right">$60,000</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    <div className="flex justify-end">
                        <div className="w-64">
                            <div className="flex justify-between py-1">
                                <span>Subtotal</span>
                                <span>$120,000</span>
                            </div>
                            <div className="flex justify-between py-1">
                                <span>IVA (19%)</span>
                                <span>$0</span>
                            </div>
                            <div className="flex justify-between py-1 font-bold border-t border-b">
                                <span>Total</span>
                                <span>{cotizacion.monto}</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="flex justify-end gap-2">
                    <Button variant="outline">Descargar PDF</Button>
                    <Button variant="outline">Enviar por correo</Button>
                    {cotizacion.estado === "Aprobada" && (
                        <Button className="bg-black hover:bg-gray-800" onClick={() => router.push("/facturacion/nueva-factura")}>
                            Convertir a Factura
                            <ArrowRightIcon className="ml-2 h-4 w-4" />
                        </Button>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    )
}

export default function CotizacionesPage() {
    const router = useRouter()
    const [currentPage, setCurrentPage] = useState(1)
    const [search, setSearch] = useState("")
    const [itemsPerPage] = useState(5)
    const [filtro, setFiltro] = useState("Todos")
    const normalize = (text: string) =>
        text.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase()

    // Filtrar cotizaciones
    const cotizacionesFiltradas = cotizaciones.filter((cotizacion) => {
        const coincideEstado =
            filtro === "Todos" || cotizacion.estado === filtro

        const coincideBusqueda =
            cotizacion.id.toString().toLowerCase().includes(search.toLowerCase()) ||
            normalize(cotizacion.cliente).includes(normalize(search))

        return coincideEstado && coincideBusqueda
    })

    // Calcular índices para paginación
    const indexOfLastItem = currentPage * itemsPerPage
    const indexOfFirstItem = indexOfLastItem - itemsPerPage
    const currentItems = cotizacionesFiltradas.slice(indexOfFirstItem, indexOfLastItem)
    const totalPages = Math.ceil(cotizacionesFiltradas.length / itemsPerPage)

    // Cambiar de página
    const paginate = (pageNumber) => setCurrentPage(pageNumber)

    // Animaciones con Framer Motion
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
            },
        },
    }

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: {
                type: "spring",
                stiffness: 100,
            },
        },
    }

    const [isMobile, setIsMobile] = useState(false)

    useEffect(() => {
        const check = () => setIsMobile(window.innerWidth < 768)
        check()
        window.addEventListener("resize", check)
        return () => window.removeEventListener("resize", check)
    }, [])


    return (
        <AuthGuard>
            <ModuleLayout moduleType="facturacion">
                <main className="flex-1 overflow-y-auto px-4 py-6 md:p-9 bg-gray-50">

                    {/* HEADER */}
                    <motion.div
                        className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6"
                        initial="hidden"
                        animate="visible"
                        variants={containerVariants}
                    >
                        <h1 className="text-xl md:text-2xl font-bold">Cotizaciones</h1>

                        <Button
                            onClick={() => router.push("/facturacion/nueva-cotizacion")}
                            className="w-full md:w-auto bg-purple-600 hover:bg-purple-700 text-white"
                        >
                            <PlusIcon className="mr-2 h-4 w-4" />
                            Nueva Cotización
                        </Button>
                    </motion.div>

                    {/* FILTROS */}
                    <motion.div
                        className="bg-white rounded-xl p-4 md:p-6 shadow-sm mb-6"
                        variants={itemVariants}
                    >
                        <div className="flex flex-col gap-4">

                            {/* BOTONES DE ESTADO */}
                            <div className="flex gap-2 overflow-x-auto pb-1">
                                {["Todos", "Aprobada", "Pendiente", "Rechazada"].map((estado) => (
                                    <Button
                                        key={estado}
                                        variant={filtro === estado ? "default" : "outline"}
                                        onClick={() => {
                                            setFiltro(estado)
                                            setCurrentPage(1)
                                        }}
                                        className={`whitespace-nowrap ${filtro === estado
                                            ? estado === "Aprobada"
                                                ? "bg-green-600 hover:bg-green-700"
                                                : estado === "Pendiente"
                                                    ? "bg-yellow-600 hover:bg-yellow-700"
                                                    : estado === "Rechazada"
                                                        ? "bg-red-600 hover:bg-red-700"
                                                        : "bg-purple-600 hover:bg-purple-700 text-white"
                                            : ""
                                            }`}
                                    >
                                        {estado === "Todos" ? "Todas" : estado}
                                    </Button>
                                ))}
                            </div>

                            {/* BUSCADOR */}
                            <div className="relative w-full">
                                <input
                                    type="text"
                                    placeholder="Buscar cotización..."
                                    value={search}
                                    onChange={(e) => {
                                        setSearch(e.target.value)
                                        setCurrentPage(1)
                                    }}
                                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                                />

                                <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                            </div>
                        </div>
                    </motion.div>

                    {/* ================= MOBILE: CARDS ================= */}
                    <div
                        className="
                        md:hidden
                        space-y-4
                        max-h-[calc(100vh-260px)]
                        overflow-y-auto
                        pr-1"
                    >
                        {currentItems.map((cotizacion) => (
                            <motion.div
                                key={cotizacion.id}
                                className="bg-white rounded-xl p-4 shadow-sm border"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                            >
                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-sm font-semibold">
                                        #{cotizacion.id}
                                    </span>

                                    <span
                                        className={`px-2 py-1 rounded-full text-xs ${cotizacion.estado === "Aprobada"
                                            ? "bg-green-100 text-green-800"
                                            : cotizacion.estado === "Pendiente"
                                                ? "bg-yellow-100 text-yellow-800"
                                                : "bg-red-100 text-red-800"
                                            }`}
                                    >
                                        {cotizacion.estado}
                                    </span>
                                </div>

                                <p className="text-sm text-gray-600">{cotizacion.cliente}</p>
                                <p className="text-sm text-gray-500">{cotizacion.fecha}</p>
                                <p className="font-semibold mt-1">{cotizacion.monto}</p>

                                <div className="flex justify-end gap-3 mt-4">
                                    <VisualizarCotizacionModal cotizacion={cotizacion} />
                                    <button onClick={() => router.push(`/facturacion/editar-cotizacion/${cotizacion.id}`)}>
                                        <EditIcon className="w-5 h-5 text-gray-500" />
                                    </button>
                                    <DownloadIcon className="w-5 h-5 text-gray-500" />
                                    <TrashIcon className="w-5 h-5 text-gray-500" />
                                </div>
                            </motion.div>
                        ))}
                    </div>


                    {/* ================= DESKTOP: TABLE ================= */}
                    <div className="hidden md:block bg-white rounded-xl p-6 shadow-sm">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="text-left text-sm text-gray-500 border-b">
                                        <th className="pb-3">Nº</th>
                                        <th className="pb-3">Cliente</th>
                                        <th className="pb-3">Fecha</th>
                                        <th className="pb-3">Monto</th>
                                        <th className="pb-3">Estado</th>
                                        <th className="pb-3">Acciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {currentItems.map((cotizacion) => (
                                        <tr key={cotizacion.id} className="border-b hover:bg-gray-50">
                                            <td className="py-3">{cotizacion.id}</td>
                                            <td>{cotizacion.cliente}</td>
                                            <td>{cotizacion.fecha}</td>
                                            <td>{cotizacion.monto}</td>
                                            <td>
                                                <span className="px-2 py-1 rounded-full text-xs bg-gray-100">
                                                    {cotizacion.estado}
                                                </span>
                                            </td>
                                            <td className="flex gap-2 py-3">
                                                <VisualizarCotizacionModal cotizacion={cotizacion} />
                                                <EditIcon className="w-4 h-4 text-gray-500 cursor-pointer" />
                                                <DownloadIcon className="w-4 h-4 text-gray-500 cursor-pointer" />
                                                <TrashIcon className="w-4 h-4 text-gray-500 cursor-pointer" />
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* ================= PAGINACIÓN ================= */}
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mt-6">

                        {/* INFO */}
                        <p className="text-sm text-gray-500 text-center md:text-left">
                            Mostrando {indexOfFirstItem + 1} a{" "}
                            {Math.min(indexOfLastItem, cotizacionesFiltradas.length)} de{" "}
                            {cotizacionesFiltradas.length} cotizaciones
                        </p>

                        {/* CONTROLES */}
                        <div className="flex justify-center md:justify-end items-center gap-1">

                            {/* PREV */}
                            <button
                                onClick={() => currentPage > 1 && paginate(currentPage - 1)}
                                disabled={currentPage === 1}
                                className="p-2 border rounded-md disabled:opacity-40"
                            >
                                <ChevronLeftIcon className="w-4 h-4" />
                            </button>

                            {/* PÁGINAS (mobile simplificado, desktop completo) */}
                            <div className="flex gap-1">
                                {Array.from({ length: totalPages }).map((_, i) => {
                                    const page = i + 1

                                    // 🔹 En mobile solo mostramos la página actual
                                    if (isMobile && page !== currentPage) return null

                                    return (
                                        <button
                                            key={page}
                                            onClick={() => paginate(page)}
                                            className={`px-3 py-1 rounded-md text-sm ${currentPage === page
                                                    ? "bg-black text-white"
                                                    : "border hover:bg-gray-100"
                                                }`}
                                        >
                                            {page}
                                        </button>
                                    )
                                })}
                            </div>


                            {/* NEXT */}
                            <button
                                onClick={() => currentPage < totalPages && paginate(currentPage + 1)}
                                disabled={currentPage === totalPages}
                                className="p-2 border rounded-md disabled:opacity-40"
                            >
                                <ChevronRightIcon className="w-4 h-4" />
                            </button>
                        </div>
                    </div>


                </main>
            </ModuleLayout>
        </AuthGuard>


    )
}

