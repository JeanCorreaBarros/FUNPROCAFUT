
"use client";

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import dynamic from "next/dynamic"
import { AuthGuard } from "@/components/auth-guard"
import { ModuleLayout } from "@/components/module-layout"


type Item = { id: number; nombre: string; precio: number; tipo: "servicio" | "producto" };
const servicios: Item[] = [
    { id: 1, nombre: "CORTE", precio: 15000, tipo: "servicio" },
    { id: 2, nombre: "AFEITADO COMPLETO", precio: 12000, tipo: "servicio" },
    { id: 3, nombre: "TINTURA DE CABELLO", precio: 25000, tipo: "servicio" },
    { id: 4, nombre: "LAVADO Y MASAJE CAPILAR", precio: 10000, tipo: "servicio" },
    { id: 5, nombre: "ARREGLO DE BARBA", precio: 8000, tipo: "servicio" },
    { id: 6, nombre: "CEPILLADO Y PEINADO", precio: 13000, tipo: "servicio" },
    { id: 7, nombre: "DEPILACIÓN DE CEJAS", precio: 7000, tipo: "servicio" },
    { id: 8, nombre: "LIMPIEZA FACIAL EXPRESS", precio: 18000, tipo: "servicio" },
    { id: 9, nombre: "ALISADO TEMPORAL", precio: 22000, tipo: "servicio" },
    { id: 10, nombre: "MASAJE RELAJANTE", precio: 30000, tipo: "servicio" },
];

const productos: Item[] = [
    { id: 101, nombre: "Cera para cabello", precio: 5000, tipo: "producto" },
    { id: 102, nombre: "Shampoo revitalizante", precio: 8000, tipo: "producto" },
    { id: 103, nombre: "Acondicionador hidratante", precio: 8500, tipo: "producto" },
    { id: 104, nombre: "Aceite para barba", precio: 12000, tipo: "producto" },
    { id: 105, nombre: "Pomada mate", precio: 9500, tipo: "producto" },
    { id: 106, nombre: "Crema facial para hombre", precio: 15000, tipo: "producto" },
    { id: 107, nombre: "Tónico capilar anticaída", precio: 18000, tipo: "producto" },
    { id: 108, nombre: "Peine profesional", precio: 6000, tipo: "producto" },
    { id: 109, nombre: "Toalla de microfibra", precio: 10000, tipo: "producto" },
    { id: 110, nombre: "Perfume masculino 50ml", precio: 25000, tipo: "producto" },
];





