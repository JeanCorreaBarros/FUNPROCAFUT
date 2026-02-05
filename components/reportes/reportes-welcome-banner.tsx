"use client"

export function ReportesWelcomeBanner() {
  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-bivoo p-6 md:p-8 text-white">
      <div className="relative z-10">
        <h1 className="text-2xl md:text-3xl font-bold mb-2 text-balance">Reportes y Análisis</h1>
        <p className="text-white/90 mb-6 max-w-2xl text-pretty">
          Analiza el rendimiento de tu negocio con reportes detallados y métricas clave.
        </p>

        <div className="flex flex-wrap gap-6 text-sm">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span>Datos actualizados</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-white rounded-full"></div>
            <span>Reportes generados: 12</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-white rounded-full"></div>
            <span>Última actualización: hace 1 hora</span>
          </div>
        </div>
      </div>

      <div className="absolute top-0 right-0 w-32 h-32 md:w-48 md:h-48 opacity-20 animate-pulse">
        <div className="w-full h-full bg-white rounded-full flex items-center justify-center">
          <span className="text-4xl md:text-6xl font-bold text-bivoo-purple">B</span>
        </div>
      </div>
    </div>
  )
}
