"use client"

import dynamic from "next/dynamic"
import { BivooLoader } from "@/components/bivoo-loader"
import { AuthGuard } from "@/components/auth-guard"
import { ModuleLayout } from "@/components/module-layout"
import { SeguridadWelcomeBanner } from "@/components/seguridad/seguridad-welcome-banner"

const SeguridadPermisos = dynamic(() => import("@/components/seguridad/seguridad-permisos").then(m => m.SeguridadPermisos), { ssr: false, loading: () => <BivooLoader /> })
const SeguridadLogs = dynamic(() => import("@/components/seguridad/seguridad-logs").then(m => m.SeguridadLogs), { ssr: false, loading: () => <BivooLoader /> })

export default function SeguridadPage() {
  return (
    <AuthGuard>
      <ModuleLayout moduleType="seguridad">
        <div className="space-y-6">
          <SeguridadWelcomeBanner />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="lg:col-span-1">
              <SeguridadPermisos />
            </div>
            <div className="lg:col-span-1">
              <SeguridadLogs />
            </div>
          </div>
        </div>
      </ModuleLayout>
    </AuthGuard>
  )
}
