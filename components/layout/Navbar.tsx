'use client'

import type React from 'react'
import { useState, useEffect, useRef, useCallback } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
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
  Home,
  Store,
  Moon,
  Sun,
  Globe,
} from 'lucide-react'

// UI Components
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Sheet, SheetContent } from '@/components/ui/sheet'

// Custom Components
import { CartSheet } from '@/components/cart/CartSheet'
import { ThemeToggle } from '@/components/ThemeToggle'
import { LanguageToggle } from '@/components/LanguageToggle'

// Contexts & Hooks
import { useAuth } from '@/contexts/AuthContext'
import { useCart } from '@/contexts/CartContext'
import { useWishlist } from '@/contexts/WishlistContext'
import { useLanguage } from '@/contexts/LanguageContext'

// Utils & Types
import { cn } from '@/lib/utils'
import { productsAPI } from '@/lib/api'
import type { Product } from '@/lib/types'

const navLinksConfig = {
  ar: [
    { href: '/', label: 'الرئيسية', icon: Home },
    { href: '/shop', label: 'المتجر', icon: Store },
    { href: '/shop?category=abayas', label: 'عباءات' },
    { href: '/shop?category=hijabs', label: 'حجاب' },
    { href: '/shop?category=dresses', label: 'فساتين' },
    { href: '/shop?sale=true', label: 'التخفيضات', special: true },
  ],
  en: [
    { href: '/', label: 'Home', icon: Home },
    { href: '/shop', label: 'Shop', icon: Store },
    { href: '/shop?category=abayas', label: 'Abayas' },
    { href: '/shop?category=hijabs', label: 'Hijabs' },
    { href: '/shop?category=dresses', label: 'Dresses' },
    { href: '/shop?sale=true', label: 'Sales', special: true },
  ],
}

