import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Split PDF',
  description: 'Separate PDF documents into individual single-page files or custom page ranges with instant ZIP download.',
  alternates: {
    canonical: './',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
