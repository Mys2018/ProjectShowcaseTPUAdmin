import type { ReactNode } from 'react';

type Tone = 'error' | 'success' | 'info';

export function Alert({
  tone = 'info',
  children,
}: {
  tone?: Tone;
  children: ReactNode;
}) {
  return <div className={`ui-alert ui-alert-${tone}`}>{children}</div>;
}
