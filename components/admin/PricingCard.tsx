import { ShoppingBag, DollarSign } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface Props {
  price: string
  discount: string
  quantity: string
  finalPrice: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
}

export default function PricingCard({
  price,
  discount,
  quantity,
  finalPrice,
  onChange,
}: Props) {
  return (
    <Card className='border-gray-200 shadow-xl bg-white rounded-2xl'>
      <CardHeader className='pb-3 pt-4 px-6 border-b border-gray-100'>
        <CardTitle className='text-xl font-bold flex items-center gap-3 text-gray-900'>
          <ShoppingBag className='h-5 w-5 text-gray-600' /> السعر والمخزون
        </CardTitle>
      </CardHeader>
      <CardContent className='space-y-5 px-6 pb-6 pt-4'>
        <div className='grid grid-cols-2 gap-4'>
          <div className='space-y-2'>
            <Label
              htmlFor='price'
              className='text-sm font-semibold text-gray-700'
            >
              السعر <span className='text-red-500'>*</span>
            </Label>
            <Input
              type='text'
              inputMode='decimal'
              autoComplete='off'
              id='price'
              name='price'
              value={price}
              onChange={onChange}
              placeholder='0.00'
              className='h-10 text-base border-gray-300 rounded-lg font-sans'
              style={{ direction: 'ltr', textAlign: 'left' }}
            />
          </div>
          <div className='space-y-2'>
            <Label
              htmlFor='discount'
              className='text-sm font-semibold text-gray-700'
            >
              نسبة الخصم (%)
            </Label>
            <Input
              type='text'
              inputMode='decimal'
              autoComplete='off'
              id='discount'
              name='discount'
              value={discount}
              onChange={onChange}
              placeholder='0'
              className='h-10 text-base border-gray-300 rounded-lg font-sans'
              style={{ direction: 'ltr', textAlign: 'left' }}
            />
          </div>
        </div>
        <div className='space-y-2'>
          <Label className='text-sm font-semibold text-gray-700'>
            السعر النهائي
          </Label>
          <div
            className='h-11 flex items-center justify-between px-4 border border-gray-300 bg-gray-100 rounded-xl'
            dir='ltr'
          >
            <p className='text-lg font-extrabold text-green-700 font-sans'>
              {finalPrice} جنيه
            </p>
            <DollarSign className='h-5 w-5 text-green-700' />
          </div>
        </div>
        <div className='space-y-2'>
          <Label
            htmlFor='quantity'
            className='text-sm font-semibold text-gray-700'
          >
            الكمية المتاحة <span className='text-red-500'>*</span>
          </Label>
          <Input
            type='text'
            inputMode='numeric'
            autoComplete='off'
            id='quantity'
            name='quantity'
            value={quantity}
            onChange={onChange}
            placeholder='0'
            className='h-10 text-base border-gray-300 rounded-lg font-sans'
            style={{ direction: 'ltr', textAlign: 'left' }}
          />
        </div>
      </CardContent>
    </Card>
  )
}
