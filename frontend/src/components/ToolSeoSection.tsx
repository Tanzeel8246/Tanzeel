import Link from 'next/link';
import { CheckCircle2, HelpCircle, Lightbulb, ListChecks, ShieldCheck } from 'lucide-react';
import type { ToolSeoContent } from '@/data/tool-seo-content';

/**
 * Shared SEO content section rendered below every rebuilt tool page.
 * Content comes from src/data/tool-seo-content.ts — the same data that
 * feeds the FAQPage schema in each tool's layout, so the structured
 * data always matches the visible text.
 */
export default function ToolSeoSection({ content }: { content: ToolSeoContent }) {
  return (
    <div className="bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <section className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl p-8 border border-gray-100 dark:border-gray-700 space-y-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              {content.searchTitle}
            </h2>
            {content.intro.map((paragraph, i) => (
              <p key={i} className="text-gray-600 dark:text-gray-400 leading-relaxed mb-4 last:mb-0">
                {paragraph}
              </p>
            ))}
          </div>

          <div className="border-t border-gray-100 dark:border-gray-700 pt-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              How to Use This Tool — Step by Step
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {content.steps.map((step, i) => (
                <div
                  key={i}
                  className="p-5 rounded-2xl bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600"
                >
                  <span className="text-indigo-600 dark:text-indigo-400 font-black text-xl mb-2 block">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <h3 className="font-bold text-gray-900 dark:text-white mb-2">{step.title}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{step.text}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="border-t border-gray-100 dark:border-gray-700 pt-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Key Features</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {content.features.map((feature, i) => (
                <div key={i} className="flex gap-3">
                  <ShieldCheck className="text-green-500 shrink-0 mt-1" size={20} />
                  <div>
                    <h3 className="font-bold text-gray-900 dark:text-white">{feature.title}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{feature.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="border-t border-gray-100 dark:border-gray-700 pt-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Common Use Cases</h2>
            <ul className="space-y-3">
              {content.useCases.map((useCase, i) => (
                <li key={i} className="flex gap-3 text-gray-600 dark:text-gray-400">
                  <ListChecks className="text-indigo-500 shrink-0 mt-0.5" size={18} />
                  <span>{useCase}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="border-t border-gray-100 dark:border-gray-700 pt-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Tips for Best Results</h2>
            <ul className="space-y-3">
              {content.tips.map((tip, i) => (
                <li key={i} className="flex gap-3 text-gray-600 dark:text-gray-400">
                  <Lightbulb className="text-amber-500 shrink-0 mt-0.5" size={18} />
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="border-t border-gray-100 dark:border-gray-700 pt-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Frequently Asked Questions
            </h2>
            <div className="space-y-4">
              {content.faqs.map((faq, i) => (
                <div key={i} className="p-4 rounded-xl bg-gray-50 dark:bg-gray-700/30">
                  <h3 className="font-bold text-gray-900 dark:text-white mb-1 flex gap-2">
                    <HelpCircle className="text-blue-500 shrink-0 mt-0.5" size={18} />
                    {faq.q}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{faq.a}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="border-t border-gray-100 dark:border-gray-700 pt-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Related Tools</h2>
            <div className="flex flex-wrap gap-3">
              {content.related.map((rel) => (
                <Link
                  key={rel.slug}
                  href={`/tools/${rel.slug}`}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 text-sm font-medium hover:bg-indigo-100 dark:hover:bg-indigo-800/50 transition-colors"
                >
                  <CheckCircle2 size={14} />
                  {rel.label}
                </Link>
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
