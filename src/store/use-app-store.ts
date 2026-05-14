import { create } from 'zustand'
import type { PageRoute } from '@/types'

interface CartItem {
  id: string
  title: string
  price: number
  image?: string | null
  quantity: number
}

interface AppState {
  // Navigation
  currentPage: PageRoute
  setCurrentPage: (page: PageRoute) => void

  // Auth dialog
  authDialogOpen: boolean
  authDialogMode: 'login' | 'register'
  setAuthDialogOpen: (open: boolean) => void
  setAuthDialogMode: (mode: 'login' | 'register') => void
  openLogin: () => void
  openRegister: () => void

  // Cart
  cart: CartItem[]
  addToCart: (item: Omit<CartItem, 'quantity'>) => void
  removeFromCart: (id: string) => void
  updateQuantity: (id: string, quantity: number) => void
  clearCart: () => void
  cartTotal: () => number

  // Gallery lightbox
  lightboxOpen: boolean
  lightboxIndex: number
  setLightbox: (open: boolean, index?: number) => void

  // Mobile menu
  mobileMenuOpen: boolean
  setMobileMenuOpen: (open: boolean) => void

  // Admin tab
  adminTab: string
  setAdminTab: (tab: string) => void
}

export const useAppStore = create<AppState>((set, get) => ({
  // Navigation
  currentPage: 'home',
  setCurrentPage: (page) => {
    set({ currentPage: page, mobileMenuOpen: false })
    // Only update hash if it's actually different to avoid hashchange loops
    if (window.location.hash !== `#${page}`) {
      window.location.hash = page
    }
    // Scroll to top handled in page.tsx to avoid double-scroll from hashchange events
  },

  // Auth dialog
  authDialogOpen: false,
  authDialogMode: 'login',
  setAuthDialogOpen: (open) => set({ authDialogOpen: open }),
  setAuthDialogMode: (mode) => set({ authDialogMode: mode }),
  openLogin: () => set({ authDialogOpen: true, authDialogMode: 'login' }),
  openRegister: () => set({ authDialogOpen: true, authDialogMode: 'register' }),

  // Cart
  cart: [],
  addToCart: (item) => {
    const cart = get().cart
    const existing = cart.find((c) => c.id === item.id)
    if (existing) {
      set({
        cart: cart.map((c) =>
          c.id === item.id ? { ...c, quantity: c.quantity + 1 } : c
        ),
      })
    } else {
      set({ cart: [...cart, { ...item, quantity: 1 }] })
    }
  },
  removeFromCart: (id) => set({ cart: get().cart.filter((c) => c.id !== id) }),
  updateQuantity: (id, quantity) =>
    set({
      cart: get().cart.map((c) => (c.id === id ? { ...c, quantity } : c)),
    }),
  clearCart: () => set({ cart: [] }),
  cartTotal: () => get().cart.reduce((sum, item) => sum + item.price * item.quantity, 0),

  // Lightbox
  lightboxOpen: false,
  lightboxIndex: 0,
  setLightbox: (open, index = 0) => set({ lightboxOpen: open, lightboxIndex: index }),

  // Mobile menu
  mobileMenuOpen: false,
  setMobileMenuOpen: (open) => set({ mobileMenuOpen: open }),

  // Admin tab
  adminTab: 'dashboard',
  setAdminTab: (tab) => set({ adminTab: tab }),
}))
