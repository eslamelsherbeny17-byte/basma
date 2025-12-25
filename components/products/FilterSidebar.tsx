'use client'

import { ScrollArea } from '@/components/ui/scroll-area'
import { useState } from 'react'
import { Separator } from '@/components/ui/separator'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { Slider } from '@/components/ui/slider'
import { cn } from '@/lib/utils'
import { SlidersHorizontal } from 'lucide-react'

export function FilterSidebar({ categories, brands, onFilterChange }: any) {
  const [priceRange, setPriceRange] = useState([0, 5000])

  const FilterContent = () => (
    <div className='space-y-6 text-foreground p-1'>
      <div className='flex items-center justify-between'>
        <h3 className='font-bold'>الفلاتر</h3>
        <Button variant='ghost' size='sm' className='text-xs'>
          مسح الكل
        </Button>
      </div>

      <Separator className='bg-border' />

      <div className='space-y-4'>
        <h4 className='text-sm font-bold'>السعر</h4>
        <Slider
          min={0}
          max={5000}
          step={50}
          value={priceRange}
          onValueChange={setPriceRange}
        />
        <div className='flex justify-between text-xs text-muted-foreground'>
          <span>{priceRange[0]} ج.م</span>
          <span>{priceRange[1]} ج.م</span>
        </div>
      </div>

      <Separator className='bg-border' />

      {/* Categories */}
      <div className='space-y-3'>
        <h4 className='text-sm font-bold'>الفئات</h4>
        <div className='space-y-2'>
          {categories?.map((cat: any) => (
            <div key={cat._id} className='flex items-center gap-2'>
              <Checkbox id={cat._id} className='border-border' />
              <label htmlFor={cat._id} className='text-sm cursor-pointer'>
                {cat.nameAr || cat.name}
              </label>
            </div>
          ))}
        </div>
      </div>

      <Button className='w-full gold-gradient text-white'>تطبيق</Button>
    </div>
  )

  return (
    <>
      <aside className='hidden lg:block w-72 flex-shrink-0'>
        <div className='sticky top-24 bg-card text-card-foreground border border-border rounded-xl p-6 shadow-sm'>
          <ScrollArea className='h-[calc(100vh-12rem)]'>
            <FilterContent />
          </ScrollArea>
        </div>
      </aside>

      <Sheet>
        <SheetTrigger asChild>
          <Button
            variant='outline'
            className='lg:hidden fixed bottom-6 left-6 z-50 shadow-2xl bg-card border-primary/20'
          >
            <SlidersHorizontal className='ml-2 h-4 w-4' /> الفلاتر
          </Button>
        </SheetTrigger>
        <SheetContent className='bg-card border-border'>
          <SheetHeader>
            <SheetTitle>تصفية المنتجات</SheetTitle>
          </SheetHeader>
          <div className='mt-6'>
            <FilterContent />
          </div>
        </SheetContent>
      </Sheet>
    </>
  )
}
