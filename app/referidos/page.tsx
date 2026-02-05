"use client"

import dynamic from "next/dynamic"
import { AuthGuard } from "@/components/auth-guard"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CopyIcon, Share2Icon, UsersIcon } from "lucide-react"

export default function ReferidosPage() {
    return (


        <AuthGuard>
            <DashboardLayout>

                <main className="flex-1 overflow-y-auto p-9 ">
                    <div className="max-w-6xl mx-auto">
                        <h1 className="text-2xl font-bold mb-2">Programa de Referidos</h1>
                        <p className="text-gray-500 mb-8">
                            Invita a tus colegas y gana recompensas por cada referido que se suscriba
                        </p>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                            <Card>
                                <CardHeader className="pb-3">
                                    <CardTitle className="text-lg">Referidos Activos</CardTitle>
                                    <CardDescription>Total de referidos activos</CardDescription>
                                </CardHeader>
                                <CardContent className="pt-0">
                                    <div className="flex items-center">
                                        <UsersIcon className="h-8 w-8 text-blue-500 mr-3" />
                                        <div className="text-3xl font-bold">5</div>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader className="pb-3">
                                    <CardTitle className="text-lg">Recompensas Ganadas</CardTitle>
                                    <CardDescription>Total acumulado hasta la fecha</CardDescription>
                                </CardHeader>
                                <CardContent className="pt-0">
                                    <div className="text-3xl font-bold">$250,000</div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader className="pb-3">
                                    <CardTitle className="text-lg">Próximo Nivel</CardTitle>
                                    <CardDescription>Faltan 5 referidos para nivel Oro</CardDescription>
                                </CardHeader>
                                <CardContent className="pt-0">
                                    <div className="w-full bg-gray-200 rounded-full h-2.5 mb-2">
                                        <div className="bg-yellow-500 h-2.5 rounded-full" style={{ width: "50%" }}></div>
                                    </div>
                                    <div className="text-sm text-gray-500">5/10 referidos</div>
                                </CardContent>
                            </Card>
                        </div>

                        <div className="bg-white rounded-xl p-6 shadow-sm mb-8">
                            <h2 className="text-lg font-medium mb-4">Tu Enlace de Referido</h2>
                            <div className="flex flex-col md:flex-row gap-3">
                                <div className="flex-1 relative">
                                    <Input value="https://b360.app/r/usuario123" readOnly className="pr-10" />
                                    <button
                                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                                        onClick={() => {
                                            navigator.clipboard.writeText("https://b360.app/r/usuario123")
                                            alert("Enlace copiado al portapapeles")
                                        }}
                                    >
                                        <CopyIcon className="h-4 w-4" />
                                    </button>
                                </div>
                                <Button className="flex items-center gap-2">
                                    <Share2Icon className="h-4 w-4" />
                                    Compartir
                                </Button>
                            </div>

                            <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                                <button className="flex items-center justify-center gap-2 p-3 border rounded-lg hover:bg-gray-50">
                                    <svg className="h-5 w-5 text-blue-600" viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                                    </svg>
                                    Compartir en Facebook
                                </button>
                                <button className="flex items-center justify-center gap-2 p-3 border rounded-lg hover:bg-gray-50">
                                    <svg className="h-5 w-5 text-blue-400" viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                                    </svg>
                                    Compartir en Twitter
                                </button>
                                <button className="flex items-center justify-center gap-2 p-3 border rounded-lg hover:bg-gray-50">
                                    <svg className="h-5 w-5 text-green-600" viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                                    </svg>
                                    Compartir en LinkedIn
                                </button>
                            </div>
                        </div>

                        <Tabs defaultValue="activos" className="bg-white hidden md:block rounded-xl shadow-sm">
                            <TabsList className="w-full border-b rounded-none p-0">
                                <TabsTrigger value="activos" className="flex-1 rounded-none py-3">
                                    Referidos Activos
                                </TabsTrigger>
                                <TabsTrigger value="pendientes" className="flex-1 rounded-none py-3">
                                    Pendientes
                                </TabsTrigger>
                                <TabsTrigger value="historial" className="flex-1 rounded-none py-3">
                                    Historial de Recompensas
                                </TabsTrigger>
                            </TabsList>

                            <TabsContent value="activos" className="p-4 md:p-6">
                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead>
                                            <tr className="text-left text-sm text-gray-500 border-b">
                                                <th className="pb-3 font-medium">Nombre</th>
                                                <th className="pb-3 font-medium">Email</th>
                                                <th className="pb-3 font-medium">Plan</th>
                                                <th className="pb-3 font-medium">Fecha de Registro</th>
                                                <th className="pb-3 font-medium">Recompensa</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr className="border-b">
                                                <td className="py-3">María Rodríguez</td>
                                                <td className="py-3">maria@ejemplo.com</td>
                                                <td className="py-3">Premium</td>
                                                <td className="py-3">15/03/2023</td>
                                                <td className="py-3">$50,000</td>
                                            </tr>
                                            <tr className="border-b">
                                                <td className="py-3">Carlos Gómez</td>
                                                <td className="py-3">carlos@ejemplo.com</td>
                                                <td className="py-3">Básico</td>
                                                <td className="py-3">10/03/2023</td>
                                                <td className="py-3">$30,000</td>
                                            </tr>
                                            <tr className="border-b">
                                                <td className="py-3">Ana Martínez</td>
                                                <td className="py-3">ana@ejemplo.com</td>
                                                <td className="py-3">Premium</td>
                                                <td className="py-3">05/03/2023</td>
                                                <td className="py-3">$50,000</td>
                                            </tr>
                                            <tr className="border-b">
                                                <td className="py-3">Juan Pérez</td>
                                                <td className="py-3">juan@ejemplo.com</td>
                                                <td className="py-3">Empresarial</td>
                                                <td className="py-3">28/02/2023</td>
                                                <td className="py-3">$70,000</td>
                                            </tr>
                                            <tr>
                                                <td className="py-3">Laura Sánchez</td>
                                                <td className="py-3">laura@ejemplo.com</td>
                                                <td className="py-3">Premium</td>
                                                <td className="py-3">20/02/2023</td>
                                                <td className="py-3">$50,000</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </TabsContent>

                            <TabsContent value="pendientes" className="p-4 md:p-6">
                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead>
                                            <tr className="text-left text-sm text-gray-500 border-b">
                                                <th className="pb-3 font-medium">Email</th>
                                                <th className="pb-3 font-medium">Fecha de Invitación</th>
                                                <th className="pb-3 font-medium">Estado</th>
                                                <th className="pb-3 font-medium">Acciones</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr className="border-b">
                                                <td className="py-3">pedro@ejemplo.com</td>
                                                <td className="py-3">18/03/2023</td>
                                                <td className="py-3">
                                                    <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs">
                                                        Pendiente
                                                    </span>
                                                </td>
                                                <td className="py-3">
                                                    <button className="text-blue-600 hover:text-blue-800 text-sm">Reenviar Invitación</button>
                                                </td>
                                            </tr>
                                            <tr className="border-b">
                                                <td className="py-3">sofia@ejemplo.com</td>
                                                <td className="py-3">15/03/2023</td>
                                                <td className="py-3">
                                                    <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs">
                                                        Pendiente
                                                    </span>
                                                </td>
                                                <td className="py-3">
                                                    <button className="text-blue-600 hover:text-blue-800 text-sm">Reenviar Invitación</button>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td className="py-3">roberto@ejemplo.com</td>
                                                <td className="py-3">10/03/2023</td>
                                                <td className="py-3">
                                                    <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs">
                                                        Pendiente
                                                    </span>
                                                </td>
                                                <td className="py-3">
                                                    <button className="text-blue-600 hover:text-blue-800 text-sm">Reenviar Invitación</button>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </TabsContent>

                            <TabsContent value="historial" className="p-4 md:p-6">
                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead>
                                            <tr className="text-left text-sm text-gray-500 border-b">
                                                <th className="pb-3 font-medium">Fecha</th>
                                                <th className="pb-3 font-medium">Referido</th>
                                                <th className="pb-3 font-medium">Tipo</th>
                                                <th className="pb-3 font-medium">Monto</th>
                                                <th className="pb-3 font-medium">Estado</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr className="border-b">
                                                <td className="py-3">20/03/2023</td>
                                                <td className="py-3">María Rodríguez</td>
                                                <td className="py-3">Suscripción Premium</td>
                                                <td className="py-3">$50,000</td>
                                                <td className="py-3">
                                                    <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">Pagado</span>
                                                </td>
                                            </tr>
                                            <tr className="border-b">
                                                <td className="py-3">15/03/2023</td>
                                                <td className="py-3">Carlos Gómez</td>
                                                <td className="py-3">Suscripción Básica</td>
                                                <td className="py-3">$30,000</td>
                                                <td className="py-3">
                                                    <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">Pagado</span>
                                                </td>
                                            </tr>
                                            <tr className="border-b">
                                                <td className="py-3">10/03/2023</td>
                                                <td className="py-3">Ana Martínez</td>
                                                <td className="py-3">Suscripción Premium</td>
                                                <td className="py-3">$50,000</td>
                                                <td className="py-3">
                                                    <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">Pagado</span>
                                                </td>
                                            </tr>
                                            <tr className="border-b">
                                                <td className="py-3">05/03/2023</td>
                                                <td className="py-3">Juan Pérez</td>
                                                <td className="py-3">Suscripción Empresarial</td>
                                                <td className="py-3">$70,000</td>
                                                <td className="py-3">
                                                    <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">Pagado</span>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td className="py-3">28/02/2023</td>
                                                <td className="py-3">Laura Sánchez</td>
                                                <td className="py-3">Suscripción Premium</td>
                                                <td className="py-3">$50,000</td>
                                                <td className="py-3">
                                                    <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">Pagado</span>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </TabsContent>
                        </Tabs>
                    </div>
                </main>

            </DashboardLayout>
        </AuthGuard>


    )
}

