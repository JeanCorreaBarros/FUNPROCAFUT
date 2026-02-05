"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, Eye } from "lucide-react"
import { useRouter } from "next/navigation"


export function FacturacionRecientes() {
  const router = useRouter()

  const facturas = [
    {
      numero: "FAC-001",
      cliente: "María García",
      fecha: "15 Jun 2025",
      monto: "$450.00",
      estado: "Pagada",
    },
    {
      numero: "FAC-002",
      cliente: "Juan Pérez",
      fecha: "14 Jun 2025",
      monto: "$320.00",
      estado: "Pendiente",
    },
    {
      numero: "FAC-003",
      cliente: "Ana López",
      fecha: "13 Jun 2025",
      monto: "$180.00",
      estado: "Pagada",
    },
  ]

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold text-gray-900">Facturas Recientes</CardTitle>
          <Button
            size="sm"
            className="bg-bivoo-purple hover:bg-bivoo-purple-dark text-white"
            onClick={() => router.push("/facturacion/nueva-factura")}
          >
            <Plus size={16} className="mr-1" />
            Nueva Factura
          </Button>

        </div>
      </CardHeader>
     <CardContent>
  <div className="relative overflow-x-auto">
    <table className="min-w-[700px] w-full text-sm">
      {/* HEADER */}
      <thead>
        <tr className="border-b border-gray-200 text-bivoo-gray font-medium">
          <th className="px-4 py-2 text-left">Número</th>
          <th className="px-4 py-2 text-left">Cliente</th>
          <th className="px-4 py-2 text-left">Fecha</th>
          <th className="px-4 py-2 text-left">Monto</th>
          <th className="px-4 py-2 text-left">Estado</th>
        </tr>
      </thead>

      {/* BODY */}
      <tbody>
        {facturas.map((factura, index) => (
          <tr
            key={index}
            className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
          >
            <td className="px-4 py-3 font-medium text-gray-900">
              {factura.numero}
            </td>

            <td className="px-4 py-3 text-gray-900 whitespace-nowrap">
              {factura.cliente}
            </td>

            <td className="px-4 py-3 text-bivoo-gray whitespace-nowrap">
              {factura.fecha}
            </td>

            <td className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap">
              {factura.monto}
            </td>

            <td className="px-4 py-3">
              <span
                className={`text-xs px-2 py-1 rounded-full whitespace-nowrap ${
                  factura.estado === "Pagada"
                    ? "bg-green-100 text-green-800"
                    : "bg-orange-100 text-orange-800"
                }`}
              >
                {factura.estado}
              </span>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
</CardContent>

    </Card>
  )
}
