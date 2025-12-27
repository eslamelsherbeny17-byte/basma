"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { useLanguage } from "@/contexts/LanguageContext"
import { cn } from "@/lib/utils"
import { motion, useMotionValue, animate } from "framer-motion"

const heroSlides = {
  ar: [
    {
      id: 1,
      title: "أناقة تليق بكِ",
      subtitle: "كولكشن شتاء 2025",
      description: "اكتشفي أرقى التصاميم العالمية المختارة بعناية لتناسب ذوقك الرفيع",
      image: "/slider-1.jpg",
      link: "/shop",
    },
    {
      id: 2,
      title: "عروض حصرية",
      subtitle: "خصومات 50%",
      description: "استمتعي بأقوى العروض على فساتين السهرة والعبايات لفترة محدودة",
      image: "/slider-2.jpg",
      link: "/shop?sale=true",
    },
    {
      id: 3,
      title: "إطلالة عصرية",
      subtitle: "موديلات 2025",
      description: "كوني دائماً في المقدمة مع أحدث صيحات الموضة العربية والعالمية",
      image: "/slider-3.jpg",
      link: "/shop?category=abayas",
    },
  ],
}

export default function HeroSlider() {
  const { language, isRTL } = useLanguage()
  const [currentIndex, setCurrentIndex] = useState(0)
  const slides = heroSlides[language as keyof typeof heroSlides] || heroSlides.ar
  
  // استخدام Motion Value للتحكم الكامل في حركة الشريط
  const x = useMotionValue(0)
  const containerRef = useRef<HTMLDivElement>(null)

  // دالة التنقل
  const scrollTo = useCallback((index: number) => {
    if (!containerRef.current) return
    const width = containerRef.current.offsetWidth
    // التحريك بسلاسة تامة لمكان الصورة المطلوبة
    animate(x, isRTL ? (index * width) : (-index * width), {
      type: "spring",
      stiffness: 260,
      damping: 30,
    })
    setCurrentIndex(index)
  }, [isRTL])

  const next = useCallback(() => {
    const nextIndex = (currentIndex + 1) % slides.length
    scrollTo(nextIndex)
  }, [currentIndex, slides.length, scrollTo])

  const prev = useCallback(() => {
    const prevIndex = (currentIndex - 1 + slides.length) % slides.length
    scrollTo(prevIndex)
  }, [currentIndex, slides.length, scrollTo])

  // منطق السحب باليد (Drag)
  const onDragEnd = (e: any, info: any) => {
    const threshold = 50
    if (info.offset.x < -threshold) isRTL ? prev() : next()
    else if (info.offset.x > threshold) isRTL ? next() : prev()
    else scrollTo(currentIndex) // إرجاع السلايدر لمكانه لو السحبة ضعيفة
  }

  // أوتوبلاي
  useEffect(() => {
    const timer = setInterval(next, 5000)
    return () => clearInterval(timer)
  }, [next])

  // تحديث مكان السلايدر عند تغيير حجم الشاشة أو اللغة
  useEffect(() => {
    scrollTo(currentIndex)
  }, [isRTL, scrollTo, currentIndex])

  return (
    <section className="relative w-full aspect-[4/5] sm:aspect-video md:h-[600px] lg:h-[750px] overflow-hidden bg-zinc-900">
      
      {/* الشريط المتصل الذي يحوي كل السلايدات */}
      <motion.div
        ref={containerRef}
        style={{ x }}
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        onDragEnd={onDragEnd}
        className="flex h-full w-full cursor-grab active:cursor-grabbing touch-pan-y"
      >
        {slides.map((slide, index) => (
          <div 
            key={slide.id} 
            className="relative h-full w-full flex-shrink-0 select-none"
          >
            {/* الصورة - محملة مسبقاً وجاهزة دائماً */}
            <Image
              src={slide.image}
              alt={slide.title}
              fill
              className="object-cover pointer-events-none"
              priority={index === 0}
              quality={90}
            />
            
            {/* التعتيم (Overlay) */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent pointer-events-none" />

            {/* المحتوى النصي - يتحرك مع الصورة تماماً */}
            <div className="absolute inset-0 flex flex-col justify-end p-8 sm:p-16 lg:p-24 pb-24 sm:pb-32 text-white">
              <div className="max-w-3xl space-y-4 rtl:text-right ltr:text-left">
                <span className="inline-block px-4 py-1 bg-primary text-white text-[10px] sm:text-xs font-black rounded-full uppercase tracking-tighter">
                  {slide.subtitle}
                </span>
                <h1 className="text-3xl sm:text-5xl lg:text-8xl font-black leading-none tracking-tighter drop-shadow-2xl">
                  {slide.title}
                </h1>
                <p className="text-sm sm:text-lg text-gray-200/90 max-w-lg font-medium drop-shadow-md">
                  {slide.description}
                </p>
                <div className="pt-4">
                  <Link
                    href={slide.link}
                    className="inline-flex items-center gap-3 px-8 py-3.5 bg-white text-black hover:bg-primary hover:text-white rounded-full font-black transition-all duration-300 shadow-2xl"
                  >
                    تسوقي الآن
                    <ArrowRight className={cn(isRTL && "rotate-180")} />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ))}
      </motion.div>

      {/* المؤشرات (Dots) - تصميم نون السفلي */}
      <div className="absolute bottom-8 left-0 right-0 z-20 flex justify-center gap-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => scrollTo(index)}
            className={cn(
              "h-1.5 transition-all duration-500 rounded-full",
              currentIndex === index 
                ? "bg-primary w-8" 
                : "bg-white/30 w-2"
            )}
          />
        ))}
      </div>

      {/* أزرار التنقل - ديسكتوب فقط */}
      <div className="hidden md:block">
        <button
          onClick={prev}
          className="absolute left-6 top-1/2 -translate-y-1/2 z-30 p-3 bg-white/10 hover:bg-primary text-white rounded-full backdrop-blur-md transition-all border border-white/10"
        >
          <ChevronLeft size={24} />
        </button>
        <button
          onClick={next}
          className="absolute right-6 top-1/2 -translate-y-1/2 z-30 p-3 bg-white/10 hover:bg-primary text-white rounded-full backdrop-blur-md transition-all border border-white/10"
        >
          <ChevronRight size={24} />
        </button>
      </div>
    </section>
  )
}
