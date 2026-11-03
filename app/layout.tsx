import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Atlas | Built for UNILESA Students',
  description: 'Atlas is an independent student-built platform for University of Ilesa students. Explore Atlas AI, discover upcoming student resources, and help shape the platform.',
  keywords: ['Atlas', 'UNILESA Atlas', 'University of Ilesa', 'UNILESA AI Assistant', 'Atlas AI', 'UNILESA student platform'],
  openGraph: {
    title: 'Atlas | Built for UNILESA Students',
    description: 'A student-built platform for University of Ilesa students.',
    type: 'website',
  },
  icons: { icon: '/atlas-network-logo.svg', apple: '/apple-icon.png' },
}

export const viewport: Viewport = { colorScheme: 'light', themeColor: '#F7FAFF', width: 'device-width', initialScale: 1 }

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}{process.env.NODE_ENV === 'production' && <Analytics />}</body></html>
}
