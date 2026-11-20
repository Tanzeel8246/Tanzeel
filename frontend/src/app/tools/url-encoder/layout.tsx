import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'URL Encoder & Decoder',
  description: 'Encode query string parameters and special URL characters into percent-encoded format and decode escaped URLs back to text.',
  alternates: {
    canonical: './',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
