"use client"

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import dynamic from "next/dynamic"
import { AuthGuard } from "@/components/auth-guard"
import { ModuleLayout } from "@/components/module-layout"
import { useEffect, useState } from "react";
import { getTenantIdFromToken } from "@/lib/jwt"
const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000/api'

type Collaborator = {
    professional_id: string;
    professional_name: string;
    specialty_name?: string;
    // API may return specialties in different shapes
    specialties?: any;
    color?: string;
    status?: string;
    // No hay teléfono ni identificación en la respuesta
};

export default function GestionEquipo() {
    const router = useRouter();
    const [collaborators, setCollaborators] = useState<Collaborator[]>([]);
    const [loading, setLoading] = useState(true);
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

    useEffect(() => {
        if (!tenantId) return
        const fetchCollaborators = async () => {
            try {
                const token = typeof window !== "undefined" ? sessionStorage.getItem("TKV") : null;
                const res = await fetch(`${API_BASE}/${tenantId}/modules/agenda/employees`, {
                    headers: {
                        "Authorization": `Bearer ${token}`,
                    },
                });
                if (!res.ok) throw new Error("Error al cargar colaboradores");
                const data = await res.json();
                const raw = Array.isArray(data) ? data : data.data || [];

                // helper to derive specialty name from multiple possible API shapes
                const deriveSpecialtyName = (r: any) => {
                    if (!r) return undefined
                    // case: r.specialties = [{ specialty: { name: 'Barbero' } }, ...]
                    if (Array.isArray(r.specialties) && r.specialties.length > 0) {
                        const first = r.specialties[0]
                        return first?.specialty?.name ?? first?.name ?? first?.specialty_name
                    }
                    // case: r.specialty = { name: 'Barbero' }
                    if (r.specialty) return r.specialty?.name ?? r.specialty?.specialty_name
                    // direct property
                    return r.specialty_name ?? undefined
                }

                const normalized = raw.map((r: any) => ({ ...r, specialty_name: deriveSpecialtyName(r) }))
                setCollaborators(normalized as Collaborator[]);
            } catch (e) {
                setCollaborators([]);
            } finally {
                setLoading(false);
            }
        };
        fetchCollaborators();
    }, [tenantId]);

    return (

        <AuthGuard>
            <ModuleLayout moduleType="agenda">
                <main className="flex-1 p-4 md:p-9 ">

                    <div className="flex  bg-gray-50 flex-col md:flex-row">
                        <div className="flex-1">
                            <div className="p-4 md:p-6 w-full max-w-sm md:max-w-5xl mx-auto">
                                <motion.div
                                    initial={{ opacity: 0, y: 32 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.5, ease: "easeOut" }}
                                >
                                    <div className="text-2xl font-bold mb-6">Colaboradores</div>
                                    <div className="bg-white border rounded-xl overflow-x-auto">
                                        <table className="min-w-[400px] md:min-w-full text-sm">
                                            <thead>
                                                <tr className="text-gray-500 border-b">
                                                    <th className="text-left py-3 px-2 md:px-4 truncate max-w-[120px]">Nombre</th>
                                                    <th className="text-left py-3 px-2 md:px-4 truncate max-w-[120px]">Especialidad</th>
                                                    <th className="text-left py-3 px-2 md:px-4 truncate max-w-[100px]">Teléfono</th>
                                                    <th className="text-left py-3 px-2 md:px-4 truncate max-w-[100px]">Identificación</th>
                                                    <th className="py-3 px-2 md:px-4 truncate max-w-[80px]">Acciones</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {loading ? (
                                                    <tr>
                                                        <td colSpan={5} className="py-6 text-center text-gray-400">
                                                            Cargando colaboradores...
                                                        </td>
                                                    </tr>
                                                ) : collaborators.length > 0 ? (
                                                    collaborators.map((colab) => (
                                                        <tr
                                                            key={colab.professional_id}
                                                            className="border-b last:border-b-0 cursor-pointer hover:bg-gray-50"
                                                            onClick={() =>
                                                                router.push(`/agenda/equipo/${colab.professional_id}`)
                                                            }
                                                        >
                                                            <td className="py-3 px-2 md:px-4 flex items-center gap-2 md:gap-3">
                                                                <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-lg font-bold text-gray-600">
                                                                    {colab.professional_name
                                                                        .split(" ")
                                                                        .map((n) => n[0])
                                                                        .join("")
                                                                        .toUpperCase()
                                                                        .slice(0, 2)}
                                                                </div>
                                                                <span className="font-medium text-black">
                                                                    {colab.professional_name}
                                                                </span>
                                                            </td>
                                                            <td className="py-3 px-2 md:px-4">{colab.specialty_name || "-"}</td>
                                                            <td className="py-3 px-2 md:px-4"><span className="text-gray-400">-</span></td>
                                                            <td className="py-3 px-2 md:px-4"><span className="text-gray-400">-</span></td>
                                                            <td className="py-3 px-2 md:px-4 text-center">
                                                                <button
                                                                    className="text-blue-600 underline cursor-pointer text-xs"
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        router.push(`/agenda/equipo/${colab.professional_id}`);
                                                                    }}
                                                                >
                                                                    Ver detalle
                                                                </button>
                                                            </td>
                                                        </tr>
                                                    ))
                                                ) : (
                                                    <tr>
                                                        <td colSpan={5} className="py-6 text-center text-gray-400">
                                                            No hay colaboradores registrados.
                                                        </td>
                                                    </tr>
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                </motion.div>
                            </div>
                        </div>
                    </div>

                </main>
            </ModuleLayout>
        </AuthGuard>

    );
}
