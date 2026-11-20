import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Image Color Palette Extractor',
  description: 'Extract dominant color palettes and harmonious shades from any uploaded photo or illustration with exact HEX/RGB codes.',
  alternates: {
    canonical: './',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
