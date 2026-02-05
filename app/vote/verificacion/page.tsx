"use client";
import dynamic from "next/dynamic"
import { AuthGuard } from "@/components/auth-guard"
import { ModuleLayout } from "@/components/module-layout"
import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { ScanLine, Fingerprint, Camera, Search, CheckCircle2, XCircle } from "lucide-react";

type VoterResult = {
  id: string;
  first_name: string;
  last_name: string;
  id_number: string;
  match_score?: number;
  method?: string;
  outcome?: "SUCCESS" | "FAIL" | "MULTIPLE_MATCH";
};

export default function VerificacionPage() {
  const [searchId, setSearchId] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<VoterResult | null>(null);

  // Simulación de búsqueda
  const handleVerify = async (method: string) => {
    setLoading(true);
    setResult(null);

    setTimeout(() => {
      if (method === "CEDULA" && searchId === "1023456789") {
        setResult({
          id: "1",
          first_name: "Juan",
          last_name: "Pérez",
          id_number: "1023456789",
          method: "Cédula",
          outcome: "SUCCESS",
          match_score: 1.0,
        });
      } else if (method === "HUELLA") {
        setResult({
          id: "2",
          first_name: "Laura",
          last_name: "Gómez",
          id_number: "1098765432",
          method: "Huella",
          outcome: "SUCCESS",
          match_score: 0.98,
        });
      } else if (method === "FACIAL") {
        setResult({
          id: "3",
          first_name: "Pedro",
          last_name: "López",
          id_number: "1001122334",
          method: "Rostro",
          outcome: "FAIL",
          match_score: 0.55,
        });
      } else {
        setResult({
          id: "",
          first_name: "",
          last_name: "",
          id_number: searchId,
          method,
          outcome: "FAIL",
          match_score: 0.0,
        });
      }
      setLoading(false);
    }, 1200);
  };

  return (

    <AuthGuard>
      <ModuleLayout moduleType="vote">

        <motion.div
          className="p-6 space-y-6"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="max-w-4xl mx-auto shadow-md border rounded-2xl">
            <CardHeader>
              <CardTitle className="text-2xl font-semibold text-gray-800 flex items-center gap-2">
                <ScanLine className="w-6 h-6 text-blue-600" />
                Verificación de Identidad
              </CardTitle>
            </CardHeader>

            <CardContent>
              <Tabs defaultValue="cedula" className="w-full">
                {/* ====== Pestañas ====== */}
                <TabsList className="grid w-full grid-cols-3 mb-6">
                  <TabsTrigger value="cedula">Cédula</TabsTrigger>
                  <TabsTrigger value="huella">Huella Dactilar</TabsTrigger>
                  <TabsTrigger value="facial">Reconocimiento Facial</TabsTrigger>
                </TabsList>

                {/* ====== VERIFICACIÓN POR CÉDULA ====== */}
                <TabsContent value="cedula">
                  <div className="space-y-4">
                    <Label>Ingrese número de cédula o escanee</Label>
                    <div className="flex items-center gap-2">
                      <Input
                        placeholder="Ej: 1023456789"
                        value={searchId}
                        onChange={(e) => setSearchId(e.target.value)}
                        className="flex-1"
                      />
                      <Button
                        onClick={() => handleVerify("CEDULA")}
                        disabled={loading || !searchId}
                        className="flex items-center gap-2"
                      >
                        <Search className="w-4 h-4" />
                        {loading ? "Buscando..." : "Verificar"}
                      </Button>
                      <Button variant="outline" className="flex items-center gap-2">
                        <Camera className="w-4 h-4" />
                        Escanear Cédula
                      </Button>
                    </div>
                  </div>
                </TabsContent>

                {/* ====== VERIFICACIÓN POR HUELLA ====== */}
                <TabsContent value="huella">
                  <div className="flex flex-col items-center justify-center space-y-4 py-8">
                    <Fingerprint className="w-16 h-16 text-blue-600 animate-pulse" />
                    <p className="text-gray-600">Coloque el dedo en el lector para iniciar la verificación.</p>
                    <Button
                      onClick={() => handleVerify("HUELLA")}
                      disabled={loading}
                      className="flex items-center gap-2"
                    >
                      <Fingerprint className="w-4 h-4" />
                      {loading ? "Verificando..." : "Escanear Huella"}
                    </Button>
                  </div>
                </TabsContent>

                {/* ====== VERIFICACIÓN FACIAL ====== */}
                <TabsContent value="facial">
                  <div className="flex flex-col items-center justify-center space-y-4 py-8">
                    <Camera className="w-16 h-16 text-blue-600" />
                    <p className="text-gray-600">Active la cámara para reconocimiento facial.</p>
                    <Button
                      onClick={() => handleVerify("FACIAL")}
                      disabled={loading}
                      className="flex items-center gap-2"
                    >
                      <Camera className="w-4 h-4" />
                      {loading ? "Analizando rostro..." : "Iniciar Escaneo"}
                    </Button>
                  </div>
                </TabsContent>
              </Tabs>

              {/* ====== RESULTADO ====== */}
              {result && (
                <motion.div
                  className={`mt-8 p-4 border rounded-lg ${result.outcome === "SUCCESS"
                      ? "border-green-300 bg-green-50"
                      : "border-red-300 bg-red-50"
                    }`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <div className="flex items-center gap-3">
                    {result.outcome === "SUCCESS" ? (
                      <CheckCircle2 className="w-6 h-6 text-green-600" />
                    ) : (
                      <XCircle className="w-6 h-6 text-red-600" />
                    )}
                    <h3 className="font-semibold text-lg">
                      {result.outcome === "SUCCESS"
                        ? "Identidad Verificada"
                        : "No se encontró coincidencia"}
                    </h3>
                  </div>

                  <div className="mt-3 text-gray-700">
                    {result.outcome === "SUCCESS" ? (
                      <ul className="space-y-1">
                        <li>
                          <strong>Nombre:</strong> {result.first_name} {result.last_name}
                        </li>
                        <li>
                          <strong>Cédula:</strong> {result.id_number}
                        </li>
                        <li>
                          <strong>Método:</strong> {result.method}
                        </li>
                        <li>
                          <strong>Score:</strong> {result.match_score?.toFixed(2)}
                        </li>
                      </ul>
                    ) : (
                      <p className="text-sm text-gray-600">
                        No se encontraron registros para el método {result.method}.
                      </p>
                    )}
                  </div>
                </motion.div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </ModuleLayout>
    </AuthGuard>

  );
}
