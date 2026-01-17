'use client'

import type React from 'react'
import { useState, useEffect, useRef, useCallback } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter, usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Search,
  User,
  Heart,
  ShoppingCart,
  Menu,
  X,
  LogOut,
  Package,
  MapPin,
  UserCircle,
  Crown,
  Sparkles,
  Tag,
  Loader2,
  ArrowRight,
  Zap,
  Settings,
  ChevronRight,
  ChevronDown,
} from 'lucide-react'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Sheet, SheetContent } from '@/components/ui/sheet'
import { CartSheet } from '@/components/cart/CartSheet'
import { ThemeToggle } from '@/components/ThemeToggle'
import { LanguageToggle } from '@/components/LanguageToggle'
import { useAuth } from '@/contexts/AuthContext'
import { useCart } from '@/contexts/CartContext'
import { useWishlist } from '@/contexts/WishlistContext'
import { useLanguage } from '@/contexts/LanguageContext'
import { cn } from '@/lib/utils'
import { productsAPI } from '@/lib/api'
import type { Product } from '@/lib/types'
import { Separator } from '@/components/ui/separator'
import { Badge } from '../ui/badge'

const navLinksConfig = {
  ar: [
    { href: '/', label: 'الرئيسية' },
    { href: '/shop', label: 'المتجر' },
    { href: '/shop?category=thwb-rjaly', label: 'ثوب رجالي' },
    { href: '/shop?category=thwb-atfal', label: 'ثوب اطفال' },
    { href: '/shop?category=nqab', label: 'نقاب' },
    { href: '/shop?category=khmar', label: 'خمار ' },
    { href: '/shop?sale=true', label: 'التخفيضات', special: true },
  ],
  en: [
    { href: '/', label: 'Home' },
    { href: '/shop', label: 'Shop' },
    { href: '/shop?category=thwb-rjaly', label: 'thwb rjaly' },
    { href: '/shop?category=khmar', label: 'khmar' },
    { href: '/shop?category=nqab', label: 'nqab' },
    { href: '/shop?sale=true', label: 'Sale', special: true },
  ],
}

