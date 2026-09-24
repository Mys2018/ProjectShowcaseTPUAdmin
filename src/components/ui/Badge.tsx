import type { ReactNode } from 'react';

type Tone = 'neutral' | 'success' | 'warning' | 'danger' | 'info';

interface BadgeProps {
  children: ReactNode;
  tone?: Tone;
  className?: string;
}

export function Badge({ children, tone = 'neutral', className = '' }: BadgeProps) {
  return (
    <span className={`ui-badge ui-badge-${tone} ${className}`.trim()}>{children}</span>
  );
}
