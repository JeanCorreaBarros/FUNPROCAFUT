"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, User } from "lucide-react"

export function NominaEmpleados() {
  const empleados = [
    { nombre: "María García", puesto: "Estilista Senior", salario: "$2,500", estado: "Activo" },
    { nombre: "Juan Pérez", puesto: "Barbero", salario: "$2,200", estado: "Activo" },
    { nombre: "Ana López", puesto: "Recepcionista", salario: "$1,800", estado: "Activo" },
    { nombre: "Carlos Ruiz", puesto: "Estilista", salario: "$2,000", estado: "Vacaciones" },
  ]

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold text-gray-900">Empleados</CardTitle>
          <Button size="sm" className="bg-bivoo-purple hover:bg-bivoo-purple-dark text-white">
            <Plus size={16} className="mr-1" />
            Agregar Empleado
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-4 gap-4 text-sm font-medium text-bivoo-gray border-b border-gray-200 pb-2">
            <span>Empleado</span>
            <span>Puesto</span>
            <span>Salario</span>
            <span>Estado</span>
          </div>

          {empleados.map((empleado, index) => (
            <div
              key={index}
              className="grid grid-cols-4 gap-4 text-sm py-3 border-b border-gray-100 hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center space-x-2">
                <User size={16} className="text-bivoo-gray" />
                <span className="font-medium text-gray-900">{empleado.nombre}</span>
              </div>
              <span className="text-bivoo-gray">{empleado.puesto}</span>
              <span className="font-medium text-gray-900">{empleado.salario}</span>
              <span
                className={`text-xs px-2 py-1 rounded-full w-fit ${
                  empleado.estado === "Activo" ? "bg-green-100 text-green-800" : "bg-orange-100 text-orange-800"
                }`}
              >
                {empleado.estado}
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
