'use client'

import { useState, useEffect, useCallback } from 'react'
import { useSession } from 'next-auth/react'
import { useAppStore } from '@/store/use-app-store'
import { motion, AnimatePresence } from 'framer-motion'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts'
import {
  Crown,
  Users,
  LayoutDashboard,
  BarChart3,
  Settings,
  Plus,
  Trash2,
  Pencil,
  Search,
  Filter,
  Banknote,
  CalendarDays,
  Sparkles,
  Clock,
  MessageSquare,
  Shield,
  AlertTriangle,
  Save,
  X,
  ArrowRight,
  TrendingUp,
  UserCog,
  ChevronLeft,
  Menu,
  FileText,
  Upload,
  CheckCircle2,
  Eye,
  CreditCard,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
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
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
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
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Skeleton } from '@/components/ui/skeleton'
import { useToast } from '@/hooks/use-toast'
import type { DashboardStats, UserRole } from '@/types'

// ─── Types ───────────────────────────────────────────────────────────────────

interface UserInfo {
  id: string
  name: string
  email: string
  role: string
  phone?: string | null
  image?: string | null
  createdAt: string
}

interface BookingInfo {
  id: string
  userId: string
  serviceId: string
  date: string
  time: string
  status: string
  notes?: string | null
  createdAt: string
  service?: { title: string; price: number }
  user?: { name: string; email: string; phone?: string | null }
}

interface TopService {
  id: string
  title: string
  price: number
  bookingsCount: number
}

interface BookingsByStatus {
  status: string
  count: number
}

interface ContentItem {
  id: string
  section: string
  key: string
  value: string
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

type TabId = 'dashboard' | 'users' | 'analytics' | 'content' | 'settings' | 'payments'

// ─── Status Colors for Pie Chart ─────────────────────────────────────────────

const STATUS_COLORS: Record<string, string> = {
  PENDING: '#f59e0b',
  CONFIRMED: '#10b981',
  CANCELLED: '#ef4444',
  COMPLETED: '#3b82f6',
}

// ─── Content Section Definitions ─────────────────────────────────────────────

const CONTENT_SECTIONS = [
  {
    id: 'hero',
    label: 'Hero Section',
    fields: [
      { key: 'title', label: 'Title', type: 'text' as const },
      { key: 'subtitle', label: 'Subtitle', type: 'text' as const },
      { key: 'cta_text', label: 'CTA Button Text', type: 'text' as const },
      { key: 'image', label: 'Background Image', type: 'image' as const },
    ],
  },
  {
    id: 'about',
    label: 'About Section',
    fields: [
      { key: 'title', label: 'Title', type: 'text' as const },
      { key: 'description', label: 'Description', type: 'textarea' as const },
      { key: 'story', label: 'Story', type: 'textarea' as const },
      { key: 'mission', label: 'Mission', type: 'textarea' as const },
      { key: 'vision', label: 'Vision', type: 'textarea' as const },
      { key: 'experience_years', label: 'Years of Experience', type: 'text' as const },
      { key: 'happy_clients', label: 'Happy Clients Count', type: 'text' as const },
    ],
  },
  {
    id: 'contact',
    label: 'Contact Section',
    fields: [
      { key: 'title', label: 'Title', type: 'text' as const },
      { key: 'subtitle', label: 'Subtitle', type: 'text' as const },
      { key: 'address', label: 'Address', type: 'text' as const },
      { key: 'phone', label: 'Phone', type: 'text' as const },
      { key: 'email', label: 'Email', type: 'text' as const },
      { key: 'whatsapp', label: 'WhatsApp Number', type: 'text' as const },
      { key: 'hours_weekday', label: 'Weekday Hours', type: 'text' as const },
      { key: 'hours_saturday', label: 'Saturday Hours', type: 'text' as const },
      { key: 'hours_sunday', label: 'Sunday Hours', type: 'text' as const },
      { key: 'map_embed_url', label: 'Map Embed URL', type: 'text' as const },
    ],
  },
  {
    id: 'footer',
    label: 'Footer Section',
    fields: [
      { key: 'tagline', label: 'Tagline', type: 'text' as const },
      { key: 'copyright', label: 'Copyright Text', type: 'text' as const },
      { key: 'instagram', label: 'Instagram URL', type: 'text' as const },
      { key: 'facebook', label: 'Facebook URL', type: 'text' as const },
      { key: 'twitter', label: 'Twitter URL', type: 'text' as const },
      { key: 'youtube', label: 'YouTube URL', type: 'text' as const },
      { key: 'whatsapp', label: 'WhatsApp Number', type: 'text' as const },
    ],
  },
  {
    id: 'testimonials',
    label: 'Testimonials Section',
    fields: [
      { key: 'title', label: 'Title', type: 'text' as const },
      { key: 'subtitle', label: 'Subtitle', type: 'text' as const },
    ],
  },
  {
    id: 'services',
    label: 'Services Section',
    fields: [
      { key: 'title', label: 'Section Title', type: 'text' as const },
      { key: 'description', label: 'Section Description', type: 'textarea' as const },
    ],
  },
  {
    id: 'products',
    label: 'Products Section',
    fields: [
      { key: 'title', label: 'Section Title', type: 'text' as const },
      { key: 'subtitle', label: 'Section Subtitle', type: 'text' as const },
    ],
  },
  {
    id: 'gallery',
    label: 'Gallery Section',
    fields: [
      { key: 'title', label: 'Section Title', type: 'text' as const },
      { key: 'subtitle', label: 'Section Subtitle', type: 'text' as const },
    ],
  },
]

// ─── Sidebar Navigation ──────────────────────────────────────────────────────

const SIDEBAR_ITEMS: { id: TabId; label: string; icon: typeof LayoutDashboard }[] = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'users', label: 'Users', icon: Users },
  { id: 'analytics', label: 'Analytics', icon: BarChart3 },
  { id: 'content', label: 'Content', icon: FileText },
  { id: 'payments', label: 'Payments', icon: CreditCard },
  { id: 'settings', label: 'Settings', icon: Settings },
]

// ─── DualImageInput Component ────────────────────────────────────────────────

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
        <Button type="button" size="sm" variant={mode === 'url' ? 'default' : 'outline'} onClick={() => setMode('url')}>URL</Button>
        <Button type="button" size="sm" variant={mode === 'upload' ? 'default' : 'outline'} onClick={() => setMode('upload')}>Upload</Button>
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

// ─── Standalone Content Tab (prevents parent re-renders on input changes) ───

