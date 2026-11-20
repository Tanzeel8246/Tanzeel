import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Watermark Image',
  description: 'Add custom text or logo watermarks to photos with adjustable opacity, positioning, font size, and rotation to protect copyright.',
  alternates: {
    canonical: './',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
