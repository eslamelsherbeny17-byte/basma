"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { ChevronLeft, ChevronRight, ArrowRight, Loader2 } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { useLanguage } from "@/contexts/LanguageContext"
import { cn, getImageUrl } from "@/lib/utils"
import { motion, useMotionValue, animate } from "framer-motion"
import { productsAPI } from "@/lib/api"

export default function HeroSlider() {
  const { language, isRTL } = useLanguage()
  const [currentIndex, setCurrentIndex] = useState(0)
  const [slides, setSlides] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  
  const x = useMotionValue(0)
  const containerRef = useRef<HTMLDivElement>(null)

  // --- جلب أحدث المنتجات (New Arrivals) لضمان تجدد السلايدر دايماً ---
  useEffect(() => {
    const fetchLatestProducts = async () => {
      try {
        setLoading(true)
        // جلب المنتجات مرتبة من الأحدث للأقدم (-createdAt) 
        // أو يمكنك استخدام (-sold) لعرض الأكثر مبيعاً
        const response = await productsAPI.getAll({ sort: "-createdAt", limit: 5 })
        
        const dynamicSlides = response.data.map((product: any) => ({
          id: product._id,
          title: product.title,
          // لو المنتج عليه خصم نظهر كلمة "عرض خاص"، لو مفيش نكتب "وصل حديثاً"
          subtitle: product.priceAfterDiscount 
            ? (language === 'ar' ? "عرض لفترة محدودة 🔥" : "Limited Offer 🔥")
            : (language === 'ar' ? "وصل حديثاً ✨" : "New Arrival ✨"),
          description: product.description,
          image: product.imageCover,
          link: `/product/${product._id}`,
        }))

        setSlides(dynamicSlides)
      } catch (error) {
        console.error("Failed to fetch products for slider:", error)
        // بيانات احتياطية بسيطة جداً عشان الموقع ميبقاش "أقرع" لو السيرفر وقع
        setSlides([
          { id: 'fallback', title: "أحدث صيحات الموضة", subtitle: "2025 ✨", image: "/slider-1.jpg", link: "/shop" },
        ])
      } finally {
        setLoading(false)
      }
    }
    fetchLatestProducts()
  }, [language])

  const scrollTo = useCallback((index: number) => {
    if (!containerRef.current || slides.length === 0) return
    const width = containerRef.current.offsetWidth
    animate(x, isRTL ? (index * width) : (-index * width), {
      type: "spring",
      stiffness: 260,
      damping: 30,
    })
    setCurrentIndex(index)
  }, [isRTL, slides.length, x])

  const next = useCallback(() => {
    if (slides.length === 0) return
    const nextIndex = (currentIndex + 1) % slides.length
    scrollTo(nextIndex)
  }, [currentIndex, slides.length, scrollTo])

  const prev = useCallback(() => {
    if (slides.length === 0) return
    const prevIndex = (currentIndex - 1 + slides.length) % slides.length
    scrollTo(prevIndex)
  }, [currentIndex, slides.length, scrollTo])

  const onDragEnd = (e: any, info: any) => {
    const threshold = 50
    if (info.offset.x < -threshold) isRTL ? prev() : next()
    else if (info.offset.x > threshold) isRTL ? next() : prev()
    else scrollTo(currentIndex)
  }

  useEffect(() => {
    if (slides.length <= 1) return // مفيش داعي للتقليب لو هي صورة واحدة
    const timer = setInterval(next, 6000)
    return () => clearInterval(timer)
  }, [next, slides.length])

  useEffect(() => {
    scrollTo(currentIndex)
  }, [isRTL, scrollTo, currentIndex])

  if (loading) {
    return (
      <div className="w-full h-[500px] sm:h-[600px] flex items-center justify-center bg-zinc-900">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <section className="relative w-full aspect-[3/4] sm:aspect-video md:h-[650px] lg:h-[750px] overflow-hidden bg-zinc-900">
      
      <motion.div
        ref={containerRef}
        style={{ x }}
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        onDragEnd={onDragEnd}
        className="flex h-full w-full cursor-grab active:cursor-grabbing touch-pan-y"
      >
        {slides.map((slide, index) => (
          <div key={slide.id} className="relative h-full w-full flex-shrink-0 select-none">
            {/* الصورة المصلحة:
               - md:object-top لضمان ظهور الرأس في الكمبيوتر
               - object-cover لملء المساحة بالكامل
            */}
            <Image
              src={getImageUrl(slide.image)}
              alt={slide.title}
              fill
              className="object-cover md:object-top pointer-events-none"
              priority={index === 0}
              quality={95}
            />
            
            {/* Overlay Gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent pointer-events-none" />

            {/* Content */}
            <div className="absolute inset-0 flex flex-col justify-end p-8 sm:p-16 lg:p-24 pb-24 sm:pb-32 text-white">
              <div className="max-w-4xl space-y-4 rtl:text-right ltr:text-left">
                <motion.span 
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  className="inline-block px-4 py-1.5 bg-primary text-white text-[10px] sm:text-xs font-black rounded-full uppercase"
                >
                  {slide.subtitle}
                </motion.span>
                <h1 className="text-3xl sm:text-6xl lg:text-8xl font-black leading-none tracking-tighter drop-shadow-2xl line-clamp-2">
                  {slide.title}
                </h1>
                <div className="pt-6">
                  <Link
                    href={slide.link}
                    className="inline-flex items-center gap-3 px-10 py-4 bg-white text-black hover:bg-primary hover:text-white rounded-full font-black transition-all duration-300 shadow-2xl active:scale-95"
                  >
                    {language === 'ar' ? 'اكتشفي الموديل' : 'View Product'}
                    <ArrowRight className={cn(isRTL && "rotate-180")} size={20} />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ))}
      </motion.div>

      {/* Dots */}
      {slides.length > 1 && (
        <div className="absolute bottom-8 left-0 right-0 z-20 flex justify-center gap-2">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => scrollTo(index)}
              className={cn(
                "h-1.5 transition-all duration-500 rounded-full",
                currentIndex === index ? "bg-primary w-10" : "bg-white/30 w-2"
              )}
            />
          ))}
        </div>
      )}
    </section>
  )
}
