import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Add Page Numbers to PDF',
  description: 'Insert customizable header or footer page numbers into your PDF documents with custom font sizes, alignments, and starting numbers.',
  alternates: {
    canonical: './',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
