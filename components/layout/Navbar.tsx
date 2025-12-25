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
    { href: '/', label: 'الرئيسية', ariaLabel: 'الصفحة الرئيسية' },
    { href: '/shop', label: 'المتجر', ariaLabel: 'صفحة المتجر' },
    {
      href: '/shop?category=abayas',
      label: 'عباءات',
      ariaLabel: 'تسوق عباءات',
    },
    { href: '/shop?category=hijabs', label: 'حجاب', ariaLabel: 'تسوق حجاب' },
    {
      href: '/shop?category=dresses',
      label: 'فساتين',
      ariaLabel: 'تسوق فساتين',
    },
    {
      href: '/shop?sale=true',
      label: 'التخفيضات',
      special: true,
      ariaLabel: 'صفحة التخفيضات',
    },
  ],
  en: [
    { href: '/', label: 'Home', ariaLabel: 'Home page' },
    { href: '/shop', label: 'Shop', ariaLabel: 'Shop page' },
    {
      href: '/shop?category=abayas',
      label: 'Abayas',
      ariaLabel: 'Shop abayas',
    },
    {
      href: '/shop?category=hijabs',
      label: 'Hijabs',
      ariaLabel: 'Shop hijabs',
    },
    {
      href: '/shop?category=dresses',
      label: 'Dresses',
      ariaLabel: 'Shop dresses',
    },
    {
      href: '/shop?sale=true',
      label: 'Sales',
      special: true,
      ariaLabel: 'Sales page',
    },
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
  const [showResults, setShowResults] = useState(false)

  const searchTimeoutRef = useRef<NodeJS.Timeout>()
  const searchInputRef = useRef<HTMLDivElement>(null)

  const wishlistCount = wishlist.length
  const navLinks = navLinksConfig[language]

  const handleScroll = useCallback(() => {
    setIsScrolled(window.scrollY > 10)
  }, [])

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [handleScroll])

  useEffect(() => {
    const handleRouteChange = () => {
      setIsMobileMenuOpen(false)
      setIsMobileSearchOpen(false)
      setShowResults(false)
    }
    handleRouteChange()
  }, [router])

  useEffect(() => {
    if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current)
    if (!searchQuery.trim()) {
      setSearchResults([])
      setShowResults(false)
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
        setShowResults(true)
      } catch (error) {
        setSearchResults([])
      } finally {
        setIsSearching(false)
      }
    }, 400)
  }, [searchQuery])

  const handleSearch = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault()
      if (searchQuery.trim()) {
        router.push(`/shop?search=${encodeURIComponent(searchQuery.trim())}`)
        setSearchQuery('')
        setIsMobileSearchOpen(false)
        setShowResults(false)
      }
    },
    [searchQuery, router]
  )

  const toggleMobileMenu = useCallback(() => {
    setIsMobileMenuOpen((prev) => !prev)
    setIsMobileSearchOpen(false)
  }, [])

  const toggleMobileSearch = useCallback(() => {
    setIsMobileSearchOpen((prev) => !prev)
    setIsMobileMenuOpen(false)
  }, [])

  return (
    <>
      <header
        className={cn(
          'sticky top-0 z-50 w-full border-b transition-all duration-300',
          'bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60',
          isScrolled && 'shadow-lg border-border/40'
        )}
      >
        {/* Top Banner */}
        <div className='relative overflow-hidden bg-gradient-to-r from-primary via-accent to-primary text-white'>
          <div className='absolute inset-0 bg-[url("/pattern.svg")] opacity-10' />
          <div className='container mx-auto px-4 py-2 sm:py-2.5 relative'>
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className='text-center text-xs sm:text-sm font-semibold flex items-center justify-center gap-4 flex-wrap'
            >
              <span className='flex items-center gap-1.5'>
                <Sparkles className='h-3.5 w-3.5' /> {t('freeShipping')}
              </span>
              <span className='hidden sm:inline opacity-50'>•</span>
              <span className='flex items-center gap-1.5'>
                <Tag className='h-3.5 w-3.5' /> {t('discount')}
              </span>
            </motion.div>
          </div>
        </div>

        <div className='container mx-auto px-3 sm:px-4'>
          {/* Row 1: Logo, Search, Actions */}
          <div className='flex h-14 sm:h-16 md:h-20 items-center justify-between gap-2 sm:gap-3'>
            <Button
              variant='ghost'
              size='icon'
              className='lg:hidden rounded-xl'
              onClick={toggleMobileMenu}
            >
              {isMobileMenuOpen ? (
                <X className='h-5 w-5' />
              ) : (
                <Menu className='h-5 w-5' />
              )}
            </Button>

            <Link href='/' className='flex items-center gap-2 group'>
              <motion.div
                className='text-xl md:text-3xl font-black'
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span className='bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent'>
                  {t('brandName')}
                </span>
              </motion.div>
            </Link>

            {/* Desktop Search */}
            <div
              className='hidden md:flex flex-1 max-w-xl mx-4 lg:mx-8 relative'
              ref={searchInputRef}
            >
              <form onSubmit={handleSearch} className='relative w-full group'>
                <Search
                  className={cn(
                    'absolute top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground',
                    isRTL ? 'right-3.5' : 'left-3.5'
                  )}
                />
                <Input
                  type='search'
                  placeholder={t('search')}
                  className={cn(
                    'w-full h-11 rounded-full border-2 focus:border-primary bg-card/50',
                    isRTL ? 'pr-10 pl-4' : 'pl-10 pr-4'
                  )}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => searchQuery && setShowResults(true)}
                />
                {isSearching && (
                  <Loader2
                    className={cn(
                      'absolute top-1/2 -translate-y-1/2 h-4 w-4 animate-spin text-primary',
                      isRTL ? 'left-3.5' : 'right-3.5'
                    )}
                  />
                )}
              </form>

              <AnimatePresence>
                {showResults && searchResults.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    className='absolute top-full mt-2 w-full bg-card rounded-2xl shadow-2xl border overflow-hidden z-50'
                  >
                    <div className='p-2 max-h-96 overflow-y-auto'>
                      {searchResults.map((product) => (
                        <button
                          key={product._id}
                          onClick={() => router.push(`/product/${product._id}`)}
                          className='w-full flex items-center gap-3 p-2.5 hover:bg-accent/10 rounded-xl group'
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
                              'flex-1 min-w-0 flex flex-col',
                              isRTL ? 'text-right' : 'text-left'
                            )}
                          >
                            <p className='font-semibold text-sm line-clamp-1'>
                              {product.title}
                            </p>
                            <p className='text-xs text-muted-foreground mt-0.5'>
                              {product.price}{' '}
                              {language === 'ar' ? 'جنيه' : 'EGP'}
                            </p>
                          </div>
                          <ArrowRight className='h-4 w-4 text-muted-foreground' />
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Actions Icons */}
            <div className='flex items-center gap-1 sm:gap-2'>
              <ThemeToggle />
              <LanguageToggle />
              <Button
                variant='ghost'
                size='icon'
                className='md:hidden h-10 w-10 rounded-xl'
                onClick={toggleMobileSearch}
              >
                <Search className='h-5 w-5' />
              </Button>

              {/* Profile Dropdown - رجع كما كان بالضبط */}
              {isAuthenticated && user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant='ghost'
                      className='relative h-10 px-2 md:px-3 hover:bg-primary/10 rounded-full transition-all'
                    >
                      <div className='flex items-center gap-2'>
                        <div className='relative'>
                          <Avatar className='h-8 w-8 md:h-9 md:w-9 ring-2 ring-primary/20 ring-offset-2 transition-all hover:ring-primary/40'>
                            <AvatarImage
                              src={user.profileImg}
                              alt={user.name}
                            />
                            <AvatarFallback className='bg-gradient-to-br from-primary to-accent text-white font-bold text-sm'>
                              {user.name.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <span className='absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-green-500 ring-2 ring-white' />
                        </div>
                        <span className='hidden md:inline-block text-sm font-semibold max-w-[100px] truncate'>
                          {user.name.split(' ')[0]}
                        </span>
                      </div>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align='end'
                    className='w-72 bg-card text-card-foreground shadow-2xl border border-border rounded-2xl p-3 z-[100]'
                    sideOffset={10}
                  >
                    <DropdownMenuLabel className='pb-3'>
                      <div className='flex items-center gap-3'>
                        <div className='relative'>
                          <Avatar className='h-14 w-14 ring-2 ring-primary/30'>
                            <AvatarImage
                              src={user.profileImg}
                              alt={user.name}
                            />
                            <AvatarFallback className='bg-gradient-to-br from-primary to-accent text-white text-xl font-bold'>
                              {user.name.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <div className='absolute -bottom-1 -right-1 bg-green-500 rounded-full p-1 ring-2 ring-white'>
                            <div className='h-2 w-2 rounded-full bg-white' />
                          </div>
                        </div>
                        <div className='flex-1 min-w-0'>
                          <p className='text-sm font-bold leading-tight flex items-center gap-1 mb-1'>
                            <span className='truncate'>{user.name}</span>
                            {user.role === 'admin' && (
                              <Crown className='h-4 w-4 text-amber-500 flex-shrink-0' />
                            )}
                          </p>
                          <p className='text-xs text-muted-foreground truncate mb-2'>
                            {user.email}
                          </p>
                          <Badge
                            variant='secondary'
                            className='text-[10px] font-semibold'
                          >
                            {user.role === 'admin' ? t('admin') : t('customer')}
                          </Badge>
                        </div>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      asChild
                      className='cursor-pointer py-2.5 rounded-xl hover:bg-primary/5'
                    >
                      <Link href='/profile' className='flex items-center'>
                        <UserCircle className='ml-2 h-4 w-4 text-primary' />
                        <span className='font-medium'>{t('myProfile')}</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      asChild
                      className='cursor-pointer py-2.5 rounded-xl hover:bg-primary/5'
                    >
                      <Link
                        href='/profile/orders'
                        className='flex items-center'
                      >
                        <Package className='ml-2 h-4 w-4 text-primary' />
                        <span className='font-medium'>{t('myOrders')}</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      asChild
                      className='cursor-pointer py-2.5 rounded-xl hover:bg-primary/5'
                    >
                      <Link
                        href='/profile/addresses'
                        className='flex items-center'
                      >
                        <MapPin className='ml-2 h-4 w-4 text-primary' />
                        <span className='font-medium'>{t('myAddresses')}</span>
                      </Link>
                    </DropdownMenuItem>
                    {user.role === 'admin' && (
                      <>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          asChild
                          className='cursor-pointer py-2.5 rounded-xl bg-gradient-to-r from-amber-50 to-yellow-50 hover:from-amber-100 hover:to-yellow-100'
                        >
                          <Link
                            href='/admin'
                            className='flex items-center font-semibold'
                          >
                            <Crown className='ml-2 h-4 w-4 text-amber-600' />
                            <span className='text-amber-900'>
                              {t('dashboard')}
                            </span>
                          </Link>
                        </DropdownMenuItem>
                      </>
                    )}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={logout}
                      className='text-red-600 cursor-pointer py-2.5 rounded-xl hover:bg-red-50 hover:text-red-700 font-semibold'
                    >
                      <LogOut className='ml-2 h-4 w-4' /> {t('logout')}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Link href='/login'>
                  <Button
                    size='sm'
                    className='rounded-full h-10 px-4 font-bold shadow-md'
                  >
                    <User className='h-4 w-4 mr-1.5' /> {t('login')}
                  </Button>
                </Link>
              )}

              <Link href='/wishlist'>
                <Button
                  variant='ghost'
                  size='icon'
                  className='relative h-10 w-10 rounded-xl'
                >
                  <Heart
                    className={cn(
                      'h-5 w-5',
                      wishlistCount > 0 && 'fill-red-500 text-red-500'
                    )}
                  />
                  {wishlistCount > 0 && (
                    <Badge className='absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center text-[10px] bg-red-500 text-white rounded-full'>
                      {wishlistCount}
                    </Badge>
                  )}
                </Button>
              </Link>

              <Button
                variant='ghost'
                size='icon'
                className='relative h-10 w-10 rounded-xl'
                onClick={() => setIsCartOpen(true)}
              >
                <ShoppingCart className='h-5 w-5' />
                {itemsCount > 0 && (
                  <Badge className='absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center text-[10px] bg-primary text-white rounded-full'>
                    {itemsCount}
                  </Badge>
                )}
              </Button>
            </div>
          </div>

          {/* Row 2: Categories */}
          <nav className='hidden lg:flex items-center justify-center gap-4 pb-3'>
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href}>
                <Button
                  variant='ghost'
                  className={cn(
                    'rounded-xl font-bold transition-all px-4 flex items-center gap-2',
                    link.special
                      ? 'text-red-600 hover:text-red-700 hover:bg-red-50'
                      : ''
                  )}
                >
                  {link.label}
                  {link.special && (
                    <motion.span
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ repeat: Infinity, duration: 1.2 }}
                      className='text-lg'
                    >
                      🔥
                    </motion.span>
                  )}
                </Button>
              </Link>
            ))}
          </nav>
        </div>

        {/* Mobile Search Overlay - مصلح لعرض النتائج */}
        <AnimatePresence>
          {isMobileSearchOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className='md:hidden border-t bg-background p-3 shadow-inner'
            >
              <form onSubmit={handleSearch} className='relative w-full mb-2'>
                <Search
                  className={cn(
                    'absolute top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground',
                    isRTL ? 'right-3' : 'left-3'
                  )}
                />
                <Input
                  autoFocus
                  type='search'
                  placeholder={t('search')}
                  className={cn(
                    'w-full h-10 rounded-xl bg-muted/50 border-none',
                    isRTL ? 'pr-9' : 'pl-9'
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
              {searchResults.length > 0 && searchQuery && (
                <div className='bg-card rounded-xl border p-2 max-h-60 overflow-y-auto'>
                  {searchResults.map((p) => (
                    <button
                      key={p._id}
                      onClick={() => {
                        router.push(`/product/${p._id}`)
                        setIsMobileSearchOpen(false)
                      }}
                      className='w-full flex items-center gap-3 p-2 hover:bg-muted rounded-lg text-xs font-bold'
                    >
                      <Image
                        src={p.imageCover}
                        alt=''
                        width={40}
                        height={40}
                        className='rounded'
                      />
                      {p.title}
                    </button>
                  ))}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Mobile Menu Overlay */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ height: 0 }}
              animate={{ height: 'auto' }}
              exit={{ height: 0 }}
              className='lg:hidden border-t bg-card/95 backdrop-blur-sm overflow-hidden'
            >
              <nav className='container mx-auto px-4 py-4 flex flex-col gap-1'>
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <Button
                      variant='ghost'
                      className={cn(
                        'w-full justify-start font-bold flex items-center gap-2',
                        link.special ? 'text-red-600' : ''
                      )}
                    >
                      {link.label}
                      {link.special && <span className='text-lg'>🔥</span>}
                    </Button>
                  </Link>
                ))}
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </header>
      <CartSheet open={isCartOpen} onOpenChange={setIsCartOpen} />
    </>
  )
}
