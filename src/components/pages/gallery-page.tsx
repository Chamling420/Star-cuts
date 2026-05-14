'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Image as ImageIcon,
  Plus,
  X,
  ChevronLeft,
  ChevronRight,
  Eye,
  Search,
  Upload,
  Loader2,
} from 'lucide-react'
import { useAppStore } from '@/store/use-app-store'
import type { GalleryImageType, UserRole } from '@/types'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useToast } from '@/hooks/use-toast'

const categories = ['All', 'Styling', 'Before & After', 'General']

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

function GallerySkeleton() {
  return (
    <div className="break-inside-avoid mb-4">
      <Skeleton className="h-64 w-full rounded-xl" />
    </div>
  )
}

function DualImageInput({ value, onChange, label }: { value: string; onChange: (v: string) => void; label?: string }) {
  const [mode, setMode] = useState<'url' | 'upload'>('url')
  const [uploading, setUploading] = useState(false)

  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    try {
      const formData = new FormData()
      formData.append('file', file)
      const res = await fetch('/api/upload', { method: 'POST', body: formData })
      const data = await res.json()
      if (data.url) onChange(data.url)
    } catch (err) {
      console.error('Upload failed', err)
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="space-y-2">
      {label && <Label>{label}</Label>}
      <div className="flex gap-2 mb-2">
        <Button type="button" size="sm" variant={mode === 'url' ? 'default' : 'outline'} onClick={() => setMode('url')}>
          URL
        </Button>
        <Button type="button" size="sm" variant={mode === 'upload' ? 'default' : 'outline'} onClick={() => setMode('upload')}>
          Upload
        </Button>
      </div>
      {mode === 'url' ? (
        <Input value={value} onChange={(e) => onChange(e.target.value)} placeholder="https://... or /images/..." />
      ) : (
        <div>
          <Input type="file" accept="image/*" onChange={handleFileUpload} disabled={uploading} />
          {uploading && <p className="text-xs text-muted-foreground mt-1">Uploading...</p>}
        </div>
      )}
      {value && (
        <div className="mt-2 relative w-20 h-20 rounded-lg overflow-hidden bg-muted">
          <img src={value} alt="Preview" className="w-full h-full object-cover" onError={(e) => { e.currentTarget.style.display = 'none' }} />
        </div>
      )}
    </div>
  )
}

