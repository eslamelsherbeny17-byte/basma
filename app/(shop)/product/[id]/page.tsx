'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Star, Heart, Share2, Truck, RefreshCw, ShieldCheck, Loader2 } from 'lucide-react'
import { productsAPI } from '@/lib/api'
import { ProductGallery } from '@/components/products/ProductGallery'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { formatPrice, calculateDiscount, cn } from '@/lib/utils'
import { AddToCartSection } from '@/components/products/AddToCartSection'
import { ProductReviews } from '@/components/products/ProductReviews'
import { useLanguage } from '@/contexts/LanguageContext'
import { useAuth } from '@/contexts/AuthContext'
import { useWishlist } from '@/contexts/WishlistContext'
import { toast } from 'sonner'
import type { Product, Review } from '@/lib/types'

export default function ProductPage() {
  const { id } = useParams()
  const router = useRouter()
  const { t, isRTL } = useLanguage()
  const { isAuthenticated } = useAuth()
  const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlist()
  
  const [product, setProduct] = useState<Product | null>(null)
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)

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

  // وظيفة التحقق من الدخول قبل أي إجراء
  const handleProtectedAction = (action: () => void) => {
    if (!isAuthenticated) {
      toast.error(t('pleaseLogin'), {
        action: {
          label: t('login'),
          onClick: () => router.push(`/login?redirect=/product/${id}`)
        }
      })
      return
    }
    action()
  }

  if (loading) return <div className='h-screen flex items-center justify-center'><Loader2 className='animate-spin text-primary' /></div>
  if (!product) return null

  return (
    <main className="min-h-screen bg-background" dir={isRTL ? 'rtl' : 'ltr'}>
      {/* القسم العلوي: الصور والمعلومات الأساسية */}
      <section className="container mx-auto px-4 py-6 lg:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 xl:gap-16">
          
          {/* المعرض - يأخذ 7 أعمدة في الشاشات الكبيرة */}
          <div className="lg:col-span-7">
            <ProductGallery images={[product.imageCover, ...(product.images || [])]} title={product.title} />
          </div>

          {/* المعلومات - تأخذ 5 أعمدة وتكون مثبتة عند التمرير في الديسكتوب */}
          <div className="lg:col-span-5 lg:sticky lg:top-28 h-fit space-y-8">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Badge className="bg-primary/10 text-primary border-none rounded-full px-4 py-1">
                  {product.category?.name}
                </Badge>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="rounded-full"
                  onClick={() => handleProtectedAction(() => {
                    isInWishlist(product._id) ? removeFromWishlist(product._id) : addToWishlist(product._id)
                  })}
                >
                  <Heart className={cn("h-6 w-6", isInWishlist(product._id) && "fill-destructive text-destructive")} />
                </Button>
              </div>

              <h1 className="text-3xl md:text-5xl font-black text-foreground leading-tight tracking-tight">
                {product.title}
              </h1>

              <div className="flex items-center gap-4">
                <div className="flex gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className={cn("h-5 w-5", i < Math.floor(product.ratingsAverage || 0) ? "fill-yellow-400 text-yellow-400" : "text-muted/20")} />
                  ))}
                </div>
                <span className="text-sm font-bold text-muted-foreground underline">
                  {product.ratingsQuantity} {t('reviews')}
                </span>
              </div>

              <div className="flex items-baseline gap-4 pt-2">
                <span className="text-4xl font-black text-primary">
                  {formatPrice(product.priceAfterDiscount || product.price)}
                </span>
                {product.priceAfterDiscount && (
                  <span className="text-xl text-muted-foreground line-through decoration-destructive/50">
                    {formatPrice(product.price)}
                  </span>
                )}
              </div>
            </div>

            <Separator className="bg-border/50" />

            {/* عرض الألوان والمقاسات والإضافة للسلة */}
            <AddToCartSection 
              product={product} 
              onAuthCheck={(callback) => handleProtectedAction(callback)} 
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-6 border-y border-border/50">
              <div className="flex items-center gap-3">
                <Truck className="h-6 w-6 text-primary" />
                <span className="text-xs font-bold">{t('freeShipping')}</span>
              </div>
              <div className="flex items-center gap-3">
                <RefreshCw className="h-6 w-6 text-primary" />
                <span className="text-xs font-bold">{t('easyReturns')}</span>
              </div>
            </div>

            <p className="text-muted-foreground text-base leading-relaxed">
              {product.description}
            </p>
          </div>
        </div>
      </section>

      {/* التقييمات */}
      <section className="bg-muted/30 py-16 mt-10">
        <div className="container mx-auto px-4">
           <ProductReviews 
              reviews={reviews} 
              productId={product._id} 
              onAuthCheck={(callback) => handleProtectedAction(callback)} 
            />
        </div>
      </section>

      {/* شريط الشراء السريع للموبايل فقط */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 p-4 bg-background/80 backdrop-blur-lg border-t border-border z-50 flex items-center gap-4">
          <div className="flex-1">
             <p className="text-xs text-muted-foreground font-bold">السعر</p>
             <p className="text-lg font-black text-primary">{formatPrice(product.priceAfterDiscount || product.price)}</p>
          </div>
          <Button 
            className="gold-gradient h-12 px-8 rounded-xl font-bold flex-1"
            onClick={() => handleProtectedAction(() => {})} // سيقوم AddToCartSection بالباقي
          >
            {t('buyNow')}
          </Button>
      </div>
    </main>
  )
}