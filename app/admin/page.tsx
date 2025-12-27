'use client'

import { useEffect, useState } from 'react'
import {
  Package,
  ShoppingCart,
  Users,
  DollarSign,
  Eye,
  Loader2,
  ArrowUpRight,
  ArrowDownRight,
  TrendingUp,
  Clock,
  AlertCircle,
} from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { formatPrice } from '@/lib/utils'
import Link from 'next/link'
import { adminDashboardAPI, adminOrdersAPI, adminProductsAPI } from '@/lib/admin-api'
import { useToast } from '@/hooks/use-toast'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { SalesChart } from '@/components/admin/SalesChart'
import { CategoryDistribution } from '@/components/admin/CategoryDistribution'

import { Alert, AlertDescription } from '@/components/ui/alert'

const getStatusBadge = (status: string) => {
  const statusConfig: Record<string, { label: string; className: string }> = {
    pending: {
      label: 'قيد الانتظار',
      className: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
    },
    processing: {
      label: 'قيد المعالجة',
      className: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
    },
    shipped: {
      label: 'تم الشحن',
      className: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400',
    },
    delivered: {
      label: 'تم التوصيل',
      className: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
    },
    cancelled: {
      label: 'ملغي',
      className: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
    },
  }

  const config = statusConfig[status] || statusConfig.pending
  return (
    <Badge className={config.className} variant='outline'>
      {config.label}
    </Badge>
  )
}

// 🔥 Fallback/Mock Data
const mockStats = {
  totalRevenue: 45680,
  totalOrders: 128,
  totalProducts: 87,
  totalUsers: 234,
  trends: {
    revenue: { value: 12.5, isPositive: true },
    orders: { value: 8.3, isPositive: true },
    products: { value: 3.2, isPositive: true },
    users: { value: 15.7, isPositive: true },
  },
}

const mockSalesData = [
  { name: 'يناير', sales: 4000, orders: 24 },
  { name: 'فبراير', sales: 3000, orders: 19 },
  { name: 'مارس', sales: 5000, orders: 28 },
  { name: 'أبريل', sales: 2780, orders: 20 },
  { name: 'مايو', sales: 4890, orders: 28 },
  { name: 'يونيو', sales: 6390, orders: 35 },
  { name: 'يوليو', sales: 7490, orders: 41 },
]

const mockCategoryData = [
  { name: 'عباءات', value: 35 },
  { name: 'حجاب', value: 25 },
  { name: 'فساتين', value: 18 },
  { name: 'إكسسوارات', value: 12 },
  { name: 'جلابيات', value: 10 },
]

const mockOrdersStatusData = [
  { name: 'قيد الانتظار', count: 15, color: '#F59E0B' },
  { name: 'قيد المعالجة', count: 23, color: '#3B82F6' },
  { name: 'تم الشحن', count: 18, color: '#8B5CF6' },
  { name: 'تم التوصيل', count: 65, color: '#10B981' },
  { name: 'ملغي', count: 7, color: '#EF4444' },
]

const mockRecentOrders = [
  {
    _id: 'ord-001',
    user: { name: 'فاطمة أحمد', email: 'fatima@example.com' },
    totalOrderPrice: 1250,
    status: 'processing',
  },
  {
    _id: 'ord-002',
    user: { name: 'مريم محمد', email: 'maryam@example.com' },
    totalOrderPrice: 890,
    status: 'shipped',
  },
  {
    _id: 'ord-003',
    user: { name: 'سارة علي', email: 'sara@example.com' },
    totalOrderPrice: 2100,
    status: 'delivered',
  },
  {
    _id: 'ord-004',
    user: { name: 'نور خالد', email: 'noor@example.com' },
    totalOrderPrice: 670,
    status: 'pending',
  },
  {
    _id: 'ord-005',
    user: { name: 'هدى حسن', email: 'huda@example.com' },
    totalOrderPrice: 1450,
    status: 'processing',
  },
]

