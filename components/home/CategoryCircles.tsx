"use client"

import Link from "next/link"
import Image from "next/image"
import { cn } from "@/lib/utils"
import { useLanguage } from "@/contexts/LanguageContext"

const categories = {
  ar: [
    {
      id: 1,
      name: "عباءات",
      image: "/elegant-burgundy-coat.jpg",
      slug: "abayas",
      color: "bg-rose-100 dark:bg-rose-900/30",
    },
    {
      id: 2,
      name: "حجاب",
      image: "/modest-black-abaya-hijab.jpg",
      slug: "hijabs",
      color: "bg-blue-100 dark:bg-blue-900/30",
    },
    {
      id: 3,
      name: "فساتين",
      image: "/------------------.jpg",
      slug: "dresses",
      color: "bg-purple-100 dark:bg-purple-900/30",
    },
    {
      id: 4,
      name: "ملابس رياضية",
      image: "/---------------.jpg",
      slug: "sportswear",
      color: "bg-green-100 dark:bg-green-900/30",
    },
    {
      id: 5,
      name: "إكسسوارات",
      image: "/modest-oversize-shirt.jpg",
      slug: "accessories",
      color: "bg-amber-100 dark:bg-amber-900/30",
    },
  ],
  en: [
    {
      id: 1,
      name: "Abayas",
      image: "/elegant-burgundy-coat.jpg",
      slug: "abayas",
      color: "bg-rose-100 dark:bg-rose-900/30",
    },
    {
      id: 2,
      name: "Hijabs",
      image: "/modest-black-abaya-hijab.jpg",
      slug: "hijabs",
      color: "bg-blue-100 dark:bg-blue-900/30",
    },
    {
      id: 3,
      name: "Dresses",
      image: "/------------------.jpg",
      slug: "dresses",
      color: "bg-purple-100 dark:bg-purple-900/30",
    },
    {
      id: 4,
      name: "Sportswear",
      image: "/---------------.jpg",
      slug: "sportswear",
      color: "bg-green-100 dark:bg-green-900/30",
    },
    {
      id: 5,
      name: "Accessories",
      image: "/modest-oversize-shirt.jpg",
      slug: "accessories",
      color: "bg-amber-100 dark:bg-amber-900/30",
    },
  ],
}

export function CategoryCircles() {
  const { language, t } = useLanguage()
  const categoryList = categories[language]

  return (
    <section className="py-12 sm:py-16 lg:py-20 bg-background" aria-labelledby="categories-heading">
      <div className="container mx-auto px-4">
        <h2
          id="categories-heading"
          className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-8 sm:mb-12 text-foreground"
        >
          {language === "ar" ? "تسوقي حسب الفئة" : "Shop by Category"}
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6 md:gap-8">
          {categoryList.map((category) => (
            <Link
              key={category.id}
              href={`/shop?category=${category.slug}`}
              className="group flex flex-col items-center focus-ring rounded-2xl p-2"
              aria-label={`Browse ${category.name}`}
            >
              <div className="relative w-24 h-24 sm:w-32 sm:h-32 md:w-36 md:h-36 lg:w-40 lg:h-40 mb-3 sm:mb-4">
                {/* Circle Background */}
                <div
                  className={cn(
                    "absolute inset-0 rounded-full transition-transform group-hover:scale-110 duration-300",
                    category.color,
                  )}
                  aria-hidden="true"
                />

                {/* Image Container */}
                <div className="relative w-full h-full rounded-full overflow-hidden border-4 border-background dark:border-gray-800 shadow-lg group-hover:shadow-xl transition-shadow">
                  <Image
                    src={category.image || "/placeholder.svg"}
                    alt=""
                    fill
                    className="object-cover transition-transform group-hover:scale-110 duration-500"
                    sizes="(max-width: 640px) 96px, (max-width: 768px) 128px, (max-width: 1024px) 144px, 160px"
                  />
                </div>

                {/* Hover Overlay */}
                <div className="absolute inset-0 rounded-full bg-primary/0 group-hover:bg-primary/20 transition-colors duration-300" />
              </div>

              <h3 className="text-sm sm:text-base md:text-lg lg:text-xl font-semibold group-hover:text-primary transition-colors text-center">
                {category.name}
              </h3>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
