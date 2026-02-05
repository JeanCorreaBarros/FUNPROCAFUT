
"use client"

import React, { useEffect, useState } from "react"
import dynamic from "next/dynamic"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Bell, MessageSquare, ChevronLeft, Menu, X, User, CreditCard, Users, FileText, Package, HelpCircle, LogOut, ChevronDown } from "lucide-react"
import { useAuth } from "@/hooks/use-auth"
import { useBreakpoint } from "@/hooks/use-breakpoint"
import Image from "next/image"
import { usePermissions } from "@/hooks/use-permissions"

const ModuleSidebar = dynamic(() => import("@/components/module-sidebar").then(m => m.ModuleSidebar), { ssr: false })
const ExpandableSearch = dynamic(() => import("@/components/expandable-search").then(m => m.ExpandableSearch), { ssr: false })
const NotificationsModal = dynamic(() => import("@/components/notifications-modal").then(m => m.NotificationsModal), { ssr: false })
const MessagesModal = dynamic(() => import("@/components/messages-modal").then(m => m.MessagesModal), { ssr: false })


interface ModuleLayoutProps {
  children: React.ReactNode
  moduleType: string
}

export function ModuleLayout({ children, moduleType }: ModuleLayoutProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isSearchExpanded, setIsSearchExpanded] = useState(false)
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false)
  const [isMessagesOpen, setIsMessagesOpen] = useState(false)
  const { user, logout } = useAuth()
  const { isMobile, isTablet } = useBreakpoint()
  const router = useRouter()
  const { canAccessModule } = usePermissions()


  const goToMobile = () => {
    router.push("/mobile")
  }

  const goToDashboard = () => {
    router.push("/dashboard")
  }

  const isCompactView = isMobile || isTablet

  const [ubicacion, setUbicacion] = useState("")

  useEffect(() => {
    const data = localStorage.getItem('bivoo-user')
    if (data) {
      const parsed = JSON.parse(data)
      setUbicacion(parsed.company)
    }
  }, [])

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar - Hidden on mobile/tablet, shown as drawer */}
      {!isCompactView && <ModuleSidebar moduleType={moduleType} />}

      {/* Mobile/Tablet Sidebar Overlay */}
      {isCompactView && isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="fixed inset-0 bg-black/50" onClick={() => setIsMobileMenuOpen(false)} />
          <div className="fixed left-0 top-0 h-full w-64 bg-white shadow-xl">
            <div className="flex items-center justify-between p-4 border-b">
              <Image src={process.env.NEXT_PUBLIC_LOGO_PATH ?? '/logo-FUNPROCAFUT.png'} alt="FUNPROCAFUT Logo" width={100} height={32} className="h-10 w-auto" />
              <Button variant="ghost" size="sm" onClick={() => setIsMobileMenuOpen(false)}>
                <X size={20} />
              </Button>
            </div>
            <ModuleSidebar moduleType={moduleType} />
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
          <div className="px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-18">
              {/* Left side - Menu button, Back button and Logo */}
              <div className="flex items-center space-x-2">
                {isCompactView && (
                  <Button
                    onClick={() => setIsMobileMenuOpen(true)}
                    variant="ghost"
                    size="sm"
                    className="p-2 hover:bg-gray-100 transition-colors"
                  >
                    <Menu size={20} />
                  </Button>
                )}

                <Button
                  onClick={goToDashboard}
                  variant="ghost"
                  size="sm"
                  className="p-2 hover:bg-gray-100 transition-colors"
                >
                  <ChevronLeft size={20} />
                </Button>

                <div className="flex  items-center">
                  <Image src={process.env.NEXT_PUBLIC_LOGO_PATH ?? '/logo-FUNPROCAFUT.png'} alt="FUNPROCAFUT Logo" width={120} height={40} className="h-10  w-auto" />
                </div>
              </div>

              {/* Center - Company name (hidden on mobile) */}
              {!isMobile && (
                <div className="hidden md:block">
                  <span className="text-sm text-bivoo-purple font-medium">{ubicacion}</span>
                </div>
              )}

              {/* Right side - Search, notifications, actions */}
              <div className="flex items-center space-x-2 sm:space-x-4">


                {/*{!isMobile && (
                  <ExpandableSearch
                    isExpanded={isSearchExpanded}
                    onToggle={() => setIsSearchExpanded(!isSearchExpanded)}
                  />
                )}*/}

                <Button
                  variant="ghost"
                  size="sm"
                  className="relative hover:bg-gray-100 transition-colors"
                  onClick={() => setIsNotificationsOpen(true)}
                >
                  <Bell size={20} />
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                    3
                  </span>
                </Button>
                {/*{!isMobile && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="relative cursor-pointer hover:bg-purple-100 transition-colors"
                    onClick={() => router.push("/mensajes")}
                  >
                    <MessageSquare size={20} />
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                      2
                    </span>
                  </Button>
                )}*/}


                {/*{!isMobile && (
                  <>
                    <Button
                      onClick={goToMobile}
                      variant="outline"
                      size="sm"
                      className="hidden cursor-pointer hover:bg-purple-500 hover:scale-96 sm:flex bg-transparent hover:bg-gray-50 transition-colors"
                    >
                      <svg width="18" height="18" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M17.3097 2.1111C17.3097 1.41416 17.8746 0.849182 18.5716 0.849183C25.5378 0.856832 31.1831 6.50213 31.1907 13.4683C31.1907 14.1653 30.6257 14.7302 29.9288 14.7302C29.2319 14.7302 28.6669 14.1653 28.6669 13.4683C28.6606 7.89543 24.1445 3.37927 18.5716 3.37301C17.8746 3.37301 17.3097 2.80803 17.3097 2.1111ZM18.5716 8.42067C21.3593 8.42067 23.6192 10.6806 23.6192 13.4683C23.6192 14.1653 24.1842 14.7302 24.8812 14.7302C25.5781 14.7302 26.1431 14.1653 26.1431 13.4683C26.1389 9.28844 22.7515 5.90101 18.5716 5.89684C17.8746 5.89684 17.3097 6.46182 17.3097 7.15875C17.3097 7.85569 17.8747 8.42067 18.5716 8.42067ZM30.0462 21.9724C31.5688 23.4992 31.5688 25.9702 30.0462 27.497L28.8978 28.8208C18.5628 38.7154 -6.58719 13.5718 3.15478 3.20392L4.60598 1.942C6.13363 0.46279 8.56624 0.485277 10.0663 1.99248C10.1054 2.0316 12.4437 5.06902 12.4437 5.06902C13.8851 6.58322 13.8812 8.96306 12.4349 10.4725L10.9736 12.3099C12.6069 16.2785 15.7546 19.4325 19.7199 21.0739L21.5686 19.6037C23.0783 18.1586 25.4572 18.1553 26.9709 19.5962C26.9709 19.5962 30.007 21.9332 30.0462 21.9724ZM28.3098 23.8072C28.3098 23.8072 25.29 21.484 25.2509 21.4449C24.7098 20.9083 23.8373 20.9083 23.2962 21.4449C23.2621 21.4802 20.7168 23.5081 20.7168 23.5081C20.3679 23.7859 19.8982 23.8588 19.4814 23.6999C14.3351 21.7838 10.2738 17.7285 8.35008 12.585C8.17844 12.1622 8.2484 11.6797 8.53306 11.3231C8.53306 11.3231 10.561 8.77653 10.595 8.74372C11.1316 8.2026 11.1316 7.33013 10.595 6.78901C10.5559 6.75115 8.23272 3.72887 8.23272 3.72887C7.6849 3.23766 6.84897 3.25925 6.32723 3.77808L4.87603 5.04C-2.24369 13.6008 19.5508 34.1864 27.0529 27.097L28.2025 25.772C28.7625 25.2533 28.81 24.3838 28.3098 23.8072Z" fill="#2F2F2F" />
                      </svg>

                    </Button>

                  </>
                )}*/}

                {/* Inline Profile Dropdown */}
                {user && (
                  (() => {
                    const [isProfileOpen, setIsProfileOpen] = React.useState(false);
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
                        <div className="relative">
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
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 px-4 sm:px-6 lg:px-8 py-6 overflow-auto">{children}</main>
      </div>

      {/* Modals */}
      <NotificationsModal isOpen={isNotificationsOpen} onClose={() => setIsNotificationsOpen(false)} />
      <MessagesModal isOpen={isMessagesOpen} onClose={() => setIsMessagesOpen(false)} />
    </div>
  )
}
