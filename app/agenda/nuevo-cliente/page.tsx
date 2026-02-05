"use client"

import type React from "react"
import dynamic from "next/dynamic"
import { AuthGuard } from "@/components/auth-guard"
import { ModuleLayout } from "@/components/module-layout"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ChevronLeftIcon } from "@radix-ui/react-icons"
import { motion } from "framer-motion"

export default function NuevoClientePage() {
    const router = useRouter()
    const [formData, setFormData] = useState({
        nombre: "",
        apellido: "",
        email: "",
        telefono: "",
        direccion: "",
        ciudad: "",
        codigoPostal: "",
        fechaNacimiento: "",
        genero: "",
        notas: "",
        comoNosConocio: "",
    })

    const [formSubmitted, setFormSubmitted] = useState(false)

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target
        setFormData((prev) => ({ ...prev, [name]: value }))
    }

    const handleSelectChange = (name: string, value: string) => {
        setFormData((prev) => ({ ...prev, [name]: value }))
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        console.log("Datos del cliente:", formData)
        setFormSubmitted(true)

        // Simular guardado
        setTimeout(() => {
            router.push("/agenda")
        }, 2000)
    }

    return (

        <AuthGuard>
            <ModuleLayout moduleType="agenda">
                <main className="lg:flex-1 lg:overflow-y-auto lg:p-9 ">

                    <div className="flex h-screen bg-gray-50">
                        <div className="flex flex-col flex-1 overflow-hidden">
                            <main className="flex-1 overflow-y-auto lg:p-9 ">
                                <motion.div
                                    initial={{ opacity: 0, y: 32 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.5, ease: "easeOut" }}
                                >


                                    {formSubmitted ? (
                                        <Card className="max-w-3xl mx-auto">
                                            <CardHeader>
                                                <CardTitle>¡Cliente registrado con éxito!</CardTitle>
                                                <CardDescription>El cliente ha sido registrado correctamente en el sistema.</CardDescription>
                                            </CardHeader>
                                            <CardContent>
                                                <div className="flex items-center justify-center p-6">
                                                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                                                        <svg
                                                            xmlns="http://www.w3.org/2000/svg"
                                                            className="h-8 w-8 text-green-600"
                                                            fill="none"
                                                            viewBox="0 0 24 24"
                                                            stroke="currentColor"
                                                        >
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                        </svg>
                                                    </div>
                                                </div>
                                                <p className="text-center text-gray-600">Redirigiendo a la agenda...</p>
                                            </CardContent>
                                        </Card>
                                    ) : (
                                        <form onSubmit={handleSubmit}>
                                            <Card className="max-w-3xl mx-auto">
                                                <CardHeader>
                                                    <CardTitle>Información del Cliente</CardTitle>
                                                    <CardDescription>
                                                        Ingrese los datos del nuevo cliente para registrarlo en el sistema.
                                                    </CardDescription>
                                                </CardHeader>
                                                <CardContent className="space-y-6">
                                                    <div className="grid grid-cols-2 gap-4">
                                                        <div className="space-y-2">
                                                            <Label htmlFor="nombre">Nombre</Label>
                                                            <Input id="nombre" name="nombre" value={formData.nombre} onChange={handleChange} required />
                                                        </div>
                                                        <div className="space-y-2">
                                                            <Label htmlFor="apellido">Apellido</Label>
                                                            <Input id="apellido" name="apellido" value={formData.apellido} onChange={handleChange} required />
                                                        </div>
                                                    </div>

                                                    <div className="grid grid-cols-2 gap-4">
                                                        <div className="space-y-2">
                                                            <Label htmlFor="email">Email</Label>
                                                            <Input id="email" name="email" type="email" value={formData.email} onChange={handleChange} />
                                                        </div>
                                                        <div className="space-y-2">
                                                            <Label htmlFor="telefono">Teléfono</Label>
                                                            <Input id="telefono" name="telefono" value={formData.telefono} onChange={handleChange} required />
                                                        </div>
                                                    </div>

                                                    <div className="space-y-2">
                                                        <Label htmlFor="direccion">Dirección</Label>
                                                        <Input id="direccion" name="direccion" value={formData.direccion} onChange={handleChange} />
                                                    </div>

                                                    <div className="grid grid-cols-3 gap-4">
                                                        <div className="space-y-2">
                                                            <Label htmlFor="ciudad">Ciudad</Label>
                                                            <Input id="ciudad" name="ciudad" value={formData.ciudad} onChange={handleChange} />
                                                        </div>
                                                        <div className="space-y-2">
                                                            <Label htmlFor="codigoPostal">Código Postal</Label>
                                                            <Input
                                                                id="codigoPostal"
                                                                name="codigoPostal"
                                                                value={formData.codigoPostal}
                                                                onChange={handleChange}
                                                            />
                                                        </div>
                                                        <div className="space-y-2">
                                                            <Label className="truncate max-w-full block" htmlFor="fechaNacimiento">Fecha de Nacimiento</Label>
                                                            <Input
                                                                id="fechaNacimiento"
                                                                name="fechaNacimiento"
                                                                type="date"
                                                                value={formData.fechaNacimiento}
                                                                onChange={handleChange}
                                                            />
                                                        </div>
                                                    </div>

                                                    <div className="grid grid-cols-2 gap-4">
                                                        <div className="space-y-2">
                                                            <Label htmlFor="genero">Género</Label>
                                                            <Select onValueChange={(value) => handleSelectChange("genero", value)} value={formData.genero}>
                                                                <SelectTrigger className="w-full md:w-auto">
                                                                    <SelectValue placeholder="Seleccionar género" />
                                                                </SelectTrigger>
                                                                <SelectContent>
                                                                    <SelectItem value="masculino">Masculino</SelectItem>
                                                                    <SelectItem value="femenino">Femenino</SelectItem>
                                                                    <SelectItem value="otro">Otro</SelectItem>
                                                                    <SelectItem value="prefiero-no-decir">Prefiero no decir</SelectItem>
                                                                </SelectContent>
                                                            </Select>
                                                        </div>
                                                        <div className="space-y-2 hidden">
                                                            <Label htmlFor="comoNosConocio">¿Cómo nos conoció?</Label>
                                                            <Select
                                                                onValueChange={(value) => handleSelectChange("comoNosConocio", value)}
                                                                value={formData.comoNosConocio}
                                                            >
                                                                <SelectTrigger>
                                                                    <SelectValue placeholder="Seleccionar opción" />
                                                                </SelectTrigger>
                                                                <SelectContent>
                                                                    <SelectItem value="recomendacion">Recomendación</SelectItem>
                                                                    <SelectItem value="redes-sociales">Redes Sociales</SelectItem>
                                                                    <SelectItem value="publicidad">Publicidad</SelectItem>
                                                                    <SelectItem value="busqueda-web">Búsqueda Web</SelectItem>
                                                                    <SelectItem value="otro">Otro</SelectItem>
                                                                </SelectContent>
                                                            </Select>
                                                        </div>
                                                    </div>

                                                    <div className="space-y-2">
                                                        <Label htmlFor="notas">Notas Adicionales</Label>
                                                        <Textarea
                                                            id="notas"
                                                            name="notas"
                                                            value={formData.notas}
                                                            onChange={handleChange}
                                                            placeholder="Información adicional sobre el cliente, preferencias, alergias, etc."
                                                            className="min-h-[100px]"
                                                        />
                                                    </div>
                                                </CardContent>
                                                <CardFooter className="flex justify-between">
                                                    <Button variant="outline" type="button" onClick={() => router.push("/agenda")}>
                                                        Cancelar
                                                    </Button>
                                                    <Button type="submit">Guardar Cliente</Button>
                                                </CardFooter>
                                            </Card>
                                        </form>
                                    )}
                                </motion.div>
                            </main>
                        </div>
                    </div>

                </main>
            </ModuleLayout>
        </AuthGuard>

    )
}

