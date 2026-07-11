import axios from 'axios'
import axiosInstance from './axiosInstance'
import { mockGetInquiries, mockGetUsers, mockSubmitInquiry, USE_MOCK_API } from '../mocks/mockApi'

export type AuthUser = {
  id?: string | number
  _id?: string
  name?: string
  email?: string
  phone?: string
  role?: string
  avatar?: string
  [key: string]: unknown
}

export type LoginPayload = { email: string; password: string }
export type AdminLoginPayload = { username: string; password: string }
export type SignupPayload = { name: string; email: string; password: string; phone: string }
export type InquiryPayload = { name: string; email: string; phone: string; message: string }
export type ForgotPasswordPayload = { email: string }
export type ResetPasswordPayload = { email: string; code: string; newPassword: string; confirmPassword: string }
export type AuthResponse = { message?: string; token: string; user: AuthUser }

type ApiResponse = {
  success?: boolean
  message?: string
  error?: string
  token?: string
  user?: AuthUser
  admin?: AuthUser
  data?: Partial<AuthResponse>
  auth?: Partial<AuthResponse>
  users?: unknown
  enquiries?: unknown
  inquiries?: unknown
}

// ── Extract human-readable Nepali error from any axios error ──
const extractError = (err: unknown): string => {
  if (axios.isAxiosError(err)) {
    const data = err.response?.data as ApiResponse | undefined
    const status = err.response?.status

    // Use backend message first
    const backendMsg = data?.message ?? data?.error
    if (backendMsg) {
      if (backendMsg.includes('already exists') || backendMsg.includes('already registered')) {
        return 'यो इमेल पहिले नै दर्ता भएको छ। लगइन गर्नुहोस्।'
      }
      if (backendMsg.includes('Invalid') || backendMsg.includes('incorrect')) {
        return 'इमेल वा पासवर्ड गलत छ।'
      }
      if (backendMsg.includes('required')) {
        return 'सबै फिल्डहरू भर्नुहोस्।'
      }
      return backendMsg
    }

    if (status === 429) return 'धेरै प्रयास भयो। १५ मिनेटपछि फेरि प्रयास गर्नुहोस्।'
    if (status === 400) return 'अनुरोध अमान्य छ। फारम जाँच गर्नुहोस्।'
    if (status === 401) return 'इमेल वा पासवर्ड गलत छ।'
    if (status === 409) return 'यो इमेल पहिले नै दर्ता भएको छ।'
    if (status === 500) return 'सर्भर त्रुटि। पछि फेरि प्रयास गर्नुहोस्।'
  }
  if (err instanceof Error) return err.message
  return 'केही गलत भयो। पुनः प्रयास गर्नुहोस्।'
}

const getFailureMessage = (response: ApiResponse) =>
  response.error ?? response.message ?? 'केही गलत भयो।'

const normalizeAuthResponse = (response: ApiResponse): AuthResponse => {
  if (response.success === false) throw new Error(getFailureMessage(response))

  const payload = response.data ?? response.auth ?? response
  const token = payload.token
  const user = payload.user

  if (!token || !user) throw new Error(response.message ?? 'Auth response missing token or user.')

  return { message: response.message ?? payload.message, token, user }
}

export const loginRequest = async (payload: LoginPayload) => {
  try {
    const response = await axiosInstance.post<ApiResponse>('/auth/login', payload)
    return normalizeAuthResponse(response.data)
  } catch (err) {
    throw new Error(extractError(err))
  }
}

export const adminLoginRequest = async (payload: AdminLoginPayload) => {
  try {
    const response = await axiosInstance.post<ApiResponse>('/auth/admin/login', payload)
    if (response.data.success === false) throw new Error(getFailureMessage(response.data))
    const token = response.data.token
    const admin = response.data.admin ?? response.data.user
    if (!token || !admin) throw new Error('Admin auth response missing token or admin data.')
    return { message: response.data.message, token, user: { ...admin, role: 'admin' } }
  } catch (err) {
    throw new Error(extractError(err))
  }
}

export const signupRequest = async (payload: SignupPayload) => {
  try {
    const response = await axiosInstance.post<ApiResponse>('/auth/signup', payload)
    return normalizeAuthResponse(response.data)
  } catch (err) {
    throw new Error(extractError(err))
  }
}

export const logoutRequest = async () => {
  try {
    const response = await axiosInstance.post<ApiResponse>('/auth/logout')
    if (response.data.success === false) throw new Error(getFailureMessage(response.data))
    return response.data
  } catch (err) {
    throw new Error(extractError(err))
  }
}

export const submitInquiryRequest = async (payload: InquiryPayload) => {
  if (USE_MOCK_API) return mockSubmitInquiry(payload)
  try {
    const response = await axiosInstance.post<ApiResponse>('/auth/inquiry/submit', payload)
    if (response.data.success === false) throw new Error(getFailureMessage(response.data))
    return response.data
  } catch (err) {
    throw new Error(extractError(err))
  }
}

const normalizeList = (response: ApiResponse, keys: Array<keyof ApiResponse>) => {
  if (response.success === false) throw new Error(getFailureMessage(response))
  const payload = keys.reduce<unknown>((acc, key) => acc ?? response[key], response.data)
  return Array.isArray(payload) ? payload : []
}

export const getAdminInquiries = async () => {
  if (USE_MOCK_API) return mockGetInquiries()
  const response = await axiosInstance.get<ApiResponse>('/auth/admin/enquiries')
  return normalizeList(response.data, ['enquiries', 'inquiries'])
}

export const getAdminUsers = async () => {
  if (USE_MOCK_API) return mockGetUsers()
  const response = await axiosInstance.get<ApiResponse>('/auth/users')
  return normalizeList(response.data, ['users'])
}

export const forgotPasswordRequest = async (payload: ForgotPasswordPayload) => {
  try {
    const response = await axiosInstance.post<ApiResponse>('/auth/otp', payload)
    if (response.data.success === false) throw new Error(getFailureMessage(response.data))
    return response.data
  } catch (err) {
    throw new Error(extractError(err))
  }
}

export const resetPasswordRequest = async (payload: ResetPasswordPayload) => {
  try {
    const response = await axiosInstance.post<ApiResponse>('/auth/reset-password', payload)
    if (response.data.success === false) throw new Error(getFailureMessage(response.data))
    return response.data
  } catch (err) {
    throw new Error(extractError(err))
  }
}
