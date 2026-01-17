'use client'

import { toast as sonnerToast } from 'sonner'
import { ShoppingCart, Heart, AlertCircle, CheckCircle2, XCircle, LogIn, Package } from 'lucide-react'

interface ToastProduct {
  title: string
  image?: string
  price?: number
  quantity?: number
}

export const toast = {
  // ✅ نجاح إضافة للسلة
  addToCart: (product: ToastProduct, language: 'ar' | 'en' = 'ar') => {
    sonnerToast.success(
      language === 'ar' ? '✨ تمت الإضافة للسلة بنجاح!' : '✨ Added to cart successfully!',
      {
        description: (
          <div className="flex items-center gap-3 mt-2">
            {product.image && (
              <div className="relative w-14 h-14 rounded-xl overflow-hidden border-2 border-green-500/20 shadow-lg flex-shrink-0">
                <img 
                  src={product.image} 
                  alt={product.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            <div className="flex-1 min-w-0">
              <p className="font-bold text-sm line-clamp-2 leading-tight mb-1">{product.title}</p>
              {product.quantity && (
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  <Package className="w-3 h-3" />
                  {language === 'ar' ? `الكمية: ${product.quantity}` : `Qty: ${product.quantity}`}
                </p>
              )}
            </div>
          </div>
        ),
        duration: 4500,
        className: 'toast-success',
        icon: <ShoppingCart className="h-5 w-5 text-green-600" />,
      }
    )
  },

  // 💖 إضافة للمفضلة
  addToWishlist: (productName: string, language: 'ar' | 'en' = 'ar') => {
    sonnerToast.success(
      language === 'ar' ? '💖 تمت الإضافة للمفضلة' : '💖 Added to wishlist',
      {
        description: (
          <div className="mt-1">
            <p className="text-sm font-medium line-clamp-2">{productName}</p>
            <p className="text-xs text-muted-foreground mt-1">
              {language === 'ar' ? 'يمكنك مراجعة قائمة المفضلة من حسابك' : 'Check your wishlist from your account'}
            </p>
          </div>
        ),
        duration: 3500,
        className: 'toast-success',
        icon: <Heart className="h-5 w-5 text-red-500 fill-red-500" />,
      }
    )
  },

  // 💔 إزالة من المفضلة
  removeFromWishlist: (productName: string, language: 'ar' | 'en' = 'ar') => {
    sonnerToast.info(
      language === 'ar' ? '💔 تمت الإزالة من المفضلة' : '💔 Removed from wishlist',
      {
        description: (
          <p className="text-sm mt-1 line-clamp-2">{productName}</p>
        ),
        duration: 3000,
        icon: <Heart className="h-5 w-5 text-muted-foreground" />,
      }
    )
  },

  // 🔒 تطلب تسجيل دخول
  requireAuth: (language: 'ar' | 'en' = 'ar', redirectUrl?: string, onLogin?: () => void) => {
    sonnerToast.warning(
      language === 'ar' ? '🔐 تسجيل الدخول مطلوب' : '🔐 Login Required',
      {
        description: (
          <div className="space-y-2 mt-2">
            <p className="text-sm font-medium leading-relaxed">
              {language === 'ar' 
                ? 'يجب عليك تسجيل الدخول أولاً للمتابعة والاستمتاع بجميع المزايا المتاحة' 
                : 'Please login first to continue and enjoy all available features'
              }
            </p>
            <div className="flex items-center gap-2 text-xs text-muted-foreground pt-1">
              <div className="w-1 h-1 rounded-full bg-amber-500"></div>
              <span>{language === 'ar' ? 'التسجيل سريع وآمن' : 'Fast and secure registration'}</span>
            </div>
          </div>
        ),
        duration: 7000,
        action: {
          label: (
            <span className="flex items-center gap-2 font-bold text-sm px-3 py-1.5">
              <LogIn className="h-4 w-4" />
              {language === 'ar' ? 'تسجيل الدخول' : 'Login'}
            </span>
          ),
          onClick: onLogin || (() => {}),
        },
        className: 'toast-warning',
        icon: <AlertCircle className="h-5 w-5 text-amber-600" />,
      }
    )
  },

  // ✅ عملية ناجحة عامة
  success: (title: string, description?: string) => {
    sonnerToast.success(title, {
      description: description ? <p className="text-sm mt-1">{description}</p> : undefined,
      duration: 3500,
      icon: <CheckCircle2 className="h-5 w-5 text-green-600" />,
    })
  },

  // ❌ خطأ
  error: (title: string, description?: string) => {
    sonnerToast.error(title, {
      description: description ? <p className="text-sm mt-1">{description}</p> : undefined,
      duration: 5000,
      icon: <XCircle className="h-5 w-5 text-red-600" />,
    })
  },

  // ⚠️ تحذير
  warning: (title: string, description?: string) => {
    sonnerToast.warning(title, {
      description: description ? <p className="text-sm mt-1">{description}</p> : undefined,
      duration: 4500,
      icon: <AlertCircle className="h-5 w-5 text-amber-600" />,
    })
  },

  // 🛍️ شراء فوري
  buyNow: (language: 'ar' | 'en' = 'ar') => {
    sonnerToast.success(
      language === 'ar' ? '✅ جاري تحويلك لإتمام الطلب...' : '✅ Redirecting to checkout...',
      {
        description: language === 'ar' ? 'سيتم فتح صفحة الدفع الآن' : 'Opening checkout page now',
        duration: 2500,
        icon: <ShoppingCart className="h-5 w-5 text-green-600" />,
      }
    )
  },
}