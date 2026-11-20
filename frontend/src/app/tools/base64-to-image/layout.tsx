import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Base64 to Image Converter',
  description: 'Convert Base64 data URI strings into viewable PNG, JPEG, or WebP images with instant preview and one-click download.',
  alternates: {
    canonical: './',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
