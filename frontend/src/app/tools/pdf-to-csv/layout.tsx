import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'PDF to CSV Converter',
  description: 'Extract structured tables, bank statements, and tabular data rows from PDF documents into Excel-compatible CSV files.',
  alternates: {
    canonical: './',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
