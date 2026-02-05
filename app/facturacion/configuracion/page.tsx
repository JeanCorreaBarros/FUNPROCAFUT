"use client"

import { useState, useEffect } from "react"
import dynamic from "next/dynamic"
import { AuthGuard } from "@/components/auth-guard"
import { ModuleLayout } from "@/components/module-layout"
import { motion } from "framer-motion"
import { SaveIcon, PlusIcon, TrashIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"

function useIsMobile(breakpoint = 640) {
    const [isMobile, setIsMobile] = useState<boolean | null>(null)

    useEffect(() => {
        const mediaQuery = window.matchMedia(`(max-width: ${breakpoint - 1}px)`)

        const handleChange = () => setIsMobile(mediaQuery.matches)

        handleChange()
        mediaQuery.addEventListener("change", handleChange)

        return () => mediaQuery.removeEventListener("change", handleChange)
    }, [breakpoint])

    return isMobile
}

export default function ConfiguracionFacturacionPage() {
    const [consecutivo, setConsecutivo] = useState(1)
    const [prefijo, setPrefijo] = useState("BIVOO-")
    const [impuestos, setImpuestos] = useState([
        { id: 1, nombre: "IVA", porcentaje: 19, activo: true },
        { id: 2, nombre: "Retención en la fuente", porcentaje: 4, activo: true },
        { id: 3, nombre: "ICA", porcentaje: 0.69, activo: false },
    ])
    const [formasPago, setFormasPago] = useState([
        { id: 1, nombre: "Efectivo", activo: true },
        { id: 2, nombre: "Tarjeta de crédito", activo: true },
        { id: 3, nombre: "Tarjeta débito", activo: true },
        { id: 4, nombre: "Transferencia bancaria", activo: true },
        { id: 5, nombre: "Cheque", activo: false },
    ])
    const [terminosCondiciones, setTerminosCondiciones] = useState(
        "Esta factura se emite en todos sus efectos a una letra de cambio de conformidad con el Art. 774 del Código de comercio. Autorizo que en caso de incumplimiento de esta obligación sea reportada a las centrales de riesgo.",
    )

    // Animaciones con Framer Motion
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
            },
        },
    }

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: {
                type: "spring" as const,
                stiffness: 100,
            },
        },
    }

    // Función para agregar un nuevo impuesto
    const agregarImpuesto = () => {
        const nuevoId = impuestos.length > 0 ? Math.max(...impuestos.map((i) => i.id)) + 1 : 1
        setImpuestos([...impuestos, { id: nuevoId, nombre: "Nuevo impuesto", porcentaje: 0, activo: true }])
    }

    // Función para eliminar un impuesto
    const eliminarImpuesto = (id: number) => {
        setImpuestos(impuestos.filter((impuesto) => impuesto.id !== id))
    }

    // Función para actualizar un impuesto
    const actualizarImpuesto = (id: number, campo: string, valor: any) => {
        setImpuestos(impuestos.map((impuesto) => (impuesto.id === id ? { ...impuesto, [campo]: valor } : impuesto)))
    }

    // Función para agregar una nueva forma de pago
    const agregarFormaPago = () => {
        const nuevoId = formasPago.length > 0 ? Math.max(...formasPago.map((f) => f.id)) + 1 : 1
        setFormasPago([...formasPago, { id: nuevoId, nombre: "Nueva forma de pago", activo: true }])
    }

    // Función para eliminar una forma de pago
    const eliminarFormaPago = (id: number) => {
        setFormasPago(formasPago.filter((forma) => forma.id !== id))
    }

    // Función para actualizar una forma de pago
    const actualizarFormaPago = (id: number, campo: string, valor: any) => {
        setFormasPago(formasPago.map((forma) => (forma.id === id ? { ...forma, [campo]: valor } : forma)))
    }

    const isMobile = useIsMobile()
    if (isMobile === null) return null // evita parpadeos / hydration





    if (!isMobile) {
        return (

            <AuthGuard>
                <ModuleLayout moduleType="facturacion">
                    <main className="flex-1 overflow-y-auto p-9 ">

                        <div className="flex min-h-screen bg-gray-50">
                            <div className="flex flex-col flex-1 overflow-hidden">
                                <motion.main
                                    className="flex-1 overflow-y-auto p-9"
                                    initial="hidden"
                                    animate="visible"
                                    variants={containerVariants}
                                >
                                    <motion.div className="flex items-center justify-between mb-6" variants={itemVariants}>
                                        <h1 className="text-2xl font-bold">Configuración de Facturación</h1>
                                        <Button className="bg-purple-600 hover:bg-purple-700 hover:scale-95 text-white">
                                            <SaveIcon className="mr-2 h-4 w-4" />
                                            Guardar cambios
                                        </Button>
                                    </motion.div>

                                    <motion.div variants={containerVariants}>
                                        <Tabs defaultValue="general" className="w-full">
                                            <TabsList className="mb-6">
                                                <TabsTrigger value="general">General</TabsTrigger>
                                                <TabsTrigger value="impuestos">Impuestos</TabsTrigger>
                                                <TabsTrigger value="formas-pago">Formas de Pago</TabsTrigger>
                                                <TabsTrigger value="plantillas">Plantillas</TabsTrigger>
                                            </TabsList>

                                            <TabsContent value="general">
                                                <motion.div className="grid grid-cols-1 md:grid-cols-2 gap-6" variants={containerVariants}>
                                                    <motion.div variants={itemVariants}>
                                                        <Card>
                                                            <CardHeader>
                                                                <CardTitle>Configuración de Numeración</CardTitle>
                                                            </CardHeader>
                                                            <CardContent className="space-y-4">
                                                                <div className="space-y-2">
                                                                    <Label htmlFor="prefijo">Prefijo de Factura</Label>
                                                                    <Input id="prefijo" value={prefijo} onChange={(e) => setPrefijo(e.target.value)} />
                                                                    <p className="text-sm text-gray-500">
                                                                        El prefijo se mostrará antes del número de factura (ej. BIVOO-001)
                                                                    </p>
                                                                </div>

                                                                <div className="space-y-2">
                                                                    <Label htmlFor="consecutivo">Consecutivo Actual</Label>
                                                                    <Input
                                                                        id="consecutivo"
                                                                        type="number"
                                                                        value={consecutivo}
                                                                        onChange={(e) => setConsecutivo(Number.parseInt(e.target.value))}
                                                                    />
                                                                    <p className="text-sm text-gray-500">
                                                                        La próxima factura tendrá el número: {prefijo}
                                                                        {consecutivo.toString().padStart(3, "0")}
                                                                    </p>
                                                                </div>

                                                                <div className="flex items-center space-x-2 pt-2">
                                                                    <Switch id="reiniciar-anual" />
                                                                    <Label htmlFor="reiniciar-anual">Reiniciar consecutivo anualmente</Label>
                                                                </div>
                                                            </CardContent>
                                                        </Card>
                                                    </motion.div>

                                                    <motion.div variants={itemVariants}>
                                                        <Card>
                                                            <CardHeader>
                                                                <CardTitle>Configuración de Documentos</CardTitle>
                                                            </CardHeader>
                                                            <CardContent className="space-y-4">
                                                                <div className="flex items-center space-x-2">
                                                                    <Switch id="factura-electronica" defaultChecked />
                                                                    <Label htmlFor="factura-electronica">Habilitar facturación electrónica</Label>
                                                                </div>

                                                                <div className="flex items-center space-x-2">
                                                                    <Switch id="cotizaciones" defaultChecked />
                                                                    <Label htmlFor="cotizaciones">Habilitar cotizaciones</Label>
                                                                </div>

                                                                <div className="flex items-center space-x-2">
                                                                    <Switch id="notas-credito" defaultChecked />
                                                                    <Label htmlFor="notas-credito">Habilitar notas de crédito</Label>
                                                                </div>

                                                                <div className="flex items-center space-x-2">
                                                                    <Switch id="recordatorios" defaultChecked />
                                                                    <Label htmlFor="recordatorios">Enviar recordatorios de pago</Label>
                                                                </div>

                                                                <div className="space-y-2 pt-2">
                                                                    <Label htmlFor="dias-vencimiento">Días para vencimiento</Label>
                                                                    <Input id="dias-vencimiento" type="number" defaultValue={30} />
                                                                    <p className="text-sm text-gray-500">
                                                                        Número de días predeterminado para el vencimiento de facturas
                                                                    </p>
                                                                </div>
                                                            </CardContent>
                                                        </Card>
                                                    </motion.div>
                                                </motion.div>
                                            </TabsContent>

                                            <TabsContent value="impuestos">
                                                <motion.div variants={itemVariants}>
                                                    <Card>
                                                        <CardHeader className="flex flex-row items-center justify-between">
                                                            <CardTitle>Configuración de Impuestos</CardTitle>
                                                            <Button onClick={agregarImpuesto} className="bg-purple-600 hover:bg-purple-700">
                                                                <PlusIcon className="mr-2 h-4 w-4" />
                                                                Agregar Impuesto
                                                            </Button>
                                                        </CardHeader>
                                                        <CardContent>
                                                            <div className="overflow-x-auto">
                                                                <table className="w-full">
                                                                    <thead>
                                                                        <tr className="text-left text-sm text-gray-500 border-b">
                                                                            <th className="pb-3 font-medium">Nombre</th>
                                                                            <th className="pb-3 font-medium">Porcentaje</th>
                                                                            <th className="pb-3 font-medium">Estado</th>
                                                                            <th className="pb-3 font-medium">Acciones</th>
                                                                        </tr>
                                                                    </thead>
                                                                    <tbody>
                                                                        {impuestos.map((impuesto) => (
                                                                            <motion.tr
                                                                                key={impuesto.id}
                                                                                className="border-b"
                                                                                initial={{ opacity: 0, y: 10 }}
                                                                                animate={{ opacity: 1, y: 0 }}
                                                                                transition={{ duration: 0.3 }}
                                                                            >
                                                                                <td className="py-3">
                                                                                    <Input
                                                                                        value={impuesto.nombre}
                                                                                        onChange={(e) => actualizarImpuesto(impuesto.id, "nombre", e.target.value)}
                                                                                    />
                                                                                </td>
                                                                                <td className="py-3">
                                                                                    <div className="flex items-center">
                                                                                        <Input
                                                                                            type="number"
                                                                                            value={impuesto.porcentaje}
                                                                                            onChange={(e) =>
                                                                                                actualizarImpuesto(impuesto.id, "porcentaje", Number.parseFloat(e.target.value))
                                                                                            }
                                                                                        />
                                                                                        <span className="ml-2">%</span>
                                                                                    </div>
                                                                                </td>
                                                                                <td className="py-3">
                                                                                    <Switch
                                                                                        checked={impuesto.activo}
                                                                                        onCheckedChange={(checked) => actualizarImpuesto(impuesto.id, "activo", checked)}
                                                                                    />
                                                                                </td>
                                                                                <td className="py-3">
                                                                                    <Button
                                                                                        variant="ghost"
                                                                                        size="sm"
                                                                                        onClick={() => eliminarImpuesto(impuesto.id)}
                                                                                        className="text-red-500 hover:text-red-700 hover:bg-red-50"
                                                                                    >
                                                                                        <TrashIcon className="h-4 w-4" />
                                                                                    </Button>
                                                                                </td>
                                                                            </motion.tr>
                                                                        ))}
                                                                    </tbody>
                                                                </table>
                                                            </div>
                                                        </CardContent>
                                                    </Card>
                                                </motion.div>
                                            </TabsContent>

                                            <TabsContent value="formas-pago">
                                                <motion.div variants={itemVariants}>
                                                    <Card>
                                                        <CardHeader className="flex flex-row items-center justify-between">
                                                            <CardTitle>Formas de Pago</CardTitle>
                                                            <Button onClick={agregarFormaPago} className="bg-purple-600 hover:bg-purple-700">
                                                                <PlusIcon className="mr-2 h-4 w-4" />
                                                                Agregar Forma de Pago
                                                            </Button>
                                                        </CardHeader>
                                                        <CardContent>
                                                            <div className="overflow-x-auto">
                                                                <table className="w-full">
                                                                    <thead>
                                                                        <tr className="text-left text-sm text-gray-500 border-b">
                                                                            <th className="pb-3 font-medium">Nombre</th>
                                                                            <th className="pb-3 font-medium">Estado</th>
                                                                            <th className="pb-3 font-medium">Acciones</th>
                                                                        </tr>
                                                                    </thead>
                                                                    <tbody>
                                                                        {formasPago.map((forma) => (
                                                                            <motion.tr
                                                                                key={forma.id}
                                                                                className="border-b"
                                                                                initial={{ opacity: 0, y: 10 }}
                                                                                animate={{ opacity: 1, y: 0 }}
                                                                                transition={{ duration: 0.3 }}
                                                                            >
                                                                                <td className="py-3">
                                                                                    <Input
                                                                                        value={forma.nombre}
                                                                                        onChange={(e) => actualizarFormaPago(forma.id, "nombre", e.target.value)}
                                                                                    />
                                                                                </td>
                                                                                <td className="py-3">
                                                                                    <Switch
                                                                                        checked={forma.activo}
                                                                                        onCheckedChange={(checked) => actualizarFormaPago(forma.id, "activo", checked)}
                                                                                    />
                                                                                </td>
                                                                                <td className="py-3">
                                                                                    <Button
                                                                                        variant="ghost"
                                                                                        size="sm"
                                                                                        onClick={() => eliminarFormaPago(forma.id)}
                                                                                        className="text-red-500 hover:text-red-700 hover:bg-red-50"
                                                                                    >
                                                                                        <TrashIcon className="h-4 w-4" />
                                                                                    </Button>
                                                                                </td>
                                                                            </motion.tr>
                                                                        ))}
                                                                    </tbody>
                                                                </table>
                                                            </div>
                                                        </CardContent>
                                                    </Card>
                                                </motion.div>
                                            </TabsContent>

                                            <TabsContent value="plantillas">
                                                <motion.div className="grid grid-cols-1 md:grid-cols-2 gap-6" variants={containerVariants}>
                                                    <motion.div variants={itemVariants}>
                                                        <Card>
                                                            <CardHeader>
                                                                <CardTitle>Términos y Condiciones</CardTitle>
                                                            </CardHeader>
                                                            <CardContent className="space-y-4">
                                                                <Textarea
                                                                    rows={6}
                                                                    value={terminosCondiciones}
                                                                    onChange={(e) => setTerminosCondiciones(e.target.value)}
                                                                />
                                                                <p className="text-sm text-gray-500">
                                                                    Estos términos aparecerán en la parte inferior de todas las facturas.
                                                                </p>
                                                            </CardContent>
                                                        </Card>
                                                    </motion.div>

                                                    <motion.div variants={itemVariants}>
                                                        <Card>
                                                            <CardHeader>
                                                                <CardTitle>Personalización de Plantillas</CardTitle>
                                                            </CardHeader>
                                                            <CardContent className="space-y-4">
                                                                <div className="space-y-2">
                                                                    <Label htmlFor="plantilla-factura">Plantilla de Factura</Label>
                                                                    <select id="plantilla-factura" className="w-full border rounded-md p-2">
                                                                        <option>Plantilla Estándar</option>
                                                                        <option>Plantilla Minimalista</option>
                                                                        <option>Plantilla Profesional</option>
                                                                    </select>
                                                                </div>

                                                                <div className="space-y-2">
                                                                    <Label htmlFor="plantilla-cotizacion">Plantilla de Cotización</Label>
                                                                    <select id="plantilla-cotizacion" className="w-full border rounded-md p-2">
                                                                        <option>Plantilla Estándar</option>
                                                                        <option>Plantilla Minimalista</option>
                                                                        <option>Plantilla Profesional</option>
                                                                    </select>
                                                                </div>

                                                                <div className="space-y-2">
                                                                    <Label htmlFor="color-primario">Color Primario</Label>
                                                                    <div className="flex gap-2">
                                                                        <Input id="color-primario" type="color" defaultValue="#000000" className="w-12 h-10 p-1" />
                                                                        <Input defaultValue="#000000" className="flex-1" />
                                                                    </div>
                                                                </div>

                                                                <div className="space-y-2">
                                                                    <Label htmlFor="color-secundario">Color Secundario</Label>
                                                                    <div className="flex gap-2">
                                                                        <Input
                                                                            id="color-secundario"
                                                                            type="color"
                                                                            defaultValue="#4299e1"
                                                                            className="w-12 h-10 p-1"
                                                                        />
                                                                        <Input defaultValue="#4299e1" className="flex-1" />
                                                                    </div>
                                                                </div>
                                                            </CardContent>
                                                        </Card>
                                                    </motion.div>
                                                </motion.div>
                                            </TabsContent>

                                        </Tabs>
                                    </motion.div>
                                </motion.main>
                            </div>

                        </div>

                    </main>
                </ModuleLayout>
            </AuthGuard>

        )
    }

    if (isMobile) {
        return (
            <AuthGuard>
                <ModuleLayout moduleType="facturacion">
                    <main className="flex-1 overflow-y-auto bg-gray-50 p-4 sm:p-6 lg:p-9">
                        <div className="flex min-h-screen">
                            <div className="flex flex-col flex-1 overflow-hidden">
                                <motion.main
                                    className="flex-1 overflow-y-auto"
                                    initial="hidden"
                                    animate="visible"
                                    variants={containerVariants}
                                >
                                    {/* HEADER */}
                                    <motion.div
                                        className="
                  mb-6
                  flex flex-col gap-4
                  sm:flex-row sm:items-center sm:justify-between
                "
                                        variants={itemVariants}
                                    >
                                        <h1 className="text-xl sm:text-2xl font-bold">
                                            Configuración de Facturación
                                        </h1>

                                        <Button
                                            className="
                    w-full sm:w-auto
                    bg-purple-600 hover:bg-purple-700 text-white
                  "
                                        >
                                            <SaveIcon className="mr-2 h-4 w-4" />
                                            Guardar cambios
                                        </Button>
                                    </motion.div>

                                    {/* TABS */}
                                    <Tabs defaultValue="general" className="w-full">
                                        <TabsList
                                            className="
                    mb-6
                    flex gap-2
                    overflow-x-auto sm:overflow-visible
                  "
                                        >
                                            <TabsTrigger value="general" className="whitespace-nowrap">
                                                General
                                            </TabsTrigger>
                                            <TabsTrigger value="impuestos" className="whitespace-nowrap">
                                                Impuestos
                                            </TabsTrigger>
                                            <TabsTrigger value="formas-pago" className="whitespace-nowrap">
                                                Formas de Pago
                                            </TabsTrigger>
                                            <TabsTrigger value="plantillas" className="whitespace-nowrap">
                                                Plantillas
                                            </TabsTrigger>
                                        </TabsList>

                                        {/* GENERAL */}
                                        <TabsContent value="general">
                                            <motion.div
                                                className="grid grid-cols-1 lg:grid-cols-2 gap-6"
                                                variants={containerVariants}
                                            >
                                                <Card>
                                                    <CardHeader>
                                                        <CardTitle>Configuración de Numeración</CardTitle>
                                                    </CardHeader>
                                                    <CardContent className="space-y-4">
                                                        <div className="space-y-1">
                                                            <Label>Prefijo de Factura</Label>
                                                            <Input
                                                                className="h-11"
                                                                value={prefijo}
                                                                onChange={(e) => setPrefijo(e.target.value)}
                                                            />
                                                        </div>

                                                        <div className="space-y-1">
                                                            <Label>Consecutivo Actual</Label>
                                                            <Input
                                                                className="h-11"
                                                                type="number"
                                                                value={consecutivo}
                                                                onChange={(e) =>
                                                                    setConsecutivo(Number(e.target.value))
                                                                }
                                                            />
                                                        </div>

                                                        <div className="flex items-center justify-between pt-2">
                                                            <Label>Reiniciar consecutivo anualmente</Label>
                                                            <Switch />
                                                        </div>
                                                    </CardContent>
                                                </Card>

                                                <Card>
                                                    <CardHeader>
                                                        <CardTitle>Configuración de Documentos</CardTitle>
                                                    </CardHeader>
                                                    <CardContent className="space-y-3">
                                                        {[
                                                            "Habilitar facturación electrónica",
                                                            "Habilitar cotizaciones",
                                                            "Habilitar notas de crédito",
                                                            "Enviar recordatorios de pago",
                                                        ].map((text) => (
                                                            <div
                                                                key={text}
                                                                className="flex items-center justify-between"
                                                            >
                                                                <Label className="pr-4">{text}</Label>
                                                                <Switch defaultChecked />
                                                            </div>
                                                        ))}

                                                        <div className="space-y-1 pt-2">
                                                            <Label>Días para vencimiento</Label>
                                                            <Input
                                                                className="h-11"
                                                                type="number"
                                                                defaultValue={30}
                                                            />
                                                        </div>
                                                    </CardContent>
                                                </Card>
                                            </motion.div>
                                        </TabsContent>

                                        {/* IMPUESTOS */}
                                        <TabsContent value="impuestos">
                                            <Card>
                                                <CardHeader
                                                    className="
                        flex flex-col gap-4
                        sm:flex-row sm:items-center sm:justify-between
                      "
                                                >
                                                    <CardTitle>Configuración de Impuestos</CardTitle>

                                                    <Button
                                                        onClick={agregarImpuesto}
                                                        className="w-full sm:w-auto bg-purple-600 hover:scale-95 text-white"
                                                    >
                                                        <PlusIcon className="mr-2 h-4 w-4" />
                                                        Agregar Impuesto
                                                    </Button>
                                                </CardHeader>

                                                <CardContent>
                                                    {/* MOBILE */}
                                                    <div className="space-y-4 sm:hidden">
                                                        {impuestos.map((impuesto) => (
                                                            <Card key={impuesto.id}>
                                                                <CardContent className="space-y-3">
                                                                    <Input
                                                                        className="h-11"
                                                                        value={impuesto.nombre}
                                                                        onChange={(e) =>
                                                                            actualizarImpuesto(
                                                                                impuesto.id,
                                                                                "nombre",
                                                                                e.target.value
                                                                            )
                                                                        }
                                                                    />

                                                                    <div className="flex items-center gap-2">
                                                                        <Input
                                                                            className="h-11"
                                                                            type="number"
                                                                            value={impuesto.porcentaje}
                                                                            onChange={(e) =>
                                                                                actualizarImpuesto(
                                                                                    impuesto.id,
                                                                                    "porcentaje",
                                                                                    Number(e.target.value)
                                                                                )
                                                                            }
                                                                        />
                                                                        <span className="text-sm">%</span>
                                                                    </div>

                                                                    <div className="flex items-center justify-between">
                                                                        <Label>Activo</Label>
                                                                        <Switch
                                                                            checked={impuesto.activo}
                                                                            onCheckedChange={(checked) =>
                                                                                actualizarImpuesto(
                                                                                    impuesto.id,
                                                                                    "activo",
                                                                                    checked
                                                                                )
                                                                            }
                                                                        />
                                                                    </div>

                                                                    <Button
                                                                        variant="destructive"
                                                                        size="sm"
                                                                        className="w-full"
                                                                        onClick={() =>
                                                                            eliminarImpuesto(impuesto.id)
                                                                        }
                                                                    >
                                                                        Eliminar
                                                                    </Button>
                                                                </CardContent>
                                                            </Card>
                                                        ))}
                                                    </div>

                                                    {/* DESKTOP (INTOCABLE) */}
                                                    <div className="hidden sm:block overflow-x-auto">
                                                        <table className="w-full">
                                                            <thead className="border-b text-sm text-gray-500">
                                                                <tr>
                                                                    <th className="text-left pb-3">Nombre</th>
                                                                    <th className="text-left pb-3">Porcentaje</th>
                                                                    <th className="text-left pb-3">Estado</th>
                                                                    <th />
                                                                </tr>
                                                            </thead>
                                                            <tbody>
                                                                {impuestos.map((impuesto) => (
                                                                    <tr
                                                                        key={impuesto.id}
                                                                        className="border-b"
                                                                    >
                                                                        <td className="py-3">
                                                                            <Input value={impuesto.nombre} />
                                                                        </td>
                                                                        <td className="py-3">
                                                                            <Input
                                                                                type="number"
                                                                                value={impuesto.porcentaje}
                                                                            />
                                                                        </td>
                                                                        <td className="py-3">
                                                                            <Switch checked={impuesto.activo} />
                                                                        </td>
                                                                        <td className="py-3">
                                                                            <Button
                                                                                variant="ghost"
                                                                                onClick={() =>
                                                                                    eliminarImpuesto(impuesto.id)
                                                                                }
                                                                            >
                                                                                <TrashIcon className="h-4 w-4" />
                                                                            </Button>
                                                                        </td>
                                                                    </tr>
                                                                ))}
                                                            </tbody>
                                                        </table>
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        </TabsContent>

                                        {/* FORMAS DE PAGO */}
                                        <TabsContent value="formas-pago">
                                            <Card>
                                                <CardHeader
                                                    className="
                        flex flex-col gap-4
                        sm:flex-row sm:items-center sm:justify-between
                      "
                                                >
                                                    <CardTitle>Formas de Pago</CardTitle>
                                                    <Button
                                                        onClick={agregarFormaPago}
                                                        className="w-full sm:w-auto bg-purple-600 hover:scale-95 text-white"
                                                    >
                                                        <PlusIcon className="mr-2 h-4 w-4" />
                                                        Agregar Forma de Pago
                                                    </Button>
                                                </CardHeader>

                                                <CardContent>
                                                    <div className="space-y-4 sm:hidden">
                                                        {formasPago.map((forma) => (
                                                            <Card key={forma.id}>
                                                                <CardContent className="space-y-3">
                                                                    <Input
                                                                        className="h-11"
                                                                        value={forma.nombre}
                                                                    />

                                                                    <div className="flex items-center justify-between">
                                                                        <Label>Activo</Label>
                                                                        <Switch checked={forma.activo} />
                                                                    </div>

                                                                    <Button
                                                                        variant="destructive"
                                                                        size="sm"
                                                                        className="w-full"
                                                                        onClick={() =>
                                                                            eliminarFormaPago(forma.id)
                                                                        }
                                                                    >
                                                                        Eliminar
                                                                    </Button>
                                                                </CardContent>
                                                            </Card>
                                                        ))}
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        </TabsContent>

                                        {/* PLANTILLAS */}
                                        <TabsContent value="plantillas">
                                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                                <Card>
                                                    <CardHeader>
                                                        <CardTitle>Términos y Condiciones</CardTitle>
                                                    </CardHeader>
                                                    <CardContent>
                                                        <Textarea
                                                            rows={6}
                                                            value={terminosCondiciones}
                                                        />
                                                    </CardContent>
                                                </Card>

                                                <Card>
                                                            <CardHeader>
                                                                <CardTitle>Personalización de Plantillas</CardTitle>
                                                            </CardHeader>
                                                            <CardContent className="space-y-4">
                                                                <div className="space-y-2">
                                                                    <Label htmlFor="plantilla-factura">Plantilla de Factura</Label>
                                                                    <select id="plantilla-factura" className="w-full border rounded-md p-2">
                                                                        <option>Plantilla Estándar</option>
                                                                        <option>Plantilla Minimalista</option>
                                                                        <option>Plantilla Profesional</option>
                                                                    </select>
                                                                </div>

                                                                <div className="space-y-2">
                                                                    <Label htmlFor="plantilla-cotizacion">Plantilla de Cotización</Label>
                                                                    <select id="plantilla-cotizacion" className="w-full border rounded-md p-2">
                                                                        <option>Plantilla Estándar</option>
                                                                        <option>Plantilla Minimalista</option>
                                                                        <option>Plantilla Profesional</option>
                                                                    </select>
                                                                </div>

                                                                <div className="space-y-2">
                                                                    <Label htmlFor="color-primario">Color Primario</Label>
                                                                    <div className="flex gap-2">
                                                                        <Input id="color-primario" type="color" defaultValue="#000000" className="w-12 h-10 p-1" />
                                                                        <Input defaultValue="#000000" className="flex-1" />
                                                                    </div>
                                                                </div>

                                                                <div className="space-y-2">
                                                                    <Label htmlFor="color-secundario">Color Secundario</Label>
                                                                    <div className="flex gap-2">
                                                                        <Input
                                                                            id="color-secundario"
                                                                            type="color"
                                                                            defaultValue="#4299e1"
                                                                            className="w-12 h-10 p-1"
                                                                        />
                                                                        <Input defaultValue="#4299e1" className="flex-1" />
                                                                    </div>
                                                                </div>
                                                            </CardContent>
                                                        </Card>
                                            </div>
                                        </TabsContent>
                                    </Tabs>
                                </motion.main>
                            </div>
                        </div>
                    </main>
                </ModuleLayout>
            </AuthGuard>
        )

    }

}

