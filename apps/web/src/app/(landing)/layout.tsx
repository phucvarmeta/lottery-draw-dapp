import MainLayout from '@/components/layouts/MainLayout';
import { type PropsWithChildren } from 'react';

const Layout = ({ children }: PropsWithChildren) => {
  return <MainLayout>{children}</MainLayout>;
};

export default Layout;
