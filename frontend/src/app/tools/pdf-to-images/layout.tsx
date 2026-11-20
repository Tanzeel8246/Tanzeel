import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'PDF to Images Converter',
  description: 'Convert each page of a PDF document into high-resolution JPG or PNG images with ZIP batch downloading.',
  alternates: {
    canonical: './',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
