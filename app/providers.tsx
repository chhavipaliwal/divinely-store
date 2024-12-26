'use client';

import { NextUIProvider } from '@nextui-org/react';
import React from 'react';
import { SessionProvider } from 'next-auth/react';
import { NuqsAdapter } from 'nuqs/adapters/next/app';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <NextUIProvider>
      <SessionProvider>
        <NuqsAdapter>{children}</NuqsAdapter>
      </SessionProvider>
    </NextUIProvider>
  );
}
