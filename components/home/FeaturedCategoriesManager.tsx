'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ArrowRight, Sparkles, Loader2 } from 'lucide-react'
import { motion } from 'framer-motion'
import { productsAPI, categoriesAPI } from '@/lib/api'
import { ProductCard } from '@/components/products/ProductCard'
import { Button } from '@/components/ui/button'
import { useLanguage } from '@/contexts/LanguageContext'
import { cn } from '@/lib/utils'
import type { Product, Category } from '@/lib/types'

// مكون داخلي صغير لعرض كل قسم على حدة (لتقليل تكرار الكود)
function SingleCategorySection({ category, index }: { category: Category; index: number }) {
  const { language, isRTL } = useLanguage()
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await productsAPI.getAll({
          category: category._id,
          limit: 4,
          sort: '-createdAt',
        })
        setProducts(response.data || [])
      } catch (error) {
        console.error('Error fetching products:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchProducts()
  }, [category._id])

  if (loading || products.length === 0) return null

  return (
    <section className="py-12 sm:py-20 border-b border-border/40 last:border-0 bg-background">
      <div className="container mx-auto px-4">
        {/* الرأس (Header) */}
        <div className="flex flex-col items-center text-center mb-10 sm:mb-16">
          <div className="flex items-center gap-2 bg-primary/10 text-primary px-4 py-1.5 rounded-full mb-4 shadow-sm">
            <Sparkles className="w-4 h-4" />
            <span className="text-[10px] sm:text-xs font-black uppercase tracking-widest">
              {index === 0 ? (language === 'ar' ? 'الأكثر طلباً' : 'Bestsellers') : (language === 'ar' ? 'تشكيلة مختارة' : 'Curated Selection')}
            </span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-black text-foreground mb-3 tracking-tight">
            {category.name}
          </h2>
          <div className="h-1 w-16 bg-primary rounded-full" />
        </div>

        {/* شبكة المنتجات (تستخدم ProductCard الخاص بك) */}
        <div className="flex overflow-x-auto lg:grid lg:grid-cols-4 gap-4 sm:gap-6 pb-8 sm:pb-0 scrollbar-hide snap-x">
          {products.map((product) => (
            <motion.div
              key={product._id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="min-w-[260px] sm:min-w-0 snap-center"
            >
              <ProductCard product={product} />
            </motion.div>
          ))}
        </div>

        {/* زر عرض الكل */}
        <div className="mt-10 sm:mt-16 flex justify-center">
          <Link href={`/shop?category=${category._id}`}>
            <Button
              variant="outline"
              className="rounded-full border-2 font-black px-10 h-12 hover:bg-primary hover:text-white transition-all gap-3 group shadow-sm"
            >
              {language === 'ar' ? `استكشفي المزيد من ${category.name}` : `View More ${category.name}`}
              <ArrowRight className={cn("w-5 h-5 transition-transform group-hover:translate-x-2", isRTL && "rotate-180 group-hover:-translate-x-2")} />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}

export function FeaturedCategoriesManager() {
  const [featuredCategories, setFeaturedCategories] = useState<Category[]>([])
  const [isInitialLoading, setIsInitialLoading] = useState(true)

  useEffect(() => {
    const loadFeatured = async () => {
      try {
        // جلب الفئات التي علم عليها الأدمن فقط
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/categories?showOnHomePage=true`)
        const json = await response.json()
        setFeaturedCategories(json.data || [])
      } catch (error) {
        console.error('Failed to load featured categories')
      } finally {
        setIsInitialLoading(false)
      }
    }
    loadFeatured()
  }, [])

  if (isInitialLoading || featuredCategories.length === 0) return null

  return (
    <>
      {featuredCategories.map((category, index) => (
        <SingleCategorySection 
            key={category._id} 
            category={category} 
            index={index} 
        />
      ))}
    </>
  )
}