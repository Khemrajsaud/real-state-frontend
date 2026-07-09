import axiosInstance from './axiosInstance'
import { mockGetSubscribers, mockSubscribe, USE_MOCK_API } from '../mocks/mockApi'

type ApiResponse = {
  success?: boolean
  message?: string
  error?: string
  data?: unknown
  subscriber?: unknown
  subscribers?: unknown
}

export type SubscribePayload = {
  email: string
}

export const subscribeRequest = async (payload: SubscribePayload) => {
  if (USE_MOCK_API) {
    return mockSubscribe(payload)
  }

  const response = await axiosInstance.post<ApiResponse>('/subscribe', payload)

  if (response.data.success === false) {
    throw new Error(
      response.data.error ??
        response.data.message ??
        'Unable to subscribe right now.',
    )
  }

  return response.data
}

export const getSubscribers = async () => {
  if (USE_MOCK_API) {
    return mockGetSubscribers()
  }

  const response = await axiosInstance.get<ApiResponse>('/subscribers')

  if (response.data.success === false) {
    throw new Error(
      response.data.error ??
        response.data.message ??
        'Unable to load subscribers right now.',
    )
  }

  const payload = response.data.data ?? response.data.subscribers ?? response.data.subscriber

  return Array.isArray(payload) ? payload : []
}
