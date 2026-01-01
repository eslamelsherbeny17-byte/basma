'use client'

import { useState } from 'react'
import { Plus, Edit, Trash2, Tag } from 'lucide-react'
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
import { adminBrandsAPI } from '@/lib/admin-api'
import Image from 'next/image'

interface Brand {
  _id: string
  name: string
  nameAr: string
  image?: string
  productsCount?: number
}

// Mock brands data
const mockBrands: Brand[] = [
  {
    _id: '1',
    name: 'Elegant Modest',
    nameAr: 'إيليجانت موديست',
    image: '/images/brand-1.jpg',
    productsCount: 25,
  },
  {
    _id: '2',
    name: 'Modest Couture',
    nameAr: 'موديست كوتور',
    image: '/images/brand-2.jpg',
    productsCount: 18,
  },
  {
    _id: '3',
    name: 'Islamic Fashion',
    nameAr: 'الموضة الإسلامية',
    productsCount: 32,
  },
]

export default function BrandsManagement() {
  const [brands, setBrands] = useState<Brand[]>(mockBrands)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [editingBrand, setEditingBrand] = useState<Brand | null>(null)

  const handleDelete = async (id: string) => {
    if (!confirm('هل أنت متأكد من حذف هذه الماركة؟')) return

    try {
      await adminBrandsAPI.delete(id)
      setBrands(brands.filter((b) => b._id !== id))
    } catch (error) {
      console.error('Failed to delete brand:', error)
      alert('فشل حذف الماركة')
    }
  }

  return (
    <div className='space-y-6'>
      {/* Header */}
      <div className='flex items-center justify-between'>
        <div>
          <h1 className='text-3xl font-bold mb-2'>إدارة الماركات</h1>
          <p className='text-muted-foreground'>
            إجمالي الماركات: {brands.length}
          </p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className='gold-gradient'>
              <Plus className='ml-2 h-4 w-4' />
              إضافة ماركة جديدة
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>إضافة ماركة جديدة</DialogTitle>
            </DialogHeader>
            <BrandForm
              onSuccess={(newBrand) => {
                setBrands([...brands, newBrand])
                setIsAddDialogOpen(false)
              }}
            />
          </DialogContent>
        </Dialog>
      </div>

      {/* Brands Grid */}
      <div className='grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'>
        {brands.map((brand) => (
          <Card key={brand._id} className='overflow-hidden'>
            <div className='relative h-40 bg-secondary'>
              {brand.image ? (
                <Image
                  src={brand.image}
                  alt={brand.nameAr || brand.name}
                  fill
                  className='object-contain p-4'
                />
              ) : (
                <div className='flex items-center justify-center h-full'>
                  <Tag className='h-16 w-16 text-muted-foreground' />
                </div>
              )}
            </div>
            <CardContent className='p-4'>
              <h3 className='font-bold text-lg mb-1'>
                {brand.nameAr || brand.name}
              </h3>
              <p className='text-sm text-muted-foreground mb-3'>{brand.name}</p>
              <Badge variant='secondary'>{brand.productsCount || 0} منتج</Badge>
              <div className='flex gap-2 mt-4'>
                <Button
                  variant='outline'
                  size='sm'
                  className='flex-1'
                  onClick={() => {
                    setEditingBrand(brand)
                    setIsEditDialogOpen(true)
                  }}
                >
                  <Edit className='ml-2 h-3 w-3' />
                  تعديل
                </Button>
                <Button
                  variant='outline'
                  size='sm'
                  onClick={() => handleDelete(brand._id)}
                  className='text-destructive'
                >
                  <Trash2 className='h-3 w-3' />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>تعديل الماركة</DialogTitle>
          </DialogHeader>
          {editingBrand && (
            <BrandForm
              brand={editingBrand}
              onSuccess={(updatedBrand) => {
                setBrands(
                  brands.map((b) =>
                    b._id === updatedBrand._id ? updatedBrand : b
                  )
                )
                setIsEditDialogOpen(false)
                setEditingBrand(null)
              }}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

// Brand Form Component
function BrandForm({
  brand,
  onSuccess,
}: {
  brand?: Brand
  onSuccess: (brand: Brand) => void
}) {
  const [loading, setLoading] = useState(false)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState(brand?.image || '')
  const [formData, setFormData] = useState({
    nameAr: brand?.nameAr || '',
    name: brand?.name || '',
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

      let result
      if (brand) {
        result = await adminBrandsAPI.update(brand._id, formDataToSend)
      } else {
        result = await adminBrandsAPI.create(formDataToSend)
      }

      onSuccess(result.data)
    } catch (error) {
      console.error('Failed to save brand:', error)
      alert('فشل حفظ الماركة')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className='space-y-4'>
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

      <div className='space-y-2'>
        <Label htmlFor='image'>الشعار</Label>
        {imagePreview && (
          <div className='relative w-full h-32 rounded-lg overflow-hidden bg-secondary mb-2'>
            <Image
              src={imagePreview}
              alt='Preview'
              fill
              className='object-contain p-2'
            />
          </div>
        )}
        <Input
          id='image'
          type='file'
          accept='image/*'
          onChange={handleImageChange}
        />
      </div>

      <Button type='submit' className='w-full gold-gradient' disabled={loading}>
        {loading ? 'جاري الحفظ...' : brand ? 'تحديث' : 'إضافة'}
      </Button>
    </form>
  )
}
