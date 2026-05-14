'use client'

import { useState, useEffect } from 'react'
import {
  Instagram,
  Facebook,
  Twitter,
  Youtube,
  MapPin,
  Phone,
  Mail,
  Clock,
  MessageCircle,
} from 'lucide-react'
import { useAppStore } from '@/store/use-app-store'
import { StarLogo } from '@/components/ui/star-logo'

const quickLinks = [
  { page: 'home' as const, label: 'Home' },
  { page: 'services' as const, label: 'Services' },
  { page: 'products' as const, label: 'Products' },
  { page: 'gallery' as const, label: 'Gallery' },
  { page: 'contact' as const, label: 'Contact' },
]

const serviceLinks = [
  { page: 'services' as const, label: 'Hair', category: 'hair' },
  { page: 'services' as const, label: 'Skin', category: 'skin' },
  { page: 'services' as const, label: 'Makeup', category: 'makeup' },
  { page: 'services' as const, label: 'Nails', category: 'nails' },
]

export function Footer() {
  const { setCurrentPage } = useAppStore()
  const [content, setContent] = useState<Record<string, string>>({})

  useEffect(() => {
    async function loadContent() {
      try {
        const res = await fetch('/api/content')
        if (res.ok) {
          const data = await res.json()
          const items: { section: string; key: string; value: string }[] =
            data.content || []
          const map: Record<string, string> = {}
          items.forEach((item) => {
            map[`${item.section}.${item.key}`] = item.value
          })
          setContent(map)
        }
      } catch (err) {
        console.error('Failed to load footer content:', err)
      }
    }
    loadContent()
  }, [])

  // Helper to get content value with fallback
  const get = (key: string, fallback: string) => content[key] || fallback

  const instagramUrl = get('footer.instagram', 'https://instagram.com')
  const facebookUrl = get('footer.facebook', 'https://facebook.com')
  const twitterUrl = get('footer.twitter', 'https://twitter.com')
  const youtubeUrl = get('footer.youtube', 'https://youtube.com')
  const whatsappNumber =
    get('contact.whatsapp', '') || get('footer.whatsapp', '')
  const tagline = get(
    'footer.tagline',
    'Experience luxury hair styling, coloring, skincare, and beauty services. Where elegance meets expertise for your perfect look.'
  )
  const copyright = get(
    'footer.copyright',
    'Star Cuts Beauty Salon. All rights reserved.'
  )
  const address = get('contact.address', 'Lazimpat, Kathmandu\nNepal')
  const phone = get('contact.phone', '+977-01-4567890')
  const email = get('contact.email', 'hello@starcuts.com')
  const hoursWeekday = get('contact.hours_weekday', '9am - 8pm')
  const hoursSat = get('contact.hours_saturday', '9am - 6pm')
  const hoursSun = get('contact.hours_sunday', '10am - 5pm')

  return (
    <footer className="mt-auto bg-primary text-primary-foreground">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {/* Logo & Tagline */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <StarLogo size={36} />
              <div className="flex flex-col">
                <span className="text-lg font-bold leading-tight">
                  Star Cuts
                </span>
                <span className="text-[10px] font-medium leading-tight text-primary-foreground/70">
                  Beauty Salon
                </span>
              </div>
            </div>
            <p className="text-sm leading-relaxed text-primary-foreground/80">
              {tagline}
            </p>
            <div className="flex items-center gap-3">
              <a
                href={instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-primary-foreground/10 transition-colors hover:bg-primary-foreground/20"
                aria-label="Instagram"
              >
                <Instagram className="h-4 w-4" />
              </a>
              <a
                href={facebookUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-primary-foreground/10 transition-colors hover:bg-primary-foreground/20"
                aria-label="Facebook"
              >
                <Facebook className="h-4 w-4" />
              </a>
              <a
                href={twitterUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-primary-foreground/10 transition-colors hover:bg-primary-foreground/20"
                aria-label="Twitter"
              >
                <Twitter className="h-4 w-4" />
              </a>
              <a
                href={youtubeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-primary-foreground/10 transition-colors hover:bg-primary-foreground/20"
                aria-label="YouTube"
              >
                <Youtube className="h-4 w-4" />
              </a>
              {whatsappNumber && (
                <a
                  href={`https://wa.me/${whatsappNumber.replace(/[^0-9]/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-primary-foreground/10 transition-colors hover:bg-primary-foreground/20"
                  aria-label="WhatsApp"
                >
                  <MessageCircle className="h-4 w-4" />
                </a>
              )}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider">
              Quick Links
            </h3>
            <ul className="flex flex-col gap-2">
              {quickLinks.map((link) => (
                <li key={link.label}>
                  <button
                    onClick={() => setCurrentPage(link.page)}
                    className="text-sm text-primary-foreground/80 transition-colors hover:text-primary-foreground"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider">
              Services
            </h3>
            <ul className="flex flex-col gap-2">
              {serviceLinks.map((link) => (
                <li key={link.category}>
                  <button
                    onClick={() => setCurrentPage(link.page)}
                    className="text-sm text-primary-foreground/80 transition-colors hover:text-primary-foreground"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider">
              Contact Info
            </h3>
            <ul className="flex flex-col gap-3">
              <li className="flex items-start gap-2">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-primary-foreground/60" />
                <span className="text-sm text-primary-foreground/80 whitespace-pre-line">
                  {address}
                </span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4 shrink-0 text-primary-foreground/60" />
                <a
                  href={`tel:${phone.replace(/[^0-9+]/g, '')}`}
                  className="text-sm text-primary-foreground/80 transition-colors hover:text-primary-foreground"
                >
                  {phone}
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4 shrink-0 text-primary-foreground/60" />
                <a
                  href={`mailto:${email}`}
                  className="text-sm text-primary-foreground/80 transition-colors hover:text-primary-foreground"
                >
                  {email}
                </a>
              </li>
              <li className="flex items-start gap-2">
                <Clock className="mt-0.5 h-4 w-4 shrink-0 text-primary-foreground/60" />
                <span className="text-sm text-primary-foreground/80">
                  Mon-Fri: {hoursWeekday}
                  <br />
                  Sat: {hoursSat}
                  <br />
                  Sun: {hoursSun}
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Copyright Bar */}
      <div className="border-t border-primary-foreground/10">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-4 py-4 sm:flex-row sm:px-6 lg:px-8">
          <p className="text-xs text-primary-foreground/60">
            &copy; {new Date().getFullYear()} {copyright}
          </p>
          <p className="text-xs text-primary-foreground/60">
            Crafted with passion for beauty
          </p>
        </div>
      </div>
    </footer>
  )
}
