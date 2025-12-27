        "use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { useLanguage } from "@/contexts/LanguageContext"
import { cn } from "@/lib/utils"
import { motion, AnimatePresence } from "framer-motion"

// نفس البيانات السابقة (لم تتغير)
const heroSlides = {
  ar: [
    {
      id: 1,
      title: "اكتشفي",
      subtitle: "أناقتك الخاصة",
      description: "تشكيلة حصرية من الملابس الفاخرة والمحتشمة تناسب ذوقك الرفيع",
      image: "/slider-1.jpg",
      link: "/shop",
      buttonText: "تسوقي الآن",
      buttonTextSecondary: "اعرفي أكثر",
    },
    {
      id: 2,
      title: "احصلي على",
      subtitle: "50% خصم",
      description: "على أجمل تشكيلة الفساتين المختارة لفترة محدودة",
      image: "/slider-2.jpg",
      link: "/shop?sale=true",
      buttonText: "اكتشفي العروض",
      buttonTextSecondary: "اعرفي أكثر",
    },
    {
      id: 3,
      title: "عبايات",
      subtitle: "محتشمة وعصرية",
      description: "تصاميم فريدة تجمع بين الأصالة والمعاصرة لجميع المناسبات",
      image: "/slider-3.jpg",
      link: "/shop?category=abayas",
      buttonText: "تسوقي الآن",
      buttonTextSecondary: "اعرفي أكثر",
    },
  ],
  en: [
    {
      id: 1,
      title: "Discover",
      subtitle: "Your Unique Style",
      description: "Exclusive collection of luxurious and modest clothing that suits your refined taste",
      image: "/slider-1.jpg",
      link: "/shop",
      buttonText: "Shop Now",
      buttonTextSecondary: "Learn More",
    },
    {
      id: 2,
      title: "Get",
      subtitle: "50% Off",
      description: "On the most beautiful selection of dresses for a limited time",
      image: "/slider-2.jpg",
      link: "/shop?sale=true",
      buttonText: "Discover Offers",
      buttonTextSecondary: "Learn More",
    },
    {
      id: 3,
      title: "Abayas",
      subtitle: "Modest & Modern",
      description: "Unique designs combining tradition and modernity for all occasions",
      image: "/slider-3.jpg",
      link: "/shop?category=abayas",
      buttonText: "Shop Now",
      buttonTextSecondary: "Learn More",
    },
  ],
}

