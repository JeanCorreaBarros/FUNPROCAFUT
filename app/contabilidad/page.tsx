"use client"

import dynamic from "next/dynamic"
import { BivooLoader } from "@/components/bivoo-loader"
import { AuthGuard } from "@/components/auth-guard"
import { ModuleLayout } from "@/components/module-layout"
import { ContabilidadWelcomeBanner } from "@/components/contabilidad/contabilidad-welcome-banner"

const ContabilidadBalance = dynamic(() => import("@/components/contabilidad/contabilidad-balance").then(m => m.ContabilidadBalance), { ssr: false, loading: () => <BivooLoader /> })
const ContabilidadMovimientos = dynamic(() => import("@/components/contabilidad/contabilidad-movimientos").then(m => m.ContabilidadMovimientos), { ssr: false, loading: () => <BivooLoader /> })

export default function ContabilidadPage() {
  return (
    <AuthGuard>
      <ModuleLayout moduleType="contabilidad">
        <div className="space-y-6">
          <ContabilidadWelcomeBanner />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="lg:col-span-1">
              <ContabilidadBalance />
            </div>
            <div className="lg:col-span-1">
              <ContabilidadMovimientos />
            </div>
          </div>
        </div>
      </ModuleLayout>
    </AuthGuard>
  )
}
