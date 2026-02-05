"use client"

import { useState, useEffect } from "react"
import dynamic from "next/dynamic"
import { AuthGuard } from "@/components/auth-guard"
import { ModuleLayout } from "@/components/module-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { format, subDays } from "date-fns"
import { es } from "date-fns/locale"
import { StarIcon, ChatBubbleIcon } from "@radix-ui/react-icons"
import { motion } from "framer-motion"
import { getTenantIdFromToken } from "@/lib/jwt"
const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000/api'

// Tipos para las citas
type Cita = {
    id: string
    clienteId: string
    clienteNombre: string
    estilistaId: string
    estilista: string
    servicio: string
    fecha: Date
    horaInicio: string
    horaFin: string
    estado: "confirmada" | "pendiente" | "cancelada" | "completada"
    valoracion?: number
    notas?: string
    telefono?: string
}

export default function CitasCompletadasPage() {
    const [citas, setCitas] = useState<Cita[]>([])
    const [filtro, setFiltro] = useState<"todas" | "semana" | "mes">("todas")
    const [tenantId, setTenantId] = useState<string | null>(null)

    // Helpers
    const getToken = (): string | null => {
        try {
            return sessionStorage.getItem("TKV");
        } catch (err) {
            console.warn("sessionStorage unavailable", err);
            return null;
        }
    };

    useEffect(() => {
        try {
            const tokenForTenant = getToken()
            const tId = getTenantIdFromToken(tokenForTenant)
            if (tId) setTenantId(tId)
            console.log("tenantId obtenido del token:", tId)
        } catch (e) {
            console.warn('No se pudo obtener tenantId del token', e)
        }
    }, []);


    // Cargar citas completadas desde la API
    useEffect(() => {
        if (!tenantId) return
        const fetchCitasCompletadas = async () => {
            try {
                const token = sessionStorage.getItem("TKV");
                const myHeaders = new Headers();
                if (token) myHeaders.append("Authorization", `Bearer ${token}`);
                const res = await fetch(`${API_BASE}/${tenantId}/modules/agenda/appointments`, {
                    method: "GET",
                    headers: myHeaders
                });
                const data = await res.json();
                // Filtrar solo las citas completadas
                const completadas = (Array.isArray(data) ? data : []).filter((c: any) => c.status_id === "COMPLETED" || c.status_name === "COMPLETED");
                // Mapear a la estructura local Cita
                const citasMap: Cita[] = completadas.map((c: any) => {
                    // Calcular hora de fin sumando duración a la hora de inicio
                    let horaFin = "";
                    if (c.start_time && c.duration) {
                        const [h, m] = c.start_time.split(":").map(Number);
                        const startDate = new Date(c.appointment_date + 'T' + c.start_time);
                        const endDate = new Date(startDate.getTime() + c.duration * 60000);
                        // Formato HH:mm
                        const hh = endDate.getHours().toString().padStart(2, '0');
                        const mm = endDate.getMinutes().toString().padStart(2, '0');
                        horaFin = `${hh}:${mm}`;
                    }
                    return {
                        id: c.appointment_id,
                        clienteId: c.client_id,
                        clienteNombre: `${c.first_name} ${c.last_name}`,
                        estilistaId: c.professional_id,
                        estilista: c.professional_name,
                        servicio: c.service_name,
                        fecha: new Date(c.appointment_date),
                        horaInicio: c.start_time,
                        horaFin: horaFin,
                        estado: "completada" as const,
                        valoracion: c.rating || 0,
                        notas: c.appointment_notes,
                        telefono: c.phone || ""
                    };
                });
                setCitas(citasMap);
            } catch (e) {
                setCitas([]);
            }
        };
        fetchCitasCompletadas();
    }, [tenantId]);

    // Filtrar citas según el criterio seleccionado
    const citasFiltradas = citas.filter((cita) => {
        const hoy = new Date()
        const fechaCita = new Date(cita.fecha)

        if (filtro === "semana") {
            // Citas de la última semana
            const unaSemanaAtras = subDays(hoy, 7)
            return fechaCita >= unaSemanaAtras
        } else if (filtro === "mes") {
            // Citas del último mes
            const unMesAtras = subDays(hoy, 30)
            return fechaCita >= unMesAtras
        }

        // Todas las citas
        return true
    })

    // Función para renderizar estrellas de valoración
    const renderEstrellas = (valoracion = 0) => {
        return (
            <div className="flex">
                {[1, 2, 3, 4, 5].map((estrella) => (
                    <StarIcon
                        key={estrella}
                        className={`h-4 w-4 ${estrella <= valoracion ? "text-yellow-500 fill-yellow-500" : "text-gray-300"}`}
                    />
                ))}
            </div>
        )
    }

    return (

        <AuthGuard>
            <ModuleLayout moduleType="agenda">
                <main className="flex-1 overflow-y-auto ">
                    <div className="flex flex-col flex-1 overflow-hidden">
                        <div className="flex-1 overflow-y-auto ">
                            <motion.div
                                initial={{ opacity: 0, y: 32 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, ease: "easeOut" }}
                                className="min-h-screen p-4 md:p-9"
                            >
                                {/* Filtros de Dia Semana Mes*/}
                                <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6 gap-4">
                                    <h1 className="text-2xl font-bold">Citas Completadas</h1>
                                    <div className="flex flex-col md:flex-row gap-2 w-full md:w-auto">
                                        <Button variant={filtro === "todas" ? "default" : "outline"} onClick={() => setFiltro("todas")}>
                                            Todas
                                        </Button>
                                        <Button variant={filtro === "semana" ? "default" : "outline"} onClick={() => setFiltro("semana")}>
                                            Última Semana
                                        </Button>
                                        <Button variant={filtro === "mes" ? "default" : "outline"} onClick={() => setFiltro("mes")}>
                                            Último Mes
                                        </Button>
                                    </div>
                                </div>

                                <Card className="w-full md:max-w-5l mx-auto rounded-2xl px-2 md:px-8 py-4 md:py-8 shadow-lg">
                                    <CardHeader>
                                        <CardTitle>Historial de Citas Completadas</CardTitle>
                                    </CardHeader>
                                    <CardContent className="overflow-x-auto">
                                        <Table className="min-w-[400px]">
                                            <TableHeader>
                                                <TableRow>
                                                    <TableHead className="truncate max-w-[120px]">Cliente</TableHead>
                                                    <TableHead className="truncate max-w-[120px]">Servicio</TableHead>
                                                    <TableHead className="truncate max-w-[120px]">Colaboradoes</TableHead>
                                                    <TableHead className="truncate max-w-[80px]">Fecha</TableHead>
                                                    <TableHead className="truncate max-w-[80px]">Hora</TableHead>
                                                    <TableHead className="truncate max-w-[80px]">Valoración</TableHead>
                                                    <TableHead className="truncate max-w-[80px]">Acciones</TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {citasFiltradas.map((cita) => (
                                                    <TableRow key={cita.id}>
                                                        <TableCell className="font-medium">{cita.clienteNombre}</TableCell>
                                                        <TableCell>{cita.servicio}</TableCell>
                                                        <TableCell>{cita.estilista}</TableCell>
                                                        <TableCell>{format(cita.fecha, "dd/MM/yyyy", { locale: es })}</TableCell>
                                                        <TableCell>
                                                            {cita.horaInicio} - {cita.horaFin}
                                                        </TableCell>
                                                        <TableCell>{renderEstrellas(cita.valoracion)}</TableCell>
                                                        <TableCell>
                                                            <div className="flex flex-col xs:flex-row gap-2">
                                                                <Button variant="outline" size="icon" className="h-8 w-8 rounded-full">
                                                                    <ChatBubbleIcon className="h-4 w-4" />
                                                                </Button>
                                                            </div>
                                                        </TableCell>
                                                    </TableRow>
                                                ))}
                                                {citasFiltradas.length === 0 && (
                                                    <TableRow>
                                                        <TableCell colSpan={7} className="text-center py-4 text-gray-500">
                                                            No hay citas completadas en el período seleccionado
                                                        </TableCell>
                                                    </TableRow>
                                                )}
                                            </TableBody>
                                        </Table>
                                    </CardContent>
                                </Card>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 gap-y-4 mt-6">
                                    <Card>
                                        <CardHeader>
                                            <CardTitle>Valoraciones de Clientes</CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="space-y-4">
                                                {[5, 4, 3, 2, 1].map((rating) => {
                                                    const count = citasFiltradas.filter((cita) => cita.valoracion === rating).length
                                                    const percentage = citasFiltradas.length > 0 ? Math.round((count / citasFiltradas.length) * 100) : 0

                                                    return (
                                                        <div key={rating} className="flex items-center gap-2">
                                                            <div className="flex w-24">
                                                                {[1, 2, 3, 4, 5].map((star) => (
                                                                    <StarIcon
                                                                        key={star}
                                                                        className={`h-4 w-4 ${star <= rating ? "text-yellow-500 fill-yellow-500" : "text-gray-300"}`}
                                                                    />
                                                                ))}
                                                            </div>
                                                            <div className="flex-1">
                                                                <div className="w-full bg-gray-200 rounded-full h-2.5">
                                                                    <div className="bg-yellow-500 h-2.5 rounded-full" style={{ width: `${percentage}%` }}></div>
                                                                </div>
                                                            </div>
                                                            <div className="w-12 text-right text-sm text-gray-500">{count}</div>
                                                        </div>
                                                    )
                                                })}
                                            </div>
                                            <div className="mt-4 text-center">
                                                <div className="text-3xl font-bold">
                                                    {citasFiltradas.length > 0
                                                        ? (
                                                            citasFiltradas.reduce((sum, cita) => sum + (cita.valoracion || 0), 0) / citasFiltradas.length
                                                        ).toFixed(1)
                                                        : "0.0"}
                                                </div>
                                                <div className="text-sm text-gray-500">Valoración promedio</div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                    <Card>
                                        <CardHeader>
                                            <CardTitle>Servicios Más Populares</CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="space-y-4">
                                                {(() => {
                                                    // Contar servicios
                                                    const serviciosCount: Record<string, number> = {}
                                                    citasFiltradas.forEach((cita) => {
                                                        serviciosCount[cita.servicio] = (serviciosCount[cita.servicio] || 0) + 1
                                                    })

                                                    // Ordenar por popularidad
                                                    const serviciosOrdenados = Object.entries(serviciosCount)
                                                        .sort(([, countA], [, countB]) => countB - countA)
                                                        .slice(0, 5)

                                                    return serviciosOrdenados.map(([servicio, count], index) => {
                                                        const percentage =
                                                            citasFiltradas.length > 0 ? Math.round((count / citasFiltradas.length) * 100) : 0

                                                        return (
                                                            <div key={index} className="flex items-center gap-2">
                                                                <div className="w-32 truncate">{servicio}</div>
                                                                <div className="flex-1">
                                                                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                                                                        <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${percentage}%` }}></div>
                                                                    </div>
                                                                </div>
                                                                <div className="w-12 text-right text-sm text-gray-500">{count}</div>
                                                            </div>
                                                        )
                                                    })
                                                })()}
                                            </div>
                                        </CardContent>
                                    </Card>
                                </div>

                            </motion.div>
                        </div>
                    </div>
                </main>

            </ModuleLayout>
        </AuthGuard>

    )
}

