import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'EXIF Metadata Remover',
  description: 'Strip GPS coordinates, camera models, exposure data, and private timestamps from photos to safeguard your online privacy.',
  alternates: {
    canonical: './',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
