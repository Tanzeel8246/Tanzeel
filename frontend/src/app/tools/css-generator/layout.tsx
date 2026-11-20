import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'CSS Code Generator',
  description: 'Visually configure border-radius, flexbox layouts, CSS grid, transitions, and transforms with clean, copy-paste CSS output.',
  alternates: {
    canonical: './',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
