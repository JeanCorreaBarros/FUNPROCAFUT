"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AuthGuard } from "@/components/auth-guard";
import { ModuleLayout } from "@/components/module-layout";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { getTenantIdFromToken } from "@/lib/jwt"
const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000/api'

type Colaborador = {
    id: string;
    userId: string;
    specialty_name?: string;
    // API may return `specialties` as an array or object; keep it loose here
    specialties?: any;
    color?: string;
    status?: string;
    createdAt?: string;
    updatedAt?: string;
    working_hours?: { dayOfWeek: number; startTime: string; endTime: string }[];
};

type Usuario = {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    city?: string;
};

type Cita = {
    id: string;
    client_name: string;
    first_name: string;
    last_name: string;
    service_name: string;
    appointment_date: string;
    start_time: string;
    status_id: string;
    status_name: string;
    professional_id: string;
};

export default function ColaboradorDetalle() {
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
    const params = useParams();
    const [colaborador, setColaborador] = useState<Colaborador | null>(null);
    const [usuario, setUsuario] = useState<Usuario | null>(null);
    const [appointments, setAppointments] = useState<Cita[]>([]);
    const [loading, setLoading] = useState(true);
    const [loadingAppointments, setLoadingAppointments] = useState(false);
    const [tab, setTab] = useState("horario");

    // Estado del modal
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editStatus, setEditStatus] = useState<string>("ACTIVE");
    const [updating, setUpdating] = useState(false);

    // 🔹 Obtener colaborador
    useEffect(() => {
          if (!tenantId) return
        const fetchColaborador = async () => {
            try {
                const token =
                    typeof window !== "undefined" ? sessionStorage.getItem("TKV") : null;
                const res = await fetch(`${API_BASE}/${tenantId}/modules/agenda/employees/${params.id}`,
                    {
                        headers: { Authorization: `Bearer ${token}` },
                    }
                );
                if (!res.ok) throw new Error("Error al cargar colaborador");
                const data = await res.json();
                setColaborador(data);
                setEditStatus(data.status || "ACTIVE");
            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        };
        if (params.id) fetchColaborador();
    }, [params.id, tenantId]);

    // Helper to derive specialty name from different API shapes
    const getSpecialtyName = (col: Colaborador | null) => {
        if (!col) return "-"
        const s = (col as any).specialties
        if (!s) return col.specialty_name ?? "-"
        if (Array.isArray(s)) {
            const first = s[0]
            // shape: { employeeId, specialtyId, specialty: { id, name } }
            return first?.specialty?.name ?? first?.name ?? first?.specialty_name ?? "-"
        }
        // If it's an object: maybe { specialty_name } or { name }
        return s?.specialty?.name ?? s?.name ?? s?.specialty_name ?? col.specialty_name ?? "-"
    }

    // 🔹 Obtener usuario
    useEffect(() => {
        if (!colaborador?.userId) return;
        const fetchUsuario = async () => {
            try {
                const token =
                    typeof window !== "undefined" ? sessionStorage.getItem("TKV") : null;
                const res = await fetch("http://localhost:3000/api/users", {
                    headers: { Authorization: `Bearer ${token}` },
                });
                if (!res.ok) throw new Error("Error al cargar usuarios");
                const data = await res.json();
                const found = data.users.find((u: any) => u.id === colaborador.userId);
                setUsuario(found || null);
            } catch (e) {
                console.error(e);
            }
        };
        fetchUsuario();
    }, [colaborador]);

    // 🔹 Obtener citas del colaborador
    useEffect(() => {
        if (!colaborador) return;
        const fetchCitas = async () => {
            setLoadingAppointments(true);
            try {
                const token =
                    typeof window !== "undefined" ? sessionStorage.getItem("TKV") : null;
                const res = await fetch(
                    `${API_BASE}/${tenantId}/modules/agenda/appointments`,
                    {
                        headers: { Authorization: `Bearer ${token}` },
                    }
                );
                if (!res.ok) throw new Error("Error al cargar citas");
                const data = await res.json();
                const filtradas = (Array.isArray(data)
                    ? data
                    : data.data || []
                ).filter((c: any) => c.professional_id === colaborador.id);
                setAppointments(filtradas);
            } catch (e) {
                console.error(e);
            } finally {
                setLoadingAppointments(false);
            }
        };
        fetchCitas();
    }, [colaborador]);

    if (loading)
        return (
            <div className="p-8 text-center text-gray-400">Cargando colaborador...</div>
        );

    if (!colaborador)
        return (
            <div className="p-8 text-center text-gray-400">
                Colaborador no encontrado.
            </div>
        );

    return (
        <AuthGuard>
            <ModuleLayout moduleType="agenda">
                <main className="flex-1 overflow-y-auto p-4 md:p-9">
                    {/* Encabezado */}
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2 text-gray-500 text-sm">
                            <span
                                className="font-medium text-black cursor-pointer"
                                onClick={() => window.history.back()}
                            >
                                Colaboradores
                            </span>
                            <span className="mx-1">&gt;</span>
                            <span className="font-medium text-black">
                                {usuario
                                    ? `${usuario.firstName} ${usuario.lastName}`
                                    : "Sin nombre"}
                            </span>
                        </div>

                        {/* Botón editar estado */}
                        <Button
                            variant="outline"
                            onClick={() => setIsEditModalOpen(true)}
                            className="text-sm"
                        >
                            Editar estado
                        </Button>
                    </div>

                    {/* Información principal */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
                        <div className="bg-white border rounded-xl p-4 md:col-span-2">
                            <div className="font-semibold mb-2">Información Personal</div>
                            <div className="space-y-2 text-sm text-gray-700">
                                <div className="flex justify-between border-b py-1">
                                    <span>Nombre:</span>
                                    <span>
                                        {usuario
                                            ? `${usuario.firstName} ${usuario.lastName}`
                                            : "-"}
                                    </span>
                                </div>
                                <div className="flex justify-between border-b py-1">
                                    <span>Correo:</span>
                                    <span>{usuario?.email || "-"}</span>
                                </div>
                                <div className="flex justify-between border-b py-1">
                                    <span>Teléfono:</span>
                                    <span>{usuario?.phone || "-"}</span>
                                </div>
                                <div className="flex justify-between border-b py-1">
                                    <span>Ciudad:</span>
                                    <span>{usuario?.city || "-"}</span>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white border rounded-xl p-4 md:col-span-2">
                            <div className="font-semibold mb-2">Detalles Profesionales</div>
                            <div className="space-y-2 text-sm text-gray-700">
                                <div className="flex justify-between border-b py-1">
                                    <span>Especialidad:</span>
                                    <span>{colaborador.specialties.specialty_name || "-"}</span>
                                    <span>{getSpecialtyName(colaborador) || "-"}</span>
                                </div>
                                <div className="flex justify-between border-b py-1">
                                    <span>Estado:</span>
                                    <span>{colaborador.status || "-"}</span>
                                </div>
                                <div className="flex justify-between border-b py-1">
                                    <span>Color agenda:</span>
                                    <span>{colaborador.color || "-"}</span>
                                </div>
                                <div className="flex justify-between border-b py-1">
                                    <span>Creado:</span>
                                    <span>
                                        {new Date(colaborador.createdAt || "").toLocaleString()}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Secciones con tabs */}
                    <div className="bg-white border rounded-xl p-4 md:col-span-8">
                        <div className="font-semibold mb-2">Configuración</div>
                        <div className="flex flex-col md:flex-row items-start md:items-center gap-2 md:gap-4 border-b mb-2 overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
                            <div className="flex min-w-max gap-2 md:gap-4 w-full md:w-auto">
                                {["horario", "reservas", "comisiones", "historial"].map(
                                    (key) => (
                                        <button
                                            key={key}
                                            className={`py-2 px-4 text-sm font-medium border-b-2 ${tab === key
                                                ? "border-black text-black"
                                                : "border-transparent text-gray-400"
                                                }`}
                                            onClick={() => setTab(key)}
                                        >
                                            {key === "horario"
                                                ? "Horario"
                                                : key === "reservas"
                                                    ? "Reservas"
                                                    : key === "comisiones"
                                                        ? "Comisiones"
                                                        : "Historial de movimientos internos"}
                                        </button>
                                    )
                                )}
                            </div>
                        </div>

                        {/* TAB Content */}
                        <AnimatePresence mode="wait">
                            {tab === "horario" && (
                                <motion.div
                                    key="horario"
                                    initial={{ opacity: 0, x: 32 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -32 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-sm">
                                            <thead>
                                                <tr className="text-gray-500 border-b">
                                                    <th className="text-left py-2">Día</th>
                                                    <th className="text-left py-2">Desde</th>
                                                    <th className="text-left py-2">Hasta</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {colaborador.working_hours?.length ? (
                                                    colaborador.working_hours.map((h, i) => (
                                                        <tr key={i} className="border-b last:border-b-0">
                                                            <td className="py-2 font-medium text-black">
                                                                {
                                                                    [
                                                                        "Domingo",
                                                                        "Lunes",
                                                                        "Martes",
                                                                        "Miércoles",
                                                                        "Jueves",
                                                                        "Viernes",
                                                                        "Sábado",
                                                                    ][h.dayOfWeek]
                                                                }
                                                            </td>
                                                            <td className="py-2">{h.startTime}</td>
                                                            <td className="py-2">{h.endTime}</td>
                                                        </tr>
                                                    ))
                                                ) : (
                                                    <tr>
                                                        <td
                                                            colSpan={3}
                                                            className="py-2 text-center text-gray-400"
                                                        >
                                                            Sin horario registrado
                                                        </td>
                                                    </tr>
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                </motion.div>
                            )}

                            {/* Reservas */}
                            {tab === "reservas" && (
                                <motion.div
                                    key="reservas"
                                    initial={{ opacity: 0, x: 32 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -32 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-sm">
                                            <thead>
                                                <tr className="text-gray-500 border-b">
                                                    <th className="text-left py-2">Cliente</th>
                                                    <th className="text-left py-2">Servicio</th>
                                                    <th className="text-left py-2">Fecha</th>
                                                    <th className="text-left py-2">Estado</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {loadingAppointments ? (
                                                    <tr>
                                                        <td
                                                            colSpan={4}
                                                            className="py-4 text-center text-gray-400"
                                                        >
                                                            Cargando reservas...
                                                        </td>
                                                    </tr>
                                                ) : appointments.length === 0 ? (
                                                    <tr>
                                                        <td
                                                            colSpan={4}
                                                            className="py-4 text-center text-gray-400"
                                                        >
                                                            Sin reservas para este colaborador.
                                                        </td>
                                                    </tr>
                                                ) : (
                                                    appointments.map((a) => (
                                                        <tr
                                                            key={a.id}
                                                            className="border-b last:border-b-0"
                                                        >
                                                            <td className="py-2"> {a.first_name} {a.last_name}</td>
                                                            <td className="py-2">{a.service_name}</td>
                                                            <td className="py-2">
                                                                {a.appointment_date} {a.start_time}
                                                            </td>
                                                            <td className="py-2">
                                                                <span
                                                                    className={`px-2 py-1 rounded text-xs ${a.status_id === "COMPLETED"
                                                                        ? "bg-green-100 text-green-700"
                                                                        : a.status_id === "PENDING"
                                                                            ? "bg-yellow-100 text-yellow-700"
                                                                            : "bg-red-200 text-red-600"
                                                                        }`}
                                                                >
                                                                    {a.status_id}
                                                                </span>
                                                            </td>
                                                        </tr>
                                                    ))
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                </motion.div>
                            )}

                            {/* Comisiones */}
                            {tab === "comisiones" && (
                                <motion.div
                                    key="comisiones"
                                    initial={{ opacity: 0, x: 32 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -32 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-sm">
                                            <thead>
                                                <tr className="text-gray-500 border-b">
                                                    <th className="text-left py-2">Mes</th>
                                                    <th className="text-left py-2">Servicios</th>
                                                    <th className="text-left py-2">Comisión (%)</th>
                                                    <th className="text-left py-2">Monto</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr className="border-b last:border-b-0">
                                                    <td className="py-2">Julio 2025</td>
                                                    <td className="py-2">18</td>
                                                    <td className="py-2">30%</td>
                                                    <td className="py-2">$540.000</td>
                                                </tr>
                                                <tr className="border-b last:border-b-0">
                                                    <td className="py-2">Junio 2025</td>
                                                    <td className="py-2">22</td>
                                                    <td className="py-2">30%</td>
                                                    <td className="py-2">$660.000</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </motion.div>
                            )}

                            {/* Historial */}
                            {tab === "historial" && (
                                <motion.div
                                    key="historial"
                                    initial={{ opacity: 0, x: 32 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -32 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-sm">
                                            <thead>
                                                <tr className="text-gray-500 border-b">
                                                    <th className="text-left py-2">Fecha</th>
                                                    <th className="text-left py-2">Movimiento</th>
                                                    <th className="text-left py-2">Descripción</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr className="border-b last:border-b-0">
                                                    <td className="py-2">2025-07-01</td>
                                                    <td className="py-2">Cambio de comisión</td>
                                                    <td className="py-2">
                                                        Comisión ajustada de 25% a 30%
                                                    </td>
                                                </tr>
                                                <tr className="border-b last:border-b-0">
                                                    <td className="py-2">2025-06-15</td>
                                                    <td className="py-2">Nuevo servicio asignado</td>
                                                    <td className="py-2">Pedicure agregado</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Modal para editar estado */}
                    <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
                        <DialogContent className="sm:max-w-[400px]">
                            <DialogHeader>
                                <DialogTitle>Editar Estado del Colaborador</DialogTitle>
                            </DialogHeader>
                            <div className="py-4">
                                <label className="block mb-2 text-sm font-medium">
                                    Estado
                                </label>
                                <Select value={editStatus} onValueChange={setEditStatus}>
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Seleccionar estado" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="ACTIVE">Activo</SelectItem>
                                        <SelectItem value="INACTIVE">Inactivo</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <DialogFooter>
                                <Button
                                    variant="outline"
                                    onClick={() => setIsEditModalOpen(false)}
                                    disabled={updating}
                                >
                                    Cancelar
                                </Button>
                                <Button
                                    onClick={async () => {
                                        setUpdating(true);
                                        try {
                                            const token =
                                                typeof window !== "undefined"
                                                    ? sessionStorage.getItem("TKV")
                                                    : null;
                                            const res = await fetch(
                                                `http://localhost:3000/api/modules/agenda/employees/${colaborador.id}`,
                                                {
                                                    method: "PUT",
                                                    headers: {
                                                        "Content-Type": "application/json",
                                                        Authorization: `Bearer ${token}`,
                                                    },
                                                    body: JSON.stringify({
                                                        status: editStatus,
                                                    }),
                                                }
                                            );
                                            if (!res.ok)
                                                throw new Error("Error al actualizar estado");
                                            setColaborador({
                                                ...colaborador,
                                                status: editStatus,
                                            });
                                            setIsEditModalOpen(false);
                                        } catch (e) {
                                            alert("Error al actualizar el estado");
                                        } finally {
                                            setUpdating(false);
                                        }
                                    }}
                                    disabled={updating}
                                >
                                    {updating ? "Actualizando..." : "Actualizar"}
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </main>
            </ModuleLayout>
        </AuthGuard>
    );
}
