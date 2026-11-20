import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Image Resizer',
  description: 'Resize images to exact pixel dimensions or percentage scales with locked aspect ratios and high-quality resampling.',
  alternates: {
    canonical: './',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
