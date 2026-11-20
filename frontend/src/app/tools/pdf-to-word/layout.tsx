import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'PDF to Word Converter',
  description: 'Convert PDF documents into editable Microsoft Word (.docx) files while preserving headings and paragraph flows.',
  alternates: {
    canonical: './',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
