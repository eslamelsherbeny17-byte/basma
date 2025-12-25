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

// 👇 استخدام Environment Variable
const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1'
console.log(' API_BASE_URLl', process.env.NEXT_PUBLIC_API_URL)

interface ProductQueryParams {
  page?: number
  limit?: number
  sort?: string
  category?: string
  subcategory?: string
  brand?: string
  priceMin?: number
  priceMax?: number
  keyword?: string
  [key: string]: any
}

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
})

// Request interceptor - Add token
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
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor - Handle errors
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        window.location.href = '/login'
      }
    }
    return Promise.reject(error)
  }
)

// ==================== PRODUCTS API ====================
export const productsAPI = {
  getAll: async (params?: ProductQueryParams) => {
    const response = await api.get<PaginatedResponse<Product>>('/products', {
      params: {
        ...params,
        'price[gte]': params?.priceMin,
        'price[lte]': params?.priceMax,
      },
    })
    return response.data
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
    const response = await api.get<{ results: number; data: Category[] }>(
      '/categories'
    )
    return response.data.data
  },

  getById: async (id: string) => {
    const response = await api.get<{ data: Category }>(`/categories/${id}`)
    return response.data.data
  },

  getSubCategories: async (categoryId?: string) => {
    const url = categoryId
      ? `/categories/${categoryId}/subcategories`
      : '/subcategories'
    const response = await api.get<{ results: number; data: SubCategory[] }>(
      url
    )
    return response.data.data
  },
}

// ==================== BRANDS API ====================
export const brandsAPI = {
  getAll: async () => {
    const response = await api.get<{ results: number; data: Brand[] }>(
      '/brands'
    )
    return response.data.data
  },
}

// ==================== AUTH API ====================
export const authAPI = {
  signup: async (data: {
    name: string
    email: string
    password: string
    passwordConfirm: string
    phone?: string
  }) => {
    const response = await api.post<AuthResponse>('/auth/signup', data)
    if (response.data.token) {
      localStorage.setItem('token', response.data.token)
    }
    return response.data
  },

  login: async (data: { email: string; password: string }) => {
    const response = await api.post<AuthResponse>('/auth/login', data)
    if (response.data.token) {
      localStorage.setItem('token', response.data.token)
    }
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
    const response = await api.get<{ status: number; data: User }>(
      '/users/getMe'
    )
    return response.data.data
  },

  updateMe: async (data: UpdateUserData) => {
    const response = await api.put<{ status: number; data: User }>(
      '/users/updateMe',
      data
    )
    return response.data.data
  },

  changeMyPassword: async (data: ChangePasswordData) => {
    const response = await api.put<{
      status: number
      token: string
      data: User
    }>('/users/changeMyPassword', data)

    if (response.data.token) {
      localStorage.setItem('token', response.data.token)
    }

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
    try {
      const response = await api.get<{
        status: number
        message: string
        numOfCartItems: number
        data: Cart
      }>('/cart')

      const cart = response.data.data

      if (cart.cartItems && cart.cartItems.length > 0) {
        const firstItem = cart.cartItems[0]

        if (typeof firstItem.product === 'string') {
          const populatedItems = await Promise.all(
            cart.cartItems.map(async (item): Promise<CartItem> => {
              try {
                if (typeof item.product === 'string') {
                  const productResponse = await api.get<{ data: Product }>(
                    `/products/${item.product}`
                  )
                  return {
                    ...item,
                    product: productResponse.data.data,
                  } as CartItem
                }
                return item as CartItem
              } catch (error) {
                return item as CartItem
              }
            })
          )

          cart.cartItems = populatedItems
        }
      }

      return cart
    } catch (error: any) {
      throw error
    }
  },

  addItem: async (data: {
    productId: string
    color?: string
    size?: string
  }) => {
    try {
      const response = await api.post<{
        status: number
        message: string
        numOfCartItems: number
        data: Cart
      }>('/cart', data)

      return await cartAPI.get()
    } catch (error: any) {
      throw error
    }
  },

  updateQuantity: async (itemId: string, quantity: number) => {
    try {
      await api.put<{
        status: number
        message: string
        numOfCartItems: number
        data: Cart
      }>(`/cart/${itemId}`, { quantity })

      return await cartAPI.get()
    } catch (error: any) {
      throw error
    }
  },

  removeItem: async (itemId: string) => {
    try {
      const response = await api.delete(`/cart/${itemId}`)
      return response.data
    } catch (error: any) {
      throw error
    }
  },

  clear: async () => {
    try {
      const response = await api.delete('/cart')
      return response.data
    } catch (error: any) {
      throw error
    }
  },

  applyCoupon: async (coupon: string) => {
    try {
      await api.put<{
        status: number
        message: string
        data: Cart
      }>('/cart/applyCoupon', { coupon })

      return await cartAPI.get()
    } catch (error: any) {
      throw error
    }
  },
}

