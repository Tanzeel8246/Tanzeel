import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'HTML Minifier & Compressor',
  description: 'Minify raw HTML markup by collapsing whitespace, stripping redundant comments, and optimizing tags for lightweight delivery.',
  alternates: {
    canonical: './',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
