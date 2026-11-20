import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'PSD File Viewer & Editor',
  description: 'Open, inspect layers, and export Photoshop (.psd) files into PNG or JPG format directly inside your browser.',
  alternates: {
    canonical: './',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
