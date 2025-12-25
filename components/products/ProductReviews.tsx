'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { Star, ThumbsUp, MessageSquare } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { AddReviewDialog } from './AddReviewDialog'

interface Review {
  _id: string
  title?: string
  ratings: number
  user: {
    _id: string
    name: string
    image?: string
  }
  createdAt: string
}

interface ProductReviewsProps {
  reviews: Review[]
  productId: string
}

export function ProductReviews({ reviews, productId }: ProductReviewsProps) {
  const [showAddReview, setShowAddReview] = useState(false)
  const searchParams = useSearchParams()

  useEffect(() => {
    const shouldOpenReview = searchParams.get('openReview')
    if (shouldOpenReview === 'true') {
      setShowAddReview(true)
      window.history.replaceState({}, '', window.location.pathname)
    }
  }, [searchParams])

  const averageRating =
    reviews.length > 0
      ? reviews.reduce((sum, r) => sum + r.ratings, 0) / reviews.length
      : 0

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
    <section className='mt-12'>
      <div className='bg-card text-card-foreground p-6 md:p-8 rounded-xl shadow-sm border border-border'>
        {/* Header */}
        <div className='flex items-center justify-between mb-8 flex-wrap gap-4'>
          <div className='flex items-center gap-3'>
            <div className='w-12 h-12 rounded-xl gold-gradient flex items-center justify-center shadow-lg'>
              <MessageSquare className='h-6 w-6 text-white' />
            </div>
            <div>
              <h2 className='text-2xl md:text-3xl font-bold text-foreground'>
                التقييمات والآراء
              </h2>
              <p className='text-sm text-muted-foreground'>
                {reviews.length} تقييم من عملائنا
              </p>
            </div>
          </div>
          <Button
            onClick={() => setShowAddReview(true)}
            className='gold-gradient text-white border-0'
            size='lg'
          >
            <Star className='ml-2 h-5 w-5 fill-current' />
            اكتب تقييمك
          </Button>
        </div>

        {/* Rating Summary */}
        <div className='grid md:grid-cols-3 gap-6 mb-8'>
          <div className='text-center p-8 bg-secondary/50 dark:bg-secondary/20 rounded-2xl border border-border'>
            <div className='text-6xl font-bold text-primary mb-3'>
              {averageRating.toFixed(1)}
            </div>
            <div className='flex justify-center items-center gap-1 mb-3'>
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={cn(
                    'h-6 w-6',
                    i < Math.floor(averageRating)
                      ? 'fill-primary text-primary'
                      : 'text-muted-foreground/30'
                  )}
                />
              ))}
            </div>
            <p className='text-sm font-semibold text-muted-foreground'>
              بناءً على {reviews.length} تقييم
            </p>
          </div>

          <div className='md:col-span-2 space-y-3'>
            <h3 className='font-bold text-lg mb-4 text-foreground'>
              توزيع التقييمات
            </h3>
            {ratingDistribution.map(({ stars, count, percentage }) => (
              <div key={stars} className='flex items-center gap-3'>
                <div className='flex items-center gap-1 w-24'>
                  <Star className='h-4 w-4 fill-primary text-primary' />
                  <span className='font-semibold text-foreground'>{stars}</span>
                </div>
                <div className='flex-1 h-3 bg-muted rounded-full overflow-hidden'>
                  <div
                    className='h-full gold-gradient transition-all duration-500'
                    style={{ width: `${percentage}%` }}
                  />
                </div>
                <span className='text-sm font-semibold text-muted-foreground w-16 text-right'>
                  {count}
                </span>
              </div>
            ))}
          </div>
        </div>

        <Separator className='my-8 bg-border' />

        {/* Reviews List */}
        <div className='space-y-6'>
          {reviews.length === 0 ? (
            <div className='text-center py-16'>
              <MessageSquare className='h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-20' />
              <h3 className='text-xl font-bold text-foreground mb-2'>
                لا توجد تقييمات بعد
              </h3>
              <Button onClick={() => setShowAddReview(true)} variant='outline'>
                كن أول من يقيّم
              </Button>
            </div>
          ) : (
            reviews.map((review) => (
              <div
                key={review._id}
                className='border-b border-border pb-6 last:border-0 hover:bg-muted/30 p-4 rounded-xl transition-all'
              >
                <div className='flex items-start gap-4'>
                  <Avatar className='h-14 w-14 border border-border'>
                    <AvatarImage src={review.user.image} />
                    <AvatarFallback className='bg-primary/10 text-primary font-bold'>
                      {review.user.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div className='flex-1'>
                    <div className='flex items-start justify-between mb-3 flex-wrap'>
                      <div>
                        <h4 className='font-bold text-foreground'>
                          {review.user.name}
                        </h4>
                        <div className='flex items-center gap-2 mt-1'>
                          <div className='flex gap-0.5'>
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={cn(
                                  'h-4 w-4',
                                  i < review.ratings
                                    ? 'fill-primary text-primary'
                                    : 'text-muted-foreground/30'
                                )}
                              />
                            ))}
                          </div>
                          <Badge variant='secondary' className='text-[10px]'>
                            {review.ratings}/5
                          </Badge>
                        </div>
                      </div>
                      <span className='text-[11px] text-muted-foreground'>
                        {new Date(review.createdAt).toLocaleDateString('ar-EG')}
                      </span>
                    </div>
                    {review.title && (
                      <p className='text-foreground/80 text-sm leading-relaxed bg-muted/50 p-3 rounded-lg'>
                        {review.title}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
      <AddReviewDialog
        productId={productId}
        open={showAddReview}
        onOpenChange={setShowAddReview}
      />
    </section>
  )
}
