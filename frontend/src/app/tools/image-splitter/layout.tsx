import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Image Splitter & Grid Cutter',
  description: 'Slice images into multiple rows and columns for Instagram carousels, photo grids, or tile mapping with ZIP export.',
  alternates: {
    canonical: './',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
