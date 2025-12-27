'use client'

import {
  ShoppingBag,
  Plus,
  Minus,
  Trash2,
  Loader2,
  ArrowRight,
  Sparkles,
  Package,
  Shield,
  RotateCcw,
  Gift,
  Zap,
  CheckCircle2,
  AlertCircle,
  X,
} from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Badge } from '@/components/ui/badge'
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
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({})
  const [removingItems, setRemovingItems] = useState<Set<string>>(new Set())

  const handleCheckout = () => {
    if (!isAuthenticated) {
      router.push('/login?callbackUrl=/checkout')
    } else {
      router.push('/checkout')
    }
    onOpenChange(false)
  }

  const handleImageError = (itemId: string) => {
    setImageErrors((prev) => ({ ...prev, [itemId]: true }))
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

  const getProductData = (item: any): Product | null => {
    if (typeof item.product === 'object' && item.product !== null) {
      return item.product as Product
    }
    return null
  }

  const subtotal = cart?.totalCartPrice || 0
  const discount = cart?.totalPriceAfterDiscount
    ? subtotal - cart.totalPriceAfterDiscount
    : 0
  const total = cart?.totalPriceAfterDiscount || subtotal
  const itemsCount = cart?.cartItems.length || 0

  const freeShippingThreshold = 500
  const progressToFreeShipping = Math.min(
    (total / freeShippingThreshold) * 100,
    100
  )
  const amountToFreeShipping = Math.max(freeShippingThreshold - total, 0)

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side='left'
        className='w-full sm:w-[450px] sm:max-w-lg p-0 flex flex-col bg-background border-r-0 [&>button]:hidden'
        // ✅ التغييرات:
        // - w-full على الموبايل (عرض كامل)
        // - sm:w-[450px] على الشاشات الأكبر من 640px
        // - sm:max-w-lg للحد الأقصى
      >
        {/* ==================== HEADER ==================== */}
        <SheetHeader className='sticky top-0 z-10 p-4 sm:p-6 pb-3 sm:pb-4 bg-background/80 backdrop-blur-xl border-b border-border shadow-sm'>
          <SheetTitle className='flex items-center justify-between gap-2'>
            <div className='flex items-center gap-2 sm:gap-3'>
              <motion.div
                initial={{ rotate: -10, scale: 0.9 }}
                animate={{ rotate: 0, scale: 1 }}
                transition={{ type: 'spring', stiffness: 200 }}
                className='relative'
              >
                <div className='w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-gradient-to-br from-primary via-primary to-accent flex items-center justify-center shadow-lg shadow-primary/30'>
                  <ShoppingBag className='h-5 w-5 sm:h-6 sm:w-6 text-white' strokeWidth={2.5} />
                </div>
                {itemsCount > 0 && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className='absolute -top-1 -right-1 w-4 h-4 sm:w-5 sm:h-5 bg-gradient-to-r from-red-500 to-pink-500 rounded-full flex items-center justify-center ring-2 ring-background shadow-lg'
                  >
                    <span className='text-[9px] sm:text-[10px] font-bold text-white'>
                      {itemsCount}
                    </span>
                  </motion.div>
                )}
              </motion.div>

              <div>
                <h2 className='text-lg sm:text-2xl font-bold bg-gradient-to-r from-foreground via-foreground/80 to-foreground/60 bg-clip-text text-transparent'>
                  سلة التسوق
                </h2>
                {itemsCount > 0 && (
                  <p className='text-[10px] sm:text-xs text-muted-foreground font-medium mt-0.5'>
                    {itemsCount} {itemsCount === 1 ? 'منتج' : 'منتجات'}
                  </p>
                )}
              </div>
            </div>

            {/* زر الإغلاق */}
            <Button
              variant='ghost'
              size='icon'
              onClick={() => onOpenChange(false)}
              className='h-9 w-9 sm:h-10 sm:w-10 rounded-full hover:bg-muted shrink-0'
            >
              <X className='h-4 w-4 sm:h-5 sm:w-5' />
            </Button>
          </SheetTitle>

          {itemsCount > 0 && amountToFreeShipping > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className='mt-3 sm:mt-4 space-y-2'
            >
              <div className='flex items-center justify-between text-[10px] sm:text-xs'>
                <span className='text-muted-foreground font-medium'>
                  {amountToFreeShipping > 0
                    ? `أضف ${formatPrice(amountToFreeShipping)} للشحن المجاني!`
                    : 'مبروك! شحن مجاني 🎉'}
                </span>
                <span className='font-bold text-primary'>
                  {progressToFreeShipping.toFixed(0)}%
                </span>
              </div>
              <div className='h-1.5 sm:h-2 bg-muted rounded-full overflow-hidden'>
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${progressToFreeShipping}%` }}
                  transition={{ duration: 0.6, ease: 'easeOut' }}
                  className='h-full bg-gradient-to-r from-green-400 via-emerald-500 to-green-600 rounded-full relative overflow-hidden'
                >
                  <div className='absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer' />
                </motion.div>
              </div>
            </motion.div>
          )}
        </SheetHeader>

        {/* ==================== CART ITEMS ==================== */}
        <div className='flex-1 overflow-hidden'>
          {loading ? (
            <div className='flex items-center justify-center h-full'>
              <div className='text-center space-y-3 sm:space-y-4'>
                <div className='relative mx-auto w-fit'>
                  <Loader2 className='h-10 w-10 sm:h-14 sm:w-14 animate-spin text-primary' strokeWidth={2.5} />
                  <div className='absolute inset-0 blur-2xl bg-primary/20 animate-pulse' />
                </div>
                <p className='text-sm sm:text-base font-semibold text-foreground'>
                  جاري تحميل السلة
                </p>
              </div>
            </div>
          ) : !cart || itemsCount === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className='flex flex-col items-center justify-center h-full px-4 sm:px-6 py-8 sm:py-12 text-center'
            >
              <div className='relative mb-6 sm:mb-8'>
                <div className='w-24 h-24 sm:w-32 sm:h-32 rounded-full bg-muted flex items-center justify-center shadow-2xl border-4 border-background'>
                  <ShoppingBag className='h-12 w-12 sm:h-16 sm:w-16 text-muted-foreground/50' strokeWidth={1.5} />
                </div>
                <motion.div className='absolute -top-2 -right-2 bg-gradient-to-r from-red-500 to-pink-500 text-white text-[10px] sm:text-xs font-bold px-2 sm:px-3 py-1 sm:py-1.5 rounded-full shadow-xl'>
                  فارغة
                </motion.div>
              </div>

              <div className='space-y-2 sm:space-y-3 mb-6 sm:mb-8'>
                <h3 className='text-xl sm:text-2xl font-bold text-foreground'>
                  سلة التسوق فارغة
                </h3>
                <p className='text-muted-foreground text-sm sm:text-base leading-relaxed max-w-xs mx-auto'>
                  ابدئي بإضافة منتجات رائعة واستمتعي بتجربة تسوق لا تُنسى! ✨
                </p>
              </div>

              <Button
                onClick={() => {
                  onOpenChange(false)
                  router.push('/shop')
                }}
                className='gold-gradient hover:shadow-2xl transition-all duration-300 transform hover:scale-105 rounded-xl sm:rounded-2xl font-bold px-6 sm:px-8 h-12 sm:h-14 text-sm sm:text-base shadow-xl text-white'
              >
                <Sparkles className='ml-2 h-4 w-4 sm:h-5 sm:w-5' />
                ابدئي التسوق الآن
              </Button>

              <div className='mt-8 sm:mt-12 grid grid-cols-3 gap-3 sm:gap-4 w-full max-w-md'>
                {[
                  { icon: Gift, text: 'عروض يومية', gradient: 'from-pink-500 to-rose-500' },
                  { icon: Zap, text: 'شحن سريع', gradient: 'from-yellow-500 to-orange-500' },
                  { icon: RotateCcw, text: 'إرجاع سهل', gradient: 'from-blue-500 to-cyan-500' },
                ].map((item, i) => (
                  <div key={i} className='text-center'>
                    <div className='w-10 h-10 sm:w-12 sm:h-12 mx-auto rounded-xl sm:rounded-2xl flex items-center justify-center mb-2 shadow-lg bg-muted'>
                      <item.icon className='h-4 w-4 sm:h-5 sm:w-5 text-foreground/70' />
                    </div>
                    <p className='text-[10px] sm:text-xs text-muted-foreground font-semibold'>
                      {item.text}
                    </p>
                  </div>
                ))}
              </div>
            </motion.div>
          ) : (
            <ScrollArea className='h-full'>
              <div className='p-3 sm:p-6 space-y-2.5 sm:space-y-3'>
                <AnimatePresence mode='popLayout'>
                  {cart.cartItems.map((item) => {
                    const product = getProductData(item)
                    const isRemoving = removingItems.has(item._id)

                    if (!product)
                      return (
                        <div
                          key={item._id}
                          className='bg-destructive/10 border border-destructive/20 rounded-xl sm:rounded-2xl p-3 sm:p-4 text-center'
                        >
                          <AlertCircle className='h-5 w-5 sm:h-6 sm:w-6 text-destructive mx-auto mb-2' />
                          <p className='text-destructive text-xs sm:text-sm font-semibold'>
                            فشل تحميل بيانات المنتج
                          </p>
                        </div>
                      )

                    const discountPercent = product.priceAfterDiscount
                      ? Math.round(
                          ((product.price - product.priceAfterDiscount) / product.price) * 100
                        )
                      : 0

                    return (
                      <motion.div
                        key={item._id}
                        layout
                        initial={{ opacity: 0, y: 20 }}
                        animate={{
                          opacity: isRemoving ? 0.5 : 1,
                          y: 0,
                          scale: isRemoving ? 0.95 : 1,
                        }}
                        exit={{ opacity: 0, x: -100 }}
                        className={cn(
                          'group relative bg-card rounded-xl sm:rounded-2xl p-3 sm:p-4 border-2 transition-all duration-300',
                          isRemoving
                            ? 'border-destructive/20'
                            : 'border-border hover:border-primary/30 hover:shadow-xl'
                        )}
                      >
                        <div className='flex gap-3 sm:gap-4'>
                          {/* ✅ الصورة - responsive */}
                          <Link
                            href={`/product/${product._id}`}
                            onClick={() => onOpenChange(false)}
                            className='relative shrink-0'
                          >
                            <div className='relative w-20 h-20 sm:w-24 sm:h-24 rounded-lg sm:rounded-xl overflow-hidden bg-muted ring-2 ring-border'>
                              <Image
                                src={getImageUrl(product.imageCover)}
                                alt={product.title}
                                fill
                                className='object-cover'
                                onError={() => handleImageError(item._id)}
                              />
                              {discountPercent > 0 && (
                                <div className='absolute -top-1 -left-1 bg-red-500 text-white text-[9px] sm:text-xs font-bold px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-md sm:rounded-lg shadow-lg'>
                                  -{discountPercent}%
                                </div>
                              )}
                            </div>
                          </Link>

                          {/* ✅ المحتوى - responsive */}
                          <div className='flex-1 min-w-0 flex flex-col'>
                            <Link
                              href={`/product/${product._id}`}
                              onClick={() => onOpenChange(false)}
                            >
                              <h4 className='font-bold text-xs sm:text-sm leading-snug mb-1 sm:mb-1.5 line-clamp-2 text-foreground hover:text-primary transition-colors'>
                                {product.title}
                              </h4>
                            </Link>

                            {item.color && (
                              <div className='flex items-center gap-1 sm:gap-1.5 bg-muted/50 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-md sm:rounded-lg border border-border w-fit mb-1.5 sm:mb-2'>
                                <div
                                  className='w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full border border-background shadow-sm'
                                  style={{ backgroundColor: item.color }}
                                />
                                <span className='text-[9px] sm:text-[10px] font-semibold text-muted-foreground'>
                                  {item.color}
                                </span>
                              </div>
                            )}

                            <div className='mt-auto flex items-end justify-between gap-2 sm:gap-3'>
                              <div>
                                <div className='font-bold text-sm sm:text-base text-primary'>
                                  {formatPrice(item.price * item.quantity)}
                                </div>
                                {product.priceAfterDiscount && (
                                  <div className='text-[9px] sm:text-[10px] text-muted-foreground line-through'>
                                    {formatPrice(product.price * item.quantity)}
                                  </div>
                                )}
                              </div>

                              {/* ✅ أزرار الكمية - responsive */}
                              <div className='flex items-center bg-muted rounded-lg sm:rounded-xl border-2 border-border overflow-hidden'>
                                <Button
                                  size='icon'
                                  variant='ghost'
                                  className='h-7 w-7 sm:h-9 sm:w-9 hover:bg-background'
                                  onClick={() => updateQuantity(item._id, item.quantity - 1)}
                                  disabled={item.quantity <= 1 || isRemoving}
                                >
                                  <Minus className='h-3 w-3 sm:h-3.5 sm:w-3.5' strokeWidth={3} />
                                </Button>
                                <span className='w-8 sm:w-10 text-center text-xs sm:text-sm font-bold text-foreground'>
                                  {item.quantity}
                                </span>
                                <Button
                                  size='icon'
                                  variant='ghost'
                                  className='h-7 w-7 sm:h-9 sm:w-9 hover:bg-background'
                                  onClick={() => updateQuantity(item._id, item.quantity + 1)}
                                  disabled={isRemoving}
                                >
                                  <Plus className='h-3 w-3 sm:h-3.5 sm:w-3.5' strokeWidth={3} />
                                </Button>
                              </div>
                            </div>
                          </div>

                          {/* ✅ زر الحذف */}
                          <Button
                            size='icon'
                            variant='ghost'
                            className='absolute top-2 right-2 h-7 w-7 sm:h-8 sm:w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-full'
                            onClick={() => handleRemoveItem(item._id)}
                            disabled={isRemoving}
                          >
                            {isRemoving ? (
                              <Loader2 className='h-3.5 w-3.5 sm:h-4 sm:w-4 animate-spin' />
                            ) : (
                              <Trash2 className='h-3.5 w-3.5 sm:h-4 sm:w-4' />
                            )}
                          </Button>
                        </div>
                      </motion.div>
                    )
                  })}
                </AnimatePresence>
              </div>
            </ScrollArea>
          )}
        </div>

        {/* ==================== FOOTER ==================== */}
        {cart && itemsCount > 0 && (
          <div className='sticky bottom-0 border-t-2 border-border bg-card shadow-2xl'>
            <div className='p-4 sm:p-6 space-y-3 sm:space-y-4'>
              <div className='space-y-2 sm:space-y-2.5'>
                <div className='flex justify-between text-xs sm:text-sm'>
                  <span className='text-muted-foreground font-medium'>
                    المجموع الفرعي
                  </span>
                  <span className='font-bold text-foreground'>
                    {formatPrice(subtotal)}
                  </span>
                </div>

                {discount > 0 && (
                  <div className='flex justify-between items-center bg-green-500/10 -mx-4 sm:-mx-6 px-4 sm:px-6 py-2 sm:py-3 border-y border-green-500/20'>
                    <div className='flex items-center gap-1.5 sm:gap-2'>
                      <CheckCircle2 className='h-3.5 w-3.5 sm:h-4 sm:w-4 text-green-500' />
                      <span className='text-green-600 dark:text-green-400 font-bold text-xs sm:text-sm'>
                        وفرتي
                      </span>
                    </div>
                    <span className='font-bold text-green-600 dark:text-green-400 text-xs sm:text-base'>
                      {formatPrice(discount)}
                    </span>
                  </div>
                )}

                <Separator className='my-2 sm:my-3 opacity-50' />

                <div className='flex justify-between items-center'>
                  <span className='text-base sm:text-lg font-bold text-foreground'>
                    الإجمالي
                  </span>
                  <span className='text-xl sm:text-2xl font-bold text-primary'>
                    {formatPrice(total)}
                  </span>
                </div>
              </div>

              <div className='space-y-2 sm:space-y-2.5'>
                <Button
                  onClick={handleCheckout}
                  className='w-full h-12 sm:h-14 gold-gradient rounded-xl sm:rounded-2xl text-sm sm:text-base font-bold shadow-xl text-white'
                >
                  إتمام الطلب الآن 
                  <ArrowRight className='mr-2 h-4 w-4 sm:h-5 sm:w-5' />
                </Button>
                <Link href='/cart' onClick={() => onOpenChange(false)}>
                  <Button
                    variant='outline'
                    className='w-full h-10 sm:h-12 border-2 border-border hover:bg-muted rounded-xl sm:rounded-2xl font-bold text-sm'
                  >
                    عرض السلة الكاملة
                  </Button>
                </Link>
              </div>

              <div className='pt-3 sm:pt-4 border-t border-border space-y-1.5 sm:space-y-2'>
                {[
                  { icon: Shield, text: 'دفع آمن 100%', color: 'text-green-500' },
                  { icon: Package, text: 'شحن لجميع المحافظات', color: 'text-blue-500' },
                  { icon: RotateCcw, text: 'إرجاع خلال 14 يوم', color: 'text-purple-500' },
                ].map((item, i) => (
                  <div key={i} className='flex items-center gap-2 sm:gap-3'>
                    <item.icon className={cn('h-3.5 w-3.5 sm:h-4 sm:w-4', item.color)} />
                    <span className='text-[10px] sm:text-xs text-muted-foreground font-semibold'>
                      {item.text}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  )
}