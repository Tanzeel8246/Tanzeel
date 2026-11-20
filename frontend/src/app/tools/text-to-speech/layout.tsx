import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Text to Speech (Voice Synthesizer)',
  description: 'Convert written text into natural-sounding speech with adjustable pitch, playback rates, and multiple language voices.',
  alternates: {
    canonical: './',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
