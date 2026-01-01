'use client'

import { useEffect, useState } from 'react'
import { ProductCard } from '@/components/products/ProductCard'
import { Button } from '@/components/ui/button'
import { ChevronLeft, Zap, Loader2 } from 'lucide-react'
import Link from 'next/link'
import { productsAPI } from '@/lib/api'
import type { Product } from '@/lib/types'

export function FlashSale() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await productsAPI.getAll({
          limit: 4,
          sort: '-priceAfterDiscount',
        })

        // ✅ تم إصلاح الخطأ هنا بإضافة فحص التأكد من وجود القيمة (p.priceAfterDiscount)
        const discounted = (response.data || []).filter(
          (p) =>
            p.priceAfterDiscount !== undefined && p.priceAfterDiscount < p.price
        )

        setProducts(
          discounted.length > 0 ? discounted : response.data?.slice(0, 4) || []
        )
      } catch (error) {
        console.error('Flash sale error:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchProducts()
  }, [])

  if (loading)
    return (
      <section className='py-16 bg-secondary/30'>
        <Loader2 className='mx-auto animate-spin text-primary' />
      </section>
    )
  if (products.length === 0) return null

  return (
    <section className='pt-16 pb-10 bg-secondary/30'>
      <div className='container mx-auto px-4'>
        <div className='text-center mb-12'>
          <div className='inline-flex items-center gap-2 px-4 py-2 bg-orange-500/10 rounded-full mb-4'>
            <Zap className='h-5 w-5 text-orange-500 fill-current' />
            <span className='text-orange-600 dark:text-orange-400 font-semibold'>
              عروض حصرية
            </span>
          </div>
          <h2 className='text-3xl md:text-4xl font-bold mb-4'>
            تخفيضات لا تفوت 🔥
          </h2>
          <p className='text-muted-foreground max-w-2xl mx-auto'>
            أفضل جودة بأقل سعر
          </p>
        </div>

        <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 mb-8'>
          {products.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>

        <div className='text-center'>
          <Link href='/shop?discount=true'>
            <Button
              variant='outline'
              size='lg'
              className='hover:bg-orange-500 hover:text-white border-orange-200'
            >
              استكشف جميع العروض
              <ChevronLeft className='mr-2 h-4 w-4' />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}
