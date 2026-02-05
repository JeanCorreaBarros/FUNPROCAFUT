"use client";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Wallet, ShoppingCart, Users, Plus, Scissors } from "lucide-react";
import { Ban, RefreshCw, Menu } from "lucide-react";
import dynamic from "next/dynamic"
import { AuthGuard } from "@/components/auth-guard"
import { ModuleLayout } from "@/components/module-layout"

export default function CajaDiariaPage() {
    const [abierta, setAbierta] = useState(false);
    const [responsable, setResponsable] = useState("");
    const [montoBase, setMontoBase] = useState("");
    const [modal, setModal] = useState<{ type: string } | null>(null);
    const [showOpciones, setShowOpciones] = useState(false);
    const [tabRight, setTabRight] = useState('Gastos');
    const [selectedColaborador, setSelectedColaborador] = useState<null | { nombre: string, servicios: number, productos: number, total: number }>(null);

    // Simulación de datos de caja abierta
    const caja = {
        responsable: "BARBERSHOP CLUBMEN",
        fecha: "31-07-2025",
        efectivo: 15000,
        datafono: 0,
        ventas: 15000,
        servicios: 15000,
        productos: 0,
        cantidadServicios: 1,
        cantidadProductos: 0,
        dineroBase: 0,
        otrosIngresos: 0,
        totalEfectivo: 15000,
        gastos: 0,
        retirado: 0,
        colaboradores: 0,
        totalCaja: 15000,
    };

    return (

        <AuthGuard>
            <ModuleLayout moduleType="agenda">
                <main className="flex-1 overflow-y-auto p-4 sm:p-9 ">

                    <div className="flex flex-col md:flex-row h-auto md:h-screen bg-[#fcfcfc]">
                        <div className="flex flex-col flex-1 overflow-hidden">
                            <div className="flex-1 overflow-y-auto p-4 sm:p-0">
                                {!abierta ? (
                                    <div className="max-w-md mx-auto bg-white rounded-xl shadow p-4 sm:p-8 mt-12 sm:mt-24">
                                        <h1 className="text-2xl font-bold mb-6 text-center">Abrir caja diaria</h1>
                                        <div className="mb-4">
                                            <label className="block text-gray-700 mb-2">Usuario responsable <span className="text-red-500">*</span></label>
                                            <input
                                                className="w-full border rounded px-4 py-2 text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-blue-200"
                                                placeholder="Nombre del responsable"
                                                value={responsable}
                                                onChange={e => setResponsable(e.target.value)}
                                                required
                                            />
                                        </div>
                                        <div className="mb-6">
                                            <label className="block text-gray-700 mb-2">Monto base (opcional)</label>
                                            <input
                                                className="w-full border rounded px-4 py-2 text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-blue-200"
                                                placeholder="Monto base inicial"
                                                value={montoBase}
                                                onChange={e => setMontoBase(e.target.value)}
                                                type="number"
                                                min="0"
                                            />
                                        </div>
                                        <button
                                            className="w-full bg-green-600 hover:bg-green-700 text-white rounded-lg py-2 font-semibold shadow"
                                            disabled={!responsable}
                                            onClick={() => setAbierta(true)}
                                        >
                                            Abrir caja
                                        </button>
                                    </div>
                                ) : (
                                    <div className="flex flex-col md:flex-row gap-4 md:gap-8">
                                        {/* Panel principal cuadre de caja */}
                                        <div className="flex-1 min-w-0">
                                            <h1 className="text-3xl font-bold mb-6">Cuadre de caja del día</h1>
                                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-4 sm:mb-8 relative">
                                                {/* ...botones y acciones... */}
                                                <div className="bg-white rounded-xl shadow p-6 flex flex-col items-center justify-center cursor-pointer" onClick={() => setModal({ type: "cerrar-caja" })}>
                                                    <div className="text-green-600 text-2xl font-bold mb-2">${caja.efectivo.toLocaleString()}</div>
                                                    <span className="text-gray-700 text-sm">Cerrar cuadre de caja actual</span>
                                                </div>
                                                <div className="bg-white rounded-xl shadow p-6 flex flex-col items-center justify-center cursor-pointer" onClick={() => setModal({ type: "nuevo-gasto" })}>
                                                    <Ban className="mb-2" size={28} />
                                                    <span className="text-gray-700 text-sm">Registrar nuevo gasto en la caja</span>
                                                </div>
                                                <div className="bg-white rounded-xl shadow p-6 flex flex-col items-center justify-center cursor-pointer" onClick={() => setModal({ type: "nuevo-ingreso" })}>
                                                    <Plus className="mb-2" size={28} />
                                                    <span className="text-gray-700 text-sm">Registrar ingreso de dinero a caja</span>
                                                </div>
                                                <div className="bg-white rounded-xl shadow p-6 flex flex-col items-center justify-center cursor-pointer" onClick={() => setModal({ type: "cambiar-responsable" })}>
                                                    <RefreshCw className="mb-2" size={28} />
                                                    <span className="text-gray-700 text-sm">Cambiar responsable de caja</span>
                                                </div>
                                                <div className="bg-white rounded-xl shadow p-6 flex flex-col items-center justify-center cursor-pointer" onClick={() => setModal({ type: "retiro-dinero" })}>
                                                    <Scissors className="mb-2" size={28} />
                                                    <span className="text-gray-700 text-sm">Retiro de dinero</span>
                                                </div>
                                                <div className="bg-white rounded-xl shadow p-6 flex flex-col items-center justify-center relative cursor-pointer" onClick={() => setShowOpciones(v => !v)}>
                                                    <Menu className="mb-2" size={28} />
                                                    <span className="text-gray-700 text-sm">Opciones</span>
                                                    {showOpciones && (
                                                        <div className="absolute left-0 top-full mt-2 bg-white rounded-xl shadow-lg border w-64 z-10">
                                                            <button className="block w-full text-left px-4 py-3 hover:bg-gray-100 text-gray-700" onClick={(e) => { e.stopPropagation(); setShowOpciones(false); setModal({ type: "pagar-profesionales-hoy" }); }}>Pagar a profesionales hoy</button>
                                                            <button className="block w-full text-left px-4 py-3 hover:bg-gray-100 text-gray-700" onClick={(e) => { e.stopPropagation(); setShowOpciones(false); setModal({ type: "registrar-multa" }); }}>Registrar una multa o garantía</button>
                                                            <button className="block w-full text-left px-4 py-3 hover:bg-gray-100 text-gray-700" onClick={(e) => { e.stopPropagation(); setShowOpciones(false); setModal({ type: "pagar-profesionales-rango" }); }}>Pagar a profesionales por rango de fechas</button>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="bg-white rounded-xl shadow p-4 sm:p-8">
                                                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-2 gap-1">
                                                    <span className="font-bold">Resumen:</span>
                                                    <span className="font-bold">{caja.responsable}</span>
                                                </div>
                                                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-2 gap-1">
                                                    <span>Fecha de apertura:</span>
                                                    <span>{caja.fecha}</span>
                                                </div>
                                                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-2 gap-1">
                                                    <span className="font-bold">Efectivo:</span>
                                                    <span className="font-bold text-green-600">${caja.efectivo.toLocaleString()}</span>
                                                </div>
                                                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-2 gap-1">
                                                    <span>Dinero en datáfono:</span>
                                                    <span>${caja.datafono.toLocaleString()}</span>
                                                </div>
                                                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-2 gap-1">
                                                    <span>Dinero en efectivo:</span>
                                                    <span>${caja.efectivo.toLocaleString()}</span>
                                                </div>
                                                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-2 gap-1">
                                                    <span>Total en ventas:</span>
                                                    <span>${caja.ventas.toLocaleString()}</span>
                                                </div>
                                                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-2 gap-1">
                                                    <span>Facturado en servicios:</span>
                                                    <span>${caja.servicios.toLocaleString()}</span>
                                                </div>
                                                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-2 gap-1">
                                                    <span>Facturado en productos:</span>
                                                    <span>${caja.productos.toLocaleString()}</span>
                                                </div>
                                                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-2 gap-1">
                                                    <span>Cantidad en servicios:</span>
                                                    <span>{caja.cantidadServicios}</span>
                                                </div>
                                                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-2 gap-1">
                                                    <span>Cantidad en productos:</span>
                                                    <span>{caja.cantidadProductos}</span>
                                                </div>
                                                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-2 gap-1">
                                                    <span>Dinero base:</span>
                                                    <span>${caja.dineroBase.toLocaleString()}</span>
                                                </div>
                                                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-2 gap-1">
                                                    <span>Otro tipo de dinero ingresado <span className="text-gray-400">▼</span> :</span>
                                                    <span>${caja.otrosIngresos.toLocaleString()}</span>
                                                </div>
                                                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-2 gap-1">
                                                    <span>Total de dinero en efectivo:</span>
                                                    <span>${caja.totalEfectivo.toLocaleString()}</span>
                                                </div>
                                                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-2 gap-1">
                                                    <span>Dinero en gastos:</span>
                                                    <span>(-)$${caja.gastos.toLocaleString()}</span>
                                                </div>
                                                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-2 gap-1">
                                                    <span>Dinero retirado:</span>
                                                    <span>(-)$${caja.retirado.toLocaleString()}</span>
                                                </div>
                                                <div className="flex justify-between items-center mb-2">
                                                    <span>Pago de colaboradores:</span>
                                                    <span>(-)$${caja.colaboradores.toLocaleString()}</span>
                                                </div>
                                                <hr className="my-4" />
                                                <div className="flex flex-col sm:flex-row justify-end items-start sm:items-center">
                                                    <span className="font-bold text-lg">Total en caja: <span className="bg-green-600 text-white px-3 py-1 rounded">${caja.totalCaja.toLocaleString()}</span></span>
                                                </div>
                                            </div>
                                        </div>
                                        {/* Panel derecho estilo sidebar vertical */}
                                        <div className="flex flex-row md:flex-col items-center md:items-end justify-center min-h-[320px] mt-4 md:mt-0">
                                            <div className="flex flex-row md:flex-col gap-2 items-center md:items-end">
                                                {[
                                                    { tab: 'Gastos', icon: <Wallet size={28} /> },
                                                    { tab: 'Ventas', icon: <ShoppingCart size={28} /> },
                                                    { tab: 'Comisiones del día', icon: <Users size={28} /> },
                                                    { tab: 'Ingreso de dinero a caja', icon: <Plus size={28} /> },
                                                    { tab: 'Retiro de dinero', icon: <Scissors size={28} /> },
                                                ].map(({ tab, icon }) => (
                                                    <button
                                                        key={tab}
                                                        className={`w-12 h-12 flex items-center justify-center rounded-lg font-bold text-lg border transition-colors mb-2 ${tabRight === tab ? 'bg-blue-600 text-white border-blue-600 shadow-lg' : 'bg-gray-100 text-gray-700 border-gray-300 hover:bg-blue-100'}`}
                                                        onClick={() => setTabRight(tab)}
                                                        aria-label={tab}
                                                    >
                                                        {icon}
                                                    </button>
                                                ))}
                                            </div>
                                            {/* Modal animado al seleccionar tab */}
                                            <AnimatePresence>
                                                {tabRight && (
                                                    <motion.div
                                                        key={tabRight}
                                                        initial={{ x: 420, opacity: 0 }}
                                                        animate={{ x: 0, opacity: 1 }}
                                                        exit={{ x: 420, opacity: 0 }}
                                                        transition={{ duration: 0.4, ease: 'easeOut' }}
                                                        className="fixed top-0 right-0 w-full sm:w-[600px] h-full bg-white rounded-l-xl shadow-xl z-50 flex flex-col p-4 sm:p-12"
                                                    >
                                                        <button className="self-end mb-4 text-gray-400 hover:text-gray-700 text-2xl" onClick={() => setTabRight("")}>×</button>
                                                        {tabRight === 'Gastos' && (
                                                            <>
                                                                <h2 className="font-bold text-lg mb-4">Gastos</h2>
                                                                <div className="text-gray-500">Aquí se mostrarán los gastos registrados en la caja.</div>
                                                            </>
                                                        )}
                                                        {tabRight === 'Ventas' && (
                                                            <>
                                                                <h2 className="font-bold text-lg mb-4">Ventas</h2>
                                                                <div className="text-gray-500">Aquí se mostrarán las ventas del día.</div>
                                                            </>
                                                        )}
                                                        {tabRight === 'Comisiones del día' && (
                                                            <>
                                                                <h2 className="font-bold text-lg mb-4">Comisiones del día</h2>
                                                                {!selectedColaborador ? (
                                                                    <div className="w-full max-w-2xl mx-auto overflow-x-auto">
                                                                        <table className="w-full min-w-[400px] mb-6 text-sm">
                                                                            <thead>
                                                                                <tr className="bg-gray-100">
                                                                                    <th className="py-2 px-4 text-left">Colaborador</th>
                                                                                    <th className="py-2 px-4 text-left">Servicios</th>
                                                                                    <th className="py-2 px-4 text-left">Productos</th>
                                                                                    <th className="py-2 px-4 text-left">Total</th>
                                                                                    <th className="py-2 px-4"></th>
                                                                                </tr>
                                                                            </thead>
                                                                            <tbody>
                                                                                {/* Simulación de colaboradores */}
                                                                                {[{ nombre: 'Barbershop ClubMen', servicios: 1, productos: 0, total: 15000 }].map(colab => (
                                                                                    <tr key={colab.nombre} className="border-b">
                                                                                        <td className="py-2 px-4">{colab.nombre}</td>
                                                                                        <td className="py-2 px-4">{colab.servicios}</td>
                                                                                        <td className="py-2 px-4">{colab.productos}</td>
                                                                                        <td className="py-2 px-4 font-bold text-green-600">${colab.total.toLocaleString()}</td>
                                                                                        <td className="py-2 px-4">
                                                                                            <button className="bg-blue-600 text-white px-3 py-1 rounded text-xs" onClick={() => setSelectedColaborador(colab)}>Ver detalle</button>
                                                                                        </td>
                                                                                    </tr>
                                                                                ))}
                                                                            </tbody>
                                                                        </table>
                                                                    </div>
                                                                ) : (
                                                                    <motion.div
                                                                        key="detalle-comision"
                                                                        initial={{ x: 420, opacity: 0 }}
                                                                        animate={{ x: 0, opacity: 1 }}
                                                                        exit={{ x: 420, opacity: 0 }}
                                                                        transition={{ duration: 0.4, ease: 'easeOut' }}
                                                                        className="w-full"
                                                                    >
                                                                        <div className="bg-white rounded-xl shadow p-4 sm:p-12 max-w-2xl mx-auto">
                                                                            <div className="font-bold text-xl text-center mb-4">{selectedColaborador.nombre}</div>
                                                                            <div className="mb-2 font-semibold">Ver detalles: <span className="text-gray-400">▼</span></div>
                                                                            <div className="divide-y divide-gray-200">
                                                                                <div className="py-2 flex justify-between"><span>Cant. en servicios:</span><span>{selectedColaborador.servicios}</span></div>
                                                                                <div className="py-2 flex justify-between"><span>Cant. en productos:</span><span>{selectedColaborador.productos}</span></div>
                                                                                <div className="py-2 flex justify-between"><span>T. facturado:</span><span>${selectedColaborador.total.toLocaleString()}</span></div>
                                                                            </div>
                                                                            <div className="divide-y divide-gray-200 mt-2">
                                                                                <div className="py-2 flex justify-between"><span>T. en servicios:</span><span>${selectedColaborador.total.toLocaleString()}</span></div>
                                                                                <div className="py-2 flex justify-between"><span>T. en productos:</span><span>$0</span></div>
                                                                                <div className="py-2 flex justify-between"><span>Total en garantías:</span><span>$0</span></div>
                                                                            </div>
                                                                            <div className="divide-y divide-gray-200 mt-2">
                                                                                <div className="py-2 flex justify-between"><span>D. de préstamos:</span><span>(-)$0</span></div>
                                                                                <div className="py-2 flex justify-between"><span>D. de multas:</span><span>(-)$0</span></div>
                                                                                <div className="py-2 flex justify-between"><span>D. sobre garantías:</span><span>(-)$0</span></div>
                                                                            </div>
                                                                            <div className="divide-y divide-gray-200 mt-2">
                                                                                <div className="py-2 flex justify-between"><span>Total en propina:</span><span>$0</span></div>
                                                                                <div className="py-2 flex justify-between"><span>Total de ganancias:</span><span className="text-green-600">${selectedColaborador.total.toLocaleString()}</span></div>
                                                                                <div className="py-2 flex justify-between"><span>Total de deudas:</span><span>(-)$0</span></div>
                                                                            </div>
                                                                            <div className="py-2 flex justify-between font-bold text-lg mt-2"><span>Total a pagar:</span><span>${selectedColaborador.total.toLocaleString()}</span></div>
                                                                            <button className="w-full bg-blue-600 text-white rounded-lg py-2 font-semibold mt-6 shadow" onClick={() => alert('Pago realizado')}>Pagar al colaborador</button>
                                                                            <button className="w-full mt-2 text-gray-500 underline" onClick={() => setSelectedColaborador(null)}>Volver a la lista</button>
                                                                        </div>
                                                                    </motion.div>
                                                                )}
                                                            </>
                                                        )}
                                                        {tabRight === 'Ingreso de dinero a caja' && (
                                                            <>
                                                                <h2 className="font-bold text-lg mb-4">Ingreso de dinero a caja</h2>
                                                                <div className="text-gray-500">Aquí se mostrarán los ingresos de dinero registrados.</div>
                                                            </>
                                                        )}
                                                        {tabRight === 'Retiro de dinero' && (
                                                            <>
                                                                <h2 className="font-bold text-lg mb-4">Retiro de dinero</h2>
                                                                <div className="text-gray-500">Aquí se mostrarán los retiros de dinero realizados.</div>
                                                            </>
                                                        )}
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
                                        </div>
                                    </div>
                                )}
                                {/* Modales de acciones */}
                                {modal?.type === "nuevo-gasto" && (
                                    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50" onClick={() => setModal(null)}>
                                        <div className="bg-white rounded-xl p-4 sm:p-8 shadow-xl max-w-sm w-full" onClick={e => e.stopPropagation()}>
                                            <div className="font-bold text-lg mb-4">Registrar nuevo gasto</div>
                                            <input className="w-full border rounded px-4 py-2 mb-4" placeholder="Concepto" />
                                            <input className="w-full border rounded px-4 py-2 mb-4" placeholder="Monto" type="number" min="0" />
                                            <div className="flex gap-4">
                                                <button className="w-1/2 bg-gray-200 text-gray-700 rounded-lg py-2 font-semibold" onClick={() => setModal(null)}>Cancelar</button>
                                                <button className="w-1/2 bg-green-600 text-white rounded-lg py-2 font-semibold" onClick={() => setModal(null)}>Registrar</button>
                                            </div>
                                        </div>
                                    </div>
                                )}
                                {modal?.type === "nuevo-ingreso" && (
                                    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50" onClick={() => setModal(null)}>
                                        <div className="bg-white rounded-xl p-8 shadow-xl max-w-sm w-full" onClick={e => e.stopPropagation()}>
                                            <div className="font-bold text-lg mb-4">Registrar ingreso de dinero</div>
                                            <input className="w-full border rounded px-4 py-2 mb-4" placeholder="Concepto" />
                                            <input className="w-full border rounded px-4 py-2 mb-4" placeholder="Monto" type="number" min="0" />
                                            <div className="flex gap-4">
                                                <button className="w-1/2 bg-gray-200 text-gray-700 rounded-lg py-2 font-semibold" onClick={() => setModal(null)}>Cancelar</button>
                                                <button className="w-1/2 bg-blue-600 text-white rounded-lg py-2 font-semibold" onClick={() => setModal(null)}>Registrar</button>
                                            </div>
                                        </div>
                                    </div>
                                )}
                                {modal?.type === "cambiar-responsable" && (
                                    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50" onClick={() => setModal(null)}>
                                        <div className="bg-white rounded-xl p-8 shadow-xl max-w-sm w-full" onClick={e => e.stopPropagation()}>
                                            <div className="font-bold text-lg mb-4">Cambiar responsable de caja</div>
                                            <input className="w-full border rounded px-4 py-2 mb-4" placeholder="Nuevo responsable" />
                                            <div className="flex gap-4">
                                                <button className="w-1/2 bg-gray-200 text-gray-700 rounded-lg py-2 font-semibold" onClick={() => setModal(null)}>Cancelar</button>
                                                <button className="w-1/2 bg-green-600 text-white rounded-lg py-2 font-semibold" onClick={() => setModal(null)}>Cambiar</button>
                                            </div>
                                        </div>
                                    </div>
                                )}
                                {modal?.type === "retiro-dinero" && (
                                    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50" onClick={() => setModal(null)}>
                                        <div className="bg-white rounded-xl p-8 shadow-xl max-w-sm w-full" onClick={e => e.stopPropagation()}>
                                            <div className="font-bold text-lg mb-4">Retiro de dinero</div>
                                            <input className="w-full border rounded px-4 py-2 mb-4" placeholder="Concepto" />
                                            <input className="w-full border rounded px-4 py-2 mb-4" placeholder="Monto" type="number" min="0" />
                                            <div className="flex gap-4">
                                                <button className="w-1/2 bg-gray-200 text-gray-700 rounded-lg py-2 font-semibold" onClick={() => setModal(null)}>Cancelar</button>
                                                <button className="w-1/2 bg-red-600 text-white rounded-lg py-2 font-semibold" onClick={() => setModal(null)}>Retirar</button>
                                            </div>
                                        </div>
                                    </div>
                                )}
                                {modal?.type === "cerrar-caja" && (
                                    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50" onClick={() => setModal(null)}>
                                        <div className="bg-white rounded-xl p-8 shadow-xl max-w-sm w-full" onClick={e => e.stopPropagation()}>
                                            <div className="font-bold text-lg mb-4">¿Cerrar cuadre de caja?</div>
                                            <div className="mb-6 text-gray-700">Esta acción no se puede deshacer. ¿Estás seguro?</div>
                                            <div className="flex gap-4">
                                                <button className="w-1/2 bg-gray-200 text-gray-700 rounded-lg py-2 font-semibold" onClick={() => setModal(null)}>No</button>
                                                <button className="w-1/2 bg-green-600 text-white rounded-lg py-2 font-semibold" onClick={() => { setModal(null); setAbierta(false); }}>Sí, cerrar</button>
                                            </div>
                                        </div>
                                    </div>
                                )}
                                {/* Modales de opciones */}
                                {modal?.type === "pagar-profesionales-hoy" && (
                                    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50" onClick={() => setModal(null)}>
                                        <div className="bg-white rounded-xl p-8 shadow-xl max-w-sm w-full" onClick={e => e.stopPropagation()}>
                                            <div className="font-bold text-lg mb-4">Pagar a profesionales hoy</div>
                                            <input className="w-full border rounded px-4 py-2 mb-4" placeholder="Monto a pagar" type="number" min="0" />
                                            <div className="flex gap-4">
                                                <button className="w-1/2 bg-gray-200 text-gray-700 rounded-lg py-2 font-semibold" onClick={() => setModal(null)}>Cancelar</button>
                                                <button className="w-1/2 bg-blue-600 text-white rounded-lg py-2 font-semibold" onClick={() => setModal(null)}>Pagar</button>
                                            </div>
                                        </div>
                                    </div>
                                )}
                                {modal?.type === "registrar-multa" && (
                                    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50" onClick={() => setModal(null)}>
                                        <div className="bg-white rounded-xl p-8 shadow-xl max-w-sm w-full" onClick={e => e.stopPropagation()}>
                                            <div className="font-bold text-lg mb-4">Registrar una multa o garantía</div>
                                            <input className="w-full border rounded px-4 py-2 mb-4" placeholder="Concepto" />
                                            <input className="w-full border rounded px-4 py-2 mb-4" placeholder="Monto" type="number" min="0" />
                                            <div className="flex gap-4">
                                                <button className="w-1/2 bg-gray-200 text-gray-700 rounded-lg py-2 font-semibold" onClick={() => setModal(null)}>Cancelar</button>
                                                <button className="w-1/2 bg-green-600 text-white rounded-lg py-2 font-semibold" onClick={() => setModal(null)}>Registrar</button>
                                            </div>
                                        </div>
                                    </div>
                                )}
                                {modal?.type === "pagar-profesionales-rango" && (
                                    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50" onClick={() => setModal(null)}>
                                        <div className="bg-white rounded-xl p-8 shadow-xl max-w-sm w-full" onClick={e => e.stopPropagation()}>
                                            <div className="font-bold text-lg mb-4">Pagar a profesionales por rango de fechas</div>
                                            <input className="w-full border rounded px-4 py-2 mb-4" placeholder="Desde (fecha)" type="date" />
                                            <input className="w-full border rounded px-4 py-2 mb-4" placeholder="Hasta (fecha)" type="date" />
                                            <input className="w-full border rounded px-4 py-2 mb-4" placeholder="Monto a pagar" type="number" min="0" />
                                            <div className="flex gap-4">
                                                <button className="w-1/2 bg-gray-200 text-gray-700 rounded-lg py-2 font-semibold" onClick={() => setModal(null)}>Cancelar</button>
                                                <button className="w-1/2 bg-blue-600 text-white rounded-lg py-2 font-semibold" onClick={() => setModal(null)}>Pagar</button>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                </main>
            </ModuleLayout>
        </AuthGuard>


    );
}
