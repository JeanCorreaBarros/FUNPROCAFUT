"use client"

import type React from "react"
import { usePermissions } from "@/hooks/use-permissions"
import type { UserRole } from "@/lib/features/auth/authSlice"

interface PermissionGuardProps {
  children: React.ReactNode
  permission?: string
  permissions?: string[]
  role?: UserRole
  roles?: UserRole[]
  module?: string
  fallback?: React.ReactNode
  requireAll?: boolean // If true, requires ALL permissions/roles, if false requires ANY
}

export function PermissionGuard({
  children,
  permission,
  permissions,
  role,
  roles,
  module,
  fallback = null,
  requireAll = false,
}: PermissionGuardProps) {
  const { hasPermission, hasRole, hasAnyRole, hasAnyPermission, canAccessModule, user } = usePermissions()

  // If no user is authenticated, deny access
  if (!user) {
    return <>{fallback}</>
  }

  let hasAccess = true

  // Check single permission
  if (permission && !hasPermission(permission)) {
    hasAccess = false
  }

  // Check multiple permissions
  if (permissions && permissions.length > 0) {
    if (requireAll) {
      // Require ALL permissions
      hasAccess = permissions.every((p) => hasPermission(p))
    } else {
      // Require ANY permission
      hasAccess = hasAnyPermission(permissions)
    }
  }

  // Check single role
  if (role && !hasRole(role)) {
    hasAccess = false
  }

  // Check multiple roles
  if (roles && roles.length > 0) {
    if (requireAll) {
      // This doesn't make sense for roles (user can only have one role)
      hasAccess = roles.includes(user.role)
    } else {
      // Require ANY role
      hasAccess = hasAnyRole(roles)
    }
  }

  // Check module access
  if (module && !canAccessModule(module)) {
    hasAccess = false
  }

  return hasAccess ? <>{children}</> : <>{fallback}</>
}
