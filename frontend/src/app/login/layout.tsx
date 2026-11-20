import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Sign In',
  description: 'Sign in to your CodeHubb Tools account to access your saved chat histories, preferences, and Pro tools.',
  alternates: {
    canonical: './',
  },
};

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
