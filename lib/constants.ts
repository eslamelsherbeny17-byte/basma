// lib/constants.ts
export const PREDEFINED_COLORS = [
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
  { name: 'نيلي', hex: '#4338CA' },
  { name: 'برتقالي', hex: '#F97316' },
  { name: 'فيروزي', hex: '#14B8A6' },
  { name: 'بنفسجي', hex: '#A855F7' },
]

export const PREDEFINED_SIZES = [
  'XS', 'S', 'M', 'L', 'XL', '2XL', '3XL',
  '40', '41', '42', '43', '44', '45', '46', '47', '48',
]

// Helper function
export function getColorHex(colorName: string): string {
  const color = PREDEFINED_COLORS.find(c => c.name === colorName || c.hex === colorName)
  return color?.hex || colorName // إذا مش لاقي اللون، يرجع الـ hex code اللي مخزن
}

export function getColorName(hex: string): string {
  const color = PREDEFINED_COLORS.find(c => c.hex.toLowerCase() === hex.toLowerCase())
  return color?.name || hex
}