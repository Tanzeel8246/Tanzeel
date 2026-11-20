import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Image Format Converter',
  description: 'Convert images seamlessly between PNG, JPEG, WebP, GIF, and BMP formats with adjustable compression quality.',
  alternates: {
    canonical: './',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
