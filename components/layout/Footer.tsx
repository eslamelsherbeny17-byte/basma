'use client'

import type React from 'react'
import Link from 'next/link'
import {
  Facebook,
  Instagram,
  Twitter,
  Youtube,
  Mail,
  Phone,
  MapPin,
  Send,
} from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { useLanguage } from '@/contexts/LanguageContext'
import { useState, useCallback } from 'react'
import { cn } from '@/lib/utils'

export function Footer() {
  const { t, language, isRTL } = useLanguage()
  const [email, setEmail] = useState('')
  const [isSubscribing, setIsSubscribing] = useState(false)

  const handleSubscribe = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault()
      if (!email.trim() || isSubscribing) return
      setIsSubscribing(true)
      setTimeout(() => {
        setEmail('')
        setIsSubscribing(false)
      }, 1000)
    },
    [email, isSubscribing]
  )

  const socialLinks = [
    { href: '#', icon: Facebook, label: 'Facebook' },
    { href: '#', icon: Instagram, label: 'Instagram' },
    { href: '#', icon: Twitter, label: 'Twitter' },
    { href: '#', icon: Youtube, label: 'Youtube' },
  ]

  const quickLinks = [
    { href: '/about', label: t('aboutUs') },
    { href: '/shop', label: t('shop') },
    { href: '/contact', label: t('contactUs') },
    { href: '/track-order', label: t('trackOrder') },
    { href: '/faq', label: t('faq') },
  ]

  const customerServiceLinks = [
    { href: '/privacy', label: t('privacyPolicy') },
    { href: '/terms', label: t('termsConditions') },
    { href: '/shipping', label: t('shippingDelivery') },
    { href: '/returns', label: t('returnPolicy') },
    { href: '/payment', label: t('paymentMethods') },
  ]

  const paymentMethods = [
    { name: t('visa'), key: 'visa' },
    { name: t('mastercard'), key: 'mastercard' },
    { name: t('paypal'), key: 'paypal' },
    { name: t('fawry'), key: 'fawry' },
  ]

  return (
    <footer
      className='bg-accent text-white dark:bg-gray-900 border-t border-white/5'
      role='contentinfo'
    >
      <div className='container mx-auto px-6 py-10 lg:py-16'>
        {/* نظام شبكة احترافي للموبايل والديسكطوب */}
        <div className='grid grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-12'>
          {/* 1. قسم عن المتجر - يأخذ العرض الكامل في الموبايل */}
          <div className='col-span-2 lg:col-span-1 space-y-6'>
            <h3 className='text-2xl font-black bg-gradient-to-r from-primary via-yellow-400 to-primary bg-clip-text text-transparent inline-block'>
              {language === 'ar' ? 'أيمن بشير' : 'Ayman Bashir'}
            </h3>
            <p className='text-sm text-gray-400 leading-relaxed max-w-xs'>
              {language === 'ar'
                ? 'متجر متخصص في الأزياء الإسلامية العصرية والأنيقة، نقدم لكم الجودة والرقي في كل قطعة.'
                : 'Modern and elegant Islamic fashion store, offering quality and sophistication in every piece.'}
            </p>
            <div className='flex gap-4'>
              {socialLinks.map((social) => (
                <Link
                  key={social.label}
                  href={social.href}
                  className='w-9 h-9 flex items-center justify-center rounded-full bg-white/5 hover:bg-primary hover:text-accent transition-all duration-300 border border-white/10'
                  aria-label={social.label}
                >
                  <social.icon className='h-4 w-4' />
                </Link>
              ))}
            </div>
          </div>

          {/* 2. روابط سريعة - يظهر بجانب خدمة العملاء في الموبايل */}
          <div className='col-span-1 space-y-5'>
            <h4 className='text-sm font-bold uppercase tracking-widest text-primary/80'>
              {t('quickLinks')}
            </h4>
            <ul className='space-y-3'>
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className='text-sm text-gray-400 hover:text-primary transition-colors duration-200'
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* 3. خدمة العملاء - بجانب روابط سريعة */}
          <div className='col-span-1 space-y-5'>
            <h4 className='text-sm font-bold uppercase tracking-widest text-primary/80'>
              {t('customerService')}
            </h4>
            <ul className='space-y-3'>
              {customerServiceLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className='text-sm text-gray-400 hover:text-primary transition-colors duration-200'
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* 4. التواصل والنشرة البريدية - العرض الكامل في الموبايل */}
          <div className='col-span-2 lg:col-span-1 space-y-6'>
            <h4 className='text-sm font-bold uppercase tracking-widest text-primary/80'>
              {t('contactUs')}
            </h4>

            <div className='space-y-3 bg-white/5 p-4 rounded-2xl border border-white/10'>
              <div className='flex items-center gap-3'>
                <MapPin className='h-4 w-4 text-primary shrink-0' />
                <span className='text-sm text-gray-300'>{t('cairo')}</span>
              </div>
              <div className='flex items-center gap-3'>
                <Phone className='h-4 w-4 text-primary shrink-0' />
                <a
                  href='tel:+201234567890'
                  className='text-sm text-gray-300 hover:text-primary'
                >
                  {t('phoneNumber')}
                </a>
              </div>
              <div className='flex items-center gap-3'>
                <Mail className='h-4 w-4 text-primary shrink-0' />
                <a
                  href='mailto:info@aymanbasher.com'
                  className='text-sm text-gray-300 hover:text-primary break-all'
                >
                  {t('emailAddress')}
                </a>
              </div>
            </div>

            <form onSubmit={handleSubscribe} className='relative group'>
              <Input
                type='email'
                placeholder={t('enterEmail')}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className='bg-white/5 border-white/10 text-white rounded-xl h-12 pr-12 focus:border-primary transition-all'
              />
              <Button
                type='submit'
                size='icon'
                disabled={isSubscribing || !email.trim()}
                className={cn(
                  'absolute top-1 bottom-1 w-10 h-10 bg-primary text-accent hover:bg-yellow-400 transition-all rounded-lg',
                  isRTL ? 'left-1' : 'right-1'
                )}
              >
                <Send className='h-4 w-4' />
              </Button>
            </form>
          </div>
        </div>
      </div>

      <div className='border-t border-white/5'>
        <div className='container mx-auto px-6 py-6'>
          <div className='flex flex-col md:flex-row justify-between items-center gap-6'>
            <p className='text-xs text-gray-500 font-medium order-2 md:order-1'>
              {t('copyright')}
            </p>

            {/* طرق الدفع بتنسيق أنيق */}
            <div className='flex gap-3 items-center order-1 md:order-2'>
              {paymentMethods.map((method) => (
                <div
                  key={method.key}
                  className='px-3 py-1 bg-white/5 rounded-md border border-white/10 text-[10px] uppercase tracking-tighter text-gray-400 font-bold'
                >
                  {method.name}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
