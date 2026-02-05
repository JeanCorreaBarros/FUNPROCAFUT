"use client"

import { useState, useEffect } from "react"
import dynamic from "next/dynamic"
import { AuthGuard } from "@/components/auth-guard"
import { ModuleLayout } from "@/components/module-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { format, subDays } from "date-fns"
import { es } from "date-fns/locale"
import { CheckIcon, Cross2Icon, ChatBubbleIcon, EnvelopeClosedIcon, ClockIcon } from "@radix-ui/react-icons"
import { MessageCircle } from "lucide-react" // Ícono de WhatsApp estilo lucide

import { motion } from "framer-motion"
import { getTenantIdFromToken } from "@/lib/jwt"
const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000/api'



import { StarIcon, } from "@radix-ui/react-icons"

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
    notas?: string
    telefono?: string
}

export default function CitasPendientesPage() {
    const [citas, setCitas] = useState<Cita[]>([])
    const [selectedCita, setSelectedCita] = useState<Cita | null>(null)
    const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false)
    const [isCancelDialogOpen, setIsCancelDialogOpen] = useState(false)
    const [isCallDialogOpen, setIsCallDialogOpen] = useState(false)
    const [isMessageDialogOpen, setIsMessageDialogOpen] = useState(false)
    const [isFetchingClient, setIsFetchingClient] = useState(false)
    const [tenantId, setTenantId] = useState<string | null>(null)


    const [filtro, setFiltro] = useState<"todas" | "semana" | "mes">("todas")
    // Filtrar solo citas pendientes para la tabla
    const citasPendientes = citas.filter((cita) => cita.estado === "pendiente");
    // Si quieres aplicar filtro de semana/mes a las pendientes:
    const citasFiltradas = citasPendientes.filter((cita) => {
        const hoy = new Date();
        const fechaCita = new Date(cita.fecha);
        if (filtro === "semana") {
            const unaSemanaAtras = subDays(hoy, 7);
            return fechaCita >= unaSemanaAtras;
        } else if (filtro === "mes") {
            const unMesAtras = subDays(hoy, 30);
            return fechaCita >= unMesAtras;
        }
        return true;
    });

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




    // Cargar citas desde la API y separar por estado
    const fetchCitas = async () => {
        try {
            const token = sessionStorage.getItem("TKV");
            const myHeaders = new Headers();
            if (token) myHeaders.append("Authorization", `Bearer ${token}`);
            const res = await fetch(`${API_BASE}/${tenantId}/modules/agenda/appointments`, {
                method: "GET",
                headers: myHeaders
            });
            const data = await res.json();
            // Mapear a la estructura local Cita y clasificar por estado
            const citasMap: Cita[] = (Array.isArray(data) ? data : []).map((c: any) => {
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
                // Normalizar estado
                let estado: Cita["estado"] = "pendiente";
                if (c.status_id === "COMPLETED" || c.status_name === "COMPLETED") {
                    estado = "completada";
                } else if (c.status_id === "CANCELLED" || c.status_name === "CANCELLED") {
                    estado = "cancelada";
                } else if (c.status_id === "CONFIRMED" || c.status_name === "CONFIRMED") {
                    estado = "confirmada";
                } else if (c.status_id === "PENDING" || c.status_name === "PENDING") {
                    estado = "pendiente";
                }
                // Prefer created_at / createdAt from API; fallback to appointment_date
                const createdAtRaw = c.created_at ?? c.createdAt ?? c.appointment_date
                const createdAt = createdAtRaw ? new Date(createdAtRaw) : new Date()

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
                    estado,
                    notas: c.appointment_notes,
                    telefono: c.phone || "",
                    // attach createdAt so we can sort client-side
                    createdAt
                };
            });
            // Sort by createdAt descending (newest first)
            citasMap.sort((a: any, b: any) => {
                const ta = a.createdAt ? new Date(a.createdAt).getTime() : 0
                const tb = b.createdAt ? new Date(b.createdAt).getTime() : 0
                return tb - ta
            })
            setCitas(citasMap);
        } catch (e) {
            setCitas([]);
        }
    };

    useEffect(() => {
        if (!tenantId) return
        fetchCitas();
    }, [tenantId]);

    // Fetch a client by id from the clients endpoint. Assumption: the API
    // supports GET /api/modules/agenda/clients/:id and returns the client JSON
    // shown in the user's example. If the API differs, this helper may need
    // adjustment.
    const fetchClientById = async (clientId: string) => {
        if (!clientId) return null
        try {
            setIsFetchingClient(true)
            const token = sessionStorage.getItem("TKV")
            const myHeaders = new Headers()
            if (token) myHeaders.append("Authorization", `Bearer ${token}`)
            const res = await fetch(`${API_BASE}/${tenantId}/modules/agenda/clients/${clientId}`, {
                method: "GET",
                headers: myHeaders,
            })
            if (!res.ok) {
                // Try fallback: maybe the API expects a query param
                const fallback = await fetch(`${API_BASE}/${tenantId}/modules/agenda/clients?id=${encodeURIComponent(clientId)}`, {
                    method: "GET",
                    headers: myHeaders,
                })
                if (!fallback.ok) return null
                return await fallback.json()
            }
            return await res.json()
        } catch (e) {
            console.error("Error fetching client:", e)
            return null
        } finally {
            setIsFetchingClient(false)
        }
    }

    console.log("Citas Pendientes:", citas);

    // Función para confirmar una cita (actualiza en la API a COMPLETED)
    const confirmarCita = async () => {
        if (!selectedCita) return;
        try {
            const token = sessionStorage.getItem("TKV");
            const myHeaders = new Headers();
            myHeaders.append("Content-Type", "application/json");
            if (token) myHeaders.append("Authorization", `Bearer ${token}`);
            const res = await fetch(`${API_BASE}/${tenantId}/modules/agenda/appointments/${selectedCita.id}`, {
                method: "PUT",
                headers: myHeaders,
                body: JSON.stringify({ status: "COMPLETED", status_id: "COMPLETED", status_name: "COMPLETED" })
            });
            if (!res.ok) throw new Error("Error al actualizar la cita");
            setIsConfirmDialogOpen(false);
            setSelectedCita(null);
            alert("Cita en estado COMPLETADA");
            await fetchCitas();
        } catch (e) {
            alert("No se pudo actualizar la cita");
        }
    }

    // Función para cancelar una cita (actualiza en la API a CANCELLED)
    const cancelarCita = async () => {
        if (!selectedCita) return;
        try {
            const token = sessionStorage.getItem("TKV");
            const myHeaders = new Headers();
            myHeaders.append("Content-Type", "application/json");
            if (token) myHeaders.append("Authorization", `Bearer ${token}`);
            const res = await fetch(`${API_BASE}/${tenantId}/modules/agenda/appointments/${selectedCita.id}`, {
                method: "PUT",
                headers: myHeaders,
                body: JSON.stringify({ status: "CANCELLED", status_id: "CANCELLED", status_name: "CANCELLED" })
            });
            if (!res.ok) throw new Error("Error al cancelar la cita");
            setIsCancelDialogOpen(false);
            setSelectedCita(null);
            alert("Cita en estado CANCELADA");
            await fetchCitas();
        } catch (e) {
            alert("No se pudo cancelar la cita");
        }
    }


    // Calcular estadísticas de confirmación y cancelación solo con citas completadas y canceladas
    const totalCitasEstadisticas = citas.filter(c => c.estado === "completada" || c.estado === "cancelada").length;
    const totalCompletadas = citas.filter(c => c.estado === "completada").length;
    const totalCanceladas = citas.filter(c => c.estado === "cancelada").length;
    const tasaConfirmacion = totalCitasEstadisticas > 0 ? Math.round((totalCompletadas / totalCitasEstadisticas) * 100) : 0;
    const tasaCancelacion = totalCitasEstadisticas > 0 ? Math.round((totalCanceladas / totalCitasEstadisticas) * 100) : 0;

    return (

        <AuthGuard>
            <ModuleLayout moduleType="agenda">
                <main className="flex-1 md:p-4 md:p-9 ">
                    <div className="flex  flex-col md:flex-row">

                        <div className="flex-1  ">
                            <motion.div
                                initial={{ opacity: 0, y: 32 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, ease: "easeOut" }}
                                className="min-h-screen md:p-4 md:p-9"
                            >
                                {/* Filtros de Dia Semana Mes*/}
                                <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6 gap-4">
                                    <h1 className="text-2xl font-bold">Citas Pendientes</h1>
                                    <div className="flex flex-col md:flex-row gap-2 w-full md:w-auto">
                                        <Button variant={filtro === "todas" ? "default" : "outline"} onClick={() => setFiltro("todas")}>...
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

                                <Card className="w-full rounded-2xl md:px-2 md:px-8 py-4 md:py-8 shadow-lg">
                                    <CardHeader>
                                        <CardTitle>Citas por Confirmar</CardTitle>
                                    </CardHeader>

                                    <CardContent className="overflow-x-auto">

                                        {/* Vista en escritorio */}
                                        <div className="hidden md:block max-h-[400px] overflow-y-auto border rounded-lg shadow-sm">
                                            <Table className="min-w-[600px]">
                                                <TableHeader className="sticky top-0 bg-gray-50 z-10">
                                                    <TableRow>
                                                        <TableHead className="truncate max-w-[120px]">Cliente</TableHead>
                                                        <TableHead className="truncate max-w-[120px]">Servicio</TableHead>
                                                        <TableHead className="truncate max-w-[120px]">Colaboradores</TableHead>
                                                        <TableHead className="truncate max-w-[80px]">Fecha</TableHead>
                                                        <TableHead className="truncate max-w-[80px]">Hora</TableHead>
                                                        <TableHead className="truncate max-w-[80px]">Acciones</TableHead>
                                                    </TableRow>
                                                </TableHeader>

                                                <TableBody>
                                                    {citasFiltradas.map((cita) => (
                                                        <TableRow key={cita.id}>
                                                            <TableCell className="font-medium">{cita.clienteNombre}</TableCell>
                                                            <TableCell>{cita.servicio}</TableCell>
                                                            <TableCell>{cita.estilista}</TableCell>
                                                            <TableCell>
                                                                {format(cita.fecha, "dd/MM/yyyy", { locale: es })}
                                                            </TableCell>
                                                            <TableCell>
                                                                {cita.horaInicio} - {cita.horaFin}
                                                            </TableCell>
                                                            <TableCell>
                                                                <div className="flex flex-col md:flex-row gap-2">
                                                                    {/* Confirmar */}
                                                                    <Button
                                                                        variant="outline"
                                                                        size="icon"
                                                                        className="h-8 cursor-pointer hover:scale-110 w-8 rounded-full bg-green-50 text-green-600 hover:bg-green-100 hover:text-green-700"
                                                                        onClick={() => {
                                                                            setSelectedCita(cita);
                                                                            setIsConfirmDialogOpen(true);
                                                                        }}
                                                                    >
                                                                        <CheckIcon className="h-4 w-4" />
                                                                    </Button>

                                                                    {/* Cancelar */}
                                                                    <Button
                                                                        variant="outline"
                                                                        size="icon"
                                                                        className="h-8 w-8 cursor-pointer hover:scale-110 rounded-full bg-red-50 text-red-600 hover:bg-red-100 hover:text-red-700"
                                                                        onClick={() => {
                                                                            setSelectedCita(cita);
                                                                            setIsCancelDialogOpen(true);
                                                                        }}
                                                                    >
                                                                        <Cross2Icon className="h-4 w-4" />
                                                                    </Button>

                                                                    {/* WhatsApp: fetch client by id and prefill phone then open dialog */}
                                                                    <Button
                                                                        variant="outline"
                                                                        size="icon"
                                                                        className="h-8 w-8 cursor-pointer hover:scale-110 rounded-full transition-transform duration-200"
                                                                        onClick={async () => {
                                                                            // Try to fetch the client to get the latest phone number
                                                                            const client = await fetchClientById(String(cita.clienteId))
                                                                            if (client && client.phone) {
                                                                                setSelectedCita({ ...cita, telefono: client.phone })
                                                                            } else {
                                                                                // fallback to whatever is in the appointment
                                                                                setSelectedCita(cita)
                                                                            }
                                                                            setIsMessageDialogOpen(true)
                                                                        }}
                                                                        disabled={isFetchingClient}
                                                                    >
                                                                        <svg
                                                                            xmlns="http://www.w3.org/2000/svg"
                                                                            viewBox="0 0 24 24"
                                                                            fill="currentColor"
                                                                            className="h-5 w-5 text-green-500 hover:text-green-600 transition-colors duration-200"
                                                                            aria-hidden="true"
                                                                            role="img"
                                                                        >
                                                                            <path d="M20.52 3.48A11.76 11.76 0 0012 0C5.37 0 0 5.37 0 12a11.9 11.9 0 001.64 6.05L0 24l6.2-1.63A11.88 11.88 0 0012 24c6.63 0 12-5.37 12-12a11.74 11.74 0 00-3.48-8.52zM12 22a9.89 9.89 0 01-5.34-1.55l-.38-.23-3.68.97.98-3.59-.25-.38A9.94 9.94 0 012.1 12C2.1 6.55 6.55 2.1 12 2.1S21.9 6.55 21.9 12 17.45 21.9 12 21.9z" />
                                                                            <path d="M17.53 14.42c-.28-.14-1.73-.86-2-.96-.26-.1-.45-.16-.65.15-.19.3-.73.98-.9 1.16-.17.18-.34.2-.63.06-.29-.15-1.23-.48-2.34-1.53-.86-.76-1.43-1.68-1.6-1.97-.17-.3-.02-.46.12-.6.14-.14.3-.34.45-.52.15-.17.19-.31.29-.52.1-.2.04-.38-.02-.53-.07-.15-.68-1.66-.93-2.27-.25-.6-.5-.53-.68-.54h-.58c-.2 0-.52.08-.79.38-.27.3-1.03 1.03-1.03 2.5 0 1.47 1.08 2.88 1.23 3.09.15.2 2.1 3.22 5.11 4.52.72.3 1.27.48 1.71.61.72.23 1.38.2 1.9.12.58-.08 1.75-.71 1.99-1.42.25-.7.25-1.3.17-1.43-.07-.12-.25-.2-.55-.35z" />
                                                                        </svg>
                                                                    </Button>
                                                                </div>
                                                            </TableCell>
                                                        </TableRow>
                                                    ))}

                                                    {citasFiltradas.length === 0 && (
                                                        <TableRow>
                                                            <TableCell colSpan={6} className="text-center py-4 text-gray-500">
                                                                No hay citas pendientes
                                                            </TableCell>
                                                        </TableRow>
                                                    )}
                                                </TableBody>
                                            </Table>
                                        </div>

                                        {/* Vista móvil */}
                                        <div className="block md:hidden space-y-3">
                                            {citasFiltradas.length > 0 ? (
                                                citasFiltradas.map((cita) => (
                                                    <div
                                                        key={cita.id}
                                                        className="border rounded-xl p-3 shadow-sm bg-white flex flex-col gap-2"
                                                    >
                                                        <div className="flex justify-between items-center">
                                                            <p className="font-semibold text-gray-800">{cita.clienteNombre}</p>
                                                            <p className="text-xs text-gray-500">
                                                                {format(cita.fecha, "dd/MM/yyyy", { locale: es })}
                                                            </p>
                                                        </div>

                                                        <p className="text-sm text-gray-700">
                                                            <strong>Servicio:</strong> {cita.servicio}
                                                        </p>
                                                        <p className="text-sm text-gray-700">
                                                            <strong>Colaborador:</strong> {cita.estilista}
                                                        </p>
                                                        <p className="text-sm text-gray-700">
                                                            <strong>Hora:</strong> {cita.horaInicio} - {cita.horaFin}
                                                        </p>

                                                        <div className="flex justify-end gap-3 mt-2">
                                                            {/* Confirmar */}
                                                            <Button
                                                                variant="outline"
                                                                size="icon"
                                                                className="h-8 w-8 rounded-full bg-green-50 text-green-600 hover:bg-green-100 hover:text-green-700"
                                                                onClick={() => {
                                                                    setSelectedCita(cita);
                                                                    setIsConfirmDialogOpen(true);
                                                                }}
                                                            >
                                                                <CheckIcon className="h-4 w-4" />
                                                            </Button>

                                                            {/* Cancelar */}
                                                            <Button
                                                                variant="outline"
                                                                size="icon"
                                                                className="h-8 w-8 rounded-full bg-red-50 text-red-600 hover:bg-red-100 hover:text-red-700"
                                                                onClick={() => {
                                                                    setSelectedCita(cita);
                                                                    setIsCancelDialogOpen(true);
                                                                }}
                                                            >
                                                                <Cross2Icon className="h-4 w-4" />
                                                            </Button>

                                                            {/* WhatsApp (mobile): fetch client by id and prefill phone then open dialog */}
                                                            <Button
                                                                variant="outline"
                                                                size="icon"
                                                                className="h-8 w-8 rounded-full"
                                                                onClick={async () => {
                                                                    const client = await fetchClientById(String(cita.clienteId))
                                                                    if (client && client.phone) {
                                                                        setSelectedCita({ ...cita, telefono: client.phone })
                                                                    } else {
                                                                        setSelectedCita(cita)
                                                                    }
                                                                    setIsMessageDialogOpen(true)
                                                                }}
                                                                disabled={isFetchingClient}
                                                            >
                                                                <svg
                                                                    xmlns="http://www.w3.org/2000/svg"
                                                                    viewBox="0 0 24 24"
                                                                    fill="currentColor"
                                                                    className="h-5 w-5 text-green-500"
                                                                >
                                                                    <path d="M20.52 3.48A11.76 11.76 0 0012 0C5.37 0 0 5.37 0 12a11.9 11.9 0 001.64 6.05L0 24l6.2-1.63A11.88 11.88 0 0012 24c6.63 0 12-5.37 12-12a11.74 11.74 0 00-3.48-8.52zM12 22a9.89 9.89 0 01-5.34-1.55l-.38-.23-3.68.97.98-3.59-.25-.38A9.94 9.94 0 012.1 12C2.1 6.55 6.55 2.1 12 2.1S21.9 6.55 21.9 12 17.45 21.9 12 21.9z" />
                                                                    <path d="M17.53 14.42c-.28-.14-1.73-.86-2-.96-.26-.1-.45-.16-.65.15-.19.3-.73.98-.9 1.16-.17.18-.34.2-.63.06-.29-.15-1.23-.48-2.34-1.53-.86-.76-1.43-1.68-1.6-1.97-.17-.3-.02-.46.12-.6.14-.14.3-.34.45-.52.15-.17.19-.31.29-.52.1-.2.04-.38-.02-.53-.07-.15-.68-1.66-.93-2.27-.25-.6-.5-.53-.68-.54h-.58c-.2 0-.52.08-.79.38-.27.3-1.03 1.03-1.03 2.5 0 1.47 1.08 2.88 1.23 3.09.15.2 2.1 3.22 5.11 4.52.72.3 1.27.48 1.71.61.72.23 1.38.2 1.9.12.58-.08 1.75-.71 1.99-1.42.25-.7.25-1.3.17-1.43-.07-.12-.25-.2-.55-.35z" />
                                                                </svg>
                                                            </Button>
                                                        </div>
                                                    </div>
                                                ))
                                            ) : (
                                                <p className="text-center text-gray-500 py-4">
                                                    No hay citas pendientes
                                                </p>
                                            )}
                                        </div>
                                    </CardContent>
                                </Card>


                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 gap-y-4 mt-6">
                                    <Card>
                                        <CardHeader>
                                            <CardTitle>Próximas Confirmaciones</CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="space-y-4">
                                                {citasPendientes.slice(0, 3).length === 0 ? (
                                                    <div className="text-center text-gray-500 py-4">Sin citas próximas de confirmación</div>
                                                ) : (
                                                    citasPendientes.slice(0, 3).map((cita) => (
                                                        <div key={cita.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                                            <div className="flex items-center gap-3">
                                                                <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center text-orange-600">
                                                                    <ClockIcon className="h-5 w-5" />
                                                                </div>
                                                                <div>
                                                                    <div className="font-medium">{cita.clienteNombre}</div>
                                                                    <div className="text-sm text-gray-500">
                                                                        {format(cita.fecha, "dd/MM/yyyy", { locale: es })} • {cita.horaInicio}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div className="flex gap-2">
                                                                <Button
                                                                    variant="outline"
                                                                    size="sm"
                                                                    className="bg-green-50 text-green-600 hover:bg-green-100 hover:text-green-700 border-green-200"
                                                                    onClick={() => {
                                                                        setSelectedCita(cita)
                                                                        setIsConfirmDialogOpen(true)
                                                                    }}
                                                                >
                                                                    Confirmar
                                                                </Button>
                                                            </div>
                                                        </div>
                                                    ))
                                                )}
                                            </div>
                                        </CardContent>
                                    </Card>
                                    <Card>
                                        <CardHeader>
                                            <CardTitle>Estadísticas de Confirmación</CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="p-4 bg-green-50 rounded-lg text-center">
                                                    <div className="text-2xl font-bold text-green-600">{tasaConfirmacion}%</div>
                                                    <div className="text-sm text-gray-600">Tasa de Confirmación</div>
                                                </div>
                                                <div className="p-4 bg-red-50 rounded-lg text-center">
                                                    <div className="text-2xl font-bold text-red-600">{tasaCancelacion}%</div>
                                                    <div className="text-sm text-gray-600">Tasa de Cancelación</div>
                                                </div>
                                            </div>
                                            <div className="mt-4">
                                                <h3 className="text-sm font-medium mb-2">Tiempo promedio de confirmación</h3>
                                                <div className="w-full bg-gray-200 rounded-full h-2.5">
                                                    <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: "70%" }}></div>
                                                </div>
                                                <div className="flex justify-between mt-1 text-xs text-gray-500">
                                                    <span>0 horas</span>
                                                    <span>24 horas</span>
                                                    <span>48 horas</span>
                                                </div>
                                                <p className="text-sm text-center mt-2 text-gray-600">
                                                    La mayoría de los clientes confirman en las primeras 12 horas
                                                </p>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </div>

                            </motion.div>
                        </div>

                        <Dialog open={isConfirmDialogOpen} onOpenChange={setIsConfirmDialogOpen}>
                            <DialogContent className="sm:max-w-[425px]">
                                <DialogHeader>
                                    <DialogTitle>Confirmar Cita</DialogTitle>
                                </DialogHeader>
                                <div className="py-4">
                                    <p>¿Está seguro que desea confirmar esta cita?</p>
                                    {selectedCita && (
                                        <div className="mt-2 p-4 bg-gray-50 rounded-lg">
                                            <p>
                                                <strong>Cliente:</strong> {selectedCita.clienteNombre}
                                            </p>
                                            <p>
                                                <strong>Servicio:</strong> {selectedCita.servicio}
                                            </p>
                                            <p>
                                                <strong>Fecha:</strong> {format(selectedCita.fecha, "PPP", { locale: es })}
                                            </p>
                                            <p>
                                                <strong>Hora:</strong> {selectedCita.horaInicio} - {selectedCita.horaFin}
                                            </p>
                                        </div>
                                    )}
                                </div>
                                <DialogFooter>
                                    <Button variant="outline" onClick={() => setIsConfirmDialogOpen(false)}>
                                        Cancelar
                                    </Button>
                                    <Button onClick={confirmarCita} className="bg-green-600 hover:bg-green-700">
                                        Confirmar
                                    </Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>


                        <Dialog open={isCancelDialogOpen} onOpenChange={setIsCancelDialogOpen}>
                            <DialogContent className="sm:max-w-[425px]">
                                <DialogHeader>
                                    <DialogTitle>Cancelar Cita</DialogTitle>
                                </DialogHeader>
                                <div className="py-4">
                                    <p>¿Está seguro que desea cancelar esta cita?</p>
                                    {selectedCita && (
                                        <div className="mt-2 p-4 bg-gray-50 rounded-lg">
                                            <p>
                                                <strong>Cliente:</strong> {selectedCita.clienteNombre}
                                            </p>
                                            <p>
                                                <strong>Servicio:</strong> {selectedCita.servicio}
                                            </p>
                                            <p>
                                                <strong>Fecha:</strong> {format(selectedCita.fecha, "PPP", { locale: es })}
                                            </p>
                                            <p>
                                                <strong>Hora:</strong> {selectedCita.horaInicio} - {selectedCita.horaFin}
                                            </p>
                                        </div>
                                    )}
                                </div>
                                <DialogFooter>
                                    <Button variant="outline" onClick={() => setIsCancelDialogOpen(false)}>
                                        Volver
                                    </Button>
                                    <Button variant="destructive" onClick={cancelarCita}>
                                        Cancelar Cita
                                    </Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>


                        <Dialog open={isCallDialogOpen} onOpenChange={setIsCallDialogOpen}>
                            <DialogContent className="sm:max-w-[425px]">
                                <DialogHeader>
                                    <DialogTitle>Llamar al Cliente</DialogTitle>
                                </DialogHeader>
                                <div className="py-4">
                                    {selectedCita && (
                                        <div className="text-center">
                                            <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-4">
                                                <EnvelopeClosedIcon className="h-8 w-8 text-blue-600" />
                                            </div>
                                            <p className="text-lg font-medium">{selectedCita.clienteNombre}</p>
                                            <p className="text-xl font-bold mt-2">{selectedCita.telefono}</p>
                                            <p className="text-sm text-gray-500 mt-4">Haga clic en el botón para iniciar la llamada</p>
                                        </div>
                                    )}
                                </div>
                                <DialogFooter>
                                    <Button variant="outline" onClick={() => setIsCallDialogOpen(false)}>
                                        Cancelar
                                    </Button>
                                    <Button
                                        onClick={() => {
                                            alert(`Llamando a ${selectedCita?.clienteNombre} al número ${selectedCita?.telefono}`)
                                            setIsCallDialogOpen(false)
                                        }}
                                    >
                                        Llamar
                                    </Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>


                        <Dialog open={isMessageDialogOpen} onOpenChange={setIsMessageDialogOpen}>
                            <DialogContent className="sm:max-w-[425px]">
                                <DialogHeader>
                                    <DialogTitle>Enviar Mensaje al Cliente</DialogTitle>
                                </DialogHeader>
                                <div className="py-4">
                                    {selectedCita && (
                                        <div>
                                            <div className="flex items-center gap-3 mb-4">
                                                <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                                                    {/* Ícono de WhatsApp */}
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        viewBox="0 0 24 24"
                                                        fill="currentColor"
                                                        className="h-5 w-5 text-green-500 hover:text-green-600 transition-colors duration-200"
                                                        aria-hidden="true"
                                                        role="img"
                                                    >
                                                        <path d="M20.52 3.48A11.76 11.76 0 0012 0C5.37 0 0 5.37 0 12a11.9 11.9 0 001.64 6.05L0 24l6.2-1.63A11.88 11.88 0 0012 24c6.63 0 12-5.37 12-12a11.74 11.74 0 00-3.48-8.52zM12 22a9.89 9.89 0 01-5.34-1.55l-.38-.23-3.68.97.98-3.59-.25-.38A9.94 9.94 0 012.1 12C2.1 6.55 6.55 2.1 12 2.1S21.9 6.55 21.9 12 17.45 21.9 12 21.9z" />
                                                        <path d="M17.53 14.42c-.28-.14-1.73-.86-2-.96-.26-.1-.45-.16-.65.15-.19.3-.73.98-.9 1.16-.17.18-.34.2-.63.06-.29-.15-1.23-.48-2.34-1.53-.86-.76-1.43-1.68-1.6-1.97-.17-.3-.02-.46.12-.6.14-.14.3-.34.45-.52.15-.17.19-.31.29-.52.1-.2.04-.38-.02-.53-.07-.15-.68-1.66-.93-2.27-.25-.6-.5-.53-.68-.54h-.58c-.2 0-.52.08-.79.38-.27.3-1.03 1.03-1.03 2.5 0 1.47 1.08 2.88 1.23 3.09.15.2 2.1 3.22 5.11 4.52.72.3 1.27.48 1.71.61.72.23 1.38.2 1.9.12.58-.08 1.75-.71 1.99-1.42.25-.7.25-1.3.17-1.43-.07-.12-.25-.2-.55-.35z" />
                                                    </svg>
                                                </div>
                                                <div>
                                                    <p className="font-medium">{selectedCita.clienteNombre}</p>
                                                    <p className="text-sm text-gray-500">{selectedCita.telefono}</p>
                                                </div>
                                            </div>

                                            {/* Campo de mensaje */}
                                            <textarea
                                                id="mensajeCliente"
                                                className="w-full p-3 border rounded-md min-h-[120px]"
                                                placeholder="Escriba su mensaje aquí..."
                                                defaultValue={`Hola ${selectedCita.clienteNombre}, le recordamos su cita para ${selectedCita.servicio} el día ${format(selectedCita.fecha, "PPP", { locale: es })} a las ${selectedCita.horaInicio}. Por favor confirme su asistencia. Gracias.`}
                                            ></textarea>
                                        </div>
                                    )}
                                </div>
                                <DialogFooter>
                                    <Button variant="outline" onClick={() => setIsMessageDialogOpen(false)}>
                                        Cancelar
                                    </Button>
                                    <Button
                                        onClick={() => {
                                            if (!selectedCita) return;
                                            const rawTelefono = selectedCita.telefono ?? ""
                                            const telefono = rawTelefono.replace(/\D/g, "") // Limpia el número
                                            if (!telefono) {
                                                alert("No se encontró un número de teléfono para este cliente.")
                                                return
                                            }

                                            const textarea = document.getElementById("mensajeCliente") as HTMLTextAreaElement | null
                                            const mensaje = encodeURIComponent(textarea?.value || "")

                                            // Asegura que el número tenga el código de país (Colombia = +57)
                                            const numeroWhatsApp = telefono.startsWith("57") ? telefono : `57${telefono}`

                                            // Abre WhatsApp Web o la app en móvil
                                            const url = `https://wa.me/${numeroWhatsApp}?text=${mensaje}`
                                            window.open(url, "_blank")

                                            setIsMessageDialogOpen(false)
                                        }}
                                    >
                                        Enviar Mensaje
                                    </Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>

                    </div>

                </main>

            </ModuleLayout>
        </AuthGuard>

    )


}

