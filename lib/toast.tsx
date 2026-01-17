"use client"

import { toast as sonnerToast } from "sonner"
import {
  ShoppingCart,
  Heart,
  AlertCircle,
  CheckCircle2,
  XCircle,
  LogIn,
  Package,
  Info,
  Sparkles,
} from "lucide-react"

interface ToastProduct {
  title: string
  image?: string
  price?: number
  quantity?: number
}

export const toast = {
  addToCart: (product: ToastProduct, language: "ar" | "en" = "ar") => {
    sonnerToast.success(
      language === "ar" ? "تمت الإضافة للسلة بنجاح!" : "Added to cart successfully!",
      {
        description: (
          <div className="flex items-center gap-3 mt-2">
            {product.image && (
              <div className="relative w-16 h-16 rounded-2xl overflow-hidden border-2 border-emerald-500/20 shadow-lg flex-shrink-0 ring-2 ring-emerald-500/10">
                <img
                  src={product.image}
                  alt={product.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            <div className="flex-1 min-w-0">
              <p className="font-bold text-sm line-clamp-2 leading-tight mb-1.5 text-foreground">
                {product.title}
              </p>
              {product.quantity && (
                <p className="text-xs text-muted-foreground flex items-center gap-1.5 font-medium">
                  <Package className="w-3.5 h-3.5" />
                  {language === "ar" ? `الكمية: ${product.quantity}` : `Qty: ${product.quantity}`}
                </p>
              )}
            </div>
          </div>
        ),
        duration: 4000,
        className: "toast-success",
        icon: <ShoppingCart className="h-5 w-5" />,
      }
    )
  },

  addToWishlist: (productName: string, language: "ar" | "en" = "ar") => {
    sonnerToast.success(
      language === "ar" ? "تمت الإضافة للمفضلة" : "Added to wishlist",
      {
        description: (
          <div className="mt-1.5 space-y-1">
            <p className="text-sm font-semibold line-clamp-2">{productName}</p>
            <p className="text-xs text-muted-foreground/80 font-medium">
              {language === "ar"
                ? "يمكنك مراجعة قائمة المفضلة من حسابك"
                : "Check your wishlist from your account"}
            </p>
          </div>
        ),
        duration: 3500,
        className: "toast-success",
        icon: <Heart className="h-5 w-5 fill-current" />,
      }
    )
  },

  removeFromWishlist: (productName: string, language: "ar" | "en" = "ar") => {
    sonnerToast.info(
      language === "ar" ? "تمت الإزالة من المفضلة" : "Removed from wishlist",
      {
        description: <p className="text-sm mt-1.5 line-clamp-2 font-medium">{productName}</p>,
        duration: 3000,
        className: "toast-info",
        icon: <Heart className="h-5 w-5" />,
      }
    )
  },

  requireAuth: (language: "ar" | "en" = "ar", onLogin?: () => void) => {
    sonnerToast.warning(
      language === "ar" ? "تسجيل الدخول مطلوب" : "Login Required",
      {
        description: (
          <div className="space-y-2.5 mt-2">
            <p className="text-sm font-semibold leading-relaxed">
              {language === "ar"
                ? "يجب عليك تسجيل الدخول أولاً للمتابعة والاستمتاع بجميع المزايا"
                : "Please login first to continue and enjoy all features"}
            </p>
            <div className="flex items-center gap-2 text-xs text-muted-foreground/70 font-medium">
              <Sparkles className="h-3.5 w-3.5" />
              <span>{language === "ar" ? "التسجيل سريع وآمن" : "Fast and secure"}</span>
            </div>
          </div>
        ),
        duration: 5000,
        className: "toast-warning",
        action: {
          label: (
            <span className="flex items-center gap-2 font-bold text-sm px-4 py-2">
              <LogIn className="h-4 w-4" />
              {language === "ar" ? "تسجيل الدخول" : "Login"}
            </span>
          ),
          onClick: onLogin || (() => {}),
        },
        icon: <AlertCircle className="h-5 w-5" />,
      }
    )
  },

  success: (title: string, description?: string) => {
    sonnerToast.success(title, {
      description: description ? (
        <p className="text-sm mt-1.5 font-medium leading-relaxed">{description}</p>
      ) : undefined,
      duration: 3500,
      className: "toast-success",
      icon: <CheckCircle2 className="h-5 w-5" />,
    })
  },

  error: (title: string, description?: string) => {
    sonnerToast.error(title, {
      description: description ? (
        <p className="text-sm mt-1.5 font-medium leading-relaxed">{description}</p>
      ) : undefined,
      duration: 4500,
      className: "toast-error",
      icon: <XCircle className="h-5 w-5" />,
    })
  },

  warning: (title: string, description?: string) => {
    sonnerToast.warning(title, {
      description: description ? (
        <p className="text-sm mt-1.5 font-medium leading-relaxed">{description}</p>
      ) : undefined,
      duration: 4000,
      className: "toast-warning",
      icon: <AlertCircle className="h-5 w-5" />,
    })
  },

  info: (title: string, description?: string) => {
    sonnerToast.info(title, {
      description: description ? (
        <p className="text-sm mt-1.5 font-medium leading-relaxed">{description}</p>
      ) : undefined,
      duration: 3500,
      className: "toast-info",
      icon: <Info className="h-5 w-5" />,
    })
  },

  buyNow: (language: "ar" | "en" = "ar") => {
    sonnerToast.success(
      language === "ar" ? "جاري تحويلك لإتمام الطلب..." : "Redirecting to checkout...",
      {
        description: language === "ar" ? "سيتم فتح صفحة الدفع الآن" : "Opening checkout page now",
        duration: 3000,
        className: "toast-success",
        icon: <ShoppingCart className="h-5 w-5" />,
      }
    )
  },
}