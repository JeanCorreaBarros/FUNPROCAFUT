"use client"

import { useState } from "react"
import dynamic from "next/dynamic"
import { AuthGuard } from "@/components/auth-guard"
import { ModuleLayout } from "@/components/module-layout"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { ArrowLeft, Save, Upload } from "lucide-react"
import Link from "next/link"

export default function PerfilPage() {
  const [perfilUsuario, setPerfilUsuario] = useState({
    nombre: "Usuario Ejemplo",
    apellido: "Apellido Ejemplo",
    email: "usuario@ejemplo.com",
    telefono: "+1 234 567 890",
    cargo: "Administrador",
    foto: "/placeholder.svg?height=96&width=96",
  })

  const guardarCambios = () => {
    alert("Cambios guardados correctamente")
  }

  return (


    <AuthGuard>
      <ModuleLayout moduleType="configuracion">

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="container mx-auto py-6"
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <Link href="/configuracion">
                <Button variant="ghost" size="icon" className="mr-2">
                  <ArrowLeft className="h-5 w-5" />
                </Button>
              </Link>
              <h1 className="text-2xl font-bold">Perfil de Usuario</h1>
            </div>
            <Button onClick={guardarCambios}>
              <Save className="mr-2 h-4 w-4" />
              Guardar Cambios
            </Button>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Información Personal</CardTitle>
              <CardDescription>Actualice su información personal y preferencias</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-start gap-6 mb-6">
                <div className="relative">
                  <div className="w-24 h-24 rounded-full bg-gray-200 overflow-hidden">
                    <img
                      src={perfilUsuario.foto || "/placeholder.svg"}
                      alt="User avatar"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <Button variant="outline" size="sm" className="absolute bottom-0 right-0 rounded-full w-8 h-8 p-0">
                    <Upload className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex-1">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="nombre">Nombre</Label>
                      <Input
                        id="nombre"
                        value={perfilUsuario.nombre}
                        onChange={(e) => setPerfilUsuario({ ...perfilUsuario, nombre: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="apellido">Apellido</Label>
                      <Input
                        id="apellido"
                        value={perfilUsuario.apellido}
                        onChange={(e) => setPerfilUsuario({ ...perfilUsuario, apellido: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={perfilUsuario.email}
                        onChange={(e) => setPerfilUsuario({ ...perfilUsuario, email: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="telefono">Teléfono</Label>
                      <Input
                        id="telefono"
                        value={perfilUsuario.telefono}
                        onChange={(e) => setPerfilUsuario({ ...perfilUsuario, telefono: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="cargo">Cargo</Label>
                      <Input
                        id="cargo"
                        value={perfilUsuario.cargo}
                        onChange={(e) => setPerfilUsuario({ ...perfilUsuario, cargo: e.target.value })}
                        disabled
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium mb-2">Cambiar Contraseña</h3>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="contrasena-actual">Contraseña Actual</Label>
                      <Input id="contrasena-actual" type="password" />
                    </div>
                    <div>
                      <Label htmlFor="nueva-contrasena">Nueva Contraseña</Label>
                      <Input id="nueva-contrasena" type="password" />
                    </div>
                    <div>
                      <Label htmlFor="confirmar-contrasena">Confirmar Contraseña</Label>
                      <Input id="confirmar-contrasena" type="password" />
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-2">Preferencias</h3>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="notificaciones-email">Recibir notificaciones por email</Label>
                      <Switch id="notificaciones-email" checked={true} />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="notificaciones-app">Recibir notificaciones en la aplicación</Label>
                      <Switch id="notificaciones-app" checked={true} />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="tema-oscuro">Tema oscuro</Label>
                      <Switch id="tema-oscuro" />
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

      </ModuleLayout>
    </AuthGuard>
  )
}

