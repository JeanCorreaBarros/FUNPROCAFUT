"use client"

import { AuthGuard } from "@/components/auth-guard"
import { ModuleLayout } from "@/components/module-layout"
import { useState } from "react"
import { motion } from "framer-motion"
import {
    PlusIcon,
    SearchIcon,
    FilterIcon,
    ArrowUpDownIcon,
    EyeIcon,
    DownloadIcon,
    CheckIcon,
    XIcon,
    ChevronLeftIcon,
    ChevronRightIcon,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"

/* ---------------- DATA ---------------- */

const pagos = [
    {
        id: "P-001",
        factura: "F-001",
        cliente: "María González",
        fecha: "15/05/2023",
        monto: "$120,000",
        metodo: "Tarjeta de crédito",
        estado: "Completado",
    },
    {
        id: "P-002",
        factura: "F-002",
        cliente: "Carlos Pérez",
        fecha: "12/05/2023",
        monto: "$85,000",
        metodo: "Transferencia",
        estado: "Completado",
    },
    {
        id: "P-003",
        factura: "F-004",
        cliente: "Juan López",
        fecha: "05/05/2023",
        monto: "$95,000",
        metodo: "Efectivo",
        estado: "Pendiente",
    },
    {
        id: "P-004",
        factura: "F-006",
        cliente: "Roberto Díaz",
        fecha: "28/04/2023",
        monto: "$130,000",
        metodo: "Tarjeta débito",
        estado: "Completado",
    },
    {
        id: "P-005",
        factura: "F-007",
        cliente: "Carmen Rodríguez",
        fecha: "25/04/2023",
        monto: "$90,000",
        metodo: "Transferencia",
        estado: "Completado",
    },
]

/* ---------------- MODAL ---------------- */

function VisualizarPagoModal({ pago }: any) {
    return (
        <Dialog>
            <DialogTrigger asChild>
                <button className="p-2 rounded-md border">
                    <EyeIcon className="w-4 h-4" />
                </button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>Detalles del Pago {pago.id}</DialogTitle>
                </DialogHeader>

                <div className="space-y-3 text-sm">
                    {[
                        ["Factura", pago.factura],
                        ["Cliente", pago.cliente],
                        ["Fecha", pago.fecha],
                        ["Monto", pago.monto],
                        ["Método", pago.metodo],
                    ].map(([label, value]) => (
                        <div key={label} className="flex justify-between border-b pb-2">
                            <span className="font-medium">{label}</span>
                            <span>{value}</span>
                        </div>
                    ))}

                    <div className="flex justify-between">
                        <span className="font-medium">Estado</span>
                        <span
                            className={`px-2 py-1 rounded-full text-xs ${pago.estado === "Completado"
                                ? "bg-green-100 text-green-800"
                                : "bg-yellow-100 text-yellow-800"
                                }`}
                        >
                            {pago.estado}
                        </span>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}

/* ---------------- PAGE ---------------- */

export default function PagosPage() {
    const [currentPage, setCurrentPage] = useState(1)
    const itemsPerPage = 5
    const [search, setSearch] = useState("")
    const [estado, setEstado] = useState("Todos")
    const normalizeText = (text: string) =>
        text
            .toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .trim()



    const indexOfLastItem = currentPage * itemsPerPage
    const indexOfFirstItem = indexOfLastItem - itemsPerPage
    const currentItems = pagos.slice(indexOfFirstItem, indexOfLastItem)
    const totalPages = Math.ceil(pagos.length / itemsPerPage)

    const pagosFiltrados = pagos.filter((pago) => {
        const searchNormalized = normalizeText(search)

        const coincideBusqueda =
            normalizeText(pago.id).includes(searchNormalized) ||
            normalizeText(pago.factura).includes(searchNormalized) ||
            normalizeText(pago.cliente).includes(searchNormalized)

        const coincideEstado =
            estado === "Todos" || pago.estado === estado

        return coincideBusqueda && coincideEstado
    })



    return (
        <AuthGuard>
            <ModuleLayout moduleType="facturacion">
                <main className="p-4 md:p-9 bg-gray-50 min-h-screen">

                    {/* HEADER */}
                    <div className="flex justify-between items-center mb-6">
                        <h1 className="text-xl md:text-2xl font-bold">Pagos Recibidos</h1>
                        <Button className="bg-purple-600 hover:bg-purple-700 hover:scale-95 text-white">
                            <PlusIcon className="w-4 h-4 mr-2" />
                            Registrar
                        </Button>
                    </div>

                    {/* KPIs */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                        <Card><CardContent className="p-4"><p className="text-sm">Total</p><p className="text-xl font-bold">$520,000</p></CardContent></Card>
                        <Card><CardContent className="p-4"><p className="text-sm">Pendientes</p><p className="text-xl font-bold">$95,000</p></CardContent></Card>
                        <Card className="hidden md:block"><CardContent className="p-4"><p className="text-sm">Método</p><p className="text-xl font-bold">Transferencia</p></CardContent></Card>
                        <Card className="hidden md:block"><CardContent className="p-4"><p className="text-sm">Promedio</p><p className="text-xl font-bold">$104,000</p></CardContent></Card>
                    </div>

                    {/* FILTROS */}
                    <div className="bg-white rounded-xl p-4 mb-6 shadow-sm flex flex-col md:flex-row gap-3">
                        <input
                            placeholder="Buscar pago..."
                            value={search}
                            onChange={(e) => {
                                setSearch(e.target.value)
                                setCurrentPage(1)
                            }}
                            className="w-full pl-9 pr-4 py-2 border rounded-md"
                        />


                        <select
                            value={estado}
                            onChange={(e) => {
                                setEstado(e.target.value)
                                setCurrentPage(1)
                            }}
                            className="w-full md:w-52 px-3 py-2 border rounded-md"
                        >
                            <option value="Todos">Todos los estados</option>
                            <option value="Completado">Completados</option>
                            <option value="Pendiente">Pendientes</option>
                        </select>

                    </div>

                    {/* MOBILE CARDS */}
                    <div className="md:hidden space-y-4">
                        {pagosFiltrados.map((pago) => (
                            <Card key={pago.id}>
                                <CardContent className="p-4 space-y-3">
                                    <div className="flex justify-between">
                                        <div>
                                            <p className="text-xs text-gray-500">Pago</p>
                                            <p className="font-semibold">{pago.id}</p>
                                        </div>
                                        <span className={`text-xs px-2 py-3 rounded-full ${pago.estado === "Completado"
                                            ? "bg-green-100 text-green-800"
                                            : "bg-yellow-100 text-yellow-800"
                                            }`}>
                                            {pago.estado}
                                        </span>
                                    </div>

                                    <div className="text-sm">
                                        <p><b>Cliente:</b> {pago.cliente}</p>
                                        <p><b>Factura:</b> {pago.factura}</p>
                                        <p><b>Fecha:</b> {pago.fecha}</p>
                                        <p><b>Método:</b> {pago.metodo}</p>
                                    </div>

                                    <div className="flex justify-between items-center pt-2 border-t">
                                        <span className="font-bold">{pago.monto}</span>
                                        <div className="flex gap-2">
                                            <VisualizarPagoModal pago={pago} />
                                            <button className="p-2 border rounded-md">
                                                <DownloadIcon className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>

                    {/* DESKTOP TABLE */}
                    <div className="hidden md:block bg-white rounded-xl p-6 shadow-sm">
                        <table className="w-full text-sm">
                            <thead className="border-b text-gray-500">
                                <tr>
                                    <th>ID</th><th>Factura</th><th>Cliente</th><th>Fecha</th>
                                    <th>Monto</th><th>Método</th><th>Estado</th><th></th>
                                </tr>
                            </thead>
                            <tbody>
                                {pagosFiltrados.map((pago) => (
                                    <tr key={pago.id} className="border-b">
                                        <td>{pago.id}</td>
                                        <td>{pago.factura}</td>
                                        <td>{pago.cliente}</td>
                                        <td>{pago.fecha}</td>
                                        <td>{pago.monto}</td>
                                        <td>{pago.metodo}</td>
                                        <td>{pago.estado}</td>
                                        <td className="flex gap-2 py-2">
                                            <VisualizarPagoModal pago={pago} />
                                            <DownloadIcon className="w-4 h-4" />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* PAGINACIÓN */}
                    <div className="flex justify-between items-center mt-6">
                        <span className="text-sm text-gray-500">
                            Página {currentPage} de {totalPages}
                        </span>
                        <div className="flex gap-2">
                            <Button variant="outline" size="sm" disabled={currentPage === 1} onClick={() => setCurrentPage(p => p - 1)}>
                                <ChevronLeftIcon className="w-4 h-4" />
                            </Button>
                            <Button variant="outline" size="sm" disabled={currentPage === totalPages} onClick={() => setCurrentPage(p => p + 1)}>
                                <ChevronRightIcon className="w-4 h-4" />
                            </Button>
                        </div>
                    </div>

                </main>
            </ModuleLayout>
        </AuthGuard>
    )
}
