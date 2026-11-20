import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Watermark PDF',
  description: 'Stamp confidential, draft, or custom text watermarks across all pages of a PDF document with custom transparency and angles.',
  alternates: {
    canonical: './',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
