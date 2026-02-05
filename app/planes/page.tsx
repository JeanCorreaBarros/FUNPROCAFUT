
"use client"

import { Button } from "@/components/ui/button"
import { CheckIcon } from "lucide-react"
import dynamic from "next/dynamic"
import { AuthGuard } from "@/components/auth-guard"
import { DashboardLayout } from "@/components/dashboard-layout"
import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
export default function PlanesPage() {
    const [showPaymentModal, setShowPaymentModal] = useState(false)
    const [paymentMethod, setPaymentMethod] = useState('tarjeta')
    const [selectedModule, setSelectedModule] = useState('')

    const handleWhatsApp = () => {
        const data = localStorage.getItem('bivoo-user')
        let name = ''
        let email = ''
        if (data) {
            const parsed = JSON.parse(data)
            name = parsed.name || ''
            email = parsed.email || ''
        }
        const message = encodeURIComponent(`Quiero solicitar el Plan Empresarial. Nombre: ${name}, Email: ${email}`)
        window.open(`https://wa.me/3023301079?text=${message}`, '_blank')
    }

    const handleModuleWhatsApp = () => {
        if (!selectedModule) return
        const data = localStorage.getItem('bivoo-user')
        let name = ''
        let email = ''
        if (data) {
            const parsed = JSON.parse(data)
            name = parsed.name || ''
            email = parsed.email || ''
        }
        const message = encodeURIComponent(`Quiero solicitar el módulo: ${selectedModule}. Nombre: ${name}, Email: ${email}`)
        window.open(`https://wa.me/3023301079?text=${message}`, '_blank')
    }
    return (
        <>
            <AuthGuard>
                <DashboardLayout>

                    <main className="flex-1 overflow-y-auto p-9 ">
                        <div className="max-w-6xl mx-auto">
                            <h1 className="text-2xl font-bold mb-2">Planes y Suscripciones</h1>
                            <p className="text-gray-500 mb-8">Elige el plan que mejor se adapte a las necesidades de tu negocio</p>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {/* Plan Básico */}
                                <div className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100">
                                    <div className="p-6">
                                        <h3 className="text-lg font-medium mb-2">Plan Básico</h3>
                                        <div className="mb-4">
                                            <span className="text-3xl font-bold">$79,000</span>
                                            <span className="text-gray-500">/mes</span>
                                        </div>
                                        <p className="text-gray-500 mb-6">Ideal para negocios pequeños que están comenzando</p>
                                        <Button className="w-full" variant="outline">
                                            Plan Actual
                                        </Button>
                                    </div>
                                    <div className="border-t px-6 py-4">
                                        <ul className="space-y-3">
                                            <li className="flex items-start">
                                                <CheckIcon className="h-5 w-5 text-green-500 mr-2 shrink-0" />
                                                <span>Hasta 100 clientes</span>
                                            </li>
                                            <li className="flex items-start">
                                                <CheckIcon className="h-5 w-5 text-green-500 mr-2 shrink-0" />
                                                <span>Agenda y citas</span>
                                            </li>
                                            <li className="flex items-start">
                                                <CheckIcon className="h-5 w-5 text-green-500 mr-2 shrink-0" />
                                                <span>Facturación básica</span>
                                            </li>
                                            <li className="flex items-start">
                                                <CheckIcon className="h-5 w-5 text-green-500 mr-2 shrink-0" />
                                                <span>1 usuario</span>
                                            </li>
                                            <li className="flex items-start">
                                                <CheckIcon className="h-5 w-5 text-green-500 mr-2 shrink-0" />
                                                <span>Soporte por email</span>
                                            </li>
                                        </ul>
                                    </div>
                                </div>

                                {/* Plan Premium */}
                                <div className="bg-white rounded-xl overflow-hidden shadow-sm border-2 border-black relative">
                                    <div className="absolute top-0 right-0 bg-black text-white px-3 py-1 text-xs font-medium rounded-bl-lg">
                                        RECOMENDADO
                                    </div>
                                    <div className="p-6">
                                        <h3 className="text-lg font-medium mb-2">Plan Premium</h3>
                                        <div className="mb-4">
                                            <span className="text-3xl font-bold">$149,000</span>
                                            <span className="text-gray-500">/mes</span>
                                        </div>
                                        <p className="text-gray-500 mb-6">Perfecto para salones en crecimiento</p>
                                        <Button className="w-full" onClick={() => setShowPaymentModal(true)}>Actualizar Plan</Button>
                                    </div>
                                    <div className="border-t px-6 py-4">
                                        <ul className="space-y-3">
                                            <li className="flex items-start">
                                                <CheckIcon className="h-5 w-5 text-green-500 mr-2 shrink-0" />
                                                <span>Clientes ilimitados</span>
                                            </li>
                                            <li className="flex items-start">
                                                <CheckIcon className="h-5 w-5 text-green-500 mr-2 shrink-0" />
                                                <span>Agenda y citas avanzadas</span>
                                            </li>
                                            <li className="flex items-start">
                                                <CheckIcon className="h-5 w-5 text-green-500 mr-2 shrink-0" />
                                                <span>Facturación completa</span>
                                            </li>
                                            <li className="flex items-start">
                                                <CheckIcon className="h-5 w-5 text-green-500 mr-2 shrink-0" />
                                                <span>Inventario y proveedores</span>
                                            </li>
                                            <li className="flex items-start">
                                                <CheckIcon className="h-5 w-5 text-green-500 mr-2 shrink-0" />
                                                <span>Reportes básicos</span>
                                            </li>
                                            <li className="flex items-start">
                                                <CheckIcon className="h-5 w-5 text-green-500 mr-2 shrink-0" />
                                                <span>Hasta 5 usuarios</span>
                                            </li>
                                            <li className="flex items-start">
                                                <CheckIcon className="h-5 w-5 text-green-500 mr-2 shrink-0" />
                                                <span>Soporte prioritario</span>
                                            </li>
                                        </ul>
                                    </div>
                                </div>

                                {/* Plan Empresarial */}
                                <div className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100">
                                    <div className="p-6">
                                        <h3 className="text-lg font-medium mb-2">Plan Empresarial</h3>
                                        <div className="mb-4">
                                            <span className="text-3xl font-bold">$299,000</span>
                                            <span className="text-gray-500">/mes</span>
                                        </div>
                                        <p className="text-gray-500 mb-6">Para cadenas de salones y spas</p>
                                        <Button className="w-full" variant="outline" onClick={handleWhatsApp}>
                                            Contactar Ventas
                                        </Button>
                                    </div>
                                    <div className="border-t px-6 py-4">
                                        <ul className="space-y-3">
                                            <li className="flex items-start">
                                                <CheckIcon className="h-5 w-5 text-green-500 mr-2 shrink-0" />
                                                <span>Todo lo del plan Premium</span>
                                            </li>
                                            <li className="flex items-start">
                                                <CheckIcon className="h-5 w-5 text-green-500 mr-2 shrink-0" />
                                                <span>Múltiples sucursales</span>
                                            </li>
                                            <li className="flex items-start">
                                                <CheckIcon className="h-5 w-5 text-green-500 mr-2 shrink-0" />
                                                <span>Reportes avanzados</span>
                                            </li>
                                            <li className="flex items-start">
                                                <CheckIcon className="h-5 w-5 text-green-500 mr-2 shrink-0" />
                                                <span>Contabilidad integrada</span>
                                            </li>
                                            <li className="flex items-start">
                                                <CheckIcon className="h-5 w-5 text-green-500 mr-2 shrink-0" />
                                                <span>Nómina y recursos humanos</span>
                                            </li>
                                            <li className="flex items-start">
                                                <CheckIcon className="h-5 w-5 text-green-500 mr-2 shrink-0" />
                                                <span>Usuarios ilimitados</span>
                                            </li>
                                            <li className="flex items-start">
                                                <CheckIcon className="h-5 w-5 text-green-500 mr-2 shrink-0" />
                                                <span>Soporte 24/7 y gerente de cuenta</span>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>



                            <div className="mt-12 bg-white rounded-xl p-6 shadow-sm">
                                <h2 className="text-lg font-medium mb-4">Solicitar Módulo Específico</h2>
                                <p className="text-gray-600 mb-4">
                                    ¿Necesitas un módulo en particular? Selecciona el módulo que te interesa y te contactaremos.
                                </p>
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Selecciona un módulo</label>
                                        <select value={selectedModule} onChange={(e) => setSelectedModule(e.target.value)} className="w-full p-2 border rounded">
                                            <option value="">Selecciona un módulo</option>
                                            <option value="Agenda">Agenda</option>
                                            <option value="Facturación">Facturación</option>
                                            <option value="Inventarios">Inventarios</option>
                                            <option value="Contabilidad">Contabilidad</option>
                                            <option value="Nómina">Nómina</option>
                                            <option value="Marketing">Marketing</option>
                                            <option value="Reportes">Reportes</option>
                                            <option value="Seguridad">Seguridad</option>
                                        </select>
                                    </div>
                                    <Button className="w-full" onClick={handleModuleWhatsApp} disabled={!selectedModule}>
                                        Contactar por WhatsApp
                                    </Button>
                                </div>
                            </div>

                            <div className="mt-12 bg-white rounded-xl p-6 shadow-sm">
                                <h2 className="text-lg font-medium mb-4">Preguntas Frecuentes</h2>

                                <Accordion type="single" collapsible className="space-y-4">
                                    <AccordionItem value="faq-1">
                                        <AccordionTrigger>¿Puedo cambiar de plan en cualquier momento?</AccordionTrigger>
                                        <AccordionContent>
                                            Sí, puedes actualizar o cambiar tu plan en cualquier momento. Los cambios se aplicarán
                                            inmediatamente y se ajustará el cobro de forma proporcional.
                                        </AccordionContent>
                                    </AccordionItem>
                                    <AccordionItem value="faq-2">
                                        <AccordionTrigger>¿Hay algún contrato de permanencia?</AccordionTrigger>
                                        <AccordionContent>
                                            No, todos nuestros planes son mensuales y puedes cancelar cuando quieras sin penalización.
                                        </AccordionContent>
                                    </AccordionItem>
                                    <AccordionItem value="faq-3">
                                        <AccordionTrigger>¿Qué métodos de pago aceptan?</AccordionTrigger>
                                        <AccordionContent>
                                            Aceptamos tarjetas de crédito y débito (Visa, Mastercard, American Express), transferencias
                                            bancarias y PSE.
                                        </AccordionContent>
                                    </AccordionItem>
                                    <AccordionItem value="faq-4">
                                        <AccordionTrigger>¿Ofrecen descuentos por pago anual?</AccordionTrigger>
                                        <AccordionContent>
                                            Sí, al pagar anualmente obtienes un 15% de descuento sobre el precio mensual.
                                        </AccordionContent>
                                    </AccordionItem>
                                </Accordion>

                                {/*<div className="mt-6 flex justify-center">
                                    <Button variant="outline">Ver todas las preguntas frecuentes</Button>
                                </div>*/}
                            </div>

                        </div>
                    </main>

                </DashboardLayout>
            </AuthGuard>

            <Dialog open={showPaymentModal} onOpenChange={setShowPaymentModal}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Actualizar a Plan Premium</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                        <div className="text-center">
                            <p className="text-lg font-medium">Plan Premium</p>
                            <p className="text-2xl font-bold">$149,000/mes</p>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Método de pago</label>
                            <select value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)} className="w-full p-2 border rounded">
                                <option value="tarjeta">Tarjeta de crédito/débito</option>
                                <option value="nequi">Nequi</option>
                                <option value="daviplata">Daviplata</option>
                            </select>
                        </div>
                        {paymentMethod === 'tarjeta' && (
                            <>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Número de tarjeta</label>
                                    <input type="text" placeholder="1234 5678 9012 3456" className="w-full p-2 border rounded" />
                                </div>
                                <div className="grid grid-cols-2 gap-2">
                                    <div>
                                        <label className="text-sm font-medium">Fecha de expiración</label>
                                        <input type="text" placeholder="MM/AA" className="w-full p-2 border rounded" />
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium">CVV</label>
                                        <input type="text" placeholder="123" className="w-full p-2 border rounded" />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Nombre en la tarjeta</label>
                                    <input type="text" placeholder="Juan Pérez" className="w-full p-2 border rounded" />
                                </div>
                            </>
                        )}
                        {(paymentMethod === 'nequi' || paymentMethod === 'daviplata') && (
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Número de teléfono</label>
                                <input type="text" placeholder="300 123 4567" className="w-full p-2 border rounded" />
                            </div>
                        )}
                        <Button className="w-full" onClick={() => setShowPaymentModal(false)}>Pagar Ahora</Button>
                    </div>
                </DialogContent>
            </Dialog>

        </>
    )
}

