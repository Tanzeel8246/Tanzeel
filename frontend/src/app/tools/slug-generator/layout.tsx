import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'URL Slug Generator',
  description: 'Convert article titles and headlines into clean, URL-friendly, SEO-optimized kebab-case slugs with accent stripping.',
  alternates: {
    canonical: './',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
