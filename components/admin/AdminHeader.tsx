'use client'

import { useAdminAuth } from '@/contexts/AdminAuthContext'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { LogOut, User, Bell } from 'lucide-react'

export default function AdminHeader() {
  const { admin, logout } = useAdminAuth()

  return (
    <header className='h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6'>
      <div className='flex items-center gap-4'>
        <h2 className='text-xl font-semibold text-slate-800'>
          مرحباً، {admin?.name}
        </h2>
      </div>

      <div className='flex items-center gap-4'>
        {/* Notifications */}
        <Button variant='ghost' size='icon' className='relative'>
          <Bell className='w-5 h-5' />
          <span className='absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full'></span>
        </Button>

        {/* Admin Profile */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant='ghost' className='flex items-center gap-2'>
              <Avatar className='w-8 h-8'>
                <AvatarImage src={admin?.avatar} />
                <AvatarFallback>
                  {admin?.name?.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <span className='hidden md:inline'>{admin?.name}</span>
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align='end' className='w-56'>
            <DropdownMenuLabel>حسابي</DropdownMenuLabel>
            <DropdownMenuSeparator />

            <DropdownMenuItem>
              <User className='ml-2 h-4 w-4' />
              الملف الشخصي
            </DropdownMenuItem>

            <DropdownMenuSeparator />

            <DropdownMenuItem onClick={logout} className='text-red-600'>
              <LogOut className='ml-2 h-4 w-4' />
              تسجيل الخروج
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
