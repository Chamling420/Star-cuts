'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { motion } from 'framer-motion'
import { Clock, Sparkles, Loader2, Search } from 'lucide-react'
import { useAppStore } from '@/store/use-app-store'
import type { ServiceType } from '@/types'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'

const categories = ['All', 'Hair', 'Skin', 'Makeup', 'Nails']

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 },
}

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
}

function ServiceSkeleton() {
  return (
    <Card className="overflow-hidden border-0 shadow-md">
      <Skeleton className="h-48 w-full" />
      <CardContent className="p-5">
        <Skeleton className="h-5 w-20" />
        <Skeleton className="mt-3 h-6 w-3/4" />
        <Skeleton className="mt-2 h-4 w-full" />
        <Skeleton className="mt-1 h-4 w-2/3" />
        <div className="mt-4 flex items-center justify-between">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-8 w-32" />
        </div>
      </CardContent>
    </Card>
  )
}

export function ServicesPage() {
  const { data: session } = useSession()
  const { setCurrentPage, openLogin } = useAppStore()

  const [services, setServices] = useState<ServiceType[]>([])
  const [loading, setLoading] = useState(true)
  const [activeCategory, setActiveCategory] = useState('All')

  useEffect(() => {
    const fetchServices = async () => {
      setLoading(true)
      try {
        const params = new URLSearchParams()
        if (activeCategory !== 'All') {
          params.set('category', activeCategory)
        }
        const res = await fetch(`/api/services?${params.toString()}`)
        if (res.ok) {
          const data = await res.json()
          setServices(Array.isArray(data) ? data : data.services ?? [])
        }
      } catch {
        // silently handle
      } finally {
        setLoading(false)
      }
    }
    fetchServices()
  }, [activeCategory])

  const handleBookService = () => {
    if (!session?.user) {
      openLogin()
    } else {
      setCurrentPage('booking')
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category.toLowerCase()) {
      case 'hair':
        return 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-300'
      case 'skin':
        return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300'
      case 'makeup':
        return 'bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-300'
      case 'nails':
        return 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300'
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
      case 'nails':
        return 'from-amber-400 to-orange-500'
      default:
        return 'from-rose-400 to-pink-500'
    }
  }

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
            Our Services
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mx-auto mt-4 max-w-2xl text-lg text-white/80 md:text-xl"
          >
            Discover our curated collection of beauty services designed to make
            you look and feel your absolute best
          </motion.p>
        </div>
      </section>

      {/* Category Filters */}
      <section className="section-padding">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-wrap items-center justify-center gap-2">
            {categories.map((category) => (
              <Button
                key={category}
                variant={activeCategory === category ? 'default' : 'outline'}
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

          {/* Services Grid */}
          {loading ? (
            <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <ServiceSkeleton key={i} />
              ))}
            </div>
          ) : services.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-20 flex flex-col items-center justify-center text-center"
            >
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted">
                <Search className="h-10 w-10 text-muted-foreground" />
              </div>
              <h3 className="mt-4 font-serif text-xl font-semibold">
                No services found
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
              className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
            >
              {services.map((service) => (
                <motion.div key={service.id} variants={fadeInUp}>
                  <Card className="group h-full overflow-hidden border-0 shadow-md transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                    {/* Image / Gradient Placeholder */}
                    <div className="relative h-48 overflow-hidden">
                      {service.image ? (
                        <img
                          src={service.image}
                          alt={service.title}
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
                        className={`flex h-full w-full items-center justify-center bg-gradient-to-br ${getGradientForCategory(service.category)} ${service.image ? 'hidden' : ''}`}
                      >
                        <Sparkles className="h-12 w-12 text-white/60" />
                      </div>
                      {/* Category Badge */}
                      <div className="absolute left-3 top-3">
                        <span
                          className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${getCategoryColor(service.category)}`}
                        >
                          {service.category}
                        </span>
                      </div>
                    </div>

                    <CardContent className="p-5">
                      <h3 className="font-serif text-lg font-semibold">
                        {service.title}
                      </h3>
                      <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                        {service.description}
                      </p>

                      <div className="mt-4 flex items-center justify-between">
                        <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                          <Clock className="h-4 w-4" />
                          <span>{service.duration} min</span>
                        </div>
                        <span className="text-2xl font-bold text-primary">
                          Rs {service.price}
                        </span>
                      </div>

                      <Button
                        onClick={handleBookService}
                        className="mt-4 w-full gradient-rose text-primary-foreground border-0 hover:opacity-90"
                        size="sm"
                      >
                        Book This Service
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </section>
    </div>
  )
}
