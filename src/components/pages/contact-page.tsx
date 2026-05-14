'use client'

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod/v4'
import { zodResolver } from '@hookform/resolvers/zod'
import { motion } from 'framer-motion'
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  Send,
  Loader2,
  MessageCircle,
  Instagram,
  Facebook,
  Twitter,
} from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { useToast } from '@/hooks/use-toast'

const contactSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
})

type ContactFormValues = z.infer<typeof contactSchema>

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 },
}

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 },
  },
}

export function ContactPage() {
  const { toast } = useToast()
  const [submitting, setSubmitting] = useState(false)
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
        console.error('Failed to load contact content:', err)
      }
    }
    loadContent()
  }, [])

  // Helper to get content value with fallback
  const get = (key: string, fallback: string) => content[key] || fallback

  const address = get('contact.address', 'Lazimpat, Kathmandu\nNepal')
  const phone = get('contact.phone', '+977-01-4567890')
  const email = get('contact.email', 'hello@starcuts.com')
  const hoursWeekday = get('contact.hours_weekday', '9am - 8pm')
  const hoursSat = get('contact.hours_saturday', '9am - 6pm')
  const hoursSun = get('contact.hours_sunday', '10am - 5pm')
  const whatsappNumber = get('contact.whatsapp', '') || get('footer.whatsapp', '')
  const instagramUrl = get('footer.instagram', '#')
  const facebookUrl = get('footer.facebook', '#')
  const twitterUrl = get('footer.twitter', '#')

  const contactInfo = [
    {
      icon: MapPin,
      title: 'Address',
      details: address.split('\n'),
    },
    {
      icon: Phone,
      title: 'Phone',
      details: [phone],
    },
    {
      icon: Mail,
      title: 'Email',
      details: [email],
    },
    {
      icon: Clock,
      title: 'Hours',
      details: [
        `Mon-Fri: ${hoursWeekday}`,
        `Sat: ${hoursSat}`,
        `Sun: ${hoursSun}`,
      ],
    },
  ]

  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: '',
      email: '',
      message: '',
    },
  })

  const onSubmit = async (values: ContactFormValues) => {
    setSubmitting(true)
    try {
      const res = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      })

      if (res.ok) {
        toast({
          title: 'Message sent!',
          description:
            "Thank you for reaching out. We'll get back to you shortly.",
        })
        form.reset()
      } else {
        const data = await res.json()
        toast({
          title: 'Failed to send',
          description: data.error || 'Something went wrong. Please try again.',
          variant: 'destructive',
        })
      }
    } catch {
      toast({
        title: 'Failed to send',
        description: 'An unexpected error occurred. Please try again.',
        variant: 'destructive',
      })
    } finally {
      setSubmitting(false)
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
            Contact Us
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mx-auto mt-4 max-w-2xl text-lg text-white/80 md:text-xl"
          >
            We&apos;d love to hear from you — reach out for appointments,
            questions, or just to say hello
          </motion.p>
        </div>
      </section>

      {/* Contact Form + Info */}
      <section className="section-padding">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-8 lg:grid-cols-2">
            {/* Left Column - Contact Form */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-100px' }}
              variants={fadeInUp}
            >
              <Card className="border-0 shadow-lg">
                <CardContent className="p-6 md:p-8">
                  <h2 className="font-serif text-2xl font-bold text-gradient">
                    Send Us a Message
                  </h2>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Fill out the form below and we&apos;ll get back to you as
                    soon as possible.
                  </p>

                  <Form {...form}>
                    <form
                      onSubmit={form.handleSubmit(onSubmit)}
                      className="mt-6 space-y-4"
                    >
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Full Name</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Your name"
                                autoComplete="name"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                              <Input
                                type="email"
                                placeholder="you@example.com"
                                autoComplete="email"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="message"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Message</FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder="How can we help you?"
                                rows={5}
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <Button
                        type="submit"
                        className="w-full gradient-rose text-primary-foreground border-0 hover:opacity-90"
                        disabled={submitting}
                      >
                        {submitting ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Sending...
                          </>
                        ) : (
                          <>
                            <Send className="mr-2 h-4 w-4" />
                            Send Message
                          </>
                        )}
                      </Button>
                    </form>
                  </Form>
                </CardContent>
              </Card>
            </motion.div>

            {/* Right Column - Contact Info */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-100px' }}
              variants={staggerContainer}
              className="space-y-6"
            >
              {/* Info Card */}
              <motion.div variants={fadeInUp}>
                <Card className="glass-card border-0 p-6 md:p-8">
                  <CardContent className="p-0 space-y-6">
                    {contactInfo.map((info) => (
                      <div key={info.title} className="flex gap-4">
                        <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-lg gradient-rose">
                          <info.icon className="h-5 w-5 text-primary-foreground" />
                        </div>
                        <div>
                          <h3 className="font-semibold">{info.title}</h3>
                          {info.details.map((detail, idx) => (
                            <p
                              key={idx}
                              className="text-sm text-muted-foreground"
                            >
                              {detail}
                            </p>
                          ))}
                        </div>
                      </div>
                    ))}

                    {/* WhatsApp Button */}
                    {whatsappNumber && (
                      <a
                        href={`https://wa.me/${whatsappNumber.replace(/[^0-9]/g, '')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Button
                          variant="outline"
                          className="w-full border-green-500/30 text-green-600 hover:bg-green-500/10 hover:text-green-600 dark:text-green-400 dark:hover:text-green-400"
                        >
                          <MessageCircle className="mr-2 h-4 w-4" />
                          Chat on WhatsApp
                        </Button>
                      </a>
                    )}

                    {/* Social Links */}
                    <div className="flex items-center gap-3">
                      <a
                        href={instagramUrl}
                        target={instagramUrl !== '#' ? '_blank' : undefined}
                        rel={instagramUrl !== '#' ? 'noopener noreferrer' : undefined}
                        className="flex h-10 w-10 items-center justify-center rounded-full bg-muted text-muted-foreground transition-colors hover:bg-primary hover:text-primary-foreground"
                        aria-label="Instagram"
                      >
                        <Instagram className="h-5 w-5" />
                      </a>
                      <a
                        href={facebookUrl}
                        target={facebookUrl !== '#' ? '_blank' : undefined}
                        rel={facebookUrl !== '#' ? 'noopener noreferrer' : undefined}
                        className="flex h-10 w-10 items-center justify-center rounded-full bg-muted text-muted-foreground transition-colors hover:bg-primary hover:text-primary-foreground"
                        aria-label="Facebook"
                      >
                        <Facebook className="h-5 w-5" />
                      </a>
                      <a
                        href={twitterUrl}
                        target={twitterUrl !== '#' ? '_blank' : undefined}
                        rel={twitterUrl !== '#' ? 'noopener noreferrer' : undefined}
                        className="flex h-10 w-10 items-center justify-center rounded-full bg-muted text-muted-foreground transition-colors hover:bg-primary hover:text-primary-foreground"
                        aria-label="Twitter"
                      >
                        <Twitter className="h-5 w-5" />
                      </a>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Google Maps */}
      <section className="section-padding pt-0">
        <div className="mx-auto max-w-6xl">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            variants={fadeInUp}
          >
            <h2 className="mb-6 font-serif text-2xl font-bold text-gradient md:text-3xl">
              Find Us
            </h2>
            <Card className="overflow-hidden border-0 shadow-lg">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3022.215573291!2d-73.98!3d40.75!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNDDCsDQ1JzAwLjAiTiA3M8KwNTgnNDguMCJX!5e0!3m2!1sen!2sus!4v1"
                width="100%"
                height="300"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                title="Star Cuts Beauty Salon Location"
                className="w-full"
              />
            </Card>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
