import React from 'react';
import Link from 'next/link';
import { AI_ASSISTANTS } from '@/config/ai-assistants';
import * as Icons from 'lucide-react';

export default function AIAssistantsHubPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white mb-4">
            AI Assistants Hub
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400">
            Tailored AI companions to assist you in various fields.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
          {AI_ASSISTANTS.map((bot) => {
            const IconComponent = (Icons as any)[bot.icon] || Icons.Bot;
            return (
              <Link
                key={bot.id}
                href={`/ai-assistants/${bot.id}`}
                className="group bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-700 flex flex-col items-center text-center relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-indigo-50 dark:bg-indigo-900/20 rounded-full blur-2xl group-hover:bg-indigo-100 dark:group-hover:bg-indigo-900/40 transition-colors"></div>
                
                <div className="bg-indigo-100 dark:bg-indigo-900/50 p-4 rounded-2xl mb-6 text-indigo-600 dark:text-indigo-400">
                  <IconComponent size={40} strokeWidth={1.5} />
                </div>
                
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                  {bot.name}
                </h2>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                  {bot.description}
                </p>
                
                <div className="mt-8 flex items-center text-indigo-600 dark:text-indigo-400 font-medium">
                  Start Conversation
                  <Icons.ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
