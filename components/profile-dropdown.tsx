"use client"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { User, CreditCard, Users, FileText, Package, HelpCircle, LogOut, ChevronDown } from "lucide-react"
import { useAuth } from "@/hooks/use-auth"
import { usePermissions } from "@/hooks/use-permissions"

export function ProfileDropdown() {
  const { user, logout } = useAuth()
  const { hasPermission } = usePermissions()
  const [isOpen, setIsOpen] = useState(false)

  if (!user) return null

  const menuItems = [
    {
      icon: User,
      label: "Mi Cuenta",
      action: () => console.log("Mi Cuenta"),
      permission: null,
    },
    {
      icon: CreditCard,
      label: "Planes",
      action: () => console.log("Planes"),
      permission: null,
    },
    {
      icon: Users,
      label: "Referidos",
      action: () => console.log("Referidos"),
      permission: null,
    },
    {
      icon: FileText,
      label: "Historial de Pagos",
      action: () => console.log("Historial de Pagos"),
      permission: "facturacion.view",
    },
    {
      icon: Package,
      label: "Bivoo Addons",
      action: () => console.log("Bivoo Addons"),
      permission: "configuracion.view",
    },
    {
      icon: HelpCircle,
      label: "Soporte",
      action: () => console.log("Soporte"),
      permission: null,
    },
  ]

  const filteredMenuItems = menuItems.filter((item) => !item.permission || hasPermission(item.permission))

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="flex items-center space-x-2 h-10 px-3 hover:bg-gray-100">
          <Avatar className="h-8 w-8">
            <AvatarFallback className="bg-gray-200 text-gray-700 text-sm font-medium">
              {user.avatar ||
                user.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .slice(0, 2)}
            </AvatarFallback>
          </Avatar>
          <ChevronDown size={16} className="text-gray-500" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-64 p-2">
        {/* User Info Header */}
        <div className="flex items-center space-x-3 p-3 border-b border-gray-100 mb-2">
          <Avatar className="h-10 w-10">
            <AvatarFallback className="bg-gray-200 text-gray-700 font-medium">
              {user.avatar ||
                user.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .slice(0, 2)}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="font-medium text-gray-900 truncate">{user.name}</p>
            <p className="text-sm text-gray-500 truncate">{user.email}</p>
          </div>
        </div>

        {/* Menu Items */}
        {filteredMenuItems.map((item, index) => (
          <DropdownMenuItem
            key={index}
            onClick={item.action}
            className="flex items-center space-x-3 p-3 cursor-pointer hover:bg-gray-50 rounded-md"
          >
            <item.icon size={18} className="text-gray-500" />
            <span className="text-gray-700">{item.label}</span>
          </DropdownMenuItem>
        ))}

        <DropdownMenuSeparator className="my-2" />

        {/* Logout */}
        <DropdownMenuItem
          onClick={logout}
          className="flex items-center space-x-3 p-3 cursor-pointer hover:bg-gray-50 rounded-md text-red-600"
        >
          <LogOut size={18} />
          <span>Cerrar Sesión</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
