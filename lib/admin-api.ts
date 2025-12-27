import axios from 'axios'
import Cookies from 'js-cookie'

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1'

const adminAPI = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
})

// ==================== INTERCEPTORS ====================

adminAPI.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const token = Cookies.get('token') || localStorage.getItem('token')
      if (token) {
        config.headers.Authorization = `Bearer ${token}`
      }
    }
    return config
  },
  (error) => Promise.reject(error)
)

adminAPI.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 || error.response?.status === 403) {
      if (typeof window !== 'undefined') {
        Cookies.remove('token')
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        if (!window.location.pathname.includes('/admin/login')) {
          window.location.href = '/admin/login'
        }
      }
    }
    return Promise.reject(error)
  }
)

// ==================== HELPERS ====================

function normalizeResponse(response: any) {
  if (response.data?.data) return response.data
  if (response.data) return { data: response.data }
  return { data: response }
}

// ==================== API SECTIONS ====================

export const adminDashboardAPI = {
  getStats: async () => {
    const response = await adminAPI.get('/admin/dashboard/stats')
    return response.data
  },
  getRecentOrders: async (limit = 5) => {
    const response = await adminAPI.get('/orders', { params: { limit, sort: '-createdAt' } })
    return normalizeResponse(response)
  },
  getTopProducts: async (limit = 5) => {
    const response = await adminAPI.get('/products', { params: { limit, sort: '-sold' } })
    return normalizeResponse(response)
  },
}

export const adminProductsAPI = {
  getAll: async (params?: any) => {
    const response = await adminAPI.get('/products', { params })
    return normalizeResponse(response)
  },
  getById: async (id: string) => {
    const response = await adminAPI.get(`/products/${id}`)
    return normalizeResponse(response).data
  },
  create: async (formData: FormData) => {
    const response = await adminAPI.post('/products', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    return normalizeResponse(response)
  },
  update: async (id: string, formData: FormData) => {
    const response = await adminAPI.put(`/products/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    return normalizeResponse(response)
  },
  delete: async (id: string) => {
    const response = await adminAPI.delete(`/products/${id}`)
    return response.data
  },
}

export const adminCategoriesAPI = {
  getAll: async () => {
    const response = await adminAPI.get('/categories')
    return normalizeResponse(response)
  },
  create: async (data: FormData) => {
    const response = await adminAPI.post('/categories', data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    return normalizeResponse(response)
  },
  update: async (id: string, data: FormData) => {
    const response = await adminAPI.put(`/categories/${id}`, data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    return normalizeResponse(response)
  },
  delete: async (id: string) => {
    const response = await adminAPI.delete(`/categories/${id}`)
    return response.data
  },
}

export const adminSubCategoriesAPI = {
  getAll: async () => {
    const response = await adminAPI.get('/subcategories')
    return normalizeResponse(response)
  },
  getByCategoryId: async (categoryId: string) => {
    const response = await adminAPI.get(`/categories/${categoryId}/subcategories`)
    return normalizeResponse(response)
  },
  create: async (data: any) => {
    const response = await adminAPI.post('/subcategories', data)
    return normalizeResponse(response)
  },
  delete: async (id: string) => {
    const response = await adminAPI.delete(`/subcategories/${id}`)
    return response.data
  },
}

export const adminBrandsAPI = {
  getAll: async () => {
    const response = await adminAPI.get('/brands')
    return normalizeResponse(response)
  },
  create: async (data: FormData) => {
    const response = await adminAPI.post('/brands', data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    return normalizeResponse(response)
  },
  delete: async (id: string) => {
    const response = await adminAPI.delete(`/brands/${id}`)
    return response.data
  },
}

// -------------------------------------------------------------------------
// تعديل قسم الطلبات ليشمل دوال التحديث المطلوبة في صفحة تفاصيل الطلب
// -------------------------------------------------------------------------
export const adminOrdersAPI = {
  getAll: async (params?: any) => {
    const response = await adminAPI.get('/orders', { params })
    return normalizeResponse(response)
  },
  getById: async (id: string) => {
    const response = await adminAPI.get(`/orders/${id}`)
    return response.data
  },
  updateStatus: async (id: string, status: string) => {
    const response = await adminAPI.put(`/orders/${id}`, { status })
    return normalizeResponse(response)
  },
  // دالة تحديث حالة الدفع (المطلوبة للـ Build)
  updatePaidStatus: async (id: string) => {
    const response = await adminAPI.put(`/orders/${id}/pay`)
    return normalizeResponse(response)
  },
  // دالة تحديث حالة التوصيل (المطلوبة للـ Build)
  updateDeliveredStatus: async (id: string) => {
    const response = await adminAPI.put(`/orders/${id}/deliver`)
    return normalizeResponse(response)
  },
  delete: async (id: string) => {
    const response = await adminAPI.delete(`/orders/${id}`)
    return response.data
  }
}

export const adminUsersAPI = {
  getAll: async (params?: any) => {
    const response = await adminAPI.get('/users', { params })
    return normalizeResponse(response)
  },
  changeRole: async (id: string, role: string) => {
    const response = await adminAPI.put(`/users/changeUserRole/${id}`, { role })
    return normalizeResponse(response)
  },
  delete: async (id: string) => {
    const response = await adminAPI.delete(`/users/${id}`)
    return response.data
  },
}

export const adminReviewsAPI = {
  getAll: async (params?: any) => {
    const response = await adminAPI.get('/reviews', { params })
    return normalizeResponse(response)
  },
  delete: async (id: string) => {
    const response = await adminAPI.delete(`/reviews/${id}`)
    return response.data
  },
}

export default adminAPI