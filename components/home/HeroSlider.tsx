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
  
  const x = useMotionValue(0)
  const containerRef = useRef<HTMLDivElement>(null)

  const scrollTo = useCallback((index: number) => {
    if (!containerRef.current) return
    const width = containerRef.current.offsetWidth
    animate(x, isRTL ? (index * width) : (-index * width), {
      type: "spring",
      stiffness: 260,
      damping: 30,
    })
    setCurrentIndex(index)
  }, [isRTL, x])

  const next = useCallback(() => {
    const nextIndex = (currentIndex + 1) % slides.length
    scrollTo(nextIndex)
  }, [currentIndex, slides.length, scrollTo])

  const prev = useCallback(() => {
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
    const timer = setInterval(next, 5000)
    return () => clearInterval(timer)
  }, [next])

  useEffect(() => {
    scrollTo(currentIndex)
  }, [isRTL, scrollTo, currentIndex])

  return (
    <section className="relative w-full aspect-[4/5] sm:aspect-video md:h-[650px] lg:h-[800px] overflow-hidden bg-zinc-950">
      
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
            className="relative h-full w-full flex-shrink-0 select-none overflow-hidden"
          >
            <Image
              src={slide.image}
              alt={slide.title}
              fill
              className="object-cover md:object-top pointer-events-none"
              priority={index === 0}
              quality={100}
            />
            
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent pointer-events-none" />

            {/* ✅ التعديل هنا: إضافة md:px-32 و lg:px-48 لخلق مساحة آمنة بعيدة عن الأسهم */}
            <div className="absolute inset-0 flex flex-col justify-end p-8 sm:p-20 md:px-32 lg:px-48 pb-24 sm:pb-32 text-white">
              <div className="max-w-4xl space-y-4 rtl:text-right ltr:text-left">
                <motion.span 
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  className="inline-block px-4 py-1.5 bg-primary text-white text-[10px] sm:text-xs font-black rounded-full uppercase tracking-widest"
                >
                  {slide.subtitle}
                </motion.span>
                
                <h1 className="text-3xl sm:text-6xl lg:text-8xl font-black leading-[1] tracking-tighter drop-shadow-2xl">
                  {slide.title}
                </h1>
                
                <p className="text-sm sm:text-lg text-gray-200/90 max-w-lg font-medium drop-shadow-md">
                  {slide.description}
                </p>
                
                <div className="pt-6">
                  <Link
                    href={slide.link}
                    className="inline-flex items-center gap-3 px-10 py-4 bg-white text-black hover:bg-primary hover:text-white rounded-full font-black transition-all duration-300 shadow-2xl active:scale-95"
                  >
                    تسوقي الآن
                    <ArrowRight className={cn("transition-transform", isRTL && "rotate-180")} />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ))}
      </motion.div>

      {/* المؤشرات السفلية */}
      <div className="absolute bottom-10 left-0 right-0 z-20 flex justify-center gap-3">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => scrollTo(index)}
            className={cn(
              "h-1.5 transition-all duration-500 rounded-full",
              currentIndex === index ? "bg-primary w-10 shadow-lg" : "bg-white/30 w-2.5 hover:bg-white/50"
            )}
          />
        ))}
      </div>

      {/* الأسهم الجانبية - تم جعلها أصغر قليلاً وأبعد عن الكلام */}
      <div className="hidden md:block">
        <button
          onClick={prev}
          className="absolute left-6 lg:left-10 top-1/2 -translate-y-1/2 z-30 p-3 bg-white/5 hover:bg-primary text-white rounded-full backdrop-blur-xl transition-all border border-white/10"
        >
          <ChevronLeft size={28} strokeWidth={2.5} />
        </button>
        <button
          onClick={next}
          className="absolute right-6 lg:right-10 top-1/2 -translate-y-1/2 z-30 p-3 bg-white/5 hover:bg-primary text-white rounded-full backdrop-blur-xl transition-all border border-white/10"
        >
          <ChevronRight size={28} strokeWidth={2.5} />
        </button>
      </div>
    </section>
  )
}
