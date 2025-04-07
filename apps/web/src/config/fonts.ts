import { Poppins as FontSans } from 'next/font/google';
import localFont from 'next/font/local';

export const fontSans = FontSans({
  subsets: ['latin'],
  variable: '--font-sans',
  weight: ['200', '300', '400', '500', '600', '700', '800'],
});

export const octosquaresFont = localFont({
  src: [
    {
      path: '../assets/fonts/Octosquares_Trial_Regular.woff',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../assets/fonts/Octosquares_Trial_Medium.woff',
      weight: '500',
      style: 'normal',
    },
    {
      path: '../assets/fonts/Octosquares_Trial_Bold.woff',
      weight: '700',
      style: 'normal',
    },
  ],
});
