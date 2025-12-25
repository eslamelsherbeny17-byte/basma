// hooks/use-translation.ts
import { translations, TranslationKey } from '@/lib/translations'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface LanguageState {
  language: 'ar' | 'en'
  setLanguage: (lang: 'ar' | 'en') => void
}

export const useLanguageStore = create<LanguageState>()(
  persist(
    (set) => ({
      language: 'ar',
      setLanguage: (lang) => set({ language: lang }),
    }),
    { name: 'language-storage' }
  )
)

export const useTranslation = () => {
  const { language, setLanguage } = useLanguageStore()

  const t = (key: TranslationKey): string => {
    // التأكد من وجود المفتاح لتجنب أخطاء وقت التشغيل
    const translation = translations[language] as any
    return translation[key] || key
  }

  const isRTL = language === 'ar'

  return { t, language, setLanguage, isRTL }
}
