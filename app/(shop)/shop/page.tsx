'use client'

import { useState, useEffect, Suspense, useCallback } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { FilterSidebar } from '@/components/products/FilterSidebar'
import { ProductGrid } from '@/components/products/ProductGrid'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { productsAPI, categoriesAPI, brandsAPI } from '@/lib/api'
import type { Product, Category, Brand } from '@/lib/types'
import { Grid3x3, LayoutGrid, Loader2 } from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'

function ShopContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const { t } = useLanguage()

  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [brands, setBrands] = useState<Brand[]>([])
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [sortBy, setSortBy] = useState('newest')
  const [activeFilters, setActiveFilters] = useState<any>({})

  const categoryParam = searchParams.get('category')
  const searchParam = searchParams.get('search')
  const saleParam = searchParams.get('sale')

  useEffect(() => {
    fetchCategories()
    fetchBrands()
  }, [])

  useEffect(() => {
    fetchProducts()
  }, [currentPage, sortBy, categoryParam, searchParam, saleParam, activeFilters])

  const fetchCategories = async () => {
    try {
      const data = await categoriesAPI.getAll()
      setCategories(data)
    } catch (error) {
      console.error('Failed to fetch categories:', error)
    }
  }

  const fetchBrands = async () => {
    try {
      const data = await brandsAPI.getAll()
      setBrands(data)
    } catch (error) {
      console.error('Failed to fetch brands:', error)
    }
  }

 const fetchProducts = async () => {
  try {
    setLoading(true)
    const params: any = {
      page: currentPage,
      limit: 12,
    }

    // 1. الترتيب (يستخدم finalPrice بفضل تعديل الباك إند في الـ sort)
    if (sortBy === 'price-low') params.sort = 'price'
    else if (sortBy === 'price-high') params.sort = '-price'
    else if (sortBy === 'newest') params.sort = '-createdAt'
    else if (sortBy === 'rating') params.sort = '-ratingsAverage'
    else if (sortBy === 'bestsellers') params.sort = '-sold'

    // 2. الفلاتر القادمة من الـ Sidebar (أهم جزء)
    if (activeFilters.category) params.category = activeFilters.category
    if (activeFilters.brand) params.brand = activeFilters.brand
    
    // إرسال القيم كـ priceMin و priceMax ليقوم api.ts بتحويلها
    if (activeFilters.priceMin) params.priceMin = activeFilters.priceMin
    if (activeFilters.priceMax) params.priceMax = activeFilters.priceMax

    // 3. فلاتر الـ URL (Search / Category) - نستخدمها فقط إذا لم يكن هناك فلتر نشط
    if (!activeFilters.category && categoryParam) params.category = categoryParam
    if (searchParam) params.keyword = searchParam
    if (saleParam) params.priceAfterDiscount = true

    const response = await productsAPI.getAll(params)
    setProducts(response.data || [])
    setTotalPages(response.paginationResult?.numberOfPages || 1)
  } catch (error) {
    console.error('Failed to fetch products:', error)
  } finally {
    setLoading(false)
  }
  }

  // ✅ Handle Filter Change
  const handleFilterChange = useCallback((filters: any) => {
    console.log('🔄 Filter Changed:', filters)
    setActiveFilters(filters)
    setCurrentPage(1) // Reset to first page
  }, [])

  return (
    <div className='min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-950 dark:to-gray-900 py-4 md:py-8'>
      <div className='container mx-auto px-3 md:px-4'>
        {/* Breadcrumb */}
        <div className='mb-4 md:mb-6 text-xs md:text-sm text-muted-foreground dark:text-gray-400'>
          <span>{t('home')}</span>
          <span className='mx-2'>/</span>
          <span className='text-foreground dark:text-white'>{t('shop')}</span>
        </div>

        {/* Page Header */}
        <div className='mb-6 md:mb-8'>
          <h1 className='text-2xl md:text-3xl lg:text-4xl font-bold mb-2 text-gray-900 dark:text-white'>
            {searchParam ? `${t('search')}: ${searchParam}` : t('shop')}
          </h1>
          <p className='text-sm md:text-base text-muted-foreground dark:text-gray-400'>
            {t('searchProducts')}
          </p>
        </div>

        <div className='flex flex-col lg:flex-row gap-4 md:gap-6'>
          {/* Filters Sidebar */}
          <FilterSidebar
            categories={categories}
            brands={brands}
            onFilterChange={handleFilterChange}
          />

          {/* Products Section */}
          <div className='flex-1 min-w-0'>
            {/* Toolbar */}
            <div className='flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 md:mb-6 bg-white dark:bg-gray-900 p-3 md:p-4 rounded-lg border border-gray-200 dark:border-gray-800 shadow-sm'>
              <div className='flex items-center gap-2'>
                <span className='text-xs md:text-sm text-muted-foreground dark:text-gray-400'>
                  {loading
                    ? t('loading')
                    : `${products.length} ${t('products')}`}
                </span>
              </div>

              <div className='flex items-center gap-2 md:gap-3'>
                {/* Sort */}
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className='w-full sm:w-[180px] h-9 md:h-10 text-xs md:text-sm bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white'>
                    <SelectValue placeholder={t('sortBy')} />
                  </SelectTrigger>
                  <SelectContent className='bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700'>
                    <SelectItem
                      value='newest'
                      className='dark:text-white dark:focus:bg-gray-700'
                    >
                      {t('newest')}
                    </SelectItem>
                    <SelectItem
                      value='bestsellers'
                      className='dark:text-white dark:focus:bg-gray-700'
                    >
                      {t('bestSellers')}
                    </SelectItem>
                    <SelectItem
                      value='price-low'
                      className='dark:text-white dark:focus:bg-gray-700'
                    >
                      {t('priceLowToHigh')}
                    </SelectItem>
                    <SelectItem
                      value='price-high'
                      className='dark:text-white dark:focus:bg-gray-700'
                    >
                      {t('priceHighToLow')}
                    </SelectItem>
                    <SelectItem
                      value='rating'
                      className='dark:text-white dark:focus:bg-gray-700'
                    >
                      {t('topRated')}
                    </SelectItem>
                  </SelectContent>
                </Select>

                {/* View Toggle */}
                <div className='hidden md:flex gap-1 border border-gray-200 dark:border-gray-700 rounded-lg p-1 bg-white dark:bg-gray-800'>
                  <Button
                    variant='ghost'
                    size='icon'
                    className='h-8 w-8 dark:hover:bg-gray-700'
                  >
                    <Grid3x3 className='h-4 w-4 text-gray-700 dark:text-gray-300' />
                  </Button>
                  <Button
                    variant='ghost'
                    size='icon'
                    className='h-8 w-8 dark:hover:bg-gray-700'
                  >
                    <LayoutGrid className='h-4 w-4 text-gray-700 dark:text-gray-300' />
                  </Button>
                </div>
              </div>
            </div>

            {/* Products Grid */}
            {loading ? (
              <div className='flex items-center justify-center py-12 md:py-20'>
                <Loader2 className='h-10 w-10 md:h-12 md:w-12 animate-spin text-primary' />
              </div>
            ) : products.length === 0 ? (
              <div className='flex flex-col items-center justify-center py-12 md:py-20 text-center'>
                <p className='text-lg text-muted-foreground mb-4'>
                  لا توجد منتجات تطابق الفلاتر المحددة
                </p>
                <Button 
                  variant='outline' 
                  onClick={() => {
                    setActiveFilters({})
                    setCurrentPage(1)
                  }}
                >
                  إعادة تعيين الفلاتر
                </Button>
              </div>
            ) : (
              <ProductGrid products={products} />
            )}

            {/* Pagination */}
            {totalPages > 1 && !loading && products.length > 0 && (
              <div className='flex justify-center items-center gap-2 mt-8 md:mt-12 flex-wrap'>
                <Button
                  variant='outline'
                  size='sm'
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((prev) => prev - 1)}
                  className='text-xs md:text-sm dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:hover:bg-gray-700'
                >
                  {t('previous')}
                </Button>

                {[...Array(totalPages)].map((_, i) => (
                  <Button
                    key={i}
                    variant={currentPage === i + 1 ? 'default' : 'outline'}
                    size='sm'
                    className={
                      currentPage === i + 1
                        ? 'gold-gradient'
                        : 'dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:hover:bg-gray-700'
                    }
                    onClick={() => setCurrentPage(i + 1)}
                  >
                    {i + 1}
                  </Button>
                ))}

                <Button
                  variant='outline'
                  size='sm'
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage((prev) => prev + 1)}
                  className='text-xs md:text-sm dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:hover:bg-gray-700'
                >
                  {t('next')}
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default function ShopPage() {
  return (
    <Suspense
      fallback={
        <div className='flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-950 dark:to-gray-900'>
          <Loader2 className='h-12 w-12 animate-spin text-primary' />
        </div>
      }
    >
      <ShopContent />
    </Suspense>
  )
}