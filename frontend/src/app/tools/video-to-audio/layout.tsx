import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Video to Audio (WAV & MP3)',
  description: 'Extract high-fidelity audio tracks from video files (MP4, WebM, MKV, AVI) completely client-side with instant playback and download.',
  alternates: {
    canonical: './',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
