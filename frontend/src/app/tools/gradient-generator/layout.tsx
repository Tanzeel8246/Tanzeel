import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'CSS Gradient Generator',
  description: 'Design vibrant linear and radial CSS gradients with multi-color stops, angle controls, and ready-to-paste CSS background code.',
  alternates: {
    canonical: './',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
