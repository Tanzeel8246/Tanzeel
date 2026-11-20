'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useChat } from '@ai-sdk/react';
import { DefaultChatTransport } from 'ai';
import * as Icons from 'lucide-react';
import { usePathname } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';

export default function FloatingTanzeelAI() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const isHidden = pathname?.startsWith('/ai-assistants/');

  const [input, setInput] = useState('');

  const { messages, sendMessage, status, setMessages, regenerate } = useChat({
    messages: [],
    transport: new DefaultChatTransport({
      api: '/api/chat',
      body: {
        botId: 'tanzeel-ai' // Explicitly hardcoded to Tanzeel AI for the floating widget
      }
    })
  });

  const isLoading = status === 'streaming' || status === 'submitted';

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setInput(e.target.value);
  };

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!input.trim() || isLoading) return;
    sendMessage({ text: input });
    setInput('');
  };

  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (isOpen && !isHidden) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen, isHidden]);

  if (isHidden) {
    return null;
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="bg-white dark:bg-gray-900 rounded-3xl shadow-2xl border border-gray-200 dark:border-gray-800 w-[350px] sm:w-[400px] h-[500px] mb-4 flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="bg-indigo-600 p-4 text-white flex justify-between items-center shrink-0">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                  <Icons.Bot size={24} />
                </div>
                <div>
                  <h3 className="font-bold">Tanzeel AI</h3>
                  <p className="text-xs text-indigo-100">Your Digital Twin</p>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="text-indigo-100 hover:text-white p-2 rounded-full hover:bg-white/10 transition-colors"
              >
                <Icons.X size={20} />
              </button>
            </div>

            {/* Chat Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 dark:bg-gray-950">
              {messages.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center opacity-60">
                  <Icons.MessageSquare size={48} className="mb-3 text-indigo-300" />
                  <p className="text-sm px-4">
                    Assalamu Alaikum! I am Tanzil-ur-Rehman's digital twin. Do you need help with any tool or have a question?
                  </p>
                </div>
              ) : (
                messages.map(m => (
                  <div key={m.id} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div 
                      className={`max-w-[85%] p-3 rounded-2xl text-sm ${
                        m.role === 'user' 
                          ? 'bg-indigo-600 text-white rounded-br-none' 
                          : 'bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 text-gray-800 dark:text-gray-200 rounded-bl-none shadow-sm'
                      }`}
                    >
                      <div className="prose dark:prose-invert max-w-none whitespace-pre-wrap leading-relaxed" dir="auto">
                        {m.parts ? m.parts.map((part, index) => {
                          if (part.type === 'text') return <span key={index}>{part.text}</span>;
                          return null;
                        }) : (m as any).content}
                      </div>
                    </div>
                  </div>
                ))
              )}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 p-3 rounded-2xl rounded-bl-none shadow-sm flex items-center space-x-1">
                    <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                    <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                    <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-3 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 shrink-0">
              <form onSubmit={handleSubmit} className="flex items-center space-x-2">
                <input
                  value={input}
                  onChange={handleInputChange}
                  placeholder="Type a message..."
                  className="flex-1 bg-gray-100 dark:bg-gray-800 border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500"
                  dir="auto"
                />
                <button
                  type="submit"
                  disabled={!input?.trim() || isLoading}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white p-3 rounded-xl disabled:opacity-50 transition-colors"
                >
                  <Icons.Send size={18} />
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-16 h-16 rounded-full flex items-center justify-center shadow-2xl transition-all duration-300 hover:scale-110 relative group ${
          isOpen 
            ? 'bg-red-500 hover:bg-red-600' 
            : 'bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 hover:from-indigo-600 hover:via-purple-600 hover:to-pink-600'
        } text-white`}
      >
        {!isOpen && (
          <>
            <span className="absolute inset-0 rounded-full bg-indigo-500 animate-ping opacity-20 group-hover:opacity-40"></span>
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-400 rounded-full animate-bounce shadow-sm"></span>
          </>
        )}
        {isOpen ? <Icons.X size={28} className="transform rotate-90 transition-transform duration-300" /> : (
          <div className="relative flex items-center justify-center">
            <Icons.Sparkles size={32} className="animate-pulse" />
          </div>
        )}
      </button>
    </div>
  );
}
