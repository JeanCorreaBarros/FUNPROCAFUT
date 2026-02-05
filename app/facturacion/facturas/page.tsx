"use client"

import { useState } from "react"
import dynamic from "next/dynamic"
import { BivooLoader } from "@/components/bivoo-loader"
import { AuthGuard } from "@/components/auth-guard"
import { ModuleLayout } from "@/components/module-layout"
import { Button } from "@/components/ui/button"
import {
    PlusIcon,
    SearchIcon,
    FilterIcon,
    DownloadIcon,
    EyeIcon,
    EditIcon,
    TrashIcon,
    ChevronLeftIcon,
    ChevronRightIcon,
} from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"

export default function FacturasPage() {
    const [currentPage, setCurrentPage] = useState(1)
    const [selectedFactura, setSelectedFactura] = useState(null)

    // Datos de ejemplo
    const facturas = [
        { id: "B360-001", cliente: "Juan Pérez", fecha: "2023-03-15", total: 150000, estado: "Pagada" },
        { id: "B360-002", cliente: "María López", fecha: "2023-03-16", total: 85000, estado: "Pendiente" },
        { id: "B360-003", cliente: "Carlos Rodríguez", fecha: "2023-03-17", total: 220000, estado: "Pagada" },
        { id: "B360-004", cliente: "Ana Martínez", fecha: "2023-03-18", total: 175000, estado: "Anulada" },
        { id: "B360-005", cliente: "Pedro Gómez", fecha: "2023-03-19", total: 95000, estado: "Pendiente" },
        { id: "B360-006", cliente: "Laura Sánchez", fecha: "2023-03-20", total: 320000, estado: "Pagada" },
        { id: "B360-007", cliente: "Roberto Díaz", fecha: "2023-03-21", total: 145000, estado: "Pendiente" },
        { id: "B360-008", cliente: "Sofía Castro", fecha: "2023-03-22", total: 210000, estado: "Pagada" },
        { id: "B360-009", cliente: "Miguel Torres", fecha: "2023-03-23", total: 180000, estado: "Pendiente" },
        { id: "B360-010", cliente: "Carmen Vargas", fecha: "2023-03-24", total: 250000, estado: "Pagada" },
    ]

    const itemsPerPage = 5
    const totalPages = Math.ceil(facturas.length / itemsPerPage)

    const paginatedFacturas = facturas.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

    const formatCurrency = (value) => {
        return new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP" }).format(value)
    }

    const getStatusColor = (estado) => {
        switch (estado) {
            case "Pagada":
                return "bg-green-100 text-green-800"
            case "Pendiente":
                return "bg-yellow-100 text-yellow-800"
            case "Anulada":
                return "bg-red-100 text-red-800"
            default:
                return "bg-gray-100 text-gray-800"
        }
    }

    return (

        <AuthGuard>
            <ModuleLayout moduleType="facturacion">
                <main className="flex-1 overflow-y-auto  ">

                    <div className="flex min-h-screen bg-gray-50">
                        <div className="flex flex-col flex-1 overflow-hidden">
                            <main className="flex-1 overflow-y-auto p-9">
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.3 }}
                                    className="max-w-6xl mx-auto"
                                >
                                    {/* Header con título y botones */}
                                    <div className="flex justify-between items-center mb-6">
                                        <h1 className="text-2xl font-bold">Facturas</h1>
                                        <Link href="/facturacion/nueva-factura">
                                            <Button className="bg-blue-600 hover:bg-blue-700">
                                                <PlusIcon className="mr-2 h-4 w-4" />
                                                Nueva Factura
                                            </Button>
                                        </Link>
                                    </div>


                                    {/* Filtros y búsqueda */}
                                    <div className="bg-white p-4 rounded-xl shadow-sm mb-6">
                                        <div className="flex flex-col gap-4">

                                            {/* Buscador */}
                                            <div className="relative w-full">
                                                <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
                                                <input
                                                    type="text"
                                                    placeholder="Buscar factura..."
                                                    className="w-full pl-10 pr-4 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-bivoo-purple"
                                                />
                                            </div>

                                            {/* Filtros */}
                                            <div className="grid grid-cols-1 sm:grid-cols-2 md:flex gap-3">

                                                {/* Estado */}
                                                <select className="w-full border rounded-lg px-3 py-2.5 text-sm">
                                                    <option>Todas</option>
                                                    <option>Pagadas</option>
                                                    <option>Pendientes</option>
                                                    <option>Anuladas</option>
                                                </select>

                                                {/* Periodo */}
                                                <select className="w-full border rounded-lg px-3 py-2.5 text-sm">
                                                    <option>Este mes</option>
                                                    <option>Último mes</option>
                                                    <option>Último trimestre</option>
                                                    <option>Este año</option>
                                                </select>

                                                {/* Botón filtrar */}
                                                <Button
                                                    variant="outline"
                                                    className="w-full md:w-auto flex items-center justify-center gap-2"
                                                >
                                                    <FilterIcon className="h-4 w-4" />
                                                    Filtrar
                                                </Button>

                                            </div>
                                        </div>
                                    </div>


                                    {/* Tabla de facturas */}
                                    <div className="bg-white hidden md:block rounded-lg shadow-sm overflow-hidden mb-6">
                                        <div className="overflow-x-auto">
                                            <table className="w-full">
                                                <thead>
                                                    <tr className="bg-gray-50 border-b">
                                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                            No. Factura
                                                        </th>
                                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                            Cliente
                                                        </th>
                                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                            Fecha
                                                        </th>
                                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                            Total
                                                        </th>
                                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                            Estado
                                                        </th>
                                                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                            Acciones
                                                        </th>
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-gray-200">
                                                    {paginatedFacturas.map((factura) => (
                                                        <motion.tr
                                                            key={factura.id}
                                                            initial={{ opacity: 0 }}
                                                            animate={{ opacity: 1 }}
                                                            transition={{ duration: 0.3 }}
                                                            className="hover:bg-gray-50"
                                                        >
                                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600">{factura.id}</td>
                                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{factura.cliente}</td>
                                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                                {new Date(factura.fecha).toLocaleDateString("es-ES")}
                                                            </td>
                                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                                {formatCurrency(factura.total)}
                                                            </td>
                                                            <td className="px-6 py-4 whitespace-nowrap">
                                                                <span
                                                                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(factura.estado)}`}
                                                                >
                                                                    {factura.estado}
                                                                </span>
                                                            </td>
                                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                                <div className="flex justify-end space-x-2">
                                                                    <Dialog>
                                                                        <DialogTrigger asChild>
                                                                            <Button
                                                                                variant="ghost"
                                                                                size="sm"
                                                                                className="text-blue-600 hover:text-blue-800"
                                                                                onClick={() => setSelectedFactura(factura)}
                                                                            >
                                                                                <EyeIcon className="h-4 w-4" />
                                                                            </Button>
                                                                        </DialogTrigger>
                                                                        <DialogContent className="max-w-3xl">
                                                                            <DialogHeader>
                                                                                <DialogTitle>Factura {selectedFactura?.id}</DialogTitle>
                                                                            </DialogHeader>
                                                                            <div className="p-4">
                                                                                {selectedFactura && (
                                                                                    <div className="space-y-4">
                                                                                        <div className="grid grid-cols-2 gap-4">
                                                                                            <div>
                                                                                                <h3 className="font-semibold">Información del cliente</h3>
                                                                                                <p>Cliente: {selectedFactura.cliente}</p>
                                                                                                <p>Teléfono: 123-456-7890</p>
                                                                                                <p>Email: cliente@ejemplo.com</p>
                                                                                            </div>
                                                                                            <div>
                                                                                                <h3 className="font-semibold">Información de la factura</h3>
                                                                                                <p>Número: {selectedFactura.id}</p>
                                                                                                <p>Fecha: {new Date(selectedFactura.fecha).toLocaleDateString("es-ES")}</p>
                                                                                                <p>Estado: {selectedFactura.estado}</p>
                                                                                            </div>
                                                                                        </div>
                                                                                        <div>
                                                                                            <h3 className="font-semibold mb-2">Detalles</h3>
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
                                                                                                        <td className="py-2 text-right">
                                                                                                            {formatCurrency(selectedFactura.total * 0.7)}
                                                                                                        </td>
                                                                                                        <td className="py-2 text-right">
                                                                                                            {formatCurrency(selectedFactura.total * 0.7)}
                                                                                                        </td>
                                                                                                    </tr>
                                                                                                    <tr className="border-b">
                                                                                                        <td className="py-2">Productos para el cabello</td>
                                                                                                        <td className="py-2 text-right">1</td>
                                                                                                        <td className="py-2 text-right">
                                                                                                            {formatCurrency(selectedFactura.total * 0.3)}
                                                                                                        </td>
                                                                                                        <td className="py-2 text-right">
                                                                                                            {formatCurrency(selectedFactura.total * 0.3)}
                                                                                                        </td>
                                                                                                    </tr>
                                                                                                </tbody>
                                                                                                <tfoot>
                                                                                                    <tr>
                                                                                                        <td colSpan={3} className="text-right py-2 font-semibold">
                                                                                                            Total:
                                                                                                        </td>
                                                                                                        <td className="text-right py-2 font-semibold">
                                                                                                            {formatCurrency(selectedFactura.total)}
                                                                                                        </td>
                                                                                                    </tr>
                                                                                                </tfoot>
                                                                                            </table>
                                                                                        </div>
                                                                                        <div className="flex justify-end space-x-2">
                                                                                            <Button variant="outline">
                                                                                                <DownloadIcon className="mr-2 h-4 w-4" />
                                                                                                Descargar PDF
                                                                                            </Button>
                                                                                        </div>
                                                                                    </div>
                                                                                )}
                                                                            </div>
                                                                        </DialogContent>
                                                                    </Dialog>
                                                                    <Button variant="ghost" size="sm" className="text-amber-600 hover:text-amber-800">
                                                                        <EditIcon className="h-4 w-4" />
                                                                    </Button>
                                                                    <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-800">
                                                                        <TrashIcon className="h-4 w-4" />
                                                                    </Button>
                                                                    <Button variant="ghost" size="sm" className="text-gray-600 hover:text-gray-800">
                                                                        <DownloadIcon className="h-4 w-4" />
                                                                    </Button>
                                                                </div>
                                                            </td>
                                                        </motion.tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>

                                    {/* ================= MOBILE: CARDS ================= */}
                                    <div className="md:hidden space-y-4 max-h-[calc(100vh-260px)] overflow-y-auto pr-1 mb-6">
                                        {paginatedFacturas.map((factura) => (
                                            <motion.div
                                                key={factura.id}
                                                className="bg-white rounded-xl p-4 shadow-sm border"
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                            >
                                                <div className="flex justify-between items-center mb-2">
                                                    <span className="font-semibold text-sm">#{factura.id}</span>

                                                    <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(factura.estado)}`}>
                                                        {factura.estado}
                                                    </span>
                                                </div>

                                                <p className="text-sm text-gray-700">{factura.cliente}</p>
                                                <p className="text-xs text-gray-500">
                                                    {new Date(factura.fecha).toLocaleDateString("es-ES")}
                                                </p>

                                                <p className="font-semibold mt-1">
                                                    {formatCurrency(factura.total)}
                                                </p>

                                                <div className="flex justify-end gap-3 mt-4">
                                                    <EyeIcon className="w-5 h-5 text-blue-600 cursor-pointer" />
                                                    <EditIcon className="w-5 h-5 text-amber-600 cursor-pointer" />
                                                    <DownloadIcon className="w-5 h-5 text-gray-600 cursor-pointer" />
                                                    <TrashIcon className="w-5 h-5 text-red-600 cursor-pointer" />
                                                </div>
                                            </motion.div>
                                        ))}
                                    </div>


                                     {/* Paginación */}
                                        <div className="px-6 py-4 flex items-center justify-between border-t">
                                            <div className="text-sm text-gray-500">
                                                Mostrando {(currentPage - 1) * itemsPerPage + 1} a{" "}
                                                {Math.min(currentPage * itemsPerPage, facturas.length)} de {facturas.length} facturas
                                            </div>
                                            <div className="flex space-x-2">
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                                                    disabled={currentPage === 1}
                                                >
                                                    <ChevronLeftIcon className="h-4 w-4" />
                                                </Button>
                                                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                                                    <Button
                                                        key={page}
                                                        variant={currentPage === page ? "default" : "outline"}
                                                        size="sm"
                                                        onClick={() => setCurrentPage(page)}
                                                    >
                                                        {page}
                                                    </Button>
                                                ))}
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                                                    disabled={currentPage === totalPages}
                                                >
                                                    <ChevronRightIcon className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </div>

                                </motion.div>
                            </main>
                        </div>


                    </div>

                </main>
            </ModuleLayout>
        </AuthGuard>

    )
}

