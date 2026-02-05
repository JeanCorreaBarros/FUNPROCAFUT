"use client"

import { motion } from "framer-motion"
import { AuthGuard } from "@/components/auth-guard"
import { ModuleLayout } from "@/components/module-layout"
import {
    DownloadIcon,
    CalendarIcon,
    FilterIcon,
    RefreshCwIcon,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BarChart, LineChart, PieChart } from "@/components/ui/chart"

/* ---------------- DATA ---------------- */

const ventasMensualesData = [
    { name: "Ene", total: 1800000 },
    { name: "Feb", total: 2200000 },
    { name: "Mar", total: 1900000 },
    { name: "Abr", total: 2100000 },
    { name: "May", total: 2450000 },
    { name: "Jun", total: 2300000 },
]

const comparativoAnualData = [
    { name: "Ene", "2023": 1800000, "2022": 1500000 },
    { name: "Feb", "2023": 2200000, "2022": 1800000 },
    { name: "Mar", "2023": 1900000, "2022": 1600000 },
    { name: "Abr", "2023": 2100000, "2022": 1700000 },
    { name: "May", "2023": 2450000, "2022": 2000000 },
    { name: "Jun", "2023": 2300000, "2022": 1900000 },
]

const ventasPorServicioData = [
    { name: "Corte", value: 40 },
    { name: "Barba", value: 25 },
    { name: "Color", value: 15 },
    { name: "Productos", value: 12 },
    { name: "Otros", value: 8 },
]

const purpleChartColors = [
  "#7c3aed", // purple-600 (base)
  "#8b5cf6", // purple-500
  "#a78bfa", // purple-400
  "#c4b5fd", // purple-300
  "#ddd6fe", // purple-200
]


/* ---------------- PAGE ---------------- */

export default function ReportesPage() {
    return (
        <AuthGuard>
            <ModuleLayout moduleType="facturacion">
                <main className="min-h-screen bg-gray-50 p-4 md:p-9">

                    {/* HEADER */}
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
                        <h1 className="text-xl md:text-2xl font-bold">
                            Reportes de Facturación
                        </h1>

                        {/* ACTIONS */}
                        <div className="flex gap-2 overflow-x-auto md:overflow-visible">
                            <Button size="sm" variant="outline" className="flex gap-2">
                                <CalendarIcon className="w-4 h-4" />
                                <span className="hidden sm:inline">Último mes</span>
                            </Button>
                            <Button size="sm" variant="outline">
                                <FilterIcon className="w-4 h-4" />
                            </Button>
                            <Button size="sm" variant="outline">
                                <RefreshCwIcon className="w-4 h-4" />
                            </Button>
                            <Button size="sm" variant="outline">
                                <DownloadIcon className="w-4 h-4" />
                            </Button>
                        </div>
                    </div>

                    {/* KPIs */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                        {[
                            ["Ventas", "$12,850,000", "+15.3%"],
                            ["Facturas", "124", "+8.7%"],
                            ["Promedio", "$103,629", "+6.1%"],
                            ["Cobro", "92.5%", "+2.3%"],
                        ].map(([title, value, delta]) => (
                            <Card key={title}>
                                <CardContent className="p-4">
                                    <p className="text-xs text-gray-500">{title}</p>
                                    <p className="text-lg md:text-xl font-bold">{value}</p>
                                    <p className="text-xs text-green-600">{delta}</p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>

                    {/* CHARTS */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-base">Ventas Mensuales</CardTitle>
                            </CardHeader>
                            <CardContent className="h-[260px] md:h-[350px]">
                                <BarChart
                                    data={ventasMensualesData}
                                    index="name"
                                    categories={["total"]}
                                    colors={["#7c3aed"]}
                                    valueFormatter={(v) => `$${(v / 1000).toFixed(0)}k`}
                                />
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle className="text-base">Comparativo Anual</CardTitle>
                            </CardHeader>
                            <CardContent className="h-[260px] md:h-[350px]">
                                <LineChart
                                    data={comparativoAnualData}
                                    index="name"
                                    categories={["2023", "2022"]}
                                    colors={["#7c3aed", "#a78bfa"]}
                                    valueFormatter={(v) => `$${(v / 1000).toFixed(0)}k`}
                                />
                            </CardContent>
                        </Card>
                    </div>

                    {/* ANALYSIS */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <Card className="lg:col-span-2">
                            <CardHeader>
                                <CardTitle>Análisis de Ventas</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <Tabs defaultValue="mensual">
                                    <TabsList className="w-full grid grid-cols-3 mb-4">
                                        <TabsTrigger value="mensual">Mensual</TabsTrigger>
                                        <TabsTrigger value="trimestral">Trim.</TabsTrigger>
                                        <TabsTrigger value="anual">Anual</TabsTrigger>
                                    </TabsList>

                                    <TabsContent value="mensual" className="h-[240px]">
                                        <BarChart
                                            data={ventasMensualesData}
                                            index="name"
                                            categories={["total"]}
                                            colors={["#7c3aed"]}
                                            valueFormatter={(v) => `$${(v / 1000).toFixed(0)}k`}
                                        />
                                    </TabsContent>

                                    <TabsContent value="trimestral" className="h-[240px]">
                                        <BarChart
                                            data={[
                                                { name: "Q1", total: 5900000 },
                                                { name: "Q2", total: 6850000 },
                                                { name: "Q3", total: 0 },
                                                { name: "Q4", total: 0 },
                                            ]}
                                            index="name"
                                            categories={["total"]}
                                            colors={["#7c3aed"]}
                                        />
                                    </TabsContent>

                                    <TabsContent value="anual" className="h-[240px]">
                                        <BarChart
                                            data={[
                                                { name: "2021", total: 9500000 },
                                                { name: "2022", total: 10500000 },
                                                { name: "2023", total: 12850000 },
                                            ]}
                                            index="name"
                                            categories={["total"]}
                                            colors={["#7c3aed"]}
                                        />
                                    </TabsContent>
                                </Tabs>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Ventas por Servicio</CardTitle>
                            </CardHeader>
                            <CardContent className="h-[260px] md:h-[320px]">
                                <PieChart
                                    data={ventasPorServicioData}
                                    index="name"
                                    categories={["value"]}
                                   colors={purpleChartColors}
                                    valueFormatter={(v) => `${v}%`}
                                />
                            </CardContent>

                        </Card>
                    </div>

                </main>
            </ModuleLayout>
        </AuthGuard>
    )
}
