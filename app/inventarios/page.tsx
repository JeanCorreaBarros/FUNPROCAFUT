"use client"

import dynamic from "next/dynamic"
import { BivooLoader } from "@/components/bivoo-loader"
import { AuthGuard } from "@/components/auth-guard"
import { ModuleLayout } from "@/components/module-layout"
import { InventariosWelcomeBanner } from "@/components/inventarios/inventarios-welcome-banner"

const InventariosProductos = dynamic(() => import("@/components/inventarios/inventarios-productos").then(m => m.InventariosProductos), { ssr: false, loading: () => <BivooLoader /> })
const InventariosResumen = dynamic(() => import("@/components/inventarios/inventarios-resumen").then(m => m.InventariosResumen), { ssr: false, loading: () => <BivooLoader /> })

export default function InventariosPage() {
  return (
    <AuthGuard>
      <ModuleLayout moduleType="inventarios">
        <div className="space-y-6">
          <InventariosWelcomeBanner />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <InventariosProductos />
            </div>
            <div className="lg:col-span-1">
              <InventariosResumen />
            </div>
          </div>
        </div>
      </ModuleLayout>
    </AuthGuard>
  )
}
