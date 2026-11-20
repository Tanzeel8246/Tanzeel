import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Organize & Reorder PDF Pages',
  description: 'Rearrange, reorder, delete, and duplicate pages within any PDF document with intuitive page cards and instant export.',
  alternates: {
    canonical: './',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
