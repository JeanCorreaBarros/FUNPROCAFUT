"use client"

import Image from "next/image"

interface BivooLoaderProps {
  message?: string
}

export function BivooLoader({ message = "Cargando..." }: BivooLoaderProps) {
  return (
    <div className="fixed inset-0 bg-white z-50 flex items-center justify-center">
      <div className="text-center">
        <div className="mb-8 animate-pulse">
          <Image src={process.env.NEXT_PUBLIC_LOGO_PATH ?? '/logo-FUNPROCAFUT.png'} alt="FUNPROCAFUT Logo" width={200} height={60} className="h-16 w-auto mx-auto" />
        </div>
        <div className="flex items-center justify-center space-x-2">
          <div className="w-2 h-2 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full animate-bounce"></div>
          <div
            className="w-2 h-2 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full animate-bounce"
            style={{ animationDelay: "0.1s" }}
          ></div>
          <div
            className="w-2 h-2 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full animate-bounce"
            style={{ animationDelay: "0.2s" }}
          ></div>
        </div>
        <p className="text-gray-600 mt-4 text-sm">{message}</p>
      </div>
    </div>
  )
}
