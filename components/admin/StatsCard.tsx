import { LucideIcon } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'

interface StatsCardProps {
  title: string
  value: string | number
  icon: LucideIcon
  trend?: {
    value: number
    isPositive: boolean
  }
  className?: string
}

export function StatsCard({
  title,
  value,
  icon: Icon,
  trend,
  className,
}: StatsCardProps) {
  return (
    <Card className={cn('overflow-hidden', className)}>
      <CardContent className='p-6'>
        <div className='flex items-start justify-between'>
          <div className='flex-1'>
            <p className='text-sm text-muted-foreground mb-1'>{title}</p>
            <h3 className='text-3xl font-bold mb-2'>{value}</h3>
            {trend && (
              <p
                className={cn(
                  'text-xs font-medium',
                  trend.isPositive ? 'text-green-600' : 'text-red-600'
                )}
              >
                {trend.isPositive ? '↑' : '↓'} {Math.abs(trend.value)}%{' '}
                <span className='text-muted-foreground'>من الشهر الماضي</span>
              </p>
            )}
          </div>
          <div className='w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center'>
            <Icon className='h-6 w-6 text-primary' />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
