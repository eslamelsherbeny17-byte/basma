'use client'

import { useState } from 'react'
import { Download, Upload, Trash2, Tag, DollarSign } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from '@/components/ui/dialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu'

interface BulkOperationsProps {
  selectedProducts: string[]
  onClearSelection: () => void
  onBulkUpdate: (operation: string, value?: any) => void
}

export function BulkOperations({
  selectedProducts,
  onClearSelection,
  onBulkUpdate,
}: BulkOperationsProps) {
  const [isUpdatePriceOpen, setIsUpdatePriceOpen] = useState(false)
  const [isUpdateStockOpen, setIsUpdateStockOpen] = useState(false)
  const [priceValue, setPriceValue] = useState('')
  const [stockValue, setStockValue] = useState('')
  const [priceType, setPriceType] = useState<'increase' | 'decrease' | 'set'>(
    'set'
  )

  if (selectedProducts.length === 0) return null

  const handleBulkDelete = () => {
    if (
      confirm(
        `هل أنت متأكد من حذف ${selectedProducts.length} منتج؟ هذا الإجراء لا يمكن التراجع عنه.`
      )
    ) {
      onBulkUpdate('delete')
      onClearSelection()
    }
  }

  const handleUpdatePrice = () => {
    if (!priceValue) return

    onBulkUpdate('updatePrice', {
      type: priceType,
      value: parseFloat(priceValue),
    })
    setIsUpdatePriceOpen(false)
    setPriceValue('')
  }

  const handleUpdateStock = () => {
    if (!stockValue) return

    onBulkUpdate('updateStock', parseInt(stockValue))
    setIsUpdateStockOpen(false)
    setStockValue('')
  }

  return (
    <div className='fixed bottom-6 left-1/2 -translate-x-1/2 z-50'>
      <div className='bg-primary text-white rounded-full shadow-2xl px-6 py-4 flex items-center gap-4'>
        <span className='font-semibold'>
          تم تحديد {selectedProducts.length} منتج
        </span>

        <div className='h-6 w-px bg-white/30' />

        {/* Bulk Actions Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant='secondary' size='sm'>
              عمليات جماعية
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align='end' className='w-56'>
            <Dialog
              open={isUpdatePriceOpen}
              onOpenChange={setIsUpdatePriceOpen}
            >
              <DialogTrigger asChild>
                <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                  <DollarSign className='ml-2 h-4 w-4' />
                  تحديث الأسعار
                </DropdownMenuItem>
              </DialogTrigger>
            </Dialog>

            <Dialog
              open={isUpdateStockOpen}
              onOpenChange={setIsUpdateStockOpen}
            >
              <DialogTrigger asChild>
                <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                  <Tag className='ml-2 h-4 w-4' />
                  تحديث المخزون
                </DropdownMenuItem>
              </DialogTrigger>
            </Dialog>

            <DropdownMenuItem>
              <Download className='ml-2 h-4 w-4' />
              تصدير المحددة
            </DropdownMenuItem>

            <DropdownMenuSeparator />

            <DropdownMenuItem
              className='text-destructive focus:text-destructive'
              onClick={handleBulkDelete}
            >
              <Trash2 className='ml-2 h-4 w-4' />
              حذف المحددة
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <Button variant='ghost' size='sm' onClick={onClearSelection}>
          إلغاء
        </Button>

        {/* Update Price Dialog */}
        <DialogContent>
          <DialogHeader>
            <DialogTitle>تحديث الأسعار الجماعي</DialogTitle>
            <DialogDescription>
              تحديث أسعار {selectedProducts.length} منتج
            </DialogDescription>
          </DialogHeader>
          <div className='space-y-4'>
            <div className='space-y-2'>
              <Label>نوع التحديث</Label>
              <div className='grid grid-cols-3 gap-2'>
                <Button
                  variant={priceType === 'set' ? 'default' : 'outline'}
                  onClick={() => setPriceType('set')}
                >
                  تعيين
                </Button>
                <Button
                  variant={priceType === 'increase' ? 'default' : 'outline'}
                  onClick={() => setPriceType('increase')}
                >
                  زيادة
                </Button>
                <Button
                  variant={priceType === 'decrease' ? 'default' : 'outline'}
                  onClick={() => setPriceType('decrease')}
                >
                  تخفيض
                </Button>
              </div>
            </div>

            <div className='space-y-2'>
              <Label htmlFor='price'>
                {priceType === 'set'
                  ? 'السعر الجديد'
                  : priceType === 'increase'
                  ? 'نسبة الزيادة (%)'
                  : 'نسبة التخفيض (%)'}
              </Label>
              <Input
                id='price'
                type='number'
                placeholder={priceType === 'set' ? '599' : '10'}
                value={priceValue}
                onChange={(e) => setPriceValue(e.target.value)}
              />
            </div>

            <Button className='w-full' onClick={handleUpdatePrice}>
              تحديث الأسعار
            </Button>
          </div>
        </DialogContent>

        {/* Update Stock Dialog */}
        <DialogContent>
          <DialogHeader>
            <DialogTitle>تحديث المخزون الجماعي</DialogTitle>
            <DialogDescription>
              تحديث مخزون {selectedProducts.length} منتج
            </DialogDescription>
          </DialogHeader>
          <div className='space-y-4'>
            <div className='space-y-2'>
              <Label htmlFor='stock'>الكمية الجديدة</Label>
              <Input
                id='stock'
                type='number'
                placeholder='50'
                value={stockValue}
                onChange={(e) => setStockValue(e.target.value)}
              />
            </div>

            <Button className='w-full' onClick={handleUpdateStock}>
              تحديث المخزون
            </Button>
          </div>
        </DialogContent>
      </div>
    </div>
  )
}
