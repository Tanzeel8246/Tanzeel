import { Metadata } from 'next';
import ToolSeoSection from '@/components/ToolSeoSection';
import { getToolSeo } from '@/data/tool-seo-content';

const content = getToolSeo('word-counter');

export const metadata: Metadata = {
  title: content.searchTitle,
  description: content.metaDescription,
  alternates: {
    canonical: './',
  },
};

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: content.faqs.map((faq) => ({
    '@type': 'Question',
    name: faq.q,
    acceptedAnswer: { '@type': 'Answer', text: faq.a },
  })),
};

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://tanzeel.work/' },
    {
      '@type': 'ListItem',
      position: 2,
      name: content.label,
      item: 'https://tanzeel.work/tools/word-counter',
    },
  ],
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      {children}
      <ToolSeoSection content={content} />
    </>
  );
}
