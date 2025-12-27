'use client'

import { useState, useEffect } from 'react'
import { Plus, Edit, Trash2, FolderTree, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { adminCategoriesAPI } from '@/lib/admin-api'
import Image from 'next/image'
import { useToast } from '@/hooks/use-toast'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

export default function CategoriesManagement() {
  const { toast } = useToast()
  const [categories, setCategories] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [editingCategory, setEditingCategory] = useState<any>(null)

  useEffect(() => {
    fetchCategories()
  }, [])

  const fetchCategories = async () => {
    try {
      const response = await adminCategoriesAPI.getAll()
      setCategories(response.data || response)
    } catch (error) {
      console.error('Failed to fetch categories:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('هل أنت متأكد من حذف هذه الفئة؟')) return

    try {
      await adminCategoriesAPI.delete(id)
      toast({ title: '✅ تم الحذف', description: 'تم حذف الفئة بنجاح' })
      fetchCategories()
    } catch (error) {
      toast({ title: 'خطأ', description: 'فشل حذف الفئة', variant: 'destructive' })
    }
  }

  return (
    <div className='space-y-4 md:space-y-6'>
      {/* Header */}
      <div className='flex items-center justify-between'>
        <div>
          <h1 className='text-2xl md:text-3xl font-bold'>إدارة الفئات</h1>
          <p className='text-sm text-muted-foreground mt-1'>
            إجمالي الفئات: {categories.length}
          </p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className='bg-gradient-to-r from-primary to-primary/80'>
              <Plus className='ml-2 h-4 w-4' />
              إضافة فئة
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>إضافة فئة جديدة</DialogTitle>
            </DialogHeader>
            <CategoryForm
              onSuccess={() => {
                setIsAddDialogOpen(false)
                fetchCategories()
              }}
            />
          </DialogContent>
        </Dialog>
      </div>

      {/* Categories Grid */}
      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4'>
        {loading ? (
          <div className='col-span-full flex justify-center py-12'>
            <Loader2 className='h-8 w-8 animate-spin text-primary' />
          </div>
        ) : categories.length === 0 ? (
          <div className='col-span-full text-center py-12'>لا توجد فئات</div>
        ) : (
          categories.map((category) => (
            <Card key={category._id} className='overflow-hidden hover:shadow-lg transition-shadow'>
              <div className='relative h-40 bg-secondary'>
                {category.image ? (
                  <Image
                    src={category.image}
                    alt={category.nameAr || category.name}
                    fill
                    className='object-cover'
                  />
                ) : (
                  <div className='flex items-center justify-center h-full'>
                    <FolderTree className='h-16 w-16 text-muted-foreground' />
                  </div>
                )}
              </div>
              <CardContent className='p-4'>
                <h3 className='font-bold text-lg mb-1'>
                  {category.nameAr || category.name}
                </h3>
                <p className='text-sm text-muted-foreground mb-3'>{category.name}</p>
                <Badge variant='secondary'>{category.productsCount || 0} منتج</Badge>
                <div className='flex gap-2 mt-4'>
                  <Button
                    variant='outline'
                    size='sm'
                    className='flex-1'
                    onClick={() => {
                      setEditingCategory(category)
                      setIsEditDialogOpen(true)
                    }}
                  >
                    <Edit className='ml-2 h-3 w-3' />
                    تعديل
                  </Button>
                  <Button
                    variant='outline'
                    size='sm'
                    onClick={() => handleDelete(category._id)}
                    className='text-destructive hover:bg-destructive/10'
                  >
                    <Trash2 className='h-3 w-3' />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>تعديل الفئة</DialogTitle>
          </DialogHeader>
          {editingCategory && (
            <CategoryForm
              category={editingCategory}
              onSuccess={() => {
                setIsEditDialogOpen(false)
                setEditingCategory(null)
                fetchCategories()
              }}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

// Category Form Component
function CategoryForm({
  category,
  onSuccess,
}: {
  category?: any
  onSuccess: () => void
}) {
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState(category?.image || '')
  const [formData, setFormData] = useState({
    nameAr: category?.nameAr || '',
    name: category?.name || '',
  })

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setImageFile(file)
      setImagePreview(URL.createObjectURL(file))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const formDataToSend = new FormData()
      formDataToSend.append('nameAr', formData.nameAr)
      formDataToSend.append('name', formData.name)
      if (imageFile) {
        formDataToSend.append('image', imageFile)
      }

      if (category) {
        await adminCategoriesAPI.update(category._id, formDataToSend)
        toast({ title: '✅ تم التحديث', description: 'تم تحديث الفئة بنجاح' })
      } else {
        await adminCategoriesAPI.create(formDataToSend)
        toast({ title: '✅ تم الإضافة', description: 'تم إضافة الفئة بنجاح' })
      }

      onSuccess()
    } catch (error) {
      toast({ title: 'خطأ', description: 'فشل حفظ الفئة', variant: 'destructive' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className='space-y-4'>
      <Tabs defaultValue='ar'>
        <TabsList className='grid w-full grid-cols-2'>
          <TabsTrigger value='ar'>🇸🇦 عربي</TabsTrigger>
          <TabsTrigger value='en'>🇬🇧 English</TabsTrigger>
        </TabsList>

        <TabsContent value='ar' className='space-y-4 mt-4'>
          <div className='space-y-2'>
            <Label htmlFor='nameAr'>الاسم بالعربية *</Label>
            <Input
              id='nameAr'
              required
              value={formData.nameAr}
              onChange={(e) => setFormData({ ...formData, nameAr: e.target.value })}
              placeholder='عباءات'
            />
          </div>
        </TabsContent>

        <TabsContent value='en' className='space-y-4 mt-4'>
          <div className='space-y-2'>
            <Label htmlFor='name'>Name (English) *</Label>
            <Input
              id='name'
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder='Abayas'
              dir='ltr'
            />
          </div>
        </TabsContent>
      </Tabs>

      <div className='space-y-2'>
        <Label htmlFor='image'>الصورة</Label>
        {imagePreview && (
          <div className='relative w-full h-40 rounded-lg overflow-hidden bg-secondary mb-2'>
            <Image src={imagePreview} alt='Preview' fill className='object-cover' />
          </div>
        )}
        <Input
          id='image'
          type='file'
          accept='image/*'
          onChange={handleImageChange}
        />
      </div>

      <Button
        type='submit'
        className='w-full bg-gradient-to-r from-primary to-primary/80'
        disabled={loading}
      >
        {loading ? (
          <>
            <Loader2 className='ml-2 h-4 w-4 animate-spin' />
            جاري الحفظ...
          </>
        ) : category ? (
          'تحديث'
        ) : (
          'إضافة'
        )}
      </Button>
    </form>
  )
}