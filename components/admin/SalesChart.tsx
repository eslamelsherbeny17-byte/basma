'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts'

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
        {payload.map((entry: any, index: number) => (
          <p key={index} className='text-sm flex items-center gap-2'>
            <span
              className='w-3 h-3 rounded-full'
              style={{ backgroundColor: entry.color }}
            />
            {entry.name}: {entry.value.toLocaleString('ar-EG')}
          </p>
        ))}
      </div>
    )
  }
  return null
}

export function SalesChart({ data }: SalesChartProps) {
  const defaultData = [
    { name: 'يناير', sales: 4000, orders: 240 },
    { name: 'فبراير', sales: 3000, orders: 198 },
    { name: 'مارس', sales: 5000, orders: 280 },
    { name: 'أبريل', sales: 2780, orders: 208 },
    { name: 'مايو', sales: 4890, orders: 281 },
    { name: 'يونيو', sales: 6390, orders: 350 },
    { name: 'يوليو', sales: 7490, orders: 410 },
  ]

  const chartData = data || defaultData

  return (
    <Card className='border-0 shadow-lg overflow-hidden'>
      <CardHeader className='border-b bg-gradient-to-r from-primary/5 to-primary/10'>
        <CardTitle className='text-lg md:text-xl flex items-center gap-2'>
          📈 المبيعات والطلبات
        </CardTitle>
        <p className='text-sm text-muted-foreground'>آخر 7 أشهر</p>
      </CardHeader>
      <CardContent className='pt-6'>
        <ResponsiveContainer width='100%' height={350}>
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id='colorSales' x1='0' y1='0' x2='0' y2='1'>
                <stop offset='5%' stopColor='#8B5CF6' stopOpacity={0.8} />
                <stop offset='95%' stopColor='#8B5CF6' stopOpacity={0} />
              </linearGradient>
              <linearGradient id='colorOrders' x1='0' y1='0' x2='0' y2='1'>
                <stop offset='5%' stopColor='#10B981' stopOpacity={0.8} />
                <stop offset='95%' stopColor='#10B981' stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray='3 3' stroke='hsl(var(--border))' opacity={0.2} />
            <XAxis
              dataKey='name'
              stroke='hsl(var(--muted-foreground))'
              style={{ fontSize: '12px' }}
              tick={{ fill: 'hsl(var(--muted-foreground))' }}
            />
            <YAxis
              stroke='hsl(var(--muted-foreground))'
              style={{ fontSize: '12px' }}
              tick={{ fill: 'hsl(var(--muted-foreground))' }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend
              wrapperStyle={{
                paddingTop: '20px',
                fontSize: '14px',
              }}
              iconType='circle'
            />
            <Area
              type='monotone'
              dataKey='sales'
              stroke='#8B5CF6'
              strokeWidth={3}
              fillOpacity={1}
              fill='url(#colorSales)'
              name='المبيعات (جنيه)'
            />
            <Area
              type='monotone'
              dataKey='orders'
              stroke='#10B981'
              strokeWidth={3}
              fillOpacity={1}
              fill='url(#colorOrders)'
              name='عدد الطلبات'
            />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}