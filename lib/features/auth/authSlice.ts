import { createSlice, type PayloadAction } from "@reduxjs/toolkit"

export type UserRole = "admin" | "colaborador" | "recepcionista" | "auditor"

export interface User {
  name: string
  email: string
  company: string
  role: UserRole
  permissions: string[]
  avatar?: string
}

interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: true,
}

const rolePermissions: Record<UserRole, string[]> = {
  admin: [
    "agenda.view",
    "agenda.create",
    "agenda.edit",
    "agenda.delete",
    "configuracion.view",
    "configuracion.edit",
    "facturacion.view",
    "facturacion.create",
    "facturacion.edit",
    "inventarios.view",
    "inventarios.create",
    "inventarios.edit",
    "inventarios.delete",
    "reportes.view",
    "reportes.export",
    "contabilidad.view",
    "contabilidad.edit",
    "nomina.view",
    "nomina.edit",
    "marketing.view",
    "marketing.create",
    "marketing.edit",
    "seguridad.view",
    "seguridad.edit",
    "vote.view",
    "vote.create",
    "vote.edit",
    "vote.delete",
  ],
  colaborador: [
    "agenda.view",
    "agenda.create",
    "agenda.edit",
    "facturacion.view",
    "facturacion.create",
    "inventarios.view",
    "inventarios.edit",
    "reportes.view",
    "contabilidad.view",
    "marketing.view",
  ],
  recepcionista: [
    "agenda.view",
    "agenda.create",
    "agenda.edit",
    "facturacion.view",
    "inventarios.view",
    "reportes.view",
  ],
  auditor: [
    "agenda.view",
    "facturacion.view",
    "inventarios.view",
    "reportes.view",
    "reportes.export",
    "contabilidad.view",
    "nomina.view",
  ],
}

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginStart: (state) => {
      state.isLoading = true
    },
    loginSuccess: (state, action: PayloadAction<{ user: Omit<User, "permissions"> }>) => {
      const { user } = action.payload
      const userWithPermissions: User = {
        ...user,
        permissions: rolePermissions[user.role] || [],
      }

      state.user = userWithPermissions
      state.isAuthenticated = true
      state.isLoading = false

      localStorage.setItem("bivoo-auth", "true")
      localStorage.setItem("bivoo-user", JSON.stringify(userWithPermissions))
    },
    loginFailure: (state) => {
      state.user = null
      state.isAuthenticated = false
      state.isLoading = false
    },
    logout: (state) => {
      state.user = null
      state.isAuthenticated = false
      state.isLoading = false

      localStorage.removeItem("bivoo-auth")
      localStorage.removeItem("bivoo-user")
    },
    initializeAuth: (state, action: PayloadAction<{ user: User | null; isAuthenticated: boolean }>) => {
      state.user = action.payload.user
      state.isAuthenticated = action.payload.isAuthenticated
      state.isLoading = false
    },
    updateUserProfile: (state, action: PayloadAction<Partial<User>>) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload }
        localStorage.setItem("bivoo-user", JSON.stringify(state.user))
      }
    },
  },
})

export const { loginStart, loginSuccess, loginFailure, logout, initializeAuth, updateUserProfile } = authSlice.actions

export default authSlice.reducer
