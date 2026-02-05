"use client"

import type React from "react"

import { useState, useEffect } from "react"
import dynamic from "next/dynamic"
import { AuthGuard } from "@/components/auth-guard"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"

export default function MiCuentaPage() {
    const [profileImage, setProfileImage] = useState<string | null>(null)
    const [nombre, setNombre] = useState("")
    const [apellido, setApellido] = useState("")
    const [email, setEmail] = useState("")
    const [telefono, setTelefono] = useState("")
    const [bio, setBio] = useState("")
    const [cargo, setCargo] = useState("")
    const [ubicacion, setUbicacion] = useState("")
    const [avatar, setAvatar] = useState("")

    useEffect(() => {
        const data = localStorage.getItem('bivoo-user')
        if (data) {
            const parsed = JSON.parse(data)
            setNombre(parsed.firstName)
            setApellido(parsed.lastName)
            setEmail(parsed.email)
            setCargo(parsed.role)
            setUbicacion(parsed.company)
            setAvatar(parsed.avatar)
        }
    }, [])

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            const reader = new FileReader()
            reader.onload = (e) => {
                setProfileImage(e.target?.result as string)
            }
            reader.readAsDataURL(file)
        }
    }

    return (

        <AuthGuard>
            <DashboardLayout>
                <main className="flex-1 overflow-y-auto  ">
                    <div className="max-w-4xl mx-auto">
                        <h1 className="text-2xl font-bold mb-6">Mi Cuenta</h1>

                        <Tabs defaultValue="perfil">
                            <TabsList className="mb-6">
                                <TabsTrigger className="cursor-pointer" value="perfil">Perfil</TabsTrigger>
                                <TabsTrigger className="cursor-pointer" value="seguridad">Seguridad</TabsTrigger>
                                <TabsTrigger className="cursor-pointer" value="notificaciones">Notificaciones</TabsTrigger>
                                {/*<TabsTrigger className="cursor-pointer" value="facturacion">Facturación</TabsTrigger>*/}
                            </TabsList>

                            <TabsContent value="perfil" className="space-y-6">
                                <div className="bg-white rounded-xl p-6 shadow-sm">
                                    <h2 className="text-lg font-medium mb-4">Información Personal</h2>

                                    <div className="flex flex-col md:flex-row gap-6 mb-6">
                                        <div className="flex flex-col items-center space-y-3">
                                            <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center">
                                                {profileImage ? (
                                                    <img
                                                        src={profileImage || "/placeholder.svg"}
                                                        alt="Foto de perfil"
                                                        className="w-full h-full object-cover"
                                                    />
                                                ) : avatar ? (
                                                    <span className="text-2xl font-bold text-gray-400">{avatar}</span>
                                                ) : (
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        width="48"
                                                        height="48"
                                                        viewBox="0 0 24 24"
                                                        fill="none"
                                                        stroke="currentColor"
                                                        strokeWidth="1"
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        className="text-gray-400"
                                                    >
                                                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                                                        <circle cx="12" cy="7" r="4"></circle>
                                                    </svg>
                                                )}
                                            </div>
                                            <div>
                                                <label htmlFor="profile-image" className="cursor-pointer">
                                                    <span className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 text-sm">
                                                        Cambiar foto
                                                    </span>
                                                    <input
                                                        id="profile-image"
                                                        type="file"
                                                        accept="image/*"
                                                        className="hidden"
                                                        onChange={handleImageUpload}
                                                    />
                                                </label>
                                            </div>
                                        </div>

                                        <div className="flex-1 space-y-4">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div className="space-y-2">
                                                    <Label htmlFor="nombre">Nombre</Label>
                                                    <Input id="nombre" value={nombre} readOnly />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label htmlFor="apellido">Apellido</Label>
                                                    <Input id="apellido" value={apellido} readOnly />
                                                </div>
                                            </div>

                                            <div className="space-y-2">
                                                <Label htmlFor="email">Correo Electrónico</Label>
                                                <Input id="email" type="email" value={email} readOnly />
                                            </div>

                                            <div className="space-y-2">
                                                <Label htmlFor="telefono">Teléfono</Label>
                                                <Input id="telefono" value={telefono} readOnly />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="bio">Biografía</Label>
                                            <Textarea
                                                id="bio"
                                                placeholder="Cuéntanos sobre ti..."
                                                value={bio}
                                                readOnly
                                            />
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <Label htmlFor="cargo">Cargo</Label>
                                                <Input id="cargo" value={cargo} readOnly />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="ubicacion">Company</Label>
                                                <Input id="ubicacion" value={ubicacion} readOnly />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex justify-end mt-6">
                                        <Button variant="outline" className="mr-2" disabled>
                                            Cancelar
                                        </Button>
                                        <Button disabled>Guardar Cambios</Button>
                                    </div>
                                </div>
                            </TabsContent>

                            <TabsContent value="seguridad" className="space-y-6">
                                <div className="bg-white rounded-xl p-6 shadow-sm">
                                    <h2 className="text-lg font-medium mb-4">Cambiar Contraseña</h2>

                                    <div className="space-y-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="current-password">Contraseña Actual</Label>
                                            <Input id="current-password" type="password" />
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="new-password">Nueva Contraseña</Label>
                                            <Input id="new-password" type="password" />
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="confirm-password">Confirmar Contraseña</Label>
                                            <Input id="confirm-password" type="password" />
                                        </div>
                                    </div>

                                    <div className="flex justify-end mt-6">
                                        <Button>Actualizar Contraseña</Button>
                                    </div>
                                </div>

                                <div className="bg-white rounded-xl p-6 shadow-sm">
                                    <h2 className="text-lg font-medium mb-4">Autenticación de Dos Factores</h2>

                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="font-medium">Activar Autenticación de Dos Factores</p>
                                            <p className="text-sm text-gray-500">Añade una capa adicional de seguridad a tu cuenta</p>
                                        </div>
                                        <Switch id="2fa" />
                                    </div>

                                    <div className="mt-6 pt-6 border-t">
                                        <h3 className="font-medium mb-2">Dispositivos Conectados</h3>
                                        <div className="space-y-3">
                                            <div className="flex items-center justify-between p-3 border rounded-lg">
                                                <div>
                                                    <p className="font-medium">Chrome en Windows</p>
                                                    <p className="text-sm text-gray-500">Último acceso: Hoy, 10:45 AM</p>
                                                </div>
                                                <Button variant="outline" size="sm">
                                                    Cerrar Sesión
                                                </Button>
                                            </div>
                                            <div className="flex items-center justify-between p-3 border rounded-lg">
                                                <div>
                                                    <p className="font-medium">Safari en iPhone</p>
                                                    <p className="text-sm text-gray-500">Último acceso: Ayer, 8:30 PM</p>
                                                </div>
                                                <Button variant="outline" size="sm">
                                                    Cerrar Sesión
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </TabsContent>

                            <TabsContent value="notificaciones" className="space-y-6">
                                <div className="bg-white rounded-xl p-6 shadow-sm">
                                    <h2 className="text-lg font-medium mb-4">Preferencias de Notificaciones</h2>

                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between py-3 border-b">
                                            <div>
                                                <p className="font-medium">Notificaciones por Email</p>
                                                <p className="text-sm text-gray-500">Recibe actualizaciones importantes por correo</p>
                                            </div>
                                            <Switch id="email-notifications" defaultChecked />
                                        </div>

                                        <div className="flex items-center justify-between py-3 border-b">
                                            <div>
                                                <p className="font-medium">Notificaciones de Citas</p>
                                                <p className="text-sm text-gray-500">Recibe recordatorios de citas próximas</p>
                                            </div>
                                            <Switch id="appointment-notifications" defaultChecked />
                                        </div>

                                        <div className="flex items-center justify-between py-3 border-b">
                                            <div>
                                                <p className="font-medium">Notificaciones de Facturas</p>
                                                <p className="text-sm text-gray-500">Recibe alertas sobre nuevas facturas</p>
                                            </div>
                                            <Switch id="invoice-notifications" defaultChecked />
                                        </div>

                                        <div className="flex items-center justify-between py-3 border-b">
                                            <div>
                                                <p className="font-medium">Notificaciones de Marketing</p>
                                                <p className="text-sm text-gray-500">Recibe ofertas y promociones</p>
                                            </div>
                                            <Switch id="marketing-notifications" />
                                        </div>

                                        <div className="flex items-center justify-between py-3">
                                            <div>
                                                <p className="font-medium">Notificaciones de Inventario</p>
                                                <p className="text-sm text-gray-500">Recibe alertas de stock bajo</p>
                                            </div>
                                            <Switch id="inventory-notifications" defaultChecked />
                                        </div>
                                    </div>

                                    <div className="flex justify-end mt-6">
                                        <Button>Guardar Preferencias</Button>
                                    </div>
                                </div>
                            </TabsContent>

                           {/*} <TabsContent value="facturacion" className="space-y-6">
                                <div className="bg-white rounded-xl p-6 shadow-sm">
                                    <h2 className="text-lg font-medium mb-4">Información de Facturación</h2>

                                    <div className="space-y-4">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <Label htmlFor="razon-social">Razón Social</Label>
                                                <Input id="razon-social" defaultValue="Salón de Belleza Ejemplo S.A.S." />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="nit">NIT / Documento</Label>
                                                <Input id="nit" defaultValue="901.234.567-8" />
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="direccion-facturacion">Dirección de Facturación</Label>
                                            <Input id="direccion-facturacion" defaultValue="Calle 123 #45-67, Bogotá" />
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                            <div className="space-y-2">
                                                <Label htmlFor="ciudad">Ciudad</Label>
                                                <Input id="ciudad" defaultValue="Bogotá" />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="departamento">Departamento</Label>
                                                <Input id="departamento" defaultValue="Cundinamarca" />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="codigo-postal">Código Postal</Label>
                                                <Input id="codigo-postal" defaultValue="110111" />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="mt-6 pt-6 border-t">
                                        <h3 className="font-medium mb-4">Historial de Pagos</h3>
                                        <div className="overflow-x-auto">
                                            <table className="w-full min-w-[600px]">
                                                <thead>
                                                    <tr className="text-left text-sm text-gray-500 border-b">
                                                        <th className="pb-3 font-medium">Fecha</th>
                                                        <th className="pb-3 font-medium">Concepto</th>
                                                        <th className="pb-3 font-medium">Monto</th>
                                                        <th className="pb-3 font-medium">Estado</th>
                                                        <th className="pb-3 font-medium">Acciones</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    <tr className="border-b">
                                                        <td className="py-3">15/03/2023</td>
                                                        <td className="py-3">Plan Premium</td>
                                                        <td className="py-3">$150,000</td>
                                                        <td className="py-3">
                                                            <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">Pagado</span>
                                                        </td>
                                                        <td className="py-3">
                                                            <button className="text-blue-600 hover:text-blue-800 text-sm">Ver Factura</button>
                                                        </td>
                                                    </tr>
                                                    <tr className="border-b">
                                                        <td className="py-3">15/02/2023</td>
                                                        <td className="py-3">Plan Premium</td>
                                                        <td className="py-3">$150,000</td>
                                                        <td className="py-3">
                                                            <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">Pagado</span>
                                                        </td>
                                                        <td className="py-3">
                                                            <button className="text-blue-600 hover:text-blue-800 text-sm">Ver Factura</button>
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td className="py-3">15/01/2023</td>
                                                        <td className="py-3">Plan Premium</td>
                                                        <td className="py-3">$150,000</td>
                                                        <td className="py-3">
                                                            <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">Pagado</span>
                                                        </td>
                                                        <td className="py-3">
                                                            <button className="text-blue-600 hover:text-blue-800 text-sm">Ver Factura</button>
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>

                                    <div className="flex justify-end mt-6">
                                        <Button variant="outline" className="mr-2">
                                            Cancelar
                                        </Button>
                                        <Button>Guardar Cambios</Button>
                                    </div>
                                </div>
                            </TabsContent>*/}

                        </Tabs>
                    </div>
                </main>
            </DashboardLayout>
        </AuthGuard>

    )
}

