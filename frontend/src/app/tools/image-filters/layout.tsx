import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Photo Filters & Effects',
  description: 'Apply creative photo adjustments including grayscale, sepia, brightness, contrast, blur, and saturation in real time.',
  alternates: {
    canonical: './',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
