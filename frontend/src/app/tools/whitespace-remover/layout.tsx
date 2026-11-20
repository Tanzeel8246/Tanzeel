import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Whitespace & Line Break Remover',
  description: 'Remove extra spaces, tabs, duplicate empty lines, and trailing spaces from text blocks and code snippets.',
  alternates: {
    canonical: './',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
