'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Lock, Mail, Shield, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card'
import { authAPI } from '@/lib/api'
import { useToast } from '@/hooks/use-toast'
import Cookies from 'js-cookie'

export default function AdminLoginPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await authAPI.login(formData)

      // Check if user is admin
      if (response.data.user.role !== 'admin') {
        toast({
          title: 'غير مصرح',
          description: 'هذا الحساب ليس لديه صلاحيات الإدارة',
          variant: 'destructive',
        })
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        Cookies.remove('token')
        return
      }

      // Set token in cookie for middleware
      Cookies.set('token', response.token, { expires: 7 })

      toast({
        title: 'تم تسجيل الدخول بنجاح',
        description: 'مرحباً في لوحة التحكم',
      })

      router.push('/admin')
    } catch (error: any) {
      toast({
        title: 'خطأ',
        description: error.response?.data?.message || 'فشل تسجيل الدخول',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='min-h-screen bg-secondary flex items-center justify-center p-4'>
      <Card className='w-full max-w-md'>
        <CardHeader className='text-center'>
          <div className='mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4'>
            <Shield className='h-8 w-8 text-primary' />
          </div>
          <CardTitle className='text-2xl'>لوحة الإدارة</CardTitle>
          <CardDescription>تسجيل الدخول إلى لوحة التحكم</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className='space-y-4'>
            <div className='space-y-2'>
              <Label htmlFor='email'>البريد الإلكتروني</Label>
              <div className='relative'>
                <Mail className='absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground' />
                <Input
                  id='email'
                  type='email'
                  placeholder='admin@example.com'
                  className='pr-10'
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  required
                  disabled={loading}
                />
              </div>
            </div>

            <div className='space-y-2'>
              <Label htmlFor='password'>كلمة المرور</Label>
              <div className='relative'>
                <Lock className='absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground' />
                <Input
                  id='password'
                  type='password'
                  placeholder='••••••••'
                  className='pr-10'
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  required
                  disabled={loading}
                />
              </div>
            </div>

            <Button
              type='submit'
              className='w-full gold-gradient'
              size='lg'
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className='ml-2 h-4 w-4 animate-spin' />
                  جاري تسجيل الدخول...
                </>
              ) : (
                'تسجيل الدخول'
              )}
            </Button>
          </form>

          <div className='mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg'>
            <p className='text-xs text-blue-800 text-center'>
              <strong>ملاحظة:</strong> يجب أن يكون لديك حساب Admin للدخول
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
