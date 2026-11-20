import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'OCR Text Extractor (Image to Text)',
  description: 'Extract readable text from scanned images, screenshots, and photos using client-side optical character recognition.',
  alternates: {
    canonical: './',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
