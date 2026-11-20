import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Percentage Calculator',
  description: 'Calculate percentage increases, percentage discounts, proportions, and fraction values with step-by-step mathematical breakdowns.',
  alternates: {
    canonical: './',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
