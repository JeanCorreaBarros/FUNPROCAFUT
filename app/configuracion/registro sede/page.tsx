"use client"

import { useState } from "react"
import { AuthGuard } from "@/components/auth-guard"
import { ModuleLayout } from "@/components/module-layout"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Save, ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function RegistroSedePage() {
  const [sede, setSede] = useState({
    nombre: "",
    direccion: "",
    telefono: "",
    ciudad: "",
    principal: false,
  })

  const guardarSede = () => {
    if (!sede.nombre || !sede.direccion) {
      alert("Por favor complete los campos obligatorios")
      return
    }

    // Aquí podrías enviar los datos al servidor
    alert(`Sede "${sede.nombre}" registrada correctamente`)

    setSede({ nombre: "", direccion: "", telefono: "", ciudad: "", principal: false })
  }

  return (
    <AuthGuard>
      <ModuleLayout moduleType="configuracion">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="container mx-auto"
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <Link href="/configuracion/empresa" className="text-gray-500 hover:text-gray-700">
                <ArrowLeft className="h-5 w-5" />
              </Link>
              <h1 className="text-2xl font-bold">Registrar Sede</h1>
            </div>
            <Button onClick={guardarSede}>
              <Save className="mr-2 h-4 w-4" />
              Registrar
            </Button>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Datos de la Sede</CardTitle>
              <CardDescription>Complete la información para registrar una nueva sede</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="nombre">Nombre</Label>
                  <Input
                    id="nombre"
                    value={sede.nombre}
                    onChange={(e) => setSede({ ...sede, nombre: e.target.value })}
                  />
                </div>

                <div>
                  <Label htmlFor="direccion">Dirección</Label>
                  <Input
                    id="direccion"
                    value={sede.direccion}
                    onChange={(e) => setSede({ ...sede, direccion: e.target.value })}
                  />
                </div>

                <div>
                  <Label htmlFor="telefono">Teléfono</Label>
                  <Input
                    id="telefono"
                    value={sede.telefono}
                    onChange={(e) => setSede({ ...sede, telefono: e.target.value })}
                  />
                </div>

                <div>
                  <Label htmlFor="ciudad">Ciudad</Label>
                  <Input
                    id="ciudad"
                    value={sede.ciudad}
                    onChange={(e) => setSede({ ...sede, ciudad: e.target.value })}
                  />
                </div>

                <div className="flex items-center gap-3 mt-2">
                  <Switch
                    checked={sede.principal}
                    onCheckedChange={(checked) => setSede({ ...sede, principal: !!checked })}
                  />
                  <Label>Marcar como sede principal</Label>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </ModuleLayout>
    </AuthGuard>
  )
}
