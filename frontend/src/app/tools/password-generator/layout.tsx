import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Strong Password Generator',
  description: 'Generate ultra-secure, cryptographically random passwords with custom lengths, symbols, numbers, and entropy strength meters.',
  alternates: {
    canonical: './',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
