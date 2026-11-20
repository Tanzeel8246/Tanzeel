import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Reverse Text Generator',
  description: 'Reverse text characters, reverse word orders, or flip paragraphs upside down for creative typography and testing.',
  alternates: {
    canonical: './',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
