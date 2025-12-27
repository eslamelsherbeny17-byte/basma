'use client'

import {
  ShoppingBag,
  Plus,
  Minus,
  Trash2,
  Loader2,
  ArrowRight,
  X,
} from 'lucide-react'
import Image from 'next/image'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { formatPrice, getImageUrl } from '@/lib/utils'
import { useCart } from '@/contexts/CartContext'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'
import { Product } from '@/lib/types'
import { cn } from '@/lib/utils'

interface CartSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CartSheet({ open, onOpenChange }: CartSheetProps) {
  const router = useRouter()
  const { cart, loading, updateQuantity, removeItem } = useCart()
  const { isAuthenticated } = useAuth()
  const [removingItems, setRemovingItems] = useState<Set<string>>(new Set())

  const handleCheckout = () => {
    if (!isAuthenticated) {
      router.push('/login?callbackUrl=/checkout')
    } else {
      router.push('/checkout')
    }
    onOpenChange(false)
  }

  const handleRemoveItem = async (itemId: string) => {
    setRemovingItems((prev) => new Set(prev).add(itemId))
    try {
      await removeItem(itemId)
    } finally {
      setRemovingItems((prev) => {
        const next = new Set(prev)
        next.delete(itemId)
        return next
      })
    }
  }

  const total = cart?.totalPriceAfterDiscount || cart?.totalCartPrice || 0
  const itemsCount = cart?.cartItems.length || 0

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side='left'
        // ✅ العرض هنا 85% لترك مساحة كافية للخلفية
        className='w-[85vw] sm:w-[450px] p-0 flex flex-col bg-background border-r-0 [&>button]:hidden shadow-2xl'
      >
        {/* Header */}
        <SheetHeader className='p-4 border-b bg-background/95 backdrop-blur-md'>
          <SheetTitle className='flex items-center justify-between'>
            <div className='flex items-center gap-2'>
              <div className='w-9 h-9 rounded-xl bg-primary flex items-center justify-center shadow-lg shadow-primary/20'>
                <ShoppingBag className='h-5 w-5 text-white' />
              </div>
              <span className='text-base font-bold'>السلة ({itemsCount})</span>
            </div>
            <Button variant='ghost' size='icon' onClick={() => onOpenChange(false)} className='rounded-full h-8 w-8'>
              <X className='h-4 w-4' />
            </Button>
          </SheetTitle>
        </SheetHeader>

        {/* Cart Items Area */}
        <div className='flex-1 overflow-hidden'>
          {loading ? (
            <div className='flex items-center justify-center h-full'><Loader2 className='animate-spin text-primary' /></div>
          ) : itemsCount === 0 ? (
            <div className='flex flex-col items-center justify-center h-full text-center p-6'>
              <ShoppingBag className='h-12 w-12 text-muted-foreground/20 mb-3' />
              <p className='text-sm text-muted-foreground font-medium'>سلتك فارغة حالياً</p>
            </div>
          ) : (
            <ScrollArea className='h-full'>
              <div className='p-3 space-y-3'>
                <AnimatePresence mode='popLayout'>
                  {cart.cartItems.map((item) => {
                    const product = item.product as Product
                    const isRemoving = removingItems.has(item._id)

                    return (
                      <motion.div
                        key={item._id}
                        layout
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, x: -20 }}
                        className='relative flex gap-3 p-2.5 bg-card rounded-xl border border-border shadow-sm overflow-hidden'
                      >
                        {/* المنتج - صورة مصغرة */}
                        <div className='relative w-16 h-16 sm:w-20 sm:h-20 rounded-lg overflow-hidden bg-muted shrink-0'>
                          <Image
                            src={getImageUrl(product.imageCover)}
                            alt={product.title}
                            fill
                            className='object-cover'
                          />
                        </div>

                        {/* المنتج - تفاصيل */}
                        <div className='flex-1 min-w-0 flex flex-col justify-between'>
                          <div className='space-y-0.5'>
                            <h4 className='font-bold text-[11px] sm:text-sm leading-tight line-clamp-1 text-foreground'>
                              {product.title}
                            </h4>
                            <p className='text-[10px] sm:text-xs text-primary font-bold'>
                              {formatPrice(item.price)}
                            </p>
                          </div>

                          <div className='flex items-center justify-between mt-2'>
                            {/* التحكم في الكمية - حجم صغير للموبايل */}
                            <div className='flex items-center bg-muted rounded-lg border border-border scale-90 sm:scale-100 origin-right'>
                              <button 
                                className='p-1 sm:p-1.5 hover:bg-background'
                                onClick={() => updateQuantity(item._id, item.quantity - 1)}
                                disabled={item.quantity <= 1 || isRemoving}
                              >
                                <Minus className='h-2.5 w-2.5 sm:h-3 sm:w-3' />
                              </button>
                              <span className='px-2 text-[10px] sm:text-xs font-bold'>{item.quantity}</span>
                              <button 
                                className='p-1 sm:p-1.5 hover:bg-background'
                                onClick={() => updateQuantity(item._id, item.quantity + 1)}
                                disabled={isRemoving}
                              >
                                <Plus className='h-2.5 w-2.5 sm:h-3 sm:w-3' />
                              </button>
                            </div>

                            {/* حذف */}
                            <Button
                              variant='ghost'
                              size='icon'
                              className='h-7 w-7 text-muted-foreground hover:text-destructive'
                              onClick={() => handleRemoveItem(item._id)}
                              disabled={isRemoving}
                            >
                              {isRemoving ? <Loader2 className='h-3 w-3 animate-spin' /> : <Trash2 className='h-3.5 w-3.5' />}
                            </Button>
                          </div>
                        </div>
                      </motion.div>
                    )
                  })}
                </AnimatePresence>
              </div>
            </ScrollArea>
          )}
        </div>

        {/* Footer */}
        {itemsCount > 0 && (
          <div className='p-4 bg-card border-t shadow-[0_-10px_20px_rgba(0,0,0,0.03)]'>
            <div className='flex justify-between items-center mb-4'>
              <span className='text-xs sm:text-sm font-medium text-muted-foreground'>المبلغ الإجمالي</span>
              <span className='text-lg sm:text-xl font-black text-primary'>{formatPrice(total)}</span>
            </div>
            
            <Button
              onClick={handleCheckout}
              className='w-full h-11 sm:h-13 gold-gradient rounded-xl text-white font-bold text-sm sm:text-base shadow-lg active:scale-[0.98] transition-transform'
            >
              إتمام الطلب
              <ArrowRight className='mr-2 h-4 w-4' />
            </Button>
          </div>
        )}
      </SheetContent>
    </Sheet>
  )
}
