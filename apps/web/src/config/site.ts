import { env } from '@/lib/const';

export type SiteConfig = typeof siteConfig;

export const APP_URL = env.APP_URL;

export const siteConfig = {
  name: 'DeLottery',
  metaTitle: 'DeLottery',
  description: 'DeLottery',
  ogImage: `${APP_URL}/og-image.png`,
};
