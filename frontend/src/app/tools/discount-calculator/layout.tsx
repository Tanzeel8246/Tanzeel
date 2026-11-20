import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Discount & Sale Calculator',
  description: 'Calculate final prices after percentage discounts, sales tax, and coupons with clear savings breakdowns for shoppers and merchants.',
  alternates: {
    canonical: './',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
