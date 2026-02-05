"use client"

import React from "react"
import { useState, useEffect, useRef } from "react"
import dynamic from "next/dynamic"
import { AuthGuard } from "@/components/auth-guard"
import { ModuleLayout } from "@/components/module-layout"
import { useRouter } from "next/navigation"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Calendar } from "@/components/ui/calendar"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { useToast, toast } from "@/hooks/use-toast"
import { getTenantIdFromToken } from "@/lib/jwt"
import {
  format,
  addDays,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  startOfMonth,
  endOfMonth,
  isSameDay,
  isSameMonth,
  parseISO,
  getISODay,
  addMinutes,
} from "date-fns"
import { es } from "date-fns/locale"
import { PlusIcon, ChevronLeftIcon, ChevronRightIcon, Trash2Icon } from "lucide-react"
import { motion } from "framer-motion"
import hotToast from "react-hot-toast"

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000/api'

// Types for appointments
type Appointment = {
  id: string
  clientId: string
  clientName: string
  professionalId: string
  professionalName: string
  serviceId: string
  serviceName: string
  date: Date
  startTime: string
  endTime: string
  duration: number
  status: string
  statusId: number
  notes?: string
  createdAt?: string | null
}

// API response type
type ApiAppointment = {
  appointment_id: number
  appointment_date: string
  appointment_status: number
  start_time: string | null
  appointment_notes: string
  client_id: number
  first_name: string
  professional_id: number
  professional_name: string
  service_id: number
  service_name: string
  duration: number
  status_id: number
  status_name: string
  created_at?: string
  createdAt?: string
}

// Types for professionals
type Professional = {
  professional_id: string
  professional_name: string
  specialty: string
  color: string
}

// Types for services
type Service = {
  service_id: string;
  service_name: string;
  duration: number
  price: number
}

// Types for clients
type Client = {
  client_id: string
  firstName: string
  phone: string
  email: string
  address: string,
  city: string,
  postalCode: string,
  birthDate: string,
  gender: string,
  howFound: string,
  notes: string
}

