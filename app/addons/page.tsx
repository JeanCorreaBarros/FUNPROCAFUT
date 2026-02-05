"use client";

import dynamic from "next/dynamic"
import { AuthGuard } from "@/components/auth-guard"
import { DashboardLayout } from "@/components/dashboard-layout"
import Link from "next/link";
import { useState } from "react";

type Addon = {
    name: string;
    description: string;
    price: number;
    icon: string;
    featured?: boolean;
};

const addons: Addon[] = [
    {
        name: "Gestión de Reservas Avanzada",
        description: "Permite a tus clientes reservar y pagar online, con recordatorios automáticos.",
        price: 9.99,
        icon: "🗓️",
        featured: true,
    },
    {
        name: "Integración WhatsApp",
        description: "Envía notificaciones y recordatorios automáticos por WhatsApp.",
        price: 4.99,
        icon: "💬",
    },
    {
        name: "Reportes Avanzados",
        description: "Obtén reportes personalizados y exporta a Excel o PDF.",
        price: 7.99,
        icon: "📊",
    },
    {
        name: "Pasarela de Pagos",
        description: "Recibe pagos con tarjeta directamente desde tu panel.",
        price: 12.99,
        icon: "💳",
    },
    {
        name: "Integración con Google Calendar",
        description: "Sincroniza tus citas con Google Calendar automáticamente.",
        price: 5.99,
        icon: "📅",
    },
    {
        name: "Facturación Electrónica",
        description: "Genera facturas electrónicas automáticamente para tus ventas.",
        price: 14.99,
        icon: "🧾",
        featured: true,
    },
];

export default function AddonsPage() {
    const [selectedAddon, setSelectedAddon] = useState<Addon | null>(null);
    return (

        <AuthGuard>
            <DashboardLayout>

                <div className="min-h-screen bg-gray-50">
                    <div className="max-w-4xl mx-auto ">
                        <h1 className="text-3xl font-bold text-purple-700 mb-6 text-center">Bivoo Addons</h1>
                        <p className="text-gray-600 mb-10 text-center">Potencia tu negocio con funcionalidades extra. Elige los addons que mejor se adapten a tus necesidades.</p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6">
                            {addons.map((addon, idx) => (
                                <div key={idx} className={`relative bg-white cursor-pointer rounded-xl shadow-md border p-6 flex flex-col gap-2 transition-transform hover:scale-[1.03] ${addon.featured ? 'border-purple-500 ring-2 ring-purple-200' : ''}`}>
                                    <div className="flex items-center gap-3 mb-2">
                                        <span className="text-3xl">{addon.icon}</span>
                                        <span className="font-semibold text-lg text-gray-800">{addon.name}</span>
                                        {addon.featured && <span className="ml-2 px-2 py-0.5 bg-purple-100 text-purple-700 text-xs rounded-full font-bold">Destacado</span>}
                                    </div>
                                    <div className="text-gray-600 text-sm mb-4">{addon.description}</div>
                                    <div className="flex items-end justify-between mt-auto">
                                        <span className="text-purple-700 font-bold text-xl">${addon.price.toFixed(2)}</span>
                                        <div className="flex gap-2">
                                            <button className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg font-semibold shadow" onClick={() => setSelectedAddon(addon)}>Ver más</button>
                                            <button className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg font-semibold shadow">Añadir</button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="mt-10 text-center text-gray-400 text-xs">¿Tienes una idea para un addon? <Link href="/soporte" className="text-purple-500 underline">Contáctanos</Link></div>
                    </div>

                    {/* Modal de detalle del addon */}
                    {selectedAddon && (
                        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
                            <div className="bg-white rounded-xl shadow-lg max-w-md w-full p-8 relative animate-fade-in">
                                <button className="absolute top-3 right-3 text-gray-400 hover:text-purple-600 text-2xl" onClick={() => setSelectedAddon(null)}>&times;</button>
                                <div className="flex items-center gap-3 mb-4">
                                    <span className="text-4xl">{selectedAddon.icon}</span>
                                    <span className="font-bold text-2xl text-gray-800">{selectedAddon.name}</span>
                                </div>
                                <div className="text-gray-700 mb-4">{selectedAddon.description}</div>
                                <div className="mb-4">
                                    <h3 className="font-semibold text-purple-700 mb-2">¿Qué puedes hacer con este complemento?</h3>
                                    <ul className="list-disc pl-5 text-gray-600 text-sm space-y-1">
                                        <li>Funcionalidades avanzadas y personalizadas para tu negocio.</li>
                                        <li>Integración sencilla con tu panel Bivoo.</li>
                                        <li>Soporte y actualizaciones incluidas.</li>
                                        <li>Mejora la experiencia de tus clientes y tu gestión interna.</li>
                                    </ul>
                                </div>
                                <div className="flex items-center justify-between mt-6">
                                    <span className="text-purple-700 font-bold text-xl">${selectedAddon.price.toFixed(2)}</span>
                                    <button className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg font-semibold shadow">Añadir</button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

            </DashboardLayout>
        </AuthGuard>

    );
}