export default function VenderPage() {
    const [tab, setTab] = useState<string>("servicios");
    const [busqueda, setBusqueda] = useState<string>("");
    const [carrito, setCarrito] = useState<(Item & { cantidad?: number })[]>([]);


    // Filtrar según el tab activo
    const itemsFiltrados = (tab === "servicios" ? servicios : productos).filter((item) =>
        item.nombre.toLowerCase().includes(busqueda.toLowerCase())
    );

    const subtotal = carrito.reduce((acc: number, item) => acc + item.precio * (item.cantidad || 1), 0);
    const descuentos = 0; // lógica de descuentos si aplica
    const total = subtotal - descuentos;

    function agregarAlCarrito(item: Item) {
        // Si el item ya está en el carrito, aumenta la cantidad
        const existe = carrito.find((c) => c.id === item.id);
        if (existe) {
            setCarrito(carrito.map(c => c.id === item.id ? { ...c, cantidad: (c.cantidad || 1) + 1 } : c));
        } else {
            setCarrito([...carrito, { ...item, cantidad: 1 }]);
        }
    }

    function cambiarCantidad(id: number, delta: number) {
        setCarrito(carrito.map(item =>
            item.id === id
                ? { ...item, cantidad: Math.max(1, (item.cantidad || 1) + delta) }
                : item
        ));
    }

    function eliminarDelCarrito(id: number) {
        setCarrito(carrito.filter(item => item.id !== id));
    }


    // 👇 Añade este estado antes del return (junto con los otros useState)
    const [paginaActual, setPaginaActual] = useState(1);
    const ITEMS_POR_PAGINA = 6;

    // Cálculo de paginación
    const indiceInicial = (paginaActual - 1) * ITEMS_POR_PAGINA;
    const indiceFinal = indiceInicial + ITEMS_POR_PAGINA;
    const itemsVisibles = itemsFiltrados.slice(indiceInicial, indiceFinal);
    const totalPaginas = Math.ceil(itemsFiltrados.length / ITEMS_POR_PAGINA);
    const [mostrarModalCupon, setMostrarModalCupon] = useState(false);
    const [mostrarCuponInput, setMostrarCuponInput] = useState(false);

    const [mostrarModalCancelar, setMostrarModalCancelar] = useState(false);
    const [loadingVender, setLoadingVender] = useState(false);
    const [loadingGuardar, setLoadingGuardar] = useState(false);
    const [cupon, setCupon] = useState("");

    const handleVender = () => {
        setLoadingVender(true);
        setTimeout(() => {
            setLoadingVender(false);
            alert("Factura enviada con éxito ✅");
        }, 2000);
    };

    const handleGuardar = () => {
        setLoadingGuardar(true);
        setTimeout(() => {
            setLoadingGuardar(false);
            alert("Orden guardada correctamente 🧾");
        }, 2000);
    };

    const handleCancelarOrden = () => {
        setMostrarModalCancelar(false);
        alert("Orden cancelada ❌");
    };

    const handleAplicarCupon = () => {
        if (!cupon.trim()) return alert("Por favor, ingresa un cupón válido.");
        alert(`Cupón "${cupon}" aplicado 🎉`);
        setMostrarCuponInput(false);
        setCupon("");
    };

    return (

        <AuthGuard>
            <ModuleLayout moduleType="agenda">
                <motion.div
                    initial={{ opacity: 0, y: 32 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                    className=" "
                >
                    <div className="flex flex-col md:flex-row w-full  bg-[#f9fafb]">
                        {/* PANEL PRINCIPAL */}
                        <div className="flex-1 p-6 md:p-10 bg-white md:rounded-t-3xl shadow-sm">
                            {/* Encabezado con tabs y botón */}
                            <div className="flex items-center gap-8 border-b border-gray-200 pb-3 mb-6">
                                <button
                                    className={`relative pb-2 text-lg font-semibold transition-all ${tab === "servicios"
                                        ? "text-blue-600 after:absolute after:bottom-0 after:left-0 after:w-full after:h-[2px] after:bg-blue-500"
                                        : "text-gray-400 hover:text-gray-600"
                                        }`}
                                    onClick={() => setTab("servicios")}
                                >
                                    Servicios
                                </button>
                                <button
                                    className={`relative pb-2 text-lg font-semibold transition-all ${tab === "productos"
                                        ? "text-blue-600 after:absolute after:bottom-0 after:left-0 after:w-full after:h-[2px] after:bg-blue-500"
                                        : "text-gray-400 hover:text-gray-600"
                                        }`}
                                    onClick={() => setTab("productos")}
                                >
                                    Productos
                                </button>

                                <button className="ml-auto w-10 h-10 flex items-center justify-center rounded-full bg-blue-50 text-blue-500 hover:bg-blue-100 text-2xl font-bold transition">
                                    +
                                </button>
                            </div>

                            {/* Buscador */}
                            <div className="mb-8">
                                <input
                                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-blue-200 shadow-sm"
                                    placeholder="🔍 Buscar servicio o producto..."
                                    value={busqueda}
                                    onChange={(e) => setBusqueda(e.target.value)}
                                />
                            </div>

                            {/* Lista de servicios/productos */}
                            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                                {itemsVisibles.map((item) => (
                                    <div
                                        key={item.id}
                                        className="relative bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-md transition p-5 flex flex-col justify-between"
                                    >
                                        <div>
                                            <div className="font-semibold text-gray-800 text-sm mb-1">
                                                {item.nombre}
                                            </div>
                                            <div className="font-bold text-lg text-gray-900 mb-1">
                                                ${item.precio.toLocaleString()}
                                            </div>
                                            <div
                                                className={`text-xs uppercase tracking-wide font-medium ${item.tipo === "servicio" ? "text-teal-500" : "text-blue-500"
                                                    }`}
                                            >
                                                {item.tipo}
                                            </div>
                                        </div>

                                        <button
                                            className="absolute right-4 bottom-4 bg-blue-500 hover:bg-blue-600 cursor-pointer text-white px-4 py-2 rounded-lg font-semibold shadow transition"
                                            onClick={() => agregarAlCarrito(item)}
                                        >
                                            Agregar
                                        </button>
                                    </div>
                                ))}
                            </div>

                            {/* Paginación dinámica */}
                            {totalPaginas > 1 && (
                                <div className="flex items-center justify-center gap-3 mt-10">
                                    <button
                                        onClick={() => setPaginaActual(Math.max(1, paginaActual - 1))}
                                        disabled={paginaActual === 1}
                                        className={`px-3 py-1 text-sm font-medium rounded-lg ${paginaActual === 1
                                            ? "text-gray-400 cursor-not-allowed"
                                            : "text-blue-600 hover:bg-blue-100"
                                            }`}
                                    >
                                        « Anterior
                                    </button>

                                    {/* Números de página */}
                                    <div className="flex items-center gap-2">
                                        {Array.from({ length: totalPaginas }).map((_, i) => (
                                            <button
                                                key={i}
                                                onClick={() => setPaginaActual(i + 1)}
                                                className={`w-8 h-8 flex items-center justify-center rounded-full text-sm font-semibold transition ${paginaActual === i + 1
                                                    ? "bg-blue-500 text-white"
                                                    : "text-gray-500 hover:bg-gray-100"
                                                    }`}
                                            >
                                                {i + 1}
                                            </button>
                                        ))}
                                    </div>

                                    <button
                                        onClick={() => setPaginaActual(Math.min(totalPaginas, paginaActual + 1))}
                                        disabled={paginaActual === totalPaginas}
                                        className={`px-3 py-1 text-sm font-medium rounded-lg ${paginaActual === totalPaginas
                                            ? "text-gray-400 cursor-not-allowed"
                                            : "text-blue-600 hover:bg-blue-100"
                                            }`}
                                    >
                                        Siguiente »
                                    </button>
                                </div>
                            )}

                        </div>

                        {/* PANEL DERECHO */}
                        <div className="w-full md:w-[420px] shadow-sm flex flex-col md:rounded-t-3xl gap-6 bg-[#f3f4f6] p-6 md:p-8 border-l border-gray-200">
                            {/* Buscar cliente */}
                            <div className="flex items-center gap-2">
                                <div className="flex-1 flex items-center bg-white rounded-xl px-4 py-2 border shadow-sm">
                                    <svg
                                        width="20"
                                        height="20"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        className="text-gray-400 mr-2"
                                        viewBox="0 0 24 24"
                                    >
                                        <circle cx="10" cy="10" r="7" />
                                        <line x1="21" y1="21" x2="15" y2="15" />
                                    </svg>
                                    <input
                                        className="flex-1 bg-transparent outline-none text-gray-700 text-sm"
                                        placeholder="Buscar cliente"
                                    />
                                </div>

                                {/* Botón para crear nuevo cliente */}
                                <button
                                    onClick={() => alert("Abrir formulario para nuevo cliente")}
                                    className="flex items-center gap-1 bg-purple-500 cursor-pointer hover:bg-purple-600 text-white text-xs font-semibold px-3 py-2 rounded-lg shadow-sm transition-all"
                                >
                                    <span className="text-lg leading-none">+</span>
                                    Nuevo
                                </button>
                            </div>


                            {/* Carrito */}
                            <div
                                className="flex-1 overflow-y-auto pr-2  "
                                style={{ maxHeight: "340px" }}
                            >
                                {carrito.length === 0 ? (
                                    <div className="flex flex-col items-center justify-center h-64 text-center">
                                        <svg
                                            width="80"
                                            height="80"
                                            fill="none"
                                            stroke="#9ca3af"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            viewBox="0 0 24 24"
                                        >
                                            <circle cx="12" cy="12" r="10" />
                                            <path d="M9 9l6 6M15 9l-6 6" />
                                        </svg>
                                        <p className="text-gray-400 mt-3 text-sm">
                                            Agrega productos o servicios <br /> para crear tu factura
                                        </p>
                                    </div>
                                ) : (
                                    <div className="flex flex-col gap-3">
                                        {carrito.map((item) => (
                                            <div
                                                key={item.id}
                                                className="relative mt-5 flex flex-col md:flex-row items-center bg-white rounded-xl shadow-sm border p-3 mx-2 transition hover:shadow-md"
                                            >
                                                {/* Nombre, precio y tipo */}
                                                <div className="flex-1 min-w-0 w-full">
                                                    <div
                                                        className="font-semibold text-sm text-gray-800 break-words line-clamp-2 cursor-default"
                                                        title={item.nombre}
                                                    >
                                                        {item.nombre}
                                                    </div>

                                                    <div className="font-bold text-lg text-gray-900">
                                                        ${item.precio.toLocaleString()}
                                                    </div>

                                                    <div
                                                        className={`text-xs mt-1 ${item.tipo === "servicio" ? "text-teal-500" : "text-blue-500"
                                                            }`}
                                                    >
                                                        {item.tipo}
                                                    </div>

                                                    {/* Input Colaborador solo para servicios */}
                                                    {item.tipo === "servicio" && (
                                                        <div className="w-full mt-2">
                                                            <input
                                                                className="border  rounded px-2 py-1 text-sm w-full  focus:outline-none focus:ring-2 focus:ring-blue-400"
                                                                placeholder="Colaborador"
                                                            />
                                                        </div>
                                                    )}
                                                </div>



                                                {/* Control cantidad */}
                                                <div className="flex items-center gap-2 ml-0 md:ml-4 mt-2 md:mt-0">
                                                    <button
                                                        className="w-6 h-6 rounded-full bg-gray-100 cursor-pointer hover:bg-purple-200 flex items-center justify-center text-lg"
                                                        onClick={() => cambiarCantidad(item.id, -1)}
                                                    >
                                                        -
                                                    </button>
                                                    <span className="font-semibold w-6 text-center">
                                                        {item.cantidad || 1}
                                                    </span>
                                                    <button
                                                        className="w-6 h-6 rounded-full bg-gray-100 cursor-pointer hover:bg-purple-200 flex items-center justify-center text-lg"
                                                        onClick={() => cambiarCantidad(item.id, 1)}
                                                    >
                                                        +
                                                    </button>
                                                </div>

                                                {/* Botón eliminar */}
                                                <button
                                                    className="absolute -top-3 -right-3 bg-white cursor-pointer border-2 border-red-400 rounded-full w-8 h-8 flex items-center justify-center text-red-500 text-xl shadow hover:bg-red-50"
                                                    onClick={() => eliminarDelCarrito(item.id)}
                                                >
                                                    ×
                                                </button>
                                            </div>
                                        ))}
                                    </div>

                                )}
                            </div>

                            {/* Resumen */}
                            <div className="bg-white rounded-2xl p-6 shadow-md mt-4">
                                <div className="flex justify-between text-gray-500 text-sm mb-1">
                                    <span>Subtotal:</span>
                                    <span>
                                        $
                                        {carrito
                                            .reduce(
                                                (acc, item) => acc + item.precio * (item.cantidad || 1),
                                                0
                                            )
                                            .toLocaleString()}
                                    </span>
                                </div>
                                <div className="flex justify-between text-gray-500 text-sm mb-2">
                                    <span>Descuentos:</span>
                                    <span>${descuentos.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between text-gray-800 font-semibold border-t border-gray-200 pt-3 mb-1">
                                    <span>Total:</span>
                                    <span>
                                        $
                                        {carrito
                                            .reduce(
                                                (acc, item) => acc + item.precio * (item.cantidad || 1),
                                                0
                                            )
                                            .toLocaleString()}
                                    </span>
                                </div>
                                <div className="flex justify-between text-gray-900 font-bold text-lg">
                                    <span>Pagar:</span>
                                    <span>
                                        $
                                        {carrito
                                            .reduce(
                                                (acc, item) => acc + item.precio * (item.cantidad || 1),
                                                0
                                            )
                                            .toLocaleString()}
                                    </span>
                                </div>

                                {/* Toggle de Cupón */}
                                <div
                                    className="text-center text-green-500 mt-3 cursor-pointer text-sm hover:text-green-600"
                                    onClick={() => setMostrarCuponInput(!mostrarCuponInput)}
                                >
                                    {mostrarCuponInput ? "Ocultar cupón" : "¿Tienes un cupón?"}
                                </div>

                                {/* Input dinámico para cupón */}
                                {mostrarCuponInput && (
                                    <div className="flex items-center gap-2 mt-3 animate-fade-in">
                                        <input
                                            type="text"
                                            value={cupon}
                                            onChange={(e) => setCupon(e.target.value)}
                                            placeholder="Ingresa tu cupón"
                                            className="flex-1 border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-green-400 outline-none"
                                        />
                                        <button
                                            onClick={handleAplicarCupon}
                                            className="bg-green-500 hover:bg-green-600 text-white text-sm px-4 py-2 rounded-lg font-semibold shadow"
                                        >
                                            Aplicar
                                        </button>
                                    </div>
                                )}

                                <div className="flex gap-4 mt-5">
                                    <button
                                        onClick={handleVender}
                                        disabled={loadingVender}
                                        className={`w-1/2 flex justify-center items-center gap-2 rounded-lg py-2 font-semibold shadow text-white ${loadingVender
                                            ? "bg-purple-400 cursor-not-allowed"
                                            : "bg-purple-600 hover:bg-purple-700 cursor-pointer"
                                            }`}
                                    >
                                        {loadingVender ? (
                                            <>
                                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                                Enviando...
                                            </>
                                        ) : (
                                            "Vender"
                                        )}
                                    </button>
                                    <button
                                        onClick={handleGuardar}
                                        disabled={loadingGuardar}
                                        className={`w-1/2 flex justify-center items-center gap-2 rounded-lg py-2 font-semibold shadow border text-gray-700 ${loadingGuardar
                                            ? "bg-gray-200 cursor-not-allowed"
                                            : "bg-gray-50 hover:bg-gray-100 cursor-pointer"
                                            }`}
                                    >
                                        {loadingGuardar ? (
                                            <>
                                                <div className="w-2 h-2 text-xs border-2 border-gray-500 border-t-transparent rounded-full animate-spin" />
                                                Creando...
                                            </>
                                        ) : (
                                            "Guardar orden"
                                        )}
                                    </button>
                                </div>

                                {/* Botón cancelar */}
                                <button
                                    onClick={() => setMostrarModalCancelar(true)}
                                    className="mt-3 w-full cursor-pointer text-center text-blue-500 underline text-sm hover:text-blue-600"
                                >
                                    Cancelar
                                </button>

                                {/* Modal Cupón */}
                                {mostrarModalCupon && (
                                    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
                                        <div className="bg-white p-6 rounded-2xl shadow-lg w-80">
                                            <h3 className="text-lg font-semibold text-gray-800 mb-3 text-center">
                                                Agregar cupón
                                            </h3>
                                            <input
                                                type="text"
                                                value={cupon}
                                                onChange={(e) => setCupon(e.target.value)}
                                                placeholder="Código del cupón"
                                                className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-green-400 outline-none"
                                            />
                                            <div className="flex justify-end gap-3 mt-4">
                                                <button
                                                    onClick={() => setMostrarModalCupon(false)}
                                                    className="text-gray-500 hover:text-gray-700 text-sm"
                                                >
                                                    Cancelar
                                                </button>
                                                <button
                                                    onClick={() => {
                                                        alert(`Cupón "${cupon}" agregado 🎉`);
                                                        setMostrarModalCupon(false);
                                                    }}
                                                    className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded-lg text-sm"
                                                >
                                                    Aplicar
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Modal Cancelar */}
                                {mostrarModalCancelar && (
                                    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
                                        <div className="bg-white p-6 rounded-2xl shadow-lg w-80">
                                            <h3 className="text-lg font-semibold text-gray-800 mb-3 text-center">
                                                ¿Seguro que deseas cancelar la orden?
                                            </h3>
                                            <p className="text-sm text-gray-600 text-center">
                                                Esta acción no se puede deshacer.
                                            </p>
                                            <div className="flex justify-end gap-3 mt-5">
                                                <button
                                                    onClick={() => setMostrarModalCancelar(false)}
                                                    className="text-gray-500 cursor-pointer hover:text-gray-700 text-sm"
                                                >
                                                    No
                                                </button>
                                                <button
                                                    onClick={handleCancelarOrden}
                                                    className="bg-red-500 cursor-pointer hover:bg-red-600 text-white px-3 py-1 rounded-lg text-sm"
                                                >
                                                    Sí, cancelar
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>


                </motion.div>
            </ModuleLayout>
        </AuthGuard>


    );
}
