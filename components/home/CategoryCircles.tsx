// 'use client'

// import Link from 'next/link'
// import Image from 'next/image'
// import { cn } from '@/lib/utils'
// import { useLanguage } from '@/contexts/LanguageContext'

// const categories = {
//   ar: [
//     {
//       id: 1,
//       name: 'عباءات',
//       image: '/elegant-burgundy-coat.jpg',
//       slug: 'abayas',
//       color: 'bg-rose-100 dark:bg-rose-900/30',
//     },
//     {
//       id: 2,
//       name: 'حجاب',
//       image: '/modest-black-abaya-hijab.jpg',
//       slug: 'hijabs',
//       color: 'bg-blue-100 dark:bg-blue-900/30',
//     },
//     {
//       id: 3,
//       name: 'فساتين',
//       image: '/------------------.jpg',
//       slug: 'dresses',
//       color: 'bg-purple-100 dark:bg-purple-900/30',
//     },
//     {
//       id: 4,
//       name: 'ملابس رياضية',
//       image: '/---------------.jpg',
//       slug: 'sportswear',
//       color: 'bg-green-100 dark:bg-green-900/30',
//     },
//     {
//       id: 5,
//       name: 'إكسسوارات',
//       image: '/modest-oversize-shirt.jpg',
//       slug: 'accessories',
//       color: 'bg-amber-100 dark:bg-amber-900/30',
//     },
//   ],
//   en: [
//     {
//       id: 1,
//       name: 'Abayas',
//       image: '/elegant-burgundy-coat.jpg',
//       slug: 'abayas',
//       color: 'bg-rose-100 dark:bg-rose-900/30',
//     },
//     {
//       id: 2,
//       name: 'Hijabs',
//       image: '/modest-black-abaya-hijab.jpg',
//       slug: 'hijabs',
//       color: 'bg-blue-100 dark:bg-blue-900/30',
//     },
//     {
//       id: 3,
//       name: 'Dresses',
//       image: '/------------------.jpg',
//       slug: 'dresses',
//       color: 'bg-purple-100 dark:bg-purple-900/30',
//     },
//     {
//       id: 4,
//       name: 'Sportswear',
//       image: '/---------------.jpg',
//       slug: 'sportswear',
//       color: 'bg-green-100 dark:bg-green-900/30',
//     },
//     {
//       id: 5,
//       name: 'Accessories',
//       image: '/modest-oversize-shirt.jpg',
//       slug: 'accessories',
//       color: 'bg-amber-100 dark:bg-amber-900/30',
//     },
//   ],
// }

// export function CategoryCircles() {
//   const { language } = useLanguage()
//   const categoryList = categories[language]

//   return (
//     <section
//       className='py-8 sm:py-16 bg-background overflow-hidden'
//       aria-labelledby='categories-heading'
//     >
//       <div className='container mx-auto px-4'>
//         <h2
//           id='categories-heading'
//           className='text-xl sm:text-3xl font-bold text-center mb-6 sm:mb-12 text-foreground'
//         >
//           {language === 'ar' ? 'تسوقي حسب الفئة' : 'Shop by Category'}
//         </h2>

//         {/* التعديل السحري هنا:
//             - flex overflow-x-auto: يجعل العناصر بجانب بعضها وتتحرك أفقياً على الموبايل
//             - sm:grid: يعيدها لشكل الشبكة الطبيعي على الشاشات الكبيرة
//             - scrollbar-hide: يخفي شريط التمرير المزعج
//         */}
//         <div className='flex overflow-x-auto sm:grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-8 pb-4 sm:pb-0 px-2 sm:px-0 scrollbar-none snap-x'>
//           {categoryList.map((category) => (
//             <Link
//               key={category.id}
//               href={`/shop?category=${category.slug}`}
//               className='group flex flex-col items-center min-w-[100px] sm:min-w-0 snap-center transition-all'
//               aria-label={`Browse ${category.name}`}
//             >
//               {/* حجم الدوائر تم تصغيره للموبايل ليكون 20 وتكبيره للكمبيوتر ليصل لـ 40 */}
//               <div className='relative w-20 h-20 sm:w-32 md:w-40 sm:h-32 md:h-40 mb-2 sm:mb-4'>
//                 {/* Circle Background */}
//                 <div
//                   className={cn(
//                     'absolute inset-0 rounded-full transition-all group-hover:scale-110 duration-300',
//                     category.color
//                   )}
//                   aria-hidden='true'
//                 />

//                 {/* Image Container */}
//                 <div className='relative w-full h-full rounded-full overflow-hidden border-2 sm:border-4 border-background dark:border-gray-800 shadow-md group-hover:shadow-xl transition-all'>
//                   <Image
//                     src={category.image || '/placeholder.svg'}
//                     alt=''
//                     fill
//                     className='object-cover transition-transform group-hover:scale-110 duration-500'
//                     sizes='(max-width: 640px) 80px, 160px'
//                   />
//                 </div>
//               </div>

