"use client";
import dynamic from "next/dynamic"
import { AuthGuard } from "@/components/auth-guard"
import { ModuleLayout } from "@/components/module-layout"
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Table, TableHeader, TableRow, TableHead, TableCell, TableBody } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Building2, UserCog, PlusCircle, RefreshCcw } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";

type Office = {
  id: string;
  name: string;
  address: string;
  city: string;
  department: string;
  created_at: string;
};

type Official = {
  id: string;
  name: string;
  position: string;
  office_id: string;
  office_name: string;
  created_at: string;
};

export default function AdministracionPage() {
  const [activeTab, setActiveTab] = useState("oficinas");
  const [offices, setOffices] = useState<Office[]>([]);
  const [officials, setOfficials] = useState<Official[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

  // Formularios
  const [newOffice, setNewOffice] = useState({ name: "", address: "", city: "", department: "" });
  const [newOfficial, setNewOfficial] = useState({ name: "", position: "", office_id: "" });

  // Simulación de carga inicial
  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setOffices([
        {
          id: "1",
          name: "Oficina Central",
          address: "Av. 45 #12-50",
          city: "Bogotá",
          department: "Cundinamarca",
          created_at: "2025-10-07",
        },
        {
          id: "2",
          name: "Oficina Regional Norte",
          address: "Cra 9 #22-13",
          city: "Barranquilla",
          department: "Atlántico",
          created_at: "2025-10-07",
        },
      ]);
      setOfficials([
        {
          id: "a1",
          name: "María González",
          position: "Coordinadora",
          office_id: "1",
          office_name: "Oficina Central",
          created_at: "2025-10-07",
        },
        {
          id: "a2",
          name: "Carlos Ruiz",
          position: "Técnico de Registro",
          office_id: "2",
          office_name: "Oficina Regional Norte",
          created_at: "2025-10-07",
        },
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  const filteredOffices = offices.filter((o) =>
    o.name.toLowerCase().includes(search.toLowerCase())
  );
  const filteredOfficials = officials.filter((o) =>
    o.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleRefresh = () => {
    setLoading(true);
    setTimeout(() => setLoading(false), 1000);
  };

  const handleAddOffice = () => {
    if (!newOffice.name) return;
    const id = String(Date.now());
    setOffices([
      ...offices,
      { ...newOffice, id, created_at: new Date().toISOString() },
    ]);
    setNewOffice({ name: "", address: "", city: "", department: "" });
  };

  const handleAddOfficial = () => {
    if (!newOfficial.name || !newOfficial.office_id) return;
    const id = String(Date.now());
    const office = offices.find((o) => o.id === newOfficial.office_id);
    setOfficials([
      ...officials,
      {
        ...newOfficial,
        id,
        office_name: office ? office.name : "Sin asignar",
        created_at: new Date().toISOString(),
      },
    ]);
    setNewOfficial({ name: "", position: "", office_id: "" });
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
            <CardHeader>
              <CardTitle className="text-2xl font-semibold text-gray-800 flex items-center gap-2">
                <Building2 className="w-6 h-6 text-blue-600" />
                Administración del Sistema
              </CardTitle>
            </CardHeader>

            <CardContent>
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-6">
                  <TabsTrigger value="oficinas">Oficinas</TabsTrigger>
                  <TabsTrigger value="funcionarios">Funcionarios</TabsTrigger>
                </TabsList>

                {/* === OFICINAS === */}
                <TabsContent value="oficinas">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex gap-2 items-center">
                      <Input
                        placeholder="Buscar oficina..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-64"
                      />
                      <Button variant="outline" onClick={handleRefresh}>
                        <RefreshCcw className="w-4 h-4 mr-2" />
                        Actualizar
                      </Button>
                    </div>

                    <Dialog>
                      <DialogTrigger asChild>
                        <Button className="flex gap-2 items-center">
                          <PlusCircle className="w-4 h-4" />
                          Nueva Oficina
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Registrar Oficina</DialogTitle>
                        </DialogHeader>
                        <div className="grid gap-3 py-2">
                          <Label>Nombre</Label>
                          <Input
                            value={newOffice.name}
                            onChange={(e) => setNewOffice({ ...newOffice, name: e.target.value })}
                          />
                          <Label>Dirección</Label>
                          <Input
                            value={newOffice.address}
                            onChange={(e) => setNewOffice({ ...newOffice, address: e.target.value })}
                          />
                          <Label>Ciudad</Label>
                          <Input
                            value={newOffice.city}
                            onChange={(e) => setNewOffice({ ...newOffice, city: e.target.value })}
                          />
                          <Label>Departamento</Label>
                          <Input
                            value={newOffice.department}
                            onChange={(e) => setNewOffice({ ...newOffice, department: e.target.value })}
                          />
                          <Button className="mt-3" onClick={handleAddOffice}>
                            Guardar
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>

                  <div className="border rounded-lg overflow-hidden">
                    <Table>
                      <TableHeader className="bg-gray-50">
                        <TableRow>
                          <TableHead>ID</TableHead>
                          <TableHead>Nombre</TableHead>
                          <TableHead>Dirección</TableHead>
                          <TableHead>Ciudad</TableHead>
                          <TableHead>Departamento</TableHead>
                          <TableHead>Creada</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredOffices.map((o) => (
                          <TableRow key={o.id}>
                            <TableCell>{o.id}</TableCell>
                            <TableCell>{o.name}</TableCell>
                            <TableCell>{o.address}</TableCell>
                            <TableCell>{o.city}</TableCell>
                            <TableCell>{o.department}</TableCell>
                            <TableCell>{o.created_at}</TableCell>
                          </TableRow>
                        ))}
                        {filteredOffices.length === 0 && (
                          <TableRow>
                            <TableCell colSpan={6} className="text-center py-4 text-gray-500">
                              No hay oficinas registradas.
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </div>
                </TabsContent>

                {/* === FUNCIONARIOS === */}
                <TabsContent value="funcionarios">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex gap-2 items-center">
                      <Input
                        placeholder="Buscar funcionario..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-64"
                      />
                      <Button variant="outline" onClick={handleRefresh}>
                        <RefreshCcw className="w-4 h-4 mr-2" />
                        Actualizar
                      </Button>
                    </div>

                    <Dialog>
                      <DialogTrigger asChild>
                        <Button className="flex gap-2 items-center">
                          <PlusCircle className="w-4 h-4" />
                          Nuevo Funcionario
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Registrar Funcionario</DialogTitle>
                        </DialogHeader>
                        <div className="grid gap-3 py-2">
                          <Label>Nombre</Label>
                          <Input
                            value={newOfficial.name}
                            onChange={(e) => setNewOfficial({ ...newOfficial, name: e.target.value })}
                          />
                          <Label>Cargo</Label>
                          <Input
                            value={newOfficial.position}
                            onChange={(e) => setNewOfficial({ ...newOfficial, position: e.target.value })}
                          />
                          <Label>Oficina</Label>
                          <Select
                            value={newOfficial.office_id}
                            onValueChange={(val) => setNewOfficial({ ...newOfficial, office_id: val })}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Seleccionar oficina" />
                            </SelectTrigger>
                            <SelectContent>
                              {offices.map((o) => (
                                <SelectItem key={o.id} value={o.id}>
                                  {o.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <Button className="mt-3" onClick={handleAddOfficial}>
                            Guardar
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>

                  <div className="border rounded-lg overflow-hidden">
                    <Table>
                      <TableHeader className="bg-gray-50">
                        <TableRow>
                          <TableHead>ID</TableHead>
                          <TableHead>Nombre</TableHead>
                          <TableHead>Cargo</TableHead>
                          <TableHead>Oficina</TableHead>
                          <TableHead>Fecha Registro</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredOfficials.map((a) => (
                          <TableRow key={a.id}>
                            <TableCell>{a.id}</TableCell>
                            <TableCell>{a.name}</TableCell>
                            <TableCell>{a.position}</TableCell>
                            <TableCell>{a.office_name}</TableCell>
                            <TableCell>{a.created_at}</TableCell>
                          </TableRow>
                        ))}
                        {filteredOfficials.length === 0 && (
                          <TableRow>
                            <TableCell colSpan={5} className="text-center py-4 text-gray-500">
                              No hay funcionarios registrados.
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </motion.div>

      </ModuleLayout>
    </AuthGuard>

  );
}
