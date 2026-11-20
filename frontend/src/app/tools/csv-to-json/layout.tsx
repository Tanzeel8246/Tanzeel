import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'CSV to JSON Converter',
  description: 'Convert tabular CSV data into structured JSON objects or arrays with automatic column header detection and formatted preview.',
  alternates: {
    canonical: './',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
