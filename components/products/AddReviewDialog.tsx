'use client'

import { useState } from 'react'
import { Star, CheckCircle2, Loader2, X } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'
import { reviewsAPI } from '@/lib/api'
import { useAuth } from '@/contexts/AuthContext'
import { useToast } from '@/hooks/use-toast'
import { useRouter, usePathname } from 'next/navigation'

export function AddReviewDialog({
  productId,
  open,
  onOpenChange,
}: {
  productId: string
  open: boolean
  onOpenChange: (o: boolean) => void
}) {
  const { isAuthenticated } = useAuth()
  const { toast } = useToast()
  const router = useRouter()
  const pathname = usePathname()

  const [rating, setRating] = useState(0)
  const [hoveredRating, setHoveredRating] = useState(0)
  const [reviewText, setReviewText] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async () => {
    if (!isAuthenticated) {
      const callbackUrl = `${pathname}?openReview=true`
      router.push(`/login?callbackUrl=${encodeURIComponent(callbackUrl)}`)
      onOpenChange(false)
      return
    }

    if (rating === 0) {
      toast({
        title: 'خطأ',
        description: 'الرجاء اختيار عدد النجوم',
        variant: 'destructive',
      })
      return
    }

    try {
      setSubmitting(true)
      await reviewsAPI.create({
        title: reviewText.trim() || undefined,
        ratings: rating,
        product: productId,
      })
      toast({ title: 'تم بنجاح', description: 'شكراً لتقييمك!' })
      onOpenChange(false)
      window.location.reload()
    } catch (error: any) {
      toast({
        title: 'خطأ',
        description: 'فشل إرسال التقييم',
        variant: 'destructive',
      })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='bg-card text-card-foreground border-border sm:max-w-[500px]'>
        <DialogHeader>
          <DialogTitle className='text-xl font-bold'>أضف تقييمك</DialogTitle>
          <DialogDescription className='text-muted-foreground'>
            رأيك يهمنا ويهم عملاءنا
          </DialogDescription>
        </DialogHeader>

        <div className='space-y-6 py-4'>
          <div className='flex justify-center gap-2'>
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                onMouseEnter={() => setHoveredRating(star)}
                onMouseLeave={() => setHoveredRating(0)}
                onClick={() => setRating(star)}
                className={cn(
                  'h-10 w-10 cursor-pointer transition-all',
                  (hoveredRating || rating) >= star
                    ? 'fill-primary text-primary scale-110'
                    : 'text-muted-foreground/30'
                )}
              />
            ))}
          </div>

          <div className='space-y-2'>
            <Label className='text-foreground font-bold'>
              تعليقك (اختياري)
            </Label>
            <Textarea
              placeholder='اكتب تجربتك هنا...'
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              className='bg-background border-border focus:ring-primary min-h-[120px]'
            />
          </div>
        </div>

        <div className='flex gap-3'>
          <Button
            variant='outline'
            onClick={() => onOpenChange(false)}
            className='flex-1'
          >
            إلغاء
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={submitting || rating === 0}
            className='gold-gradient text-white flex-1'
          >
            {submitting ? (
              <Loader2 className='h-4 w-4 animate-spin' />
            ) : (
              'إرسال التقييم'
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
