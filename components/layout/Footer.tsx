"use client"

import type React from "react"

import Link from "next/link"
import { Facebook, Instagram, Twitter, Youtube, Mail, Phone, MapPin, Send } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { useLanguage } from "@/contexts/LanguageContext"
import { useState, useCallback } from "react"
import { cn } from "@/lib/utils"

export function Footer() {
  const { t, language, isRTL } = useLanguage()
  const [email, setEmail] = useState("")
  const [isSubscribing, setIsSubscribing] = useState(false)

  const handleSubscribe = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault()
      if (!email.trim() || isSubscribing) return

      setIsSubscribing(true)
      // Add newsletter subscription logic here
      console.log("Subscribe:", email)

      // Simulate API call
      setTimeout(() => {
        setEmail("")
        setIsSubscribing(false)
        // Show success toast here
      }, 1000)
    },
    [email, isSubscribing],
  )

  const socialLinks = [
    { href: "#", icon: Facebook, label: "Facebook" },
    { href: "#", icon: Instagram, label: "Instagram" },
    { href: "#", icon: Twitter, label: "Twitter" },
    { href: "#", icon: Youtube, label: "Youtube" },
  ]

  const quickLinks = [
    { href: "/about", label: t("aboutUs") },
    { href: "/shop", label: t("shop") },
    { href: "/contact", label: t("contactUs") },
    { href: "/track-order", label: t("trackOrder") },
    { href: "/faq", label: t("faq") },
  ]

  const customerServiceLinks = [
    { href: "/privacy", label: t("privacyPolicy") },
    { href: "/terms", label: t("termsConditions") },
    { href: "/shipping", label: t("shippingDelivery") },
    { href: "/returns", label: t("returnPolicy") },
    { href: "/payment", label: t("paymentMethods") },
  ]

  const paymentMethods = [
    { name: t("visa"), key: "visa" },
    { name: t("mastercard"), key: "mastercard" },
    { name: t("paypal"), key: "paypal" },
    { name: t("fawry"), key: "fawry" },
  ]

  return (
    <footer className="bg-accent text-white dark:bg-gray-900 transition-colors duration-300" role="contentinfo">
      {/* Main Footer */}
      <div className="container mx-auto px-4 py-8 md:py-12 lg:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 lg:gap-10">
          {/* About Section */}
          <div className="space-y-4">
            <h3 className="text-lg sm:text-xl md:text-2xl font-bold bg-gradient-to-r from-primary via-yellow-400 to-primary bg-clip-text text-transparent">
              {language === "ar" ? "أيمن بشير" : "Ayman Bashir"}
            </h3>
            <p className="text-xs sm:text-sm md:text-base text-gray-300 dark:text-gray-400 leading-relaxed">
              {language === "ar"
                ? "متجر متخصص في الأزياء الإسلامية العصرية والأنيقة"
                : "Modern and elegant Islamic fashion store"}
            </p>

            {/* Social Links */}
            <div className="flex gap-2 md:gap-3" role="list" aria-label="Social media links">
              {socialLinks.map((social) => (
                <Link
                  key={social.label}
                  href={social.href}
                  className="hover:text-primary transition-colors p-2 hover:bg-white/10 dark:hover:bg-white/5 rounded-lg focus-ring"
                  aria-label={social.label}
                  role="listitem"
                >
                  <social.icon className="h-4 w-4 md:h-5 md:w-5" />
                </Link>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="text-sm sm:text-base md:text-lg font-semibold">{t("quickLinks")}</h4>
            <ul className="space-y-2" role="list">
              {quickLinks.map((link) => (
                <li key={link.href} role="listitem">
                  <Link
                    href={link.href}
                    className={cn(
                      "text-xs sm:text-sm md:text-base text-gray-300 dark:text-gray-400 hover:text-primary transition-all inline-block duration-200 focus-ring rounded",
                      isRTL ? "hover:-translate-x-1" : "hover:translate-x-1",
                    )}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Customer Service */}
          <div className="space-y-4">
            <h4 className="text-sm sm:text-base md:text-lg font-semibold">{t("customerService")}</h4>
            <ul className="space-y-2" role="list">
              {customerServiceLinks.map((link) => (
                <li key={link.href} role="listitem">
                  <Link
                    href={link.href}
                    className={cn(
                      "text-xs sm:text-sm md:text-base text-gray-300 dark:text-gray-400 hover:text-primary transition-all inline-block duration-200 focus-ring rounded",
                      isRTL ? "hover:-translate-x-1" : "hover:translate-x-1",
                    )}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact & Newsletter */}
          <div className="space-y-4">
            <h4 className="text-sm sm:text-base md:text-lg font-semibold">{t("contactUs")}</h4>

            {/* Contact Info */}
            <ul className="space-y-3" role="list">
              <li className="flex items-start gap-2" role="listitem">
                <MapPin className="h-4 w-4 md:h-5 md:w-5 text-primary mt-0.5 flex-shrink-0" aria-hidden="true" />
                <span className="text-xs sm:text-sm md:text-base text-gray-300 dark:text-gray-400">{t("cairo")}</span>
              </li>
              <li className="flex items-center gap-2" role="listitem">
                <Phone className="h-4 w-4 md:h-5 md:w-5 text-primary flex-shrink-0" aria-hidden="true" />
                <a
                  href="tel:+201234567890"
                  className="text-xs sm:text-sm md:text-base text-gray-300 dark:text-gray-400 hover:text-primary transition-colors focus-ring rounded"
                  aria-label={`Call ${t("phoneNumber")}`}
                >
                  {t("phoneNumber")}
                </a>
              </li>
              <li className="flex items-center gap-2" role="listitem">
                <Mail className="h-4 w-4 md:h-5 md:w-5 text-primary flex-shrink-0" aria-hidden="true" />
                <a
                  href="mailto:info@aymanbasher.com"
                  className="text-xs sm:text-sm md:text-base text-gray-300 dark:text-gray-400 hover:text-primary transition-colors break-all focus-ring rounded"
                  aria-label={`Email ${t("emailAddress")}`}
                >
                  {t("emailAddress")}
                </a>
              </li>
            </ul>

            {/* Newsletter */}
            <div className="mt-4 md:mt-6 space-y-2">
              <p className="text-xs md:text-sm text-gray-300 dark:text-gray-400">{t("subscribeNewsletter")}</p>
              <form onSubmit={handleSubscribe} className="flex gap-2" role="form" aria-label="Newsletter subscription">
                <div className="flex-1">
                  <Input
                    type="email"
                    placeholder={t("enterEmail")}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={isSubscribing}
                    className="bg-white/10 dark:bg-white/5 border-white/20 dark:border-white/10 text-white placeholder:text-gray-400 focus:border-primary focus:ring-primary/20 text-xs sm:text-sm h-9 sm:h-10"
                    aria-label={t("enterEmail")}
                  />
                </div>
                <Button
                  type="submit"
                  disabled={isSubscribing || !email.trim()}
                  className="bg-gradient-to-r from-primary to-yellow-500 hover:from-primary/90 hover:to-yellow-500/90 text-accent dark:text-gray-900 font-bold text-xs sm:text-sm whitespace-nowrap px-3 md:px-4 h-9 sm:h-10 focus-ring disabled:opacity-50"
                  aria-label={t("subscribe")}
                >
                  <Send className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                  <span className="hidden sm:inline ml-1.5">{t("subscribe")}</span>
                </Button>
              </form>
            </div>
          </div>
        </div>
      </div>

      <Separator className="bg-white/10 dark:bg-white/5" />

      {/* Bottom Footer */}
      <div className="container mx-auto px-4 py-4 md:py-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-xs md:text-sm text-gray-400 dark:text-gray-500">
          <p className="text-center md:text-left">{t("copyright")}</p>

          {/* Payment Methods */}
          <div
            className="flex gap-2 md:gap-4 items-center flex-wrap justify-center"
            role="list"
            aria-label="Payment methods"
          >
            {paymentMethods.map((method) => (
              <span
                key={method.key}
                className="px-2 md:px-3 py-1 bg-white/10 dark:bg-white/5 rounded text-[10px] sm:text-xs"
                role="listitem"
              >
                {method.name}
              </span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
