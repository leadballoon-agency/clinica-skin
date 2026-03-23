import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { Suspense } from 'react'
import Script from 'next/script'
import './globals.css'
import StructuredData from '@/components/StructuredData'
import FacebookPixel from '@/components/FacebookPixel'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'CO2 Laser Resurfacing Cambridge | Doctor-Led | Clinica Skin',
  description: 'Doctor-led CO2 laser resurfacing in Cambridge. Smooth wrinkles, acne scars & sun damage with Dr. Katarzyna at Clinica Skin. Free consultation & SkinCeuticals scan. Award-winning, doctor-led clinic.',
  keywords: 'CO2 laser Cambridge, acne scar treatment Cambridge, laser skin resurfacing, CO2 laser treatment, pigmentation treatment, wrinkle treatment, Clinica Skin, Dr Katarzyna, Cambridge aesthetics, laser resurfacing UK, CO2 laser acne scars, fractional laser Cambridge, doctor-led aesthetics',
  authors: [{ name: 'Clinica Skin Cambridge' }],
  creator: 'Clinica Skin Cambridge',
  publisher: 'Clinica Skin Cambridge',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://co2lasercambridge.co.uk'),
  alternates: {
    canonical: 'https://co2lasercambridge.co.uk',
  },
  openGraph: {
    title: 'CO2 Laser Resurfacing Cambridge | Doctor-Led | Clinica Skin',
    description: 'Doctor-led CO2 laser resurfacing in Cambridge. Smooth wrinkles, acne scars & sun damage. Free consultation with Dr. Katarzyna at award-winning Clinica Skin.',
    url: 'https://co2lasercambridge.co.uk',
    siteName: 'Clinica Skin CO2 Laser Cambridge',
    type: 'website',
    locale: 'en_GB',
    images: [
      {
        url: '/images/Dr-Katarzyna-cropped.jpg',
        width: 1200,
        height: 630,
        alt: 'Dr. Katarzyna Wasilewska - CO2 Laser Specialist at Clinica Skin Cambridge',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'CO2 Laser Resurfacing Cambridge | Clinica Skin',
    description: 'Doctor-led CO2 laser resurfacing. Smooth wrinkles, acne scars & sun damage. Free consultation at award-winning Clinica Skin Cambridge.',
    images: ['/images/Dr-Katarzyna-cropped.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code',
  },
  other: {
    'geo.region': 'GB-CAM',
    'geo.placename': 'Cambridge',
    'geo.position': '52.2053;0.1218',
    'ICBM': '52.2053, 0.1218',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en-GB">
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                var s = document.createElement('script');
                s.src = 'https://followupsystems.co.uk/widget.js';
                s.setAttribute('data-key', 'f44983f47f140f70e4a96744f334f597');
                s.setAttribute('data-booking', 'https://link.co2lasercambridge.co.uk/widget/booking/wI8gdiR5RL5ghq6dzkn8');
                s.defer = true;
                document.head.appendChild(s);
              })();
            `
          }}
        />
      </head>
      <body className={inter.className}>
        <Suspense fallback={null}>
          <FacebookPixel />
        </Suspense>
        <StructuredData />
        {children}
      </body>
    </html>
  )
}