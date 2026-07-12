import axiosInstance from './axiosInstance'
import type { Property } from './properties'

type ApiResponse = {
  success?: boolean
  message?: string
  error?: string
  data?: unknown
  favorites?: unknown
  favorite?: unknown
  properties?: unknown
}

export type Favorite = {
  id?: string | number
  _id?: string
  userId?: string | number
  propertyId?: string | number | Property
  property?: Property
  [key: string]: unknown
}

const getFailureMessage = (response: ApiResponse) =>
  response.error ?? response.message ?? 'Unable to update favorites right now.'

const normalizeFavorites = (response: ApiResponse): Favorite[] => {
  if (response.success === false) {
    throw new Error(getFailureMessage(response))
  }

  const payload = response.data ?? response.favorites ?? response.properties ?? response.favorite

  if (Array.isArray(payload)) {
    return payload as Favorite[]
  }

  if (payload && typeof payload === 'object') {
    return [payload as Favorite]
  }

  return []
}

export const getFavoriteProperty = (favorite: Favorite): Property | null => {
  if (favorite.property && typeof favorite.property === 'object') {
    return favorite.property
  }

  if (favorite.propertyId && typeof favorite.propertyId === 'object') {
    return favorite.propertyId
  }

  return null
}

export const getFavorites = async (userId: string | number) => {
  const response = await axiosInstance.get<ApiResponse>(`/favorites/${userId}`)

  return normalizeFavorites(response.data)
}

export const toggleFavorite = async ({
  userId,
  propertyId,
}: {
  userId: string | number
  propertyId: string | number
}) => {
  const response = await axiosInstance.post<ApiResponse>('/favorites/', {
    userId,
    propertyId,
  })

  if (response.data.success === false) {
    throw new Error(getFailureMessage(response.data))
  }

  return response.data
}
