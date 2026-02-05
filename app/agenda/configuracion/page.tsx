
"use client"

type Usuario = {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: string;
    isActive: boolean;
    lastLoginAt?: string | null;
    createdAt: string;
    updatedAt: string;
};

type Estilista = {
    id?: string;
    nombre?: string;
    especialidad?: string;
    color?: string;
    diasDisponibles?: string[];
    horaInicio?: string;
    horaFin?: string;
    descanso?: { inicio: string; fin: string };
    userId?: string;
    email?: string;
    specialtyIds?: string[];
    employeeId?: string;
    workingDays?: string[];
    status?: string;
};

import dynamic from "next/dynamic"
import { AuthGuard } from "@/components/auth-guard"
import { ModuleLayout } from "@/components/module-layout"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { getTenantIdFromToken } from "@/lib/jwt"


const Tabs = dynamic(() => import("@/components/ui/tabs").then(m => m.Tabs), { ssr: false })
const TabsContent = dynamic(() => import("@/components/ui/tabs").then(m => m.TabsContent), { ssr: false })
const TabsList = dynamic(() => import("@/components/ui/tabs").then(m => m.TabsList), { ssr: false })
const TabsTrigger = dynamic(() => import("@/components/ui/tabs").then(m => m.TabsTrigger), { ssr: false })
const Card = dynamic(() => import("@/components/ui/card").then(m => m.Card), { ssr: false })
const CardContent = dynamic(() => import("@/components/ui/card").then(m => m.CardContent), { ssr: false })
const CardDescription = dynamic(() => import("@/components/ui/card").then(m => m.CardDescription), { ssr: false })
const CardHeader = dynamic(() => import("@/components/ui/card").then(m => m.CardHeader), { ssr: false })
const CardTitle = dynamic(() => import("@/components/ui/card").then(m => m.CardTitle), { ssr: false })
const Button = dynamic(() => import("@/components/ui/button").then(m => m.Button), { ssr: false })
const Input = dynamic(() => import("@/components/ui/input").then(m => m.Input), { ssr: false })
const Label = dynamic(() => import("@/components/ui/label").then(m => m.Label), { ssr: false })
const Select = dynamic(() => import("@/components/ui/select").then(m => m.Select), { ssr: false })
const SelectContent = dynamic(() => import("@/components/ui/select").then(m => m.SelectContent), { ssr: false })
const SelectItem = dynamic(() => import("@/components/ui/select").then(m => m.SelectItem), { ssr: false })
const SelectTrigger = dynamic(() => import("@/components/ui/select").then(m => m.SelectTrigger), { ssr: false })
const SelectValue = dynamic(() => import("@/components/ui/select").then(m => m.SelectValue), { ssr: false })
const Switch = dynamic(() => import("@/components/ui/switch").then(m => m.Switch), { ssr: false })
const Table = dynamic(() => import("@/components/ui/table").then(m => m.Table), { ssr: false })
const TableBody = dynamic(() => import("@/components/ui/table").then(m => m.TableBody), { ssr: false })
const TableCell = dynamic(() => import("@/components/ui/table").then(m => m.TableCell), { ssr: false })
const TableHead = dynamic(() => import("@/components/ui/table").then(m => m.TableHead), { ssr: false })
const TableHeader = dynamic(() => import("@/components/ui/table").then(m => m.TableHeader), { ssr: false })
const TableRow = dynamic(() => import("@/components/ui/table").then(m => m.TableRow), { ssr: false })
const Calendar = dynamic(() => import("@/components/ui/calendar").then(m => m.Calendar), { ssr: false })
const Popover = dynamic(() => import("@/components/ui/popover").then(m => m.Popover), { ssr: false })
const PopoverContent = dynamic(() => import("@/components/ui/popover").then(m => m.PopoverContent), { ssr: false })
const PopoverTrigger = dynamic(() => import("@/components/ui/popover").then(m => m.PopoverTrigger), { ssr: false })
import {
    ChevronLeftIcon,
    CalendarIcon,
    ClockIcon,
    PersonIcon,
    ScissorsIcon,
} from "@radix-ui/react-icons"

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000/api'

// Tipos para los servicios
type Servicio = {
    id: string
    nombre: string
    duracion: number
    precio: number
    descripcion?: string
    categoria?: string
}


// Tipos para los horarios
type Horario = {
    id?: string
    dia: string
    apertura: string
    cierre: string
    activo: boolean
}

// Tipos para los días festivos
type DiaFestivo = {
    id: string
    fecha: Date
    nombre: string
    cerrado: boolean
}

// Tipos para las categorías de servicios
type CategoriaServicio = {
    id: string
    nombre: string
    color: string
}

// Tipos para los calendarios de profesionales
type CalendarioProfesional = {
    id: string
    estilistaId: string
    horarios: {
        [dia: string]: {
            activo: boolean
            horaInicio: string
            horaFin: string
            descansos: Array<{
                inicio: string
                fin: string
            }>
        }
    }
    excepciones: Array<{
        fecha: Date
        activo: boolean
        horaInicio?: string
        horaFin?: string
        nota?: string
    }>
}

