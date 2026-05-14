'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useSession } from 'next-auth/react'
import {
  Star,
  ArrowRight,
  Sparkles,
  Calendar,
  ShoppingBag,
  ChevronRight,
  Quote,
  Image as ImageIcon,
} from 'lucide-react'
import { StarLogo } from '@/components/ui/star-logo'
import GalaxyAnimation from '@/components/ui/galaxy-animation'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { useAppStore } from '@/store/use-app-store'
import type { ServiceType, ProductType, GalleryImageType } from '@/types'

// ─── Animation Variants ─────────────────────────────────────────────
const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 },
}

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.12 },
  },
}

const staggerItem = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
}

// ─── Testimonials Data ──────────────────────────────────────────────
const testimonials = [
  {
    quote: 'Star Cuts transformed my hair completely! The balayage is absolutely stunning.',
    name: 'Sarah M.',
    initials: 'SM',
  },
  {
    quote: 'Best facial treatment I\'ve ever had. My skin has never looked better.',
    name: 'Emily R.',
    initials: 'ER',
  },
  {
    quote: 'The bridal hair and makeup package was worth every penny. I felt like a princess!',
    name: 'Jessica L.',
    initials: 'JL',
  },
  {
    quote: 'Always leave feeling like a million bucks. The team here truly cares about their clients.',
    name: 'Amanda K.',
    initials: 'AK',
  },
]

// ─── Category Badge Color Map ───────────────────────────────────────
const categoryColors: Record<string, string> = {
  hair: 'bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300',
  skin: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300',
  makeup: 'bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300',
  nails: 'bg-teal-100 text-teal-700 dark:bg-teal-900/40 dark:text-teal-300',
}

// ─── Image URL Helper ─────────────────────────────────────────────
function getImageUrl(image: string | null | undefined): string {
  if (!image) return ''
  // If image already starts with / or http, return as-is
  if (image.startsWith('/') || image.startsWith('http')) return image
  // If image starts with images/, prepend just /
  if (image.startsWith('images/')) return `/${image}`
  // Otherwise, prepend /images/
  return `/images/${image}`
}

// ─── Image Error Handler ────────────────────────────────────────────
function handleImageError(e: React.SyntheticEvent<HTMLImageElement>) {
  const target = e.currentTarget
  target.style.display = 'none'
  if (target.parentElement) {
    target.parentElement.classList.add('gradient-rose')
  }
}

