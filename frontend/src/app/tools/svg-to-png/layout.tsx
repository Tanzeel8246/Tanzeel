import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'SVG to PNG Converter',
  description: 'Rasterize SVG vector illustrations into crisp, high-resolution PNG images up to 8x resolution with full viewBox handling.',
  alternates: {
    canonical: './',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
