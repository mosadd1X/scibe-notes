import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from '@/components/ui/theme-provider'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
  display: 'swap',
  preload: true,
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
  display: 'swap',
  preload: false, // Only preload the main font
})

export const metadata: Metadata = {
  title: 'Scribe - AI-powered Markdown Notes',
  description:
    'A minimalist markdown note-taking app with Gemini AI integration for enhanced productivity',
  keywords: [
    'markdown',
    'notes',
    'AI',
    'Gemini',
    'productivity',
    'writing',
    'note-taking',
    'text editor',
  ],
  authors: [{ name: 'Scribe Team' }],
  creator: 'Scribe Team',
  publisher: 'Scribe',
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL || 'https://scribe-notes.vercel.app'
  ),
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: process.env.NEXT_PUBLIC_APP_URL || 'https://scribe-notes.vercel.app',
    title: 'Scribe - AI-powered Markdown Notes',
    description:
      'A minimalist markdown note-taking app with Gemini AI integration for enhanced productivity',
    siteName: 'Scribe',
    images: [
      {
        url: '/og-image.svg',
        width: 1200,
        height: 630,
        alt: 'Scribe - AI-powered Markdown Notes',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Scribe - AI-powered Markdown Notes',
    description:
      'A minimalist markdown note-taking app with Gemini AI integration for enhanced productivity',
    images: ['/og-image.svg'],
    creator: '@scribe',
  },
  icons: {
    icon: '/logo.svg',
    shortcut: '/logo.svg',
    apple: '/logo.svg',
    other: {
      rel: 'apple-touch-icon-precomposed',
      url: '/logo.svg',
    },
  },
  manifest: '/manifest.json',
  applicationName: 'Scribe',
  appleWebApp: {
    capable: true,
    title: 'Scribe',
    statusBarStyle: 'black-translucent',
  },
  formatDetection: {
    telephone: false,
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="theme-color" content="#4f46e5" />
        <link rel="icon" href="/logo.svg" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta
          name="apple-mobile-web-app-status-bar-style"
          content="black-translucent"
        />
        <meta name="apple-mobile-web-app-title" content="Scribe" />
        <script src="/sw-register.js" defer></script>
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        suppressHydrationWarning
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
