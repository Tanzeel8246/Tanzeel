import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Markdown Editor & Live Previewer',
  description: 'Write and preview GitHub-flavored Markdown in real time with syntax highlighting, live HTML export, and clean typography.',
  alternates: {
    canonical: './',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
