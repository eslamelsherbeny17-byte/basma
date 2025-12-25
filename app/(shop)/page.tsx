import HeroSlider from '@/components/home/HeroSlider'
import { ServicesSection } from '@/components/home/ServicesSection'
import { CategoryCircles } from '@/components/home/CategoryCircles'
import { FlashSale } from '@/components/home/FlashSale'
import { BestSellers } from '@/components/home/BestSellers'
import { NewArrivals } from '@/components/home/NewArrivals'
import { NewsletterSection } from '@/components/home/NewsletterSection'
import { Separator } from '@/components/ui/separator'
import { TopRated } from '@/components/home/TopRated'

export default function HomePage() {
  return (
    <>
      {/* 1. Hero Slider - السلايدر الرئيسي */}
      <HeroSlider />

      {/* 2. Services - الخدمات */}
      <ServicesSection />

      <Separator className='my-0' />

      {/* 3. Categories - الفئات */}
      <CategoryCircles />

      <Separator className='my-0' />

      {/* 4. Flash Sale - العروض السريعة */}
      <FlashSale />

      {/* 5. Best Sellers - الأكثر مبيعاً */}
      <BestSellers />

      {/* Top Rated */}
      <TopRated />

      {/* 6. New Arrivals - وصل حديثاً */}
      <NewArrivals />

      {/* 7. Newsletter - النشرة الإخبارية */}
      <NewsletterSection />
    </>
  )
}
