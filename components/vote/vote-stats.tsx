"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"


export default function VoteStats() {
    // Ejemplo de votos recientes
    const votosRecientes = [
        { usuario: "Juan Pérez", opcion: "Opción A", fecha: "22 Sep 2025", estado: "Registrado" },
        { usuario: "Ana Gómez", opcion: "Opción B", fecha: "22 Sep 2025", estado: "Registrado" },
        { usuario: "Carlos Ruiz", opcion: "Opción C", fecha: "21 Sep 2025", estado: "Registrado" },
        { usuario: "María López", opcion: "Opción A", fecha: "21 Sep 2025", estado: "Registrado" },
    ];
    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-lg font-semibold text-gray-900">Votos Recientes</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                {votosRecientes.map((voto, index) => (
                    <div key={index} className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                        <div className="flex items-center justify-between mb-2">
                            <h3 className="font-medium text-gray-900">{voto.usuario}</h3>
                            <span className="text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-800">{voto.opcion}</span>
                        </div>
                        <div className="flex items-center justify-between">
                            <p className="text-sm text-bivoo-gray">{voto.fecha}</p>
                            <span className={`text-xs px-2 py-1 rounded-full ${voto.estado === "Registrado" ? "bg-green-100 text-green-800" : "bg-orange-100 text-orange-800"}`}>{voto.estado}</span>
                        </div>
                    </div>
                ))}
            </CardContent>
        </Card>
    );
}
