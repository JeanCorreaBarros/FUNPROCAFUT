"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAppDispatch, useAppSelector } from "@/lib/store"
import {
  loginStart,
  loginSuccess,
  loginFailure,
  logout as logoutAction,
  initializeAuth,
} from "@/lib/features/auth/authSlice"
import type { User } from "@/lib/features/auth/authSlice"

const demoUsers: Record<string, Omit<User, "permissions">> = {
  "admin@bivoo.com": {
    name: "Zenisuk Katori",
    email: "admin@bivoo.com",
    company: "ASIKALADOS BARBERSHOP",
    role: "admin",
    avatar: "ZK",
  },
  "colaborador@bivoo.com": {
    name: "María González",
    email: "colaborador@bivoo.com",
    company: "ASIKALADOS BARBERSHOP",
    role: "colaborador",
    avatar: "MG",
  },
  "recepcionista@bivoo.com": {
    name: "Ana López",
    email: "recepcionista@bivoo.com",
    company: "ASIKALADOS BARBERSHOP",
    role: "recepcionista",
    avatar: "AL",
  },
  "auditor@bivoo.com": {
    name: "Carlos Ruiz",
    email: "auditor@bivoo.com",
    company: "ASIKALADOS BARBERSHOP",
    role: "auditor",
    avatar: "CR",
  },
}

export function useAuth() {
  const dispatch = useAppDispatch()
  const { user, isAuthenticated, isLoading } = useAppSelector((state) => state.auth)
  const router = useRouter()

  useEffect(() => {
    const checkAuth = () => {
      try {
        const auth = localStorage.getItem("bivoo-auth")
        const userData = localStorage.getItem("bivoo-user")

        if (auth === "true" && userData) {
          const parsedUser = JSON.parse(userData) as User
          dispatch(initializeAuth({ user: parsedUser, isAuthenticated: true }))
        } else {
          dispatch(initializeAuth({ user: null, isAuthenticated: false }))
        }
      } catch (error) {
        console.error("Error checking auth:", error)
        dispatch(initializeAuth({ user: null, isAuthenticated: false }))
      }
    }

    checkAuth()
  }, [dispatch])


  // Puedes cambiar esta URL por tu variable de entorno si lo prefieres
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000/api"

  // Nuevo login real, pero mantiene demo para desarrollo
  const login = async (email: string, password: string, subdomain?: string) => {
    dispatch(loginStart())
    try {
      // Si es demo, permite acceso rápido
      if (demoUsers[email] && password === "demo123") {
        dispatch(loginSuccess({ user: demoUsers[email] }))
        return true
      }
      // Real API
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, subdomain }),
      })
      if (!response.ok) {
        dispatch(loginFailure())
        return false
      }
      const data = await response.json()
      if (data.token && data.user) {
        console.log("Login successful, user data:", data.user)
        localStorage.setItem("bivoo-auth", "true")
        sessionStorage.setItem("TKV", data.token);
        // Adaptar el usuario al formato esperado por la app
        const userAdapted = {
          ...data.user,
          name: `${data.user.firstName || ""} ${data.user.lastName || ""}`.trim(),
          role: (data.user.role || "admin").toLowerCase(),
          avatar: (data.user.firstName?.[0] || "").toUpperCase() + (data.user.lastName?.[0] || "").toUpperCase(),
          company: data.tenant?.name || "",
          // Puedes agregar más campos si tu app los requiere
        };
        localStorage.setItem("bivoo-user", JSON.stringify(userAdapted))
        dispatch(loginSuccess({ user: userAdapted }))
        return true
      } else {
        dispatch(loginFailure())
        return false
      }
    } catch (error) {
      dispatch(loginFailure())
      return false
    }
  }

  // Register
  type RegisterData = {
    fullName: string;
    firstName: string;
    middleName: string;
    lastName: string;
    secondLastName: string;
    email: string;
    password: string;
    companyName: string;
    subdomain: string;
    businessType: string;
    businessSubtype: string;
  }

  const register = async (data: RegisterData): Promise<boolean> => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
          password: data.password,
          tenantName: data.companyName,
          subdomain: data.subdomain,
        }),
      })
      if (!response.ok) return false
      return true
    } catch (error) {
      return false
    }
  }

  const logout = () => {
    dispatch(logoutAction())
    router.push("/login")
  }

  return {
    user,
    isLoading,
    isAuthenticated,
    login,
    logout,
    register,
  }
}
