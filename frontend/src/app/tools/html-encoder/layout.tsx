import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'HTML Entity Encoder & Decoder',
  description: 'Convert special characters into safe HTML entities (&amp;, &lt;, &gt;, &quot;) and decode escaped HTML entities back to raw text.',
  alternates: {
    canonical: './',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
