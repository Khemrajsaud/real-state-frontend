import axios from 'axios'

export const API_BASE_URL = 'https://real-state-backend-system.onrender.com/api'
export const AUTH_TOKEN_STORAGE_KEY = 'realStateAuthToken'

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
})

axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem(AUTH_TOKEN_STORAGE_KEY)

  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }

  return config
})

export default axiosInstance
