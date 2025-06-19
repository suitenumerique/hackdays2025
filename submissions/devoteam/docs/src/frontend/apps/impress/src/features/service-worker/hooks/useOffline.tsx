import { useEffect } from 'react';
import { create } from 'zustand';

import { MESSAGE_TYPE } from '../conf';

interface OfflineMessageData {
  type: string;
  value: boolean;
  message: string;
}

interface IsOfflineState {
  isOffline: boolean;
  setIsOffline: (value: boolean) => void;
}

export const useIsOffline = create<IsOfflineState>((set) => ({
  isOffline: typeof navigator !== 'undefined' && !navigator.onLine,
  setIsOffline: (value: boolean) => set({ isOffline: value }),
}));

export const useOffline = () => {
  const { setIsOffline } = useIsOffline();

  useEffect(() => {
    const handleMessage = (event: MessageEvent<OfflineMessageData>) => {
      if (event.data?.type === MESSAGE_TYPE.OFFLINE) {
        setIsOffline(event.data.value);
      }
    };

    navigator.serviceWorker?.addEventListener('message', handleMessage);

    return () => {
      navigator.serviceWorker?.removeEventListener('message', handleMessage);
    };
  }, [setIsOffline]);
};
