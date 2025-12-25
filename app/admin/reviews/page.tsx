'use client'

import { useState, useEffect } from 'react'
import { Star, Trash2, Loader2, MessageSquare, TrendingUp } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { adminReviewsAPI } from '@/lib/admin-api'
import { cn } from '@/lib/utils'
import Link from 'next/link'
import { useToast } from '@/hooks/use-toast'
import { motion } from 'framer-motion'

interface Review {
  _id: string
  title?: string
  ratings: number
  user: {
    _id: string
    name: string
    profileImg?: string
  }
  product: {
    _id: string
    title: string
  }
  createdAt: string
}

export default function ReviewsManagement() {
  const { toast } = useToast()
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)
  const [filterRating, setFilterRating] = useState('all')

  useEffect(() => {
    fetchReviews()
  }, [filterRating])

  const fetchReviews = async () => {
    try {
      setLoading(true)
      const params: any = {}
      if (filterRating !== 'all') {
        params.ratings = filterRating
      }

      const response = await adminReviewsAPI.getAll(params)
      setReviews(response.data || [])
    } catch (error) {
      console.error('Failed to fetch reviews:', error)
      toast({
        title: 'خطأ',
        description: 'فشل تحميل التقييمات',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('هل أنت متأكد من حذف هذا التقييم؟')) return

    try {
      await adminReviewsAPI.delete(id)
      toast({
        title: '✅ تم الحذف',
        description: 'تم حذف التقييم بنجاح',
      })
      fetchReviews()
    } catch (error: any) {
      toast({
        title: 'خطأ',
        description: error.response?.data?.message || 'فشل حذف التقييم',
        variant: 'destructive',
      })
    }
  }

  const avgRating =
    reviews.length > 0
      ? (
          reviews.reduce((sum, r) => sum + r.ratings, 0) / reviews.length
        ).toFixed(1)
      : '0'

  // حساب توزيع النجوم
  const ratingDistribution = [5, 4, 3, 2, 1].map((stars) => ({
    stars,
    count: reviews.filter((r) => r.ratings === stars).length,
    percentage:
      reviews.length > 0
        ? (reviews.filter((r) => r.ratings === stars).length / reviews.length) *
          100
        : 0,
  }))

  return (
    <div className='space-y-6'>
      {/* Header */}
      <div>
        <h1 className='text-3xl font-bold mb-2'>إدارة التقييمات</h1>
        <p className='text-muted-foreground'>
          إجمالي التقييمات: {reviews.length}
        </p>
      </div>

      {/* Stats Cards */}
      <div className='grid md:grid-cols-3 gap-4'>
        {/* Total Reviews */}
        <motion.div
          whileHover={{ y: -4, scale: 1.02 }}
          transition={{ duration: 0.2 }}
        >
          <Card className='border-0 shadow-lg hover:shadow-2xl transition-all overflow-hidden group'>
            <CardContent className='p-6 relative'>
              <div className='absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-500 to-blue-600 opacity-[0.03] rounded-bl-full'></div>
              <div className='flex items-center justify-between mb-4'>
                <div className='w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform'>
                  <MessageSquare className='h-7 w-7' />
                </div>
              </div>
              <div>
                <p className='text-sm font-semibold text-gray-600 mb-2'>
                  إجمالي التقييمات
                </p>
                <p className='text-4xl font-bold text-blue-600'>
                  {reviews.length}
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Average Rating */}
        <motion.div
          whileHover={{ y: -4, scale: 1.02 }}
          transition={{ duration: 0.2 }}
        >
          <Card className='border-0 shadow-lg hover:shadow-2xl transition-all overflow-hidden group'>
            <CardContent className='p-6 relative'>
              <div className='absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-yellow-500 to-yellow-600 opacity-[0.03] rounded-bl-full'></div>
              <div className='flex items-center justify-between mb-4'>
                <div className='w-14 h-14 rounded-2xl bg-gradient-to-br from-yellow-500 to-yellow-600 flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform'>
                  <Star className='h-7 w-7' />
                </div>
              </div>
              <div>
                <p className='text-sm font-semibold text-gray-600 mb-2'>
                  متوسط التقييم
                </p>
                <div className='flex items-center gap-2'>
                  <p className='text-4xl font-bold text-yellow-600'>
                    {avgRating}
                  </p>
                  <div className='flex'>
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={cn(
                          'h-5 w-5',
                          i < Math.floor(parseFloat(avgRating))
                            ? 'fill-yellow-400 text-yellow-400'
                            : 'text-gray-300'
                        )}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* 5 Stars Reviews */}
        <motion.div
          whileHover={{ y: -4, scale: 1.02 }}
          transition={{ duration: 0.2 }}
        >
          <Card className='border-0 shadow-lg hover:shadow-2xl transition-all overflow-hidden group'>
            <CardContent className='p-6 relative'>
              <div className='absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-green-500 to-green-600 opacity-[0.03] rounded-bl-full'></div>
              <div className='flex items-center justify-between mb-4'>
                <div className='w-14 h-14 rounded-2xl bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform'>
                  <TrendingUp className='h-7 w-7' />
                </div>
              </div>
              <div>
                <p className='text-sm font-semibold text-gray-600 mb-2'>
                  تقييمات 5 نجوم
                </p>
                <p className='text-4xl font-bold text-green-600'>
                  {reviews.filter((r) => r.ratings === 5).length}
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Rating Distribution */}
      <Card className='border-0 shadow-sm'>
        <CardContent className='p-6'>
          <h3 className='font-bold text-lg mb-4'>توزيع التقييمات</h3>
          <div className='space-y-3'>
            {ratingDistribution.map(({ stars, count, percentage }) => (
              <div key={stars} className='flex items-center gap-3'>
                <div className='flex items-center gap-1 w-24'>
                  <Star className='h-4 w-4 fill-yellow-400 text-yellow-400' />
                  <span className='font-semibold'>{stars}</span>
                  <span className='text-muted-foreground text-sm'>نجوم</span>
                </div>
                <div className='flex-1 h-3 bg-gray-100 rounded-full overflow-hidden'>
                  <div
                    className='h-full bg-gradient-to-r from-yellow-400 to-yellow-500 transition-all duration-500'
                    style={{ width: `${percentage}%` }}
                  />
                </div>
                <span className='text-sm font-semibold w-16 text-right'>
                  {count} ({percentage.toFixed(0)}%)
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Filters */}
      <Card className='border-0 shadow-sm'>
        <CardContent className='p-6'>
          <div className='flex items-center gap-4'>
            <span className='font-semibold'>فلترة حسب:</span>
            <Select value={filterRating} onValueChange={setFilterRating}>
              <SelectTrigger className='w-[200px]'>
                <SelectValue placeholder='جميع التقييمات' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='all'>جميع التقييمات</SelectItem>
                <SelectItem value='5'>⭐⭐⭐⭐⭐ 5 نجوم</SelectItem>
                <SelectItem value='4'>⭐⭐⭐⭐ 4 نجوم</SelectItem>
                <SelectItem value='3'>⭐⭐⭐ 3 نجوم</SelectItem>
                <SelectItem value='2'>⭐⭐ 2 نجمة</SelectItem>
                <SelectItem value='1'>⭐ 1 نجمة</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Reviews Table */}
      <Card className='border-0 shadow-sm'>
        <CardContent className='p-0'>
          {loading ? (
            <div className='flex items-center justify-center py-12'>
              <Loader2 className='h-8 w-8 animate-spin text-primary' />
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>المستخدم</TableHead>
                  <TableHead>المنتج</TableHead>
                  <TableHead>التقييم</TableHead>
                  <TableHead>التعليق</TableHead>
                  <TableHead>التاريخ</TableHead>
                  <TableHead>الإجراءات</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {reviews.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className='text-center py-12'>
                      <div className='flex flex-col items-center gap-4'>
                        <MessageSquare className='h-16 w-16 text-gray-300' />
                        <p className='text-muted-foreground'>لا توجد تقييمات</p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  reviews.map((review) => (
                    <TableRow key={review._id} className='hover:bg-gray-50'>
                      <TableCell>
                        <div className='flex items-center gap-3'>
                          <Avatar className='h-10 w-10 border-2 border-gray-100'>
                            <AvatarImage src={review.user.profileImg} />
                            <AvatarFallback className='bg-primary/10 text-primary font-bold'>
                              {review.user.name.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className='font-semibold'>{review.user.name}</p>
                            <p className='text-xs text-muted-foreground'>
                              {review.user._id.slice(-8)}
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Link
                          href={`/product/${review.product._id}`}
                          className='hover:text-primary transition-colors font-medium line-clamp-2 max-w-xs'
                          target='_blank'
                        >
                          {review.product.title}
                        </Link>
                      </TableCell>
                      <TableCell>
                        <div className='flex items-center gap-2'>
                          <div className='flex items-center gap-1'>
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={cn(
                                  'h-4 w-4',
                                  i < review.ratings
                                    ? 'fill-yellow-400 text-yellow-400'
                                    : 'text-gray-300'
                                )}
                              />
                            ))}
                          </div>
                          <Badge variant='secondary' className='font-bold'>
                            {review.ratings}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell className='max-w-xs'>
                        <p className='line-clamp-2 text-sm text-muted-foreground'>
                          {review.title || 'بدون تعليق'}
                        </p>
                      </TableCell>
                      <TableCell>
                        <div className='text-sm'>
                          <p className='font-medium'>
                            {new Date(review.createdAt).toLocaleDateString(
                              'ar-EG'
                            )}
                          </p>
                          <p className='text-xs text-muted-foreground'>
                            {new Date(review.createdAt).toLocaleTimeString(
                              'ar-EG',
                              {
                                hour: '2-digit',
                                minute: '2-digit',
                              }
                            )}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Button
                          variant='ghost'
                          size='icon'
                          onClick={() => handleDelete(review._id)}
                          className='hover:bg-red-50 hover:text-red-600'
                        >
                          <Trash2 className='h-4 w-4' />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