const mockTopProducts = [
  {
    _id: 'prod-001',
    titleAr: 'عباية سوداء فاخرة',
    title: 'Luxury Black Abaya',
    price: 599,
    priceAfterDiscount: 499,
    sold: 45,
  },
  {
    _id: 'prod-002',
    titleAr: 'حجاب حرير طبيعي',
    title: 'Natural Silk Hijab',
    price: 299,
    sold: 38,
  },
  {
    _id: 'prod-003',
    titleAr: 'فستان سواريه محتشم',
    title: 'Modest Evening Dress',
    price: 899,
    priceAfterDiscount: 699,
    sold: 32,
  },
  {
    _id: 'prod-004',
    titleAr: 'عباية مطرزة يدوياً',
    title: 'Hand Embroidered Abaya',
    price: 1299,
    sold: 28,
  },
  {
    _id: 'prod-005',
    titleAr: 'طقم حجاب قطني',
    title: 'Cotton Hijab Set',
    price: 199,
    sold: 56,
  },
]

export default function AdminDashboard() {
  const { toast } = useToast()
  const [loading, setLoading] = useState(true)
  const [dataSource, setDataSource] = useState<'api' | 'mock'>('mock')
  const [stats, setStats] = useState<any>(mockStats)
  const [recentOrders, setRecentOrders] = useState<any[]>(mockRecentOrders)
  const [topProducts, setTopProducts] = useState<any[]>(mockTopProducts)
  const [salesData, setSalesData] = useState<any[]>(mockSalesData)
  const [categoryData, setCategoryData] = useState<any[]>(mockCategoryData)
  const [ordersStatusData, setOrdersStatusData] = useState<any[]>(mockOrdersStatusData)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      setLoading(true)

      console.log('🔄 جاري تحميل بيانات Dashboard...')

      const [statsData, ordersData, productsData] = await Promise.all([
        adminDashboardAPI.getStats().catch((err) => {
          console.warn('⚠️ Stats API failed:', err)
          return mockStats
        }),
        adminOrdersAPI.getAll({ limit: 5, sort: '-createdAt' }).catch((err) => {
          console.warn('⚠️ Orders API failed:', err)
          return { data: mockRecentOrders }
        }),
        adminProductsAPI.getAll({ limit: 5, sort: '-sold' }).catch((err) => {
          console.warn('⚠️ Products API failed:', err)
          return { data: mockTopProducts }
        }),
      ])

      console.log('📊 Stats Data:', statsData)
      console.log('📦 Orders Data:', ordersData)
      console.log('🛍️ Products Data:', productsData)

      // Check if we got real data from API
      const hasRealData =
        statsData &&
        typeof statsData.totalRevenue === 'number' &&
        ordersData.data &&
        ordersData.data.length > 0

      setDataSource(hasRealData ? 'api' : 'mock')

      setStats(statsData || mockStats)
      setRecentOrders(
        ordersData.data && ordersData.data.length > 0
          ? ordersData.data
          : mockRecentOrders
      )
      setTopProducts(
        productsData.data && productsData.data.length > 0
          ? productsData.data
          : mockTopProducts
      )

      // Generate charts data
      const orders = ordersData.data || mockRecentOrders
      const products = productsData.data || mockTopProducts

      if (orders.length > 0) {
        generateSalesData(orders)
        generateOrdersStatusData(orders)
      } else {
        setSalesData(mockSalesData)
        setOrdersStatusData(mockOrdersStatusData)
      }

      if (products.length > 0) {
        generateCategoryData(products)
      } else {
        setCategoryData(mockCategoryData)
      }

      console.log('✅ Dashboard data loaded successfully')
    } catch (error: any) {
      console.error('❌ Failed to fetch dashboard data:', error)
      
      // Use mock data on error
      setDataSource('mock')
      setStats(mockStats)
      setRecentOrders(mockRecentOrders)
      setTopProducts(mockTopProducts)
      setSalesData(mockSalesData)
      setCategoryData(mockCategoryData)
      setOrdersStatusData(mockOrdersStatusData)

      toast({
        title: 'تنبيه',
        description: 'يتم عرض بيانات تجريبية. تحقق من اتصال الـ API',
        variant: 'default',
      })
    } finally {
      setLoading(false)
    }
  }

  const generateSalesData = (orders: any[]) => {
    const months = ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليو']
    const data = months.map((month, index) => {
      const monthOrders = orders.filter((order) => {
        const orderDate = new Date(order.createdAt)
        return orderDate.getMonth() === index
      })

      const sales = monthOrders.reduce((sum, order) => sum + (order.totalOrderPrice || 0), 0)

      return { name: month, sales: sales, orders: monthOrders.length }
    })

    // Use mock data if no real data
    setSalesData(data.some((d) => d.sales > 0) ? data : mockSalesData)
  }

  const generateCategoryData = (products: any[]) => {
    const categoryCount: Record<string, number> = {}

    products.forEach((product) => {
      const categoryName = product.category?.nameAr || product.category?.name || 'أخرى'
      categoryCount[categoryName] = (categoryCount[categoryName] || 0) + 1
    })

    const data = Object.entries(categoryCount).map(([name, value]) => ({ name, value }))
    setCategoryData(data.length > 0 ? data : mockCategoryData)
  }

  const generateOrdersStatusData = (orders: any[]) => {
    const statusCount: Record<string, number> = {
      pending: 0,
      processing: 0,
      shipped: 0,
      delivered: 0,
      cancelled: 0,
    }

    orders.forEach((order) => {
      const status = order.status || 'pending'
      if (statusCount[status] !== undefined) {
        statusCount[status]++
      }
    })

    const statusColors: Record<string, string> = {
      pending: '#F59E0B',
      processing: '#3B82F6',
      shipped: '#8B5CF6',
      delivered: '#10B981',
      cancelled: '#EF4444',
    }

    const statusLabels: Record<string, string> = {
      pending: 'قيد الانتظار',
      processing: 'قيد المعالجة',
      shipped: 'تم الشحن',
      delivered: 'تم التوصيل',
      cancelled: 'ملغي',
    }

    const data = Object.entries(statusCount).map(([status, count]) => ({
      name: statusLabels[status],
      count,
      color: statusColors[status],
    }))

    setOrdersStatusData(data.some((d) => d.count > 0) ? data : mockOrdersStatusData)
  }

  if (loading) {
    return (
      <div className='flex items-center justify-center min-h-[60vh]'>
        <div className='text-center space-y-4'>
          <Loader2 className='h-12 w-12 animate-spin text-primary mx-auto' />
          <p className='text-muted-foreground'>جاري تحميل لوحة التحكم...</p>
        </div>
      </div>
    )
  }

  return (
    <div className='space-y-6'>
      {/* Data Source Alert */}
      {dataSource === 'mock' && (
        <Alert className='border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20'>
          <AlertCircle className='h-4 w-4 text-yellow-600' />
          <AlertDescription className='text-yellow-800 dark:text-yellow-200'>
            📊 يتم عرض بيانات تجريبية. لعرض البيانات الحقيقية، تأكد من اتصال الـ API بشكل صحيح.
          </AlertDescription>
        </Alert>
      )}

      {/* Header */}
      <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4'>
        <div>
          <h1 className='text-2xl md:text-3xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent'>
            لوحة التحكم
          </h1>
          <p className='text-muted-foreground mt-1'>
            مرحباً بك، إليك نظرة عامة على متجرك
          </p>
        </div>
        <div className='flex items-center gap-2 text-sm text-muted-foreground'>
          <Clock className='h-4 w-4' />
          <span>آخر تحديث: {new Date().toLocaleString('ar-EG')}</span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4'>
        <Card className='overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all hover:scale-105'>
          <CardContent className='p-6'>
            <div className='flex items-start justify-between'>
              <div className='flex-1'>
                <p className='text-sm text-muted-foreground mb-1'>إجمالي المبيعات</p>
                <h3 className='text-2xl md:text-3xl font-bold mb-2 bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent'>
                  {formatPrice(stats?.totalRevenue || 0)}
                </h3>
                {stats?.trends?.revenue && (
                  <p
                    className={`text-xs font-medium flex items-center gap-1 ${
                      stats.trends.revenue.isPositive
                        ? 'text-green-600 dark:text-green-400'
                        : 'text-red-600 dark:text-red-400'
                    }`}
                  >
                    {stats.trends.revenue.isPositive ? (
                      <ArrowUpRight className='h-3 w-3' />
                    ) : (
                      <ArrowDownRight className='h-3 w-3' />
                    )}
                    {Math.abs(stats.trends.revenue.value)}%
                  </p>
                )}
              </div>
              <div className='w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center shadow-lg'>
                <DollarSign className='h-6 w-6 text-white' />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className='overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all hover:scale-105'>
          <CardContent className='p-6'>
            <div className='flex items-start justify-between'>
              <div className='flex-1'>
                <p className='text-sm text-muted-foreground mb-1'>الطلبات</p>
                <h3 className='text-2xl md:text-3xl font-bold mb-2 bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent'>
                  {stats?.totalOrders || 0}
                </h3>
                {stats?.trends?.orders && (
                  <p
                    className={`text-xs font-medium flex items-center gap-1 ${
                      stats.trends.orders.isPositive
                        ? 'text-green-600 dark:text-green-400'
                        : 'text-red-600 dark:text-red-400'
                    }`}
                  >
                    {stats.trends.orders.isPositive ? (
                      <ArrowUpRight className='h-3 w-3' />
                    ) : (
                      <ArrowDownRight className='h-3 w-3' />
                    )}
                    {Math.abs(stats.trends.orders.value)}%
                  </p>
                )}
              </div>
              <div className='w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center shadow-lg'>
                <ShoppingCart className='h-6 w-6 text-white' />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className='overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all hover:scale-105'>
          <CardContent className='p-6'>
            <div className='flex items-start justify-between'>
              <div className='flex-1'>
                <p className='text-sm text-muted-foreground mb-1'>المنتجات</p>
                <h3 className='text-2xl md:text-3xl font-bold mb-2 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent'>
                  {stats?.totalProducts || 0}
                </h3>
              </div>
              <div className='w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center shadow-lg'>
                <Package className='h-6 w-6 text-white' />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className='overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all hover:scale-105'>
          <CardContent className='p-6'>
            <div className='flex items-start justify-between'>
              <div className='flex-1'>
                <p className='text-sm text-muted-foreground mb-1'>العملاء</p>
                <h3 className='text-2xl md:text-3xl font-bold mb-2 bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent'>
                  {stats?.totalUsers || 0}
                </h3>
              </div>
              <div className='w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center shadow-lg'>
                <Users className='h-6 w-6 text-white' />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row 1 */}
      {/* <div className='grid lg:grid-cols-2 gap-6'>
        <SalesChart data={salesData} />
        <CategoryDistribution data={categoryData} />
      </div> */}

     

      {/* Recent Orders & Top Products */}
      <div className='grid lg:grid-cols-2 gap-6'>
        {/* Recent Orders */}
        <Card className='border-0 shadow-lg'>
          <div className='p-6 border-b bg-gradient-to-r from-blue-500/5 to-purple-500/10'>
            <div className='flex items-center justify-between'>
              <div>
                <h3 className='text-lg font-bold'>أحدث الطلبات</h3>
                <p className='text-sm text-muted-foreground'>آخر 5 طلبات</p>
              </div>
              <Link href='/admin/orders'>
                <Button variant='ghost' size='sm'>
                  عرض الكل
                  <TrendingUp className='mr-2 h-4 w-4' />
                </Button>
              </Link>
            </div>
          </div>
          <div className='p-0'>
            {recentOrders.length === 0 ? (
              <p className='text-center text-muted-foreground py-8'>لا توجد طلبات</p>
            ) : (
              <div className='divide-y'>
                {recentOrders.map((order) => (
                  <div key={order._id} className='p-4 hover:bg-accent/50 transition-colors'>
                    <div className='flex items-center justify-between mb-2'>
                      <div className='flex items-center gap-3'>
                        <Avatar className='h-10 w-10'>
                          <AvatarImage src={order.user?.profileImg} />
                          <AvatarFallback className='bg-primary/10 text-primary font-bold'>
                            {order.user?.name?.charAt(0) || 'U'}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className='font-semibold text-sm'>
                            {order.user?.name || 'غير معروف'}
                          </p>
                          <p className='text-xs text-muted-foreground'>
                            #{order._id.slice(-6)}
                          </p>
                        </div>
                      </div>
                      <Link href={`/admin/orders/${order._id}`}>
                        <Button variant='ghost' size='icon' className='h-8 w-8'>
                          <Eye className='h-4 w-4' />
                        </Button>
                      </Link>
                    </div>
                    <div className='flex items-center justify-between'>
                      <span className='font-bold text-primary'>
                        {formatPrice(order.totalOrderPrice || 0)}
                      </span>
                      {getStatusBadge(order.status || 'pending')}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </Card>

        {/* Top Products */}
        <Card className='border-0 shadow-lg'>
          <div className='p-6 border-b bg-gradient-to-r from-green-500/5 to-emerald-500/10'>
            <div className='flex items-center justify-between'>
              <div>
                <h3 className='text-lg font-bold'>المنتجات الأكثر مبيعاً</h3>
                <p className='text-sm text-muted-foreground'>أفضل 5 منتجات</p>
              </div>
              <Link href='/admin/products'>
                <Button variant='ghost' size='sm'>
                  عرض الكل
                  <TrendingUp className='mr-2 h-4 w-4' />
                </Button>
              </Link>
            </div>
          </div>
          <div className='p-0'>
            {topProducts.length === 0 ? (
              <p className='text-center text-muted-foreground py-8'>لا توجد منتجات</p>
            ) : (
              <div className='divide-y'>
                {topProducts.map((product, index) => (
                  <div key={product._id} className='p-4 hover:bg-accent/50 transition-colors'>
                    <div className='flex items-center gap-4'>
                      <div
                        className={`flex items-center justify-center w-8 h-8 rounded-full font-bold text-sm flex-shrink-0 ${
                          index === 0
                            ? 'bg-gradient-to-br from-yellow-400 to-yellow-600 text-white shadow-lg'
                            : index === 1
                            ? 'bg-gradient-to-br from-gray-300 to-gray-500 text-white shadow-lg'
                            : index === 2
                            ? 'bg-gradient-to-br from-orange-400 to-orange-600 text-white shadow-lg'
                            : 'bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-800'
                        }`}
                      >
                        {index + 1}
                      </div>
                      <div className='flex-1 min-w-0'>
                        <p className='font-semibold text-sm truncate'>
                          {product.titleAr || product.title}
                        </p>
                        <p className='text-xs text-muted-foreground'>
                          {product.sold || 0} مبيعات
                        </p>
                      </div>
                      <div className='text-left flex-shrink-0'>
                        <p className='font-bold text-primary text-sm'>
                          {formatPrice(
                            (product.priceAfterDiscount || product.price) * (product.sold || 0)
                          )}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className='border-0 shadow-lg'>
        <div className='p-6 border-b bg-gradient-to-r from-primary/5 to-primary/10'>
          <h3 className='text-lg font-bold'>إجراءات سريعة</h3>
        </div>
        <CardContent className='p-6'>
          <div className='grid grid-cols-2 lg:grid-cols-4 gap-3'>
            <Link href='/admin/products/new' className='block'>
              <Button className='w-full bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-lg hover:shadow-xl transition-all'>
                <Package className='ml-2 h-4 w-4' />
                <span className='hidden sm:inline'>إضافة منتج</span>
                <span className='sm:hidden'>منتج</span>
              </Button>
            </Link>
            <Link href='/admin/categories' className='block'>
              <Button className='w-full' variant='outline'>
                <span className='hidden sm:inline'>الفئات</span>
                <span className='sm:hidden'>فئات</span>
              </Button>
            </Link>
            <Link href='/admin/orders' className='block'>
              <Button className='w-full' variant='outline'>
                <ShoppingCart className='ml-2 h-4 w-4' />
                <span className='hidden sm:inline'>الطلبات</span>
                <span className='sm:hidden'>طلبات</span>
              </Button>
            </Link>
            <Link href='/admin/customers' className='block'>
              <Button className='w-full' variant='outline'>
                <Users className='ml-2 h-4 w-4' />
                <span className='hidden sm:inline'>العملاء</span>
                <span className='sm:hidden'>عملاء</span>
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}