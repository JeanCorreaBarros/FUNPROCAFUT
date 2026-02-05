"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { useRouter } from "next/navigation"
import Cookies from "js-cookie"

type RegisterData = {
  fullName: string;
  firstName: string;
  middleName: string;
  lastName: string;
  secondLastName: string;
  email: string;
  password: string;
  companyName: string;
  subdomain: string; // Nuevo campo para el subdominio
  businessType: string;
  businessSubtype: string;
};

type AuthContextType = {
  user: any | null // Replace 'any' with a more specific type if possible
  login: (email: string, password: string, subdomain: string) => Promise<boolean>
  logout: () => void
  isLoading: boolean
  register: (data: RegisterData) => Promise<boolean>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  // Verificar si hay una sesión activa al cargar
  useEffect(() => {
    const userCookie = Cookies.get("auth")
    if (userCookie) {
      try {
        const userData = JSON.parse(userCookie)
        setUser(userData)
      } catch (e) {
        console.error("Error parsing user cookie", e)
      }
    }
  }, [])

  // Usa la variable de entorno para el endpoint
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL

  const login = async (email: string, password: string, subdomain: string): Promise<boolean> => {
    setIsLoading(true)

    console.log("Attempting to login with email:", email)
    console.log("Attempting to login with subdomain:", subdomain)

    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password, subdomain }),
      });

      setIsLoading(false);
      console.log("Login response status:", response.status);
      console.log("Login response status:", response.ok);


      if (!response.ok) {
        return false;
      }

      const data = await response.json();
      console.log("Login response data:", data);
      // Suponiendo que el token viene en data.token
      if (data.token) {
        sessionStorage.setItem("TKV", data.token);

        // Concatenar nombre completo y guardar en localStorage
        const fullName = `${data.user.firstName} ${data.user.lastName}`.trim();
        localStorage.setItem("fullName", fullName);

        // Suponiendo que el backend también devuelve los datos del usuario
        const userData = { email: data.user.email };
        setUser(userData);
        Cookies.set("auth", JSON.stringify(userData), { expires: 7 });

        router.push("/");
        return true;
      }

      return false;
    } catch (error) {
      console.error("Error during login:", error);
      setIsLoading(false);
      return false;
    }
  };

  const register = async (data: RegisterData): Promise<boolean> => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
          password: data.password,
          tenantName: data.companyName,
          subdomain: data.subdomain,
        }),
      });
      setIsLoading(false);
      if (!response.ok) {
        return false;
      }
      // Si el backend devuelve datos útiles, puedes procesarlos aquí
      return true;
    } catch (error) {
      console.error("Error during register:", error);
      setIsLoading(false);
      return false;
    }
  };

  const logout = () => {
    setUser(null)
    // Eliminar la cookie de autenticación
    Cookies.remove("auth")
    router.push("/login")
  }

  const value: AuthContextType = {
    user,
    login,
    logout,
    isLoading,
    register,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

