'use client'

import { Palette, Check, Plus, Ruler, X } from 'lucide-react'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { PREDEFINED_COLORS, PREDEFINED_SIZES, getColorHex } from '@/lib/constants'

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
    <Card className='border-border shadow-xl bg-card rounded-2xl transition-colors duration-300'>
      <CardHeader className='pb-3 pt-4 px-6 border-b border-border/50'>
        <CardTitle className='text-xl font-bold flex items-center gap-3 text-foreground'>
          <Palette className='h-5 w-5 text-primary' /> المتغيرات (الألوان والمقاسات)
        </CardTitle>
      </CardHeader>
      
      <CardContent className='space-y-6 px-6 pb-6 pt-4'>
        {/* Colors */}
        <div className='space-y-3'>
          <Label className='text-sm font-bold text-foreground'>الألوان المتاحة</Label>
          <div className='flex flex-wrap gap-3'>
            {PREDEFINED_COLORS.map((c) => {
              const isSelected = colors.includes(c.name)
              return (
                <div
                  key={c.name}
                  onClick={() => onToggle('colors', c.name)}
                  className={cn(
                    "cursor-pointer rounded-full p-0.5 border-2 transition-all hover:scale-110",
                    isSelected ? "border-primary shadow-md" : "border-transparent"
                  )}
                  title={c.name}
                >
                  <div
                    className='w-9 h-9 rounded-full border border-border/50 shadow-inner flex items-center justify-center relative'
                    style={{ backgroundColor: c.hex }}
                  >
                    {isSelected && (
                      <Check
                        className={cn(
                          "h-5 w-5 drop-shadow-md",
                          ['أبيض', 'بيج', 'أصفر'].includes(c.name) ? 'text-black' : 'text-white'
                        )}
                      />
                    )}
                  </div>
                </div>
              )
            })}

            {/* Custom Color Picker */}
            <div className='relative group'>
              <div className='w-10 h-10 rounded-full border-2 border-dashed border-border flex items-center justify-center cursor-pointer hover:border-primary hover:bg-muted transition-all'>
                <Plus className='h-5 w-5 text-muted-foreground group-hover:text-primary' />
              </div>
              <input
                type='color'
                className='absolute inset-0 w-full h-full opacity-0 cursor-pointer'
                value={customColorHex}
                onChange={(e) => setCustomColorHex(e.target.value)}
                onBlur={onAddCustomColor}
              />
            </div>
          </div>

          {/* Selected Colors Badges */}
          {colors.length > 0 && (
            <div className='flex flex-wrap gap-2 mt-4 p-4 bg-muted/30 rounded-2xl border border-border/50 min-h-[60px]'>
              {colors.map((color) => {
                const colorHex = getColorHex(color)
                return (
                  <Badge
                    key={color}
                    variant='outline'
                    className='pl-2 pr-1 py-1.5 h-8 flex items-center gap-2 bg-card border-border shadow-sm rounded-lg hover:bg-muted transition-colors'
                  >
                    <span
                      className='w-4 h-4 rounded-full border border-black/10'
                      style={{ backgroundColor: colorHex }}
                    ></span>
                    <span className='text-xs font-bold text-foreground'>{color}</span>
                    <button
                      type='button'
                      onClick={() => onToggle('colors', color)}
                      className='ml-1 text-muted-foreground hover:text-destructive transition-colors'
                    >
                      <X className='h-3.5 w-3.5' />
                    </button>
                  </Badge>
                )
              })}
            </div>
          )}
        </div>

        <div className='h-px bg-border/50 my-4'></div>

        {/* Sizes */}
        <div className='space-y-3'>
          <div className='flex items-center gap-2'>
            <Ruler className='h-5 w-5 text-primary' />
            <Label className='text-sm font-bold text-foreground'>المقاسات المتاحة</Label>
          </div>
          <div className='flex flex-wrap gap-2'>
            {PREDEFINED_SIZES.map((size) => {
              const isSelected = sizes.includes(size)
              return (
                <div
                  key={size}
                  onClick={() => onToggle('sizes', size)}
                  className={cn(
                    "cursor-pointer px-4 py-2 rounded-xl border text-sm font-bold transition-all select-none min-w-[50px] text-center",
                    isSelected
                      ? "bg-primary text-primary-foreground border-primary shadow-lg shadow-primary/20 scale-105"
                      : "bg-muted/50 text-muted-foreground border-border hover:border-primary hover:text-primary"
                  )}
                >
                  {size}
                </div>
              )
            })}
          </div>

          {/* Selected Sizes Badges */}
          {sizes.length > 0 && (
            <div className='flex flex-wrap gap-2 mt-4 p-4 bg-muted/30 rounded-2xl border border-border/50'>
              {sizes.map((size) => (
                <Badge
                  key={size}
                  variant='outline'
                  className='pl-3 pr-1 py-1.5 h-8 flex items-center gap-2 bg-card border-border shadow-sm rounded-lg hover:bg-muted'
                >
                  <span className='text-xs font-bold text-foreground'>{size}</span>
                  <button
                    type='button'
                    onClick={() => onToggle('sizes', size)}
                    className='ml-1 text-muted-foreground hover:text-destructive transition-colors'
                  >
                    <X className='h-3.5 w-3.5' />
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