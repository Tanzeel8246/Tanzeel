import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Find and Replace Text Tool',
  description: 'Search, find, and replace words or regex patterns across long texts with case sensitivity, whole-word matching, and count stats.',
  alternates: {
    canonical: './',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
