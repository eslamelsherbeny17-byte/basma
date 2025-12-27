'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { Star, MessageSquare } from 'lucide-react'
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

// ✅ تحديث الواجهة لتشمل onAuthCheck وإصلاح نوع الـ callback
interface ProductReviewsProps {
  reviews: Review[]
  productId: string
  onAuthCheck: (callback: () => void) => void 
}

export function ProductReviews({ reviews, productId, onAuthCheck }: ProductReviewsProps) {
  const [showAddReview, setShowAddReview] = useState(false)
  const searchParams = useSearchParams()

  useEffect(() => {
    const shouldOpenReview = searchParams.get('openReview')
    if (shouldOpenReview === 'true') {
      // ✅ استخدام فحص الحماية عند المحاولة من الرابط أيضاً
      onAuthCheck(() => setShowAddReview(true))
      window.history.replaceState({}, '', window.location.pathname)
    }
  }, [searchParams, onAuthCheck])

  const averageRating =
    reviews.length > 0
      ? reviews.reduce((sum, r) => sum + r.ratings, 0) / reviews.length
      : 0

  const ratingDistribution = [5, 4, 3, 2, 1].map((stars) => ({
    stars,
    count: reviews.filter((r) => r.ratings === stars).length,
    percentage:
      reviews.length > 0
        ? (reviews.filter((r) => r.ratings === stars).length / reviews.length) * 100
        : 0,
  }))

  return (
    <section className='mt-16 w-full overflow-hidden'>
      <div className='bg-card text-card-foreground p-5 md:p-10 rounded-[2.5rem] shadow-sm border border-border transition-all'>
        
        {/* Header Section */}
        <div className='flex flex-col md:flex-row md:items-center justify-between mb-10 gap-6'>
          <div className='flex items-center gap-4'>
            <div className='w-14 h-14 rounded-2xl gold-gradient flex items-center justify-center shadow-lg shrink-0'>
              <MessageSquare className='h-7 w-7 text-white' />
            </div>
            <div>
              <h2 className='text-2xl md:text-4xl font-black text-foreground tracking-tight'>
                آراء المجتمع
              </h2>
              <p className='text-sm font-bold text-muted-foreground mt-1'>
                {reviews.length} مراجعة موثقة
              </p>
            </div>
          </div>
          
          {/* زر كتابة التقييم مربوط بفحص تسجيل الدخول ✅ */}
          <Button
            onClick={() => onAuthCheck(() => setShowAddReview(true))}
            className='gold-gradient text-white h-14 px-8 rounded-2xl font-black text-lg shadow-xl hover:scale-105 transition-transform w-full md:w-auto'
          >
            <Star className='ml-2 h-5 w-5 fill-current' />
            شاركنا تجربتك
          </Button>
        </div>

        {/* Rating Grid */}
        <div className='grid grid-cols-1 lg:grid-cols-12 gap-10'>
          
          {/* Average Display */}
          <div className='lg:col-span-4 flex flex-col items-center justify-center p-8 bg-muted/30 rounded-[2rem] border border-border/50 text-center'>
            <span className='text-7xl font-black text-primary mb-2'>{averageRating.toFixed(1)}</span>
            <div className='flex gap-1 mb-4'>
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={cn(
                    'h-6 w-6',
                    i < Math.floor(averageRating) ? 'fill-yellow-400 text-yellow-400' : 'text-muted/20'
                  )}
                />
              ))}
            </div>
            <p className='text-sm font-bold text-muted-foreground'>الجودة العامة بناءً على التجارب</p>
          </div>

          {/* Distribution Bars */}
          <div className='lg:col-span-8 flex flex-col justify-center space-y-4'>
            {ratingDistribution.map(({ stars, count, percentage }) => (
              <div key={stars} className='flex items-center gap-4'>
                <div className='flex items-center gap-2 w-20 shrink-0'>
                  <span className='font-black text-foreground'>{stars}</span>
                  <Star className='h-4 w-4 fill-primary text-primary' />
                </div>
                <div className='flex-1 h-2.5 bg-muted rounded-full overflow-hidden'>
                  <div
                    className='h-full gold-gradient rounded-full transition-all duration-700'
                    style={{ width: `${percentage}%` }}
                  />
                </div>
                <span className='text-xs font-black text-muted-foreground w-12 text-left'>
                  {count}
                </span>
              </div>
            ))}
          </div>
        </div>

        <Separator className='my-12 bg-border/50' />

        {/* Reviews List */}
        <div className='space-y-8'>
          {reviews.length === 0 ? (
            <div className='text-center py-10 opacity-50'>
              <p className='text-lg font-bold'>كن أول من يضع بصمته هنا..</p>
            </div>
          ) : (
            reviews.map((review) => (
              <div
                key={review._id}
                className='group bg-muted/10 hover:bg-muted/30 p-6 rounded-[2rem] transition-all duration-300 border border-transparent hover:border-border/50'
              >
                <div className='flex flex-col md:flex-row gap-5'>
                  <Avatar className='h-14 w-14 border-2 border-background shadow-sm shrink-0'>
                    <AvatarImage src={review.user.image} />
                    <AvatarFallback className='bg-primary/10 text-primary font-black text-xl'>
                      {review.user.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className='flex-1 space-y-3'>
                    <div className='flex flex-col md:flex-row md:items-center justify-between gap-2'>
                      <div>
                        <h4 className='font-black text-foreground text-lg'>{review.user.name}</h4>
                        <div className='flex items-center gap-2 mt-1'>
                          <div className='flex gap-0.5'>
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={cn(
                                  'h-3.5 w-3.5',
                                  i < review.ratings ? 'fill-yellow-400 text-yellow-400' : 'text-muted/20'
                                )}
                              />
                            ))}
                          </div>
                          <Badge variant='secondary' className='text-[9px] h-5 rounded-full px-2 font-bold'>
                            تحقق من الشراء
                          </Badge>
                        </div>
                      </div>
                      <span className='text-[10px] font-bold text-muted-foreground uppercase tracking-widest bg-background px-3 py-1 rounded-full border border-border w-fit'>
                        {new Date(review.createdAt).toLocaleDateString('ar-EG', { year: 'numeric', month: 'long', day: 'numeric' })}
                      </span>
                    </div>
                    
                    {review.title && (
                      <p className='text-foreground/80 text-sm md:text-base leading-relaxed font-medium'>
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