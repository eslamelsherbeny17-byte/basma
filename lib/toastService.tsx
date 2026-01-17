'use client'

import { toast } from 'sonner'
import { ShoppingCart, Heart, Lock } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface ToastOptions {
  title?: string
  description?: string
  actionLabel?: string
  action?: () => void
  duration?: number
}

export const useToastService = () => {
  const router = useRouter()

  const showCartToast = (options?: ToastOptions) => {
    toast.success(
      options?.title || '🛒 تمت الإضافة للسلة!',
      {
        description: options?.description || 'يمكنك متابعة التسوق أو الذهاب للسلة لإتمام الطلب.',
        action: options?.actionLabel ? { label: options.actionLabel, onClick: options.action! } : undefined,
        icon: <ShoppingCart className="h-5 w-5" />,
        duration: options?.duration || 5000,
      }
    )
  }

  const showWishlistToast = (options?: ToastOptions) => {
    toast.success(
      options?.title || '💖 تمت الإضافة للمفضلة!',
      {
        description: options?.description || 'يمكنك إدارة المفضلة الخاصة بك من هنا.',
        action: options?.actionLabel ? { label: options.actionLabel, onClick: options.action! } : undefined,
        icon: <Heart className="h-5 w-5" />,
        duration: options?.duration || 5000,
      }
    )
  }

  const showAuthToast = (options?: ToastOptions) => {
    toast.error(
      options?.title || '🔒 يجب تسجيل الدخول أولاً',
      {
        description: options?.description || 'سجل دخولك للاستمتاع بجميع المزايا.',
        action: options?.actionLabel ? { label: options.actionLabel, onClick: options.action! } : undefined,
        icon: <Lock className="h-5 w-5" />,
        duration: options?.duration || 6000,
      }
    )
  }

  return { showCartToast, showWishlistToast, showAuthToast }
}
