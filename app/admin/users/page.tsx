'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Search, Shield, UserX, Eye, Mail, Phone } from 'lucide-react'
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

interface User {
  _id: string
  name: string
  email: string
  phone?: string
  role: 'user' | 'admin'
  profileImg?: string
  createdAt: string
  ordersCount?: number
  totalSpent?: number
}

// Mock users data
const mockUsers: User[] = [
  {
    _id: '1',
    name: 'فاطمة أحمد',
    email: 'fatima@example.com',
    phone: '+20 123 456 7890',
    role: 'user',
    createdAt: '2024-01-15T10:00:00',
    ordersCount: 5,
    totalSpent: 2450,
  },
  {
    _id: '2',
    name: 'مريم محمد',
    email: 'maryam@example.com',
    phone: '+20 123 456 7891',
    role: 'user',
    createdAt: '2024-01-10T14:30:00',
    ordersCount: 8,
    totalSpent: 4200,
  },
  {
    _id: '3',
    name: 'أحمد علي',
    email: 'ahmed@example.com',
    role: 'admin',
    createdAt: '2023-12-01T09:00:00',
  },
]

export default function UsersManagement() {
  const [users, setUsers] = useState<User[]>(mockUsers)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterRole, setFilterRole] = useState('all')

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesRole = filterRole === 'all' || user.role === filterRole
    return matchesSearch && matchesRole
  })

  const handleRoleChange = async (userId: string, newRole: string) => {
    if (!confirm('هل أنت متأكد من تغيير دور هذا المستخدم؟')) return

    try {
      await adminUsersAPI.changeRole(userId, newRole)
      setUsers(
        users.map((user) =>
          user._id === userId
            ? { ...user, role: newRole as 'user' | 'admin' }
            : user
        )
      )
    } catch (error) {
      console.error('Failed to change role:', error)
      alert('فشل تغيير الدور')
    }
  }

  const handleDeleteUser = async (userId: string) => {
    if (!confirm('هل أنت متأكد من حذف هذا المستخدم؟')) return

    try {
      await adminUsersAPI.delete(userId)
      setUsers(users.filter((user) => user._id !== userId))
    } catch (error) {
      console.error('Failed to delete user:', error)
      alert('فشل حذف المستخدم')
    }
  }

  return (
    <div className='space-y-6'>
      {/* Header */}
      <div className='flex items-center justify-between'>
        <div>
          <h1 className='text-3xl font-bold mb-2'>إدارة المستخدمين</h1>
          <p className='text-muted-foreground'>
            إجمالي المستخدمين: {users.length}
          </p>
        </div>
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
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>المستخدم</TableHead>
                <TableHead>البريد الإلكتروني</TableHead>
                <TableHead>رقم الهاتف</TableHead>
                <TableHead>الدور</TableHead>
                <TableHead>الطلبات</TableHead>
                <TableHead>إجمالي الإنفاق</TableHead>
                <TableHead>تاريخ التسجيل</TableHead>
                <TableHead>الإجراءات</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className='text-center py-12'>
                    لا يوجد مستخدمين
                  </TableCell>
                </TableRow>
              ) : (
                filteredUsers.map((user) => (
                  <TableRow key={user._id}>
                    <TableCell>
                      <div className='flex items-center gap-3'>
                        <Avatar>
                          <AvatarImage src={user.profileImg} />
                          <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className='font-medium'>{user.name}</p>
                          <p className='text-xs text-muted-foreground'>
                            {user._id}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className='flex items-center gap-2'>
                        <Mail className='h-4 w-4 text-muted-foreground' />
                        <span className='text-sm'>{user.email}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      {user.phone ? (
                        <div className='flex items-center gap-2'>
                          <Phone className='h-4 w-4 text-muted-foreground' />
                          <span className='text-sm'>{user.phone}</span>
                        </div>
                      ) : (
                        <span className='text-muted-foreground'>-</span>
                      )}
                    </TableCell>
                    <TableCell>
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
                    </TableCell>
                    <TableCell>
                      <Badge variant='secondary'>{user.ordersCount || 0}</Badge>
                    </TableCell>
                    <TableCell>
                      {user.totalSpent ? (
                        <span className='font-semibold'>
                          {user.totalSpent} جنيه
                        </span>
                      ) : (
                        <span className='text-muted-foreground'>-</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {new Date(user.createdAt).toLocaleDateString('ar-EG')}
                    </TableCell>
                    <TableCell>
                      <div className='flex items-center gap-2'>
                        <Link href={`/admin/users/${user._id}`}>
                          <Button variant='ghost' size='icon'>
                            <Eye className='h-4 w-4' />
                          </Button>
                        </Link>
                        <Button
                          variant='ghost'
                          size='icon'
                          onClick={() => handleDeleteUser(user._id)}
                          disabled={user.role === 'admin'}
                        >
                          <UserX className='h-4 w-4 text-destructive' />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

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
    </div>
  )
}
