import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Extract ZIP Archive',
  description: 'Unpack and view files inside ZIP archives directly in your browser without installing third-party unzipping software.',
  alternates: {
    canonical: './',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
