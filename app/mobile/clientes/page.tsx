"use client"

import { AuthGuard } from "@/components/auth-guard"
import { RouteGuard } from "@/components/route-guard"
import { MobileLayout } from "@/components/mobile-layout"
import { MobileClientes } from "@/components/mobile-clientes"

export default function MobileClientesPage() {
  return (
    <AuthGuard>
      <RouteGuard requiredModule="agenda">
        <MobileLayout>
          <MobileClientes />
        </MobileLayout>
      </RouteGuard>
    </AuthGuard>
  )
}
