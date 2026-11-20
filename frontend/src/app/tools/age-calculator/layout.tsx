import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Age Calculator',
  description: 'Calculate exact chronological age in years, months, weeks, days, hours, and minutes from any birth date with next birthday countdown.',
  alternates: {
    canonical: './',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
