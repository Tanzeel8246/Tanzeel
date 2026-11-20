import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Animated GIF Maker',
  description: 'Assemble multiple image frames into smooth animated GIFs with customizable frame delays, looping counts, and export quality.',
  alternates: {
    canonical: './',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
