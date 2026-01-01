'use client'

import { useState } from 'react'
import { Mail, Send, Loader2 } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { useLanguage } from '@/contexts/LanguageContext'
import { cn } from '@/lib/utils'

export function NewsletterSection() {
  const { t, isRTL } = useLanguage()
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000))
      alert(t('subscribeSuccess'))
      setEmail('')
    } catch (error) {
      alert(t('subscribeError'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className='py-8 sm:py-12 bg-gradient-to-br from-primary to-primary/90'>
      <div className='container mx-auto px-4'>
        <Card className='max-w-2xl mx-auto bg-white/95 dark:bg-card/95 backdrop-blur border-0 shadow-xl'>
          <div className='p-6 sm:p-8 text-center' dir={isRTL ? 'rtl' : 'ltr'}>
            {/* Icon */}
            <div className='w-12 h-12 sm:w-14 sm:h-14 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center'>
              <Mail className='h-6 w-6 sm:h-7 sm:w-7 text-primary' />
            </div>

            {/* Title */}
            <h2 className='text-xl sm:text-2xl md:text-3xl font-bold mb-2'>
              {t('newsletterTitle')}
            </h2>

            {/* Description */}
            <p className='text-muted-foreground mb-6 text-sm sm:text-base'>
              {t('newsletterDescription')}
            </p>

            {/* Form */}
            <form
              onSubmit={handleSubmit}
              className='flex flex-col sm:flex-row gap-2 max-w-md mx-auto'
            >
              <Input
                type='email'
                placeholder={t('emailPlaceholder')}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className={cn(
                  'flex-1 h-10 sm:h-11',
                  isRTL && 'text-right'
                )}
                dir={isRTL ? 'rtl' : 'ltr'}
              />
              <Button
                type='submit'
                size='lg'
                className='h-10 sm:h-11 px-6 min-w-[120px]'
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className='h-4 w-4 animate-spin mr-2' />
                    <span className='hidden sm:inline'>{t('subscribing')}</span>
                  </>
                ) : (
                  <>
                    <Send className={cn('h-4 w-4', !isRTL && 'mr-2', isRTL && 'ml-2')} />
                    <span>{t('subscribe')}</span>
                  </>
                )}
              </Button>
            </form>

            {/* Privacy Note */}
            <p className='text-xs text-muted-foreground mt-3' dir={isRTL ? 'rtl' : 'ltr'}>
              {t('privacyText')}{' '}
              <a href='/privacy' className='underline hover:text-primary transition-colors'>
                {t('privacyPolicy')}
              </a>
            </p>
          </div>
        </Card>
      </div>
    </section>
  )
}