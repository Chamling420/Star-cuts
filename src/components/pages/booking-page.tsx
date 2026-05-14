'use client'

import { useState, useEffect, useCallback } from 'react'
import { useSession } from 'next-auth/react'
import { motion, AnimatePresence } from 'framer-motion'
import { format } from 'date-fns'
import {
  Calendar as CalendarIcon,
  Clock,
  Check,
  ChevronRight,
  ChevronLeft,
  Loader2,
  AlertCircle,
  XCircle,
  Sparkles,
  User,
  FileText,
  CalendarDays,
} from 'lucide-react'
import { useAppStore } from '@/store/use-app-store'
import { useToast } from '@/hooks/use-toast'
import type { ServiceType, BookingType } from '@/types'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Calendar } from '@/components/ui/calendar'
import { Textarea } from '@/components/ui/textarea'
import { Separator } from '@/components/ui/separator'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Skeleton } from '@/components/ui/skeleton'

// ─── Time Slots ────────────────────────────────────────────────────────────────
const TIME_SLOTS = [
  '9:00', '9:30', '10:00', '10:30', '11:00', '11:30',
  '12:00', '12:30', '13:00', '13:30', '14:00', '14:30',
  '15:00', '15:30', '16:00', '16:30', '17:00', '17:30',
  '18:00', '18:30', '19:00',
]

// ─── Step Labels ───────────────────────────────────────────────────────────────
const STEPS = [
  { label: 'Select Service', icon: Sparkles },
  { label: 'Choose Date & Time', icon: CalendarIcon },
  { label: 'Confirm Booking', icon: Check },
]

// ─── Status Badge Colors ──────────────────────────────────────────────────────
const STATUS_CONFIG: Record<string, { color: string; bg: string; label: string }> = {
  PENDING: { color: 'text-yellow-700 dark:text-yellow-400', bg: 'bg-yellow-100 dark:bg-yellow-900/30', label: 'Pending' },
  CONFIRMED: { color: 'text-green-700 dark:text-green-400', bg: 'bg-green-100 dark:bg-green-900/30', label: 'Confirmed' },
  CANCELLED: { color: 'text-red-700 dark:text-red-400', bg: 'bg-red-100 dark:bg-red-900/30', label: 'Cancelled' },
  COMPLETED: { color: 'text-blue-700 dark:text-blue-400', bg: 'bg-blue-100 dark:bg-blue-900/30', label: 'Completed' },
}

// ─── Slide Variants ───────────────────────────────────────────────────────────
const slideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 300 : -300,
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => ({
    x: direction > 0 ? -300 : 300,
    opacity: 0,
  }),
}

