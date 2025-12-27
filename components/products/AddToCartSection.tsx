'use client'

import { useState } from 'react'
import { Minus, Plus, ShoppingCart } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { useCart } from '@/contexts/CartContext'
import { toast } from 'sonner'
import { Label } from '@/components/ui/label'

export function AddToCartSection({ product, onAuthCheck }: { product: any, onAuthCheck: (cb: () => void) => void }) {
  const { addItem } = useCart()
  const [quantity, setQuantity] = useState(1)
  const [selectedSize, setSelectedSize] = useState(product.sizes?.[0])
  const [selectedColor, setSelectedColor] = useState(product.colors?.[0])

  const handleAddToCart = () => {
    onAuthCheck(async () => {
      try {
        await addItem({ productId: product._id, quantity, size: selectedSize, color: selectedColor })
        toast.success('تمت الإضافة بنجاح ✨')
      } catch (err) {
        toast.error('حدث خطأ أثناء الإضافة')
      }
    })
  }

  return (
    <div className="space-y-8">
      {/* الألوان - عرض احترافي ✅ */}
      {product.colors?.length > 0 && (
        <div className="space-y-4">
          <Label className="text-sm font-black uppercase tracking-widest text-muted-foreground">
            اللون: <span className="text-foreground">{selectedColor}</span>
          </Label>
          <div className="flex flex-wrap gap-3">
            {product.colors.map((color: string) => (
              <button
                key={color}
                onClick={() => setSelectedColor(color)}
                className={cn(
                  "w-10 h-10 rounded-full border-2 transition-all p-0.5",
                  selectedColor === color ? "border-primary scale-110" : "border-transparent"
                )}
              >
                <div 
                  className="w-full h-full rounded-full border border-black/10" 
                  style={{ backgroundColor: color }} 
                />
              </button>
            ))}
          </div>
        </div>
      )}

      {/* المقاسات ✅ */}
      {product.sizes?.length > 0 && (
        <div className="space-y-4">
          <Label className="text-sm font-black uppercase tracking-widest text-muted-foreground">المقاس</Label>
          <div className="flex flex-wrap gap-2">
            {product.sizes.map((size: string) => (
              <Button
                key={size}
                variant={selectedSize === size ? 'default' : 'outline'}
                onClick={() => setSelectedSize(size)}
                className={cn(
                  "h-12 min-w-[60px] rounded-xl border-2 font-bold",
                  selectedSize === size ? "gold-gradient border-none text-white shadow-lg" : "hover:border-primary"
                )}
              >
                {size}
              </Button>
            ))}
          </div>
        </div>
      )}

      {/* التحكم في الكمية والزر الرئيسي ✅ */}
      <div className="flex flex-col sm:flex-row gap-4 pt-4">
        <div className="flex items-center justify-between bg-muted/40 rounded-2xl p-1 h-14 w-full sm:w-40 border border-border/50">
          <Button variant="ghost" size="icon" className="rounded-xl" onClick={() => setQuantity(Math.max(1, quantity - 1))}>
            <Minus className="h-5 w-5" />
          </Button>
          <span className="text-lg font-black">{quantity}</span>
          <Button variant="ghost" size="icon" className="rounded-xl" onClick={() => setQuantity(quantity + 1)}>
            <Plus className="h-5 w-5" />
          </Button>
        </div>

        <Button 
          className="flex-1 h-14 rounded-2xl gold-gradient text-white text-lg font-black shadow-xl active:scale-95 transition-all"
          onClick={handleAddToCart}
        >
          <ShoppingCart className="ml-2 h-6 w-6" /> أضف إلى السلة
        </Button>
      </div>
    </div>
  )
}