import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Sign PDF Online',
  description: 'Draw, position, and burn your electronic signature onto any PDF document securely in your browser with zero server uploads.',
  alternates: {
    canonical: './',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
