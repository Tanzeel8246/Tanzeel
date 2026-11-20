import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'XML Formatter & Beautifier',
  description: 'Format, indent, validate, and beautify raw XML code with syntax highlighting and tree structural inspection.',
  alternates: {
    canonical: './',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
