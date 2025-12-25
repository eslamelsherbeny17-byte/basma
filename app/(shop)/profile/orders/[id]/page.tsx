'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import {
  ArrowRight,
  Package,
  MapPin,
  CreditCard,
  User,
  Loader2,
  Phone,
  CheckCircle2,
  Clock,
  Truck,
  Home as HomeIcon,
  XCircle,
  Download,
  MessageSquare,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import { formatPrice, getImageUrl } from '@/lib/utils'
import { ordersAPI } from '@/lib/api'
import { useToast } from '@/hooks/use-toast'

// Order Status Badge
const getStatusBadge = (status: string) => {
  const statusConfig: Record<string, { label: string; className: string; icon: any }> = {
    pending: {
      label: 'قيد الانتظار',
      className: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      icon: Clock,
    },
    processing: {
      label: 'قيد المعالجة',
      className: 'bg-blue-100 text-blue-800 border-blue-200',
      icon: Package,
    },
    shipped: {
      label: 'تم الشحن',
      className: 'bg-purple-100 text-purple-800 border-purple-200',
      icon: Truck,
    },
    delivered: {
      label: 'تم التوصيل',
      className: 'bg-green-100 text-green-800 border-green-200',
      icon: CheckCircle2,
    },
    cancelled: {
      label: 'ملغي',
      className: 'bg-red-100 text-red-800 border-red-200',
      icon: XCircle,
    },
  }

  const config = statusConfig[status] || statusConfig.pending
  const Icon = config.icon

  return (
    <Badge className={`${config.className} text-base px-4 py-2`} variant='outline'>
      <Icon className='h-4 w-4 ml-1' />
      {config.label}
    </Badge>
  )
}

