'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ArrowRight, Plus, Edit, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

interface SubCategory {
  _id: string
  name: string
  nameAr: string
  category: {
    _id: string
    nameAr: string
  }
  productsCount?: number
}

// Mock data
const mockSubCategories: SubCategory[] = [
  {
    _id: '1',
    name: 'Casual Abayas',
    nameAr: 'عباءات كاجوال',
    category: { _id: 'c1', nameAr: 'عباءات' },
    productsCount: 12,
  },
  {
    _id: '2',
    name: 'Formal Abayas',
    nameAr: 'عباءات رسمية',
    category: { _id: 'c1', nameAr: 'عباءات' },
    productsCount: 8,
  },
  {
    _id: '3',
    name: 'Silk Hijabs',
    nameAr: 'حجاب حرير',
    category: { _id: 'c2', nameAr: 'حجاب' },
    productsCount: 15,
  },
  {
    _id: '4',
    name: 'Cotton Hijabs',
    nameAr: 'حجاب قطن',
    category: { _id: 'c2', nameAr: 'حجاب' },
    productsCount: 20,
  },
]

const mockCategories = [
  { _id: 'c1', nameAr: 'عباءات' },
  { _id: 'c2', nameAr: 'حجاب' },
  { _id: 'c3', nameAr: 'فساتين' },
]

export default function SubCategoriesManagement() {
  const [subCategories, setSubCategories] =
    useState<SubCategory[]>(mockSubCategories)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [editingSubCategory, setEditingSubCategory] =
    useState<SubCategory | null>(null)
  const [filterCategory, setFilterCategory] = useState('all')

  const filteredSubCategories = subCategories.filter(
    (sub) => filterCategory === 'all' || sub.category._id === filterCategory
  )

  const handleDelete = async (id: string) => {
    if (!confirm('هل أنت متأكد من حذف هذه الفئة الفرعية؟')) return

    try {
      // API call here
      setSubCategories(subCategories.filter((s) => s._id !== id))
    } catch (error) {
      console.error('Failed to delete subcategory:', error)
      alert('فشل حذف الفئة الفرعية')
    }
  }

  return (
    <div className='space-y-6'>
      {/* Header */}
      <div className='flex items-center justify-between'>
        <div className='flex items-center gap-4'>
          <Link href='/admin/categories'>
            <Button variant='ghost' size='icon'>
              <ArrowRight className='h-5 w-5' />
            </Button>
          </Link>
          <div>
            <h1 className='text-3xl font-bold mb-2'>إدارة الفئات الفرعية</h1>
            <p className='text-muted-foreground'>
              إجمالي الفئات الفرعية: {subCategories.length}
            </p>
          </div>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className='gold-gradient'>
              <Plus className='ml-2 h-4 w-4' />
              إضافة فئة فرعية
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>إضافة فئة فرعية جديدة</DialogTitle>
            </DialogHeader>
            <SubCategoryForm
              categories={mockCategories}
              onSuccess={(newSubCategory) => {
                setSubCategories([...subCategories, newSubCategory])
                setIsAddDialogOpen(false)
              }}
            />
          </DialogContent>
        </Dialog>
      </div>

      {/* Filter */}
      <Card>
        <CardContent className='pt-6'>
          <div className='flex items-center gap-4'>
            <Label>تصفية حسب الفئة:</Label>
            <Select value={filterCategory} onValueChange={setFilterCategory}>
              <SelectTrigger className='w-[200px]'>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='all'>جميع الفئات</SelectItem>
                {mockCategories.map((cat) => (
                  <SelectItem key={cat._id} value={cat._id}>
                    {cat.nameAr}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* SubCategories Table */}
      <Card>
        <CardContent className='p-0'>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>الاسم بالعربية</TableHead>
                <TableHead>الاسم بالإنجليزية</TableHead>
                <TableHead>الفئة الرئيسية</TableHead>
                <TableHead>عدد المنتجات</TableHead>
                <TableHead>الإجراءات</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredSubCategories.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className='text-center py-12'>
                    لا توجد فئات فرعية
                  </TableCell>
                </TableRow>
              ) : (
                filteredSubCategories.map((subCategory) => (
                  <TableRow key={subCategory._id}>
                    <TableCell className='font-medium'>
                      {subCategory.nameAr}
                    </TableCell>
                    <TableCell>{subCategory.name}</TableCell>
                    <TableCell>
                      <Badge variant='secondary'>
                        {subCategory.category.nameAr}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge>{subCategory.productsCount || 0}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className='flex items-center gap-2'>
                        <Button
                          variant='ghost'
                          size='icon'
                          onClick={() => {
                            setEditingSubCategory(subCategory)
                            setIsEditDialogOpen(true)
                          }}
                        >
                          <Edit className='h-4 w-4' />
                        </Button>
                        <Button
                          variant='ghost'
                          size='icon'
                          onClick={() => handleDelete(subCategory._id)}
                        >
                          <Trash2 className='h-4 w-4 text-destructive' />
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

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>تعديل الفئة الفرعية</DialogTitle>
          </DialogHeader>
          {editingSubCategory && (
            <SubCategoryForm
              subCategory={editingSubCategory}
              categories={mockCategories}
              onSuccess={(updated) => {
                setSubCategories(
                  subCategories.map((s) =>
                    s._id === updated._id ? updated : s
                  )
                )
                setIsEditDialogOpen(false)
                setEditingSubCategory(null)
              }}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

// SubCategory Form Component
function SubCategoryForm({
  subCategory,
  categories,
  onSuccess,
}: {
  subCategory?: SubCategory
  categories: Array<{ _id: string; nameAr: string }>
  onSuccess: (subCategory: SubCategory) => void
}) {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    nameAr: subCategory?.nameAr || '',
    name: subCategory?.name || '',
    category: subCategory?.category._id || '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // API call here
      const result: SubCategory = {
        _id: subCategory?._id || `sub-${Date.now()}`,
        nameAr: formData.nameAr,
        name: formData.name,
        category: {
          _id: formData.category,
          nameAr:
            categories.find((c) => c._id === formData.category)?.nameAr || '',
        },
        productsCount: subCategory?.productsCount || 0,
      }

      onSuccess(result)
    } catch (error) {
      console.error('Failed to save subcategory:', error)
      alert('فشل حفظ الفئة الفرعية')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className='space-y-4'>
      <div className='space-y-2'>
        <Label htmlFor='category'>الفئة الرئيسية *</Label>
        <Select
          value={formData.category}
          onValueChange={(value) =>
            setFormData({ ...formData, category: value })
          }
        >
          <SelectTrigger>
            <SelectValue placeholder='اختر الفئة الرئيسية' />
          </SelectTrigger>
          <SelectContent>
            {categories.map((cat) => (
              <SelectItem key={cat._id} value={cat._id}>
                {cat.nameAr}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className='space-y-2'>
        <Label htmlFor='nameAr'>الاسم بالعربية *</Label>
        <Input
          id='nameAr'
          required
          value={formData.nameAr}
          onChange={(e) => setFormData({ ...formData, nameAr: e.target.value })}
        />
      </div>

      <div className='space-y-2'>
        <Label htmlFor='name'>الاسم بالإنجليزية *</Label>
        <Input
          id='name'
          required
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        />
      </div>

      <Button type='submit' className='w-full gold-gradient' disabled={loading}>
        {loading ? 'جاري الحفظ...' : subCategory ? 'تحديث' : 'إضافة'}
      </Button>
    </form>
  )
}
