import { Palette, Check, Plus, Ruler, X } from 'lucide-react'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

const PREDEFINED_COLORS = [
  { name: 'أسود', hex: '#000000' },
  { name: 'أبيض', hex: '#FFFFFF' },
  { name: 'أحمر', hex: '#EF4444' },
  { name: 'أزرق', hex: '#3B82F6' },
  { name: 'أخضر', hex: '#22C55E' },
  { name: 'أصفر', hex: '#EAB308' },
  { name: 'رمادي', hex: '#6B7280' },
  { name: 'بيج', hex: '#F5F5DC' },
  { name: 'كحلي', hex: '#1E3A8A' },
  { name: 'ذهبي', hex: '#FFD700' },
  { name: 'بني', hex: '#8B4513' },
  { name: 'وردي', hex: '#EC4899' },
]

const PREDEFINED_SIZES = [
  'XS',
  'S',
  'M',
  'L',
  'XL',
  '2XL',
  '3XL',
  '40',
  '41',
  '42',
  '43',
  '44',
  '45',
]

interface Props {
  colors: string[]
  sizes: string[]
  onToggle: (type: 'colors' | 'sizes', value: string) => void
  customColorHex: string
  setCustomColorHex: (val: string) => void
  onAddCustomColor: () => void
}

export default function VariantsCard({
  colors,
  sizes,
  onToggle,
  customColorHex,
  setCustomColorHex,
  onAddCustomColor,
}: Props) {
  return (
    <Card className='border-gray-200 shadow-xl bg-white rounded-2xl'>
      <CardHeader className='pb-3 pt-4 px-6 border-b border-gray-100'>
        <CardTitle className='text-xl font-bold flex items-center gap-3 text-gray-900'>
          <Palette className='h-5 w-5 text-gray-600' /> المتغيرات (الألوان
          والمقاسات)
        </CardTitle>
      </CardHeader>
      <CardContent className='space-y-6 px-6 pb-6 pt-4'>
        {/* Colors */}
        <div className='space-y-3'>
          <div className='flex items-center justify-between'>
            <Label className='text-sm font-semibold text-gray-700'>
              الألوان المتاحة
            </Label>
          </div>
          <div className='flex flex-wrap gap-2'>
            {PREDEFINED_COLORS.map((c) => {
              const isSelected = colors.includes(c.name)
              return (
                <div
                  key={c.name}
                  onClick={() => onToggle('colors', c.name)}
                  className={`cursor-pointer rounded-full p-0.5 border-2 transition-all ${
                    isSelected
                      ? 'border-black scale-110'
                      : 'border-transparent hover:scale-105'
                  }`}
                  title={c.name}
                >
                  <div
                    className='w-8 h-8 rounded-full border border-gray-200 shadow-sm flex items-center justify-center'
                    style={{ backgroundColor: c.hex }}
                  >
                    {isSelected && (
                      <Check
                        className={`h-4 w-4 ${
                          ['أبيض', 'بيج', 'أصفر'].includes(c.name)
                            ? 'text-black'
                            : 'text-white'
                        }`}
                      />
                    )}
                  </div>
                </div>
              )
            })}
            {/* Custom Color Picker */}
            <div className='relative group'>
              <div className='w-9 h-9 rounded-full border-2 border-dashed border-gray-300 flex items-center justify-center cursor-pointer hover:border-gray-400 hover:bg-gray-50 transition-colors'>
                <Plus className='h-4 w-4 text-gray-500' />
              </div>
              <input
                type='color'
                className='absolute inset-0 w-full h-full opacity-0 cursor-pointer'
                value={customColorHex}
                onChange={(e) => setCustomColorHex(e.target.value)}
                onBlur={onAddCustomColor}
                title='اختر لون مخصص'
              />
            </div>
          </div>
          {/* Selected Colors */}
          {colors.length > 0 && (
            <div className='flex flex-wrap gap-2 mt-3 p-3 bg-gray-50 rounded-lg border border-gray-100 min-h-[50px]'>
              {colors.map((color) => {
                const predefinedColor = PREDEFINED_COLORS.find(
                  (c) => c.name === color
                )
                const colorHex = predefinedColor?.hex || color

                return (
                  <Badge
                    key={color}
                    variant='outline'
                    className='pl-2 pr-1 py-1 h-7 flex items-center gap-2 bg-white border-gray-300 shadow-sm'
                  >
                    <span
                      className='w-3 h-3 rounded-full border border-gray-200'
                      style={{ backgroundColor: colorHex }}
                    ></span>
                    <span className='text-xs font-medium'>{color}</span>
                    <button
                      type='button'
                      onClick={() => onToggle('colors', color)}
                      className='ml-1 text-gray-400 hover:text-red-500 transition-colors'
                    >
                      <X className='h-3 w-3' />
                    </button>
                  </Badge>
                )
              })}
            </div>
          )}
        </div>

        <div className='h-px bg-gray-100 my-2'></div>

        {/* Sizes */}
        <div className='space-y-3'>
          <div className='flex items-center gap-2'>
            <Ruler className='h-4 w-4 text-gray-500' />
            <Label className='text-sm font-semibold text-gray-700'>
              المقاسات
            </Label>
          </div>
          <div className='flex flex-wrap gap-2'>
            {PREDEFINED_SIZES.map((size) => {
              const isSelected = sizes.includes(size)
              return (
                <div
                  key={size}
                  onClick={() => onToggle('sizes', size)}
                  className={`cursor-pointer px-3 py-1.5 rounded-lg border text-sm font-medium transition-all select-none ${
                    isSelected
                      ? 'bg-black text-white border-black shadow-md'
                      : 'bg-white text-gray-700 border-gray-200 hover:border-gray-400 hover:bg-gray-50'
                  }`}
                >
                  {size}
                </div>
              )
            })}
          </div>
          {/* Selected Sizes */}
          {sizes.length > 0 && (
            <div className='flex flex-wrap gap-2 mt-3 p-3 bg-gray-50 rounded-lg border border-gray-100'>
              {sizes.map((size) => (
                <Badge
                  key={size}
                  variant='outline'
                  className='pl-2 pr-1 py-1 h-7 flex items-center gap-2 bg-white border-gray-300 shadow-sm'
                >
                  <span className='text-xs font-medium'>{size}</span>
                  <button
                    type='button'
                    onClick={() => onToggle('sizes', size)}
                    className='ml-1 text-gray-400 hover:text-red-500 transition-colors'
                  >
                    <X className='h-3 w-3' />
                  </button>
                </Badge>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