// ─── Home Page Component ────────────────────────────────────────────
export default function HomePage() {
  const { data: session } = useSession()
  const { setCurrentPage, openLogin, addToCart } = useAppStore()

  // Content state
  const [content, setContent] = useState<Record<string, string>>({})

  // Data state
  const [services, setServices] = useState<ServiceType[]>([])
  const [products, setProducts] = useState<ProductType[]>([])
  const [gallery, setGallery] = useState<GalleryImageType[]>([])
  const [servicesLoading, setServicesLoading] = useState(true)
  const [productsLoading, setProductsLoading] = useState(true)
  const [galleryLoading, setGalleryLoading] = useState(true)

  // Fetch site content
  useEffect(() => {
    async function loadContent() {
      try {
        const res = await fetch('/api/content')
        if (res.ok) {
          const data = await res.json()
          const items: { section: string; key: string; value: string }[] = data.content || []
          const map: Record<string, string> = {}
          items.forEach((item) => {
            map[`${item.section}.${item.key}`] = item.value
          })
          setContent(map)
        }
      } catch (err) {
        console.error('Failed to load content:', err)
      }
    }
    loadContent()
  }, [])

  const get = (key: string, fallback: string) => content[key] || fallback

  // Fetch featured services
  useEffect(() => {
    fetch('/api/services?featured=true')
      .then((res) => res.json())
      .then((data) => {
        setServices(Array.isArray(data) ? data : data.services ?? [])
      })
      .catch(() => setServices([]))
      .finally(() => setServicesLoading(false))
  }, [])

  // Fetch featured products
  useEffect(() => {
    fetch('/api/products?featured=true')
      .then((res) => res.json())
      .then((data) => {
        setProducts(Array.isArray(data) ? data : data.products ?? [])
      })
      .catch(() => setProducts([]))
      .finally(() => setProductsLoading(false))
  }, [])

  // Fetch gallery images
  useEffect(() => {
    fetch('/api/gallery')
      .then((res) => res.json())
      .then((data) => {
        setGallery(Array.isArray(data) ? data : data.images ?? [])
      })
      .catch(() => setGallery([]))
      .finally(() => setGalleryLoading(false))
  }, [])

  // Book appointment handler
  const handleBookAppointment = () => {
    if (session) {
      setCurrentPage('booking')
    } else {
      openLogin()
    }
  }

  return (
    <div className="flex flex-col">
      {/* ─── Hero Section ────────────────────────────────────────── */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
        {/* Hero Background Image */}
        {get('hero.image') ? (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={get('hero.image')}
              alt="Star Cuts Salon"
              className="absolute inset-0 w-full h-full object-cover"
              crossOrigin="anonymous"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70" />
          </>
        ) : (
          <>
            <GalaxyAnimation />
            <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/50" />
          </>
        )}

        {/* Floating Decorations */}
        <motion.div
          className="absolute top-20 left-10 text-rose-300/20 hidden lg:block"
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        >
          <StarLogo size={56} className="opacity-20" />
        </motion.div>
        <motion.div
          className="absolute bottom-32 right-16 text-rose-300/20 hidden lg:block"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
        >
          <Sparkles className="h-20 w-20" />
        </motion.div>
        <motion.div
          className="absolute top-40 right-32 text-rose-300/15 hidden xl:block"
          animate={{ y: [0, -8, 0] }}
          transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
        >
          <Star className="h-12 w-12" />
        </motion.div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-4xl mx-auto text-center px-4 sm:px-6">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="flex flex-col items-center gap-6"
          >
            <motion.div variants={fadeUp} transition={{ duration: 0.8 }}>
              <Badge className="gradient-rose text-white border-0 px-4 py-1.5 text-sm font-medium">
                <Sparkles className="mr-1.5 h-3.5 w-3.5" />
                Premium Beauty Experience
              </Badge>
            </motion.div>

            <motion.h1
              variants={fadeUp}
              transition={{ duration: 0.8, delay: 0.15 }}
              className="font-serif text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-tight"
            >
              {get('hero.title', 'Where Beauty Meets Excellence')}
            </motion.h1>

            <motion.p
              variants={fadeUp}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="max-w-2xl text-lg sm:text-xl text-white/80 leading-relaxed"
            >
              {get('hero.subtitle', 'Experience premium hair styling, coloring, skincare & beauty services at Star Cuts Beauty Salon')}
            </motion.p>

            <motion.div
              variants={fadeUp}
              transition={{ duration: 0.8, delay: 0.45 }}
              className="flex flex-col sm:flex-row gap-4 mt-4"
            >
              <Button
                onClick={handleBookAppointment}
                size="lg"
                className="gradient-rose text-white border-0 px-8 py-6 text-lg font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
              >
                <Calendar className="mr-2 h-5 w-5" />
                {get('hero.cta_text', 'Book Appointment')}
              </Button>
              <Button
                onClick={() => setCurrentPage('services')}
                variant="outline"
                size="lg"
                className="px-8 py-6 text-lg font-semibold border-white/30 text-white bg-white/10 backdrop-blur-sm hover:bg-white/20 hover:text-white"
              >
                Explore Services
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </motion.div>
          </motion.div>
        </div>

        {/* Bottom Gradient Fade */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
      </section>

      {/* ─── Featured Services Section ───────────────────────────── */}
      <section className="section-padding bg-background">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            variants={staggerContainer}
            className="text-center mb-12"
          >
            <motion.div variants={staggerItem} className="flex items-center justify-center gap-2 mb-3">
              <Sparkles className="h-5 w-5 text-primary" />
              <span className="text-sm font-semibold uppercase tracking-widest text-primary">What We Offer</span>
            </motion.div>
            <motion.h2 variants={staggerItem} className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold">
              {get('services.title', 'Our Featured Services')}
            </motion.h2>
            <motion.p variants={staggerItem} className="mt-4 text-muted-foreground max-w-2xl mx-auto text-lg">
              {get('services.description', 'Discover our most popular treatments designed to make you look and feel your absolute best')}
            </motion.p>
          </motion.div>

          {servicesLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <Card key={i} className="overflow-hidden">
                  <Skeleton className="h-48 w-full rounded-none" />
                  <CardContent className="pt-4">
                    <Skeleton className="h-4 w-20 mb-3" />
                    <Skeleton className="h-6 w-3/4 mb-2" />
                    <Skeleton className="h-4 w-full mb-1" />
                    <Skeleton className="h-4 w-2/3" />
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Skeleton className="h-6 w-16" />
                    <Skeleton className="h-9 w-24" />
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : services.length === 0 ? (
            <div className="text-center py-16">
              <Sparkles className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">No Services Available</h3>
              <p className="text-muted-foreground">Check back soon for our featured services</p>
            </div>
          ) : (
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-50px' }}
              variants={staggerContainer}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {services.map((service) => (
                <motion.div key={service.id} variants={staggerItem}>
                  <Card className="group overflow-hidden hover:shadow-lg transition-all duration-300 h-full flex flex-col">
                    <div className="relative h-48 overflow-hidden bg-muted">
                      <img
                        src={getImageUrl(service.image)}
                        alt={service.title}
                        className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                        onError={handleImageError}
                      />
                      <Badge
                        className={`absolute top-3 left-3 ${categoryColors[service.category] || 'bg-gray-100 text-gray-700'}`}
                      >
                        {service.category.charAt(0).toUpperCase() + service.category.slice(1)}
                      </Badge>
                    </div>
                    <CardContent className="flex-1 pt-4">
                      <h3 className="font-serif text-lg font-semibold mb-2 line-clamp-1">{service.title}</h3>
                      <p className="text-muted-foreground text-sm line-clamp-2 mb-1">{service.description}</p>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground mt-2">
                        <Calendar className="h-3 w-3" />
                        <span>{service.duration} min</span>
                      </div>
                    </CardContent>
                    <CardFooter className="flex justify-between items-center">
                      <span className="text-lg font-bold text-primary">Rs {service.price}</span>
                      <Button
                        size="sm"
                        className="gradient-rose text-white border-0 hover:opacity-90"
                        onClick={handleBookAppointment}
                      >
                        Book Now
                      </Button>
                    </CardFooter>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          )}

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mt-10"
          >
            <Button
              variant="outline"
              size="lg"
              onClick={() => setCurrentPage('services')}
              className="gap-2"
            >
              View All Services
              <ChevronRight className="h-4 w-4" />
            </Button>
          </motion.div>
        </div>
      </section>

      {/* ─── Featured Products Section ───────────────────────────── */}
      <section className="section-padding bg-muted/50">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            variants={staggerContainer}
            className="text-center mb-12"
          >
            <motion.div variants={staggerItem} className="flex items-center justify-center gap-2 mb-3">
              <ShoppingBag className="h-5 w-5 text-primary" />
              <span className="text-sm font-semibold uppercase tracking-widest text-primary">Shop</span>
            </motion.div>
            <motion.h2 variants={staggerItem} className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold">
              {get('products.title', 'Shop Our Products')}
            </motion.h2>
            <motion.p variants={staggerItem} className="mt-4 text-muted-foreground max-w-2xl mx-auto text-lg">
              {get('products.subtitle', 'Take the salon experience home with our curated collection of premium beauty products')}
            </motion.p>
          </motion.div>

          {productsLoading ? (
            <div className="flex gap-6 overflow-x-auto pb-4 px-1 scrollbar-thin">
              {[1, 2, 3, 4].map((i) => (
                <Card key={i} className="min-w-[260px] max-w-[280px] flex-shrink-0 overflow-hidden">
                  <Skeleton className="h-40 w-full rounded-none" />
                  <CardContent className="pt-4">
                    <Skeleton className="h-5 w-3/4 mb-2" />
                    <Skeleton className="h-4 w-1/3" />
                  </CardContent>
                  <CardFooter>
                    <Skeleton className="h-9 w-full" />
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-16">
              <ShoppingBag className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">No Products Available</h3>
              <p className="text-muted-foreground">Check back soon for our curated products</p>
            </div>
          ) : (
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-50px' }}
              variants={staggerContainer}
              className="flex gap-6 overflow-x-auto pb-4 px-1 scrollbar-thin"
            >
              {products.map((product) => (
                <motion.div key={product.id} variants={staggerItem} className="min-w-[260px] max-w-[280px] flex-shrink-0">
                  <Card className="group overflow-hidden hover:shadow-lg transition-all duration-300 h-full flex flex-col">
                    <div className="relative h-40 overflow-hidden bg-muted">
                      <img
                        src={getImageUrl(product.image)}
                        alt={product.title}
                        className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                        onError={handleImageError}
                      />
                      {product.brand && (
                        <Badge variant="secondary" className="absolute top-3 right-3 text-xs">
                          {product.brand}
                        </Badge>
                      )}
                    </div>
                    <CardContent className="flex-1 pt-4">
                      <h3 className="font-semibold text-base line-clamp-1">{product.title}</h3>
                      <p className="text-muted-foreground text-sm line-clamp-2 mt-1">{product.description}</p>
                      <span className="text-lg font-bold text-primary mt-2 block">Rs {product.price.toFixed(2)}</span>
                    </CardContent>
                    <CardFooter>
                      <Button
                        className="w-full gradient-rose text-white border-0 hover:opacity-90"
                        size="sm"
                        onClick={() =>
                          addToCart({
                            id: product.id,
                            title: product.title,
                            price: product.price,
                            image: product.image,
                          })
                        }
                      >
                        <ShoppingBag className="mr-2 h-4 w-4" />
                        Add to Cart
                      </Button>
                    </CardFooter>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          )}

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mt-10"
          >
            <Button
              variant="outline"
              size="lg"
              onClick={() => setCurrentPage('products')}
              className="gap-2"
            >
              View All Products
              <ChevronRight className="h-4 w-4" />
            </Button>
          </motion.div>
        </div>
      </section>

      {/* ─── Testimonials Section ────────────────────────────────── */}
      <section className="section-padding relative overflow-hidden">
        {/* Subtle gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/5" />

        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            variants={staggerContainer}
            className="text-center mb-12"
          >
            <motion.div variants={staggerItem} className="flex items-center justify-center gap-2 mb-3">
              <Star className="h-5 w-5 text-primary" />
              <span className="text-sm font-semibold uppercase tracking-widest text-primary">Testimonials</span>
            </motion.div>
            <motion.h2 variants={staggerItem} className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold">
              What Our <span className="text-gradient">Clients</span> Say
            </motion.h2>
            <motion.p variants={staggerItem} className="mt-4 text-muted-foreground max-w-2xl mx-auto text-lg">
              Don&apos;t just take our word for it — hear from our beloved clients
            </motion.p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-50px' }}
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            {testimonials.map((testimonial, index) => (
              <motion.div key={index} variants={staggerItem}>
                <Card className="h-full glass-card hover:shadow-lg transition-all duration-300">
                  <CardContent className="pt-6">
                    <Quote className="h-8 w-8 text-primary/30 mb-3" />
                    <p className="text-foreground leading-relaxed mb-4 italic">
                      &ldquo;{testimonial.quote}&rdquo;
                    </p>
                    <div className="flex items-center gap-3">
                      {/* Avatar placeholder */}
                      <div className="h-10 w-10 rounded-full gradient-rose flex items-center justify-center text-white text-sm font-bold">
                        {testimonial.initials}
                      </div>
                      <div>
                        <p className="font-semibold text-sm">{testimonial.name}</p>
                        <div className="flex gap-0.5">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star
                              key={i}
                              className="h-3.5 w-3.5 fill-amber-400 text-amber-400"
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ─── Gallery Preview Section ─────────────────────────────── */}
      <section className="section-padding bg-muted/50">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            variants={staggerContainer}
            className="text-center mb-12"
          >
            <motion.div variants={staggerItem} className="flex items-center justify-center gap-2 mb-3">
              <ImageIcon className="h-5 w-5 text-primary" />
              <span className="text-sm font-semibold uppercase tracking-widest text-primary">Portfolio</span>
            </motion.div>
            <motion.h2 variants={staggerItem} className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold">
              {get('gallery.title', 'Our Work')}
            </motion.h2>
            <motion.p variants={staggerItem} className="mt-4 text-muted-foreground max-w-2xl mx-auto text-lg">
              {get('gallery.subtitle', 'A glimpse into the stunning transformations we create every day')}
            </motion.p>
          </motion.div>

          {galleryLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <Skeleton
                  key={i}
                  className={`h-48 rounded-xl ${i === 1 || i === 6 ? 'md:col-span-2 md:row-span-2 md:h-full' : ''}`}
                />
              ))}
            </div>
          ) : gallery.length === 0 ? (
            <div className="text-center py-16">
              <ImageIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Gallery Coming Soon</h3>
              <p className="text-muted-foreground">We&apos;re curating our best work for you</p>
            </div>
          ) : (
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-50px' }}
              variants={staggerContainer}
              className="grid grid-cols-2 md:grid-cols-3 gap-4"
            >
              {gallery.slice(0, 6).map((image, index) => (
                <motion.div
                  key={image.id}
                  variants={staggerItem}
                  className={`relative group overflow-hidden rounded-xl ${
                    index === 0 || index === 5 ? 'md:col-span-2 md:row-span-2' : ''
                  }`}
                >
                  <div className="h-48 md:h-full min-h-[200px] bg-muted">
                    <img
                      src={getImageUrl(image.image)}
                      alt={image.title}
                      className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-500"
                      onError={handleImageError}
                    />
                  </div>
                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors duration-300 flex items-end">
                    <div className="p-4 w-full translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                      <h3 className="text-white font-semibold text-sm">{image.title}</h3>
                      {image.description && (
                        <p className="text-white/70 text-xs mt-1 line-clamp-1">{image.description}</p>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mt-10"
          >
            <Button
              variant="outline"
              size="lg"
              onClick={() => setCurrentPage('gallery')}
              className="gap-2"
            >
              View Full Gallery
              <ChevronRight className="h-4 w-4" />
            </Button>
          </motion.div>
        </div>
      </section>

      {/* ─── CTA Banner Section ──────────────────────────────────── */}
      <section className="relative overflow-hidden">
        <div className="gradient-rose py-20 sm:py-28">
          {/* Decorative elements */}
          <motion.div
            className="absolute top-8 left-8 text-white/10 hidden md:block"
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
          >
            <StarLogo size={80} className="opacity-10" />
          </motion.div>
          <motion.div
            className="absolute bottom-8 right-8 text-white/10 hidden md:block"
            animate={{ rotate: [360, 0] }}
            transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
          >
            <Sparkles className="h-20 w-20" />
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="max-w-3xl mx-auto text-center px-4 relative z-10"
          >
            <motion.h2
              variants={fadeUp}
              transition={{ duration: 0.7 }}
              className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4"
            >
              Ready for Your Transformation?
            </motion.h2>
            <motion.p
              variants={fadeUp}
              transition={{ duration: 0.7, delay: 0.15 }}
              className="text-white/80 text-lg mb-8"
            >
              Book Your Appointment Today and let our expert stylists bring out your best self
            </motion.p>
            <motion.div variants={fadeUp} transition={{ duration: 0.7, delay: 0.3 }}>
              <Button
                size="lg"
                onClick={handleBookAppointment}
                className="bg-white text-primary hover:bg-white/90 px-10 py-6 text-lg font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
              >
                <Calendar className="mr-2 h-5 w-5" />
                Book Now
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
