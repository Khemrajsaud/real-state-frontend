import { createContext } from 'react'
import type {
  AdminLoginPayload,
  AuthUser,
  LoginPayload,
  SignupPayload,
} from '../api/auth'

export type AuthContextValue = {
  token: string | null
  user: AuthUser | null
  isAuthenticated: boolean
  isAdmin: boolean
  isLoading: boolean
  login: (payload: LoginPayload) => Promise<AuthUser>
  adminLogin: (payload: AdminLoginPayload) => Promise<AuthUser>
  signup: (payload: SignupPayload) => Promise<AuthUser>
  logout: () => Promise<void>
}

export const AuthContext = createContext<AuthContextValue | null>(null)
