'use client';
import { useChat } from '@ai-sdk/react';

export default function TestAI() {
  const chat = useChat();
  return (
    <pre>
      {JSON.stringify(Object.keys(chat), null, 2)}
    </pre>
  );
}
