import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Crop PDF Margins',
  description: 'Trim unwanted whitespace, printer bleed margins, and headers from PDF pages with visual margin controls and instant download.',
  alternates: {
    canonical: './',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
