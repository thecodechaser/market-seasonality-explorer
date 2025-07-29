import { useEffect } from 'react';

// Handle closing elements when clicked outside
export const useClickOutside = (
  elementRefs: React.RefObject<HTMLElement>[],
  handler: () => void,
  enabled: boolean = true
) => {
  useEffect(() => {
    if (!enabled) return;

    function handleClickOutside(event: MouseEvent) {
      const clickedOutside = elementRefs.every(
        (ref) =>
          ref.current && !ref.current.contains(event.target as Node)
      );
      if (clickedOutside) {
        handler();
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [elementRefs, handler, enabled]);
};

