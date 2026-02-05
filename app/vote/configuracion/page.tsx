"use client";

import { ModuleLayout } from "@/components/module-layout";
import { AuthGuard } from "@/components/auth-guard";
import { Settings } from "lucide-react";

export default function ConfiguracionVotePage() {
  return (
    <AuthGuard>
      <ModuleLayout moduleType="vote">
        <div className="min-h-screen flex flex-col items-center justify-center">
          <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
            <div className="flex items-center gap-2 mb-4">
              <Settings size={32} className="text-bivoo-purple" />
              <h1 className="text-2xl font-bold text-bivoo-purple">Configuración de Votaciones</h1>
            </div>
            <p className="mb-4 text-gray-700 text-center">Administra las opciones y parámetros de las votaciones.</p>
            {/* Aquí iría el formulario/configuración de votaciones */}
            <div className="text-center text-gray-400">Próximamente: configuración avanzada</div>
          </div>
        </div>
      </ModuleLayout>
    </AuthGuard>
  );
}
