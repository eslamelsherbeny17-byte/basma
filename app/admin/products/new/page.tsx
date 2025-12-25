'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowRight, Upload, X, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  adminProductsAPI,
  adminCategoriesAPI,
  adminBrandsAPI,
  adminSubCategoriesAPI,
} from '@/lib/admin-api'
import Link from 'next/link'
import Image from 'next/image'
import VariantsCard from '@/components/admin/VariantsCard'
import PricingCard from '@/components/admin/PricingCard'
import { useToast } from '@/hooks/use-toast'

export default function NewProductPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [categories, setCategories] = useState<any[]>([])
  const [subCategories, setSubCategories] = useState<any[]>([])
  const [brands, setBrands] = useState<any[]>([])

  const [coverImage, setCoverImage] = useState<File | null>(null)
  const [coverImagePreview, setCoverImagePreview] = useState<string>('')
  const [additionalImages, setAdditionalImages] = useState<File[]>([])
  const [additionalImagePreviews, setAdditionalImagePreviews] = useState<
    string[]
  >([])

  // Variants State
  const [selectedColors, setSelectedColors] = useState<string[]>([])
  const [selectedSizes, setSelectedSizes] = useState<string[]>([])
  const [customColorHex, setCustomColorHex] = useState('#000000')

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    discount: '',
    quantity: '',
    category: '',
    subcategory: '',
    brand: '',
  })

  // Fetch Categories and Brands
  useEffect(() => {
    fetchCategories()
    fetchBrands()
  }, [])

  // Fetch SubCategories when category changes
  useEffect(() => {
    if (formData.category) {
      fetchSubCategories(formData.category)
    } else {
      setSubCategories([])
      setFormData((prev) => ({ ...prev, subcategory: '' }))
    }
  }, [formData.category])

  const fetchCategories = async () => {
    try {
      const response = await adminCategoriesAPI.getAll()
      console.log('Categories Response:', response)
      setCategories(response.data || response)
    } catch (error) {
      console.error('Failed to fetch categories:', error)
      toast({
        title: 'خطأ',
        description: 'فشل تحميل التصنيفات',
        variant: 'destructive',
      })
    }
  }

  const fetchSubCategories = async (categoryId: string) => {
    try {
      const response = await adminSubCategoriesAPI.getByCategoryId(categoryId)
      console.log('SubCategories Response:', response)
      setSubCategories(response.data || response)
    } catch (error) {
      console.error('Failed to fetch subcategories:', error)
      setSubCategories([])
    }
  }

  const fetchBrands = async () => {
    try {
      const response = await adminBrandsAPI.getAll()
      console.log('Brands Response:', response)
      setBrands(response.data || response)
    } catch (error) {
      console.error('Failed to fetch brands:', error)
      toast({
        title: 'خطأ',
        description: 'فشل تحميل العلامات التجارية',
        variant: 'destructive',
      })
    }
  }

  // Calculate Final Price
  const calculateFinalPrice = () => {
    const priceNum = parseFloat(formData.price) || 0
    const discountNum = parseFloat(formData.discount) || 0
    if (discountNum > 0) {
      return (priceNum - (priceNum * discountNum) / 100).toFixed(2)
    }
    return priceNum.toFixed(2)
  }

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleCoverImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setCoverImage(file)
      setCoverImagePreview(URL.createObjectURL(file))
    }
  }

  const handleAdditionalImagesChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = Array.from(e.target.files || [])
    setAdditionalImages([...additionalImages, ...files])
    const previews = files.map((file) => URL.createObjectURL(file))
    setAdditionalImagePreviews([...additionalImagePreviews, ...previews])
  }

  const removeAdditionalImage = (index: number) => {
    setAdditionalImages(additionalImages.filter((_, i) => i !== index))
    setAdditionalImagePreviews(
      additionalImagePreviews.filter((_, i) => i !== index)
    )
  }

  // Toggle Color/Size
  const handleToggle = (type: 'colors' | 'sizes', value: string) => {
    if (type === 'colors') {
      setSelectedColors((prev) =>
        prev.includes(value)
          ? prev.filter((c) => c !== value)
          : [...prev, value]
      )
    } else {
      setSelectedSizes((prev) =>
        prev.includes(value)
          ? prev.filter((s) => s !== value)
          : [...prev, value]
      )
    }
  }

  // Add Custom Color
  const handleAddCustomColor = () => {
    if (customColorHex && !selectedColors.includes(customColorHex)) {
      setSelectedColors([...selectedColors, customColorHex])
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validation
    if (!coverImage) {
      toast({
        title: 'خطأ',
        description: 'يجب إضافة صورة رئيسية للمنتج',
        variant: 'destructive',
      })
      return
    }

    if (
      !formData.title ||
      !formData.description ||
      !formData.price ||
      !formData.quantity ||
      !formData.category
    ) {
      toast({
        title: 'خطأ',
        description: 'يرجى ملء جميع الحقول المطلوبة',
        variant: 'destructive',
      })
      return
    }

    setLoading(true)

    try {
      const formDataToSend = new FormData()

      // Add text fields (matching backend schema)
      formDataToSend.append('title', formData.title)
      formDataToSend.append('description', formData.description)
      formDataToSend.append('price', formData.price)

      // Calculate and add price after discount
      const discountNum = parseFloat(formData.discount) || 0
      if (discountNum > 0) {
        const priceNum = parseFloat(formData.price)
        const finalPrice = priceNum - (priceNum * discountNum) / 100
        formDataToSend.append('priceAfterDiscount', finalPrice.toString())
      }

      formDataToSend.append('quantity', formData.quantity)
      formDataToSend.append('category', formData.category)

      if (formData.subcategory) {
        // Some APIs expect array, some expect single value
        // Try to check backend to see which format
        formDataToSend.append('subcategories', formData.subcategory)
      }

      if (formData.brand) {
        formDataToSend.append('brand', formData.brand)
      }

      // Add cover image (check backend field name: imageCover or image)
      formDataToSend.append('imageCover', coverImage)

      // Add additional images
      additionalImages.forEach((image) => {
        formDataToSend.append('images', image)
      })

      // Add colors (check if backend expects JSON or array)
      if (selectedColors.length > 0) {
        selectedColors.forEach((color) => {
          formDataToSend.append('colors[]', color)
        })
      }

      // Add sizes
      if (selectedSizes.length > 0) {
        selectedSizes.forEach((size) => {
          formDataToSend.append('sizes[]', size)
        })
      }

      console.log('📤 Submitting FormData...')

      const response = await adminProductsAPI.create(formDataToSend)

      console.log('✅ Response:', response)

      toast({
        title: 'تم بنجاح',
        description: 'تم إضافة المنتج بنجاح',
      })

      router.push('/admin/products')
    } catch (error: any) {
      console.error('❌ Error:', error)
      console.error('Response:', error.response?.data)

      toast({
        title: 'خطأ',
        description:
          error.response?.data?.message ||
          error.response?.data?.errors?.[0]?.msg ||
          'فشل إضافة المنتج',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='space-y-6 max-w-6xl'>
      {/* Header */}
      <div className='flex items-center gap-4'>
        <Link href='/admin/products'>
          <Button variant='ghost' size='icon'>
            <ArrowRight className='h-5 w-5' />
          </Button>
        </Link>
        <div>
          <h1 className='text-3xl font-bold'>إضافة منتج جديد</h1>
          <p className='text-muted-foreground'>أضف منتج جديد إلى المتجر</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className='space-y-6'>
        <div className='grid lg:grid-cols-3 gap-6'>
          {/* Main Column (2/3) */}
          <div className='lg:col-span-2 space-y-6'>
            {/* Basic Information */}
            <Card>
              <CardHeader>
                <CardTitle>المعلومات الأساسية</CardTitle>
              </CardHeader>
              <CardContent className='space-y-4'>
                <div className='space-y-2'>
                  <Label htmlFor='title'>
                    اسم المنتج <span className='text-red-500'>*</span>
                  </Label>
                  <Input
                    id='title'
                    name='title'
                    required
                    value={formData.title}
                    onChange={handleInputChange}
                    placeholder='عباية سوداء فاخرة'
                  />
                </div>

                <div className='space-y-2'>
                  <Label htmlFor='description'>
                    الوصف <span className='text-red-500'>*</span>
                  </Label>
                  <Textarea
                    id='description'
                    name='description'
                    required
                    rows={5}
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder='وصف تفصيلي للمنتج...'
                  />
                </div>
              </CardContent>
            </Card>

            {/* Variants Card */}
            <VariantsCard
              colors={selectedColors}
              sizes={selectedSizes}
              onToggle={handleToggle}
              customColorHex={customColorHex}
              setCustomColorHex={setCustomColorHex}
              onAddCustomColor={handleAddCustomColor}
            />

            {/* Images */}
            <Card>
              <CardHeader>
                <CardTitle>صور المنتج</CardTitle>
              </CardHeader>
              <CardContent className='space-y-4'>
                {/* Cover Image */}
                <div className='space-y-2'>
                  <Label>
                    الصورة الرئيسية <span className='text-red-500'>*</span>
                  </Label>
                  {coverImagePreview ? (
                    <div className='relative w-full h-64 rounded-lg overflow-hidden bg-secondary'>
                      <Image
                        src={coverImagePreview}
                        alt='Cover'
                        fill
                        className='object-cover'
                      />
                      <Button
                        type='button'
                        variant='destructive'
                        size='icon'
                        className='absolute top-2 left-2'
                        onClick={() => {
                          setCoverImage(null)
                          setCoverImagePreview('')
                        }}
                      >
                        <X className='h-4 w-4' />
                      </Button>
                    </div>
                  ) : (
                    <label className='flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg cursor-pointer hover:bg-secondary transition-colors'>
                      <Upload className='h-12 w-12 text-muted-foreground mb-2' />
                      <p className='text-sm text-muted-foreground'>
                        اضغط لرفع الصورة
                      </p>
                      <input
                        type='file'
                        className='hidden'
                        accept='image/*'
                        onChange={handleCoverImageChange}
                      />
                    </label>
                  )}
                </div>

                {/* Additional Images */}
                <div className='space-y-2'>
                  <Label>صور إضافية (حتى 5 صور)</Label>
                  <div className='grid grid-cols-3 gap-4'>
                    {additionalImagePreviews.map((preview, index) => (
                      <div
                        key={index}
                        className='relative aspect-square rounded-lg overflow-hidden bg-secondary'
                      >
                        <Image
                          src={preview}
                          alt={`Additional ${index + 1}`}
                          fill
                          className='object-cover'
                        />
                        <Button
                          type='button'
                          variant='destructive'
                          size='icon'
                          className='absolute top-1 left-1 h-6 w-6'
                          onClick={() => removeAdditionalImage(index)}
                        >
                          <X className='h-3 w-3' />
                        </Button>
                      </div>
                    ))}
                    {additionalImages.length < 5 && (
                      <label className='flex flex-col items-center justify-center aspect-square border-2 border-dashed rounded-lg cursor-pointer hover:bg-secondary transition-colors'>
                        <Upload className='h-8 w-8 text-muted-foreground mb-1' />
                        <p className='text-xs text-muted-foreground'>
                          إضافة صورة
                        </p>
                        <input
                          type='file'
                          className='hidden'
                          accept='image/*'
                          multiple
                          onChange={handleAdditionalImagesChange}
                        />
                      </label>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar Column (1/3) */}
          <div className='lg:col-span-1 space-y-6'>
            {/* Pricing Card */}
            <PricingCard
              price={formData.price}
              discount={formData.discount}
              quantity={formData.quantity}
              finalPrice={calculateFinalPrice()}
              onChange={handleInputChange}
            />

            {/* Category & Brand */}
            <Card>
              <CardHeader>
                <CardTitle>التصنيف والعلامة التجارية</CardTitle>
              </CardHeader>
              <CardContent className='space-y-4'>
                <div className='space-y-2'>
                  <Label htmlFor='category'>
                    الفئة <span className='text-red-500'>*</span>
                  </Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) =>
                      setFormData({ ...formData, category: value })
                    }
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder='اختر الفئة' />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat._id} value={cat._id}>
                          {cat.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* SubCategory */}
                {subCategories.length > 0 && (
                  <div className='space-y-2'>
                    <Label htmlFor='subcategory'>الفئة الفرعية</Label>
                    <Select
                      value={formData.subcategory}
                      onValueChange={(value) =>
                        setFormData({ ...formData, subcategory: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder='اختر الفئة الفرعية' />
                      </SelectTrigger>
                      <SelectContent>
                        {subCategories.map((sub) => (
                          <SelectItem key={sub._id} value={sub._id}>
                            {sub.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                <div className='space-y-2'>
                  <Label htmlFor='brand'>الماركة</Label>
                  <Select
                    value={formData.brand}
                    onValueChange={(value) =>
                      setFormData({ ...formData, brand: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder='اختر الماركة' />
                    </SelectTrigger>
                    <SelectContent>
                      {brands.map((brand) => (
                        <SelectItem key={brand._id} value={brand._id}>
                          {brand.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Submit Button */}
            <Button
              type='submit'
              className='w-full gold-gradient'
              size='lg'
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className='ml-2 h-4 w-4 animate-spin' />
                  جاري الإضافة...
                </>
              ) : (
                'إضافة المنتج'
              )}
            </Button>

            <Link href='/admin/products'>
              <Button
                type='button'
                variant='outline'
                size='lg'
                className='w-full'
              >
                إلغاء
              </Button>
            </Link>
          </div>
        </div>
      </form>
    </div>
  )
}
