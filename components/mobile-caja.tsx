"use client"

import { Card, CardContent } from "@/components/ui/card"
import { DollarSign, TrendingUp, TrendingDown, Eye } from "lucide-react"

export function MobileCaja() {
  const dailyStats = {
    income: 0,
    expenses: 0,
    transactions: 0,
    balance: 0,
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Caja Diaria</h1>

      {/* Balance Summary */}
      <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm">Balance del día</p>
              <p className="text-3xl font-bold">${dailyStats.balance}</p>
            </div>
            <DollarSign size={32} className="text-green-200" />
          </div>
        </CardContent>
      </Card>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                <TrendingUp size={20} className="text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Ingresos</p>
                <p className="text-xl font-bold text-gray-900">${dailyStats.income}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                <TrendingDown size={20} className="text-red-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Gastos</p>
                <p className="text-xl font-bold text-gray-900">${dailyStats.expenses}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Transactions */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-gray-900">Transacciones de hoy</h2>
            <Eye size={20} className="text-gray-400" />
          </div>

          <div className="text-center py-8">
            <DollarSign size={48} className="mx-auto text-gray-300 mb-4" />
            <p className="text-gray-500">No hay transacciones registradas</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
