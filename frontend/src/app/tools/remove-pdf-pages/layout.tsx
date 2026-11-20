import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Remove PDF Pages',
  description: 'Delete unwanted or blank pages from PDF documents easily without damaging document quality or formatting.',
  alternates: {
    canonical: './',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
