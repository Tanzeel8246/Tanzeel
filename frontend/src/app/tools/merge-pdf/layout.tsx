import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Merge PDF',
  description: 'Combine multiple PDF documents into a single organized file in seconds directly in your browser. Fast, private, and 100% free with CodeHubb Tools.',
  alternates: {
    canonical: './',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
