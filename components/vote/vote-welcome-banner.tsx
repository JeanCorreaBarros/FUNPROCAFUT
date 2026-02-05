"use client";

import React from "react";

export default function VoteWelcomeBanner({ totalVotes = 0, recentVoters = [], topOption = "" }) {
  return (
  
<div className="relative overflow-hidden rounded-2xl bg-gradient-bivoo p-6 md:p-8 text-white">
      <div className="relative z-10">
        <h1 className="text-2xl md:text-3xl font-bold mb-2 text-balance">¡Bienvenido al módulo de Votaciones!</h1>
        <p className="text-white/90 mb-6 max-w-2xl text-pretty">
         Aquí puedes gestionar votaciones, ver resultados y analizar la participación.
        </p>

       <div className="flex gap-8">
          <div className="flex flex-col items-center">
            <span className="text-3xl font-extrabold text-white">{totalVotes}</span>
            <span className="text-sm text-white text-opacity-80">Votos totales</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-3xl font-extrabold text-white">{recentVoters.length}</span>
            <span className="text-sm text-white text-opacity-80">Votantes recientes</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-3xl font-extrabold text-white">{topOption || "-"}</span>
            <span className="text-sm text-white text-opacity-80">Opción más votada</span>
          </div>
        </div>
      </div>

      <div className="absolute top-0 right-0 w-32 h-32 md:w-48 md:h-48 opacity-20 animate-pulse">
        <div className="w-full h-full bg-white rounded-full flex items-center justify-center">
          <span className="text-4xl md:text-6xl font-bold text-bivoo-purple">B</span>
        </div>
      </div>
    </div>
  );
}


