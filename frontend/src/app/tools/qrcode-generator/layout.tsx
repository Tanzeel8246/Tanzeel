import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'QR Code Generator',
  description: 'Create custom QR codes for URLs, WiFi credentials, contact vCards, phone numbers, and text with custom colors and PNG download.',
  alternates: {
    canonical: './',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
