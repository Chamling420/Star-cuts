'use client'

import { useState, useEffect, useCallback } from 'react'
import { useSession } from 'next-auth/react'
import { useAppStore } from '@/store/use-app-store'
import { useToast } from '@/hooks/use-toast'

import type { ServiceType, ProductType, BookingType, MessageType, GalleryImageType, DashboardStats } from '@/types'
import { ROLE_PERMISSIONS } from '@/types'

// UI Components
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { Separator } from '@/components/ui/separator'
import { Switch } from '@/components/ui/switch'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Skeleton } from '@/components/ui/skeleton'

// Icons
import {
  LayoutDashboard,
  CalendarDays,
  Sparkles,
  ShoppingBag,
  MessageSquare,
  Image as ImageIcon,
  Plus,
  Pencil,
  Trash2,
  Check,
  X,
  Eye,
  Search,
  Clock,
  Users,
  ChevronDown,
  MoreHorizontal,
  Star,
  ShieldAlert,
  Crown,
  Menu,
  TrendingUp,
  Mail,
  MailOpen,
  ArrowUpRight,
  Banknote,
  CreditCard,
  PackageOpen,
  FileText,
  Save,
  Loader2,
  Settings,
} from 'lucide-react'

// ─── Types ────────────────────────────────────────────────────────────
interface StatsResponse {
  stats: DashboardStats
  topServices: { id: string; title: string; price: number; bookingsCount: number }[]
  bookingsByStatus: { status: string; count: number }[]
}

interface ContentItem {
  id: string
  section: string
  key: string
  value: string
  createdAt: string
  updatedAt: string
}

interface PaymentMethodItem {
  id: string
  type: string // bank | esewa | khalti | imepay
  accountHolderName?: string | null
  bankName?: string | null
  branchName?: string | null
  accountNumber?: string | null
  fullName?: string | null
  number?: string | null
  qrImage?: string | null
  active: boolean
  createdAt: string
  updatedAt: string
}

const TABS = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'bookings', label: 'Bookings', icon: CalendarDays },
  { id: 'services', label: 'Services', icon: Sparkles },
  { id: 'products', label: 'Products', icon: ShoppingBag },
  { id: 'messages', label: 'Messages', icon: MessageSquare },
  { id: 'gallery', label: 'Gallery', icon: ImageIcon },
  { id: 'content', label: 'Content', icon: FileText },
  { id: 'payments', label: 'Payments', icon: CreditCard },
  { id: 'settings', label: 'Settings', icon: Settings },
] as const

type TabId = (typeof TABS)[number]['id']

const SERVICE_CATEGORIES = ['hair', 'skin', 'makeup', 'nails']
const PRODUCT_CATEGORIES = ['hair', 'skin', 'makeup', 'nails']
const GALLERY_CATEGORIES = ['hair', 'skin', 'makeup', 'nails', 'general']
const BOOKING_STATUSES = ['PENDING', 'CONFIRMED', 'CANCELLED', 'COMPLETED']

const STATUS_COLORS: Record<string, string> = {
  PENDING: 'bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-400 dark:border-yellow-800',
  CONFIRMED: 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800',
  CANCELLED: 'bg-red-100 text-red-800 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800',
  COMPLETED: 'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800',
}

// ─── Dual Image Input Component ──────────────────────────────────────
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
      if (!res.ok) throw new Error('Upload failed')
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

// ─── Access Denied ────────────────────────────────────────────────────
function AccessDenied() {
  const { setCurrentPage } = useAppStore()
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6 p-8">
      <div className="w-20 h-20 rounded-full gradient-rose flex items-center justify-center">
        <ShieldAlert className="w-10 h-10 text-white" />
      </div>
      <h2 className="text-2xl font-bold text-foreground">Access Denied</h2>
      <p className="text-muted-foreground text-center max-w-md">
        You do not have permission to access the admin panel. Only administrators can view this area.
      </p>
      <Button onClick={() => setCurrentPage('home')} variant="outline">
        Return Home
      </Button>
    </div>
  )
}

// ─── Loading Skeleton ─────────────────────────────────────────────────
function TableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex gap-4">
          <Skeleton className="h-10 flex-1" />
          <Skeleton className="h-10 flex-1" />
          <Skeleton className="h-10 w-24" />
        </div>
      ))}
    </div>
  )
}

function CardSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <Skeleton key={i} className="h-32 rounded-xl" />
      ))}
    </div>
  )
}

