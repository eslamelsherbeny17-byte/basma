"use client"

import { Truck, RefreshCw, ShieldCheck, Headphones } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { useLanguage } from "@/contexts/LanguageContext"

const services = {
  ar: [
    {
      icon: Truck,
      title: "شحن مجاني",
      description: "للطلبات فوق 500 جنيه",
      color: "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400",
    },
    {
      icon: RefreshCw,
      title: "إرجاع سهل",
      description: "خلال 14 يوم",
      color: "bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400",
    },
    {
      icon: ShieldCheck,
      title: "دفع آمن",
      description: "حماية كاملة للبيانات",
      color: "bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400",
    },
    {
      icon: Headphones,
      title: "دعم 24/7",
      description: "خدمة عملاء متميزة",
      color: "bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400",
    },
  ],
  en: [
    {
      icon: Truck,
      title: "Free Shipping",
      description: "On orders over 500 EGP",
      color: "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400",
    },
    {
      icon: RefreshCw,
      title: "Easy Returns",
      description: "Within 14 days",
      color: "bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400",
    },
    {
      icon: ShieldCheck,
      title: "Secure Payment",
      description: "Full data protection",
      color: "bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400",
    },
    {
      icon: Headphones,
      title: "24/7 Support",
      description: "Outstanding customer service",
      color: "bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400",
    },
  ],
}

export function ServicesSection() {
  const { language } = useLanguage()
  const serviceList = services[language]

  return (
    <section className="py-8 sm:py-12 md:py-16 bg-background" aria-label="Our services">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
          {serviceList.map((service, index) => (
            <Card
              key={index}
              className="border-0 shadow-none hover:shadow-lg dark:hover:shadow-primary/5 transition-all duration-300 bg-card"
            >
              <CardContent className="pt-4 sm:pt-6 text-center p-3 sm:p-4 md:p-6">
                <div
                  className={`w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 mx-auto mb-3 sm:mb-4 rounded-full ${service.color} flex items-center justify-center transition-transform hover:scale-110`}
                  aria-hidden="true"
                >
                  <service.icon className="h-6 w-6 sm:h-7 sm:w-7 md:h-8 md:w-8" />
                </div>
                <h3 className="font-bold text-sm sm:text-base md:text-lg mb-1 text-foreground">{service.title}</h3>
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">{service.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
