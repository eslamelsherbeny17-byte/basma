'use client'

import { useState, useEffect, useMemo } from 'react'
import Link from 'next/link'
import { Eye, Filter, Loader2, Package, CheckCircle2, XCircle, Clock, Search, TrendingUp } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { formatPrice } from '@/lib/utils'
import { adminOrdersAPI } from '@/lib/admin-api'
import { useToast } from '@/hooks/use-toast'

// 1. دالة شكل حالة الطلب (Badge)
const getStatusBadge = (status: string) => {
  const statusConfig: Record<string, { label: string; className: string; icon: any }> = {
    pending: { label: 'قيد الانتظار', className: 'bg-yellow-100 text-yellow-800 border-yellow-200', icon: Clock },
    processing: { label: 'قيد المعالجة', className: 'bg-blue-100 text-blue-800 border-blue-200', icon: Package },
    shipped: { label: 'تم الشحن', className: 'bg-purple-100 text-purple-800 border-purple-200', icon: Package },
    delivered: { label: 'تم التوصيل', className: 'bg-green-100 text-green-800 border-green-200', icon: CheckCircle2 },
    cancelled: { label: 'ملغي', className: 'bg-red-100 text-red-800 border-red-200', icon: XCircle },
  }
  const config = statusConfig[status] || statusConfig.pending
  const Icon = config.icon

  return (
    <Badge className={`${config.className} gap-1`} variant='outline'>
      <Icon className='h-3 w-3' />
      {config.label}
    </Badge>
  )
}

// 2. دالة جلب طريقة الدفع كنص (بدون صور)
const getPaymentMethodText = (method: string) => {
  return method === 'cash' ? 'نقدي' : 'بطاقة'
}

// 3. دالة شكل حالة الدفع
const getPaymentStatusBadge = (isPaid: boolean) => {
  return isPaid ? (
    <Badge className="bg-green-100 text-green-800 border-green-200 gap-1" variant="outline">
      <CheckCircle2 className="h-3 w-3" />
      مدفوع
    </Badge>
  ) : (
    <Badge className="bg-red-100 text-red-800 border-red-200 gap-1" variant="outline">
      <XCircle className="h-3 w-3" />
      غير مدفوع
    </Badge>
  )
}

