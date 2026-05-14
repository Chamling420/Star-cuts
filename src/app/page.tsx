'use client'

import { useEffect, useRef } from 'react'
import { useAppStore } from '@/store/use-app-store'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { AuthDialog } from '@/components/auth/auth-dialog'
import HomePage from '@/components/pages/home-page'
import { AboutPage } from '@/components/pages/about-page'
import { ServicesPage } from '@/components/pages/services-page'
import { ProductsPage } from '@/components/pages/products-page'
import { GalleryPage } from '@/components/pages/gallery-page'
import { ContactPage } from '@/components/pages/contact-page'
import { BookingPage } from '@/components/pages/booking-page'
import AdminPanel from '@/components/pages/admin-panel'
import SuperAdminPanel from '@/components/pages/super-admin-panel'

const pageComponents: Record<string, React.ComponentType> = {
  home: HomePage,
  about: AboutPage,
  services: ServicesPage,
  products: ProductsPage,
  gallery: GalleryPage,
  contact: ContactPage,
  booking: BookingPage,
  admin: AdminPanel,
  superadmin: SuperAdminPanel,
}

const VALID_PAGES = ['home', 'about', 'services', 'products', 'gallery', 'contact', 'booking', 'admin', 'superadmin']

export default function Home() {
  const currentPage = useAppStore((s) => s.currentPage)
  const setCurrentPage = useAppStore((s) => s.setCurrentPage)
  const prevPageRef = useRef(currentPage)

  // Sync hash-based routing
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '') || 'home'
      if (VALID_PAGES.includes(hash)) {
        setCurrentPage(hash as any)
      }
    }

    // Set initial page from hash without triggering scroll
    const initialHash = window.location.hash.replace('#', '')
    if (initialHash && VALID_PAGES.includes(initialHash)) {
      useAppStore.setState({ currentPage: initialHash as any })
    }

    window.addEventListener('hashchange', handleHashChange)
    return () => window.removeEventListener('hashchange', handleHashChange)
  }, [setCurrentPage])

  // Scroll to top only when page actually changes (not on re-renders within the same page)
  useEffect(() => {
    if (prevPageRef.current !== currentPage) {
      prevPageRef.current = currentPage
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }, [currentPage])

  const PageComponent = pageComponents[currentPage] || HomePage

  return (
    <>
      <Header />
      <main className="flex-1">
        <PageComponent key={currentPage} />
      </main>
      <Footer />
      <AuthDialog />
    </>
  )
}
