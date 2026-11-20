import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'UTM Campaign URL Builder',
  description: 'Generate tracked marketing campaign links with utm_source, utm_medium, utm_campaign, utm_term, and utm_content parameters.',
  alternates: {
    canonical: './',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
