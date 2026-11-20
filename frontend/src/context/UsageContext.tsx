'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';

interface UsageContextType {
  usageCount: number;
  maxUsage: number;
  incrementUsage: () => boolean;
  isLimitReached: boolean;
  showPaywall: boolean;
  setShowPaywall: (show: boolean) => void;
}

const UsageContext = createContext<UsageContextType | undefined>(undefined);

export const UsageProvider = ({ children }: { children: React.ReactNode }) => {
  const { data: session } = useSession();
  const [usageCount, setUsageCount] = useState(0);
  const [showPaywall, setShowPaywall] = useState(false);
  const maxUsage = 5;

  // Load usage from localStorage on mount
  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    const storedData = localStorage.getItem('tool-usage');
    
    if (storedData) {
      try {
        const parsed = JSON.parse(storedData);
        if (parsed.date === today) {
          setUsageCount(parsed.count);
        } else {
          // Reset count if it's a new day
          localStorage.setItem('tool-usage', JSON.stringify({ date: today, count: 0 }));
          setUsageCount(0);
        }
      } catch (e) {
        localStorage.setItem('tool-usage', JSON.stringify({ date: today, count: 0 }));
      }
    } else {
      localStorage.setItem('tool-usage', JSON.stringify({ date: today, count: 0 }));
    }
  }, []);

  const isProOrAdmin = session?.user && ((session.user as any).role === 'PRO' || (session.user as any).role === 'ADMIN');
  const isLimitReached = !isProOrAdmin && usageCount >= maxUsage;

  const incrementUsage = () => {
    if (isProOrAdmin) return true; // Unlimited

    if (usageCount >= maxUsage) {
      setShowPaywall(true);
      return false;
    }

    const newCount = usageCount + 1;
    setUsageCount(newCount);
    
    const today = new Date().toISOString().split('T')[0];
    localStorage.setItem('tool-usage', JSON.stringify({ date: today, count: newCount }));
    
    if (newCount >= maxUsage) {
      setShowPaywall(true);
    }
    return true;
  };

  return (
    <UsageContext.Provider
      value={{
        usageCount,
        maxUsage,
        incrementUsage,
        isLimitReached,
        showPaywall,
        setShowPaywall
      }}
    >
      {children}
    </UsageContext.Provider>
  );
};

export const useUsage = () => {
  const context = useContext(UsageContext);
  if (context === undefined) {
    throw new Error('useUsage must be used within a UsageProvider');
  }
  return context;
};
