'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Star, Heart, Truck, RefreshCw, Loader2 } from 'lucide-react'
import { productsAPI } from '@/lib/api'
import { ProductGallery } from '@/components/products/ProductGallery'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { formatPrice, cn } from '@/lib/utils'
import { AddToCartSection } from '@/components/products/AddToCartSection'
import { ProductReviews } from '@/components/products/ProductReviews'
import { useLanguage } from '@/contexts/LanguageContext'
import { useAuth } from '@/contexts/AuthContext'
import { useWishlist } from '@/contexts/WishlistContext'
import { useCart } from '@/contexts/CartContext' // ✅ استيراد سياق السلة
import { toast } from 'sonner'
import type { Product, Review } from '@/lib/types'

export default function ProductPage() {
  const { id } = useParams()
  const router = useRouter()
  const { t, isRTL } = useLanguage()
  const { isAuthenticated } = useAuth()
  const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlist()
  const { addToCart } = useCart() // ✅ دالة إضافة للمنتج للسلة
  
  const [product, setProduct] = useState<Product | null>(null)
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)
  const [isBuying, setIsBuying] = useState(false) // ✅ حالة تحميل لزر الشراء

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [prodRes, revRes] = await Promise.all([
          productsAPI.getById(id as string),
          productsAPI.getReviews(id as string).catch(() => []),
        ])
        setProduct(prodRes)
        setReviews(revRes)
      } catch (error) {
        console.error(error)
      } finally {
        setLoading(false)
      }
    }
    if (id) fetchData()
  }, [id])

  // ✅ دالة "اشتري الآن" الجديدة
  const handleBuyNow = async () => {
    if (!product) return

    // 1. التحقق من تسجيل الدخول أولاً
    if (!isAuthenticated) {
      toast.error(t('pleaseLogin'), {
        action: { 
          label: t('login'), 
          onClick: () => router.push(`/login?redirect=/product/${id}`) 
        }
      })
      return
    }

    try {
      setIsBuying(true)
      // 2. إضافة المنتج للسلة (يمكنك إضافة اللون/المقاس هنا إذا كان مختاراً)
      await addToCart(product._id)
      
      // 3. التوجيه فوراً لصفحة إتمام الطلب
      toast.success(isRTL ? 'تمت الإضافة.. جاري الانتقال للدفع' : 'Added! Redirecting to checkout...')
      router.push('/checkout')
    } catch (error) {
      toast.error(isRTL ? 'حدث خطأ أثناء الطلب' : 'Error during purchase')
    } finally {
      setIsBuying(false)
    }
  }

  const handleProtectedAction = (action: () => void) => {
    if (!isAuthenticated) {
      toast.error(t('pleaseLogin'), {
        action: { label: t('login'), onClick: () => router.push(`/login?redirect=/product/${id}`) }
      })
      return
    }
    action()
  }

  if (loading) return <div className='h-screen flex items-center justify-center'><Loader2 className='animate-spin text-primary h-10 w-10' /></div>
  if (!product) return null

  return (
    <main className="min-h-screen bg-background" dir={isRTL ? 'rtl' : 'ltr'}>
      <section className="container mx-auto px-4 py-8 lg:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 xl:gap-24 items-start">
          
          <div className="lg:col-span-8">
            <ProductGallery images={[product.imageCover, ...(product.images || [])]} title={product.title} />
          </div>

          <div className="lg:col-span-4 lg:sticky lg:top-32 space-y-8">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <Badge className="bg-primary/10 text-primary border-none rounded-full px-5 py-1.5 font-bold">
                  {product.category?.name}
                </Badge>
                <Button 
                  variant="ghost" size="icon" className="rounded-full"
                  onClick={() => handleProtectedAction(() => {
                    isInWishlist(product._id) ? removeFromWishlist(product._id) : addToWishlist(product._id)
                  })}
                >
                  <Heart className={cn("h-7 w-7", isInWishlist(product._id) && "fill-destructive text-destructive")} />
                </Button>
              </div>

              <h1 className="text-3xl md:text-5xl font-black text-foreground leading-tight tracking-tight">
                {product.title}
              </h1>

              <div className="flex items-baseline gap-4 pt-2">
                <span className="text-5xl font-black text-primary tracking-tighter">
                  {formatPrice(product.priceAfterDiscount || product.price)}
                </span>
                {product.priceAfterDiscount && (
                  <span className="text-2xl text-muted-foreground line-through decoration-destructive/40">
                    {formatPrice(product.price)}
                  </span>
                )}
              </div>
            </div>

            <Separator className="bg-border/50" />

            {/* سكشن الإضافة للسلة التقليدي */}
            <AddToCartSection 
              product={product} 
              onAuthCheck={(callback) => handleProtectedAction(callback)} 
            />

            {/* ✅ زر "اشتري الآن" داخل الصفحة (ديسكتوب) */}
            <Button 
              onClick={handleBuyNow}
              disabled={isBuying}
              variant="outline"
              className="w-full h-14 rounded-2xl font-black text-lg border-2 border-primary text-primary hover:bg-primary hover:text-white transition-all shadow-sm"
            >
              {isBuying ? <Loader2 className="animate-spin h-5 w-5" /> : t('buyNow')}
            </Button>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 py-8 border-y border-border/50">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-primary/5 rounded-2xl"><Truck className="h-6 w-6 text-primary" /></div>
                <span className="text-xs font-black leading-tight">{t('freeShipping')}</span>
              </div>
              <div className="flex items-center gap-4">
                <div className="p-3 bg-primary/5 rounded-2xl"><RefreshCw className="h-6 w-6 text-primary" /></div>
                <span className="text-xs font-black leading-tight">{t('easyReturns')}</span>
              </div>
            </div>

            <div className="space-y-4">
               <h4 className="font-bold text-lg">وصف المنتج</h4>
               <p className="text-muted-foreground text-base leading-relaxed">{product.description}</p>
            </div>
          </div>
        </div>
      </section>

      {/* شراء سريع للموبايل - تم تفعيله الآن ✅ */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 p-5 bg-background/90 backdrop-blur-xl border-t border-border z-50 flex items-center gap-5">
          <div className="flex-1">
             <p className="text-[10px] text-muted-foreground font-black mb-1">السعر</p>
             <p className="text-2xl font-black text-primary leading-none">{formatPrice(product.priceAfterDiscount || product.price)}</p>
          </div>
          <Button 
            className="gold-gradient h-14 px-10 rounded-2xl font-black flex-1 shadow-lg"
            onClick={handleBuyNow} // ✅ استدعاء دالة الشراء الفوري
            disabled={isBuying}
          >
            {isBuying ? <Loader2 className="animate-spin h-5 w-5" /> : t('buyNow')}
          </Button>
      </div>
    </main>
  )
}
