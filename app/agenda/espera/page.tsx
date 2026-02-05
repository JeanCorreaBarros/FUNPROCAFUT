"use client";
import dynamic from "next/dynamic"
import { AuthGuard } from "@/components/auth-guard"
import { ModuleLayout } from "@/components/module-layout"
import { useState } from "react";
import { useRouter } from "next/navigation";

const ordenesIniciales = [
  {
    id: 1,
    fecha: "31-07-2025 - 4:08 PM",
    cliente: "Ismael Lozada",
    total: 15000,
    servicios: ["Barbershop ClubMen: corte caballero"],
  },
  {
    id: 2,
    fecha: "01-08-2025 - 10:45 AM",
    cliente: "Daniela Torres",
    total: 28000,
    servicios: [
      "Spa & Belleza: manicure express",
      "Spa & Belleza: pedicure clásico",
    ],
  },
  {
    id: 3,
    fecha: "02-08-2025 - 2:15 PM",
    cliente: "Luis Fernando Gómez",
    total: 35000,
    servicios: [
      "Barbershop ClubMen: corte + barba",
      "Tratamiento capilar: hidratación intensa",
    ],
  },
  {
    id: 4,
    fecha: "03-08-2025 - 11:30 AM",
    cliente: "Karen Martínez",
    total: 42000,
    servicios: [
      "Spa & Belleza: limpieza facial profunda",
      "Masaje relajante: 30 min",
    ],
  },
  {
    id: 5,
    fecha: "04-08-2025 - 5:50 PM",
    cliente: "Andrés León",
    total: 18000,
    servicios: [
      "Barbershop ClubMen: corte moderno",
      "Afeitado clásico",
    ],
  },
];