// ==================== WISHLIST API ====================
export const wishlistAPI = {
  get: async () => {
    try {
      const response = await api.get<{
        status: number
        results: number
        data: Product[]
      }>('/wishlist')

      return response.data.data || []
    } catch (error: any) {
      if (error.response?.status === 404) {
        return []
      }
      throw error
    }
  },

  add: async (productId: string) => {
    try {
      const response = await api.post<{
        status: number
        message: string
        data: Product[]
      }>('/wishlist', { productId })

      return response.data.data
    } catch (error: any) {
      throw error
    }
  },

  remove: async (productId: string) => {
    try {
      const response = await api.delete<{
        status: number
        message: string
        data: Product[]
      }>(`/wishlist/${productId}`)

      return response.data.data
    } catch (error: any) {
      throw error
    }
  },
}

// ==================== ORDERS API ====================
export const ordersAPI = {
  createCashOrder: async (
    cartId: string,
    shippingAddress: {
      details: string
      phone: string
      city: string
      postalCode: string
    }
  ) => {
    try {
      const response = await api.post(`/orders/${cartId}`, {
        shippingAddress,
      })
      return response.data
    } catch (error: any) {
      throw error
    }
  },

  getUserOrders: async () => {
    try {
      const response = await api.get<{
        status: number
        message: string
        results: number
        paginationResult: any
        data: any[]
      }>('/orders')

      return response.data.data || []
    } catch (error: any) {
      if (error.response?.status === 404) {
        return []
      }
      throw error
    }
  },

  getOrderById: async (id: string) => {
    try {
      const response = await api.get(`/orders/${id}`)
      return response.data.data
    } catch (error: any) {
      throw error
    }
  },

  getCheckoutSession: async (
    cartId: string,
    shippingAddress: {
      details: string
      phone: string
      city: string
      postalCode: string
    }
  ) => {
    try {
      const response = await api.get(`/orders/checkout-session/${cartId}`, {
        params: shippingAddress,
      })
      return response.data
    } catch (error: any) {
      throw error
    }
  },
}

// ==================== REVIEWS API ====================
export const reviewsAPI = {
  create: async (data: {
    title?: string
    ratings: number
    product: string
  }) => {
    try {
      const response = await api.post('/reviews', data)
      return response.data
    } catch (error: any) {
      throw error
    }
  },

  update: async (id: string, data: { title?: string; ratings?: number }) => {
    const response = await api.put(`/reviews/${id}`, data)
    return response.data
  },

  delete: async (id: string) => {
    const response = await api.delete(`/reviews/${id}`)
    return response.data
  },

  getReviews: async (productId: string) => {
    try {
      const response = await api.get<{ results: number; data: Review[] }>(
        `/products/${productId}/reviews`
      )
      return response.data.data || []
    } catch (error) {
      return []
    }
  },
}

// ==================== ADDRESSES API ====================
export const addressesAPI = {
  getAll: async () => {
    try {
      const response = await api.get<{
        status: string
        results: number
        data: Address[]
      }>('/addresses')

      return response.data.data || []
    } catch (error: any) {
      if (error.response?.status === 404) {
        return []
      }
      throw error
    }
  },

  add: async (address: {
    alias: string
    details: string
    phone: string
    city: string
    postalCode?: string
  }) => {
    try {
      const response = await api.post<{
        status: string
        message: string
        data: Address
      }>('/addresses', address)

      return response.data.data
    } catch (error: any) {
      throw error
    }
  },

  update: async (
    id: string,
    address: {
      alias: string
      details: string
      phone: string
      city: string
      postalCode?: string
    }
  ) => {
    try {
      const response = await api.put<{
        status: string
        message: string
        data: Address
      }>(`/addresses/${id}`, address)

      return response.data.data
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.errors?.[0]?.msg ||
        error.message ||
        'فشل تحديث العنوان'

      throw new Error(errorMessage)
    }
  },

  delete: async (id: string) => {
    try {
      const response = await api.delete(`/addresses/${id}`)
      return response.data
    } catch (error: any) {
      throw error
    }
  },
}

export default api
