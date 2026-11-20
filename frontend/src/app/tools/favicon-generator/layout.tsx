import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Favicon Generator',
  description: 'Generate complete multi-size favicon packages (16x16, 32x32, 48x48, 180x180) from any logo or square image for websites and apps.',
  alternates: {
    canonical: './',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
