import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'CSS Minifier & Optimizer',
  description: 'Compress and minify stylesheets by removing unnecessary whitespace, comments, and redundant rules for faster web page load times.',
  alternates: {
    canonical: './',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
