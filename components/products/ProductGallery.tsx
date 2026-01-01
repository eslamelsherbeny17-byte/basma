'use client'

import { useState } from 'react'
import Image from 'next/image'
import { ChevronLeft, ChevronRight, Maximize2 } from 'lucide-react'
import { cn, getImageUrl } from '@/lib/utils'
import { Button } from '@/components/ui/button'

export function ProductGallery({ images, title }: { images: string[], title: string }) {
  const [selectedImage, setSelectedImage] = useState(0)

  return (
    <div className='flex flex-col gap-6'>
      {/* الحاوية الرئيسية للصورة - تم تكبير الأبعاد لتكون فخمة */}
      <div className='relative aspect-[4/5] bg-muted/20 rounded-[2.5rem] overflow-hidden border border-border/50 shadow-sm group'>
        <Image 
          src={getImageUrl(images[selectedImage])} 
          alt={title} 
          fill 
          // ✅ التعديل السحري: object-cover لملء المساحة و object-top لإظهار الرأس والتفاصيل العلوية
          className='object-cover object-top transition-transform duration-1000 group-hover:scale-105' 
          priority 
          sizes="(max-width: 768px) 100vw, 60vw"
        />
        
        {/* أسهم التنقل - تصميم أنيق يظهر بوضوح عند الحاجة */}
        {images.length > 1 && (
          <div className="absolute inset-x-6 top-1/2 -translate-y-1/2 flex justify-between pointer-events-none">
            <Button 
              variant='secondary' size='icon' 
              className='h-12 w-12 rounded-full bg-white/90 backdrop-blur-md shadow-xl pointer-events-auto opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-all duration-300 hover:bg-primary hover:text-white border-none'
              onClick={() => setSelectedImage((prev) => (prev - 1 + images.length) % images.length)}
            >
              <ChevronRight className='h-7 w-7' />
            </Button>
            <Button 
              variant='secondary' size='icon' 
              className='h-12 w-12 rounded-full bg-white/90 backdrop-blur-md shadow-xl pointer-events-auto opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-all duration-300 hover:bg-primary hover:text-white border-none'
              onClick={() => setSelectedImage((prev) => (prev + 1) % images.length)}
            >
              <ChevronLeft className='h-7 w-7' />
            </Button>
          </div>
        )}

        {/* أيقونة تكبير جمالية لإعطاء طابع احترافي */}
        <div className="absolute top-6 right-6 p-3 bg-white/80 backdrop-blur-md rounded-2xl shadow-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <Maximize2 className="h-5 w-5 text-muted-foreground" />
        </div>
      </div>

      {/* المصغرات (Thumbnails) - تمرير أفقي انسيابي */}
      <div className='flex gap-4 overflow-x-auto pb-4 scrollbar-hide snap-x px-2'>
        {images.map((image, index) => (
          <button 
            key={index} 
            onClick={() => setSelectedImage(index)} 
            className={cn(
              'relative h-28 w-24 flex-shrink-0 rounded-2xl overflow-hidden border-2 transition-all duration-300 snap-start',
              selectedImage === index 
                ? 'border-primary ring-4 ring-primary/10 shadow-lg scale-95' 
                : 'border-transparent hover:border-muted-foreground/30 opacity-70 hover:opacity-100'
            )}
          >
            <Image src={getImageUrl(image)} alt={`${title} ${index}`} fill className='object-cover' />
          </button>
        ))}
      </div>
    </div>
  )
}
