"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Mail, CheckCircle } from "lucide-react"
import Image from "next/image"

interface ForgotPasswordModalProps {
  isOpen: boolean
  onClose: () => void
}

export function ForgotPasswordModal({ isOpen, onClose }: ForgotPasswordModalProps) {
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Simular envío de email
    setTimeout(() => {
      setIsLoading(false)
      setIsSuccess(true)
    }, 2000)
  }

  const handleClose = () => {
    setEmail("")
    setIsSuccess(false)
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex justify-center mb-4">
            <Image src="/logo-bivoo.png" alt="Bivoo Logo" width={120} height={40} className="h-8 w-auto" />
          </div>
          <DialogTitle className="text-center">{isSuccess ? "Email enviado" : "Restablecer contraseña"}</DialogTitle>
        </DialogHeader>

        {!isSuccess ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="text-center mb-4">
              <Mail className="w-12 h-12 text-gray-400 mx-auto mb-2" />
              <p className="text-sm text-gray-600">
                Ingresa tu email y te enviaremos un enlace para restablecer tu contraseña.
              </p>
            </div>

            <Input
              type="email"
              placeholder="Ingresa tu email..."
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="h-12 border-gray-200 focus:border-purple-500 focus:ring-purple-500"
              required
            />

            <div className="flex space-x-3">
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                className="flex-1 h-12 bg-transparent"
                disabled={isLoading}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                className="flex-1 h-12 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white"
                disabled={isLoading || !email}
              >
                {isLoading ? "Enviando..." : "Enviar enlace"}
              </Button>
            </div>
          </form>
        ) : (
          <div className="text-center py-4">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <p className="text-gray-600 mb-4">
              Hemos enviado un enlace de restablecimiento a <strong>{email}</strong>
            </p>
            <p className="text-sm text-gray-500 mb-6">
              Revisa tu bandeja de entrada y sigue las instrucciones para restablecer tu contraseña.
            </p>
            <Button
              onClick={handleClose}
              className="w-full h-12 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white"
            >
              Entendido
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
