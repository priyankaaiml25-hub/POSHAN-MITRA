import React, { useState, useEffect } from 'react';
import { WifiOff, Wifi } from 'lucide-react';

export const OfflineStatusBanner: React.FC = () => {
  const [isOnline, setIsOnline] = useState<boolean>(navigator.onLine);
  const [showReconnected, setShowReconnected] = useState<boolean>(false);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setShowReconnected(true);
      setTimeout(() => setShowReconnected(false), 4000);
    };

    const handleOffline = () => {
      setIsOnline(false);
      setShowReconnected(false);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (isOnline && !showReconnected) {
    return null;
  }

  if (showReconnected) {
    return (
      <div className="bg-emerald-600 text-white text-xs px-4 py-1.5 flex items-center justify-center gap-2 transition animate-fade-in no-print">
        <Wifi className="w-3.5 h-3.5" />
        <span>Internet connection restored. Live cloud sync enabled.</span>
      </div>
    );
  }

  return (
    <div className="bg-orange-600 text-white text-xs px-4 py-2 flex items-center justify-center gap-2 shadow-md no-print">
      <WifiOff className="w-4 h-4 shrink-0" />
      <span>
        <strong>Offline Mode Active:</strong> You are currently disconnected. Educational lessons, food guides, and cached learning games remain accessible. Sensitive child health updates will sync once back online.
      </span>
    </div>
  );
};

