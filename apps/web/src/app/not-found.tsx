'use client';

import { Icons } from '@/assets/icons';
import Link from 'next/link';
import { useEffect } from 'react';

export default function NotFound({ error }: { error: Error }) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center h-screen gap-4 text-center p-4">
      <Icons.fileWarning width={80} height={80} color="#6a6a6a" />
      <h3 className="font-bold text-4xl">Page Not Found</h3>
      <div className="text-balance">The page you are looking for doesn't exist or has been moved</div>
      <Link href="/" className="font-bold">
        Go Home
      </Link>
    </div>
  );
}
