import type { Metadata } from 'next';
import './globals.css';
import { ThemeProvider } from '@/components/theme-provider';
import Sonner from '@/components/providers';
import { Providers } from './providers';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';

export const metadata: Metadata = {
  metadataBase: new URL('https://store.divinely.dev'),
  title:
    'Divinely Store - Resource Management Platform for Developers & Designers',
  description:
    'Divinely Store is a modern resource management platform that helps developers and designers organize, categorize, and share web resources. Access a curated collection of free tools, assets, and essential development resources.',
  keywords:
    'divinely store, resource management, web development tools, design resources, link organization, developer tools, designer resources, free assets, web resources, resource categorization, link management platform, developer essentials, design assets, open source resources, productivity tools, web development, UI/UX resources, coding resources, development assets, tech resources',
  authors: [{ name: 'Chhavi Paliwal' }],
  creator: 'Chhavi Paliwal',
  publisher: 'Chhavi Paliwal',
  openGraph: {
    type: 'website',
    title: 'Divinely Store - Resource Management Platform',
    description:
      'Organize, discover and share essential web development and design resources.',
    siteName: 'Divinely Store'
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Divinely Store',
    description: 'Your centralized hub for development and design resources'
  },
  category: 'Technology'
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className="bg-background text-foreground"
    >
      <body>
        <Providers>
          <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
            {/* <Navbar /> */}
            <div className="mx-auto mt-12">
              {/* <Breadcrumb /> */}
              {children}
            </div>
            <Sonner />
          </ThemeProvider>
          <SpeedInsights />
          <Analytics />
        </Providers>
      </body>
    </html>
  );
}
