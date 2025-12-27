'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts'
import { Package } from 'lucide-react'

const COLORS = [
  '#8B5CF6',
  '#10B981',
  '#F59E0B',
  '#EF4444',
  '#3B82F6',
  '#EC4899',
  '#14B8A6',
  '#F97316',
]

interface CategoryDistributionProps {
  data?: Array<{
    name: string
    value: number
  }>
}

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const total = payload[0].payload.total || 0
    const percentage = total > 0 ? ((payload[0].value / total) * 100).toFixed(1) : 0
    return (
      <div className='bg-background/95 backdrop-blur-sm border border-border rounded-lg shadow-lg p-3'>
        <p className='font-semibold mb-1'>{payload[0].name}</p>
        <p className='text-sm text-muted-foreground'>
          {payload[0].value} منتج ({percentage}%)
        </p>
      </div>
    )
  }
  return null
}

const renderCustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }: any) => {
  if (percent < 0.05) return null // Hide labels for small slices
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5
  const x = cx + radius * Math.cos(-midAngle * (Math.PI / 180))
  const y = cy + radius * Math.sin(-midAngle * (Math.PI / 180))

  return (
    <text
      x={x}
      y={y}
      fill='white'
      textAnchor={x > cx ? 'start' : 'end'}
      dominantBaseline='central'
      className='text-xs font-bold'
    >
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  )
}

export function CategoryDistribution({ data }: CategoryDistributionProps) {
  const defaultData = [
    { name: 'عباءات', value: 145 },
    { name: 'حجاب', value: 98 },
    { name: 'فساتين', value: 76 },
    { name: 'إكسسوارات', value: 54 },
    { name: 'جلابيات', value: 43 },
    { name: 'أحذية', value: 28 },
  ]

  const chartData = data || defaultData
  const total = chartData.reduce((sum, item) => sum + item.value, 0)
  const dataWithTotal = chartData.map((item) => ({ ...item, total }))

  return (
    <Card className='border-0 shadow-lg overflow-hidden'>
      <CardHeader className='border-b bg-gradient-to-r from-orange-500/5 to-pink-500/10'>
        <CardTitle className='text-lg md:text-xl flex items-center gap-2'>
          🎯 توزيع المنتجات
        </CardTitle>
        <p className='text-sm text-muted-foreground'>حسب الفئات</p>
      </CardHeader>
      <CardContent className='pt-6'>
        <ResponsiveContainer width='100%' height={350}>
          <PieChart>
            <Pie
              data={dataWithTotal}
              cx='50%'
              cy='50%'
              labelLine={false}
              label={renderCustomLabel}
              outerRadius={120}
              innerRadius={70}
              fill='#8884d8'
              dataKey='value'
              paddingAngle={2}
            >
              {dataWithTotal.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend
              verticalAlign='bottom'
              height={36}
              iconType='circle'
              wrapperStyle={{
                fontSize: '14px',
                paddingTop: '20px',
              }}
            />
          </PieChart>
        </ResponsiveContainer>

        {/* Total Summary */}
        <div className='mt-4 p-4 bg-gradient-to-r from-primary/10 to-primary/5 rounded-lg border border-primary/20'>
          <div className='flex items-center justify-between'>
            <div className='flex items-center gap-2'>
              <Package className='h-5 w-5 text-primary' />
              <span className='font-semibold'>إجمالي المنتجات</span>
            </div>
            <span className='text-2xl font-bold text-primary'>{total}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}