export default function AgendaPage() {
  const calendarRef = useRef<HTMLDivElement>(null)
  const dayViewRef = useRef<HTMLDivElement | null>(null)

  // States
  const [currentDate, setCurrentDate] = useState<Date>(new Date())
  const [viewMode, setViewMode] = useState<"dia" | "semana" | "mes">("dia")
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [professionals, setProfessionals] = useState<Professional[]>([])
  const [services, setServices] = useState<Service[]>([])
  const [clients, setClients] = useState<Client[]>([])
  const [isNewAppointmentOpen, setIsNewAppointmentOpen] = useState(false)
  const [newAppointment, setNewAppointment] = useState<Partial<Appointment>>({
    /*date: new Date(),*/
    status: "Pendiente",
  })
  const [isNewClientOpen, setIsNewClientOpen] = useState(false)
  const [newClient, setNewClient] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    postalCode: '',
    birthDate: '',
    gender: '',
    howFound: '',
    notes: ''
  })
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<{
    date: Date
    time: string
    professionalId: number
  } | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // New states for editing appointments
  const [isEditAppointmentOpen, setIsEditAppointmentOpen] = useState(false)
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null)
  const [tenantId, setTenantId] = useState<string | null>(null)
  // Search state for client picker inside edit modal
  const [clientSearch, setClientSearch] = useState("")
  const [filteredClients, setFilteredClients] = useState<Client[]>([])
  // Current time line position (px) for day view indicator
  const [currentLineTop, setCurrentLineTop] = useState<number | null>(null)
  // Available time slots from API
  const [availableSlots, setAvailableSlots] = useState<Array<{ time: string; available: boolean }>>([])
  const [isLoadingSlots, setIsLoadingSlots] = useState(false)
  // Available time slots for edit modal
  const [availableSlotsEdit, setAvailableSlotsEdit] = useState<Array<{ time: string; available: boolean }>>([])
  const [isLoadingSlotsEdit, setIsLoadingSlotsEdit] = useState(false)

  console.log("cita seleccionada", selectedAppointment)

  // Función helper para leer token de sessionStorage
  const getToken = (): string | null => {
    return sessionStorage.getItem("TKV");
  };

  useEffect(() => {
    try {
      const tokenForTenant = getToken()
      const tId = getTenantIdFromToken(tokenForTenant)
      if (tId) setTenantId(tId)
      console.log("tenantId obtenido del token:", tId)
    } catch (e) {
      console.warn('No se pudo obtener tenantId del token', e)
    }
  }, []);



  // ...existing code...
  // Cambia esta función:
  const getUserId = (): string | null => {
    const userStr = localStorage.getItem("bivoo-user");
    if (!userStr) return null;
    try {
      const user = JSON.parse(userStr);
      return user.id || null;
    } catch {
      return null;
    }
  };
  // ...existing code...

  // Fetch appointments data — espera a que `tenantId` esté disponible
  useEffect(() => {
    if (!tenantId) return
    const fetchAppointments = async () => {
      setIsLoading(true)
      const token = getToken();
      try {
        // Replace with your actual API endpoint
        const response = await fetch(`${API_BASE}/${tenantId}/modules/agenda/appointments`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          }
        })
        if (!response.ok) {
          throw new Error('Failed to fetch appointments')
        }

        const data: ApiAppointment[] = await response.json()

        // Map API data to our format
        const mappedAppointments = data.map(appointment => {
          const startTime = appointment.start_time || "09:00:00";
          const [hours, minutes] = startTime.split(':').map(Number);
          const startDate = new Date(parseISO(appointment.appointment_date));
          startDate.setHours(hours, minutes, 0, 0);

          const endDate = addMinutes(startDate, appointment.duration);

          return {
            id: String(appointment.appointment_id),
            clientId: String(appointment.client_id),
            clientName: appointment.first_name,
            professionalId: String(appointment.professional_id),
            professionalName: appointment.professional_name,
            serviceId: String(appointment.service_id),
            serviceName: appointment.service_name,
            date: startDate,
            startTime: format(startDate, "HH:mm"),
            endTime: format(endDate, "HH:mm"),
            duration: appointment.duration,
            status: appointment.status_name,
            statusId: appointment.status_id,
            notes: appointment.appointment_notes
            ,
            // preserve created timestamp for ordering
            createdAt: appointment.created_at ?? appointment.createdAt ?? null,
          };
        })

        setAppointments(mappedAppointments)
        console.log("Fetched appointments:", mappedAppointments)
      } catch (error) {
        console.error('Error fetching appointments:', error)
      } finally {
        setIsLoading(false)
      }
    }

    // Fetch professionals, services, and clients data
    const fetchProfessionals = async () => {
      const token = getToken();
      try {
        const response = await fetch(`${API_BASE}/${tenantId}/modules/agenda/employees`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          }
        })

        if (response.ok) {
          const data = await response.json()
          setProfessionals(data)
        } else {
          console.error('Error en la respuesta del servidor:', response.status)
        }
      } catch (error) {
        console.error('Error fetching professionals:', error)
        // Set default professionals if API fails
        setProfessionals([
          { professional_id: "1", professional_name: "JeanCarlos", specialty: "General", color: "#4299e1" },
        ])
      }
    }


    const fetchServices = async () => {
      try {
        // Replace with your actual API endpoint
        const token = getToken();
        const response = await fetch(`${API_BASE}/${tenantId}/modules/agenda/services`, {
          method: "GET",
          mode: "cors",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
        })
        console.log("Status HTTP Services:", response);

        if (response.ok) {
          const data = await response.json()
          console.log("Fetched services:", data)
          setServices(Array.isArray(data)
            ? data.map((s) => ({
              service_id: String(s.id ?? s.service_id),
              service_name: s.name ?? s.service_name,
              duration: s.duration,
              price: s.price || 0,
            }))
            : [])
        }
      } catch (error) {
        console.error('Error fetching services:', error)
        // Set default services if API fails
        setServices([
          { service_id: "1", service_name: "Alicer", duration: 60, price: 25000 },
          { service_id: "2", service_name: "Corte de cabello", duration: 45, price: 20000 },
        ])
      }
    }

    const fetchClients = async () => {
      console.log("🚀 Iniciando carga de clientes…");
      try {
        const token = getToken();
        console.log("Token en header:", token);
        if (!token) throw new Error("No hay token");
        const response = await fetch(`${API_BASE}/${tenantId}/modules/agenda/clients`, {
          method: "GET",
          mode: "cors",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
        })
        console.log("Status HTTP Clientes:", response);

        if (response.ok) {
          const data = await response.json()
          console.log("Fetched Clientes:", data)
          setClients(
            Array.isArray(data)
              ? data.map((c) => ({
                client_id: String(c.id ?? c.client_id),
                firstName: c.firstName ?? c.firstName ?? "",
                phone: c.phone ?? "",
                email: c.email ?? "",
                address: c.address ?? "",
                city: c.city ?? "",
                postalCode: c.postalCode ?? "",
                birthDate: c.birthDate ?? "",
                gender: c.gender ?? "",
                howFound: c.howFound ?? "",
                notes: c.notes ?? "",
              }))
              : []
          );
        } else {
          console.error(`❌ Error en el servidor: ${response.status}`);
        }
      } catch (err) {
        console.error("Error fetching clients:", err);
        setClients([
          {
            client_id: "1",
            firstName: "Jean",
            phone: "300-123-4567",
            email: "jean@ejemplo.com",
            address: "",
            city: "",
            postalCode: "",
            birthDate: "",
            gender: "",
            howFound: "",
            notes: ""
          },
          {
            client_id: "3",
            firstName: "Susana Mejia",
            phone: "310-987-6543",
            email: "susana@ejemplo.com",
            address: "",
            city: "",
            postalCode: "",
            birthDate: "",
            gender: "",
            howFound: "",
            notes: ""
          },
        ]);
      }
    };



    fetchAppointments()
    fetchProfessionals()
    fetchServices()
    fetchClients()

  }, [tenantId])

  // Effect to fetch available time slots
  useEffect(() => {
    const fetchAvailableSlots = async () => {
      // Only fetch if we have all required parameters
      if (!newAppointment.date || !newAppointment.professionalId || !newAppointment.serviceId) {
        setAvailableSlots([])
        return
      }

      try {
        setIsLoadingSlots(true)
        const token = getToken()
        const dateStr = format(newAppointment.date, 'yyyy-MM-dd')
        
        const response = await fetch(
          `${API_BASE}/${tenantId}/modules/agenda/availability?employeeId=${newAppointment.professionalId}&serviceId=${newAppointment.serviceId}&date=${dateStr}`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`,
            },
          }
        )

        if (response.ok) {
          const data = await response.json()
          setAvailableSlots(data.slots || [])
        } else {
          console.error('Error fetching available slots:', response.status)
          setAvailableSlots([])
        }
      } catch (error) {
        console.error('Error fetching available slots:', error)
        setAvailableSlots([])
      } finally {
        setIsLoadingSlots(false)
      }
    }

    fetchAvailableSlots()
  }, [newAppointment.date, newAppointment.professionalId, newAppointment.serviceId, tenantId])

  // Effect to fetch available time slots for edit modal
  useEffect(() => {
    const fetchAvailableSlotsEdit = async () => {
      // Only fetch if we have all required parameters
      if (!selectedAppointment?.date || !selectedAppointment?.professionalId || !selectedAppointment?.serviceId) {
        setAvailableSlotsEdit([])
        return
      }

      try {
        setIsLoadingSlotsEdit(true)
        const token = getToken()
        const dateStr = format(selectedAppointment.date, 'yyyy-MM-dd')
        
        const response = await fetch(
          `${API_BASE}/${tenantId}/modules/agenda/availability?employeeId=${selectedAppointment.professionalId}&serviceId=${selectedAppointment.serviceId}&date=${dateStr}`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`,
            },
          }
        )

        if (response.ok) {
          const data = await response.json()
          setAvailableSlotsEdit(data.slots || [])
        } else {
          console.error('Error fetching available slots:', response.status)
          setAvailableSlotsEdit([])
        }
      } catch (error) {
        console.error('Error fetching available slots:', error)
        setAvailableSlotsEdit([])
      } finally {
        setIsLoadingSlotsEdit(false)
      }
    }

    fetchAvailableSlotsEdit()
  }, [selectedAppointment?.date, selectedAppointment?.professionalId, selectedAppointment?.serviceId, tenantId])

  // Function to change date
  const changeDate = (increment: number) => {
    const newDate = new Date(currentDate)
    if (viewMode === "dia") {
      newDate.setDate(newDate.getDate() + increment)
    } else if (viewMode === "semana") {
      newDate.setDate(newDate.getDate() + increment * 7)
    } else {
      newDate.setMonth(newDate.getMonth() + increment)
    }
    setCurrentDate(newDate)
  }

  // Function to create a new appointment
  const handleCreateAppointment = async () => {
    try {

      const token = getToken();
      const userId = getUserId(); // ahora es solo el id
      console.log("Token en header:", token);
      console.log("User Id:", userId)
      if (!token) throw new Error("No hay token");
      // Replace with your actual API endpoint
      const response = await fetch(`${API_BASE}/${tenantId}/modules/agenda/appointments`, {
        method: 'POST',
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({
          userCreator: userId, // solo el id
          client_id: newAppointment.clientId,
          employee_id: newAppointment.professionalId,
          service_id: newAppointment.serviceId,
          date: format(newAppointment.date || new Date(), 'yyyy-MM-dd'),
          appointment_status: 1, // Pending
          start_time: newAppointment.startTime,
          notes: newAppointment.notes || '',
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to create appointment')
      }

      // Refresh appointments
      const updatedResponse = await fetch(`${API_BASE}/${tenantId}/modules/agenda/appointments`, {
        method: 'GET',
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
      });
      if (updatedResponse.ok) {
        const data: ApiAppointment[] = await updatedResponse.json()

        const mappedAppointments = data.map(appointment => {
          const startTime = appointment.start_time || "09:00:00";
          const [hours, minutes] = startTime.split(':').map(Number);
          const startDate = new Date(parseISO(appointment.appointment_date));
          startDate.setHours(hours, minutes, 0, 0);

          const endDate = addMinutes(startDate, appointment.duration);

          return {
            id: String(appointment.appointment_id),
            clientId: String(appointment.client_id),
            clientName: appointment.first_name,
            professionalId: String(appointment.professional_id),
            professionalName: appointment.professional_name,
            serviceId: String(appointment.service_id),
            serviceName: appointment.service_name,
            date: startDate,
            startTime: format(startDate, "HH:mm"),
            endTime: format(endDate, "HH:mm"),
            duration: appointment.duration,
            status: appointment.status_name,
            statusId: appointment.status_id,
            notes: appointment.appointment_notes
          };
        })

        setAppointments(mappedAppointments)
      }

      setIsNewAppointmentOpen(false)
      setNewAppointment({
        date: new Date(),
        status: "Pendiente",
      })
      setSelectedTimeSlot(null)
      // Mostrar notificación de éxito (react-hot-toast)
      try {
        hotToast.success('Cita creada — exitosamente.')
      } catch (e) {
        // fallback to local toast if hotToast isn't available
        toast({
          title: "Cita creada",
          description: "La cita se ha creado exitosamente.",
        })
      }
    } catch (error) {
      console.error('Error creating appointment:', error)
      // Mostrar notificación de error (react-hot-toast)
      try {
        hotToast.error('Error al crear la cita. Por favor intente de nuevo.')
      } catch (e) {
        // fallback to local toast
        toast({
          title: "Error",
          description: "Error al crear la cita. Por favor intente de nuevo.",
        })
      }
    }
  }

  // Function to update an existing appointment
  const handleUpdateAppointment = async () => {
    if (!selectedAppointment) return;
    const token = getToken();
    console.log("Token en header:", token);
    try {
      // Replace with your actual API endpoint
      const response = await fetch(`${API_BASE}/${tenantId}/modules/agenda/appointments/${selectedAppointment.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`, // Make sure to use your auth token
        },
        body: JSON.stringify({
          client_id: selectedAppointment.clientId,
          professional_id: selectedAppointment.professionalId,
          service_id: selectedAppointment.serviceId,
          appointment_date: format(selectedAppointment.date, 'yyyy-MM-dd'),
          status: selectedAppointment.status,
          status_id: selectedAppointment.statusId,
          start_time: selectedAppointment.startTime,
          appointment_notes: selectedAppointment.notes || '',
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to update appointment')
      }

      // Refresh appointments
      const updatedResponse = await fetch(`${API_BASE}/${tenantId}/modules/agenda/appointments/`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      })
      if (updatedResponse.ok) {
        const data: ApiAppointment[] = await updatedResponse.json()

        const mappedAppointments = data.map(appointment => {
          const startTime = appointment.start_time || "09:00:00";
          const [hours, minutes] = startTime.split(':').map(Number);
          const startDate = new Date(parseISO(appointment.appointment_date));
          startDate.setHours(hours, minutes, 0, 0);

          const endDate = addMinutes(startDate, appointment.duration);

          return {
            id: String(appointment.appointment_id),
            clientId: String(appointment.client_id),
            clientName: appointment.first_name,
            professionalId: String(appointment.professional_id),
            professionalName: appointment.professional_name,
            serviceId: String(appointment.service_id),
            serviceName: appointment.service_name,
            date: startDate,
            startTime: format(startDate, "HH:mm"),
            endTime: format(endDate, "HH:mm"),
            duration: appointment.duration,
            status: appointment.status_name,
            statusId: appointment.status_id,
            notes: appointment.appointment_notes
          };
        })

        setAppointments(mappedAppointments)
      }

      setIsEditAppointmentOpen(false)
      setSelectedAppointment(null)
      toast({
        title: "Cita Actualizada",
        description: "La cita se ha Actualizado exitosamente.",

      });
    } catch (error) {
      console.error('Error updating appointment:', error)
      alert('Error al actualizar la cita. Por favor intente de nuevo.')
      toast({
        title: "Cita No actualizada",
        description: "Error al actualizar la cita. Por favor intente de nuevo.",

      });
    }
  }

  // Function to delete an appointment
  const handleDeleteAppointment = async () => {
    if (!selectedAppointment) return;

    const token = getToken();
    try {
      // Replace with your actual API endpoint
      const response = await fetch(`${API_BASE}/${tenantId}/modules/agenda/appointments/${selectedAppointment.id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`, // Make sure to use your auth token
        },
      })

      if (!response.ok) {
        throw new Error('Failed to delete appointment')
      }

      // Remove the appointment from the state
      setAppointments(appointments.filter(app => app.id !== selectedAppointment.id))
      setIsEditAppointmentOpen(false)
      setSelectedAppointment(null)
      toast({
        title: "Cita Eliminada",
        description: "La cita se ha Eliminada exitosamente.",

      });
    } catch (error) {
      console.error('Error deleting appointment:', error)
      alert('Error al eliminar la cita. Por favor intente de nuevo.')
      toast({
        title: "Cita No eliminada",
        description: "Error al eliminar la cita. Por favor intente de nuevo.",

      });
    }
  }

  const handleCreateClient = async () => {
    const token = getToken();
    try {
      // Asegura que birthDate sea ISO-8601 completo si existe
      let birthDate = newClient.birthDate;
      if (birthDate && /^\d{4}-\d{2}-\d{2}$/.test(birthDate)) {
        birthDate = birthDate + 'T00:00:00.000Z';
      }
      const clientToSend = { ...newClient, birthDate };
      const response = await fetch(`${API_BASE}/${tenantId}/modules/agenda/clients`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`, // Make sure to use your auth token
        },
        body: JSON.stringify(clientToSend),
      })

      if (!response.ok) {
        throw new Error('Failed to create client')
      }
      console.log("Cliente creado exitosamente", response);

      // Refresh clients list
      const updatedResponse = await fetch(`${API_BASE}/${tenantId}/modules/agenda/clients`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })
      if (updatedResponse.ok) {
        const data = await updatedResponse.json()
        setClients(Array.isArray(data) ? data : data.data || []);
      }

      // Close modal and reset form
      setIsNewClientOpen(false)
      setNewClient({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        address: '',
        city: '',
        postalCode: '',
        birthDate: '',
        gender: '',
        howFound: '',
        notes: ''
      })
    } catch (error) {
      console.error('Error creating client:', error)
      alert('Error al crear el cliente. Por favor intente de nuevo.')
    }
  }

  // Function to handle time slot click
  const handleTimeSlotClick = (date: Date, time: string, professionalId: string) => {
    setSelectedTimeSlot({ date, time, professionalId: Number(professionalId) })
    setNewAppointment({
      date,
      startTime: time,
      professionalId,
      status: "Pendiente",
    })
    setIsNewAppointmentOpen(true)
  }

  // Function to handle appointment click
  const handleAppointmentClick = (appointment: Appointment) => {
    console.log("Selected appointment:", appointment);
    setSelectedAppointment(appointment)
    setIsEditAppointmentOpen(true)
  }

  // Debounced filter for clients (search by firstName, lastName, email, phone)
  useEffect(() => {
    const handler = setTimeout(() => {
      const term = clientSearch.trim().toLowerCase()
      if (term === "") {
        setFilteredClients([])
        return
      }

      const filtered = clients.filter((c) => {
        const first = (c.firstName || "").toLowerCase()
        const last = ((c as any).lastName || "").toLowerCase()
        const email = (c.email || "").toLowerCase()
        const phone = (c.phone || "").toLowerCase()
        return (
          first.includes(term) ||
          last.includes(term) ||
          email.includes(term) ||
          phone.includes(term)
        )
      })
      setFilteredClients(filtered)
    }, 200) // debounce 200ms

    return () => clearTimeout(handler)
  }, [clientSearch, clients])

  // Reset client search when the edit modal closes
  useEffect(() => {
    if (!isEditAppointmentOpen) {
      setClientSearch("")
      setFilteredClients([])
    }
  }, [isEditAppointmentOpen])

  // Function to get professional color
  const getProfessionalColor = (professionalId: string) => {
    const professional = professionals.find((p) => p.professional_id === professionalId)
    return professional?.color || "#9B177E" // Default color if not found
  }

  // Generate hours for the schedule
  const hours = Array.from({ length: 12 }, (_, i) => 8 + i)
  const fullHours = Array.from({ length: 24 }, (_, i) => i)

  // Get days of current week
  const weekDays = eachDayOfInterval({
    start: startOfWeek(currentDate, { locale: es }),
    end: endOfWeek(currentDate, { locale: es }),
  })

  // Get days of current month
  const monthDays = eachDayOfInterval({
    start: startOfMonth(currentDate),
    end: endOfMonth(currentDate),
  })


  // Function to render day view
  const renderDayView = () => {
    // Filtrar solo citas PENDING, IN_PROGRESS o POSTPONED
    const allowedStatuses = ["PENDING", "IN_PROGRESS", "POSTPONED"];
    const dayAppointments = appointments.filter(
      (appointment) =>
        isSameDay(appointment.date, currentDate) &&
        allowedStatuses.includes(String(appointment.status).toUpperCase())
    );

    return (
      <div
        ref={dayViewRef}
        className="grid grid-cols-8 gap-4 overflow-y-auto"
        style={{ maxHeight: "490px" }}
      >
        {/* Columna izquierda (horario) */}
        <div className="col-span-1 border-r pr-2 sticky left-0 bg-white relative z-30">
          <div className="text-center font-medium mb-4 sticky top-0 bg-white py-2">
            Horario
          </div>
          {hours.map((hour) => (
            <div
              key={hour}
              className="h-20 flex items-center justify-center text-sm text-gray-500"
            >
              {hour}:00
            </div>
          ))}
          {/* Línea de tiempo actual */}
          {currentLineTop !== null && (
            <div
              style={{ top: `${currentLineTop}px` }}
              className="absolute left-0 right-0 h-[2px] bg-red-500 z-30"
            />
          )}
        </div>

        {/* Columna derecha (profesionales con citas) */}
        <div
          className="
          col-span-7 
          gap-4 
          overflow-x-auto 
          scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent
        "
          style={{
            display: "grid",
            gridTemplateColumns: `
            repeat(${Math.min(professionals.length, 6)}, minmax(250px, 1fr))
          `,
            gap: "1rem",
          }}
        >
          {professionals.map((professional) => {
            // Filtrar citas del profesional en el día
            const professionalAppointments = dayAppointments.filter(
              (app) => app.professionalId === professional.professional_id
            );

            return (
              <div
                key={professional.professional_id}
                className="
                min-w-[250px] 
                sm:min-w-[280px] 
                md:min-w-[320px]
                lg:min-w-0
              "
              >
                {/* Header profesional */}
                <div className="text-center font-medium mb-4 sticky top-0 bg-white py-2 border-b z-20">
                  {professional.professional_name}
                  <div className="text-xs text-gray-500">
                    {professional.specialty}
                  </div>
                </div>

                {/* Slots + citas */}
                <div
                  className="relative"
                  style={{ height: `${hours.length * 80}px` }}
                >
                  {/* Línea de tiempo en cada columna */}
                  {currentLineTop !== null && (
                    <div
                      style={{ top: `${currentLineTop}px` }}
                      className="absolute left-0 right-0 h-[2px] bg-red-500 z-20"
                    />
                  )}

                  {/* Slots clickeables */}
                  {hours.map((hour) => (
                    <div
                      key={`slot-${professional.professional_id}-${hour}`}
                      className="absolute w-full h-20 border-t border-gray-100 cursor-pointer hover:bg-purple-200"
                      style={{ top: `${(hour - 8) * 80}px` }}
                      onClick={() =>
                        handleTimeSlotClick(
                          currentDate,
                          `${hour}:00`,
                          professional.professional_id
                        )
                      }
                    ></div>
                  ))}

                  {/* Citas existentes */}
                  {professionalAppointments.map((appointment) => {
                    const startHour = parseInt(
                      appointment.startTime.split(":")[0],
                      10
                    );
                    const startMin = parseInt(
                      appointment.startTime.split(":")[1],
                      10
                    );

                    // Posición y tamaño
                    const top =
                      (startHour - 8) * 80 + (startMin / 60) * 80;
                    const height = (appointment.duration / 60) * 80;

                    return (
                      <div
                        key={appointment.id}
                        className="absolute rounded-lg p-2 text-sm cursor-pointer transition-all hover:opacity-90 z-10 shadow-md"
                        style={{
                          top: `${top}px`,
                          height: `${height}px`,
                          left: "0",
                          right: "0",
                          backgroundColor: getProfessionalColor(
                            appointment.professionalId
                          ),
                          color: "#fff",
                        }}
                        onClick={(e) => {
                          e.stopPropagation(); // Evitar click en slot
                          handleAppointmentClick(appointment);
                        }}
                      >
                        <div className="font-medium">
                          {appointment.clientName}
                        </div>
                        <div>{appointment.serviceName}</div>
                        <div className="text-xs opacity-80">
                          {appointment.startTime} - {appointment.endTime}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };


  // Vista móvil (tipo Google Calendar con profesionales)
  const renderDayViewMobile = () => {
    const allowedStatuses = ["PENDING", "IN_PROGRESS", "POSTPONED"];
    const dayAppointments = appointments.filter(
      (appointment) =>
        isSameDay(appointment.date, currentDate) &&
        allowedStatuses.includes(String(appointment.status).toUpperCase())
    );

    return (
      <div className="flex flex-col w-full">
        {hours.map((hour) => {
          // Filtrar citas que caen en esta hora
          const hourAppointments = dayAppointments.filter((appointment) => {
            const startHour = parseInt(appointment.startTime.split(":")[0], 10);
            return startHour === hour;
          });

          // Obtener profesionales únicos que tienen citas en esta hora
          const proIdsInHour = Array.from(
            new Set(hourAppointments.map((a) => a.professionalId))
          );

          return (
            <div
              key={hour}
              className="relative flex border-b border-gray-200 h-[70px] cursor-pointer"
              onClick={() =>
                handleTimeSlotClick(currentDate, `${hour}:00`, "") // "" => elegirá profesional luego
              }
            >
              {/* Columna hora */}
              <div className="w-16 flex items-start justify-center text-xs text-gray-500 pt-2">
                {hour}:00
              </div>

              {/* Citas de esta hora organizadas por profesional (columnas dinámicas) */}
              <div className="flex-1 relative">
                {proIdsInHour.length === 0 ? (
                  <div className="h-20"></div>
                ) : (
                  <div className="flex w-full h-full gap-2 items-start">
                    {proIdsInHour.map((proId) => {
                      const proAppointments = hourAppointments.filter(
                        (a) => a.professionalId === proId
                      );
                      const professional = professionals.find(
                        (p) => p.professional_id === proId
                      );

                      return (
                        <div key={proId} className="relative flex-1 min-w-0">


                          {/* Citas del profesional en este hour (posicionadas por minutos) */}
                          {proAppointments.map((appointment) => {
                            const startMin = parseInt(
                              appointment.startTime.split(":")[1],
                              10
                            );
                            const height = (appointment.duration / 60) * 70;
                            const top = (startMin / 60) * 70;

                            return (
                              <div
                                key={appointment.id}
                                className="absolute left-0 right-0 rounded-lg p-2 text-xs cursor-pointer transition-all hover:opacity-90 shadow-md text-white"
                                style={{
                                  top: `${top}px`,
                                  height: `${height}px`,
                                  backgroundColor: getProfessionalColor(
                                    appointment.professionalId
                                  ),
                                }}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleAppointmentClick(appointment);
                                }}
                              >
                                <div className="font-medium truncate">
                                  {appointment.clientName}
                                </div>
                                <div className="truncate">{appointment.serviceName}</div>
                                <div className="text-[10px] opacity-80">
                                  {appointment.startTime} - {appointment.endTime}
                                </div>
                                {/* Nombre del profesional (pequeño) */}
                                {professional && (
                                  <div className="text-[10px] italic truncate opacity-80 px-1">
                                    {professional.professional_name}
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    );
  };


  // Auto-scroll to first appointment in day view
  useEffect(() => {
    if (viewMode !== "dia") return
    // find earliest appointment for currentDate
    const dayAppointments = appointments
      .filter((a) => isSameDay(a.date, currentDate))
      .sort((x, y) => {
        const [xh, xm] = x.startTime.split(":").map(Number)
        const [yh, ym] = y.startTime.split(":").map(Number)
        return xh === yh ? xm - ym : xh - yh
      })

    if (!dayAppointments || dayAppointments.length === 0) return

    const first = dayAppointments[0]
    // compute pixels from top: each hour slot height = 80 (as used in renderDayView)
    const [hourStr, minuteStr] = first.startTime.split(":")
    const hour = parseInt(hourStr, 10)
    const minute = parseInt(minuteStr, 10)
    const slotTop = (hour - 8) * 80 + (minute / 60) * 80

    // scroll the container to show the appointment near top with some offset
    // dayViewRef points to the grid wrapper; the scrollable element is this div
    const container = dayViewRef.current
    if (container) {
      // ensure value within bounds
      const maxScroll = container.scrollHeight - container.clientHeight
      const target = Math.max(0, Math.min(slotTop - 20, maxScroll))
      container.scrollTo({ top: target, behavior: "smooth" })
    }
  }, [viewMode, currentDate, appointments])

  // Update current time indicator position every minute when viewing 'dia'
  useEffect(() => {
    if (viewMode !== "dia") {
      setCurrentLineTop(null)
      return
    }

    const updatePosition = () => {
      const now = new Date()
      // Only show line when currentDate is today
      if (!isSameDay(now, currentDate)) {
        setCurrentLineTop(null)
        return
      }

      const hour = now.getHours()
      const minute = now.getMinutes()
      // Only show within visible range (8:00 - 20:00)
      if (hour < 8 || hour >= 20) {
        setCurrentLineTop(null)
        return
      }

      const top = (hour - 8) * 80 + (minute / 60) * 80
      setCurrentLineTop(top)
    }

    updatePosition()
    const id = setInterval(updatePosition, 60 * 1000) // every minute
    return () => clearInterval(id)
  }, [viewMode, currentDate])

  // Function to render week view
  const renderWeekView = () => {
    return (
      <div className="overflow-y-auto" style={{ maxHeight: "490px" }}>
        <div className="grid grid-cols-8 gap-1">
          {/* Header with days of the week */}
          <div className="sticky top-0 bg-white z-10 border-b">
            <div className="h-16 flex items-center justify-center font-medium">Hora</div>
          </div>
          {weekDays.map((day, index) => (
            <div key={index} className="sticky top-0 bg-white z-10 border-b">
              <div className="h-16 flex flex-col items-center justify-center">
                <div className="font-medium">{format(day, "EEEE", { locale: es })}</div>
                <div
                  className={`text-sm ${isSameDay(day, new Date()) ? "bg-purple-500 text-white rounded-full w-6 h-6 flex items-center justify-center mt-1" : ""}`}
                >
                  {format(day, "d")}
                </div>
              </div>
            </div>
          ))}

          {/* Hour rows */}
          {fullHours
            .filter((hour) => hour >= 8 && hour < 20)
            .map((hour) => (
              <React.Fragment key={`hour-${hour}`}>
                <div className="border-t py-2 px-2 text-sm text-gray-500 sticky left-0 bg-white">{hour}:00</div>
                {weekDays.map((day, dayIndex) => (
                  <div
                    key={`slot-${dayIndex}-${hour}`}
                    className="border-t border-l min-h-[60px] relative hover:bg-purple-200 cursor-pointer"
                    onClick={() => handleTimeSlotClick(day, `${hour}:00`, String(professionals[0]?.professional_id || 0))}                  >
                    {/* Render appointments for this day and hour, excluding cancelled */}
                    {(() => {
                      let slotAppointments = appointments.filter(
                        (appointment) =>
                          isSameDay(appointment.date, day) &&
                          parseInt(appointment.startTime.split(":")[0], 10) === hour &&
                          ["PENDING", "IN_PROGRESS", "POSTPONED"].includes(
                            String(appointment.status).toUpperCase()
                          )
                      )

                      if (slotAppointments.length === 0) return null

                      // Show the latest-created appointment first
                      slotAppointments = slotAppointments.sort((a, b) => {
                        const ta = a.createdAt ? new Date(a.createdAt).getTime() : 0
                        const tb = b.createdAt ? new Date(b.createdAt).getTime() : 0
                        return tb - ta
                      })

                      if (slotAppointments.length === 1) {
                        const appointment = slotAppointments[0]
                        return (
                          <div
                            key={appointment.id}
                            className="absolute left-0 right-0 rounded-sm p-1 text-xs overflow-hidden cursor-pointer"
                            style={{
                              backgroundColor: getProfessionalColor(appointment.professionalId),
                              color: "#fff",
                              height: "60px",
                            }}
                            onClick={(e) => {
                              e.stopPropagation(); // Prevent triggering the time slot click
                              handleAppointmentClick(appointment);
                            }}
                          >
                            <div className="font-medium truncate">{appointment.clientName}</div>
                            <div className="truncate">{appointment.serviceName}</div>
                          </div>
                        )
                      }

                      // Multiple appointments in this slot: show count pill that navigates to day view
                      return (
                        <div
                          key={`slot-count-${dayIndex}-${hour}`}
                          className="absolute left-0 right-0 flex items-center justify-center"
                        >
                          <button
                            className="bg-purple-600 text-white rounded-full px-2 py-1 text-xs hover:bg-purple-700"
                            onClick={(e) => {
                              e.stopPropagation()
                              // switch to day view for this date
                              setCurrentDate(day)
                              setViewMode("dia")
                            }}
                          >
                            +{slotAppointments.length} citas
                          </button>
                        </div>
                      )
                    })()}
                  </div>
                ))}
              </React.Fragment>
            ))}
        </div>
      </div>
    )
  }

  // Vista móvil de la semana en cuadrícula (mejorada con paleta clara)
  const renderWeekViewMobile = () => {
    const allowedStatuses = ["PENDING", "IN_PROGRESS", "POSTPONED"];
    const cellHeight = 64; // alto de cada hora en px

    return (
      <div className="w-full overflow-y-auto bg-white h-[390px] text-gray-800">
        {/* Encabezado de los días */}
        <div
          className="grid border-b border-gray-200 bg-gray-50"
          style={{ gridTemplateColumns: `60px repeat(7, 1fr)` }}
        >
          {/* Espacio vacío arriba de las horas */}
          <div></div>
          {weekDays.map((day, index) => (
            <div
              key={index}
              className="py-2 text-center border-l border-gray-200 first:border-l-0"
            >
              <div className="text-sm font-medium text-gray-700">
                {format(day, "EEE", { locale: es })}
              </div>
              <div
                className={`mt-1 text-sm ${isSameDay(day, new Date())
                  ? "bg-purple-600 text-white rounded-full w-6 h-6 flex items-center justify-center mx-auto"
                  : "text-gray-600"
                  }`}
              >
                {format(day, "d")}
              </div>
            </div>
          ))}
        </div>

        {/* Grid de horas × días */}
        <div
          className="grid"
          style={{
            gridTemplateColumns: `60px repeat(7, 1fr)`,
          }}
        >
          {fullHours
            .filter((hour) => hour >= 8 && hour < 23)
            .map((hour) => (
              <React.Fragment key={hour}>
                {/* Columna lateral con las horas */}
                <div
                  className="border-t border-gray-200 text-xs text-gray-500 flex items-start justify-end pr-1 bg-white"
                  style={{ height: `${cellHeight}px` }}
                >
                  {hour}:00
                </div>

                {/* 7 días en esa fila */}
                {weekDays.map((day, dayIndex) => {
                  const dayAppointments = appointments.filter(
                    (appointment) =>
                      isSameDay(appointment.date, day) &&
                      allowedStatuses.includes(String(appointment.status).toUpperCase()) &&
                      parseInt(appointment.startTime.split(":")[0], 10) === hour
                  );

                  if (dayAppointments.length === 0) {
                    return (
                      <div
                        key={`hour-${hour}-day-${dayIndex}`}
                        className="relative border-t border-l cursor-pointer border-gray-200 hover:bg-purple-50 transition-colors"
                        style={{ height: `${cellHeight}px` }}
                        onClick={() =>
                          handleTimeSlotClick(day, `${hour}:00`, String(professionals[0]?.professional_id || ""))
                        }
                      />
                    );
                  }

                  // Show single appointment if only one
                  if (dayAppointments.length === 1) {
                    const appointment = dayAppointments[0];
                    const startMin = parseInt(appointment.startTime.split(":")[1], 10);
                    const height = (appointment.duration / 60) * cellHeight;
                    const top = (startMin / 60) * cellHeight;

                    return (
                      <div
                        key={`hour-${hour}-day-${dayIndex}`}
                        className="relative border-t border-l cursor-pointer border-gray-200 hover:bg-purple-50 transition-colors"
                        style={{ height: `${cellHeight}px` }}
                        onClick={() => handleTimeSlotClick(day, `${hour}:00`, String(appointment.professionalId || professionals[0]?.professional_id || ""))}
                      >
                        <div
                          className="absolute left-1 right-1 rounded-sm p-1 text-xs overflow-hidden cursor-pointer"
                          style={{
                            top: `${top}px`,
                            height: `${height}px`,
                            backgroundColor: getProfessionalColor(appointment.professionalId),
                            color: "#fff",
                          }}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleAppointmentClick(appointment);
                          }}
                        >
                          <div className="font-medium truncate">{appointment.clientName}</div>
                          <div className="truncate">{appointment.serviceName}</div>
                        </div>
                      </div>
                    );
                  }

                  // Multiple appointments: show +N pill that navigates to day view
                  return (
                    <div
                      key={`hour-${hour}-day-${dayIndex}`}
                      className="relative border-t border-l cursor-pointer border-gray-200 hover:bg-purple-50 transition-colors"
                      style={{ height: `${cellHeight}px` }}
                    >
                      <div className="absolute left-0 right-0 flex items-center justify-center">
                        <button
                          className="bg-purple-600 text-white  px-1 py-1 text-xs hover:bg-purple-700"
                          onClick={(e) => {
                            e.stopPropagation();
                            setCurrentDate(day);
                            setViewMode("dia");
                          }}
                        >
                          +{dayAppointments.length} citas
                        </button>
                      </div>
                    </div>
                  );
                })}
              </React.Fragment>
            ))}
        </div>
      </div>
    );
  };


  // Function to render month view
  const renderMonthView = () => {
    // Calculate the first day of the week of the month
    const firstDayOfMonth = startOfMonth(currentDate)
    const startDate = startOfWeek(firstDayOfMonth, { locale: es })

    // Calculate the last day of the month
    const lastDayOfMonth = endOfMonth(currentDate)
    const endDate = endOfWeek(lastDayOfMonth, { locale: es })

    // Get all days to be displayed in the calendar
    const calendarDays = eachDayOfInterval({ start: startDate, end: endDate })

    // Group days into weeks
    const weeks: Date[][] = []
    let currentWeek: Date[] = []

    calendarDays.forEach((day) => {
      currentWeek.push(day)
      if (currentWeek.length === 7) {
        weeks.push(currentWeek)
        currentWeek = []
      }
    })

    return (
      <div className="bg-white rounded-lg overflow-hidden">
        <div className="grid grid-cols-7 gap-px bg-gray-200">
          {/* Week day headers */}
          {[
            "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"
          ].map((day) => (
            <div key={day} className="bg-white p-2 text-center font-medium text-sm">
              {day}
            </div>
          ))}

          {/* Calendar days */}
          {weeks.map((week, weekIndex) => (
            <React.Fragment key={`week-${weekIndex}`}>
              {week.map((day, dayIndex) => {
                const isCurrentMonth = isSameMonth(day, currentDate)
                const isToday = isSameDay(day, new Date())
                // Solo mostrar citas PENDING, IN_PROGRESS o POSTPONED
                const dayAppointments = appointments.filter((appointment) =>
                  isSameDay(appointment.date, day) &&
                  ["PENDING", "IN_PROGRESS", "POSTPONED"].includes(String(appointment.status).toUpperCase())
                )

                return (
                  <div
                    key={`day-${weekIndex}-${dayIndex}`}
                    className={`bg-white border-t p-1 min-h-[100px] ${isCurrentMonth ? "" : "text-gray-400"} ${isToday ? "bg-blue-50" : ""}`}
                    onClick={() => {
                      setCurrentDate(day)
                      setViewMode("dia")
                    }}
                  >
                    <div className="flex justify-between items-center mb-1">
                      <span
                        className={`text-sm font-medium ${isToday ? "bg-black text-white rounded-full w-6 h-6 flex items-center justify-center" : ""}`}
                      >
                        {format(day, "d")}
                      </span>
                      {dayAppointments.length > 0 && (
                        <span className="text-xs bg-blue-100 text-blue-800 rounded-full px-2 py-0.5">
                          {dayAppointments.length}
                        </span>
                      )}
                    </div>

                    {/* Show the first 3 appointments of the day */}
                    <div className="space-y-1">
                      {dayAppointments.slice(0, 3).map((appointment) => (
                        <div
                          key={appointment.id}
                          className="text-xs p-1 rounded truncate cursor-pointer"
                          style={{ backgroundColor: getProfessionalColor(appointment.professionalId), color: "#fff" }}
                          onClick={(e) => {
                            e.stopPropagation(); // Prevent triggering the day click
                            handleAppointmentClick(appointment);
                          }}
                        >
                          {appointment.startTime} - {appointment.clientName}
                        </div>
                      ))}

                      {/* Indicator for more appointments */}
                      {dayAppointments.length > 3 && (
                        <div className="text-xs text-center text-gray-500">+{dayAppointments.length - 3} más</div>
                      )}
                    </div>
                  </div>
                )
              })}
            </React.Fragment>
          ))}
        </div>
      </div>
    )
  }

  // Helper: verifica si una fecha es permitida por los working_hours de un profesional
  const isDateAllowed = (date: Date | null | undefined, profId?: string | number | null) => {
    if (!date) return false
    if (!profId) return true // si no hay profesional seleccionado, permitir
    const prof = professionals.find((p) => String(p.professional_id) === String(profId)) as any
    const working = prof?.working_hours
    if (!working || working.length === 0) return true
    const iso = getISODay(date)
    const allowed = working.map((w: any) => Number(w.dayOfWeek))
    return allowed.includes(iso)
  }

  // 📱 Vista mensual para móviles
  const renderMonthViewMobile = () => {
    const firstDayOfMonth = startOfMonth(currentDate)
    const startDate = startOfWeek(firstDayOfMonth, { locale: es })
    const lastDayOfMonth = endOfMonth(currentDate)
    const endDate = endOfWeek(lastDayOfMonth, { locale: es })
    const calendarDays = eachDayOfInterval({ start: startDate, end: endDate })

    return (
      <div className="bg-white rounded-lg overflow-hidden">
        {/* Encabezado de días */}
        <div className="grid grid-cols-7 text-[10px] text-gray-600 bg-gray-100">
          {["L", "M", "X", "J", "V", "S", "D"].map((day) => (
            <div key={day} className="p-1 text-center font-medium">
              {day}
            </div>
          ))}
        </div>

        {/* Días del calendario */}
        <div className="grid grid-cols-7 text-[11px]">
          {calendarDays.map((day, i) => {
            const isCurrentMonth = isSameMonth(day, currentDate)
            const isToday = isSameDay(day, new Date())
            const dayAppointments = appointments.filter(
              (appointment) =>
                isSameDay(appointment.date, day) &&
                ["PENDING", "IN_PROGRESS", "POSTPONED"].includes(
                  String(appointment.status).toUpperCase()
                )
            )

            return (
              <div
                key={i}
                className={`border p-1 h-16 flex flex-col justify-between ${isCurrentMonth ? "" : "text-gray-400 bg-gray-50"
                  } ${isToday ? "bg-blue-50 border-blue-300" : ""}`}
                onClick={() => {
                  setCurrentDate(day)
                  setViewMode("dia")
                }}
              >
                <div className="flex justify-between items-center">
                  <span
                    className={`text-[11px] ${isToday
                      ? "bg-black text-white rounded-full w-5 h-5 flex items-center justify-center"
                      : ""
                      }`}
                  >
                    {format(day, "d")}
                  </span>
                  {dayAppointments.length > 0 && (
                    <span className="text-[9px] bg-blue-100 text-blue-800 rounded-full px-1">
                      {dayAppointments.length}
                    </span>
                  )}
                </div>

                {/* Muestra solo 1 cita por día en móvil */}
                {dayAppointments.length > 0 && (
                  <div
                    onClick={(e) => {
                      e.stopPropagation()
                      handleAppointmentClick(dayAppointments[0])
                    }}
                    className="mt-1 text-[9px] p-1 rounded truncate text-white"
                    style={{
                      backgroundColor: getProfessionalColor(dayAppointments[0].professionalId),
                    }}
                  >
                    {dayAppointments[0].clientName}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    )
  }





  // Puedes poner esto arriba en tu archivo
  const statusColors: Record<string, string> = {
    PENDING: "#fbbf24",      // Amarillo
    IN_PROGRESS: "#3b82f6",  // Azul
    COMPLETED: "#22c55e",    // Verde
    CANCELLED: "#ef4444",    // Rojo
    POSTPONED: "#a855f7",    // Morado
  };

  return (

    <AuthGuard>
      <ModuleLayout moduleType="agenda">
        <main className="flex-1 overflow-y-auto b md:p-4 md:p-9">
          <div className="flex flex-col sm:flex-row  bg-gray-50">
            <div className="flex flex-col flex-1 overflow-hidden">
              <main className="flex-1 md:p-4 md:p-9">

                {/* Header */}
                <div className=" md:flex  md:flex-row  md:items-center md:justify-between gap-4 mb-6">
                  <h1 className="text-xl sm:text-2xl font-bold text-center sm:text-left">Agenda y Citas</h1>
                  <div className=" hidden md:flex  flex-col sm:flex-row gap-2">
                    <Button
                      onClick={() => setIsNewAppointmentOpen(true)}
                      className="bg-purple-500 hover:bg-purple-800 w-full sm:w-auto cursor-pointer hover:scale-95"
                    >
                      <PlusIcon className="mr-2 h-4 w-4" />
                      Nueva Cita
                    </Button>
                    <Button
                      onClick={() => setIsNewClientOpen(true)}
                      variant="outline"
                      className="w-full sm:w-auto cursor-pointer hover:scale-95"
                    >
                      <PlusIcon className="mr-2 h-4 w-4" />
                      Crear Cliente
                    </Button>
                  </div>
                </div>

                {/* Calendario */}
                <div className="bg-white rounded-xl p-4 sm:p-6 md:shadow-xl mb-6">

                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-4">

                    {/* Botones Día/Semana/Mes */}
                    <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
                      <Button
                        variant={viewMode === "dia" ? "default" : "outline"}
                        className={viewMode === "dia" ? "bg-purple-500 hover:scale-95 text-white hover:bg-purple-800 cursor-pointer" : "cursor-pointer hover:scale-95 hover:bg-purple-400 hover:text-white "}
                        onClick={() => setViewMode("dia")}
                        size="sm"
                      >
                        Día
                      </Button>
                      <Button
                        variant={viewMode === "semana" ? "default" : "outline"}
                        className={viewMode === "semana" ? "bg-purple-500 hover:scale-95 text-white hover:bg-purple-800 cursor-pointer " : "cursor-pointer hover:scale-95 hover:bg-purple-400 hover:bg-purple-400 hover:text-white "}
                        onClick={() => setViewMode("semana")}
                        size="sm"
                      >
                        Semana
                      </Button>
                      <Button
                        variant={viewMode === "mes" ? "default" : "outline"}
                        className={viewMode === "mes" ? "bg-purple-500 cursor-pointer hover:bg-purple-800 hover:scale-95  text-white" : "cursor-pointer hover:scale-95 hover:bg-purple-400 hover:bg-purple-400 hover:text-white "}
                        onClick={() => setViewMode("mes")}
                        size="sm"
                      >
                        Mes
                      </Button>
                    </div>

                    {/* Navegación de fechas */}
                    <div className="flex flex-wrap justify-center sm:justify-end gap-2 items-center">
                      <Button variant="outline" className="cursor-pointer hover:scale-96 " size="icon" onClick={() => changeDate(-1)}>
                        <ChevronLeftIcon className="h-4 w-4" />
                      </Button>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button variant="outline" className=" sm:w-auto text-sm">
                            {format(currentDate, "EEEE, d MMMM yyyy", { locale: es })}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={currentDate}
                            onSelect={(date) => date && setCurrentDate(date)}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <Button className="cursor-pointer hover:scale-96 " variant="outline" size="icon" onClick={() => changeDate(1)}>
                        <ChevronRightIcon className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Vista Calendario */}
                  <div ref={calendarRef} className="overflow-y-auto max-h-[390px] md:max-h-[490px] " >
                    {isLoading ? (
                      <div className="flex justify-center items-center h-64">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
                      </div>
                    ) : appointments.length === 0 ? (
                      <div className="flex flex-col justify-center items-center h-64 text-gray-500">
                        <p className="text-lg">No hay citas programadas</p>
                        <Button
                          variant="outline"
                          className="mt-4 shadow-lg hover:scale-95"
                          onClick={() => setIsNewAppointmentOpen(true)}
                        >
                          Crear nueva cita
                        </Button>
                      </div>
                    ) : (
                      <>
                        {/* Desktop */}
                        <div className="hidden sm:block">
                          {viewMode === "dia" && renderDayView()}
                        </div>

                        {/* Mobile */}
                        <div className="block sm:hidden">
                          {viewMode === "dia" && renderDayViewMobile()}
                        </div>

                        {/* Vista semana */}
                        <div className="hidden sm:block">
                          {viewMode === "semana" && renderWeekView()}
                        </div>
                        <div className="block sm:hidden">
                          {viewMode === "semana" && renderWeekViewMobile()}
                        </div>

                        <div className="hidden sm:block">
                          {viewMode === "mes" && renderMonthView()}
                        </div>
                        <div className="block sm:hidden">
                          {viewMode === "mes" && renderMonthViewMobile()}
                        </div>
                      </>
                    )}
                  </div>

                </div>
              </main>
            </div>

            {/* Modal para crear nueva cita */}
            <Dialog
              open={isNewAppointmentOpen}
              onOpenChange={(open) => {
                setIsNewAppointmentOpen(open);

                if (!open) {
                  // 🔹 limpiar estados cuando el modal se cierra
                  setClientSearch("");
                  setFilteredClients([]);
                  setAvailableSlots([]);
                  setNewAppointment({
                    clientId: "",
                    clientName: "",
                    date: undefined,
                    startTime: "",
                    endTime: "",
                    professionalId: "",
                    serviceId: "",
                  });
                }
              }}
            >
              <DialogContent className="sm:max-w-[500px] rounded-2xl shadow-xl">
                <DialogHeader>
                  <DialogTitle className="text-xl font-semibold text-gray-800">
                    🆕 Crear Nueva Cita
                  </DialogTitle>
                </DialogHeader>

                <div className="grid gap-4 py-4">
                  {/* Cliente con buscador */}
                  <div className="grid grid-cols-4 items-center gap-4 relative">
                    <Label htmlFor="new-client" className="text-right">
                      Cliente
                    </Label>
                    <Input
                      id="new-client-search"
                      placeholder="Buscar cliente..."
                      value={clientSearch}
                      onChange={(e) => {
                        setClientSearch(e.target.value);
                        if (e.target.value.length > 0) {
                          setFilteredClients(
                            clients.filter((c) =>
                              c.firstName.toLowerCase().includes(e.target.value.toLowerCase())
                            )
                          );
                        } else {
                          setFilteredClients([]);
                        }
                      }}
                      className="col-span-3"
                    />

                    {/* Dropdown absoluto */}
                    {filteredClients.length > 0 && (
                      <div className="absolute left-[25%] top-full mt-1 w-[75%] z-20 max-h-40 overflow-auto rounded-md border bg-white shadow-lg">
                        {filteredClients.map((client) => (
                          <button
                            key={client.client_id}
                            type="button"
                            className="w-full cursor-pointer text-left px-3 py-2 hover:bg-gray-100"
                            onClick={() => {
                              setNewAppointment({
                                ...newAppointment,
                                clientId: String(client.client_id),
                              });
                              setClientSearch(client.firstName);
                              setFilteredClients([]); // ahora se cierra de una
                            }}
                          >
                            <div className="text-sm font-medium">{client.firstName}</div>
                            <div className="text-xs text-gray-500">
                              {client.email || client.phone}
                            </div>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>


                  {/* Profesional */}
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="professional" className="text-right">
                      Profesional
                    </Label>
                    <Select
                      onValueChange={(value) => setNewAppointment({ ...newAppointment, professionalId: value })}
                      value={newAppointment.professionalId ? String(newAppointment.professionalId) : undefined}
                    >
                      <SelectTrigger className="col-span-3 w-full">
                        <SelectValue placeholder="Seleccionar profesional" />
                      </SelectTrigger>
                      <SelectContent>
                       {professionals.filter(prof => prof.status === "ACTIVE").map((professional) => (
                          <SelectItem key={professional.professional_id} value={String(professional.professional_id)}>
                            {professional.professional_name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Servicio */}
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="service" className="text-right">
                      Servicio
                    </Label>
                    <Select
                      onValueChange={(value) => setNewAppointment({ ...newAppointment, serviceId: value })}
                      value={newAppointment.serviceId ? String(newAppointment.serviceId) : undefined}
                    >
                      <SelectTrigger className="col-span-3 w-full">
                        <SelectValue placeholder="Seleccionar servicio" />
                      </SelectTrigger>
                      <SelectContent>
                        {services.map((service) => (
                          <SelectItem key={service.service_id} value={String(service.service_id)}>
                            {service.service_name} - ${service.price.toLocaleString()} ({service.duration} min)
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Fecha */}
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="date" className="text-right ">
                      Fecha
                    </Label>
                    {newAppointment.professionalId ? (
                      <Popover>
                        <PopoverTrigger asChild>
                          <div className="col-span-3 flex items-center gap-2">
                            <input
                              type="text"
                              className="w-full rounded-md border px-2 py-1"
                              value={newAppointment.date ? format(newAppointment.date, 'yyyy-MM-dd') : ''}
                              readOnly
                              placeholder="Seleccionar fecha"
                            />
                            <Button variant="outline" className="px-2 py-1">📅</Button>
                          </div>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={newAppointment.date}
                            onSelect={(date) => date && setNewAppointment({ ...newAppointment, date })}
                            initialFocus
                            disabled={(date) => {
                              const profId = newAppointment.professionalId
                              if (!profId) return false
                              const prof = professionals.find((p) => String(p.professional_id) === String(profId)) as any
                              const working = prof?.working_hours
                              if (!working || working.length === 0) return false
                              const iso = getISODay(date)
                              const allowed = working.map((w: any) => Number(w.dayOfWeek))
                              return !allowed.includes(iso)
                            }}
                          />
                        </PopoverContent>
                      </Popover>
                    ) : (
                      <div className="col-span-3 flex items-center gap-2">
                        <input
                          type="text"
                          className="w-full rounded-md border px-2 py-1"
                          value=""
                          readOnly
                          disabled
                          placeholder="Selecciona un profesional primero"
                        />
                        <Button variant="outline" className="px-2 py-1" disabled>📅</Button>
                      </div>
                    )}
                  </div>

                  {/* Hora Inicio */}
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="startTime" className="text-right whitespace-nowrap">
                      Hora Inicio
                    </Label>
                    <Select
                      onValueChange={(value) => setNewAppointment({ ...newAppointment, startTime: value })}
                      value={newAppointment.startTime || ""}
                      disabled={!newAppointment.date || isLoadingSlots}
                    >
                      <SelectTrigger className="col-span-3 w-full">
                        <SelectValue placeholder={
                          !newAppointment.date 
                            ? "Seleccionar fecha primero" 
                            : isLoadingSlots 
                            ? "Cargando horarios..." 
                            : "Seleccionar hora"
                        } />
                      </SelectTrigger>
                      <SelectContent>
                        {availableSlots.length > 0 ? (
                          availableSlots.map((slot) => (
                            <SelectItem 
                              key={slot.time} 
                              value={slot.time}
                              disabled={!slot.available}
                            >
                              {slot.time}
                            </SelectItem>
                          ))
                        ) : (
                          <div className="px-2 py-1.5 text-sm text-gray-500">
                            {isLoadingSlots ? "Cargando..." : "No hay horarios disponibles"}
                          </div>
                        )}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Notas */}
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="notes" className="text-right">
                      Notas
                    </Label>
                    <Textarea
                      id="notes"
                      className="col-span-3 w-full"
                      placeholder="Notas adicionales"
                      value={newAppointment.notes || ""}
                      onChange={(e) => setNewAppointment({ ...newAppointment, notes: e.target.value })}
                    />
                  </div>
                </div>

                {/* Footer con botones como el de Editar */}
                <DialogFooter className="flex justify-between pt-4">
                  <Button
                    variant="outline"
                    onClick={() => setIsNewAppointmentOpen(false)}
                    className="rounded-xl cursor-pointer hover:scale-95"
                  >
                    Cancelar
                  </Button>
                  <Button
                    onClick={handleCreateAppointment}
                    className="rounded-xl bg-purple-500 hover:bg-purple-800 text-white cursor-pointer hover:scale-95"
                  >
                    Guardar
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>


            {/* Modal para editar cita */}
            <Dialog
              open={isEditAppointmentOpen}
              onOpenChange={(open) => {
                setIsEditAppointmentOpen(open);
                if (!open) {
                  setSelectedAppointment(null);
                  setAvailableSlotsEdit([]);
                  setClientSearch("");
                  setFilteredClients([]);
                }
              }}
            >
              <DialogContent className="sm:max-w-[500px] rounded-2xl shadow-xl">
                <DialogHeader>
                  <DialogTitle className="text-xl font-semibold text-gray-800">
                    ✏️ Editar Cita
                  </DialogTitle>
                </DialogHeader>

                {selectedAppointment && (
                  <div className="grid gap-4 py-4">

                    {/* Cliente */}
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="edit-client" className="text-right">
                        Cliente
                      </Label>
                      <Input
                        id="edit-client-search"
                        placeholder="Buscar cliente..."
                        value={clientSearch}
                        onChange={(e) => {
                          setClientSearch(e.target.value);
                          if (e.target.value.length > 0) {
                            setFilteredClients(clients.filter((c) =>
                              c.firstName.toLowerCase().includes(e.target.value.toLowerCase())
                            ));
                          } else {
                            setFilteredClients([]);
                          }
                        }}
                        className="col-span-3"
                        onFocus={() => {
                          if (clientSearch.length > 0) {
                            setFilteredClients(clients);
                          }
                        }}
                      />

                      {/* Dropdown */}
                      {filteredClients.length > 0 && (
                        <div className="col-span-4 z-20 mt-1 max-h-40 overflow-auto rounded-md border bg-white shadow-lg">
                          {filteredClients.map((client) => (
                            <button
                              key={client.client_id}
                              type="button"
                              className="w-full cursor-pointer text-left px-3 py-2 hover:bg-gray-100"
                              onClick={() => {
                                setSelectedAppointment({
                                  ...selectedAppointment,
                                  clientId: String(client.client_id),
                                  clientName: client.firstName,
                                });
                                setClientSearch(client.firstName); // muestra el nombre en el input
                                setFilteredClients([]); // 🔹 cierra el dropdown
                              }}
                            >
                              <div className="text-sm font-medium">{client.firstName}</div>
                              <div className="text-xs text-gray-500">{client.email || client.phone}</div>
                            </button>
                          ))}
                        </div>
                      )}

                      {/* Cliente seleccionado */}
                      {clientSearch.length === 0 && selectedAppointment?.clientName && (
                        <div className="col-span-4 text-sm text-gray-600">
                          Seleccionado: {selectedAppointment.clientName}
                        </div>
                      )}
                    </div>


                    {/* Profesional */}
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="edit-professional" className="text-right ">
                        Profesional
                      </Label>
                      <Select
                        onValueChange={(value) =>
                          setSelectedAppointment({ ...selectedAppointment, professionalId: value })
                        }
                        value={String(selectedAppointment.professionalId)}
                      >
                        <SelectTrigger className="col-span-3   w-full">
                          <SelectValue placeholder="Seleccionar profesional" />
                        </SelectTrigger>
                        <SelectContent>
                          {professionals.map((professional) => (
                            <SelectItem
                              key={professional.professional_id}
                              value={String(professional.professional_id)}
                            >
                              {professional.professional_name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Servicio */}
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="edit-service" className="text-right">
                        Servicio
                      </Label>
                      <Select
                        onValueChange={(value) =>
                          setSelectedAppointment({ ...selectedAppointment, serviceId: value })
                        }
                        value={String(selectedAppointment.serviceId)}
                      >
                        <SelectTrigger className="col-span-3 w-full">
                          <SelectValue placeholder="Seleccionar servicio" />
                        </SelectTrigger>
                        <SelectContent>
                          {services.map((service) => (
                            <SelectItem
                              key={service.service_id}
                              value={String(service.service_id)}
                            >
                              {service.service_name} - ${service.price.toLocaleString()} ({service.duration} min)
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Fecha */}
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="edit-date" className="text-right">
                        Fecha
                      </Label>
                      <Popover>
                          <PopoverTrigger asChild>
                            <div className="col-span-3 flex items-center gap-2">
                              <input
                                type="date"
                                className="w-full rounded-md border px-2 py-1"
                                value={selectedAppointment.date ? format(selectedAppointment.date, 'yyyy-MM-dd') : ''}
                                onChange={(e) => {
                                  const v = e.target.value
                                  if (!v) {
                                    setSelectedAppointment({ ...selectedAppointment, date: undefined as any })
                                    return
                                  }
                                  try {
                                    const d = parseISO(v)
                                    if (!isDateAllowed(d, selectedAppointment.professionalId)) {
                                      toast({ title: 'Fecha no válida', description: 'El profesional no trabaja ese día.' })
                                      return
                                    }
                                    setSelectedAppointment({ ...selectedAppointment, date: d })
                                  } catch (err) {
                                    console.error('Invalid date input', err)
                                  }
                                }}
                              />
                              <Button variant="outline" className="px-2 py-1">📅</Button>
                            </div>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0">
                            <Calendar
                              mode="single"
                              selected={selectedAppointment.date}
                              onSelect={(date) =>
                                date && setSelectedAppointment({ ...selectedAppointment, date })
                              }
                              initialFocus
                              disabled={(date) => {
                                const profId = selectedAppointment.professionalId
                                if (!profId) return false
                                const prof = professionals.find((p) => String(p.professional_id) === String(profId)) as any
                                const working = prof?.working_hours
                                if (!working || working.length === 0) return false
                                const iso = getISODay(date)
                                const allowed = working.map((w: any) => Number(w.dayOfWeek))
                                return !allowed.includes(iso)
                              }}
                            />
                          </PopoverContent>
                      </Popover>
                    </div>

                    {/* Hora */}
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="edit-startTime" className="text-right whitespace-nowrap">
                        Hora Inicio
                      </Label>
                      <Select
                        onValueChange={(value) =>
                          setSelectedAppointment({ ...selectedAppointment, startTime: value })
                        }
                        value={selectedAppointment.startTime || ""}
                        disabled={!selectedAppointment?.date || isLoadingSlotsEdit}
                      >
                        <SelectTrigger className="col-span-3 w-full">
                          <SelectValue placeholder={
                            !selectedAppointment?.date 
                              ? "Seleccionar fecha primero" 
                              : isLoadingSlotsEdit 
                              ? "Cargando horarios..." 
                              : "Seleccionar hora"
                          } />
                        </SelectTrigger>
                        <SelectContent>
                          {availableSlotsEdit.length > 0 ? (
                            availableSlotsEdit.map((slot) => (
                              <SelectItem 
                                key={slot.time} 
                                value={slot.time}
                                disabled={!slot.available}
                              >
                                {slot.time}
                              </SelectItem>
                            ))
                          ) : (
                            <div className="px-2 py-1.5 text-sm text-gray-500">
                              {isLoadingSlotsEdit ? "Cargando..." : "No hay horarios disponibles"}
                            </div>
                          )}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Estado */}
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="edit-status" className="text-right">
                        Estado
                      </Label>
                      <Select
                        onValueChange={(value) => {
                          const statusMap: Record<string, number> = {
                            PENDING: 1,
                            IN_PROGRESS: 2,
                            COMPLETED: 3,
                            CANCELLED: 4,
                            POSTPONED: 5,
                          };
                          setSelectedAppointment({
                            ...selectedAppointment,
                            status: value,
                            statusId: statusMap[value] || 0,
                          });
                        }}
                        value={String(selectedAppointment.status)}
                      >
                        <SelectTrigger className="col-span-3 w-full">
                          <SelectValue placeholder="Seleccionar estado" />
                        </SelectTrigger>
                        <SelectContent>
                          {[
                            { value: "PENDING", label: "Pendiente" },
                            { value: "IN_PROGRESS", label: "En progreso" },
                            { value: "COMPLETED", label: "Completada" },
                            { value: "CANCELLED", label: "Cancelada" },
                            { value: "POSTPONED", label: "Pospuesta" },
                          ].map((item) => (
                            <SelectItem key={item.value} value={item.value}>
                              <span
                                style={{
                                  display: "inline-block",
                                  width: 10,
                                  height: 10,
                                  borderRadius: "50%",
                                  background: statusColors[item.value],
                                  marginRight: 8,
                                  verticalAlign: "middle",
                                }}
                              />
                              {item.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Notas */}
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="edit-notes" className="text-right">
                        Notas
                      </Label>
                      <Textarea
                        id="edit-notes"
                        className="col-span-3"
                        placeholder="Notas adicionales"
                        value={selectedAppointment.notes || ""}
                        onChange={(e) =>
                          setSelectedAppointment({ ...selectedAppointment, notes: e.target.value })
                        }
                      />
                    </div>
                  </div>
                )}

                <DialogFooter className="flex flex-col sm:flex-row sm:justify-between gap-3 pt-4">
                  {/*<Button
                    variant="destructive"
                    onClick={handleDeleteAppointment}
                    className="rounded-xl shadow-sm cursor-pointer hover:scale-95 w-full sm:w-auto"
                  >
                    <Trash2Icon className="h-4 w-4 mr-2" />
                    Eliminar
                  </Button>*/}

                  <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                    <Button
                      variant="outline"
                      onClick={() => setIsEditAppointmentOpen(false)}
                      className="rounded-xl cursor-pointer hover:scale-95 w-full sm:w-auto"
                    >
                      Cancelar
                    </Button>
                    <Button
                      onClick={handleUpdateAppointment}
                      className="rounded-xl bg-purple-500 hover:bg-purple-800 text-white cursor-pointer hover:scale-95 w-full sm:w-auto"
                    >
                      Guardar Cambios
                    </Button>
                  </div>
                </DialogFooter>

              </DialogContent>
            </Dialog>


            {/* Modal para Crear Clientes */}
            <Dialog open={isNewClientOpen} onOpenChange={(open) => setIsNewClientOpen(open)}>
              <DialogContent className="sm:max-w-[500px] sm:max-h-[600px] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Crear Nuevo Cliente</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="first_name">Nombre</Label>
                      <Input
                        id="first_name"
                        value={newClient.firstName}
                        onChange={(e) => setNewClient({ ...newClient, firstName: e.target.value })}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="last_name">Apellido</Label>
                      <Input
                        id="last_name"
                        value={newClient.lastName}
                        onChange={(e) => setNewClient({ ...newClient, lastName: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={newClient.email}
                        onChange={(e) => setNewClient({ ...newClient, email: e.target.value })}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="phone">Teléfono</Label>
                      <Input
                        id="phone"
                        value={newClient.phone}
                        onChange={(e) => setNewClient({ ...newClient, phone: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="address">Dirección</Label>
                    <Input
                      id="address"
                      value={newClient.address}
                      onChange={(e) => setNewClient({ ...newClient, address: e.target.value })}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="city">Ciudad</Label>
                      <Input
                        id="city"
                        value={newClient.city}
                        onChange={(e) => setNewClient({ ...newClient, city: e.target.value })}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="postal_code">Código Postal</Label>
                      <Input
                        id="postal_code"
                        value={newClient.postalCode}
                        onChange={(e) => setNewClient({ ...newClient, postalCode: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="birth_date">Fecha de Nacimiento</Label>
                      <Input
                        id="birth_date"
                        type="date"
                        value={newClient.birthDate}
                        onChange={(e) => setNewClient({ ...newClient, birthDate: e.target.value })}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="gender">Género</Label>
                      <Select
                        value={newClient.gender}
                        onValueChange={(value) => setNewClient({ ...newClient, gender: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccionar género" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="M">Masculino</SelectItem>
                          <SelectItem value="F">Femenino</SelectItem>
                          <SelectItem value="O">Otro</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="grid gap-2 ">
                    <Label htmlFor="referral_source">¿Cómo nos conoció?</Label>
                    <Select
                      value={newClient.howFound}
                      onValueChange={(value) => setNewClient({ ...newClient, howFound: value })}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Seleccionar opción" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="social_media">Redes Sociales</SelectItem>
                        <SelectItem value="referral">Recomendación</SelectItem>
                        <SelectItem value="search">Búsqueda en Internet</SelectItem>
                        <SelectItem value="other">Otro</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="notes">Notas Adicionales</Label>
                    <Textarea
                      id="notes"
                      value={newClient.notes}
                      onChange={(e) => setNewClient({ ...newClient, notes: e.target.value })}
                    />
                  </div>
                </div>
                <DialogFooter >
                  <Button className="rounded-xl cursor-pointer hover:scale-95" variant="outline" onClick={() => setIsNewClientOpen(false)}>
                    Cancelar
                  </Button>
                  <Button className="rounded-xl bg-purple-500 hover:bg-purple-800 text-white cursor-pointer hover:scale-95"
                    onClick={handleCreateClient}>Guardar</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>


          </div>
        </main>

      </ModuleLayout>
    </AuthGuard>

  )
}



