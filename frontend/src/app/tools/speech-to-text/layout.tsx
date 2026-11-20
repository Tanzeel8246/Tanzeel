import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Speech to Text (Voice Transcriber)',
  description: 'Transcribe spoken voice through your microphone into editable text in real time using the browser Web Speech recognition API.',
  alternates: {
    canonical: './',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
