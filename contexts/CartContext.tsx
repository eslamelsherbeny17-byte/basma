'use client'

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react'
import { cartAPI } from '@/lib/api'
import { Cart } from '@/lib/types'
import { useAuth } from './AuthContext'
import { toast } from 'sonner'

interface CartContextType {
  cart: Cart | null
  itemsCount: number
  loading: boolean
  addToCart: (productId: string, color?: string) => Promise<void>
  addItem: (data: {
    productId: string
    quantity?: number
    color?: string
    size?: string
  }) => Promise<void>
  updateQuantity: (itemId: string, quantity: number) => Promise<void>
  removeItem: (itemId: string) => Promise<void>
  clearCart: () => Promise<void>
  applyCoupon: (coupon: string) => Promise<void>
  refreshCart: () => Promise<void>
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<Cart | null>(null)
  const [loading, setLoading] = useState(false)
  const { isAuthenticated } = useAuth()

  useEffect(() => {
    if (isAuthenticated) {
      refreshCart()
    } else {
      setCart(null)
    }
  }, [isAuthenticated])

  const refreshCart = async () => {
    if (!isAuthenticated) return

    try {
      setLoading(true)
      const cartData = await cartAPI.get()
      setCart(cartData)
    } catch (error: any) {
      console.error('Failed to fetch cart:', error)
      if (error.response?.status !== 404) {
        toast.error('فشل تحميل السلة')
      }
    } finally {
      setLoading(false)
    }
  }

  // الـ Function القديمة (للتوافق مع الكود القديم)
  const addToCart = async (productId: string, color?: string) => {
    if (!isAuthenticated) {
      toast.error('يجب تسجيل الدخول أولاً')
      throw new Error('Not authenticated')
    }

    try {
      const updatedCart = await cartAPI.addItem({ productId, color })
      setCart(updatedCart)
      toast.success('تمت إضافة المنتج للسلة ✨')
    } catch (error: any) {
      const message = error.response?.data?.message || 'فشل إضافة المنتج للسلة'
      toast.error(message)
      throw new Error(message)
    }
  }

  // 👇 الـ Function الجديدة (بتدعم quantity و size) 👇
  const addItem = async (data: {
    productId: string
    quantity?: number
    color?: string
    size?: string
  }) => {
    if (!isAuthenticated) {
      toast.error('يجب تسجيل الدخول أولاً')
      throw new Error('Not authenticated')
    }

    try {
      setLoading(true)

      // إضافة المنتج للسلة
      await cartAPI.addItem({
        productId: data.productId,
        color: data.color,
      })

      // جلب السلة المحدثة
      await refreshCart()

      // لو في quantity أكتر من 1، نحدث الكمية
      if (data.quantity && data.quantity > 1) {
        // نجيب آخر item تم إضافته (اللي هو المنتج الحالي)
        const currentCart = await cartAPI.get()
        const addedItem = currentCart.cartItems.find(
          (item: any) =>
            (typeof item.product === 'object'
              ? item.product._id
              : item.product) === data.productId &&
            (!data.color || item.color === data.color)
        )

        if (addedItem) {
          await cartAPI.updateQuantity(addedItem._id, data.quantity)
          await refreshCart()
        }
      }

      toast.success('تمت إضافة المنتج للسلة ✨')
    } catch (error: any) {
      console.error('Add to cart error:', error)
      const message = error.response?.data?.message || 'فشل إضافة المنتج للسلة'
      toast.error(message)
      throw new Error(message)
    } finally {
      setLoading(false)
    }
  }

  const updateQuantity = async (itemId: string, quantity: number) => {
    if (quantity < 1) return

    try {
      const updatedCart = await cartAPI.updateQuantity(itemId, quantity)
      setCart(updatedCart)
    } catch (error: any) {
      const message = error.response?.data?.message || 'فشل تحديث الكمية'
      toast.error(message)
      throw new Error(message)
    }
  }

  const removeItem = async (itemId: string) => {
    try {
      await cartAPI.removeItem(itemId)
      await refreshCart()
      toast.success('تم حذف المنتج من السلة')
    } catch (error: any) {
      const message = error.response?.data?.message || 'فشل حذف المنتج'
      toast.error(message)
      throw new Error(message)
    }
  }

  const clearCart = async () => {
    try {
      await cartAPI.clear()
      setCart(null)
      toast.success('تم تفريغ السلة')
    } catch (error: any) {
      const message = error.response?.data?.message || 'فشل تفريغ السلة'
      toast.error(message)
      throw new Error(message)
    }
  }

  const applyCoupon = async (coupon: string) => {
    try {
      const updatedCart = await cartAPI.applyCoupon(coupon)
      setCart(updatedCart)
      toast.success('تم تطبيق كود الخصم بنجاح 🎉')
    } catch (error: any) {
      const message = error.response?.data?.message || 'كود خصم غير صحيح'
      toast.error(message)
      throw new Error(message)
    }
  }

  const itemsCount = cart?.cartItems?.length || 0

  return (
    <CartContext.Provider
      value={{
        cart,
        itemsCount,
        loading,
        addToCart,
        addItem, // 👈 ضفنا الـ function الجديدة
        updateQuantity,
        removeItem,
        clearCart,
        applyCoupon,
        refreshCart,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error('useCart must be used within CartProvider')
  }
  return context
}
