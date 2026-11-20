import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Loan & Mortgage EMI Calculator',
  description: 'Calculate monthly loan EMI payments, total interest payable, and full loan amortization schedules for home, car, or personal loans.',
  alternates: {
    canonical: './',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
