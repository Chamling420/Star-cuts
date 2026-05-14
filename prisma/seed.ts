import { db } from '../src/lib/db'
import { hash } from 'bcryptjs'

async function seed() {
  console.log('Seeding database...')

  // ─── Seed Users ─────────────────────────────────────────────────────
  const users = [
    {
      name: 'Super Admin',
      email: 'superadmin@starcuts.com',
      password: await hash('admin123', 12),
      role: 'SUPER_ADMIN',
      phone: '+977-9800000001',
    },
    {
      name: 'Admin User',
      email: 'admin@starcuts.com',
      password: await hash('admin123', 12),
      role: 'ADMIN',
      phone: '+977-9800000002',
    },
    {
      name: 'Demo User',
      email: 'user@starcuts.com',
      password: await hash('user123', 12),
      role: 'USER',
      phone: '+977-9800000003',
    },
  ]

  for (const user of users) {
    await db.user.upsert({
      where: { email: user.email },
      update: { name: user.name, password: user.password, role: user.role, phone: user.phone },
      create: user,
    })
  }
  console.log('✓ Users seeded')

  // ─── Seed Services ──────────────────────────────────────────────────
  const services = [
    {
      title: 'Signature Haircut & Style',
      description: 'A premium haircut experience with consultation, shampoo, precision cut, and blow-dry styling tailored to your face shape and lifestyle.',
      price: 850,
      image: '/images/service-haircut.jpg',
      category: 'hair',
      duration: 60,
      featured: true,
      active: true,
    },
    {
      title: 'Balayage & Highlights',
      description: 'Hand-painted balayage or foil highlights for a natural, sun-kissed look. Includes toner and deep conditioning treatment.',
      price: 1950,
      image: '/images/service-balayage.jpg',
      category: 'hair',
      duration: 120,
      featured: true,
      active: true,
    },
    {
      title: 'Luxury Facial Treatment',
      description: 'Indulge in our signature facial featuring deep cleansing, exfoliation, steam extraction, massage, and a custom mask for radiant skin.',
      price: 1200,
      image: '/images/service-facial.jpg',
      category: 'skin',
      duration: 75,
      featured: true,
      active: true,
    },
    {
      title: 'Bridal Hair & Makeup',
      description: 'Complete bridal beauty package including trial session, day-of styling, and touch-up kit. Make your special day unforgettable.',
      price: 3500,
      image: '/images/service-bridal.jpg',
      category: 'makeup',
      duration: 180,
      featured: true,
      active: true,
    },
    {
      title: 'Color Transformation',
      description: 'Full hair color transformation with expert color consultation, application, and finishing. From subtle to bold, we bring your vision to life.',
      price: 1650,
      image: '/images/service-coloring.jpg',
      category: 'hair',
      duration: 120,
      featured: true,
      active: true,
    },
    {
      title: 'Gel Manicure & Pedicure',
      description: 'Luxurious nail care including soak, cuticle care, exfoliation, massage, and long-lasting gel polish application for hands and feet.',
      price: 750,
      image: '/images/service-manicure.jpg',
      category: 'nails',
      duration: 90,
      featured: true,
      active: true,
    },
    {
      title: 'Deep Conditioning Treatment',
      description: 'Intensive hair repair treatment using premium keratin and moisture complexes. Restores shine, strength, and manageability.',
      price: 550,
      image: null,
      category: 'hair',
      duration: 45,
      featured: false,
      active: true,
    },
    {
      title: 'Anti-Aging Facial',
      description: 'Advanced anti-aging facial with collagen boost, microcurrent therapy, and premium serums for youthful, firm skin.',
      price: 1550,
      image: null,
      category: 'skin',
      duration: 90,
      featured: false,
      active: true,
    },
  ]

  for (const service of services) {
    await db.service.upsert({
      where: { id: `svc-${service.title.slice(0, 10).replace(/\s/g, '')}` },
      update: service,
      create: { id: `svc-${service.title.slice(0, 10).replace(/\s/g, '')}`, ...service },
    })
  }
  console.log('✓ Services seeded')

  // ─── Seed Products ──────────────────────────────────────────────────
  const products = [
    {
      title: 'Argan Oil Hair Serum',
      description: 'Premium argan oil blend for silky, frizz-free hair. Adds shine and protects against heat damage.',
      price: 350,
      image: '/images/product-argan.jpg',
      category: 'hair',
      brand: 'Star Cuts Pro',
      inStock: true,
      featured: true,
    },
    {
      title: 'Vitamin C Brightening Cream',
      description: 'Advanced vitamin C formula that brightens skin tone, reduces dark spots, and provides antioxidant protection.',
      price: 490,
      image: '/images/product-vitaminc.jpg',
      category: 'skin',
      brand: 'Star Cuts Skincare',
      inStock: true,
      featured: true,
    },
    {
      title: 'Luxury Foundation Collection',
      description: 'Lightweight, buildable coverage foundation with SPF 30. Available in 20 shades for every skin tone.',
      price: 430,
      image: '/images/product-foundation.jpg',
      category: 'makeup',
      brand: 'Star Cuts Beauty',
      inStock: true,
      featured: true,
    },
    {
      title: 'Shimmer Eyeshadow Palette',
      description: '12-shade palette with matte and shimmer finishes. Highly pigmented, long-lasting formula for day-to-night looks.',
      price: 390,
      image: '/images/product-eyeshadow.jpg',
      category: 'makeup',
      brand: 'Star Cuts Beauty',
      inStock: true,
      featured: true,
    },
    {
      title: 'Keratin Repair Shampoo',
      description: 'Sulfate-free shampoo infused with keratin proteins. Gently cleanses while strengthening and repairing damaged hair.',
      price: 290,
      image: null,
      category: 'hair',
      brand: 'Star Cuts Pro',
      inStock: true,
      featured: false,
    },
  ]

  for (const product of products) {
    await db.product.upsert({
      where: { id: `prod-${product.title.slice(0, 10).replace(/\s/g, '')}` },
      update: product,
      create: { id: `prod-${product.title.slice(0, 10).replace(/\s/g, '')}`, ...product },
    })
  }
  console.log('✓ Products seeded')

  // ─── Seed Gallery Images ────────────────────────────────────────────
  const galleryImages = [
    {
      title: 'Elegant Bridal Updo',
      image: '/images/gallery-1.jpg',
      category: 'styling',
      beforeImage: null,
      description: 'A stunning bridal updo with delicate floral accessories.',
      active: true,
    },
    {
      title: 'Balayage Transformation',
      image: '/images/gallery-2.jpg',
      category: 'before-after',
      beforeImage: null,
      description: 'Beautiful caramel balayage on dark hair.',
      active: true,
    },
    {
      title: 'Glamorous Evening Look',
      image: '/images/gallery-3.jpg',
      category: 'styling',
      beforeImage: null,
      description: 'Hollywood-inspired waves for a red carpet event.',
      active: true,
    },
    {
      title: 'Creative Color',
      image: '/images/gallery-4.jpg',
      category: 'styling',
      beforeImage: null,
      description: 'Bold and vibrant creative color work.',
      active: true,
    },
    {
      title: 'Classic Bob Cut',
      image: '/images/gallery-5.jpg',
      category: 'styling',
      beforeImage: null,
      description: 'Sleek and modern bob with subtle layers.',
      active: true,
    },
    {
      title: 'Nail Art Collection',
      image: '/images/gallery-6.jpg',
      category: 'styling',
      beforeImage: null,
      description: 'Intricate nail art for a special occasion.',
      active: true,
    },
  ]

  for (const img of galleryImages) {
    await db.galleryImage.upsert({
      where: { id: `gal-${img.title.slice(0, 10).replace(/\s/g, '')}` },
      update: img,
      create: { id: `gal-${img.title.slice(0, 10).replace(/\s/g, '')}`, ...img },
    })
  }
  console.log('✓ Gallery seeded')

  // ─── Seed Site Content ──────────────────────────────────────────────
  const contentItems = [
    { section: 'hero', key: 'title', value: 'Welcome to Star Cuts' },
    { section: 'hero', key: 'subtitle', value: 'Beauty Redefined' },
    { section: 'hero', key: 'description', value: 'Experience the art of beauty at Star Cuts. Our expert stylists and premium products create stunning transformations that leave you feeling confident and radiant.' },
    { section: 'hero', key: 'cta_text', value: 'Book Appointment' },
    { section: 'about', key: 'title', value: 'Our Story' },
    { section: 'about', key: 'description', value: 'Founded with a passion for beauty and a commitment to excellence, Star Cuts has been transforming looks and boosting confidence since 2015. Our team of skilled professionals combines artistry with the latest techniques to deliver results that exceed expectations.' },
    { section: 'about', key: 'experience_years', value: '9' },
    { section: 'about', key: 'happy_clients', value: '5000' },
    { section: 'contact', key: 'title', value: 'Get In Touch' },
    { section: 'contact', key: 'subtitle', value: 'We\'d love to hear from you' },
    { section: 'contact', key: 'address', value: 'Lazimpat, Kathmandu, Nepal' },
    { section: 'contact', key: 'phone', value: '+977-01-4567890' },
    { section: 'contact', key: 'email', value: 'hello@starcuts.com.np' },
    { section: 'footer', key: 'tagline', value: 'Where Beauty Meets Excellence' },
    { section: 'footer', key: 'copyright', value: '© 2024 Star Cuts Beauty Salon. All rights reserved.' },
    { section: 'testimonials', key: 'title', value: 'What Our Clients Say' },
    { section: 'testimonials', key: 'subtitle', value: 'Real stories from real clients' },
  ]

  for (const item of contentItems) {
    await db.siteContent.upsert({
      where: { section_key: { section: item.section, key: item.key } },
      update: { value: item.value },
      create: item,
    })
  }
  console.log('✓ Content seeded')

  console.log('\n✅ Seeding completed successfully!')
  console.log('\nLogin Credentials:')
  console.log('  Super Admin: superadmin@starcuts.com / admin123')
  console.log('  Admin:       admin@starcuts.com / admin123')
  console.log('  User:        user@starcuts.com / user123')
}

seed()
  .catch((e) => {
    console.error('Seed error:', e)
    process.exit(1)
  })
  .finally(async () => {
    await db.$disconnect()
  })
