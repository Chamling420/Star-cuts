import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  const contents = [
    // Hero section
    { section: 'hero', key: 'title', value: 'Where Beauty Meets Excellence' },
    { section: 'hero', key: 'subtitle', value: 'Experience premium hair styling, coloring, skincare & beauty services at Star Cuts Beauty Salon' },
    { section: 'hero', key: 'cta_text', value: 'Book Appointment' },
    { section: 'hero', key: 'image', value: '/images/hero-salon.jpg' },
    // About section
    { section: 'about', key: 'title', value: 'About Star Cuts' },
    { section: 'about', key: 'story', value: 'Founded in 2010, Star Cuts Beauty Salon has been a premier destination for beauty services in the heart of Kathmandu. What began as a small, passionate studio with a big dream has blossomed into one of the city\'s most beloved salons, known for transforming not just looks, but lives.' },
    { section: 'about', key: 'mission', value: 'To provide exceptional beauty services that enhance confidence and celebrate individuality.' },
    { section: 'about', key: 'vision', value: 'To be the most trusted and innovative beauty salon, setting industry standards for excellence.' },
    { section: 'about', key: 'image', value: '/images/about-team.jpg' },
    // Contact section
    { section: 'contact', key: 'address', value: '123 Beauty Lane, Kathmandu, Nepal' },
    { section: 'contact', key: 'phone', value: '+977-1-4567890' },
    { section: 'contact', key: 'email', value: 'hello@starcuts.com' },
    { section: 'contact', key: 'hours_weekday', value: 'Mon-Fri: 9am - 8pm' },
    { section: 'contact', key: 'hours_saturday', value: 'Sat: 9am - 6pm' },
    { section: 'contact', key: 'hours_sunday', value: 'Sun: 10am - 5pm' },
    { section: 'contact', key: 'whatsapp', value: '+97714567890' },
    // Footer
    { section: 'footer', key: 'tagline', value: 'Experience luxury hair styling, coloring, skincare, and beauty services. Where elegance meets expertise for your perfect look.' },
    { section: 'footer', key: 'copyright', value: 'Star Cuts Beauty Salon' },
    // Testimonials
    { section: 'testimonials', key: 'title', value: 'What Our Clients Say' },
  ]

  for (const content of contents) {
    await prisma.siteContent.upsert({
      where: { section_key: { section: content.section, key: content.key } },
      update: { value: content.value },
      create: content,
    })
  }
  
  console.log('Content seeded:', contents.length, 'items')
}

main().catch(console.error).finally(() => prisma.$disconnect())
