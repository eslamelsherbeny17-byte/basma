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

export default function ReviewsManagement() {
  const { toast } = useToast()
  const [reviews, setReviews] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [filterRating, setFilterRating] = useState('all')

  useEffect(() => {
    fetchReviews()
  }, [filterRating])

  const fetchReviews = async () => {
    try {
      setLoading(true)
      const params: any = {}
      if (filterRating !== 'all') params.ratings = filterRating

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
      toast({ title: '✅ تم الحذف', description: 'تم حذف التقييم بنجاح' })
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
      ? (reviews.reduce((sum, r) => sum + (r.ratings || 0), 0) / reviews.length).toFixed(1)
      : '0'

  const ratingDistribution = [5, 4, 3, 2, 1].map((stars) => ({
    stars,
    count: reviews.filter((r) => r.ratings === stars).length,
    percentage:
      reviews.length > 0
        ? (reviews.filter((r) => r.ratings === stars).length / reviews.length) * 100
        : 0,
  }))

  return (
    <div className='space-y-4 md:space-y-6'>
      {/* Header */}
      <div>
        <h1 className='text-2xl md:text-3xl font-bold'>إدارة التقييمات</h1>
        <p className='text-sm text-muted-foreground mt-1'>
          إجمالي التقييمات: {reviews.length}
        </p>
      </div>

      {/* Stats Cards */}
      <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
        <Card className='border-0 shadow-lg hover:shadow-xl transition-shadow'>
          <CardContent className='p-6'>
            <div className='flex items-center justify-between mb-4'>
              <div className='w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white shadow-lg'>
                <MessageSquare className='h-7 w-7' />
              </div>
            </div>
            <p className='text-sm font-semibold text-muted-foreground mb-2'>
              إجمالي التقييمات
            </p>
            <p className='text-4xl font-bold text-blue-600 dark:text-blue-400'>
              {reviews.length}
            </p>
          </CardContent>
        </Card>

        <Card className='border-0 shadow-lg hover:shadow-xl transition-shadow'>
          <CardContent className='p-6'>
            <div className='flex items-center justify-between mb-4'>
              <div className='w-14 h-14 rounded-2xl bg-gradient-to-br from-yellow-500 to-yellow-600 flex items-center justify-center text-white shadow-lg'>
                <Star className='h-7 w-7' />
              </div>
            </div>
            <p className='text-sm font-semibold text-muted-foreground mb-2'>
              متوسط التقييم
            </p>
            <div className='flex items-center gap-2'>
              <p className='text-4xl font-bold text-yellow-600 dark:text-yellow-400'>
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
                        : 'text-gray-300 dark:text-gray-600'
                    )}
                  />
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className='border-0 shadow-lg hover:shadow-xl transition-shadow'>
          <CardContent className='p-6'>
            <div className='flex items-center justify-between mb-4'>
              <div className='w-14 h-14 rounded-2xl bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center text-white shadow-lg'>
                <TrendingUp className='h-7 w-7' />
              </div>
            </div>
            <p className='text-sm font-semibold text-muted-foreground mb-2'>
              تقييمات 5 نجوم
            </p>
            <p className='text-4xl font-bold text-green-600 dark:text-green-400'>
              {reviews.filter((r) => r.ratings === 5).length}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Rating Distribution */}
      <Card className='border-0 shadow-sm'>
        <CardContent className='p-6'>
          <h3 className='font-bold text-lg mb-4'>توزيع التقييمات</h3>
          <div className='space-y-3'>
            {ratingDistribution.map(({ stars, count, percentage }) => (
              <div key={stars} className='flex items-center gap-3'>
                <div className='flex items-center gap-1 w-20 sm:w-24'>
                  <Star className='h-4 w-4 fill-yellow-400 text-yellow-400' />
                  <span className='font-semibold'>{stars}</span>
                  <span className='text-muted-foreground text-sm hidden sm:inline'>نجوم</span>
                </div>
                <div className='flex-1 h-3 bg-secondary rounded-full overflow-hidden'>
                  <div
                    className='h-full bg-gradient-to-r from-yellow-400 to-yellow-500 transition-all duration-500'
                    style={{ width: `${percentage}%` }}
                  />
                </div>
                <span className='text-sm font-semibold w-16 sm:w-20 text-right'>
                  {count} <span className='hidden sm:inline'>({percentage.toFixed(0)}%)</span>
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Filters */}
      <Card>
        <CardContent className='p-4'>
          <div className='flex flex-col sm:flex-row items-start sm:items-center gap-3'>
            <span className='font-semibold text-sm'>فلترة حسب:</span>
            <Select value={filterRating} onValueChange={setFilterRating}>
              <SelectTrigger className='w-full sm:w-[200px]'>
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

      {/* Reviews */}
      <Card>
        <CardContent className='p-0'>
          {loading ? (
            <div className='flex items-center justify-center py-12'>
              <Loader2 className='h-8 w-8 animate-spin text-primary' />
            </div>
          ) : (
            <>
              {/* Desktop Table */}
              <div className='hidden md:block overflow-x-auto'>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className='text-right'>المستخدم</TableHead>
                      <TableHead className='text-right'>المنتج</TableHead>
                      <TableHead className='text-center'>التقييم</TableHead>
                      <TableHead className='text-right'>التعليق</TableHead>
                      <TableHead className='text-center'>التاريخ</TableHead>
                      <TableHead className='text-left'>الإجراءات</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {reviews.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className='text-center py-12'>
                          <MessageSquare className='h-16 w-16 mx-auto mb-4 text-muted-foreground' />
                          <p className='text-muted-foreground'>لا توجد تقييمات</p>
                        </TableCell>
                      </TableRow>
                    ) : (
                      reviews.map((review) => (
                        <TableRow key={review._id} className='hover:bg-accent/50'>
                          <TableCell className='text-right'>
                            <div className='flex items-center gap-3'>
                              <Avatar className='h-10 w-10 border-2 border-secondary'>
                                <AvatarImage src={review.user?.profileImg} />
                                <AvatarFallback className='bg-primary/10 text-primary font-bold'>
                                  {review.user?.name?.charAt(0) || 'U'}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <p className='font-semibold'>{review.user?.name || 'مستخدم'}</p>
                                <p className='text-xs text-muted-foreground'>
                                  {review.user?._id?.slice(-8) || '---'}
                                </p>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className='text-right'>
                            <Link
                              href={`/product/${review.product?._id || '#'}`}
                              className='hover:text-primary transition-colors font-medium line-clamp-2 max-w-xs'
                              target='_blank'
                            >
                              {review.product?.title || 'منتج محذوف'}
                            </Link>
                          </TableCell>
                          <TableCell className='text-center'>
                            <div className='flex items-center justify-center gap-2'>
                              <div className='flex items-center gap-1'>
                                {[...Array(5)].map((_, i) => (
                                  <Star
                                    key={i}
                                    className={cn(
                                      'h-4 w-4',
                                      i < (review.ratings || 0)
                                        ? 'fill-yellow-400 text-yellow-400'
                                        : 'text-gray-300 dark:text-gray-600'
                                    )}
                                  />
                                ))}
                              </div>
                              <Badge variant='secondary' className='font-bold'>
                                {review.ratings || 0}
                              </Badge>
                            </div>
                          </TableCell>
                          <TableCell className='text-right max-w-xs'>
                            <p className='line-clamp-2 text-sm text-muted-foreground'>
                              {review.title || 'بدون تعليق'}
                            </p>
                          </TableCell>
                          <TableCell className='text-center'>
                            <div className='text-sm'>
                              <p className='font-medium'>
                                {new Date(review.createdAt).toLocaleDateString('ar-EG')}
                              </p>
                              <p className='text-xs text-muted-foreground'>
                                {new Date(review.createdAt).toLocaleTimeString('ar-EG', {
                                  hour: '2-digit',
                                  minute: '2-digit',
                                })}
                              </p>
                            </div>
                          </TableCell>
                          <TableCell className='text-left'>
                            <Button
                              variant='ghost'
                              size='icon'
                              onClick={() => handleDelete(review._id)}
                              className='hover:bg-destructive/10 hover:text-destructive'
                            >
                              <Trash2 className='h-4 w-4' />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>

              {/* Mobile Cards */}
              <div className='md:hidden divide-y'>
                {reviews.length === 0 ? (
                  <div className='text-center py-12'>
                    <MessageSquare className='h-16 w-16 mx-auto mb-4 text-muted-foreground' />
                    <p className='text-muted-foreground'>لا توجد تقييمات</p>
                  </div>
                ) : (
                  reviews.map((review) => (
                    <div key={review._id} className='p-4 space-y-3'>
                      <div className='flex items-center gap-3'>
                        <Avatar className='h-12 w-12'>
                          <AvatarImage src={review.user?.profileImg} />
                          <AvatarFallback className='bg-primary/10 text-primary font-bold'>
                            {review.user?.name?.charAt(0) || 'U'}
                          </AvatarFallback>
                        </Avatar>
                        <div className='flex-1 min-w-0'>
                          <p className='font-semibold truncate'>
                            {review.user?.name || 'مستخدم'}
                          </p>
                          <div className='flex items-center gap-1 mt-1'>
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={cn(
                                  'h-3 w-3',
                                  i < (review.ratings || 0)
                                    ? 'fill-yellow-400 text-yellow-400'
                                    : 'text-gray-300'
                                )}
                              />
                            ))}
                            <span className='text-xs text-muted-foreground mr-1'>
                              ({review.ratings || 0})
                            </span>
                          </div>
                        </div>
                        <Button
                          variant='ghost'
                          size='icon'
                          onClick={() => handleDelete(review._id)}
                          className='flex-shrink-0'
                        >
                          <Trash2 className='h-4 w-4 text-destructive' />
                        </Button>
                      </div>

                      <p className='text-sm text-muted-foreground line-clamp-2'>
                        {review.title || 'بدون تعليق'}
                      </p>

                      <div className='flex items-center justify-between text-xs text-muted-foreground'>
                        <span className='truncate max-w-[60%]'>
                          {review.product?.title || 'منتج محذوف'}
                        </span>
                        <span>{new Date(review.createdAt).toLocaleDateString('ar-EG')}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}