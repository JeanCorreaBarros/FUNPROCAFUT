"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Bell, X, Check, Trash2 } from "lucide-react"
import { cn } from "@/lib/utils"

interface Notification {
  id: string
  title: string
  message: string
  time: string
  read: boolean
  type: "info" | "warning" | "success" | "error"
}

interface NotificationsModalProps {
  isOpen: boolean
  onClose: () => void
}

export function NotificationsModal({ isOpen, onClose }: NotificationsModalProps) {
  const [notifications, setNotifications] = useState<Notification[]>([
    ...Array.from({ length: 20 }).map((_, i) => ({
      id: String(i + 1),
      title: `Notificación ${i + 1}`,
      message: `Este es el mensaje de la notificación número ${i + 1}.`,
      time: `hace ${i + 1} min`,
      read: i < 20 ? false : true,
      type: ["info", "success", "warning", "error"][i % 4] as Notification["type"],
    })),
  ])

  const markAsRead = (id: string) => {
    setNotifications((prev) => prev.map((notif) => (notif.id === id ? { ...notif, read: true } : notif)))
  }

  const deleteNotification = (id: string) => {
    setNotifications((prev) => prev.filter((notif) => notif.id !== id))
  }

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((notif) => ({ ...notif, read: true })))
  }

  const unreadCount = notifications.filter((n) => !n.read).length

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 bg-black/50 z-50 flex items-start justify-center pt-16"
      onClick={(e) => {
        // Solo cerrar si el click es en el fondo, no en el contenido
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div
        className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4 max-h-[80vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div className="flex items-center space-x-2">
            <Bell size={20} className="text-bivoo-purple" />
            <h2 className="text-lg font-semibold text-gray-900">Notificaciones</h2>
            {unreadCount > 0 && (
              <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">{unreadCount}</span>
            )}
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X size={18} />
          </Button>
        </div>

        {/* Actions */}
        {unreadCount > 0 && (
          <div className="p-3 border-b border-gray-100">
            <Button
              variant="ghost"
              size="sm"
              onClick={markAllAsRead}
              className="text-bivoo-purple hover:bg-bivoo-purple/10"
            >
              <Check size={16} className="mr-1" />
              Marcar todas como leídas
            </Button>
          </div>
        )}

        {/* Notifications List */}
        <div className="max-h-96 overflow-y-auto">
          {notifications.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              <Bell size={48} className="mx-auto mb-4 text-gray-300" />
              <p>No tienes notificaciones</p>
            </div>
          ) : (
            notifications.map((notification) => (
              <div
                key={notification.id}
                className={cn(
                  "p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors",
                  !notification.read && "bg-blue-50/50",
                )}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-1">
                      <h3
                        className={cn(
                          "text-sm font-medium truncate",
                          !notification.read ? "text-gray-900" : "text-gray-600",
                        )}
                      >
                        {notification.title}
                      </h3>
                      {!notification.read && <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0" />}
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{notification.message}</p>
                    <p className="text-xs text-gray-400">{notification.time}</p>
                  </div>
                  <div className="flex items-center space-x-1 ml-2">
                    {!notification.read && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => markAsRead(notification.id)}
                        className="p-1 h-auto"
                      >
                        <Check size={14} />
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => deleteNotification(notification.id)}
                      className="p-1 h-auto text-red-500 hover:text-red-700"
                    >
                      <Trash2 size={14} />
                    </Button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
