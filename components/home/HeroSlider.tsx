"use client"

import { useState, useEffect, useCallback } from "react"
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { useLanguage } from "@/contexts/LanguageContext"
import { cn } from "@/lib/utils"
import { motion, AnimatePresence } from "framer-motion"

const heroSlides = {
  ar: [
    {
      id: 1,
      title: "اكتشفي",
      subtitle: "أناقتك الخاصة",
      description: "تشكيلة حصرية من الملابس الفاخرة والمحتشمة تناسب ذوقك الرفيع",
      image: "/slider-1.jpg", // تأكد من مسار الصورة
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

  const slides = heroSlides[language as keyof typeof heroSlides] || heroSlides.en

  useEffect(() => {
    if (!isAutoplay || isHovering) return

    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length)
    }, 5000)

    return () => clearInterval(interval)
  }, [isAutoplay, isHovering, slides.length])

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
  }, [])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        isRTL ? next() : prev()
      } else if (e.key === "ArrowRight") {
        isRTL ? prev() : next()
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [next, prev, isRTL])

  return (
    <section
      className="relative h-[500px] sm:h-[600px] md:h-[650px] lg:h-[750px] flex items-center justify-center overflow-hidden bg-background"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      aria-roledescription="carousel"
      aria-label="Hero carousel"
    >
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-accent/5 via-transparent to-primary/5 dark:from-accent/10 dark:to-primary/10" />

      {/* Slides Container */}
      <div className="absolute inset-0">
        <AnimatePresence mode="wait">
          {slides.map(
            (item, index) =>
              index === current && (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.02 }}
                  transition={{ duration: 0.7, ease: "easeInOut" }}
                  className="absolute inset-0 flex items-center justify-center"
                >
                  <div className="grid lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-16 items-center justify-center h-full px-4 sm:px-6 lg:px-12 container mx-auto">
                    {/* Text Content */}
                    <div className="space-y-4 sm:space-y-6 lg:space-y-8 py-8 sm:py-12 lg:py-0 order-2 lg:order-1 text-center lg:text-right ltr:lg:text-left">
                      <div className="max-w-xl mx-auto lg:mx-0">
                        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-foreground leading-tight">
                          {item.title}
                          <span className="block text-primary mt-3 sm:mt-4 lg:mt-6">{item.subtitle}</span>
                        </h1>
                        <p className="text-sm sm:text-base lg:text-lg text-muted-foreground leading-relaxed max-w-md mx-auto lg:mx-0 mt-4 sm:mt-6 lg:mt-8">
                          {item.description}
                        </p>
                      </div>

                      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-4 sm:pt-6 lg:pt-8 justify-center lg:justify-start">
                        <Link
                          href={item.link}
                          className="px-6 sm:px-8 py-3 sm:py-4 bg-primary text-primary-foreground rounded-full font-bold flex items-center justify-center gap-2 hover:bg-primary/90 transition-all duration-300 shadow-lg hover:shadow-primary/20 hover:scale-105 active:scale-95 focus-ring text-sm sm:text-base"
                        >
                          {item.buttonText}
                          <ArrowRight
                            size={18}
                            strokeWidth={2.5}
                            className={cn("transition-transform", isRTL && "rotate-180")}
                          />
                        </Link>
                        <button className="px-6 sm:px-8 py-3 sm:py-4 border-2 border-primary/20 dark:border-primary/30 text-foreground rounded-full font-bold hover:bg-secondary dark:hover:bg-secondary/50 transition-all duration-300 focus-ring text-sm sm:text-base">
                          {item.buttonTextSecondary}
                        </button>
                      </div>
                    </div>

                    {/* Image */}
                    <div className="hidden lg:flex items-center justify-center h-full order-1 lg:order-2">
                      <div className={cn("relative w-full max-w-lg aspect-[3/4] mt-8", isRTL ? "lg:mr-12" : "lg:ml-12")}>
                        <div className="absolute -inset-1 bg-primary/5 dark:bg-primary/10 rounded-3xl blur-xl" />
                        <div className="relative w-full h-full rounded-3xl overflow-hidden shadow-2xl">
                          <Image
                            src={item.image}
                            alt={item.title}
                            fill
                            className="object-cover"
                            priority={index === 0}
                            sizes="(max-width: 1024px) 0vw, 50vw"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )
          )}
        </AnimatePresence>
      </div>

      {/* Navigation Buttons - الأزرار تشير للخارج دائماً */}
      {/* السهم الأيسر: موجود على اليسار ويشير لليسار */}
      <button
        onClick={isRTL ? next : prev}
        className={cn(
          "absolute top-1/2 -translate-y-1/2 z-20 p-2.5 sm:p-3 md:p-4 bg-white/80 dark:bg-gray-800/80 hover:bg-white dark:hover:bg-gray-800 text-foreground rounded-full transition-all duration-300 shadow-lg hover:scale-110 backdrop-blur-sm focus-ring",
          "left-3 sm:left-6 md:left-8" 
        )}
        aria-label="Previous slide"
      >
        <ChevronLeft size={20} strokeWidth={2.5} className="sm:w-6 sm:h-6" />
      </button>

      {/* السهم الأيمن: موجود على اليمين ويشير لليمين */}
      <button
        onClick={isRTL ? prev : next}
        className={cn(
          "absolute top-1/2 -translate-y-1/2 z-20 p-2.5 sm:p-3 md:p-4 bg-white/80 dark:bg-gray-800/80 hover:bg-white dark:hover:bg-gray-800 text-foreground rounded-full transition-all duration-300 shadow-lg hover:scale-110 backdrop-blur-sm focus-ring",
          "right-3 sm:right-6 md:right-8"
        )}
        aria-label="Next slide"
      >
        <ChevronRight size={20} strokeWidth={2.5} className="sm:w-6 sm:h-6" />
      </button>

      {/* Indicators */}
      <div
        className="absolute bottom-6 sm:bottom-8 left-1/2 -translate-x-1/2 z-20 flex gap-2 sm:gap-3 items-center"
        role="tablist"
      >
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={cn(
              "rounded-full transition-all duration-300 cursor-pointer focus-ring",
              index === current
                ? "bg-primary w-6 sm:w-8 h-2 sm:h-2.5 shadow-lg"
                : "bg-primary/20 dark:bg-primary/30 w-2 sm:w-2.5 h-2 sm:h-2.5 hover:bg-primary/40"
            )}
            aria-label={`Go to slide ${index + 1}`}
            aria-selected={index === current}
            role="tab"
          />
        ))}
      </div>

      {/* Screen Reader Announcement */}
      <div className="sr-only" aria-live="polite" aria-atomic="true">
        Slide {current + 1} of {slides.length}
      </div>
    </section>
  )
}