export default function ConfiguracionAgendaPage() {
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
    // ---
    // Utilidad para obtener el número de día a partir del nombre
    const obtenerNumeroDia = (nombreDia: string): number => {
        const dias = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
        const idx = dias.findIndex((d) => d.toLowerCase() === (nombreDia || '').toLowerCase());
        return idx === -1 ? 1 : idx + 1;
    };
    const [tenantId, setTenantId] = useState<string | null>(null)

    // Función para guardar los horarios activos
    const fetchHorarios = async () => {
        const token = getToken();
        const myHeaders = new Headers();
        myHeaders.append("Authorization", `Bearer ${token}`);
        const requestOptions = {
            method: "GET",
            headers: myHeaders,
            redirect: "follow" as RequestRedirect
        };
        const res = await fetch(`${API_BASE}/${tenantId}/modules/agenda/working-hours`, requestOptions);
        const data = await res.json();
        // Mapear los datos de la API a la estructura local Horario
        const diasSemana = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"];
        const horariosApi = Array.isArray(data) ? data : [];
        // Inicializar todos los días como inactivos
        const horariosBase: Horario[] = diasSemana.map((dia, idx) => ({
            dia,
            apertura: "08:00",
            cierre: "17:00",
            activo: false
        }));
        // Normalizador de hora a formato HH:mm
        const normalizarHora = (hora: string) => {
            if (!hora) return "";
            if (/^\d{2}:\d{2}$/.test(hora)) return hora;
            if (/^\d{1}:\d{2}$/.test(hora)) return `0${hora}`;
            if (/^\d{2}:00$/.test(hora)) return hora;
            if (/^\d{1}:00$/.test(hora)) return `0${hora}`;
            return hora;
        };
        horariosApi.forEach((h: any) => {
            const i = (h.dayOfWeek ?? 1) - 1;
            if (i >= 0 && i < horariosBase.length) {
                horariosBase[i] = {
                    dia: diasSemana[i],
                    apertura: normalizarHora(h.startTime),
                    cierre: normalizarHora(h.endTime),
                    activo: true
                };
            }
        });
        setHorarios(horariosBase);
    };

    const guardarHorarios = async () => {
        const token = getToken();
        // Obtener el estado actual de la BD
        let horariosApi = [];
        try {
            const res = await fetch(`${API_BASE}/${tenantId}/modules/agenda/working-hours`, {
                method: "GET",
                headers: { "Authorization": `Bearer ${token}` }
            });
            horariosApi = await res.json();
        } catch (e) {
            alert("Error al obtener horarios actuales");
            return;
        }
        // Mapear por día de la semana
        const diasSemana = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"];
        // Para cada día, decidir si crear, actualizar o eliminar
        const promesas: Promise<Response>[] = [];
        horarios.forEach((h, idx) => {
            const apiHorario: {
                id: string;
                dayOfWeek: number;
                startTime: string;
                endTime: string;
                createdAt?: string;
                updatedAt?: string;
            } | undefined = horariosApi.find(
                (api: {
                    id: string;
                    dayOfWeek: number;
                    startTime: string;
                    endTime: string;
                    createdAt?: string;
                    updatedAt?: string;
                }) => (api.dayOfWeek ?? 1) === (idx + 1)
            );
            // Si está activo
            if (h.activo) {
                if (apiHorario) {
                    // Si cambió apertura/cierre, actualizar
                    if (h.apertura !== apiHorario.startTime || h.cierre !== apiHorario.endTime) {
                        promesas.push(
                            fetch(`${API_BASE}/${tenantId}/modules/agenda/working-hours/${apiHorario.id}`, {
                                method: "PUT",
                                headers: {
                                    "Content-Type": "application/json",
                                    "Authorization": `Bearer ${token}`
                                },
                                body: JSON.stringify({
                                    startTime: h.apertura,
                                    endTime: h.cierre
                                })
                            })
                        );
                    }
                } else {
                    // Si no existe en la BD, crear
                    promesas.push(
                        fetch(`${API_BASE}/${tenantId}/modules/agenda/working-hours`, {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json",
                                "Authorization": `Bearer ${token}`
                            },
                            body: JSON.stringify({
                                dayOfWeek: idx + 1,
                                startTime: h.apertura,
                                endTime: h.cierre
                            })
                        })
                    );
                }
            } else {
                // Si está inactivo y existe en la BD, eliminar
                if (apiHorario) {
                    promesas.push(
                        fetch(`${API_BASE}/${tenantId}/modules/agenda/working-hours/${apiHorario.id}`, {
                            method: "DELETE",
                            headers: {
                                "Authorization": `Bearer ${token}`
                            }
                        })
                    );
                }
            }
        });
        try {
            await Promise.all(promesas);
            alert("Horarios guardados correctamente.");
            fetchHorarios();
        } catch (e) {
            alert("Error al guardar los horarios.");
        }
    };
    // --- Buscador de especialidades para profesionales ---
    const [especialidadBusqueda, setEspecialidadBusqueda] = useState("");
    const [especialidades, setEspecialidades] = useState<any[]>([]);
    const [especialidadesFiltradas, setEspecialidadesFiltradas] = useState<any[]>([]);

    // Estado y funciones para crear nueva especialidad desde un modal
    const [openCrearEspecialidad, setOpenCrearEspecialidad] = useState(false);
    const [nuevaEspecialidadNombre, setNuevaEspecialidadNombre] = useState("");

    const crearEspecialidad = async () => {
        if (!nuevaEspecialidadNombre || nuevaEspecialidadNombre.trim() === "") {
            alert("Ingrese el nombre de la especialidad");
            return;
        }
        try {
            const token = getToken();
            const myHeaders = new Headers();
            myHeaders.append("Content-Type", "application/json");
            if (token) myHeaders.append("Authorization", `Bearer ${token}`);

            const res = await fetch(`${API_BASE}/${tenantId}/modules/agenda/specialties`, {
                method: "POST",
                headers: myHeaders,
                body: JSON.stringify({ name: nuevaEspecialidadNombre })
            });

            if (!res.ok) {
                const text = await res.text();
                console.error("Error creando especialidad:", res.status, text);
                alert("Error al crear la especialidad");
                return;
            }

            const created = await res.json();
            // Actualizar el input de búsqueda para seleccionar la nueva especialidad
            setEspecialidadBusqueda(created.name || nuevaEspecialidadNombre);
            setEspecialidadesFiltradas([]);
            setNuevaEspecialidadNombre("");
            setOpenCrearEspecialidad(false);
            alert("Especialidad creada correctamente");
        } catch (err) {
            console.error(err);
            alert("Error al crear la especialidad");
        }
    };

    // Estado y funciones para crear nuevo usuario desde un modal
    const [openCrearUsuario, setOpenCrearUsuario] = useState(false);
    const [nuevoUsuario, setNuevoUsuario] = useState<{
        email?: string;
        password?: string;
        firstName?: string;
        lastName?: string;
        role?: string;
    }>({
        email: "",
        password: "",
        firstName: "",
        lastName: "",
        role: "USER",
    });

    const crearUsuario = async () => {
        if (!nuevoUsuario.email || !nuevoUsuario.password || !nuevoUsuario.firstName || !nuevoUsuario.lastName) {
            alert("Por favor complete todos los campos del usuario");
            return;
        }
        try {
            const token = getToken();
            const myHeaders = new Headers();
            myHeaders.append("Content-Type", "application/json");
            if (token) myHeaders.append("Authorization", `Bearer ${token}`);

            const res = await fetch("http://localhost:3000/api/users", {
                method: "POST",
                headers: myHeaders,
                body: JSON.stringify({
                    email: nuevoUsuario.email,
                    password: nuevoUsuario.password,
                    firstName: nuevoUsuario.firstName,
                    lastName: nuevoUsuario.lastName,
                    role: nuevoUsuario.role || "USER",
                }),
            });

            if (!res.ok) {
                const text = await res.text();
                console.error("Error creando usuario:", res.status, text);
                alert("Error al crear el usuario");
                return;
            }

            const created = await res.json();
            // Si la API devuelve el id y campos, actualizamos el nuevoEstilista para usarlo
            setNuevoEstilista({
                ...nuevoEstilista,
                nombre: `${created.firstName || nuevoUsuario.firstName} ${created.lastName || nuevoUsuario.lastName}`,
                userId: created.id || created.userId || "",
                email: created.email || nuevoUsuario.email,
            });

            setNuevoUsuario({ email: "", password: "", firstName: "", lastName: "", role: "USER" });
            setOpenCrearUsuario(false);
            alert("Usuario creado correctamente");
            setBusquedaUsuario("");
            setUsuariosFiltrados([]);
        } catch (err) {
            console.error(err);
            alert("Error al crear el usuario");
        }
    };

    useEffect(() => {
        if (especialidadBusqueda.trim() === "") {
            setEspecialidadesFiltradas([]);
            return;
        }
        // Consultar especialidades solo si hay texto
        const fetchEspecialidades = async () => {
            try {
                const token = getToken();
                const myHeaders = new Headers();
                myHeaders.append("Authorization", `Bearer ${token}`);
                const requestOptions = {
                    method: "GET",
                    headers: myHeaders,
                    redirect: "follow" as RequestRedirect
                };
                const res = await fetch(`${API_BASE}/${tenantId}/modules/agenda/specialties`, requestOptions);
                const data = await res.json();
                setEspecialidades(data || []);
                // Filtrar por nombre
                const filtro = especialidadBusqueda.toLowerCase();
                const filtradas = (data || []).filter((esp: any) =>
                    esp.name.toLowerCase().includes(filtro)
                );
                setEspecialidadesFiltradas(filtradas);
            } catch (err) {
                setEspecialidadesFiltradas([]);
            }
        };
        // Debounce para evitar muchas llamadas
        const timeout = setTimeout(fetchEspecialidades, 350);
        return () => clearTimeout(timeout);
    }, [especialidadBusqueda]);
    // --- Buscador de usuarios para profesionales ---
    const [busquedaUsuario, setBusquedaUsuario] = useState("");
    const [usuarios, setUsuarios] = useState<Usuario[]>([]);
    const [usuariosFiltrados, setUsuariosFiltrados] = useState<Usuario[]>([]);

    useEffect(() => {
        if (busquedaUsuario.trim() === "") {
            setUsuariosFiltrados([]);
            return;
        }
        // Consultar usuarios solo si hay texto
        const fetchUsuarios = async () => {
            const token = getToken();
            const myHeaders = new Headers();
            myHeaders.append("Authorization", `Bearer ${token}`);

            const requestOptions = {
                method: "GET",
                headers: myHeaders,
                redirect: "follow" as RequestRedirect
            };
            try {
                const res = await fetch("http://localhost:3000/api/users", requestOptions);
                const data = await res.json();
                setUsuarios(data.users || []);
                // Filtrar por nombre, apellido o email
                const filtro = busquedaUsuario.toLowerCase();
                const filtrados: Usuario[] = (data.users || []).filter(
                    (u: Usuario) =>
                        `${u.firstName} ${u.lastName}`.toLowerCase().includes(filtro) ||
                        u.email.toLowerCase().includes(filtro)
                );
                setUsuariosFiltrados(filtrados);
            } catch (err) {
                setUsuariosFiltrados([]);
            }
        };
        // Debounce para evitar muchas llamadas
        const timeout = setTimeout(fetchUsuarios, 350);
        return () => clearTimeout(timeout);
    }, [busquedaUsuario]);
    // Estado para los días disponibles desde la API
    type WorkingHour = {
        id: string;
        dayOfWeek: number;
        startTime: string;
        endTime: string;
        createdAt: string;
        updatedAt: string;
    };
    const [workingHours, setWorkingHours] = useState<WorkingHour[]>([]);

    useEffect(() => {
        if (!tenantId) return
        const token = getToken();
        const myHeaders = new Headers();
        myHeaders.append("Authorization", `Bearer ${token}`);

        const requestOptions = {
            method: "GET",
            headers: myHeaders,
            redirect: "follow" as RequestRedirect
        };
        fetch(`${API_BASE}/${tenantId}/modules/agenda/working-hours`, requestOptions)
            .then(res => res.json())
            .then(data => setWorkingHours(data));
    }, [tenantId]);
    const router = useRouter()

    // Estados
    const [servicios, setServicios] = useState<Servicio[]>([]);

    const [estilistas, setEstilistas] = useState<Estilista[]>([
        // Se inicializa vacío, se llenará desde la API
    ])

    const [horarios, setHorarios] = useState<Horario[]>([]);

    // Obtener horarios desde la API y mapearlos a la estructura local
    useEffect(() => {
        if (!tenantId) return
        const token = getToken();
        const myHeaders = new Headers();
        myHeaders.append("Authorization", `Bearer ${token}`);
        const requestOptions = {
            method: "GET",
            headers: myHeaders,
            redirect: "follow" as RequestRedirect
        };
        fetch(`${API_BASE}/${tenantId}/modules/agenda/working-hours`, requestOptions)
            .then(res => res.json())
            .then((data) => {
                // Mapear los datos de la API a la estructura local Horario
                const diasSemana = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"];
                const horariosApi = Array.isArray(data) ? data : [];
                // Inicializar todos los días como inactivos
                const horariosBase: Horario[] = diasSemana.map((dia, idx) => ({
                    id: undefined,
                    dia,
                    apertura: "08:00",
                    cierre: "17:00",
                    activo: false
                }));
                // Normalizador de hora a formato HH:mm
                const normalizarHora = (hora: string) => {
                    if (!hora) return "";
                    // Si ya está en formato HH:mm, devolver igual
                    if (/^\d{2}:\d{2}$/.test(hora)) return hora;
                    // Si está en formato H:mm, agregar cero
                    if (/^\d{1}:\d{2}$/.test(hora)) return `0${hora}`;
                    // Si está en formato HH:00, devolver igual
                    if (/^\d{2}:00$/.test(hora)) return hora;
                    // Si está en formato H:00, agregar cero
                    if (/^\d{1}:00$/.test(hora)) return `0${hora}`;
                    return hora;
                };
                // Actualizar los días activos según la API
                horariosApi.forEach((h: any) => {
                    const i = (h.dayOfWeek ?? 1) - 1;
                    if (i >= 0 && i < horariosBase.length) {
                        horariosBase[i] = {
                            id: h.id,
                            dia: diasSemana[i],
                            apertura: normalizarHora(h.startTime),
                            cierre: normalizarHora(h.endTime),
                            activo: true
                        };
                    }
                });
                setHorarios(horariosBase);
            });
    }, [tenantId]);

    // Estado para días festivos
    const [diasFestivos, setDiasFestivos] = useState<DiaFestivo[]>([]);

    const [categorias, setCategorias] = useState<CategoriaServicio[]>([]);

    // Obtener categorías desde la API al montar el componente
    // Función para obtener categorías desde la API
    // Función para obtener servicios desde la API
    // Función para obtener estilistas desde la API
    const fetchEstilistas = async () => {
        const token = getToken();
        const myHeaders = new Headers();
        myHeaders.append("Authorization", `Bearer ${token}`);

        const requestOptions = {
            method: "GET",
            headers: myHeaders,
            redirect: "follow" as RequestRedirect
        };

        try {
            const response = await fetch(`${API_BASE}/${tenantId}/modules/agenda/employees`, requestOptions);
            if (!response.ok) throw new Error("Error al obtener profesionales");
            const data = await response.json();
            // Mapear a la estructura local
            const estilistasMapeados = data.map((prof: any) => ({
                id: prof.professional_id,
                nombre: prof.professional_name,
                especialidad: prof.specialty_name,
                color: prof.color,
                diasDisponibles: prof.working_hours?.map((h: any) => h.dayOfWeek) || [],
                horaInicio: prof.working_hours?.[0]?.startTime || "",
                horaFin: prof.working_hours?.[0]?.endTime || "",
                status: prof.status
            }));
            setEstilistas(estilistasMapeados);
        } catch (error) {
            console.error(error);
        }
    };

    const fetchServicios = async () => {
        const token = getToken();
        const myHeaders = new Headers();
        myHeaders.append("Authorization", `Bearer ${token}`);

        const requestOptions = {
            method: "GET",
            headers: myHeaders,
            redirect: "follow" as RequestRedirect
        };

        try {
            const response = await fetch(`${API_BASE}/${tenantId}/modules/agenda/services`, requestOptions);
            if (!response.ok) throw new Error("Error al obtener servicios");
            const data = await response.json();
            // Mapear a la estructura local si es necesario
            const serviciosMapeados = data.map((servicio: any) => ({
                id: servicio.id,
                nombre: servicio.name,
                descripcion: servicio.description,
                duracion: servicio.duration,
                precio: servicio.price,
                categoria: servicio.categoryId
            }));
            setServicios(serviciosMapeados);
        } catch (error) {
            console.error(error);
        }
    };


    const fetchCategorias = async () => {
        const token = getToken();
        const myHeaders = new Headers();
        myHeaders.append("Authorization", `Bearer ${token}`);

        const requestOptions = {
            method: "GET",
            headers: myHeaders,
            redirect: "follow" as RequestRedirect
        };

        try {
            const response = await fetch(`${API_BASE}/${tenantId}/modules/agenda/categories`, requestOptions);
            if (!response.ok) throw new Error("Error al obtener categorías");
            const data = await response.json();
            // Mapear a la estructura local
            const categoriasMapeadas = data.map((cat: any) => ({
                id: cat.id,
                nombre: cat.name,
                color: cat.color
            }));
            setCategorias(categoriasMapeadas);
        } catch (error) {
            console.error(error);
        }
    };


    // Estado para calendarios de profesionales
    const [calendariosProfesionales, setCalendariosProfesionales] = useState<CalendarioProfesional[]>([
        {
            id: "1",
            estilistaId: "1",
            horarios: {
                "Lunes": {
                    activo: true,
                    horaInicio: "08:00",
                    horaFin: "17:00",
                    descansos: [{ inicio: "12:00", fin: "13:00" }]
                },
                "Martes": {
                    activo: true,
                    horaInicio: "08:00",
                    horaFin: "17:00",
                    descansos: [{ inicio: "12:00", fin: "13:00" }]
                },
                "Miércoles": {
                    activo: true,
                    horaInicio: "08:00",
                    horaFin: "17:00",
                    descansos: [{ inicio: "12:00", fin: "13:00" }]
                },
                "Jueves": {
                    activo: true,
                    horaInicio: "08:00",
                    horaFin: "17:00",
                    descansos: [{ inicio: "12:00", fin: "13:00" }]
                },
                "Viernes": {
                    activo: true,
                    horaInicio: "08:00",
                    horaFin: "17:00",
                    descansos: [{ inicio: "12:00", fin: "13:00" }]
                },
                "Sábado": {
                    activo: false,
                    horaInicio: "09:00",
                    horaFin: "18:00",
                    descansos: []
                },
                "Domingo": {
                    activo: false,
                    horaInicio: "10:00",
                    horaFin: "14:00",
                    descansos: []
                }
            },
            excepciones: [
                {
                    fecha: new Date(2025, 0, 15),
                    activo: false,
                    nota: "Capacitación"
                }
            ]
        },
        {
            id: "2",
            estilistaId: "2",
            horarios: {
                "Lunes": {
                    activo: true,
                    horaInicio: "09:00",
                    horaFin: "18:00",
                    descansos: [{ inicio: "13:00", fin: "14:00" }]
                },
                "Martes": {
                    activo: false,
                    horaInicio: "09:00",
                    horaFin: "18:00",
                    descansos: []
                },
                "Miércoles": {
                    activo: true,
                    horaInicio: "09:00",
                    horaFin: "18:00",
                    descansos: [{ inicio: "13:00", fin: "14:00" }]
                },
                "Jueves": {
                    activo: false,
                    horaInicio: "09:00",
                    horaFin: "18:00",
                    descansos: []
                },
                "Viernes": {
                    activo: true,
                    horaInicio: "09:00",
                    horaFin: "18:00",
                    descansos: [{ inicio: "13:00", fin: "14:00" }]
                },
                "Sábado": {
                    activo: true,
                    horaInicio: "10:00",
                    horaFin: "16:00",
                    descansos: []
                },
                "Domingo": {
                    activo: false,
                    horaInicio: "10:00",
                    horaFin: "14:00",
                    descansos: []
                }
            },
            excepciones: []
        }
    ])

    const [nuevoServicio, setNuevoServicio] = useState<Partial<Servicio>>({})
    const [nuevoEstilista, setNuevoEstilista] = useState<Partial<Estilista>>({
        // id no es necesario en el estado inicial para nuevoEstilista
        diasDisponibles: [],
        specialtyIds: [],
    })
    const [nuevoDiaFestivo, setNuevoDiaFestivo] = useState<Partial<DiaFestivo>>({
        fecha: new Date(),
        cerrado: true,
    })
    const [nuevaCategoria, setNuevaCategoria] = useState<Partial<CategoriaServicio>>({
        color: "#000000",
    })

    const [editandoServicio, setEditandoServicio] = useState<string | null>(null)
    const [editandoEstilista, setEditandoEstilista] = useState<string | null>(null)
    const [editandoDiaFestivo, setEditandoDiaFestivo] = useState<string | null>(null)
    const [editandoCategoria, setEditandoCategoria] = useState<string | null>(null)

    // Estados para la gestión de calendarios de profesionales
    const [estilistaSeleccionado, setEstilistaSeleccionado] = useState<string>("")
    const [diaSeleccionado, setDiaSeleccionado] = useState<string>("Lunes")
    const [calendarioActual, setCalendarioActual] = useState<CalendarioProfesional | null>(null)
    const [nuevaExcepcion, setNuevaExcepcion] = useState<{
        fecha: Date;
        activo: boolean;
        horaInicio?: string;
        horaFin?: string;
        nota?: string;
    }>({
        fecha: new Date(),
        activo: false,
        nota: ""
    })



    // Función para agregar un nuevo servicio
    const agregarServicio = async () => {
        if (!nuevoServicio.nombre || !nuevoServicio.duracion || !nuevoServicio.precio) {
            alert("Por favor complete todos los campos obligatorios");
            return;
        }

        const token = getToken();
        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        myHeaders.append("Authorization", `Bearer ${token}`); // Reemplaza {{Token}} por el token real

        const raw = JSON.stringify({
            name: nuevoServicio.nombre,
            description: nuevoServicio.descripcion || nuevoServicio.nombre,
            categoryId: nuevoServicio.categoria, // Asegúrate de que sea el ID correcto
            price: nuevoServicio.precio,
            duration: nuevoServicio.duracion
        });

        const requestOptions = {
            method: "POST",
            headers: myHeaders,
            body: raw,
            redirect: "follow" as RequestRedirect
        };

        try {
            const response = await fetch(`${API_BASE}/${tenantId}/modules/agenda/services`, requestOptions);
            if (!response.ok) {
                throw new Error("Error al crear el servicio");
            }
            const result = await response.json();
            console.log(result);
            // Opcional: Actualizar la lista local de servicios si es necesario
            // setServicios([...servicios, result]);
            setNuevoServicio({});
            alert("Servicio creado correctamente");
            await fetchServicios();
        } catch (error) {
            console.error(error);
            alert("Hubo un error al crear el servicio");
        }
    }

    // Función para editar un servicio
    const editarServicio = async (id: string) => {
        const token = getToken();
        const myHeaders = new Headers();
        myHeaders.append("Authorization", `Bearer ${token}`);

        const requestOptions = {
            method: "GET",
            headers: myHeaders,
            redirect: "follow" as RequestRedirect
        };

        try {
            const response = await fetch(`${API_BASE}/${tenantId}/modules/agenda/services/${id}`, requestOptions);
            if (!response.ok) throw new Error("Error al obtener el servicio");
            const servicio = await response.json();
            setNuevoServicio({
                nombre: servicio.name,
                descripcion: servicio.description,
                categoria: servicio.categoryId,
                precio: servicio.price,
                duracion: servicio.duration
            });
            setEditandoServicio(id);
        } catch (error) {
            console.error(error);
            alert("Hubo un error al obtener el servicio");
        }
    }

    // Función para actualizar un servicio
    const actualizarServicio = async () => {
        if (!editandoServicio) return;

        const token = getToken();
        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        myHeaders.append("Authorization", `Bearer ${token}`);

        const raw = JSON.stringify({
            name: nuevoServicio.nombre,
            description: nuevoServicio.descripcion || nuevoServicio.nombre,
            categoryId: nuevoServicio.categoria,
            price: nuevoServicio.precio,
            duration: nuevoServicio.duracion
        });

        const requestOptions = {
            method: "PUT",
            headers: myHeaders,
            body: raw,
            redirect: "follow" as RequestRedirect
        };

        try {
            const response = await fetch(`${API_BASE}/${tenantId}/modules/agenda/services/${editandoServicio}`, requestOptions);
            if (!response.ok) throw new Error("Error al actualizar el servicio");
            const result = await response.json();
            // Opcional: Actualizar la lista local de servicios si es necesario
            // setServicios(servicios.map(s => s.id === editandoServicio ? result : s));
            setNuevoServicio({});
            setEditandoServicio(null);
            alert("Servicio actualizado correctamente");
            await fetchServicios();
        } catch (error) {
            console.error(error);
            alert("Hubo un error al actualizar el servicio");
        }
    }

    // Función para eliminar un servicio
    const eliminarServicio = async (id: string) => {
        const token = getToken();
        const myHeaders = new Headers();
        myHeaders.append("Authorization", `Bearer ${token}`);

        const requestOptions = {
            method: "DELETE",
            headers: myHeaders,
            redirect: "follow" as RequestRedirect
        };

        try {
            const response = await fetch(`${API_BASE}/${tenantId}/modules/agenda/services/${id}`, requestOptions);
            if (!response.ok) throw new Error("Error al eliminar el servicio");
            // Opcional: Actualizar la lista local de servicios si es necesario
            // setServicios(servicios.filter(s => s.id !== id));
            alert("Servicio eliminado correctamente");
            await fetchServicios();
        } catch (error) {
            console.error(error);
            alert("Hubo un error al eliminar el servicio");
        }
    }

    // Función para agregar un nuevo estilista
    const agregarEstilista = async () => {
        if (!nuevoEstilista.nombre || !nuevoEstilista.especialidad || !nuevoEstilista.color) {
            alert("Por favor complete todos los campos obligatorios");
            return;
        }

        const token = getToken();
        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        myHeaders.append("Authorization", `Bearer ${token}`);

        // Debes adaptar los datos a los IDs reales de usuario, especialidad, días, etc.
        const raw = JSON.stringify({
            userId: nuevoEstilista.userId,
            specialtyIds: nuevoEstilista.specialtyIds || [],
            employeeId: nuevoEstilista.employeeId,
            color: nuevoEstilista.color,
            workingDays: (nuevoEstilista.workingDays || []).map(dia => {
                const wh = workingHours.find(w => w.dayOfWeek.toString() === dia);
                return wh ? wh.id : dia;
            }),
            status: "ACTIVE"
        });

        const requestOptions = {
            method: "POST",
            headers: myHeaders,
            body: raw,
            redirect: "follow" as RequestRedirect
        };

        try {
            const response = await fetch(`${API_BASE}/${tenantId}/modules/agenda/employees`, requestOptions);
            if (!response.ok) throw new Error("Error al crear el profesional");
            const result = await response.json();
            setNuevoEstilista({ diasDisponibles: [], specialtyIds: [] });
            setBusquedaUsuario("");
            setEspecialidadBusqueda("");
            alert("Profesional creado correctamente");
            await fetchEstilistas();
        } catch (error) {
            console.error(error);
            alert("Hubo un error al crear el profesional");
        }
    }
    //console.log(nuevoEstilista);
    // Función para editar un estilista
    const editarEstilista = async (id: string) => {
        const token = getToken();
        const myHeaders = new Headers();
        myHeaders.append("Authorization", `Bearer ${token}`);

        const requestOptions = {
            method: "GET",
            headers: myHeaders,
            redirect: "follow" as RequestRedirect
        };

        try {
            const response = await fetch(`${API_BASE}/${tenantId}/modules/agenda/employees`, requestOptions);
            if (!response.ok) throw new Error("Error al obtener los profesionales");
            const empleados = await response.json();
            const prof = empleados.find((e: any) => e.professional_id === id);
            if (!prof) throw new Error("Profesional no encontrado");
            setNuevoEstilista({
                nombre: prof.professional_name,
                userId: prof.user_id,
                especialidad: prof.specialties[0]?.name || '',
                specialtyIds: prof.specialties?.map((s: any) => s.id) || [],
                color: prof.color,
                workingDays: prof.working_hours.map((wh: any) => wh.dayOfWeek.toString()),
                status: prof.status,
                employeeId: prof.professional_id,
                // otros campos si es necesario
            });
            setEspecialidadBusqueda(prof.specialties[0]?.name || '');
            setEditandoEstilista(id);
        } catch (error) {
            console.error(error);
            alert("Hubo un error al obtener el profesional");
        }
    }

    // Función para actualizar un estilista
    const actualizarEstilista = async () => {
        if (!editandoEstilista) return;

        const token = getToken();
        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        myHeaders.append("Authorization", `Bearer ${token}`);

        const raw = JSON.stringify({
            userId: nuevoEstilista.userId,
            specialtyIds: nuevoEstilista.specialtyIds || [],
            employeeId: nuevoEstilista.employeeId,
            color: nuevoEstilista.color,
            workingDays: (nuevoEstilista.workingDays || []).map(dia => {
                const wh = workingHours.find(w => w.dayOfWeek.toString() === dia);
                return wh ? wh.id : dia;
            }),
            status: nuevoEstilista.status || "ACTIVE"
        });

        const requestOptions = {
            method: "PUT",
            headers: myHeaders,
            body: raw,
            redirect: "follow" as RequestRedirect
        };

        try {
            const response = await fetch(`${API_BASE}/${tenantId}/modules/agenda/employees/${editandoEstilista}`, requestOptions);
            if (!response.ok) throw new Error("Error al actualizar el profesional");
            const result = await response.json();
            setNuevoEstilista({ diasDisponibles: [], specialtyIds: [] });
            setEditandoEstilista(null);
            setEspecialidadBusqueda("");
            alert("Profesional actualizado correctamente");
            await fetchEstilistas();
        } catch (error) {
            console.error(error);
            alert("Hubo un error al actualizar el profesional");
        }
    }

    // Función para actualizar el status de un estilista
    const updateStatus = async (id: string | undefined, currentStatus: string | undefined) => {
        if (!id || !currentStatus) return;
        const newStatus = currentStatus === "ACTIVE" ? "INACTIVE" : "ACTIVE";
        const token = getToken();
        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        myHeaders.append("Authorization", `Bearer ${token}`);

        const requestOptions = {
            method: "PUT",
            headers: myHeaders,
            body: JSON.stringify({ status: newStatus }),
            redirect: "follow" as RequestRedirect
        };

        try {
            const response = await fetch(`${API_BASE}/${tenantId}/modules/agenda/employees/${id}`, requestOptions);
            if (!response.ok) throw new Error(`Error al ${newStatus === "INACTIVE" ? "inactivar" : "activar"} el profesional`);
            alert(`Profesional ${newStatus === "INACTIVE" ? "inactivado" : "activado"} correctamente`);
            await fetchEstilistas();
        } catch (error) {
            console.error(error);
            alert(`Hubo un error al ${newStatus === "INACTIVE" ? "inactivar" : "activar"} el profesional`);
        }
    }

    // Función para actualizar un horario
    const actualizarHorario = (index: number, campo: keyof Horario, valor: any) => {
        const horariosActualizados = [...horarios];
        const horario = { ...horariosActualizados[index] };
        // Solo modificar el estado local
        if (campo === "activo" && !valor) {
            // Si se desactiva, limpiar id y resetear horas
            horario.id = undefined;
            horario.apertura = "08:00";
            horario.cierre = "17:00";
            horario.activo = false;
        } else {
            (horario as any)[campo] = valor;
        }
        horariosActualizados[index] = horario;
        setHorarios(horariosActualizados);
    }

    // Función para manejar los días disponibles de un estilista
    const manejarDiaDisponible = (dia: string) => {
        if (!nuevoEstilista.diasDisponibles) {
            setNuevoEstilista({ ...nuevoEstilista, diasDisponibles: [dia] })
            return
        }

        const diasDisponibles = [...nuevoEstilista.diasDisponibles]

        if (diasDisponibles.includes(dia)) {
            const index = diasDisponibles.indexOf(dia)
            diasDisponibles.splice(index, 1)
        } else {
            diasDisponibles.push(dia)
        }

        setNuevoEstilista({ ...nuevoEstilista, diasDisponibles })
    }

    // --- DÍAS FESTIVOS: API CRUD ---
    // Obtener días festivos desde la API
    const fetchDiasFestivos = async () => {
        const token = getToken();
        const myHeaders = new Headers();
        myHeaders.append("Authorization", `Bearer ${token}`);
        const requestOptions = {
            method: "GET",
            headers: myHeaders,
            redirect: "follow" as RequestRedirect
        };
        try {
            const res = await fetch(`${API_BASE}/${tenantId}/modules/agenda/holidays`, requestOptions);
            const data = await res.json();
            // Mapear a estructura local
            const mapped = (Array.isArray(data) ? data : []).map((d: any) => ({
                id: d.id,
                fecha: new Date(d.date),
                nombre: d.name,
                cerrado: d.closed !== undefined ? d.closed : true // Si la API lo trae, usarlo, si no, true
            }));
            setDiasFestivos(mapped);
        } catch (e) {
            setDiasFestivos([]);
        }
    };



    useEffect(() => {
        if (!tenantId) return
        fetchCategorias();
        fetchServicios();
        fetchEstilistas();
        fetchDiasFestivos();
    }, [tenantId]);

    // Crear día festivo en la API
    const agregarDiaFestivo = async () => {
        if (!nuevoDiaFestivo.fecha || !nuevoDiaFestivo.nombre) {
            alert("Por favor complete todos los campos obligatorios");
            return;
        }
        const token = getToken();
        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        myHeaders.append("Authorization", `Bearer ${token}`);
        const raw = JSON.stringify({
            date: nuevoDiaFestivo.fecha instanceof Date ? nuevoDiaFestivo.fecha.toISOString() : nuevoDiaFestivo.fecha,
            name: nuevoDiaFestivo.nombre
        });
        const requestOptions = {
            method: "POST",
            headers: myHeaders,
            body: raw,
            redirect: "follow" as RequestRedirect
        };
        try {
            const response = await fetch(`${API_BASE}/${tenantId}/modules/agenda/holidays`, requestOptions);
            if (!response.ok) throw new Error("Error al crear el día festivo");
            setNuevoDiaFestivo({ fecha: new Date(), cerrado: true });
            await fetchDiasFestivos();
            alert("Día festivo creado correctamente");
        } catch (error) {
            alert("Hubo un error al crear el día festivo");
        }
    };

    // Actualizar día festivo en la API
    const actualizarDiaFestivo = async () => {
        if (!editandoDiaFestivo) return;
        const token = getToken();
        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        myHeaders.append("Authorization", `Bearer ${token}`);
        const raw = JSON.stringify({
            name: nuevoDiaFestivo.nombre
        });
        const requestOptions = {
            method: "PUT",
            headers: myHeaders,
            body: raw,
            redirect: "follow" as RequestRedirect
        };
        try {
            const response = await fetch(`${API_BASE}/${tenantId}/modules/agenda/holidays/${editandoDiaFestivo}`, requestOptions);
            if (!response.ok) throw new Error("Error al actualizar el día festivo");
            setNuevoDiaFestivo({ fecha: new Date(), cerrado: true });
            setEditandoDiaFestivo(null);
            await fetchDiasFestivos();
            alert("Día festivo actualizado correctamente");
        } catch (error) {
            alert("Hubo un error al actualizar el día festivo");
        }
    };

    // Eliminar día festivo en la API
    const eliminarDiaFestivo = async (id: string) => {
        const token = getToken();
        const myHeaders = new Headers();
        myHeaders.append("Authorization", `Bearer ${token}`);
        const requestOptions = {
            method: "DELETE",
            headers: myHeaders,
            redirect: "follow" as RequestRedirect
        };
        try {
            const response = await fetch(`${API_BASE}/${tenantId}/modules/agenda/holidays/${id}`, requestOptions);
            if (!response.ok) throw new Error("Error al eliminar el día festivo");
            await fetchDiasFestivos();
            alert("Día festivo eliminado correctamente");
        } catch (error) {
            alert("Hubo un error al eliminar el día festivo");
        }
    };

    // Editar día festivo (cargar en formulario)
    const editarDiaFestivo = (id: string) => {
        const diaFestivo = diasFestivos.find((d) => d.id === id);
        if (diaFestivo) {
            setNuevoDiaFestivo({
                fecha: diaFestivo.fecha,
                nombre: diaFestivo.nombre,
                cerrado: diaFestivo.cerrado
            });
            setEditandoDiaFestivo(id);
        }
    };

    // Función para agregar una nueva categoría
    const agregarCategoria = async () => {
        if (!nuevaCategoria.nombre || !nuevaCategoria.color) {
            alert("Por favor complete todos los campos obligatorios");
            return;
        }

        const token = getToken();
        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        myHeaders.append("Authorization", `Bearer ${token}`);

        const raw = JSON.stringify({
            name: nuevaCategoria.nombre,
            color: nuevaCategoria.color
        });

        const requestOptions = {
            method: "POST",
            headers: myHeaders,
            body: raw,
            redirect: "follow" as RequestRedirect
        };

        try {
            const response = await fetch(`${API_BASE}/${tenantId}/modules/agenda/categories`, requestOptions);
            if (!response.ok) throw new Error("Error al crear la categoría");
            const result = await response.json();
            // Opcional: Actualizar la lista local de categorías si es necesario
            // setCategorias([...categorias, result]);
            setNuevaCategoria({ color: "#000000" });
            alert("Categoría creada correctamente");
            await fetchCategorias();
        } catch (error) {
            console.error(error);
            alert("Hubo un error al crear la categoría");
        }
    }

    // Función para editar una categoría
    const editarCategoria = async (id: string) => {
        await fetchCategorias();
        const token = getToken();
        const myHeaders = new Headers();
        myHeaders.append("Authorization", `Bearer ${token}`);

        const requestOptions = {
            method: "GET",
            headers: myHeaders,
            redirect: "follow" as RequestRedirect
        };

        try {
            const response = await fetch(`${API_BASE}/${tenantId}/modules/agenda/categories/${id}`, requestOptions);
            if (!response.ok) throw new Error("Error al obtener la categoría");
            const categoria = await response.json();
            setNuevaCategoria({
                nombre: categoria.name,
                color: categoria.color
            });
            setEditandoCategoria(id);
        } catch (error) {
            console.error(error);
            alert("Hubo un error al obtener la categoría");
        }
    }

    // Función para actualizar una categoría
    const actualizarCategoria = async () => {
        if (!editandoCategoria) return;

        const token = getToken();
        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        myHeaders.append("Authorization", `Bearer ${token}`);

        const raw = JSON.stringify({
            name: nuevaCategoria.nombre,
            color: nuevaCategoria.color
        });

        const requestOptions = {
            method: "PUT",
            headers: myHeaders,
            body: raw,
            redirect: "follow" as RequestRedirect
        };

        try {
            const response = await fetch(`${API_BASE}/${tenantId}/modules/agenda/categories/${editandoCategoria}`, requestOptions);
            if (!response.ok) throw new Error("Error al actualizar la categoría");
            const result = await response.json();
            // Opcional: Actualizar la lista local de categorías si es necesario
            // setCategorias(categorias.map(c => c.id === editandoCategoria ? result : c));
            setNuevaCategoria({ color: "#000000" });
            setEditandoCategoria(null);
            alert("Categoría actualizada correctamente");
            await fetchCategorias();
        } catch (error) {
            console.error(error);
            alert("Hubo un error al actualizar la categoría");
        }
    }

    // Función para eliminar una categoría
    const eliminarCategoria = async (id: string) => {
        const token = getToken();
        const myHeaders = new Headers();
        myHeaders.append("Authorization", `Bearer ${token}`);

        const requestOptions = {
            method: "DELETE",
            headers: myHeaders,
            redirect: "follow" as RequestRedirect
        };

        try {
            const response = await fetch(`${API_BASE}/${tenantId}/modules/agenda/categories/${id}`, requestOptions);
            if (!response.ok) throw new Error("Error al eliminar la categoría");
            // Opcional: Actualizar la lista local de categorías si es necesario
            // setCategorias(categorias.filter(c => c.id !== id));
            alert("Categoría eliminada correctamente");
            await fetchCategorias();
        } catch (error) {
            console.error(error);
            alert("Hubo un error al eliminar la categoría");
        }
    }

    // Funciones para gestionar calendarios de profesionales
    const seleccionarEstilista = (id: string) => {
        setEstilistaSeleccionado(id)
        const calendario = calendariosProfesionales.find(cal => cal.estilistaId === id)

        if (calendario) {
            setCalendarioActual(calendario)
        } else {
            // Crear un nuevo calendario para el estilista
            const nuevoCalendario: CalendarioProfesional = {
                id: (calendariosProfesionales.length + 1).toString(),
                estilistaId: id,
                horarios: {
                    "Lunes": { activo: true, horaInicio: "08:00", horaFin: "17:00", descansos: [] },
                    "Martes": { activo: true, horaInicio: "08:00", horaFin: "17:00", descansos: [] },
                    "Miércoles": { activo: true, horaInicio: "08:00", horaFin: "17:00", descansos: [] },
                    "Jueves": { activo: true, horaInicio: "08:00", horaFin: "17:00", descansos: [] },
                    "Viernes": { activo: true, horaInicio: "08:00", horaFin: "17:00", descansos: [] },
                    "Sábado": { activo: false, horaInicio: "09:00", horaFin: "18:00", descansos: [] },
                    "Domingo": { activo: false, horaInicio: "10:00", horaFin: "14:00", descansos: [] }
                },
                excepciones: []
            }
            setCalendarioActual(nuevoCalendario)
            setCalendariosProfesionales([...calendariosProfesionales, nuevoCalendario])
        }
    }

    const actualizarHorarioCalendario = (dia: string, campo: string, valor: any) => {
        if (!calendarioActual) return

        const nuevoCalendario = { ...calendarioActual }
        nuevoCalendario.horarios[dia] = {
            ...nuevoCalendario.horarios[dia],
            [campo]: valor
        }

        setCalendarioActual(nuevoCalendario)

        const calendariosActualizados = calendariosProfesionales.map(cal =>
            cal.id === nuevoCalendario.id ? nuevoCalendario : cal
        )

        setCalendariosProfesionales(calendariosActualizados)
    }

    const agregarDescanso = (dia: string) => {
        if (!calendarioActual) return

        const nuevoCalendario = { ...calendarioActual }
        nuevoCalendario.horarios[dia].descansos.push({
            inicio: "12:00",
            fin: "13:00"
        })

        setCalendarioActual(nuevoCalendario)

        const calendariosActualizados = calendariosProfesionales.map(cal =>
            cal.id === nuevoCalendario.id ? nuevoCalendario : cal
        )

        setCalendariosProfesionales(calendariosActualizados)
    }

    const eliminarDescanso = (dia: string, index: number) => {
        if (!calendarioActual) return

        const nuevoCalendario = { ...calendarioActual }
        nuevoCalendario.horarios[dia].descansos.splice(index, 1)

        setCalendarioActual(nuevoCalendario)

        const calendariosActualizados = calendariosProfesionales.map(cal =>
            cal.id === nuevoCalendario.id ? nuevoCalendario : cal
        )

        setCalendariosProfesionales(calendariosActualizados)
    }

    const actualizarDescanso = (dia: string, index: number, campo: string, valor: string) => {
        if (!calendarioActual) return

        const nuevoCalendario = { ...calendarioActual }
        nuevoCalendario.horarios[dia].descansos[index] = {
            ...nuevoCalendario.horarios[dia].descansos[index],
            [campo]: valor
        }

        setCalendarioActual(nuevoCalendario)

        const calendariosActualizados = calendariosProfesionales.map(cal =>
            cal.id === nuevoCalendario.id ? nuevoCalendario : cal
        )

        setCalendariosProfesionales(calendariosActualizados)
    }

    const agregarExcepcion = () => {
        if (!calendarioActual || !nuevaExcepcion.fecha) return

        const nuevoCalendario = { ...calendarioActual }
        nuevoCalendario.excepciones.push({
            ...nuevaExcepcion
        })

        setCalendarioActual(nuevoCalendario)

        const calendariosActualizados = calendariosProfesionales.map(cal =>
            cal.id === nuevoCalendario.id ? nuevoCalendario : cal
        )

        setCalendariosProfesionales(calendariosActualizados)

        setNuevaExcepcion({
            fecha: new Date(),
            activo: false,
            nota: ""
        })
    }

    const eliminarExcepcion = (index: number) => {
        if (!calendarioActual) return

        const nuevoCalendario = { ...calendarioActual }
        nuevoCalendario.excepciones.splice(index, 1)

        setCalendarioActual(nuevoCalendario)

        const calendariosActualizados = calendariosProfesionales.map(cal =>
            cal.id === nuevoCalendario.id ? nuevoCalendario : cal
        )

        setCalendariosProfesionales(calendariosActualizados)
    }

    // Función para volver a la página de agenda
    const volverAAgenda = () => {
        router.push("/agenda")
    }

    // Función para guardar todos los cambios
    const guardarCambios = () => {
        alert("Configuración guardada correctamente")
    }
    return (
        <AuthGuard>
            <ModuleLayout moduleType="agenda">
                <main className="flex-1 overflow-y-auto p-9 ">
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-2">

                            <h1 className="text-2xl font-bold">Configuración de Agenda y Citas</h1>
                        </div>
                        <Button onClick={guardarCambios} className=" hidden bg-purple-500 hover:bg-purple-800">
                            Guardar Todos los Cambios
                        </Button>
                    </div>

                    <Tabs defaultValue="horarios" className="w-full">


                        <TabsList className="flex w-full h-24 lg:h-16 gap-3 overflow-x-auto sm:overflow-x-visible px-2 sm:px-0 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent" style={{ WebkitOverflowScrolling: 'touch' }}>
                            <TabsTrigger value="horarios" className="flex items-center min-w-[180px] max-w-[180px] h-12 gap-2 rounded-lg bg-white shadow-sm border border-gray-200 hover:bg-gray-50 transition-all justify-center">
                                <ClockIcon className="h-4 w-4" />
                                <span>Horarios</span>
                            </TabsTrigger>
                            <TabsTrigger value="servicios" className="flex items-center min-w-[180px] max-w-[180px] h-12 gap-2 rounded-lg bg-white shadow-sm border border-gray-200 hover:bg-gray-50 transition-all justify-center">
                                <ScissorsIcon className="h-4 w-4" />
                                <span>Servicios</span>
                            </TabsTrigger>
                            <TabsTrigger value="estilistas" className="flex items-center min-w-[180px] max-w-[180px] h-12 gap-2 rounded-lg bg-white shadow-sm border border-gray-200 hover:bg-gray-50 transition-all justify-center">
                                <PersonIcon className="h-4 w-4" />
                                <span>Profesionales</span>
                            </TabsTrigger>
                            <TabsTrigger value="festivos" className="flex items-center min-w-[180px] max-w-[180px] h-12 gap-2 rounded-lg bg-white shadow-sm border border-gray-200 hover:bg-gray-50 transition-all justify-center">
                                <CalendarIcon className="h-4 w-4" />
                                <span>Días Festivos</span>
                            </TabsTrigger>
                            <TabsTrigger value="categorias" className="flex items-center min-w-[180px] max-w-[180px] h-12 gap-2 rounded-lg bg-white shadow-sm border border-gray-200 hover:bg-gray-50 transition-all justify-center">
                                <ScissorsIcon className="h-4 w-4" />
                                <span>Categorías</span>
                            </TabsTrigger>
                             <TabsTrigger value="calendarios" className="flex items-center min-w-[180px] max-w-[180px] h-12 gap-2 rounded-lg bg-white shadow-sm border border-gray-200 hover:bg-gray-50 transition-all justify-center">
                                <CalendarIcon className="h-4 w-4" />
                                <span>Calendarios</span>
                            </TabsTrigger>

                        </TabsList>

                        {/* Pestaña de Horarios de Atención */}
                        <TabsContent value="horarios">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Horarios de Atención</CardTitle>
                                    <CardDescription>Configure los horarios de atención para cada día de la semana</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="overflow-x-auto">
                                        <Table className="min-w-[500px]">
                                            <TableHeader>
                                                <TableRow>
                                                    <TableHead>Día</TableHead>
                                                    <TableHead>Apertura</TableHead>
                                                    <TableHead>Cierre</TableHead>
                                                    <TableHead>Activo</TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {horarios.map((horario, index) => (
                                                    <TableRow key={horario.dia}>
                                                        <TableCell className="font-medium">{horario.dia}</TableCell>
                                                        <TableCell>
                                                            <Select
                                                                value={horario.apertura}
                                                                onValueChange={(value) => actualizarHorario(index, "apertura", value)}
                                                                disabled={!horario.activo}
                                                            >
                                                                <SelectTrigger className="w-[120px]">
                                                                    <SelectValue placeholder="Hora" />
                                                                </SelectTrigger>
                                                                <SelectContent>
                                                                    {Array.from({ length: 13 }, (_, i) => {
                                                                        const hora = 7 + i;
                                                                        const value = hora < 10 ? `0${hora}:00` : `${hora}:00`;
                                                                        return (
                                                                            <SelectItem key={value} value={value}>
                                                                                {value}
                                                                            </SelectItem>
                                                                        );
                                                                    })}
                                                                </SelectContent>
                                                            </Select>
                                                        </TableCell>
                                                        <TableCell>
                                                            <Select
                                                                value={horario.cierre}
                                                                onValueChange={(value) => actualizarHorario(index, "cierre", value)}
                                                                disabled={!horario.activo}
                                                            >
                                                                <SelectTrigger className="w-[120px]">
                                                                    <SelectValue placeholder="Hora" />
                                                                </SelectTrigger>
                                                                <SelectContent>
                                                                    {Array.from({ length: 13 }, (_, i) => {
                                                                        const hora = 12 + i;
                                                                        const value = hora < 10 ? `0${hora}:00` : `${hora}:00`;
                                                                        return (
                                                                            <SelectItem key={value} value={value}>
                                                                                {value}
                                                                            </SelectItem>
                                                                        );
                                                                    })}
                                                                </SelectContent>
                                                            </Select>
                                                        </TableCell>
                                                        <TableCell>
                                                            <div className="flex items-center space-x-2">
                                                                <Switch
                                                                    checked={horario.activo}
                                                                    onCheckedChange={(checked) => {
                                                                        actualizarHorario(index, "activo", checked);
                                                                    }}
                                                                    className={horario.activo ? "data-[state=checked]:bg-purple-500 data-[state=checked]:border-purple-500" : ""}
                                                                />
                                                                <Label>{horario.activo ? "Abierto" : "Cerrado"}</Label>
                                                            </div>
                                                        </TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </div>
                                    <div className="mt-6 flex justify-end">
                                        <Button onClick={guardarHorarios}>Guardar Cambios</Button>
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        {/* Pestaña de Servicios */}
                        <TabsContent value="servicios">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Servicios y Precios</CardTitle>
                                    <CardDescription>Administre los servicios ofrecidos, sus precios y duración</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                                            <div className="sm:col-span-2">
                                                <Label htmlFor="nombre-servicio">Nombre del Servicio</Label>
                                                <Input
                                                    id="nombre-servicio"
                                                    value={nuevoServicio.nombre || ""}
                                                    onChange={(e) => setNuevoServicio({ ...nuevoServicio, nombre: e.target.value })}
                                                />
                                            </div>
                                            <div>
                                                <Label htmlFor="duracion-servicio">Duración (min)</Label>
                                                <Input
                                                    id="duracion-servicio"
                                                    type="number"
                                                    value={nuevoServicio.duracion || ""}
                                                    onChange={(e) =>
                                                        setNuevoServicio({ ...nuevoServicio, duracion: Number.parseInt(e.target.value) })
                                                    }
                                                />
                                            </div>
                                            <div>
                                                <Label htmlFor="precio-servicio">Precio ($)</Label>
                                                <Input
                                                    id="precio-servicio"
                                                    type="number"
                                                    value={nuevoServicio.precio || ""}
                                                    onChange={(e) =>
                                                        setNuevoServicio({ ...nuevoServicio, precio: Number.parseInt(e.target.value) })
                                                    }
                                                />
                                            </div>
                                            <div>
                                                <Label htmlFor="categoria-servicio">Categoría</Label>
                                                <Select
                                                    value={nuevoServicio.categoria || ""}
                                                    onValueChange={(value) => setNuevoServicio({ ...nuevoServicio, categoria: value })}
                                                >
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Seleccionar" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {categorias.map((categoria) => (
                                                            <SelectItem key={categoria.id} value={categoria.id}>
                                                                <div className="flex items-center gap-2">
                                                                    <div
                                                                        className="w-3 h-3 rounded-full"
                                                                        style={{ backgroundColor: categoria.color }}
                                                                    ></div>
                                                                    <span>{categoria.nombre}</span>
                                                                </div>
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                            <div className="flex items-end">
                                                {editandoServicio ? (
                                                    <div className="flex gap-2">
                                                        <Button onClick={actualizarServicio}>Actualizar</Button>
                                                        <Button
                                                            variant="outline"
                                                            onClick={() => {
                                                                setNuevoServicio({})
                                                                setEditandoServicio(null)
                                                            }}
                                                        >
                                                            Cancelar
                                                        </Button>
                                                    </div>
                                                ) : (
                                                    <Button onClick={agregarServicio}>Agregar Servicio</Button>
                                                )}
                                            </div>
                                        </div>

                                        <div>
                                            <Label htmlFor="descripcion-servicio">Descripción</Label>
                                            <Input
                                                id="descripcion-servicio"
                                                value={nuevoServicio.descripcion || ""}
                                                onChange={(e) => setNuevoServicio({ ...nuevoServicio, descripcion: e.target.value })}
                                                placeholder="Descripción detallada del servicio"
                                            />
                                        </div>

                                        <div className="border rounded-md mt-6">
                                            <Table>
                                                <TableHeader>
                                                    <TableRow>
                                                        <TableHead>Nombre</TableHead>
                                                        <TableHead>Categoría</TableHead>
                                                        <TableHead>Duración</TableHead>
                                                        <TableHead>Precio</TableHead>
                                                        <TableHead>Acciones</TableHead>
                                                    </TableRow>
                                                </TableHeader>
                                                <TableBody>
                                                    {servicios.map((servicio) => (
                                                        <TableRow key={servicio.id}>
                                                            <TableCell className="font-medium">{servicio.nombre}</TableCell>
                                                            <TableCell>
                                                                {servicio.categoria && (
                                                                    <div className="flex items-center gap-2">
                                                                        <div
                                                                            className="w-3 h-3 rounded-full"
                                                                            style={{
                                                                                backgroundColor:
                                                                                    categorias.find((c) => c.id === servicio.categoria)?.color || "#000",
                                                                            }}
                                                                        ></div>
                                                                        <span>{categorias.find((c) => c.id === servicio.categoria)?.nombre || "Sin categoría"}</span>
                                                                    </div>
                                                                )}
                                                            </TableCell>
                                                            <TableCell>{servicio.duracion} min</TableCell>
                                                            <TableCell>${servicio.precio.toLocaleString()}</TableCell>
                                                            <TableCell>
                                                                <div className="flex gap-2">
                                                                    <Button variant="outline" size="sm" onClick={() => editarServicio(servicio.id)}>
                                                                        Editar
                                                                    </Button>
                                                                    <Button variant="destructive" size="sm" onClick={() => eliminarServicio(servicio.id)}>
                                                                        Eliminar
                                                                    </Button>
                                                                </div>
                                                            </TableCell>
                                                        </TableRow>
                                                    ))}
                                                </TableBody>
                                            </Table>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        {/* Pestaña de Estilistas/Profesionales */}
                        <TabsContent value="estilistas">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Profesionales</CardTitle>
                                    <CardDescription>Administre los profesionales, sus horarios y especialidades</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                                            <div>
                                                <Label htmlFor="buscador-usuario">Buscar Usuario</Label>
                                                <div className="relative">
                                                    <Input
                                                        id="buscador-usuario"
                                                        value={nuevoEstilista.nombre || busquedaUsuario}
                                                        onChange={(e) => {
                                                            setBusquedaUsuario(e.target.value);
                                                            setNuevoEstilista({ ...nuevoEstilista, nombre: "", userId: "" });
                                                        }}
                                                        placeholder="Escribe el nombre o correo..."
                                                        autoComplete="off"
                                                    />
                                                    {usuariosFiltrados.length > 0 && busquedaUsuario.trim() !== "" && (
                                                        <div className="absolute z-10 bg-white border rounded shadow w-full mt-1 max-h-60 overflow-y-auto">
                                                            {usuariosFiltrados.map((usuario) => (
                                                                <div
                                                                    key={usuario.id}
                                                                    className="px-3 py-2 cursor-pointer hover:bg-gray-100 flex flex-col"
                                                                    onClick={() => {
                                                                        setNuevoEstilista({
                                                                            ...nuevoEstilista,
                                                                            nombre: `${usuario.firstName} ${usuario.lastName}`,
                                                                            userId: usuario.id,
                                                                            email: usuario.email,
                                                                        });
                                                                        setBusquedaUsuario("");
                                                                        setUsuariosFiltrados([]);
                                                                    }}
                                                                >
                                                                    <span className="font-medium">{usuario.firstName} {usuario.lastName}</span>
                                                                    <span className="text-xs text-gray-500">{usuario.email}</span>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="mt-2">
                                                    <Button onClick={() => setOpenCrearUsuario(true)} className="bg-green-500 hover:bg-green-600">Crear usuario</Button>
                                                </div>
                                                {/* Modal sencillo para crear usuario */}
                                                {openCrearUsuario && (
                                                    <div className="fixed inset-0 z-50 flex items-center justify-center">
                                                        <div className="absolute inset-0 bg-black/40" onClick={() => setOpenCrearUsuario(false)} />
                                                        <div className="bg-white rounded-lg shadow-lg w-full max-w-lg mx-4 z-10 p-6">
                                                            <h3 className="text-lg font-semibold mb-3">Crear Usuario</h3>
                                                            <div className="grid grid-cols-1 gap-3">
                                                                <Input
                                                                    placeholder="Nombre"
                                                                    value={nuevoUsuario.firstName}
                                                                    onChange={(e) => setNuevoUsuario({ ...nuevoUsuario, firstName: e.target.value })}
                                                                />
                                                                <Input
                                                                    placeholder="Apellido"
                                                                    value={nuevoUsuario.lastName}
                                                                    onChange={(e) => setNuevoUsuario({ ...nuevoUsuario, lastName: e.target.value })}
                                                                />
                                                                <Input
                                                                    placeholder="Correo electrónico"
                                                                    type="email"
                                                                    value={nuevoUsuario.email}
                                                                    onChange={(e) => setNuevoUsuario({ ...nuevoUsuario, email: e.target.value })}
                                                                />
                                                                <Input
                                                                    placeholder="Contraseña"
                                                                    type="password"
                                                                    value={nuevoUsuario.password}
                                                                    onChange={(e) => setNuevoUsuario({ ...nuevoUsuario, password: e.target.value })}
                                                                />
                                                                <Select value={nuevoUsuario.role} onValueChange={(v) => setNuevoUsuario({ ...nuevoUsuario, role: v })}>
                                                                    <SelectTrigger>
                                                                        <SelectValue />
                                                                    </SelectTrigger>
                                                                    <SelectContent>
                                                                        <SelectItem value="USER">USER</SelectItem>
                                                                        <SelectItem value="ADMIN">ADMIN</SelectItem>
                                                                    </SelectContent>
                                                                </Select>
                                                            </div>
                                                            <div className="mt-4 flex justify-end gap-2">
                                                                <Button variant="outline" onClick={() => setOpenCrearUsuario(false)}>Cancelar</Button>
                                                                <Button onClick={crearUsuario}>Crear Usuario</Button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                            <div>
                                                <Label htmlFor="buscador-especialidad">Especialidad</Label>
                                                <div className="relative">
                                                    <Input
                                                        id="buscador-especialidad"
                                                        value={especialidadBusqueda}
                                                        onChange={(e) => setEspecialidadBusqueda(e.target.value)}
                                                        placeholder="Buscar especialidad..."
                                                        autoComplete="off"
                                                    />
                                                    {especialidadesFiltradas.length > 0 && especialidadBusqueda.trim() !== "" && (
                                                        <div className="absolute z-10 bg-white border rounded shadow w-full mt-1 max-h-60 overflow-y-auto">
                                                            {especialidadesFiltradas.map((esp) => (
                                                                <div
                                                                    key={esp.id}
                                                                    className="px-3 py-2 cursor-pointer hover:bg-gray-100 flex items-center gap-2"
                                                                    onClick={() => {
                                                                        const currentIds = nuevoEstilista.specialtyIds || [];
                                                                        const updatedIds = currentIds.includes(esp.id)
                                                                            ? currentIds.filter(id => id !== esp.id)
                                                                            : [...currentIds, esp.id];
                                                                        setNuevoEstilista({
                                                                            ...nuevoEstilista,
                                                                            especialidad: esp.name,
                                                                            specialtyIds: updatedIds,
                                                                        });
                                                                    }}
                                                                >
                                                                    <input
                                                                        type="checkbox"
                                                                        checked={(nuevoEstilista.specialtyIds || []).includes(esp.id)}
                                                                        onChange={() => {}}
                                                                        className="rounded border-gray-300"
                                                                    />
                                                                    <span className="font-medium">{esp.name}</span>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    )}
                                                    {(nuevoEstilista.specialtyIds && nuevoEstilista.specialtyIds.length > 0) && (
                                                        <div className="mt-3 p-2 bg-blue-50 rounded border border-blue-200">
                                                            <p className="text-sm font-semibold text-blue-900">Especialidades seleccionadas:</p>
                                                            <div className="flex flex-wrap gap-2 mt-2">
                                                                {especialidades
                                                                    .filter((esp) => nuevoEstilista.specialtyIds?.includes(esp.id))
                                                                    .map((esp) => (
                                                                        <span
                                                                            key={esp.id}
                                                                            className="bg-blue-500 text-white px-3 py-1 rounded-full text-sm flex items-center gap-2"
                                                                        >
                                                                            {esp.name}
                                                                            <button
                                                                                onClick={() => {
                                                                                    const updated = (nuevoEstilista.specialtyIds || []).filter(
                                                                                        (id) => id !== esp.id
                                                                                    );
                                                                                    setNuevoEstilista({
                                                                                        ...nuevoEstilista,
                                                                                        specialtyIds: updated,
                                                                                    });
                                                                                }}
                                                                                className="ml-1 font-bold hover:text-blue-200"
                                                                            >
                                                                                ×
                                                                            </button>
                                                                        </span>
                                                                    ))}
                                                            </div>
                                                        </div>
                                                    )}
                                                    <div className="mt-2">
                                                        <Button onClick={() => setOpenCrearEspecialidad(true)} className="bg-green-500 hover:bg-green-600">Crear especialidad</Button>
                                                    </div>
                                                    {/* Modal sencillo para crear especialidad */}
                                                    {openCrearEspecialidad && (
                                                        <div className="fixed inset-0 z-50 flex items-center justify-center">
                                                            <div className="absolute inset-0 bg-black/40" onClick={() => setOpenCrearEspecialidad(false)} />
                                                            <div className="bg-white rounded-lg shadow-lg w-full max-w-md mx-4 z-10 p-6">
                                                                <h3 className="text-lg font-semibold mb-3">Crear Especialidad</h3>
                                                                <Input
                                                                    value={nuevaEspecialidadNombre}
                                                                    onChange={(e) => setNuevaEspecialidadNombre(e.target.value)}
                                                                    placeholder="Nombre de la especialidad"
                                                                />
                                                                <div className="mt-4 flex justify-end gap-2">
                                                                    <Button variant="outline" onClick={() => setOpenCrearEspecialidad(false)}>Cancelar</Button>
                                                                    <Button onClick={crearEspecialidad}>Crear</Button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                            <div>
                                                <Label htmlFor="color-estilista">Color de Identificación</Label>
                                                <div className="flex gap-2">
                                                    <Input
                                                        id="color-estilista"
                                                        type="color"
                                                        value={nuevoEstilista.color || "#000000"}
                                                        onChange={(e) => setNuevoEstilista({ ...nuevoEstilista, color: e.target.value })}
                                                        className="w-12 h-10 p-1"
                                                    />
                                                    <Input
                                                        value={nuevoEstilista.color || ""}
                                                        onChange={(e) => setNuevoEstilista({ ...nuevoEstilista, color: e.target.value })}
                                                        placeholder="#000000"
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        <div>
                                            <Label>Días Disponibles</Label>
                                            <div className="flex flex-wrap gap-2 mt-2">
                                                {workingHours.length > 0 ? (
                                                    workingHours
                                                        .sort((a, b) => a.dayOfWeek - b.dayOfWeek)
                                                        .map((wh) => {
                                                            const dias = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"];
                                                            const diaNombre = dias[(wh.dayOfWeek ?? 1) - 1];
                                                            const seleccionado = (nuevoEstilista.workingDays || []).includes(wh.dayOfWeek.toString());
                                                            return (
                                                                <button
                                                                    key={wh.id}
                                                                    type="button"
                                                                    className={`flex flex-col items-center border rounded p-2 min-w-[90px] cursor-pointer transition-all ${seleccionado ? "bg-purple-100 border-purple-500" : "bg-white border-gray-300"}`}
                                                                    onClick={() => {
                                                                        let nuevosDias = Array.isArray(nuevoEstilista.workingDays) ? [...nuevoEstilista.workingDays] : [];
                                                                        if (seleccionado) {
                                                                            nuevosDias = nuevosDias.filter((dia) => dia !== wh.dayOfWeek.toString());
                                                                        } else {
                                                                            nuevosDias.push(wh.dayOfWeek.toString());
                                                                        }
                                                                        setNuevoEstilista({ ...nuevoEstilista, workingDays: nuevosDias });
                                                                    }}
                                                                >
                                                                    <span className="font-medium mb-1">{diaNombre}</span>
                                                                    <span className="text-xs text-gray-500">{wh.startTime} - {wh.endTime}</span>
                                                                    <span className={`mt-1 text-xs ${seleccionado ? "text-purple-600" : "text-gray-400"}`}>{seleccionado ? "Seleccionado" : "Seleccionar"}</span>
                                                                </button>
                                                            );
                                                        })
                                                ) : (
                                                    <span className="text-gray-400">No hay días disponibles configurados</span>
                                                )}
                                            </div>
                                        </div>

                                        <div className="flex justify-end">
                                            {editandoEstilista ? (
                                                <div className="flex gap-2">
                                                    <Button onClick={actualizarEstilista}>Actualizar</Button>
                                                    <Button
                                                        variant="outline"
                                                        onClick={() => {
                                                            setNuevoEstilista({ diasDisponibles: [] })
                                                            setEditandoEstilista(null)
                                                            setEspecialidadBusqueda("")
                                                        }}
                                                    >
                                                        Cancelar
                                                    </Button>
                                                </div>
                                            ) : (
                                                <Button onClick={agregarEstilista}>Agregar Profesional</Button>
                                            )}
                                        </div>

                                        <div className="grid grid-cols-3 gap-4 mt-4">
                                            {estilistas.map((estilista) => (
                                                <div key={estilista.id} className="border rounded-lg p-4">
                                                    <div className="flex items-center gap-3 mb-3">
                                                        <div
                                                            className="w-10 h-10 rounded-full flex items-center justify-center text-white"
                                                            style={{ backgroundColor: estilista.color }}
                                                        >
                                                            {(estilista.nombre ?? "").charAt(0)}
                                                        </div>
                                                        <div>
                                                            <div className="font-medium">{estilista.nombre}</div>
                                                            <div className="text-sm text-gray-500">{estilista.especialidad}</div>
                                                        </div>
                                                    </div>
                                                    <div className="mb-3">
                                                        <div className="text-sm font-medium mb-1">Horario:</div>
                                                        <div className="text-sm text-gray-600">
                                                            {estilista.horaInicio} - {estilista.horaFin}
                                                            {estilista.descanso && (
                                                                <span className="ml-2 text-xs text-gray-500">
                                                                    (Descanso: {estilista.descanso.inicio} - {estilista.descanso.fin})
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>
                                                    <div className="mb-3">
                                                        <div className="text-sm font-medium mb-1">Días disponibles:</div>
                                                        <div className="flex flex-wrap gap-1">
                                                            {[...(estilista.diasDisponibles ?? [])]
                                                                .sort((a, b) => {
                                                                    // Convertir a número para ordenar
                                                                    const numA = typeof a === "number" ? a : (typeof a === "string" && /^\d+$/.test(a) ? parseInt(a) : 99);
                                                                    const numB = typeof b === "number" ? b : (typeof b === "string" && /^\d+$/.test(b) ? parseInt(b) : 99);
                                                                    return numA - numB;
                                                                })
                                                                .map((dia) => {
                                                                    const diasSemana = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"];
                                                                    let nombreDia = dia;
                                                                    if (typeof dia === "number" && dia >= 1 && dia <= 7) {
                                                                        nombreDia = diasSemana[dia - 1];
                                                                    }
                                                                    if (typeof dia === "string" && /^\d+$/.test(dia)) {
                                                                        const num = parseInt(dia);
                                                                        if (num >= 1 && num <= 7) nombreDia = diasSemana[num - 1];
                                                                    }
                                                                    return (
                                                                        <span key={dia} className="px-2 py-1 bg-gray-100 rounded text-xs">
                                                                            {nombreDia}
                                                                        </span>
                                                                    );
                                                                })}
                                                        </div>
                                                    </div>
                                                    <div className="flex justify-end gap-2">

                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() => {
                                                                if (estilista.id) editarEstilista(estilista.id);
                                                            }}
                                                            disabled={estilista.status !== "ACTIVE"}
                                                        >
                                                            Editar
                                                        </Button>
                                                        <Button
                                                            variant={estilista.status === "ACTIVE" ? "destructive" : "default"}
                                                            size="sm"
                                                            onClick={() => {
                                                                if (estilista.id) updateStatus(estilista.id, estilista.status);
                                                            }}
                                                            className={estilista.status === "ACTIVE" ? "" : "bg-green-500 hover:bg-green-600 text-white"}
                                                        >
                                                            {estilista.status === "ACTIVE" ? "Inactivar" : "Activar"}
                                                        </Button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        {/* Pestaña de Días Festivos */}
                        <TabsContent value="festivos">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Días Festivos</CardTitle>
                                    <CardDescription>Configure los días festivos y especiales del año</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                                            <div>
                                                <Label htmlFor="fecha-festivo">Fecha</Label>
                                                <Popover>
                                                    <PopoverTrigger asChild>
                                                        <Button variant="outline" className="w-full justify-start text-left font-normal">
                                                            <CalendarIcon className="mr-2 h-4 w-4" />
                                                            {nuevoDiaFestivo.fecha
                                                                ? format(nuevoDiaFestivo.fecha, "PPP", { locale: es })
                                                                : "Seleccionar fecha"}
                                                        </Button>
                                                    </PopoverTrigger>
                                                    <PopoverContent className="w-auto p-0">
                                                        <Calendar
                                                            mode="single"
                                                            selected={nuevoDiaFestivo.fecha}
                                                            onSelect={(date) => date && setNuevoDiaFestivo({ ...nuevoDiaFestivo, fecha: date })}
                                                            initialFocus
                                                        />
                                                    </PopoverContent>
                                                </Popover>
                                            </div>
                                            <div>
                                                <Label htmlFor="nombre-festivo">Nombre del Día Festivo</Label>
                                                <Input
                                                    id="nombre-festivo"
                                                    value={nuevoDiaFestivo.nombre || ""}
                                                    onChange={(e) => setNuevoDiaFestivo({ ...nuevoDiaFestivo, nombre: e.target.value })}
                                                />
                                            </div>
                                            <div>
                                                <Label htmlFor="cerrado-festivo">Estado</Label>
                                                <div className="flex items-center space-x-2 h-10 mt-2">
                                                    <Switch
                                                        id="cerrado-festivo"
                                                        checked={nuevoDiaFestivo.cerrado}
                                                        onCheckedChange={(checked) => setNuevoDiaFestivo({ ...nuevoDiaFestivo, cerrado: checked })}
                                                    />
                                                    <Label htmlFor="cerrado-festivo">{nuevoDiaFestivo.cerrado ? "Cerrado" : "Abierto"}</Label>
                                                </div>
                                            </div>
                                            <div className="flex items-end">
                                                {editandoDiaFestivo ? (
                                                    <div className="flex gap-2">
                                                        <Button onClick={actualizarDiaFestivo}>Actualizar</Button>
                                                        <Button
                                                            variant="outline"
                                                            onClick={() => {
                                                                setNuevoDiaFestivo({
                                                                    fecha: new Date(),
                                                                    cerrado: true,
                                                                })
                                                                setEditandoDiaFestivo(null)
                                                            }}
                                                        >
                                                            Cancelar
                                                        </Button>
                                                    </div>
                                                ) : (
                                                    <Button onClick={agregarDiaFestivo}>Agregar Día Festivo</Button>
                                                )}
                                            </div>
                                        </div>

                                        <div className="border rounded-md mt-6">
                                            <Table>
                                                <TableHeader>
                                                    <TableRow>
                                                        <TableHead>Fecha</TableHead>
                                                        <TableHead>Nombre</TableHead>
                                                        <TableHead>Estado</TableHead>
                                                        <TableHead>Acciones</TableHead>
                                                    </TableRow>
                                                </TableHeader>
                                                <TableBody>
                                                    {diasFestivos.map((diaFestivo) => (
                                                        <TableRow key={diaFestivo.id}>
                                                            <TableCell>{format(diaFestivo.fecha, "PPP", { locale: es })}</TableCell>
                                                            <TableCell className="font-medium">{diaFestivo.nombre}</TableCell>
                                                            <TableCell>
                                                                <span
                                                                    className={`px-2 py-1 rounded text-xs ${diaFestivo.cerrado ? "bg-red-100 text-red-800" : "bg-green-100 text-green-800"}`}
                                                                >
                                                                    {diaFestivo.cerrado ? "Cerrado" : "Abierto"}
                                                                </span>
                                                            </TableCell>
                                                            <TableCell>
                                                                <div className="flex gap-2">
                                                                    <Button variant="outline" size="sm" onClick={() => editarDiaFestivo(diaFestivo.id)}>
                                                                        Editar
                                                                    </Button>
                                                                    <Button
                                                                        variant="destructive"
                                                                        size="sm"
                                                                        onClick={() => eliminarDiaFestivo(diaFestivo.id)}
                                                                    >
                                                                        Eliminar
                                                                    </Button>
                                                                </div>
                                                            </TableCell>
                                                        </TableRow>
                                                    ))}
                                                </TableBody>
                                            </Table>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        {/* Pestaña de Categorías */}
                        <TabsContent value="categorias">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Categorías de Servicios</CardTitle>
                                    <CardDescription>Administre las categorías para organizar los servicios</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                                            <div>
                                                <Label htmlFor="nombre-categoria">Nombre de la Categoría</Label>
                                                <Input
                                                    id="nombre-categoria"
                                                    value={nuevaCategoria.nombre || ""}
                                                    onChange={(e) => setNuevaCategoria({ ...nuevaCategoria, nombre: e.target.value })}
                                                />
                                            </div>
                                            <div>
                                                <Label htmlFor="color-categoria">Color</Label>
                                                <div className="flex gap-2">
                                                    <Input
                                                        id="color-categoria"
                                                        type="color"
                                                        value={nuevaCategoria.color || "#000000"}
                                                        onChange={(e) => setNuevaCategoria({ ...nuevaCategoria, color: e.target.value })}
                                                        className="w-12 h-10 p-1"
                                                    />
                                                    <Input
                                                        value={nuevaCategoria.color || ""}
                                                        onChange={(e) => setNuevaCategoria({ ...nuevaCategoria, color: e.target.value })}
                                                        placeholder="#000000"
                                                    />
                                                </div>
                                            </div>
                                            <div className="flex items-end">
                                                {editandoCategoria ? (
                                                    <div className="flex gap-2">
                                                        <Button onClick={actualizarCategoria}>Actualizar</Button>
                                                        <Button
                                                            variant="outline"
                                                            onClick={() => {
                                                                setNuevaCategoria({
                                                                    color: "#000000",
                                                                })
                                                                setEditandoCategoria(null)
                                                            }}
                                                        >
                                                            Cancelar
                                                        </Button>
                                                    </div>
                                                ) : (
                                                    <Button onClick={agregarCategoria}>Agregar Categoría</Button>
                                                )}
                                            </div>
                                        </div>

                                        <div className="border rounded-md mt-6">
                                            <Table>
                                                <TableHeader>
                                                    <TableRow>
                                                        <TableHead>Color</TableHead>
                                                        <TableHead>Nombre</TableHead>
                                                        <TableHead>Servicios</TableHead>
                                                        <TableHead>Acciones</TableHead>
                                                    </TableRow>
                                                </TableHeader>
                                                <TableBody>
                                                    {categorias.map((categoria) => (
                                                        <TableRow key={categoria.id}>
                                                            <TableCell>
                                                                <div className="w-6 h-6 rounded" style={{ backgroundColor: categoria.color }}></div>
                                                            </TableCell>
                                                            <TableCell className="font-medium">{categoria.nombre}</TableCell>
                                                            <TableCell>{servicios.filter((s) => s.categoria === categoria.nombre).length}</TableCell>
                                                            <TableCell>
                                                                <div className="flex gap-2">
                                                                    <Button variant="outline" size="sm" onClick={() => editarCategoria(categoria.id)}>
                                                                        Editar
                                                                    </Button>
                                                                    <Button
                                                                        variant="destructive"
                                                                        size="sm"
                                                                        onClick={() => eliminarCategoria(categoria.id)}
                                                                    >
                                                                        Eliminar
                                                                    </Button>
                                                                </div>
                                                            </TableCell>
                                                        </TableRow>
                                                    ))}
                                                </TableBody>
                                            </Table>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        {/* Nueva Pestaña de Calendarios de Profesionales */}
                        <TabsContent value="calendarios">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Calendarios de Profesionales</CardTitle>
                                    <CardDescription>Configure los horarios específicos para cada profesional</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-6">
                                        <div>
                                            <Label htmlFor="seleccionar-estilista">Seleccionar Profesional</Label>
                                            <Select
                                                value={estilistaSeleccionado}
                                                onValueChange={seleccionarEstilista}
                                            >
                                                <SelectTrigger className="w-full">
                                                    <SelectValue placeholder="Seleccionar profesional" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {estilistas.map((estilista) => (
                                                        <SelectItem key={estilista.id ?? ""} value={estilista.id ?? ""}>
                                                            <div className="flex items-center gap-2">
                                                                <div
                                                                    className="w-3 h-3 rounded-full"
                                                                    style={{ backgroundColor: estilista.color }}
                                                                ></div>
                                                                <span>{estilista.nombre}</span>
                                                            </div>
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        {calendarioActual && (
                                            <>
                                                <div className="border rounded-lg p-4">
                                                    <div className="flex items-center justify-between mb-4">
                                                        <h3 className="text-lg font-medium">Horario Semanal</h3>
                                                        <div className="flex gap-2">
                                                            {["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"].map((dia) => (
                                                                <Button
                                                                    key={dia}
                                                                    variant={diaSeleccionado === dia ? "default" : "outline"}
                                                                    onClick={() => setDiaSeleccionado(dia)}
                                                                    className="h-8"
                                                                >
                                                                    {dia.substring(0, 3)}
                                                                </Button>
                                                            ))}
                                                        </div>
                                                    </div>

                                                    <div className="space-y-4">
                                                        <div className="flex items-center space-x-2">
                                                            <Switch
                                                                checked={calendarioActual.horarios[diaSeleccionado].activo}
                                                                onCheckedChange={(checked) =>
                                                                    actualizarHorarioCalendario(diaSeleccionado, "activo", checked)
                                                                }
                                                            />
                                                            <Label>
                                                                {calendarioActual.horarios[diaSeleccionado].activo ? "Disponible" : "No Disponible"}
                                                            </Label>
                                                        </div>

                                                        <div className="grid grid-cols-2 gap-4">
                                                            <div>
                                                                <Label>Hora de Inicio</Label>
                                                                <Select
                                                                    value={calendarioActual.horarios[diaSeleccionado].horaInicio}
                                                                    onValueChange={(value) =>
                                                                        actualizarHorarioCalendario(diaSeleccionado, "horaInicio", value)
                                                                    }
                                                                    disabled={!calendarioActual.horarios[diaSeleccionado].activo}
                                                                >
                                                                    <SelectTrigger>
                                                                        <SelectValue placeholder="Seleccionar" />
                                                                    </SelectTrigger>
                                                                    <SelectContent>
                                                                        {Array.from({ length: 13 }, (_, i) => {
                                                                            const hora = 7 + i
                                                                            return (
                                                                                <SelectItem key={hora} value={`${hora}:00`}>
                                                                                    {`${hora}:00`}
                                                                                </SelectItem>
                                                                            )
                                                                        })}
                                                                    </SelectContent>
                                                                </Select>
                                                            </div>
                                                            <div>
                                                                <Label>Hora de Fin</Label>
                                                                <Select
                                                                    value={calendarioActual.horarios[diaSeleccionado].horaFin}
                                                                    onValueChange={(value) =>
                                                                        actualizarHorarioCalendario(diaSeleccionado, "horaFin", value)
                                                                    }
                                                                    disabled={!calendarioActual.horarios[diaSeleccionado].activo}
                                                                >
                                                                    <SelectTrigger>
                                                                        <SelectValue placeholder="Seleccionar" />
                                                                    </SelectTrigger>
                                                                    <SelectContent>
                                                                        {Array.from({ length: 13 }, (_, i) => {
                                                                            const hora = 12 + i
                                                                            return (
                                                                                <SelectItem key={hora} value={`${hora}:00`}>
                                                                                    {`${hora}:00`}
                                                                                </SelectItem>
                                                                            )
                                                                        })}
                                                                    </SelectContent>
                                                                </Select>
                                                            </div>
                                                        </div>

                                                        <div>
                                                            <div className="flex items-center justify-between mb-2">
                                                                <Label>Descansos</Label>
                                                                <Button
                                                                    variant="outline"
                                                                    size="sm"
                                                                    onClick={() => agregarDescanso(diaSeleccionado)}
                                                                    disabled={!calendarioActual.horarios[diaSeleccionado].activo}
                                                                >
                                                                    Agregar Descanso
                                                                </Button>
                                                            </div>

                                                            {calendarioActual.horarios[diaSeleccionado].descansos.length > 0 ? (
                                                                <div className="space-y-2">
                                                                    {calendarioActual.horarios[diaSeleccionado].descansos.map((descanso, index) => (
                                                                        <div key={index} className="flex items-center gap-2">
                                                                            <Select
                                                                                value={descanso.inicio}
                                                                                onValueChange={(value) =>
                                                                                    actualizarDescanso(diaSeleccionado, index, "inicio", value)
                                                                                }
                                                                                disabled={!calendarioActual.horarios[diaSeleccionado].activo}
                                                                            >
                                                                                <SelectTrigger className="w-[120px]">
                                                                                    <SelectValue placeholder="Inicio" />
                                                                                </SelectTrigger>
                                                                                <SelectContent>
                                                                                    {Array.from({ length: 13 }, (_, i) => {
                                                                                        const hora = 8 + i
                                                                                        return (
                                                                                            <SelectItem key={hora} value={`${hora}:00`}>
                                                                                                {`${hora}:00`}
                                                                                            </SelectItem>
                                                                                        )
                                                                                    })}
                                                                                </SelectContent>
                                                                            </Select>
                                                                            <span>a</span>
                                                                            <Select
                                                                                value={descanso.fin}
                                                                                onValueChange={(value) =>
                                                                                    actualizarDescanso(diaSeleccionado, index, "fin", value)
                                                                                }
                                                                                disabled={!calendarioActual.horarios[diaSeleccionado].activo}
                                                                            >
                                                                                <SelectTrigger className="w-[120px]">
                                                                                    <SelectValue placeholder="Fin" />
                                                                                </SelectTrigger>
                                                                                <SelectContent>
                                                                                    {Array.from({ length: 13 }, (_, i) => {
                                                                                        const hora = 9 + i
                                                                                        return (
                                                                                            <SelectItem key={hora} value={`${hora}:00`}>
                                                                                                {`${hora}:00`}
                                                                                            </SelectItem>
                                                                                        )
                                                                                    })}
                                                                                </SelectContent>
                                                                            </Select>
                                                                            <Button
                                                                                variant="destructive"
                                                                                size="icon"
                                                                                onClick={() => eliminarDescanso(diaSeleccionado, index)}
                                                                                disabled={!calendarioActual.horarios[diaSeleccionado].activo}
                                                                                className="h-8 w-8"
                                                                            >
                                                                                ×
                                                                            </Button>
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            ) : (
                                                                <div className="text-sm text-gray-500 italic">
                                                                    No hay descansos configurados para este día
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="border rounded-lg p-4">
                                                    <div className="flex items-center justify-between mb-4">
                                                        <h3 className="text-lg font-medium">Excepciones y Días Especiales</h3>
                                                    </div>

                                                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-4">
                                                        <div>
                                                            <Label>Fecha</Label>
                                                            <Popover>
                                                                <PopoverTrigger asChild>
                                                                    <Button variant="outline" className="w-full justify-start text-left font-normal">
                                                                        <CalendarIcon className="mr-2 h-4 w-4" />
                                                                        {nuevaExcepcion.fecha
                                                                            ? format(nuevaExcepcion.fecha, "PPP", { locale: es })
                                                                            : "Seleccionar fecha"}
                                                                    </Button>
                                                                </PopoverTrigger>
                                                                <PopoverContent className="w-auto p-0">
                                                                    <Calendar
                                                                        mode="single"
                                                                        selected={nuevaExcepcion.fecha}
                                                                        onSelect={(date) => date && setNuevaExcepcion({ ...nuevaExcepcion, fecha: date })}
                                                                        initialFocus
                                                                    />
                                                                </PopoverContent>
                                                            </Popover>
                                                        </div>
                                                        <div>
                                                            <Label>Estado</Label>
                                                            <div className="flex items-center space-x-2 h-10 mt-2">
                                                                <Switch
                                                                    checked={nuevaExcepcion.activo}
                                                                    onCheckedChange={(checked) =>
                                                                        setNuevaExcepcion({ ...nuevaExcepcion, activo: checked })
                                                                    }
                                                                />
                                                                <Label>{nuevaExcepcion.activo ? "Disponible" : "No Disponible"}</Label>
                                                            </div>
                                                        </div>
                                                        <div>
                                                            <Label>Nota</Label>
                                                            <Input
                                                                value={nuevaExcepcion.nota || ""}
                                                                onChange={(e) =>
                                                                    setNuevaExcepcion({ ...nuevaExcepcion, nota: e.target.value })
                                                                }
                                                                placeholder="Ej: Capacitación, Evento, etc."
                                                            />
                                                        </div>
                                                    </div>

                                                    {nuevaExcepcion.activo && (
                                                        <div className="grid grid-cols-2 gap-4 mb-4">
                                                            <div>
                                                                <Label>Hora de Inicio</Label>
                                                                <Select
                                                                    value={nuevaExcepcion.horaInicio || ""}
                                                                    onValueChange={(value) =>
                                                                        setNuevaExcepcion({ ...nuevaExcepcion, horaInicio: value })
                                                                    }
                                                                >
                                                                    <SelectTrigger>
                                                                        <SelectValue placeholder="Seleccionar" />
                                                                    </SelectTrigger>
                                                                    <SelectContent>
                                                                        {Array.from({ length: 13 }, (_, i) => {
                                                                            const hora = 7 + i
                                                                            return (
                                                                                <SelectItem key={hora} value={`${hora}:00`}>
                                                                                    {`${hora}:00`}
                                                                                </SelectItem>
                                                                            )
                                                                        })}
                                                                    </SelectContent>
                                                                </Select>
                                                            </div>
                                                            <div>
                                                                <Label>Hora de Fin</Label>
                                                                <Select
                                                                    value={nuevaExcepcion.horaFin || ""}
                                                                    onValueChange={(value) =>
                                                                        setNuevaExcepcion({ ...nuevaExcepcion, horaFin: value })
                                                                    }
                                                                >
                                                                    <SelectTrigger>
                                                                        <SelectValue placeholder="Seleccionar" />
                                                                    </SelectTrigger>
                                                                    <SelectContent>
                                                                        {Array.from({ length: 13 }, (_, i) => {
                                                                            const hora = 12 + i
                                                                            return (
                                                                                <SelectItem key={hora} value={`${hora}:00`}>
                                                                                    {`${hora}:00`}
                                                                                </SelectItem>
                                                                            )
                                                                        })}
                                                                    </SelectContent>
                                                                </Select>
                                                            </div>
                                                        </div>
                                                    )}

                                                    <div className="flex justify-end">
                                                        <Button onClick={agregarExcepcion}>Agregar Excepción</Button>
                                                    </div>

                                                    {calendarioActual.excepciones.length > 0 ? (
                                                        <div className="mt-4">
                                                            <Table>
                                                                <TableHeader>
                                                                    <TableRow>
                                                                        <TableHead>Fecha</TableHead>
                                                                        <TableHead>Estado</TableHead>
                                                                        <TableHead>Horario</TableHead>
                                                                        <TableHead>Nota</TableHead>
                                                                        <TableHead>Acciones</TableHead>
                                                                    </TableRow>
                                                                </TableHeader>
                                                                <TableBody>
                                                                    {calendarioActual.excepciones.map((excepcion, index) => (
                                                                        <TableRow key={index}>
                                                                            <TableCell>{format(excepcion.fecha, "PPP", { locale: es })}</TableCell>
                                                                            <TableCell>
                                                                                <span
                                                                                    className={`px-2 py-1 rounded text-xs ${excepcion.activo ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}
                                                                                >
                                                                                    {excepcion.activo ? "Disponible" : "No Disponible"}
                                                                                </span>
                                                                            </TableCell>
                                                                            <TableCell>
                                                                                {excepcion.activo && excepcion.horaInicio && excepcion.horaFin
                                                                                    ? `${excepcion.horaInicio} - ${excepcion.horaFin}`
                                                                                    : "-"}
                                                                            </TableCell>
                                                                            <TableCell>{excepcion.nota || "-"}</TableCell>
                                                                            <TableCell>
                                                                                <Button
                                                                                    variant="destructive"
                                                                                    size="sm"
                                                                                    onClick={() => eliminarExcepcion(index)}
                                                                                >
                                                                                    Eliminar
                                                                                </Button>
                                                                            </TableCell>
                                                                        </TableRow>
                                                                    ))}
                                                                </TableBody>
                                                            </Table>
                                                        </div>
                                                    ) : (
                                                        <div className="mt-4 text-sm text-gray-500 italic text-center">
                                                            No hay excepciones configuradas
                                                        </div>
                                                    )}
                                                </div>
                                            </>
                                        )}

                                        {!calendarioActual && estilistaSeleccionado && (
                                            <div className="text-center p-8 border rounded-lg">
                                                <CalendarIcon className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                                                <h3 className="text-lg font-medium mb-2">Calendario no configurado</h3>
                                                <p className="text-gray-500 mb-4">
                                                    Este profesional aún no tiene un calendario configurado. Seleccione otro profesional o cree un nuevo calendario.
                                                </p>
                                            </div>
                                        )}

                                        {!estilistaSeleccionado && (
                                            <div className="text-center p-8 border rounded-lg">
                                                <PersonIcon className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                                                <h3 className="text-lg font-medium mb-2">Seleccione un profesional</h3>
                                                <p className="text-gray-500">
                                                    Seleccione un profesional para configurar su calendario personalizado
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>

                    </Tabs>
                </main>
            </ModuleLayout>
        </AuthGuard>
    )
}