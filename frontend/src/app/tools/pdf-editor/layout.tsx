import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'PDF Editor',
  description: 'Annotate, add text, highlight sections, and insert shapes onto PDF pages directly in your web browser with zero software installations.',
  alternates: {
    canonical: './',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
