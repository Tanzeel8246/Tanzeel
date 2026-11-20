import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Webcam Video Recorder',
  description: 'Record video messages, tutorials, and webcam clips with audio directly inside your web browser and save as WebM or MP4.',
  alternates: {
    canonical: './',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
