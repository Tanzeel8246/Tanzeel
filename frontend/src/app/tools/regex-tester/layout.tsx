import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Regular Expression (Regex) Tester',
  description: 'Test and debug JavaScript regular expressions in real-time with match highlights, capturing groups, and flag toggles.',
  alternates: {
    canonical: './',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
