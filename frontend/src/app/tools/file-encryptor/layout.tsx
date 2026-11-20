import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'File Encryptor',
  description: 'Secure any sensitive document, archive, or picture with bank-grade AES-256 client-side encryption and custom passwords.',
  alternates: {
    canonical: './',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
