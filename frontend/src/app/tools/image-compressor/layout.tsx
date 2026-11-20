import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Image Compressor',
  description: 'Compress JPG, PNG, and WebP images to reduce file sizes by up to 80% while maintaining high visual clarity.',
  alternates: {
    canonical: './',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
