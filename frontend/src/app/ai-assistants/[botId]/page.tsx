'use client';

import React, { useEffect, useRef, use, useState } from 'react';
import { useChat } from '@ai-sdk/react';
import { DefaultChatTransport, UIMessage } from 'ai';
import { AI_ASSISTANTS } from '@/config/ai-assistants';
import * as Icons from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { useSession } from 'next-auth/react';

export default function AssistantChatPage({ params }: { params: Promise<{ botId: string }> }) {
  const resolvedParams = use(params);
  const botId = resolvedParams.botId;
  const bot = AI_ASSISTANTS.find(b => b.id === botId);
  const { data: session } = useSession();
  
  if (!bot) {
    notFound();
  }

  const [input, setInput] = useState('');
  const [initialMessages, setInitialMessages] = useState<UIMessage[]>([]);
  const [isFetchingHistory, setIsFetchingHistory] = useState(true);

  useEffect(() => {
    if (session?.user) {
      fetch(`/api/chat/history?botId=${bot.id}`)
        .then(res => res.json())
        .then(data => {
          if (data.messages) {
            // Convert simple messages to UIMessage structure for ai-sdk v4
            const formatted = data.messages.map((m: any) => ({
              id: m.id,
              role: m.role,
              content: m.content,
              parts: [{ type: 'text', text: m.content }],
              annotations: m.annotations,
            }));
            setInitialMessages(formatted);
          }
        })
        .catch(err => console.error('Failed to load history:', err))
        .finally(() => setIsFetchingHistory(false));
    } else {
      setIsFetchingHistory(false);
    }
  }, [session, bot.id]);

  const [chatError, setChatError] = useState<string | null>(null);

  const { messages, sendMessage, status, setMessages, regenerate, error } = useChat({
    messages: initialMessages,
    transport: new DefaultChatTransport({
      api: '/api/chat',
      body: {
        botId: bot.id
      }
    })
  });

  const isLoading = status === 'streaming' || status === 'submitted';

  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleRateMessage = async (messageId: string, rating: number) => {
    // Optimistically update UI
    setMessages(msgs => msgs.map(m => {
      if (m.id === messageId) {
        const anyM = m as any;
        const newAnnotations = anyM.annotations ? anyM.annotations.filter((a: any) => a.type !== 'rating') : [];
        newAnnotations.push({ type: 'rating', value: rating });
        return { ...m, annotations: newAnnotations } as any;
      }
      return m;
    }));

    if (session?.user) {
      try {
        await fetch('/api/chat/rating', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ messageId, rating }),
        });
      } catch (err) {
        console.error('Failed to rate message', err);
      }
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setInput(e.target.value);
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!input.trim() || isLoading) return;
    setChatError(null);
    const sentText = input;
    setInput('');
    try {
      await sendMessage({ text: sentText });
    } catch (err: any) {
      console.error('sendMessage failed!', err);
      setChatError(err.message || 'AI سرور سے رابطہ قائم نہیں ہو سکا۔ براہ کرم انٹرنیٹ یا API کیز چیک کر کے دوبارہ کوشش کریں۔');
    }
  };

  const clearHistory = async () => {
    if (!confirm('Are you sure you want to clear the chat history?')) return;
    setMessages([]); // Clear UI immediately
    if (session?.user) {
      try {
        await fetch(`/api/chat/history?botId=${bot.id}`, { method: 'DELETE' });
      } catch (err) {
        console.error('Failed to clear history on server:', err);
      }
    }
  };

  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const IconComponent = (Icons as any)[bot.icon] || Icons.Bot;

  if (isFetchingHistory) {
    return (
      <div className="flex h-[calc(100dvh-64px)] md:h-[calc(100dvh-112px)] items-center justify-center bg-gray-50 dark:bg-gray-950 text-gray-500">
        <Icons.Loader2 className="animate-spin" size={32} />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[calc(100dvh-64px)] md:h-[calc(100dvh-112px)] bg-gray-50 dark:bg-gray-950">
      {/* Header */}
      <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 p-4 flex items-center justify-between shrink-0">
        <div className="flex items-center space-x-4">
          <Link href="/ai-assistants" className="text-gray-500 hover:text-indigo-600 transition-colors">
            <Icons.ArrowLeft size={24} />
          </Link>
          <div className="bg-indigo-100 dark:bg-indigo-900/50 p-2 rounded-xl text-indigo-600 dark:text-indigo-400">
            <IconComponent size={24} />
          </div>
          <div>
            <h1 className="font-bold text-gray-900 dark:text-white">{bot.name}</h1>
            <p className="text-xs text-gray-500 dark:text-gray-400">{bot.description}</p>
          </div>
        </div>
        
        {messages.length > 0 && session?.user && (
          <button 
            onClick={clearHistory}
            className="text-gray-400 hover:text-red-500 transition-colors p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20"
            title="Clear Chat History"
          >
            <Icons.Trash2 size={20} />
          </button>
        )}
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center">
            <div className="bg-indigo-100 dark:bg-indigo-900/30 p-5 rounded-full mb-6 text-indigo-600 dark:text-indigo-400">
              <IconComponent size={48} />
            </div>
            <h2 className="text-2xl font-bold mb-3 text-gray-900 dark:text-white">{bot.name}</h2>
            <p className="max-w-md text-base text-gray-500 dark:text-gray-400 mb-8">{bot.description}</p>
            <div className="text-sm bg-indigo-50 dark:bg-indigo-900/20 px-6 py-3 rounded-xl text-indigo-700 dark:text-indigo-300 border border-indigo-100 dark:border-indigo-800/30">
              Just type your message below to start the conversation.
            </div>
          </div>
        ) : (
          messages.map(m => (
            <div key={m.id} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div 
                className={`max-w-[85%] sm:max-w-[75%] p-4 rounded-2xl flex flex-col gap-2 ${
                  m.role === 'user' 
                    ? 'bg-indigo-600 text-white rounded-br-none' 
                    : 'bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 text-gray-800 dark:text-gray-200 rounded-bl-none shadow-sm'
                }`}
              >
                <div className="prose dark:prose-invert max-w-none whitespace-pre-wrap text-[15px] leading-relaxed" dir="auto">
                  {m.parts ? m.parts.map((part, index) => {
                    if (part.type === 'text') return <span key={index}>{part.text}</span>;
                    return null;
                  }) : (m as any).content}
                </div>
                {m.role !== 'user' && (
                  <div className="flex items-center gap-1 mt-2 pt-2 border-t border-gray-100 dark:border-gray-700/50 justify-between">
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => {
                          const text = m.parts?.map(p => p.type === 'text' ? p.text : '').join('') || (m as any).content;
                          handleCopy(m.id, text);
                        }}
                        className="p-1.5 text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors flex items-center gap-1.5"
                        title="Copy to clipboard"
                      >
                        {copiedId === m.id ? <Icons.Check size={14} className="text-green-500" /> : <Icons.Copy size={14} />}
                        <span className="text-[10px] font-medium hidden sm:inline">{copiedId === m.id ? 'Copied' : 'Copy'}</span>
                      </button>
                      <button
                        onClick={() => regenerate()}
                        disabled={isLoading}
                        className="p-1.5 text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors flex items-center gap-1.5 disabled:opacity-50"
                        title="Regenerate response"
                      >
                        <Icons.RefreshCw size={14} className={isLoading ? 'animate-spin' : ''} />
                        <span className="text-[10px] font-medium hidden sm:inline">Regenerate</span>
                      </button>
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                          onClick={() => handleRateMessage(m.id, 1)}
                          className={`p-1.5 rounded text-gray-500 hover:text-green-600 hover:bg-green-50 dark:hover:bg-green-900/30 transition-colors ${
                            (m as any).annotations?.some((a: any) => a.type === 'rating' && a.value === 1)
                              ? 'text-green-600 bg-green-50 dark:bg-green-900/30' : ''
                          }`}
                          title="Helpful response"
                        >
                          <Icons.ThumbsUp size={15} />
                        </button>
                        <button
                          onClick={() => handleRateMessage(m.id, -1)}
                          className={`p-1.5 rounded text-gray-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors ${
                            (m as any).annotations?.some((a: any) => a.type === 'rating' && a.value === -1)
                              ? 'text-red-600 bg-red-50 dark:bg-red-900/30' : ''
                          }`}
                          title="Not helpful"
                        >
                        <Icons.ThumbsDown size={14} />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 p-4 rounded-2xl rounded-bl-none shadow-sm flex items-center space-x-2">
              <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
              <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
              <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 p-4 shrink-0">
        {(chatError || (status === 'error' && error)) && (
          <div role="alert" className="max-w-4xl mx-auto mb-3 p-3 bg-red-50 dark:bg-red-900/40 border border-red-200 dark:border-red-800 rounded-2xl flex items-center justify-between text-xs sm:text-sm text-red-700 dark:text-red-300">
            <div className="flex items-center gap-2">
              <Icons.AlertCircle className="w-5 h-5 text-red-500 shrink-0" />
              <span>{chatError || error?.message || 'معذرت، AI سرور کا جواب موصول نہیں ہو سکا۔'}</span>
            </div>
            <button
              type="button"
              onClick={() => { setChatError(null); regenerate(); }}
              className="ml-3 px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded-lg font-bold shrink-0 text-xs transition-colors"
            >
              دوبارہ کوشش کریں (Retry)
            </button>
          </div>
        )}
        <form onSubmit={handleSubmit} className="max-w-4xl mx-auto flex items-end space-x-4">
          <div className="flex-1 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl overflow-hidden focus-within:ring-2 focus-within:ring-indigo-500 focus-within:border-transparent transition-all">
            <textarea
              className="w-full max-h-32 p-4 bg-transparent border-none focus:ring-0 resize-none"
              dir="auto"
              value={input}
              onChange={handleInputChange}
              placeholder="Type your message here..."
              rows={input.split('\\n').length > 1 ? Math.min(input.split('\\n').length, 5) : 1}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  if (input?.trim()) {
                    const form = e.currentTarget.form;
                    if (form) form.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));
                  }
                }
              }}
            />
          </div>
          <button 
            type="submit"
            disabled={!input.trim() || isLoading}
            className="p-3.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white rounded-xl transition-colors shadow-sm"
          >
            <Icons.Send className="w-5 h-5" />
          </button>
        </form>

      </div>
    </div>
  );
}
