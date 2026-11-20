import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Website to PDF Converter',
  description: 'Convert any online web page into a printable, high-quality PDF document with one click.',
  alternates: {
    canonical: './',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
