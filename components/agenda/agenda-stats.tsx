"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, Download, Calendar } from "lucide-react"
import { useState, useEffect } from "react"
import { getTenantIdFromToken } from "@/lib/jwt"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000/api'

type StatsData = {
  name: string
  count: number
}

export function AgendaStats() {
  const [tenantId, setTenantId] = useState<string | null>(null)
  const [stats, setStats] = useState<StatsData[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    try {
      const tokenForTenant = sessionStorage.getItem("TKV")
      const tId = getTenantIdFromToken(tokenForTenant)
      if (tId) setTenantId(tId)
    } catch (e) {
      console.warn('No se pudo obtener tenantId del token', e)
    }
  }, [])

  useEffect(() => {
    if (!tenantId) return
    fetchStats()
  }, [tenantId])

  const fetchStats = async () => {
    setIsLoading(true)
    try {
      const token = sessionStorage.getItem("TKV")
      const myHeaders = new Headers()
      myHeaders.append("Authorization", `Bearer ${token}`)

      const requestOptions = {
        method: "GET",
        headers: myHeaders,
        redirect: "follow" as RequestRedirect
      }

      const response = await fetch(`${API_BASE}/${tenantId}/modules/agenda/appointments`, requestOptions)
      if (!response.ok) throw new Error("Error al obtener citas")
      const data = await response.json()

      // Contar por status
      const statusCount: Record<string, number> = {}
      data.forEach((app: any) => {
        const status = app.status_name || 'UNKNOWN'
        statusCount[status] = (statusCount[status] || 0) + 1
      })

      const statsData: StatsData[] = Object.entries(statusCount).map(([name, count]) => ({
        name: getStatusLabel(name),
        count
      }))

      setStats(statsData)
    } catch (error) {
      console.error("Error fetching stats:", error)
      setStats([])
    } finally {
      setIsLoading(false)
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'PENDING':
        return 'Pendiente'
      case 'COMPLETED':
        return 'Completada'
      case 'CANCELLED':
        return 'Cancelada'
      default:
        return status
    }
  }
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold text-gray-900">Estadísticas</CardTitle>
          <div className="flex items-center space-x-2">
           {/* <Button variant="outline" size="sm">
              <Plus size={16} className="mr-1" />
            </Button>
            <Button variant="outline" size="sm">
              <Download size={16} />
            </Button>
            <Button variant="outline" size="sm">
              <Calendar size={16} />
            </Button>*/}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {isLoading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            </div>
          ) : (
            <>
              <div className="text-center">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Citas por Estado</h3>
                <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={stats}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="count" fill="#8884d8" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
              <div className="space-y-3">
                {stats.map((stat) => (
                  <div key={stat.name} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm text-bivoo-gray">{stat.name}</span>
                    <span className="font-semibold text-gray-900">{stat.count}</span>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
