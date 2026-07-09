import axiosInstance from './axiosInstance'
import {
  mockAdminLogin,
  mockGetInquiries,
  mockGetUsers,
  mockLogin,
  mockLogout,
  mockSignup,
  mockSubmitInquiry,
  USE_MOCK_API,
} from '../mocks/mockApi'

export type AuthUser = {
  id?: string | number
  _id?: string
  name?: string
  email?: string
  phone?: string
  role?: string
  [key: string]: unknown
}

export type LoginPayload = {
  email: string
  password: string
}

export type AdminLoginPayload = {
  username: string
  password: string
}

export type SignupPayload = {
  name: string
  email: string
  password: string
  phone: string
}

export type InquiryPayload = {
  name: string
  email: string
  phone: string
  message: string
}

export type ForgotPasswordPayload = {
  email: string
}

export type ResetPasswordPayload = {
  email: string
  code: string       // backend reads `code`, not `otp`
  newPassword: string
  confirmPassword: string
}

export type AuthResponse = {
  message?: string
  token: string
  user: AuthUser
}

type ApiResponse = {
  success?: boolean
  message?: string
  error?: string
  token?: string
  user?: AuthUser
  data?: Partial<AuthResponse>
  auth?: Partial<AuthResponse>
  users?: unknown
  enquiries?: unknown
  inquiries?: unknown
}

const getFailureMessage = (response: ApiResponse) =>
  response.error ?? response.message ?? 'Request failed. Please try again.'

const normalizeAuthResponse = (response: ApiResponse): AuthResponse => {
  if (response.success === false) {
    throw new Error(getFailureMessage(response))
  }

  const payload = response.data ?? response.auth ?? response
  const token = payload.token
  const user = payload.user

  if (!token || !user) {
    throw new Error(response.message ?? 'Auth response was missing token or user.')
  }

  return {
    message: response.message ?? payload.message,
    token,
    user,
  }
}

export const loginRequest = async (payload: LoginPayload) => {
  if (USE_MOCK_API) {
    return mockLogin(payload)
  }

  const response = await axiosInstance.post<ApiResponse>('/auth/login', payload)

  return normalizeAuthResponse(response.data)
}

export const adminLoginRequest = async (payload: AdminLoginPayload) => {
  if (USE_MOCK_API) {
    return mockAdminLogin(payload)
  }

  const response = await axiosInstance.post<ApiResponse>('/auth/admin/login', payload)

  return normalizeAuthResponse(response.data)
}

export const signupRequest = async (payload: SignupPayload) => {
  if (USE_MOCK_API) {
    return mockSignup(payload)
  }

  const response = await axiosInstance.post<ApiResponse>('/auth/signup', payload)

  return normalizeAuthResponse(response.data)
}

export const logoutRequest = async () => {
  if (USE_MOCK_API) {
    return mockLogout()
  }

  const response = await axiosInstance.post<ApiResponse>('/auth/logout')

  if (response.data.success === false) {
    throw new Error(getFailureMessage(response.data))
  }

  return response.data
}

export const submitInquiryRequest = async (payload: InquiryPayload) => {
  if (USE_MOCK_API) {
    return mockSubmitInquiry(payload)
  }

  const response = await axiosInstance.post<ApiResponse>('/auth/inquiry/submit', payload)

  if (response.data.success === false) {
    throw new Error(getFailureMessage(response.data))
  }

  return response.data
}

const normalizeList = (response: ApiResponse, keys: Array<keyof ApiResponse>) => {
  if (response.success === false) {
    throw new Error(getFailureMessage(response))
  }

  const payload = keys.reduce<unknown>(
    (currentPayload, key) => currentPayload ?? response[key],
    response.data,
  )

  return Array.isArray(payload) ? payload : []
}

export const getAdminInquiries = async () => {
  if (USE_MOCK_API) {
    return mockGetInquiries()
  }

  const response = await axiosInstance.get<ApiResponse>('/auth/admin/enquiries')

  return normalizeList(response.data, ['enquiries', 'inquiries'])
}

export const getAdminUsers = async () => {
  if (USE_MOCK_API) {
    return mockGetUsers()
  }

  const response = await axiosInstance.get<ApiResponse>('/auth/users')

  return normalizeList(response.data, ['users'])
}

export const forgotPasswordRequest = async (payload: ForgotPasswordPayload) => {
  // Always hits the real API – OTP flow doesn't make sense in mock mode
  const response = await axiosInstance.post<ApiResponse>('/auth/auth/otp', payload)

  if (response.data.success === false) {
    throw new Error(getFailureMessage(response.data))
  }

  return response.data
}

export const resetPasswordRequest = async (payload: ResetPasswordPayload) => {
  const response = await axiosInstance.post<ApiResponse>('/auth/auth/reset-password', payload)

  if (response.data.success === false) {
    throw new Error(getFailureMessage(response.data))
  }

  return response.data
}
