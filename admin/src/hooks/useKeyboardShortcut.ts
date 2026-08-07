import { useEffect } from 'react';

interface ShortcutOptions {
  key: string;
  ctrlKey?: boolean;
  metaKey?: boolean;
  shiftKey?: boolean;
  altKey?: boolean;
  action: (e: KeyboardEvent) => void;
  enabled?: boolean;
}

export function useKeyboardShortcut({
  key,
  ctrlKey = false,
  metaKey = false,
  shiftKey = false,
  altKey = false,
  action,
  enabled = true,
}: ShortcutOptions) {
  useEffect(() => {
    if (!enabled) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      const matchKey = event.key.toLowerCase() === key.toLowerCase();
      const matchCtrlOrMeta = (ctrlKey || metaKey) ? (event.ctrlKey || event.metaKey) : true;
      const matchShift = shiftKey ? event.shiftKey : true;
      const matchAlt = altKey ? event.altKey : true;

      if (matchKey && matchCtrlOrMeta && matchShift && matchAlt) {
        event.preventDefault();
        action(event);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [key, ctrlKey, metaKey, shiftKey, altKey, action, enabled]);
}
