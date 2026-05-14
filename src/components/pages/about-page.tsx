'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  Star,
  Heart,
  Lightbulb,
  Shield,
  Instagram,
  Facebook,
  Twitter,
} from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'

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

const teamMembers = [
  {
    name: 'Isabella Martinez',
    title: 'Creative Director & Master Stylist',
    experience: '15 years of experience',
    description:
      'Isabella brings an artistic vision to every transformation. With over 15 years in the industry, she specializes in precision cuts and editorial styling that make every client feel like a star.',
    initials: 'IM',
    gradient: 'from-rose-500 to-pink-600',
  },
  {
    name: 'Sophia Chen',
    title: 'Senior Colorist & Balayage Specialist',
    experience: '12 years of experience',
    description:
      'Sophia is a true color artist. Her expert balayage techniques and custom color formulations have earned her a devoted following and recognition in top beauty publications.',
    initials: 'SC',
    gradient: 'from-amber-500 to-orange-600',
  },
  {
    name: 'Olivia Thompson',
    title: 'Skincare Expert & Esthetician',
    experience: '10 years of experience',
    description:
      'Olivia combines science and luxury in her skincare treatments. Her personalized facials and advanced skin therapies deliver visible results with a deeply relaxing experience.',
    initials: 'OT',
    gradient: 'from-emerald-500 to-teal-600',
  },
  {
    name: 'Emma Williams',
    title: 'Makeup Artist & Nail Technician',
    experience: '8 years of experience',
    description:
      'Emma\'s creative flair shines in both makeup artistry and nail design. From bridal glam to avant-garde nail art, she brings artistry and precision to every appointment.',
    initials: 'EW',
    gradient: 'from-violet-500 to-purple-600',
  },
]

const values = [
  {
    icon: Star,
    title: 'Excellence',
    description:
      'We strive for perfection in every service, ensuring each client leaves feeling extraordinary and confident.',
  },
  {
    icon: Lightbulb,
    title: 'Innovation',
    description:
      'We continuously embrace new techniques, products, and trends to offer cutting-edge beauty solutions.',
  },
  {
    icon: Heart,
    title: 'Care',
    description:
      'We treat every client with warmth, empathy, and genuine care, creating a welcoming sanctuary for all.',
  },
  {
    icon: Shield,
    title: 'Integrity',
    description:
      'We uphold honesty and transparency in everything we do, from pricing to product recommendations.',
  },
]

