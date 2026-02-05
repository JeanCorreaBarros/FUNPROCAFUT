"use client"

import { AuthGuard } from "@/components/auth-guard"
import { MobileLayout } from "@/components/mobile-layout"
import { MobileConfiguracion } from "@/components/mobile-configuracion"

export default function MobileConfiguracionPage() {
  return (
    <AuthGuard>
      <MobileLayout>
        <MobileConfiguracion />
      </MobileLayout>
    </AuthGuard>
  )
}
