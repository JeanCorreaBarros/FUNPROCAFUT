"use client";

import { useState, Fragment } from "react";
import dynamic from "next/dynamic"
import { AuthGuard } from "@/components/auth-guard"
import { ModuleLayout } from "@/components/module-layout"
import { motion } from "framer-motion";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

const summary = [
    { label: "Total generado", value: "$8,810,012" },
    { label: "Comisiones en servicios", value: "$2,588,621" },
    { label: "Comisiones en productos", value: "$26,560" },
    { label: "Total comisiones", value: "$2,625,181" },
    { label: "Gastos", value: "$1,035,000" },
    { label: "Total a pagar", value: "$2,625,181", highlight: true },
];

const collaborators = [
    {
        initials: "JU",
        name: "Juan va Iderra...",
        sales: "$773,000",
        serviceCom: "$233,322",
        productCom: "$0",
        expenses: "$675,000",
        totalCom: "$233,322",
        tips: "$0",
        toPay: "-$441,678",
        highlight: false,
    },
    {
        initials: "PR",
        name: "Prueba 2",
        sales: "$255,000",
        serviceCom: "$100,000",
        productCom: "$0",
        expenses: "$0",
        totalCom: "$100,000",
        tips: "$0",
        toPay: "$100,000",
        highlight: false,
    },
    {
        initials: "YU",
        name: "yulieth",
        sales: "$857,000",
        serviceCom: "$441,530",
        productCom: "$0",
        expenses: "$0",
        totalCom: "$441,530",
        tips: "$0",
        toPay: "$441,530",
        highlight: false,
    },
    {
        initials: "JE",
        name: "Jessica",
        sales: "$2,201,012",
        serviceCom: "$898,648",
        productCom: "$2,000",
        expenses: "$250,000 + $22,000 de multas",
        totalCom: "$900,648",
        tips: "$0",
        toPay: "$628,648",
        highlight: false,
    },
    {
        initials: "JE",
        name: "Jessica Saav...",
        sales: "$3,423,000",
        serviceCom: "$515,121",
        productCom: "$10,000",
        expenses: "$529,621",
        totalCom: "$529,621",
        tips: "$100,000",
        toPay: "$529,621",
        highlight: false,
    },
];

function SearchIcon() {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
    );
}

const handleViewDetail = (colab: Collaborator | null) => {
    if (!colab) return
    console.log("Ver detalle:", colab)
    // 👉 aquí puedes navegar o abrir otro modal
}

const handleDownloadReceipt = (colab: Collaborator | null) => {
    if (!colab) return

    const content = `
Comprobante de pago
Colaborador: ${colab.name}
Total a pagar: ${colab.toPay}
Periodo: ${dateRange.from} a ${dateRange.to}
`

    const blob = new Blob([content], { type: "text/plain;charset=utf-8;" })
    const url = URL.createObjectURL(blob)

    const link = document.createElement("a")
    link.href = url
    link.download = `comprobante-${colab.name}.txt`
    link.click()

    URL.revokeObjectURL(url)
}

const handlePay = (colab: Collaborator | null) => {
    if (!colab) return
    console.log("Realizar pago:", colab)
    // 👉 aquí iría Stripe, Wompi, PayU, etc.
}


type Collaborator = typeof collaborators[number];

