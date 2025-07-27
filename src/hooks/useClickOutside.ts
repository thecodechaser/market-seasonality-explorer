import { useEffect } from 'react';

export const useClickOutside = (
  elementsRefs: (HTMLElement | null)[],
  handler: () => void,
  enabled: boolean = true
) => {
  useEffect(() => {
    if (!enabled) return;

    function handleClickOutside(event: MouseEvent) {
      const clickedOutside = elementsRefs.every(
        (el) => el && !el.contains(event.target as Node)
      );

      if (clickedOutside) {
        handler();
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [elementsRefs, handler, enabled]);
};