//               <h3 className='text-xs sm:text-base font-bold group-hover:text-primary transition-colors text-center whitespace-nowrap'>
//                 {category.name}
//               </h3>
//             </Link>
//           ))}
//         </div>
//       </div>

//       {/* CSS لإخفاء شريط التمرير وجعل الحركة ناعمة */}
//       <style jsx global>{`
//         .scrollbar-none::-webkit-scrollbar {
//           display: none;
//         }
//         .scrollbar-none {
//           -ms-overflow-style: none;
//           scrollbar-width: none;
//         }
//       `}</style>
//     </section>
//   )
// }
'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Loader2 } from 'lucide-react'
import { cn, getImageUrl } from '@/lib/utils'
import { useLanguage } from '@/contexts/LanguageContext'
import { categoriesAPI } from '@/lib/api' // استيراد الأداة التي قمت بتعريفها
import type { Category } from '@/lib/types'

// مصفوفة ألوان عشوائية للخلفية لأن الباك إيند لا يوفر ألواناً
const bgColors = [
  'bg-rose-100 dark:bg-rose-900/30',
  'bg-blue-100 dark:bg-blue-900/30',
  'bg-purple-100 dark:bg-purple-900/30',
  'bg-green-100 dark:bg-green-900/30',
  'bg-amber-100 dark:bg-amber-900/30',
  'bg-indigo-100 dark:bg-indigo-900/30',
]

export function CategoryCircles() {
  const { language } = useLanguage()
  const [categories, setCategories] = useState<Category[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(false)

  // جلب البيانات من الباك إيند
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setIsLoading(true)
        const data = await categoriesAPI.getAll()
        setCategories(data)
      } catch (err) {
        console.error('Failed to fetch categories:', err)
        setError(true)
      } finally {
        setIsLoading(false)
      }
    }

    fetchCategories()
  }, [])

  // حالة التحميل (Loading State)
  if (isLoading) {
    return (
      <div className='py-20 flex flex-col items-center justify-center'>
        <Loader2 className='h-10 w-10 animate-spin text-primary mb-4' />
        <p className='text-muted-foreground animate-pulse'>
          {language === 'ar'
            ? 'جاري تحميل التصنيفات...'
            : 'Loading categories...'}
        </p>
      </div>
    )
  }

  // في حالة الخطأ أو عدم وجود بيانات
  if (error || categories.length === 0) return null

  return (
    <section
      className='py-8 sm:py-16 bg-background overflow-hidden'
      aria-labelledby='categories-heading'
    >
      <div className='container mx-auto px-4'>
        <h2
          id='categories-heading'
          className='text-xl sm:text-3xl font-bold text-center mb-6 sm:mb-12 text-foreground'
        >
          {language === 'ar' ? 'تسوقي حسب الفئة' : 'Shop by Category'}
        </h2>

        {/* التمرير الأفقي المحترف */}
        <div className='flex overflow-x-auto sm:grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-8 pb-4 sm:pb-0 px-2 sm:px-0 scrollbar-none snap-x'>
          {categories.map((category, index) => (
            <Link
              key={category._id}
              href={`/shop?category=${category._id}`} // الربط باستخدام الـ ID لضمان دقة الفلترة
              className='group flex flex-col items-center min-w-[100px] sm:min-w-0 snap-center transition-all'
            >
              <div className='relative w-20 h-20 sm:w-32 md:w-40 sm:h-32 md:h-40 mb-2 sm:mb-4'>
                {/* Background Color - نختار لوناً من المصفوفة بناءً على الترتيب */}
                <div
                  className={cn(
                    'absolute inset-0 rounded-full transition-all group-hover:scale-110 duration-300',
                    bgColors[index % bgColors.length]
                  )}
                />

                {/* Image Container */}
                <div className='relative w-full h-full rounded-full overflow-hidden border-2 sm:border-4 border-background dark:border-gray-800 shadow-md group-hover:shadow-xl transition-all'>
                  <Image
                    src={
                      getImageUrl(category.image || '') || '/placeholder.svg'
                    }
                    alt={category.name}
                    fill
                    className='object-cover transition-transform group-hover:scale-110 duration-500'
                    sizes='(max-width: 640px) 80px, 160px'
                  />
                </div>
              </div>

              <h3 className='text-xs sm:text-base font-bold group-hover:text-primary transition-colors text-center whitespace-nowrap'>
                {category.name}
              </h3>
            </Link>
          ))}
        </div>
      </div>

      <style jsx global>{`
        .scrollbar-none::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-none {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </section>
  )
}
