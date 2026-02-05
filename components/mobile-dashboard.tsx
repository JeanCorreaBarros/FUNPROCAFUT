"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { TrendingUp, Calendar, ThumbsUp, Share2, ChevronRight } from "lucide-react"
import { useAuth } from "@/hooks/use-auth"

export function MobileDashboard() {
  const { user } = useAuth()
  const [currentTime, setCurrentTime] = useState("")

  useEffect(() => {
    const updateTime = () => {
      const now = new Date()
      const timeString = now.toLocaleTimeString("es-ES", {
        hour: "2-digit",
        minute: "2-digit",
      })
      setCurrentTime(timeString)
    }

    updateTime()
    const interval = setInterval(updateTime, 1000)
    return () => clearInterval(interval)
  }, [])

  const getGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return "¡Buenos días! Bienvenido"
    if (hour < 18) return "¡Buenas tardes! Bienvenido"
    return "¡Buenas noches! Bienvenido"
  }

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="text-center">
        <p className="text-gray-600 text-sm mb-1">{getGreeting()}</p>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">{user?.company || "Barbershop ClubMen"}</h1>
      </div>

      {/* Sales Summary */}
      <Card className="bg-white shadow-sm">
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-gray-600 text-sm">Tus ventas</p>
              <p className="text-3xl font-bold text-green-500">$0</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-center">
                <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center mb-1">
                  <span className="text-xs">😴</span>
                </div>
              </div>
              <div className="text-center">
                <p className="text-xs text-gray-500 mb-1">Resumen</p>
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <TrendingUp size={16} className="text-blue-600" />
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-4 gap-3">
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-2 mx-auto">
                <TrendingUp size={20} className="text-blue-600" />
              </div>
              <p className="text-xs text-gray-700">Referidos</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mb-2 mx-auto">
                <span className="text-yellow-600 text-lg">⚡</span>
              </div>
              <p className="text-xs text-gray-700">Crece</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mb-2 mx-auto">
                <Calendar size={20} className="text-purple-600" />
              </div>
              <p className="text-xs text-gray-700">Suscripción</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-2 mx-auto">
                <span className="text-gray-600 text-lg">⊞</span>
              </div>
              <p className="text-xs text-gray-700">Ver todas</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Site Visits */}
      <Card className="bg-blue-50 border-blue-100">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-700 font-medium mb-2">Visitas en tu sitio</p>
              <Button className="bg-blue-500 hover:bg-blue-600 text-white text-sm px-4 py-2 rounded-full">
                <Share2 size={16} className="mr-2" />
                Compartir enlace
              </Button>
            </div>
            <div className="text-4xl font-bold text-gray-900">0</div>
          </div>
        </CardContent>
      </Card>

      {/* Important Notice */}
      <Card className="bg-purple-100 border-purple-200">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <div className="flex items-center mb-2">
                <span className="bg-purple-500 text-white text-xs px-2 py-1 rounded-full mr-2">¡importante!</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-1">Añade una foto de portada para tu página de citas 📸</h3>
              <p className="text-sm text-gray-600">Te tomará solo un minuto, ¡no esperes más!</p>
            </div>
            <ChevronRight size={20} className="text-gray-400" />
          </div>
        </CardContent>
      </Card>

      {/* Favorites Stats */}
      <div>
        <h2 className="text-xl font-bold text-gray-900 mb-4">Favoritos</h2>
        <div className="grid grid-cols-4 gap-4">
          <div className="text-center">
            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-2 mx-auto">
              <TrendingUp size={20} className="text-gray-600" />
            </div>
            <p className="text-lg font-bold text-gray-900">0%</p>
            <p className="text-xs text-gray-600">Crecimiento</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-2 mx-auto">
              <Calendar size={20} className="text-gray-600" />
            </div>
            <p className="text-lg font-bold text-gray-900">0</p>
            <p className="text-xs text-gray-600">Reservas</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-2 mx-auto">
              <ThumbsUp size={20} className="text-gray-600" />
            </div>
            <p className="text-lg font-bold text-gray-900">0</p>
            <p className="text-xs text-gray-600">Clientes nuevos</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-2 mx-auto">
              <span className="text-gray-600 text-lg">↗</span>
            </div>
            <p className="text-lg font-bold text-gray-900">$0</p>
            <p className="text-xs text-gray-600">Gastos</p>
          </div>
        </div>
      </div>

      {/* Recent Visits */}
      <div>
        <h2 className="text-xl font-bold text-gray-900 mb-4">Últimas visitas</h2>
        <Card className="bg-white shadow-sm">
          <CardContent className="p-4">
            <p className="text-gray-500 text-center py-8">No hay visitas recientes</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
