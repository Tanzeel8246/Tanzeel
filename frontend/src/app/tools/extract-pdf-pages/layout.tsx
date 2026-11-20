import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Extract PDF Pages',
  description: 'Select and export specific individual pages or custom page ranges from large PDF documents into a new standalone PDF.',
  alternates: {
    canonical: './',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
