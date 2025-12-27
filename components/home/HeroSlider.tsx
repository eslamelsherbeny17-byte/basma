"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { useLanguage } from "@/contexts/LanguageContext"
import { cn } from "@/lib/utils"
import { motion, AnimatePresence, PanInfo } from "framer-motion"

const heroSlides = {
  ar: [
    {
      id: 1,
      title: "أناقة تليق بكِ",
      subtitle: "تشكيلة الشتاء الجديدة",
      description: "اكتشفي أرقى التصاميم العالمية المختارة بعناية لتناسب ذوقك الرفيع",
      image: "/slider-1.jpg",
      link: "/shop",
    },
    {
      id: 2,
      title: "عروض حصرية",
      subtitle: "خصومات تصل إلى 50%",
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
  const [current, setCurrent] = useState(0)
  const [direction, setDirection] = useState(0)
  const slides = heroSlides[language as keyof typeof heroSlides] || heroSlides.ar

  // منع الوميض الأبيض عن طريق تحديد خلفية ثابتة داكنة جداً
  const containerRef = useRef<HTMLDivElement>(null)

  const paginate = useCallback((newDirection: number) => {
    setDirection(newDirection)
    setCurrent((prev) => (prev + newDirection + slides.length) % slides.length)
  }, [slides.length])

  // منطق السحب الاحترافي
  const handleDragEnd = (e: any, { offset, velocity }: PanInfo) => {
    const swipeThreshold = 50
    if (offset.x > swipeThreshold) {
      isRTL ? paginate(1) : paginate(-1)
    } else if (offset.x < -swipeThreshold) {
      isRTL ? paginate(-1) : paginate(1)
    }
  }

  useEffect(() => {
    const timer = setInterval(() => paginate(1), 7000)
    return () => clearInterval(timer)
  }, [paginate])

  // إعدادات الحركة (Variants) لتحقيق انسيابية نون
  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? (isRTL ? "-100%" : "100%") : (isRTL ? "100%" : "-100%"),
      opacity: 0,
      scale: 1.05 // تأثير زووم خفيف عند الدخول
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
      zIndex: 1
    },
    exit: (direction: number) => ({
      x: direction < 0 ? (isRTL ? "-100%" : "100%") : (isRTL ? "100%" : "-100%"),
      opacity: 0,
      scale: 0.95, // تأثير تصغير خفيف عند الخروج
      zIndex: 0
    })
  }

  return (
    <section 
      ref={containerRef}
      className="relative w-full aspect-[3/4] sm:aspect-auto sm:h-[600px] lg:h-[750px] overflow-hidden bg-zinc-950" // خلفية سوداء تمنع الوميض الأبيض
    >
      <AnimatePresence initial={false} custom={direction}>
        <motion.div
          key={current}
          custom={direction}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{
            x: { type: "spring", stiffness: 200, damping: 25 }, // حركة زمبركية ناعمة جداً
            opacity: { duration: 0.3 },
            scale: { duration: 0.5 }
          }}
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.6}
          onDragEnd={handleDragEnd}
          className="absolute inset-0 w-full h-full cursor-grab active:cursor-grabbing"
        >
          {/* الطبقة الأساسية: الصورة */}
          <div className="absolute inset-0 select-none pointer-events-none">
            <Image
              src={slides[current].image}
              alt={slides[current].title}
              fill
              className="object-cover"
              priority // شحن الصورة فوراً لمنع التأخير
              quality={90}
            />
            {/* ظل سينمائي (Overlay) متدرج واحترافي جداً */}
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />
          </div>

          {/* الطبقة العلوية: المحتوى (يتحرك ككتلة واحدة مع الصورة) */}
          <div className="absolute inset-0 flex flex-col justify-end p-6 sm:p-16 lg:p-24 pb-20 sm:pb-32 text-white">
            <div className="max-w-3xl space-y-3 sm:space-y-5">
              <span className="inline-block px-4 py-1.5 bg-primary/90 backdrop-blur-md text-white text-[10px] sm:text-sm font-black rounded-full uppercase tracking-widest shadow-xl">
                {slides[current].subtitle}
              </span>
              
              <h1 className="text-3xl sm:text-5xl lg:text-8xl font-black leading-[1.1] drop-shadow-2xl">
                {slides[current].title}
              </h1>
              
              <p className="text-sm sm:text-xl text-gray-200/90 max-w-xl font-medium leading-relaxed line-clamp-2">
                {slides[current].description}
              </p>

              <div className="pt-4 sm:pt-6">
                <Link
                  href={slides[current].link}
                  className="group inline-flex items-center gap-3 px-8 py-3.5 sm:px-10 sm:py-4 bg-white text-black hover:bg-primary hover:text-white rounded-full font-black transition-all duration-500 shadow-[0_15px_30px_-10px_rgba(0,0,0,0.5)] active:scale-95"
                >
                  تسوقي الآن
                  <ArrowRight className={cn("transition-transform group-hover:translate-x-2 duration-300", isRTL && "rotate-180 group-hover:-translate-x-2")} />
                </Link>
              </div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* المؤشرات السفلية (Bullets) - تصميم نون العصري */}
      <div className="absolute bottom-6 sm:bottom-10 left-1/2 -translate-x-1/2 z-20 flex gap-2.5">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrent(index)}
            className={cn(
              "h-1.5 transition-all duration-500 rounded-full",
              index === current 
                ? "bg-primary w-8 sm:w-12 shadow-lg" 
                : "bg-white/30 w-2 sm:w-3"
            )}
          />
        ))}
      </div>

      {/* أزرار التنقل الجانبية (مخفية في الموبايل لتقليل الازدحام) */}
      <div className="hidden md:block">
        <button
          onClick={() => paginate(-1)}
          className="absolute left-8 top-1/2 -translate-y-1/2 z-30 p-4 bg-black/10 hover:bg-primary text-white rounded-full backdrop-blur-xl transition-all duration-500 border border-white/10"
        >
          <ChevronLeft size={32} strokeWidth={2.5} />
        </button>
        <button
          onClick={() => paginate(1)}
          className="absolute right-8 top-1/2 -translate-y-1/2 z-30 p-4 bg-black/10 hover:bg-primary text-white rounded-full backdrop-blur-xl transition-all duration-500 border border-white/10"
        >
          <ChevronRight size={32} strokeWidth={2.5} />
        </button>
      </div>
    </section>
  )
}