export default function OrdenesEsperaPage() {
  const [ordenes, setOrdenes] = useState(ordenesIniciales);
  const [busqueda, setBusqueda] = useState("");
  const [modal, setModal] = useState<{ type: string; ordenId?: number } | null>(null);
  const router = useRouter();

  // Filtro de búsqueda
  const ordenesFiltradas = ordenes.filter(o =>
    o.cliente.toLowerCase().includes(busqueda.toLowerCase())
  );

  // Acciones
  function eliminarTodas() {
    setModal({ type: "eliminar-todas" });
  }
  function confirmarEliminarTodas() {
    setOrdenes([]);
    setModal(null);
  }
  function anularOrden(id: number) {
    setOrdenes(ordenes.filter(o => o.id !== id));
  }
  function pagarOrden(id: number) {
    setModal({ type: "pagar", ordenId: id });
  }
  function editarOrden(id: number) {
    router.push(`/agenda/vender?edit=${id}`);
  }

  return (
    <AuthGuard>
      <ModuleLayout moduleType="agenda">
        <main className="flex-1 overflow-y-auto bg-[#f8fafc]">
          <div className="min-h-screen flex flex-col">
            {/* Header */}
            <header className="sticky top-0 z-20 bg-white/80 backdrop-blur-md border-b px-6 md:px-12 py-4 shadow-sm flex flex-col md:flex-row md:items-center md:justify-between">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Órdenes en espera</h1>
                <p className="text-gray-500 text-sm md:text-base">
                  Recibe órdenes de tus colaboradores (por ejemplo, un corte de cabello a facturar)
                </p>
              </div>
              <button
                onClick={eliminarTodas}
                className="mt-3 md:mt-0 text-red-600 text-sm font-medium hover:underline"
              >
                Eliminar todas las órdenes en espera
              </button>
            </header>

            {/* Contenido principal */}
            <section className="flex-1 overflow-y-auto px-6 md:px-12 py-8">
              {/* Buscador */}
              <div className="max-w-lg mx-auto mb-10">
                <div className="relative">
                  <input
                    className="w-full border border-gray-200 rounded-xl pl-4 pr-10 py-3 text-gray-700 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-green-400 transition"
                    placeholder="Buscar cliente..."
                    value={busqueda}
                    onChange={(e) => setBusqueda(e.target.value)}
                  />
                  <span className="absolute right-3 top-2.5 text-gray-400">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth="2"
                      stroke="currentColor"
                      className="w-5 h-5"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M21 21l-4.35-4.35M9.5 17a7.5 7.5 0 100-15 7.5 7.5 0 000 15z"
                      />
                    </svg>
                  </span>
                </div>
              </div>

              {/* Lista de órdenes */}
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 md:gap-8">
                {ordenesFiltradas.map((orden) => (
                  <div
                    key={orden.id}
                    className="relative bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg transition-transform hover:-translate-y-1 p-6"
                  >
                    {/* Total */}
                    <div className="absolute -top-4 right-3 bg-green-600 text-white text-sm font-semibold px-4 py-1 rounded-full shadow">
                      TOTAL: ${orden.total.toLocaleString()}
                    </div>

                    {/* Información */}
                    <div className="mb-4 text-sm text-gray-700">
                      <div>
                        <span className="font-semibold">📅 Fecha y hora:</span> {orden.fecha}
                      </div>
                      <div>
                        <span className="font-semibold">👤 Cliente:</span> {orden.cliente}
                      </div>
                    </div>

                    {/* Servicios */}
                    <div className="mb-4">
                      <div className="font-semibold text-gray-800 mb-2">🧾 Servicios agregados:</div>
                      <ul className="list-disc ml-5 text-gray-700 space-y-1 text-sm">
                        {orden.servicios.map((serv, idx) => (
                          <li key={idx} className="truncate">
                            {serv}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Botones de acción */}
                    <div className="flex flex-col gap-3 mt-6">
                      <button
                        className="w-full bg-purple-500 cursor-pointer hover:bg-purple-700 text-white rounded-xl py-2.5 font-semibold shadow transition"
                        onClick={() => pagarOrden(orden.id)}
                      >
                        💳 Pagar orden
                      </button>
                      <button
                        className="text-center text-gray-700 hover:text-gray-900 text-sm font-medium transition"
                        onClick={() => editarOrden(orden.id)}
                      >
                        ✏️ Editar orden
                      </button>
                      <button
                        className="text-center text-blue-600 hover:text-blue-700 underline text-sm transition"
                        onClick={() => anularOrden(orden.id)}
                      >
                        ❌ Anular orden de servicio
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Modales */}
            {modal?.type === "eliminar-todas" && (
              <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
                <div className="bg-white rounded-2xl p-8 shadow-xl max-w-sm w-full text-center">
                  <h2 className="font-bold text-xl mb-3 text-gray-800">¿Eliminar todas las órdenes?</h2>
                  <p className="text-gray-600 mb-6">
                    Esta acción no se puede deshacer. ¿Deseas continuar?
                  </p>
                  <div className="flex gap-4">
                    <button
                      className="w-1/2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg py-2 font-semibold transition"
                      onClick={() => setModal(null)}
                    >
                      Cancelar
                    </button>
                    <button
                      className="w-1/2 bg-red-600 hover:bg-red-700 text-white rounded-lg py-2 font-semibold transition"
                      onClick={confirmarEliminarTodas}
                    >
                      Eliminar
                    </button>
                  </div>
                </div>
              </div>
            )}

            {modal?.type === "pagar" && (
              <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
                <div className="bg-white rounded-2xl p-8 shadow-xl max-w-sm w-full text-center">
                  <h2 className="font-bold text-xl mb-3 text-gray-800">Confirmación de pago</h2>
                  <p className="text-gray-600 mb-6">
                    Se creará una factura con los datos seleccionados. ¿Confirmas el pago?
                  </p>
                  <div className="flex gap-4">
                    <button
                      className="w-1/2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg py-2 font-semibold transition"
                      onClick={() => setModal(null)}
                    >
                      No
                    </button>
                    <button
                      className="w-1/2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg py-2 font-semibold transition"
                      onClick={() => setModal(null)}
                    >
                      Sí, confirmar
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>

      </ModuleLayout>
    </AuthGuard>

  );
}
