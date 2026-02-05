"use client"

import dynamic from "next/dynamic"
import { BivooLoader } from "@/components/bivoo-loader"
import { AuthGuard } from "@/components/auth-guard"
import { ModuleLayout } from "@/components/module-layout"
import { MarketingWelcomeBanner } from "@/components/marketing/marketing-welcome-banner"

const MarketingCampanas = dynamic(() => import("@/components/marketing/marketing-campanas").then(m => m.MarketingCampanas), { ssr: false, loading: () => <BivooLoader /> })
const MarketingMetricas = dynamic(() => import("@/components/marketing/marketing-metricas").then(m => m.MarketingMetricas), { ssr: false, loading: () => <BivooLoader /> })

export default function MarketingPage() {
  return (
    <AuthGuard>
      <ModuleLayout moduleType="marketing">
        <div className="space-y-6">
          <MarketingWelcomeBanner />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="lg:col-span-1">
              <MarketingCampanas />
            </div>
            <div className="lg:col-span-1">
              <MarketingMetricas />
            </div>
          </div>
        </div>
      </ModuleLayout>
    </AuthGuard>
  )
}
