"use client"

import type React from "react"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { usePermissions } from "@/hooks/use-permissions"
import { LoadingSpinner } from "@/components/loading-spinner"

interface RouteGuardProps {
  children: React.ReactNode
  requiredPermission?: string
  requiredPermissions?: string[]
  requiredModule?: string
  fallbackPath?: string
}

export function RouteGuard({
  children,
  requiredPermission,
  requiredPermissions,
  requiredModule,
  fallbackPath = "/dashboard",
}: RouteGuardProps) {
  const { hasPermission, hasAnyPermission, canAccessModule, user } = usePermissions()
  const router = useRouter()

  useEffect(() => {
    if (!user) {
      router.push("/login")
      return
    }

    let hasAccess = true

    // Check single permission
    if (requiredPermission && !hasPermission(requiredPermission)) {
      hasAccess = false
    }

    // Check multiple permissions (user needs ANY of them)
    if (requiredPermissions && !hasAnyPermission(requiredPermissions)) {
      hasAccess = false
    }

    // Check module access
    if (requiredModule && !canAccessModule(requiredModule)) {
      hasAccess = false
    }

    if (!hasAccess) {
      router.push(fallbackPath)
    }
  }, [
    user,
    hasPermission,
    hasAnyPermission,
    canAccessModule,
    requiredPermission,
    requiredPermissions,
    requiredModule,
    fallbackPath,
    router,
  ])

  // Show loading while checking permissions
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner size="lg" />
          <p className="mt-4 text-bivoo-gray">Verificando permisos...</p>
        </div>
      </div>
    )
  }

  // Check permissions
  let hasAccess = true

  if (requiredPermission && !hasPermission(requiredPermission)) {
    hasAccess = false
  }

  if (requiredPermissions && !hasAnyPermission(requiredPermissions)) {
    hasAccess = false
  }

  if (requiredModule && !canAccessModule(requiredModule)) {
    hasAccess = false
  }

  if (!hasAccess) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-red-600 text-2xl">🚫</span>
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Acceso Denegado</h2>
          <p className="text-gray-600 mb-4">No tienes permisos para acceder a esta página.</p>
          <button
            onClick={() => router.push(fallbackPath)}
            className="px-4 py-2 bg-bivoo-purple text-white rounded-md hover:bg-bivoo-purple-dark transition-colors"
          >
            Volver al Dashboard
          </button>
        </div>
      </div>
    )
  }

  return <>{children}</>
}
