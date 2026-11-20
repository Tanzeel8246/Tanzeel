import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'SEO Meta Tags Generator',
  description: 'Generate essential SEO title tags, meta descriptions, Open Graph cards, and Twitter Cards to maximize social media click-throughs.',
  alternates: {
    canonical: './',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
