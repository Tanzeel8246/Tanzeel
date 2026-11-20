import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'AI Background Remover',
  description: 'Instantly remove backgrounds from portrait and product photos in your browser with AI precision and transparent PNG output.',
  alternates: {
    canonical: './',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
