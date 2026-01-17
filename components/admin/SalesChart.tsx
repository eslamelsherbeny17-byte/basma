// components/admin/SalesChart.tsx
'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { 
  LineChart, 
  Line, 
  AreaChart,
  Area,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Legend 
} from 'recharts'
import { TrendingUp, DollarSign } from 'lucide-react'
import { formatPrice } from '@/lib/utils'

interface SalesChartProps {
  data?: Array<{
    name: string
    sales: number
    orders: number
  }>
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className='bg-background/95 backdrop-blur-sm border border-border rounded-lg shadow-lg p-3'>
        <p className='font-semibold mb-2'>{label}</p>
        <div className='space-y-1'>
          <p className='text-sm text-emerald-600 dark:text-emerald-400 font-medium flex items-center gap-2'>
            <DollarSign className='h-3 w-3' />
            المبيعات: {formatPrice(payload[0].value)}
          </p>
          <p className='text-sm text-blue-600 dark:text-blue-400 font-medium'>
            الطلبات: {payload[1].value}
          </p>
        </div>
      </div>
    )
  }
  return null
}

export function SalesChart({ data }: SalesChartProps) {
  const defaultData = [
    { name: 'يناير', sales: 4000, orders: 24 },
    { name: 'فبراير', sales: 3000, orders: 19 },
    { name: 'مارس', sales: 5000, orders: 28 },
    { name: 'أبريل', sales: 2780, orders: 20 },
    { name: 'مايو', sales: 4890, orders: 28 },
    { name: 'يونيو', sales: 6390, orders: 35 },
    { name: 'يوليو', sales: 7490, orders: 41 },
  ]

  const chartData = data || defaultData
  const totalSales = chartData.reduce((sum, item) => sum + item.sales, 0)
  const totalOrders = chartData.reduce((sum, item) => sum + item.orders, 0)

  return (
    <Card className='border-0 shadow-lg overflow-hidden'>
      <CardHeader className='border-b bg-gradient-to-r from-emerald-500/5 to-blue-500/10'>
        <div className='flex items-center justify-between flex-wrap gap-3'>
          <div>
            <CardTitle className='text-lg md:text-xl flex items-center gap-2'>
              📈 تقرير المبيعات
            </CardTitle>
            <p className='text-sm text-muted-foreground mt-1'>
              الأداء الشهري للمتجر
            </p>
          </div>
          <div className='flex gap-4 text-sm'>
            <div className='bg-emerald-50 dark:bg-emerald-900/20 px-3 py-1.5 rounded-lg'>
              <p className='text-xs text-muted-foreground'>إجمالي المبيعات</p>
              <p className='font-bold text-emerald-600 dark:text-emerald-400'>
                {formatPrice(totalSales)}
              </p>
            </div>
            <div className='bg-blue-50 dark:bg-blue-900/20 px-3 py-1.5 rounded-lg'>
              <p className='text-xs text-muted-foreground'>إجمالي الطلبات</p>
              <p className='font-bold text-blue-600 dark:text-blue-400'>
                {totalOrders}
              </p>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className='pt-6'>
        <ResponsiveContainer width='100%' height={350}>
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id='colorSales' x1='0' y1='0' x2='0' y2='1'>
                <stop offset='5%' stopColor='#10B981' stopOpacity={0.3} />
                <stop offset='95%' stopColor='#10B981' stopOpacity={0} />
              </linearGradient>
              <linearGradient id='colorOrders' x1='0' y1='0' x2='0' y2='1'>
                <stop offset='5%' stopColor='#3B82F6' stopOpacity={0.3} />
                <stop offset='95%' stopColor='#3B82F6' stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray='3 3' stroke='hsl(var(--border))' />
            <XAxis 
              dataKey='name' 
              stroke='hsl(var(--muted-foreground))'
              style={{ fontSize: '12px' }}
            />
            <YAxis 
              stroke='hsl(var(--muted-foreground))'
              style={{ fontSize: '12px' }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend 
              wrapperStyle={{ fontSize: '14px', paddingTop: '20px' }}
              iconType='circle'
            />
            <Area
              type='monotone'
              dataKey='sales'
              name='المبيعات'
              stroke='#10B981'
              strokeWidth={3}
              fillOpacity={1}
              fill='url(#colorSales)'
            />
            <Area
              type='monotone'
              dataKey='orders'
              name='الطلبات'
              stroke='#3B82F6'
              strokeWidth={3}
              fillOpacity={1}
              fill='url(#colorOrders)'
            />
          </AreaChart>
        </ResponsiveContainer>

        {/* Summary */}
        <div className='mt-6 p-4 bg-gradient-to-r from-emerald-50 to-blue-50 dark:from-emerald-900/10 dark:to-blue-900/10 rounded-lg border border-emerald-200/50 dark:border-emerald-800/50'>
          <div className='flex items-center justify-between'>
            <div className='flex items-center gap-2'>
              <TrendingUp className='h-5 w-5 text-emerald-600 dark:text-emerald-400' />
              <span className='font-semibold text-sm'>متوسط المبيعات الشهري</span>
            </div>
            <span className='text-xl font-bold text-emerald-600 dark:text-emerald-400'>
              {formatPrice(totalSales / chartData.length)}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}