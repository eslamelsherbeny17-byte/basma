'use client'

import { useState } from 'react'
import { Minus, Plus, ShoppingCart, Heart } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Product } from '@/lib/types'
import { cn } from '@/lib/utils'
import { useCart } from '@/contexts/CartContext'
import { useWishlist } from '@/contexts/WishlistContext'
import { toast } from 'sonner'
import { Label } from '@/components/ui/label'

export function AddToCartSection({ product }: { product: Product }) {
  const { addItem } = useCart()
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist()

  const [quantity, setQuantity] = useState(1)
  const [selectedSize, setSelectedSize] = useState<string | null>(
    product.sizes?.[0] || null
  )
  const [selectedColor, setSelectedColor] = useState<string | null>(
    product.colors?.[0] || null
  )
  const [isLoading, setIsLoading] = useState(false)

  const inWishlist = isInWishlist(product._id)

  const handleAddToCart = async () => {
    if (product.quantity === 0) {
      toast.error('نفذت الكمية')
      return
    }
    setIsLoading(true)
    try {
      await addItem({
        productId: product._id,
        quantity,
        size: selectedSize || undefined,
        color: selectedColor || undefined,
      })
      toast.success('تمت الإضافة للسلة! 🛒')
    } catch (error: any) {
      toast.error('حدث خطأ')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className='space-y-6 text-foreground'>
      {/* Size Selector */}
      {product.sizes && product.sizes.length > 0 && (
        <div className='space-y-3'>
          <Label className='text-sm font-bold opacity-80'>المقاس</Label>
          <div className='flex flex-wrap gap-2'>
            {product.sizes.map((size) => (
              <Button
                key={size}
                variant={selectedSize === size ? 'default' : 'outline'}
                onClick={() => setSelectedSize(size)}
                className={cn(
                  'h-10 min-w-[50px]',
                  selectedSize === size && 'gold-gradient text-white border-0'
                )}
              >
                {size}
              </Button>
            ))}
          </div>
        </div>
      )}

      {/* Color Selector */}
      {product.colors && product.colors.length > 0 && (
        <div className='space-y-3'>
          <Label className='text-sm font-bold opacity-80'>اللون</Label>
          <div className='flex gap-3'>
            {product.colors.map((color) => (
              <button
                key={color}
                onClick={() => setSelectedColor(color)}
                className={cn(
                  'w-10 h-10 rounded-full border-2 transition-all',
                  selectedColor === color
                    ? 'ring-2 ring-primary ring-offset-2 dark:ring-offset-background border-transparent'
                    : 'border-border'
                )}
                style={{ backgroundColor: color }}
              />
            ))}
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className='flex gap-3'>
        <div className='flex items-center border border-border rounded-lg bg-muted/30'>
          <Button
            variant='ghost'
            size='icon'
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
          >
            <Minus className='h-4 w-4' />
          </Button>
          <span className='w-10 text-center font-bold'>{quantity}</span>
          <Button
            variant='ghost'
            size='icon'
            onClick={() =>
              setQuantity((q) => Math.min(product.quantity, q + 1))
            }
          >
            <Plus className='h-4 w-4' />
          </Button>
        </div>

        <Button
          onClick={handleAddToCart}
          disabled={isLoading || product.quantity === 0}
          className='flex-1 gold-gradient text-white h-12 shadow-lg'
        >
          <ShoppingCart className='ml-2 h-5 w-5' />
          {isLoading ? 'جاري الإضافة...' : 'أضف للسلة'}
        </Button>

        <Button
          variant='outline'
          size='icon'
          onClick={() =>
            inWishlist
              ? removeFromWishlist(product._id)
              : addToWishlist(product._id)
          }
          className='h-12 w-12'
        >
          <Heart
            className={cn(
              'h-5 w-5',
              inWishlist
                ? 'fill-destructive text-destructive'
                : 'text-muted-foreground'
            )}
          />
        </Button>
      </div>

      <div className='pt-4 border-t border-border space-y-2 text-xs text-muted-foreground'>
        <div className='flex justify-between'>
          <span>الحالة:</span>
          <span className='text-foreground font-bold'>
            {product.quantity > 0 ? 'متوفر' : 'غير متوفر'}
          </span>
        </div>
      </div>
    </div>
  )
}
