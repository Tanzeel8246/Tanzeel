import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'JSON Formatter & Validator',
  description: 'Beautify, format, validate, and minify JSON data with syntax error detection, collapsible trees, and clean indentation.',
  alternates: {
    canonical: './',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
