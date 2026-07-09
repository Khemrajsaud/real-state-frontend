import axiosInstance from './axiosInstance'
import {
  mockCreateFaq,
  mockDeleteFaq,
  mockGetFaqs,
  mockUpdateFaq,
  USE_MOCK_API,
} from '../mocks/mockApi'

type ApiResponse = {
  success?: boolean
  message?: string
  error?: string
  data?: unknown
  faqs?: unknown
  faq?: unknown
}

export type Faq = {
  id?: string | number
  _id?: string
  question?: string
  answer?: string
  category?: string
  [key: string]: unknown
}

export type FaqFormPayload = {
  question: string
  answer: string
  category: string
}

const normalizeFaqs = (response: ApiResponse): Faq[] => {
  if (response.success === false) {
    throw new Error(
      response.error ?? response.message ?? 'Unable to load FAQs right now.',
    )
  }

  const payload = response.data ?? response.faqs ?? response.faq

  if (Array.isArray(payload)) {
    return payload as Faq[]
  }

  if (payload && typeof payload === 'object') {
    return [payload as Faq]
  }

  return []
}

export const getFaqs = async () => {
  if (USE_MOCK_API) {
    return mockGetFaqs()
  }

  const response = await axiosInstance.get<ApiResponse>('/faqs')

  return normalizeFaqs(response.data)
}

export const createFaq = async (payload: FaqFormPayload) => {
  if (USE_MOCK_API) {
    return mockCreateFaq(payload)
  }

  const response = await axiosInstance.post<ApiResponse>('/faqs', payload)

  if (response.data.success === false) {
    throw new Error(response.data.error ?? response.data.message ?? 'FAQ create failed.')
  }

  return response.data
}

export const updateFaq = async (faqId: string | number, payload: FaqFormPayload) => {
  if (USE_MOCK_API) {
    return mockUpdateFaq(faqId, payload)
  }

  const response = await axiosInstance.put<ApiResponse>(`/faqs/${faqId}`, payload)

  if (response.data.success === false) {
    throw new Error(response.data.error ?? response.data.message ?? 'FAQ update failed.')
  }

  return response.data
}

export const deleteFaq = async (faqId: string | number) => {
  if (USE_MOCK_API) {
    return mockDeleteFaq(faqId)
  }

  const response = await axiosInstance.delete<ApiResponse>(`/faqs/${faqId}`)

  if (response.data.success === false) {
    throw new Error(response.data.error ?? response.data.message ?? 'FAQ delete failed.')
  }

  return response.data
}