// ─── Stat Card ────────────────────────────────────────────────────────
function StatCard({
  icon: Icon,
  value,
  label,
  change,
  gradient,
  warning,
}: {
  icon: React.ElementType
  value: number | string
  label: string
  change?: string
  gradient?: string
  warning?: boolean
}) {
  return (
    <Card className="relative overflow-hidden border-0 shadow-md hover:shadow-lg transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">{label}</p>
            <p className="text-3xl font-bold text-foreground">{value}</p>
            {change && (
              <div className="flex items-center gap-1 text-xs">
                <TrendingUp className="w-3 h-3 text-green-500" />
                <span className="text-green-600 dark:text-green-400">{change}</span>
              </div>
            )}
            {warning && Number(value) > 0 && (
              <div className="flex items-center gap-1 text-xs text-yellow-600 dark:text-yellow-400">
                <Clock className="w-3 h-3" />
                <span>Needs attention</span>
              </div>
            )}
          </div>
          <div
            className={`w-12 h-12 rounded-xl flex items-center justify-center ${
              gradient || 'bg-primary/10'
            }`}
          >
            <Icon
              className={`w-6 h-6 ${gradient ? 'text-white' : 'text-primary'}`}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// ─── Main Component ───────────────────────────────────────────────────
export default function AdminPanel() {
  const { data: session, status } = useSession()
  const { adminTab, setAdminTab } = useAppStore()
  const { toast } = useToast()

  const [sidebarOpen, setSidebarOpen] = useState(false)
  const currentTab = (TABS.find((t) => t.id === adminTab)?.id ?? 'dashboard') as TabId

  // Auth check
  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  const userRole = (session?.user as any)?.role
  if (userRole !== 'ADMIN' && userRole !== 'SUPER_ADMIN') {
    return <AccessDenied />
  }

  // Get role permissions for display
  const roleKey = userRole as keyof typeof ROLE_PERMISSIONS
  const permissions = ROLE_PERMISSIONS[roleKey]

  return (
    <div className="flex min-h-[calc(100vh-5rem)] relative">
      {/* Mobile sidebar toggle */}
      <Button
        variant="ghost"
        size="icon"
        className="lg:hidden fixed top-20 left-4 z-40 bg-background shadow-md rounded-lg"
        onClick={() => setSidebarOpen(!sidebarOpen)}
      >
        <Menu className="w-5 h-5" />
      </Button>

      {/* Sidebar overlay for mobile */}
      {sidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/40 z-30"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:sticky top-0 lg:top-[5rem] left-0 z-30 lg:z-0 h-screen lg:h-[calc(100vh-5rem)] w-60 bg-card border-r border-border flex flex-col transition-transform duration-300 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="p-6 border-b border-border">
          <h2 className="text-lg font-bold text-gradient">Admin Panel</h2>
          <p className="text-xs text-muted-foreground mt-1">Manage your salon</p>
        </div>
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {TABS.map((tab) => {
            const Icon = tab.icon
            const isActive = currentTab === tab.id
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setAdminTab(tab.id)
                  setSidebarOpen(false)
                }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'gradient-rose text-white shadow-md'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
                {tab.id === 'messages' && <MessagesBadge />}
              </button>
            )
          })}
        </nav>
        <div className="p-4 border-t border-border">
          <div className="flex items-center gap-3">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold ${userRole === 'SUPER_ADMIN' ? 'gradient-gold' : 'gradient-rose'}`}>
              {(session?.user?.name as string)?.[0]?.toUpperCase() || 'A'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{session?.user?.name || 'Admin'}</p>
              <p className="text-xs text-muted-foreground truncate">{permissions?.label || userRole}</p>
            </div>
            {userRole === 'SUPER_ADMIN' && (
              <Badge className="bg-gradient-to-r from-amber-500 to-purple-600 text-white border-0 text-[9px] px-1.5 py-0">
                <Crown className="mr-1 h-2.5 w-2.5" />
                SA
              </Badge>
            )}
          </div>
          {/* Role description */}
          <p className="mt-2 text-[10px] text-muted-foreground leading-relaxed line-clamp-2">
            {permissions?.description}
          </p>
          {/* Role permissions display */}
          <div className="mt-2 space-y-1">
            <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Permissions</p>
            <div className="flex flex-wrap gap-1">
              {permissions && Object.entries(permissions)
                .filter(([key]) => key.startsWith('can') && key !== 'canAccessAdmin' && key !== 'canAccessSuperAdmin')
                .map(([key, val]) => (
                  val ? (
                    <span key={key} className="text-[9px] px-1.5 py-0.5 rounded bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                      {key.replace('can', '').replace(/([A-Z])/g, ' $1').trim()}
                    </span>
                  ) : (
                    <span key={key} className="text-[9px] px-1.5 py-0.5 rounded bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400 line-through">
                      {key.replace('can', '').replace(/([A-Z])/g, ' $1').trim()}
                    </span>
                  )
                ))
              }
            </div>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 min-w-0 p-4 lg:p-8">
        {currentTab === 'dashboard' && <DashboardTab />}
        {currentTab === 'bookings' && <BookingsTab />}
        {currentTab === 'services' && <ServicesTab />}
        {currentTab === 'products' && <ProductsTab />}
        {currentTab === 'messages' && <MessagesTab />}
        {currentTab === 'gallery' && <GalleryTab />}
        {currentTab === 'content' && <ContentTab />}
        {currentTab === 'payments' && <PaymentsTab />}
        {currentTab === 'settings' && <SettingsTab />}
      </main>
    </div>
  )

  // ─── Messages Badge ──────────────────────────────────────────────
  function MessagesBadge() {
    const [count, setCount] = useState(0)
    useEffect(() => {
      fetch('/api/messages')
        .then((r) => r.json())
        .then((d) => {
          const unread = (d.messages as MessageType[])?.filter((m) => !m.read).length || 0
          setCount(unread)
        })
        .catch(() => {})
    }, [])
    if (count === 0) return null
    return (
      <span className="ml-auto bg-red-500 text-white text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center">
        {count}
      </span>
    )
  }
}

// ─── Dashboard Tab ────────────────────────────────────────────────────
function DashboardTab() {
  const [stats, setStats] = useState<StatsResponse | null>(null)
  const [recentBookings, setRecentBookings] = useState<BookingType[]>([])
  const [loading, setLoading] = useState(true)
  const { setAdminTab } = useAppStore()

  useEffect(() => {
    async function load() {
      try {
        const [statsRes, bookingsRes] = await Promise.all([
          fetch('/api/stats'),
          fetch('/api/bookings'),
        ])
        const statsData = await statsRes.json()
        const bookingsData = await bookingsRes.json()
        setStats(statsData)
        setRecentBookings((bookingsData.bookings || []).slice(0, 5))
      } catch (err) {
        console.error('Failed to load dashboard data', err)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  if (loading) return <CardSkeleton />

  const s = stats?.stats

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground text-sm mt-1">Welcome back! Here&apos;s an overview of your salon.</p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={CalendarDays}
          value={s?.totalBookings ?? 0}
          label="Total Bookings"
          change="+12.5%"
          gradient="gradient-rose"
        />
        <StatCard
          icon={Sparkles}
          value={s?.totalServices ?? 0}
          label="Total Services"
          change="+4.2%"
          gradient="gradient-gold"
        />
        <StatCard
          icon={ShoppingBag}
          value={s?.totalProducts ?? 0}
          label="Total Products"
          change="+8.1%"
        />
        <StatCard
          icon={Clock}
          value={s?.pendingBookings ?? 0}
          label="Pending Bookings"
          warning
        />
      </div>

      {/* Recent Bookings */}
      <Card className="border shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-lg font-semibold">Recent Bookings</CardTitle>
          <Button variant="ghost" size="sm" onClick={() => setAdminTab('bookings')}>
            View All <ArrowUpRight className="w-4 h-4 ml-1" />
          </Button>
        </CardHeader>
        <CardContent>
          {recentBookings.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <CalendarDays className="w-10 h-10 mx-auto mb-2 opacity-40" />
              <p>No bookings yet</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Customer</TableHead>
                  <TableHead>Service</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentBookings.map((b) => (
                  <TableRow key={b.id}>
                    <TableCell className="font-medium">{b.user?.name || 'N/A'}</TableCell>
                    <TableCell>{b.service?.title || 'N/A'}</TableCell>
                    <TableCell>{new Date(b.date).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <Badge className={STATUS_COLORS[b.status] || ''} variant="outline">
                        {b.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="flex flex-wrap gap-3">
        <Button onClick={() => setAdminTab('services')} variant="outline" className="gap-2">
          <Plus className="w-4 h-4" /> Add Service
        </Button>
        <Button onClick={() => setAdminTab('products')} variant="outline" className="gap-2">
          <Plus className="w-4 h-4" /> Add Product
        </Button>
      </div>
    </div>
  )
}

// ─── Bookings Tab ─────────────────────────────────────────────────────
function BookingsTab() {
  const { toast } = useToast()
  const [bookings, setBookings] = useState<BookingType[]>([])
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState<string>('all')

  const fetchBookings = useCallback(async () => {
    try {
      const url = statusFilter !== 'all' ? `/api/bookings?status=${statusFilter}` : '/api/bookings'
      const res = await fetch(url)
      const data = await res.json()
      setBookings(data.bookings || [])
    } catch {
      toast({ title: 'Error', description: 'Failed to fetch bookings', variant: 'destructive' })
    } finally {
      setLoading(false)
    }
  }, [statusFilter, toast])

  useEffect(() => {
    setLoading(true)
    fetchBookings()
  }, [fetchBookings])

  async function updateBookingStatus(id: string, status: string) {
    try {
      const res = await fetch('/api/bookings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status }),
      })
      if (!res.ok) throw new Error()
      toast({ title: 'Success', description: `Booking ${status.toLowerCase()}` })
      fetchBookings()
    } catch {
      toast({ title: 'Error', description: 'Failed to update booking', variant: 'destructive' })
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Bookings</h1>
          <p className="text-muted-foreground text-sm mt-1">Manage all customer bookings</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {['all', ...BOOKING_STATUSES].map((s) => (
            <Button
              key={s}
              variant={statusFilter === s ? 'default' : 'outline'}
              size="sm"
              onClick={() => setStatusFilter(s)}
            >
              {s === 'all' ? 'All' : s.charAt(0) + s.slice(1).toLowerCase()}
            </Button>
          ))}
        </div>
      </div>

      <Card className="border shadow-sm">
        <CardContent className="p-0">
          {loading ? (
            <div className="p-6"><TableSkeleton /></div>
          ) : bookings.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <CalendarDays className="w-12 h-12 mx-auto mb-3 opacity-40" />
              <p className="text-lg font-medium">No bookings found</p>
              <p className="text-sm">Bookings will appear here when customers book services.</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Service</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Time</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {bookings.map((b) => (
                  <TableRow key={b.id}>
                    <TableCell className="font-mono text-xs">{b.id.slice(0, 8)}</TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">{b.user?.name || 'N/A'}</p>
                        <p className="text-xs text-muted-foreground">{b.user?.email || ''}</p>
                      </div>
                    </TableCell>
                    <TableCell>{b.service?.title || 'N/A'}</TableCell>
                    <TableCell>{new Date(b.date).toLocaleDateString()}</TableCell>
                    <TableCell>{b.time}</TableCell>
                    <TableCell>
                      <Badge className={STATUS_COLORS[b.status] || ''} variant="outline">
                        {b.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          {b.status === 'PENDING' && (
                            <DropdownMenuItem onClick={() => updateBookingStatus(b.id, 'CONFIRMED')}>
                              <Check className="w-4 h-4 mr-2 text-green-600" /> Approve
                            </DropdownMenuItem>
                          )}
                          {(b.status === 'PENDING' || b.status === 'CONFIRMED') && (
                            <DropdownMenuItem onClick={() => updateBookingStatus(b.id, 'CANCELLED')}>
                              <X className="w-4 h-4 mr-2 text-red-600" /> Reject
                            </DropdownMenuItem>
                          )}
                          {b.status === 'CONFIRMED' && (
                            <DropdownMenuItem onClick={() => updateBookingStatus(b.id, 'COMPLETED')}>
                              <Check className="w-4 h-4 mr-2 text-blue-600" /> Mark Complete
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

// ─── Services Tab ─────────────────────────────────────────────────────
function ServicesTab() {
  const { toast } = useToast()
  const [services, setServices] = useState<ServiceType[]>([])
  const [loading, setLoading] = useState(true)
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingService, setEditingService] = useState<ServiceType | null>(null)
  const [deleteDialog, setDeleteDialog] = useState<ServiceType | null>(null)
  const [submitting, setSubmitting] = useState(false)

  // Form state
  const [formTitle, setFormTitle] = useState('')
  const [formDescription, setFormDescription] = useState('')
  const [formPrice, setFormPrice] = useState('')
  const [formCategory, setFormCategory] = useState('hair')
  const [formDuration, setFormDuration] = useState('60')
  const [formImage, setFormImage] = useState('')
  const [formFeatured, setFormFeatured] = useState(false)

  const fetchServices = useCallback(async () => {
    try {
      const url =
        categoryFilter !== 'all' ? `/api/services?category=${categoryFilter}` : '/api/services'
      const res = await fetch(url)
      const data = await res.json()
      setServices(data.services || [])
    } catch {
      toast({ title: 'Error', description: 'Failed to fetch services', variant: 'destructive' })
    } finally {
      setLoading(false)
    }
  }, [categoryFilter, toast])

  useEffect(() => {
    setLoading(true)
    fetchServices()
  }, [fetchServices])

  function openCreate() {
    setEditingService(null)
    setFormTitle('')
    setFormDescription('')
    setFormPrice('')
    setFormCategory('hair')
    setFormDuration('60')
    setFormImage('')
    setFormFeatured(false)
    setDialogOpen(true)
  }

  function openEdit(svc: ServiceType) {
    setEditingService(svc)
    setFormTitle(svc.title)
    setFormDescription(svc.description)
    setFormPrice(String(svc.price))
    setFormCategory(svc.category)
    setFormDuration(String(svc.duration))
    setFormImage(svc.image || '')
    setFormFeatured(svc.featured)
    setDialogOpen(true)
  }

  async function handleSubmit() {
    if (!formTitle || !formDescription || !formPrice) {
      toast({ title: 'Validation Error', description: 'Title, description, and price are required', variant: 'destructive' })
      return
    }
    setSubmitting(true)
    try {
      const body = {
        title: formTitle,
        description: formDescription,
        price: formPrice,
        category: formCategory,
        duration: parseInt(formDuration) || 60,
        image: formImage || null,
        featured: formFeatured,
      }
      const res = editingService
        ? await fetch('/api/services', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: editingService.id, ...body }),
          })
        : await fetch('/api/services', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body),
          })
      if (!res.ok) throw new Error()
      toast({
        title: 'Success',
        description: editingService ? 'Service updated' : 'Service created',
      })
      setDialogOpen(false)
      fetchServices()
    } catch {
      toast({ title: 'Error', description: 'Failed to save service', variant: 'destructive' })
    } finally {
      setSubmitting(false)
    }
  }

  async function handleDelete() {
    if (!deleteDialog) return
    try {
      const res = await fetch(`/api/services?id=${deleteDialog.id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error()
      toast({ title: 'Success', description: 'Service deleted' })
      fetchServices()
    } catch {
      toast({ title: 'Error', description: 'Failed to delete service', variant: 'destructive' })
    }
    setDeleteDialog(null)
  }

  async function toggleFeatured(svc: ServiceType) {
    try {
      const res = await fetch('/api/services', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: svc.id, featured: !svc.featured }),
      })
      if (!res.ok) throw new Error()
      fetchServices()
    } catch {
      toast({ title: 'Error', description: 'Failed to update', variant: 'destructive' })
    }
  }

  const filtered = services.filter(
    (s) =>
      s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.description.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Services</h1>
          <p className="text-muted-foreground text-sm mt-1">Manage your salon services</p>
        </div>
        <Button onClick={openCreate} className="gap-2">
          <Plus className="w-4 h-4" /> Add Service
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search services..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {SERVICE_CATEGORIES.map((c) => (
              <SelectItem key={c} value={c}>
                {c.charAt(0).toUpperCase() + c.slice(1)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Card className="border shadow-sm">
        <CardContent className="p-0">
          {loading ? (
            <div className="p-6"><TableSkeleton /></div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <Sparkles className="w-12 h-12 mx-auto mb-3 opacity-40" />
              <p className="text-lg font-medium">No services found</p>
              <p className="text-sm">Add your first service to get started.</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Image</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Duration</TableHead>
                  <TableHead>Featured</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((svc) => (
                  <TableRow key={svc.id}>
                    <TableCell>
                      {svc.image ? (
                        <img
                          src={svc.image}
                          alt={svc.title}
                          className="w-10 h-10 rounded-lg object-cover"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
                          <Sparkles className="w-4 h-4 text-muted-foreground" />
                        </div>
                      )}
                    </TableCell>
                    <TableCell className="font-medium">{svc.title}</TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="capitalize">
                        {svc.category}
                      </Badge>
                    </TableCell>
                    <TableCell>Rs {Number(svc.price).toFixed(2)}</TableCell>
                    <TableCell>{svc.duration} min</TableCell>
                    <TableCell>
                      <button onClick={() => toggleFeatured(svc)}>
                        <Star
                          className={`w-5 h-5 ${
                            svc.featured
                              ? 'text-yellow-500 fill-yellow-500'
                              : 'text-muted-foreground'
                          }`}
                        />
                      </button>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEdit(svc)}>
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-destructive"
                          onClick={() => setDeleteDialog(svc)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Service Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingService ? 'Edit Service' : 'Add Service'}</DialogTitle>
            <DialogDescription>
              {editingService ? 'Update service details' : 'Create a new service for your salon'}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="svc-title">Title</Label>
              <Input id="svc-title" value={formTitle} onChange={(e) => setFormTitle(e.target.value)} placeholder="Service name" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="svc-desc">Description</Label>
              <Textarea id="svc-desc" value={formDescription} onChange={(e) => setFormDescription(e.target.value)} placeholder="Describe the service" rows={3} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="svc-price">Price (Rs)</Label>
                <Input id="svc-price" type="number" step="0.01" value={formPrice} onChange={(e) => setFormPrice(e.target.value)} placeholder="0.00" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="svc-duration">Duration (min)</Label>
                <Input id="svc-duration" type="number" value={formDuration} onChange={(e) => setFormDuration(e.target.value)} placeholder="60" />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Category</Label>
              <Select value={formCategory} onValueChange={setFormCategory}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {SERVICE_CATEGORIES.map((c) => (
                    <SelectItem key={c} value={c}>
                      {c.charAt(0).toUpperCase() + c.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <DualImageInput value={formImage} onChange={setFormImage} label="Image" />
            <div className="flex items-center gap-2">
              <Checkbox id="svc-featured" checked={formFeatured} onCheckedChange={(checked) => setFormFeatured(checked === true)} />
              <Label htmlFor="svc-featured" className="cursor-pointer">Featured</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={submitting}>
              {submitting ? 'Saving...' : editingService ? 'Update' : 'Create'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteDialog} onOpenChange={() => setDeleteDialog(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Service</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete &quot;{deleteDialog?.title}&quot;? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

// ─── Products Tab ─────────────────────────────────────────────────────
function ProductsTab() {
  const { toast } = useToast()
  const [products, setProducts] = useState<ProductType[]>([])
  const [loading, setLoading] = useState(true)
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState<ProductType | null>(null)
  const [deleteDialog, setDeleteDialog] = useState<ProductType | null>(null)
  const [submitting, setSubmitting] = useState(false)

  // Form state
  const [formTitle, setFormTitle] = useState('')
  const [formDescription, setFormDescription] = useState('')
  const [formPrice, setFormPrice] = useState('')
  const [formCategory, setFormCategory] = useState('hair')
  const [formBrand, setFormBrand] = useState('')
  const [formImage, setFormImage] = useState('')
  const [formFeatured, setFormFeatured] = useState(false)
  const [formInStock, setFormInStock] = useState(true)

  const fetchProducts = useCallback(async () => {
    try {
      const url =
        categoryFilter !== 'all' ? `/api/products?category=${categoryFilter}` : '/api/products'
      const res = await fetch(url)
      const data = await res.json()
      setProducts(data.products || [])
    } catch {
      toast({ title: 'Error', description: 'Failed to fetch products', variant: 'destructive' })
    } finally {
      setLoading(false)
    }
  }, [categoryFilter, toast])

  useEffect(() => {
    setLoading(true)
    fetchProducts()
  }, [fetchProducts])

  function openCreate() {
    setEditingProduct(null)
    setFormTitle('')
    setFormDescription('')
    setFormPrice('')
    setFormCategory('hair')
    setFormBrand('')
    setFormImage('')
    setFormFeatured(false)
    setFormInStock(true)
    setDialogOpen(true)
  }

  function openEdit(prod: ProductType) {
    setEditingProduct(prod)
    setFormTitle(prod.title)
    setFormDescription(prod.description)
    setFormPrice(String(prod.price))
    setFormCategory(prod.category)
    setFormBrand(prod.brand || '')
    setFormImage(prod.image || '')
    setFormFeatured(prod.featured)
    setFormInStock(prod.inStock)
    setDialogOpen(true)
  }

  async function handleSubmit() {
    if (!formTitle || !formDescription || !formPrice) {
      toast({ title: 'Validation Error', description: 'Title, description, and price are required', variant: 'destructive' })
      return
    }
    setSubmitting(true)
    try {
      const body = {
        title: formTitle,
        description: formDescription,
        price: formPrice,
        category: formCategory,
        brand: formBrand || null,
        image: formImage || null,
        featured: formFeatured,
        inStock: formInStock,
      }
      const res = editingProduct
        ? await fetch('/api/products', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: editingProduct.id, ...body }),
          })
        : await fetch('/api/products', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body),
          })
      if (!res.ok) throw new Error()
      toast({
        title: 'Success',
        description: editingProduct ? 'Product updated' : 'Product created',
      })
      setDialogOpen(false)
      fetchProducts()
    } catch {
      toast({ title: 'Error', description: 'Failed to save product', variant: 'destructive' })
    } finally {
      setSubmitting(false)
    }
  }

  async function handleDelete() {
    if (!deleteDialog) return
    try {
      const res = await fetch(`/api/products?id=${deleteDialog.id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error()
      toast({ title: 'Success', description: 'Product deleted' })
      fetchProducts()
    } catch {
      toast({ title: 'Error', description: 'Failed to delete product', variant: 'destructive' })
    }
    setDeleteDialog(null)
  }

  const filtered = products.filter(
    (p) =>
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Products</h1>
          <p className="text-muted-foreground text-sm mt-1">Manage your salon products</p>
        </div>
        <Button onClick={openCreate} className="gap-2">
          <Plus className="w-4 h-4" /> Add Product
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {PRODUCT_CATEGORIES.map((c) => (
              <SelectItem key={c} value={c}>
                {c.charAt(0).toUpperCase() + c.slice(1)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Card className="border shadow-sm">
        <CardContent className="p-0">
          {loading ? (
            <div className="p-6"><TableSkeleton /></div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <ShoppingBag className="w-12 h-12 mx-auto mb-3 opacity-40" />
              <p className="text-lg font-medium">No products found</p>
              <p className="text-sm">Add your first product to get started.</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Image</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Brand</TableHead>
                  <TableHead>In Stock</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((prod) => (
                  <TableRow key={prod.id}>
                    <TableCell>
                      {prod.image ? (
                        <img
                          src={prod.image}
                          alt={prod.title}
                          className="w-10 h-10 rounded-lg object-cover"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
                          <ShoppingBag className="w-4 h-4 text-muted-foreground" />
                        </div>
                      )}
                    </TableCell>
                    <TableCell className="font-medium">{prod.title}</TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="capitalize">
                        {prod.category}
                      </Badge>
                    </TableCell>
                    <TableCell>Rs {Number(prod.price).toFixed(2)}</TableCell>
                    <TableCell>{prod.brand || '—'}</TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={
                          prod.inStock
                            ? 'bg-green-50 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-400'
                            : 'bg-red-50 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-400'
                        }
                      >
                        {prod.inStock ? 'In Stock' : 'Out of Stock'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEdit(prod)}>
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-destructive"
                          onClick={() => setDeleteDialog(prod)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Product Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingProduct ? 'Edit Product' : 'Add Product'}</DialogTitle>
            <DialogDescription>
              {editingProduct ? 'Update product details' : 'Create a new product for your salon'}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="prod-title">Title</Label>
              <Input id="prod-title" value={formTitle} onChange={(e) => setFormTitle(e.target.value)} placeholder="Product name" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="prod-desc">Description</Label>
              <Textarea id="prod-desc" value={formDescription} onChange={(e) => setFormDescription(e.target.value)} placeholder="Describe the product" rows={3} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="prod-price">Price (Rs)</Label>
                <Input id="prod-price" type="number" step="0.01" value={formPrice} onChange={(e) => setFormPrice(e.target.value)} placeholder="0.00" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="prod-brand">Brand</Label>
                <Input id="prod-brand" value={formBrand} onChange={(e) => setFormBrand(e.target.value)} placeholder="Brand name" />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Category</Label>
              <Select value={formCategory} onValueChange={setFormCategory}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {PRODUCT_CATEGORIES.map((c) => (
                    <SelectItem key={c} value={c}>
                      {c.charAt(0).toUpperCase() + c.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <DualImageInput value={formImage} onChange={setFormImage} label="Image" />
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <Checkbox id="prod-featured" checked={formFeatured} onCheckedChange={(checked) => setFormFeatured(checked === true)} />
                <Label htmlFor="prod-featured" className="cursor-pointer">Featured</Label>
              </div>
              <div className="flex items-center gap-2">
                <Checkbox id="prod-instock" checked={formInStock} onCheckedChange={(checked) => setFormInStock(checked === true)} />
                <Label htmlFor="prod-instock" className="cursor-pointer">In Stock</Label>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={submitting}>
              {submitting ? 'Saving...' : editingProduct ? 'Update' : 'Create'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteDialog} onOpenChange={() => setDeleteDialog(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Product</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete &quot;{deleteDialog?.title}&quot;? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

// ─── Messages Tab ─────────────────────────────────────────────────────
function MessagesTab() {
  const { toast } = useToast()
  const [messages, setMessages] = useState<MessageType[]>([])
  const [loading, setLoading] = useState(true)
  const [deleteDialog, setDeleteDialog] = useState<MessageType | null>(null)
  const [selectedMessage, setSelectedMessage] = useState<MessageType | null>(null)

  const fetchMessages = useCallback(async () => {
    try {
      const res = await fetch('/api/messages')
      const data = await res.json()
      setMessages(data.messages || [])
    } catch {
      toast({ title: 'Error', description: 'Failed to fetch messages', variant: 'destructive' })
    } finally {
      setLoading(false)
    }
  }, [toast])

  useEffect(() => {
    fetchMessages()
  }, [fetchMessages])

  async function markAsRead(msg: MessageType) {
    if (msg.read) return
    try {
      const res = await fetch('/api/messages', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: msg.id, read: true }),
      })
      if (!res.ok) throw new Error()
      fetchMessages()
    } catch {
      toast({ title: 'Error', description: 'Failed to mark as read', variant: 'destructive' })
    }
  }

  async function handleDelete() {
    if (!deleteDialog) return
    try {
      const res = await fetch(`/api/messages?id=${deleteDialog.id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error()
      toast({ title: 'Success', description: 'Message deleted' })
      if (selectedMessage?.id === deleteDialog.id) setSelectedMessage(null)
      fetchMessages()
    } catch {
      toast({ title: 'Error', description: 'Failed to delete message', variant: 'destructive' })
    }
    setDeleteDialog(null)
  }

  const unreadCount = messages.filter((m) => !m.read).length

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Messages</h1>
        <p className="text-muted-foreground text-sm mt-1">
          {unreadCount > 0 ? `You have ${unreadCount} unread message${unreadCount > 1 ? 's' : ''}` : 'All caught up!'}
        </p>
      </div>

      {loading ? (
        <CardSkeleton />
      ) : messages.length === 0 ? (
        <Card className="border shadow-sm">
          <CardContent className="py-12 text-center text-muted-foreground">
            <MessageSquare className="w-12 h-12 mx-auto mb-3 opacity-40" />
            <p className="text-lg font-medium">No messages yet</p>
            <p className="text-sm">Messages from the contact form will appear here.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Messages List */}
          <div className="lg:col-span-1 space-y-2 max-h-[70vh] overflow-y-auto pr-1">
            {messages.map((msg) => (
              <Card
                key={msg.id}
                className={`cursor-pointer transition-colors hover:bg-muted/50 border shadow-sm ${
                  selectedMessage?.id === msg.id ? 'ring-2 ring-primary' : ''
                } ${!msg.read ? 'bg-primary/5 border-primary/20' : ''}`}
                onClick={() => {
                  setSelectedMessage(msg)
                  markAsRead(msg)
                }}
              >
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2 min-w-0">
                      {!msg.read && <div className="w-2 h-2 rounded-full bg-primary shrink-0" />}
                      {msg.read ? (
                        <MailOpen className="w-4 h-4 text-muted-foreground shrink-0" />
                      ) : (
                        <Mail className="w-4 h-4 text-primary shrink-0" />
                      )}
                      <p className={`text-sm truncate ${!msg.read ? 'font-bold' : 'font-medium'}`}>
                        {msg.name}
                      </p>
                    </div>
                    <span className="text-xs text-muted-foreground shrink-0">
                      {new Date(msg.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1 truncate">{msg.email}</p>
                  <p className={`text-sm mt-1 line-clamp-2 ${!msg.read ? 'font-medium' : ''}`}>
                    {msg.message}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Message Detail */}
          <div className="lg:col-span-2">
            {selectedMessage ? (
              <Card className="border shadow-sm h-full">
                <CardHeader className="flex flex-row items-start justify-between">
                  <div>
                    <CardTitle className="text-lg">{selectedMessage.name}</CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">{selectedMessage.email}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {new Date(selectedMessage.createdAt).toLocaleString()}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-destructive h-8 w-8"
                    onClick={() => setDeleteDialog(selectedMessage)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </CardHeader>
                <Separator />
                <CardContent className="pt-4">
                  <p className="text-sm leading-relaxed whitespace-pre-wrap">{selectedMessage.message}</p>
                </CardContent>
              </Card>
            ) : (
              <Card className="border shadow-sm h-full">
                <CardContent className="py-16 text-center text-muted-foreground">
                  <Eye className="w-10 h-10 mx-auto mb-2 opacity-40" />
                  <p>Select a message to view details</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteDialog} onOpenChange={() => setDeleteDialog(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Message</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this message from &quot;{deleteDialog?.name}&quot;? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

// ─── Gallery Tab ──────────────────────────────────────────────────────
function GalleryTab() {
  const { toast } = useToast()
  const [images, setImages] = useState<GalleryImageType[]>([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingImage, setEditingImage] = useState<GalleryImageType | null>(null)
  const [deleteDialog, setDeleteDialog] = useState<GalleryImageType | null>(null)
  const [submitting, setSubmitting] = useState(false)

  // Form state
  const [formTitle, setFormTitle] = useState('')
  const [formImage, setFormImage] = useState('')
  const [formCategory, setFormCategory] = useState('general')
  const [formBeforeImage, setFormBeforeImage] = useState('')
  const [formDescription, setFormDescription] = useState('')

  const fetchImages = useCallback(async () => {
    try {
      const res = await fetch('/api/gallery')
      const data = await res.json()
      setImages(data.images || [])
    } catch {
      toast({ title: 'Error', description: 'Failed to fetch gallery images', variant: 'destructive' })
    } finally {
      setLoading(false)
    }
  }, [toast])

  useEffect(() => {
    fetchImages()
  }, [fetchImages])

  function openCreate() {
    setEditingImage(null)
    setFormTitle('')
    setFormImage('')
    setFormCategory('general')
    setFormBeforeImage('')
    setFormDescription('')
    setDialogOpen(true)
  }

  function openEdit(img: GalleryImageType) {
    setEditingImage(img)
    setFormTitle(img.title)
    setFormImage(img.image)
    setFormCategory(img.category)
    setFormBeforeImage(img.beforeImage || '')
    setFormDescription(img.description || '')
    setDialogOpen(true)
  }

  async function handleSubmit() {
    if (!formTitle || !formImage) {
      toast({ title: 'Validation Error', description: 'Title and image are required', variant: 'destructive' })
      return
    }
    setSubmitting(true)
    try {
      const body = {
        title: formTitle,
        image: formImage,
        category: formCategory,
        beforeImage: formBeforeImage || null,
        description: formDescription || null,
      }
      const res = editingImage
        ? await fetch('/api/gallery', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: editingImage.id, ...body }),
          })
        : await fetch('/api/gallery', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body),
          })
      if (!res.ok) throw new Error()
      toast({ title: 'Success', description: editingImage ? 'Gallery image updated' : 'Gallery image added' })
      setDialogOpen(false)
      fetchImages()
    } catch {
      toast({ title: 'Error', description: 'Failed to save gallery image', variant: 'destructive' })
    } finally {
      setSubmitting(false)
    }
  }

  async function handleDelete() {
    if (!deleteDialog) return
    try {
      const res = await fetch(`/api/gallery?id=${deleteDialog.id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error()
      toast({ title: 'Success', description: 'Gallery image deleted' })
      fetchImages()
    } catch {
      toast({ title: 'Error', description: 'Failed to delete gallery image', variant: 'destructive' })
    }
    setDeleteDialog(null)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Gallery</h1>
          <p className="text-muted-foreground text-sm mt-1">Manage your salon gallery</p>
        </div>
        <Button onClick={openCreate} className="gap-2">
          <Plus className="w-4 h-4" /> Add Image
        </Button>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-48 rounded-xl" />
          ))}
        </div>
      ) : images.length === 0 ? (
        <Card className="border shadow-sm">
          <CardContent className="py-12 text-center text-muted-foreground">
            <ImageIcon className="w-12 h-12 mx-auto mb-3 opacity-40" />
            <p className="text-lg font-medium">No gallery images</p>
            <p className="text-sm">Add your first image to the gallery.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {images.map((img) => (
            <Card key={img.id} className="overflow-hidden group border shadow-sm hover:shadow-md transition-shadow">
              <div className="relative aspect-[4/3] overflow-hidden">
                <img
                  src={img.image}
                  alt={img.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-2 left-2">
                  <Badge variant="secondary" className="capitalize bg-white/90 dark:bg-black/60 text-xs">
                    {img.category}
                  </Badge>
                </div>
                <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button
                    variant="secondary"
                    size="icon"
                    className="h-8 w-8 shadow-lg bg-white/90 dark:bg-black/60"
                    onClick={() => openEdit(img)}
                  >
                    <Pencil className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="destructive"
                    size="icon"
                    className="h-8 w-8 shadow-lg"
                    onClick={() => setDeleteDialog(img)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              <CardContent className="p-3">
                <p className="text-sm font-medium truncate">{img.title}</p>
                {img.description && (
                  <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{img.description}</p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Add/Edit Image Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingImage ? 'Edit Gallery Image' : 'Add Gallery Image'}</DialogTitle>
            <DialogDescription>{editingImage ? 'Update gallery image details' : 'Add a new image to your salon gallery'}</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="gal-title">Title</Label>
              <Input id="gal-title" value={formTitle} onChange={(e) => setFormTitle(e.target.value)} placeholder="Image title" />
            </div>
            <DualImageInput value={formImage} onChange={setFormImage} label="Image" />
            <div className="space-y-2">
              <Label>Category</Label>
              <Select value={formCategory} onValueChange={setFormCategory}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {GALLERY_CATEGORIES.map((c) => (
                    <SelectItem key={c} value={c}>
                      {c.charAt(0).toUpperCase() + c.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <DualImageInput value={formBeforeImage} onChange={setFormBeforeImage} label="Before Image (optional)" />
            <div className="space-y-2">
              <Label htmlFor="gal-desc">Description (optional)</Label>
              <Textarea id="gal-desc" value={formDescription} onChange={(e) => setFormDescription(e.target.value)} placeholder="Describe this image" rows={3} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={submitting}>
              {submitting ? 'Saving...' : editingImage ? 'Update' : 'Add Image'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteDialog} onOpenChange={() => setDeleteDialog(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Gallery Image</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete &quot;{deleteDialog?.title}&quot;? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

// ─── Content Tab (CMS) ───────────────────────────────────────────────
function ContentTab() {
  const { toast } = useToast()
  const [contentItems, setContentItems] = useState<ContentItem[]>([])
  const [loading, setLoading] = useState(true)
  const [savingKey, setSavingKey] = useState<string | null>(null)

  // Local edit state: section.key -> value
  const [editValues, setEditValues] = useState<Record<string, string>>({})

  const fetchContent = useCallback(async () => {
    try {
      const res = await fetch('/api/content')
      const data = await res.json()
      const items: ContentItem[] = data.content || []
      setContentItems(items)
      // Initialize edit values
      const vals: Record<string, string> = {}
      items.forEach((item) => {
        vals[`${item.section}.${item.key}`] = item.value
      })
      setEditValues(vals)
    } catch {
      toast({ title: 'Error', description: 'Failed to fetch content', variant: 'destructive' })
    } finally {
      setLoading(false)
    }
  }, [toast])

  useEffect(() => {
    fetchContent()
  }, [fetchContent])

  // Group content by section
  const grouped = contentItems.reduce<Record<string, ContentItem[]>>((acc, item) => {
    if (!acc[item.section]) acc[item.section] = []
    acc[item.section].push(item)
    return acc
  }, {})

  const SECTION_ORDER = ['hero', 'about', 'services', 'products', 'gallery', 'contact', 'footer', 'testimonials']
  const SECTION_LABELS: Record<string, string> = {
    hero: 'Home / Hero Section',
    about: 'About Section',
    services: 'Services Section',
    products: 'Products Section',
    gallery: 'Gallery Section',
    contact: 'Contact Section',
    footer: 'Footer Section',
    testimonials: 'Testimonials Section',
  }

  // Field type definitions per section
  const SECTION_FIELDS: Record<string, { key: string; label: string; type: 'text' | 'textarea' | 'image' }[]> = {
    hero: [
      { key: 'title', label: 'Title', type: 'text' },
      { key: 'subtitle', label: 'Subtitle', type: 'text' },
      { key: 'cta_text', label: 'CTA Text', type: 'text' },
      { key: 'image', label: 'Background Image', type: 'image' },
    ],
    about: [
      { key: 'title', label: 'Title', type: 'text' },
      { key: 'description', label: 'Description', type: 'textarea' },
      { key: 'story', label: 'Story', type: 'textarea' },
      { key: 'mission', label: 'Mission', type: 'textarea' },
      { key: 'vision', label: 'Vision', type: 'textarea' },
      { key: 'experience_years', label: 'Years of Experience', type: 'text' },
      { key: 'happy_clients', label: 'Happy Clients Count', type: 'text' },
    ],
    contact: [
      { key: 'title', label: 'Title', type: 'text' },
      { key: 'subtitle', label: 'Subtitle', type: 'text' },
      { key: 'address', label: 'Address', type: 'text' },
      { key: 'phone', label: 'Phone', type: 'text' },
      { key: 'email', label: 'Email', type: 'text' },
      { key: 'whatsapp', label: 'WhatsApp Number', type: 'text' },
      { key: 'hours_weekday', label: 'Weekday Hours', type: 'text' },
      { key: 'hours_saturday', label: 'Saturday Hours', type: 'text' },
      { key: 'hours_sunday', label: 'Sunday Hours', type: 'text' },
    ],
    footer: [
      { key: 'tagline', label: 'Tagline', type: 'text' },
      { key: 'copyright', label: 'Copyright', type: 'text' },
      { key: 'instagram', label: 'Instagram URL', type: 'text' },
      { key: 'facebook', label: 'Facebook URL', type: 'text' },
      { key: 'twitter', label: 'Twitter URL', type: 'text' },
      { key: 'youtube', label: 'YouTube URL', type: 'text' },
      { key: 'whatsapp', label: 'WhatsApp Number', type: 'text' },
    ],
    services: [
      { key: 'title', label: 'Section Title', type: 'text' },
      { key: 'description', label: 'Section Description', type: 'textarea' },
    ],
    products: [
      { key: 'title', label: 'Section Title', type: 'text' },
      { key: 'subtitle', label: 'Section Subtitle', type: 'text' },
    ],
    gallery: [
      { key: 'title', label: 'Section Title', type: 'text' },
      { key: 'subtitle', label: 'Section Subtitle', type: 'text' },
    ],
    testimonials: [
      { key: 'title', label: 'Title', type: 'text' },
      { key: 'subtitle', label: 'Subtitle', type: 'text' },
    ],
  }

  async function handleSave(section: string, key: string) {
    const stateKey = `${section}.${key}`
    const value = editValues[stateKey] !== undefined ? editValues[stateKey] : ''

    setSavingKey(stateKey)
    try {
      // Find if item exists to get its id for PUT, otherwise POST (upsert)
      const existingItem = contentItems.find((i) => i.section === section && i.key === key)
      const res = existingItem
        ? await fetch('/api/content', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: existingItem.id, value }),
          })
        : await fetch('/api/content', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ section, key, value }),
          })
      if (!res.ok) throw new Error()
      toast({ title: 'Saved', description: `${key} updated successfully` })
      fetchContent()
    } catch {
      toast({ title: 'Error', description: `Failed to save ${key}`, variant: 'destructive' })
    } finally {
      setSavingKey(null)
    }
  }

  function updateEditValue(section: string, key: string, value: string) {
    setEditValues((prev) => ({ ...prev, [`${section}.${key}`]: value }))
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Content Management</h1>
          <p className="text-muted-foreground text-sm mt-1">Edit all page content</p>
        </div>
        <div className="space-y-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-48 rounded-xl" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Content Management</h1>
        <p className="text-muted-foreground text-sm mt-1">Edit all page content for your salon website</p>
      </div>

      {SECTION_ORDER.map((section) => {
        const fields = SECTION_FIELDS[section] || []
        const sectionItems = grouped[section] || []

        return (
          <Card key={section} className="border shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-semibold flex items-center gap-2">
                <FileText className="w-5 h-5 text-primary" />
                {SECTION_LABELS[section] || section.charAt(0).toUpperCase() + section.slice(1)}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {fields.map((field) => {
                const stateKey = `${section}.${field.key}`
                const currentValue = editValues[stateKey] ?? ''
                const isSaving = savingKey === stateKey

                return (
                  <div key={field.key} className="space-y-2">
                    {field.type === 'textarea' ? (
                      <>
                        <Label htmlFor={`content-${stateKey}`} className="text-sm font-medium">{field.label}</Label>
                        <Textarea
                          id={`content-${stateKey}`}
                          value={currentValue}
                          onChange={(e) => updateEditValue(section, field.key, e.target.value)}
                          rows={3}
                          placeholder={`Enter ${field.label.toLowerCase()}...`}
                        />
                      </>
                    ) : field.type === 'image' ? (
                      <DualImageInput
                        value={currentValue}
                        onChange={(v) => updateEditValue(section, field.key, v)}
                        label={field.label}
                      />
                    ) : (
                      <>
                        <Label htmlFor={`content-${stateKey}`} className="text-sm font-medium">{field.label}</Label>
                        <Input
                          id={`content-${stateKey}`}
                          value={currentValue}
                          onChange={(e) => updateEditValue(section, field.key, e.target.value)}
                          placeholder={`Enter ${field.label.toLowerCase()}...`}
                        />
                      </>
                    )}
                    <div className="flex justify-end">
                      <Button
                        size="sm"
                        variant="outline"
                        className="gap-1.5"
                        disabled={isSaving}
                        onClick={() => handleSave(section, field.key)}
                      >
                        {isSaving ? (
                          <Loader2 className="w-3 h-3 animate-spin" />
                        ) : (
                          <Save className="w-3 h-3" />
                        )}
                        {isSaving ? 'Saving...' : 'Save'}
                      </Button>
                    </div>
                    <Separator className="mt-2" />
                  </div>
                )
              })}
              {/* Render any extra items from DB not in field definitions */}
              {sectionItems
                .filter((item) => !fields.some((f) => f.key === item.key))
                .map((item) => {
                  const stateKey = `${item.section}.${item.key}`
                  const currentValue = editValues[stateKey] ?? item.value
                  const isSaving = savingKey === stateKey

                  return (
                    <div key={item.key} className="space-y-2">
                      <Label htmlFor={`content-${stateKey}`} className="text-sm font-medium">
                        {item.key.split('_').map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
                      </Label>
                      <Input
                        id={`content-${stateKey}`}
                        value={currentValue}
                        onChange={(e) => updateEditValue(item.section, item.key, e.target.value)}
                      />
                      <div className="flex justify-end">
                        <Button
                          size="sm"
                          variant="outline"
                          className="gap-1.5"
                          disabled={isSaving}
                          onClick={() => handleSave(item.section, item.key)}
                        >
                          {isSaving ? (
                            <Loader2 className="w-3 h-3 animate-spin" />
                          ) : (
                            <Save className="w-3 h-3" />
                          )}
                          {isSaving ? 'Saving...' : 'Save'}
                        </Button>
                      </div>
                      <Separator className="mt-2" />
                    </div>
                  )
                })}
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}

// ─── Settings Tab ─────────────────────────────────────────────────────
function SettingsTab() {
  const { toast } = useToast()
  const [settings, setSettings] = useState({
    salonName: 'Star Cuts Beauty Salon',
    address: 'Lazimpat, Kathmandu, Nepal',
    phone: '+977-01-4567890',
    email: 'hello@starcuts.com',
    monday: '9:00 AM - 8:00 PM',
    tuesday: '9:00 AM - 8:00 PM',
    wednesday: '9:00 AM - 8:00 PM',
    thursday: '9:00 AM - 9:00 PM',
    friday: '9:00 AM - 9:00 PM',
    saturday: '10:00 AM - 6:00 PM',
    sunday: 'Closed',
    instagram: 'https://instagram.com/starcuts',
    facebook: 'https://facebook.com/starcuts',
    twitter: 'https://twitter.com/starcuts',
    whatsapp: '',
    enableRegistration: true,
    enableBookingNotifications: true,
    defaultBookingDuration: '60',
    currency: 'NPR',
  })
  const [settingsSaving, setSettingsSaving] = useState(false)
  const [settingsLoading, setSettingsLoading] = useState(true)

  const fetchSettings = useCallback(async () => {
    try {
      const res = await fetch('/api/content?section=settings')
      if (res.ok) {
        const data = await res.json()
        const items: { section: string; key: string; value: string }[] = data.content || []
        const updates: Record<string, string | boolean> = {}
        const booleanKeys = ['enableRegistration', 'enableBookingNotifications']
        items.forEach((item) => {
          if (booleanKeys.includes(item.key)) {
            updates[item.key] = item.value === 'true'
          } else {
            updates[item.key] = item.value
          }
        })
        setSettings((prev) => ({ ...prev, ...updates }))
      }
    } catch (err) {
      console.error('Failed to fetch settings:', err)
    } finally {
      setSettingsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchSettings()
  }, [fetchSettings])

  const handleSaveSettings = async () => {
    setSettingsSaving(true)
    try {
      const fieldsToSave = [
        { key: 'salonName', value: settings.salonName },
        { key: 'address', value: settings.address },
        { key: 'phone', value: settings.phone },
        { key: 'email', value: settings.email },
        { key: 'monday', value: settings.monday },
        { key: 'tuesday', value: settings.tuesday },
        { key: 'wednesday', value: settings.wednesday },
        { key: 'thursday', value: settings.thursday },
        { key: 'friday', value: settings.friday },
        { key: 'saturday', value: settings.saturday },
        { key: 'sunday', value: settings.sunday },
        { key: 'instagram', value: settings.instagram },
        { key: 'facebook', value: settings.facebook },
        { key: 'twitter', value: settings.twitter },
        { key: 'whatsapp', value: settings.whatsapp },
        { key: 'enableRegistration', value: String(settings.enableRegistration) },
        { key: 'enableBookingNotifications', value: String(settings.enableBookingNotifications) },
        { key: 'defaultBookingDuration', value: settings.defaultBookingDuration },
        { key: 'currency', value: settings.currency },
      ]
      await Promise.all(
        fieldsToSave.map((field) =>
          fetch('/api/content', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ section: 'settings', key: field.key, value: field.value }),
          })
        )
      )
      toast({ title: 'Settings Saved', description: 'All settings updated successfully.' })
    } catch {
      toast({ title: 'Error', description: 'Failed to save settings.', variant: 'destructive' })
    } finally {
      setSettingsSaving(false)
    }
  }

  if (settingsLoading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Settings</h1>
          <p className="text-muted-foreground text-sm mt-1">Manage salon settings</p>
        </div>
        <CardSkeleton />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Settings</h1>
        <p className="text-muted-foreground text-sm mt-1">Manage salon information, hours, and social media</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Salon Information */}
        <Card className="border shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg">Salon Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Salon Name</Label>
              <Input
                value={settings.salonName}
                onChange={(e) => setSettings({ ...settings, salonName: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Address</Label>
              <Textarea
                value={settings.address}
                onChange={(e) => setSettings({ ...settings, address: e.target.value })}
                rows={2}
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Phone</Label>
                <Input
                  value={settings.phone}
                  onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Email</Label>
                <Input
                  type="email"
                  value={settings.email}
                  onChange={(e) => setSettings({ ...settings, email: e.target.value })}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Opening Hours */}
        <Card className="border shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg">Opening Hours</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {[
              { key: 'monday' as const, label: 'Monday' },
              { key: 'tuesday' as const, label: 'Tuesday' },
              { key: 'wednesday' as const, label: 'Wednesday' },
              { key: 'thursday' as const, label: 'Thursday' },
              { key: 'friday' as const, label: 'Friday' },
              { key: 'saturday' as const, label: 'Saturday' },
              { key: 'sunday' as const, label: 'Sunday' },
            ].map((day) => (
              <div key={day.key} className="flex items-center gap-3">
                <span className="text-sm font-medium w-24 shrink-0">{day.label}</span>
                <Input
                  value={settings[day.key]}
                  onChange={(e) => setSettings({ ...settings, [day.key]: e.target.value })}
                  className="flex-1"
                />
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Social Media */}
        <Card className="border shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg">Social Media</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Instagram</Label>
              <Input
                value={settings.instagram}
                onChange={(e) => setSettings({ ...settings, instagram: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Facebook</Label>
              <Input
                value={settings.facebook}
                onChange={(e) => setSettings({ ...settings, facebook: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Twitter</Label>
              <Input
                value={settings.twitter}
                onChange={(e) => setSettings({ ...settings, twitter: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>WhatsApp Number</Label>
              <Input
                value={settings.whatsapp}
                onChange={(e) => setSettings({ ...settings, whatsapp: e.target.value })}
                placeholder="+977-9800000000"
              />
            </div>
          </CardContent>
        </Card>

        {/* System Settings */}
        <Card className="border shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg">System Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Enable Registration</Label>
                <p className="text-xs text-muted-foreground">Allow new users to register</p>
              </div>
              <Switch
                checked={settings.enableRegistration}
                onCheckedChange={(val) => setSettings({ ...settings, enableRegistration: val })}
              />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Booking Notifications</Label>
                <p className="text-xs text-muted-foreground">Send notifications for new bookings</p>
              </div>
              <Switch
                checked={settings.enableBookingNotifications}
                onCheckedChange={(val) => setSettings({ ...settings, enableBookingNotifications: val })}
              />
            </div>
            <Separator />
            <div className="space-y-2">
              <Label>Default Booking Duration</Label>
              <Select
                value={settings.defaultBookingDuration}
                onValueChange={(val) => setSettings({ ...settings, defaultBookingDuration: val })}
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="30">30 minutes</SelectItem>
                  <SelectItem value="45">45 minutes</SelectItem>
                  <SelectItem value="60">60 minutes</SelectItem>
                  <SelectItem value="90">90 minutes</SelectItem>
                  <SelectItem value="120">120 minutes</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Currency</Label>
              <Select
                value={settings.currency}
                onValueChange={(val) => setSettings({ ...settings, currency: val })}
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="NPR">NPR (Rs)</SelectItem>
                  <SelectItem value="EUR">EUR (&euro;)</SelectItem>
                  <SelectItem value="GBP">GBP (&pound;)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button
          onClick={handleSaveSettings}
          disabled={settingsSaving}
          className="gradient-rose text-white border-0 hover:opacity-90 px-8"
        >
          {settingsSaving ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="h-4 w-4 mr-2" />
              Save Settings
            </>
          )}
        </Button>
      </div>
    </div>
  )
}

// ─── Payments Tab ─────────────────────────────────────────────────────
function PaymentsTab() {
  const { toast } = useToast()
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethodItem[]>([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingPayment, setEditingPayment] = useState<PaymentMethodItem | null>(null)
  const [deleteDialog, setDeleteDialog] = useState<PaymentMethodItem | null>(null)
  const [submitting, setSubmitting] = useState(false)

  // Form state
  const [formType, setFormType] = useState('bank')
  const [formAccountHolderName, setFormAccountHolderName] = useState('')
  const [formBankName, setFormBankName] = useState('')
  const [formBranchName, setFormBranchName] = useState('')
  const [formAccountNumber, setFormAccountNumber] = useState('')
  const [formFullName, setFormFullName] = useState('')
  const [formNumber, setFormNumber] = useState('')
  const [formQrImage, setFormQrImage] = useState('')
  const [formActive, setFormActive] = useState(true)

  const TYPE_LABELS: Record<string, string> = {
    bank: 'Bank Transfer',
    esewa: 'eSewa',
    khalti: 'Khalti',
    imepay: 'IME Pay',
  }

  const TYPE_COLORS: Record<string, string> = {
    bank: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400',
    esewa: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
    khalti: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400',
    imepay: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400',
  }

  const fetchPaymentMethods = useCallback(async () => {
    try {
      const res = await fetch('/api/payment-methods')
      const data = await res.json()
      setPaymentMethods(data.paymentMethods || [])
    } catch {
      toast({ title: 'Error', description: 'Failed to fetch payment methods', variant: 'destructive' })
    } finally {
      setLoading(false)
    }
  }, [toast])

  useEffect(() => {
    fetchPaymentMethods()
  }, [fetchPaymentMethods])

  function resetForm() {
    setFormType('bank')
    setFormAccountHolderName('')
    setFormBankName('')
    setFormBranchName('')
    setFormAccountNumber('')
    setFormFullName('')
    setFormNumber('')
    setFormQrImage('')
    setFormActive(true)
  }

  function openCreate() {
    setEditingPayment(null)
    resetForm()
    setDialogOpen(true)
  }

  function openEdit(pm: PaymentMethodItem) {
    setEditingPayment(pm)
    setFormType(pm.type)
    setFormAccountHolderName(pm.accountHolderName || '')
    setFormBankName(pm.bankName || '')
    setFormBranchName(pm.branchName || '')
    setFormAccountNumber(pm.accountNumber || '')
    setFormFullName(pm.fullName || '')
    setFormNumber(pm.number || '')
    setFormQrImage(pm.qrImage || '')
    setFormActive(pm.active)
    setDialogOpen(true)
  }

  async function handleSubmit() {
    setSubmitting(true)
    try {
      const body: Record<string, unknown> = {
        type: formType,
        active: formActive,
      }

      if (formType === 'bank') {
        body.accountHolderName = formAccountHolderName || null
        body.bankName = formBankName || null
        body.branchName = formBranchName || null
        body.accountNumber = formAccountNumber || null
        body.fullName = null
        body.number = null
      } else {
        body.accountHolderName = null
        body.bankName = null
        body.branchName = null
        body.accountNumber = null
        body.fullName = formFullName || null
        body.number = formNumber || null
      }

      body.qrImage = formQrImage || null

      const res = editingPayment
        ? await fetch('/api/payment-methods', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: editingPayment.id, ...body }),
          })
        : await fetch('/api/payment-methods', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body),
          })
      if (!res.ok) throw new Error()
      toast({
        title: 'Success',
        description: editingPayment ? 'Payment method updated' : 'Payment method created',
      })
      setDialogOpen(false)
      fetchPaymentMethods()
    } catch {
      toast({ title: 'Error', description: 'Failed to save payment method', variant: 'destructive' })
    } finally {
      setSubmitting(false)
    }
  }

  async function handleDelete() {
    if (!deleteDialog) return
    try {
      const res = await fetch(`/api/payment-methods?id=${deleteDialog.id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error()
      toast({ title: 'Success', description: 'Payment method deleted' })
      fetchPaymentMethods()
    } catch {
      toast({ title: 'Error', description: 'Failed to delete payment method', variant: 'destructive' })
    }
    setDeleteDialog(null)
  }

  async function toggleActive(pm: PaymentMethodItem) {
    try {
      const res = await fetch('/api/payment-methods', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: pm.id, active: !pm.active }),
      })
      if (!res.ok) throw new Error()
      fetchPaymentMethods()
    } catch {
      toast({ title: 'Error', description: 'Failed to update', variant: 'destructive' })
    }
  }

  // Group payment methods by type
  const grouped = paymentMethods.reduce<Record<string, PaymentMethodItem[]>>((acc, pm) => {
    if (!acc[pm.type]) acc[pm.type] = []
    acc[pm.type].push(pm)
    return acc
  }, {})

  const TYPE_ORDER = ['bank', 'esewa', 'khalti', 'imepay']

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Payments</h1>
          <p className="text-muted-foreground text-sm mt-1">Manage payment methods for your salon</p>
        </div>
        <Button onClick={openCreate} className="gap-2">
          <Plus className="w-4 h-4" /> Add Payment Method
        </Button>
      </div>

      {loading ? (
        <CardSkeleton />
      ) : paymentMethods.length === 0 ? (
        <Card className="border shadow-sm">
          <CardContent className="py-12 text-center text-muted-foreground">
            <CreditCard className="w-12 h-12 mx-auto mb-3 opacity-40" />
            <p className="text-lg font-medium">No payment methods</p>
            <p className="text-sm">Add your first payment method to get started.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-8">
          {TYPE_ORDER.map((type) => {
            const methods = grouped[type]
            if (!methods || methods.length === 0) return null
            return (
              <div key={type}>
                <div className="flex items-center gap-2 mb-4">
                  <Badge className={TYPE_COLORS[type] || ''} variant="outline">
                    {TYPE_LABELS[type] || type}
                  </Badge>
                  <span className="text-sm text-muted-foreground">{methods.length} method{methods.length > 1 ? 's' : ''}</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {methods.map((pm) => (
                    <Card key={pm.id} className="border shadow-sm hover:shadow-md transition-shadow">
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-2">
                            <Badge className={TYPE_COLORS[pm.type] || ''} variant="outline">
                              {TYPE_LABELS[pm.type] || pm.type}
                            </Badge>
                            <Badge
                              variant="outline"
                              className={
                                pm.active
                                  ? 'bg-green-50 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-400'
                                  : 'bg-red-50 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-400'
                              }
                            >
                              {pm.active ? 'Active' : 'Inactive'}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-1">
                            <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => openEdit(pm)}>
                              <Pencil className="w-3.5 h-3.5" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7 text-destructive"
                              onClick={() => setDeleteDialog(pm)}
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </Button>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-2">
                        {pm.type === 'bank' ? (
                          <>
                            {pm.accountHolderName && (
                              <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Account Holder</span>
                                <span className="font-medium text-right">{pm.accountHolderName}</span>
                              </div>
                            )}
                            {pm.bankName && (
                              <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Bank</span>
                                <span className="font-medium text-right">{pm.bankName}</span>
                              </div>
                            )}
                            {pm.branchName && (
                              <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Branch</span>
                                <span className="font-medium text-right">{pm.branchName}</span>
                              </div>
                            )}
                            {pm.accountNumber && (
                              <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Account No.</span>
                                <span className="font-medium font-mono text-right">{pm.accountNumber}</span>
                              </div>
                            )}
                          </>
                        ) : (
                          <>
                            {pm.fullName && (
                              <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Full Name</span>
                                <span className="font-medium text-right">{pm.fullName}</span>
                              </div>
                            )}
                            {pm.number && (
                              <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Number</span>
                                <span className="font-medium font-mono text-right">{pm.number}</span>
                              </div>
                            )}
                          </>
                        )}
                        {pm.qrImage && (
                          <div className="mt-3 pt-2 border-t">
                            <p className="text-xs text-muted-foreground mb-2">QR Code</p>
                            <div className="w-20 h-20 rounded-lg overflow-hidden bg-muted">
                              <img
                                src={pm.qrImage}
                                alt="QR Code"
                                className="w-full h-full object-cover"
                                onError={(e) => { e.currentTarget.style.display = 'none' }}
                              />
                            </div>
                          </div>
                        )}
                        <div className="flex items-center justify-between pt-2 border-t mt-2">
                          <span className="text-xs text-muted-foreground">Active</span>
                          <Switch checked={pm.active} onCheckedChange={() => toggleActive(pm)} />
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Add/Edit Payment Method Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingPayment ? 'Edit Payment Method' : 'Add Payment Method'}</DialogTitle>
            <DialogDescription>
              {editingPayment ? 'Update payment method details' : 'Create a new payment method for your salon'}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Payment Type</Label>
              <Select
                value={formType}
                onValueChange={(val) => {
                  setFormType(val)
                  // Reset type-specific fields when switching type
                  if (val !== 'bank') {
                    setFormAccountHolderName('')
                    setFormBankName('')
                    setFormBranchName('')
                    setFormAccountNumber('')
                  } else {
                    setFormFullName('')
                    setFormNumber('')
                  }
                }}
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="bank">Bank Transfer</SelectItem>
                  <SelectItem value="esewa">eSewa</SelectItem>
                  <SelectItem value="khalti">Khalti</SelectItem>
                  <SelectItem value="imepay">IME Pay</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {formType === 'bank' ? (
              <>
                <div className="space-y-2">
                  <Label htmlFor="pm-accountHolder">Account Holder Name</Label>
                  <Input
                    id="pm-accountHolder"
                    value={formAccountHolderName}
                    onChange={(e) => setFormAccountHolderName(e.target.value)}
                    placeholder="Account holder name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="pm-bankName">Bank Name</Label>
                  <Input
                    id="pm-bankName"
                    value={formBankName}
                    onChange={(e) => setFormBankName(e.target.value)}
                    placeholder="Bank name"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="pm-branchName">Branch Name</Label>
                    <Input
                      id="pm-branchName"
                      value={formBranchName}
                      onChange={(e) => setFormBranchName(e.target.value)}
                      placeholder="Branch name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="pm-accountNumber">Account Number</Label>
                    <Input
                      id="pm-accountNumber"
                      value={formAccountNumber}
                      onChange={(e) => setFormAccountNumber(e.target.value)}
                      placeholder="Account number"
                    />
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="space-y-2">
                  <Label htmlFor="pm-fullName">Full Name</Label>
                  <Input
                    id="pm-fullName"
                    value={formFullName}
                    onChange={(e) => setFormFullName(e.target.value)}
                    placeholder="Full name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="pm-number">Number</Label>
                  <Input
                    id="pm-number"
                    value={formNumber}
                    onChange={(e) => setFormNumber(e.target.value)}
                    placeholder="Wallet / ID number"
                  />
                </div>
              </>
            )}

            <DualImageInput value={formQrImage} onChange={setFormQrImage} label="QR Code Image" />

            <div className="flex items-center gap-2">
              <Switch id="pm-active" checked={formActive} onCheckedChange={setFormActive} />
              <Label htmlFor="pm-active" className="cursor-pointer">Active</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={submitting}>
              {submitting ? 'Saving...' : editingPayment ? 'Update' : 'Create'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteDialog} onOpenChange={() => setDeleteDialog(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Payment Method</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this {TYPE_LABELS[deleteDialog?.type || ''] || 'payment method'}? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
