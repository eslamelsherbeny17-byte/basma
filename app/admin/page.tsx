'use client'

import { useEffect, useState } from 'react'
import {
  Package,
  ShoppingCart,
  Users,
  DollarSign,
  Eye,
  Loader2,
} from 'lucide-react'
import { StatsCard } from '@/components/admin/StatsCard'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { formatPrice } from '@/lib/utils'
import Link from 'next/link'
import { SalesChart } from '@/components/admin/SalesChart'
import { CategoryDistribution } from '@/components/admin/CategoryDistribution'
import {
  adminDashboardAPI,
  adminOrdersAPI,
  adminProductsAPI,
} from '@/lib/admin-api'
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

export default function AdminDashboard() {
  const { toast } = useToast()
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState<any>(null)
  const [recentOrders, setRecentOrders] = useState<any[]>([])
  const [topProducts, setTopProducts] = useState<any[]>([])

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      setLoading(true)

      // Fetch all data in parallel
      const [statsData, ordersData, productsData] = await Promise.all([
        adminDashboardAPI.getStats(),
        adminOrdersAPI.getAll({ limit: 5, sort: '-createdAt' }),
        adminProductsAPI.getAll({ limit: 5, sort: '-sold' }),
      ])

      setStats(statsData)
      setRecentOrders(ordersData.data || [])
      setTopProducts(productsData.data || [])
    } catch (error: any) {
      console.error('Failed to fetch dashboard data:', error)
      toast({
        title: 'خطأ',
        description: 'فشل تحميل بيانات لوحة التحكم',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className='flex items-center justify-center min-h-[60vh]'>
        <Loader2 className='h-12 w-12 animate-spin text-primary' />
      </div>
    )
  }

  return (
    <div className='space-y-8'>
      {/* Header */}
      <div>
        <h1 className='text-3xl font-bold mb-2'>لوحة التحكم</h1>
        <p className='text-muted-foreground'>
          مرحباً بك، إليك نظرة عامة على متجرك
        </p>
      </div>

      {/* Stats Grid */}
      <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-4'>
        <StatsCard
          title='إجمالي المبيعات'
          value={formatPrice(stats?.totalRevenue || 0)}
          icon={DollarSign}
          trend={stats?.trends?.revenue}
        />
        <StatsCard
          title='الطلبات'
          value={stats?.totalOrders || 0}
          icon={ShoppingCart}
          trend={stats?.trends?.orders}
        />
        <StatsCard
          title='المنتجات'
          value={stats?.totalProducts || 0}
          icon={Package}
          trend={stats?.trends?.products}
        />
        <StatsCard
          title='العملاء'
          value={stats?.totalUsers || 0}
          icon={Users}
          trend={stats?.trends?.users}
        />
      </div>

      {/* Charts */}
      <div className='grid lg:grid-cols-3 gap-6'>
        <div className='lg:col-span-2'>
          <SalesChart />
        </div>
        <CategoryDistribution />
      </div>

      {/* Tables */}
      <div className='grid gap-6 lg:grid-cols-2'>
        {/* Recent Orders */}
        <Card>
          <CardHeader className='flex flex-row items-center justify-between'>
            <CardTitle>أحدث الطلبات</CardTitle>
            <Link href='/admin/orders'>
              <Button variant='ghost' size='sm'>
                عرض الكل
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            {recentOrders.length === 0 ? (
              <p className='text-center text-muted-foreground py-8'>
                لا توجد طلبات
              </p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>رقم الطلب</TableHead>
                    <TableHead>المبلغ</TableHead>
                    <TableHead>الحالة</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentOrders.map((order) => (
                    <TableRow key={order._id}>
                      <TableCell className='font-medium'>
                        #{order._id.slice(-6)}
                      </TableCell>
                      <TableCell>
                        {formatPrice(order.totalOrderPrice || 0)}
                      </TableCell>
                      <TableCell>
                        {getStatusBadge(order.status || 'pending')}
                      </TableCell>
                      <TableCell>
                        <Link href={`/admin/orders/${order._id}`}>
                          <Button variant='ghost' size='icon'>
                            <Eye className='h-4 w-4' />
                          </Button>
                        </Link>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        {/* Top Products */}
        <Card>
          <CardHeader className='flex flex-row items-center justify-between'>
            <CardTitle>المنتجات الأكثر مبيعاً</CardTitle>
            <Link href='/admin/products'>
              <Button variant='ghost' size='sm'>
                عرض الكل
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            {topProducts.length === 0 ? (
              <p className='text-center text-muted-foreground py-8'>
                لا توجد منتجات
              </p>
            ) : (
              <div className='space-y-4'>
                {topProducts.map((product, index) => (
                  <div key={product._id} className='flex items-center gap-4'>
                    <div className='flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-bold'>
                      {index + 1}
                    </div>
                    <div className='flex-1 min-w-0'>
                      <p className='font-medium truncate'>{product.title}</p>
                      <p className='text-sm text-muted-foreground'>
                        {product.sold || 0} مبيعات
                      </p>
                    </div>
                    <div className='text-left'>
                      <p className='font-bold text-primary'>
                        {formatPrice(
                          (product.priceAfterDiscount || product.price) *
                            (product.sold || 0)
                        )}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>إجراءات سريعة</CardTitle>
        </CardHeader>
        <CardContent>
          <div className='grid gap-4 md:grid-cols-4'>
            <Link href='/admin/products/new'>
              <Button className='w-full gold-gradient'>
                <Package className='ml-2 h-4 w-4' />
                إضافة منتج جديد
              </Button>
            </Link>
            <Link href='/admin/categories'>
              <Button className='w-full' variant='outline'>
                إدارة الفئات
              </Button>
            </Link>
            <Link href='/admin/orders'>
              <Button className='w-full' variant='outline'>
                <ShoppingCart className='ml-2 h-4 w-4' />
                عرض الطلبات
              </Button>
            </Link>
            <Link href='/admin/customers'>
              <Button className='w-full' variant='outline'>
                <Users className='ml-2 h-4 w-4' />
                إدارة المستخدمين
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
