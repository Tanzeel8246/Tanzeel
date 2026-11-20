import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Color Converter (HEX, RGB, HSL)',
  description: 'Convert color values between HEX, RGB, RGBA, and HSL color models in real-time with visual preview and clipboard copying.',
  alternates: {
    canonical: './',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
