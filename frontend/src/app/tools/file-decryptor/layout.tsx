import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'File Decryptor',
  description: 'Decrypt password-protected AES-256 encrypted files safely on the client side without exposing your secret passphrases.',
  alternates: {
    canonical: './',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
