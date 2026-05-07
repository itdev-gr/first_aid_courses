// web/src/lib/seo.ts
export interface SeoProps {
  title: string;
  description: string;
  ogImage?: string;
  noindex?: boolean;
  canonical?: string;
}

export const siteName = 'First Aid Academy';
export const siteUrl  = 'https://www.firstaid-academy.gr';
export const defaultOg = '/og-default.jpg';

export const buildTitle = (page: string) =>
  page === siteName ? page : `${page} — ${siteName}`;
