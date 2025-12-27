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
      // 1. إرسال الطلب
      const res: any = await authAPI.login(formData)
      
      // طباعة الرد للتأكد (يمكنك مسحه لاحقاً)
      console.log("Raw Response:", res)

      // 2. استخراج التوكن والمستخدم بأي شكل يرسله الخادم
      const token = res.token || res.data?.token || res.data?.data?.token
      const user = res.data?.user || res.user || (res.data?.role ? res.data : res.data?.data)

      // 3. التحقق من اكتمال البيانات
      if (!token || !user) {
        throw new Error('بيانات الدخول غير مكتملة من الخادم')
      }

      // 4. التحقق من صلاحية الأدمن
      if (user.role !== 'admin') {
        toast({
          title: 'غير مصرح',
          description: 'هذا الحساب ليس لديه صلاحيات الإدارة',
          variant: 'destructive',
        })
        return
      }

      // 5. تخزين البيانات في كل مكان
      Cookies.set('token', token, { expires: 7 }) // للميدل وير
      localStorage.setItem('token', token) // للـ API العام
      localStorage.setItem('user', JSON.stringify(user)) // لحالة المستخدم

      toast({
        title: 'تم تسجيل الدخول بنجاح',
        description: `مرحباً بك في لوحة التحكم يا ${user.name || 'مدير النظام'}`,
      })

      // 6. التوجه للوحة التحكم (استخدام window.location يضمن تحديث كل الـ Interceptors)
      window.location.href = '/admin'

    } catch (error: any) {
      console.error("Login Error:", error)
      toast({
        title: 'خطأ',
        description: error.response?.data?.message || error.message || 'فشل تسجيل الدخول',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='min-h-screen bg-secondary flex items-center justify-center p-4 dark:bg-slate-950' dir="rtl">
      <Card className='w-full max-w-md shadow-2xl border-t-4 border-t-primary animate-in fade-in zoom-in duration-300'>
        <CardHeader className='text-center space-y-2'>
          <div className='mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-2 border border-primary/20 shadow-inner'>
            <Shield className='h-8 w-8 text-primary' />
          </div>
          <CardTitle className='text-3xl font-black tracking-tight'>لوحة الإدارة</CardTitle>
          <CardDescription className="text-muted-foreground font-medium">سجل دخولك للوصول إلى أدوات التحكم</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className='space-y-5'>
            <div className='space-y-2'>
              <Label htmlFor='email' className="text-right block font-bold">البريد الإلكتروني</Label>
              <div className='relative group'>
                <Mail className='absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors' />
                <Input
                  id='email'
                  type='email'
                  placeholder='admin@example.com'
                  className='pr-10 h-12 border-2 focus-visible:ring-primary'
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
              <Label htmlFor='password shadow-sm' className="text-right block font-bold">كلمة المرور</Label>
              <div className='relative group'>
                <Lock className='absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors' />
                <Input
                  id='password'
                  type='password'
                  placeholder='••••••••'
                  className='pr-10 h-12 border-2 focus-visible:ring-primary'
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
              className='w-full h-12 text-lg font-black bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-600 hover:to-yellow-700 text-white shadow-lg transition-all active:scale-[0.98]'
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className='ml-2 h-5 w-5 animate-spin' />
                  جاري التحقق من الصلاحيات...
                </>
              ) : (
                'تسجيل الدخول للنظام'
              )}
            </Button>
          </form>

          {/* التنبيه الأزرق كما كان في البداية */}
          <div className='mt-8 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl flex items-start gap-3'>
            <div className="bg-blue-500 text-white rounded-full p-1 mt-0.5">
              <Shield className="h-3 w-3" />
            </div>
            <p className='text-xs text-blue-800 dark:text-blue-300 leading-relaxed font-medium'>
              <strong>ملاحظة هامة:</strong> هذه المنطقة مخصصة لمديري النظام فقط. إذا لم يكن لديك صلاحيات "Admin"، فلن تتمكن من الدخول حتى لو كانت البيانات صحيحة.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}