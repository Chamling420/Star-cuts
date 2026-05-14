export type UserRole = 'USER' | 'ADMIN' | 'SUPER_ADMIN'

export interface ServiceType {
  id: string
  title: string
  description: string
  price: number
  image?: string | null
  category: string
  duration: number
  featured: boolean
  active: boolean
  createdAt: string
  updatedAt: string
}

export interface ProductType {
  id: string
  title: string
  description: string
  price: number
  image?: string | null
  category: string
  brand?: string | null
  inStock: boolean
  featured: boolean
  createdAt: string
  updatedAt: string
}

export interface BookingType {
  id: string
  userId: string
  serviceId: string
  date: string
  time: string
  status: string
  notes?: string | null
  createdAt: string
  updatedAt: string
  service?: ServiceType
  user?: { name: string; email: string; phone?: string | null }
}

export interface MessageType {
  id: string
  name: string
  email: string
  message: string
  read: boolean
  createdAt: string
}

export interface GalleryImageType {
  id: string
  title: string
  image: string
  category: string
  beforeImage?: string | null
  description?: string | null
  active: boolean
  createdAt: string
}

export interface DashboardStats {
  totalBookings: number
  totalServices: number
  totalProducts: number
  totalUsers: number
  totalRevenue: number
  pendingBookings: number
  totalMessages: number
  unreadMessages: number
}

export const ROLE_PERMISSIONS = {
  USER: {
    label: 'User',
    description: 'Standard user - can browse, book appointments, and manage own profile',
    canAccessAdmin: false,
    canAccessSuperAdmin: false,
    canManageContent: false,
    canManageServices: false,
    canManageProducts: false,
    canManageGallery: false,
    canManageBookings: false,
    canManageUsers: false,
    canViewMessages: false,
  },
  ADMIN: {
    label: 'Administrator',
    description: 'Full management access - can edit all content across Home, About, Services, Products, Gallery, and Contact sections. Can add, edit, and delete services and products. Can manage bookings, gallery, and view messages.',
    canAccessAdmin: true,
    canAccessSuperAdmin: false,
    canManageContent: true,
    canManageServices: true,
    canManageProducts: true,
    canManageGallery: true,
    canManageBookings: true,
    canManageUsers: false,
    canViewMessages: true,
  },
  SUPER_ADMIN: {
    label: 'Super Administrator',
    description: 'Complete system control - all Administrator permissions plus user management, role assignment, analytics, and system settings. Has the authority to create, edit, and delete other admin users.',
    canAccessAdmin: true,
    canAccessSuperAdmin: true,
    canManageContent: true,
    canManageServices: true,
    canManageProducts: true,
    canManageGallery: true,
    canManageBookings: true,
    canManageUsers: true,
    canViewMessages: true,
  },
} as const

export type RolePermissionKey = keyof typeof ROLE_PERMISSIONS

export type PageRoute = 
  | 'home' 
  | 'about' 
  | 'services' 
  | 'products' 
  | 'gallery' 
  | 'contact' 
  | 'booking'
  | 'admin'
  | 'superadmin'
