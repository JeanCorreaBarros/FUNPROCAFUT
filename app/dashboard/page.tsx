"use client"

import { AuthGuard } from "@/components/auth-guard"
import { DashboardLayout } from "@/components/dashboard-layout"
import { WelcomeBanner } from "@/components/welcome-banner"
import { ActiveModules } from "@/components/active-modules"
import { CompanyInfo } from "@/components/company-info"
import { UserStats } from "@/components/user-stats"
import { SetupProgress } from "@/components/setup-progress"

export default function DashboardPage() {
  return (
    <AuthGuard>
      <DashboardLayout>
        <div className="space-y-6">
          <WelcomeBanner />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-3">
              <ActiveModules />
            </div>

            <div className="lg:col-span-6">
              <div className="space-y-6">
                <SetupProgress />
                <CompanyInfo />
              </div>
            </div>

            <div className="lg:col-span-3">
              <UserStats />
            </div>
          </div>
        </div>
      </DashboardLayout>
    </AuthGuard>
  )
}
