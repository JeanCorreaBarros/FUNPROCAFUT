"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { MessageSquare, X, Send, Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { AuthGuard } from "@/components/auth-guard"
import { DashboardLayout } from "@/components/dashboard-layout"

interface Message {
    id: string
    sender: string
    avatar: string
    lastMessage: string
    time: string
    unread: number
    online: boolean
}

export default function MensajesPage() {
    const [messages] = useState<Message[]>([
        {
            id: "1",
            sender: "Juan Pérez",
            avatar: "JP",
            lastMessage: "Hola, ¿puedo cambiar mi cita de mañana?",
            time: "10:30 AM",
            unread: 2,
            online: true,
        },
        {
            id: "2",
            sender: "María García",
            avatar: "MG",
            lastMessage: "Gracias por el excelente servicio",
            time: "9:15 AM",
            unread: 0,
            online: false,
        },
        {
            id: "3",
            sender: "Carlos López",
            avatar: "CL",
            lastMessage: "¿Tienen disponibilidad para hoy?",
            time: "Ayer",
            unread: 1,
            online: true,
        },
    ])

    const [selectedMessage, setSelectedMessage] = useState<Message | null>(null)
    const [newMessage, setNewMessage] = useState("")

    const totalUnread = messages.reduce((sum, msg) => sum + msg.unread, 0)

    return (


        <AuthGuard>
            <DashboardLayout>
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-gray-200">
                    <div className="flex items-center space-x-2">
                        <MessageSquare size={20} className="text-bivoo-purple" />
                        <h2 className="text-lg font-semibold text-gray-900">Mensajes</h2>
                        {totalUnread > 0 && (
                            <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">{totalUnread}</span>
                        )}
                    </div>
                    {/* El botón de cerrar solo aplica en modales, no en páginas. Se elimina aquí. */}
                </div>

                <div className="flex h-96">
                    {/* Messages List */}
                    <div className="w-1/2 border-r border-gray-200">
                        {/* Search */}
                        <div className="p-3 border-b border-gray-100">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                                <Input placeholder="Buscar conversaciones..." className="pl-9 h-8 text-sm" />
                            </div>
                        </div>

                        {/* Conversations */}
                        <div className="overflow-y-auto h-full">
                            {messages.map((message) => (
                                <div
                                    key={message.id}
                                    onClick={() => setSelectedMessage(message)}
                                    className={cn(
                                        "p-3 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors",
                                        selectedMessage?.id === message.id && "bg-bivoo-purple/10",
                                    )}
                                >
                                    <div className="flex items-center space-x-3">
                                        <div className="relative">
                                            <div className="w-10 h-10 bg-bivoo-purple text-white rounded-full flex items-center justify-center text-sm font-medium">
                                                {message.avatar}
                                            </div>
                                            {message.online && (
                                                <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 border-2 border-white rounded-full" />
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center justify-between mb-1">
                                                <h3 className="text-sm font-medium text-gray-900 truncate">{message.sender}</h3>
                                                <span className="text-xs text-gray-500">{message.time}</span>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <p className="text-sm text-gray-600 truncate">{message.lastMessage}</p>
                                                {message.unread > 0 && (
                                                    <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full ml-2">
                                                        {message.unread}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Chat Area */}
                    <div className="w-1/2 flex flex-col">
                        {selectedMessage ? (
                            <>
                                {/* Chat Header */}
                                <div className="p-3 border-b border-gray-100">
                                    <div className="flex items-center space-x-3">
                                        <div className="relative">
                                            <div className="w-8 h-8 bg-bivoo-purple text-white rounded-full flex items-center justify-center text-sm font-medium">
                                                {selectedMessage.avatar}
                                            </div>
                                            {selectedMessage.online && (
                                                <div className="absolute -bottom-1 -right-1 w-2 h-2 bg-green-500 border border-white rounded-full" />
                                            )}
                                        </div>
                                        <div>
                                            <h3 className="text-sm font-medium text-gray-900">{selectedMessage.sender}</h3>
                                            <p className="text-xs text-gray-500">{selectedMessage.online ? "En línea" : "Desconectado"}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Messages */}
                                <div className="flex-1 p-3 overflow-y-auto">
                                    <div className="space-y-3">
                                        <div className="flex justify-start">
                                            <div className="bg-gray-100 rounded-lg px-3 py-2 max-w-xs">
                                                <p className="text-sm">{selectedMessage.lastMessage}</p>
                                                <p className="text-xs text-gray-500 mt-1">{selectedMessage.time}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Message Input */}
                                <div className="p-3 border-t border-gray-100">
                                    <div className="flex items-center space-x-2">
                                        <Input
                                            value={newMessage}
                                            onChange={(e) => setNewMessage(e.target.value)}
                                            placeholder="Escribe un mensaje..."
                                            className="flex-1 h-8 text-sm"
                                            onKeyPress={(e) => {
                                                if (e.key === "Enter") {
                                                    // Handle send message
                                                    setNewMessage("")
                                                }
                                            }}
                                        />
                                        <Button size="sm" className="bg-bivoo-purple hover:bg-bivoo-purple-dark">
                                            <Send size={16} />
                                        </Button>
                                    </div>
                                </div>
                            </>
                        ) : (
                            <div className="flex-1 flex items-center justify-center text-gray-500">
                                <div className="text-center">
                                    <MessageSquare size={48} className="mx-auto mb-4 text-gray-300" />
                                    <p>Selecciona una conversación</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </DashboardLayout>
        </AuthGuard>
    )
}
