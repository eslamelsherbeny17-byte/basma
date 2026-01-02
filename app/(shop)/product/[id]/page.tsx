'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Heart, Truck, RefreshCw, Loader2 } from 'lucide-react'
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
import { useCart } from '@/contexts/CartContext'
import { toast } from 'sonner'
import type { Product, Review } from '@/lib/types'

export default function ProductPage() {
  const { id } = useParams()
  const router = useRouter()
  const { t, isRTL } = useLanguage()
  const { isAuthenticated } = useAuth()
  const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlist()
  const { addToCart } = useCart()
  
  const [product, setProduct] = useState<Product | null>(null)
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)
  const [isBuying, setIsBuying] = useState(false)

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

  // دالة الشراء الفوري - تطلب تسجيل الدخول فقط عند الضغط
  const handleBuyNow = async () => {
    if (!product) return
    
    handleProtectedAction(async () => {
      try {
        setIsBuying(true)
        await addToCart(product._id)
        toast.success(isRTL ? 'تمت الإضافة.. جاري الانتقال للدفع' : 'Added! Redirecting to checkout...')
        router.push('/checkout')
      } catch (error) {
        toast.error(isRTL ? 'حدث خطأ أثناء الطلب' : 'Error during purchase')
      } finally {
        setIsBuying(false)
      }
    })
  }

  // هذه الدالة هي "الحارس" الذي يظهر رسالة تسجيل الدخول فقط عند الضغط على إجراء محمي
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
    <main className="min-h-screen bg-background pb-24 lg:pb-12" dir={isRTL ? 'rtl' : 'ltr'}>
      <section className="container mx-auto px-4 py-8 lg:py-12">
        {/* تم تعديل التوزيع ليكون 6:6 لضمان عدم ضخامة الصورة في الكمبيوتر */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 xl:gap-20 items-start">
          
          <div className="lg:col-span-6 xl:col-span-6 lg:sticky lg:top-28">
            <ProductGallery 
              images={[product.imageCover, ...(product.images || [])]} 
              title={product.title} 
            />
          </div>

          <div className="lg:col-span-6 xl:col-span-6 space-y-8">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <Badge className="bg-primary/10 text-primary border-none rounded-full px-5 py-1.5 font-bold">
                  {product.category?.name}
                </Badge>
                <Button 
                  variant="outline" size="icon" className="rounded-full shadow-sm hover:bg-destructive/5"
                  onClick={() => handleProtectedAction(() => {
                    isInWishlist(product._id) ? removeFromWishlist(product._id) : addToWishlist(product._id)
                  })}
                >
                  <Heart className={cn("h-6 w-6 transition-all", isInWishlist(product._id) && "fill-destructive text-destructive scale-110")} />
                </Button>
              </div>

              <h1 className="text-3xl md:text-4xl xl:text-5xl font-black text-foreground leading-[1.1]">
                {product.title}
              </h1>

              <div className="flex items-baseline gap-4">
                <span className="text-4xl md:text-5xl font-black text-primary tracking-tighter">
                  {formatPrice(product.priceAfterDiscount || product.price)}
                </span>
                {product.priceAfterDiscount && (
                  <span className="text-xl md:text-2xl text-muted-foreground line-through decoration-destructive/30">
                    {formatPrice(product.price)}
                  </span>
                )}
              </div>
            </div>

            <Separator className="bg-border/50" />

            <div className="bg-muted/10 p-6 rounded-[2rem] border border-border/40">
                <AddToCartSection 
                  product={product} 
                  onAuthCheck={(callback) => handleProtectedAction(callback)} 
                />
            </div>

            <Button 
              onClick={handleBuyNow}
              disabled={isBuying}
              variant="outline"
              className="w-full h-14 rounded-2xl font-black text-lg border-2 border-primary text-primary hover:bg-primary hover:text-white transition-all shadow-md"
            >
              {isBuying ? <Loader2 className="animate-spin h-5 w-5" /> : t('buyNow')}
            </Button>

            <div className="grid grid-cols-2 gap-4 py-6 border-y border-border/50">
              <div className="flex flex-col items-center gap-2 text-center p-3 rounded-2xl bg-muted/5">
                <Truck className="h-6 w-6 text-primary" />
                <span className="text-[10px] font-black uppercase tracking-tighter">{t('freeShipping')}</span>
              </div>
              <div className="flex flex-col items-center gap-2 text-center p-3 rounded-2xl bg-muted/5">
                <RefreshCw className="h-6 w-6 text-primary" />
                <span className="text-[10px] font-black uppercase tracking-tighter">{t('easyReturns')}</span>
              </div>
            </div>

            <div className="space-y-4 pt-2">
               <h4 className="font-black text-lg">وصف المنتج</h4>
               <p className="text-muted-foreground text-base leading-relaxed text-justify">
                  {product.description}
               </p>
            </div>
          </div>
        </div>
      </section>

      {/* قسم المراجعات - نمرر له الدالة لتعمل فقط عند محاولة إضافة تقييم */}
      <section className="container mx-auto px-4 py-12">
        <ProductReviews 
          productId={product._id} 
          reviews={reviews} 
          onAuthCheck={(callback) => handleProtectedAction(callback)} 
        />
      </section>

      {/* شراء سريع للموبايل */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 p-5 bg-background/80 backdrop-blur-2xl border-t border-border/50 z-50 flex items-center gap-5">
          <div className="flex flex-col">
             <span className="text-[10px] text-muted-foreground font-black mb-1">إجمالي السعر</span>
             <span className="text-2xl font-black text-primary leading-none tracking-tighter">
                {formatPrice(product.priceAfterDiscount || product.price)}
             </span>
          </div>
          <Button 
            className="gold-gradient h-14 px-8 rounded-2xl font-black flex-1 shadow-lg shadow-primary/20"
            onClick={handleBuyNow}
            disabled={isBuying}
          >
            {isBuying ? <Loader2 className="animate-spin h-5 w-5" /> : t('buyNow')}
          </Button>
      </div>
    </main>
  )
}