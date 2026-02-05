"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DownloadIcon, FileTextIcon, SearchIcon } from "lucide-react"
import { AuthGuard } from "@/components/auth-guard"
import { DashboardLayout } from "@/components/dashboard-layout"
import { useState } from "react"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog"


export default function HistorialPagosPage() {
    const payments = [
        {
            id: "FAC-2023-010",
            date: "15/03/2023",
            concept: "Plan Premium - Marzo",
            method: "Tarjeta de Crédito",
            amount: "$149.000",
            status: "Pagado",
        },
        {
            id: "FAC-2023-011",
            date: "15/02/2023",
            concept: "Plan Premium - Febrero",
            method: "Tarjeta de Crédito",
            amount: "$149.000",
            status: "Pagado",
        },
    ]

const [open, setOpen] = useState(false)
const [selectedPayment, setSelectedPayment] = useState<any>(null)

const handleViewInvoice = (payment: any) => {
  setSelectedPayment(payment)
  setOpen(true)
}

const handleDownloadInvoice = (payment: any) => {
  // 🔥 Aquí luego llamas a tu API real
  console.log("Descargando factura:", payment.id)

  // Simulación
  alert(`Descargando factura ${payment.id}`)
}

    return (
        <AuthGuard>
            <DashboardLayout>
                <main className="flex-1 overflow-y-auto bg-gray-50 p-4 md:p-8">
                    <div className="max-w-7xl mx-auto space-y-8">
                        {/* Header */}
                        <div>
                            <h1 className="text-2xl font-semibold text-gray-900">
                                Historial de Pagos
                            </h1>
                            <p className="text-sm text-gray-500">
                                Consulta y descarga tus facturas y comprobantes
                            </p>
                        </div>

                        {/* Filtros */}
                        <div className="bg-white rounded-xl border p-4 md:p-6">
                            <div className="flex flex-col lg:flex-row gap-4 lg:items-center lg:justify-between">
                                <div className="flex flex-1 gap-2">
                                    <div className="relative flex-1">
                                        <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                        <Input
                                            placeholder="Buscar por referencia o concepto"
                                            className="pl-9"
                                        />
                                    </div>
                                    <Button variant="outline">Filtrar</Button>
                                </div>

                                <div className="flex gap-2">
                                    <Input type="date" className="w-full lg:w-40" />
                                    <span className="hidden lg:flex items-center text-gray-400">—</span>
                                    <Input type="date" className="w-full lg:w-40" />
                                </div>
                            </div>
                        </div>

                        {/* Tabla */}
                        <div className="bg-white rounded-xl border">
                            <div className="relative overflow-x-auto">
                                <table className="min-w-[900px] w-full">
                                    <thead className="sticky top-0 bg-white border-b z-10">
                                        <tr className="text-sm text-gray-500">
                                            <th className="px-6 py-4 font-medium text-left">Fecha</th>
                                            <th className="px-6 py-4 font-medium text-left">Referencia</th>
                                            <th className="px-6 py-4 font-medium text-left">Concepto</th>
                                            <th className="px-6 py-4 font-medium text-left">Método</th>
                                            <th className="px-6 py-4 font-medium text-left">Monto</th>
                                            <th className="px-6 py-4 font-medium text-left">Estado</th>
                                            <th className="px-6 py-4 font-medium text-right">Acciones</th>
                                        </tr>
                                    </thead>

                                  <tbody className="divide-y">
  {payments.map((payment) => (
    <tr key={payment.id} className="hover:bg-gray-50">
      <td className="px-6 py-4 text-sm">{payment.date}</td>

      <td className="px-6 py-4 text-sm font-medium">
        {payment.id}
      </td>

      <td className="px-6 py-4 text-sm">
        {payment.concept}
      </td>

      <td className="px-6 py-4 text-sm">
        {payment.method}
      </td>

      <td className="px-6 py-4 text-sm font-medium">
        {payment.amount}
      </td>

      <td className="px-6 py-4">
        <span className="inline-flex rounded-full bg-green-100 px-2.5 py-1 text-xs font-medium text-green-700">
          {payment.status}
        </span>
      </td>

      <td className="px-6 py-4">
        <div className="flex justify-end gap-2">
          {/* Ver factura */}
          <Button
            size="icon"
            variant="ghost"
            onClick={() => handleViewInvoice(payment)}
          >
            <FileTextIcon className="h-4 w-4" />
          </Button>

          {/* Descargar */}
          <Button
            size="icon"
            variant="ghost"
            onClick={() => handleDownloadInvoice(payment)}
          >
            <DownloadIcon className="h-4 w-4" />
          </Button>
        </div>
      </td>
    </tr>
  ))}
</tbody>

                                </table>
                            </div>

                            {/* Paginación */}
                            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 border-t">
                                <span className="text-sm text-gray-500">
                                    Mostrando 5 de 24 registros
                                </span>

                                <div className="flex gap-2">
                                    <Button size="sm" variant="outline" disabled>
                                        Anterior
                                    </Button>
                                    <Button size="sm" className="bg-black text-white hover:bg-black/90">
                                        1
                                    </Button>
                                    <Button size="sm" variant="outline">
                                        2
                                    </Button>
                                    <Button size="sm" variant="outline">
                                        Siguiente
                                    </Button>
                                </div>
                            </div>
                        </div>

                        {/* Métodos de pago */}
                        <div className="bg-white rounded-xl border p-6">
                            <h2 className="text-lg font-semibold mb-4">
                                Métodos de Pago
                            </h2>

                            <div className="space-y-4">
                                <PaymentCard
                                    brand="VISA"
                                    color="bg-blue-600"
                                    number="4589"
                                    exp="05/2025"
                                    defaultMethod
                                />

                                <PaymentCard
                                    brand="MC"
                                    color="bg-red-500"
                                    number="7823"
                                    exp="09/2024"
                                />

                                <Button variant="outline" className="w-full">
                                    + Agregar Método de Pago
                                </Button>
                            </div>
                        </div>
                    </div>
                </main>
                <Dialog open={open} onOpenChange={setOpen}>
  <DialogContent className="max-w-lg">
    {selectedPayment && (
      <>
        <DialogHeader>
          <DialogTitle>Factura {selectedPayment.id}</DialogTitle>
          <DialogDescription>
            Detalles del comprobante de pago
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-500">Fecha</span>
            <span>{selectedPayment.date}</span>
          </div>

          <div>
            <span className="text-gray-500 block mb-1">Concepto</span>
            <p className="font-medium">{selectedPayment.concept}</p>
          </div>

          <div className="flex justify-between">
            <span className="text-gray-500">Método</span>
            <span>{selectedPayment.method}</span>
          </div>

          <div className="flex justify-between">
            <span className="text-gray-500">Monto</span>
            <span className="font-medium">{selectedPayment.amount}</span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-gray-500">Estado</span>
            <span className="rounded-full bg-green-100 px-2 py-1 text-xs text-green-700">
              {selectedPayment.status}
            </span>
          </div>

          <Button
            className="w-full mt-4"
            onClick={() => handleDownloadInvoice(selectedPayment)}
          >
            Descargar factura
          </Button>
        </div>
      </>
    )}
  </DialogContent>
</Dialog>

            </DashboardLayout>
        </AuthGuard>
    )
}

function PaymentCard({
    brand,
    color,
    number,
    exp,
    defaultMethod = false,
}: any) {
    return (
        <div className="flex items-center justify-between rounded-lg border p-4">
            <div className="flex items-center gap-4">
                <div
                    className={`h-8 w-12 rounded text-white flex items-center justify-center text-sm font-bold ${color}`}
                >
                    {brand}
                </div>
                <div>
                    <p className="font-medium">
                        {brand === "VISA" ? "Visa" : "Mastercard"} terminada en {number}
                    </p>
                    <p className="text-sm text-gray-500">Expira: {exp}</p>
                </div>
            </div>

            <div className="flex items-center gap-3">
                {defaultMethod && (
                    <span className="rounded-full hidden md:block bg-green-100 px-2 py-1 text-xs text-green-700">
                        Predeterminada
                    </span>
                )}
                <Button size="sm" variant="outline">
                    Editar
                </Button>
            </div>
        </div>
    )
}