export default function ProcesoDePago() {
    const [dateRange, setDateRange] = useState({
        from: "2025-03-22",
        to: "2025-03-29",
    });
    const [showSearch, setShowSearch] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedColab, setSelectedColab] = useState<Collaborator | null>(null);
    const filteredCollaborators = collaborators.filter(c => c.name.toLowerCase().includes(searchTerm.toLowerCase()));
    return (
        <AuthGuard>
            <ModuleLayout moduleType="agenda">
                <div className="flex min-h-screen bg-gray-50 flex-col md:flex-row">
                    <div className="flex-1">
                        <motion.div
                            initial={{ opacity: 0, y: 32 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, ease: "easeOut" }}
                            className="p-4 md:p-8 max-w-full md:max-w-7xl mx-auto"
                        >
                            <div className="text-3xl font-bold mb-2">Proceso de pago</div>
                            <div className="text-gray-500 mb-6">
                                Calcula y liquida la cantidad adeudada a tu equipo por
                                propinas, comisiones y salarios.
                            </div>
                            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">

                                {/* Buscador animado a la izquierda */}
                                <div className="w-full md:w-auto flex items-center gap-2">
                                    <button
                                        className={`w-10 h-10 rounded-full bg-gray-100 hover:bg-purple-500 hover:text-white flex items-center justify-center transition-all duration-200 ${showSearch ? "bg-purple-500 text-white" : ""
                                            }`}
                                        onClick={() => setShowSearch((prev) => !prev)}
                                    >
                                        <SearchIcon />
                                    </button>

                                    <motion.div
                                        initial={{ width: 0, opacity: 0, x: -20 }}
                                        animate={
                                            showSearch
                                                ? { width: "100%", opacity: 1, x: 0 }
                                                : { width: 0, opacity: 0, x: -20 }
                                        }
                                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                        className="relative h-10 flex items-center bg-white rounded-full shadow-lg border border-gray-200 overflow-hidden"
                                    >
                                        {showSearch && (
                                            <input
                                                type="text"
                                                className="w-full px-4 py-2 bg-transparent outline-none text-gray-800 text-sm"
                                                placeholder="Buscar colaborador..."
                                                autoFocus
                                                value={searchTerm}
                                                onChange={(e) => setSearchTerm(e.target.value)}
                                                onBlur={() => setShowSearch(false)}
                                            />
                                        )}
                                    </motion.div>
                                </div>

                                {/* Selector de rango de fechas a la derecha */}
                            <div className="w-full md:w-auto flex flex-col gap-2">
  <span className="text-xs text-gray-500">
    Seleccionar rango de días
  </span>

  <div className="flex flex-col sm:flex-row gap-2">
    <input
      type="date"
      className="border rounded-md px-3 py-2 text-sm w-full sm:w-36 focus:outline-none focus:ring-2 focus:ring-purple-500"
      value={dateRange.from}
      onChange={(e) =>
        setDateRange((r) => ({ ...r, from: e.target.value }))
      }
      max={dateRange.to}
    />

    <input
      type="date"
      className="border rounded-md px-3 py-2 text-sm w-full sm:w-36 focus:outline-none focus:ring-2 focus:ring-purple-500"
      value={dateRange.to}
      onChange={(e) =>
        setDateRange((r) => ({ ...r, to: e.target.value }))
      }
      min={dateRange.from}
    />
  </div>
</div>


                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                                {summary.map((item, i) => (
                                    <div
                                        key={item.label}
                                        className={`flex-1 min-w-[180px] bg-white border rounded-xl p-4 flex flex-col items-center justify-center text-center ${item.highlight ? "border-green-500" : ""}`}
                                    >
                                        <span className="text-sm text-gray-500 mb-1">{item.label}</span>
                                        <span className={`text-2xl font-bold ${item.highlight ? "text-green-600" : "text-black"}`}>{item.value}</span>
                                    </div>
                                ))}
                            </div>
                            <div className="space-y-4 max-h-[420px] overflow-y-auto pr-2">
                                {filteredCollaborators.map((colab, i) => (
                                    <div key={i} className="flex flex-col md:flex-row items-center bg-white rounded-xl border p-0 gap-0 min-h-[80px]">
                                        <div className="w-full md:w-20 flex flex-col items-center justify-center h-full py-4 px-2">
                                            <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-lg mb-1">{colab.initials}</div>
                                        </div>
                                        <div className="flex flex-col justify-center w-full md:min-w-[140px] py-4 px-2">
                                            <div className="font-semibold truncate leading-tight">{colab.name}</div>
                                            <button
                                                className="text-xs text-blue-600 cursor-pointer px-2 py-1 rounded hover:bg-blue-50 transition-colors border border-blue-100 mt-1"
                                                onClick={() => { setSelectedColab(colab); setModalOpen(true); }}
                                            >
                                                Acciones
                                            </button>
                                        </div>
                                        <div className="w-full md:flex-1 flex flex-row md:flex-row items-stretch justify-between gap-0 overflow-x-auto md:overflow-x-visible">
                                            <div className="flex flex-col items-center justify-center min-w-[120px] border-l px-4 py-2">
                                                <div
                                                    className="text-xs text-gray-500 max-w-[90px] truncate cursor-pointer transition-transform duration-200 hover:scale-110 relative"
                                                    title="Total en ventas"
                                                    style={{ display: 'inline-block' }}
                                                >
                                                    <span className="block overflow-hidden text-ellipsis whitespace-nowrap">
                                                        Total en ventas
                                                    </span>
                                                </div>
                                                <div className="font-medium">{colab.sales}</div>
                                            </div>
                                            <div className="flex flex-col items-center justify-center min-w-[120px] border-l px-4 py-2">
                                                <div
                                                    className="text-xs text-gray-500 max-w-[90px] truncate cursor-pointer transition-transform duration-200 hover:scale-110 relative"
                                                    title="Comisiones en servicios"
                                                    style={{ display: 'inline-block' }}
                                                >
                                                    <span className="block overflow-hidden text-ellipsis whitespace-nowrap">
                                                        Comisiones en servicios
                                                    </span>
                                                </div>
                                                <div className="font-medium">{colab.serviceCom}</div>
                                            </div>
                                            <div className="flex flex-col items-center justify-center min-w-[120px] border-l px-4 py-2">
                                                <div
                                                    className="text-xs text-gray-500 max-w-[90px] truncate cursor-pointer transition-transform duration-200 hover:scale-110 relative"
                                                    title="Comisiones en productos"
                                                    style={{ display: 'inline-block' }}
                                                >
                                                    <span className="block overflow-hidden text-ellipsis whitespace-nowrap">
                                                        Comisiones en productos
                                                    </span>
                                                </div>
                                                <div className="font-medium">{colab.productCom}</div>
                                            </div>
                                            <div className="flex flex-col items-center justify-center min-w-[140px] border-l px-4 py-2">
                                                <div
                                                    className="text-xs text-gray-500 max-w-[110px] truncate cursor-pointer transition-transform duration-200 hover:scale-110 relative"
                                                    title="Gastos asociados"
                                                    style={{ display: 'inline-block' }}
                                                >
                                                    <span className="block overflow-hidden text-ellipsis whitespace-nowrap">
                                                        Gastos asociados
                                                    </span>
                                                </div>
                                                <div className="font-medium">{colab.expenses}</div>
                                            </div>
                                            <div className="flex flex-col items-center justify-center min-w-[120px] border-l px-4 py-2">
                                                <div
                                                    className="text-xs text-gray-500 max-w-[90px] truncate cursor-pointer transition-transform duration-200 hover:scale-110 relative"
                                                    title="Total en comisiones"
                                                    style={{ display: 'inline-block' }}
                                                >
                                                    <span className="block overflow-hidden text-ellipsis whitespace-nowrap">
                                                        Total en comisiones
                                                    </span>
                                                </div>
                                                <div className="font-medium">{colab.totalCom}</div>
                                            </div>
                                            <div className="flex flex-col items-center justify-center min-w-[120px] border-l px-4 py-2">
                                                <div
                                                    className="text-xs text-gray-500 max-w-[90px] truncate cursor-pointer transition-transform duration-200 hover:scale-110 relative"
                                                    title="Total en propinas"
                                                    style={{ display: 'inline-block' }}
                                                >
                                                    <span className="block overflow-hidden text-ellipsis whitespace-nowrap">
                                                        Total en propinas
                                                    </span>
                                                </div>
                                                <div className="font-medium">{colab.tips}</div>
                                            </div>
                                            <div className="flex flex-col items-center justify-center min-w-[160px] border-l px-4 py-2">
                                                <div className="flex items-center gap-2 justify-center">
                                                    <span className="text-2xl font-bold">=</span>
                                                    <span className="font-semibold text-green-600">A pagar {colab.toPay}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                                {filteredCollaborators.length === 0 && (
                                    <div className="text-center text-gray-400 py-8">No se encontraron colaboradores.</div>
                                )}
                                {/* Modal de acciones */}
                                <Dialog open={modalOpen} onOpenChange={setModalOpen}>
                                    <DialogContent className="max-w-md w-full">
                                        <DialogHeader>
                                            <DialogTitle>Acciones para {selectedColab?.name}</DialogTitle>
                                        </DialogHeader>
                                        <div className="space-y-3 py-2">
                                            <button
                                                className="w-full text-left px-4 py-2 text-sm rounded hover:bg-blue-50 text-blue-700"
                                                onClick={() => {
                                                    handleViewDetail(selectedColab)
                                                    setModalOpen(false)
                                                }}
                                            >
                                                Ver detalle
                                            </button>

                                            <button
                                                className="w-full text-left px-4 py-2 text-sm rounded hover:bg-blue-50 text-blue-700"
                                                onClick={() => {
                                                    handleDownloadReceipt(selectedColab)
                                                    setModalOpen(false)
                                                }}
                                            >
                                                Descargar comprobante
                                            </button>

                                            <button
                                                className="w-full text-left px-4 py-2 text-sm font-semibold text-white bg-green-500 hover:bg-green-600 rounded"
                                                onClick={() => {
                                                    handlePay(selectedColab)
                                                    setModalOpen(false)
                                                }}
                                            >
                                                Realizar pago
                                            </button>
                                        </div>

                                    </DialogContent>
                                </Dialog>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </ModuleLayout>
        </AuthGuard>

    );
}
