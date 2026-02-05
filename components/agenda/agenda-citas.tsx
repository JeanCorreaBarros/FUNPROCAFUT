"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, Download, Calendar } from "lucide-react"
import { getTenantIdFromToken } from "@/lib/jwt"
import { useState, useEffect } from "react"
import { format, parseISO, isValid } from "date-fns"
import { es } from "date-fns/locale"

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000/api'

type Appointment = {
  appointment_id: string
  client_id: string
  client_name: string
  professional_id: string
  professional_name: string
  service_id: string
  service_name: string
  date: Date
  startTime: string
  endTime: string
  status: string
  notes?: string
}

export function AgendaCitas() {
  const [tenantId, setTenantId] = useState<string | null>(null)
  const [appointments, setAppointments] = useState<Appointment[]>([])
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
    fetchAppointments()
  }, [tenantId])

  const fetchAppointments = async () => {
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
      const mappedAppointments = data.map((app: any) => ({
        appointment_id: app.appointment_id,
        client_id: app.client_id,
        client_name: `${app.first_name} ${app.last_name}`,
        professional_id: app.professional_id,
        professional_name: app.professional_name,
        service_id: app.service_id,
        service_name: app.service_name,
        date: parseISO(app.appointment_date),
        startTime: app.start_time,
        endTime: app.end_time,
        status: app.status_name,
        notes: app.appointment_notes
      }))
      setAppointments(mappedAppointments)
    } catch (error) {
      console.error("Error fetching appointments:", error)
      setAppointments([])
    } finally {
      setIsLoading(false)
    }
  }


  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold text-gray-900">Citas Programadas</CardTitle>
          <div className="flex items-center space-x-2">
            {/* <Button variant="outline" size="sm">
              <Plus size={16} className="mr-1" />
            </Button>
             <Button variant="outline" size="sm" onClick={handleDownload}>
              <Download size={16} />
            </Button>

            <Button variant="outline" size="sm" onClick={handleOpenCalendar}>
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
          ) : appointments.length === 0 ? (
            <div className="flex items-center justify-center py-8 text-bivoo-gray">
              <div className="text-center">
                <Calendar size={48} className="mx-auto mb-2 opacity-50" />
                <p>No hay citas programadas</p>
                <p className="text-sm">Programa tu primera cita</p>
              </div>
            </div>
          ) : (
            <div className="rounded-xl border bg-white shadow-sm overflow-x-auto">
              <table className="w-full border-collapse">
                <thead className="bg-muted/50">
                  <tr className="text-left text-sm text-muted-foreground">
                    <th className="px-4 py-3 font-medium">Profesional</th>
                    <th className="px-4 py-3 font-medium">Cliente</th>
                    <th className="px-4 py-3 font-medium">Servicio</th>
                    <th className="px-4 py-3 font-medium">Fecha</th>
                    <th className="px-4 py-3 font-medium">Hora</th>
                    <th className="px-4 py-3 font-medium text-right">Estado</th>
                  </tr>
                </thead>

                <tbody>
                  {appointments.map((appointment) => (
                    <tr
                      key={appointment.appointment_id}
                      className="border-t hover:bg-muted/30 transition-colors"
                    >
                      <td className="px-4 py-3 text-sm font-medium max-w-[150px] overflow-hidden text-ellipsis whitespace-nowrap">
                        {appointment.professional_name}
                      </td>

                      <td className="px-4 py-3 text-sm text-muted-foreground max-w-[150px] overflow-hidden text-ellipsis whitespace-nowrap">
                        {appointment.client_name}
                      </td>

                      <td className="px-4 py-3 text-sm text-muted-foreground max-w-[150px] overflow-hidden text-ellipsis whitespace-nowrap">
                        {appointment.service_name}
                      </td>

                      <td className="px-4 py-3 text-sm">
                        {isValid(appointment.date)
                          ? format(appointment.date, 'dd/MM/yyyy', { locale: es })
                          : 'Fecha inválida'}
                      </td>

                      <td className="px-4 py-3 text-sm">
                        {appointment.startTime}
                      </td>

                      <td className="px-4 py-3 text-sm text-right">
                        <span
                          className={`
                inline-flex items-center rounded-full px-3 py-1 text-xs font-medium
                ${appointment.status === 'COMPLETED'
                              ? 'bg-green-100 text-green-700'
                              : appointment.status === 'PENDING'
                                ? 'bg-yellow-100 text-yellow-700'
                                : 'bg-red-100 text-red-700'
                            }
              `}
                        >
                          {appointment.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

          )}
        </div>
      </CardContent>
    </Card>
  )
}
