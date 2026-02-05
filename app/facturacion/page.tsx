"use client"

import dynamic from "next/dynamic"
import { BivooLoader } from "@/components/bivoo-loader"
import { AuthGuard } from "@/components/auth-guard"
import { ModuleLayout } from "@/components/module-layout"
import { FacturacionWelcomeBanner } from "@/components/facturacion/facturacion-welcome-banner"

const FacturacionResumen = dynamic(() => import("@/components/facturacion/facturacion-resumen").then(m => m.FacturacionResumen), { ssr: false, loading: () => <BivooLoader /> })
const FacturacionRecientes = dynamic(() => import("@/components/facturacion/facturacion-recientes").then(m => m.FacturacionRecientes), { ssr: false, loading: () => <BivooLoader /> })

export default function FacturacionPage() {
  return (
    <AuthGuard>
      <ModuleLayout moduleType="facturacion">
        <div className="space-y-6">
          <FacturacionWelcomeBanner />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <FacturacionRecientes />
            </div>
            <div className="lg:col-span-1">
              <FacturacionResumen />
            </div>
          </div>
        </div>
      </ModuleLayout>
    </AuthGuard>
  )
}
