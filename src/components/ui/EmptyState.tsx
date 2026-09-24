import type { ReactNode } from 'react';
import { Button } from './Button';

interface EmptyStateProps {
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  children?: ReactNode;
}

export function EmptyState({
  title,
  description,
  actionLabel,
  onAction,
  children,
}: EmptyStateProps) {
  return (
    <div className="ui-empty">
      <h3>{title}</h3>
      {description ? <p>{description}</p> : null}
      {children}
      {actionLabel && onAction ? (
        <div style={{ marginTop: 16 }}>
          <Button variant="primary" onClick={onAction}>
            {actionLabel}
          </Button>
        </div>
      ) : null}
    </div>
  );
}
