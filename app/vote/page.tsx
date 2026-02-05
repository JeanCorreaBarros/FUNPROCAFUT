"use client";

import React, { useState } from "react";
import VoteWelcomeBanner from "@/components/vote/vote-welcome-banner";
import VoteStats from "@/components/vote/vote-stats";
import dynamic from "next/dynamic"
import { BivooLoader } from "@/components/bivoo-loader"
import { AuthGuard } from "@/components/auth-guard"
import { ModuleLayout } from "@/components/module-layout"

const ReportesCharts = dynamic(() => import("@/components/vote/reportes-charts").then(m => m.ReportesCharts), { ssr: false, loading: () => <BivooLoader /> })


export default function VotePage() {
  // Estado para votos y opciones
  const [options, setOptions] = useState<string[]>(["Opción 1", "Opción 2"]);
  const [votes, setVotes] = useState<{ [key: string]: number }>({ "Opción 1": 0, "Opción 2": 0 });
  const [newOption, setNewOption] = useState("");
  const [selected, setSelected] = useState<string>("");
  const [message, setMessage] = useState("");

  // Registrar voto


  return (
    <AuthGuard>
      <ModuleLayout moduleType="vote">


        <div className="space-y-6">
          <VoteWelcomeBanner
            totalVotes={Object.values(votes).reduce((a, b) => a + b, 0)}
            recentVoters={[]} // Puedes pasar aquí los nombres de los últimos votantes si tienes ese dato
            topOption={options.length > 0 ? options.reduce((a, b) => votes[a] > votes[b] ? a : b) : ""}
          />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <ReportesCharts />
            </div>
            <div className="lg:col-span-1">
              <VoteStats options={options} votes={votes} />
            </div>
          </div>
        </div>
      </ModuleLayout>
    </AuthGuard>
  );
}
