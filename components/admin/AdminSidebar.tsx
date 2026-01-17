'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  FolderTree,
  Settings,
  BarChart3,
  Tag,
  Store,
  ArrowRight,
  ExternalLink,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'

const navItems = [
  {
    label: 'لوحة التحكم',
    href: '/admin/dashboard',
    icon: LayoutDashboard,
  },
  {
    label: 'المنتجات',
    href: '/admin/products',
    icon: Package,
  },
  {
    label: 'الطلبات',
    href: '/admin/orders',
    icon: ShoppingCart,
  },
  {
    label: 'العملاء',
    href: '/admin/users',
    icon: Users,
  },
  {
    label: 'التصنيفات',
    href: '/admin/categories',
    icon: FolderTree,
  },
  {
    label: 'الكوبونات',
    href: '/admin/coupons',
    icon: Tag,
  },
  {
    label: 'التقارير',
    href: '/admin/reports',
    icon: BarChart3,
  },
  {
    label: 'الإعدادات',
    href: '/admin/settings',
    icon: Settings,
  },
]

export default function AdminSidebar() {
  const pathname = usePathname()

  return (
    <aside className='fixed top-0 right-0 h-screen w-64 bg-slate-900 text-white border-l border-slate-800 hidden lg:flex lg:flex-col'>
      {/* Logo */}
      <div className='h-16 flex items-center justify-center border-b border-slate-800 flex-shrink-0'>
        <h1 className='text-xl font-bold bg-gradient-to-r from-primary to-purple-400 bg-clip-text text-transparent'>
          لوحة التحكم
        </h1>
      </div>

      {/* Quick Access - Store Button */}
      <div className='p-4 flex-shrink-0'>
        <Link href='/shop' target='_blank'>
          <Button
            variant='outline'
            className='w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white border-none shadow-lg hover:shadow-xl transition-all duration-300 h-11 group'
          >
            <Store className='w-5 h-5 ml-2 group-hover:scale-110 transition-transform' />
            <span className='font-bold'>زيارة المتجر</span>
            <ExternalLink className='w-4 h-4 mr-2 opacity-70' />
          </Button>
        </Link>
      </div>

      <Separator className='bg-slate-800' />

      {/* Navigation */}
      <nav className='p-4 space-y-2 flex-1 overflow-y-auto'>
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive =
            pathname === item.href || pathname.startsWith(item.href + '/')

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group',
                isActive
                  ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/30'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white hover:translate-x-1'
              )}
            >
              <Icon className={cn(
                'w-5 h-5 transition-transform',
                isActive && 'scale-110',
                !isActive && 'group-hover:scale-110'
              )} />
              <span className='font-medium'>{item.label}</span>
              {isActive && (
                <ArrowRight className='w-4 h-4 mr-auto animate-pulse' />
              )}
            </Link>
          )
        })}
      </nav>

      {/* Footer - Alternative Store Button */}
      <div className='p-4 border-t border-slate-800 flex-shrink-0'>
        <div className='bg-gradient-to-r from-slate-800 to-slate-700 p-3 rounded-lg'>
          <p className='text-xs text-slate-400 mb-2 text-center'>
            الوصول السريع
          </p>
          <Link href='/shop'>
            <Button
              variant='ghost'
              className='w-full text-emerald-400 hover:text-emerald-300 hover:bg-slate-800/50 font-semibold justify-start group'
            >
              <Store className='w-4 h-4 ml-2 group-hover:rotate-12 transition-transform' />
              المتجر الرئيسي
              <ArrowRight className='w-4 h-4 mr-auto rotate-180' />
            </Button>
          </Link>
        </div>
      </div>
    </aside>
  )
}