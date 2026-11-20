import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Text to Binary & Binary to Text',
  description: 'Convert ASCII and Unicode characters to 8-bit binary numbers (0s and 1s) and decode binary sequences back to text.',
  alternates: {
    canonical: './',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
