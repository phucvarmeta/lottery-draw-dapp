import Link from 'next/link';
import { PropsWithChildren } from 'react';

type Props = {
  href: string;
  target?: '_blank' | '_self' | '_parent' | '_top';
};

export const LinkFooter = ({ href, children, ...props }: PropsWithChildren<Props>) => {
  return (
    <Link href={href} {...props} className="hover:text-white transition-colors">
      {children}
    </Link>
  );
};
