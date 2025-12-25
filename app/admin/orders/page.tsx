'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Eye, Filter, Loader2 } from 'lucide-react'
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
import { formatPrice } from '@/lib/utils'
import { adminOrdersAPI } from '@/lib/admin-api'
import { useToast } from '@/hooks/use-toast'

const getStatusBadge = (status: string) => {
  const statusConfig: Record<string, { label: string; className: string }> = {
    pending: {
      label: 'قيد الانتظار',
      className: 'bg-yellow-100 text-yellow-800',
    },
    processing: {
      label: 'قيد المعالجة',
      className: 'bg-blue-100 text-blue-800',
    },
    shipped: { label: 'تم الشحن', className: 'bg-purple-100 text-purple-800' },
    delivered: {
      label: 'تم التوصيل',
      className: 'bg-green-100 text-green-800',
    },
    cancelled: { label: 'ملغي', className: 'bg-red-100 text-red-800' },
  }

  const config = statusConfig[status] || statusConfig.pending
  return (
    <Badge className={config.className} variant='outline'>
      {config.label}
    </Badge>
  )
}

export default function OrdersManagement() {
  const { toast } = useToast()
  const [orders, setOrders] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [filterStatus, setFilterStatus] = useState('all')

  useEffect(() => {
    fetchOrders()
  }, [filterStatus])

  const fetchOrders = async () => {
    try {
      setLoading(true)
      const params: any = {}
      if (filterStatus !== 'all') {
        params.status = filterStatus
      }

      const response = await adminOrdersAPI.getAll(params)
      setOrders(response.data || [])
    } catch (error) {
      console.error('Failed to fetch orders:', error)
      toast({
        title: 'خطأ',
        description: 'فشل تحميل الطلبات',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='space-y-6'>
      {/* Header */}
      <div className='flex items-center justify-between'>
        <div>
          <h1 className='text-3xl font-bold mb-2'>إدارة الطلبات</h1>
          <p className='text-muted-foreground'>
            إجمالي الطلبات: {orders.length}
          </p>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className='pt-6'>
          <div className='flex gap-4 items-center'>
            <Filter className='h-5 w-5 text-muted-foreground' />
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className='w-[200px]'>
                <SelectValue placeholder='جميع الحالات' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='all'>جميع الحالات</SelectItem>
                <SelectItem value='pending'>قيد الانتظار</SelectItem>
                <SelectItem value='processing'>قيد المعالجة</SelectItem>
                <SelectItem value='shipped'>تم الشحن</SelectItem>
                <SelectItem value='delivered'>تم التوصيل</SelectItem>
                <SelectItem value='cancelled'>ملغي</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Orders Table */}
      <Card>
        <CardContent className='p-0'>
          {loading ? (
            <div className='flex items-center justify-center py-12'>
              <Loader2 className='h-8 w-8 animate-spin text-primary' />
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>رقم الطلب</TableHead>
                  <TableHead>العميل</TableHead>
                  <TableHead>المبلغ</TableHead>
                  <TableHead>طريقة الدفع</TableHead>
                  <TableHead>حالة الدفع</TableHead>
                  <TableHead>الحالة</TableHead>
                  <TableHead>التاريخ</TableHead>
                  <TableHead>الإجراءات</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orders.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className='text-center py-12'>
                      لا توجد طلبات
                    </TableCell>
                  </TableRow>
                ) : (
                  orders.map((order) => (
                    <TableRow key={order._id}>
                      <TableCell className='font-medium'>
                        #{order._id.slice(-6)}
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className='font-medium'>
                            {order.user?.name || 'غير معروف'}
                          </p>
                          <p className='text-sm text-muted-foreground'>
                            {order.user?.email}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell className='font-semibold'>
                        {formatPrice(order.totalOrderPrice || 0)}
                      </TableCell>
                      <TableCell>
                        {order.paymentMethodType === 'cash' ? 'نقدي' : 'بطاقة'}
                      </TableCell>
                      <TableCell>
                        {order.isPaid ? (
                          <Badge className='bg-green-100 text-green-800'>
                            مدفوع
                          </Badge>
                        ) : (
                          <Badge variant='secondary'>غير مدفوع</Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        {getStatusBadge(order.status || 'pending')}
                      </TableCell>
                      <TableCell>
                        {new Date(order.createdAt).toLocaleDateString('ar-EG')}
                      </TableCell>
                      <TableCell>
                        <Link href={`/admin/orders/${order._id}`}>
                          <Button variant='ghost' size='icon'>
                            <Eye className='h-4 w-4' />
                          </Button>
                        </Link>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
