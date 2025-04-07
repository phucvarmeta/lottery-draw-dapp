'use client';

import * as React from 'react';

import { QueryClientProviderWrapper } from '@/lib/query-provider';
import { WagmiProviderWrapper } from '@/lib/wagmi-provider';

export function Providers({ children }: React.PropsWithChildren) {
  return (
    <WagmiProviderWrapper>
      <QueryClientProviderWrapper>{children}</QueryClientProviderWrapper>
    </WagmiProviderWrapper>
  );
}
