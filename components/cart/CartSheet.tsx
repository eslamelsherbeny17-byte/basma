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

  // ✅ حساب القيم بأمان لتجنب أخطاء TypeScript
  const subtotal = cart?.totalCartPrice || 0
  const total = cart?.totalPriceAfterDiscount || subtotal
  const itemsCount = cart?.cartItems?.length || 0

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side='left'
        // ✅ عرض 85% على الموبايل لترك مساحة للخلفية وتجنب تغطية الشاشة بالكامل
        className='w-[85vw] sm:w-[450px] p-0 flex flex-col bg-background border-r-0 [&>button]:hidden shadow-2xl'
      >
        {/* --- Header --- */}
        <SheetHeader className='p-4 border-b bg-background/95 backdrop-blur-md sticky top-0 z-20'>
          <SheetTitle className='flex items-center justify-between'>
            <div className='flex items-center gap-2'>
              <div className='w-9 h-9 rounded-xl bg-primary flex items-center justify-center shadow-lg shadow-primary/20'>
                <ShoppingBag className='h-5 w-5 text-white' strokeWidth={2.5} />
              </div>
              <span className='text-base font-black'>سلتك ({itemsCount})</span>
            </div>
            <Button variant='ghost' size='icon' onClick={() => onOpenChange(false)} className='rounded-full h-8 w-8 hover:bg-muted'>
              <X className='h-4 w-4' />
            </Button>
          </SheetTitle>
        </SheetHeader>

        {/* --- Cart Content Area --- */}
        <div className='flex-1 overflow-hidden'>
          {loading ? (
            <div className='flex items-center justify-center h-full'>
              <Loader2 className='animate-spin text-primary h-8 w-8' />
            </div>
          ) : !cart || itemsCount === 0 ? (
            <div className='flex flex-col items-center justify-center h-full text-center p-8'>
              <div className='w-20 h-20 rounded-full bg-muted flex items-center justify-center mb-4'>
                <ShoppingBag className='h-10 w-10 text-muted-foreground/30' />
              </div>
              <h3 className='text-lg font-bold mb-2'>السلة فارغة</h3>
              <p className='text-sm text-muted-foreground mb-6'>ابدئي بإضافة منتجات رائعة الآن!</p>
              <Button onClick={() => onOpenChange(false)} className="gold-gradient text-white font-bold rounded-xl px-10 h-11">
                تسوقي الآن
              </Button>
            </div>
          ) : (
            <ScrollArea className='h-full'>
              <div className='p-3 space-y-3'>
                <AnimatePresence mode='popLayout'>
                  {/* ✅ استخدام التحقق المزدوج cart?.cartItems لضمان عدم حدوث Type Error */}
                  {cart?.cartItems?.map((item) => {
                    const product = item.product as Product
                    if (!product) return null
                    const isRemoving = removingItems.has(item._id)

                    return (
                      <motion.div
                        key={item._id}
                        layout
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: isRemoving ? 0.5 : 1, scale: 1 }}
                        exit={{ opacity: 0, x: -20 }}
                        className='relative flex gap-3 p-2.5 bg-card rounded-xl border border-border shadow-sm'
                      >
                        {/* صورة المنتج - حجم صغير للموبايل */}
                        <div className='relative w-16 h-16 sm:w-20 sm:h-20 rounded-lg overflow-hidden bg-muted shrink-0 border border-border/50'>
                          <Image
                            src={getImageUrl(product.imageCover)}
                            alt={product.title || 'Product'}
                            fill
                            className='object-cover'
                          />
                        </div>

                        {/* تفاصيل المنتج */}
                        <div className='flex-1 min-w-0 flex flex-col justify-between py-0.5'>
                          <div className='space-y-0.5'>
                            {/* ✅ line-clamp-1 لمنع تمدد النص وتخريب العرض */}
                            <h4 className='font-bold text-[11px] sm:text-sm leading-tight line-clamp-1 text-foreground pr-4'>
                              {product.title}
                            </h4>
                            <p className='text-[10px] sm:text-xs text-primary font-black'>
                              {formatPrice(item.price)}
                            </p>
                          </div>

                          <div className='flex items-center justify-between mt-2'>
                            {/* التحكم في الكمية - مصغر للموبايل */}
                            <div className='flex items-center bg-muted rounded-lg border border-border scale-90 sm:scale-100 origin-right'>
                              <button 
                                className='p-1 sm:p-1.5 hover:bg-background transition-colors disabled:opacity-50'
                                onClick={() => updateQuantity(item._id, item.quantity - 1)}
                                disabled={item.quantity <= 1 || isRemoving}
                              >
                                <Minus className='h-3 w-3' />
                              </button>
                              <span className='px-2 text-[10px] sm:text-xs font-bold w-6 text-center'>{item.quantity}</span>
                              <button 
                                className='p-1 sm:p-1.5 hover:bg-background transition-colors'
                                onClick={() => updateQuantity(item._id, item.quantity + 1)}
                                disabled={isRemoving}
                              >
                                <Plus className='h-3 w-3' />
                              </button>
                            </div>

                            {/* زر الحذف */}
                            <Button
                              variant='ghost'
                              size='icon'
                              className='h-7 w-7 text-muted-foreground hover:text-destructive hover:bg-destructive/10'
                              onClick={() => handleRemoveItem(item._id)}
                              disabled={isRemoving}
                            >
                              {isRemoving ? <Loader2 className='h-3.5 w-3.5 animate-spin' /> : <Trash2 className='h-4 w-4' />}
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

        {/* --- Footer --- */}
        {cart && itemsCount > 0 && (
          <div className='p-4 bg-card border-t shadow-[0_-10px_30px_rgba(0,0,0,0.05)] z-20'>
            <div className='flex justify-between items-center mb-4'>
              <span className='text-xs sm:text-sm font-bold text-muted-foreground'>المجموع الكلي</span>
              <span className='text-lg sm:text-xl font-black text-primary'>{formatPrice(total)}</span>
            </div>
            
            <Button
              onClick={handleCheckout}
              className='w-full h-11 sm:h-13 gold-gradient rounded-xl text-white font-black text-sm sm:text-base shadow-lg shadow-primary/20 active:scale-[0.98] transition-transform flex items-center justify-center gap-2'
            >
              إتمام الطلب الآن
              <ArrowRight className='h-4 w-4' strokeWidth={3} />
            </Button>
          </div>
        )}
      </SheetContent>
    </Sheet>
  )
}
