'use client'

import { useState, useEffect } from 'react'
import { Search, Shield, UserX, Mail, Phone, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { adminUsersAPI } from '@/lib/admin-api'
import { useToast } from '@/hooks/use-toast'

interface User {
  _id: string
  name: string
  email: string
  phone?: string
  role: 'user' | 'admin'
  profileImg?: string
  createdAt: string
}

export default function CustomersManagement() {
  const { toast } = useToast()
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterRole, setFilterRole] = useState('all')

  useEffect(() => {
    fetchUsers()
  }, [filterRole])

  const fetchUsers = async () => {
    try {
      setLoading(true)
      const params: any = {}
      if (filterRole !== 'all') {
        params.role = filterRole
      }

      const response = await adminUsersAPI.getAll(params)
      setUsers(response.data || [])
    } catch (error) {
      console.error('Failed to fetch users:', error)
      toast({
        title: 'خطأ',
        description: 'فشل تحميل المستخدمين',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  const handleRoleChange = async (userId: string, newRole: string) => {
    if (!confirm('هل أنت متأكد من تغيير دور هذا المستخدم؟')) return

    try {
      await adminUsersAPI.changeRole(userId, newRole)
      toast({
        title: 'تم التحديث',
        description: 'تم تغيير دور المستخدم بنجاح',
      })
      fetchUsers()
    } catch (error: any) {
      toast({
        title: 'خطأ',
        description: error.response?.data?.message || 'فشل تغيير الدور',
        variant: 'destructive',
      })
    }
  }

  const handleDeleteUser = async (userId: string) => {
    if (!confirm('هل أنت متأكد من حذف هذا المستخدم؟')) return

    try {
      await adminUsersAPI.delete(userId)
      toast({
        title: 'تم الحذف',
        description: 'تم حذف المستخدم بنجاح',
      })
      fetchUsers()
    } catch (error: any) {
      toast({
        title: 'خطأ',
        description: error.response?.data?.message || 'فشل حذف المستخدم',
        variant: 'destructive',
      })
    }
  }

  const filteredUsers = users.filter(
    (user) =>
      user.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className='space-y-6'>
      {/* Header */}
      <div className='flex items-center justify-between'>
        <div>
          <h1 className='text-3xl font-bold mb-2'>إدارة العملاء</h1>
          <p className='text-muted-foreground'>
            إجمالي المستخدمين: {users.length}
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className='grid md:grid-cols-3 gap-6'>
        <Card>
          <CardContent className='pt-6'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-sm text-muted-foreground'>
                  إجمالي المستخدمين
                </p>
                <h3 className='text-2xl font-bold mt-1'>{users.length}</h3>
              </div>
              <div className='w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center'>
                <Shield className='h-6 w-6 text-primary' />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className='pt-6'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-sm text-muted-foreground'>المدراء</p>
                <h3 className='text-2xl font-bold mt-1'>
                  {users.filter((u) => u.role === 'admin').length}
                </h3>
              </div>
              <div className='w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center'>
                <Shield className='h-6 w-6 text-blue-600' />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className='pt-6'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-sm text-muted-foreground'>العملاء</p>
                <h3 className='text-2xl font-bold mt-1'>
                  {users.filter((u) => u.role === 'user').length}
                </h3>
              </div>
              <div className='w-12 h-12 rounded-lg bg-green-100 flex items-center justify-center'>
                <Shield className='h-6 w-6 text-green-600' />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className='pt-6'>
          <div className='flex gap-4'>
            <div className='flex-1 relative'>
              <Search className='absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground' />
              <Input
                placeholder='ابحث عن مستخدم...'
                className='pr-10'
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Select value={filterRole} onValueChange={setFilterRole}>
              <SelectTrigger className='w-[200px]'>
                <SelectValue placeholder='جميع الأدوار' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='all'>جميع الأدوار</SelectItem>
                <SelectItem value='user'>مستخدم</SelectItem>
                <SelectItem value='admin'>مدير</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card>
        <CardContent className='p-0'>
          {loading ? (
            <div className='flex items-center justify-center py-12'>
              <Loader2 className='h-8 w-8 animate-spin text-primary' />
            </div>
          ) : (
            <div className='overflow-x-auto'>
              <Table>
                <TableHeader>
                  <TableRow>
                    {/* 👇 محاذاة لليمين للنصوص العربية */}
                    <TableHead className='text-right'>المستخدم</TableHead>
                    <TableHead className='text-right'>
                      البريد الإلكتروني
                    </TableHead>
                    <TableHead className='text-right'>رقم الهاتف</TableHead>

                    {/* 👇 محاذاة للوسط للبيانات */}
                    <TableHead className='text-center'>الدور</TableHead>
                    <TableHead className='text-center'>تاريخ التسجيل</TableHead>

                    {/* 👇 محاذاة لليسار للإجراءات */}
                    <TableHead className='text-left'>الإجراءات</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className='text-center py-12'>
                        لا يوجد مستخدمين
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredUsers.map((user) => (
                      <TableRow key={user._id}>
                        {/* 👇 المستخدم - محاذاة لليمين */}
                        <TableCell className='text-right'>
                          <div className='flex items-center gap-3'>
                            <Avatar>
                              <AvatarImage src={user.profileImg} />
                              <AvatarFallback>
                                {user.name?.charAt(0) || 'U'}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className='font-medium'>{user.name}</p>
                              <p className='text-xs text-muted-foreground'>
                                {user._id.slice(-8)}
                              </p>
                            </div>
                          </div>
                        </TableCell>

                        {/* 👇 البريد - محاذاة لليمين */}
                        <TableCell className='text-right'>
                          <div className='flex items-center gap-2'>
                            <Mail className='h-4 w-4 text-muted-foreground' />
                            <span className='text-sm'>{user.email}</span>
                          </div>
                        </TableCell>

                        {/* 👇 الهاتف - محاذاة لليمين */}
                        <TableCell className='text-right'>
                          {user.phone ? (
                            <div className='flex items-center gap-2'>
                              <Phone className='h-4 w-4 text-muted-foreground' />
                              <span className='text-sm'>{user.phone}</span>
                            </div>
                          ) : (
                            <span className='text-muted-foreground'>-</span>
                          )}
                        </TableCell>

                        {/* 👇 الدور - محاذاة للوسط */}
                        <TableCell className='text-center'>
                          <div className='flex justify-center'>
                            <Select
                              value={user.role}
                              onValueChange={(value) =>
                                handleRoleChange(user._id, value)
                              }
                            >
                              <SelectTrigger className='w-[120px]'>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value='user'>مستخدم</SelectItem>
                                <SelectItem value='admin'>مدير</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </TableCell>

                        {/* 👇 التاريخ - محاذاة للوسط */}
                        <TableCell className='text-center'>
                          {new Date(user.createdAt).toLocaleDateString(
                            'ar-EG',
                            {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric',
                            }
                          )}
                        </TableCell>

                        {/* 👇 الإجراءات - محاذاة لليسار */}
                        <TableCell className='text-left'>
                          <Button
                            variant='ghost'
                            size='icon'
                            onClick={() => handleDeleteUser(user._id)}
                            disabled={user.role === 'admin'}
                            className='hover:bg-destructive/10'
                          >
                            <UserX className='h-4 w-4 text-destructive' />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
