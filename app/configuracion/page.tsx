"use client"

import dynamic from "next/dynamic"
import { BivooLoader } from "@/components/bivoo-loader"
import { AuthGuard } from "@/components/auth-guard"
import { ModuleLayout } from "@/components/module-layout"
import { ConfiguracionWelcomeBanner } from "@/components/configuracion/configuracion-welcome-banner"

const ConfiguracionGeneral = dynamic(() => import("@/components/configuracion/configuracion-general").then(m => m.ConfiguracionGeneral), { ssr: false, loading: () => <BivooLoader /> })
const ConfiguracionUsuarios = dynamic(() => import("@/components/configuracion/configuracion-usuarios").then(m => m.ConfiguracionUsuarios), { ssr: false, loading: () => <BivooLoader /> })

export default function ConfiguracionPage() {
  return (
    <AuthGuard>
      <ModuleLayout moduleType="configuracion">
        <div className="space-y-6">
          <ConfiguracionWelcomeBanner />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="lg:col-span-1">
              <ConfiguracionGeneral />
            </div>
            <div className="lg:col-span-1">
              <ConfiguracionUsuarios />
            </div>
          </div>
        </div>
      </ModuleLayout>
    </AuthGuard>
  )
}
