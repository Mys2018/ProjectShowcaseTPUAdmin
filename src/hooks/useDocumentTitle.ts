import { useEffect } from 'react';

export function useDocumentTitle(title: string) {
  useEffect(() => {
    const prev = document.title;
    document.title = title ? `${title} · SHOWCASE ADMIN` : 'TPU | SHOWCASE ADMIN';
    return () => {
      document.title = prev;
    };
  }, [title]);
}
