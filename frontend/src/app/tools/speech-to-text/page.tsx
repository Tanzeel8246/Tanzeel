'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';

export default function SpeechToTextPage() {
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [interimTranscript, setInterimTranscript] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [language, setLanguage] = useState('en-US');
  
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    // Check for browser support
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
      setError('Speech Recognition API is not supported in this browser. Please try Chrome or Edge.');
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = language;

    recognition.onresult = (event: any) => {
      let currentTranscript = '';
      let currentInterim = '';

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        if (result.isFinal) {
          currentTranscript += result[0].transcript + ' ';
        } else {
          currentInterim += result[0].transcript;
        }
      }

      if (currentTranscript) {
        setTranscript((prev) => prev + currentTranscript);
      }
      setInterimTranscript(currentInterim);
    };

    recognition.onerror = (event: any) => {
      console.error('Speech recognition error', event.error);
      if (event.error === 'not-allowed') {
        setError('Microphone access was denied. Please allow microphone access to use this tool.');
        setIsRecording(false);
      }
    };

    recognition.onend = () => {
      // If still supposed to be recording, restart it (sometimes it stops automatically)
      if (isRecording) {
        try {
           recognition.start();
        } catch(e) {}
      }
    };

    recognitionRef.current = recognition;

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, [language, isRecording]);

  const toggleRecording = () => {
    if (error && error.includes('not supported')) return;
    
    if (isRecording) {
      recognitionRef.current?.stop();
      setIsRecording(false);
      setInterimTranscript('');
    } else {
      setError(null);
      try {
        recognitionRef.current.lang = language;
        recognitionRef.current?.start();
        setIsRecording(true);
      } catch (err) {
        console.error(err);
      }
    }
  };

  const clearText = () => {
    setTranscript('');
    setInterimTranscript('');
  };

  const handleCopy = () => {
    if (transcript) {
      navigator.clipboard.writeText(transcript.trim());
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDownloadText = () => {
    if (!transcript) return;
    const blob = new Blob([transcript.trim()], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'voice-note.txt';
    link.click();
    setTimeout(() => URL.revokeObjectURL(url), 100);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <Link href="/" className="text-indigo-600 dark:text-indigo-400 text-sm font-medium hover:underline mb-6 inline-block">
          &larr; Back to Tools
        </Link>
        
        <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl overflow-hidden flex flex-col md:flex-row min-h-[70vh]">
          
          {/* Sidebar / Controls */}
          <div className="w-full md:w-1/3 p-8 border-b md:border-b-0 md:border-r border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/80 flex flex-col justify-between">
            <div>
              <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white mb-2">
                Speech to Text
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-8">
                Voice typing made easy. Speak into your microphone and watch your words turn into text instantly.
              </p>
              
              <div className="mb-6">
                <label className="block mb-2 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Select Language</label>
                <select 
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  disabled={isRecording}
                  className="w-full p-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl outline-none font-medium text-gray-800 dark:text-gray-200 focus:ring-2 focus:ring-indigo-500 disabled:opacity-50"
                >
                  <option value="en-US">English (US)</option>
                  <option value="en-GB">English (UK)</option>
                  <option value="ur-PK">Urdu (Pakistan)</option>
                  <option value="hi-IN">Hindi (India)</option>
                  <option value="ar-SA">Arabic (Saudi Arabia)</option>
                  <option value="es-ES">Spanish (Spain)</option>
                  <option value="fr-FR">French (France)</option>
                </select>
              </div>

              {error && <div className="mb-6 p-4 bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 rounded-xl font-medium text-sm text-center">{error}</div>}
            </div>

            <div className="flex flex-col items-center">
              <button
                onClick={toggleRecording}
                disabled={!!(error && error.includes('not supported'))}
                className={`w-32 h-32 rounded-full flex items-center justify-center shadow-xl transition-all transform hover:scale-105 active:scale-95 mb-6 ${
                  isRecording 
                    ? 'bg-red-500 hover:bg-red-600 animate-pulse ring-4 ring-red-300 dark:ring-red-900' 
                    : 'bg-indigo-600 hover:bg-indigo-700'
                }`}
              >
                {isRecording ? (
                  <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 10a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z"></path></svg>
                ) : (
                  <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"></path></svg>
                )}
              </button>
              <p className={`text-sm font-bold ${isRecording ? 'text-red-500' : 'text-gray-500 dark:text-gray-400'}`}>
                {isRecording ? 'Recording... Click to Stop' : 'Click to Start Recording'}
              </p>
            </div>
          </div>

          {/* Main Output Area */}
          <div className="flex-1 p-8 bg-white dark:bg-gray-800 flex flex-col h-[70vh]">
            <div className="flex justify-between items-center mb-4">
              <span className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Live Transcript</span>
              
              <div className="flex space-x-2">
                <button onClick={handleCopy} disabled={!transcript} className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg text-xs font-bold transition-colors disabled:opacity-50">
                  {copied ? 'Copied!' : 'Copy'}
                </button>
                <button onClick={handleDownloadText} disabled={!transcript} className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg text-xs font-bold transition-colors disabled:opacity-50">
                  Download
                </button>
                <button onClick={clearText} disabled={!transcript && !interimTranscript} className="px-3 py-1.5 bg-red-100 hover:bg-red-200 dark:bg-red-900/30 dark:hover:bg-red-900/50 text-red-700 dark:text-red-400 rounded-lg text-xs font-bold transition-colors disabled:opacity-50">
                  Clear
                </button>
              </div>
            </div>
            
            <div className="flex-1 w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl p-6 overflow-y-auto custom-scrollbar relative shadow-inner">
              {!transcript && !interimTranscript && !isRecording && (
                <div className="absolute inset-0 flex items-center justify-center text-gray-400 dark:text-gray-600 text-lg font-medium text-center px-4">
                  Your speech will appear here...<br/>Select language and click the microphone to start.
                </div>
              )}
              
              <div className="text-lg leading-relaxed text-gray-800 dark:text-gray-200 whitespace-pre-wrap">
                {transcript}
                <span className="text-indigo-400 dark:text-indigo-300 italic">{interimTranscript}</span>
              </div>
              
              {isRecording && (
                <div className="mt-4 flex space-x-1">
                  <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                  <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                  <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                </div>
              )}
            </div>
            
          </div>
          
        </div>
      </div>
    </div>
  );
}
