"use client"

import type React from "react"
import { useState, useCallback } from "react"
import Image from "next/image"
import Link from "next/link"
import { Heart, ShoppingCart, Star } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import type { Product } from "@/lib/types"
import { formatPrice, calculateDiscount, getImageUrl, cn } from "@/lib/utils"
import { useCart } from "@/contexts/CartContext"
import { useWishlist } from "@/contexts/WishlistContext"
import { useAuth } from "@/contexts/AuthContext"
import { useLanguage } from "@/contexts/LanguageContext"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"

interface ProductCardProps {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  const router = useRouter()
  const { toast } = useToast()
  const { isAuthenticated } = useAuth()
  const { addToCart } = useCart()
  const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlist()
  const { t, language, isRTL } = useLanguage()

  const [imageLoaded, setImageLoaded] = useState(false)
  const [isAddingToCart, setIsAddingToCart] = useState(false)

  const discount = calculateDiscount(product.price, product.priceAfterDiscount)
  const finalPrice = product.priceAfterDiscount || product.price
  const isWishlisted = isInWishlist(product._id)

  const handleWishlistClick = useCallback(
    async (e: React.MouseEvent) => {
      e.preventDefault()
      e.stopPropagation()

      if (!isAuthenticated) {
        router.push("/login?callbackUrl=/shop")
        return
      }

      try {
        if (isWishlisted) {
          await removeFromWishlist(product._id)
          toast({
            title: t("removedFromWishlist"),
          })
        } else {
          await addToWishlist(product._id)
          toast({
            title: t("addedToWishlist"),
          })
        }
      } catch (error: any) {
        toast({
          title: t("error"),
          description: error.message,
          variant: "destructive",
        })
      }
    },
    [isAuthenticated, isWishlisted, product._id, router, t, toast, addToWishlist, removeFromWishlist],
  )

  const handleAddToCart = useCallback(
    async (e: React.MouseEvent) => {
      e.preventDefault()
      e.stopPropagation()

      if (!isAuthenticated) {
        router.push("/login?callbackUrl=/shop")
        return
      }

      setIsAddingToCart(true)

      try {
        await addToCart(product._id)
        toast({
          title: t("addedToCart"),
          description: product.title,
        })
      } catch (error: any) {
        toast({
          title: t("error"),
          description: error.message,
          variant: "destructive",
        })
      } finally {
        setIsAddingToCart(false)
      }
    },
    [isAuthenticated, product._id, product.title, router, t, toast, addToCart],
  )

  return (
    <Card className="group overflow-hidden hover:shadow-xl dark:hover:shadow-primary/10 transition-all duration-300 border-0 bg-card">
      <Link href={`/product/${product._id}`} className="block">
        {/* Image Container */}
        <div className="relative aspect-[3/4] overflow-hidden bg-secondary/50 dark:bg-secondary">
          <Image
            src={getImageUrl(product.imageCover) || "/placeholder.svg"}
            alt={product.title}
            fill
            className={cn(
              "object-cover transition-all duration-500 group-hover:scale-110",
              imageLoaded ? "opacity-100" : "opacity-0",
            )}
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            onLoad={() => setImageLoaded(true)}
          />

          {/* Badges */}
          <div
            className={cn(
              "absolute top-2 md:top-3 flex flex-col gap-1.5 md:gap-2 z-10",
              isRTL ? "right-2 md:right-3" : "left-2 md:left-3",
            )}
          >
            {discount > 0 && (
              <Badge className="bg-red-500 text-white text-[10px] sm:text-xs px-1.5 sm:px-2 h-5 sm:h-6">
                -{discount}%
              </Badge>
            )}
            {product.quantity === 0 && (
              <Badge variant="secondary" className="text-[10px] sm:text-xs px-1.5 sm:px-2 h-5 sm:h-6">
                {t("outOfStock")}
              </Badge>
            )}
            {product.createdAt && new Date(product.createdAt) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) && (
              <Badge className="bg-primary text-[10px] sm:text-xs px-1.5 sm:px-2 h-5 sm:h-6">{t("newArrivals")}</Badge>
            )}
          </div>

          {/* Quick Actions */}
          <div
            className={cn(
              "absolute top-2 md:top-3 flex flex-col gap-1.5 md:gap-2 opacity-0 group-hover:opacity-100 transition-opacity z-10",
              isRTL ? "left-2 md:left-3" : "right-2 md:right-3",
            )}
          >
            <Button
              size="icon"
              variant="secondary"
              className="h-7 w-7 sm:h-8 sm:w-8 md:h-9 md:w-9 rounded-full shadow-lg hover:scale-110 transition-transform focus-ring"
              onClick={handleWishlistClick}
              aria-label={isWishlisted ? t("removeFromWishlist") : t("addToWishlist")}
            >
              <Heart
                className={cn(
                  "h-3.5 w-3.5 sm:h-4 sm:w-4",
                  isWishlisted && "fill-red-500 text-red-500 dark:fill-red-400 dark:text-red-400",
                )}
              />
            </Button>
          </div>

          {/* Add to Cart - Hover */}
          <div className="absolute bottom-0 left-0 right-0 p-2 md:p-3 translate-y-full group-hover:translate-y-0 transition-transform z-10">
            <Button
              className="w-full gold-gradient text-xs md:text-sm h-8 sm:h-9 md:h-10 font-semibold shadow-lg focus-ring"
              onClick={handleAddToCart}
              disabled={product.quantity === 0 || isAddingToCart}
              aria-label={`${t("addToCart")} - ${product.title}`}
            >
              <ShoppingCart className={cn("h-3.5 w-3.5 md:h-4 md:w-4", isRTL ? "ml-1.5 md:ml-2" : "mr-1.5 md:mr-2")} />
              {isAddingToCart ? t("loading") : t("addToCart")}
            </Button>
          </div>
        </div>
      </Link>

      {/* Card Content */}
      <CardContent className="p-2.5 sm:p-3 md:p-4">
        {/* Category */}
        {product.category && (
          <p className="text-[10px] sm:text-xs text-muted-foreground mb-1 truncate">{product.category.name}</p>
        )}

        {/* Title */}
        <Link href={`/product/${product._id}`}>
          <h3 className="font-semibold text-xs sm:text-sm md:text-base mb-1.5 sm:mb-2 line-clamp-2 min-h-[2rem] sm:min-h-[2.5rem] md:min-h-[3rem] hover:text-primary transition-colors leading-tight">
            {product.title}
          </h3>
        </Link>

        {/* Rating */}
        <div className="flex items-center gap-0.5 sm:gap-1 mb-1.5 sm:mb-2 md:mb-3">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className={cn(
                "h-2.5 w-2.5 sm:h-3 sm:w-3 md:h-4 md:w-4",
                i < Math.floor(product.ratingsAverage)
                  ? "fill-yellow-400 text-yellow-400 dark:fill-yellow-500 dark:text-yellow-500"
                  : "text-gray-300 dark:text-gray-600",
              )}
              aria-hidden="true"
            />
          ))}
          <span className="text-[10px] sm:text-xs text-muted-foreground mr-0.5 sm:mr-1" aria-label="Rating">
            ({product.ratingsQuantity})
          </span>
        </div>

        {/* Price */}
        <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
          <span className="text-base sm:text-lg md:text-xl font-bold text-primary">
            {formatPrice(finalPrice)} {language === "ar" ? "ج.م" : "EGP"}
          </span>
          {product.priceAfterDiscount && (
            <span className="text-[10px] sm:text-xs md:text-sm text-muted-foreground line-through">
              {formatPrice(product.price)}
            </span>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
