import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Image to Base64 Converter',
  description: 'Convert image files into Base64 data URI strings ready to embed directly into HTML, CSS background images, or JSON APIs.',
  alternates: {
    canonical: './',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
