'use client'

import { useState, useEffect } from 'react'
import { Bell, Menu, Moon, Search, Sun, User } from 'lucide-react'
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

interface AdminHeaderProps {
  onMenuClick: () => void
}

export function AdminHeader({ onMenuClick }: AdminHeaderProps) {
  const { theme, setTheme } = useTheme()
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

  if (!mounted) return null

  const userRole = user?.role === 'admin' ? 'مدير' : 'مسؤول'

  return (
    <header className='sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60'>
      <div className='flex h-16 items-center gap-4 px-4 md:px-6'>
        {/* Mobile Menu Button */}
        <Button
          variant='ghost'
          size='icon'
          className='lg:hidden'
          onClick={onMenuClick}
        >
          <Menu className='h-5 w-5' />
        </Button>

        {/* Site Name (Mobile Only) */}
        <div className='flex items-center gap-2 lg:hidden'>
          <h1 className='text-xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent'>
            أيمن بشير
          </h1>
        </div>

        {/* Search (Hidden on small mobile) */}
        <div className='hidden sm:flex flex-1 max-w-md'>
          <div className='relative w-full'>
            <Search className='absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground' />
            <Input
              placeholder='بحث...'
              className='pr-10 bg-secondary/50'
            />
          </div>
        </div>

        <div className='flex flex-1 items-center justify-end gap-2 md:gap-4'>
          {/* Theme Toggle - Larger on Mobile */}
          <Button
            variant='ghost'
            size='icon'
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className='h-10 w-10 md:h-9 md:w-9'
          >
            {theme === 'dark' ? (
              <Sun className='h-5 w-5 md:h-4 md:w-4' />
            ) : (
              <Moon className='h-5 w-5 md:h-4 md:w-4' />
            )}
          </Button>

          {/* Notifications */}
          <Button variant='ghost' size='icon' className='relative hidden md:flex'>
            <Bell className='h-4 w-4' />
            <span className='absolute top-1 right-1 h-2 w-2 rounded-full bg-red-500' />
          </Button>

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant='ghost' className='gap-2 px-2 md:px-3'>
                <Avatar className='h-8 w-8'>
                  <AvatarImage src={user?.profileImg} />
                  <AvatarFallback className='bg-primary text-primary-foreground'>
                    {user?.name?.charAt(0) || 'A'}
                  </AvatarFallback>
                </Avatar>
                <div className='hidden md:flex flex-col items-start text-sm'>
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
                  <span className='text-xs font-normal text-primary'>
                    {userRole}
                  </span>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <User className='ml-2 h-4 w-4' />
                الملف الشخصي
              </DropdownMenuItem>
              <DropdownMenuItem>الإعدادات</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className='text-red-600'>
                تسجيل الخروج
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Mobile Search Bar */}
      <div className='sm:hidden border-t px-4 py-2'>
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