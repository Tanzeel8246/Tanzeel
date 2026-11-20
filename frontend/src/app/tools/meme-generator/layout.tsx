import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Meme Generator',
  description: 'Create custom funny memes by uploading photos, adding classic top and bottom impact text, and exporting high-res images.',
  alternates: {
    canonical: './',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