export default function HeroSlider() {
  const { language, isRTL } = useLanguage()
  const [current, setCurrent] = useState(0)
  const [isAutoplay, setIsAutoplay] = useState(true)
  const [isHovering, setIsHovering] = useState(false)
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  const slides = heroSlides[language as keyof typeof heroSlides] || heroSlides.en

  // تحسين منطق التشغيل التلقائي لإعادة ضبط المؤقت عند التفاعل
  const startAutoplay = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current)
    timerRef.current = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length)
    }, 5000)
  }, [slides.length])

  useEffect(() => {
    if (isAutoplay && !isHovering) {
      startAutoplay()
    } else {
      if (timerRef.current) clearInterval(timerRef.current)
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [isAutoplay, isHovering, startAutoplay])

  const next = useCallback(() => {
    setCurrent((prev) => (prev + 1) % slides.length)
    setIsAutoplay(false)
  }, [slides.length])

  const prev = useCallback(() => {
    setCurrent((prev) => (prev - 1 + slides.length) % slides.length)
    setIsAutoplay(false)
  }, [slides.length])

  const goToSlide = useCallback((index: number) => {
    setCurrent(index)
    setIsAutoplay(false)
    // إعادة تفعيل التشغيل التلقائي بعد فترة قصيرة من التفاعل اليدوي
    setTimeout(() => setIsAutoplay(true), 10000) 
  }, [])

  return (
    <section
      // ✅ استخدام aspect-ratio للموبايل لضمان ملء الشاشة بشكل طولي جذاب
      // وتحديد ارتفاع ثابت للشاشات الأكبر
      className="relative w-full aspect-[3/4] sm:aspect-[4/3] md:aspect-auto md:h-[600px] lg:h-[700px] group overflow-hidden bg-black"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      onTouchStart={() => setIsHovering(true)}
      onTouchEnd={() => setIsHovering(false)}
      aria-roledescription="carousel"
    >
      <AnimatePresence mode="wait">
        {slides.map(
          (item, index) =>
            index === current && (
              <motion.div
                key={item.id}
                // تأثير انتقال أنعم (تلاشي + حركة بسيطة)
                initial={{ opacity: 0, scale: 1.05 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.7, ease: [0.32, 0.72, 0, 1] }}
                className="absolute inset-0 w-full h-full"
              >
                {/* ================== الطبقة 1: الصورة الخلفية ================== */}
                <div className="absolute inset-0 z-0">
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    className="object-cover"
                    priority={index === 0}
                    sizes="100vw"
                  />
                </div>

                {/* ================== الطبقة 2: تدرج تعتيم (Overlay) ================== */}
                {/* هذا التدرج ضروري جداً لجعل النص الأبيض مقروءاً فوق الصورة */}
                <div className="absolute inset-0 z-10 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-80" />

                {/* ================== الطبقة 3: المحتوى النصي ================== */}
                {/* يتموضع في الأسفل (bottom-0) وفوق طبقة التعتيم (z-20) */}
                {/* النصوص باللون الأبيض دائماً */}
                <div className="absolute inset-x-0 bottom-0 z-20 p-6 sm:p-8 md:p-12 lg:p-16 flex flex-col items-center md:items-start text-center md:text-right ltr:md:text-left text-white">
                   <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2, duration: 0.5 }}
                      className="max-w-2xl"
                   >
                    {/* العنوان الرئيسي */}
                    <h2 className="text-lg sm:text-xl md:text-2xl font-medium text-primary/90 mb-2">
                        {item.subtitle}
                    </h2>
                    <h1 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-black tracking-tight leading-none mb-4 drop-shadow-md">
                      {item.title}
                    </h1>
                    
                    {/* الوصف */}
                    <p className="text-sm sm:text-base md:text-lg text-gray-200/90 max-w-md mx-auto md:mx-0 mb-6 sm:mb-8 leading-relaxed drop-shadow">
                      {item.description}
                    </p>

                    {/* الأزرار */}
                    <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full sm:w-auto justify-center md:justify-start">
                      <Link
                        href={item.link}
                        className="px-6 sm:px-8 py-3 sm:py-4 bg-primary text-primary-foreground rounded-full font-bold flex items-center justify-center gap-2 hover:bg-primary/90 transition-all duration-300 shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 text-sm sm:text-base"
                      >
                        {item.buttonText}
                        <ArrowRight
                          size={18}
                          strokeWidth={2.5}
                          className={cn("transition-transform", isRTL && "rotate-180")}
                        />
                      </Link>
                      <button className="px-6 sm:px-8 py-3 sm:py-4 border-2 border-white/30 text-white rounded-full font-bold hover:bg-white/10 transition-all duration-300 backdrop-blur-sm text-sm sm:text-base">
                        {item.buttonTextSecondary}
                      </button>
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            )
        )}
      </AnimatePresence>

      {/* ================== أزرار التنقل (مخفية في الموبايل) ================== */}
      {/* تظهر فقط عند الوقوف بالماوس على الشاشات الكبيرة */}
      <div className="hidden md:block opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <button
            onClick={isRTL ? next : prev}
            className={cn(
            "absolute top-1/2 -translate-y-1/2 z-30 p-3 bg-black/30 text-white hover:bg-primary hover:text-primary-foreground rounded-full transition-all duration-300 backdrop-blur-md",
            "left-4 lg:left-8"
            )}
            aria-label="Previous slide"
        >
            <ChevronLeft size={24} />
        </button>
        <button
            onClick={isRTL ? prev : next}
            className={cn(
            "absolute top-1/2 -translate-y-1/2 z-30 p-3 bg-black/30 text-white hover:bg-primary hover:text-primary-foreground rounded-full transition-all duration-300 backdrop-blur-md",
            "right-4 lg:right-8"
            )}
            aria-label="Next slide"
        >
            <ChevronRight size={24} />
        </button>
      </div>

      {/* ================== مؤشرات السلايدر (Dots) ================== */}
      <div
        className="absolute bottom-20 sm:bottom-8 left-1/2 -translate-x-1/2 z-30 flex gap-2 items-center"
        role="tablist"
      >
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={cn(
              "rounded-full transition-all duration-500 cursor-pointer h-1.5 sm:h-2",
              index === current
                ? "bg-primary w-6 sm:w-10" // المؤشر النشط أطول
                : "bg-white/40 hover:bg-white/70 w-1.5 sm:w-2"
            )}
            aria-label={`Go to slide ${index + 1}`}
            aria-selected={index === current}
            role="tab"
          />
        ))}
      </div>
    </section>
  )
}
