'use client';

import { FCC } from '@/types';

import { PropsWithChildren } from 'react';

const MainLayout: FCC = ({ children }: PropsWithChildren) => {
  return (
    <div className="relative">
      <div className="min-h-screen flex flex-col">
        <main className="flex-1 flex flex-col w-full">{children}</main>
      </div>
    </div>
  );
};

export default MainLayout;
