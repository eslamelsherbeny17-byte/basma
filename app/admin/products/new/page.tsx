'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowRight, Upload, X, Loader2, Save } from 'lucide-react'
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

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
  const [additionalImagePreviews, setAdditionalImagePreviews] = useState<string[]>([])

  // Variants State
  const [selectedColors, setSelectedColors] = useState<string[]>([])
  const [selectedSizes, setSelectedSizes] = useState<string[]>([])
  const [customColorHex, setCustomColorHex] = useState('#000000')

  const [formData, setFormData] = useState({
    titleAr: '',
    titleEn: '',
    descriptionAr: '',
    descriptionEn: '',
    price: '',
    discount: '',
    quantity: '',
    category: '',
    subcategory: '',
    brand: '',
  })

  useEffect(() => {
    fetchCategories()
    fetchBrands()
  }, [])

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
      setCategories(response.data || response)
    } catch (error) {
      console.error('Failed to fetch categories:', error)
    }
  }

  const fetchSubCategories = async (categoryId: string) => {
    try {
      const response = await adminSubCategoriesAPI.getByCategoryId(categoryId)
      setSubCategories(response.data || response)
    } catch (error) {
      console.error('Failed to fetch subcategories:', error)
      setSubCategories([])
    }
  }

  const fetchBrands = async () => {
    try {
      const response = await adminBrandsAPI.getAll()
      setBrands(response.data || response)
    } catch (error) {
      console.error('Failed to fetch brands:', error)
    }
  }

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

  const handleAdditionalImagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (additionalImages.length + files.length > 5) {
      toast({
        title: 'تنبيه',
        description: 'الحد الأقصى 5 صور إضافية',
        variant: 'destructive',
      })
      return
    }
    setAdditionalImages([...additionalImages, ...files])
    const previews = files.map((file) => URL.createObjectURL(file))
    setAdditionalImagePreviews([...additionalImagePreviews, ...previews])
  }

  const removeAdditionalImage = (index: number) => {
    setAdditionalImages(additionalImages.filter((_, i) => i !== index))
    setAdditionalImagePreviews(additionalImagePreviews.filter((_, i) => i !== index))
  }

  const handleToggle = (type: 'colors' | 'sizes', value: string) => {
    if (type === 'colors') {
      setSelectedColors((prev) =>
        prev.includes(value) ? prev.filter((c) => c !== value) : [...prev, value]
      )
    } else {
      setSelectedSizes((prev) =>
        prev.includes(value) ? prev.filter((s) => s !== value) : [...prev, value]
      )
    }
  }

  const handleAddCustomColor = () => {
    if (customColorHex && !selectedColors.includes(customColorHex)) {
      setSelectedColors([...selectedColors, customColorHex])
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validation - العربي فقط إلزامي
    if (!coverImage) {
      toast({
        title: 'خطأ',
        description: 'يجب إضافة صورة رئيسية للمنتج',
        variant: 'destructive',
      })
      return
    }

    if (
      !formData.titleAr ||
      !formData.descriptionAr ||
      !formData.price ||
      !formData.quantity ||
      !formData.category
    ) {
      toast({
        title: 'خطأ',
        description: 'يرجى ملء جميع الحقول المطلوبة بالعربية',
        variant: 'destructive',
      })
      return
    }

    setLoading(true)

    try {
      const formDataToSend = new FormData()

      // ⭐ إذا لم يتم إدخال الإنجليزي، استخدم العربي
      const finalTitleEn = formData.titleEn.trim() || formData.titleAr
      const finalDescriptionEn = formData.descriptionEn.trim() || formData.descriptionAr

      // إرسال البيانات للباك إند
      formDataToSend.append('title', finalTitleEn)
      formDataToSend.append('description', finalDescriptionEn)
      
      // حفظ العربي كـ metadata إضافية (إذا كان الباك إند يدعم ذلك)
      formDataToSend.append('titleAr', formData.titleAr)
      formDataToSend.append('descriptionAr', formData.descriptionAr)

      formDataToSend.append('price', formData.price)

      const discountNum = parseFloat(formData.discount) || 0
      if (discountNum > 0) {
        const priceNum = parseFloat(formData.price)
        const finalPrice = priceNum - (priceNum * discountNum) / 100
        formDataToSend.append('priceAfterDiscount', finalPrice.toString())
      }

      formDataToSend.append('quantity', formData.quantity)
      formDataToSend.append('category', formData.category)

      if (formData.subcategory) {
        formDataToSend.append('subcategories', formData.subcategory)
      }

      if (formData.brand) {
        formDataToSend.append('brand', formData.brand)
      }

      formDataToSend.append('imageCover', coverImage)

      additionalImages.forEach((image) => {
        formDataToSend.append('images', image)
      })

      if (selectedColors.length > 0) {
        selectedColors.forEach((color) => {
          formDataToSend.append('colors[]', color)
        })
      }

      if (selectedSizes.length > 0) {
        selectedSizes.forEach((size) => {
          formDataToSend.append('sizes[]', size)
        })
      }

      const response = await adminProductsAPI.create(formDataToSend)

      toast({
        title: '✅ تم بنجاح',
        description: 'تم إضافة المنتج بنجاح',
      })

      router.push('/admin/products')
    } catch (error: any) {
      console.error('Error:', error)
      toast({
        title: 'خطأ',
        description: error.response?.data?.message || 'فشل إضافة المنتج',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='space-y-4 md:space-y-6 max-w-7xl mx-auto'>
      {/* Header */}
      <div className='flex items-center gap-4'>
        <Link href='/admin/products'>
          <Button variant='ghost' size='icon' className='h-9 w-9'>
            <ArrowRight className='h-5 w-5' />
          </Button>
        </Link>
        <div>
          <h1 className='text-2xl md:text-3xl font-bold'>إضافة منتج جديد</h1>
          <p className='text-sm text-muted-foreground mt-1'>
            أضف منتج جديد إلى المتجر
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className='space-y-6'>
        <div className='grid lg:grid-cols-3 gap-4 md:gap-6'>
          {/* Main Column (2/3) */}
          <div className='lg:col-span-2 space-y-4 md:space-y-6'>
            {/* Basic Information - Bilingual */}
            <Card>
              <CardHeader>
                <CardTitle>المعلومات الأساسية</CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue='ar' className='w-full'>
                  <TabsList className='grid w-full grid-cols-2'>
                    <TabsTrigger value='ar'>🇸🇦 عربي (إلزامي)</TabsTrigger>
                    <TabsTrigger value='en'>🇬🇧 English (اختياري)</TabsTrigger>
                  </TabsList>

                  {/* Arabic Tab - REQUIRED */}
                  <TabsContent value='ar' className='space-y-4 mt-4'>
                    <div className='space-y-2'>
                      <Label htmlFor='titleAr'>
                        اسم المنتج بالعربية <span className='text-red-500'>*</span>
                      </Label>
                      <Input
                        id='titleAr'
                        name='titleAr'
                        required
                        value={formData.titleAr}
                        onChange={handleInputChange}
                        placeholder='عباية سوداء فاخرة'
                        className='text-right'
                      />
                    </div>

                    <div className='space-y-2'>
                      <Label htmlFor='descriptionAr'>
                        الوصف بالعربية <span className='text-red-500'>*</span>
                      </Label>
                      <Textarea
                        id='descriptionAr'
                        name='descriptionAr'
                        required
                        rows={5}
                        value={formData.descriptionAr}
                        onChange={handleInputChange}
                        placeholder='وصف تفصيلي للمنتج بالعربية...'
                        className='text-right'
                      />
                    </div>
                  </TabsContent>

                  {/* English Tab - OPTIONAL */}
                  <TabsContent value='en' className='space-y-4 mt-4'>
                    <div className='bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3 mb-4'>
                      <p className='text-sm text-blue-700 dark:text-blue-300'>
                        💡 <strong>اختياري:</strong> إذا تركت الحقول فارغة، سيتم استخدام النص العربي تلقائياً
                      </p>
                    </div>

                    <div className='space-y-2'>
                      <Label htmlFor='titleEn'>
                        Product Name (English)
                      </Label>
                      <Input
                        id='titleEn'
                        name='titleEn'
                        value={formData.titleEn}
                        onChange={handleInputChange}
                        placeholder='Luxury Black Abaya (Optional)'
                        dir='ltr'
                      />
                    </div>

                    <div className='space-y-2'>
                      <Label htmlFor='descriptionEn'>
                        Description (English)
                      </Label>
                      <Textarea
                        id='descriptionEn'
                        name='descriptionEn'
                        rows={5}
                        value={formData.descriptionEn}
                        onChange={handleInputChange}
                        placeholder='Product description in English (Optional)...'
                        dir='ltr'
                      />
                    </div>
                  </TabsContent>
                </Tabs>
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
                    <div className='relative w-full h-48 md:h-64 rounded-lg overflow-hidden bg-secondary'>
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
                    <label className='flex flex-col items-center justify-center w-full h-48 md:h-64 border-2 border-dashed rounded-lg cursor-pointer hover:bg-secondary/50 transition-colors'>
                      <Upload className='h-10 w-10 md:h-12 md:w-12 text-muted-foreground mb-2' />
                      <p className='text-sm text-muted-foreground'>اضغط لرفع الصورة</p>
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
                  <div className='grid grid-cols-2 sm:grid-cols-3 gap-3 md:gap-4'>
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
                          className='absolute top-1 left-1 h-7 w-7'
                          onClick={() => removeAdditionalImage(index)}
                        >
                          <X className='h-3 w-3' />
                        </Button>
                      </div>
                    ))}
                    {additionalImages.length < 5 && (
                      <label className='flex flex-col items-center justify-center aspect-square border-2 border-dashed rounded-lg cursor-pointer hover:bg-secondary/50 transition-colors'>
                        <Upload className='h-6 w-6 md:h-8 md:w-8 text-muted-foreground mb-1' />
                        <p className='text-xs text-muted-foreground text-center px-2'>
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
          <div className='lg:col-span-1 space-y-4 md:space-y-6'>
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

            {/* Action Buttons */}
            <div className='space-y-3'>
              <Button
                type='submit'
                className='w-full bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70'
                size='lg'
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className='ml-2 h-4 w-4 animate-spin' />
                    جاري الإضافة...
                  </>
                ) : (
                  <>
                    <Save className='ml-2 h-4 w-4' />
                    إضافة المنتج
                  </>
                )}
              </Button>

              <Link href='/admin/products' className='block'>
                <Button
                  type='button'
                  variant='outline'
                  size='lg'
                  className='w-full'
                  disabled={loading}
                >
                  إلغاء
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}