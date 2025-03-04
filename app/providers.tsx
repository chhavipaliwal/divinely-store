'use client';

import { HeroUIProvider, ToastProvider } from '@heroui/react';
import React from 'react';
import { SessionProvider } from 'next-auth/react';
import { NuqsAdapter } from 'nuqs/adapters/next/app';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <HeroUIProvider>
      <ToastProvider
        toastProps={{
          shouldShowTimeoutProgress: true
        }}
      />
      <SessionProvider>
        <NuqsAdapter>{children}</NuqsAdapter>
      </SessionProvider>
    </HeroUIProvider>
  );
}
