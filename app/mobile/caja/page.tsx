"use client"

import { AuthGuard } from "@/components/auth-guard"
import { RouteGuard } from "@/components/route-guard"
import { MobileLayout } from "@/components/mobile-layout"
import { MobileCaja } from "@/components/mobile-caja"

export default function MobileCajaPage() {
  return (
    <AuthGuard>
      <RouteGuard requiredPermission="facturacion.view">
        <MobileLayout>
          <MobileCaja />
        </MobileLayout>
      </RouteGuard>
    </AuthGuard>
  )
}
