import type { ReactNode } from 'react';
import { QueryProvider } from './QueryProvider';
import { ThemeProvider } from './ThemeProvider';
import { ToastProvider } from './ToastProvider';

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <QueryProvider>
      <ThemeProvider>
        <ToastProvider>{children}</ToastProvider>
      </ThemeProvider>
    </QueryProvider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export { useTheme } from './ThemeProvider';
// eslint-disable-next-line react-refresh/only-export-components
export { useToast } from './ToastProvider';
