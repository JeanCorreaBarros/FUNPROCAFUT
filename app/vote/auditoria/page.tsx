"use client";
import dynamic from "next/dynamic"
import { AuthGuard } from "@/components/auth-guard"
import { ModuleLayout } from "@/components/module-layout"
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Table, TableHeader, TableRow, TableHead, TableCell, TableBody } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { RefreshCcw, FileText, Search } from "lucide-react";

type AuthAttempt = {
  id: string;
  user: string;
  method: string;
  result: string;
  timestamp: string;
};

type AuditLog = {
  id: string;
  action: string;
  module: string;
  performed_by: string;
  timestamp: string;
};

export default function AuditoriaPage() {
  const [authAttempts, setAuthAttempts] = useState<AuthAttempt[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);

  // Simulación de carga de datos
  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setAuthAttempts([
        {
          id: "1",
          user: "Juan Pérez",
          method: "Cédula",
          result: "Éxito",
          timestamp: "2025-10-08 14:35",
        },
        {
          id: "2",
          user: "Laura Gómez",
          method: "Huella",
          result: "Fallido",
          timestamp: "2025-10-08 14:36",
        },
        {
          id: "3",
          user: "Pedro López",
          method: "Facial",
          result: "Éxito",
          timestamp: "2025-10-08 14:38",
        },
      ]);

      setAuditLogs([
        {
          id: "101",
          action: "Actualización de datos del votante",
          module: "Gestión de Votantes",
          performed_by: "Admin",
          timestamp: "2025-10-08 13:45",
        },
        {
          id: "102",
          action: "Inicio de sesión fallido",
          module: "Autenticación",
          performed_by: "sistema",
          timestamp: "2025-10-08 13:47",
        },
        {
          id: "103",
          action: "Verificación facial completada",
          module: "Verificación",
          performed_by: "Juan Pérez",
          timestamp: "2025-10-08 13:49",
        },
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  const filteredAuthAttempts = authAttempts.filter((item) =>
    item.user.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredAuditLogs = auditLogs.filter((item) =>
    item.action.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleRefresh = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
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
            <CardHeader>
              <CardTitle className="text-2xl font-semibold text-gray-800 flex items-center gap-2">
                <FileText className="w-6 h-6 text-blue-600" />
                Auditoría del Sistema
              </CardTitle>
            </CardHeader>

            <CardContent>
              <Tabs defaultValue="autenticaciones" className="w-full">
                {/* ====== Pestañas ====== */}
                <TabsList className="grid w-full grid-cols-2 mb-6">
                  <TabsTrigger value="autenticaciones">Autenticaciones</TabsTrigger>
                  <TabsTrigger value="logs">Logs del Sistema</TabsTrigger>
                </TabsList>

                {/* ====== AUTENTICACIONES ====== */}
                <TabsContent value="autenticaciones">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <Input
                        placeholder="Buscar por nombre..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-64"
                      />
                      <Button onClick={handleRefresh} variant="outline" className="flex items-center gap-2">
                        <RefreshCcw className="w-4 h-4" />
                        Actualizar
                      </Button>
                    </div>
                  </div>

                  <div className="border rounded-lg overflow-hidden">
                    <Table>
                      <TableHeader className="bg-gray-50">
                        <TableRow>
                          <TableHead>ID</TableHead>
                          <TableHead>Usuario</TableHead>
                          <TableHead>Método</TableHead>
                          <TableHead>Resultado</TableHead>
                          <TableHead>Fecha / Hora</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredAuthAttempts.map((auth) => (
                          <TableRow key={auth.id}>
                            <TableCell>{auth.id}</TableCell>
                            <TableCell>{auth.user}</TableCell>
                            <TableCell>{auth.method}</TableCell>
                            <TableCell
                              className={`font-medium ${auth.result === "Éxito" ? "text-green-600" : "text-red-600"
                                }`}
                            >
                              {auth.result}
                            </TableCell>
                            <TableCell>{auth.timestamp}</TableCell>
                          </TableRow>
                        ))}
                        {filteredAuthAttempts.length === 0 && !loading && (
                          <TableRow>
                            <TableCell colSpan={5} className="text-center text-gray-500 py-4">
                              No se encontraron resultados.
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </div>
                </TabsContent>

                {/* ====== LOGS DEL SISTEMA ====== */}
                <TabsContent value="logs">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <Input
                        placeholder="Buscar acción..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-64"
                      />
                      <Button onClick={handleRefresh} variant="outline" className="flex items-center gap-2">
                        <RefreshCcw className="w-4 h-4" />
                        Actualizar
                      </Button>
                    </div>
                  </div>

                  <div className="border rounded-lg overflow-hidden">
                    <Table>
                      <TableHeader className="bg-gray-50">
                        <TableRow>
                          <TableHead>ID</TableHead>
                          <TableHead>Acción</TableHead>
                          <TableHead>Módulo</TableHead>
                          <TableHead>Realizado por</TableHead>
                          <TableHead>Fecha / Hora</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredAuditLogs.map((log) => (
                          <TableRow key={log.id}>
                            <TableCell>{log.id}</TableCell>
                            <TableCell>{log.action}</TableCell>
                            <TableCell>{log.module}</TableCell>
                            <TableCell>{log.performed_by}</TableCell>
                            <TableCell>{log.timestamp}</TableCell>
                          </TableRow>
                        ))}
                        {filteredAuditLogs.length === 0 && !loading && (
                          <TableRow>
                            <TableCell colSpan={5} className="text-center text-gray-500 py-4">
                              No hay registros en los logs.
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
