"use client"

import type React from "react"
import { useState } from "react"
import { useEffect } from "react";
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Eye, EyeOff } from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/hooks/use-auth"
import Image from "next/image"
import { BivooLoader } from "@/components/bivoo-loader"
import { ForgotPasswordModal } from "@/components/forgot-password-modal"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
  const [error, setError] = useState("")
  const [showLoader, setShowLoader] = useState(false)
  const [showForgotModal, setShowForgotModal] = useState(false)
  const [carouselIndex, setCarouselIndex] = useState(0)
  const { login, isLoading } = useAuth()
  const router = useRouter()
  const [subdomain, setSubdomain] = useState('');

  const carouselMessages = [
    {
      title: "Gestión Académica Completa",
      description: "Administra calificaciones, asistencia y reportes de estudiantes en una plataforma integrada."
    },
    {
      title: "Comunicación Efectiva",
      description: "Conecta a estudiantes, padres y educadores con herramientas de mensajería instantánea."
    },
    {
      title: "Recursos Educativos",
      description: "Accede a bibliotecas digitales, materiales de curso y contenido interactivo."
    },
    {
      title: "Seguimiento del Progreso",
      description: "Monitorea el desarrollo estudiantil con análisis detallados y reportes personalizados."
    }
  ];


  useEffect(() => {
    // Solo en cliente
    const host = window.location.hostname;
    // Ejemplo: strapdigitalhub.localhost
    const parts = host.split('.');
    if (parts.length > 2) {
      setSubdomain(parts[0]);
    } else if (parts.length === 2 && parts[1] === 'localhost') {
      setSubdomain(parts[0]);
    }
  }, []);

  // Auto-rotate carousel every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCarouselIndex((prev) => (prev + 1) % carouselMessages.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [carouselMessages.length])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setShowLoader(true)

    try {
      const success = await login(email, password, subdomain);

      if (success) {
        const userData = localStorage.getItem("bivoo-user")
        if (userData) {
          const user = JSON.parse(userData)
          // Si tenemos datos de usuario, redirigir según el rol
          if (user.role === "colaborador") {
            router.push("/mobile")
          } else {
            router.push("/dashboard")
          }
        } else {
          // Si no hay datos de usuario pero el login fue exitoso, ir al dashboard
          router.push("/dashboard")
        }
      } else {
        setError("Credenciales inválidas. Usa uno de los usuarios demo.")
      }
    } catch (error) {
      console.error("Error durante el login:", error)
      setError("Ocurrió un error durante el inicio de sesión. Por favor, intenta nuevamente.")
    } finally {
      setShowLoader(false)
    }
  }

  if (showLoader) {
    return <BivooLoader message="Iniciando sesión..." />
  }

  return (
    <div className="min-h-screen lg:bg-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl flex rounded-3xl overflow-hidden lg:shadow-2xl bg-white">

        {/* Left Panel */}
        <div className="hidden lg:flex w-1/2 bg-gradient-to-br from-indigo-500 to-purple-600 flex-col justify-center items-start p-16 text-white">
          <div className="max-w-md">
            <div className="mb-10">
              <h2 className="text-4xl font-bold leading-tight">
                FUNPROCAFUT.
              </h2>
              <p className="text-sm text-indigo-100">
                Student platform powered by Bi-voo
              </p>
            </div>

            <div className="mb-12">
              <Image
                src="/education-icons.png"
                alt="Education and learning icons"
                width={350}
                height={280}
                className="w-full h-auto drop-shadow-lg"
                priority
              />
            </div>

            {/* Carousel */}
            <div className="mt-12 hidden bg-white bg-opacity-10 rounded-xl p-6 backdrop-blur-sm border border-white border-opacity-20">
              <div className="min-h-24 flex flex-col justify-between">
                <div className="transition-all duration-500">
                  <h3 className="text-xl font-bold text-white mb-2">
                    {carouselMessages[carouselIndex].title}
                  </h3>
                  <p className="text-indigo-100 text-sm leading-relaxed">
                    {carouselMessages[carouselIndex].description}
                  </p>
                </div>
              </div>

              {/* Carousel Controls */}
              <div className="flex gap-2 mt-6 justify-center">
                {carouselMessages.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCarouselIndex(index)}
                    className={`w-3 h-3 rounded-full transition-all ${index === carouselIndex
                      ? "bg-white w-8"
                      : "bg-indigo-300 hover:bg-indigo-200"
                      }`}
                    aria-label={`Go to slide ${index + 1}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Panel */}
        <div className="w-full lg:w-1/2 bg-white p-8 lg:p-14 flex flex-col justify-center">
          <div className="max-w-md mx-auto w-full">

            {/* Mobile Logo */}
            <div className="flex justify-center mb-6 ">
              <Image
                src={process.env.NEXT_PUBLIC_LOGO_PATH ?? '/logo-FUNPROCAFUT.png'}
                alt="FUNPROCAFUT Logo"
                width={200}
                height={50}
                className="w-auto h-12"
              />
            </div>



            <h1 className="text-3xl font-bold text-blue-400 mb-2">
              Bienvenido
            </h1>
            <p className="text-gray-500 mb-8">
              Inicia sesión en tu cuenta
            </p>


            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-800">{error}</p>
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">
                 Correo Electrónico
                </label>
                <Input
                  type="email"
                  placeholder="your.email@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-12 rounded-lg border-gray-300"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">
                  Contraseña
                </label>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="h-12 rounded-lg border-gray-300 pr-10"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="remember"
                    checked={rememberMe}
                    onCheckedChange={(checked) => setRememberMe(checked === true)}
                  />
                  <label htmlFor="remember" className="text-gray-600">
                    Remember me
                  </label>
                </div>
                <button
                  type="button"
                  onClick={() => setShowForgotModal(true)}
                  className="text-indigo-600 hover:text-indigo-800 font-medium"
                >
                  Forgot password?
                </button>
              </div>

              <Button
                type="submit"
                className="w-full h-12 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold"
                disabled={isLoading}
              >
                {isLoading ? "Signing in..." : "Sign In"}
              </Button>
            </form>

            {/* Divider */}
            <div className="mt-10 text-center">
              <span className="text-xs text-gray-400">
                Student platform powered by Bi-voo
              </span>
            </div>

          </div>
        </div>
      </div>

      <ForgotPasswordModal
        isOpen={showForgotModal}
        onClose={() => setShowForgotModal(false)}
      />
    </div>

  )
}
