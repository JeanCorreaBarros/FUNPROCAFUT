"use client";
import dynamic from "next/dynamic"
import { AuthGuard } from "@/components/auth-guard"
import { ModuleLayout } from "@/components/module-layout"
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Search,
  Eye,
  Edit,
  Trash2,
  UserCircle2,
  ScanLine,
  Camera,
  Save,
  PlusCircle,
  X,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

type Voter = {
  id: string;
  first_name: string;
  middle_name?: string;
  last_name: string;
  second_last_name?: string;
  id_number: string;
  id_type: string;
  gender?: string;
  birth_date?: string;
  birth_place?: string;
  created_at?: string;
};

export default function VotantesUnificadoPage() {
  const [search, setSearch] = useState("");
  const [voters, setVoters] = useState<Voter[]>([]);
  const [filtered, setFiltered] = useState<Voter[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    first_name: "",
    middle_name: "",
    last_name: "",
    second_last_name: "",
    gender: "",
    birth_date: "",
    birth_place: "",
    id_type: "",
    id_number: "",
    issuing_date: "",
    issuing_place: "",
  });

  useEffect(() => {
    const mockData: Voter[] = [
      {
        id: "1",
        first_name: "Juan",
        last_name: "Pérez",
        id_number: "1023456789",
        id_type: "CC",
        gender: "M",
        birth_place: "Medellín",
      },
      {
        id: "2",
        first_name: "Laura",
        last_name: "Gómez",
        id_number: "1098765432",
        id_type: "CC",
        gender: "F",
        birth_place: "Bogotá",
      },
    ];
    setVoters(mockData);
    setFiltered(mockData);
  }, []);

  const handleSearch = (value: string) => {
    setSearch(value);
    const filteredData = voters.filter(
      (v) =>
        v.first_name.toLowerCase().includes(value.toLowerCase()) ||
        v.last_name.toLowerCase().includes(value.toLowerCase()) ||
        v.id_number.includes(value)
    );
    setFiltered(filteredData);
  };

  const handleView = (id: string) => alert(`Ver detalles del votante con ID: ${id}`);
  const handleEdit = (id: string) => alert(`Editar votante con ID: ${id}`);
  const handleDelete = (id: string) => {
    if (confirm("¿Eliminar este votante?")) {
      setFiltered(filtered.filter((v) => v.id !== id));
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      const newVoter: Voter = {
        id: String(Date.now()),
        first_name: formData.first_name,
        last_name: formData.last_name,
        id_number: formData.id_number,
        id_type: formData.id_type,
        gender: formData.gender,
        birth_place: formData.birth_place,
      };
      setVoters((prev) => [...prev, newVoter]);
      setFiltered((prev) => [...prev, newVoter]);
      setIsModalOpen(false);
      setLoading(false);
      setFormData({
        first_name: "",
        middle_name: "",
        last_name: "",
        second_last_name: "",
        gender: "",
        birth_date: "",
        birth_place: "",
        id_type: "",
        id_number: "",
        issuing_date: "",
        issuing_place: "",
      });
      alert("✅ Votante registrado correctamente");
    }, 1000);
  };

  return (

    <AuthGuard>
      <ModuleLayout moduleType="vote">
        <motion.div
          className="p-6 space-y-6"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="max-w-6xl mx-auto shadow-md border rounded-2xl">
            <CardHeader className="flex justify-between items-center">
              <CardTitle className="text-2xl font-semibold text-gray-800 flex items-center gap-2">
                <UserCircle2 className="w-6 h-6 text-blue-600" />
                Listado de Votantes Registrados
              </CardTitle>
              <Button
                onClick={() => setIsModalOpen(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2"
              >
                <PlusCircle className="w-4 h-4" />
                Registrar Votante
              </Button>
            </CardHeader>

            <CardContent>
              {/* Búsqueda */}
              <div className="flex items-center gap-2 mb-4">
                <div className="relative w-full">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Buscar por nombre o número de cédula..."
                    className="pl-8"
                    value={search}
                    onChange={(e) => handleSearch(e.target.value)}
                  />
                </div>
                <Button onClick={() => handleSearch(search)}>Buscar</Button>
              </div>

              {/* Tabla */}
              <div className="overflow-x-auto rounded-lg border">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gray-50">
                      <TableHead>#</TableHead>
                      <TableHead>Nombre Completo</TableHead>
                      <TableHead>Tipo Doc</TableHead>
                      <TableHead>Número</TableHead>
                      <TableHead>Género</TableHead>
                      <TableHead>Lugar Nacimiento</TableHead>
                      <TableHead className="text-center">Acciones</TableHead>
                    </TableRow>
                  </TableHeader>

                  <TableBody>
                    {filtered.length > 0 ? (
                      filtered.map((voter, i) => (
                        <TableRow key={voter.id} className="hover:bg-gray-50">
                          <TableCell>{i + 1}</TableCell>
                          <TableCell>{`${voter.first_name} ${voter.last_name}`}</TableCell>
                          <TableCell>{voter.id_type}</TableCell>
                          <TableCell>{voter.id_number}</TableCell>
                          <TableCell>{voter.gender || "-"}</TableCell>
                          <TableCell>{voter.birth_place || "-"}</TableCell>
                          <TableCell>
                            <div className="flex justify-center gap-2">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleView(voter.id)}
                                className="text-blue-600 border-blue-200 hover:bg-blue-50"
                              >
                                <Eye className="w-4 h-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleEdit(voter.id)}
                                className="text-amber-600 border-amber-200 hover:bg-amber-50"
                              >
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleDelete(voter.id)}
                                className="text-red-600 border-red-200 hover:bg-red-50"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell
                          colSpan={7}
                          className="text-center text-gray-500 py-4"
                        >
                          No se encontraron votantes.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>

          {/* Modal Registro */}
          <AnimatePresence>
            {isModalOpen && (
              <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto rounded-2xl">
                  <DialogHeader className="flex justify-between items-center">
                    <DialogTitle className="text-xl font-semibold flex items-center gap-2">
                      <ScanLine className="w-5 h-5 text-blue-600" />
                      Registro de Nuevo Votante
                    </DialogTitle>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => setIsModalOpen(false)}
                    >
                      <X className="w-5 h-5" />
                    </Button>
                  </DialogHeader>

                  <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    <div>
                      <Label>Nombres</Label>
                      <Input
                        name="first_name"
                        value={formData.first_name}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div>
                      <Label>Segundo Nombre</Label>
                      <Input name="middle_name" value={formData.middle_name} onChange={handleChange} />
                    </div>

                    <div>
                      <Label>Primer Apellido</Label>
                      <Input name="last_name" value={formData.last_name} onChange={handleChange} required />
                    </div>
                    <div>
                      <Label>Segundo Apellido</Label>
                      <Input name="second_last_name" value={formData.second_last_name} onChange={handleChange} />
                    </div>

                    <div>
                      <Label>Género</Label>
                      <Select onValueChange={(val) => setFormData({ ...formData, gender: val })}>
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccione" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="M">Masculino</SelectItem>
                          <SelectItem value="F">Femenino</SelectItem>
                          <SelectItem value="O">Otro</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label>Fecha de Nacimiento</Label>
                      <Input type="date" name="birth_date" value={formData.birth_date} onChange={handleChange} required />
                    </div>

                    <div className="md:col-span-2">
                      <Label>Lugar de Nacimiento</Label>
                      <Input name="birth_place" value={formData.birth_place} onChange={handleChange} required />
                    </div>

                    <div>
                      <Label>Tipo de Documento</Label>
                      <Select onValueChange={(val) => setFormData({ ...formData, id_type: val })}>
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccione tipo" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="CC">Cédula de Ciudadanía</SelectItem>
                          <SelectItem value="CE">Cédula de Extranjería</SelectItem>
                          <SelectItem value="DIGITAL">ID Digital</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label>Número de Documento</Label>
                      <Input name="id_number" value={formData.id_number} onChange={handleChange} required />
                    </div>

                    <div>
                      <Label>Fecha de Expedición</Label>
                      <Input type="date" name="issuing_date" value={formData.issuing_date} onChange={handleChange} />
                    </div>

                    <div>
                      <Label>Lugar de Expedición</Label>
                      <Input name="issuing_place" value={formData.issuing_place} onChange={handleChange} />
                    </div>

                    <div className="md:col-span-2 flex justify-between mt-4">
                      <Button type="button" variant="outline" className="flex items-center gap-2">
                        <Camera className="w-4 h-4" />
                        Escanear Cédula
                      </Button>
                      <Button type="submit" className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700">
                        <Save className="w-4 h-4" />
                        {loading ? "Guardando..." : "Guardar Registro"}
                      </Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
            )}
          </AnimatePresence>
        </motion.div>

      </ModuleLayout>
    </AuthGuard>

  );
}
