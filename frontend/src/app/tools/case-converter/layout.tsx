import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Text Case Converter',
  description: 'Transform text between UPPERCASE, lowercase, Title Case, camelCase, snake_case, kebab-case, and PascalCase instantly.',
  alternates: {
    canonical: './',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
