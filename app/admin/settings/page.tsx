// app/admin/settings/page.tsx
'use client'

import { useState } from 'react'
import { Save, Upload, Loader2, Settings as SettingsIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Switch } from '@/components/ui/switch'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useToast } from '@/hooks/use-toast'

export default function SettingsPage() {
  const { toast } = useToast()
  const [saving, setSaving] = useState(false)
  const [settings, setSettings] = useState({
    siteName: 'أيمن بشير',
    siteDescription: 'متجر الأزياء الإسلامية العصرية',
    email: 'info@aymanbasher.com',
    phone: '+20 123 456 7890',
    address: 'القاهرة، مصر',
    freeShippingThreshold: '500',
    shippingCost: '50',
    taxRate: '14',
    currency: 'EGP',
    maintenanceMode: false,
    emailNotifications: true,
    smsNotifications: false,
  })

  const handleSave = async () => {
    setSaving(true)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      toast({ 
        title: '✅ تم الحفظ', 
        description: 'تم حفظ الإعدادات بنجاح' 
      })
    } catch (error) {
      toast({ 
        title: '❌ خطأ', 
        description: 'فشل حفظ الإعدادات', 
        variant: 'destructive' 
      })
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className='space-y-4 sm:space-y-6 max-w-4xl p-3 sm:p-4 md:p-6' dir="rtl">
      {/* Header */}
      <div>
        <h1 className='text-xl sm:text-2xl md:text-3xl font-bold bg-gradient-to-r from-gray-700 to-gray-900 dark:from-gray-300 dark:to-gray-100 bg-clip-text text-transparent'>
          الإعدادات
        </h1>
        <p className='text-xs sm:text-sm text-muted-foreground mt-1'>
          إدارة إعدادات المتجر
        </p>
      </div>

      <Tabs defaultValue='general' className='space-y-4 sm:space-y-6'>
        <TabsList className='grid w-full grid-cols-2 sm:grid-cols-4 h-auto'>
          <TabsTrigger value='general' className='text-xs sm:text-sm'>عام</TabsTrigger>
          <TabsTrigger value='shipping' className='text-xs sm:text-sm'>الشحن</TabsTrigger>
          <TabsTrigger value='notifications' className='text-xs sm:text-sm'>الإشعارات</TabsTrigger>
          <TabsTrigger value='advanced' className='text-xs sm:text-sm'>متقدم</TabsTrigger>
        </TabsList>

        {/* General Settings */}
        <TabsContent value='general' className='space-y-4 sm:space-y-6'>
          <Card className='border-0 shadow-sm'>
            <CardHeader>
              <CardTitle className='text-base sm:text-lg'>معلومات المتجر</CardTitle>
              <CardDescription className='text-xs sm:text-sm'>
                المعلومات الأساسية للمتجر
              </CardDescription>
            </CardHeader>
            <CardContent className='space-y-4'>
              <div className='space-y-2'>
                <Label htmlFor='siteName' className='text-sm font-semibold'>اسم المتجر</Label>
                <Input
                  id='siteName'
                  value={settings.siteName}
                  onChange={(e) =>
                    setSettings({ ...settings, siteName: e.target.value })
                  }
                  className='h-10 sm:h-11'
                />
              </div>

              <div className='space-y-2'>
                <Label htmlFor='siteDescription' className='text-sm font-semibold'>وصف المتجر</Label>
                <Textarea
                  id='siteDescription'
                  value={settings.siteDescription}
                  onChange={(e) =>
                    setSettings({ ...settings, siteDescription: e.target.value })
                  }
                  className='min-h-[80px] resize-none'
                />
              </div>

              <div className='grid sm:grid-cols-2 gap-4'>
                <div className='space-y-2'>
                  <Label htmlFor='email' className='text-sm font-semibold'>البريد الإلكتروني</Label>
                  <Input
                    id='email'
                    type='email'
                    value={settings.email}
                    onChange={(e) =>
                      setSettings({ ...settings, email: e.target.value })
                    }
                    className='h-10 sm:h-11'
                  />
                </div>

                <div className='space-y-2'>
                  <Label htmlFor='phone' className='text-sm font-semibold'>رقم الهاتف</Label>
                  <Input
                    id='phone'
                    value={settings.phone}
                    onChange={(e) =>
                      setSettings({ ...settings, phone: e.target.value })
                    }
                    className='h-10 sm:h-11'
                  />
                </div>
              </div>

              <div className='space-y-2'>
                <Label htmlFor='address' className='text-sm font-semibold'>العنوان</Label>
                <Input
                  id='address'
                  value={settings.address}
                  onChange={(e) =>
                    setSettings({ ...settings, address: e.target.value })
                  }
                  className='h-10 sm:h-11'
                />
              </div>
            </CardContent>
          </Card>

          <Card className='border-0 shadow-sm'>
            <CardHeader>
              <CardTitle className='text-base sm:text-lg'>الشعار والصور</CardTitle>
              <CardDescription className='text-xs sm:text-sm'>
                شعار المتجر والصور الأساسية
              </CardDescription>
            </CardHeader>
            <CardContent className='space-y-4'>
              <div className='space-y-2'>
                <Label className='text-sm font-semibold'>شعار المتجر</Label>
                <div className='flex flex-col sm:flex-row items-start sm:items-center gap-4'>
                  <div className='w-24 h-24 sm:w-32 sm:h-32 rounded-lg border-2 border-dashed flex items-center justify-center bg-secondary'>
                    <Upload className='h-6 w-6 sm:h-8 sm:w-8 text-muted-foreground' />
                  </div>
                  <Button variant='outline' size='sm'>رفع الشعار</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Shipping Settings */}
        <TabsContent value='shipping' className='space-y-4 sm:space-y-6'>
          <Card className='border-0 shadow-sm'>
            <CardHeader>
              <CardTitle className='text-base sm:text-lg'>إعدادات الشحن</CardTitle>
              <CardDescription className='text-xs sm:text-sm'>
                تكاليف وخيارات الشحن
              </CardDescription>
            </CardHeader>
            <CardContent className='space-y-4'>
              <div className='grid sm:grid-cols-2 gap-4'>
                <div className='space-y-2'>
                  <Label htmlFor='shippingCost' className='text-sm font-semibold'>
                    تكلفة الشحن (جنيه)
                  </Label>
                  <Input
                    id='shippingCost'
                    type='number'
                    value={settings.shippingCost}
                    onChange={(e) =>
                      setSettings({ ...settings, shippingCost: e.target.value })
                    }
                    className='h-10 sm:h-11'
                  />
                </div>

                <div className='space-y-2'>
                  <Label htmlFor='freeShippingThreshold' className='text-sm font-semibold'>
                    حد الشحن المجاني (جنيه)
                  </Label>
                  <Input
                    id='freeShippingThreshold'
                    type='number'
                    value={settings.freeShippingThreshold}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        freeShippingThreshold: e.target.value,
                      })
                    }
                    className='h-10 sm:h-11'
                  />
                  <p className='text-xs text-muted-foreground'>
                    الشحن مجاني للطلبات فوق هذا المبلغ
                  </p>
                </div>
              </div>

              <div className='space-y-2'>
                <Label htmlFor='taxRate' className='text-sm font-semibold'>
                  معدل الضريبة (%)
                </Label>
                <Input
                  id='taxRate'
                  type='number'
                  value={settings.taxRate}
                  onChange={(e) =>
                    setSettings({ ...settings, taxRate: e.target.value })
                  }
                  className='h-10 sm:h-11'
                />
              </div>

              <div className='space-y-2'>
                <Label htmlFor='currency' className='text-sm font-semibold'>العملة</Label>
                <Input
                  id='currency'
                  value={settings.currency}
                  onChange={(e) =>
                    setSettings({ ...settings, currency: e.target.value })
                  }
                  className='h-10 sm:h-11'
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notifications Settings */}
        <TabsContent value='notifications' className='space-y-4 sm:space-y-6'>
          <Card className='border-0 shadow-sm'>
            <CardHeader>
              <CardTitle className='text-base sm:text-lg'>إعدادات الإشعارات</CardTitle>
              <CardDescription className='text-xs sm:text-sm'>
                تفعيل وإلغاء تفعيل الإشعارات
              </CardDescription>
            </CardHeader>
            <CardContent className='space-y-6'>
              <div className='flex items-center justify-between'>
                <div className='space-y-1'>
                  <Label className='text-sm font-semibold'>إشعارات البريد الإلكتروني</Label>
                  <p className='text-xs text-muted-foreground'>
                    استقبال إشعارات الطلبات عبر البريد
                  </p>
                </div>
                <Switch
                  checked={settings.emailNotifications}
                  onCheckedChange={(checked) =>
                    setSettings({ ...settings, emailNotifications: checked })
                  }
                />
              </div>

              <Separator />

              <div className='flex items-center justify-between'>
                <div className='space-y-1'>
                  <Label className='text-sm font-semibold'>إشعارات الرسائل القصيرة</Label>
                  <p className='text-xs text-muted-foreground'>
                    استقبال إشعارات الطلبات عبر SMS
                  </p>
                </div>
                <Switch
                  checked={settings.smsNotifications}
                  onCheckedChange={(checked) =>
                    setSettings({ ...settings, smsNotifications: checked })
                  }
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Advanced Settings */}
        <TabsContent value='advanced' className='space-y-4 sm:space-y-6'>
          <Card className='border-0 shadow-sm'>
            <CardHeader>
              <CardTitle className='text-base sm:text-lg'>إعدادات متقدمة</CardTitle>
              <CardDescription className='text-xs sm:text-sm'>
                إعدادات للمطورين والصيانة
              </CardDescription>
            </CardHeader>
            <CardContent className='space-y-6'>
              <div className='flex items-center justify-between'>
                <div className='space-y-1'>
                  <Label className='text-sm font-semibold'>وضع الصيانة</Label>
                  <p className='text-xs text-muted-foreground'>
                    تعطيل الموقع مؤقتاً للصيانة
                  </p>
                </div>
                <Switch
                  checked={settings.maintenanceMode}
                  onCheckedChange={(checked) =>
                    setSettings({ ...settings, maintenanceMode: checked })
                  }
                />
              </div>

              <Separator />

              <div className='space-y-2'>
                <Label className='text-sm font-semibold'>API Key</Label>
                <div className='flex gap-2'>
                  <Input
                    value='sk_test_xxxxxxxxxxxxx'
                    readOnly
                    className='font-mono text-xs sm:text-sm h-10 sm:h-11'
                  />
                  <Button variant='outline' size='sm'>نسخ</Button>
                </div>
              </div>

              <div className='p-4 bg-destructive/10 border border-destructive/20 rounded-lg'>
                <h4 className='font-semibold text-destructive mb-2 text-sm sm:text-base'>
                  منطقة الخطر
                </h4>
                <p className='text-xs sm:text-sm text-muted-foreground mb-4'>
                  حذف جميع البيانات بشكل نهائي
                </p>
                <Button variant='destructive' size='sm'>حذف جميع البيانات</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Save Button */}
      <div className='flex justify-end pt-4 border-t'>
        <Button 
          onClick={handleSave} 
          disabled={saving}
          className='w-full sm:w-auto h-10 sm:h-11 bg-gradient-to-r from-primary to-primary/80'
        >
          {saving ? (
            <>
              <Loader2 className='ml-2 h-4 w-4 animate-spin' />
              جاري الحفظ...
            </>
          ) : (
            <>
              <Save className='ml-2 h-4 w-4' />
              حفظ الإعدادات
            </>
          )}
        </Button>
      </div>
    </div>
  )
}