// Order Timeline Component
const OrderTimeline = ({ order }: { order: any }) => {
  const status = order.status || 'pending'

  const timeline = [
    {
      id: 'pending',
      label: 'تم استلام الطلب',
      icon: CheckCircle2,
      date: order.createdAt,
      completed: true,
    },
    {
      id: 'processing',
      label: 'جاري التجهيز',
      icon: Package,
      date: order.processingAt || null,
      completed: ['processing', 'shipped', 'delivered'].includes(status),
    },
    {
      id: 'shipped',
      label: 'تم الشحن',
      icon: Truck,
      date: order.shippedAt || null,
      completed: ['shipped', 'delivered'].includes(status),
    },
    {
      id: 'delivered',
      label: 'تم التوصيل',
      icon: HomeIcon,
      date: order.deliveredAt || null,
      completed: status === 'delivered',
    },
  ]

  if (status === 'cancelled') {
    return (
      <div className='p-6 bg-red-50 border-2 border-red-200 rounded-xl text-center'>
        <XCircle className='h-16 w-16 text-red-500 mx-auto mb-4' />
        <h3 className='text-xl font-bold text-red-700 mb-2'>تم إلغاء الطلب</h3>
        <p className='text-red-600'>
          {order.cancelReason || 'تم إلغاء هذا الطلب'}
        </p>
      </div>
    )
  }

  return (
    <div className='relative'>
      {timeline.map((step, index) => {
        const Icon = step.icon
        const isLast = index === timeline.length - 1

        return (
          <div key={step.id} className='relative flex gap-4 pb-8'>
            {/* Vertical Line */}
            {!isLast && (
              <div
                className={`absolute right-4 top-10 bottom-0 w-0.5 ${
                  step.completed ? 'bg-green-500' : 'bg-gray-300'
                }`}
              />
            )}

            {/* Icon */}
            <div className='relative z-10'>
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${
                  step.completed
                    ? 'bg-green-500 border-green-500 text-white'
                    : 'bg-white border-gray-300 text-gray-400'
                }`}
              >
                <Icon className='h-5 w-5' />
              </div>
            </div>

            {/* Content */}
            <div className='flex-1 pt-1'>
              <h4
                className={`font-bold text-lg mb-1 ${
                  step.completed ? 'text-gray-900' : 'text-gray-400'
                }`}
              >
                {step.label}
              </h4>
              {step.date && (
                <p className='text-sm text-muted-foreground'>
                  {new Date(step.date).toLocaleString('ar-EG', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </p>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default function OrderDetailsPage({
  params,
}: {
  params: { id: string }
}) {
  const router = useRouter()
  const { toast } = useToast()
  const [order, setOrder] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchOrder()
  }, [params.id])

  const fetchOrder = async () => {
    try {
      setLoading(true)
      const response = await ordersAPI.getOrderById(params.id)
      console.log('📦 Order details:', response)
      setOrder(response)
    } catch (error: any) {
      console.error('Failed to fetch order:', error)
      toast({
        title: 'خطأ',
        description: 'فشل تحميل تفاصيل الطلب',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  const handleDownloadInvoice = () => {
    toast({
      title: '⏳ جاري التحميل',
      description: 'سيتم تحميل الفاتورة قريباً',
    })
    // TODO: Implement invoice download
  }

  if (loading) {
    return (
      <div className='flex items-center justify-center min-h-[60vh]'>
        <div className='text-center space-y-4'>
          <Loader2 className='h-12 w-12 animate-spin text-primary mx-auto' />
          <p className='text-muted-foreground'>جاري تحميل تفاصيل الطلب...</p>
        </div>
      </div>
    )
  }

  if (!order) {
    return (
      <div className='text-center py-12'>
        <Package className='h-16 w-16 mx-auto mb-4 text-muted-foreground' />
        <h2 className='text-2xl font-bold mb-2'>الطلب غير موجود</h2>
        <p className='text-muted-foreground mb-6'>
          لم يتم العثور على الطلب المطلوب
        </p>
        <Link href='/profile/orders'>
          <Button>
            <ArrowRight className='ml-2 h-4 w-4' />
            العودة للطلبات
          </Button>
        </Link>
      </div>
    )
  }

  const subtotal =
    order.cartItems?.reduce(
      (sum: number, item: any) => sum + item.price * item.quantity,
      0
    ) || 0

  return (
    <div className='space-y-6 max-w-6xl mx-auto'>
      {/* Header */}
      <div className='flex items-start justify-between gap-4 flex-wrap'>
        <div className='flex items-center gap-4'>
          <Link href='/profile/orders'>
            <Button variant='ghost' size='icon' className='rounded-full'>
              <ArrowRight className='h-5 w-5' />
            </Button>
          </Link>
          <div>
            <h1 className='text-2xl md:text-3xl font-bold'>
              طلب #{order._id.slice(-8).toUpperCase()}
            </h1>
            <p className='text-muted-foreground mt-1'>
              📅 {new Date(order.createdAt).toLocaleString('ar-EG')}
            </p>
          </div>
        </div>
        <div className='flex items-center gap-3'>
          {getStatusBadge(order.status || 'pending')}
          <Button variant='outline' onClick={handleDownloadInvoice}>
            <Download className='ml-2 h-4 w-4' />
            الفاتورة
          </Button>
        </div>
      </div>

      <div className='grid lg:grid-cols-3 gap-6'>
        {/* Main Content */}
        <div className='lg:col-span-2 space-y-6'>
          {/* Order Timeline */}
          <Card>
            <CardHeader>
              <CardTitle className='flex items-center gap-2'>
                <Truck className='h-5 w-5 text-primary' />
                تتبع الطلب
              </CardTitle>
            </CardHeader>
            <CardContent>
              <OrderTimeline order={order} />
            </CardContent>
          </Card>

          {/* Products */}
          <Card>
            <CardHeader>
              <CardTitle className='flex items-center gap-2'>
                <Package className='h-5 w-5 text-primary' />
                المنتجات ({order.cartItems?.length || 0})
              </CardTitle>
            </CardHeader>
            <CardContent className='space-y-4'>
              {order.cartItems?.map((item: any, index: number) => {
                const product =
                  typeof item.product === 'object' ? item.product : null

                return (
                  <div
                    key={index}
                    className='flex gap-4 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg hover:shadow-md transition-shadow'
                  >
                    {/* Product Image */}
                    <div className='relative w-20 h-20 rounded-lg overflow-hidden bg-gray-200 flex-shrink-0'>
                      {product?.imageCover ? (
                        <Image
                          src={getImageUrl(product.imageCover)}
                          alt={product.title || 'Product'}
                          fill
                          className='object-cover'
                        />
                      ) : (
                        <div className='w-full h-full flex items-center justify-center'>
                          <Package className='h-8 w-8 text-gray-400' />
                        </div>
                      )}
                    </div>

                    {/* Product Info */}
                    <div className='flex-1 min-w-0'>
                      <h4 className='font-bold mb-1 line-clamp-2'>
                        {product?.title || 'منتج'}
                      </h4>
                      <div className='flex items-center gap-4 text-sm text-muted-foreground'>
                        <span>الكمية: {item.quantity}</span>
                        {item.color && (
                          <>
                            <span>•</span>
                            <div className='flex items-center gap-1'>
                              <span>اللون:</span>
                              <div
                                className='w-4 h-4 rounded-full border'
                                style={{ backgroundColor: item.color }}
                              />
                            </div>
                          </>
                        )}
                      </div>
                    </div>

                    {/* Price */}
                    <div className='text-left'>
                      <p className='font-bold text-lg text-primary'>
                        {formatPrice(item.price * item.quantity)}
                      </p>
                      <p className='text-sm text-muted-foreground'>
                        {formatPrice(item.price)} × {item.quantity}
                      </p>
                    </div>
                  </div>
                )
              })}
            </CardContent>
          </Card>

          {/* Customer & Address Info */}
          <div className='grid md:grid-cols-2 gap-6'>
            {/* Customer Info */}
            <Card>
              <CardHeader>
                <CardTitle className='flex items-center gap-2'>
                  <User className='h-5 w-5 text-primary' />
                  معلومات العميل
                </CardTitle>
              </CardHeader>
              <CardContent className='space-y-3'>
                <div className='flex items-center gap-3'>
                  <div className='w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center'>
                    <User className='h-5 w-5 text-primary' />
                  </div>
                  <div>
                    <p className='text-xs text-muted-foreground'>الاسم</p>
                    <p className='font-semibold'>
                      {order.user?.name || 'غير معروف'}
                    </p>
                  </div>
                </div>
                {order.user?.email && (
                  <div className='flex items-center gap-3'>
                    <div className='w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center'>
                      <MessageSquare className='h-5 w-5 text-primary' />
                    </div>
                    <div>
                      <p className='text-xs text-muted-foreground'>
                        البريد الإلكتروني
                      </p>
                      <p className='font-semibold text-sm'>{order.user.email}</p>
                    </div>
                  </div>
                )}
                {order.user?.phone && (
                  <div className='flex items-center gap-3'>
                    <div className='w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center'>
                      <Phone className='h-5 w-5 text-primary' />
                    </div>
                    <div>
                      <p className='text-xs text-muted-foreground'>الهاتف</p>
                      <p className='font-semibold'>{order.user.phone}</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Shipping Address */}
            <Card>
              <CardHeader>
                <CardTitle className='flex items-center gap-2'>
                  <MapPin className='h-5 w-5 text-primary' />
                  عنوان الشحن
                </CardTitle>
              </CardHeader>
              <CardContent className='space-y-3 text-sm'>
                <div className='p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg space-y-2'>
                  <p className='font-semibold'>{order.user?.name}</p>
                  <p className='text-muted-foreground'>
                    {order.shippingAddress?.details}
                  </p>
                  <p className='text-muted-foreground'>
                    {order.shippingAddress?.city}
                  </p>
                  {order.shippingAddress?.postalCode && (
                    <p className='text-muted-foreground'>
                      📮 الرمز البريدي: {order.shippingAddress.postalCode}
                    </p>
                  )}
                  {order.shippingAddress?.phone && (
                    <div className='flex items-center gap-2 pt-2 border-t'>
                      <Phone className='h-4 w-4 text-primary' />
                      <p className='font-semibold'>
                        {order.shippingAddress.phone}
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Sidebar */}
        <div className='space-y-6'>
          {/* Order Summary */}
          <Card>
            <CardHeader>
              <CardTitle>ملخص الطلب</CardTitle>
            </CardHeader>
            <CardContent className='space-y-4'>
              <div className='space-y-3'>
                <div className='flex justify-between text-sm'>
                  <span className='text-muted-foreground'>المجموع الفرعي</span>
                  <span className='font-semibold'>{formatPrice(subtotal)}</span>
                </div>
                <div className='flex justify-between text-sm'>
                  <span className='text-muted-foreground'>الشحن</span>
                  <span className='font-semibold'>
                    {formatPrice(order.shippingPrice || 0)}
                  </span>
                </div>
                {order.taxPrice > 0 && (
                  <div className='flex justify-between text-sm'>
                    <span className='text-muted-foreground'>الضريبة</span>
                    <span className='font-semibold'>
                      {formatPrice(order.taxPrice)}
                    </span>
                  </div>
                )}
                <Separator />
                <div className='flex justify-between text-lg font-bold'>
                  <span>الإجمالي</span>
                  <span className='text-primary text-2xl'>
                    {formatPrice(order.totalOrderPrice || 0)}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Payment Info */}
          <Card>
            <CardHeader>
              <CardTitle className='flex items-center gap-2'>
                <CreditCard className='h-5 w-5 text-primary' />
                معلومات الدفع
              </CardTitle>
            </CardHeader>
            <CardContent className='space-y-4'>
              <div className='space-y-3'>
                <div className='flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg'>
                  <span className='text-sm font-medium'>طريقة الدفع</span>
                  <span className='font-semibold'>
                    {order.paymentMethodType === 'cash'
                      ? '💵 نقدي'
                      : order.paymentMethodType === 'fawry'
                      ? '🏪 فوري'
                      : '💳 بطاقة'}
                  </span>
                </div>
                <div className='flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg'>
                  <span className='text-sm font-medium'>حالة الدفع</span>
                  {order.isPaid ? (
                    <Badge className='bg-green-100 text-green-800 border-green-200'>
                      ✓ مدفوع
                    </Badge>
                  ) : (
                    <Badge
                      variant='secondary'
                      className='bg-orange-100 text-orange-800 border-orange-200'
                    >
                      ⏳ غير مدفوع
                    </Badge>
                  )}
                </div>
                <div className='flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg'>
                  <span className='text-sm font-medium'>حالة التوصيل</span>
                  {order.isDelivered ? (
                    <Badge className='bg-green-100 text-green-800 border-green-200'>
                      ✓ تم التوصيل
                    </Badge>
                  ) : (
                    <Badge
                      variant='secondary'
                      className='bg-blue-100 text-blue-800 border-blue-200'
                    >
                      <Truck className='h-3 w-3 ml-1' />
                      قيد التوصيل
                    </Badge>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Support */}
          <Card className='border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-transparent'>
            <CardContent className='pt-6'>
              <div className='text-center space-y-3'>
                <div className='w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto'>
                  <MessageSquare className='h-6 w-6 text-primary' />
                </div>
                <h3 className='font-bold'>هل تحتاج مساعدة؟</h3>
                <p className='text-sm text-muted-foreground'>
                  فريق الدعم جاهز لمساعدتك
                </p>
                <Button className='w-full' variant='outline'>
                  تواصل معنا
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
