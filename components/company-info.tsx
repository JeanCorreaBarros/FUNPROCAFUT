"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { MoreHorizontal, RefreshCw } from "lucide-react"

export function CompanyInfo() {
  const [isLoading, setIsLoading] = useState(false)

  // Obtener nombre de la compañía desde localStorage
  let companyName = "";
  let companyEmail = "";

  if (typeof window !== "undefined") {
    try {
      const userData = localStorage.getItem("bivoo-user");
      if (userData) {
        const user = JSON.parse(userData);
        companyName = user.company || "";
        companyEmail = user.email || "";

      }
    } catch (e) {
      companyName = "";
    }
  }

  const handleRefresh = async () => {
    setIsLoading(true)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000))
    setIsLoading(false)
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold text-gray-900">Información de la Empresa</CardTitle>
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="sm" onClick={handleRefresh} disabled={isLoading}>
              <RefreshCw size={16} className={isLoading ? "animate-spin" : ""} />
            </Button>
            {/*<Button variant="ghost" size="sm">
              <MoreHorizontal size={16} />
            </Button>*/}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {isLoading ? (
          <>
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded animate-pulse w-32"></div>
              <div className="h-5 bg-gray-200 rounded animate-pulse w-48"></div>
            </div>
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded animate-pulse w-20"></div>
              <div className="h-5 bg-gray-200 rounded animate-pulse w-40"></div>
            </div>
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded animate-pulse w-28"></div>
              <div className="h-5 bg-gray-200 rounded animate-pulse w-36"></div>
            </div>
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded animate-pulse w-24"></div>
              <div className="h-5 bg-gray-200 rounded animate-pulse w-20"></div>
            </div>
          </>
        ) : (
          <>
            <div>
              <label className="text-sm font-medium text-bivoo-gray">Nombre de la Empresa:</label>
              <p className="text-gray-900 font-medium">{companyName || "Nombre de la empresa"}</p>
            </div>

            <div>
              <label className="text-sm font-medium text-bivoo-gray">Teléfono:</label>
              <p className="text-blue-600 hover:underline cursor-pointer">+57 301-794-0950</p>
            </div>

            <div>
              <label className="text-sm font-medium text-bivoo-gray">Correo Electrónico:</label>
              <p className="text-blue-600 hover:underline cursor-pointer">{companyEmail || "Nombre de la empresa"}</p>
            </div>

            <div>
              <label className="text-sm font-medium text-bivoo-gray">Tipo de Empresa:</label>
              <p className="text-gray-900">Barbería</p>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  )
}
