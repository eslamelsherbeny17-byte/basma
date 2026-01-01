"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { useLanguage } from "@/contexts/LanguageContext"
import { cn } from "@/lib/utils"
import { motion, useMotionValue, animate, AnimatePresence } from "framer-motion"

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
  const [isHovering, setIsHovering] = useState(false)
  
  const x = useMotionValue(0)
  const containerRef = useRef<HTMLDivElement>(null)

  const slides = heroSlides[language as keyof typeof heroSlides] || heroSlides.ar

  // Unified navigation functions
  const next = useCallback(() => {
    setCurrent((prev) => (prev + 1) % slides.length)
  }, [slides.length])

  const prev = useCallback(() => {
    setCurrent((prev) => (prev - 1 + slides.length) % slides.length)
  }, [slides.length])

  const goToSlide = useCallback((index: number) => {
    setCurrent(index)
  }, [])

  // Mobile drag scroll
  const scrollTo = useCallback((index: number) => {
    if (!containerRef.current) return
    const width = containerRef.current.offsetWidth
    animate(x, isRTL ? (index * width) : (-index * width), {
      type: "spring",
      stiffness: 260,
      damping: 30,
    })
  }, [isRTL, x])

  const onDragEnd = (e: any, info: any) => {
    const threshold = 50
    if (info.offset.x < -threshold) {
      isRTL ? prev() : next()
    } else if (info.offset.x > threshold) {
      isRTL ? next() : prev()
    } else {
      scrollTo(current)
    }
  }

  // Auto-play
  useEffect(() => {
    if (isHovering) return
    const interval = setInterval(next, 5000)
    return () => clearInterval(interval)
  }, [next, isHovering])

  // Sync mobile scroll with current
  useEffect(() => {
    scrollTo(current)
  }, [current, scrollTo])

  // Keyboard navigation
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
      className="relative w-full overflow-hidden bg-background"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      aria-roledescription="carousel"
      aria-label="Hero carousel"
    >
      {/* ============================================ */}
      {/* MOBILE VERSION - Fullscreen with drag */}
      {/* ============================================ */}
      <div className="lg:hidden relative w-full aspect-[4/5] sm:aspect-video overflow-hidden bg-zinc-950">
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
              {/* ✅ الحل: object-top للموبايل عشان يجيب راس الشخص */}
              <Image
                src={slide.image}
                alt={slide.title}
                fill
                sizes="100vw"
                className="object-cover object-top pointer-events-none"
                priority={index === 0}
                quality={90}
              />

              {/* Gradient overlay - قوي من تحت */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent pointer-events-none" />

              {/* المحتوى النصي */}
              <div className="absolute inset-0 flex flex-col justify-end px-6 sm:px-8 pb-20 sm:pb-24 text-white">
                <div className="max-w-4xl space-y-3 sm:space-y-4 rtl:text-right ltr:text-left">
                  <motion.span
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="inline-block px-4 py-1.5 bg-primary text-primary-foreground text-[10px] sm:text-xs font-black rounded-full uppercase tracking-widest shadow-lg"
                  >
                    {slide.subtitle}
                  </motion.span>

                  <h1 className="text-3xl sm:text-5xl font-black leading-[1.1] tracking-tighter drop-shadow-2xl">
                    {slide.title}
                  </h1>

                  <p className="text-sm sm:text-base text-gray-100 max-w-lg font-medium drop-shadow-lg leading-relaxed">
                    {slide.description}
                  </p>

                  <div className="pt-4">
                    <Link
                      href={slide.link}
                      className="inline-flex items-center gap-2 px-6 py-2.5 sm:px-8 sm:py-3 bg-white text-black hover:bg-primary hover:text-primary-foreground rounded-full font-black text-sm sm:text-base transition-all duration-300 shadow-2xl hover:shadow-primary/50 active:scale-95 hover:scale-105"
                    >
                      {slide.buttonText}
                      <ArrowRight
                        className={cn("w-4 h-4 transition-transform", isRTL && "rotate-180")}
                      />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </motion.div>
      </div>

      {/* ============================================ */}
      {/* DESKTOP VERSION - Grid Layout */}
      {/* ============================================ */}
      <div className="hidden lg:block relative h-[600px] xl:h-[700px]">
        <div className="absolute inset-0 bg-gradient-to-br from-accent/5 via-transparent to-primary/5 dark:from-accent/10 dark:to-primary/10" />

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
                    <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 xl:gap-16 items-center justify-center h-full px-8 lg:px-12 xl:px-20 container mx-auto">
                      {/* Text Content */}
                      <div
                        className={cn(
                          "space-y-6 lg:space-y-8 order-2 lg:order-1",
                          isRTL ? "lg:text-right" : "lg:text-left"
                        )}
                      >
                        <div className="max-w-xl">
                          <motion.span
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.1 }}
                            className="inline-block px-4 py-1.5 bg-primary text-primary-foreground text-xs font-black rounded-full uppercase tracking-widest shadow-lg mb-6"
                          >
                            {item.subtitle}
                          </motion.span>

                          <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            className="text-5xl xl:text-6xl 2xl:text-7xl font-bold text-foreground leading-tight"
                          >
                            {item.title}
                          </motion.h1>

                          <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.3 }}
                            className="text-base lg:text-lg text-muted-foreground leading-relaxed mt-6"
                          >
                            {item.description}
                          </motion.p>
                        </div>

                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.6, delay: 0.4 }}
                          className="flex flex-col sm:flex-row gap-4"
                        >
                          <Link
                            href={item.link}
                            className="px-8 py-4 bg-primary text-primary-foreground rounded-full font-bold flex items-center justify-center gap-2 hover:bg-primary/90 transition-all duration-300 shadow-lg hover:shadow-primary/20 hover:scale-105 active:scale-95"
                          >
                            {item.buttonText}
                            <ArrowRight
                              size={18}
                              strokeWidth={2.5}
                              className={cn("transition-transform", isRTL && "rotate-180")}
                            />
                          </Link>
                          <button className="px-8 py-4 border-2 border-primary/20 dark:border-primary/30 text-foreground rounded-full font-bold hover:bg-secondary dark:hover:bg-secondary/50 transition-all duration-300">
                            {item.buttonTextSecondary}
                          </button>
                        </motion.div>
                      </div>

                      {/* Image */}
                      <motion.div
                        initial={{ opacity: 0, x: isRTL ? -50 : 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.7, delay: 0.2 }}
                        className="order-1 lg:order-2 flex items-center justify-center h-full"
                      >
                        <div className="relative w-full max-w-lg aspect-[3/4]">
                          <div className="absolute -inset-1 bg-primary/10 dark:bg-primary/20 rounded-3xl blur-2xl" />
                          <div className="relative w-full h-full rounded-3xl overflow-hidden shadow-2xl ring-1 ring-black/5">
                            <Image
                              src={item.image}
                              alt={item.title}
                              fill
                              sizes="(max-width: 1024px) 0vw, 50vw"
                              className="object-cover object-top"
                              priority={index === 0}
                              quality={90}
                            />
                          </div>
                        </div>
                      </motion.div>
                    </div>
                  </motion.div>
                )
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* ============================================ */}
      {/* SHARED CONTROLS */}
      {/* ============================================ */}

      {/* Navigation Arrows - Desktop */}
      <div className="hidden lg:block">
        <button
          onClick={isRTL ? next : prev}
          className={cn(
            "absolute top-1/2 -translate-y-1/2 z-30 p-3 xl:p-4",
            "bg-white/80 dark:bg-gray-800/80 hover:bg-primary hover:text-primary-foreground",
            "text-foreground rounded-full transition-all duration-300",
            "shadow-xl hover:scale-110 active:scale-95 backdrop-blur-sm",
            "left-4 lg:left-6 xl:left-8"
          )}
          aria-label="Previous slide"
        >
          <ChevronLeft className="w-6 h-6" strokeWidth={2.5} />
        </button>

        <button
          onClick={isRTL ? prev : next}
          className={cn(
            "absolute top-1/2 -translate-y-1/2 z-30 p-3 xl:p-4",
            "bg-white/80 dark:bg-gray-800/80 hover:bg-primary hover:text-primary-foreground",
            "text-foreground rounded-full transition-all duration-300",
            "shadow-xl hover:scale-110 active:scale-95 backdrop-blur-sm",
            "right-4 lg:right-6 xl:right-8"
          )}
          aria-label="Next slide"
        >
          <ChevronRight className="w-6 h-6" strokeWidth={2.5} />
        </button>
      </div>

      {/* Indicators - All screens */}
      <div
        className="absolute bottom-6 sm:bottom-8 left-1/2 -translate-x-1/2 z-30 flex gap-2 sm:gap-2.5 items-center"
        role="tablist"
      >
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={cn(
              "rounded-full transition-all duration-500 cursor-pointer",
              index === current
                ? "bg-primary w-6 sm:w-8 md:w-10 h-1.5 sm:h-2 shadow-lg shadow-primary/50"
                : "bg-white/30 dark:bg-white/20 w-1.5 sm:w-2 h-1.5 sm:h-2 hover:bg-white/50 hover:w-3 sm:hover:w-4"
            )}
            aria-label={`Go to slide ${index + 1}`}
            aria-selected={index === current}
            role="tab"
          />
        ))}
      </div>

      {/* Screen Reader */}
      <div className="sr-only" aria-live="polite" aria-atomic="true">
        Slide {current + 1} of {slides.length}
      </div>
    </section>
  )
}