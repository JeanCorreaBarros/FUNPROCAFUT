"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, User, Plus, Phone, Mail } from "lucide-react"

export function MobileClientes() {
  const [searchTerm, setSearchTerm] = useState("")

  const clients = [
    {
      id: 1,
      name: "Juan Pérez",
      phone: "+1 234 567 8900",
      email: "juan@email.com",
      lastVisit: "2024-01-15",
    },
    {
      id: 2,
      name: "María García",
      phone: "+1 234 567 8901",
      email: "maria@email.com",
      lastVisit: "2024-01-10",
    },
  ]

  const filteredClients = clients.filter((client) => client.name.toLowerCase().includes(searchTerm.toLowerCase()))

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Clientes</h1>
        <Button size="sm" className="bg-bivoo-purple hover:bg-bivoo-purple-dark">
          <Plus size={16} className="mr-1" />
          Nuevo
        </Button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        <Input
          placeholder="Buscar clientes..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Clients List */}
      <div className="space-y-3">
        {filteredClients.length > 0 ? (
          filteredClients.map((client) => (
            <Card key={client.id}>
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-bivoo-purple text-white rounded-full flex items-center justify-center">
                    <User size={20} />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900">{client.name}</h3>
                    <div className="flex items-center space-x-4 mt-1">
                      <div className="flex items-center space-x-1">
                        <Phone size={14} className="text-gray-400" />
                        <span className="text-sm text-gray-600">{client.phone}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Mail size={14} className="text-gray-400" />
                        <span className="text-sm text-gray-600">{client.email}</span>
                      </div>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      Última visita: {new Date(client.lastVisit).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="text-center py-8">
            <User size={48} className="mx-auto text-gray-300 mb-4" />
            <p className="text-gray-500">No se encontraron clientes</p>
          </div>
        )}
      </div>
    </div>
  )
}
