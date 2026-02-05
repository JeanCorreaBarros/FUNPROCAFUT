"use client"

import type React from "react"
import { useRouter, usePathname } from "next/navigation"
import { ArrowLeft, Bell, Home, Calendar, DollarSign, Users, Settings } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/hooks/use-auth"
import Image from "next/image"

interface MobileLayoutProps {
  children: React.ReactNode
}

export function MobileLayout({ children }: MobileLayoutProps) {
  const { user } = useAuth()
  const router = useRouter()
  const pathname = usePathname()

  const handleBack = () => {
    router.push("/dashboard")
  }

  const navigationItems = [
    { icon: Home, label: "Inicio", path: "/mobile", active: pathname === "/mobile" },
    { icon: Calendar, label: "Calendario", path: "/mobile/calendario", active: pathname === "/mobile/calendario" },
    { icon: DollarSign, label: "Caja Diaria", path: "/mobile/caja", active: pathname === "/mobile/caja" },
    { icon: Users, label: "Clientes", path: "/mobile/clientes", active: pathname === "/mobile/clientes" },
    {
      icon: Settings,
      label: "Configuración",
      path: "/mobile/configuracion",
      active: pathname === "/mobile/configuracion",
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-blue-50 to-purple-50 max-w-sm mx-auto relative">
      

      

      {/* Main Content */}
      <div className="px-4 py-6 pb-24">{children}</div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-1/2 transform -translate-x-1/2 w-full max-w-sm bg-white border-t border-gray-200">
        <div className="flex items-center justify-around py-2">
          {navigationItems.map((item) => (
            <button
              key={item.path}
              onClick={() => router.push(item.path)}
              aria-label={item.label}
              className={item.active
                ? "flex items-center gap-3 py-2 px-3 rounded-xl bg-purple-100 text-blue-600"
                : "flex flex-col items-center py-2 px-3 text-gray-400"
              }
            >
              {/* Active: icon left + label right. Inactive: icon only (stacked) */}
              {item.active ? (
                <>
                  <item.icon size={20} />
                  <span className="text-xs font-medium">{item.label}</span>
                </>
              ) : (
                <item.icon size={20} />
              )}
            </button>
          ))}
        </div>
        <div className="w-32 h-1 bg-black rounded-full mx-auto mb-2"></div>
      </div>
    </div>
  )
}
