'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import {
  Plus,
  Search,
  MoreVertical,
  Edit,
  Trash2,
  Eye,
  Loader2,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { adminProductsAPI } from '@/lib/admin-api'
import { formatPrice, getImageUrl } from '@/lib/utils'
import { useToast } from '@/hooks/use-toast'

interface Product {
  _id: string
  title: string
  description: string
  price: number
  priceAfterDiscount?: number
  quantity: number
  sold: number
  imageCover: string
  category?: {
    _id: string
    name: string
  } | null
  brand?: {
    _id: string
    name: string
  } | null
  ratingsAverage: number
  ratingsQuantity: number
  createdAt: string
}

export default function ProductsPage() {
  const { toast } = useToast()
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState('newest')
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [productToDelete, setProductToDelete] = useState<string | null>(null)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    fetchProducts()
  }, [sortBy])

  const fetchProducts = async () => {
    try {
      setLoading(true)
      const params: any = {}

      // Sorting logic
      if (sortBy === 'newest') params.sort = '-createdAt'
      if (sortBy === 'oldest') params.sort = 'createdAt'
      if (sortBy === 'price-low') params.sort = 'price'
      if (sortBy === 'price-high') params.sort = '-price'
      if (sortBy === 'name') params.sort = 'title'

      const response = await adminProductsAPI.getAll(params)
      setProducts(response.data || [])
    } catch (error) {
      console.error('Failed to fetch products:', error)
      toast({
        title: 'خطأ',
        description: 'فشل تحميل المنتجات',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteClick = (productId: string) => {
    setProductToDelete(productId)
    setDeleteDialogOpen(true)
  }

  const handleDeleteConfirm = async () => {
    if (!productToDelete) return

    setDeleting(true)
    try {
      await adminProductsAPI.delete(productToDelete)
      toast({
        title: 'تم الحذف',
        description: 'تم حذف المنتج بنجاح',
      })
      fetchProducts()
    } catch (error: any) {
      toast({
        title: 'خطأ',
        description: error.response?.data?.message || 'فشل حذف المنتج',
        variant: 'destructive',
      })
    } finally {
      setDeleting(false)
      setDeleteDialogOpen(false)
      setProductToDelete(null)
    }
  }

  const filteredProducts = products.filter(
    (product) =>
      product.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className='space-y-6'>
      {/* Header Section */}
      <div className='flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4'>
        <div>
          <h1 className='text-3xl font-bold'>المنتجات</h1>
          <p className='text-muted-foreground mt-1'>
            إدارة منتجات المتجر ({products.length} منتج)
          </p>
        </div>
        <Link href='/admin/products/new'>
          <Button className='gold-gradient'>
            <Plus className='ml-2 h-4 w-4' />
            إضافة منتج جديد
          </Button>
        </Link>
      </div>

      {/* Filters Section */}
      <Card>
        <CardContent className='p-4'>
          <div className='flex flex-col md:flex-row gap-4'>
            {/* Search */}
            <div className='flex-1 relative'>
              <Search className='absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground' />
              <Input
                placeholder='البحث عن منتج...'
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className='pr-10'
              />
            </div>

            {/* Sort Dropdown */}
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className='w-full md:w-[200px]'>
                <SelectValue placeholder='ترتيب حسب' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='newest'>الأحدث</SelectItem>
                <SelectItem value='oldest'>الأقدم</SelectItem>
                <SelectItem value='price-low'>السعر: من الأقل</SelectItem>
                <SelectItem value='price-high'>السعر: من الأعلى</SelectItem>
                <SelectItem value='name'>الاسم</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Table Section */}
      <Card>
        <CardHeader>
          <CardTitle>جميع المنتجات</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className='flex items-center justify-center py-12'>
              <Loader2 className='h-8 w-8 animate-spin text-primary' />
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className='text-center py-12'>
              <p className='text-muted-foreground'>لا توجد منتجات</p>
            </div>
          ) : (
            <div className='overflow-x-auto'>
              <Table>
                <TableHeader>
                  <TableRow>
                    {/* 👇 1. الصورة والاسم يمين */}
                    <TableHead className='w-[80px] text-right'>
                      الصورة
                    </TableHead>
                    <TableHead className='text-right'>المنتج</TableHead>

                    {/* 👇 2. الفئة في النص (تم التعديل) */}
                    <TableHead className='text-center'>الفئة</TableHead>

                    {/* 👇 3. باقي الأرقام في النص */}
                    <TableHead className='text-center'>السعر</TableHead>
                    <TableHead className='text-center'>الكمية</TableHead>
                    <TableHead className='text-center'>المبيعات</TableHead>
                    <TableHead className='text-center'>التقييم</TableHead>
                    <TableHead className='text-center'>الحالة</TableHead>
                    <TableHead className='text-left'>إجراءات</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredProducts.map((product) => (
                    <TableRow key={product._id}>
                      {/* Image - Right Aligned */}
                      <TableCell className='text-right'>
                        <div className='relative w-16 h-16 rounded-lg overflow-hidden bg-secondary inline-block'>
                          <Image
                            src={getImageUrl(product.imageCover)}
                            alt={product.title}
                            fill
                            className='object-cover'
                          />
                        </div>
                      </TableCell>

                      {/* Title - Right Aligned */}
                      <TableCell className='text-right'>
                        <div className='font-medium'>{product.title}</div>
                        <div className='text-sm text-muted-foreground line-clamp-1'>
                          {product.description}
                        </div>
                      </TableCell>

                      {/* 👇 2. Category - Center Aligned (تم التعديل) */}
                      <TableCell className='text-center'>
                        {product.category ? (
                          <Badge variant='secondary'>
                            {product.category.name}
                          </Badge>
                        ) : (
                          <Badge variant='outline'>غير محدد</Badge>
                        )}
                      </TableCell>

                      {/* Price - Center Aligned */}
                      <TableCell className='text-center'>
                        <div className='font-semibold'>
                          {formatPrice(
                            product.priceAfterDiscount || product.price
                          )}
                        </div>
                        {product.priceAfterDiscount && (
                          <div className='text-sm text-muted-foreground line-through'>
                            {formatPrice(product.price)}
                          </div>
                        )}
                      </TableCell>

                      {/* Quantity - Center Aligned */}
                      <TableCell className='text-center'>
                        <Badge
                          variant={
                            product.quantity > 10 ? 'default' : 'destructive'
                          }
                        >
                          {product.quantity}
                        </Badge>
                      </TableCell>

                      {/* Sold - Center Aligned */}
                      <TableCell className='text-center'>
                        {product.sold || 0}
                      </TableCell>

                      {/* Rating - Center Aligned + Flex Center */}
                      <TableCell className='text-center'>
                        <div className='flex items-center justify-center gap-1'>
                          <span className='text-yellow-500'>★</span>
                          <span className='font-medium'>
                            {product.ratingsAverage?.toFixed(1) || '0.0'}
                          </span>
                          <span className='text-sm text-muted-foreground'>
                            ({product.ratingsQuantity || 0})
                          </span>
                        </div>
                      </TableCell>

                      {/* Status - Center Aligned */}
                      <TableCell className='text-center'>
                        {product.quantity > 0 ? (
                          <Badge
                            variant='default'
                            className='bg-green-500 hover:bg-green-600'
                          >
                            متوفر
                          </Badge>
                        ) : (
                          <Badge variant='destructive'>نفذ</Badge>
                        )}
                      </TableCell>

                      {/* Actions - Left Aligned */}
                      <TableCell className='text-left'>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant='ghost' size='icon'>
                              <MoreVertical className='h-4 w-4' />
                            </Button>
                          </DropdownMenuTrigger>

                          {/* 👇 4. حل مشكلة القائمة الشفافة بإضافة خلفية وحدود */}
                          <DropdownMenuContent
                            align='end'
                            className='bg-white border shadow-lg z-50'
                          >
                            <DropdownMenuLabel>الإجراءات</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem asChild>
                              <Link href={`/product/${product._id}`}>
                                <Eye className='ml-2 h-4 w-4' />
                                عرض
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                              <Link
                                href={`/admin/products/${product._id}/edit`}
                              >
                                <Edit className='ml-2 h-4 w-4' />
                                تعديل
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              className='text-red-600'
                              onClick={() => handleDeleteClick(product._id)}
                            >
                              <Trash2 className='ml-2 h-4 w-4' />
                              حذف
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>هل أنت متأكد؟</AlertDialogTitle>
            <AlertDialogDescription>
              لن تتمكن من التراجع عن هذا الإجراء. سيتم حذف المنتج نهائياً من
              قاعدة البيانات.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleting}>إلغاء</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              disabled={deleting}
              className='bg-red-600 hover:bg-red-700'
            >
              {deleting ? (
                <>
                  <Loader2 className='ml-2 h-4 w-4 animate-spin' />
                  جاري الحذف...
                </>
              ) : (
                'حذف'
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
