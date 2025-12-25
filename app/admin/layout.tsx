'use client'

import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  Tags,
  Grid3x3,
  Settings,
  LogOut,
  Menu,
  X,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { useAuth } from '@/contexts/AuthContext'
import { Loader2 } from 'lucide-react'
import Cookies from 'js-cookie'

const navigation = [
  { name: 'لوحة التحكم', href: '/admin', icon: LayoutDashboard },
  { name: 'المنتجات', href: '/admin/products', icon: Package },
  { name: 'الطلبات', href: '/admin/orders', icon: ShoppingCart },
  { name: 'العملاء', href: '/admin/customers', icon: Users },
  { name: 'التصنيفات', href: '/admin/categories', icon: Grid3x3 },
  { name: 'العلامات التجارية', href: '/admin/brands', icon: Tags },
  { name: 'الإعدادات', href: '/admin/settings', icon: Settings },
]

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const pathname = usePathname()
  const { user, loading } = useAuth()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  // Skip auth check for login page
  const isLoginPage = pathname === '/admin/login'

  useEffect(() => {
    if (!loading && !isLoginPage) {
      // Check if user exists and is admin
      const token = Cookies.get('token')
      if (!token || !user || user.role !== 'admin') {
        router.push('/admin/login')
      }
    }
  }, [user, loading, router, isLoginPage])

  // Show loading while checking auth (except on login page)
  if (loading && !isLoginPage) {
    return (
      <div className='flex items-center justify-center min-h-screen bg-secondary'>
        <Loader2 className='h-12 w-12 animate-spin text-primary' />
      </div>
    )
  }

  // Render login page without layout
  if (isLoginPage) {
    return <>{children}</>
  }

  // Redirect if not admin
  if (!user || user.role !== 'admin') {
    return null
  }

  const handleLogout = () => {
    Cookies.remove('token')
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    router.push('/admin/login')
  }

  return (
    <div className='flex min-h-screen bg-secondary'>
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className='fixed inset-0 bg-black/50 z-40 lg:hidden'
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed top-0 right-0 z-50 h-full w-72 bg-white border-l transform transition-transform duration-300 lg:translate-x-0',
          sidebarOpen ? 'translate-x-0' : 'translate-x-full'
        )}
      >
        {/* Logo */}
        <div className='flex items-center justify-between h-16 px-6 border-b'>
          <Link href='/admin'>
            <h1 className='text-xl font-bold text-primary'>أيمن باشر</h1>
          </Link>
          <Button
            variant='ghost'
            size='icon'
            className='lg:hidden'
            onClick={() => setSidebarOpen(false)}
          >
            <X className='h-5 w-5' />
          </Button>
        </div>

        {/* Navigation */}
        <nav className='p-4 space-y-1'>
          {navigation.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link key={item.name} href={item.href}>
                <div
                  className={cn(
                    'flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors',
                    isActive
                      ? 'bg-primary text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                  )}
                  onClick={() => setSidebarOpen(false)}
                >
                  <item.icon className='h-5 w-5' />
                  {item.name}
                </div>
              </Link>
            )
          })}
        </nav>

        {/* Logout */}
        <div className='absolute bottom-0 left-0 right-0 p-4 border-t'>
          <Button
            variant='ghost'
            className='w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50'
            onClick={handleLogout}
          >
            <LogOut className='ml-2 h-5 w-5' />
            تسجيل الخروج
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <div className='flex-1 lg:mr-72'>
        {/* Header */}
        <header className='sticky top-0 z-30 h-16 bg-white border-b'>
          <div className='flex items-center justify-between h-full px-6'>
            <Button
              variant='ghost'
              size='icon'
              className='lg:hidden'
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className='h-6 w-6' />
            </Button>

            <div className='flex items-center gap-4'>
              <div className='text-right'>
                <p className='text-sm font-medium'>{user.name}</p>
                <p className='text-xs text-muted-foreground'>{user.email}</p>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className='p-6'>{children}</main>
      </div>
    </div>
  )
}
