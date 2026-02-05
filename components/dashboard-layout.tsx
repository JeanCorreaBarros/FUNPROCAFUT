"use client"

import React, { useState, useRef, useEffect } from "react"
import {
  User,
  CreditCard,
  Users,
  FileText,
  Package,
  HelpCircle,
  LogOut,
  ChevronDown,
  Search,
  Bell,
  MessageSquare,
  Calendar,
  Settings,
  BarChart3,
  Menu,
  X,
  CheckCircle,
  Bot,
  XCircle,
  Calculator,
  Megaphone,
  Shield,
} from "lucide-react";
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useAuth } from "@/hooks/use-auth"
import { usePermissions } from "@/hooks/use-permissions"
import { ProfileDropdown } from "@/components/profile-dropdown"
import { NotificationsModal } from "@/components/notifications-modal"
import { MessagesModal } from "@/components/messages-modal"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import Image from "next/image"

interface DashboardLayoutProps {
  children: React.ReactNode
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false)
  const [isMessagesOpen, setIsMessagesOpen] = useState(false)
    const [showChat, setShowChat] = useState(false); // 👈 Controla si se muestra el chat IA

  const { user, logout } = useAuth()
  const { canAccessModule } = usePermissions()
  const router = useRouter()

  const goToMobile = () => {
    router.push("/mobile")
  }

  const navigationItems = [
    { icon: Calendar, label: "Agenda y Citas", path: "/agenda", module: "agenda" },
    { icon: FileText, label: "Facturación", path: "/facturacion", module: "facturacion" },
    { icon: Package, label: "Inventarios", path: "/inventarios", module: "inventarios" },
    { icon: BarChart3, label: "Reportes", path: "/reportes", module: "reportes" },
    { icon: Calculator, label: "Contabilidad", path: "/contabilidad", module: "contabilidad" },
    { icon: Users, label: "Nómina", path: "/nomina", module: "nomina" },
    { icon: Megaphone, label: "Marketing", path: "/marketing", module: "marketing" },
    { icon: Shield, label: "Seguridad", path: "/seguridad", module: "seguridad" },
    { icon: CheckCircle, label: "Vote", path: "/vote", module: "vote" },
    { icon: Settings, label: "Configuración", path: "/configuracion", module: "configuracion" },
  ]

  const filteredNavigationItems = navigationItems.filter((item) => canAccessModule(item.module))

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="px-4 sm:px-6 lg:px-8">
          {/* Top row with logo and user actions */}
          <div className="flex items-center justify-between h-16">
            {/* Logo section */}
            <div className="flex items-center">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors mr-2"
                aria-label="Toggle mobile menu"
              >
                {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>

              <div className="flex items-center cursor-pointer" onClick={() => router.push("/dashboard")}>
                <Image src="/logo-FUNPROCAFUT.png" alt="Bivoo Logo" width={120} height={40} className="h-10 w-auto" />
              </div>
            </div>

            {/* Right side actions */}
            <div className="flex items-center space-x-3">
              <div className="hidden md:block relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <Input
                  type="search"
                  placeholder="Buscar..."
                  className="pl-10 w-64 h-9 border-gray-200 focus:border-bivoo-purple focus:ring-bivoo-purple transition-colors"
                />
              </div>

              <Button
                variant="ghost"
                size="sm"
                className="relative cursor-pointer hover:bg-purple-100 transition-colors"
                onClick={() => setIsNotificationsOpen(true)}
              >
                <Bell size={20} />
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                  20
                </span>
              </Button>

              {/*<Button
                variant="ghost"
                size="sm"
                className="relative cursor-pointer hover:bg-purple-100 transition-colors"
                onClick={() => router.push("/mensajes")}
              >
                <MessageSquare size={20} />
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                  2
                </span>
              </Button>*/}

              {/* Inline Profile Dropdown */}
              {user && (
                (() => {
                  const [isProfileOpen, setIsProfileOpen] = React.useState(false);
                  const dropdownRef = useRef<HTMLDivElement>(null);

                  useEffect(() => {
                    const handleClickOutside = (event: MouseEvent) => {
                      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                        setIsProfileOpen(false);
                      }
                    };

                    if (isProfileOpen) {
                      document.addEventListener('mousedown', handleClickOutside);
                    }

                    return () => {
                      document.removeEventListener('mousedown', handleClickOutside);
                    };
                  }, [isProfileOpen]);

                  const menuItems = [
                    {
                      icon: User,
                      label: "Mi Cuenta",
                      action: () => router.push("/cuenta"),
                      permission: null,
                    },
                    {
                      icon: CreditCard,
                      label: "Planes",
                      action: () => router.push("/planes"),
                      permission: null,
                    },
                    {
                      icon: Users,
                      label: "Referidos",
                      action: () => router.push("/referidos"),
                      permission: null,
                    },
                    {
                      icon: FileText,
                      label: "Historial de Pagos",
                      action: () => router.push("/historial-pagos"),
                      permission: "facturacion.view",
                    },
                    {
                      icon: Package,
                      label: "Bivoo Addons",
                      action: () => router.push("/addons"),
                      permission: "configuracion.view",
                    },
                    {
                      icon: HelpCircle,
                      label: "Soporte",
                      action: () => router.push("/soporte"),
                      permission: null,
                    },
                  ];
                  const filteredMenuItems = menuItems.filter((item) => !item.permission || canAccessModule(item.permission?.split('.')[0]));
                  // Importar Dialog y DialogContent
                  // ...existing code...
                  return (
                    <>
                      <div className="relative" ref={dropdownRef}>
                        <Button
                          variant="ghost"
                          className="flex items-center space-x-2 cursor-pointer h-10 px-3 hover:bg-purple-100"
                          onClick={() => setIsProfileOpen((v) => !v)}
                          aria-haspopup="true"
                          aria-expanded={isProfileOpen}
                        >
                          <div className="h-8 w-8 rounded-full bg-purple-200 flex items-center justify-center text-gray-700 text-sm font-medium">
                            {user.avatar || user.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                          </div>
                          <ChevronDown size={16} className="text-gray-500" />
                        </Button>
                        {isProfileOpen && (
                          <div className="absolute right-0 mt-2 w-64 bg-white border border-gray-200 rounded-md shadow-lg z-50 animate-in fade-in-0 zoom-in-95">
                            {/* User Info Header */}
                            <div className="flex items-center space-x-3 p-3 border-b border-gray-100 mb-2">
                              <div className="h-10 w-10 rounded-full bg-purple-200 flex items-center justify-center text-gray-700 font-medium">
                                {user.avatar || user.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="font-medium text-gray-900 truncate">{user.name}</p>
                                <p className="text-sm text-gray-500 truncate">{user.email}</p>
                              </div>
                            </div>
                            {/* Menu Items */}
                            {filteredMenuItems.map((item, idx) => (
                              <button
                                key={idx}
                                onClick={() => {
                                  item.action();
                                  setIsProfileOpen(false);
                                }}
                                className="flex items-center space-x-3 w-full text-left p-3 cursor-pointer hover:bg-purple-50 rounded-md text-gray-700"
                              >
                                <item.icon size={18} className="text-gray-500" />
                                <span>{item.label}</span>
                              </button>
                            ))}
                            <div className="my-2 border-t border-gray-200" />
                            <button
                              onClick={() => {
                                if (typeof logout === 'function') logout();
                                setIsProfileOpen(false);
                              }}
                              className="flex items-center space-x-3 w-full text-left p-3 cursor-pointer hover:bg-gray-50 rounded-md text-red-600"
                            >
                              <LogOut size={18} />
                              <span>Cerrar Sesión</span>
                            </button>
                          </div>
                        )}
                      </div>
                      {/* Las opciones ahora navegan a su propia página */}
                    </>
                  );
                })()
              )}
            </div>
          </div>

          {/* Navigation row - Desktop */}
          <div className="hidden lg:block border-t border-gray-100">
            <nav className="flex items-center space-x-8 py-4 overflow-x-auto scrollbar-hide">
              {filteredNavigationItems.map((item, index) => (
                <button
                  key={index}
                  onClick={() => router.push(item.path)}
                  className="flex cursor-pointer items-center space-x-2 px-3 py-2 text-sm text-bivoo-gray hover:text-white transition-colors rounded-md hover:bg-blue-500 whitespace-nowrap"
                >
                  <item.icon size={18} />
                  <span>{item.label}</span>
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="lg:hidden border-t border-gray-200 bg-white animate-in slide-in-from-top-2 duration-200">
            <div className="px-4 py-2 space-y-1">
              {/* Mobile search */}
              {/*<div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <Input
                  type="search"
                  placeholder="Buscar..."
                  className="pl-10 w-full h-9 border-gray-200 focus:border-bivoo-purple focus:ring-bivoo-purple transition-colors"
                />
              </div>*/}

              {/* Navigation items */}
              {filteredNavigationItems.map((item, index) => (
                <button
                  key={index}
                  onClick={() => {
                    router.push(item.path)
                    setIsMobileMenuOpen(false)
                  }}
                  className="flex items-center space-x-3 w-full px-3 py-2 text-left text-sm text-bivoo-gray hover:text-bivoo-gray-dark hover:bg-gray-50 rounded-md transition-colors"
                >
                  <item.icon size={18} />
                  <span>{item.label}</span>
                </button>
              ))}

              {/*<div className="pt-2 border-t border-gray-200">
                <Button
                  onClick={goToMobile}
                  variant="outline"
                  size="sm"
                  className="w-full bg-transparent hover:bg-gray-50 transition-colors"
                >
                  Vista Móvil
                </Button>
              </div>*/}
            </div>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="px-4 sm:px-6 lg:px-8 py-6">{children}</main>

      {/* Modals */}
      <NotificationsModal isOpen={isNotificationsOpen} onClose={() => setIsNotificationsOpen(false)} />
      <MessagesModal isOpen={isMessagesOpen} onClose={() => setIsMessagesOpen(false)} />

        
      {/* 💬 Botón flotante de chat IA */}
      {/*<div className="fixed bottom-6 right-6 z-[9999]">
        <Button
          onClick={() => setShowChat(!showChat)}
          className="rounded-full h-14 w-14 shadow-lg bg-purple-600 hover:bg-purple-700 text-white flex items-center justify-center"
        >
          {showChat ? <XCircle size={28} /> : <Bot size={28} />}
        </Button>
      </div>*/}

      {/* 🧠 Ventana flotante del iframe */}
      {showChat && (
        <div className="fixed bottom-24 right-6 w-[380px] h-[520px] bg-white border border-gray-200 shadow-2xl rounded-2xl overflow-hidden animate-in slide-in-from-bottom duration-200 z-[9998]">
          <div className="flex justify-between items-center bg-purple-600 text-white px-4 py-2">
            <span className="font-semibold flex items-center gap-2">
              <Bot size={18} /> Bivoo Asistent
            </span>
            <button onClick={() => setShowChat(false)} className="hover:text-gray-200 cursor-pointer hover:scale-95">
              <X size={18} />
            </button>
          </div>
          <iframe
            src="https://chat-agent-ia.vercel.app/"
            className="w-full h-full border-0"
            allow="microphone; camera; clipboard-read; clipboard-write"
          />
        </div>
      )}
    </div>
  )
}
