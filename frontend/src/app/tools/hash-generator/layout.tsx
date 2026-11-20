import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Hash Generator (MD5, SHA-256)',
  description: 'Generate secure cryptographic hash checksums including MD5, SHA-1, SHA-256, and SHA-512 from any input string.',
  alternates: {
    canonical: './',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
