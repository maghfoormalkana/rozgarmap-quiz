import axios from 'axios'

// 1. DYNAMIC NETWORK IP RESOLUTION
// If an explicit environment variable is defined (e.g. in production), use it.
// Otherwise, dynamically construct the base URL using the current device's access hostname.
const getBaseUrl = () => {
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL
  }
  
  const currentHost = window.location.hostname // Automatically captures localhost or your Wi-Fi IP (e.g., 10.15.31.72)
  return `http://${currentHost}:5000/api`
}

const API_URL = getBaseUrl()

// 2. AXIOS INSTANCE CREATION
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor to add auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      window.location.href = '/admin/login'
    }
    return Promise.reject(error)
  }
)

// --- API METHOD ENDPOINTS ---

// Auth
export const loginAdmin = (credentials) => api.post('/admin/login', credentials)
export const verifyAdmin = () => api.get('/admin/verify')

// Categories
export const getCategories = () => api.get('/categories')
export const createCategory = (data) => api.post('/categories', data)
export const updateCategory = (id, data) => api.put(`/categories/${id}`, data)
export const deleteCategory = (id) => api.delete(`/categories/${id}`)

// Questions
export const getQuestions = (params) => api.get('/questions', { params })
export const createQuestion = (data) => api.post('/questions', data)
export const updateQuestion = (id, data) => api.put(`/questions/${id}`, data)
export const deleteQuestion = (id) => api.delete(`/questions/${id}`)
export const bulkUploadQuestions = (data) => api.post('/questions/bulk', data)
export const uploadExcel = (formData) => api.post('/questions/upload', formData, {
  headers: { 'Content-Type': 'multipart/form-data' }
})

// Results
export const getResults = (params) => api.get('/results', { params })
export const createResult = (data) => api.post('/results', data)
export const exportResults = (params) => api.get('/results/export', { params, responseType: 'blob' })

// Stats
export const getStats = () => api.get('/stats')

// Quiz (public)
export const getQuizQuestions = (categoryId) => api.get(`/quiz/${categoryId}`)

export default api