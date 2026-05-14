'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ShoppingBag,
  Plus,
  Minus,
  Trash2,
  X,
  Search,
  ShoppingCart,
  Package,
} from 'lucide-react'
import { useAppStore } from '@/store/use-app-store'
import type { ProductType } from '@/types'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from '@/components/ui/sheet'
import { Separator } from '@/components/ui/separator'
import { useToast } from '@/hooks/use-toast'

const categories = ['All', 'Hair', 'Skin', 'Makeup']

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 },
}

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
}

function ProductSkeleton() {
  return (
    <Card className="overflow-hidden border-0 shadow-md">
      <Skeleton className="h-44 w-full" />
      <CardContent className="p-4">
        <Skeleton className="h-5 w-16" />
        <Skeleton className="mt-2 h-5 w-3/4" />
        <Skeleton className="mt-1 h-4 w-1/2" />
        <Skeleton className="mt-3 h-6 w-20" />
        <Skeleton className="mt-3 h-9 w-full" />
      </CardContent>
    </Card>
  )
}

export function ProductsPage() {
  const { toast } = useToast()
  const {
    cart,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    cartTotal,
  } = useAppStore()

  const [products, setProducts] = useState<ProductType[]>([])
  const [loading, setLoading] = useState(true)
  const [activeCategory, setActiveCategory] = useState('All')
  const [cartOpen, setCartOpen] = useState(false)

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true)
      try {
        const params = new URLSearchParams()
        if (activeCategory !== 'All') {
          params.set('category', activeCategory)
        }
        const res = await fetch(`/api/products?${params.toString()}`)
        if (res.ok) {
          const data = await res.json()
          setProducts(Array.isArray(data) ? data : data.products ?? [])
        }
      } catch {
        // silently handle
      } finally {
        setLoading(false)
      }
    }
    fetchProducts()
  }, [activeCategory])

  const handleAddToCart = (product: ProductType) => {
    addToCart({
      id: product.id,
      title: product.title,
      price: product.price,
      image: product.image,
    })
    toast({
      title: 'Added to cart',
      description: `${product.title} has been added to your cart.`,
    })
  }

  const getCategoryColor = (category: string) => {
    switch (category.toLowerCase()) {
      case 'hair':
        return 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-300'
      case 'skin':
        return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300'
      case 'makeup':
        return 'bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-300'
      default:
        return 'bg-primary/10 text-primary'
    }
  }

  const getGradientForCategory = (category: string) => {
    switch (category.toLowerCase()) {
      case 'hair':
        return 'from-rose-400 to-pink-500'
      case 'skin':
        return 'from-emerald-400 to-teal-500'
      case 'makeup':
        return 'from-violet-400 to-purple-500'
      default:
        return 'from-rose-400 to-pink-500'
    }
  }

  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0)

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="gradient-rose relative overflow-hidden py-24 md:py-32">
        <div className="absolute inset-0 bg-[url('/noise.svg')] opacity-10" />
        <div className="relative mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="font-serif text-4xl font-bold text-white md:text-5xl lg:text-6xl"
          >
            Our Products
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mx-auto mt-4 max-w-2xl text-lg text-white/80 md:text-xl"
          >
            Premium beauty products handpicked by our experts for your daily
            care routine
          </motion.p>
        </div>
      </section>

      {/* Category Filters + Cart Button */}
      <section className="section-padding">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-2">
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={
                    activeCategory === category ? 'default' : 'outline'
                  }
                  size="sm"
                  onClick={() => setActiveCategory(category)}
                  className={
                    activeCategory === category
                      ? 'gradient-rose border-0 text-primary-foreground hover:opacity-90'
                      : ''
                  }
                >
                  {category}
                </Button>
              ))}
            </div>

            {/* Floating Cart Button */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCartOpen(true)}
              className="relative"
            >
              <ShoppingCart className="mr-2 h-4 w-4" />
              Cart
              {cartItemCount > 0 && (
                <Badge className="ml-2 flex h-5 w-5 items-center justify-center rounded-full p-0 text-[10px] gradient-rose text-primary-foreground border-0">
                  {cartItemCount}
                </Badge>
              )}
            </Button>
          </div>

          {/* Products Grid */}
          {loading ? (
            <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <ProductSkeleton key={i} />
              ))}
            </div>
          ) : products.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-20 flex flex-col items-center justify-center text-center"
            >
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted">
                <Search className="h-10 w-10 text-muted-foreground" />
              </div>
              <h3 className="mt-4 font-serif text-xl font-semibold">
                No products found
              </h3>
              <p className="mt-2 text-muted-foreground">
                Try selecting a different category
              </p>
            </motion.div>
          ) : (
            <motion.div
              initial="hidden"
              animate="visible"
              variants={staggerContainer}
              className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4"
            >
              {products.map((product) => (
                <motion.div key={product.id} variants={fadeInUp}>
                  <Card className="group h-full overflow-hidden border-0 shadow-md transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                    {/* Image / Gradient Placeholder */}
                    <div className="relative h-44 overflow-hidden">
                      {product.image ? (
                        <img
                          src={product.image}
                          alt={product.title}
                          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                          onError={(e) => {
                            ;(e.target as HTMLImageElement).style.display =
                              'none'
                            ;(
                              e.target as HTMLImageElement
                            ).nextElementSibling?.classList.remove('hidden')
                          }}
                        />
                      ) : null}
                      <div
                        className={`flex h-full w-full items-center justify-center bg-gradient-to-br ${getGradientForCategory(product.category)} ${product.image ? 'hidden' : ''}`}
                      >
                        <Package className="h-12 w-12 text-white/60" />
                      </div>
                      {/* Category Badge */}
                      <div className="absolute left-3 top-3">
                        <span
                          className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${getCategoryColor(product.category)}`}
                        >
                          {product.category}
                        </span>
                      </div>
                      {/* Stock Badge */}
                      <div className="absolute right-3 top-3">
                        <Badge
                          variant={product.inStock ? 'default' : 'destructive'}
                          className="text-[10px]"
                        >
                          {product.inStock ? 'In Stock' : 'Out of Stock'}
                        </Badge>
                      </div>
                    </div>

                    <CardContent className="p-4">
                      <h3 className="font-serif text-base font-semibold line-clamp-1">
                        {product.title}
                      </h3>
                      {product.brand && (
                        <p className="mt-0.5 text-xs text-muted-foreground">
                          {product.brand}
                        </p>
                      )}
                      <p className="mt-2 text-xl font-bold text-primary">
                        Rs {product.price.toFixed(2)}
                      </p>

                      <Button
                        onClick={() => handleAddToCart(product)}
                        className="mt-3 w-full gradient-rose text-primary-foreground border-0 hover:opacity-90"
                        size="sm"
                        disabled={!product.inStock}
                      >
                        <ShoppingBag className="mr-2 h-4 w-4" />
                        {product.inStock ? 'Add to Cart' : 'Out of Stock'}
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </section>

      {/* Shopping Cart Drawer */}
      <Sheet open={cartOpen} onOpenChange={setCartOpen}>
        <SheetContent side="right" className="flex w-full flex-col sm:max-w-md">
          <SheetHeader>
            <SheetTitle className="flex items-center gap-2">
              <ShoppingCart className="h-5 w-5" />
              Shopping Cart
              {cartItemCount > 0 && (
                <Badge className="gradient-rose border-0 text-primary-foreground">
                  {cartItemCount} {cartItemCount === 1 ? 'item' : 'items'}
                </Badge>
              )}
            </SheetTitle>
          </SheetHeader>

          {cart.length === 0 ? (
            <div className="flex flex-1 flex-col items-center justify-center text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted">
                <ShoppingBag className="h-8 w-8 text-muted-foreground" />
              </div>
              <p className="mt-3 font-medium">Your cart is empty</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Add some products to get started
              </p>
              <Button
                variant="outline"
                className="mt-4"
                onClick={() => setCartOpen(false)}
              >
                Continue Shopping
              </Button>
            </div>
          ) : (
            <>
              <div className="flex-1 overflow-y-auto py-4">
                <div className="space-y-4">
                  <AnimatePresence>
                    {cart.map((item) => (
                      <motion.div
                        key={item.id}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="flex items-center gap-3 rounded-lg border p-3"
                      >
                        {/* Item Image */}
                        <div className="h-14 w-14 flex-shrink-0 overflow-hidden rounded-md">
                          {item.image ? (
                            <img
                              src={item.image}
                              alt={item.title}
                              className="h-full w-full object-cover"
                              onError={(e) => {
                                ;(
                                  e.target as HTMLImageElement
                                ).style.display = 'none'
                              }}
                            />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center gradient-rose">
                              <Package className="h-6 w-6 text-primary-foreground" />
                            </div>
                          )}
                        </div>

                        {/* Item Info */}
                        <div className="flex-1 min-w-0">
                          <p className="truncate text-sm font-medium">
                            {item.title}
                          </p>
                          <p className="text-sm font-semibold text-primary">
                            Rs {(item.price * item.quantity).toFixed(2)}
                          </p>
                        </div>

                        {/* Quantity Controls */}
                        <div className="flex items-center gap-1">
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-7 w-7"
                            onClick={() => {
                              if (item.quantity <= 1) {
                                removeFromCart(item.id)
                              } else {
                                updateQuantity(item.id, item.quantity - 1)
                              }
                            }}
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <span className="w-8 text-center text-sm font-medium">
                            {item.quantity}
                          </span>
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-7 w-7"
                            onClick={() =>
                              updateQuantity(item.id, item.quantity + 1)
                            }
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>

                        {/* Remove */}
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 text-muted-foreground hover:text-destructive"
                          onClick={() => removeFromCart(item.id)}
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </div>

              <Separator />

              {/* Cart Footer */}
              <SheetFooter className="pt-4">
                <div className="w-full space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Total</span>
                    <span className="text-2xl font-bold text-primary">
                      Rs {cartTotal().toFixed(2)}
                    </span>
                  </div>
                  <Button className="w-full gradient-rose text-primary-foreground border-0 hover:opacity-90">
                    Checkout
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={clearCart}
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Clear Cart
                  </Button>
                </div>
              </SheetFooter>
            </>
          )}
        </SheetContent>
      </Sheet>

      {/* Floating Cart FAB (mobile) */}
      {cartItemCount > 0 && !cartOpen && (
        <button
          onClick={() => setCartOpen(true)}
          className="fixed bottom-6 right-6 z-40 flex h-14 w-14 items-center justify-center rounded-full gradient-rose shadow-lg transition-transform hover:scale-110 animate-pulse-glow"
          aria-label="Open cart"
        >
          <ShoppingCart className="h-6 w-6 text-primary-foreground" />
          <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-white text-xs font-bold text-primary">
            {cartItemCount}
          </span>
        </button>
      )}
    </div>
  )
}
