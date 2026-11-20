import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Rotate PDF Pages',
  description: 'Rotate upside-down or sideways PDF pages by 90, 180, or 270 degrees permanently and download the corrected document.',
  alternates: {
    canonical: './',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
