import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Color Picker & Eyedropper',
  description: 'Pick pixel-perfect colors from uploaded images or your computer screen using the native eyedropper with HEX, RGB, and palette copying.',
  alternates: {
    canonical: './',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