function SuperAdminContentTab() {
  const { toast } = useToast()
  const [contentItems, setContentItems] = useState<ContentItem[]>([])
  const [contentLoading, setContentLoading] = useState(true)
  const [contentSaving, setContentSaving] = useState<Record<string, boolean>>({})
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({ hero: true })
  const [editValues, setEditValues] = useState<Record<string, string>>({})

  const fetchContent = useCallback(async (showLoading = true) => {
    if (showLoading) setContentLoading(true)
    try {
      const res = await fetch('/api/content')
      if (res.ok) {
        const data = await res.json()
        const items: ContentItem[] = data.content || []
        setContentItems(items)
        const vals: Record<string, string> = {}
        items.forEach((item) => {
          vals[`${item.section}.${item.key}`] = item.value
        })
        setEditValues(vals)
      }
    } catch (err) {
      console.error('Failed to fetch content:', err)
    } finally {
      if (showLoading) setContentLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchContent()
  }, [fetchContent])

  const getEditValue = (section: string, key: string) => {
    return editValues[`${section}.${key}`] ?? ''
  }

  const updateEditValue = (section: string, key: string, value: string) => {
    setEditValues((prev) => ({ ...prev, [`${section}.${key}`]: value }))
  }

  const handleSaveContent = async (section: string, key: string, value: string) => {
    const saveKey = `${section}_${key}`
    setContentSaving((prev) => ({ ...prev, [saveKey]: true }))
    try {
      const res = await fetch('/api/content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ section, key, value }),
      })
      if (res.ok) {
        toast({ title: 'Content Saved', description: `${section} - ${key} updated successfully.` })
        fetchContent(false)
      } else {
        const data = await res.json()
        toast({ title: 'Error', description: data.error || 'Failed to save content.', variant: 'destructive' })
      }
    } catch {
      toast({ title: 'Error', description: 'Something went wrong.', variant: 'destructive' })
    } finally {
      setContentSaving((prev) => ({ ...prev, [saveKey]: false }))
    }
  }

  const handleSaveAllContent = async (sectionId: string) => {
    const sectionDef = CONTENT_SECTIONS.find((s) => s.id === sectionId)
    if (!sectionDef) return

    setContentSaving((prev) => ({ ...prev, [sectionId]: true }))
    try {
      const savePromises = sectionDef.fields.map((field) => {
        const value = editValues[`${sectionId}.${field.key}`] ?? ''
        return fetch('/api/content', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ section: sectionId, key: field.key, value }),
        })
      })

      await Promise.all(savePromises)
      toast({ title: 'Section Saved', description: `${sectionDef.label} saved successfully.` })
      fetchContent(false)
    } catch {
      toast({ title: 'Error', description: 'Failed to save section.', variant: 'destructive' })
    } finally {
      setContentSaving((prev) => ({ ...prev, [sectionId]: false }))
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold">Content Management</h2>
          <p className="text-muted-foreground text-sm">Edit website content across all sections</p>
        </div>
        <Button
          onClick={() => fetchContent()}
          variant="outline"
          size="sm"
        >
          Refresh Content
        </Button>
      </div>

      {contentLoading ? (
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <Card key={i}>
              <CardContent className="p-6 space-y-4">
                <Skeleton className="h-6 w-48" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {CONTENT_SECTIONS.map((section) => {
              const isExpanded = expandedSections[section.id] ?? false
              const sectionItems = contentItems.filter((c) => c.section === section.id)

              return (
                <Card key={section.id} className="overflow-hidden">
                  <CardHeader
                    className="cursor-pointer hover:bg-muted/50 transition-colors"
                    onClick={() =>
                      setExpandedSections((prev) => ({
                        ...prev,
                        [section.id]: !isExpanded,
                      }))
                    }
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <FileText className="h-5 w-5 text-primary" />
                        <div>
                          <CardTitle className="text-lg">{section.label}</CardTitle>
                          <CardDescription>
                            {sectionItems.length} field{sectionItems.length !== 1 ? 's' : ''} configured
                          </CardDescription>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary" className="text-xs">
                          {section.id}
                        </Badge>
                        <ChevronLeft
                          className={`h-4 w-4 text-muted-foreground transition-transform ${
                            isExpanded ? '-rotate-90' : 'rotate-180'
                          }`}
                        />
                      </div>
                    </div>
                  </CardHeader>

                  {isExpanded && (
                    <CardContent className="space-y-4 border-t pt-6">
                      {section.fields.map((field) => {
                        const currentValue = getEditValue(section.id, field.key)
                        const saveKey = `${section.id}_${field.key}`
                        const isSaving = contentSaving[saveKey]

                        return (
                          <div key={field.key} className="space-y-2">
                            {field.type === 'textarea' ? (
                              <>
                                <Label className="flex items-center gap-2">
                                  {field.label}
                                  <Badge variant="outline" className="text-[10px] px-1.5">
                                    {field.key}
                                  </Badge>
                                </Label>
                                <Textarea
                                  value={currentValue}
                                  onChange={(e) =>
                                    updateEditValue(section.id, field.key, e.target.value)
                                  }
                                  rows={3}
                                  placeholder={`Enter ${field.label.toLowerCase()}...`}
                                />
                              </>
                            ) : field.type === 'image' ? (
                              <DualImageInput
                                value={currentValue}
                                onChange={(v) => updateEditValue(section.id, field.key, v)}
                                label={`${field.label} (${field.key})`}
                              />
                            ) : (
                              <>
                                <Label className="flex items-center gap-2">
                                  {field.label}
                                  <Badge variant="outline" className="text-[10px] px-1.5">
                                    {field.key}
                                  </Badge>
                                </Label>
                                <Input
                                  value={currentValue}
                                  onChange={(e) =>
                                    updateEditValue(section.id, field.key, e.target.value)
                                  }
                                  placeholder={`Enter ${field.label.toLowerCase()}...`}
                                />
                              </>
                            )}
                            <div className="flex justify-end">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() =>
                                  handleSaveContent(section.id, field.key, currentValue)
                                }
                                disabled={isSaving}
                              >
                                {isSaving ? (
                                  <>
                                    <span className="animate-spin rounded-full h-3 w-3 border-b-2 border-current mr-1" />
                                    Saving...
                                  </>
                                ) : (
                                  <>
                                    <Save className="h-3 w-3 mr-1" />
                                    Save
                                  </>
                                )}
                              </Button>
                            </div>
                          </div>
                        )
                      })}

                      <Separator />

                      <div className="flex justify-end">
                        <Button
                          onClick={() => handleSaveAllContent(section.id)}
                          disabled={contentSaving[section.id]}
                          className="gradient-gold text-white border-0 hover:opacity-90"
                        >
                          {contentSaving[section.id] ? (
                            <>
                              <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                              Saving All...
                            </>
                          ) : (
                            <>
                              <Save className="h-4 w-4 mr-2" />
                              Save All {section.label}
                            </>
                          )}
                        </Button>
                      </div>
                    </CardContent>
                  )}
                </Card>
              )
            })}
          </div>
      )}
    </div>
  )
}

// ─── Payment Method Constants ──────────────────────────────────────────────

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

// ─── Standalone Payments Tab ───────────────────────────────────────────────

