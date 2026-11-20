import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'AI Image Upscaler',
  description: 'Enlarge and enhance low-resolution images up to 4x using browser-based AI super-resolution with zero server data upload.',
  alternates: {
    canonical: './',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