// ─── Component ─────────────────────────────────────────────────────────────────
export function BookingPage() {
  const { data: session, status: sessionStatus } = useSession()
  const { openLogin } = useAppStore()
  const { toast } = useToast()

  // Wizard state
  const [step, setStep] = useState(0)
  const [direction, setDirection] = useState(1)

  // Step 1: Service selection
  const [services, setServices] = useState<ServiceType[]>([])
  const [servicesLoading, setServicesLoading] = useState(true)
  const [selectedService, setSelectedService] = useState<ServiceType | null>(null)

  // Step 2: Date & time
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined)
  const [selectedTime, setSelectedTime] = useState<string | null>(null)

  // Step 3: Confirm
  const [notes, setNotes] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [bookingSuccess, setBookingSuccess] = useState<BookingType | null>(null)
  const [bookingError, setBookingError] = useState('')

  // My Bookings
  const [bookings, setBookings] = useState<BookingType[]>([])
  const [bookingsLoading, setBookingsLoading] = useState(false)

  // ─── Fetch Services ────────────────────────────────────────────────────────
  const fetchServices = useCallback(async () => {
    setServicesLoading(true)
    try {
      const res = await fetch('/api/services')
      if (res.ok) {
        const data = await res.json()
        setServices(data.services || [])
      }
    } catch {
      toast({ title: 'Error', description: 'Failed to load services', variant: 'destructive' })
    } finally {
      setServicesLoading(false)
    }
  }, [toast])

  // ─── Fetch Bookings ────────────────────────────────────────────────────────
  const fetchBookings = useCallback(async () => {
    if (!session?.user) return
    const userId = (session.user as any).id
    if (!userId) return

    setBookingsLoading(true)
    try {
      const res = await fetch(`/api/bookings?userId=${userId}`)
      if (res.ok) {
        const data = await res.json()
        setBookings(data.bookings || [])
      }
    } catch {
      toast({ title: 'Error', description: 'Failed to load bookings', variant: 'destructive' })
    } finally {
      setBookingsLoading(false)
    }
  }, [session, toast])

  useEffect(() => {
    fetchServices()
  }, [fetchServices])

  useEffect(() => {
    if (session?.user) {
      fetchBookings()
    }
  }, [session, fetchBookings])

  // ─── Step Navigation ───────────────────────────────────────────────────────
  const goNext = () => {
    setDirection(1)
    setStep((s) => Math.min(s + 1, 2))
  }

  const goBack = () => {
    setDirection(-1)
    setStep((s) => Math.max(s - 1, 0))
  }

  const resetWizard = () => {
    setStep(0)
    setDirection(1)
    setSelectedService(null)
    setSelectedDate(undefined)
    setSelectedTime(null)
    setNotes('')
    setSubmitting(false)
    setBookingSuccess(null)
    setBookingError('')
  }

  // ─── Submit Booking ────────────────────────────────────────────────────────
  const handleConfirm = async () => {
    if (!selectedService || !selectedDate || !selectedTime || !session?.user) return

    setSubmitting(true)
    setBookingError('')

    try {
      const userId = (session.user as any).id
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          serviceId: selectedService.id,
          date: format(selectedDate, 'yyyy-MM-dd'),
          time: selectedTime,
          notes: notes || undefined,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        setBookingError(data.error || 'Failed to create booking')
        toast({ title: 'Booking Failed', description: data.error || 'Please try again.', variant: 'destructive' })
        return
      }

      setBookingSuccess(data.booking)
      toast({ title: 'Booking Confirmed!', description: `Your appointment for ${selectedService.title} has been booked.` })
      fetchBookings()
    } catch {
      setBookingError('An unexpected error occurred. Please try again.')
      toast({ title: 'Error', description: 'Something went wrong.', variant: 'destructive' })
    } finally {
      setSubmitting(false)
    }
  }

  // ─── Cancel Booking ────────────────────────────────────────────────────────
  const handleCancelBooking = async (bookingId: string) => {
    try {
      const res = await fetch('/api/bookings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: bookingId, status: 'CANCELLED' }),
      })

      if (res.ok) {
        toast({ title: 'Booking Cancelled', description: 'Your booking has been cancelled.' })
        fetchBookings()
      } else {
        const data = await res.json()
        toast({ title: 'Error', description: data.error || 'Failed to cancel booking.', variant: 'destructive' })
      }
    } catch {
      toast({ title: 'Error', description: 'Failed to cancel booking.', variant: 'destructive' })
    }
  }

  // ─── Not logged in ─────────────────────────────────────────────────────────
  if (sessionStatus === 'loading') {
    return (
      <section className="section-padding">
        <div className="mx-auto max-w-5xl">
          <Skeleton className="mx-auto mb-8 h-10 w-64" />
          <div className="grid gap-4 sm:grid-cols-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-48 rounded-xl" />
            ))}
          </div>
        </div>
      </section>
    )
  }

  if (!session?.user) {
    return (
      <section className="section-padding">
        <div className="mx-auto max-w-lg text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="glass-card p-8 sm:p-10"
          >
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl gradient-rose">
              <Sparkles className="h-8 w-8 text-primary-foreground" />
            </div>
            <h2 className="font-serif text-2xl font-bold sm:text-3xl">
              <span className="text-gradient">Book Your Appointment</span>
            </h2>
            <p className="mt-3 text-muted-foreground">
              Please log in to book appointments and manage your bookings.
            </p>
            <Button
              onClick={openLogin}
              className="mt-6 gradient-rose text-primary-foreground border-0 hover:opacity-90"
              size="lg"
            >
              <User className="mr-2 h-4 w-4" />
              Login to Book
            </Button>
          </motion.div>
        </div>
      </section>
    )
  }

  // ─── Step Indicator ────────────────────────────────────────────────────────
  const StepIndicator = () => (
    <div className="mb-8 flex items-center justify-center gap-2 sm:gap-4">
      {STEPS.map((s, i) => {
        const Icon = s.icon
        const isActive = i === step
        const isCompleted = i < step
        return (
          <div key={i} className="flex items-center gap-2 sm:gap-4">
            <div className="flex flex-col items-center gap-1.5">
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-full transition-all duration-300 ${
                  isCompleted
                    ? 'gradient-rose text-primary-foreground'
                    : isActive
                    ? 'ring-2 ring-primary bg-primary/10 text-primary'
                    : 'bg-muted text-muted-foreground'
                }`}
              >
                {isCompleted ? (
                  <Check className="h-5 w-5" />
                ) : (
                  <Icon className="h-5 w-5" />
                )}
              </div>
              <span
                className={`text-xs font-medium hidden sm:block ${
                  isActive ? 'text-primary' : isCompleted ? 'text-foreground' : 'text-muted-foreground'
                }`}
              >
                {s.label}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div
                className={`h-0.5 w-8 sm:w-16 rounded transition-colors duration-300 ${
                  i < step ? 'bg-primary' : 'bg-muted'
                }`}
              />
            )}
          </div>
        )
      })}
    </div>
  )

  // ─── Step 1: Select Service ────────────────────────────────────────────────
  const StepSelectService = () => (
    <motion.div
      key="step-1"
      custom={direction}
      variants={slideVariants}
      initial="enter"
      animate="center"
      exit="exit"
      transition={{ duration: 0.3, ease: 'easeInOut' }}
    >
      <CardHeader className="text-center pb-2">
        <CardTitle className="font-serif text-2xl sm:text-3xl">
          <span className="text-gradient">Select a Service</span>
        </CardTitle>
        <p className="text-muted-foreground mt-1">Choose the service you&apos;d like to book</p>
      </CardHeader>
      <CardContent>
        {servicesLoading ? (
          <div className="grid gap-4 sm:grid-cols-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-44 rounded-xl" />
            ))}
          </div>
        ) : services.length === 0 ? (
          <div className="py-12 text-center text-muted-foreground">
            <Sparkles className="mx-auto mb-3 h-10 w-10 opacity-40" />
            <p>No services available at the moment.</p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            {services.map((service) => {
              const isSelected = selectedService?.id === service.id
              return (
                <motion.div
                  key={service.id}
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Card
                    onClick={() => setSelectedService(service)}
                    className={`cursor-pointer transition-all duration-200 ${
                      isSelected
                        ? 'ring-2 ring-primary shadow-lg'
                        : 'hover:shadow-md hover:border-primary/30'
                    }`}
                  >
                    <CardContent className="p-4 sm:p-5">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-serif font-semibold text-base truncate">{service.title}</h3>
                            <Badge variant="secondary" className="shrink-0 text-[10px] px-1.5 py-0">
                              {service.category}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                            {service.description}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Clock className="h-3.5 w-3.5" />
                            {service.duration} min
                          </span>
                        </div>
                        <span className="text-lg font-bold text-primary">
                          Rs {service.price.toFixed(2)}
                        </span>
                      </div>
                      {isSelected && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          className="mt-3 flex items-center gap-1.5 text-sm font-medium text-primary"
                        >
                          <Check className="h-4 w-4" />
                          Selected
                        </motion.div>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              )
            })}
          </div>
        )}

        <div className="mt-6 flex justify-end">
          <Button
            onClick={goNext}
            disabled={!selectedService}
            className="gradient-rose text-primary-foreground border-0 hover:opacity-90"
          >
            Next
            <ChevronRight className="ml-1 h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </motion.div>
  )

  // ─── Step 2: Choose Date & Time ────────────────────────────────────────────
  const StepChooseDateTime = () => (
    <motion.div
      key="step-2"
      custom={direction}
      variants={slideVariants}
      initial="enter"
      animate="center"
      exit="exit"
      transition={{ duration: 0.3, ease: 'easeInOut' }}
    >
      <CardHeader className="text-center pb-2">
        <CardTitle className="font-serif text-2xl sm:text-3xl">
          <span className="text-gradient">Choose Date & Time</span>
        </CardTitle>
        <p className="text-muted-foreground mt-1">Pick your preferred appointment slot</p>
      </CardHeader>
      <CardContent>
        {/* Selected service summary */}
        {selectedService && (
          <div className="mb-6 rounded-lg bg-primary/5 border border-primary/10 p-3 flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg gradient-rose">
              <Sparkles className="h-5 w-5 text-primary-foreground" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium truncate">{selectedService.title}</p>
              <p className="text-sm text-muted-foreground">
                {selectedService.duration} min &middot; Rs {selectedService.price.toFixed(2)}
              </p>
            </div>
            <Button variant="ghost" size="sm" onClick={() => { setStep(0); setDirection(-1) }} className="shrink-0 text-primary">
              Change
            </Button>
          </div>
        )}

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Calendar */}
          <div>
            <h3 className="font-serif font-semibold mb-3 flex items-center gap-2">
              <CalendarDays className="h-4 w-4 text-primary" />
              Select Date
            </h3>
            <div className="flex justify-center">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                disabled={{ before: new Date() }}
                className="rounded-md border"
              />
            </div>
          </div>

          {/* Time slots */}
          <div>
            <h3 className="font-serif font-semibold mb-3 flex items-center gap-2">
              <Clock className="h-4 w-4 text-primary" />
              Select Time
            </h3>
            {!selectedDate ? (
              <div className="flex h-40 items-center justify-center rounded-lg border border-dashed text-muted-foreground">
                <p className="text-sm">Please select a date first</p>
              </div>
            ) : (
              <div className="grid grid-cols-3 gap-2 max-h-64 overflow-y-auto pr-1">
                {TIME_SLOTS.map((time) => {
                  const isSelected = selectedTime === time
                  return (
                    <Button
                      key={time}
                      variant={isSelected ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setSelectedTime(time)}
                      className={`${
                        isSelected
                          ? 'gradient-rose text-primary-foreground border-0 hover:opacity-90'
                          : 'hover:border-primary/50'
                      }`}
                    >
                      {time}
                    </Button>
                  )
                })}
              </div>
            )}
          </div>
        </div>

        <Separator className="my-6" />

        <div className="flex justify-between">
          <Button variant="outline" onClick={goBack}>
            <ChevronLeft className="mr-1 h-4 w-4" />
            Back
          </Button>
          <Button
            onClick={goNext}
            disabled={!selectedDate || !selectedTime}
            className="gradient-rose text-primary-foreground border-0 hover:opacity-90"
          >
            Next
            <ChevronRight className="ml-1 h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </motion.div>
  )

  // ─── Step 3: Confirm Booking ───────────────────────────────────────────────
  const StepConfirmBooking = () => {
    // Success state
    if (bookingSuccess) {
      return (
        <motion.div
          key="step-3-success"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          className="text-center py-6"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
            className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full gradient-rose"
          >
            <Sparkles className="h-10 w-10 text-primary-foreground" />
          </motion.div>
          <h2 className="font-serif text-2xl font-bold sm:text-3xl">
            <span className="text-gradient">Booking Confirmed!</span>
          </h2>
          <p className="mt-2 text-muted-foreground">Your appointment has been booked successfully.</p>

          <Card className="mt-6 glass-card text-left">
            <CardContent className="p-5 space-y-3">
              <div className="flex items-center gap-3">
                <Sparkles className="h-5 w-5 text-primary shrink-0" />
                <div>
                  <p className="text-sm text-muted-foreground">Service</p>
                  <p className="font-medium">{bookingSuccess.service?.title || selectedService?.title}</p>
                </div>
              </div>
              <Separator />
              <div className="flex items-center gap-3">
                <CalendarDays className="h-5 w-5 text-primary shrink-0" />
                <div>
                  <p className="text-sm text-muted-foreground">Date</p>
                  <p className="font-medium">{bookingSuccess.date && format(new Date(bookingSuccess.date), 'EEEE, MMMM d, yyyy')}</p>
                </div>
              </div>
              <Separator />
              <div className="flex items-center gap-3">
                <Clock className="h-5 w-5 text-primary shrink-0" />
                <div>
                  <p className="text-sm text-muted-foreground">Time</p>
                  <p className="font-medium">{bookingSuccess.time}</p>
                </div>
              </div>
              {bookingSuccess.notes && (
                <>
                  <Separator />
                  <div className="flex items-start gap-3">
                    <FileText className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm text-muted-foreground">Notes</p>
                      <p className="font-medium">{bookingSuccess.notes}</p>
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Button
              variant="outline"
              onClick={() => {
                resetWizard()
                fetchBookings()
              }}
            >
              <Sparkles className="mr-2 h-4 w-4" />
              Book Another
            </Button>
            <Button
              onClick={() => {
                document.getElementById('my-bookings-section')?.scrollIntoView({ behavior: 'smooth' })
              }}
              className="gradient-rose text-primary-foreground border-0 hover:opacity-90"
            >
              <CalendarDays className="mr-2 h-4 w-4" />
              View My Bookings
            </Button>
          </div>
        </motion.div>
      )
    }

    // Confirm form
    return (
      <motion.div
        key="step-3-confirm"
        custom={direction}
        variants={slideVariants}
        initial="enter"
        animate="center"
        exit="exit"
        transition={{ duration: 0.3, ease: 'easeInOut' }}
      >
        <CardHeader className="text-center pb-2">
          <CardTitle className="font-serif text-2xl sm:text-3xl">
            <span className="text-gradient">Confirm Your Booking</span>
          </CardTitle>
          <p className="text-muted-foreground mt-1">Review your appointment details</p>
        </CardHeader>
        <CardContent>
          {bookingError && (
            <div className="mb-4 flex items-center gap-2 rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
              <AlertCircle className="h-4 w-4 shrink-0" />
              {bookingError}
            </div>
          )}

          <Card className="glass-card">
            <CardContent className="p-5 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg gradient-rose">
                    <Sparkles className="h-5 w-5 text-primary-foreground" />
                  </div>
                  <div>
                    <p className="font-semibold">{selectedService?.title}</p>
                    <p className="text-sm text-muted-foreground">{selectedService?.category}</p>
                  </div>
                </div>
                <span className="text-lg font-bold text-primary">
                  Rs {selectedService?.price.toFixed(2)}
                </span>
              </div>

              <Separator />

              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <CalendarDays className="h-4 w-4 text-primary" />
                  <div>
                    <p className="text-xs text-muted-foreground">Date</p>
                    <p className="text-sm font-medium">
                      {selectedDate ? format(selectedDate, 'EEE, MMM d, yyyy') : ''}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-primary" />
                  <div>
                    <p className="text-xs text-muted-foreground">Time</p>
                    <p className="text-sm font-medium">{selectedTime}</p>
                  </div>
                </div>
              </div>

              <Separator />

              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-primary" />
                <span className="text-sm text-muted-foreground">Duration: {selectedService?.duration} min</span>
              </div>
            </CardContent>
          </Card>

          <div className="mt-4">
            <label htmlFor="booking-notes" className="text-sm font-medium mb-2 block">
              Additional Notes (optional)
            </label>
            <Textarea
              id="booking-notes"
              placeholder="Any special requests or preferences..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
            />
          </div>

          <Separator className="my-6" />

          <div className="flex justify-between">
            <Button variant="outline" onClick={goBack} disabled={submitting}>
              <ChevronLeft className="mr-1 h-4 w-4" />
              Back
            </Button>
            <Button
              onClick={handleConfirm}
              disabled={submitting}
              className="gradient-rose text-primary-foreground border-0 hover:opacity-90"
            >
              {submitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Confirming...
                </>
              ) : (
                <>
                  <Check className="mr-2 h-4 w-4" />
                  Confirm Booking
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </motion.div>
    )
  }

  // ─── My Bookings Section ───────────────────────────────────────────────────
  const MyBookings = () => (
    <div id="my-bookings-section" className="mt-12">
      <div className="flex items-center gap-3 mb-6">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl gradient-rose">
          <CalendarDays className="h-5 w-5 text-primary-foreground" />
        </div>
        <div>
          <h2 className="font-serif text-2xl font-bold">
            <span className="text-gradient">My Bookings</span>
          </h2>
          <p className="text-sm text-muted-foreground">View and manage your appointments</p>
        </div>
      </div>

      {bookingsLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-16 rounded-lg" />
          ))}
        </div>
      ) : bookings.length === 0 ? (
        <Card className="glass-card">
          <CardContent className="py-12 text-center">
            <CalendarDays className="mx-auto mb-3 h-10 w-10 text-muted-foreground/40" />
            <p className="text-muted-foreground">You don&apos;t have any bookings yet.</p>
            <Button
              variant="outline"
              onClick={resetWizard}
              className="mt-3"
              size="sm"
            >
              Book Your First Appointment
            </Button>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Desktop table */}
          <div className="hidden sm:block">
            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Service</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Time</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {bookings.map((booking) => {
                      const statusInfo = STATUS_CONFIG[booking.status] || STATUS_CONFIG.PENDING
                      const canCancel = booking.status === 'PENDING' || booking.status === 'CONFIRMED'
                      return (
                        <TableRow key={booking.id}>
                          <TableCell className="font-medium">
                            {booking.service?.title || 'Service'}
                          </TableCell>
                          <TableCell>
                            {booking.date ? format(new Date(booking.date), 'MMM d, yyyy') : ''}
                          </TableCell>
                          <TableCell>{booking.time}</TableCell>
                          <TableCell>
                            <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${statusInfo.bg} ${statusInfo.color}`}>
                              {statusInfo.label}
                            </span>
                          </TableCell>
                          <TableCell className="text-right">
                            {canCancel && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleCancelBooking(booking.id)}
                                className="text-destructive hover:text-destructive hover:bg-destructive/10"
                              >
                                <XCircle className="mr-1 h-3.5 w-3.5" />
                                Cancel
                              </Button>
                            )}
                          </TableCell>
                        </TableRow>
                      )
                    })}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>

          {/* Mobile cards */}
          <div className="space-y-3 sm:hidden">
            {bookings.map((booking) => {
              const statusInfo = STATUS_CONFIG[booking.status] || STATUS_CONFIG.PENDING
              const canCancel = booking.status === 'PENDING' || booking.status === 'CONFIRMED'
              return (
                <Card key={booking.id}>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">{booking.service?.title || 'Service'}</p>
                        <div className="mt-1 flex items-center gap-3 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <CalendarDays className="h-3.5 w-3.5" />
                            {booking.date ? format(new Date(booking.date), 'MMM d, yyyy') : ''}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="h-3.5 w-3.5" />
                            {booking.time}
                          </span>
                        </div>
                      </div>
                      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium shrink-0 ${statusInfo.bg} ${statusInfo.color}`}>
                        {statusInfo.label}
                      </span>
                    </div>
                    {canCancel && (
                      <div className="mt-3 flex justify-end">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleCancelBooking(booking.id)}
                          className="text-destructive hover:text-destructive hover:bg-destructive/10 -mr-2"
                        >
                          <XCircle className="mr-1 h-3.5 w-3.5" />
                          Cancel
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </>
      )}
    </div>
  )

  // ─── Render ────────────────────────────────────────────────────────────────
  return (
    <section className="section-padding">
      <div className="mx-auto max-w-4xl">
        {/* Page heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8 text-center"
        >
          <h1 className="font-serif text-3xl font-bold sm:text-4xl">
            <span className="text-gradient">Book Your Appointment</span>
          </h1>
          <p className="mt-2 text-muted-foreground">
            Schedule your next visit to Star Cuts Beauty Salon
          </p>
        </motion.div>

        {/* Step Indicator */}
        <StepIndicator />

        {/* Wizard Card */}
        <Card className="glass-card overflow-hidden">
          <AnimatePresence mode="wait" custom={direction}>
            {step === 0 && <StepSelectService />}
            {step === 1 && <StepChooseDateTime />}
            {step === 2 && <StepConfirmBooking />}
          </AnimatePresence>
        </Card>

        {/* My Bookings */}
        <MyBookings />
      </div>
    </section>
  )
}
