import axiosInstance from './axiosInstance'
import { USE_MOCK_API } from '../mocks/mockApi'

// Import mock functions that we will add to mockApi.ts
import {
  mockGetBlogs,
  mockGetBlogBySlug,
  mockCreateBlog,
  mockDeleteBlog,
} from '../mocks/mockApi'

type ApiResponse = {
  success?: boolean
  message?: string
  error?: string
  data?: unknown
  blogs?: unknown
  blog?: unknown
}

export type BlogPost = {
  id?: string | number
  _id?: string
  title?: string
  slug?: string
  content?: string
  coverImage?: string | null
  author?: string
  createdAt?: string
  updatedAt?: string
}

export type BlogFormPayload = {
  title: string
  content: string
  author?: string
  coverImage?: FileList
}

const getErrorMessage = (response: ApiResponse) =>
  response.error ?? response.message ?? 'Unable to process blog action right now.'

const normalizeBlogs = (response: ApiResponse): BlogPost[] => {
  if (response.success === false) {
    throw new Error(getErrorMessage(response))
  }

  const payload = response.data ?? response.blogs

  if (Array.isArray(payload)) {
    return payload as BlogPost[]
  }

  return []
}

const normalizeBlog = (response: ApiResponse): BlogPost => {
  if (response.success === false) {
    throw new Error(getErrorMessage(response))
  }

  const payload = response.data ?? response.blog

  if (payload && typeof payload === 'object') {
    return payload as BlogPost
  }

  throw new Error('Blog post not found.')
}

export const getBlogs = async (): Promise<BlogPost[]> => {
  if (USE_MOCK_API) {
    return mockGetBlogs()
  }

  const response = await axiosInstance.get<ApiResponse>('/blogs')
  return normalizeBlogs(response.data)
}

export const getBlogBySlug = async (slug: string): Promise<BlogPost> => {
  if (USE_MOCK_API) {
    return mockGetBlogBySlug(slug)
  }

  const response = await axiosInstance.get<ApiResponse>(`/blogs/${slug}`)
  return normalizeBlog(response.data)
}

export const createBlog = async (payload: BlogFormPayload): Promise<BlogPost> => {
  if (USE_MOCK_API) {
    return mockCreateBlog(payload)
  }

  const formData = new FormData()
  formData.append('title', payload.title)
  formData.append('content', payload.content)
  if (payload.author) {
    formData.append('author', payload.author)
  }
  if (payload.coverImage && payload.coverImage.length > 0) {
    formData.append('coverImage', payload.coverImage[0])
  }

  const response = await axiosInstance.post<ApiResponse>('/blogs', formData)
  return normalizeBlog(response.data)
}

export const deleteBlog = async (id: string | number): Promise<void> => {
  if (USE_MOCK_API) {
    mockDeleteBlog(id)
    return
  }

  const response = await axiosInstance.delete<ApiResponse>(`/blogs/${id}`)
  if (response.data.success === false) {
    throw new Error(getErrorMessage(response.data))
  }
}
