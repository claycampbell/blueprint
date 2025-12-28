/**
 * Application Providers
 *
 * Wraps the application with all necessary context providers.
 * Per architecture standard, this is the single location for providers.
 */

import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { queryClient } from '@/lib/query-client';
import type { ReactNode } from 'react';

interface AppProvidersProps {
  children: ReactNode;
}

export function AppProviders({ children }: Readonly<AppProvidersProps>) {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {/* Devtools only in development */}
      {import.meta.env.DEV && <ReactQueryDevtools initialIsOpen={false} />}
    </QueryClientProvider>
  );
}
