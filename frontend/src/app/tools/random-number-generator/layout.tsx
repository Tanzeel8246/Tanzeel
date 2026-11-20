import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Random Number Generator',
  description: 'Generate truly random numbers and sequence sets within custom min-max ranges for lotteries, games, and research.',
  alternates: {
    canonical: './',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
