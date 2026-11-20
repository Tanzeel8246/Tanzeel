import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Base64 Encoder & Decoder',
  description: 'Encode and decode plain text or raw data strings to and from standard Base64 format with UTF-8 character preservation.',
  alternates: {
    canonical: './',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
