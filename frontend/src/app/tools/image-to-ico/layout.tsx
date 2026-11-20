import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Image to ICO Converter',
  description: 'Convert PNG and JPEG images into Windows and website ICO icon format with support for multiple embedded resolutions.',
  alternates: {
    canonical: './',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
