import axiosInstance from './axiosInstance'
import type { AuthUser } from './auth'
import {
  mockGetProfile,
  mockUpdateProfileAvatar,
  mockUpdateProfileText,
  mockDeleteProfile,
  USE_MOCK_API,
} from '../mocks/mockApi'

type ApiResponse = {
  success?: boolean
  message?: string
  error?: string
  data?: unknown
  profile?: unknown
  user?: unknown
}

export type ProfileTextPayload = {
  name: string
  phone: string
  dob?: string
}

const getFailureMessage = (response: ApiResponse) =>
  response.error ?? response.message ?? 'Unable to update profile right now.'

const normalizeProfile = (response: ApiResponse): AuthUser => {
  if (response.success === false) {
    throw new Error(getFailureMessage(response))
  }

  const payload = response.data ?? response.profile ?? response.user

  if (payload && typeof payload === 'object') {
    return payload as AuthUser
  }

  throw new Error('Profile response was empty.')
}

export const getProfile = async (userId: string | number) => {
  if (USE_MOCK_API) {
    return mockGetProfile(userId)
  }

  const response = await axiosInstance.get<ApiResponse>(`/profile/${userId}`)

  return normalizeProfile(response.data)
}

export const updateProfileText = async (
  userId: string | number,
  payload: ProfileTextPayload,
) => {
  if (USE_MOCK_API) {
    return mockUpdateProfileText(userId, payload)
  }

  const response = await axiosInstance.put<ApiResponse>(
    `/profile/${userId}/text`,
    payload,
  )

  return normalizeProfile(response.data)
}

export const updateProfileAvatar = async (userId: string | number, avatar: File) => {
  if (USE_MOCK_API) {
    return mockUpdateProfileAvatar(userId)
  }

  const formData = new FormData()
  formData.append('avatar', avatar)

  const response = await axiosInstance.put<ApiResponse>(
    `/profile/${userId}/avatar`,
    formData,
  )

  return normalizeProfile(response.data)
}

export const deleteProfile = async (userId: string | number): Promise<void> => {
  if (USE_MOCK_API) {
    await mockDeleteProfile(userId)
    return
  }

  const response = await axiosInstance.delete<ApiResponse>(`/profile/${userId}`)
  if (response.data.success === false) {
    throw new Error(getFailureMessage(response.data))
  }
}
