// lib/api.ts
import axios, { AxiosError } from 'axios'
import type {
  Product,
  Category,
  SubCategory,
  Cart,
  CartItem,
  Review,
  AuthResponse,
  PaginatedResponse,
  Brand,
  User,
  UpdateUserData,
  ChangePasswordData,
  Address,
} from './types'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1'

interface ProductQueryParams {
  page?: number
  limit?: number
  sort?: string
  category?: string | string[]
  subcategory?: string
  brand?: string | string[]
  priceMin?: number
  priceMax?: number
  keyword?: string
  [key: string]: any
}

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
})

// Request interceptor
api.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token')
      if (token) {
        config.headers.Authorization = `Bearer ${token}`
      }
    }
    return config
  },
  (error) => Promise.reject(error)
)

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401 && typeof window !== 'undefined') {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

// ==================== PRODUCTS API ====================
export const productsAPI = {
getAll: async (params?: ProductQueryParams) => {
    const cleanParams: any = { ...params };

    if (cleanParams.priceMin !== undefined) {
      cleanParams['price[gte]'] = cleanParams.priceMin;
      delete cleanParams.priceMin;
    }
    if (cleanParams.priceMax !== undefined) {
      cleanParams['price[lte]'] = cleanParams.priceMax;
      delete cleanParams.priceMax;
    }

    const response = await api.get<PaginatedResponse<Product>>('/products', {
      params: cleanParams,
      paramsSerializer: { indexes: null }
    });
    return response.data;
  },

  getById: async (id: string) => {
    const response = await api.get<{ data: Product }>(`/products/${id}`)
    return response.data.data
  },

  getReviews: async (productId: string) => {
    const response = await api.get<PaginatedResponse<Review>>(
      `/products/${productId}/reviews`
    )
    return response.data.data || []
  },
}

// ==================== CATEGORIES API ====================
export const categoriesAPI = {
  getAll: async () => {
    const response = await api.get<{ results: number; data: Category[] }>('/categories')
    return response.data.data
  },
  getById: async (id: string) => {
    const response = await api.get<{ data: Category }>(`/categories/${id}`)
    return response.data.data
  },
  getSubCategories: async (categoryId?: string) => {
    const url = categoryId ? `/categories/${categoryId}/subcategories` : '/subcategories'
    const response = await api.get<{ results: number; data: SubCategory[] }>(url)
    return response.data.data
  },
}

// ==================== BRANDS API ====================
export const brandsAPI = {
  getAll: async () => {
    const response = await api.get<{ results: number; data: Brand[] }>('/brands')
    return response.data.data
  },
}

// ==================== AUTH API ====================
export const authAPI = {
  signup: async (data: any) => {
    const response = await api.post<AuthResponse>('/auth/signup', data)
    if (response.data.token) localStorage.setItem('token', response.data.token)
    return response.data
  },
  login: async (data: any) => {
    const response = await api.post<AuthResponse>('/auth/login', data)
    if (response.data.token) localStorage.setItem('token', response.data.token)
    return response.data
  },
  logout: () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    window.location.href = '/'
  },
}

// ==================== USERS API ====================
export const usersAPI = {
  getMe: async () => {
    const response = await api.get<{ status: number; data: User }>('/users/getMe')
    return response.data.data
  },
  updateMe: async (data: UpdateUserData) => {
    const response = await api.put<{ status: number; data: User }>('/users/updateMe', data)
    return response.data.data
  },
  changeMyPassword: async (data: ChangePasswordData) => {
    const response = await api.put<{ status: number; token: string; data: User }>('/users/changeMyPassword', data)
    if (response.data.token) localStorage.setItem('token', response.data.token)
    return response.data
  },
  deleteMe: async () => {
    const response = await api.delete('/users/deleteMe')
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    return response.data
  },
}

// ==================== CART API ====================
export const cartAPI = {
  get: async () => {
    const response = await api.get<{ data: Cart }>('/cart')
    const cart = response.data.data
    // الـ Populate اليدوي إذا لزم الأمر كما في كودك القديم
    if (cart?.cartItems?.length > 0 && typeof cart.cartItems[0].product === 'string') {
        cart.cartItems = await Promise.all(cart.cartItems.map(async (item: any) => {
            const prod = await productsAPI.getById(item.product)
            return { ...item, product: prod }
        }))
    }
    return cart
  },
  addItem: async (data: any) => {
    await api.post('/cart', data)
    return cartAPI.get()
  },
  updateQuantity: async (itemId: string, quantity: number) => {
    await api.put(`/cart/${itemId}`, { quantity })
    return cartAPI.get()
  },
  removeItem: async (itemId: string) => {
    const response = await api.delete(`/cart/${itemId}`)
    return response.data
  },
  clear: async () => {
    const response = await api.delete('/cart')
    return response.data
  },
  applyCoupon: async (coupon: string) => {
    await api.put('/cart/applyCoupon', { coupon })
    return cartAPI.get()
  }
}

// ==================== WISHLIST API ====================
export const wishlistAPI = {
  get: async () => {
    const response = await api.get<{ data: Product[] }>('/wishlist')
    return response.data.data || []
  },
  add: async (productId: string) => {
    const response = await api.post('/wishlist', { productId })
    return response.data.data
  },
  remove: async (productId: string) => {
    const response = await api.delete(`/wishlist/${productId}`)
    return response.data.data
  },
}

// ==================== ORDERS API ====================
export const ordersAPI = {
  createCashOrder: async (cartId: string, shippingAddress: any) => {
    const response = await api.post(`/orders/${cartId}`, { shippingAddress })
    return response.data
  },
  getUserOrders: async () => {
    const response = await api.get<{ data: any[] }>('/orders')
    return response.data.data || []
  },
  getOrderById: async (id: string) => {
    const response = await api.get(`/orders/${id}`)
    return response.data.data
  },
  getCheckoutSession: async (cartId: string, shippingAddress: any) => {
    const response = await api.get(`/orders/checkout-session/${cartId}`, { params: shippingAddress })
    return response.data
  },
}

// ==================== REVIEWS API (إعادة التصدير الناقص) ====================
export const reviewsAPI = {
  create: async (data: any) => {
    const response = await api.post('/reviews', data)
    return response.data
  },
  update: async (id: string, data: any) => {
    const response = await api.put(`/reviews/${id}`, data)
    return response.data
  },
  delete: async (id: string) => {
    const response = await api.delete(`/reviews/${id}`)
    return response.data
  },
  getReviews: async (productId: string) => {
    const response = await api.get<{ data: Review[] }>(`/products/${productId}/reviews`)
    return response.data.data || []
  },
}

// ==================== ADDRESSES API (إضافة Update الناقصة) ====================
export const addressesAPI = {
  getAll: async () => {
    const response = await api.get<{ data: Address[] }>('/addresses')
    return response.data.data || []
  },
  add: async (address: any) => {
    const response = await api.post('/addresses', address)
    return response.data.data
  },
  update: async (id: string, address: any) => {
    const response = await api.put(`/addresses/${id}`, address)
    return response.data.data
  },
  delete: async (id: string) => {
    const response = await api.delete(`/addresses/${id}`)
    return response.data
  },
}

export default api;