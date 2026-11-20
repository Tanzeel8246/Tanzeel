import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Image Cropper',
  description: 'Crop, resize, and reframe images with custom aspect ratios (1:1, 16:9, 4:3) and interactive drag-and-drop bounding boxes.',
  alternates: {
    canonical: './',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
