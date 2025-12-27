import axios from 'axios'
import Cookies from 'js-cookie'

// جلب الرابط الأساسي من متغيرات البيئة
const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1'

const adminAPI = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
})

// ==================== INTERCEPTORS (الاعتراض) ====================

// 1. اعتراض الطلبات (قبل إرسال الطلب للباك إند)
adminAPI.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      // نبحث عن التوكن في الكوكيز (للميدل وير) أو لوكال ستورج
      const token = Cookies.get('token') || localStorage.getItem('token')

      if (token) {
        config.headers.Authorization = `Bearer ${token}`
      }
    }
    return config
  },
  (error) => Promise.reject(error)
)

// 2. اعتراض الاستجابة (عند استقبال رد من الباك إند)
adminAPI.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    // إذا كان الخطأ "غير مصرح" أو "انتهت الجلسة"
    if (error.response?.status === 401 || error.response?.status === 403) {
      if (typeof window !== 'undefined') {
        // تنظيف البيانات
        Cookies.remove('token')
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        
        // التوجيه لصفحة دخول الأدمن (وليس صفحة دخول المستخدمين)
        if (!window.location.pathname.includes('/admin/login')) {
            window.location.href = '/admin/login'
        }
      }
    }
    return Promise.reject(error)
  }
)

// ==================== HELPERS (مساعدات) ====================

// توحيد شكل الاستجابة (Normalize)
function normalizeResponse(response: any) {
  if (response.data?.data) return response.data
  if (response.data) return { data: response.data }
  return { data: response }
}

// تسوية FormData (للملفات والصور)
function logFormData(formData: FormData) {
  console.log('📤 FormData Content:')
  Array.from(formData.entries()).forEach(([key, value]) => {
    console.log(`  ${key}:`, value instanceof File ? `[File] ${value.name}` : value)
  })
}

// ==================== الأقسام البرمجية (API Sections) ====================

// 1. Dashboard (الإحصائيات)
export const adminDashboardAPI = {
  getStats: async () => {
    const response = await adminAPI.get('/admin/dashboard/stats')
    return response.data
  },
  getRecentOrders: async (limit = 5) => {
    const response = await adminAPI.get('/orders', { params: { limit, sort: '-createdAt' } })
    return normalizeResponse(response)
  },
}

// 2. Products (المنتجات)
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

// 3. Categories (الأقسام)
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
  delete: async (id: string) => {
    const response = await adminAPI.delete(`/categories/${id}`)
    return response.data
  },
}

// 4. Orders (الطلبات)
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
  delete: async (id: string) => {
    const response = await adminAPI.delete(`/orders/${id}`)
    return response.data
  }
}

// 5. Users (المستخدمين)
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

export default adminAPI