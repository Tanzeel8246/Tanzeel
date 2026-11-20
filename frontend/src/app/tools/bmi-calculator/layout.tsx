import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'BMI Calculator',
  description: 'Calculate Body Mass Index (BMI) instantly using metric or imperial units with health classification categories and ideal weight ranges.',
  alternates: {
    canonical: './',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
