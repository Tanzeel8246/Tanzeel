import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Create ZIP Archive',
  description: 'Bundle and compress multiple files into a fast, portable ZIP archive directly in your browser without uploading to external servers.',
  alternates: {
    canonical: './',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
