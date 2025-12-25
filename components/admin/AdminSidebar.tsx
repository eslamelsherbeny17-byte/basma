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
} from 'lucide-react'

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
    <aside className='fixed top-0 right-0 h-screen w-64 bg-slate-900 text-white border-l border-slate-800 hidden lg:block'>
      {/* Logo */}
      <div className='h-16 flex items-center justify-center border-b border-slate-800'>
        <h1 className='text-xl font-bold'>لوحة التحكم</h1>
      </div>

      {/* Navigation */}
      <nav className='p-4 space-y-2'>
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive =
            pathname === item.href || pathname.startsWith(item.href + '/')

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 px-4 py-3 rounded-lg transition-colors',
                isActive
                  ? 'bg-primary text-primary-foreground'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              )}
            >
              <Icon className='w-5 h-5' />
              <span>{item.label}</span>
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}
