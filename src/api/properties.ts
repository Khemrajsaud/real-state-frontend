import axiosInstance from './axiosInstance'
import {
  mockCreateProperty,
  mockDeleteProperty,
  mockGetProperties,
  mockGetPropertyById,
  mockUpdateProperty,
  USE_MOCK_API,
} from '../mocks/mockApi'

type ApiCollectionResponse = {
  success?: boolean
  message?: string
  error?: string
  data?: unknown
  properties?: unknown
  property?: unknown
}

export type PropertyMedia = {
  id?: string | number
  _id?: string
  url?: string
  secure_url?: string
  path?: string
  imageUrl?: string
  videoUrl?: string
  documentUrl?: string
  [key: string]: unknown
}

export type PropertyCategory = {
  id?: string | number
  _id?: string
  name?: string
  title?: string
  [key: string]: unknown
}

export type PropertyStatus = {
  id?: string | number
  _id?: string
  name?: string
  title?: string
  [key: string]: unknown
}

export type Property = {
  id?: string | number
  _id?: string
  title?: string
  description?: string
  price?: string | number
  address?: string
  locationLink?: string
  category?: PropertyCategory | string
  status?: PropertyStatus | string
  images?: PropertyMedia[] | string[]
  propertyImages?: PropertyMedia[] | string[]
  videos?: PropertyMedia[] | string[]
  propertyVideos?: PropertyMedia[] | string[]
  documents?: PropertyMedia[] | string[]
  propertyDocs?: PropertyMedia[] | string[]
  amenities?: Array<PropertyCategory | string>
  [key: string]: unknown
}

export type PropertyFormPayload = {
  title: string
  description: string
  price: string
  address: string
  categoryId: string
  statusId: string
  locationLink?: string
  amenityIds?: string
  propertyImages?: FileList
  propertyVideos?: FileList
  propertyDocs?: FileList
}

const getErrorMessage = (response: ApiCollectionResponse) =>
  response.error ?? response.message ?? 'Unable to load properties right now.'

const ensureSuccess = (response: ApiCollectionResponse) => {
  if (response.success === false) {
    throw new Error(getErrorMessage(response))
  }
}

export const getPropertyId = (property: Property) => property._id ?? property.id

export const getPropertyTitle = (property: Property) =>
  property.title?.trim() || 'Untitled property'

export const getPropertyCategoryName = (property: Property) => {
  if (!property.category) {
    return null
  }

  if (typeof property.category === 'string') {
    return property.category
  }

  return property.category.name ?? property.category.title ?? null
}

export const getPropertyStatusName = (property: Property) => {
  if (!property.status) {
    return null
  }

  if (typeof property.status === 'string') {
    return property.status
  }

  return property.status.name ?? property.status.title ?? null
}

export const getMediaUrl = (media?: PropertyMedia | string) => {
  if (!media) {
    return null
  }

  if (typeof media === 'string') {
    return media
  }

  return (
    media.url ??
    media.secure_url ??
    media.path ??
    media.imageUrl ??
    media.videoUrl ??
    media.documentUrl ??
    null
  )
}

export const getPropertyImages = (property: Property) =>
  property.propertyImages ?? property.images ?? []

export const formatNprPrice = (price?: string | number) => {
  if (price === undefined || price === null || price === '') {
    return 'Price on request'
  }

  const numericPrice =
    typeof price === 'number' ? price : Number(String(price).replace(/[^\d.]/g, ''))

  if (!Number.isFinite(numericPrice)) {
    return `Rs. ${price}`
  }

  return `Rs. ${new Intl.NumberFormat('en-IN', {
    maximumFractionDigits: 0,
  }).format(numericPrice)}`
}

