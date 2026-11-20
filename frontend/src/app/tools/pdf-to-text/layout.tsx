import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'PDF to Text Extractor',
  description: 'Extract all raw textual content from PDF files into plain text (.txt) format with clean paragraph formatting.',
  alternates: {
    canonical: './',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
