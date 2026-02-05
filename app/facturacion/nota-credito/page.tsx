"use client"

import { useState, useMemo } from "react"
import { AuthGuard } from "@/components/auth-guard"
import { ModuleLayout } from "@/components/module-layout"
import { motion } from "framer-motion"
import { useRouter } from "next/navigation"
import {
    PlusIcon,
    SearchIcon,
    EyeIcon,
    DownloadIcon,
    ChevronLeftIcon,
    ChevronRightIcon,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"

/* -------------------- DATA -------------------- */
const notasCredito = [
    {
        id: "NC-001",
        factura: "F-001",
        cliente: "María González",
        fecha: "20/05/2023",
        monto: "$30,000",
        motivo: "Devolución parcial",
    },
    {
        id: "NC-002",
        factura: "F-003",
        cliente: "Ana Martínez",
        fecha: "15/05/2023",
        monto: "$50,000",
        motivo: "Descuento post-venta",
    },
    {
        id: "NC-003",
        factura: "F-005",
        cliente: "Laura Sánchez",
        fecha: "10/05/2023",
        monto: "$110,000",
        motivo: "Anulación de factura",
    },
    {
        id: "NC-004",
        factura: "F-007",
        cliente: "Carmen Rodríguez",
        fecha: "05/05/2023",
        monto: "$20,000",
        motivo: "Corrección de precio",
    },
]

/* -------------------- MODAL -------------------- */
function VisualizarNotaCreditoModal({ notaCredito }: any) {
    return (
        <Dialog>
            <DialogTrigger asChild>
                <button className="p-1 text-gray-500 hover:text-gray-700">
                    <EyeIcon className="w-4 h-4" />
                </button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-[700px]">
                <DialogHeader>
                    <DialogTitle>Nota de Crédito {notaCredito.id}</DialogTitle>
                </DialogHeader>

                <div className="space-y-4 text-sm">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <p className="font-medium">Cliente</p>
                            <p>{notaCredito.cliente}</p>
                        </div>
                        <div>
                            <p className="font-medium">Factura</p>
                            <p>{notaCredito.factura}</p>
                        </div>
                        <div>
                            <p className="font-medium">Fecha</p>
                            <p>{notaCredito.fecha}</p>
                        </div>
                        <div>
                            <p className="font-medium">Motivo</p>
                            <p>{notaCredito.motivo}</p>
                        </div>
                    </div>

                    <div className="flex justify-between font-bold border-t pt-4">
                        <span>Total</span>
                        <span>{notaCredito.monto}</span>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}

/* -------------------- PAGE -------------------- */
export default function NotasCreditoPage() {
    const router = useRouter()
    const normalize = (text: string) =>
        text
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .toLowerCase()


    const [search, setSearch] = useState("")
    const [motivo, setMotivo] = useState("Todos")
    const [currentPage, setCurrentPage] = useState(1)
    const itemsPerPage = 5

    /* -------------------- FILTROS -------------------- */
    const notasFiltradas = useMemo(() => {
        const searchNormalized = normalize(search)

        return notasCredito.filter((nota) => {
            const coincideBusqueda =
                normalize(nota.id).includes(searchNormalized) ||
                normalize(nota.cliente).includes(searchNormalized) ||
                normalize(nota.factura).includes(searchNormalized)

            const coincideMotivo =
                motivo === "Todos" || nota.motivo === motivo

            return coincideBusqueda && coincideMotivo
        })
    }, [search, motivo])


    /* -------------------- PAGINACIÓN -------------------- */
    const totalPages = Math.ceil(notasFiltradas.length / itemsPerPage)

    const indexOfLastItem = currentPage * itemsPerPage
    const indexOfFirstItem = indexOfLastItem - itemsPerPage

    const currentItems = notasFiltradas.slice(
        indexOfFirstItem,
        indexOfLastItem
    )

    return (
        <AuthGuard>
            <ModuleLayout moduleType="facturacion">
                <main className="p-8 bg-gray-50 min-h-screen">

                    {/* HEADER */}
                    <div className="flex justify-between items-center mb-6">
                        <h1 className="text-2xl font-bold">
                            Notas de Crédito
                        </h1>
                        <Button
                            onClick={() =>
                                router.push("/facturacion/nueva-nota-credito")
                            }
                            className="bg-purple-600 hover:bg-purple-700"
                        >
                            <PlusIcon className="w-4 h-4 mr-2" />
                            Nueva Nota
                        </Button>
                    </div>

                    {/* FILTROS */}
                    <div className="bg-white rounded-xl p-6 shadow-sm mb-6">
                        <div className="flex flex-col md:flex-row gap-3 md:gap-4">
                            {/* BUSCADOR */}
                            <div className="relative w-full md:flex-1">
                                <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <input
                                    value={search}
                                    onChange={(e) => {
                                        setSearch(e.target.value)
                                        setCurrentPage(1)
                                    }}
                                    placeholder="Buscar por cliente, factura o nota..."
                                    className="w-full pl-9 pr-4 py-2 border rounded-md focus:ring-2 focus:ring-black"
                                />
                            </div>

                            {/* SELECT MOTIVO */}
                            <select
                                value={motivo}
                                onChange={(e) => {
                                    setMotivo(e.target.value)
                                    setCurrentPage(1)
                                }}
                                className="w-full md:w-auto px-3 py-2 border rounded-md focus:ring-2 focus:ring-black"
                            >
                                <option value="Todos">Todos los motivos</option>
                                <option value="Devolución parcial">Devolución parcial</option>
                                <option value="Descuento post-venta">Descuento post-venta</option>
                                <option value="Anulación de factura">Anulación de factura</option>
                                <option value="Corrección de precio">Corrección de precio</option>
                            </select>
                        </div>

                    </div>

                    {/* TABLA */}
                    <div className="bg-white hidden md:block rounded-xl p-6 shadow-sm">
                        <table className="w-full text-sm">
                            <thead className="border-b text-gray-500">
                                <tr>
                                    <th className="py-3 text-left">Nota</th>
                                    <th>Factura</th>
                                    <th>Cliente</th>
                                    <th>Fecha</th>
                                    <th>Monto</th>
                                    <th>Motivo</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentItems.map((nota) => (
                                    <tr
                                        key={nota.id}
                                        className="border-b hover:bg-gray-50"
                                    >
                                        <td className="py-3">{nota.id}</td>
                                        <td>{nota.factura}</td>
                                        <td>{nota.cliente}</td>
                                        <td>{nota.fecha}</td>
                                        <td>{nota.monto}</td>
                                        <td>{nota.motivo}</td>
                                        <td>
                                            <div className="flex gap-2">
                                                <VisualizarNotaCreditoModal notaCredito={nota} />
                                                <button className="p-1 text-gray-500 hover:text-gray-700">
                                                    <DownloadIcon className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>


                    </div>

                    {/* ================= MOBILE CARDS ================= */}
                    <div
                        className="md:hidden space-y-4 max-h-[calc(100vh-220px)] overflow-y-auto pr-1"
                    >
                        {currentItems.map((nota) => (
                            <div
                                key={nota.id}
                                className="bg-white rounded-xl p-4 shadow-sm border"
                            >
                                <div className="flex justify-between items-center mb-2">
                                    <span className="font-semibold text-sm">{nota.id}</span>
                                    <span className="text-xs text-gray-500">{nota.fecha}</span>
                                </div>

                                <p className="text-sm text-gray-600">
                                    <strong>Cliente:</strong> {nota.cliente}
                                </p>

                                <p className="text-sm text-gray-600">
                                    <strong>Factura:</strong> {nota.factura}
                                </p>

                                <p className="text-sm text-gray-600">
                                    <strong>Motivo:</strong> {nota.motivo}
                                </p>

                                <p className="font-semibold mt-2">{nota.monto}</p>

                                <div className="flex justify-end gap-3 mt-4">
                                    <VisualizarNotaCreditoModal notaCredito={nota} />
                                    <button className="text-gray-500 hover:text-gray-700">
                                        <DownloadIcon className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>
                        ))}

                        {/* PAGINACIÓN MOBILE */}
                        {/*<div className="flex justify-center gap-2 pt-4">
                            <button
                                disabled={currentPage === 1}
                                onClick={() => setCurrentPage((p) => p - 1)}
                                className="p-2 border rounded-md disabled:opacity-50"
                            >
                                <ChevronLeftIcon className="w-4 h-4" />
                            </button>

                            <span className="text-sm font-medium flex items-center">
                                {currentPage} / {totalPages}
                            </span>

                            <button
                                disabled={currentPage === totalPages}
                                onClick={() => setCurrentPage((p) => p + 1)}
                                className="p-2 border rounded-md disabled:opacity-50"
                            >
                                <ChevronRightIcon className="w-4 h-4" />
                            </button>
                        </div>*/}
                    </div>
                    {/* PAGINACIÓN */}
                    <div className="flex justify-between items-center mt-4">
                        <span className="text-sm text-gray-500">
                            Mostrando {notasFiltradas.length} resultados
                        </span>

                        <div className="flex gap-2">
                            <button
                                disabled={currentPage === 1}
                                onClick={() =>
                                    setCurrentPage((p) => p - 1)
                                }
                                className="p-2 border rounded-md disabled:opacity-50"
                            >
                                <ChevronLeftIcon className="w-4 h-4" />
                            </button>

                            {Array.from({ length: totalPages }).map((_, i) => (
                                <button
                                    key={i}
                                    onClick={() => setCurrentPage(i + 1)}
                                    className={`px-3 py-1 rounded-md ${currentPage === i + 1
                                        ? "bg-black text-white"
                                        : "border"
                                        }`}
                                >
                                    {i + 1}
                                </button>
                            ))}

                            <button
                                disabled={currentPage === totalPages}
                                onClick={() =>
                                    setCurrentPage((p) => p + 1)
                                }
                                className="p-2 border rounded-md disabled:opacity-50"
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
