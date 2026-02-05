"use client"

import dynamic from "next/dynamic"
import { BivooLoader } from "@/components/bivoo-loader"
import { AuthGuard } from "@/components/auth-guard"
import { ModuleLayout } from "@/components/module-layout"
import { ReportesWelcomeBanner } from "@/components/reportes/reportes-welcome-banner"

const ReportesCharts = dynamic(() => import("@/components/reportes/reportes-charts").then(m => m.ReportesCharts), { ssr: false, loading: () => <BivooLoader /> })
const ReportesStats = dynamic(() => import("@/components/reportes/reportes-stats").then(m => m.ReportesStats), { ssr: false, loading: () => <BivooLoader /> })

export default function ReportesPage() {
  return (
    <AuthGuard>
      <ModuleLayout moduleType="reportes">
        <div className="space-y-6">
          <ReportesWelcomeBanner />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <ReportesCharts />
            </div>
            <div className="lg:col-span-1">
              <ReportesStats />
            </div>
          </div>
        </div>
      </ModuleLayout>
    </AuthGuard>
  )
}
