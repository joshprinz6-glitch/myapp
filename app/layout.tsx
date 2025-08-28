
import './globals.css'
import { Inter } from 'next/font/google'
import MonetizationTriggers from './components/MonetizationTriggers'
import PostureAlert from './components/PostureAlert'
import RevenueOptimizer from './components/RevenueOptimizer'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'PostureGuard - AI Posture Monitoring & Health Improvement',
  description: 'Transform your posture, reduce pain, and boost productivity with AI-powered real-time monitoring and personalized exercises.',
  keywords: 'posture correction, back pain relief, AI health monitoring, workplace wellness, spinal health, productivity enhancement',
  authors: [{ name: 'PostureGuard Team' }],
  openGraph: {
    title: 'PostureGuard - AI Posture Monitoring',
    description: 'Join thousands improving their health with smart posture monitoring',
    type: 'website',
  }
}

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#10B981'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
        <MonetizationTriggers />
        <PostureAlert />
        <RevenueOptimizer />
      </body>
    </html>
  )
}