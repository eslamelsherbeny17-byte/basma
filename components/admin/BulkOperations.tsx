// components/admin/BulkOperations.tsx
'use client'

import { useState } from 'react'
import { Download, Trash2, Tag, DollarSign, X, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu'
import { useToast } from '@/hooks/use-toast'

interface BulkOperationsProps {
  selectedProducts: string[]
  onClearSelection: () => void
  onBulkUpdate: (operation: string, value?: any) => Promise<void>
}

export function BulkOperations({
  selectedProducts,
  onClearSelection,
  onBulkUpdate,
}: BulkOperationsProps) {
  const { toast } = useToast()
  const [isUpdatePriceOpen, setIsUpdatePriceOpen] = useState(false)
  const [isUpdateStockOpen, setIsUpdateStockOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [priceValue, setPriceValue] = useState('')
  const [stockValue, setStockValue] = useState('')
  const [priceType, setPriceType] = useState<'increase' | 'decrease' | 'set'>('set')

  if (selectedProducts.length === 0) return null

  const handleBulkDelete = async () => {
    if (
      !confirm(
        `هل أنت متأكد من حذف ${selectedProducts.length} منتج؟ هذا الإجراء لا يمكن التراجع عنه.`
      )
    ) return

    try {
      setLoading(true)
      await onBulkUpdate('delete')
      toast({ 
        title: '✅ تم الحذف', 
        description: `تم حذف ${selectedProducts.length} منتج بنجاح` 
      })
      onClearSelection()
    } catch (error) {
      toast({ 
        title: '❌ خطأ', 
        description: 'فشل حذف المنتجات', 
        variant: 'destructive' 
      })
    } finally {
      setLoading(false)
    }
  }

  const handleUpdatePrice = async () => {
    if (!priceValue || parseFloat(priceValue) <= 0) {
      toast({ 
        title: '⚠️ تنبيه', 
        description: 'أدخل قيمة صحيحة', 
        variant: 'destructive' 
      })
      return
    }

    try {
      setLoading(true)
      await onBulkUpdate('updatePrice', { type: priceType, value: parseFloat(priceValue) })
      toast({ 
        title: '✅ تم التحديث', 
        description: `تم تحديث أسعار ${selectedProducts.length} منتج` 
      })
      setIsUpdatePriceOpen(false)
      setPriceValue('')
      onClearSelection()
    } catch (error) {
      toast({ 
        title: '❌ خطأ', 
        description: 'فشل تحديث الأسعار', 
        variant: 'destructive' 
      })
    } finally {
      setLoading(false)
    }
  }

  const handleUpdateStock = async () => {
    if (!stockValue || parseInt(stockValue) < 0) {
      toast({ 
        title: '⚠️ تنبيه', 
        description: 'أدخل كمية صحيحة', 
        variant: 'destructive' 
      })
      return
    }

    try {
      setLoading(true)
      await onBulkUpdate('updateStock', parseInt(stockValue))
      toast({ 
        title: '✅ تم التحديث', 
        description: `تم تحديث مخزون ${selectedProducts.length} منتج` 
      })
      setIsUpdateStockOpen(false)
      setStockValue('')
      onClearSelection()
    } catch (error) {
      toast({ 
        title: '❌ خطأ', 
        description: 'فشل تحديث المخزون', 
        variant: 'destructive' 
      })
    } finally {
      setLoading(false)
    }
  }

  const handleExport = () => {
    toast({ 
      title: '📥 جاري التصدير...', 
      description: 'سيتم تنزيل الملف قريباً' 
    })
  }

  return (
    <>
      {/* Desktop Version */}
      <div className='hidden md:block fixed bottom-6 left-1/2 -translate-x-1/2 z-50'>
        <div className='bg-primary text-white rounded-full shadow-2xl px-6 py-4 flex items-center gap-4 animate-in slide-in-from-bottom duration-300'>
          <span className='font-semibold text-sm'>
            تم تحديد {selectedProducts.length} منتج
          </span>

          <div className='h-6 w-px bg-white/30' />

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant='secondary' size='sm' className='font-bold'>
                عمليات جماعية
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align='end' className='w-56'>
              <DropdownMenuItem onSelect={() => setIsUpdatePriceOpen(true)}>
                <DollarSign className='ml-2 h-4 w-4' />
                تحديث الأسعار
              </DropdownMenuItem>

              <DropdownMenuItem onSelect={() => setIsUpdateStockOpen(true)}>
                <Tag className='ml-2 h-4 w-4' />
                تحديث المخزون
              </DropdownMenuItem>

              <DropdownMenuItem onSelect={handleExport}>
                <Download className='ml-2 h-4 w-4' />
                تصدير المحددة
              </DropdownMenuItem>

              <DropdownMenuSeparator />

              <DropdownMenuItem
                className='text-destructive focus:text-destructive'
                onClick={handleBulkDelete}
                disabled={loading}
              >
                {loading ? (
                  <Loader2 className='ml-2 h-4 w-4 animate-spin' />
                ) : (
                  <Trash2 className='ml-2 h-4 w-4' />
                )}
                حذف المحددة
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button 
            variant='ghost' 
            size='sm' 
            onClick={onClearSelection}
            className='hover:bg-white/20'
          >
            <X className='h-4 w-4' />
          </Button>
        </div>
      </div>

      {/* Mobile Version */}
      <div className='md:hidden fixed bottom-0 left-0 right-0 z-50 p-4 bg-background border-t shadow-lg animate-in slide-in-from-bottom duration-300'>
        <div className='space-y-3'>
          <div className='flex items-center justify-between'>
            <span className='font-semibold text-sm'>
              {selectedProducts.length} محدد
            </span>
            <Button variant='ghost' size='sm' onClick={onClearSelection}>
              <X className='h-4 w-4' />
            </Button>
          </div>
          <div className='grid grid-cols-2 gap-2'>
            <Button
              variant='outline'
              size='sm'
              onClick={() => setIsUpdatePriceOpen(true)}
              className='h-9'
            >
              <DollarSign className='ml-2 h-3 w-3' />
              الأسعار
            </Button>
            <Button
              variant='outline'
              size='sm'
              onClick={() => setIsUpdateStockOpen(true)}
              className='h-9'
            >
              <Tag className='ml-2 h-3 w-3' />
              المخزون
            </Button>
          </div>
          <Button
            variant='destructive'
            size='sm'
            className='w-full h-9'
            onClick={handleBulkDelete}
            disabled={loading}
          >
            {loading ? (
              <Loader2 className='ml-2 h-3 w-3 animate-spin' />
            ) : (
              <Trash2 className='ml-2 h-3 w-3' />
            )}
            حذف المحددة
          </Button>
        </div>
      </div>

      {/* Update Price Dialog */}
      <Dialog open={isUpdatePriceOpen} onOpenChange={setIsUpdatePriceOpen}>
        <DialogContent className='w-[95vw] max-w-md'>
          <DialogHeader>
            <DialogTitle className='text-right'>تحديث الأسعار الجماعي</DialogTitle>
            <DialogDescription className='text-right'>
              تحديث أسعار {selectedProducts.length} منتج
            </DialogDescription>
          </DialogHeader>
          <div className='space-y-4 pt-2'>
            <div className='space-y-2'>
              <Label className='text-sm font-bold'>نوع التحديث</Label>
              <div className='grid grid-cols-3 gap-2'>
                <Button
                  variant={priceType === 'set' ? 'default' : 'outline'}
                  onClick={() => setPriceType('set')}
                  size='sm'
                  className='h-9'
                >
                  تعيين
                </Button>
                <Button
                  variant={priceType === 'increase' ? 'default' : 'outline'}
                  onClick={() => setPriceType('increase')}
                  size='sm'
                  className='h-9'
                >
                  زيادة
                </Button>
                <Button
                  variant={priceType === 'decrease' ? 'default' : 'outline'}
                  onClick={() => setPriceType('decrease')}
                  size='sm'
                  className='h-9'
                >
                  تخفيض
                </Button>
              </div>
            </div>

            <div className='space-y-2'>
              <Label htmlFor='price' className='text-sm font-bold'>
                {priceType === 'set'
                  ? 'السعر الجديد'
                  : priceType === 'increase'
                  ? 'نسبة الزيادة (%)'
                  : 'نسبة التخفيض (%)'}
              </Label>
              <Input
                id='price'
                type='number'
                min='0'
                step='0.01'
                placeholder={priceType === 'set' ? '599' : '10'}
                value={priceValue}
                onChange={(e) => setPriceValue(e.target.value)}
                className='h-11'
              />
            </div>

            <Button 
              className='w-full h-11 font-bold' 
              onClick={handleUpdatePrice}
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className='ml-2 h-4 w-4 animate-spin' />
                  جاري التحديث...
                </>
              ) : (
                'تحديث الأسعار'
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Update Stock Dialog */}
      <Dialog open={isUpdateStockOpen} onOpenChange={setIsUpdateStockOpen}>
        <DialogContent className='w-[95vw] max-w-md'>
          <DialogHeader>
            <DialogTitle className='text-right'>تحديث المخزون الجماعي</DialogTitle>
            <DialogDescription className='text-right'>
              تحديث مخزون {selectedProducts.length} منتج
            </DialogDescription>
          </DialogHeader>
          <div className='space-y-4 pt-2'>
            <div className='space-y-2'>
              <Label htmlFor='stock' className='text-sm font-bold'>الكمية الجديدة</Label>
              <Input
                id='stock'
                type='number'
                min='0'
                placeholder='50'
                value={stockValue}
                onChange={(e) => setStockValue(e.target.value)}
                className='h-11'
              />
            </div>

            <Button 
              className='w-full h-11 font-bold' 
              onClick={handleUpdateStock}
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className='ml-2 h-4 w-4 animate-spin' />
                  جاري التحديث...
                </>
              ) : (
                'تحديث المخزون'
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}