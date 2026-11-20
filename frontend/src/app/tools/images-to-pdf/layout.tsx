import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Images to PDF Converter',
  description: 'Combine multiple photos, receipts, and scans into a single organized PDF document with custom margins and page orientations.',
  alternates: {
    canonical: './',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
