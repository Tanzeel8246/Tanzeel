'use client';

import { SessionProvider } from 'next-auth/react';
import { ThemeProvider } from 'next-themes';
import { UsageProvider } from '@/context/UsageContext';
import PaywallModal from './PaywallModal';

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <UsageProvider>
          {children}
          <PaywallModal />
        </UsageProvider>
      </ThemeProvider>
    </SessionProvider>
  );
}
