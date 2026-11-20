import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Word & Character Counter',
  description: 'Count words, characters (with and without spaces), sentences, paragraphs, and estimated reading time in real time.',
  alternates: {
    canonical: './',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