function SuperAdminPaymentsTab() {
  const { toast } = useToast()
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethodItem[]>([])
  const [loading, setLoading] = useState(true)
  const [createDialogOpen, setCreateDialogOpen] = useState(false)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState<PaymentMethodItem | null>(null)
  const [saving, setSaving] = useState(false)
  const [deleteLoading, setDeleteLoading] = useState(false)

  const emptyForm = {
    type: 'bank' as string,
    accountHolderName: '',
    bankName: '',
    branchName: '',
    accountNumber: '',
    fullName: '',
    number: '',
    qrImage: '',
    active: true,
  }

  const [createForm, setCreateForm] = useState({ ...emptyForm })
  const [editForm, setEditForm] = useState({ ...emptyForm, id: '' })

  const fetchPaymentMethods = useCallback(async (showLoading = true) => {
    if (showLoading) setLoading(true)
    try {
      const res = await fetch('/api/payment-methods')
      if (res.ok) {
        const data = await res.json()
        setPaymentMethods(data.paymentMethods || [])
      }
    } catch (err) {
      console.error('Failed to fetch payment methods:', err)
    } finally {
      if (showLoading) setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchPaymentMethods()
  }, [fetchPaymentMethods])

  const handleTypeChange = (formType: 'create' | 'edit', newType: string) => {
    if (formType === 'create') {
      setCreateForm((prev) => ({
        ...prev,
        type: newType,
        accountHolderName: '',
        bankName: '',
        branchName: '',
        accountNumber: '',
        fullName: '',
        number: '',
        qrImage: '',
      }))
    } else {
      setEditForm((prev) => ({
        ...prev,
        type: newType,
        accountHolderName: '',
        bankName: '',
        branchName: '',
        accountNumber: '',
        fullName: '',
        number: '',
        qrImage: '',
      }))
    }
  }

  const handleCreate = async () => {
    if (!createForm.type) {
      toast({ title: 'Validation Error', description: 'Please select a payment type.', variant: 'destructive' })
      return
    }
    if (createForm.type === 'bank' && (!createForm.accountHolderName || !createForm.bankName || !createForm.accountNumber)) {
      toast({ title: 'Validation Error', description: 'Account Holder Name, Bank Name, and Account Number are required for bank transfers.', variant: 'destructive' })
      return
    }
    if (['esewa', 'khalti', 'imepay'].includes(createForm.type) && (!createForm.fullName || !createForm.number)) {
      toast({ title: 'Validation Error', description: 'Full Name and Number are required.', variant: 'destructive' })
      return
    }

    setSaving(true)
    try {
      const res = await fetch('/api/payment-methods', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(createForm),
      })
      if (res.ok) {
        toast({ title: 'Payment Method Created', description: `${TYPE_LABELS[createForm.type]} has been added successfully.` })
        setCreateDialogOpen(false)
        setCreateForm({ ...emptyForm })
        fetchPaymentMethods(false)
      } else {
        const data = await res.json()
        toast({ title: 'Error', description: data.error || 'Failed to create payment method.', variant: 'destructive' })
      }
    } catch {
      toast({ title: 'Error', description: 'Something went wrong.', variant: 'destructive' })
    } finally {
      setSaving(false)
    }
  }

  const handleEdit = async () => {
    if (!editForm.type) {
      toast({ title: 'Validation Error', description: 'Please select a payment type.', variant: 'destructive' })
      return
    }
    if (editForm.type === 'bank' && (!editForm.accountHolderName || !editForm.bankName || !editForm.accountNumber)) {
      toast({ title: 'Validation Error', description: 'Account Holder Name, Bank Name, and Account Number are required for bank transfers.', variant: 'destructive' })
      return
    }
    if (['esewa', 'khalti', 'imepay'].includes(editForm.type) && (!editForm.fullName || !editForm.number)) {
      toast({ title: 'Validation Error', description: 'Full Name and Number are required.', variant: 'destructive' })
      return
    }

    setSaving(true)
    try {
      const { id, ...data } = editForm
      const res = await fetch('/api/payment-methods', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, ...data }),
      })
      if (res.ok) {
        toast({ title: 'Payment Method Updated', description: `${TYPE_LABELS[editForm.type]} has been updated.` })
        setEditDialogOpen(false)
        fetchPaymentMethods(false)
      } else {
        const data = await res.json()
        toast({ title: 'Error', description: data.error || 'Failed to update payment method.', variant: 'destructive' })
      }
    } catch {
      toast({ title: 'Error', description: 'Something went wrong.', variant: 'destructive' })
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!deleteTarget) return
    setDeleteLoading(true)
    try {
      const res = await fetch(`/api/payment-methods?id=${deleteTarget.id}`, { method: 'DELETE' })
      if (res.ok) {
        toast({ title: 'Payment Method Deleted', description: `${TYPE_LABELS[deleteTarget.type]} has been removed.` })
        setDeleteDialogOpen(false)
        setDeleteTarget(null)
        fetchPaymentMethods(false)
      } else {
        const data = await res.json()
        toast({ title: 'Error', description: data.error || 'Failed to delete payment method.', variant: 'destructive' })
      }
    } catch {
      toast({ title: 'Error', description: 'Something went wrong.', variant: 'destructive' })
    } finally {
      setDeleteLoading(false)
    }
  }

  const openEditDialog = (pm: PaymentMethodItem) => {
    setEditForm({
      id: pm.id,
      type: pm.type,
      accountHolderName: pm.accountHolderName || '',
      bankName: pm.bankName || '',
      branchName: pm.branchName || '',
      accountNumber: pm.accountNumber || '',
      fullName: pm.fullName || '',
      number: pm.number || '',
      qrImage: pm.qrImage || '',
      active: pm.active,
    })
    setEditDialogOpen(true)
  }

  // Group payment methods by type
  const groupedMethods = paymentMethods.reduce<Record<string, PaymentMethodItem[]>>((acc, pm) => {
    const t = pm.type
    if (!acc[t]) acc[t] = []
    acc[t].push(pm)
    return acc
  }, {})

  const renderFormFields = (form: typeof createForm, setForm: React.Dispatch<React.SetStateAction<typeof createForm>>) => (
    <div className="space-y-4 py-4">
      <div className="space-y-2">
        <Label>Type</Label>
        <Select value={form.type} onValueChange={(val) => {
          const formType = 'id' in form && form.id ? 'edit' : 'create'
          handleTypeChange(formType, val)
        }}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="bank">Bank Transfer</SelectItem>
            <SelectItem value="esewa">eSewa</SelectItem>
            <SelectItem value="khalti">Khalti</SelectItem>
            <SelectItem value="imepay">IME Pay</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {form.type === 'bank' && (
        <>
          <div className="space-y-2">
            <Label>Account Holder Name</Label>
            <Input
              value={form.accountHolderName}
              onChange={(e) => setForm((prev) => ({ ...prev, accountHolderName: e.target.value }))}
              placeholder="Enter account holder name"
            />
          </div>
          <div className="space-y-2">
            <Label>Bank Name</Label>
            <Input
              value={form.bankName}
              onChange={(e) => setForm((prev) => ({ ...prev, bankName: e.target.value }))}
              placeholder="Enter bank name"
            />
          </div>
          <div className="space-y-2">
            <Label>Branch Name</Label>
            <Input
              value={form.branchName}
              onChange={(e) => setForm((prev) => ({ ...prev, branchName: e.target.value }))}
              placeholder="Enter branch name"
            />
          </div>
          <div className="space-y-2">
            <Label>Account Number</Label>
            <Input
              value={form.accountNumber}
              onChange={(e) => setForm((prev) => ({ ...prev, accountNumber: e.target.value }))}
              placeholder="Enter account number"
            />
          </div>
        </>
      )}

      {['esewa', 'khalti', 'imepay'].includes(form.type) && (
        <>
          <div className="space-y-2">
            <Label>Full Name</Label>
            <Input
              value={form.fullName}
              onChange={(e) => setForm((prev) => ({ ...prev, fullName: e.target.value }))}
              placeholder="Enter full name"
            />
          </div>
          <div className="space-y-2">
            <Label>Number</Label>
            <Input
              value={form.number}
              onChange={(e) => setForm((prev) => ({ ...prev, number: e.target.value }))}
              placeholder="Enter wallet number"
            />
          </div>
        </>
      )}

      <DualImageInput
        value={form.qrImage}
        onChange={(v) => setForm((prev) => ({ ...prev, qrImage: v }))}
        label="QR Image"
      />

      <div className="flex items-center justify-between">
        <div className="space-y-0.5">
          <Label>Active</Label>
          <p className="text-xs text-muted-foreground">Enable this payment method</p>
        </div>
        <Switch
          checked={form.active}
          onCheckedChange={(val) => setForm((prev) => ({ ...prev, active: val }))}
        />
      </div>
    </div>
  )

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold">Payment Methods</h2>
          <p className="text-muted-foreground text-sm">Manage payment options for your salon</p>
        </div>
        <Button onClick={() => { setCreateForm({ ...emptyForm }); setCreateDialogOpen(true) }} className="gradient-gold text-white border-0 hover:opacity-90">
          <Plus className="h-4 w-4 mr-2" />
          Add Payment Method
        </Button>
      </div>

      {loading ? (
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <Card key={i}>
              <CardContent className="p-6 space-y-4">
                <Skeleton className="h-6 w-48" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : paymentMethods.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <CreditCard className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
            <p className="text-muted-foreground">No payment methods configured yet.</p>
            <p className="text-muted-foreground text-sm mt-1">Click &quot;Add Payment Method&quot; to get started.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {Object.entries(TYPE_LABELS).map(([typeKey, typeLabel]) => {
            const methods = groupedMethods[typeKey] || []
            if (methods.length === 0) return null
            return (
              <div key={typeKey} className="space-y-3">
                <div className="flex items-center gap-2">
                  <Badge className={`${TYPE_COLORS[typeKey]} border-0`}>
                    {typeLabel}
                  </Badge>
                  <span className="text-sm text-muted-foreground">
                    {methods.length} method{methods.length !== 1 ? 's' : ''}
                  </span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {methods.map((pm) => (
                    <Card key={pm.id} className="hover:shadow-md transition-shadow">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex-1 min-w-0 space-y-2">
                            <div className="flex items-center gap-2">
                              <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${TYPE_COLORS[pm.type]}`}>
                                {TYPE_LABELS[pm.type]}
                              </span>
                              <Badge variant={pm.active ? 'default' : 'secondary'} className="text-xs">
                                {pm.active ? 'Active' : 'Inactive'}
                              </Badge>
                            </div>

                            {pm.type === 'bank' && (
                              <div className="space-y-1 text-sm">
                                {pm.accountHolderName && (
                                  <p><span className="text-muted-foreground">Holder:</span> {pm.accountHolderName}</p>
                                )}
                                {pm.bankName && (
                                  <p><span className="text-muted-foreground">Bank:</span> {pm.bankName}</p>
                                )}
                                {pm.branchName && (
                                  <p><span className="text-muted-foreground">Branch:</span> {pm.branchName}</p>
                                )}
                                {pm.accountNumber && (
                                  <p><span className="text-muted-foreground">Account:</span> {pm.accountNumber}</p>
                                )}
                              </div>
                            )}

                            {['esewa', 'khalti', 'imepay'].includes(pm.type) && (
                              <div className="space-y-1 text-sm">
                                {pm.fullName && (
                                  <p><span className="text-muted-foreground">Name:</span> {pm.fullName}</p>
                                )}
                                {pm.number && (
                                  <p><span className="text-muted-foreground">Number:</span> {pm.number}</p>
                                )}
                              </div>
                            )}

                            {pm.qrImage && (
                              <div className="mt-2">
                                <div className="w-20 h-20 rounded-lg overflow-hidden bg-muted">
                                  <img src={pm.qrImage} alt="QR Code" className="w-full h-full object-cover" onError={(e) => { e.currentTarget.style.display = 'none' }} />
                                </div>
                              </div>
                            )}
                          </div>

                          <div className="flex items-center gap-1 shrink-0">
                            <Button variant="ghost" size="sm" onClick={() => openEditDialog(pm)}>
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-destructive hover:text-destructive"
                              onClick={() => {
                                setDeleteTarget(pm)
                                setDeleteDialogOpen(true)
                              }}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
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

      {/* Create Payment Method Dialog */}
      <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              Add Payment Method
            </DialogTitle>
            <DialogDescription>
              Add a new payment method for customers to use.
            </DialogDescription>
          </DialogHeader>
          {renderFormFields(createForm, setCreateForm as React.Dispatch<React.SetStateAction<typeof createForm>>)}
          <DialogFooter>
            <Button variant="outline" onClick={() => setCreateDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreate} disabled={saving} className="gradient-gold text-white border-0">
              {saving ? 'Creating...' : 'Create Payment Method'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Payment Method Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Pencil className="h-5 w-5" />
              Edit Payment Method
            </DialogTitle>
            <DialogDescription>
              Update payment method details.
            </DialogDescription>
          </DialogHeader>
          {renderFormFields(editForm, setEditForm as React.Dispatch<React.SetStateAction<typeof createForm>>)}
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleEdit} disabled={saving} className="gradient-gold text-white border-0">
              {saving ? 'Saving...' : 'Save Changes'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Payment Method Alert Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-destructive" />
              Delete Payment Method
            </AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this <strong>{deleteTarget ? TYPE_LABELS[deleteTarget.type] : ''}</strong> payment method? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={deleteLoading}
              className="bg-destructive text-white hover:bg-destructive/90"
            >
              {deleteLoading ? 'Deleting...' : 'Delete Payment Method'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

// ─── Main Component ──────────────────────────────────────────────────────────

export default function SuperAdminPanel() {
  const { data: session, status: sessionStatus } = useSession()
  const { toast } = useToast()
  const [activeTab, setActiveTab] = useState<TabId>('dashboard')
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false)

  // Stats
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [topServices, setTopServices] = useState<TopService[]>([])
  const [bookingsByStatus, setBookingsByStatus] = useState<BookingsByStatus[]>([])
  const [statsLoading, setStatsLoading] = useState(true)

  // Recent bookings
  const [recentBookings, setRecentBookings] = useState<BookingInfo[]>([])
  const [bookingsLoading, setBookingsLoading] = useState(true)

  // Users
  const [users, setUsers] = useState<UserInfo[]>([])
  const [usersLoading, setUsersLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [roleFilter, setRoleFilter] = useState<string>('all')

  // Create user dialog
  const [createDialogOpen, setCreateDialogOpen] = useState(false)
  const [createForm, setCreateForm] = useState({ name: '', email: '', password: '', role: 'USER' })
  const [createLoading, setCreateLoading] = useState(false)

  // Edit user dialog
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [editForm, setEditForm] = useState({ id: '', name: '', email: '', role: 'USER' })
  const [editLoading, setEditLoading] = useState(false)

  // Delete user dialog
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState<UserInfo | null>(null)
  const [deleteLoading, setDeleteLoading] = useState(false)

  // Settings
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

  // Settings save handler
  const [settingsSaving, setSettingsSaving] = useState(false)

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
    }
  }, [])

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
      toast({ title: 'Settings Saved', description: 'All settings have been saved successfully.' })
    } catch {
      toast({ title: 'Error', description: 'Failed to save settings.', variant: 'destructive' })
    } finally {
      setSettingsSaving(false)
    }
  }

  // ─── Fetch Stats ─────────────────────────────────────────────────────────────

  const fetchStats = useCallback(async () => {
    setStatsLoading(true)
    try {
      const res = await fetch('/api/stats')
      if (res.ok) {
        const data = await res.json()
        setStats(data.stats)
        setTopServices(data.topServices || [])
        setBookingsByStatus(data.bookingsByStatus || [])
      }
    } catch (err) {
      console.error('Failed to fetch stats:', err)
    } finally {
      setStatsLoading(false)
    }
  }, [])

  // ─── Fetch Recent Bookings ───────────────────────────────────────────────────

  const fetchRecentBookings = useCallback(async () => {
    setBookingsLoading(true)
    try {
      const res = await fetch('/api/bookings')
      if (res.ok) {
        const data = await res.json()
        setRecentBookings((data.bookings || []).slice(0, 8))
      }
    } catch (err) {
      console.error('Failed to fetch bookings:', err)
    } finally {
      setBookingsLoading(false)
    }
  }, [])

  // ─── Fetch Users ─────────────────────────────────────────────────────────────

  const fetchUsers = useCallback(async () => {
    setUsersLoading(true)
    try {
      const params = new URLSearchParams()
      if (roleFilter && roleFilter !== 'all') params.set('role', roleFilter)
      const res = await fetch(`/api/users?${params.toString()}`)
      if (res.ok) {
        const data = await res.json()
        setUsers(data.users || [])
      }
    } catch (err) {
      console.error('Failed to fetch users:', err)
    } finally {
      setUsersLoading(false)
    }
  }, [roleFilter])

  // ─── Effects ─────────────────────────────────────────────────────────────────

  useEffect(() => {
    fetchStats()
    fetchRecentBookings()
  }, [fetchStats, fetchRecentBookings])

  useEffect(() => {
    fetchUsers()
  }, [fetchUsers])

  useEffect(() => {
    if (activeTab === 'settings') {
      fetchSettings()
    }
  }, [activeTab, fetchSettings])

  // ─── Access Control ──────────────────────────────────────────────────────────

  if (sessionStatus === 'loading') {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
      </div>
    )
  }

  if (!session || (session.user as any)?.role !== 'SUPER_ADMIN') {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 p-8">
        <Shield className="h-16 w-16 text-muted-foreground" />
        <h2 className="text-2xl font-bold">Access Denied</h2>
        <p className="text-muted-foreground text-center max-w-md">
          You do not have permission to access the Super Admin Panel. This area is restricted to Super Administrators only.
        </p>
      </div>
    )
  }

  const currentUserId = (session.user as any)?.id

  // ─── User CRUD Handlers ──────────────────────────────────────────────────────

  const handleCreateUser = async () => {
    if (!createForm.name || !createForm.email || !createForm.password) {
      toast({ title: 'Validation Error', description: 'All fields are required.', variant: 'destructive' })
      return
    }
    setCreateLoading(true)
    try {
      const res = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(createForm),
      })
      if (res.ok) {
        toast({ title: 'User Created', description: `${createForm.name} has been created successfully.` })
        setCreateDialogOpen(false)
        setCreateForm({ name: '', email: '', password: '', role: 'USER' })
        fetchUsers()
      } else {
        const data = await res.json()
        toast({ title: 'Error', description: data.error || 'Failed to create user.', variant: 'destructive' })
      }
    } catch {
      toast({ title: 'Error', description: 'Something went wrong.', variant: 'destructive' })
    } finally {
      setCreateLoading(false)
    }
  }

  const handleEditUser = async () => {
    if (!editForm.name || !editForm.email) {
      toast({ title: 'Validation Error', description: 'Name and email are required.', variant: 'destructive' })
      return
    }
    setEditLoading(true)
    try {
      const res = await fetch('/api/users', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: editForm.id, name: editForm.name, email: editForm.email, role: editForm.role }),
      })
      if (res.ok) {
        toast({ title: 'User Updated', description: `${editForm.name} has been updated.` })
        setEditDialogOpen(false)
        fetchUsers()
      } else {
        const data = await res.json()
        toast({ title: 'Error', description: data.error || 'Failed to update user.', variant: 'destructive' })
      }
    } catch {
      toast({ title: 'Error', description: 'Something went wrong.', variant: 'destructive' })
    } finally {
      setEditLoading(false)
    }
  }

  const handleDeleteUser = async () => {
    if (!deleteTarget) return
    setDeleteLoading(true)
    try {
      const res = await fetch(`/api/users?id=${deleteTarget.id}`, { method: 'DELETE' })
      if (res.ok) {
        toast({ title: 'User Deleted', description: `${deleteTarget.name} has been deleted.` })
        setDeleteDialogOpen(false)
        setDeleteTarget(null)
        fetchUsers()
      } else {
        const data = await res.json()
        toast({ title: 'Error', description: data.error || 'Failed to delete user.', variant: 'destructive' })
      }
    } catch {
      toast({ title: 'Error', description: 'Something went wrong.', variant: 'destructive' })
    } finally {
      setDeleteLoading(false)
    }
  }

  // ─── Filter Users ────────────────────────────────────────────────────────────

  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      !searchQuery ||
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesSearch
  })

  // ─── Role Badge ──────────────────────────────────────────────────────────────

  const RoleBadge = ({ role }: { role: string }) => {
    switch (role) {
      case 'SUPER_ADMIN':
        return (
          <Badge className="bg-gradient-to-r from-amber-500 to-purple-600 text-white border-0">
            <Crown className="h-3 w-3 mr-1" />
            SUPER_ADMIN
          </Badge>
        )
      case 'ADMIN':
        return <Badge className="bg-blue-500 text-white border-0">ADMIN</Badge>
      default:
        return <Badge variant="secondary">USER</Badge>
    }
  }

  // ─── Format Date ─────────────────────────────────────────────────────────────

  const formatDate = (dateStr: string) => {
    try {
      return new Date(dateStr).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      })
    } catch {
      return dateStr
    }
  }

  // ─── Status Badge ────────────────────────────────────────────────────────────

  const StatusBadge = ({ status }: { status: string }) => {
    const variants: Record<string, string> = {
      PENDING: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400',
      CONFIRMED: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400',
      CANCELLED: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
      COMPLETED: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
    }
    return (
      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${variants[status] || 'bg-gray-100 text-gray-800'}`}>
        {status}
      </span>
    )
  }

  // ─── Sidebar Component ───────────────────────────────────────────────────────

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="p-4 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="gradient-gold p-2 rounded-lg">
            <Crown className="h-5 w-5 text-white" />
          </div>
          <div>
            <h2 className="text-white font-bold text-sm">Super Admin</h2>
            <p className="text-white/50 text-xs">Star Cuts</p>
          </div>
        </div>
      </div>

      {/* Nav Items */}
      <nav className="flex-1 p-3 space-y-1">
        {SIDEBAR_ITEMS.map((item) => {
          const Icon = item.icon
          const isActive = activeTab === item.id
          return (
            <button
              key={item.id}
              onClick={() => {
                setActiveTab(item.id)
                setMobileSidebarOpen(false)
              }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                isActive
                  ? 'bg-white/15 text-white'
                  : 'text-white/60 hover:bg-white/10 hover:text-white'
              }`}
            >
              <Icon className="h-4 w-4" />
              {sidebarOpen && <span>{item.label}</span>}
            </button>
          )
        })}
      </nav>

      {/* User Info */}
      <div className="p-4 border-t border-white/10">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-full gradient-gold flex items-center justify-center">
            <Crown className="h-4 w-4 text-white" />
          </div>
          {sidebarOpen && (
            <div className="flex-1 min-w-0">
              <p className="text-white text-sm font-medium truncate">{session.user?.name}</p>
              <p className="text-white/50 text-xs truncate">{session.user?.email}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )

  // ─── Dashboard Tab ───────────────────────────────────────────────────────────

  const DashboardTab = () => (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Revenue Card - Prominent */}
        <Card className="md:col-span-2 lg:col-span-2 overflow-hidden border-0">
          <div className="gradient-gold p-6 text-white relative">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-8 translate-x-8" />
            <div className="absolute bottom-0 left-1/2 w-24 h-24 bg-white/5 rounded-full translate-y-10" />
            <div className="relative">
              <div className="flex items-center gap-2 mb-2">
                <Banknote className="h-5 w-5" />
                <span className="text-sm font-medium text-white/80">Total Revenue</span>
              </div>
              {statsLoading ? (
                <Skeleton className="h-10 w-32 bg-white/20" />
              ) : (
                <p className="text-4xl font-bold">
                  Rs {stats?.totalRevenue?.toLocaleString() ?? 0}
                </p>
              )}
              <p className="text-sm text-white/60 mt-1">From completed bookings</p>
            </div>
          </div>
        </Card>

        {/* Total Bookings */}
        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Bookings</p>
                {statsLoading ? (
                  <Skeleton className="h-8 w-16 mt-1" />
                ) : (
                  <p className="text-2xl font-bold mt-1">{stats?.totalBookings || 0}</p>
                )}
              </div>
              <div className="h-12 w-12 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                <CalendarDays className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Total Users */}
        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Users</p>
                {statsLoading ? (
                  <Skeleton className="h-8 w-16 mt-1" />
                ) : (
                  <p className="text-2xl font-bold mt-1">{stats?.totalUsers || 0}</p>
                )}
              </div>
              <div className="h-12 w-12 rounded-xl bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                <Users className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Total Services */}
        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Services</p>
                {statsLoading ? (
                  <Skeleton className="h-8 w-16 mt-1" />
                ) : (
                  <p className="text-2xl font-bold mt-1">{stats?.totalServices || 0}</p>
                )}
              </div>
              <div className="h-12 w-12 rounded-xl bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                <Sparkles className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Pending Bookings */}
        <Card className="hover:shadow-md transition-shadow border-amber-200 dark:border-amber-800/30">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Pending Bookings</p>
                {statsLoading ? (
                  <Skeleton className="h-8 w-16 mt-1" />
                ) : (
                  <p className="text-2xl font-bold mt-1 text-amber-600 dark:text-amber-400">
                    {stats?.pendingBookings || 0}
                  </p>
                )}
              </div>
              <div className="h-12 w-12 rounded-xl bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                <Clock className="h-6 w-6 text-amber-600 dark:text-amber-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Unread Messages */}
        <Card className={`hover:shadow-md transition-shadow ${stats?.unreadMessages ? 'border-rose-200 dark:border-rose-800/30' : ''}`}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Unread Messages</p>
                {statsLoading ? (
                  <Skeleton className="h-8 w-16 mt-1" />
                ) : (
                  <p className={`text-2xl font-bold mt-1 ${stats?.unreadMessages ? 'text-rose-600 dark:text-rose-400' : ''}`}>
                    {stats?.unreadMessages || 0}
                  </p>
                )}
              </div>
              <div className={`h-12 w-12 rounded-xl flex items-center justify-center ${stats?.unreadMessages ? 'bg-rose-100 dark:bg-rose-900/30' : 'bg-gray-100 dark:bg-gray-900/30'}`}>
                <MessageSquare className={`h-6 w-6 ${stats?.unreadMessages ? 'text-rose-600 dark:text-rose-400' : 'text-gray-600 dark:text-gray-400'}`} />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity & Quick Links */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg">Recent Bookings</CardTitle>
            <CardDescription>Latest booking activity</CardDescription>
          </CardHeader>
          <CardContent>
            {bookingsLoading ? (
              <div className="space-y-3">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Skeleton key={i} className="h-12 w-full" />
                ))}
              </div>
            ) : recentBookings.length === 0 ? (
              <p className="text-muted-foreground text-sm text-center py-8">No bookings yet.</p>
            ) : (
              <ScrollArea className="max-h-96">
                <div className="space-y-3">
                  {recentBookings.map((booking) => (
                    <div
                      key={booking.id}
                      className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-medium truncate">
                            {booking.user?.name || 'Unknown'}
                          </p>
                          <StatusBadge status={booking.status} />
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {booking.service?.title || 'Service'} &middot; {booking.date} at {booking.time}
                        </p>
                      </div>
                      <p className="text-xs text-muted-foreground ml-4 shrink-0">
                        {formatDate(booking.createdAt)}
                      </p>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            )}
          </CardContent>
        </Card>

        {/* Quick Links */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Quick Actions</CardTitle>
            <CardDescription>Navigate to key areas</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {[
              { label: 'Manage Users', icon: Users, tab: 'users' as TabId },
              { label: 'View Analytics', icon: BarChart3, tab: 'analytics' as TabId },
              { label: 'Manage Content', icon: FileText, tab: 'content' as TabId },
              { label: 'System Settings', icon: Settings, tab: 'settings' as TabId },
            ].map((link) => {
              const Icon = link.icon
              return (
                <button
                  key={link.tab}
                  onClick={() => setActiveTab(link.tab)}
                  className="w-full flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <Icon className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">{link.label}</span>
                  </div>
                  <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:translate-x-1 transition-transform" />
                </button>
              )
            })}
          </CardContent>
        </Card>
      </div>
    </div>
  )

  // ─── Users Tab ───────────────────────────────────────────────────────────────

  const UsersTab = () => (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold">User Management</h2>
          <p className="text-muted-foreground text-sm">Manage all users and their roles</p>
        </div>
        <Button onClick={() => setCreateDialogOpen(true)} className="gradient-gold text-white border-0 hover:opacity-90">
          <Plus className="h-4 w-4 mr-2" />
          Create Admin
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <Select value={roleFilter} onValueChange={setRoleFilter}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Filter by role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Roles</SelectItem>
                  <SelectItem value="USER">User</SelectItem>
                  <SelectItem value="ADMIN">Admin</SelectItem>
                  <SelectItem value="SUPER_ADMIN">Super Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card>
        <CardContent className="p-0">
          {usersLoading ? (
            <div className="p-6 space-y-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="py-12 text-center">
              <Users className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
              <p className="text-muted-foreground">No users found</p>
            </div>
          ) : (
            <ScrollArea className="max-h-[500px]">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">{user.name}</TableCell>
                      <TableCell className="text-muted-foreground">{user.email}</TableCell>
                      <TableCell>
                        <RoleBadge role={user.role} />
                      </TableCell>
                      <TableCell className="text-muted-foreground text-sm">
                        {formatDate(user.createdAt)}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setEditForm({
                                id: user.id,
                                name: user.name,
                                email: user.email,
                                role: user.role,
                              })
                              setEditDialogOpen(true)
                            }}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          {user.id !== currentUserId && (
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-destructive hover:text-destructive"
                              onClick={() => {
                                setDeleteTarget(user)
                                setDeleteDialogOpen(true)
                              }}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </ScrollArea>
          )}
        </CardContent>
      </Card>

      {/* Create User Dialog */}
      <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <UserCog className="h-5 w-5" />
              Create New User
            </DialogTitle>
            <DialogDescription>
              Add a new user to the system. Choose their role carefully.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="create-name">Name</Label>
              <Input
                id="create-name"
                placeholder="Full name"
                value={createForm.name}
                onChange={(e) => setCreateForm({ ...createForm, name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="create-email">Email</Label>
              <Input
                id="create-email"
                type="email"
                placeholder="email@example.com"
                value={createForm.email}
                onChange={(e) => setCreateForm({ ...createForm, email: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="create-password">Password</Label>
              <Input
                id="create-password"
                type="password"
                placeholder="Create a password"
                value={createForm.password}
                onChange={(e) => setCreateForm({ ...createForm, password: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Role</Label>
              <Select
                value={createForm.role}
                onValueChange={(val) => setCreateForm({ ...createForm, role: val })}
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="USER">User</SelectItem>
                  <SelectItem value="ADMIN">Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCreateDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateUser} disabled={createLoading} className="gradient-gold text-white border-0">
              {createLoading ? 'Creating...' : 'Create User'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit User Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Pencil className="h-5 w-5" />
              Edit User
            </DialogTitle>
            <DialogDescription>
              Update user information and role.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-name">Name</Label>
              <Input
                id="edit-name"
                value={editForm.name}
                onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-email">Email</Label>
              <Input
                id="edit-email"
                type="email"
                value={editForm.email}
                onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Role</Label>
              <Select
                value={editForm.role}
                onValueChange={(val) => setEditForm({ ...editForm, role: val })}
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="USER">User</SelectItem>
                  <SelectItem value="ADMIN">Admin</SelectItem>
                  <SelectItem value="SUPER_ADMIN">Super Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleEditUser} disabled={editLoading} className="gradient-gold text-white border-0">
              {editLoading ? 'Saving...' : 'Save Changes'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete User Alert Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-destructive" />
              Delete User
            </AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete <strong>{deleteTarget?.name}</strong>? This action
              cannot be undone. All of their bookings and associated data will be permanently removed.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteUser}
              disabled={deleteLoading}
              className="bg-destructive text-white hover:bg-destructive/90"
            >
              {deleteLoading ? 'Deleting...' : 'Delete User'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )

  // ─── Analytics Tab ───────────────────────────────────────────────────────────

  const AnalyticsTab = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Analytics</h2>
        <p className="text-muted-foreground text-sm">Insights and performance metrics</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                <Banknote className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Revenue</p>
                <p className="text-xl font-bold">Rs {stats?.totalRevenue?.toLocaleString() ?? 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                <TrendingUp className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Users</p>
                <p className="text-xl font-bold">{stats?.totalUsers || 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                <CalendarDays className="h-5 w-5 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Bookings</p>
                <p className="text-xl font-bold">{stats?.totalBookings || 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Services Bar Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Top Services</CardTitle>
            <CardDescription>Most booked services</CardDescription>
          </CardHeader>
          <CardContent>
            {statsLoading ? (
              <div className="h-64 flex items-center justify-center">
                <Skeleton className="h-64 w-full" />
              </div>
            ) : topServices.length === 0 ? (
              <div className="h-64 flex items-center justify-center">
                <p className="text-muted-foreground">No booking data yet</p>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={topServices} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                  <XAxis
                    dataKey="title"
                    tick={{ fontSize: 12 }}
                    angle={-20}
                    textAnchor="end"
                    height={60}
                  />
                  <YAxis tick={{ fontSize: 12 }} allowDecimals={false} />
                  <Tooltip
                    contentStyle={{
                      borderRadius: '8px',
                      border: '1px solid hsl(var(--border))',
                      boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)',
                    }}
                  />
                  <Bar
                    dataKey="bookingsCount"
                    name="Bookings"
                    fill="oklch(0.55 0.2 10)"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        {/* Bookings by Status Pie Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Bookings by Status</CardTitle>
            <CardDescription>Distribution of booking statuses</CardDescription>
          </CardHeader>
          <CardContent>
            {statsLoading ? (
              <div className="h-64 flex items-center justify-center">
                <Skeleton className="h-64 w-full" />
              </div>
            ) : bookingsByStatus.length === 0 ? (
              <div className="h-64 flex items-center justify-center">
                <p className="text-muted-foreground">No booking data yet</p>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={280}>
                <PieChart>
                  <Pie
                    data={bookingsByStatus}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={3}
                    dataKey="count"
                    nameKey="status"
                    label={({ status, count }) => `${status}: ${count}`}
                  >
                    {bookingsByStatus.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={STATUS_COLORS[entry.status] || '#94a3b8'}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      borderRadius: '8px',
                      border: '1px solid hsl(var(--border))',
                      boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)',
                    }}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Status Cards Alternative View */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Status Breakdown</CardTitle>
          <CardDescription>Quick overview of booking statuses</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {['PENDING', 'CONFIRMED', 'CANCELLED', 'COMPLETED'].map((status) => {
              const item = bookingsByStatus.find((b) => b.status === status)
              const colors: Record<string, string> = {
                PENDING: 'border-amber-300 bg-amber-50 dark:bg-amber-900/20 dark:border-amber-700',
                CONFIRMED: 'border-emerald-300 bg-emerald-50 dark:bg-emerald-900/20 dark:border-emerald-700',
                CANCELLED: 'border-red-300 bg-red-50 dark:bg-red-900/20 dark:border-red-700',
                COMPLETED: 'border-blue-300 bg-blue-50 dark:bg-blue-900/20 dark:border-blue-700',
              }
              return (
                <div
                  key={status}
                  className={`p-4 rounded-xl border-2 text-center ${colors[status] || ''}`}
                >
                  <p className="text-2xl font-bold">{item?.count || 0}</p>
                  <p className="text-xs font-medium mt-1">{status}</p>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )

  // ─── Content Tab ─────────────────────────────────────────────────────────────

  const ContentTab = () => (
    <SuperAdminContentTab />
  )

  // ─── Settings Tab ────────────────────────────────────────────────────────────

  const SettingsTab = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Settings</h2>
        <p className="text-muted-foreground text-sm">Manage salon and system settings</p>
      </div>

      {/* Role Definitions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Shield className="h-5 w-5 text-primary" />
            Role Definitions
          </CardTitle>
          <CardDescription>Overview of user roles and their permissions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* USER Role */}
            <div className="rounded-xl border-2 border-gray-200 dark:border-gray-700 p-4 space-y-3">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                  <Eye className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                </div>
                <div>
                  <h3 className="font-bold text-sm">USER</h3>
                  <p className="text-xs text-muted-foreground">Basic Access</p>
                </div>
              </div>
              <Separator />
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500 mt-0.5 shrink-0" />
                  <span>Browse services and products</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500 mt-0.5 shrink-0" />
                  <span>Book appointments</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500 mt-0.5 shrink-0" />
                  <span>Manage own profile</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500 mt-0.5 shrink-0" />
                  <span>View gallery and testimonials</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500 mt-0.5 shrink-0" />
                  <span>Send contact messages</span>
                </li>
              </ul>
            </div>

            {/* ADMIN Role */}
            <div className="rounded-xl border-2 border-blue-200 dark:border-blue-800 p-4 space-y-3">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                  <Users className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h3 className="font-bold text-sm">ADMIN</h3>
                  <p className="text-xs text-muted-foreground">Full Management</p>
                </div>
              </div>
              <Separator />
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-blue-500 mt-0.5 shrink-0" />
                  <span>All User permissions</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-blue-500 mt-0.5 shrink-0" />
                  <span>Edit all website content</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-blue-500 mt-0.5 shrink-0" />
                  <span>Manage services &amp; products</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-blue-500 mt-0.5 shrink-0" />
                  <span>Manage bookings &amp; status</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-blue-500 mt-0.5 shrink-0" />
                  <span>Manage gallery images</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-blue-500 mt-0.5 shrink-0" />
                  <span>View &amp; respond to messages</span>
                </li>
              </ul>
            </div>

            {/* SUPER_ADMIN Role */}
            <div className="rounded-xl border-2 border-amber-200 dark:border-amber-800 p-4 space-y-3 bg-gradient-to-b from-amber-50/50 to-transparent dark:from-amber-900/10">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-lg gradient-gold flex items-center justify-center">
                  <Crown className="h-4 w-4 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-sm">SUPER_ADMIN</h3>
                  <p className="text-xs text-muted-foreground">Complete Control</p>
                </div>
              </div>
              <Separator />
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-amber-500 mt-0.5 shrink-0" />
                  <span>All Admin permissions</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-amber-500 mt-0.5 shrink-0" />
                  <span>User management &amp; roles</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-amber-500 mt-0.5 shrink-0" />
                  <span>Analytics &amp; reporting</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-amber-500 mt-0.5 shrink-0" />
                  <span>System settings &amp; configuration</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-amber-500 mt-0.5 shrink-0" />
                  <span>Create &amp; delete admin users</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-amber-500 mt-0.5 shrink-0" />
                  <span>Full data access &amp; export</span>
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Salon Information */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Salon Information</CardTitle>
            <CardDescription>Basic salon details</CardDescription>
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
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Opening Hours</CardTitle>
            <CardDescription>Weekly schedule</CardDescription>
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
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Social Media</CardTitle>
            <CardDescription>Social media links</CardDescription>
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
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">System Settings</CardTitle>
            <CardDescription>Configure system behavior</CardDescription>
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
          className="gradient-gold text-white border-0 hover:opacity-90 px-8"
        >
          {settingsSaving ? (
            <>
              <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
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

  // ─── Tab Content Renderer ────────────────────────────────────────────────────

  const renderTabContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return DashboardTab()
      case 'users':
        return UsersTab()
      case 'analytics':
        return AnalyticsTab()
      case 'content':
        return ContentTab()
      case 'payments':
        return <SuperAdminPaymentsTab />
      case 'settings':
        return SettingsTab()
    }
  }

  // ─── Main Layout ─────────────────────────────────────────────────────────────

  return (
    <div className="flex min-h-[calc(100vh-4rem)]">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col bg-gradient-to-b from-gray-900 to-gray-800 text-white transition-all duration-300" style={{ width: sidebarOpen ? '250px' : '72px' }}>
        <SidebarContent />
        <div className="p-3 border-t border-white/10">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="w-full flex items-center justify-center p-2 rounded-lg text-white/60 hover:bg-white/10 hover:text-white transition-colors"
          >
            <ChevronLeft className={`h-4 w-4 transition-transform ${!sidebarOpen ? 'rotate-180' : ''}`} />
          </button>
        </div>
      </aside>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {mobileSidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-40 lg:hidden"
              onClick={() => setMobileSidebarOpen(false)}
            />
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="fixed left-0 top-0 bottom-0 w-[250px] bg-gradient-to-b from-gray-900 to-gray-800 text-white z-50 lg:hidden"
            >
              <SidebarContent />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="flex-1 min-w-0">
        {/* Top Bar */}
        <div className="sticky top-0 z-30 bg-background/80 backdrop-blur-sm border-b px-4 sm:px-6 py-3">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              className="lg:hidden"
              onClick={() => setMobileSidebarOpen(true)}
            >
              <Menu className="h-5 w-5" />
            </Button>
            <div className="flex items-center gap-2">
              <Crown className="h-5 w-5 text-amber-500" />
              <h1 className="text-lg font-bold text-gradient-gold">Super Admin Panel</h1>
            </div>
            <Badge className="bg-gradient-to-r from-amber-500 to-purple-600 text-white border-0 text-xs">
              SUPER ADMIN
            </Badge>
          </div>
        </div>

        {/* Tab Content */}
        <div className="p-4 sm:p-6">
          {renderTabContent()}
        </div>
      </main>
    </div>
  )
}
