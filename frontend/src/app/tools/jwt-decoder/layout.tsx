import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'JWT Decoder (JSON Web Token)',
  description: 'Decode JSON Web Tokens (JWT) to inspect header algorithms, payload claims, timestamps, and signature data safely in your browser.',
  alternates: {
    canonical: './',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