export default function OrdersManagement() {
  const { toast } = useToast()
  const [orders, setOrders] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [filterStatus, setFilterStatus] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [updatingOrderId, setUpdatingOrderId] = useState<string | null>(null)

  useEffect(() => {
    fetchOrders()
  }, [])

  const fetchOrders = async () => {
    try {
      setLoading(true)
      const response = await adminOrdersAPI.getAll({})
      setOrders(response.data || [])
    } catch (error) {
      toast({ title: 'خطأ', description: 'فشل تحميل الطلبات', variant: 'destructive' })
    } finally {
      setLoading(false)
    }
  }

  const filteredOrders = useMemo(() => {
    let result = orders
    if (filterStatus !== 'all') result = result.filter(order => order.status === filterStatus)
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim()
      result = result.filter(order => {
        const orderId = order._id.slice(-6).toLowerCase()
        const userName = (order.user?.name || '').toLowerCase()
        const userEmail = (order.user?.email || '').toLowerCase()
        return orderId.includes(query) || userName.includes(query) || userEmail.includes(query)
      })
    }
    return result
  }, [orders, filterStatus, searchQuery])

  const statistics = useMemo(() => {
    return {
      total: orders.length,
      pending: orders.filter(o => o.status === 'pending').length,
      processing: orders.filter(o => o.status === 'processing').length,
      shipped: orders.filter(o => o.status === 'shipped').length,
      delivered: orders.filter(o => o.status === 'delivered').length,
      cancelled: orders.filter(o => o.status === 'cancelled').length,
      totalRevenue: orders.filter(o => o.isPaid).reduce((sum, o) => sum + (o.totalOrderPrice || 0), 0),
    }
  }, [orders])

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    try {
      setUpdatingOrderId(orderId)
      await adminOrdersAPI.updateStatus(orderId, newStatus)
      setOrders(orders.map(order => order._id === orderId ? { ...order, status: newStatus } : order))
      toast({ title: 'تم التحديث', description: 'تم تحديث حالة الطلب بنجاح' })
    } catch (error) {
      toast({ title: 'خطأ', description: 'فشل تحديث حالة الطلب', variant: 'destructive' })
    } finally {
      setUpdatingOrderId(null)
    }
  }

  return (
    <div className='space-y-6' dir='rtl'>
      {/* Header */}
      <div className='flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4'>
        <h1 className='text-2xl sm:text-3xl font-bold mb-2'>إدارة الطلبات</h1>
      </div>

      {/* Statistics Cards */}
      <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4'>
        <Card className='shadow-sm border-t-4 border-t-primary'>
          <CardContent className='p-4'>
            <div className='flex items-center gap-2 mb-2'>
              <div className='bg-primary/10 p-2 rounded-lg'><Package className='h-4 w-4 text-primary' /></div>
              <p className='text-xs text-muted-foreground font-medium'>إجمالي الطلبات</p>
            </div>
            <p className='text-2xl font-bold text-primary'>{statistics.total}</p>
          </CardContent>
        </Card>
        {/* ... بقية الإحصائيات تظل كما هي ... */}
      </div>

      {/* Search and Filters */}
      <Card className='shadow-sm'>
        <CardContent className='pt-6 flex flex-col sm:flex-row gap-3'>
          <div className='relative flex-1'>
            <Search className='absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground' />
            <Input
              placeholder='ابحث برقم الطلب، اسم العميل...'
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className='pr-10 border-2'
            />
          </div>
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className='w-full sm:w-[220px] border-2'>
              <SelectValue placeholder='جميع الحالات' />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='all'>جميع الحالات</SelectItem>
              <SelectItem value='pending'>⏳ قيد الانتظار</SelectItem>
              <SelectItem value='processing'>📦 قيد المعالجة</SelectItem>
              <SelectItem value='shipped'>🚚 تم الشحن</SelectItem>
              <SelectItem value='delivered'>✅ تم التوصيل</SelectItem>
              <SelectItem value='cancelled'>❌ ملغي</SelectItem>
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {/* 💻 عرض الجدول للكمبيوتر */}
      <Card className='hidden lg:block shadow-md overflow-hidden'>
        <Table>
          <TableHeader>
            <TableRow className='bg-muted/50'>
              <TableHead className='text-right'>رقم الطلب</TableHead>
              <TableHead className='text-right'>العميل</TableHead>
              <TableHead className='text-right'>المبلغ</TableHead>
              <TableHead className='text-right'>طريقة الدفع</TableHead>
              <TableHead className='text-right'>حالة الدفع</TableHead>
              <TableHead className='text-right'>الحالة</TableHead>
              <TableHead className='text-right'>تغيير الحالة</TableHead>
              <TableHead className='text-left'>إجراءات</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredOrders.map((order) => (
              <TableRow key={order._id}>
                <TableCell className='font-bold text-primary text-right'>#{order._id.slice(-6)}</TableCell>
                <TableCell className='text-right'>
                  <p className='font-medium'>{order.user?.name || 'غير معروف'}</p>
                  <p className='text-xs text-muted-foreground'>{order.user?.email}</p>
                </TableCell>
                <TableCell className='font-bold text-right'>{formatPrice(order.totalOrderPrice)}</TableCell>
                <TableCell className='text-right font-medium'>{getPaymentMethodText(order.paymentMethodType)}</TableCell>
                <TableCell className='text-right'>{getPaymentStatusBadge(order.isPaid)}</TableCell>
                <TableCell className='text-right'>{getStatusBadge(order.status)}</TableCell>
                <TableCell className='text-right'>
                  <Select value={order.status} onValueChange={(v) => handleStatusChange(order._id, v)} disabled={updatingOrderId === order._id}>
                    <SelectTrigger className='w-[140px]'>
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
                </TableCell>
                <TableCell className='text-left'>
                  <Link href={`/admin/orders/${order._id}`}>
                    <Button variant='ghost' size='icon'><Eye className='h-4 w-4' /></Button>
                  </Link>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      {/* 📱 عرض الكروت للموبايل (تم تعديله كما طلبت) */}
      <div className="lg:hidden space-y-4">
        {filteredOrders.map(order => (
          <Card key={order._id} className="shadow-sm">
            <CardContent className="p-4 space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs text-muted-foreground">رقم الطلب</p>
                  <p className="text-lg font-bold text-primary">#{order._id.slice(-6)}</p>
                </div>
                {getStatusBadge(order.status)}
              </div>

              <div className="space-y-1 border-t pt-3">
                <p className="text-xs text-muted-foreground">العميل</p>
                <p className="font-medium">{order.user?.name || 'غير معروف'}</p>
                <p className="text-xs text-muted-foreground truncate">{order.user?.email}</p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="bg-muted/40 rounded-lg p-3 text-right">
                  <p className="text-xs text-muted-foreground mb-1">الإجمالي</p>
                  <p className="font-bold text-primary">{formatPrice(order.totalOrderPrice)}</p>
                </div>
                <div className="bg-muted/40 rounded-lg p-3 text-right">
                  <p className="text-xs text-muted-foreground mb-1">طريقة الدفع</p>
                  {/* تم استبدال الأيقونة بالنص هنا */}
                  <p className="font-bold text-sm text-foreground">
                    {getPaymentMethodText(order.paymentMethodType)}
                  </p>
                </div>
              </div>

              {/* قسم تغيير الحالة مع إظهار الحالة الحالية */}
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">تغيير حالة الطلب</p>
                <Select value={order.status} onValueChange={v => handleStatusChange(order._id, v)}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="اختر الحالة" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">قيد الانتظار</SelectItem>
                    <SelectItem value="processing">قيد المعالجة</SelectItem>
                    <SelectItem value="shipped">تم الشحن</SelectItem>
                    <SelectItem value="delivered">تم التوصيل</SelectItem>
                    <SelectItem value="cancelled">ملغي</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* زر عرض التفاصيل مع مسافة إضافية */}
              <div className="pt-2"> 
                <Link href={`/admin/orders/${order._id}`}>
                  <Button className="w-full mt-2" size="sm">
                    <Eye className="h-4 w-4 ml-1" />
                    عرض التفاصيل
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}