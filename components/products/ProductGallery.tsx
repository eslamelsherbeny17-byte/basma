'use client'

import { useState } from 'react'
import Image from 'next/image'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { cn, getImageUrl } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { useLanguage } from "@/contexts/LanguageContext"

export function ProductGallery({ images, title }: { images: string[], title: string }) {
  const [selectedImage, setSelectedImage] = useState(0)

  return (
    <div className='flex flex-col gap-4'>
      {/* Main Image Container */}
      <div className='relative aspect-square md:aspect-[4/5] bg-card rounded-3xl overflow-hidden border border-border shadow-inner group'>
        <Image 
          src={getImageUrl(images[selectedImage])} 
          alt={title} 
          fill 
          className='object-contain md:object-cover transition-all duration-500' 
          priority 
          sizes="(max-width: 768px) 100vw, 50vw"
        />
        
        {/* Navigation Arrows - تظهر بوضوح في الموبايل */}
        {images.length > 1 && (
          <div className="absolute inset-x-4 top-1/2 -translate-y-1/2 flex justify-between pointer-events-none">
            <Button 
              variant='secondary' size='icon' 
              className='h-10 w-10 rounded-full bg-background/80 backdrop-blur-md shadow-lg pointer-events-auto opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-all'
              onClick={() => setSelectedImage((prev) => (prev - 1 + images.length) % images.length)}
            >
              <ChevronRight className='h-6 w-6' />
            </Button>
            <Button 
              variant='secondary' size='icon' 
              className='h-10 w-10 rounded-full bg-background/80 backdrop-blur-md shadow-lg pointer-events-auto opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-all'
              onClick={() => setSelectedImage((prev) => (prev + 1) % images.length)}
            >
              <ChevronLeft className='h-6 w-6' />
            </Button>
          </div>
        )}
      </div>

      {/* Thumbnails - تمرير أفقي للموبايل */}
      <div className='flex gap-3 overflow-x-auto pb-2 scrollbar-hide snap-x'>
        {images.map((image, index) => (
          <button 
            key={index} 
            onClick={() => setSelectedImage(index)} 
            className={cn(
              'relative h-20 w-20 flex-shrink-0 rounded-xl overflow-hidden border-2 transition-all snap-start',
              selectedImage === index ? 'border-primary shadow-md' : 'border-transparent hover:border-muted-foreground/30'
            )}
          >
            <Image src={getImageUrl(image)} alt={`${title} ${index}`} fill className='object-cover' />
          </button>
        ))}
      </div>
    </div>
  )
}