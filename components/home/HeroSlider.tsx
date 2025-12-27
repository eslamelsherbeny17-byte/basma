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
      title: "اكتشفي أناقتك الخاصة",
      subtitle: "كولكشن شتاء 2024",
      description: "تشكيلة حصرية من الملابس الفاخرة التي تناسب ذوقك الرفيع",
      image: "/slider-1.jpg",
      link: "/shop",
      buttonText: "تسوقي الآن",
    },
    {
      id: 2,
      title: "خصم يصل إلى 50%",
      subtitle: "عروض لفترة محدودة",
      description: "على أجمل تشكيلة الفساتين المختارة لجميع المناسبات",
      image: "/slider-2.jpg",
      link: "/shop?sale=true",
      buttonText: "اكتشفي العروض",
    },
    {
        id: 3,
        title: "عبايات محتشمة وعصرية",
        subtitle: "الأكثر مبيعاً",
        description: "تصاميم فريدة تجمع بين الأصالة والمعاصرة",
        image: "/slider-3.jpg",
        link: "/shop?category=abayas",
        buttonText: "اكتشفي المزيد",
      },
  ],
  // ... يمكنك إضافة نفس البيانات لـ en هنا
}

export default function HeroSlider() {
  const { language, isRTL } = useLanguage()
  const [current, setCurrent] = useState(0)
  const [direction, setDirection] = useState(0) // 1 لليمين، -1 لليسار
  const slides = heroSlides[language as keyof typeof heroSlides] || heroSlides.ar

  const next = useCallback(() => {
    setDirection(1)
    setCurrent((prev) => (prev + 1) % slides.length)
  }, [slides.length])

  const prev = useCallback(() => {
    setDirection(-1)
    setCurrent((prev) => (prev - 1 + slides.length) % slides.length)
  }, [slides.length])

  // منطق السحب باليد (Drag)
  const onDragEnd = (e: any, { offset, velocity }: PanInfo) => {
    const swipe = Math.abs(offset.x) > 50 && Math.abs(velocity.x) > 500
    if (swipe) {
      if (offset.x > 0) isRTL ? next() : prev()
      else isRTL ? prev() : next()
    }
  }

  // التشغيل التلقائي
  useEffect(() => {
    const timer = setInterval(next, 6000)
    return () => clearInterval(timer)
  }, [next])

  return (
    <section className="relative w-full h-[500px] sm:h-[600px] lg:h-[700px] overflow-hidden bg-gray-100 dark:bg-zinc-950">
      <AnimatePresence initial={false} custom={direction}>
        <motion.div
          key={current}
          custom={direction}
          variants={{
            enter: (direction: number) => ({
              x: direction > 0 ? (isRTL ? -1000 : 1000) : (isRTL ? 1000 : -1000),
              opacity: 0,
            }),
            center: { x: 0, opacity: 1 },
            exit: (direction: number) => ({
              x: direction < 0 ? (isRTL ? -1000 : 1000) : (isRTL ? 1000 : -1000),
              opacity: 0,
            }),
          }}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{
            x: { type: "spring", stiffness: 300, damping: 30 },
            opacity: { duration: 0.4 },
          }}
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={1}
          onDragEnd={onDragEnd}
          className="absolute inset-0 w-full h-full cursor-grab active:cursor-grabbing"
        >
          {/* الصورة الخلفية - تمتد بالكامل */}
          <div className="absolute inset-0">
            <Image
              src={slides[current].image}
              alt={slides[current].title}
              fill
              className="object-cover pointer-events-none"
              priority
            />
            {/* طبقة الظل (Overlay) المدمجة لضمان رؤية الكلام */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
          </div>

          {/* الكلام فوق الصورة مباشرة كجزء من الحركة */}
          <div className="absolute inset-0 flex flex-col justify-end p-8 sm:p-16 lg:p-24 text-white pb-20 sm:pb-32">
            <div className="max-w-3xl space-y-4 ltr:text-left rtl:text-right">
              <motion.span
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="inline-block px-3 py-1 bg-primary text-white text-xs sm:text-sm font-bold rounded-full mb-2"
              >
                {slides[current].subtitle}
              </motion.span>
              <h1 className="text-3xl sm:text-5xl lg:text-7xl font-black leading-tight drop-shadow-lg">
                {slides[current].title}
              </h1>
              <p className="text-sm sm:text-lg text-gray-200 max-w-xl drop-shadow-md">
                {slides[current].description}
              </p>
              <div className="pt-4">
                <Link
                  href={slides[current].link}
                  className="inline-flex items-center gap-3 px-8 py-3.5 bg-white text-black hover:bg-primary hover:text-white rounded-full font-bold transition-all duration-300 shadow-xl hover:scale-105"
                >
                  {slides[current].buttonText}
                  <ArrowRight size={20} className={cn(isRTL && "rotate-180")} />
                </Link>
              </div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* المؤشرات (Dots) - تصميم عصري أسفل الصورة */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 flex gap-2.5">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrent(index)}
            className={cn(
              "transition-all duration-300 rounded-full",
              index === current
                ? "bg-primary w-8 h-2"
                : "bg-white/30 hover:bg-white/50 w-2 h-2"
            )}
          />
        ))}
      </div>

      {/* أزرار التنقل للكمبيوتر فقط */}
      <div className="hidden md:block">
        <button
          onClick={prev}
          className="absolute left-6 top-1/2 -translate-y-1/2 z-30 p-3 bg-black/20 hover:bg-primary text-white rounded-full backdrop-blur-md transition-all shadow-lg"
        >
          <ChevronLeft size={28} />
        </button>
        <button
          onClick={next}
          className="absolute right-6 top-1/2 -translate-y-1/2 z-30 p-3 bg-black/20 hover:bg-primary text-white rounded-full backdrop-blur-md transition-all shadow-lg"
        >
          <ChevronRight size={28} />
        </button>
      </div>
    </section>
  )
}
