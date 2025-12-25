'use client'

import { useEffect, useState } from 'react'
import { useParams, notFound } from 'next/navigation'
import {
  Star,
  Heart,
  Share2,
  Truck,
  RefreshCw,
  ShieldCheck,
  Loader2,
} from 'lucide-react'
import { productsAPI } from '@/lib/api'
import { ProductGallery } from '@/components/products/ProductGallery'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { formatPrice, calculateDiscount, cn } from '@/lib/utils'
import { AddToCartSection } from '@/components/products/AddToCartSection'
import { ProductReviews } from '@/components/products/ProductReviews'
import { useLanguage } from '@/contexts/LanguageContext'
import type { Product, Review } from '@/lib/types'

export default function ProductPage() {
  const { id } = useParams()
  const { t } = useLanguage()
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
        if (!prodRes) return notFound()
        setProduct(prodRes)
        setReviews(revRes)
      } catch (error) {
        console.error('Error fetching product:', error)
      } finally {
        setLoading(false)
      }
    }
    if (id) fetchData()
  }, [id])

  if (loading)
    return (
      <div className='flex h-screen items-center justify-center bg-background'>
        <Loader2 className='h-10 w-10 animate-spin text-primary' />
      </div>
    )

  if (!product) return notFound()

  const discount = calculateDiscount(product.price, product.priceAfterDiscount)
  const finalPrice = product.priceAfterDiscount || product.price
  const galleryImages = product.images?.length
    ? [product.imageCover, ...product.images]
    : [product.imageCover || '/placeholder.jpg']

  return (
    <main
      className='min-h-screen bg-background py-8 transition-colors duration-300'
      dir='rtl'
    >
      <div className='container mx-auto px-4'>
        {/* Breadcrumb */}
        <div className='mb-6 text-sm text-muted-foreground'>
          <span>{t('home')}</span>
          <span className='mx-2'>/</span>
          <span>{t('shop')}</span>
          <span className='mx-2'>/</span>
          <span className='text-foreground font-bold'>{product.title}</span>
        </div>

        {/* Product Section - تم التغيير لـ bg-card لدعم Dark Mode */}
        <div className='grid md:grid-cols-2 gap-8 lg:gap-12 bg-card text-card-foreground p-6 md:p-8 rounded-xl shadow-sm border border-border'>
          <ProductGallery images={galleryImages} title={product.title} />

          <div className='space-y-6'>
            <div className='flex items-center gap-2'>
              {product.category && (
                <Badge variant='secondary'>{product.category.name}</Badge>
              )}
              {product.brand && (
                <Badge variant='outline'>{product.brand.name}</Badge>
              )}
            </div>

            <h1 className='text-3xl md:text-4xl font-bold text-foreground'>
              {product.title}
            </h1>

            <div className='flex items-center gap-3'>
              <div className='flex items-center gap-1'>
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={cn(
                      'h-5 w-5',
                      i < Math.floor(product.ratingsAverage || 0)
                        ? 'fill-primary text-primary'
                        : 'text-muted/30'
                    )}
                  />
                ))}
              </div>
              <span className='text-sm text-muted-foreground'>
                ({product.ratingsQuantity || 0} {t('reviews')})
              </span>
            </div>

            <div className='flex items-baseline gap-3'>
              <span className='text-4xl font-bold text-primary'>
                {formatPrice(finalPrice)}
              </span>
              {product.priceAfterDiscount && (
                <>
                  <span className='text-2xl text-muted-foreground line-through'>
                    {formatPrice(product.price)}
                  </span>
                  <Badge className='bg-red-500 text-white'>
                    {t('discount')} {discount}%
                  </Badge>
                </>
              )}
            </div>

            <Separator className='bg-border' />

            <div>
              <h3 className='font-bold mb-2 text-foreground'>
                {t('description')}
              </h3>
              <p className='text-muted-foreground leading-relaxed'>
                {product.description}
              </p>
            </div>

            <AddToCartSection product={product} />

            <div className='flex gap-2'>
              <Button
                variant='outline'
                className='flex-1 border-border'
                size='lg'
              >
                <Heart className='ml-2 h-5 w-5' /> {t('addToWishlist')}
              </Button>
              <Button
                variant='outline'
                size='icon'
                className='h-11 w-11 border-border'
              >
                <Share2 className='h-5 w-5' />
              </Button>
            </div>

            <Separator className='bg-border' />

            <div className='space-y-3 text-muted-foreground'>
              <div className='flex items-center gap-3 text-sm'>
                <Truck className='h-5 w-5 text-primary' />{' '}
                <span>{t('freeShipping')}</span>
              </div>
              <div className='flex items-center gap-3 text-sm'>
                <RefreshCw className='h-5 w-5 text-primary' />{' '}
                <span>{t('easyReturns')}</span>
              </div>
              <div className='flex items-center gap-3 text-sm'>
                <ShieldCheck className='h-5 w-5 text-primary' />{' '}
                <span>{t('qualityProducts')}</span>
              </div>
            </div>
          </div>
        </div>

        <ProductReviews reviews={reviews} productId={product._id} />
      </div>
    </main>
  )
}
