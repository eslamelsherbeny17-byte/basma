'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, Package, MapPin, CreditCard, User } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { formatPrice } from '@/lib/utils'

// Mock order data
const mockOrder = {
  _id: 'ORD-001',
  user: {
    name: 'فاطمة أحمد',
    email: 'fatima@example.com',
    phone: '+20 123 456 7890',
  },
  shippingAddress: {
    city: 'القاهرة',
    details: 'شارع التحرير، مبنى 15، الدور الثالث',
    postalCode: '12345',
  },
  cartItems: [
    {
      product: {
        _id: '1',
        titleAr: 'عباية سوداء فاخرة',
        imageCover: '/images/product-1.jpg',
      },
      quantity: 1,
      price: 499,
    },
    {
      product: {
        _id: '2',
        titleAr: 'حجاب حرير ناعم',
        imageCover: '/images/product-2.jpg',
      },
      quantity: 2,
      price: 129,
    },
  ],
  totalOrderPrice: 757,
  shippingPrice: 50,
  paymentMethodType: 'cash',
  isPaid: false,
  isDelivered: false,
  status: 'pending',
  createdAt: '2024-01-20T10:30:00',
}

export default function OrderDetailsPage({
  params,
}: {
  params: { id: string }
}) {
  const router = useRouter()
  const [order, setOrder] = useState(mockOrder)
  const [status, setStatus] = useState(order.status)

  const handleStatusUpdate = async () => {
    // API call to update status
    console.log('Update status to:', status)
    setOrder({ ...order, status })
  }

  const subtotal = order.cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  )

  return (
    <div className='space-y-6 max-w-5xl'>
      {/* Header */}
      <div className='flex items-center justify-between'>
        <div className='flex items-center gap-4'>
          <Link href='/admin/orders'>
            <Button variant='ghost' size='icon'>
              <ArrowRight className='h-5 w-5' />
            </Button>
          </Link>
          <div>
            <h1 className='text-3xl font-bold'>تفاصيل الطلب #{order._id}</h1>
            <p className='text-muted-foreground'>
              تم الإنشاء في {new Date(order.createdAt).toLocaleString('ar-EG')}
            </p>
          </div>
        </div>
        <div className='flex items-center gap-3'>
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger className='w-[180px]'>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='pending'>قيد الانتظار</SelectItem>
              <SelectItem value='processing'>قيد المعالجة</SelectItem>
              <SelectItem value='shipped'>تم الشحن</SelectItem>
              <SelectItem value='delivered'>تم التوصيل</SelectItem>
              <SelectItem value='cancelled'>ملغي</SelectItem>
            </SelectContent>
          </Select>
          {status !== order.status && (
            <Button onClick={handleStatusUpdate} className='gold-gradient'>
              حفظ التغييرات
            </Button>
          )}
        </div>
      </div>

      <div className='grid lg:grid-cols-3 gap-6'>
        {/* Order Items */}
        <div className='lg:col-span-2 space-y-6'>
          <Card>
            <CardHeader>
              <CardTitle className='flex items-center gap-2'>
                <Package className='h-5 w-5' />
                المنتجات
              </CardTitle>
            </CardHeader>
            <CardContent className='space-y-4'>
              {order.cartItems.map((item, index) => (
                <div key={index} className='flex gap-4'>
                  <div className='relative w-20 h-20 rounded-lg overflow-hidden bg-secondary flex-shrink-0'>
                    <Image
                      src={item.product.imageCover}
                      alt={item.product.titleAr}
                      fill
                      className='object-cover'
                    />
                  </div>
                  <div className='flex-1'>
                    <h4 className='font-semibold mb-1'>
                      {item.product.titleAr}
                    </h4>
                    <p className='text-sm text-muted-foreground mb-2'>
                      الكمية: {item.quantity}
                    </p>
                    <p className='font-bold text-primary'>
                      {formatPrice(item.price * item.quantity)}
                    </p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Customer Info */}
          <Card>
            <CardHeader>
              <CardTitle className='flex items-center gap-2'>
                <User className='h-5 w-5' />
                معلومات العميل
              </CardTitle>
            </CardHeader>
            <CardContent className='space-y-3'>
              <div>
                <p className='text-sm text-muted-foreground'>الاسم</p>
                <p className='font-medium'>{order.user.name}</p>
              </div>
              <div>
                <p className='text-sm text-muted-foreground'>
                  البريد الإلكتروني
                </p>
                <p className='font-medium'>{order.user.email}</p>
              </div>
              <div>
                <p className='text-sm text-muted-foreground'>رقم الهاتف</p>
                <p className='font-medium'>{order.user.phone}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className='space-y-6'>
          {/* Order Summary */}
          <Card>
            <CardHeader>
              <CardTitle>ملخص الطلب</CardTitle>
            </CardHeader>
            <CardContent className='space-y-3'>
              <div className='flex justify-between text-sm'>
                <span className='text-muted-foreground'>المجموع الفرعي</span>
                <span className='font-medium'>{formatPrice(subtotal)}</span>
              </div>
              <div className='flex justify-between text-sm'>
                <span className='text-muted-foreground'>الشحن</span>
                <span className='font-medium'>
                  {formatPrice(order.shippingPrice)}
                </span>
              </div>
              <Separator />
              <div className='flex justify-between font-bold'>
                <span>الإجمالي</span>
                <span className='text-primary'>
                  {formatPrice(order.totalOrderPrice)}
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Shipping Address */}
          <Card>
            <CardHeader>
              <CardTitle className='flex items-center gap-2'>
                <MapPin className='h-5 w-5' />
                عنوان الشحن
              </CardTitle>
            </CardHeader>
            <CardContent className='space-y-2 text-sm'>
              <p className='font-medium'>{order.user.name}</p>
              <p>{order.shippingAddress.details}</p>
              <p>{order.shippingAddress.city}</p>
              <p>الرمز البريدي: {order.shippingAddress.postalCode}</p>
            </CardContent>
          </Card>

          {/* Payment Info */}
          <Card>
            <CardHeader>
              <CardTitle className='flex items-center gap-2'>
                <CreditCard className='h-5 w-5' />
                معلومات الدفع
              </CardTitle>
            </CardHeader>
            <CardContent className='space-y-3'>
              <div>
                <p className='text-sm text-muted-foreground mb-1'>
                  طريقة الدفع
                </p>
                <p className='font-medium'>
                  {order.paymentMethodType === 'cash'
                    ? 'الدفع عند الاستلام'
                    : 'بطاقة ائتمان'}
                </p>
              </div>
              <div>
                <p className='text-sm text-muted-foreground mb-1'>حالة الدفع</p>
                {order.isPaid ? (
                  <Badge className='bg-green-100 text-green-800'>مدفوع</Badge>
                ) : (
                  <Badge variant='secondary'>غير مدفوع</Badge>
                )}
              </div>
              <div>
                <p className='text-sm text-muted-foreground mb-1'>
                  حالة التوصيل
                </p>
                {order.isDelivered ? (
                  <Badge className='bg-green-100 text-green-800'>
                    تم التوصيل
                  </Badge>
                ) : (
                  <Badge variant='secondary'>لم يتم التوصيل</Badge>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
