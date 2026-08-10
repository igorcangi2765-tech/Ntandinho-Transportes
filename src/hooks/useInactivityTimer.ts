import { useEffect, useRef } from 'react';
import { AUTH_CONFIG } from '../auth/authConfig';

interface InactivityProps {
  onTimeout: () => void;
  enabled?: boolean;
}

export const useInactivityTimer = ({ onTimeout, enabled = true }: InactivityProps) => {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const resetTimer = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    if (enabled) {
      timeoutRef.current = setTimeout(() => {
        onTimeout();
      }, AUTH_CONFIG.INACTIVITY_TIMEOUT_MS);
    }
  };

  useEffect(() => {
    if (!enabled) return;

    const events = ['mousemove', 'keydown', 'click', 'scroll', 'touchstart'];
    const handleUserActivity = () => resetTimer();

    events.forEach((ev) => window.addEventListener(ev, handleUserActivity));
    resetTimer();

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      events.forEach((ev) => window.removeEventListener(ev, handleUserActivity));
    };
  }, [enabled]);
};
