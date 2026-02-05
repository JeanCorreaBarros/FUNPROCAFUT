"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, Package } from "lucide-react"

export function InventariosProductos() {
  const productos = [
    { nombre: "Shampoo Premium", categoria: "Cuidado Capilar", stock: 25, precio: "$15.00" },
    { nombre: "Cera para Cabello", categoria: "Styling", stock: 8, precio: "$12.00" },
    { nombre: "Aceite de Barba", categoria: "Cuidado Facial", stock: 15, precio: "$18.00" },
    { nombre: "Toallas", categoria: "Accesorios", stock: 2, precio: "$8.00" },
  ]

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold text-gray-900">Productos en Inventario</CardTitle>
          <Button size="sm" className="bg-bivoo-purple hover:bg-bivoo-purple-dark text-white">
            <Plus size={16} className="mr-1" />
            Agregar Producto
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-4 gap-4 text-sm font-medium text-bivoo-gray border-b border-gray-200 pb-2">
            <span>Producto</span>
            <span>Categoría</span>
            <span>Stock</span>
            <span>Precio</span>
          </div>

          {productos.map((producto, index) => (
            <div
              key={index}
              className="grid grid-cols-4 gap-4 text-sm py-3 border-b border-gray-100 hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center space-x-2">
                <Package size={16} className="text-bivoo-gray" />
                <span className="font-medium text-gray-900">{producto.nombre}</span>
              </div>
              <span className="text-bivoo-gray">{producto.categoria}</span>
              <span
                className={`font-medium ${
                  producto.stock <= 5 ? "text-red-600" : producto.stock <= 10 ? "text-orange-600" : "text-green-600"
                }`}
              >
                {producto.stock}
              </span>
              <span className="font-medium text-gray-900">{producto.precio}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
