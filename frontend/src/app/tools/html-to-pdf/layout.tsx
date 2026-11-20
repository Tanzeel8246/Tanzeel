import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'HTML to PDF Converter',
  description: 'Render custom HTML code or web snippets into standardized A4 multi-page PDF documents with clean layout preservation.',
  alternates: {
    canonical: './',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
