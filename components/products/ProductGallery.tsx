'use client'

import { useState } from 'react'
import Image from 'next/image'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { cn, getImageUrl } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { useLanguage } from "@/contexts/LanguageContext"

export function ProductGallery({ images, title }: { images: string[], title: string }) {
  const [selectedImage, setSelectedImage] = useState(0)
  const { t } = useLanguage()

  const nextImage = () => setSelectedImage((prev) => (prev + 1) % images.length)
  const prevImage = () => setSelectedImage((prev) => (prev - 1 + images.length) % images.length)

  return (
    <div className='space-y-4'>
      <div className='relative aspect-[3/4] bg-muted rounded-lg overflow-hidden group border border-border'>
        <Image src={getImageUrl(images[selectedImage])} alt={title} fill className='object-cover' priority />
        {images.length > 1 && (
          <>
            <Button variant='secondary' size='icon' className='absolute left-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 bg-background/50 backdrop-blur-sm' onClick={prevImage}>
              <ChevronLeft className='h-4 w-4' />
            </Button>
            <Button variant='secondary' size='icon' className='absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 bg-background/50 backdrop-blur-sm' onClick={nextImage}>
              <ChevronRight className='h-4 w-4' />
            </Button>
          </>
        )}
      </div>
      <div className='grid grid-cols-4 gap-2'>
        {images.map((image, index) => (
          <button key={index} onClick={() => setSelectedImage(index)} className={cn('relative aspect-square rounded-lg overflow-hidden border-2 transition-all', selectedImage === index ? 'border-primary' : 'border-transparent hover:border-border')}>
            <Image src={getImageUrl(image)} alt={`${title} ${index}`} fill className='object-cover' />
          </button>
        ))}
      </div>
    </div>
  )
}