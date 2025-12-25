'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  Package,
  FolderTree,
  ShoppingCart,
  Users,
  Star,
  Tags,
  Settings,
  LogOut,
  Menu,
  X,
} from 'lucide-react'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

const menuItems = [
  {
    title: 'لوحة التحكم',
    href: '/admin',
    icon: LayoutDashboard,
  },
  {
    title: 'المنتجات',
    href: '/admin/products',
    icon: Package,
  },
  {
    title: 'الفئات',
    href: '/admin/categories',
    icon: FolderTree,
  },
  {
    title: 'الطلبات',
    href: '/admin/orders',
    icon: ShoppingCart,
  },
  {
    title: 'المستخدمين',
    href: '/admin/users',
    icon: Users,
  },
  {
    title: 'التقييمات',
    href: '/admin/reviews',
    icon: Star,
  },
  {
    title: 'الماركات',
    href: '/admin/brands',
    icon: Tags,
  },
  {
    title: 'الإعدادات',
    href: '/admin/settings',
    icon: Settings,
  },
]

export function Sidebar() {
  const pathname = usePathname()
  const [isMobileOpen, setIsMobileOpen] = useState(false)

  const handleLogout = () => {
    localStorage.removeItem('adminToken')
    window.location.href = '/admin/login'
  }

  const SidebarContent = () => (
    <>
      {/* Logo */}
      <div className='p-6 border-b'>
        <Link href='/admin' className='flex items-center gap-2'>
          <div className='w-10 h-10 rounded-lg bg-primary flex items-center justify-center'>
            <LayoutDashboard className='h-6 w-6 text-white' />
          </div>
          <div>
            <h2 className='text-xl font-bold text-gold-gradient'>أيمن بشير</h2>
            <p className='text-xs text-muted-foreground'>لوحة الإدارة</p>
          </div>
        </Link>
      </div>

      {/* Menu Items */}
      <nav className='flex-1 p-4 space-y-1'>
        {menuItems.map((item) => {
          const isActive =
            pathname === item.href || pathname.startsWith(item.href + '/')
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setIsMobileOpen(false)}
              className={cn(
                'flex items-center gap-3 px-4 py-3 rounded-lg transition-all',
                isActive
                  ? 'bg-primary text-white'
                  : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
              )}
            >
              <item.icon className='h-5 w-5' />
              <span className='font-medium'>{item.title}</span>
            </Link>
          )
        })}
      </nav>

      {/* Logout */}
      <div className='p-4 border-t'>
        <Button
          variant='ghost'
          className='w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10'
          onClick={handleLogout}
        >
          <LogOut className='ml-3 h-5 w-5' />
          تسجيل الخروج
        </Button>
      </div>
    </>
  )

  return (
    <>
      {/* Mobile Toggle */}
      <Button
        variant='outline'
        size='icon'
        className='fixed top-4 right-4 z-50 lg:hidden'
        onClick={() => setIsMobileOpen(!isMobileOpen)}
      >
        {isMobileOpen ? (
          <X className='h-5 w-5' />
        ) : (
          <Menu className='h-5 w-5' />
        )}
      </Button>

      {/* Desktop Sidebar */}
      <aside className='hidden lg:flex lg:flex-col w-72 bg-white border-l h-screen sticky top-0'>
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar */}
      {isMobileOpen && (
        <>
          <div
            className='fixed inset-0 bg-black/50 z-40 lg:hidden'
            onClick={() => setIsMobileOpen(false)}
          />
          <aside className='fixed top-0 right-0 bottom-0 w-72 bg-white border-l z-50 lg:hidden flex flex-col'>
            <SidebarContent />
          </aside>
        </>
      )}
    </>
  )
}