export function AboutPage() {
  const [content, setContent] = useState<Record<string, string>>({})

  useEffect(() => {
    async function loadContent() {
      try {
        const res = await fetch('/api/content')
        if (res.ok) {
          const data = await res.json()
          const items: { section: string; key: string; value: string }[] = data.content || []
          const map: Record<string, string> = {}
          items.forEach((item) => {
            map[`${item.section}.${item.key}`] = item.value
          })
          setContent(map)
        }
      } catch (err) {
        console.error('Failed to load content:', err)
      }
    }
    loadContent()
  }, [])

  const get = (key: string, fallback: string) => content[key] || fallback

  return (
    <div className="min-h-screen">
      {/* Hero Banner */}
      <section className="gradient-rose relative overflow-hidden py-24 md:py-32">
        <div className="absolute inset-0 bg-[url('/noise.svg')] opacity-10" />
        <div className="relative mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="font-serif text-4xl font-bold text-white md:text-5xl lg:text-6xl"
          >
            {get('about.title', 'About Star Cuts')}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mx-auto mt-4 max-w-2xl text-lg text-white/80 md:text-xl"
          >
            {get('about.description', 'Where beauty meets artistry — discover the story behind the salon that celebrates you')}
          </motion.p>
        </div>
      </section>

      {/* Our Story */}
      <section className="section-padding">
        <div className="mx-auto max-w-4xl">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            variants={fadeInUp}
            transition={{ duration: 0.6 }}
          >
            <h2 className="font-serif text-3xl font-bold text-gradient md:text-4xl">
              Our Story
            </h2>
            <div className="mt-6 space-y-4 text-muted-foreground leading-relaxed">
              <p>
                {get('about.story', 'Founded in 2010, Star Cuts Beauty Salon has been a premier destination for beauty services in the heart of New York City. What began as a small, passionate studio with a big dream has blossomed into one of the city\'s most beloved salons, known for transforming not just looks, but lives. Our founder envisioned a space where artistry, warmth, and expertise converge — and that vision continues to guide everything we do.')}
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="section-padding bg-muted/50">
        <div className="mx-auto max-w-6xl">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            variants={staggerContainer}
            className="grid gap-6 md:grid-cols-2"
          >
            <motion.div variants={fadeInUp}>
              <Card className="glass-card h-full border-0 p-8">
                <CardContent className="p-0">
                  <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-xl gradient-rose">
                    <Star className="h-7 w-7 text-primary-foreground" />
                  </div>
                  <h3 className="font-serif text-2xl font-bold text-gradient">
                    Our Mission
                  </h3>
                  <p className="mt-3 text-muted-foreground leading-relaxed">
                    {get('about.mission', 'To provide exceptional beauty services that enhance confidence and celebrate individuality. We are committed to making every client feel seen, valued, and radiant — because your beauty is our purpose.')}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
            <motion.div variants={fadeInUp}>
              <Card className="glass-card h-full border-0 p-8">
                <CardContent className="p-0">
                  <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-xl gradient-gold">
                    <Lightbulb className="h-7 w-7 text-primary-foreground" />
                  </div>
                  <h3 className="font-serif text-2xl font-bold text-gradient-gold">
                    Our Vision
                  </h3>
                  <p className="mt-3 text-muted-foreground leading-relaxed">
                    {get('about.vision', 'To be the most trusted and innovative beauty salon, setting industry standards for excellence. We envision a future where every person who walks through our doors discovers a version of themselves they love.')}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Team Section */}
      <section className="section-padding">
        <div className="mx-auto max-w-6xl">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            variants={fadeInUp}
            className="text-center"
          >
            <h2 className="font-serif text-3xl font-bold text-gradient md:text-4xl">
              Meet Our Team
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-muted-foreground">
              The talented artists behind every transformation
            </p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            variants={staggerContainer}
            className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4"
          >
            {teamMembers.map((member) => (
              <motion.div key={member.name} variants={fadeInUp}>
                <Card className="group h-full border-0 shadow-md transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                  <CardContent className="p-6 text-center">
                    {/* Avatar */}
                    <div
                      className={`mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br ${member.gradient} shadow-lg transition-transform duration-300 group-hover:scale-105`}
                    >
                      <span className="text-2xl font-bold text-white">
                        {member.initials}
                      </span>
                    </div>

                    <h3 className="mt-4 font-serif text-lg font-semibold">
                      {member.name}
                    </h3>
                    <p className="mt-1 text-sm font-medium text-primary">
                      {member.title}
                    </p>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      {member.experience}
                    </p>
                    <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
                      {member.description}
                    </p>

                    {/* Social Links */}
                    <div className="mt-4 flex items-center justify-center gap-3">
                      <a
                        href={get('footer.instagram', '#')}
                        className="text-muted-foreground transition-colors hover:text-primary"
                        aria-label={`${member.name} on Instagram`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Instagram className="h-4 w-4" />
                      </a>
                      <a
                        href={get('footer.facebook', '#')}
                        className="text-muted-foreground transition-colors hover:text-primary"
                        aria-label={`${member.name} on Facebook`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Facebook className="h-4 w-4" />
                      </a>
                      <a
                        href={get('footer.twitter', '#')}
                        className="text-muted-foreground transition-colors hover:text-primary"
                        aria-label={`${member.name} on Twitter`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Twitter className="h-4 w-4" />
                      </a>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Values Section */}
      <section className="section-padding bg-muted/50">
        <div className="mx-auto max-w-6xl">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            variants={fadeInUp}
            className="text-center"
          >
            <h2 className="font-serif text-3xl font-bold text-gradient md:text-4xl">
              Our Values
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-muted-foreground">
              The principles that guide everything we do
            </p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            variants={staggerContainer}
            className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4"
          >
            {values.map((value) => (
              <motion.div key={value.title} variants={fadeInUp}>
                <Card className="glass-card h-full border-0 p-6 text-center transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
                  <CardContent className="p-0">
                    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-xl gradient-rose">
                      <value.icon className="h-7 w-7 text-primary-foreground" />
                    </div>
                    <h3 className="mt-4 font-serif text-xl font-semibold">
                      {value.title}
                    </h3>
                    <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                      {value.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
    </div>
  )
}
