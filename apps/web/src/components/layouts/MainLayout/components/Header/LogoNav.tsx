import Link from 'next/link';
import { Logo } from './Logo';

export const LogoNav = () => {
  return (
    <Link href={'/'}>
      {/* <Logo url={'/logo.png'} width={90} height={30} /> */}
    </Link>
  );
};
