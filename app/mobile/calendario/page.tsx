"use client"

import { AuthGuard } from "@/components/auth-guard"
import { RouteGuard } from "@/components/route-guard"
import { MobileLayout } from "@/components/mobile-layout"
import  MobileCalendar  from "@/components/mobile-calendar"

export default function MobileCalendarioPage() {
  return (
    <AuthGuard>
      <RouteGuard requiredPermission="agenda.view">
        <MobileLayout>
          <MobileCalendar />
        </MobileLayout>
      </RouteGuard>
    </AuthGuard>
  )
}
