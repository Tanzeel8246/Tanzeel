import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Website Screenshot Capture',
  description: 'Capture full-page or viewport screenshots of any public website URL with responsive device previewing.',
  alternates: {
    canonical: './',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
