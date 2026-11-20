import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Screen Recorder',
  description: 'Record your desktop screen, browser tab, or application window with audio directly from your browser with no watermarks.',
  alternates: {
    canonical: './',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
