import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Lorem Ipsum Generator',
  description: 'Generate classic Cicero Latin placeholder text in paragraphs, sentences, or words for web development and graphic design mockups.',
  alternates: {
    canonical: './',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
