'use client'

import { useState } from 'react'
import { Save, Upload } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Switch } from '@/components/ui/switch'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

export default function SettingsPage() {
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

  const handleSave = () => {
    console.log('Save settings:', settings)
    alert('تم حفظ الإعدادات بنجاح!')
  }

  return (
    <div className='space-y-6 max-w-4xl'>
      {/* Header */}
      <div>
        <h1 className='text-3xl font-bold mb-2'>الإعدادات</h1>
        <p className='text-muted-foreground'>إدارة إعدادات المتجر</p>
      </div>

      <Tabs defaultValue='general' className='space-y-6'>
        <TabsList>
          <TabsTrigger value='general'>عام</TabsTrigger>
          <TabsTrigger value='shipping'>الشحن</TabsTrigger>
          <TabsTrigger value='notifications'>الإشعارات</TabsTrigger>
          <TabsTrigger value='advanced'>متقدم</TabsTrigger>
        </TabsList>

        {/* General Settings */}
        <TabsContent value='general' className='space-y-6'>
          <Card>
            <CardHeader>
              <CardTitle>معلومات المتجر</CardTitle>
              <CardDescription>المعلومات الأساسية للمتجر</CardDescription>
            </CardHeader>
            <CardContent className='space-y-4'>
              <div className='space-y-2'>
                <Label htmlFor='siteName'>اسم المتجر</Label>
                <Input
                  id='siteName'
                  value={settings.siteName}
                  onChange={(e) =>
                    setSettings({ ...settings, siteName: e.target.value })
                  }
                />
              </div>

              <div className='space-y-2'>
                <Label htmlFor='siteDescription'>وصف المتجر</Label>
                <Textarea
                  id='siteDescription'
                  value={settings.siteDescription}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      siteDescription: e.target.value,
                    })
                  }
                />
              </div>

              <div className='grid md:grid-cols-2 gap-4'>
                <div className='space-y-2'>
                  <Label htmlFor='email'>البريد الإلكتروني</Label>
                  <Input
                    id='email'
                    type='email'
                    value={settings.email}
                    onChange={(e) =>
                      setSettings({ ...settings, email: e.target.value })
                    }
                  />
                </div>

                <div className='space-y-2'>
                  <Label htmlFor='phone'>رقم الهاتف</Label>
                  <Input
                    id='phone'
                    value={settings.phone}
                    onChange={(e) =>
                      setSettings({ ...settings, phone: e.target.value })
                    }
                  />
                </div>
              </div>

              <div className='space-y-2'>
                <Label htmlFor='address'>العنوان</Label>
                <Input
                  id='address'
                  value={settings.address}
                  onChange={(e) =>
                    setSettings({ ...settings, address: e.target.value })
                  }
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>الشعار والصور</CardTitle>
              <CardDescription>شعار المتجر والصور الأساسية</CardDescription>
            </CardHeader>
            <CardContent className='space-y-4'>
              <div className='space-y-2'>
                <Label>شعار المتجر</Label>
                <div className='flex items-center gap-4'>
                  <div className='w-32 h-32 rounded-lg border-2 border-dashed flex items-center justify-center bg-secondary'>
                    <Upload className='h-8 w-8 text-muted-foreground' />
                  </div>
                  <Button variant='outline'>رفع الشعار</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Shipping Settings */}
        <TabsContent value='shipping' className='space-y-6'>
          <Card>
            <CardHeader>
              <CardTitle>إعدادات الشحن</CardTitle>
              <CardDescription>تكاليف وخيارات الشحن</CardDescription>
            </CardHeader>
            <CardContent className='space-y-4'>
              <div className='grid md:grid-cols-2 gap-4'>
                <div className='space-y-2'>
                  <Label htmlFor='shippingCost'>تكلفة الشحن (جنيه)</Label>
                  <Input
                    id='shippingCost'
                    type='number'
                    value={settings.shippingCost}
                    onChange={(e) =>
                      setSettings({ ...settings, shippingCost: e.target.value })
                    }
                  />
                </div>

                <div className='space-y-2'>
                  <Label htmlFor='freeShippingThreshold'>
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
                  />
                  <p className='text-xs text-muted-foreground'>
                    الشحن مجاني للطلبات فوق هذا المبلغ
                  </p>
                </div>
              </div>

              <div className='space-y-2'>
                <Label htmlFor='taxRate'>معدل الضريبة (%)</Label>
                <Input
                  id='taxRate'
                  type='number'
                  value={settings.taxRate}
                  onChange={(e) =>
                    setSettings({ ...settings, taxRate: e.target.value })
                  }
                />
              </div>

              <div className='space-y-2'>
                <Label htmlFor='currency'>العملة</Label>
                <Input
                  id='currency'
                  value={settings.currency}
                  onChange={(e) =>
                    setSettings({ ...settings, currency: e.target.value })
                  }
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notifications Settings */}
        <TabsContent value='notifications' className='space-y-6'>
          <Card>
            <CardHeader>
              <CardTitle>إعدادات الإشعارات</CardTitle>
              <CardDescription>تفعيل وإلغاء تفعيل الإشعارات</CardDescription>
            </CardHeader>
            <CardContent className='space-y-6'>
              <div className='flex items-center justify-between'>
                <div className='space-y-1'>
                  <Label>إشعارات البريد الإلكتروني</Label>
                  <p className='text-sm text-muted-foreground'>
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
                  <Label>إشعارات الرسائل القصيرة</Label>
                  <p className='text-sm text-muted-foreground'>
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
        <TabsContent value='advanced' className='space-y-6'>
          <Card>
            <CardHeader>
              <CardTitle>إعدادات متقدمة</CardTitle>
              <CardDescription>إعدادات للمطورين والصيانة</CardDescription>
            </CardHeader>
            <CardContent className='space-y-6'>
              <div className='flex items-center justify-between'>
                <div className='space-y-1'>
                  <Label>وضع الصيانة</Label>
                  <p className='text-sm text-muted-foreground'>
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
                <Label>API Key</Label>
                <div className='flex gap-2'>
                  <Input
                    value='sk_test_xxxxxxxxxxxxx'
                    readOnly
                    className='font-mono text-sm'
                  />
                  <Button variant='outline'>نسخ</Button>
                </div>
              </div>

              <div className='p-4 bg-destructive/10 border border-destructive/20 rounded-lg'>
                <h4 className='font-semibold text-destructive mb-2'>
                  منطقة الخطر
                </h4>
                <p className='text-sm text-muted-foreground mb-4'>
                  حذف جميع البيانات بشكل نهائي
                </p>
                <Button variant='destructive'>حذف جميع البيانات</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Save Button */}
      <div className='flex justify-end'>
        <Button onClick={handleSave} size='lg' className='gold-gradient'>
          <Save className='ml-2 h-4 w-4' />
          حفظ الإعدادات
        </Button>
      </div>
    </div>
  )
}
