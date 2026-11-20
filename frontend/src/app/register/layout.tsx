import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Create an Account',
  description: 'Join CodeHubb Tools for free. Unlock persistent chat history, priority AI tools, and advanced utilities.',
  alternates: {
    canonical: './',
  },
};

export default function RegisterLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
