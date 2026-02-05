"use client"

import { AuthGuard } from "@/components/auth-guard"
import { RouteGuard } from "@/components/route-guard"
import { MobileLayout } from "@/components/mobile-layout"
import { MobileDashboard } from "@/components/mobile-dashboard"

export default function MobilePage() {
  return (
    <AuthGuard>
      <RouteGuard requiredModule="agenda">
        <MobileLayout>
          <MobileDashboard />
        </MobileLayout>
      </RouteGuard>
    </AuthGuard>
  )
}