export function Navbar() {
  const router = useRouter()
  const pathname = usePathname()
  const { user, logout, isAuthenticated } = useAuth()
  const { itemsCount } = useCart()
  const { wishlist } = useWishlist()
  const { language, t, isRTL } = useLanguage()

  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false)
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<Product[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [showSearchResults, setShowSearchResults] = useState(false)
  const [showScrollIndicator, setShowScrollIndicator] = useState(false)

  const searchTimeoutRef = useRef<NodeJS.Timeout>()
  const searchRef = useRef<HTMLDivElement>(null)
  const scrollContainerRef = useRef<HTMLDivElement>(null)

  const navLinks = navLinksConfig[language]

  const isAdmin = user?.role === 'admin'
  const wishlistCount = wishlist.length

  const getUserInitials = (name?: string) => {
    if (!name) return 'U'
    const names = name.trim().split(' ')
    if (names.length >= 2) {
      return (names[0][0] + names[1][0]).toUpperCase()
    }
    return name.substring(0, 2).toUpperCase()
  }

  const handleScroll = useCallback(() => {
    setIsScrolled(window.scrollY > 10)
  }, [])

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [handleScroll])

  const handleSheetScroll = useCallback(() => {
    const container = scrollContainerRef.current
    if (!container) return

    const { scrollTop, scrollHeight, clientHeight } = container
    const isScrollable = scrollHeight > clientHeight
    const hasMoreContent = scrollTop + clientHeight < scrollHeight - 20

    setShowScrollIndicator(isScrollable && hasMoreContent)
  }, [])

  useEffect(() => {
    const container = scrollContainerRef.current
    if (!container) return

    handleSheetScroll()
    container.addEventListener('scroll', handleSheetScroll, { passive: true })
    return () => container.removeEventListener('scroll', handleSheetScroll)
  }, [handleSheetScroll, isMobileMenuOpen])

  useEffect(() => {
    setIsMobileMenuOpen(false)
    setIsMobileSearchOpen(false)
  }, [pathname])

  useEffect(() => {
    if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current)

    if (!searchQuery.trim()) {
      setSearchResults([])
      setShowSearchResults(false)
      setIsSearching(false)
      return
    }

    setIsSearching(true)
    searchTimeoutRef.current = setTimeout(async () => {
      try {
        const response = await productsAPI.getAll({
          keyword: searchQuery.trim(),
          limit: 5,
        })
        setSearchResults(response.data || [])
        setShowSearchResults(true)
      } catch (error) {
        console.error('❌ Search error:', error)
        setSearchResults([])
      } finally {
        setIsSearching(false)
      }
    }, 400)

    return () => {
      if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current)
    }
  }, [searchQuery])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSearchResults(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSearch = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault()
      if (searchQuery.trim()) {
        router.push(`/shop?search=${encodeURIComponent(searchQuery.trim())}`)
        setSearchQuery('')
        setShowSearchResults(false)
        setIsMobileSearchOpen(false)
      }
    },
    [searchQuery, router]
  )

  const goLogin = useCallback(() => {
    const cb = pathname || '/'
    router.push(`/login?callbackUrl=${encodeURIComponent(cb)}`)
  }, [router, pathname])

  const handleOpenWishlist = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault()

      if (isAdmin) return

      if (!isAuthenticated) {
        toast.error(language === 'ar' ? 'سجّل الدخول لمشاهدة المفضلة' : 'Please log in to view your wishlist')
        goLogin()
        return
      }

      router.push('/wishlist')
    },
    [isAdmin, isAuthenticated, language, goLogin, router]
  )

  const handleOpenCart = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault()

      if (isAdmin) return

      if (!isAuthenticated) {
        toast.error(language === 'ar' ? 'سجّل الدخول لمتابعة التسوق' : 'Please log in to use the cart')
        goLogin()
        return
      }

      setIsCartOpen(true)
    },
    [isAdmin, isAuthenticated, language, goLogin]
  )

  return (
    <>
      {/* Search Overlay - Desktop */}
      <AnimatePresence>
        {showSearchResults && !isMobileSearchOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className='hidden md:block fixed inset-0 bg-black/20 backdrop-blur-sm z-40'
            onClick={() => setShowSearchResults(false)}
          />
        )}
      </AnimatePresence>

      <header
        className={cn(
          'sticky top-0 z-50 w-full transition-all duration-300',
          isScrolled ? 'shadow-lg' : 'shadow-sm'
        )}
      >
        {/* Top Banner */}
        <div className='relative overflow-hidden bg-gradient-to-r from-primary via-accent to-primary'>
          <div className="absolute inset-0 bg-[url('/pattern.svg')] opacity-10" />

          <motion.div
            className='absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent'
            animate={{ x: ['-100%', '100%'] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
          />

          <div className='container mx-auto px-4 py-1 sm:py-1.5 md:py-2 relative'>
            <div className='flex items-center justify-center'>
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className='text-center text-[9px] xs:text-[10px] sm:text-xs md:text-sm font-semibold text-white flex items-center justify-center gap-1.5 xs:gap-2 sm:gap-4'
              >
                <motion.span
                  className='flex items-center gap-0.5 xs:gap-1'
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <Sparkles className='h-2.5 w-2.5 xs:h-3 xs:w-3 sm:h-3.5 sm:w-3.5' />
                  <span className='hidden xs:inline'>{t('freeShipping')}</span>
                  <span className='xs:hidden'>شحن مجاني</span>
                </motion.span>
                <span className='opacity-50'>•</span>
                <motion.span
                  className='flex items-center gap-0.5 xs:gap-1'
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
                >
                  <Tag className='h-2.5 w-2.5 xs:h-3 xs:w-3 sm:h-3.5 sm:w-3.5' />
                  <span className='hidden xs:inline'>{t('discount')}</span>
                  <span className='xs:hidden'>خصومات 20%</span>
                </motion.span>
              </motion.div>
            </div>
          </div>
        </div>

        {/* Main Navbar */}
        <div
          className={cn(
            'transition-all duration-300 border-b',
            isScrolled
              ? 'bg-background/95 backdrop-blur-xl border-border/60'
              : 'bg-background/80 backdrop-blur-md border-border/40'
          )}
        >
          <div className='container mx-auto px-4'>
            <div className='flex h-14 sm:h-16 md:h-18 items-center justify-between'>
              {/* Mobile Menu Button */}
              <div className='lg:hidden w-10'>
                <Button
                  variant='ghost'
                  size='icon'
                  className='h-9 w-9 sm:h-10 sm:w-10 rounded-xl hover:bg-primary/15 hover:text-primary transition-all'
                  onClick={() => setIsMobileMenuOpen(true)}
                >
                  <Menu className='h-5 w-5' />
                </Button>
              </div>

              {/* Logo Desktop */}
              <Link href='/' className='hidden lg:flex items-center'>
                <motion.span
                  className='text-3xl lg:text-4xl font-black tracking-tight bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent'
                  whileHover={{ scale: 1.03 }}
                  transition={{ duration: 0.2 }}
                >
                  {t('brandName')}
                </motion.span>
              </Link>

              {/* Logo Mobile */}
              <div className='lg:hidden flex-1 flex justify-center px-2'>
                <Link href='/'>
                  <span className='text-xl sm:text-2xl font-black tracking-tight bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent'>
                    {t('brandName')}
                  </span>
                </Link>
              </div>

              {/* Desktop Navigation */}
              <nav className='hidden lg:flex items-center gap-2 flex-1 justify-center'>
                {navLinks.map((link) => {
                  const isActive = pathname === link.href
                  return (
                    <Link key={link.href} href={link.href} className='relative group px-5 py-2'>
                      <motion.span
                        className={cn(
                          'text-[16px] font-bold tracking-wide transition-all duration-200',
                          isActive ? 'text-primary' : 'text-foreground/80 hover:text-primary',
                          link.special && 'flex items-center gap-2'
                        )}
                        whileHover={{ y: -1 }}
                        transition={{ duration: 0.2 }}
                      >
                        {link.label}
                        {link.special && (
                          <motion.span
                            animate={{ rotate: [0, 15, -15, 0], scale: [1, 1.2, 1] }}
                            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
                          >
                            <Zap className='h-4 w-4 text-primary fill-primary' />
                          </motion.span>
                        )}
                      </motion.span>

                      {isActive && (
                        <motion.div
                          layoutId='navbar-indicator'
                          className='absolute bottom-0 left-0 right-0 h-[3px] bg-primary rounded-full'
                          transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                        />
                      )}

                      {!isActive && (
                        <motion.span
                          className='absolute bottom-0 left-0 right-0 h-[2px] bg-primary/40 rounded-full'
                          initial={{ scaleX: 0 }}
                          whileHover={{ scaleX: 1 }}
                          transition={{ duration: 0.2 }}
                        />
                      )}
                    </Link>
                  )
                })}
              </nav>

              {/* Right: Actions */}
              <div className='flex items-center gap-1 lg:gap-2'>
                {/* Language & Theme - Desktop */}
                <div className='hidden lg:flex items-center gap-1'>
                  <LanguageToggle />
                  <ThemeToggle />
                </div>

                {/* Search - Desktop */}
                <div className='hidden md:block relative' ref={searchRef}>
                  <Button
                    variant='ghost'
                    size='icon'
                    className={cn(
                      'h-10 w-10 rounded-xl transition-all duration-200 relative z-50',
                      showSearchResults ? 'bg-primary/15 text-primary' : 'hover:bg-primary/15 hover:text-primary'
                    )}
                    onClick={() => {
                      setShowSearchResults(!showSearchResults)
                      if (!showSearchResults && searchQuery) setShowSearchResults(true)
                    }}
                  >
                    <Search className='h-5 w-5' />
                  </Button>

                  {/* Desktop Search Dropdown */}
                  <AnimatePresence>
                    {showSearchResults && (
                      <motion.div
                        initial={{ opacity: 0, y: -10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className={cn(
                          'absolute top-full mt-3 w-[380px] z-50',
                          'bg-card border border-border rounded-2xl shadow-2xl overflow-hidden',
                          isRTL ? 'left-0' : 'right-0'
                        )}
                      >
                        <form onSubmit={handleSearch} className='p-4'>
                          <div className='relative'>
                            <Search
                              className={cn(
                                'absolute top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground',
                                isRTL ? 'right-4' : 'left-4'
                              )}
                            />
                            <Input
                              type='search'
                              placeholder={t('search')}
                              value={searchQuery}
                              onChange={(e) => setSearchQuery(e.target.value)}
                              onFocus={() => searchQuery && setShowSearchResults(true)}
                              className={cn(
                                'h-12 rounded-xl border-primary/30 focus-visible:ring-primary focus-visible:border-primary',
                                isRTL ? 'pr-11 pl-11' : 'pl-11 pr-11'
                              )}
                              autoFocus
                            />
                            {isSearching && (
                              <Loader2
                                className={cn(
                                  'absolute top-1/2 -translate-y-1/2 h-4 w-4 animate-spin text-primary',
                                  isRTL ? 'left-4' : 'right-4'
                                )}
                              />
                            )}
                          </div>

                          {/* Search Results */}
                          {searchResults.length > 0 && searchQuery && (
                            <div className='mt-3 pt-3 border-t max-h-80 overflow-y-auto'>
                              {searchResults.map((product) => (
                                <button
                                  key={product._id}
                                  type='button'
                                  onClick={() => {
                                    router.push(`/product/${product._id}`)
                                    setShowSearchResults(false)
                                    setSearchQuery('')
                                  }}
                                  className='w-full flex items-center gap-3 p-3 hover:bg-muted/80 rounded-xl transition-colors'
                                >
                                  <div className='relative w-12 h-12 rounded-lg overflow-hidden bg-muted flex-shrink-0'>
                                    <Image src={product.imageCover || '/placeholder.svg'} alt={product.title} fill className='object-cover' />
                                  </div>
                                  <div className={cn('flex-1 min-w-0', isRTL ? 'text-right' : 'text-left')}>
                                    <p className='font-medium text-sm line-clamp-1'>{product.title}</p>
                                    <p className='text-xs text-muted-foreground'>
                                      {product.price} {language === 'ar' ? 'جنيه' : 'EGP'}
                                    </p>
                                  </div>
                                  <ArrowRight className={cn('h-4 w-4 text-muted-foreground flex-shrink-0', isRTL && 'rotate-180')} />
                                </button>
                              ))}
                            </div>
                          )}

                          {/* Quick Searches */}
                          {!searchQuery && (
                            <div className='mt-3 pt-3 border-t'>
                              <p className='text-xs text-muted-foreground mb-2 font-medium'>
                                {language === 'ar' ? 'بحث سريع' : 'Quick Search'}
                              </p>
                              <div className='flex flex-wrap gap-2'>
                                {(language === 'ar' ? ['عباءات', 'حجاب', 'تخفيضات'] : ['Abayas', 'Hijabs', 'Sale']).map((term) => (
                                  <button
                                    key={term}
                                    type='button'
                                    onClick={() => {
                                      router.push(`/shop?search=${term}`)
                                      setShowSearchResults(false)
                                    }}
                                    className='text-xs px-3 py-1.5 rounded-full bg-primary/15 hover:bg-primary/25 transition-all font-medium text-primary'
                                  >
                                    {term}
                                  </button>
                                ))}
                              </div>
                            </div>
                          )}
                        </form>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Search - Mobile */}
                <Button
                  variant='ghost'
                  size='icon'
                  className='md:hidden h-9 w-9 sm:h-10 sm:w-10 rounded-xl hover:bg-primary/15 hover:text-primary'
                  onClick={() => setIsMobileSearchOpen(!isMobileSearchOpen)}
                >
                  <Search className='h-5 w-5' />
                </Button>

                {/* User */}
                <div className='hidden sm:block'>
                  {isAuthenticated ? (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant='ghost' size='icon' className='h-10 w-10 rounded-full hover:bg-primary/15'>
                          <Avatar className='h-9 w-9 ring-2 ring-primary/20'>
                            <AvatarFallback className='bg-primary/15 text-primary font-bold text-sm'>
                              {getUserInitials(user?.name)}
                            </AvatarFallback>
                          </Avatar>
                        </Button>
                      </DropdownMenuTrigger>

                      <DropdownMenuContent align='end' className='w-56'>
                        <DropdownMenuLabel>
                          <div className='flex flex-col space-y-1'>
                            <p className='text-sm font-medium'>{user?.name || 'User'}</p>
                            <p className='text-xs text-muted-foreground'>{user?.email || ''}</p>
                          </div>
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator />

                        <DropdownMenuItem onClick={() => router.push('/profile')}>
                          <UserCircle className='mr-2 h-4 w-4' />
                          {t('profile')}
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => router.push('/profile/orders')}>
                          <Package className='mr-2 h-4 w-4' />
                          {t('orders')}
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => router.push('/profile/addresses')}>
                          <MapPin className='mr-2 h-4 w-4' />
                          {t('addresses')}
                        </DropdownMenuItem>

                        {isAdmin && (
                          <>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => router.push('/admin')} className='text-primary font-medium'>
                              <Crown className='mr-2 h-4 w-4' />
                              {t('adminPanel')}
                            </DropdownMenuItem>
                          </>
                        )}

                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => {
                            logout()
                            setIsMobileMenuOpen(false)
                          }}
                          className='text-red-600'
                        >
                          <LogOut className='mr-2 h-4 w-4' />
                          {t('logout')}
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  ) : (
                    <Link href='/login'>
                      <Button variant='ghost' size='icon' className='h-10 w-10 rounded-full hover:bg-primary/15 hover:text-primary'>
                        <User className='h-5 w-5' />
                      </Button>
                    </Link>
                  )}
                </div>

               
               {!isAdmin && (
 
  <Button
    onClick={handleOpenWishlist}
    variant='ghost'
    size='icon'
    className='relative h-9 w-9 sm:h-10 sm:w-10 rounded-xl hover:bg-primary/15 hover:text-primary transition-all'
  >
    <Heart className={cn('h-5 w-5', isAuthenticated && wishlistCount > 0 && 'fill-pink-500 text-pink-500')} />
    {isAuthenticated && wishlistCount > 0 && (
      <Badge className='absolute -top-1 -right-1 h-4 w-4 p-0 bg-pink-500 text-[9px] text-white flex items-center justify-center rounded-full border-2 border-background'>
        {wishlistCount}
      </Badge>
    )}
  </Button>
)}


                {/* Cart (visible for users, prompts login if not authenticated) */}
                {!isAdmin && (
                  <Button
                    variant='ghost'
                    size='icon'
                    className='relative h-9 w-9 sm:h-10 sm:w-10 rounded-xl hover:bg-primary/15 hover:text-primary transition-all'
                    onClick={handleOpenCart}
                  >
                    <ShoppingCart className='h-5 w-5' />
                    {isAuthenticated && itemsCount > 0 && (
                      <Badge className='absolute -top-1 -right-1 h-4 w-4 p-0 bg-primary text-[9px] text-primary-foreground flex items-center justify-center rounded-full border-2 border-background font-bold'>
                        {itemsCount}
                      </Badge>
                    )}
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Search Overlay */}
        <AnimatePresence>
          {isMobileSearchOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className='md:hidden border-t bg-card/50 backdrop-blur-md p-3'
            >
              <form onSubmit={handleSearch} className='relative mb-2'>
                <Search
                  className={cn(
                    'absolute top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground',
                    isRTL ? 'right-4' : 'left-4'
                  )}
                />
                <Input
                  autoFocus
                  type='search'
                  placeholder={t('search')}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={cn(
                    'h-12 rounded-xl border-primary/30 focus-visible:ring-primary',
                    isRTL ? 'pr-11 pl-11' : 'pl-11 pr-11'
                  )}
                />
                {isSearching && (
                  <Loader2
                    className={cn(
                      'absolute top-1/2 -translate-y-1/2 h-4 w-4 animate-spin text-primary',
                      isRTL ? 'left-4' : 'right-4'
                    )}
                  />
                )}
              </form>

              {searchResults.length > 0 && searchQuery && (
                <div className='bg-card rounded-xl border max-h-60 overflow-y-auto'>
                  {searchResults.map((product) => (
                    <button
                      key={product._id}
                      onClick={() => {
                        router.push(`/product/${product._id}`)
                        setIsMobileSearchOpen(false)
                        setSearchQuery('')
                      }}
                      className='w-full flex items-center gap-3 p-2.5 hover:bg-muted/80 rounded-xl transition-colors'
                    >
                      <div className='relative w-12 h-12 rounded-lg overflow-hidden bg-muted flex-shrink-0'>
                        <Image src={product.imageCover || '/placeholder.svg'} alt={product.title} fill className='object-cover' />
                      </div>
                      <div className={cn('flex-1 min-w-0', isRTL ? 'text-right' : 'text-left')}>
                        <p className='font-semibold text-sm line-clamp-1'>{product.title}</p>
                        <p className='text-xs text-muted-foreground'>
                          {product.price} {language === 'ar' ? 'جنيه' : 'EGP'}
                        </p>
                      </div>
                      <ArrowRight className={cn('h-4 w-4 text-muted-foreground', isRTL && 'rotate-180')} />
                    </button>
                  ))}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Mobile Menu Sheet */}
      <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
        <SheetContent
          side={isRTL ? 'right' : 'left'}
          className='w-[250px] sm:w-[300px] p-0 flex flex-col [&>button]:hidden'
        >
          {/* Header */}
          <div className='p-5 border-b bg-gradient-to-br from-primary/10 to-accent/5 flex-shrink-0'>
            <div className='flex items-center justify-between mb-4'>
              <Link
                href='/'
                onClick={() => setIsMobileMenuOpen(false)}
                className='text-2xl font-black text-primary'
              >
                {t('brandName')}
              </Link>
              <Button
                variant='ghost'
                size='icon'
                onClick={() => setIsMobileMenuOpen(false)}
                className='h-8 w-8 hover:bg-primary/15'
              >
                <X className='h-5 w-5' />
              </Button>
            </div>

            {isAuthenticated && (
              <div className='flex items-center gap-3 p-3 bg-background rounded-xl shadow-sm'>
                <Avatar className='h-10 w-10 ring-2 ring-primary/20'>
                  <AvatarFallback className='bg-primary/15 text-primary font-bold'>
                    {getUserInitials(user?.name)}
                  </AvatarFallback>
                </Avatar>
                <div className='flex-1 min-w-0'>
                  <p className='text-sm font-semibold truncate'>{user?.name || 'User'}</p>
                  <p className='text-xs text-muted-foreground truncate'>{user?.email || ''}</p>
                </div>
              </div>
            )}
          </div>

          {/* Content */}
          <div
            ref={scrollContainerRef}
            className='flex-1 overflow-y-auto py-4 relative'
            style={{ scrollbarWidth: 'thin' }}
          >
            <div className='px-4 space-y-1 pb-4'>
              <p className='text-xs font-semibold text-muted-foreground px-3 mb-2'>
                {language === 'ar' ? 'التنقل' : 'Navigation'}
              </p>

              {navLinks.map((link) => {
                const isActive = pathname === link.href
                return (
                  <Link key={link.href} href={link.href} onClick={() => setIsMobileMenuOpen(false)}>
                    <div
                      className={cn(
                        'flex items-center justify-between px-4 py-3 rounded-xl transition-all',
                        isActive ? 'bg-primary/15 text-primary font-bold shadow-sm' : 'hover:bg-muted/80 font-semibold',
                        link.special && 'bg-gradient-to-r from-primary/10 to-accent/10'
                      )}
                    >
                      <span className='text-[15px] flex items-center gap-2'>
                        {link.label}
                        {link.special && (
                          <motion.span animate={{ rotate: [0, 15, -15, 0] }} transition={{ duration: 1.5, repeat: Infinity }}>
                            <Zap className='h-4 w-4 text-primary fill-primary' />
                          </motion.span>
                        )}
                      </span>
                      <ChevronRight className={cn('h-4 w-4 text-muted-foreground', isRTL && 'rotate-180')} />
                    </div>
                  </Link>
                )
              })}
            </div>

            {isAuthenticated && (
              <>
                <Separator className='my-4' />
                <div className='px-4 space-y-1 pb-4'>
                  <p className='text-xs font-semibold text-muted-foreground px-3 mb-2'>
                    {language === 'ar' ? 'حسابي' : 'My Account'}
                  </p>

                  <Link href='/profile' onClick={() => setIsMobileMenuOpen(false)}>
                    <div className='flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-muted/80 transition-colors'>
                      <UserCircle className='h-5 w-5 text-primary' />
                      <span className='text-sm font-semibold'>{t('profile')}</span>
                    </div>
                  </Link>

                  <Link href='/orders' onClick={() => setIsMobileMenuOpen(false)}>
                    <div className='flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-muted/80 transition-colors'>
                      <Package className='h-5 w-5 text-primary' />
                      <span className='text-sm font-semibold'>{t('orders')}</span>
                    </div>
                  </Link>

                  <Link href='/addresses' onClick={() => setIsMobileMenuOpen(false)}>
                    <div className='flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-muted/80 transition-colors'>
                      <MapPin className='h-5 w-5 text-primary' />
                      <span className='text-sm font-semibold'>{t('addresses')}</span>
                    </div>
                  </Link>

                  {isAdmin && (
                    <>
                      <Separator className='my-2' />
                      <Link href='/admin' onClick={() => setIsMobileMenuOpen(false)}>
                        <div className='flex items-center gap-3 px-4 py-3 rounded-xl bg-primary/10 hover:bg-primary/15 transition-colors'>
                          <Crown className='h-5 w-5 text-primary' />
                          <span className='text-sm font-bold text-primary'>{t('adminPanel')}</span>
                        </div>
                      </Link>
                    </>
                  )}
                </div>
              </>
            )}

            <div className='h-32' />
          </div>

          {/* Scroll Indicator */}
          <AnimatePresence>
            {showScrollIndicator && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className='absolute bottom-[180px] left-0 right-0 h-20 pointer-events-none'
                style={{ background: 'linear-gradient(to bottom, transparent, hsl(var(--background)) 70%)' }}
              >
                <motion.div
                  animate={{ y: [0, 8, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                  className='absolute bottom-2 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1'
                >
                  <ChevronDown className='h-5 w-5 text-primary' />
                  <p className='text-xs font-bold text-primary'>
                    {language === 'ar' ? 'المزيد أدناه' : 'More below'}
                  </p>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Footer */}
          <div className='p-4 border-t bg-muted/30 space-y-2.5 flex-shrink-0'>
            <p className='text-xs font-semibold text-muted-foreground px-3'>
              {language === 'ar' ? 'الإعدادات' : 'Settings'}
            </p>

            <div className='flex items-center justify-between px-4 py-2 bg-background rounded-xl'>
              <div className='flex items-center gap-2'>
                <Settings className='h-4 w-4 text-muted-foreground' />
                <span className='text-sm font-semibold'>{language === 'ar' ? 'اللغة' : 'Language'}</span>
              </div>
              <LanguageToggle />
            </div>

            <div className='flex items-center justify-between px-4 py-2 bg-background rounded-xl'>
              <div className='flex items-center gap-2'>
                <Settings className='h-4 w-4 text-muted-foreground' />
                <span className='text-sm font-semibold'>{language === 'ar' ? 'المظهر' : 'Theme'}</span>
              </div>
              <ThemeToggle />
            </div>

            {isAuthenticated ? (
              <Button
                variant='outline'
                className='w-full text-red-600 border-red-200 hover:bg-red-50 dark:hover:bg-red-950/30 font-semibold h-11'
                onClick={() => {
                  logout()
                  setIsMobileMenuOpen(false)
                }}
              >
                <LogOut className='h-4 w-4 mr-2' />
                {t('logout')}
              </Button>
            ) : (
              <Link href='/login' onClick={() => setIsMobileMenuOpen(false)}>
                <Button className='w-full bg-primary hover:bg-primary/90 shadow-lg font-semibold h-11'>
                  {t('login')}
                </Button>
              </Link>
            )}
          </div>
        </SheetContent>
      </Sheet>

      {/* Cart Sheet (only for non-admin + authenticated) */}
      {!isAdmin && isAuthenticated && <CartSheet open={isCartOpen} onOpenChange={setIsCartOpen} />}
    </>
  )
}