export const formatShortPrice = (price?: string | number, isNp?: boolean) => {
  if (price === undefined || price === null || price === '') {
    return isNp ? 'मूल्य अनुरोधमा' : 'Price on request'
  }

  const num = typeof price === 'number' ? price : Number(String(price).replace(/[^\d.]/g, ''))
  if (!Number.isFinite(num) || num <= 0) {
    return `Rs. ${price}`
  }

  if (num >= 10000000) {
    const crValue = num / 10000000
    const formatted = crValue % 1 === 0 ? crValue.toFixed(0) : crValue.toFixed(2).replace(/\.?0+$/, '')
    return isNp ? `रु. ${formatted} करोड` : `Rs. ${formatted} Cr`
  } else if (num >= 100000) {
    const lacValue = num / 100000
    const formatted = lacValue % 1 === 0 ? lacValue.toFixed(0) : lacValue.toFixed(2).replace(/\.?0+$/, '')
    return isNp ? `रु. ${formatted} लाख` : `Rs. ${formatted} Lac`
  }

  return `Rs. ${new Intl.NumberFormat('en-IN', { maximumFractionDigits: 0 }).format(num)}`
}

const normalizeProperties = (response: ApiCollectionResponse): Property[] => {
  ensureSuccess(response)

  const payload = response.data ?? response.properties

  if (Array.isArray(payload)) {
    return payload as Property[]
  }

  return []
}

const normalizeProperty = (response: ApiCollectionResponse): Property => {
  ensureSuccess(response)

  const payload = response.data ?? response.property

  if (payload && typeof payload === 'object') {
    return payload as Property
  }

  throw new Error('Property details were not found.')
}

export const getProperties = async () => {
  if (USE_MOCK_API) {
    return mockGetProperties()
  }

  const response = await axiosInstance.get<ApiCollectionResponse>('/properties')

  return normalizeProperties(response.data)
}

export const getPropertyById = async (propertyId: string) => {
  if (USE_MOCK_API) {
    return mockGetPropertyById(propertyId)
  }

  const response = await axiosInstance.get<ApiCollectionResponse>(
    `/properties/${propertyId}`,
  )

  return normalizeProperty(response.data)
}

const buildPropertyFormData = (payload: PropertyFormPayload) => {
  const formData = new FormData()
  formData.append('title', payload.title)
  formData.append('description', payload.description)
  formData.append('price', payload.price)
  formData.append('address', payload.address)
  formData.append('categoryId', payload.categoryId)
  formData.append('statusId', payload.statusId)

  if (payload.locationLink) {
    formData.append('locationLink', payload.locationLink)
  }

  if (payload.amenityIds) {
    formData.append('amenityIds', payload.amenityIds)
  }

  Array.from(payload.propertyImages ?? []).forEach((file) => {
    formData.append('propertyImages', file)
  })
  Array.from(payload.propertyVideos ?? []).forEach((file) => {
    formData.append('propertyVideos', file)
  })
  Array.from(payload.propertyDocs ?? []).forEach((file) => {
    formData.append('propertyDocs', file)
  })

  return formData
}

export const createProperty = async (payload: PropertyFormPayload) => {
  if (USE_MOCK_API) {
    return mockCreateProperty(payload)
  }

  const response = await axiosInstance.post<ApiCollectionResponse>(
    '/properties',
    buildPropertyFormData(payload),
  )

  return normalizeProperty(response.data)
}

export const updateProperty = async (
  propertyId: string | number,
  payload: PropertyFormPayload,
) => {
  if (USE_MOCK_API) {
    return mockUpdateProperty(propertyId, payload)
  }

  const response = await axiosInstance.put<ApiCollectionResponse>(
    `/properties/${propertyId}`,
    buildPropertyFormData(payload),
  )

  return normalizeProperty(response.data)
}

export const deleteProperty = async (propertyId: string | number) => {
  if (USE_MOCK_API) {
    return mockDeleteProperty(propertyId)
  }

  const response = await axiosInstance.delete<ApiCollectionResponse>(
    `/properties/${propertyId}`,
  )

  ensureSuccess(response.data)
  return response.data
}
