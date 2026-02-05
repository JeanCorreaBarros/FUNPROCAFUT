"use client"

import dynamic from "next/dynamic"
import { BivooLoader } from "@/components/bivoo-loader"
import { AuthGuard } from "@/components/auth-guard"
import { ModuleLayout } from "@/components/module-layout"
import { NominaWelcomeBanner } from "@/components/nomina/nomina-welcome-banner"

const NominaEmpleados = dynamic(() => import("@/components/nomina/nomina-empleados").then(m => m.NominaEmpleados), { ssr: false, loading: () => <BivooLoader /> })
const NominaResumen = dynamic(() => import("@/components/nomina/nomina-resumen").then(m => m.NominaResumen), { ssr: false, loading: () => <BivooLoader /> })

export default function NominaPage() {
  return (
    <AuthGuard>
      <ModuleLayout moduleType="nomina">
        <div className="space-y-6">
          <NominaWelcomeBanner />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <NominaEmpleados />
            </div>
            <div className="lg:col-span-1">
              <NominaResumen />
            </div>
          </div>
        </div>
      </ModuleLayout>
    </AuthGuard>
  )
}
