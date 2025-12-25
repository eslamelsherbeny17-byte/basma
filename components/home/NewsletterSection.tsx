'use client'

import { useState } from 'react'
import { Mail, Send } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

export function NewsletterSection() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // API call to subscribe
      await new Promise((resolve) => setTimeout(resolve, 1000))
      alert('تم الاشتراك بنجاح!')
      setEmail('')
    } catch (error) {
      alert('حدث خطأ. حاول مرة أخرى')
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className='py-16 bg-gradient-to-br from-primary to-primary-600'>
      <div className='container mx-auto px-4'>
        <Card className='max-w-3xl mx-auto bg-white/95 backdrop-blur'>
          <div className='p-8 md:p-12 text-center'>
            <div className='w-16 h-16 mx-auto mb-6 rounded-full bg-primary/10 flex items-center justify-center'>
              <Mail className='h-8 w-8 text-primary' />
            </div>

            <h2 className='text-3xl md:text-4xl font-bold mb-4'>
              اشتركي في نشرتنا الإخبارية
            </h2>
            <p className='text-muted-foreground mb-8 text-lg'>
              احصلي على آخر العروض والمنتجات الجديدة مباشرة في بريدك
            </p>

            <form
              onSubmit={handleSubmit}
              className='flex gap-2 max-w-md mx-auto'
            >
              <Input
                type='email'
                placeholder='أدخلي بريدك الإلكتروني'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className='flex-1 h-12'
              />
              <Button
                type='submit'
                size='lg'
                className='gold-gradient'
                disabled={loading}
              >
                <Send className='h-5 w-5' />
              </Button>
            </form>

            <p className='text-xs text-muted-foreground mt-4'>
              بالاشتراك، أنت توافق على{' '}
              <a href='/privacy' className='underline'>
                سياسة الخصوصية
              </a>
            </p>
          </div>
        </Card>
      </div>
    </section>
  )
}
