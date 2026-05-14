import type { Metadata } from 'next'
import { Playfair_Display, Lato } from 'next/font/google'
import { Providers } from '@/components/providers'
import './globals.css'

const playfairDisplay = Playfair_Display({
  variable: '--font-playfair',
  subsets: ['latin'],
  display: 'swap',
})

const lato = Lato({
  variable: '--font-lato',
  subsets: ['latin'],
  weight: ['300', '400', '700', '900'],
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Star Cuts Beauty Salon | Premium Hair & Beauty Services',
  description:
    'Experience luxury hair styling, coloring, skincare, and beauty services at Star Cuts Beauty Salon. Book your appointment today!',
  keywords: [
    'Star Cuts',
    'Beauty Salon',
    'Hair Styling',
    'Coloring',
    'Skincare',
    'Beauty Services',
    'Book Appointment',
  ],
  authors: [{ name: 'Star Cuts Beauty Salon' }],
  icons: {
    icon: '/logo.svg',
  },
  openGraph: {
    title: 'Star Cuts Beauty Salon | Premium Hair & Beauty Services',
    description:
      'Experience luxury hair styling, coloring, skincare, and beauty services at Star Cuts Beauty Salon. Book your appointment today!',
    siteName: 'Star Cuts Beauty Salon',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Star Cuts Beauty Salon | Premium Hair & Beauty Services',
    description:
      'Experience luxury hair styling, coloring, skincare, and beauty services at Star Cuts Beauty Salon.',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${playfairDisplay.variable} ${lato.variable} font-sans antialiased`}
      >
        <Providers>
          <div className="flex min-h-screen flex-col">
            {children}
          </div>
        </Providers>
      </body>
    </html>
  )
}