export function Navbar() {
  const router = useRouter()
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

  const searchTimeoutRef = useRef<NodeJS.Timeout>()
  const searchRef = useRef<HTMLDivElement>(null)

  const wishlistCount = wishlist.length
  const navLinks = navLinksConfig[language]

  // Handle scroll effect
  const handleScroll = useCallback(() => {
    setIsScrolled(window.scrollY > 20)
  }, [])

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [handleScroll])

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false)
    setIsMobileSearchOpen(false)
  }, [router])

  // Handle search with debounce
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
        setSearchResults([])
      } finally {
        setIsSearching(false)
      }
    }, 400)
  }, [searchQuery])

  // Close search results when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
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

  const handleCartClick = () => {
    // في وضع الموبايل، روح لصفحة Cart
    if (window.innerWidth < 768) {
      router.push('/cart')
    } else {
      // في وضع Desktop، افتح الـ Sheet
      setIsCartOpen(true)
    }
  }

  return (
    <>
      <header
        className={cn(
          'sticky top-0 z-50 w-full border-b transition-all duration-300',
          'bg-background/95 backdrop-blur-md supports-[backdrop-filter]:bg-background/80',
          isScrolled && 'shadow-md'
        )}
      >
        {/* Top Banner */}
        {/* Top Banner - Fixed */}
        <div className='relative overflow-hidden bg-gradient-to-r from-primary via-accent to-primary'>
          <div className="absolute inset-0 bg-[url('/pattern.svg')] opacity-10" />
          <div className='container mx-auto px-4 py-2 relative'>
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className='text-center text-xs sm:text-sm font-semibold text-white flex items-center justify-center gap-3 sm:gap-4 flex-wrap'
            >
              <span className='flex items-center gap-1.5'>
                <Sparkles className='h-3.5 w-3.5 sm:h-4 sm:w-4' />
                <span>{t('freeShipping')}</span>
              </span>
              <span className='hidden sm:inline opacity-50'>•</span>
              <span className='flex items-center gap-1.5'>
                <Tag className='h-3.5 w-3.5 sm:h-4 sm:w-4' />
                <span>{t('discount')}</span>
              </span>
            </motion.div>
          </div>
        </div>

        {/* Main Navbar */}
        <div className='container mx-auto px-3 sm:px-4'>
          {/* Desktop & Mobile Header */}
          <div className='flex h-14 sm:h-16 items-center justify-between gap-2'>
            {/* Left: Menu Button (Mobile) */}
            <div className='flex items-center gap-2'>
              <Button
                variant='ghost'
                size='icon'
                className='lg:hidden h-9 w-9 rounded-lg'
                onClick={() => setIsMobileMenuOpen(true)}
              >
                <Menu className='h-5 w-5' />
              </Button>

              {/* Logo with Animated Gradient */}
              <Link href='/' className='flex items-center'>
                <motion.div
                  className='text-lg sm:text-xl md:text-2xl font-black relative'
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <motion.span
                    className='bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent'
                    style={{
                      backgroundSize: '200% auto',
                    }}
                    animate={{
                      backgroundPosition: [
                        '0% center',
                        '200% center',
                        '0% center',
                      ],
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: 'linear',
                    }}
                  >
                    {t('brandName')}
                  </motion.span>
                </motion.div>
              </Link>
            </div>

            {/* Center: Desktop Search */}
            <div
              className='hidden md:flex flex-1 max-w-md lg:max-w-lg mx-4'
              ref={searchRef}
            >
              <form onSubmit={handleSearch} className='relative w-full'>
                <Search
                  className={cn(
                    'absolute top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground z-10',
                    isRTL ? 'right-3' : 'left-3'
                  )}
                />
                <Input
                  type='search'
                  placeholder={t('search')}
                  className={cn(
                    'w-full h-10 rounded-full border-2 focus-visible:ring-1',
                    isRTL ? 'pr-10 pl-10' : 'pl-10 pr-10'
                  )}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => searchQuery && setShowSearchResults(true)}
                />
                {isSearching && (
                  <Loader2
                    className={cn(
                      'absolute top-1/2 -translate-y-1/2 h-4 w-4 animate-spin text-primary',
                      isRTL ? 'left-3' : 'right-3'
                    )}
                  />
                )}

                {/* Search Results Dropdown */}
                <AnimatePresence>
                  {showSearchResults && searchResults.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className='absolute top-full mt-2 w-full bg-card rounded-xl shadow-2xl border overflow-hidden z-50'
                    >
                      <div className='max-h-96 overflow-y-auto'>
                        {searchResults.map((product) => (
                          <button
                            key={product._id}
                            onClick={() => {
                              router.push(`/product/${product._id}`)
                              setShowSearchResults(false)
                              setSearchQuery('')
                            }}
                            className='w-full flex items-center gap-3 p-3 hover:bg-accent/10 transition-colors'
                          >
                            <div className='relative w-12 h-12 rounded-lg overflow-hidden bg-muted flex-shrink-0'>
                              <Image
                                src={product.imageCover || '/placeholder.svg'}
                                alt={product.title}
                                fill
                                className='object-cover'
                              />
                            </div>
                            <div
                              className={cn(
                                'flex-1 min-w-0',
                                isRTL ? 'text-right' : 'text-left'
                              )}
                            >
                              <p className='font-medium text-sm line-clamp-1'>
                                {product.title}
                              </p>
                              <p className='text-xs text-muted-foreground'>
                                {product.price}{' '}
                                {language === 'ar' ? 'جنيه' : 'EGP'}
                              </p>
                            </div>
                            <ArrowRight
                              className={cn(
                                'h-4 w-4 text-muted-foreground flex-shrink-0',
                                isRTL && 'rotate-180'
                              )}
                            />
                          </button>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </form>
            </div>

            {/* Right: Action Icons */}
            <div className='flex items-center gap-1 sm:gap-1.5'>
              {/* Theme & Language - Hidden on small mobile */}
              <div className='hidden sm:flex items-center gap-1'>
                <ThemeToggle />
                <LanguageToggle />
              </div>

              {/* Search Icon (Mobile Only) */}
              <Button
                variant='ghost'
                size='icon'
                className='md:hidden h-9 w-9 rounded-lg'
                onClick={() => setIsMobileSearchOpen(!isMobileSearchOpen)}
              >
                <Search className='h-4 w-4' />
              </Button>

              {/* User Profile/Login */}
              {isAuthenticated && user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant='ghost'
                      className='relative h-9 w-9 sm:w-auto sm:px-2 rounded-full'
                    >
                      <Avatar className='h-8 w-8 ring-2 ring-primary/20'>
                        <AvatarImage src={user.profileImg} alt={user.name} />
                        <AvatarFallback className='bg-gradient-to-br from-primary to-accent text-white text-xs font-bold'>
                          {user.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <span className='hidden sm:inline-block ml-2 text-sm font-semibold max-w-[80px] truncate'>
                        {user.name.split(' ')[0]}
                      </span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align='end'
                    className='w-64 sm:w-72 rounded-xl p-2'
                    sideOffset={8}
                  >
                    <DropdownMenuLabel className='pb-2'>
                      <div className='flex items-center gap-3'>
                        <Avatar className='h-12 w-12 ring-2 ring-primary/30'>
                          <AvatarImage src={user.profileImg} alt={user.name} />
                          <AvatarFallback className='bg-gradient-to-br from-primary to-accent text-white font-bold'>
                            {user.name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div className='flex-1 min-w-0'>
                          <p className='text-sm font-bold truncate flex items-center gap-1'>
                            {user.name}
                            {user.role === 'admin' && (
                              <Crown className='h-3 w-3 text-amber-500' />
                            )}
                          </p>
                          <p className='text-xs text-muted-foreground truncate'>
                            {user.email}
                          </p>
                          <Badge
                            variant='secondary'
                            className='text-[10px] mt-1'
                          >
                            {user.role === 'admin' ? t('admin') : t('customer')}
                          </Badge>
                        </div>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      asChild
                      className='cursor-pointer rounded-lg'
                    >
                      <Link href='/profile' className='flex items-center'>
                        <UserCircle
                          className={cn('h-4 w-4', isRTL ? 'ml-2' : 'mr-2')}
                        />
                        {t('myProfile')}
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      asChild
                      className='cursor-pointer rounded-lg'
                    >
                      <Link
                        href='/profile/orders'
                        className='flex items-center'
                      >
                        <Package
                          className={cn('h-4 w-4', isRTL ? 'ml-2' : 'mr-2')}
                        />
                        {t('myOrders')}
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      asChild
                      className='cursor-pointer rounded-lg'
                    >
                      <Link
                        href='/profile/addresses'
                        className='flex items-center'
                      >
                        <MapPin
                          className={cn('h-4 w-4', isRTL ? 'ml-2' : 'mr-2')}
                        />
                        {t('myAddresses')}
                      </Link>
                    </DropdownMenuItem>
                    {user.role === 'admin' && (
                      <>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          asChild
                          className='cursor-pointer rounded-lg bg-amber-50'
                        >
                          <Link
                            href='/admin'
                            className='flex items-center font-semibold text-amber-900'
                          >
                            <Crown
                              className={cn('h-4 w-4', isRTL ? 'ml-2' : 'mr-2')}
                            />
                            {t('dashboard')}
                          </Link>
                        </DropdownMenuItem>
                      </>
                    )}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={logout}
                      className='text-red-600 cursor-pointer rounded-lg hover:bg-red-50 font-semibold'
                    >
                      <LogOut
                        className={cn('h-4 w-4', isRTL ? 'ml-2' : 'mr-2')}
                      />
                      {t('logout')}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Link href='/login'>
                  <Button
                    size='sm'
                    className='h-9 px-3 sm:px-4 rounded-full text-xs sm:text-sm font-bold'
                  >
                    <User className='h-3 w-3 sm:h-4 sm:w-4 sm:mr-1.5' />
                    <span className='hidden sm:inline'>{t('login')}</span>
                  </Button>
                </Link>
              )}

              {/* Wishlist */}
              <Link href='/wishlist'>
                <Button
                  variant='ghost'
                  size='icon'
                  className='relative h-9 w-9 rounded-lg'
                >
                  <Heart
                    className={cn(
                      'h-4 w-4',
                      wishlistCount > 0 && 'fill-red-500 text-red-500'
                    )}
                  />
                  {wishlistCount > 0 && (
                    <Badge className='absolute -top-1 -right-1 h-4 w-4 p-0 flex items-center justify-center text-[9px] rounded-full'>
                      {wishlistCount}
                    </Badge>
                  )}
                </Button>
              </Link>

              {/* Cart - يفتح صفحة على الموبايل و Sheet على Desktop */}
              <Button
                variant='ghost'
                size='icon'
                className='relative h-9 w-9 rounded-lg'
                onClick={handleCartClick}
              >
                <ShoppingCart className='h-4 w-4' />
                {itemsCount > 0 && (
                  <Badge className='absolute -top-1 -right-1 h-4 w-4 p-0 flex items-center justify-center text-[9px] rounded-full'>
                    {itemsCount}
                  </Badge>
                )}
              </Button>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className='hidden lg:flex items-center justify-center gap-1 pb-3 border-t pt-2'>
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href}>
                <Button
                  variant='ghost'
                  size='sm'
                  className={cn(
                    'rounded-lg font-semibold transition-all',
                    link.special &&
                      'text-red-600 hover:text-red-700 hover:bg-red-50'
                  )}
                >
                  {link.label}
                  {link.special && (
                    <motion.span
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ repeat: Infinity, duration: 1.5 }}
                      className='ml-1'
                    >
                      🔥
                    </motion.span>
                  )}
                </Button>
              </Link>
            ))}
          </nav>
        </div>

        {/* Mobile Search Overlay */}
        <AnimatePresence>
          {isMobileSearchOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className='md:hidden border-t bg-background/95 backdrop-blur-md p-3'
            >
              <form onSubmit={handleSearch} className='relative w-full mb-2'>
                <Search
                  className={cn(
                    'absolute top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground z-10',
                    isRTL ? 'right-3' : 'left-3'
                  )}
                />
                <Input
                  autoFocus
                  type='search'
                  placeholder={t('search')}
                  className={cn(
                    'w-full h-10 rounded-xl bg-muted/50',
                    isRTL ? 'pr-10 pl-10' : 'pl-10 pr-10'
                  )}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                {isSearching && (
                  <Loader2
                    className={cn(
                      'absolute top-1/2 -translate-y-1/2 h-4 w-4 animate-spin text-primary',
                      isRTL ? 'left-3' : 'right-3'
                    )}
                  />
                )}
              </form>

              {/* Mobile Search Results */}
              {searchResults.length > 0 && searchQuery && (
                <div className='bg-card rounded-xl border overflow-hidden max-h-60 overflow-y-auto'>
                  {searchResults.map((product) => (
                    <button
                      key={product._id}
                      onClick={() => {
                        router.push(`/product/${product._id}`)
                        setIsMobileSearchOpen(false)
                        setSearchQuery('')
                      }}
                      className='w-full flex items-center gap-3 p-2.5 hover:bg-accent/10 transition-colors'
                    >
                      <div className='relative w-12 h-12 rounded-lg overflow-hidden bg-muted flex-shrink-0'>
                        <Image
                          src={product.imageCover || '/placeholder.svg'}
                          alt={product.title}
                          fill
                          className='object-cover'
                        />
                      </div>
                      <div
                        className={cn(
                          'flex-1 min-w-0',
                          isRTL ? 'text-right' : 'text-left'
                        )}
                      >
                        <p className='font-semibold text-sm line-clamp-1'>
                          {product.title}
                        </p>
                        <p className='text-xs text-muted-foreground'>
                          {product.price} {language === 'ar' ? 'جنيه' : 'EGP'}
                        </p>
                      </div>
                      <ArrowRight
                        className={cn(
                          'h-4 w-4 text-muted-foreground',
                          isRTL && 'rotate-180'
                        )}
                      />
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
          className='w-[280px] sm:w-[320px] p-0'
        >
          {/* Custom Header with Close Button */}
          <div
            className={cn(
              'flex items-center justify-between p-4 border-b',
              isRTL && 'flex-row-reverse'
            )}
          >
            <h2 className='text-lg font-bold'>
              {language === 'ar' ? 'القائمة' : 'Menu'}
            </h2>
            <Button
              variant='ghost'
              size='icon'
              className='h-8 w-8 rounded-lg'
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <X className='h-5 w-5' />
            </Button>
          </div>

          <div className='flex flex-col h-full'>
            {/* Navigation Links */}
            <nav className='flex-1 overflow-y-auto p-3'>
              <div className='space-y-1'>
                {navLinks.map((link) => {
                  const Icon = link.icon
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <Button
                        variant='ghost'
                        className={cn(
                          'w-full justify-start font-semibold rounded-lg h-11',
                          link.special &&
                            'text-red-600 hover:text-red-700 hover:bg-red-50',
                          isRTL && 'flex-row-reverse'
                        )}
                      >
                        {Icon && (
                          <Icon
                            className={cn('h-4 w-4', isRTL ? 'ml-3' : 'mr-3')}
                          />
                        )}
                        <span className='flex-1 text-start'>{link.label}</span>
                        {link.special && (
                          <span className={isRTL ? 'mr-auto' : 'ml-auto'}>
                            🔥
                          </span>
                        )}
                      </Button>
                    </Link>
                  )
                })}
              </div>
            </nav>

            {/* Bottom Settings Section */}
            <div className='border-t p-4 space-y-3 bg-muted/30'>
              <div className='text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3'>
                {language === 'ar' ? 'الإعدادات' : 'Settings'}
              </div>

              {/* Theme Toggle Row */}
              <div
                className={cn(
                  'flex items-center justify-between p-3 rounded-lg bg-background/80 border hover:border-primary/50 transition-colors',
                  isRTL && 'flex-row-reverse'
                )}
              >
                <div
                  className={cn(
                    'flex items-center gap-2',
                    isRTL && 'flex-row-reverse'
                  )}
                >
                  <div className='p-2 rounded-lg bg-primary/10'>
                    <Moon className='h-4 w-4 text-primary' />
                  </div>
                  <span className='text-sm font-medium'>
                    {language === 'ar' ? 'المظهر' : 'Theme'}
                  </span>
                </div>
                <ThemeToggle />
              </div>

              {/* Language Toggle Row */}
              <div
                className={cn(
                  'flex items-center justify-between p-3 rounded-lg bg-background/80 border hover:border-primary/50 transition-colors',
                  isRTL && 'flex-row-reverse'
                )}
              >
                <div
                  className={cn(
                    'flex items-center gap-2',
                    isRTL && 'flex-row-reverse'
                  )}
                >
                  <div className='p-2 rounded-lg bg-accent/10'>
                    <Globe className='h-4 w-4 text-accent' />
                  </div>
                  <span className='text-sm font-medium'>
                    {language === 'ar' ? 'اللغة' : 'Language'}
                  </span>
                </div>
                <LanguageToggle />
              </div>
            </div>
          </div>
        </SheetContent>
      </Sheet>

      {/* Cart Sheet - بس للـ Desktop */}
      <CartSheet open={isCartOpen} onOpenChange={setIsCartOpen} />
    </>
  )
}
