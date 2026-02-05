"use client"

import dynamic from "next/dynamic"
import { AuthGuard } from "@/components/auth-guard"
import { ModuleLayout } from "@/components/module-layout"
import { AgendaWelcomeBanner } from "@/components/agenda/agenda-welcome-banner"


const AgendaCitas = dynamic(() => import("@/components/agenda/agenda-citas").then(m => m.AgendaCitas), {
  loading: () => <div>Cargando citas...</div>,
  ssr: false,
})
const AgendaStats = dynamic(() => import("@/components/agenda/agenda-stats").then(m => m.AgendaStats), {
  loading: () => <div>Cargando estadísticas...</div>,
  ssr: false,
})

export default function AgendaPage() {
  return (
    <AuthGuard>
      <ModuleLayout moduleType="agenda">
        <div className="space-y-6">
          <AgendaWelcomeBanner />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="lg:col-span-1">
              <AgendaCitas />
            </div>
            <div className="lg:col-span-1">
              <AgendaStats />
            </div>
          </div>
        </div>
      </ModuleLayout>
    </AuthGuard>
  )
}
