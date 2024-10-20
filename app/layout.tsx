import type { Metadata } from 'next';
import './globals.css';
import { ThemeProvider } from '@/components/theme-provider';
import Sonner from '@/components/providers';
import { Providers } from './providers';
import Breadcrumb from '@/components/Breadcrumb';

export const metadata: Metadata = {
  title: 'Divinely Store - Divinely Developer',
  description:
    'Divinely Developer (Bhuneshvar) is a full-stack developer. He is a software engineer, web developer, and designer, proficient in JavaScript, TypeScript, React, Node.js, Next.js, and MongoDB.'
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
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            {/* <Navbar /> */}
            <div className="mx-auto mt-12 max-w-7xl px-4">
              <Breadcrumb />
              {children}
            </div>
            <Sonner />
          </ThemeProvider>
        </Providers>
      </body>
    </html>
  );
}
