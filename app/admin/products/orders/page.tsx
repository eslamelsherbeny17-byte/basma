'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Eye, Filter } from 'lucide-react'
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

// Mock orders data
const mockOrders = [
  {
    _id: 'ORD-001',
    user: { name: 'فاطمة أحمد', email: 'fatima@example.com' },
    totalOrderPrice: 599,
    paymentMethodType: 'cash',
    isPaid: false,
    isDelivered: false,
    status: 'pending',
    createdAt: '2024-01-20T10:30:00',
    itemsCount: 2,
  },
  {
    _id: 'ORD-002',
    user: { name: 'مريم محمد', email: 'maryam@example.com' },
    totalOrderPrice: 1250,
    paymentMethodType: 'card',
    isPaid: true,
    isDelivered: false,
    status: 'processing',
    createdAt: '2024-01-20T09:15:00',
    itemsCount: 3,
  },
  {
    _id: 'ORD-003',
    user: { name: 'سارة علي', email: 'sara@example.com' },
    totalOrderPrice: 450,
    paymentMethodType: 'cash',
    isPaid: true,
    isDelivered: true,
    status: 'delivered',
    createdAt: '2024-01-19T14:20:00',
    itemsCount: 1,
  },
]

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
  const [orders, setOrders] = useState(mockOrders)
  const [filterStatus, setFilterStatus] = useState('all')

  const filteredOrders = orders.filter(
    (order) => filterStatus === 'all' || order.status === filterStatus
  )

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
              {filteredOrders.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className='text-center py-12'>
                    لا توجد طلبات
                  </TableCell>
                </TableRow>
              ) : (
                filteredOrders.map((order) => (
                  <TableRow key={order._id}>
                    <TableCell className='font-medium'>{order._id}</TableCell>
                    <TableCell>
                      <div>
                        <p className='font-medium'>{order.user.name}</p>
                        <p className='text-sm text-muted-foreground'>
                          {order.user.email}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell className='font-semibold'>
                      {formatPrice(order.totalOrderPrice)}
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
                    <TableCell>{getStatusBadge(order.status)}</TableCell>
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
        </CardContent>
      </Card>
    </div>
  )
}