export function GalleryPage() {
  const { data: session } = useSession()
  const { toast } = useToast()
  const { lightboxOpen, lightboxIndex, setLightbox } = useAppStore()

  const [images, setImages] = useState<GalleryImageType[]>([])
  const [loading, setLoading] = useState(true)
  const [activeCategory, setActiveCategory] = useState('All')
  const [showBefore, setShowBefore] = useState(false)

  // Upload form state
  const [uploadOpen, setUploadOpen] = useState(false)
  const [uploadLoading, setUploadLoading] = useState(false)
  const [uploadForm, setUploadForm] = useState({
    title: '',
    category: 'Styling',
    image: '',
    beforeImage: '',
    description: '',
  })

  const userRole = (session?.user as any)?.role as UserRole | undefined
  const isAdmin = userRole === 'ADMIN' || userRole === 'SUPER_ADMIN'

  useEffect(() => {
    const fetchGallery = async () => {
      setLoading(true)
      try {
        const params = new URLSearchParams()
        if (activeCategory !== 'All') {
          params.set('category', activeCategory)
        }
        const res = await fetch(`/api/gallery?${params.toString()}`)
        if (res.ok) {
          const data = await res.json()
          setImages(Array.isArray(data) ? data : data.images ?? [])
        }
      } catch {
        // silently handle
      } finally {
        setLoading(false)
      }
    }
    fetchGallery()
  }, [activeCategory])

  const handleUpload = async () => {
    setUploadLoading(true)
    try {
      const res = await fetch('/api/gallery', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(uploadForm),
      })
      if (res.ok) {
        toast({
          title: 'Image uploaded!',
          description: 'Your gallery image has been added successfully.',
        })
        setUploadOpen(false)
        setUploadForm({
          title: '',
          category: 'Styling',
          image: '',
          beforeImage: '',
          description: '',
        })
        // Refresh
        const params = new URLSearchParams()
        if (activeCategory !== 'All') params.set('category', activeCategory)
        const refreshRes = await fetch(`/api/gallery?${params.toString()}`)
        if (refreshRes.ok) {
          const data = await refreshRes.json()
          setImages(Array.isArray(data) ? data : data.images ?? [])
        }
      } else {
        toast({
          title: 'Upload failed',
          description: 'Could not upload the image. Please try again.',
          variant: 'destructive',
        })
      }
    } catch {
      toast({
        title: 'Upload failed',
        description: 'An error occurred. Please try again.',
        variant: 'destructive',
      })
    } finally {
      setUploadLoading(false)
    }
  }

  const openLightboxAt = (index: number) => {
    setLightbox(true, index)
  }

  const closeLightbox = () => {
    setLightbox(false)
    setShowBefore(false)
  }

  const navigateLightbox = (direction: 'prev' | 'next') => {
    const newIndex =
      direction === 'prev'
        ? (lightboxIndex - 1 + images.length) % images.length
        : (lightboxIndex + 1) % images.length
    setLightbox(true, newIndex)
    setShowBefore(false)
  }

  const currentImage = images[lightboxIndex]

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
            Our Gallery
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mx-auto mt-4 max-w-2xl text-lg text-white/80 md:text-xl"
          >
            Browse our portfolio of stunning transformations and creative work
          </motion.p>
        </div>
      </section>

      {/* Filters + Upload */}
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

            {/* Admin Upload Button */}
            {isAdmin && (
              <Dialog open={uploadOpen} onOpenChange={setUploadOpen}>
                <DialogTrigger asChild>
                  <Button
                    size="sm"
                    className="gradient-rose text-primary-foreground border-0 hover:opacity-90"
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Add Image
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add Gallery Image</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 pt-2">
                    <div className="space-y-2">
                      <Label htmlFor="gallery-title">Title</Label>
                      <Input
                        id="gallery-title"
                        placeholder="Enter image title"
                        value={uploadForm.title}
                        onChange={(e) =>
                          setUploadForm((prev) => ({
                            ...prev,
                            title: e.target.value,
                          }))
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Category</Label>
                      <Select
                        value={uploadForm.category}
                        onValueChange={(value) =>
                          setUploadForm((prev) => ({
                            ...prev,
                            category: value,
                          }))
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Styling">Styling</SelectItem>
                          <SelectItem value="Before & After">
                            Before & After
                          </SelectItem>
                          <SelectItem value="General">General</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <DualImageInput
                      value={uploadForm.image}
                      onChange={(v) => setUploadForm((prev) => ({ ...prev, image: v }))}
                      label="Image"
                    />
                    {uploadForm.category === 'Before & After' && (
                      <DualImageInput
                        value={uploadForm.beforeImage}
                        onChange={(v) => setUploadForm((prev) => ({ ...prev, beforeImage: v }))}
                        label="Before Image"
                      />
                    )}
                    <div className="space-y-2">
                      <Label htmlFor="gallery-desc">Description</Label>
                      <Textarea
                        id="gallery-desc"
                        placeholder="Describe the image..."
                        value={uploadForm.description}
                        onChange={(e) =>
                          setUploadForm((prev) => ({
                            ...prev,
                            description: e.target.value,
                          }))
                        }
                      />
                    </div>
                    <Button
                      onClick={handleUpload}
                      disabled={
                        uploadLoading ||
                        !uploadForm.title ||
                        !uploadForm.image
                      }
                      className="w-full gradient-rose text-primary-foreground border-0 hover:opacity-90"
                    >
                      {uploadLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Uploading...
                        </>
                      ) : (
                        <>
                          <Upload className="mr-2 h-4 w-4" />
                          Upload Image
                        </>
                      )}
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            )}
          </div>

          {/* Masonry Grid */}
          {loading ? (
            <div className="mt-10 columns-1 sm:columns-2 lg:columns-3 gap-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <GallerySkeleton key={i} />
              ))}
            </div>
          ) : images.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-20 flex flex-col items-center justify-center text-center"
            >
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted">
                <Search className="h-10 w-10 text-muted-foreground" />
              </div>
              <h3 className="mt-4 font-serif text-xl font-semibold">
                No images found
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
              className="mt-10 columns-1 sm:columns-2 lg:columns-3 gap-4"
            >
              {images.map((image, index) => (
                <motion.div
                  key={image.id}
                  variants={fadeInUp}
                  className="break-inside-avoid mb-4"
                >
                  <Card
                    className="group cursor-pointer overflow-hidden border-0 shadow-md transition-all duration-300 hover:shadow-xl"
                    onClick={() => openLightboxAt(index)}
                  >
                    <div className="relative overflow-hidden">
                      <img
                        src={image.image}
                        alt={image.title}
                        className="w-full object-cover transition-transform duration-500 group-hover:scale-110"
                        loading="lazy"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement
                          target.style.display = 'none'
                          target.nextElementSibling?.classList.remove('hidden')
                        }}
                      />
                      <div className="hidden h-64 w-full items-center justify-center gradient-rose">
                        <ImageIcon className="h-12 w-12 text-white/60" />
                      </div>

                      {/* Hover Overlay */}
                      <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                        <Eye className="h-8 w-8 text-white mb-2" />
                        <h3 className="text-lg font-semibold text-white px-4 text-center">
                          {image.title}
                        </h3>
                        {image.description && (
                          <p className="mt-1 text-sm text-white/80 px-4 text-center line-clamp-2">
                            {image.description}
                          </p>
                        )}
                      </div>

                      {/* Category Badge */}
                      <div className="absolute left-3 top-3">
                        <Badge
                          variant="secondary"
                          className="bg-white/90 text-foreground backdrop-blur-sm"
                        >
                          {image.category}
                        </Badge>
                      </div>

                      {/* Before & After Indicator */}
                      {image.beforeImage && (
                        <div className="absolute right-3 top-3">
                          <Badge className="gradient-rose text-primary-foreground border-0">
                            Before & After
                          </Badge>
                        </div>
                      )}
                    </div>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </section>

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxOpen && currentImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/90"
            onClick={closeLightbox}
          >
            {/* Close Button */}
            <button
              onClick={closeLightbox}
              className="absolute right-4 top-4 z-50 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-sm transition-colors hover:bg-white/20"
              aria-label="Close lightbox"
            >
              <X className="h-5 w-5" />
            </button>

            {/* Prev Button */}
            <button
              onClick={(e) => {
                e.stopPropagation()
                navigateLightbox('prev')
              }}
              className="absolute left-4 z-50 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-sm transition-colors hover:bg-white/20"
              aria-label="Previous image"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>

            {/* Next Button */}
            <button
              onClick={(e) => {
                e.stopPropagation()
                navigateLightbox('next')
              }}
              className="absolute right-4 z-50 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-sm transition-colors hover:bg-white/20"
              aria-label="Next image"
            >
              <ChevronRight className="h-6 w-6" />
            </button>

            {/* Image Display */}
            <motion.div
              key={lightboxIndex}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3 }}
              className="relative max-h-[85vh] max-w-[90vw]"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={
                  showBefore && currentImage.beforeImage
                    ? currentImage.beforeImage
                    : currentImage.image
                }
                alt={
                  showBefore
                    ? `Before - ${currentImage.title}`
                    : currentImage.title
                }
                className="max-h-[85vh] rounded-lg object-contain"
                onError={(e) => {
                  const target = e.target as HTMLImageElement
                  target.src = currentImage.image
                }}
              />

              {/* Info Bar */}
              <div className="absolute bottom-0 left-0 right-0 rounded-b-lg bg-gradient-to-t from-black/80 to-transparent p-6">
                <h3 className="text-xl font-semibold text-white">
                  {currentImage.title}
                </h3>
                {currentImage.description && (
                  <p className="mt-1 text-sm text-white/80">
                    {currentImage.description}
                  </p>
                )}

                {/* Before/After Toggle */}
                {currentImage.beforeImage && (
                  <Button
                    size="sm"
                    variant="outline"
                    className="mt-3 border-white/30 text-white hover:bg-white/20 hover:text-white"
                    onClick={(e) => {
                      e.stopPropagation()
                      setShowBefore(!showBefore)
                    }}
                  >
                    {showBefore ? 'Show After' : 'Show Before'}
                  </Button>
                )}
              </div>
            </motion.div>

            {/* Image Counter */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-sm text-white/60">
              {lightboxIndex + 1} / {images.length}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
