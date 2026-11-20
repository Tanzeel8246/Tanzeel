import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'CSS Box Shadow Generator',
  description: 'Create beautiful CSS box shadows with interactive sliders for horizontal/vertical offsets, blur, spread radius, color, and inset styles.',
  alternates: {
    canonical: './',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
