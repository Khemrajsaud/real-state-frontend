import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import {
  adminLoginRequest,
  loginRequest,
  logoutRequest,
  signupRequest,
  type AdminLoginPayload,
  type AuthUser,
  type LoginPayload,
  type SignupPayload,
} from '../api/auth'
import { AUTH_TOKEN_STORAGE_KEY } from '../api/axiosInstance'
import { AuthContext } from './authContextValue'

const AUTH_USER_STORAGE_KEY = 'realStateAuthUser'
const AUTH_ROLE_STORAGE_KEY = 'realStateAuthRole'

const readStoredUser = () => {
  const storedUser = localStorage.getItem(AUTH_USER_STORAGE_KEY)

  if (!storedUser) {
    return null
  }

  try {
    return JSON.parse(storedUser) as AuthUser
  } catch {
    localStorage.removeItem(AUTH_USER_STORAGE_KEY)
    return null
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(() =>
    localStorage.getItem(AUTH_TOKEN_STORAGE_KEY),
  )
  const [user, setUser] = useState<AuthUser | null>(readStoredUser)
  const [isAdmin, setIsAdmin] = useState(
    () => localStorage.getItem(AUTH_ROLE_STORAGE_KEY) === 'admin',
  )
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (token) {
      localStorage.setItem(AUTH_TOKEN_STORAGE_KEY, token)
    } else {
      localStorage.removeItem(AUTH_TOKEN_STORAGE_KEY)
    }
  }, [token])

  useEffect(() => {
    if (user) {
      localStorage.setItem(AUTH_USER_STORAGE_KEY, JSON.stringify(user))
    } else {
      localStorage.removeItem(AUTH_USER_STORAGE_KEY)
    }
  }, [user])

  useEffect(() => {
    if (isAdmin) {
      localStorage.setItem(AUTH_ROLE_STORAGE_KEY, 'admin')
    } else {
      localStorage.removeItem(AUTH_ROLE_STORAGE_KEY)
    }
  }, [isAdmin])

  const applyAuthSession = useCallback(
    (nextToken: string, nextUser: AuthUser, nextIsAdmin = false) => {
      setToken(nextToken)
      setUser(nextUser)
      setIsAdmin(nextIsAdmin)
      return nextUser
    },
    [],
  )

  const login = useCallback(
    async (payload: LoginPayload) => {
      setIsLoading(true)

      try {
        const response = await loginRequest(payload)
        return applyAuthSession(response.token, response.user)
      } finally {
        setIsLoading(false)
      }
    },
    [applyAuthSession],
  )

  const adminLogin = useCallback(
    async (payload: AdminLoginPayload) => {
      setIsLoading(true)

      try {
        const response = await adminLoginRequest(payload)
        return applyAuthSession(response.token, response.user, true)
      } finally {
        setIsLoading(false)
      }
    },
    [applyAuthSession],
  )

  const signup = useCallback(
    async (payload: SignupPayload) => {
      setIsLoading(true)

      try {
        const response = await signupRequest(payload)
        return response.user
      } finally {
        setIsLoading(false)
      }
    },
    [],
  )

  const logout = useCallback(async () => {
    setIsLoading(true)

    try {
      if (token) {
        await logoutRequest()
      }
    } finally {
      setToken(null)
      setUser(null)
      setIsAdmin(false)
      setIsLoading(false)
    }
  }, [token])

  const value = useMemo(
    () => ({
      token,
      user,
      isAuthenticated: Boolean(token && user),
      isAdmin,
      isLoading,
      login,
      adminLogin,
      signup,
      logout,
    }),
    [adminLogin, isAdmin, isLoading, login, logout, signup, token, user],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
