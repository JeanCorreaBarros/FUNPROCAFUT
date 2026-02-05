"use client"

import { useAppSelector } from "@/lib/store"
import type { UserRole } from "@/lib/features/auth/authSlice"

export function usePermissions() {
  const { user } = useAppSelector((state) => state.auth)

  const hasPermission = (permission: string): boolean => {
    if (!user) return false
    return user.permissions.includes(permission)
  }

  const hasRole = (role: UserRole): boolean => {
    if (!user) return false
    return user.role === role
  }

  const hasAnyRole = (roles: UserRole[]): boolean => {
    if (!user) return false
    return roles.includes(user.role)
  }

  const hasAnyPermission = (permissions: string[]): boolean => {
    if (!user) return false
    return permissions.some((permission) => user.permissions.includes(permission))
  }

  const canAccessModule = (module: string): boolean => {
    if (!user) return false
    return user.permissions.some((permission) => permission.startsWith(`${module}.`))
  }

  return {
    user,
    hasPermission,
    hasRole,
    hasAnyRole,
    hasAnyPermission,
    canAccessModule,
    isAdmin: user?.role === "admin",
    isCollaborator: user?.role === "colaborador",
    isReceptionist: user?.role === "recepcionista",
    isAuditor: user?.role === "auditor",
  }
}
