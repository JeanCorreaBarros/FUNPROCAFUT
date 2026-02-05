"use client";

import React, { useState, useEffect, useRef } from "react"
import { AuthGuard } from "@/components/auth-guard"
import { DashboardLayout } from "@/components/dashboard-layout"
import { ModuleLayout } from "@/components/module-layout"
import { WelcomeBanner } from "@/components/welcome-banner"
import { ActiveModules } from "@/components/active-modules"
import { CompanyInfo } from "@/components/company-info"
import { UserStats } from "@/components/user-stats"
import { SetupProgress } from "@/components/setup-progress"
import Image from "next/image"
import { BookOpen, Gift, Search, X } from "lucide-react"



export default function VotePage() {
  const galleryImages = ['/gallery1.jpg', '/gallery2.jpg', '/gallery3.jpg', '/gallery4.jpg']
  const [galleryIndex, setGalleryIndex] = useState(0)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const rotateRef = useRef<number | null>(null)

  // Attendance modal state
  const [attendanceModalOpen, setAttendanceModalOpen] = useState(false)
  const [selectedCell, setSelectedCell] = useState<{ day: number; hour: number } | null>(null)
  const [attendance, setAttendance] = useState<Record<number, string>>({})

  const attendanceStatuses = [
    { key: 'Presencial', label: 'Presencial' },
    { key: 'Virtual', label: 'Virtual' },
    { key: 'Asistió', label: 'Asistió' },
    { key: 'Llegó Tarde', label: 'Llegó Tarde' },
    { key: 'No Asistió', label: 'No Asistió' },
    { key: 'Excusa', label: 'Excusa' },
  ]

  const studentsSample = [
    { id: 1, name: 'ALBORNOZ HERRERA MATTEO ALESSANDRO', class: 'Cuarto A' },
    { id: 2, name: 'BENITEZ BUENO CAMILO ANDRES', class: 'Cuarto A' },
    { id: 3, name: 'CAMARGO CARRILLO DANIEL', class: 'Cuarto A' },
    { id: 4, name: 'CASTRO PEREZ JUAN ESTEBAN', class: 'Cuarto A' },
  ]

  useEffect(() => {
    // Advance every 30 seconds
    rotateRef.current = window.setInterval(() => {
      setGalleryIndex((idx) => (idx + 1) % galleryImages.length)
    }, 30000)

    return () => {
      if (rotateRef.current) clearInterval(rotateRef.current)
    }
  }, [galleryImages.length])

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setIsModalOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  return (
    <AuthGuard>
      <ModuleLayout moduleType="vote">
        <div className="space-y-6">
          <WelcomeBanner />

          {/* New single-section with overview cards */}
          <div className="grid grid-cols-1 gap-6">
            <div className="lg:col-span-12">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

                {/* Left column */}
                <div className="lg:col-span-3 flex flex-col gap-6">

                  {/* Noticias & Galería */}
                  <div className="bg-white rounded-lg shadow p-6">
                    <h3 className="text-lg font-semibold mb-2">
                      Noticias & Galería
                    </h3>
                    <p className="text-sm text-gray-600 mb-4">
                      Últimas noticias del campus y fotos destacadas.
                    </p>
                    {/* Carousel: one image at a time, auto-rotates every 30s */}
                    <div className="relative">
                      <div className="relative h-80 rounded-lg overflow-hidden bg-gray-100 cursor-pointer" onClick={() => setIsModalOpen(true)}>
                        <Image
                          src={galleryImages[galleryIndex]}
                          alt={`Gallery ${galleryIndex + 1}`}
                          fill
                          className="object-cover"
                        />

                        {/* Left/Right Controls (stop propagation so they don't open modal) */}
                        <button
                          onClick={(e: React.MouseEvent) => { e.stopPropagation(); setGalleryIndex((galleryIndex - 1 + galleryImages.length) % galleryImages.length) }}
                          className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/80 p-2 rounded-full shadow z-20"
                          aria-label="Previous image"
                        >
                          ‹
                        </button>

                        <button
                          onClick={(e: React.MouseEvent) => { e.stopPropagation(); setGalleryIndex((galleryIndex + 1) % galleryImages.length) }}
                          className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/80 p-2 rounded-full shadow z-20"
                          aria-label="Next image"
                        >
                          ›
                        </button>
                      </div>

                      {/* Dots */}
                      <div className="flex justify-center gap-2 mt-3">
                        {galleryImages.map((_, idx) => (
                          <button
                            key={idx}
                            onClick={() => setGalleryIndex(idx)}
                            className={`w-3 h-3 rounded-full ${idx === galleryIndex ? 'bg-indigo-600 w-6' : 'bg-gray-300'}`}
                            aria-label={`Go to slide ${idx + 1}`}
                          />
                        ))}
                      </div>

                      {/* Modal */}
                      {isModalOpen && (
                        <div className="fixed inset-0 z-50 flex items-center justify-center">
                          {/* Glass blur backdrop */}
                          <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={() => setIsModalOpen(false)} />

                          <div className="relative bg-white/60 backdrop-blur-md border border-white/20 rounded-lg w-full max-w-4xl p-4 shadow-lg">
                            <button onClick={() => setIsModalOpen(false)} className="absolute right-3 top-3 bg-white/80 backdrop-blur-sm rounded-full w-10 h-10 flex items-center justify-center z-50" aria-label="Close">
                              <X className="w-4 h-4 text-gray-800" />
                            </button>

                            <div className="w-full h-[75vh] bg-black rounded-lg overflow-hidden">
                              <Image src={galleryImages[galleryIndex]} alt={`Gallery ${galleryIndex + 1}`} fill className="object-contain" />
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Cumpleaños */}
                  <div className="bg-white rounded-lg shadow overflow-hidden">
                    <div className="border-b-4 border-green-500 px-4 py-2 flex items-center gap-3">
                      <Gift className="w-5 h-5 text-green-700" />
                      <h3 className="text-lg font-semibold">Cumpleaños</h3>
                    </div>

                    <div className="p-4 max-h-64 overflow-y-auto">
                      <div className="mb-4">
                        <div className="text-sm font-medium text-gray-700 mb-2 bg-gray-50 p-2 rounded">Hoy es el cumpleaños de:</div>
                        <ul className="space-y-3">
                          <li className="flex items-center gap-3 bg-white border rounded p-2">
                            <div className="w-12 h-12 bg-gray-100 rounded-md flex items-center justify-center text-gray-400"> </div>
                            <div>
                              <div className="text-sm font-semibold text-blue-700">ISABELLA MENDOZA MENDOZA</div>
                              <div className="text-xs text-gray-500">Décimo A</div>
                            </div>
                          </li>

                          <li className="flex items-center gap-3 bg-white border rounded p-2">
                            <div className="w-12 h-12 bg-blue-50 rounded-md flex items-center justify-center text-blue-500"> </div>
                            <div>
                              <div className="text-sm font-semibold text-blue-700">DIEGO OLIVERA ARRIETA</div>
                              <div className="text-xs text-gray-500">Quinto A</div>
                            </div>
                          </li>
                        </ul>
                      </div>

                      <div>
                        <div className="text-sm font-medium text-gray-700 mb-2 bg-gray-50 p-2 rounded">Mañana está de cumpleaños:</div>
                        <ul className="space-y-3">
                          <li className="flex items-center gap-3 bg-white border rounded p-2">
                            <div className="w-12 h-12 rounded-md overflow-hidden">
                              <div className="w-full h-full bg-cover bg-center" style={{ backgroundImage: "url('/avatar1.jpg')" }} />
                            </div>
                            <div>
                              <div className="text-sm font-semibold text-blue-700">ALEJANDRO ANDRES CARLIER FONTALVO</div>
                              <div className="text-xs text-gray-500">Transición A</div>
                            </div>
                          </li>

                          <li className="flex items-center gap-3 bg-white border rounded p-2">
                            <div className="w-12 h-12 bg-gray-100 rounded-md flex items-center justify-center text-gray-400"> </div>
                            <div>
                              <div className="text-sm font-semibold text-blue-700">EMMANUEL DAVID GONZALEZ CHARRIS</div>
                              <div className="text-xs text-gray-500">Primero B</div>
                            </div>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  {/* Attendance modal */}
                  {attendanceModalOpen && selectedCell && (
                    <div className="fixed inset-0 z-60 flex items-center justify-center">
                      {/* Glass blur backdrop */}
                      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={() => setAttendanceModalOpen(false)} />

                      <div className="relative bg-white/60 backdrop-blur-md border border-white/20 rounded-lg w-full max-w-4xl p-6 shadow-lg">
                        <div className="flex items-start justify-between gap-4 mb-4">
                          <div>
                            <h3 className="text-lg font-semibold">Registro de asistencia</h3>
                            <div className="text-sm text-gray-600">Clase <strong>{selectedCell.hour}</strong> • Día <strong>{['Lun', 'Mar', 'Mie', 'Jue', 'Vie'][selectedCell.day]}</strong></div>
                          </div>

                          <div className="flex items-center gap-2">
                            <button className="bg-gray-100 hover:bg-gray-200 p-2 rounded" onClick={() => { setAttendanceModalOpen(false) }} aria-label="Close">
                              <X className="w-4 h-4 text-gray-700" />
                            </button>
                          </div>
                        </div>

                        <div className="flex items-center gap-3 mb-4">
                          <div className="flex-1">
                            <div className="relative">
                              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"><Search className="w-4 h-4" /></span>
                              <input type="text" placeholder="Buscar estudiante..." className="w-full pl-10 pr-3 py-2 border rounded bg-white/80" />
                            </div>
                          </div>

                          <div className="flex gap-2">
                            <button className="px-3 py-2 bg-indigo-600 text-white text-sm rounded" onClick={() => {
                              const newAttendance = { ...attendance }
                              studentsSample.forEach(s => newAttendance[s.id] = 'Presencial')
                              setAttendance(newAttendance)
                            }}>Marcar todos Presencial</button>

                            <button className="px-3 py-2 border rounded text-sm" onClick={() => { setAttendance({}) }}>Limpiar</button>
                          </div>
                        </div>

                        <div className="overflow-auto max-h-64 border rounded bg-white/60">
                          <table className="w-full text-sm">
                            <thead className="bg-gray-50">
                              <tr>
                                <th className="p-2 border w-8">#</th>
                                <th className="p-2 border text-left">Estudiante</th>
                                <th className="p-2 border text-left">Clase</th>
                                <th className="p-2 border text-left">Asistencia</th>
                              </tr>
                            </thead>
                            <tbody>
                              {studentsSample.map((s) => (
                                <tr key={s.id} className="border-b hover:bg-gray-50">
                                  <td className="p-2 text-center">{s.id}</td>
                                  <td className="p-2">
                                    <div className="flex items-center gap-3">
                                      <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 overflow-hidden">
                                        <div className="w-full h-full bg-cover bg-center" style={{ backgroundImage: "url('/avatar1.jpg')" }} />
                                      </div>

                                      <div>
                                        <div className="text-sm font-semibold">{s.name}</div>
                                        <div className="text-xs text-gray-500">{s.class}</div>
                                      </div>
                                    </div>
                                  </td>
                                  <td className="p-2"><div className="text-sm text-gray-700">{s.class}</div></td>
                                  <td className="p-2">
                                    <div className="flex flex-wrap gap-2">
                                      {attendanceStatuses.map(st => {
                                        const active = attendance[s.id] === st.key
                                        return (
                                          <button
                                            key={st.key}
                                            onClick={() => setAttendance(prev => ({ ...prev, [s.id]: st.key }))}
                                            className={`px-2 py-1 rounded text-xs border ${active ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white'}`}
                                          >
                                            {st.label}
                                          </button>
                                        )
                                      })}
                                    </div>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>

                        <div className="mt-4 flex items-center justify-between">
                          <div className="text-sm text-gray-500">Cambios guardados localmente</div>
                          <div className="flex gap-2">
                            <button className="px-4 py-2 border rounded bg-white" onClick={() => setAttendanceModalOpen(false)}>Cancelar</button>
                            <button className="px-4 py-2 bg-indigo-600 text-white rounded" onClick={() => { console.log('Saved attendance', attendance); setAttendanceModalOpen(false); }}>Guardar asistencia</button>
                          </div>
                        </div>

                      </div>
                    </div>
                  )}
                </div>

                {/* Right column */}
                <div className="lg:col-span-9 flex flex-col gap-6">


                  {/* Resumen Notas Académicas */}
                  <div className="bg-white rounded-lg shadow overflow-hidden">
                    <div className="bg-blue-600 px-4 py-2 flex items-center gap-3 text-white">
                      <BookOpen className="w-5 h-5" />
                      <h3 className="text-lg font-semibold">Resumen Notas Académicas</h3>
                      <div className="ml-auto text-sm opacity-90">2026</div>
                    </div>

                    <div className="p-4">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                          <button className="px-3 py-1 rounded bg-red-100 text-red-700 text-sm">Per. 1</button>
                          <button className="px-3 py-1 rounded bg-gray-100 text-gray-700 text-sm">Per. 2</button>
                          <button className="px-3 py-1 rounded bg-gray-100 text-gray-700 text-sm">Per. 3</button>
                          <button className="px-3 py-1 rounded bg-gray-100 text-gray-700 text-sm">Per. 4</button>
                        </div>
                        <div className="text-sm text-gray-500">Periodo actual: <strong>Per. 1</strong></div>
                      </div>

                      <div className="overflow-auto">
                        <table className="min-w-full text-sm">
                          <thead>
                            <tr className="bg-blue-50 text-left text-xs text-gray-700">
                              <th className="p-2 border">Curso</th>
                              <th className="p-2 border">Asignatura</th>
                              <th className="p-2 border text-center">Nro Def.</th>
                              <th className="p-2 border text-center">Nro Notas</th>
                              <th className="p-2 border w-8" />
                            </tr>
                          </thead>
                          <tbody>
                            <tr className="bg-red-50">
                              <td className="p-2 border">Ter A</td>
                              <td className="p-2 border">El arte y la magia del lenguaje</td>
                              <td className="p-2 border text-center">0</td>
                              <td className="p-2 border text-center">0</td>
                              <td className="p-2 border text-right"><button className="text-blue-600">🔍</button></td>
                            </tr>

                            <tr>
                              <td className="p-2 border">Ter B</td>
                              <td className="p-2 border">El arte y la magia del lenguaje</td>
                              <td className="p-2 border text-center">0</td>
                              <td className="p-2 border text-center">0</td>
                              <td className="p-2 border text-right"><button className="text-blue-600">🔍</button></td>
                            </tr>

                            <tr className="bg-red-50">
                              <td className="p-2 border">Cua A</td>
                              <td className="p-2 border">El arte y la magia del lenguaje</td>
                              <td className="p-2 border text-center">0</td>
                              <td className="p-2 border text-center">0</td>
                              <td className="p-2 border text-right"><button className="text-blue-600">🔍</button></td>
                            </tr>

                            <tr>
                              <td className="p-2 border">Qui A</td>
                              <td className="p-2 border">Descubriendo mis habilidades</td>
                              <td className="p-2 border text-center">0</td>
                              <td className="p-2 border text-center">0</td>
                              <td className="p-2 border text-right"><button className="text-blue-600">🔍</button></td>
                            </tr>

                            <tr className="bg-red-50">
                              <td className="p-2 border">Qui B</td>
                              <td className="p-2 border">Construyendo mi proyecto</td>
                              <td className="p-2 border text-center">0</td>
                              <td className="p-2 border text-center">0</td>
                              <td className="p-2 border text-right"><button className="text-blue-600">🔍</button></td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>


                  {/* Mi Horario */}
                  <div className="bg-white rounded-lg shadow p-6">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-lg font-semibold">
                        Mi Horario
                      </h3>
                      <div className="text-sm text-gray-500">
                        Semana del <strong>02 al 06 de febrero</strong>
                      </div>
                    </div>

                    <div className="overflow-auto">
                      <div className="min-w-[720px] border border-gray-200 rounded-lg">

                        {/* Header */}
                        <div className="grid grid-cols-6 text-center font-medium bg-gray-50">
                          <div className="p-3 border-r border-b">Hora</div>
                          <div className="p-3 border-r border-b">Lun<br /><span className="text-xs text-gray-500">02</span></div>
                          <div className="p-3 border-r border-b">Mar<br /><span className="text-xs text-gray-500">03</span></div>
                          <div className="p-3 border-r border-b">Mie<br /><span className="text-xs text-gray-500">04</span></div>
                          <div className="p-3 border-r border-b">Jue<br /><span className="text-xs text-gray-500">05</span></div>
                          <div className="p-3 border-b">Vie<br /><span className="text-xs text-gray-500">06</span></div>
                        </div>

                        {/* Filas de horas */}
                        <div className="grid grid-cols-6">
                          {[1, 2, 3, 4, 5].map((hour) => (
                            <React.Fragment key={hour}>
                              <div className="p-3 border-r border-b bg-green-500 text-white text-center font-medium">
                                {hour}
                              </div>

                              {[0, 1, 2, 3, 4].map((day) => (
                                <div key={day} className="p-3 border-r border-b">
                                  <div
                                    className="h-full w-full min-h-[48px] flex items-center justify-center text-sm text-gray-500 hover:bg-gray-50 cursor-pointer"
                                    onClick={() => { setSelectedCell({ day, hour }); setAttendanceModalOpen(true); }}
                                  >
                                    <span className="text-xs">Sin registro</span>
                                  </div>
                                </div>
                              ))}
                            </React.Fragment>
                          ))}
                        </div>

                      </div>
                    </div>
                  </div>

                </div>
              </div>
            </div>
          </div>
        </div>
      </ModuleLayout>
    </AuthGuard>
  );
}
