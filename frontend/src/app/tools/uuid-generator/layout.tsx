import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'UUID / GUID Generator',
  description: 'Generate cryptographically random Version-4 UUIDs in bulk with uppercase, lowercase, and hyphen toggles.',
  alternates: {
    canonical: './',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
