'use client'

import { useState, useEffect } from 'react'
import { 
  Bell, 
  Menu, 
  Moon, 
  Search, 
  Sun, 
  User,
  Store,
  ExternalLink,
  LogOut,
  Settings
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { useTheme } from 'next-themes'
import { usersAPI } from '@/lib/api'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import Cookies from 'js-cookie'

interface AdminHeaderProps {
  onMenuClick: () => void
}

export function AdminHeader({ onMenuClick }: AdminHeaderProps) {
  const { theme, setTheme } = useTheme()
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    fetchUser()
  }, [])

  const fetchUser = async () => {
    try {
      const userData = await usersAPI.getMe()
      setUser(userData)
    } catch (error) {
      console.error('Failed to fetch user:', error)
    }
  }

  const handleLogout = () => {
    // Clear all auth data
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    Cookies.remove('token')
    
    // Redirect to admin login
    router.push('/admin/login')
  }

  if (!mounted) return null

  const userRole = user?.role === 'admin' ? 'مدير' : 'مسؤول'

  return (
    <header className='sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60'>
      <div className='flex h-16 items-center gap-3 md:gap-4 px-4 md:px-6'>
        {/* Mobile Menu Button */}
        <Button
          variant='ghost'
          size='icon'
          className='lg:hidden flex-shrink-0'
          onClick={onMenuClick}
        >
          <Menu className='h-5 w-5' />
        </Button>

        {/* Site Name (Mobile Only) */}
        <div className='flex items-center gap-2 lg:hidden'>
          <h1 className='text-lg font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent'>
            أيمن بشير
          </h1>
        </div>

        {/* Search (Hidden on mobile) */}
        <div className='hidden md:flex flex-1 max-w-md'>
          <div className='relative w-full'>
            <Search className='absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground' />
            <Input
              placeholder='بحث...'
              className='pr-10 bg-secondary/50'
            />
          </div>
        </div>

        <div className='flex flex-1 items-center justify-end gap-2 md:gap-3'>
          {/* 🔥 Store Button - زر المتجر المميز */}
          <Link href='/' target='_blank'>
            <Button
              className='relative overflow-hidden bg-gradient-to-r from-emerald-600 via-green-600 to-teal-600 hover:from-emerald-700 hover:via-green-700 hover:to-teal-700 text-white shadow-lg hover:shadow-xl hover:shadow-emerald-500/50 transition-all duration-300 group border-0 h-10 px-4 md:px-6'
            >
              {/* Animated Background Shine */}
              <span className='absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-700'></span>
              
              {/* Icon */}
              <Store className='h-4 w-4 md:h-5 md:w-5 ml-2 group-hover:rotate-12 transition-transform duration-300' />
              
              {/* Text - Hidden on small mobile */}
              <span className='hidden sm:inline font-bold text-sm md:text-base relative z-10'>
                المتجر
              </span>
              
              {/* External Link Icon */}
              <ExternalLink className='h-3 w-3 md:h-4 md:w-4 mr-2 opacity-70 group-hover:opacity-100 transition-opacity' />
            </Button>
          </Link>

          {/* Theme Toggle */}
          <Button
            variant='ghost'
            size='icon'
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className='h-10 w-10 flex-shrink-0'
          >
            {theme === 'dark' ? (
              <Sun className='h-5 w-5' />
            ) : (
              <Moon className='h-5 w-5' />
            )}
          </Button>

          {/* Notifications - Hidden on small mobile */}
          <Button 
            variant='ghost' 
            size='icon' 
            className='relative hidden sm:flex h-10 w-10 flex-shrink-0'
          >
            <Bell className='h-5 w-5' />
            <span className='absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-red-500 ring-2 ring-background animate-pulse' />
          </Button>

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant='ghost' className='gap-2 px-2 md:px-3 h-10'>
                <Avatar className='h-8 w-8 ring-2 ring-primary/20'>
                  <AvatarImage src={user?.profileImg} />
                  <AvatarFallback className='bg-gradient-to-br from-primary to-primary/60 text-primary-foreground font-bold'>
                    {user?.name?.charAt(0) || 'A'}
                  </AvatarFallback>
                </Avatar>
                <div className='hidden lg:flex flex-col items-start text-sm'>
                  <span className='font-semibold'>{user?.name || 'Admin'}</span>
                  <span className='text-xs text-muted-foreground'>{userRole}</span>
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align='end' className='w-56'>
              <DropdownMenuLabel>
                <div className='flex flex-col gap-1'>
                  <span>{user?.name || 'Admin'}</span>
                  <span className='text-xs font-normal text-muted-foreground'>
                    {user?.email}
                  </span>
                  <span className='text-xs font-semibold text-primary'>
                    {userRole}
                  </span>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              
              <Link href='/profile'>
                <DropdownMenuItem className='cursor-pointer'>
                  <User className='ml-2 h-4 w-4' />
                  الملف الشخصي
                </DropdownMenuItem>
              </Link>
              
              <Link href='/admin/settings'>
                <DropdownMenuItem className='cursor-pointer'>
                  <Settings className='ml-2 h-4 w-4' />
                  الإعدادات
                </DropdownMenuItem>
              </Link>
              
              <DropdownMenuSeparator />
              
              <DropdownMenuItem 
                className='text-red-600 dark:text-red-400 cursor-pointer font-semibold'
                onClick={handleLogout}
              >
                <LogOut className='ml-2 h-4 w-4' />
                تسجيل الخروج
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Mobile Search Bar */}
      <div className='md:hidden border-t px-4 py-2'>
        <div className='relative'>
          <Search className='absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground' />
          <Input
            placeholder='بحث...'
            className='pr-10 bg-secondary/50'
          />
        </div>
      </div>
    </header>
  )
}